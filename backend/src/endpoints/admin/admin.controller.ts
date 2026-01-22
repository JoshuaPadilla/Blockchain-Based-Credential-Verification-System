import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
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

  // @Post()
  // setRequiredSigners(@Body() body: SetRequiredSignersDto) {
  //   return this.adminService.setRequiredSigners(
  //     body.credentialType,
  //     body.signersIds,
  //   );
  // }

  @HttpCode(HttpStatus.OK)
  @Post("set-credential-signer")
  setAuthorizedCredentialSigner(
    @Body()
    body: {
      credentialTypeId: string;
      signerId: string;
      allowed: boolean;
    },
  ) {
    return this.adminService.setCredentialTypeSigner(
      body.credentialTypeId,
      body.signerId,
      body.allowed,
    );
  }

  @Post("sign-record")
  signRecord(@Body() body: { recordId: string; signerId: string }) {
    return this.adminService.signRecord(body.recordId, body.signerId);
  }

  @Post("is-credential-signer")
  isCredentialSigner(
    @Query() query: { credentialTypeId: string; signerId: string },
  ) {
    return this.adminService.isCredentialSigner(
      query.credentialTypeId,
      query.signerId,
    );
  }

  @Post("revoke/:recordId")
  revokeRecord(@Param("recordId") recordId: string) {
    return this.adminService.revokeRecord(recordId);
  }

  @Post("restore/:recordId")
  restoreRecord(@Param("recordId") recordId: string) {
    return this.adminService.restoreRecord(recordId);
  }
}
