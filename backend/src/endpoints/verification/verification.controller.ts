import { Controller, Get, Param } from "@nestjs/common";
import { VerificationService } from "./verification.service";

@Controller("verification")
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Get("verify/:recordId")
  verify(@Param("recordId") recordId: string) {
    console.log(`Received verification request for record ID: ${recordId}`);
    return this.verificationService.verify(recordId);
  }
}
