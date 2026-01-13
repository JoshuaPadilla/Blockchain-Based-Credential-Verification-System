import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Semester } from 'src/enums/semester.enum';

class SubjectGradeDto {
  @IsString()
  subjectCode: string; // e.g., "CS 101"

  @IsNumber()
  grade: number; // e.g., 1.5
}

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
