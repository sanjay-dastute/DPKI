import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class CreateDocumentInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  filename: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  type: string;
  
  @Field()
  @IsNotEmpty()
  @IsString()
  did: string;
  
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  content?: string;

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
  country?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  organization?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  blockchain?: string;
}
