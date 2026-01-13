import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { RecordModule } from '../record/record.module';
import { Record } from 'src/entities/record.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Record])],
  controllers: [VerificationController],
  providers: [VerificationService],
})
export class VerificationModule {}
