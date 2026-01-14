import { Module } from "@nestjs/common";
import { RecordService } from "./record.service";
import { RecordController } from "./record.controller";
import { BlockChainModule } from "src/services/blockchain/blockchain.module";
import { BlockChainService } from "src/services/blockchain/blockchain.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Record } from "src/entities/record.entity";
import { Student } from "src/entities/student.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Record, Student]), BlockChainModule],
  controllers: [RecordController],
  providers: [RecordService],
})
export class RecordModule {}
