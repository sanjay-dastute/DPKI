import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

export enum DIDStatus {
  ACTIVE = 'active',
  REVOKED = 'revoked',
}

@ObjectType()
@Entity('dids')
export class DID {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  did: string;

  @Field()
  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Field()
  @Column({ type: 'text' })
  publicKey: string;

  @Field()
  @Column({
    type: 'enum',
    enum: DIDStatus,
    default: DIDStatus.ACTIVE,
  })
  status: DIDStatus;

  @Field()
  @Column()
  method: string;

  @Field()
  @Column()
  controller: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  expiresAt: Date;
}
