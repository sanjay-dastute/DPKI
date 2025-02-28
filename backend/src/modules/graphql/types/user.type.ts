import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserRole } from '../../users/entities/user.entity';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field(() => String, { nullable: true })
  fullName?: string;

  @Field(() => String)
  role: UserRole;

  @Field(() => String, { nullable: true })
  country?: string;

  @Field(() => String, { nullable: true })
  organization?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => [String], { nullable: true })
  dids?: string[];

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => Boolean)
  isVerified: boolean;
}
