import { Module } from '@nestjs/common';
import { BlockChainService } from './blockchain.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from 'src/common/entities/record.entity';
import { User } from 'src/common/entities/user.entity';
import { BlockChainController } from './blockchain.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Record, User])],
  controllers: [BlockChainController],
  providers: [BlockChainService],
  exports: [BlockChainService],
})
export class BlockChainModule {}
