import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RecordModule } from './endpoints/record/record.module';
import { BlockChainModule } from './services/blockchain/blockchain.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from './entities/record.entity';
import { PdfModule } from './endpoints/pdf/pdf.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // This makes the config available everywhere!
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '172.24.160.1',
      port: 5432,
      password: '09461674500',
      username: 'postgres',
      database: 'ThesisDB',
      synchronize: true,
      logging: true,
      entities: [Record],
    }),
    RecordModule,
    BlockChainModule,
    PdfModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
