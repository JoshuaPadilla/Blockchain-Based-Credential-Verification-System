import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ethers } from 'ethers';
import { IssueCredentialDto } from 'src/dto/issue_credential.dto';
import { Record } from 'src/entities/record.entity';
import { Expiration } from 'src/enums/expiration.enum';
import { getExpiration } from 'src/helpers/get_expiration.helper';
import { normalizeCredentialData } from 'src/helpers/normalize_credential_data.helper';
import { BlockChainService } from 'src/services/blockchain/blockchain.service';
import { Repository } from 'typeorm';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
    private readonly blockchainService: BlockChainService,
  ) {}

  async addRecord(credential: IssueCredentialDto) {
    const normalizeData = normalizeCredentialData(credential);

    const dataHash = await ethers.keccak256(ethers.toUtf8Bytes(normalizeData));

    const expiration = getExpiration(Expiration.THREE_MONTHS);

    const newRecord = this.recordRepository.create({
      ...credential,
      dataHash,
      expiration,
    });

    const result = await this.blockchainService.addRecord(newRecord);

    const txHash = result.hash;

    const savedRecord = await this.recordRepository.save({
      ...newRecord,
      txHash,
    });

    return savedRecord;
  }

  async getRecord(recordId: string) {
    return this.blockchainService.getRecord(recordId);
  }
}
