// record-signature.entity.ts
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Record } from './record.entity';
import { User } from './user.entity';
import { SignatureStatus } from '../enums/signature_status.enum';

@Entity()
@Index(['record', 'signer'], { unique: true }) // Prevent duplicate signing
export class RecordSignature {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: SignatureStatus,
    default: SignatureStatus.PENDING,
  })
  status: SignatureStatus;

  @Column({ type: 'text', nullable: true })
  txHash: string | null; // The specific hash for THIS signer's action

  @CreateDateColumn()
  signedAt: Date;

  // Relation to the Record being signed
  @ManyToOne(() => Record, (record) => record.signatures, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'record_id' })
  record: Record;

  // Relation to the User who signed
  @ManyToOne(() => User, (user) => user.recordSignatures)
  @JoinColumn({ name: 'signer_id' })
  signer: User;
}
