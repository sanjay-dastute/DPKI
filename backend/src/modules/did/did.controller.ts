import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { DIDService } from './did.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('did')
export class DIDController {
  constructor(private readonly didService: DIDService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  create(@Body('userId') userId: string) {
    return this.didService.create(userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.didService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.didService.findById(id);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  findByUserId(@Param('userId') userId: string) {
    return this.didService.findByUserId(userId);
  }

  @Post('revoke/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.GOVERNMENT)
  revoke(@Param('id') id: string) {
    return this.didService.revoke(id);
  }
}
