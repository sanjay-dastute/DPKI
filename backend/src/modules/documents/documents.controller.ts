import { Controller, Get, Post, Body, Param, Delete, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { DocumentType } from './schemas/document.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Body('userId') userId: string,
    @Body('did') did: string,
    @Body('type') type: DocumentType,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.documentsService.upload(userId, did, type, file.buffer);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.documentsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.documentsService.findById(id);
  }

  @Get('did/:did')
  @UseGuards(JwtAuthGuard)
  findByDID(@Param('did') did: string) {
    return this.documentsService.findByDID(did);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  findByUserId(@Param('userId') userId: string) {
    return this.documentsService.findByUserId(userId);
  }

  @Post('verify/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.GOVERNMENT)
  verify(@Param('id') id: string) {
    return this.documentsService.verify(id);
  }

  @Post('reject/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.GOVERNMENT)
  reject(@Param('id') id: string) {
    return this.documentsService.reject(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.documentsService.delete(id);
  }
}
