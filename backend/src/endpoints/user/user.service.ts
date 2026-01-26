import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "src/common/dto/create_user.dto";
import { User } from "src/common/entities/user.entity";
import { Role } from "src/common/enums/user_role.enum";
import { encrypt } from "src/common/helpers/encryption.helper";
import { hash } from "src/common/helpers/hash_password.helper";
import { BlockChainService } from "src/services/blockchain/blockchain.service";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly blockchainService: BlockChainService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<Partial<User> | undefined> {
    const hashedPassword = await hash(createUserDto.password);
    let encryptedPrivateKey;

    if (createUserDto.role === Role.SIGNER) {
      encryptedPrivateKey = await encrypt(createUserDto.privateKey!);
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

  async findOne(id: string) {
    return await this.userRepository.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ["id", "email", "password", "role"],
    });
  }

  async remove(id: string) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { deleted: true };
  }
}
