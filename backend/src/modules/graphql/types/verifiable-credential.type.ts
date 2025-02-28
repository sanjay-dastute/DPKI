import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from './user.type';
import { DID } from './did.type';

@ObjectType()
export class VerifiableCredential {
  @Field(() => ID)
  id: string;

  @Field()
  credentialId: string;

  @Field()
  issuer: string;

  @Field()
  holder: string;

  @Field(() => [String])
  type: string[];

  @Field()
  issuanceDate: Date;

  @Field({ nullable: true })
  expirationDate?: Date;

  @Field(() => String, { nullable: true })
  status?: string;

  @Field(() => String, { nullable: true })
  proof?: string;

  @Field(() => String, { nullable: true })
  schema?: string;

  @Field(() => String, { nullable: true })
  credentialDefinitionId?: string;

  @Field(() => String, { nullable: true })
  revocationRegistryId?: string;

  @Field(() => String, { nullable: true })
  credentialRevocationId?: string;

  @Field(() => String, { nullable: true })
  blockchain?: string;

  @Field(() => String, { nullable: true })
  transactionId?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
