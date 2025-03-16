import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DocumentsService } from '../../documents/documents.service';
import { UsersService } from '../../users/users.service';
import { AiService } from '../../ai/ai.service';
import { Document } from '../types/document.type';
import { User } from '../types/user.type';
import { CreateDocumentInput } from '../inputs/create-document.input';
import { UpdateDocumentInput } from '../inputs/update-document.input';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { CurrentUser } from '../decorators/current-user.decorator';

@Resolver(() => Document)
export class DocumentsResolver {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly usersService: UsersService,
    private readonly aiService: AiService,
  ) {}

  @Query(() => [Document], { name: 'documents' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll() {
    return this.documentsService.findAll();
  }

  @Query(() => Document, { name: 'document' })
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() currentUser: User,
  ) {
    const document = await this.documentsService.findOne(id);
    
    // Check if the user is authorized to access this document
    if (document.userId !== currentUser.id && currentUser.role !== UserRole.ADMIN) {
      throw new Error('Unauthorized access to document');
    }
    
    return document;
  }

  @Mutation(() => Document)
  @UseGuards(JwtAuthGuard)
  async createDocument(
    @Args('createDocumentInput') createDocumentInput: CreateDocumentInput,
    @CurrentUser() currentUser: User,
  ) {
    // Only allow users to create documents for themselves unless they are admins
    if (createDocumentInput.userId !== currentUser.id && currentUser.role !== UserRole.ADMIN) {
      throw new Error('Unauthorized to create document for another user');
    }
    
    // Use upload method instead of create
    return this.documentsService.upload(
      createDocumentInput.userId,
      createDocumentInput.did,
      createDocumentInput.type,
      Buffer.from(createDocumentInput.content || '', 'base64')
    );
  }

  @Mutation(() => Document)
  @UseGuards(JwtAuthGuard)
  async updateDocument(
    @Args('updateDocumentInput') updateDocumentInput: UpdateDocumentInput,
    @CurrentUser() currentUser: User,
  ) {
    const document = await this.documentsService.findOne(updateDocumentInput.id);
    
    // Only allow users to update their own documents unless they are admins
    if (document.userId !== currentUser.id && currentUser.role !== UserRole.ADMIN) {
      throw new Error('Unauthorized to update this document');
    }
    
    // For now, just return the document since update is not implemented
    return document;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async removeDocument(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() currentUser: User,
  ) {
    const document = await this.documentsService.findOne(id);
    
    // Only allow users to remove their own documents unless they are admins
    if (document.userId !== currentUser.id && currentUser.role !== UserRole.ADMIN) {
      throw new Error('Unauthorized to remove this document');
    }
    
    await this.documentsService.delete(id);
    return true;
  }

  @Query(() => [Document], { name: 'myDocuments' })
  @UseGuards(JwtAuthGuard)
  async findMyDocuments(@CurrentUser() currentUser: User) {
    return this.documentsService.findByUserId(currentUser.id);
  }

  @ResolveField(() => User, { nullable: true })
  async owner(@Parent() document: Document) {
    return this.usersService.findOne(document.userId);
  }

  @Mutation(() => Document)
  @UseGuards(JwtAuthGuard)
  async verifyDocument(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() currentUser: User,
  ) {
    const document = await this.documentsService.findOne(id);
    
    // Check if the user is authorized to verify this document
    if (document.userId !== currentUser.id && 
        currentUser.role !== UserRole.ADMIN) {
      throw new Error('Unauthorized to verify this document');
    }
    
    return this.documentsService.verify(id);
  }
}
