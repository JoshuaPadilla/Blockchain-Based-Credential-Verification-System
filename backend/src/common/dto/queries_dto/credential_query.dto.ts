import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { BaseQueryDto } from './query.dto';
import { DateRangeDto } from './date_range.dto';
import { CredentialType } from 'src/common/enums/credential_type.enum';
// Import the DateRangeDto defined above

export class CredentialQueryDto extends BaseQueryDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  date?: DateRangeDto;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  revoked?: boolean;

  @IsOptional()
  @IsEnum(CredentialType)
  type?: CredentialType;
}
