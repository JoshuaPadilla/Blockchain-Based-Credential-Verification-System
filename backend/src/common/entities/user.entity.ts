// base-user.entity.ts
import { Exclude } from 'class-transformer';
import { Signer } from 'ethers';
import { SignerPosition } from 'src/common/enums/signer_position.enum';
import { Role } from 'src/common/enums/user_role.enum';
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { RecordSignature } from './record_signature.entity';

// distinct from STI: No @Entity decorator here!
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'text' })
  firstName: string;

  @Column({ type: 'text', nullable: true })
  middleName: string;

  @Column({ type: 'text' })
  lastName: string;

  @Column({ type: 'text', select: false })
  password: string;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @Column({ type: 'enum', enum: SignerPosition, nullable: true })
  signerPosition: SignerPosition;

  @Column({ type: 'text', nullable: true, unique: true })
  publicAddress: string;

  @Column({ type: 'text', nullable: true, select: false, unique: true })
  privateKey: string;

  @OneToMany(() => RecordSignature, (signature) => signature.signer)
  recordSignatures: RecordSignature[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
