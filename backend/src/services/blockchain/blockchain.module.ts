import { Module } from '@nestjs/common';
import { BlockChainService } from './blockchain.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from 'src/entities/record.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Record, User])],
  controllers: [],
  providers: [BlockChainService],
  exports: [BlockChainService],
})
export class BlockChainModule {}
