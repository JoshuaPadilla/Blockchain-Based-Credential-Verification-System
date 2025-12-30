import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RecordService } from './record.service';
import { BlockChainService } from 'src/services/blockchain/blockchain.service';
import { Record } from 'src/interfaces/record.interface';
import { IssueCredentialDto } from 'src/dto/issue_credential.dto';

@Controller('record')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Post()
  addRecord(
    @Body()
    record: IssueCredentialDto,
  ) {
    console.log('here');
    return this.recordService.addRecord(record);
  }

  @Get(':recordId')
  getRecord(@Param('recordId') recordId: string) {
    return this.recordService.getRecord(recordId);
  }
}
