import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "src/common/dto/create_user.dto";
import { User } from "src/common/entities/user.entity";
import { Role } from "src/common/enums/user_role.enum";
import { decrypt, encrypt } from "src/common/helpers/encryption.helper";
import { hash, isMatch } from "src/common/helpers/hash_password.helper";
import { BlockChainService } from "src/services/blockchain/blockchain.service";
import { Repository } from "typeorm";
import { UserService } from "../user/user.service";
import { use } from "react";
import { JwtService } from "@nestjs/jwt";
import { AuthJwtPayload } from "src/common/types/jwt_payload";
import refresh_jwtConfig from "src/configs/refresh_jwt.config";
import * as config from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    @Inject(refresh_jwtConfig.KEY)
    private refreshTokenConfig: config.ConfigType<typeof refresh_jwtConfig>,
  ) {}

  async register(
    createUserDto: CreateUserDto,
  ): Promise<Partial<User> | undefined> {
    return await this.userService.create(createUserDto);
  }

  async login(user: { id: string; role: Role }) {
    const payload: AuthJwtPayload = { sub: user.id, role: user.role };

    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, this.refreshTokenConfig);

    return {
      id: user.id,
      token,
      refreshToken,
      role: user.role,
    };
  }

  async refreshToken(user: { id: string; role: Role }) {
    const payload: AuthJwtPayload = { sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      id: user.id,
      token,
    };
  }
  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new UnauthorizedException("User not found");

    const passwordMatched = await isMatch(password, user.password);

    if (!passwordMatched)
      throw new UnauthorizedException("Invalid Credentials");

    return { id: user.id, role: user.role };
  }
}
