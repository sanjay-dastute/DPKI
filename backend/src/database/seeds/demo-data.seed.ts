import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../modules/users/schemas/user.schema';
import { DID } from '../../modules/did/schemas/did.schema';
import { Document } from '../../modules/documents/schemas/document.schema';
import { VerifiableCredential } from '../../modules/verifiable-credentials/schemas/verifiable-credential.schema';
import { DIDService } from '../../modules/did/did.service';
import { VerifiableCredentialsService } from '../../modules/verifiable-credentials/verifiable-credentials.service';
import { DocumentsService } from '../../modules/documents/documents.service';
import { BlockchainService } from '../../modules/blockchain/blockchain.service';
import { IPFSService } from '../../modules/documents/services/ipfs.service';
import { EncryptionService } from '../../modules/documents/services/encryption.service';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';

@Injectable()
export class DemoDataSeeder {
  private readonly logger = new Logger(DemoDataSeeder.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(DID.name) private didModel: Model<DID>,
    @InjectModel(Document.name) private documentModel: Model<Document>,
    @InjectModel(VerifiableCredential.name) private vcModel: Model<VerifiableCredential>,
    private didService: DIDService,
    private verifiableCredentialsService: VerifiableCredentialsService,
    private documentsService: DocumentsService,
    private blockchainService: BlockchainService,
    private ipfsService: IPFSService,
    private encryptionService: EncryptionService,
  ) {}

  async seed() {
    this.logger.log('Starting demo data seeding...');
    
    // Clear existing data
    await this.clearExistingData();
    
    // Create demo users
    const users = await this.createDemoUsers();
    
    // Create demo DIDs
    const dids = await this.createDemoDIDs(users);
    
    // Create demo credentials
    await this.createDemoCredentials(dids, users);
    
    // Create demo documents
    await this.createDemoDocuments(users);
    
    this.logger.log('Demo data seeding completed successfully!');
  }

  async clearExistingData() {
    this.logger.log('Clearing existing demo data...');
    await this.userModel.deleteMany({ email: { $regex: /^demo/ } });
    await this.didModel.deleteMany({ name: { $regex: /^Demo/ } });
    await this.vcModel.deleteMany({ type: { $in: ['DemoCredential'] } });
    await this.documentModel.deleteMany({ name: { $regex: /^Demo/ } });
  }

  async createDemoUsers() {
    this.logger.log('Creating demo users...');
    
    const demoUsers = [
      {
        username: 'demo_individual',
        email: 'demo_individual@example.com',
        password: await bcrypt.hash('Password123!', 10),
        role: 'individual',
        country: 'Singapore',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+6512345678',
      },
      {
        username: 'demo_business',
        email: 'demo_business@example.com',
        password: await bcrypt.hash('Password123!', 10),
        role: 'business',
        country: 'Singapore',
        firstName: 'Jane',
        lastName: 'Smith',
        phoneNumber: '+6587654321',
        businessName: 'Demo Corp Pte Ltd',
        businessRegistrationNumber: 'UEN202312345R',
      },
      {
        username: 'demo_government',
        email: 'demo_government@example.com',
        password: await bcrypt.hash('Password123!', 10),
        role: 'government',
        country: 'Singapore',
        firstName: 'Admin',
        lastName: 'User',
        phoneNumber: '+6590001111',
        department: 'Ministry of Digital Development',
        employeeId: 'GOV-12345',
      },
      {
        username: 'demo_tourist',
        email: 'demo_tourist@example.com',
        password: await bcrypt.hash('Password123!', 10),
        role: 'tourist',
        country: 'Saudi Arabia',
        firstName: 'Mohammed',
        lastName: 'Al-Farsi',
        phoneNumber: '+966501234567',
        passportNumber: 'SA12345678',
        visaNumber: 'V123456789SG',
      },
    ];

    const createdUsers = [];
    for (const userData of demoUsers) {
      const existingUser = await this.userModel.findOne({ email: userData.email });
      if (existingUser) {
        createdUsers.push(existingUser);
      } else {
        const newUser = new this.userModel(userData);
        await newUser.save();
        createdUsers.push(newUser);
      }
    }
    
    this.logger.log(`Created ${createdUsers.length} demo users`);
    return createdUsers;
  }

  async createDemoDIDs(users) {
    this.logger.log('Creating demo DIDs...');
    
    const didMethods = ['ethereum', 'indy', 'fabric'];
    const blockchains = ['ethereum', 'hyperledger-indy', 'hyperledger-fabric'];
    
    const createdDIDs = [];
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const methodIndex = i % didMethods.length;
      
      // Create one DID for each user
      const didData = {
        name: `Demo ${didMethods[methodIndex]} DID for ${user.username}`,
        description: `A demo DID created for demonstration purposes using ${didMethods[methodIndex]}`,
        method: didMethods[methodIndex],
        controller: user._id,
        blockchain: blockchains[methodIndex],
        network: didMethods[methodIndex] === 'ethereum' ? 'sepolia' : 'testnet',
        country: user.country,
        did: `did:${didMethods[methodIndex]}:${this.generateRandomHex(32)}`,
        verkey: this.generateRandomHex(32),
        alias: `demo-${user.username}-${didMethods[methodIndex]}`,
        blockchainTxHash: `0x${this.generateRandomHex(64)}`,
        transactionId: `0x${this.generateRandomHex(64)}`,
      };
      
      const existingDID = await this.didModel.findOne({ 
        controller: user._id, 
        method: didMethods[methodIndex] 
      });
      
      if (existingDID) {
        createdDIDs.push(existingDID);
      } else {
        const newDID = new this.didModel(didData);
        await newDID.save();
        createdDIDs.push(newDID);
      }
    }
    
    this.logger.log(`Created ${createdDIDs.length} demo DIDs`);
    return createdDIDs;
  }

  async createDemoCredentials(dids, users) {
    this.logger.log('Creating demo credentials...');
    
    const credentialTypes = [
      'IdentityCredential',
      'EducationCredential',
      'EmploymentCredential',
      'VisaCredential',
    ];
    
    const createdCredentials = [];
    
    // Government user issues credentials to other users
    const issuerDID = dids.find(did => did.controller.toString() === users[2]._id.toString());
    
    for (let i = 0; i < users.length; i++) {
      if (i === 2) continue; // Skip government user (issuer)
      
      const user = users[i];
      const holderDID = dids.find(did => did.controller.toString() === user._id.toString());
      
      // Create a credential for each user
      const credentialType = credentialTypes[i % credentialTypes.length];
      
      let credentialSubject;
      switch (credentialType) {
        case 'IdentityCredential':
          credentialSubject = {
            name: `${user.firstName} ${user.lastName}`,
            dateOfBirth: '1990-01-01',
            nationality: user.country,
            idNumber: `ID${this.generateRandomHex(8)}`,
          };
          break;
        case 'EducationCredential':
          credentialSubject = {
            name: `${user.firstName} ${user.lastName}`,
            institution: 'National University of Singapore',
            degree: 'Bachelor of Science in Computer Science',
            graduationDate: '2020-05-15',
            gpa: '3.8',
          };
          break;
        case 'EmploymentCredential':
          credentialSubject = {
            name: `${user.firstName} ${user.lastName}`,
            employer: 'Tech Innovations Pte Ltd',
            position: 'Senior Software Engineer',
            startDate: '2020-06-01',
            employeeId: `EMP${this.generateRandomHex(6)}`,
          };
          break;
        case 'VisaCredential':
          credentialSubject = {
            name: `${user.firstName} ${user.lastName}`,
            passportNumber: user.passportNumber || `P${this.generateRandomHex(8)}`,
            visaType: 'Tourist',
            issueDate: '2023-01-01',
            expiryDate: '2024-01-01',
            permitNumber: `V${this.generateRandomHex(8)}`,
          };
          break;
      }
      
      const credentialData = {
        type: ['VerifiableCredential', credentialType],
        issuer: issuerDID.did,
        holder: holderDID.did,
        subject: holderDID.did,
        issuanceDate: new Date(),
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        credentialSubject,
        claims: credentialSubject,
        status: 'active',
        blockchain: issuerDID.blockchain,
        blockchainTxHash: `0x${this.generateRandomHex(64)}`,
        transactionId: `0x${this.generateRandomHex(64)}`,
        zkpProof: {
          proof: `0x${this.generateRandomHex(128)}`,
          publicSignals: [`0x${this.generateRandomHex(64)}`],
          protocol: 'groth16',
          curve: 'bn128',
        },
        didId: issuerDID._id,
      };
      
      const existingCredential = await this.vcModel.findOne({
        issuer: issuerDID.did,
        holder: holderDID.did,
        'type.1': credentialType,
      });
      
      if (existingCredential) {
        createdCredentials.push(existingCredential);
      } else {
        const newCredential = new this.vcModel(credentialData);
        await newCredential.save();
        createdCredentials.push(newCredential);
      }
    }
    
    this.logger.log(`Created ${createdCredentials.length} demo credentials`);
    return createdCredentials;
  }

  async createDemoDocuments(users) {
    this.logger.log('Creating demo documents...');
    
    const documentTypes = [
      'passport',
      'national_id',
      'driver_license',
      'business_registration',
      'visa',
    ];
    
    const countries = ['Singapore', 'Saudi Arabia', 'Malaysia', 'Indonesia', 'Thailand'];
    
    const createdDocuments = [];
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      
      // Create 2 documents for each user
      for (let j = 0; j < 2; j++) {
        const docTypeIndex = (i + j) % documentTypes.length;
        const documentType = documentTypes[docTypeIndex];
        const country = countries[i % countries.length];
        
        // Simulate IPFS hash and encryption
        const ipfsHash = `Qm${this.generateRandomHex(44)}`;
        const encryptionKey = this.generateRandomHex(32);
        const hash = this.generateRandomHex(64);
        
        const documentData = {
          name: `Demo ${documentType.replace('_', ' ')} for ${user.username}`,
          description: `A demo ${documentType.replace('_', ' ')} document created for demonstration purposes`,
          documentType,
          country,
          organization: this.getOrganizationForDocType(documentType, country),
          owner: user._id,
          filename: `demo_${documentType}_${user.username}.pdf`,
          hash,
          ipfsHash,
          encryptionKey,
          encryptionMethod: 'AES-256-CBC',
          isVerified: Math.random() > 0.3, // 70% chance of being verified
          verificationMethod: 'AI+Blockchain',
          verificationResult: 'Document verified successfully',
          aiVerificationResult: {
            verified: true,
            confidence: 0.95,
            details: {
              textAnalysis: 'passed',
              templateMatching: 'passed',
              anomalyDetection: 'passed',
            },
          },
          blockchain: 'ethereum',
          blockchainTxHash: `0x${this.generateRandomHex(64)}`,
          status: Math.random() > 0.3 ? 'verified' : 'pending',
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // Random date in the last 30 days
          updatedAt: new Date(),
          verifiedAt: Math.random() > 0.3 ? new Date() : undefined,
        };
        
        const existingDocument = await this.documentModel.findOne({
          owner: user._id,
          documentType,
        });
        
        if (existingDocument) {
          createdDocuments.push(existingDocument);
        } else {
          const newDocument = new this.documentModel(documentData);
          await newDocument.save();
          createdDocuments.push(newDocument);
        }
      }
    }
    
    this.logger.log(`Created ${createdDocuments.length} demo documents`);
    return createdDocuments;
  }

  getOrganizationForDocType(documentType, country) {
    const organizations = {
      passport: {
        'Singapore': 'Immigration & Checkpoints Authority',
        'Saudi Arabia': 'General Directorate of Passports',
        'default': 'Immigration Department',
      },
      national_id: {
        'Singapore': 'Immigration & Checkpoints Authority',
        'Saudi Arabia': 'National Information Center',
        'default': 'National Registration Department',
      },
      driver_license: {
        'Singapore': 'Land Transport Authority',
        'Saudi Arabia': 'Saudi Driving License Department',
        'default': 'Road Transport Department',
      },
      business_registration: {
        'Singapore': 'Accounting and Corporate Regulatory Authority',
        'Saudi Arabia': 'Ministry of Commerce',
        'default': 'Companies Commission',
      },
      visa: {
        'Singapore': 'Immigration & Checkpoints Authority',
        'Saudi Arabia': 'Ministry of Foreign Affairs',
        'default': 'Immigration Department',
      },
    };
    
    return organizations[documentType][country] || organizations[documentType]['default'];
  }

  generateRandomHex(length) {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
