import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Semester } from 'src/enums/semester.enum';
import { SubjectGradeDto } from './subject_grade.dto';

export class CreateStudentAcademicRecordDto {
  @IsString()
  schoolYear: string;

  @IsEnum(Semester)
  semester: Semester;

  @IsString()
  studentId: string;

  @ValidateNested({ each: true })
  @Type(() => SubjectGradeDto)
  subjectsTaken: SubjectGradeDto[];
}
