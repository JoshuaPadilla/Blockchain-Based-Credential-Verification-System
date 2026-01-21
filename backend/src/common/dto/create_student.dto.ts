import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class PreviousEducationDto {
  @IsString()
  @IsOptional() // Use Optional if it's not strictly required
  schoolName: string;

  @IsInt()
  @IsOptional()
  yearGraduated: number;
}

export class CreateStudentDto {
  @IsString()
  firstName: string;

  @IsString()
  middleName: string;

  @IsString()
  lastName: string;

  @IsString()
  address: string;

  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @IsString()
  placeOfBirth: string;

  @IsString()
  course: string;

  @IsString()
  guardianName: string;

  @IsNumber()
  yearLevel: number;

  @ValidateNested()
  @Type(() => PreviousEducationDto)
  elementary: PreviousEducationDto;

  @ValidateNested()
  @Type(() => PreviousEducationDto)
  secondary: PreviousEducationDto;
}
