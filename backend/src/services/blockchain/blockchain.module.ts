import { Module } from '@nestjs/common';
import { BlockChainService } from './blockchain.service';

@Module({
  imports: [],
  controllers: [],
  providers: [BlockChainService],
  exports: [BlockChainService],
})
export class BlockChainModule {}
