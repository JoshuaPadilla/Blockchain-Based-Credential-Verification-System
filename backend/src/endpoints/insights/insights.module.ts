import { Module } from "@nestjs/common";
import { InsightsService } from "./insights.service";
import { InsightsController } from "./insights.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Record } from "src/common/entities/record.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Record])],
  controllers: [InsightsController],
  providers: [InsightsService],
})
export class InsightsModule {}
