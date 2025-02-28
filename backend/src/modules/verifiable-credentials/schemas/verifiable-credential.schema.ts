import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum CredentialStatus {
  ACTIVE = 'active',
  REVOKED = 'revoked',
}

@Schema()
export class Proof {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  created: Date;

  @Prop({ required: true })
  proofPurpose: string;

  @Prop({ required: true })
  verificationMethod: string;

  @Prop({ required: true })
  proofValue: string;
}

@Schema()
export class CredentialSubject {
  @Prop({ required: true })
  id: string;

  @Prop({ type: Object, required: true })
  claims: Record<string, any>;
}

@Schema({ timestamps: true })
export class VerifiableCredential extends Document {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  did: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  issuer: string;

  @Prop({ required: true })
  issuanceDate: Date;

  @Prop()
  expirationDate: Date;

  @Prop({ type: CredentialSubject, required: true })
  credentialSubject: CredentialSubject;

  @Prop({ type: Proof, required: true })
  proof: Proof;

  @Prop({
    type: String,
    enum: Object.values(CredentialStatus),
    default: CredentialStatus.ACTIVE,
  })
  status: CredentialStatus;
}

export const VerifiableCredentialSchema = SchemaFactory.createForClass(VerifiableCredential);
