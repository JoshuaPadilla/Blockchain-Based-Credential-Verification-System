import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
import { CredentialType } from 'src/enums/credential_type.enum';

export class IssueCredentialDto {
  @IsString()
  studentId: string;

  @IsEnum(CredentialType)
  credentialType: CredentialType;
}
