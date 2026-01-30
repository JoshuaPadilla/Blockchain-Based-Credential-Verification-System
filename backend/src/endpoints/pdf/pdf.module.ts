import { Module } from "@nestjs/common";
import { PdfService } from "./pdf.service";
import { PdfController } from "./pdf.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Student } from "src/common/entities/student.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  providers: [PdfService],
  controllers: [PdfController],
})
export class PdfModule {}
