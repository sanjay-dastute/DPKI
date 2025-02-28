import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum CredentialStatus {
  ACTIVE = 'active',
  REVOKED = 'revoked',
}

@Schema()
export class Proof {
  @Prop()
  type: string;

  @Prop()
  created: Date;

  @Prop()
  proofPurpose: string;

  @Prop()
  verificationMethod: string;

  @Prop()
  proofValue: string;
}

@Schema()
export class CredentialSubject {
  @Prop()
  id: string;

  @Prop({ type: Object })
  claims: Record<string, any>;
}

@Schema({ timestamps: true })
export class VerifiableCredential {
  @Prop({ unique: true })
  id: string;

  @Prop()
  did: string;

  @Prop()
  type: string;

  @Prop()
  issuer: string;

  @Prop()
  issuanceDate: Date;

  @Prop()
  expirationDate: Date;

  @Prop({ type: () => CredentialSubject })
  credentialSubject: CredentialSubject;

  @Prop({ type: () => Proof })
  proof: Proof;

  @Prop({
    type: String,
    enum: Object.values(CredentialStatus),
    default: CredentialStatus.ACTIVE,
  })
  status: CredentialStatus;
}

export const VerifiableCredentialSchema = SchemaFactory.createForClass(VerifiableCredential);
