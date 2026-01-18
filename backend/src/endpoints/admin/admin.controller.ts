import { Body, Controller, Post } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { CredentialType } from "src/enums/credential_type.enum";

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  setRequiredSigners(
    @Body() body: { addresses: string[]; credentialType: CredentialType },
  ) {
    return this.adminService.setRequiredSigners(
      body.credentialType,
      body.addresses,
    );
  }
}
