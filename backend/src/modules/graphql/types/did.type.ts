import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class DID {
  @Field(() => ID)
  id: string;

  @Field()
  did: string;

  @Field()
  controller: string;

  @Field(() => String, { nullable: true })
  verificationMethod?: string;

  @Field(() => String, { nullable: true })
  publicKey?: string;

  @Field(() => String, { nullable: true })
  privateKey?: string;

  @Field(() => String, { nullable: true })
  type?: string;

  @Field(() => String, { nullable: true })
  status?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => String, { nullable: true })
  blockchain?: string;

  @Field(() => String, { nullable: true })
  transactionId?: string;
}
