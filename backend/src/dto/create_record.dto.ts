import { IsString } from 'class-validator';
import { IsBigInt } from 'src/decorators/is_big_int';

export class CreateRecordDto {
  @IsString()
  recordId: string;

  @IsString()
  dataHash: string;

  @IsBigInt()
  expiration: bigint;
}
