import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "src/dto/create_user.dto";
import { User } from "src/entities/user.entity";
import { Role } from "src/enums/user_role.enum";
import { decrypt, encrypt } from "src/helpers/encryption.helper";
import { hash } from "src/helpers/hash_password.helper";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await hash(createUserDto.password);
    let encryptedPrivateKey;

    if (createUserDto.role === Role.SIGNER) {
      encryptedPrivateKey = await encrypt(createUserDto.privateKey!);
      console.log("Encrypted", encryptedPrivateKey);
      const decryptedPK = await decrypt(encryptedPrivateKey);
      console.log("Decrypted", decryptedPK);
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
}
