import { IsNumber, IsString } from 'class-validator';

export class SubjectGradeDto {
  @IsString()
  subjectCode: string; // e.g., "CS 101"

  @IsNumber()
  grade: number; // e.g., 1.5
}
