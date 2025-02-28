import { Injectable, Logger } from '@nestjs/common';
import { DocumentVerificationService } from './services/document-verification.service';
import { AnomalyDetectionService } from './services/anomaly-detection.service';
import { ZeroKnowledgeProofService } from './services/zero-knowledge-proof.service';

/**
 * AI Service
 * 
 * This service provides a unified interface to the AI capabilities of the system.
 */
@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  
  constructor(
    private documentVerificationService: DocumentVerificationService,
    private anomalyDetectionService: AnomalyDetectionService,
    private zkpService: ZeroKnowledgeProofService,
  ) {
    this.logger.log('Initializing AI service');
  }

  /**
   * Verify a document
   */
  async verifyDocument(
    documentType: string,
    documentBuffer: Buffer,
    country: string,
  ) {
    return this.documentVerificationService.verifyDocument(
      documentType,
      documentBuffer,
      country,
    );
  }

  /**
   * Extract text from a document
   */
  async extractTextFromDocument(documentBuffer: Buffer) {
    return this.documentVerificationService.extractText(documentBuffer);
  }

  /**
   * Detect tampering in a document
   */
  async detectDocumentTampering(documentBuffer: Buffer) {
    return this.documentVerificationService.detectTampering(documentBuffer);
  }

  /**
   * Detect behavioral anomalies
   */
  async detectBehavioralAnomalies(
    userId: string,
    action: string,
    context: Record<string, any>,
  ) {
    return this.anomalyDetectionService.detectBehavioralAnomalies(
      userId,
      action,
      context,
    );
  }

  /**
   * Detect credential anomalies
   */
  async detectCredentialAnomalies(
    credentialId: string,
    presenterId: string,
    verifierId: string,
    context: Record<string, any>,
  ) {
    return this.anomalyDetectionService.detectCredentialAnomalies(
      credentialId,
      presenterId,
      verifierId,
      context,
    );
  }

  /**
   * Detect blockchain anomalies
   */
  async detectBlockchainAnomalies(
    transactionType: string,
    transactionData: Record<string, any>,
    context: Record<string, any>,
  ) {
    return this.anomalyDetectionService.detectBlockchainAnomalies(
      transactionType,
      transactionData,
      context,
    );
  }

  /**
   * Generate a fraud risk assessment
   */
  async generateFraudRiskAssessment(
    userId: string,
    userProfile: Record<string, any>,
    activityHistory: Array<Record<string, any>>,
  ) {
    return this.anomalyDetectionService.generateFraudRiskAssessment(
      userId,
      userProfile,
      activityHistory,
    );
  }

  /**
   * Generate a proof that a user is over a certain age
   */
  async proveAgeOver(
    dateOfBirth: Date,
    minimumAge: number,
  ) {
    return this.zkpService.proveAgeOver(
      dateOfBirth,
      minimumAge,
    );
  }

  /**
   * Generate a proof that a user's income is over a certain threshold
   */
  async proveIncomeOver(
    income: number,
    minimumIncome: number,
  ) {
    return this.zkpService.proveIncomeOver(
      income,
      minimumIncome,
    );
  }

  /**
   * Generate a proof that a user is a resident of a specific region
   */
  async proveResidency(
    address: Record<string, string>,
    region: string,
  ) {
    return this.zkpService.proveResidency(
      address,
      region,
    );
  }

  /**
   * Verify a zero-knowledge proof
   */
  async verifyProof(
    proof: string,
    publicInputs: Record<string, any>,
    proofType: string,
  ) {
    return this.zkpService.verifyProof(
      proof,
      publicInputs,
      proofType,
    );
  }

  /**
   * Generate a proof that a credential is valid
   */
  async proveCredentialValidity(
    credential: Record<string, any>,
    issuerPublicKey: string,
  ) {
    return this.zkpService.proveCredentialValidity(
      credential,
      issuerPublicKey,
    );
  }
}
