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
  findAll() {
    return this.recordService.getAllRecords();
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
