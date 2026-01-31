import { Optional } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';

export class StudentQuery {
  @IsOptional()
  @IsString()
  id: string;

  @Optional()
  @IsString()
  name: string;
}
