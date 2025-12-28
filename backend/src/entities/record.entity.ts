import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { randomUUID } from 'crypto';

@Entity()
export class Record {
  @PrimaryGeneratedColumn('uuid')
  id: string = randomUUID();

  @Column({ type: 'text' })
  studentName: string;

  @Column({ type: 'text' })
  degree: string;

  @Column({ type: 'float' })
  gwa: number;

  @Column({ type: 'text', nullable: true })
  txHash: string; // The 0x... hash stored in the Smart Contract

  @Column({ type: 'text' })
  dataHash: string;

  @Column({ type: 'bigint' })
  expiration: bigint; // The 0x... hash stored in the Smart Contract

  @Column({ default: false, nullable: true }) // issued, revoked, or pending
  revoked: boolean;
}
