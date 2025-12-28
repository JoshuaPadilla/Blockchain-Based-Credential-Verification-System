import { Injectable } from '@nestjs/common';
import { CreateRecordDto } from 'src/dto/create_record.dto';
import { BlockChainService } from 'src/services/blockchain/blockchain.service';

@Injectable()
export class RecordService {
  constructor(private readonly blockchainService: BlockChainService) {}

  async addRecord(record: CreateRecordDto) {
    return this.blockchainService.addRecord(record);
  }

  async getRecord(recordId: string) {
    return this.blockchainService.getRecord(recordId);
  }
}
