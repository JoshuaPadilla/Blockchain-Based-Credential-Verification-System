import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AcademicRecordService } from "./student_academic_record.service";
import { CreateStudentAcademicRecordDto } from "src/common/dto/create_academic.dto";
import { AddSubjectTakenDto } from "src/common/dto/add_subject_taken.dto";
import { Role } from "src/common/enums/user_role.enum";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";

@Roles(Role.ADMIN)
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
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
