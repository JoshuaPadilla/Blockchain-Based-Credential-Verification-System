import { Body, Controller, Param, Patch, Post } from "@nestjs/common";
import { AcademicRecordService } from "./student_academic_record.service";
import { CreateStudentAcademicRecordDto } from "src/common/dto/create_academic.dto";
import { AddSubjectTakenDto } from "src/common/dto/add_subject_taken.dto";

@Controller("academic-record")
export class AcademicRecordController {
  constructor(private readonly academicRecordService: AcademicRecordService) {}

  @Post()
  create(
    @Body() createStudentAcademicRecordDto: CreateStudentAcademicRecordDto,
  ) {
    return this.academicRecordService.create(createStudentAcademicRecordDto);
  }

  @Patch("add-subject-taken/:id")
  addSubjectTaken(
    @Param("id") id: string,
    @Body() subjectsTakenDto: AddSubjectTakenDto,
  ) {
    return this.academicRecordService.addSubjectTaken(id, subjectsTakenDto);
  }
}
