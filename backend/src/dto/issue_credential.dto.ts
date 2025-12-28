import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { IsBigInt } from 'src/decorators/is_big_int';

export class IssueCredentialDto {
  @IsString()
  studentName: string;

  @IsString()
  degree: string;

  @IsNumber()
  gwa: number;
}
