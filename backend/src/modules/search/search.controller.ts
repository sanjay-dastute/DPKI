import { Controller, Get, Query, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS, UserRole.GOVERNMENT, UserRole.ADMIN)
  async search(
    @Query('type') type: string,
    @Query('query') query: string,
    @Request() req: any,
  ) {
    const currentUser = req.user;
    
    // Check if user has permission to search
    if (![UserRole.BUSINESS, UserRole.GOVERNMENT, UserRole.ADMIN].includes(currentUser.role)) {
      throw new ForbiddenException('You do not have permission to search');
    }
    
    switch (type) {
      case 'did':
        return this.searchService.searchDids(query, currentUser);
      case 'credential':
        return this.searchService.searchCredentials(query, currentUser);
      case 'document':
        return this.searchService.searchDocuments(query, currentUser);
      default:
        return [];
    }
  }
}
