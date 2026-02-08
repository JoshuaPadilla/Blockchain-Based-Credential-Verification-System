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
import { VerificationStatus } from "src/common/enums/verification_status.enum";
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
    // 1. Parallel Fetching: Get Blockchain and DB data at the same time
    const [onChainRecord, offChainRecord] = await Promise.all([
      this.blockchainService.verify(recordId).catch(() => null), // Handle errors gracefully
      this.recordRepository.findOne({
        where: { credentialRef: recordId },
        relations: ["student", "credentialType"],
      }),
    ]);

    // 2. Basic Existence Checks
    if (!onChainRecord) {
      throw new NotFoundException(
        `Record ${recordId} not found on the Blockchain.`,
      );
    }
    if (!offChainRecord) {
      // Edge case: Exists on chain but deleted from your DB?
      throw new NotFoundException(
        "Academic record not found in system database.",
      );
    }

    // 3. Fetch Deep Relations for Hash Reconstruction
    // We do this separately to keep the initial fetch light
    const student = await this.studentRepository.findOne({
      where: { id: offChainRecord.student.id },
      relations: [
        "academicRecords",
        "academicRecords.subjectsTaken",
        "academicRecords.subjectsTaken.subject",
      ],
    });

    if (!student)
      throw new NotFoundException("Associated student profile missing.");

    // 4. Reconstruct and Verify Hash (The Core Integrity Check)
    const normalizedCredentialData = CredentialNormalizer.normalize(
      student,
      offChainRecord.credentialType.name,
      offChainRecord.cutOffYear,
      offChainRecord.cutOffSemester,
    );

    const calculatedHash = ethers.keccak256(
      ethers.toUtf8Bytes(normalizedCredentialData),
    );

    // 5. Determine Status Logic (Hierarchy of Failures)
    // We check critical failures first.
    let statuses: VerificationStatus[] = [];
    const isTampered = calculatedHash !== onChainRecord.dataHash;
    const isRevoked = onChainRecord.isRevoked;

    const isExpired =
      onChainRecord.expiration > 0 &&
      Date.now() > Number(onChainRecord.expiration);
    const isFullySigned =
      offChainRecord.credentialType.requiredSignaturesCount ===
      Number(onChainRecord.currentSignatures);

    console.log(
      offChainRecord.credentialType.requiredSignaturesCount,
      Number(onChainRecord.currentSignatures),
    );

    if (isTampered) {
      statuses.push(VerificationStatus.TAMPERED);
    }
    if (isRevoked) {
      statuses.push(VerificationStatus.REVOKED);
    }
    if (isExpired) {
      statuses.push(VerificationStatus.EXPIRED);
    }
    if (!isFullySigned) {
      statuses.push(VerificationStatus.PENDING);
    }

    // 6. Return a Rich Object (Don't just return the record!)
    return {
      statuses, // The UI uses this to pick the Green/Red/Orange card
      record: statuses.includes(VerificationStatus.TAMPERED)
        ? null
        : offChainRecord,
    };
  }
}
