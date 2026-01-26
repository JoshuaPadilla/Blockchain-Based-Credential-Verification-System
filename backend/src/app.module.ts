import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RecordModule } from './endpoints/record/record.module';
import { BlockChainModule } from './services/blockchain/blockchain.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from './common/entities/record.entity';
import { PdfModule } from './endpoints/pdf/pdf.module';
import { SubjectModule } from './endpoints/subject/subject.module';
import { StudentModule } from './endpoints/student/student.module';
import { AcademicRecordModule } from './endpoints/student_academic_record/student_academic_record.module';
import { Subject } from './common/entities/subject.entity';
import { Student } from './common/entities/student.entity';
import { StudentAcademicRecord } from './common/entities/student_academic_record';
import { SubjectTaken } from './common/entities/subjectTaken.entity';
import { AdminModule } from './endpoints/admin/admin.module';
import { AuthModule } from './endpoints/auth/auth.module';
import { User } from './common/entities/user.entity';
import { CredentialTypeEntity } from './common/entities/credential_type.entity';
import { CredentialTypesModule } from './endpoints/credentials/credentials.module';
import { UserModule } from './endpoints/user/user.module';
import { SignerModule } from './endpoints/signer/signer.module';
import { VerificationModule } from './endpoints/verification/verification.module';
import { InsightsModule } from './endpoints/insights/insights.module';

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
        CredentialTypeEntity,
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
    CredentialTypesModule,
    UserModule,
    SignerModule,
    VerificationModule,
    InsightsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
