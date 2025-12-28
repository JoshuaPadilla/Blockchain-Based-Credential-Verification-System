import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RecordModule } from './endpoints/record/record.module';
import { BlockChainModule } from './services/blockchain/blockchain.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // This makes the config available everywhere!
    }),
    RecordModule,
    BlockChainModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
