import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from './user.type';

@ObjectType()
export class Document {
  @Field(() => ID)
  id: string;

  @Field()
  filename: string;

  @Field()
  owner: string;

  @Field(() => String)
  documentType: string;

  @Field(() => String, { nullable: true })
  mimeType?: string;

  @Field(() => String, { nullable: true })
  hash?: string;

  @Field(() => String, { nullable: true })
  encryptionKey?: string;

  @Field(() => String, { nullable: true })
  encryptionAlgorithm?: string;

  @Field(() => Boolean)
  isVerified: boolean;

  @Field(() => String, { nullable: true })
  verificationMethod?: string;

  @Field(() => String, { nullable: true })
  verificationResult?: string;

  @Field(() => String, { nullable: true })
  country?: string;

  @Field(() => String, { nullable: true })
  organization?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => String, { nullable: true })
  blockchain?: string;

  @Field(() => String, { nullable: true })
  transactionId?: string;
}
