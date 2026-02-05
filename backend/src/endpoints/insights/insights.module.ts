import { Module } from "@nestjs/common";
import { InsightsService } from "./insights.service";
import { InsightsController } from "./insights.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Record } from "src/common/entities/record.entity";
import { RecordSignature } from "src/common/entities/record_signature.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Record, RecordSignature])],
  controllers: [InsightsController],
  providers: [InsightsService],
})
export class InsightsModule {}
