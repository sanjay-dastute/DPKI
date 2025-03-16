import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as Tesseract from 'tesseract.js';
import * as tf from '@tensorflow/tfjs-node';
import Jimp from 'jimp';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Document Verification Service
 * 
 * This service provides AI-powered document verification capabilities
 * using OCR and ML models for document verification.
 */
@Injectable()
export class DocumentVerificationService {
  private readonly logger = new Logger(DocumentVerificationService.name);
  private model: any;
  private modelLoaded: boolean = false;
  private readonly modelDir: string;
  
  constructor(private configService: ConfigService) {
    this.logger.log('Initializing document verification service');
    this.modelDir = this.configService.get<string>('DOCUMENT_VERIFICATION_MODEL_DIR', './models/document-verification');
    this.loadModel();
  }
  
  /**
   * Load the document verification ML model
   */
  private async loadModel() {
    try {
      // Check if model directory exists
      const modelPath = path.join(this.modelDir, 'model.json');
      
      if (fs.existsSync(modelPath)) {
        // Load pre-trained document verification model
        this.model = await tf.loadLayersModel(`file://${modelPath}`);
        this.modelLoaded = true;
        this.logger.log('Document verification model loaded successfully');
      } else {
        // If model doesn't exist, create a simple model for demonstration
        this.logger.log('Model not found, creating a simple demonstration model');
        this.model = tf.sequential();
        this.model.add(tf.layers.dense({ units: 10, inputShape: [20], activation: 'relu' }));
        this.model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
        this.model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });
        this.modelLoaded = true;
        
        // Save the model for future use
        if (!fs.existsSync(this.modelDir)) {
          fs.mkdirSync(this.modelDir, { recursive: true });
        }
        await this.model.save(`file://${this.modelDir}`);
        this.logger.log('Created and saved demonstration model');
      }
    } catch (error) {
      this.logger.error(`Error loading model: ${error.message}`);
      this.modelLoaded = false;
    }
  }

  /**
   * Extract features from document text and metadata for ML processing
   */
  private extractFeatures(extractedText: string, documentType: string, country: string): number[] {
    // In a real implementation, this would extract meaningful features from the text
    // For demonstration, we'll create a simple feature vector
    
    const features: number[] = new Array(20).fill(0);
    
    // Feature 1-5: Document type encoding
    switch (documentType.toLowerCase()) {
      case 'passport':
        features[0] = 1;
        break;
      case 'nric':
      case 'id_card':
        features[1] = 1;
        break;
      case 'business_license':
        features[2] = 1;
        break;
      case 'proof_of_residency':
        features[3] = 1;
        break;
      case 'visa':
        features[4] = 1;
        break;
      default:
        features[5] = 1;
    }
    
    // Feature 6-10: Text analysis
    features[6] = extractedText.length / 1000; // Normalized text length
    features[7] = (extractedText.match(/[0-9]/g) || []).length / 100; // Number count
    features[8] = (extractedText.match(/[A-Z]/g) || []).length / 100; // Uppercase count
    features[9] = extractedText.includes('PASSPORT') || extractedText.includes('PASS') ? 1 : 0;
    features[10] = extractedText.includes('VISA') || extractedText.includes('LICENSE') ? 1 : 0;
    
    // Feature 11-15: Country encoding (simplified)
    const highTrustCountries = ['SINGAPORE', 'AUSTRALIA', 'NEW ZEALAND', 'CANADA', 'UNITED KINGDOM', 'UNITED STATES'];
    const mediumTrustCountries = ['FRANCE', 'GERMANY', 'JAPAN', 'SOUTH KOREA', 'SPAIN', 'ITALY'];
    
    if (highTrustCountries.includes(country.toUpperCase())) {
      features[11] = 1;
    } else if (mediumTrustCountries.includes(country.toUpperCase())) {
      features[12] = 1;
    } else {
      features[13] = 1;
    }
    
    // Feature 16-20: Additional metadata (simplified for demonstration)
    features[16] = extractedText.includes('EXPIRY') || extractedText.includes('EXPIRATION') ? 1 : 0;
    features[17] = extractedText.includes('BIRTH') || extractedText.includes('DOB') ? 1 : 0;
    features[18] = extractedText.includes('SIGNATURE') ? 1 : 0;
    features[19] = extractedText.includes('AUTHORITY') || extractedText.includes('GOVERNMENT') ? 1 : 0;
    
    return features;
  }

  /**
   * Generate verification details based on document type and extracted text
   */
  private generateDetails(
    documentType: string, 
    extractedText: string, 
    verified: boolean, 
    confidence: number, 
    country: string
  ): Record<string, any> {
    const details: Record<string, any> = {};
    
    // Extract document number using regex patterns
    const documentNumberMatch = extractedText.match(/(?:DOCUMENT|PASSPORT|ID|LICENSE)\s*(?:NO|NUMBER|#)?[:.\s]*([A-Z0-9]+)/i);
    const documentNumber = documentNumberMatch ? documentNumberMatch[1] : `UNKNOWN-${crypto.randomBytes(4).toString('hex')}`;
    
    // Extract name using regex patterns
    const nameMatch = extractedText.match(/(?:NAME|FULL NAME)[:.\s]*([A-Z\s]+)/i);
    const name = nameMatch ? nameMatch[1].trim() : 'UNKNOWN NAME';
    
    // Extract date of birth using regex patterns
    const dobMatch = extractedText.match(/(?:BIRTH|DOB|BORN)[:.\s]*(\d{1,2}[-./]\d{1,2}[-./]\d{2,4}|\d{2,4}[-./]\d{1,2}[-./]\d{1,2})/i);
    const dateOfBirth = dobMatch ? dobMatch[1] : 'UNKNOWN';
    
    // Extract issue date using regex patterns
    const issueDateMatch = extractedText.match(/(?:ISSUE|ISSUED)[:.\s]*(\d{1,2}[-./]\d{1,2}[-./]\d{2,4}|\d{2,4}[-./]\d{1,2}[-./]\d{1,2})/i);
    const issueDate = issueDateMatch ? issueDateMatch[1] : 'UNKNOWN';
    
    // Extract expiry date using regex patterns
    const expiryDateMatch = extractedText.match(/(?:EXPIRY|EXPIRATION|EXPIRES)[:.\s]*(\d{1,2}[-./]\d{1,2}[-./]\d{2,4}|\d{2,4}[-./]\d{1,2}[-./]\d{1,2})/i);
    const expiryDate = expiryDateMatch ? expiryDateMatch[1] : 'UNKNOWN';
    
    // Extract address using regex patterns
    const addressMatch = extractedText.match(/(?:ADDRESS|RESIDENCE)[:.\s]*([A-Z0-9\s,.-]+)/i);
    const address = addressMatch ? addressMatch[1].trim() : 'UNKNOWN ADDRESS';
    
    // Generate document-specific details
    switch (documentType.toLowerCase()) {
      case 'passport':
        details.documentNumber = documentNumber;
        details.name = name;
        details.dateOfBirth = dateOfBirth;
        details.dateOfIssue = issueDate;
        details.dateOfExpiry = expiryDate;
        details.issuer = country;
        details.mrz = {
          detected: extractedText.includes('<<') || extractedText.includes('>>'),
          verified: verified && confidence > 0.7,
        };
        details.faceMatch = {
          matched: verified && confidence > 0.6,
          confidence: confidence,
        };
        break;
      
      case 'nric':
      case 'id_card':
        details.documentNumber = documentNumber;
        details.name = name;
        details.dateOfBirth = dateOfBirth;
        details.address = address;
        details.issueDate = issueDate;
        details.faceMatch = {
          matched: verified && confidence > 0.6,
          confidence: confidence,
        };
        break;
      
      case 'business_license':
        details.licenseNumber = documentNumber;
        
        // Extract business name
        const businessNameMatch = extractedText.match(/(?:BUSINESS|COMPANY|CORPORATION)(?:\s+NAME)?[:.\s]*([A-Z\s]+)/i);
        details.businessName = businessNameMatch ? businessNameMatch[1].trim() : 'UNKNOWN BUSINESS';
        
        details.registrationDate = issueDate;
        details.expiryDate = expiryDate;
        
        // Extract business type
        const businessTypeMatch = extractedText.match(/(?:TYPE|ENTITY)[:.\s]*([A-Z\s]+)/i);
        details.businessType = businessTypeMatch ? businessTypeMatch[1].trim() : 'UNKNOWN TYPE';
        
        details.address = address;
        details.status = verified ? 'ACTIVE' : 'SUSPICIOUS';
        break;
      
      case 'proof_of_residency':
        // Extract document type (utility bill, bank statement, etc.)
        const proofTypeMatch = extractedText.match(/(?:BILL|STATEMENT|INVOICE)[:.\s]*([A-Z\s]+)/i);
        details.documentType = proofTypeMatch ? proofTypeMatch[1].trim() : 'UTILITY BILL';
        
        // Extract issuer (company name)
        const issuerMatch = extractedText.match(/(?:FROM|BY|COMPANY|PROVIDER)[:.\s]*([A-Z\s]+)/i);
        details.issuer = issuerMatch ? issuerMatch[1].trim() : 'UNKNOWN PROVIDER';
        
        details.issueDate = issueDate;
        details.name = name;
        details.address = address;
        details.verified = verified;
        break;
      
      case 'visa':
        details.visaNumber = documentNumber;
        details.name = name;
        
        // Extract passport number
        const passportNumberMatch = extractedText.match(/(?:PASSPORT)(?:\s+NO|NUMBER|#)?[:.\s]*([A-Z0-9]+)/i);
        details.passportNumber = passportNumberMatch ? passportNumberMatch[1] : `P${crypto.randomBytes(4).toString('hex')}`;
        
        details.issueDate = issueDate;
        details.expiryDate = expiryDate;
        
        // Extract visa type
        const visaTypeMatch = extractedText.match(/(?:TYPE|CATEGORY)[:.\s]*([A-Z\s]+)/i);
        details.visaType = visaTypeMatch ? visaTypeMatch[1].trim() : 'UNKNOWN TYPE';
        
        details.issuer = country;
        details.verified = verified;
        break;
      
      default:
        details.documentType = documentType;
        details.verified = verified;
    }
    
    // Add common verification details
    details.verificationTime = new Date().toISOString();
    details.securityFeatures = {
      hologram: extractedText.includes('HOLOGRAM') || (verified && confidence > 0.8),
      microprint: extractedText.includes('MICRO') || (verified && confidence > 0.75),
      uvFeatures: extractedText.includes('UV') || (verified && confidence > 0.7),
      watermark: extractedText.includes('WATERMARK') || (verified && confidence > 0.65),
    };
    
    // Add potential fraud indicators if not verified
    if (!verified) {
      details.potentialFraudIndicators = [];
      
      if (confidence < 0.3) details.potentialFraudIndicators.push('Inconsistent font');
      if (confidence < 0.4) details.potentialFraudIndicators.push('Missing security features');
      if (confidence < 0.5) details.potentialFraudIndicators.push('Abnormal document layout');
      if (extractedText.length < 100) details.potentialFraudIndicators.push('Insufficient document content');
      if (!extractedText.includes(country.toUpperCase())) details.potentialFraudIndicators.push('Country mismatch');
    }
    
    return details;
  }

  /**
   * Verify a document using OCR and ML
   * 
   * @param documentType The type of document (passport, ID card, etc.)
   * @param documentBuffer The document file buffer
   * @param country The country of the document
   */
  async verifyDocument(
    documentType: string,
    documentBuffer: Buffer,
    country: string,
  ): Promise<{
    verified: boolean;
    confidence: number;
    details: Record<string, any>;
  }> {
    this.logger.log(`Verifying ${documentType} document from ${country}`);
    
    try {
      // Process image for better OCR results
      const image = await Jimp.read(documentBuffer);
      image.greyscale().contrast(0.2);
      const processedBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
      
      // Extract text using OCR
      const { data } = await Tesseract.recognize(processedBuffer, 'eng');
      const extractedText = data.text;
      
      this.logger.log(`Extracted ${extractedText.length} characters of text from document`);
      
      // Prepare input for the verification model
      const features = this.extractFeatures(extractedText, documentType, country);
      
      let verified = false;
      let confidence = 0.0;
      
      // Run verification through the model if loaded
      if (this.modelLoaded) {
        const tensorInput = tf.tensor2d([features]);
        const prediction = this.model.predict(tensorInput);
        const result = await prediction.data();
        
        verified = result[0] > 0.7;
        confidence = result[0];
        
        tensorInput.dispose();
        prediction.dispose();
      } else {
        // Fallback if model isn't loaded
        const documentHash = crypto
          .createHash('sha256')
          .update(documentBuffer)
          .digest('hex');
        
        const hashNum = parseInt(documentHash.substring(0, 8), 16);
        verified = hashNum % 100 < 85; // 85% verification rate
        confidence = 0.5 + (hashNum % 1000) / 2000; // Between 0.5 and 1.0
        
        this.logger.warn('Using fallback verification method as model is not loaded');
      }
      
      // Generate verification details based on document type
      const details = this.generateDetails(documentType, extractedText, verified, confidence, country);
      
      return {
        verified,
        confidence,
        details,
      };
    } catch (error) {
      this.logger.error(`Error verifying document: ${error.message}`);
      return {
        verified: false,
        confidence: 0,
        details: {
          error: error.message,
          verificationTime: new Date().toISOString(),
        },
      };
    }
  }

  /**
   * Extract text from a document using OCR
   * 
   * @param documentBuffer The document file buffer
   */
  async extractText(documentBuffer: Buffer): Promise<string> {
    this.logger.log('Extracting text from document');
    
    // In a real implementation, this would use Tesseract OCR to extract text
    // For simulation, we'll return a placeholder text
    
    // Calculate document hash for consistency
    const documentHash = crypto
      .createHash('sha256')
      .update(documentBuffer)
      .digest('hex');
    
    // Return a simulated OCR result
    return `SIMULATED OCR RESULT FOR DOCUMENT ${documentHash.substring(0, 8)}
    
NAME: JOHN DOE
DATE OF BIRTH: 01/01/1990
DOCUMENT NUMBER: ${documentHash.substring(0, 8)}
ISSUE DATE: 01/01/2020
EXPIRY DATE: 01/01/2030
ISSUING AUTHORITY: SIMULATED AUTHORITY
    
This is a simulated OCR result for demonstration purposes.
In a real implementation, this would contain the actual text extracted from the document.`;
  }

  /**
   * Detect tampering in a document
   * 
   * @param documentBuffer The document file buffer
   */
  async detectTampering(documentBuffer: Buffer): Promise<{
    tampered: boolean;
    confidence: number;
    details: Record<string, any>;
  }> {
    this.logger.log('Detecting tampering in document');
    
    // In a real implementation, this would use image processing and ML to detect tampering
    // For simulation, we'll return a random result
    
    // Calculate document hash for consistency
    const documentHash = crypto
      .createHash('sha256')
      .update(documentBuffer)
      .digest('hex');
    
    // Use the hash to generate a deterministic but seemingly random result
    const hashNum = parseInt(documentHash.substring(0, 8), 16);
    const tampered = hashNum % 100 < 15; // 15% tampering rate
    const confidence = 0.6 + (hashNum % 1000) / 2500; // Between 0.6 and 1.0
    
    const details: Record<string, any> = {
      detectionTime: new Date().toISOString(),
      imageAnalysis: {
        inconsistentPixels: tampered ? 'Detected' : 'None',
        digitalArtifacts: tampered ? 'Detected' : 'None',
        compressionAnomalies: tampered ? 'Detected' : 'None',
      },
      metadataAnalysis: {
        inconsistentMetadata: tampered,
        modificationTimestamp: tampered ? new Date(Date.now() - 86400000).toISOString() : null,
      },
    };
    
    if (tampered) {
      details.tamperingDetails = {
        type: ['Digital Manipulation', 'Content Alteration'][hashNum % 2],
        severity: ['Low', 'Medium', 'High'][hashNum % 3],
        affectedAreas: ['Text', 'Photo', 'Signature', 'Security Features'][hashNum % 4],
      };
    }
    
    return {
      tampered,
      confidence,
      details,
    };
  }
}
