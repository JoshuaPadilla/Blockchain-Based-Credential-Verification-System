import { Body, Controller, Post } from '@nestjs/common';
import { AcademicRecordService } from './student_academic_record.service';
import { CreateStudentAcademicRecordDto } from 'src/dto/create_academic.dto';

@Controller('academic-record')
export class AcademicRecordController {
  constructor(private readonly academicRecordService: AcademicRecordService) {}

  @Post()
  create(
    @Body() createStudentAcademicRecordDto: CreateStudentAcademicRecordDto,
  ) {
    return this.academicRecordService.create(createStudentAcademicRecordDto);
  }
}
