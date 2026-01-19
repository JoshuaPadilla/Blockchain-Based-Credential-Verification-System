import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
import { CredentialType } from 'src/enums/credential_type.enum';
import { Semester } from 'src/enums/semester.enum';

export class IssueCredentialDto {
  @IsString()
  studentId: string;

  @IsString()
  credentialTypeId: string;

  @IsEnum(Semester)
  cutOffSemester: Semester;

  @IsString()
  cutOffYear: string;
}
