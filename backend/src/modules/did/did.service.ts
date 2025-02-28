import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DID, DIDStatus } from './entities/did.entity';
import { UsersService } from '../users/users.service';
import * as crypto from 'crypto';

@Injectable()
export class DIDService {
  constructor(
    @InjectRepository(DID)
    private didRepository: Repository<DID>,
    private usersService: UsersService,
  ) {}

  async findAll(): Promise<DID[]> {
    return this.didRepository.find();
  }

  async findById(id: string): Promise<DID> {
    const did = await this.didRepository.findOne({ where: { id } });
    if (!did) {
      throw new NotFoundException(`DID with ID ${id} not found`);
    }
    return did;
  }

  async findByDID(did: string): Promise<DID> {
    const didEntity = await this.didRepository.findOne({ where: { did } });
    if (!didEntity) {
      throw new NotFoundException(`DID ${did} not found`);
    }
    return didEntity;
  }

  async findByUserId(userId: string): Promise<DID[]> {
    return this.didRepository.find({ where: { userId } });
  }

  async create(userId: string): Promise<DID> {
    // Check if user exists
    const user = await this.usersService.findById(userId);
    
    // Generate DID
    const method = 'indy';
    const didId = crypto.randomBytes(16).toString('hex');
    const did = `did:${method}:${didId}`;
    
    // Generate key pair
    const keyPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });
    
    // Create DID entity
    const didEntity = this.didRepository.create({
      did,
      userId,
      publicKey: keyPair.publicKey,
      status: DIDStatus.ACTIVE,
      method,
      controller: userId,
    });
    
    // Save DID entity
    const savedDID = await this.didRepository.save(didEntity);
    
    // Update user with DID
    await this.usersService.update(userId, { did });
    
    return savedDID;
  }

  async revoke(id: string): Promise<DID> {
    const did = await this.findById(id);
    
    if (did.status === DIDStatus.REVOKED) {
      throw new BadRequestException(`DID ${did.did} is already revoked`);
    }
    
    did.status = DIDStatus.REVOKED;
    return this.didRepository.save(did);
  }
}
