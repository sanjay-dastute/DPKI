import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { VerifiableCredentialsService } from './verifiable-credentials.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('verifiable-credentials')
export class VerifiableCredentialsController {
  constructor(private readonly vcService: VerifiableCredentialsService) {}

  @Post('issue')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.GOVERNMENT)
  issue(
    @Body('issuerDid') issuerDid: string,
    @Body('holderDid') holderDid: string,
    @Body('type') type: string,
    @Body('claims') claims: Record<string, any>,
    @Body('expirationDate') expirationDate?: Date,
  ) {
    return this.vcService.issue(issuerDid, holderDid, type, claims, expirationDate);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.vcService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.vcService.findById(id);
  }

  @Get('verify/:id')
  @UseGuards(JwtAuthGuard)
  verify(@Param('id') id: string) {
    return this.vcService.verify(id);
  }

  @Get('list/:did')
  @UseGuards(JwtAuthGuard)
  findByDID(@Param('did') did: string) {
    return this.vcService.findByDID(did);
  }

  @Post('revoke/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.GOVERNMENT)
  revoke(@Param('id') id: string) {
    return this.vcService.revoke(id);
  }
}
