import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { SetRequiredSignersDto } from "src/common/dto/set_required_signers.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/user_role.enum";

@Roles(Role.ADMIN)
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  setRequiredSigners(@Body() body: SetRequiredSignersDto) {
    return this.adminService.setRequiredSigners(
      body.credentialType,
      body.signersIds,
    );
  }

  @Post("set-authorized-signer")
  setAuthorizedSigner(@Query() query: { signerId: string; allowed: boolean }) {
    return this.adminService.setAuthorizedSigner(query.signerId, query.allowed);
  }

  @Post("sign-record")
  signRecord(@Body() body: { recordId: string; signerId: string }) {
    return this.adminService.signRecord(body.recordId, body.signerId);
  }
}
