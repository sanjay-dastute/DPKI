import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VerifiableCredentialsService } from './verifiable-credentials.service';
import { VerifiableCredentialsController } from './verifiable-credentials.controller';
import { VerifiableCredential, VerifiableCredentialSchema } from './schemas/verifiable-credential.schema';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { DIDModule } from '../did/did.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VerifiableCredential.name, schema: VerifiableCredentialSchema },
    ]),
    BlockchainModule,
    DIDModule,
  ],
  controllers: [VerifiableCredentialsController],
  providers: [VerifiableCredentialsService],
  exports: [VerifiableCredentialsService],
})
export class VerifiableCredentialsModule {}
