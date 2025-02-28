import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

export enum UserRole {
  CITIZEN = 'citizen',
  TOURIST = 'tourist',
  BUSINESS = 'business',
  GOVERNMENT = 'government',
  ADMIN = 'admin',
}

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field()
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CITIZEN,
  })
  role: UserRole;

  @Field({ nullable: true })
  @Column({ nullable: true })
  country: string;

  @Field({ nullable: true })
  @Column({ nullable: true, unique: true })
  did: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  walletAddress: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
