import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongoDocument } from 'mongoose';

export enum DocumentStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export enum DocumentType {
  PASSPORT = 'passport',
  NRIC = 'nric',
  BUSINESS_LICENSE = 'business_license',
  PROOF_OF_RESIDENCY = 'proof_of_residency',
  VISA = 'visa',
}

@Schema()
export class AIVerificationResult {
  @Prop({ required: true })
  verified: boolean;

  @Prop()
  confidence: number;

  @Prop({ type: Object })
  details: Record<string, any>;
}

@Schema({ timestamps: true })
export class Document extends MongoDocument {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  did: string;

  @Prop({
    type: String,
    enum: Object.values(DocumentType),
    required: true,
  })
  type: DocumentType;

  @Prop({ required: true })
  hash: string;

  @Prop()
  ipfsHash: string;

  @Prop()
  encryptionMethod: string;

  @Prop({
    type: String,
    enum: Object.values(DocumentStatus),
    default: DocumentStatus.PENDING,
  })
  status: DocumentStatus;

  @Prop({ type: AIVerificationResult })
  aiVerificationResult: AIVerificationResult;

  @Prop()
  expiresAt: Date;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
