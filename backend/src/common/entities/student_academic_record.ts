import { Semester } from 'src/common/enums/semester.enum';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubjectTaken } from './subjectTaken.entity';
import { Student } from './student.entity';

@Entity()
export class StudentAcademicRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  schoolYear: string;

  @Column({ type: 'enum', enum: Semester, default: Semester.FIRST })
  semester: Semester;

  @ManyToOne(() => Student, (student) => student.academicRecords)
  student: Student;

  @OneToMany(
    () => SubjectTaken,
    (subjectTaken) => subjectTaken.academicRecord,
    { cascade: true },
  )
  subjectsTaken: SubjectTaken[];
}
