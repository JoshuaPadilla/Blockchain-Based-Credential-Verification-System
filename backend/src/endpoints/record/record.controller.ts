import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { RecordService } from "./record.service";
import { BlockChainService } from "src/services/blockchain/blockchain.service";
import { Record } from "src/common/interfaces/record.interface";
import { IssueCredentialDto } from "src/common/dto/issue_credential.dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/user_role.enum";
import { RolesGuard } from "src/common/guards/roles.guard";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

@Roles(Role.ADMIN)
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
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

  @Get(":recordId")
  getRecord(@Param("recordId") recordId: string) {
    return this.recordService.verify(recordId);
  }

  @Delete()
  deleteRecords() {
    return this.recordService.deleteRecords();
  }
}
