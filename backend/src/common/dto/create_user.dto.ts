// create-user.dto.ts
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Role } from 'src/common/enums/user_role.enum';
import { SignerPosition } from 'src/common/enums/signer_position.enum';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional() // Middle name is often optional
  middleName?: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsEnum(Role)
  role: Role;

  // ---------------------------------------------------------
  // CONDITIONAL VALIDATION
  // This field is validated ONLY if role === Role.SIGNER
  // ---------------------------------------------------------
  // 1. Validate Position (Only if Signer)
  @IsOptional()
  @ValidateIf((o) => o.role === Role.SIGNER)
  @IsEnum(SignerPosition, {
    message: 'Signer position is required for Signers',
  })
  @IsNotEmpty()
  signerPosition?: SignerPosition;

  // 2. Validate Public Address (Only if Signer)
  @IsOptional()
  @ValidateIf((o) => o.role === Role.SIGNER)
  publicAddress?: string;

  // 3. Validate Private Key (Only if Signer)
  // WARNING: Sending private keys over HTTP is risky. Ensure you use HTTPS.
  @IsOptional()
  @ValidateIf((o) => o.role === Role.SIGNER)
  privateKey?: string;
}
