import {
  Column,
  CreateCollectionOptions,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { randomUUID } from 'crypto';
import { CredentialType } from 'src/enums/credential_type.enum';

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

  @Column({ type: 'enum', enum: CredentialType, nullable: true })
  credentialType: CredentialType;
}
