import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { DIDModule } from '../did/did.module';
import { VerifiableCredentialsModule } from '../verifiable-credentials/verifiable-credentials.module';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [
    UsersModule,
    DIDModule,
    VerifiableCredentialsModule,
    DocumentsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
