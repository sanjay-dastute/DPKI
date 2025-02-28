import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DIDService } from '../../did/did.service';
import { UsersService } from '../../users/users.service';
import { DID } from '../types/did.type';
import { User } from '../types/user.type';
import { CreateDIDInput } from '../inputs/create-did.input';
import { UpdateDIDInput } from '../inputs/update-did.input';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { CurrentUser } from '../decorators/current-user.decorator';

@Resolver(() => DID)
export class DIDResolver {
  constructor(
    private readonly didService: DIDService,
    private readonly usersService: UsersService,
  ) {}

  @Query(() => [DID], { name: 'dids' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll() {
    return this.didService.findAll();
  }

  @Query(() => DID, { name: 'did' })
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() currentUser: User,
  ) {
    const did = await this.didService.findOne(id);
    
    // Check if the user is authorized to access this DID
    if (did.controller !== currentUser.id && currentUser.role !== UserRole.ADMIN) {
      throw new Error('Unauthorized access to DID');
    }
    
    return did;
  }

  @Mutation(() => DID)
  @UseGuards(JwtAuthGuard)
  async createDID(
    @Args('createDIDInput') createDIDInput: CreateDIDInput,
    @CurrentUser() currentUser: User,
  ) {
    // Only allow users to create DIDs for themselves unless they are admins
    if (createDIDInput.controller !== currentUser.id && currentUser.role !== UserRole.ADMIN) {
      throw new Error('Unauthorized to create DID for another user');
    }
    
    return this.didService.create(createDIDInput);
  }

  @Mutation(() => DID)
  @UseGuards(JwtAuthGuard)
  async updateDID(
    @Args('updateDIDInput') updateDIDInput: UpdateDIDInput,
    @CurrentUser() currentUser: User,
  ) {
    const did = await this.didService.findOne(updateDIDInput.id);
    
    // Only allow users to update their own DIDs unless they are admins
    if (did.controller !== currentUser.id && currentUser.role !== UserRole.ADMIN) {
      throw new Error('Unauthorized to update this DID');
    }
    
    return this.didService.update(updateDIDInput.id, updateDIDInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async removeDID(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() currentUser: User,
  ) {
    const did = await this.didService.findOne(id);
    
    // Only allow users to remove their own DIDs unless they are admins
    if (did.controller !== currentUser.id && currentUser.role !== UserRole.ADMIN) {
      throw new Error('Unauthorized to remove this DID');
    }
    
    await this.didService.remove(id);
    return true;
  }

  @Query(() => [DID], { name: 'myDIDs' })
  @UseGuards(JwtAuthGuard)
  async findMyDIDs(@CurrentUser() currentUser: User) {
    return this.didService.findByController(currentUser.id);
  }

  @ResolveField(() => User, { nullable: true })
  async controller(@Parent() did: DID) {
    return this.usersService.findOne(did.controller);
  }
}
