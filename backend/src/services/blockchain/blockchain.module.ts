import { Module } from '@nestjs/common';
import { BlockChainService } from './blockchain.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from 'src/common/entities/record.entity';
import { User } from 'src/common/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Record, User])],
  controllers: [],
  providers: [BlockChainService],
  exports: [BlockChainService],
})
export class BlockChainModule {}
