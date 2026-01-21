import { Module } from "@nestjs/common";
import { RecordService } from "./record.service";
import { RecordController } from "./record.controller";
import { BlockChainModule } from "src/services/blockchain/blockchain.module";
import { BlockChainService } from "src/services/blockchain/blockchain.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Record } from "src/common/entities/record.entity";
import { Student } from "src/common/entities/student.entity";
import { CredentialTypeEntity } from "src/common/entities/credential_type.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Record, Student, CredentialTypeEntity]),
    BlockChainModule,
  ],
  controllers: [RecordController],
  providers: [RecordService],
})
export class RecordModule {}
