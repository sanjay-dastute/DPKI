import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

@InputType()
export class UpdateDIDInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  controller?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  verificationMethod?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  publicKey?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  status?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  type?: string;
}
