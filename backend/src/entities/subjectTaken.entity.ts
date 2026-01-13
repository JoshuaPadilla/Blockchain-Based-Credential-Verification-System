import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Subject } from './subject.entity';
import { StudentAcademicRecord } from './student_academic_record';

@Entity()
export class SubjectTaken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Subject)
  subject: Subject;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  grade: number;

  @ManyToOne(() => StudentAcademicRecord, (record) => record.subjectsTaken)
  academicRecord: StudentAcademicRecord;
}
