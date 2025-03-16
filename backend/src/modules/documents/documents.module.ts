import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { Document, DocumentSchema } from './schemas/document.schema';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { DIDModule } from '../did/did.module';
import { AiModule } from '../ai/ai.module';
import { IPFSService } from './services/ipfs.service';
import { EncryptionService } from './services/encryption.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Document.name, schema: DocumentSchema },
    ]),
    BlockchainModule,
    DIDModule,
    AiModule,
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService, IPFSService, EncryptionService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
