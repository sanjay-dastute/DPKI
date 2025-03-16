import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DemoDataSeeder } from './demo-data.seed';
import { User, UserSchema } from '../../modules/users/schemas/user.schema';
import { DID, DIDSchema } from '../../modules/did/schemas/did.schema';
import { Document, DocumentSchema } from '../../modules/documents/schemas/document.schema';
import { VerifiableCredential, VerifiableCredentialSchema } from '../../modules/verifiable-credentials/schemas/verifiable-credential.schema';
import { DIDModule } from '../../modules/did/did.module';
import { VerifiableCredentialsModule } from '../../modules/verifiable-credentials/verifiable-credentials.module';
import { DocumentsModule } from '../../modules/documents/documents.module';
import { BlockchainModule } from '../../modules/blockchain/blockchain.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: DID.name, schema: DIDSchema },
      { name: Document.name, schema: DocumentSchema },
      { name: VerifiableCredential.name, schema: VerifiableCredentialSchema },
    ]),
    DIDModule,
    VerifiableCredentialsModule,
    DocumentsModule,
    BlockchainModule,
  ],
  providers: [DemoDataSeeder],
  exports: [DemoDataSeeder],
})
export class SeedsModule {}
