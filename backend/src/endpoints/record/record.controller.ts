import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { RecordService } from "./record.service";
import { IssueCredentialDto } from "src/common/dto/issue_credential.dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/user_role.enum";
import { RolesGuard } from "src/common/guards/roles.guard";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RecordQuery } from "src/common/dto/queries_dto/record_query.dto";

@Roles(Role.ADMIN, Role.SIGNER)
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller("record")
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Get()
  findAll(@Query() query: RecordQuery) {
    return this.recordService.getAllRecords(query);
  }

  // @Roles(Role.SIGNER)
  // @Get("record-by-signer")
  // findRecordsForSigner(@Request() req) {
  //   return this.recordService.findRecordsForSigner(req.user.id);
  // }

  @Roles(Role.SIGNER)
  @Get("signer-records-to-sign")
  getSignerPendingRecords(@Request() req) {
    return this.recordService.getSignerRecordsToSign(req.user.id);
  }

  @Get(":recordId")
  findOne(@Param("recordId") recordId: string) {
    return this.recordService.getRecord(recordId);
  }

  @Post()
  addRecord(@Body() issueCredentialDto: IssueCredentialDto) {
    return this.recordService.addRecord(issueCredentialDto);
  }

  @Delete()
  deleteRecords() {
    return this.recordService.deleteRecords();
  }
}
