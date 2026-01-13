import { Injectable } from '@nestjs/common';
import { Record } from 'src/entities/record.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VerificationService {
  constructor(private recordRepository: Repository<Record>) {}
}
