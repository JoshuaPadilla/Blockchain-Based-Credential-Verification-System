import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Sign } from "crypto";
import { id } from "ethers";
import { CredentialTypeEntity } from "src/common/entities/credential_type.entity";
import { User } from "src/common/entities/user.entity";
import { CredentialType } from "src/common/enums/credential_type.enum";
import { decrypt } from "src/common/helpers/encryption.helper";
import { BlockChainService } from "src/services/blockchain/blockchain.service";
import { In, Repository } from "typeorm";

@Injectable()
export class AdminService {
  constructor(
    private readonly blockchainService: BlockChainService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(CredentialTypeEntity)
    private credentialTypeRepository: Repository<CredentialTypeEntity>,
  ) {}

  // async setRequiredSigners(
  //   credentialTypeName: CredentialType,
  //   singersIds: string[],
  // ) {
  //   const credentialType = await this.credentialTypeRepository.findOne({
  //     where: { name: credentialTypeName },
  //     relations: ["signers"],
  //   });

  //   if (!credentialType) {
  //     throw new NotFoundException("Credential Type not found");
  //   }

  //   // 2. Fetch the NEW signers only
  //   const newSignersEntities = await this.userRepository.find({
  //     where: { id: In(singersIds) },
  //   });

  //   if (newSignersEntities.length === 0) {
  //     throw new NotFoundException("Signers IDs not found");
  //   }

  //   // 3. MERGE & REMOVE DUPLICATES
  //   // We use a Map or checks to ensure we don't add the same person twice
  //   const existingSignerIds = new Set(credentialType.signers.map((s) => s.id));

  //   // Filter out any new signers that are ALREADY in the list
  //   const uniqueNewSigners = newSignersEntities.filter(
  //     (s) => !existingSignerIds.has(s.id),
  //   );

  //   // Combine them for the final list
  //   const finalSignerList = [...credentialType.signers, ...uniqueNewSigners];

  //   credentialType.signers = finalSignerList;
  //   await this.credentialTypeRepository.save(credentialType);

  //   const signerAddresses = finalSignerList.map((s) => s.publicAddress);

  //   const credentialTypeHash = id(credentialType!.id);
  //   await this.blockchainService.setRequiredSigners(
  //     credentialTypeHash,
  //     signerAddresses,
  //   );
  // }

  // async setAuthorizedSigners(address: string, allowed: boolean) {
  //   await this.blockchainService.setAuthorizedSigners(address, allowed);
  // }

  async signRecord(recordId: string, signerId: string) {
    const signer = await this.userRepository.findOne({
      where: { id: signerId },
      select: ["privateKey", "publicAddress"],
    });

    if (!signer) {
      throw new NotFoundException("No signer found");
    }

    const signerPrivateKey = await decrypt(signer.privateKey);
    await this.blockchainService.signRecord(recordId, signerPrivateKey);
  }

  async isCredentialSigner(credentialTypeId: string, signerId: string) {
    const signer = await this.userRepository.findOneBy({ id: signerId });

    if (!signer) throw new NotFoundException("Signer not found");

    const allowed = await this.blockchainService.isCredentialSigner(
      credentialTypeId,
      signer.publicAddress,
    );

    return { isSigner: allowed };
  }

  async setCredentialTypeSigner(
    credentialTypeId: string,
    signerId: string,
    allowed: boolean,
  ) {
    const signer = await this.userRepository.findOneBy({ id: signerId });

    const credentialType = await this.credentialTypeRepository.findOne({
      where: { id: credentialTypeId },
      relations: ["signers"],
    });

    if (!credentialType) {
      throw new NotFoundException("No credential type found");
    }

    if (!signer) {
      throw new NotFoundException("No Signer found");
    }

    await this.blockchainService.setCredentialTypeSigner(
      credentialType.id,
      signer.publicAddress,
      allowed,
    );

    const isSignerAlready = credentialType.signers.some(
      (s) => s.id === signer.id,
    );

    if (allowed) {
      if (isSignerAlready) {
        return;
      }

      // Only add if they aren't there yet
      credentialType.signers.push(signer);
    } else {
      credentialType.signers = credentialType.signers.filter(
        (s) => s.id !== signer.id,
      );
    }

    await this.credentialTypeRepository.save(credentialType);
  }

  async revokeRecord(recordId: string) {
    return await this.blockchainService.revokeRecord(recordId);
  }

  async restoreRecord(recordId: string) {
    return await this.blockchainService.restoreRecord(recordId);
  }
}
