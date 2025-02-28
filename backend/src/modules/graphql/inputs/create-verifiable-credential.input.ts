import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsArray, IsDate, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateVerifiableCredentialInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  issuer: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  holder: string;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  type: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  schema?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  credentialDefinitionId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  blockchain?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  proof?: string;
}
