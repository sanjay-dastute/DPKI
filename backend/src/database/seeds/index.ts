import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { DemoDataSeeder } from './demo-data.seed';
import { User } from '../../modules/users/entities/user.entity';
import { DID } from '../../modules/did/entities/did.entity';
import { Document, DocumentSchema } from '../../modules/documents/schemas/document.schema';
import { VerifiableCredential, VerifiableCredentialSchema } from '../../modules/verifiable-credentials/schemas/verifiable-credential.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, DID]),
    MongooseModule.forFeature([
      { name: Document.name, schema: DocumentSchema },
      { name: VerifiableCredential.name, schema: VerifiableCredentialSchema },
    ]),
  ],
  providers: [DemoDataSeeder],
  exports: [DemoDataSeeder],
})
export class SeedsModule {}
