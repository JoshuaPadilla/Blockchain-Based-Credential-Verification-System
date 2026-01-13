import { Module } from '@nestjs/common';
import { AcademicRecordService } from './academic_record.service';
import { AcademicRecordController } from './academic_record.controller';

@Module({
  controllers: [AcademicRecordController],
  providers: [AcademicRecordService],
})
export class AcademicRecordModule {}
