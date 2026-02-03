import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ethers } from "ethers";
import { EMPTY_BYTES } from "src/common/constants/empty_bytes.constant";
import { IssueCredentialDto } from "src/common/dto/issue_credential.dto";
import { CredentialTypeEntity } from "src/common/entities/credential_type.entity";
import { Record } from "src/common/entities/record.entity";
import { Student } from "src/common/entities/student.entity";
import { CredentialType } from "src/common/enums/credential_type.enum";
import { Expiration } from "src/common/enums/expiration.enum";
import { CredentialNormalizer } from "src/common/helpers/data_normalizer.class";
import { getExpiration } from "src/common/helpers/get_expiration.helper";
import { generateShortCode } from "src/common/helpers/url.helper";
import { OnChainRecord } from "src/common/interfaces/onchain_record.interface";
import { BlockChainService } from "src/services/blockchain/blockchain.service";
import { Repository } from "typeorm";

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(CredentialTypeEntity)
    private credentialTypeRepository: Repository<CredentialTypeEntity>,
    private readonly blockchainService: BlockChainService,
  ) {}

  async addRecord(credentialDto: IssueCredentialDto) {
    const student = await this.studentRepository.findOne({
      where: { id: credentialDto.studentId },
      relations: [
        "academicRecords",
        "academicRecords.subjectsTaken",
        "academicRecords.subjectsTaken.subject",
      ],
    });

    const credentialType = await this.credentialTypeRepository.findOne({
      where: { id: credentialDto.credentialTypeId },
    });

    if (!student) {
      throw new NotFoundException("Credential type not found");
    }
    if (!student) {
      throw new NotFoundException("Student not found");
    }

    const credentialRef = generateShortCode();
    const normalizeData = CredentialNormalizer.normalize(
      student,
      credentialType!.name,
      credentialDto.cutOffYear,
      credentialDto.cutOffSemester,
    );

    const dataHash = ethers.keccak256(ethers.toUtf8Bytes(normalizeData));

    const expiration = getExpiration(Expiration.THREE_MONTHS);

    const newRecord = this.recordRepository.create({
      dataHash,
      expiration,
      credentialType: credentialType!,
      student: student,
      cutOffSemester: credentialDto.cutOffSemester,
      cutOffYear: credentialDto.cutOffYear,
      credentialRef,
    });

    const result = await this.blockchainService.addRecord(newRecord);

    const txHash = result.hash;

    const savedRecord = await this.recordRepository.save({
      ...newRecord,
      txHash,
    });

    return savedRecord;
  }

  async getAllRecords() {
    return this.recordRepository.find({
      relations: ["student"],
    });
  }

  async getRecord(recordId: string) {
    return this.recordRepository.findOne({
      where: { id: recordId },
      relations: ["student"],
    });
  }

  async deleteRecords() {
    return this.recordRepository.deleteAll();
  }

  async findRecordsForSigner(userId: string): Promise<Record[]> {
    return (
      this.recordRepository
        .createQueryBuilder("record")
        // 1. Join the Credential Type to access its configuration
        .innerJoinAndSelect("record.credentialType", "type")

        // 2. Join the 'signers' list defined in that Credential Type
        .innerJoin("type.signers", "allowedSigner")

        // 3. Filter: Only keep records where the current user is in that 'signers' list
        .where("allowedSigner.id = :userId", { userId })

        // Optional: Check if they haven't signed it yet (Create a "Todo" list)
        // This assumes you want to hide records they already finished signing
        // .leftJoin('record.signedBy', 'actualSigner', 'actualSigner.id = :userId', { userId })
        // .andWhere('actualSigner.id IS NULL')

        .getMany()
    );
  }

  async getSignerPendingRecords(userId: string): Promise<Record[]> {
    const pendingRecords = await this.recordRepository
      .createQueryBuilder("record")
      .innerJoinAndSelect("record.student", "student")
      // 1. Join config to check permission and limits
      .innerJoinAndSelect("record.credentialType", "type")

      // 2. Filter: User MUST be in the allowed signers list for this type
      .innerJoin(
        "type.signers",
        "allowedSigner",
        "allowedSigner.id = :userId",
        { userId },
      )

      // 3. Filter: Record MUST NOT be fully signed yet
      .where("record.currentSignatures < type.requiredSignaturesCount")

      // 4. Filter: Record MUST NOT be revoked
      .andWhere("record.revoked IS NOT TRUE")

      // 5. Anti-Join: Check if user has ALREADY signed this specific record
      .leftJoin(
        "record.signedBy",
        "alreadySigned",
        "alreadySigned.id = :userId",
        { userId },
      )
      .andWhere("alreadySigned.id IS NULL") // Keep only records where the join failed (user hasn't signed)

      .getMany();

    return pendingRecords;
  }
}
