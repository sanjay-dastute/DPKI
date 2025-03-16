import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DID } from '../did/entities/did.entity';
import { User } from '../users/entities/user.entity';
import { Document } from '../documents/schemas/document.schema';
import { VerifiableCredential } from '../verifiable-credentials/schemas/verifiable-credential.schema';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    @InjectRepository(DID)
    private didRepository: Repository<DID>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectModel(Document.name)
    private documentModel: Model<Document>,
    @InjectModel(VerifiableCredential.name)
    private credentialModel: Model<VerifiableCredential>,
  ) {}

  async searchDids(query: string, currentUser: User) {
    this.logger.log(`Searching DIDs with query: ${query}`);
    
    try {
      // Search for DIDs that match the query
      const dids = await this.didRepository
        .createQueryBuilder('did')
        .leftJoinAndSelect('did.user', 'user')
        .where('did.did LIKE :query OR did.method LIKE :query', { query: `%${query}%` })
        .getMany();
      
      // Map the results to include user information
      return dids.map(did => ({
        id: did.id,
        did: did.did,
        method: did.method,
        // Use empty string as fallback for network
        network: '',
        owner: {
          id: did.user?.id,
          username: did.user?.username,
          country: did.user?.country,
        },
      }));
    } catch (error) {
      this.logger.error(`Error searching DIDs: ${error.message}`);
      return [];
    }
  }

  async searchCredentials(query: string, currentUser: User) {
    this.logger.log(`Searching credentials with query: ${query}`);
    
    try {
      // Search for credentials that match the query
      const credentials = await this.credentialModel
        .find({
          $or: [
            { credentialId: { $regex: query, $options: 'i' } },
            { type: { $regex: query, $options: 'i' } },
            { issuer: { $regex: query, $options: 'i' } },
          ],
        })
        .populate('userId')
        .exec();
      
      // Map the results to include user information
      return credentials.map(credential => ({
        id: credential._id,
        type: Array.isArray(credential.type) ? credential.type[0] : credential.type,
        issuer: credential.issuer,
        // Use empty string as fallback for holder
        holder: '',
        issuanceDate: credential.issuanceDate,
        expirationDate: credential.expirationDate,
        status: credential.status,
        // Use null as fallback for holderUser
        holderUser: null,
      }));
    } catch (error) {
      this.logger.error(`Error searching credentials: ${error.message}`);
      return [];
    }
  }

  async searchDocuments(query: string, currentUser: User) {
    this.logger.log(`Searching documents with query: ${query}`);
    
    try {
      // Search for documents that match the query
      const documents = await this.documentModel
        .find({
          $or: [
            { type: { $regex: query, $options: 'i' } },
          ],
        })
        .populate('userId')
        .exec();
      
      // Map the results to include user information
      return documents.map(document => ({
        id: document._id,
        // Use document name or fallback to 'Document'
        filename: 'Document',
        documentType: document.type,
        // Use empty string as fallback for description
        description: '',
        // Use boolean check for status
        isVerified: document.status ? document.status.toString() === 'VERIFIED' : false,
        createdAt: document.createdAt,
        owner: document.userId ? {
          id: document.userId['_id'],
          username: document.userId['username'],
          country: document.userId['country'],
        } : null,
      }));
    } catch (error) {
      this.logger.error(`Error searching documents: ${error.message}`);
      return [];
    }
  }
}
