import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum DIDStatus {
  ACTIVE = 'ACTIVE',
  REVOKED = 'REVOKED',
}

@Entity('dids')
export class DID {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  did: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'text' })
  publicKey: string;

  @Column({
    type: 'enum',
    enum: DIDStatus,
    default: DIDStatus.ACTIVE,
  })
  status: DIDStatus;

  @Column()
  method: string;

  @Column()
  controller: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  expiresAt: Date;
}
