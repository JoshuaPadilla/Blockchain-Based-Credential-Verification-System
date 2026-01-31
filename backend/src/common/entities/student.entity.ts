import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PreviousEducation } from './previous_education.entity';
import { StudentAcademicRecord } from './student_academic_record';
import { Record } from './record.entity';
import { AcademicDistinction } from '../enums/academic_distinction.enum';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  student_id: string;

  @Column()
  firstName: string;

  @Column()
  middleName: string;

  @Column()
  lastName: string;

  @Column()
  address: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column()
  placeOfBirth: string;

  @Column()
  guardianName: string;

  @Column({ type: 'int', default: 1 })
  yearLevel: number;

  @Column()
  course: string;

  @Column({ type: 'enum', enum: AcademicDistinction, nullable: true })
  academic_distinction: AcademicDistinction;

  @Column(() => PreviousEducation, { prefix: 'elementary_' })
  elementary: PreviousEducation;

  @Column(() => PreviousEducation, { prefix: 'secondary_' })
  secondary: PreviousEducation;

  @OneToMany(
    () => StudentAcademicRecord,
    (studentAcademicRecord) => studentAcademicRecord.student,
    { cascade: true },
  )
  academicRecords: StudentAcademicRecord[];

  @OneToMany(() => Record, (record) => record.student)
  credentialsRecord: Record[];
}
