import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DocumentVerificationService } from './services/document-verification.service';
import { AnomalyDetectionService } from './services/anomaly-detection.service';
import { ZeroKnowledgeProofService } from './services/zero-knowledge-proof.service';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [ConfigModule],
  controllers: [AiController],
  providers: [
    AiService,
    DocumentVerificationService,
    AnomalyDetectionService,
    ZeroKnowledgeProofService,
  ],
  exports: [
    AiService,
    DocumentVerificationService,
    AnomalyDetectionService,
    ZeroKnowledgeProofService,
  ],
})
export class AiModule {}
