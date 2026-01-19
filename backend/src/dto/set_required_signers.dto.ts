import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  ArrayNotEmpty,
  IsUUID,
} from 'class-validator';
import { CredentialType } from 'src/enums/credential_type.enum';

export class SetRequiredSignersDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true }) // Validates every item in the array is a string
  // @IsUUID('4', { each: true }) // Use this instead of IsString if your IDs are UUIDs
  signersIds: string[];

  @IsEnum(CredentialType)
  @IsNotEmpty()
  credentialType: CredentialType;
}
