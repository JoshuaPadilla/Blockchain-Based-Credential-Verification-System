import { Module } from "@nestjs/common";
import { PdfService } from "./pdf.service";
import { PdfController } from "./pdf.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Student } from "src/common/entities/student.entity";
import { Record } from "src/common/entities/record.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Student, Record])],
  providers: [PdfService],
  controllers: [PdfController],
})
export class PdfModule {}
