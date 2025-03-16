import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { DID } from '../did/entities/did.entity';
import { User } from '../users/entities/user.entity';
import { Document, DocumentSchema } from '../documents/schemas/document.schema';
import { VerifiableCredential, VerifiableCredentialSchema } from '../verifiable-credentials/schemas/verifiable-credential.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([DID, User]),
    MongooseModule.forFeature([
      { name: Document.name, schema: DocumentSchema },
      { name: VerifiableCredential.name, schema: VerifiableCredentialSchema },
    ]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
