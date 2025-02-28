import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { VerifiableCredentialsService } from '../../verifiable-credentials/verifiable-credentials.service';
import { UsersService } from '../../users/users.service';
import { DIDService } from '../../did/did.service';
import { VerifiableCredential } from '../types/verifiable-credential.type';
import { User } from '../types/user.type';
import { DID } from '../types/did.type';
import { CreateVerifiableCredentialInput } from '../inputs/create-verifiable-credential.input';
import { UpdateVerifiableCredentialInput } from '../inputs/update-verifiable-credential.input';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { CurrentUser } from '../decorators/current-user.decorator';

@Resolver(() => VerifiableCredential)
export class VerifiableCredentialsResolver {
  constructor(
    private readonly verifiableCredentialsService: VerifiableCredentialsService,
    private readonly usersService: UsersService,
    private readonly didService: DIDService,
  ) {}

  @Query(() => [VerifiableCredential], { name: 'verifiableCredentials' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll() {
    return this.verifiableCredentialsService.findAll();
  }

  @Query(() => VerifiableCredential, { name: 'verifiableCredential' })
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() currentUser: User,
  ) {
    const credential = await this.verifiableCredentialsService.findOne(id);
    
    // Check if the user is authorized to access this credential
    if (credential.holder !== currentUser.id && 
        credential.issuer !== currentUser.id && 
        currentUser.role !== UserRole.ADMIN) {
      throw new Error('Unauthorized access to verifiable credential');
    }
    
    return credential;
  }

  @Mutation(() => VerifiableCredential)
  @UseGuards(JwtAuthGuard)
  async createVerifiableCredential(
    @Args('createVerifiableCredentialInput') createVerifiableCredentialInput: CreateVerifiableCredentialInput,
    @CurrentUser() currentUser: User,
  ) {
    // Only allow users to issue credentials if they are the issuer or an admin
    if (createVerifiableCredentialInput.issuer !== currentUser.id && currentUser.role !== UserRole.ADMIN) {
      throw new Error('Unauthorized to issue credential as another user');
    }
    
    return this.verifiableCredentialsService.create(createVerifiableCredentialInput);
  }

  @Mutation(() => VerifiableCredential)
  @UseGuards(JwtAuthGuard)
  async updateVerifiableCredential(
    @Args('updateVerifiableCredentialInput') updateVerifiableCredentialInput: UpdateVerifiableCredentialInput,
    @CurrentUser() currentUser: User,
  ) {
    const credential = await this.verifiableCredentialsService.findOne(updateVerifiableCredentialInput.id);
    
    // Only allow users to update credentials they issued or admins
    if (credential.issuer !== currentUser.id && currentUser.role !== UserRole.ADMIN) {
      throw new Error('Unauthorized to update this credential');
    }
    
    return this.verifiableCredentialsService.update(
      updateVerifiableCredentialInput.id, 
      updateVerifiableCredentialInput
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async revokeVerifiableCredential(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() currentUser: User,
  ) {
    const credential = await this.verifiableCredentialsService.findOne(id);
    
    // Only allow users to revoke credentials they issued or admins
    if (credential.issuer !== currentUser.id && currentUser.role !== UserRole.ADMIN) {
      throw new Error('Unauthorized to revoke this credential');
    }
    
    await this.verifiableCredentialsService.revoke(id);
    return true;
  }

  @Query(() => [VerifiableCredential], { name: 'myIssuedCredentials' })
  @UseGuards(JwtAuthGuard)
  async findMyIssuedCredentials(@CurrentUser() currentUser: User) {
    return this.verifiableCredentialsService.findByIssuer(currentUser.id);
  }

  @Query(() => [VerifiableCredential], { name: 'myCredentials' })
  @UseGuards(JwtAuthGuard)
  async findMyCredentials(@CurrentUser() currentUser: User) {
    return this.verifiableCredentialsService.findByHolder(currentUser.id);
  }

  @ResolveField(() => User, { nullable: true })
  async issuer(@Parent() credential: VerifiableCredential) {
    return this.usersService.findOne(credential.issuer);
  }

  @ResolveField(() => User, { nullable: true })
  async holder(@Parent() credential: VerifiableCredential) {
    return this.usersService.findOne(credential.holder);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async verifyCredential(
    @Args('id', { type: () => String }) id: string,
  ) {
    return this.verifiableCredentialsService.verify(id);
  }
}
