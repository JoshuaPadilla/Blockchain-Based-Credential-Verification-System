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
import { SignatureStatus } from "src/common/enums/signature_status.enum";
import { CredentialNormalizer } from "src/common/helpers/data_normalizer.class";
import { getExpiration } from "src/common/helpers/get_expiration.helper";
import { generateShortCode } from "src/common/helpers/url.helper";
import { OnChainRecord } from "src/common/interfaces/onchain_record.interface";
import { BlockChainService } from "src/services/blockchain/blockchain.service";
import { Brackets, Repository } from "typeorm";

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

  // async findRecordsForSigner(userId: string): Promise<Record[]> {
  //   return (
  //     this.recordRepository
  //       .createQueryBuilder("record")
  //       // 1. Join the Credential Type to access its configuration
  //       .innerJoinAndSelect("record.credentialType", "type")

  //       // 2. Join the 'signers' list defined in that Credential Type
  //       .innerJoin("type.signers", "allowedSigner")

  //       // 3. Filter: Only keep records where the current user is in that 'signers' list
  //       .where("allowedSigner.id = :userId", { userId })

  //       // Optional: Check if they haven't signed it yet (Create a "Todo" list)
  //       // This assumes you want to hide records they already finished signing
  //       // .leftJoin('record.signedBy', 'actualSigner', 'actualSigner.id = :userId', { userId })
  //       // .andWhere('actualSigner.id IS NULL')

  //       .getMany()
  //   );
  // }

  async getSignerRecordsToSign(userId: string): Promise<Record[]> {
    const recordsToSign = await this.recordRepository
      .createQueryBuilder("record")
      .innerJoinAndSelect("record.student", "student")
      .innerJoinAndSelect("record.credentialType", "type")

      // 1. Ensure user is an allowed signer for this type
      .innerJoin(
        "type.signers",
        "allowedSigner",
        "allowedSigner.id = :userId",
        { userId },
      )

      // 2. Standard Filters
      .where("record.currentSignatures < type.requiredSignaturesCount")
      .andWhere("record.revoked IS NOT TRUE")

      // 3. The Logic Change:
      // Left join signatures specifically for THIS user
      .leftJoin(
        "record.signatures",
        "mySignature",
        "mySignature.signer.id = :userId",
        { userId },
      )

      // 4. Filter for PENDING, FAILED, or NEVER STARTED (NULL)
      // We explicitly exclude SUBMITTED (in flight) and CONFIRMED (done)
      .andWhere(
        new Brackets((qb) => {
          qb.where("mySignature.id IS NULL") // Case: User hasn't even clicked sign yet
            .orWhere("mySignature.status IN (:...statuses)", {
              statuses: [SignatureStatus.PENDING, SignatureStatus.FAILED],
            });
        }),
      )
      .getMany();

    return recordsToSign;
  }
}
