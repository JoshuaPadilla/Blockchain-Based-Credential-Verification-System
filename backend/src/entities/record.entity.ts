import {
  Column,
  CreateCollectionOptions,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { randomUUID } from 'crypto';
import { CredentialType } from 'src/enums/credential_type.enum';
import { Student } from './student.entity';
import { Semester } from 'src/enums/semester.enum';
import { CredentialTypeEntity } from './credential_type.entity';
import { User } from './user.entity';

@Entity()
export class Record {
  @PrimaryGeneratedColumn('uuid')
  id: string = randomUUID();

  @Column({ type: 'text', nullable: true })
  txHash: string; // The 0x... hash stored in the Smart Contract

  @Column({ type: 'text' })
  dataHash: string;

  @Column({ type: 'bigint' })
  expiration: bigint; // The 0x... hash stored in the Smart Contract

  @Column({ default: false, nullable: true }) // issued, revoked, or pending
  revoked: boolean;

  @Column({ type: 'text', nullable: true })
  cutOffYear: string;

  @Column({
    type: 'enum',
    enum: Semester,
    nullable: true,
  })
  cutOffSemester: Semester;

  @ManyToOne(() => CredentialTypeEntity, {
    eager: true, // Optional: Automatically loads the credential type info when you fetch a record
  })
  @JoinColumn({ name: 'credential_type_id' }) // Explicitly names the DB column
  credentialType: CredentialTypeEntity;

  @ManyToMany(() => User)
  @JoinTable({ name: 'record_signers' })
  signers: User[];

  @Column({ type: 'int', default: 0 })
  currentSignatures: number;

  @ManyToOne(() => Student, (student) => student.credentialsRecord)
  student: Student;
}
