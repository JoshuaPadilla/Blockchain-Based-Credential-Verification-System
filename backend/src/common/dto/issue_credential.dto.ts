import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CredentialType } from 'src/common/enums/credential_type.enum';
import { Semester } from 'src/common/enums/semester.enum';

export class IssueCredentialDto {
  @IsString()
  studentId: string;

  @IsString()
  credentialTypeId: string;

  @IsOptional()
  @IsEnum(Semester)
  cutOffSemester: Semester;

  @IsOptional()
  @IsString()
  cutOffYear: string;
}
