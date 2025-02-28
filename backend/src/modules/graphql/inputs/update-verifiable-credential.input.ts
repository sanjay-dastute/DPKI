import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsArray, IsDateString } from 'class-validator';

@InputType()
export class UpdateVerifiableCredentialInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  issuer?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  holder?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  type?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  status?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  proof?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  revocationRegistryId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  credentialRevocationId?: string;
}
