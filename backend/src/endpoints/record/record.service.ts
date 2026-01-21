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

    const credentialType = await this.credentialTypeRepository.findOneBy({
      id: credentialDto.credentialTypeId,
    });

    if (!student) {
      throw new NotFoundException("Credential type not found");
    }
    if (!student) {
      throw new NotFoundException("Student not found");
    }

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
    });

    const result = await this.blockchainService.addRecord(newRecord);

    const txHash = result.hash;

    const savedRecord = await this.recordRepository.save({
      ...newRecord,
      txHash,
    });

    return savedRecord;
  }

  async verify(recordId: string) {
    const onChainRecord: OnChainRecord =
      await this.blockchainService.verify(recordId);

    const offChainRecord = await this.recordRepository.findOne({
      where: { id: recordId },
      relations: ["student", "signers"],
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

    if (
      !onChainRecord ||
      !onChainRecord.dataHash ||
      onChainRecord.dataHash === EMPTY_BYTES
    ) {
      throw new NotFoundException("Record not found on blockchain");
    }

    if (dataHash !== onChainRecord.dataHash) {
      throw new UnauthorizedException("Credentials Not Match");
    }
  }

  async getAllRecords() {
    return this.recordRepository.find({
      relations: ["student", "signers"],
    });
  }

  async deleteRecords() {
    return this.recordRepository.deleteAll();
  }
}
