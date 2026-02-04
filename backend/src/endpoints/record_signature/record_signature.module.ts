import { Module } from "@nestjs/common";
import { RecordSignatureService } from "./record_signature.service";
import { RecordSignatureController } from "./record_signature.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RecordSignature } from "src/common/entities/record_signature.entity";

@Module({
  imports: [TypeOrmModule.forFeature([RecordSignature])],
  controllers: [RecordSignatureController],
  providers: [RecordSignatureService],
})
export class RecordSignatureModule {}
