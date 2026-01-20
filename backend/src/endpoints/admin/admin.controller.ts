import { Body, Controller, Post, Query } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { CredentialType } from "src/enums/credential_type.enum";
import { SetRequiredSignersDto } from "src/dto/set_required_signers.dto";

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
  setAuthorizedSigner(@Query() query: { address: string; allowed: boolean }) {
    return this.adminService.setAuthorizedSigners(query.address, query.allowed);
  }

  @Post("sign-record")
  signRecord(@Body() body: { recordId: string; signerId: string }) {
    return this.adminService.signRecord(body.recordId, body.signerId);
  }
}
