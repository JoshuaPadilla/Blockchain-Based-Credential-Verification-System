import {
  BadRequestException,
  ForbiddenException,
  GoneException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { compareSync } from "bcrypt";
import { ethers } from "ethers";
import { EMPTY_BYTES } from "src/common/constants/empty_bytes.constant";
import { Record } from "src/common/entities/record.entity";
import { Student } from "src/common/entities/student.entity";
import { CredentialNormalizer } from "src/common/helpers/data_normalizer.class";
import { OnChainRecord } from "src/common/interfaces/onchain_record.interface";
import { BlockChainService } from "src/services/blockchain/blockchain.service";
import { Repository } from "typeorm";

@Injectable()
export class VerificationService {
  constructor(
    private readonly blockchainService: BlockChainService,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
  ) {}

  async verify(recordId: string) {
    const onChainRecord: OnChainRecord =
      await this.blockchainService.verify(recordId);

    const offChainRecord = await this.recordRepository.findOne({
      where: { credentialRef: recordId },
      relations: ["student", "signedBy"],
    });

    if (!offChainRecord || !onChainRecord) {
      throw new NotFoundException("Record not found!");
    }

    const student = await this.studentRepository.findOne({
      where: { id: offChainRecord?.student.id },
      relations: [
        "academicRecords",
        "academicRecords.subjectsTaken",
        "academicRecords.subjectsTaken.subject",
      ],
    });

    const normalizedCredentialData = CredentialNormalizer.normalize(
      student,
      offChainRecord.credentialType.name,
      offChainRecord.cutOffYear,
      offChainRecord.cutOffSemester,
    );

    const dataHash = ethers.keccak256(
      ethers.toUtf8Bytes(normalizedCredentialData),
    );

    const isTampered = dataHash !== onChainRecord.dataHash;
    const revoked = onChainRecord.isRevoked;
    const expired = Date.now() > onChainRecord.expiration;
    const isFullySigned =
      offChainRecord.credentialType.requiredSignaturesCount ===
      Number(onChainRecord.currentSignatures);

    if (isTampered) {
      throw new BadRequestException("Credentials Not Match");
    }

    if (revoked) {
      throw new ForbiddenException("Credential is revoked");
    }

    if (expired) {
      throw new GoneException("Credential has expired");
    }

    if (!isFullySigned) {
      throw new ForbiddenException("Credential is not fully signed");
    }

    return offChainRecord;
  }
}
