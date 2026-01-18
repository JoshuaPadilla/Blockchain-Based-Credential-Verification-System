// base-user.entity.ts
import { Exclude } from 'class-transformer';
import { Signer } from 'ethers';
import { SignerPosition } from 'src/enums/signer_position.enum';
import { Role } from 'src/enums/user_role.enum';
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';

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

  @Column({ type: 'text', nullable: true })
  publicAddress: string;

  @Column({ type: 'text', nullable: true, select: false })
  privateKey: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
