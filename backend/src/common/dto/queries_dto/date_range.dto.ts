import { Type } from 'class-transformer';
import { IsDate, IsDefined } from 'class-validator';

export class DateRangeDto {
  @IsDefined()
  @Type(() => Date)
  @IsDate()
  from: Date;

  @IsDefined()
  @Type(() => Date)
  @IsDate()
  to: Date;
}
