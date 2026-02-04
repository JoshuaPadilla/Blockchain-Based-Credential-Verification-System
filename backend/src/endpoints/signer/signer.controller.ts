import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { SignerService } from "./signer.service";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/user_role.enum";
import { RolesGuard } from "src/common/guards/roles.guard";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

@Roles(Role.SIGNER)
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller("signer")
export class SignerController {
  constructor(private readonly signerService: SignerService) {}

  @HttpCode(HttpStatus.OK)
  @Post("batch-sign")
  batchSign(@Body() body: { recordIds: string[] }, @Request() req) {
    return this.signerService.batchSignRecords(body.recordIds, req.user.id);
  }
}
