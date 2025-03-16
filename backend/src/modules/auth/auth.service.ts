import { Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      // Check if user account is approved
      if (user.approvalStatus !== 'approved') {
        throw new HttpException(
          'Your account is pending approval. Please wait for an administrator to approve your account.',
          HttpStatus.FORBIDDEN
        );
      }
      
      // Check if user account is active
      if (!user.isActive) {
        throw new HttpException(
          'Your account has been deactivated. Please contact an administrator.',
          HttpStatus.FORBIDDEN
        );
      }
      
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }
}
