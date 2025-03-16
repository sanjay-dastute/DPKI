import { Controller, Post, Body, UseGuards, Get, Request, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }): Promise<any> {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    
    if (!user) {
      return { success: false, message: 'Invalid credentials' };
    }
    
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() registerDto: any): Promise<any> {
    // Check if username already exists
    const existingUsername = await this.usersService.findByUsername(registerDto.username);
    if (existingUsername) {
      throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST);
    }
    
    // Check if email already exists
    const existingEmail = await this.usersService.findByEmail(registerDto.email);
    if (existingEmail) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }
    
    // Create new user
    try {
      // Set default role to INDIVIDUAL if not provided
      if (!registerDto.role) {
        registerDto.role = 'INDIVIDUAL';
      }
      
      // Set default values for isActive, isVerified, and approvalStatus
      registerDto.isActive = false;
      registerDto.isVerified = false;
      registerDto.approvalStatus = 'pending';
      
      const user = await this.usersService.create(registerDto);
      
      // Remove password from response
      const { password, ...result } = user;
      
      // Generate JWT token and return user data
      return this.authService.login(result);
    } catch (error) {
      throw new HttpException(
        'Failed to create user: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any): any {
    return req.user;
  }
}
