export interface VerifiableCredential {
  id: string;
  credentialId?: string;
  issuer: string;
  holder?: string;
  subject?: string;
  type: string | string[];
  issuanceDate: Date;
  expirationDate?: Date;
  status?: string;
  proof?: string;
  schema?: string;
  credentialSubject?: Record<string, any>;
  claims?: Record<string, any>;
  credentialDefinitionId?: string;
  revocationRegistryId?: string;
  credentialRevocationId?: string;
  blockchain?: string;
  transactionId?: string;
  blockchainTxHash?: string;
  zkpProof?: {
    proof: string;
    publicSignals: string[];
    protocol: string;
    curve: string;
  };
  createdAt: Date;
  updatedAt: Date;
  didId?: string;
}
