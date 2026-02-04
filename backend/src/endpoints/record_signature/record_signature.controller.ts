import { Controller, Get, Param } from "@nestjs/common";
import { RecordSignatureService } from "./record_signature.service";

@Controller("record-signature")
export class RecordSignatureController {
  constructor(
    private readonly recordSignatureService: RecordSignatureService,
  ) {}

  @Get()
  findAll() {
    return this.recordSignatureService.findAll();
  }
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.recordSignatureService.findOne(id);
  }
}
