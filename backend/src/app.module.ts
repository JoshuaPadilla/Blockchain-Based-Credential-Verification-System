import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RecordModule } from './endpoints/record/record.module';
import { BlockChainModule } from './services/blockchain/blockchain.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from './entities/record.entity';
import { PdfModule } from './endpoints/pdf/pdf.module';
import { SubjectModule } from './endpoints/subject/subject.module';
import { StudentModule } from './endpoints/student/student.module';
import { AcademicRecordModule } from './endpoints/student_academic_record/student_academic_record.module';
import { Subject } from './entities/subject.entity';
import { Student } from './entities/student.entity';
import { StudentAcademicRecord } from './entities/student_academic_record';
import { SubjectTaken } from './entities/subjectTaken.entity';
import { AdminModule } from './endpoints/admin/admin.module';
import { AuthModule } from './endpoints/auth/auth.module';
import { User } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // This makes the config available everywhere!
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: '09461674500',
      username: 'thesis',
      database: 'thesis_db',
      synchronize: true,
      entities: [
        Record,
        Subject,
        Student,
        StudentAcademicRecord,
        SubjectTaken,
        User,
      ],
    }),
    RecordModule,
    BlockChainModule,
    PdfModule,
    SubjectModule,
    StudentModule,
    AcademicRecordModule,
    AdminModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
