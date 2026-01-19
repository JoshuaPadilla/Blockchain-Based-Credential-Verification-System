import { Body, Controller, Post } from "@nestjs/common";
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
}
