import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ethers } from "ethers";
import { EMPTY_BYTES } from "src/constants/empty_bytes.constant";
import { IssueCredentialDto } from "src/dto/issue_credential.dto";
import { CredentialTypeEntity } from "src/entities/credential_type.entity";
import { Record } from "src/entities/record.entity";
import { Student } from "src/entities/student.entity";
import { CredentialType } from "src/enums/credential_type.enum";
import { Expiration } from "src/enums/expiration.enum";
import { CredentialNormalizer } from "src/helpers/data_normalizer.class";
import { getExpiration } from "src/helpers/get_expiration.helper";
import { OnChainRecord } from "src/interfaces/onchain_record.interface";
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

  // async verify(recordId: string) {
  //   const onChainRecord: OnChainRecord =
  //     await this.blockchainService.verify(recordId);

  //   const offChainRecord = await this.recordRepository.findOne({
  //     where: { id: recordId },
  //     relations: ["student"],
  //   });

  //   if (!offChainRecord || !onChainRecord) {
  //     throw new NotFoundException("Record not found!");
  //   }

  //   const student = await this.studentRepository.findOne({
  //     where: { id: offChainRecord?.student.id },
  //     relations: [
  //       "academicRecords",
  //       "academicRecords.subjectsTaken",
  //       "academicRecords.subjectsTaken.subject",
  //     ],
  //   });

  //   const normalizedCredentialData = CredentialNormalizer.normalize(
  //     student,
  //     offChainRecord?.credentialType,
  //     offChainRecord.cutOffYear,
  //     offChainRecord.cutOffSemester,
  //   );

  //   const dataHash = ethers.keccak256(
  //     ethers.toUtf8Bytes(normalizedCredentialData),
  //   );

  //   if (
  //     !onChainRecord ||
  //     !onChainRecord.dataHash ||
  //     onChainRecord.dataHash === EMPTY_BYTES
  //   ) {
  //     throw new NotFoundException("Record not found on blockchain");
  //   }
  // }

  async getAllRecords() {
    return this.recordRepository.find({
      relations: ["student"],
    });
  }

  async deleteRecords() {
    return this.recordRepository.clear();
  }
}
