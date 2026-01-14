import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ethers } from "ethers";
import { EMPTY_BYTES } from "src/constants/empty_bytes.constant";
import { IssueCredentialDto } from "src/dto/issue_credential.dto";
import { Record } from "src/entities/record.entity";
import { Student } from "src/entities/student.entity";
import { CredentialType } from "src/enums/credential_type.enum";
import { Expiration } from "src/enums/expiration.enum";
import { getExpiration } from "src/helpers/get_expiration.helper";
import { normalizedData } from "src/helpers/normalize_credential_data.helper";
import { BlockChainService } from "src/services/blockchain/blockchain.service";
import { Repository } from "typeorm";

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
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

    if (!student) {
      throw new NotFoundException("Student not found");
    }

    const normalizeData = normalizedData(student, credentialDto.credentialType);

    const dataHash = ethers.keccak256(ethers.toUtf8Bytes(normalizeData));

    const expiration = getExpiration(Expiration.THREE_MONTHS);

    const newRecord = this.recordRepository.create({
      dataHash,
      expiration,
    });

    const result = await this.blockchainService.addRecord(newRecord);

    const txHash = result.hash;

    const savedRecord = await this.recordRepository.save({
      ...newRecord,
      txHash,
      credentialType: credentialDto.credentialType,
    });

    return savedRecord;
  }

  async verify(recordId: string) {
    const onChainRecord = await this.blockchainService.getRecord(recordId);

    if (
      !onChainRecord ||
      !onChainRecord.dataHash ||
      onChainRecord.dataHash === EMPTY_BYTES
    ) {
      throw new NotFoundException("Record not found on blockchain");
    }
  }

  async getAllRecords() {
    return this.recordRepository.find();
  }

  async deleteRecords() {
    return this.recordRepository.clear();
  }
}
