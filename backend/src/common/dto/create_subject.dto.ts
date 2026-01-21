import { IsNumber, IsString } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  code: string;

  @IsString()
  description: string;

  @IsNumber()
  units: number;
}
