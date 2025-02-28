import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class UpdateDocumentInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  filename?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  owner?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  documentType?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  hash?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  encryptionKey?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  encryptionAlgorithm?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  verificationMethod?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  verificationResult?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  country?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  organization?: string;
}
