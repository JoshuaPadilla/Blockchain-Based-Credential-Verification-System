// pagination.dto.ts
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, IsString } from 'class-validator';
// ... imports from before

export class BaseQueryDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit: number = 5;

  @IsOptional()
  @IsString()
  search?: string;
}
