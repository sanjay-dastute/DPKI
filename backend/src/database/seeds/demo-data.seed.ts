import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User, UserRole } from '../../modules/users/entities/user.entity';
import { DID, DIDStatus } from '../../modules/did/entities/did.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Document } from '../../modules/documents/schemas/document.schema';
import { VerifiableCredential } from '../../modules/verifiable-credentials/schemas/verifiable-credential.schema';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class DemoDataSeeder {
  private readonly logger = new Logger(DemoDataSeeder.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(DID)
    private readonly didRepository: Repository<DID>,
    @InjectModel(Document.name)
    private readonly documentModel: Model<Document>,
    @InjectModel(VerifiableCredential.name)
    private readonly vcModel: Model<VerifiableCredential>,
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

  private async clearExistingData(): Promise<void> {
    this.logger.log('Clearing existing demo data...');
    await this.userRepository.delete({ email: Like('demo%') });
    await this.didRepository.delete({ did: Like('did:demo%') });
    await this.vcModel.deleteMany({ 'type.1': 'DemoCredential' }).exec();
    await this.documentModel.deleteMany({ name: /^Demo/ }).exec();
  }

  private async createDemoUsers(): Promise<User[]> {
    this.logger.log('Creating demo users...');
    
    const demoUsers = [
      {
        username: 'demo_individual',
        email: 'demo_individual@example.com',
        password: await bcrypt.hash('Password123!', 10),
        role: UserRole.INDIVIDUAL,
        country: 'Singapore',
      },
      {
        username: 'demo_business',
        email: 'demo_business@example.com',
        password: await bcrypt.hash('Password123!', 10),
        role: UserRole.BUSINESS,
        country: 'Singapore',
      },
      {
        username: 'demo_government',
        email: 'demo_government@example.com',
        password: await bcrypt.hash('Password123!', 10),
        role: UserRole.GOVERNMENT,
        country: 'Singapore',
      },
      {
        username: 'demo_tourist',
        email: 'demo_tourist@example.com',
        password: await bcrypt.hash('Password123!', 10),
        role: UserRole.TOURIST,
        country: 'Saudi Arabia',
      },
    ];

    const createdUsers: User[] = [];
    
    for (const userData of demoUsers) {
      const existingUser = await this.userRepository.findOne({ 
        where: { email: userData.email } 
      });
      
      if (existingUser) {
        createdUsers.push(existingUser);
      } else {
        const newUser = this.userRepository.create(userData);
        await this.userRepository.save(newUser);
        createdUsers.push(newUser);
      }
    }
    
    this.logger.log(`Created ${createdUsers.length} demo users`);
    return createdUsers;
  }

  private async createDemoDIDs(users: User[]): Promise<DID[]> {
    this.logger.log('Creating demo DIDs...');
    
    const didMethods = ['ethereum', 'indy', 'fabric'];
    const createdDIDs: DID[] = [];
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const methodIndex = i % didMethods.length;
      const method = didMethods[methodIndex];
      
      const didData = {
        did: `did:${method}:demo:${this.generateRandomHex(16)}`,
        userId: user.id,
        publicKey: this.generateRandomHex(64),
        status: DIDStatus.ACTIVE,
        method,
        controller: user.id,
      };
      
      const existingDID = await this.didRepository.findOne({ 
        where: { userId: user.id, method } 
      });
      
      if (existingDID) {
        createdDIDs.push(existingDID);
      } else {
        const newDID = this.didRepository.create(didData);
        await this.didRepository.save(newDID);
        createdDIDs.push(newDID);
      }
    }
    
    this.logger.log(`Created ${createdDIDs.length} demo DIDs`);
    return createdDIDs;
  }

  private async createDemoCredentials(dids: DID[], users: User[]): Promise<void> {
    this.logger.log('Creating demo credentials...');
    
    const credentialTypes = [
      'IdentityCredential',
      'EducationCredential',
      'EmploymentCredential',
      'VisaCredential',
    ];
    
    // Government user issues credentials to other users
    const issuerDID = dids.find(did => 
      did.userId === users.find(u => u.role === UserRole.GOVERNMENT)?.id
    );
    
    if (!issuerDID) {
      this.logger.warn('No government user found to issue credentials');
      return;
    }
    
    let createdCount = 0;
    
    for (let i = 0; i < users.length; i++) {
      if (users[i].role === UserRole.GOVERNMENT) continue; // Skip government user (issuer)
      
      const user = users[i];
      const holderDID = dids.find(did => did.userId === user.id);
      
      if (!holderDID) continue;
      
      // Create a credential for each user
      const credentialType = credentialTypes[i % credentialTypes.length];
      
      let credentialSubject: any = {};
      switch (credentialType) {
        case 'IdentityCredential':
          credentialSubject = {
            name: user.username,
            dateOfBirth: '1990-01-01',
            nationality: user.country,
            idNumber: `ID${this.generateRandomHex(8)}`,
          };
          break;
        case 'EducationCredential':
          credentialSubject = {
            name: user.username,
            institution: 'National University of Singapore',
            degree: 'Bachelor of Science in Computer Science',
            graduationDate: '2020-05-15',
            gpa: '3.8',
          };
          break;
        case 'EmploymentCredential':
          credentialSubject = {
            name: user.username,
            employer: 'Tech Innovations Pte Ltd',
            position: 'Senior Software Engineer',
            startDate: '2020-06-01',
            employeeId: `EMP${this.generateRandomHex(6)}`,
          };
          break;
        case 'VisaCredential':
          credentialSubject = {
            name: user.username,
            passportNumber: `P${this.generateRandomHex(8)}`,
            visaType: 'Tourist',
            issueDate: '2023-01-01',
            expiryDate: '2024-01-01',
            permitNumber: `V${this.generateRandomHex(8)}`,
          };
          break;
      }
      
      const existingCredential = await this.vcModel.findOne({
        issuer: issuerDID.did,
        holder: holderDID.did,
        'type.1': credentialType,
      }).exec();
      
      if (!existingCredential) {
        const credentialData = {
          type: ['VerifiableCredential', credentialType, 'DemoCredential'],
          issuer: issuerDID.did,
          holder: holderDID.did,
          subject: holderDID.did,
          issuanceDate: new Date(),
          expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          credentialSubject,
          claims: credentialSubject,
          status: 'active',
          blockchain: 'ethereum',
          blockchainTxHash: `0x${this.generateRandomHex(64)}`,
          transactionId: `0x${this.generateRandomHex(64)}`,
          zkpProof: {
            proof: `0x${this.generateRandomHex(128)}`,
            publicSignals: [`0x${this.generateRandomHex(64)}`],
            protocol: 'groth16',
            curve: 'bn128',
          },
          didId: issuerDID.id,
        };
        
        const newCredential = new this.vcModel(credentialData);
        await newCredential.save();
        createdCount++;
      }
    }
    
    this.logger.log(`Created ${createdCount} demo credentials`);
  }

  private async createDemoDocuments(users: User[]): Promise<void> {
    this.logger.log('Creating demo documents...');
    
    const documentTypes = [
      'passport',
      'national_id',
      'driver_license',
      'business_registration',
      'visa',
    ];
    
    const countries = ['Singapore', 'Saudi Arabia', 'Malaysia', 'Indonesia', 'Thailand'];
    let createdCount = 0;
    
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
        
        const existingDocument = await this.documentModel.findOne({
          owner: user.id,
          documentType,
        }).exec();
        
        if (!existingDocument) {
          const documentData = {
            name: `Demo ${documentType.replace('_', ' ')} for ${user.username}`,
            description: `A demo ${documentType.replace('_', ' ')} document created for demonstration purposes`,
            documentType,
            country,
            organization: this.getOrganizationForDocType(documentType, country),
            owner: user.id,
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
          
          const newDocument = new this.documentModel(documentData);
          await newDocument.save();
          createdCount++;
        }
      }
    }
    
    this.logger.log(`Created ${createdCount} demo documents`);
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
