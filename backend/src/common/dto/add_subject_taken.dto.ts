import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { SubjectGradeDto } from './subject_grade.dto';

export class AddSubjectTakenDto {
  @ValidateNested({ each: true })
  @Type(() => SubjectGradeDto)
  subjectsTaken: SubjectGradeDto[];
}
