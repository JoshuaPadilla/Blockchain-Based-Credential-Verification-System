import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "src/dto/create_user.dto";
import { User } from "src/entities/user.entity";
import { Role } from "src/enums/user_role.enum";
import { decrypt, encrypt } from "src/helpers/encryption.helper";
import { hash } from "src/helpers/hash_password.helper";
import { BlockChainService } from "src/services/blockchain/blockchain.service";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly blockchainService: BlockChainService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await hash(createUserDto.password);
    let encryptedPrivateKey;

    if (createUserDto.role === Role.SIGNER) {
      encryptedPrivateKey = await encrypt(createUserDto.privateKey!);

      await this.blockchainService.setAuthorizedSigners(
        createUserDto.publicAddress!,
        true,
      );
    }

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      privateKey: encryptedPrivateKey,
    });

    const savedUser = await this.userRepository.save(newUser);
    const { privateKey, password, ...rest } = savedUser;

    return rest;
  }

  async deleteAll() {
    await this.userRepository.deleteAll();
  }

  async findAll() {
    return this.userRepository.find();
  }

  async remove(id: string) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { deleted: true };
  }
}
