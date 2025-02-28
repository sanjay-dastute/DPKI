import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Document, DocumentStatus, DocumentType } from './schemas/document.schema';
import { BlockchainService } from '../blockchain/blockchain.service';
import { DIDService } from '../did/did.service';
import * as crypto from 'crypto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document.name)
    private documentModel: Model<Document>,
    private blockchainService: BlockchainService,
    private didService: DIDService,
  ) {}

  async findAll(): Promise<Document[]> {
    return this.documentModel.find().exec();
  }

  async findById(id: string): Promise<Document> {
    const document = await this.documentModel.findOne({ id }).exec();
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return document;
  }

  async findByDID(did: string): Promise<Document[]> {
    return this.documentModel.find({ did }).exec();
  }

  async findByUserId(userId: string): Promise<Document[]> {
    return this.documentModel.find({ userId }).exec();
  }

  async upload(
    userId: string,
    did: string,
    type: DocumentType,
    fileBuffer: Buffer,
  ): Promise<Document> {
    // Verify DID
    await this.didService.findByDID(did);
    
    // Generate document ID
    const id = uuidv4();
    
    // Calculate hash of the file
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    
    // TODO: Upload to IPFS
    // For now, we'll just use a placeholder
    const ipfsHash = `ipfs-${hash.substring(0, 10)}`;
    
    // TODO: Encrypt the file
    // For now, we'll just use a placeholder
    const encryptionMethod = 'AES-256';
    
    // TODO: Perform AI verification
    // For now, we'll just use a placeholder
    const aiVerificationResult = {
      verified: true,
      confidence: 0.95,
      details: {
        faceMatch: true,
        documentAuthenticity: true,
        textExtraction: {
          name: 'John Doe',
          documentNumber: '12345678',
        },
      },
    };
    
    // Create document
    const document = new this.documentModel({
      id,
      userId,
      did,
      type,
      hash,
      ipfsHash,
      encryptionMethod,
      status: DocumentStatus.PENDING,
      aiVerificationResult,
    });
    
    // Save document
    return document.save();
  }

  async verify(id: string): Promise<Document> {
    const document = await this.findById(id);
    
    if (document.status !== DocumentStatus.PENDING) {
      throw new BadRequestException(`Document ${id} is not in pending status`);
    }
    
    document.status = DocumentStatus.VERIFIED;
    return document.save();
  }

  async reject(id: string): Promise<Document> {
    const document = await this.findById(id);
    
    if (document.status !== DocumentStatus.PENDING) {
      throw new BadRequestException(`Document ${id} is not in pending status`);
    }
    
    document.status = DocumentStatus.REJECTED;
    return document.save();
  }

  async delete(id: string): Promise<void> {
    const document = await this.findById(id);
    await this.documentModel.deleteOne({ id }).exec();
  }
}
