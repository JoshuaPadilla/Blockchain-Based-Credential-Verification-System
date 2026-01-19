import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateCredentialTypeDto } from "src/dto/create_credential_type.dto";
import { CredentialTypeEntity } from "src/entities/credential_type.entity";
import { User } from "src/entities/user.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class CredentialTypesService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(CredentialTypeEntity)
    private credentialRepository: Repository<CredentialTypeEntity>,
  ) {}

  async createCreadentialType(createCredentialDto: CreateCredentialTypeDto) {
    const existing = await this.credentialRepository.findOne({
      where: { name: createCredentialDto.name },
    });
    if (existing) {
      throw new ConflictException(
        `Configuration for ${createCredentialDto.name} already exists.`,
      );
    }

    const signersObject = await this.userRepository.find({
      where: { id: In(createCredentialDto.signerIds) },
    });

    const newCredentialType = this.credentialRepository.create({
      ...createCredentialDto,
      signers: signersObject,
    });

    return this.credentialRepository.save(newCredentialType);
  }

  async findAll() {
    return this.credentialRepository.find({
      relations: ["signers"], // Load the signers data
      order: { name: "ASC" },
    });
  }

  async findOne(id: string) {
    const credentialType = await this.credentialRepository.findOne({
      where: { id },
      relations: ["signers"],
    });

    if (!credentialType)
      throw new NotFoundException(`Credential Type with ID ${id} not found`);
    return credentialType;
  }

  async findByName(name: any) {
    return this.credentialRepository.findOne({
      where: { name },
      relations: ["signers"],
    });
  }

  async update(id: string, dto: Partial<CreateCredentialTypeDto>) {
    const credentialType = await this.findOne(id); // Ensure it exists

    // Update basic fields
    if (dto.requiredSignaturesCount) {
      credentialType.requiredSignaturesCount = dto.requiredSignaturesCount;
    }

    // Update Signers if provided
    if (dto.signerIds) {
      credentialType.signers = dto.signerIds.map(
        (signerId) => ({ id: signerId }) as any,
      );
    }

    return this.credentialRepository.save(credentialType);
  }

  async remove(id: string) {
    const result = await this.credentialRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Credential Type with ID ${id} not found`);
    }
    return { deleted: true };
  }
}
