import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: Partial<User>) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  patch(@Param('id') id: string, @Body() updateUserDto: Partial<User>, @Request() req: any) {
    // Check if user is updating their own profile or is an admin
    if (req.user.id !== id && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You are not authorized to update this user');
    }
    
    // Create a safe update object
    const safeUpdateData: Partial<User> = {
      username: updateUserDto.username,
      email: updateUserDto.email,
      country: updateUserDto.country,
      walletAddress: updateUserDto.walletAddress,
    };
    
    // Only admins can update these fields
    if (req.user.role === UserRole.ADMIN) {
      if (updateUserDto.role) safeUpdateData.role = updateUserDto.role;
      if (updateUserDto.isActive !== undefined) safeUpdateData.isActive = updateUserDto.isActive;
      if (updateUserDto.isVerified !== undefined) safeUpdateData.isVerified = updateUserDto.isVerified;
      if (updateUserDto.approvalStatus) safeUpdateData.approvalStatus = updateUserDto.approvalStatus;
    }
    
    return this.usersService.update(id, safeUpdateData);
  }
  
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: any, @Request() req: any): Promise<User> {
    // Check if user is updating their own profile or is an admin
    if (req.user.id !== id && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You are not authorized to update this user');
    }
    
    // Create a safe update object
    const safeUpdateData: Partial<User> = {
      fullName: updateUserDto.fullName,
      country: updateUserDto.country,
      organization: updateUserDto.organization,
    };
    
    // Only admins can update these fields
    if (req.user.role === UserRole.ADMIN) {
      if (updateUserDto.role) safeUpdateData.role = updateUserDto.role;
      if (updateUserDto.isActive !== undefined) safeUpdateData.isActive = updateUserDto.isActive;
      if (updateUserDto.isVerified !== undefined) safeUpdateData.isVerified = updateUserDto.isVerified;
      if (updateUserDto.approvalStatus) safeUpdateData.approvalStatus = updateUserDto.approvalStatus;
    }
    
    return this.usersService.update(id, safeUpdateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
  
  @Get('search')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS, UserRole.GOVERNMENT, UserRole.ADMIN)
  async search(@Query('query') query: string, @Request() req: any): Promise<any[]> {
    // Check if user has permission to search
    if (![UserRole.BUSINESS, UserRole.GOVERNMENT, UserRole.ADMIN].includes(req.user.role)) {
      throw new ForbiddenException('You do not have permission to search');
    }
    
    // Search for users by username or email
    const users = await this.usersService.search(query);
    
    // Return users with basic information
    return users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      country: user.country,
      isActive: user.isActive,
      approvalStatus: user.approvalStatus,
    }));
  }
}
