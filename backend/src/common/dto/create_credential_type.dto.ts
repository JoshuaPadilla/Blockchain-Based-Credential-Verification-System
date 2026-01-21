import {
  IsArray,
  IsEnum,
  IsInt,
  IsUUID,
  Min,
  ArrayNotEmpty,
  IsOptional,
} from 'class-validator';
import { CredentialType } from 'src/common/enums/credential_type.enum';

export class CreateCredentialTypeDto {
  @IsEnum(CredentialType)
  name: CredentialType;

  @IsOptional()
  @IsInt()
  requiredSignaturesCount: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('loose', { each: true }) // Validates that every string in the array is a UUID
  signerIds: string[];
}
