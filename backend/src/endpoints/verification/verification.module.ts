import { Module } from "@nestjs/common";
import { VerificationService } from "./verification.service";
import { VerificationController } from "./verification.controller";
import { RecordModule } from "../record/record.module";
import { Record } from "src/common/entities/record.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlockChainService } from "src/services/blockchain/blockchain.service";
import { BlockChainModule } from "src/services/blockchain/blockchain.module";
import { Student } from "src/common/entities/student.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Record, Student]), BlockChainModule],
  controllers: [VerificationController],
  providers: [VerificationService],
})
export class VerificationModule {}
