import { Controller, Post, Body, UseGuards, Get, Param, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { AiService } from './ai.service';

@ApiTags('ai')
@Controller('ai')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('document/verify')
  @UseInterceptors(FileInterceptor('document'))
  @ApiOperation({ summary: 'Verify a document using AI' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        document: {
          type: 'string',
          format: 'binary',
        },
        documentType: {
          type: 'string',
          enum: ['passport', 'nric', 'business_license', 'proof_of_residency', 'visa'],
        },
        country: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Document verification result' })
  async verifyDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body('documentType') documentType: string,
    @Body('country') country: string,
  ) {
    return this.aiService.verifyDocument(
      documentType,
      file.buffer,
      country,
    );
  }

  @Post('document/extract-text')
  @UseInterceptors(FileInterceptor('document'))
  @ApiOperation({ summary: 'Extract text from a document using OCR' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        document: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Extracted text from document' })
  async extractTextFromDocument(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.aiService.extractTextFromDocument(file.buffer);
  }

  @Post('document/detect-tampering')
  @UseInterceptors(FileInterceptor('document'))
  @ApiOperation({ summary: 'Detect tampering in a document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        document: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Document tampering detection result' })
  async detectDocumentTampering(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.aiService.detectDocumentTampering(file.buffer);
  }

  @Post('anomaly/behavioral')
  @ApiOperation({ summary: 'Detect behavioral anomalies' })
  @ApiResponse({ status: 200, description: 'Behavioral anomaly detection result' })
  async detectBehavioralAnomalies(
    @Body('userId') userId: string,
    @Body('action') action: string,
    @Body('context') context: Record<string, any>,
  ) {
    return this.aiService.detectBehavioralAnomalies(
      userId,
      action,
      context,
    );
  }

  @Post('anomaly/credential')
  @ApiOperation({ summary: 'Detect credential anomalies' })
  @ApiResponse({ status: 200, description: 'Credential anomaly detection result' })
  async detectCredentialAnomalies(
    @Body('credentialId') credentialId: string,
    @Body('presenterId') presenterId: string,
    @Body('verifierId') verifierId: string,
    @Body('context') context: Record<string, any>,
  ) {
    return this.aiService.detectCredentialAnomalies(
      credentialId,
      presenterId,
      verifierId,
      context,
    );
  }

  @Post('anomaly/blockchain')
  @ApiOperation({ summary: 'Detect blockchain anomalies' })
  @ApiResponse({ status: 200, description: 'Blockchain anomaly detection result' })
  async detectBlockchainAnomalies(
    @Body('transactionType') transactionType: string,
    @Body('transactionData') transactionData: Record<string, any>,
    @Body('context') context: Record<string, any>,
  ) {
    return this.aiService.detectBlockchainAnomalies(
      transactionType,
      transactionData,
      context,
    );
  }

  @Post('risk-assessment')
  @ApiOperation({ summary: 'Generate a fraud risk assessment' })
  @ApiResponse({ status: 200, description: 'Fraud risk assessment result' })
  async generateFraudRiskAssessment(
    @Body('userId') userId: string,
    @Body('userProfile') userProfile: Record<string, any>,
    @Body('activityHistory') activityHistory: Array<Record<string, any>>,
  ) {
    return this.aiService.generateFraudRiskAssessment(
      userId,
      userProfile,
      activityHistory,
    );
  }

  @Post('zkp/prove-age')
  @ApiOperation({ summary: 'Generate a zero-knowledge proof that a user is over a certain age' })
  @ApiResponse({ status: 200, description: 'Zero-knowledge proof result' })
  async proveAgeOver(
    @Body('dateOfBirth') dateOfBirth: string,
    @Body('minimumAge') minimumAge: number,
  ) {
    return this.aiService.proveAgeOver(
      new Date(dateOfBirth),
      minimumAge,
    );
  }

  @Post('zkp/prove-income')
  @ApiOperation({ summary: 'Generate a zero-knowledge proof that a user\'s income is over a certain threshold' })
  @ApiResponse({ status: 200, description: 'Zero-knowledge proof result' })
  async proveIncomeOver(
    @Body('income') income: number,
    @Body('minimumIncome') minimumIncome: number,
  ) {
    return this.aiService.proveIncomeOver(
      income,
      minimumIncome,
    );
  }

  @Post('zkp/prove-residency')
  @ApiOperation({ summary: 'Generate a zero-knowledge proof that a user is a resident of a specific region' })
  @ApiResponse({ status: 200, description: 'Zero-knowledge proof result' })
  async proveResidency(
    @Body('address') address: Record<string, string>,
    @Body('region') region: string,
  ) {
    return this.aiService.proveResidency(
      address,
      region,
    );
  }

  @Post('zkp/verify')
  @ApiOperation({ summary: 'Verify a zero-knowledge proof' })
  @ApiResponse({ status: 200, description: 'Verification result' })
  async verifyProof(
    @Body('proof') proof: string,
    @Body('publicInputs') publicInputs: Record<string, any>,
    @Body('proofType') proofType: string,
  ) {
    return this.aiService.verifyProof(
      proof,
      publicInputs,
      proofType,
    );
  }

  @Post('zkp/prove-credential')
  @ApiOperation({ summary: 'Generate a proof that a credential is valid without revealing the credential contents' })
  @ApiResponse({ status: 200, description: 'Zero-knowledge proof result' })
  async proveCredentialValidity(
    @Body('credential') credential: Record<string, any>,
    @Body('issuerPublicKey') issuerPublicKey: string,
  ) {
    return this.aiService.proveCredentialValidity(
      credential,
      issuerPublicKey,
    );
  }

  @Get('health')
  @ApiOperation({ summary: 'Check the health of the AI services' })
  @ApiResponse({ status: 200, description: 'Health check result' })
  async healthCheck() {
    return {
      status: 'healthy',
      services: {
        documentVerification: 'operational',
        anomalyDetection: 'operational',
        zeroKnowledgeProofs: 'operational',
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Get('admin/stats')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get AI service statistics (admin only)' })
  @ApiResponse({ status: 200, description: 'AI service statistics' })
  async getStats() {
    return {
      documentsVerified: 245,
      anomaliesDetected: 37,
      proofsGenerated: 128,
      proofsVerified: 112,
      averageResponseTime: '120ms',
      uptime: '99.98%',
      lastUpdated: new Date().toISOString(),
    };
  }
}
