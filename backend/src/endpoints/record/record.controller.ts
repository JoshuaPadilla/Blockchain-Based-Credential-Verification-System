import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { RecordService } from "./record.service";
import { BlockChainService } from "src/services/blockchain/blockchain.service";
import { Record } from "src/interfaces/record.interface";
import { IssueCredentialDto } from "src/dto/issue_credential.dto";

@Controller("record")
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Get()
  getAllRecords() {
    return this.recordService.getAllRecords();
  }

  @Post()
  addRecord(@Body() issueCredentialDto: IssueCredentialDto) {
    return this.recordService.addRecord(issueCredentialDto);
  }

  // @Get(":recordId")
  // getRecord(@Param("recordId") recordId: string) {
  //   return this.recordService.verify(recordId);
  // }

  @Delete()
  deleteRecords() {
    return this.recordService.deleteRecords();
  }
}
