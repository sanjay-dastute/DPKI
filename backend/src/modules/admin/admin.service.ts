import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { DIDService } from '../did/did.service';
import { VerifiableCredentialsService } from '../verifiable-credentials/verifiable-credentials.service';
import { DocumentsService } from '../documents/documents.service';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    private usersService: UsersService,
    private didService: DIDService,
    private vcService: VerifiableCredentialsService,
    private documentsService: DocumentsService,
  ) {}

  async getDashboardStats() {
    const users = await this.usersService.findAll();
    const dids = await this.didService.findAll();
    const credentials = await this.vcService.findAll();
    const documents = await this.documentsService.findAll();

    const usersByRole = {
      citizen: users.filter(user => user.role === UserRole.CITIZEN).length,
      tourist: users.filter(user => user.role === UserRole.TOURIST).length,
      business: users.filter(user => user.role === UserRole.BUSINESS).length,
      government: users.filter(user => user.role === UserRole.GOVERNMENT).length,
      admin: users.filter(user => user.role === UserRole.ADMIN).length,
    };

    return {
      totalUsers: users.length,
      totalDIDs: dids.length,
      totalCredentials: credentials.length,
      totalDocuments: documents.length,
      usersByRole,
    };
  }

  async getSystemHealth() {
    // In a real implementation, we would check the health of various components
    // For now, we'll just return a dummy response
    return {
      status: 'healthy',
      components: {
        database: {
          status: 'connected',
          latency: '5ms',
        },
        blockchain: {
          status: 'connected',
          latency: '150ms',
          lastBlock: 12345,
        },
        redis: {
          status: 'connected',
          latency: '2ms',
        },
        kafka: {
          status: 'connected',
          latency: '10ms',
        },
      },
    };
  }

  async getAuditLogs(limit = 100, offset = 0) {
    // In a real implementation, we would fetch audit logs from the database
    // For now, we'll just return dummy data
    const auditLogs = [];
    for (let i = 0; i < limit; i++) {
      auditLogs.push({
        id: `log-${i + offset}`,
        userId: `user-${i % 10}`,
        action: i % 3 === 0 ? 'CREATE' : i % 3 === 1 ? 'UPDATE' : 'DELETE',
        resourceType: i % 4 === 0 ? 'USER' : i % 4 === 1 ? 'DID' : i % 4 === 2 ? 'CREDENTIAL' : 'DOCUMENT',
        resourceId: `resource-${i}`,
        timestamp: new Date(Date.now() - i * 60000),
        ipAddress: `192.168.1.${i % 255}`,
      });
    }
    return auditLogs;
  }

  async getComplianceReport() {
    // In a real implementation, we would generate a compliance report
    // For now, we'll just return dummy data
    return {
      gdpr: {
        consentRecords: 245,
        dataAccessRequests: 12,
        dataErasureRequests: 5,
        complianceScore: 98,
      },
      hipaa: {
        authorizedAccesses: 156,
        unauthorizedAccessAttempts: 3,
        dataBreaches: 0,
        complianceScore: 99,
      },
      pdpa: {
        dataTransferConsents: 78,
        crossBorderTransfers: 45,
        complianceScore: 97,
      },
      sdaia: {
        aiEthicsCompliance: 100,
        dataLocalizationCompliance: 100,
        complianceScore: 100,
      },
    };
  }
}
