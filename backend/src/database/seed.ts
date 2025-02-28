import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/users.service';
import { DIDService } from '../modules/did/did.service';
import { VerifiableCredentialsService } from '../modules/verifiable-credentials/verifiable-credentials.service';
import { DocumentsService } from '../modules/documents/documents.service';
import { UserRole } from '../modules/users/entities/user.entity';
import { DocumentType } from '../modules/documents/schemas/document.schema';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const didService = app.get(DIDService);
  const vcService = app.get(VerifiableCredentialsService);
  const documentsService = app.get(DocumentsService);

  // Create admin user
  const admin = await usersService.create({
    username: 'admin',
    email: 'admin@quantumtrust.com',
    password: 'admin123',
    role: UserRole.ADMIN,
    country: 'Singapore',
  });

  console.log('Admin user created:', admin.username);

  // Create 5 individual citizens
  const citizens = [];
  for (let i = 1; i <= 5; i++) {
    const citizen = await usersService.create({
      username: `citizen${i}`,
      email: `citizen${i}@example.com`,
      password: `citizen${i}123`,
      role: UserRole.CITIZEN,
      country: i <= 3 ? 'Singapore' : 'Saudi Arabia',
    });
    citizens.push(citizen);
    console.log('Citizen created:', citizen.username);
  }

  // Create 5 tourists
  const tourists = [];
  for (let i = 1; i <= 5; i++) {
    const tourist = await usersService.create({
      username: `tourist${i}`,
      email: `tourist${i}@example.com`,
      password: `tourist${i}123`,
      role: UserRole.TOURIST,
      country: i <= 3 ? 'United States' : 'United Kingdom',
    });
    tourists.push(tourist);
    console.log('Tourist created:', tourist.username);
  }

  // Create 5 business entities
  const businesses = [];
  for (let i = 1; i <= 5; i++) {
    const business = await usersService.create({
      username: `business${i}`,
      email: `business${i}@example.com`,
      password: `business${i}123`,
      role: UserRole.BUSINESS,
      country: i <= 3 ? 'Singapore' : 'Saudi Arabia',
    });
    businesses.push(business);
    console.log('Business created:', business.username);
  }

  // Create 4 government entities
  const governments = [];
  for (let i = 1; i <= 4; i++) {
    const government = await usersService.create({
      username: `government${i}`,
      email: `government${i}@example.com`,
      password: `government${i}123`,
      role: UserRole.GOVERNMENT,
      country: i <= 2 ? 'Singapore' : 'Saudi Arabia',
    });
    governments.push(government);
    console.log('Government entity created:', government.username);
  }

  // Create DIDs for all users
  for (const user of [admin, ...citizens, ...tourists, ...businesses, ...governments]) {
    const did = await didService.create(user.id);
    console.log('DID created for', user.username, ':', did.did);
  }

  // Create documents for citizens
  for (const citizen of citizens) {
    const documentTypes = [
      DocumentType.NRIC,
      DocumentType.PASSPORT,
      DocumentType.PROOF_OF_RESIDENCY,
    ];

    for (const type of documentTypes) {
      // Create a dummy file buffer
      const fileBuffer = Buffer.from(`Sample document for ${citizen.username} of type ${type}`);
      
      const document = await documentsService.upload(
        citizen.id,
        citizen.did,
        type,
        fileBuffer,
      );
      
      console.log('Document created for', citizen.username, ':', document.id);
    }
  }

  // Create documents for tourists
  for (const tourist of tourists) {
    const documentTypes = [
      DocumentType.PASSPORT,
      DocumentType.VISA,
    ];

    for (const type of documentTypes) {
      // Create a dummy file buffer
      const fileBuffer = Buffer.from(`Sample document for ${tourist.username} of type ${type}`);
      
      const document = await documentsService.upload(
        tourist.id,
        tourist.did,
        type,
        fileBuffer,
      );
      
      console.log('Document created for', tourist.username, ':', document.id);
    }
  }

  // Create documents for businesses
  for (const business of businesses) {
    const documentTypes = [
      DocumentType.BUSINESS_LICENSE,
    ];

    for (const type of documentTypes) {
      // Create a dummy file buffer
      const fileBuffer = Buffer.from(`Sample document for ${business.username} of type ${type}`);
      
      const document = await documentsService.upload(
        business.id,
        business.did,
        type,
        fileBuffer,
      );
      
      console.log('Document created for', business.username, ':', document.id);
    }
  }

  // Issue verifiable credentials
  // For citizens
  for (const citizen of citizens) {
    const credentialTypes = ['NationalID', 'ResidencyStatus'];
    
    for (const type of credentialTypes) {
      const claims = {
        name: `Citizen ${citizen.username.replace('citizen', '')}`,
        dateOfBirth: `1980-01-${citizen.username.replace('citizen', '')}`,
        nationality: citizen.country,
        idNumber: `ID${Math.floor(Math.random() * 1000000)}`,
      };
      
      const credential = await vcService.issue(
        governments[0].did, // Issuer (government)
        citizen.did, // Holder (citizen)
        type,
        claims,
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Expires in 1 year
      );
      
      console.log('Credential issued for', citizen.username, ':', credential.id);
    }
  }

  // For tourists
  for (const tourist of tourists) {
    const credentialTypes = ['VisaStatus', 'TravelAuthorization'];
    
    for (const type of credentialTypes) {
      const claims = {
        name: `Tourist ${tourist.username.replace('tourist', '')}`,
        dateOfBirth: `1985-02-${tourist.username.replace('tourist', '')}`,
        nationality: tourist.country,
        passportNumber: `P${Math.floor(Math.random() * 1000000)}`,
        entryDate: new Date().toISOString(),
        exitDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
      
      const credential = await vcService.issue(
        governments[1].did, // Issuer (government)
        tourist.did, // Holder (tourist)
        type,
        claims,
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days
      );
      
      console.log('Credential issued for', tourist.username, ':', credential.id);
    }
  }

  // For businesses
  for (const business of businesses) {
    const credentialTypes = ['BusinessRegistration', 'TaxCompliance'];
    
    for (const type of credentialTypes) {
      const claims = {
        businessName: `Business ${business.username.replace('business', '')} Corp`,
        registrationNumber: `B${Math.floor(Math.random() * 1000000)}`,
        industry: ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing'][Math.floor(Math.random() * 5)],
        foundingDate: `2010-03-${business.username.replace('business', '')}`,
        legalStatus: 'Corporation',
      };
      
      const credential = await vcService.issue(
        governments[2].did, // Issuer (government)
        business.did, // Holder (business)
        type,
        claims,
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Expires in 1 year
      );
      
      console.log('Credential issued for', business.username, ':', credential.id);
    }
  }

  console.log('Database seeded successfully!');
  await app.close();
}

bootstrap();
