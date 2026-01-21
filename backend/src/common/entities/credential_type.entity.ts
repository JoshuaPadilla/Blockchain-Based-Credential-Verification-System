import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity'; // Adjust path to your User entity
import { CredentialType } from 'src/common/enums/credential_type.enum';
import { Record } from './record.entity';

@Entity()
export class CredentialTypeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // The actual type (e.g., DIPLOMA, TRANSCRIPT)
  @Column({
    type: 'enum',
    enum: CredentialType,
    unique: true, // Ensures you only have one config per type
  })
  name: CredentialType;

  // How many signatures are required? (e.g., 2 out of 3 signers)
  @Column({ type: 'int', default: 0 })
  requiredSignaturesCount: number;

  // The list of specific people allowed to sign
  @ManyToMany(() => User)
  @JoinTable({
    name: 'credential_type_signers', // Creates a clean join table name
    joinColumn: {
      name: 'credential_type_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'signer_id',
      referencedColumnName: 'id',
    },
  })
  signers: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
