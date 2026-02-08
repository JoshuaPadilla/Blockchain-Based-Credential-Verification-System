import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateCredentialTypeDto } from "src/common/dto/create_credential_type.dto";
import { CredentialTypeEntity } from "src/common/entities/credential_type.entity";
import { User } from "src/common/entities/user.entity";
import { BlockChainService } from "src/services/blockchain/blockchain.service";
import { In, Repository } from "typeorm";

@Injectable()
export class CredentialTypesService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(CredentialTypeEntity)
    private credentialRepository: Repository<CredentialTypeEntity>,
    private blockchainService: BlockChainService,
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

    const signersAddresses = signersObject.map((s) => s.publicAddress);

    const savedCredentialType =
      await this.credentialRepository.save(newCredentialType);

    const tx = await this.blockchainService.addNewCredentialType(
      savedCredentialType.id,
      signersAddresses,
      signersAddresses.length,
    );

    const receipt = tx.wait();

    if (receipt.status === 1) {
      return savedCredentialType;
    } else {
      throw new BadRequestException("Failed syncing credential type onchain");
    }
  }

  async findAll(term?: string): Promise<CredentialTypeEntity[]> {
    const query = this.credentialRepository.createQueryBuilder("cred");

    // 1. Join relation (equivalent to relations: ['signers'])
    query.leftJoinAndSelect("cred.signers", "signer");

    // 2. Handle the ENUM search
    if (term) {
      // THE FIX: "cred.name::text" casts the Enum to a string so ILIKE works
      query.where("cred.name::text ILIKE :search", {
        search: `%${term}%`,
      });
    }

    // 3. Sort by the Enum value (Alphabetical)
    query.orderBy("cred.name", "ASC");

    return query.getMany();
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

  async removeSigners(credentialTypeId: string, signersId: string) {
    const credential = await this.credentialRepository.findOne({
      where: { id: credentialTypeId },
      relations: ["signers"],
    });

    if (!credential) throw new NotFoundException("No credential found");

    const filteredSigners = credential.signers.filter(
      (s) => signersId !== s.id,
    );

    const updatedCredentialType = await this.credentialRepository.save({
      ...credential,
      signers: filteredSigners,
    });

    return updatedCredentialType;
  }
}
