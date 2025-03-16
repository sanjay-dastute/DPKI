import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { SeedsModule } from './index';
import { DemoDataSeeder } from './demo-data.seed';

async function bootstrap() {
  const logger = new Logger('SeedScript');
  
  try {
    logger.log('Starting seed script...');
    
    const app = await NestFactory.createApplicationContext(AppModule);
    const seedsApp = await NestFactory.create(SeedsModule);
    const seeder = seedsApp.get(DemoDataSeeder);
    
    await seeder.seed();
    
    logger.log('Seed script completed successfully!');
    await app.close();
    await seedsApp.close();
    process.exit(0);
  } catch (error) {
    logger.error(`Error during seed: ${error.message}`, error.stack);
    process.exit(1);
  }
}

bootstrap();
