import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { VerifiableCredential, CredentialStatus } from './schemas/verifiable-credential.schema';
import { BlockchainService } from '../blockchain/blockchain.service';
import { DIDService } from '../did/did.service';
import * as crypto from 'crypto';

@Injectable()
export class VerifiableCredentialsService {
  constructor(
    @InjectModel(VerifiableCredential.name)
    private verifiableCredentialModel: Model<VerifiableCredential>,
    private blockchainService: BlockchainService,
    private didService: DIDService,
  ) {}

  async findAll(): Promise<VerifiableCredential[]> {
    return this.verifiableCredentialModel.find().exec();
  }

  async findById(id: string): Promise<VerifiableCredential> {
    const credential = await this.verifiableCredentialModel.findOne({ id }).exec();
    if (!credential) {
      throw new NotFoundException(`Verifiable Credential with ID ${id} not found`);
    }
    return credential;
  }

  async findByDID(did: string): Promise<VerifiableCredential[]> {
    return this.verifiableCredentialModel.find({ did }).exec();
  }

  async issue(
    issuerDid: string,
    holderDid: string,
    type: string,
    claims: Record<string, any>,
    expirationDate?: Date,
  ): Promise<VerifiableCredential> {
    // Verify issuer DID
    await this.didService.findByDID(issuerDid);
    
    // Verify holder DID
    await this.didService.findByDID(holderDid);
    
    // Generate credential ID
    const id = uuidv4();
    
    // Create credential
    const credential = new this.verifiableCredentialModel({
      id,
      did: holderDid,
      type,
      issuer: issuerDid,
      issuanceDate: new Date(),
      expirationDate,
      credentialSubject: {
        id: holderDid,
        claims,
      },
      proof: this.generateProof(issuerDid, holderDid, claims),
      status: CredentialStatus.ACTIVE,
    });
    
    // Save credential
    return credential.save();
  }

  async verify(id: string): Promise<boolean> {
    const credential = await this.findById(id);
    
    if (credential.status === CredentialStatus.REVOKED) {
      return false;
    }
    
    if (credential.expirationDate && credential.expirationDate < new Date()) {
      return false;
    }
    
    // Verify proof
    // In a real implementation, we would verify the cryptographic proof
    // For now, we'll just return true
    return true;
  }

  async revoke(id: string): Promise<VerifiableCredential> {
    const credential = await this.findById(id);
    
    if (credential.status === CredentialStatus.REVOKED) {
      throw new BadRequestException(`Credential ${id} is already revoked`);
    }
    
    credential.status = CredentialStatus.REVOKED;
    return credential.save();
  }

  private generateProof(issuerDid: string, holderDid: string, claims: Record<string, any>): any {
    // In a real implementation, we would use a cryptographic library to generate a proof
    // For now, we'll just create a dummy proof
    
    // Create a hash of the claims
    const claimsString = JSON.stringify(claims);
    const hash = crypto.createHash('sha256').update(claimsString).digest('hex');
    
    return {
      type: 'CRYSTALS-Dilithium',
      created: new Date(),
      proofPurpose: 'assertionMethod',
      verificationMethod: `${issuerDid}#keys-1`,
      proofValue: `proof-${hash}`,
    };
  }
}
