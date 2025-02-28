import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

@InputType()
export class CreateDIDInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  controller: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  type?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  publicKey?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  privateKey?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  blockchain?: string;
}
