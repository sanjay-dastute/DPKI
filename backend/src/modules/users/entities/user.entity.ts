import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  INDIVIDUAL = 'INDIVIDUAL',
  TOURIST = 'TOURIST',
  BUSINESS = 'BUSINESS',
  GOVERNMENT = 'GOVERNMENT',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.INDIVIDUAL,
  })
  role: UserRole;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true, unique: true })
  did: string;

  @Column({ nullable: true })
  walletAddress: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: 'pending', enum: ['pending', 'approved', 'disapproved'] })
  approvalStatus: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
