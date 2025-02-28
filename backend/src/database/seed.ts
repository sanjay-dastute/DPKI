import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

// Import TypeORM entities
import { User } from '../modules/users/entities/user.entity';
import { DID } from '../modules/did/entities/did.entity';
import { getRepository } from 'typeorm';

// Import MongoDB schemas
import { VerifiableCredential } from '../modules/verifiable-credentials/schemas/verifiable-credential.schema';
import { Document } from '../modules/documents/schemas/document.schema';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    console.log('Starting seed process...');

    // Get repositories and models
    const userRepository = getRepository(User);
    const didRepository = getRepository(DID);
    const verifiableCredentialModel = app.get<Model<VerifiableCredential>>(
      getModelToken(VerifiableCredential.name),
    );
    const documentModel = app.get<Model<Document>>(
      getModelToken(Document.name),
    );

    // Clear existing data
    console.log('Clearing existing data...');
    await userRepository.delete({});
    await didRepository.delete({});
    await verifiableCredentialModel.deleteMany({});
    await documentModel.deleteMany({});

    // Load seed data
    const seedDataDir = path.join(__dirname, 'seed-data');
    
    // Load and seed users
    console.log('Seeding users...');
    const usersData = JSON.parse(
      fs.readFileSync(path.join(seedDataDir, 'users.json'), 'utf8'),
    );
    
    for (const userData of usersData) {
      // Hash password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Create user with hashed password
      await userRepository.save({
        ...userData,
        password: hashedPassword,
      });
    }
    
    // Load and seed DIDs
    console.log('Seeding DIDs...');
    const didsData = JSON.parse(
      fs.readFileSync(path.join(seedDataDir, 'dids.json'), 'utf8'),
    );
    
    for (const didData of didsData) {
      await didRepository.save(didData);
    }
    
    // Load and seed verifiable credentials
    console.log('Seeding verifiable credentials...');
    const verifiableCredentialsData = JSON.parse(
      fs.readFileSync(path.join(seedDataDir, 'verifiable-credentials.json'), 'utf8'),
    );
    
    for (const vcData of verifiableCredentialsData) {
      await verifiableCredentialModel.create(vcData);
    }
    
    // Load and seed documents
    console.log('Seeding documents...');
    const documentsData = JSON.parse(
      fs.readFileSync(path.join(seedDataDir, 'documents.json'), 'utf8'),
    );
    
    for (const documentData of documentsData) {
      await documentModel.create(documentData);
    }
    
    // Load and seed logs
    console.log('Seeding logs...');
    const logTypes = [
      'individual_user_logs',
      'tourist_user_logs',
      'business_user_logs',
      'government_user_logs',
      'admin_user_logs',
    ];
    
    // Create a logs collection in MongoDB
    const db = verifiableCredentialModel.db;
    const logsCollection = db.collection('logs');
    
    // Clear existing logs
    await logsCollection.deleteMany({});
    
    // Seed logs for each user type
    for (const logType of logTypes) {
      const logsData = JSON.parse(
        fs.readFileSync(path.join(seedDataDir, 'logs', `${logType}.json`), 'utf8'),
      );
      
      for (const userLogs of logsData) {
        for (const log of userLogs.logs) {
          await logsCollection.insertOne({
            ...log,
            userId: userLogs.userId,
          });
        }
      }
    }

    console.log('Seed completed successfully!');
    console.log('Sample data summary:');
    console.log(`- Users: ${usersData.length}`);
    console.log(`- DIDs: ${didsData.length}`);
    console.log(`- Verifiable Credentials: ${verifiableCredentialsData.length}`);
    console.log(`- Documents: ${documentsData.length}`);
    
    // Print user credentials for reference
    console.log('\nUser Credentials:');
    console.log('--------------------------------------------------');
    console.log('| Username          | Password    | Role         |');
    console.log('--------------------------------------------------');
    for (const user of usersData) {
      console.log(`| ${user.username.padEnd(18)} | ${user.password.padEnd(11)} | ${user.role.padEnd(12)} |`);
    }
    console.log('--------------------------------------------------');
    console.log('\nAdmin Credentials:');
    console.log('--------------------------------------------------');
    console.log('| Username          | Password    |');
    console.log('--------------------------------------------------');
    const admin = usersData.find(user => user.role === 'ADMIN');
    console.log(`| ${admin.username.padEnd(18)} | ${admin.password.padEnd(11)} |`);
    console.log('--------------------------------------------------');

  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
