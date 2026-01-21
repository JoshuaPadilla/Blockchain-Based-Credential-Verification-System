import { Module } from "@nestjs/common";
import { AcademicRecordService } from "./student_academic_record.service";
import { AcademicRecordController } from "./student_academic_record.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StudentAcademicRecord } from "src/common/entities/student_academic_record";
import { Student } from "src/common/entities/student.entity";
import { Subject } from "src/common/entities/subject.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentAcademicRecord, Student, Subject]),
  ],
  controllers: [AcademicRecordController],
  providers: [AcademicRecordService],
})
export class AcademicRecordModule {}
