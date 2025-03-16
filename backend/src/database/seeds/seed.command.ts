import { Command, CommandRunner } from 'nest-commander';
import { DemoDataSeeder } from './demo-data.seed';
import { Logger } from '@nestjs/common';

@Command({ name: 'seed:demo', description: 'Seed demo data for the application' })
export class SeedDemoCommand implements CommandRunner {
  private readonly logger = new Logger(SeedDemoCommand.name);

  constructor(private readonly demoDataSeeder: DemoDataSeeder) {}

  async run(): Promise<void> {
    try {
      this.logger.log('Starting demo data seeding...');
      await this.demoDataSeeder.seed();
      this.logger.log('Demo data seeding completed successfully!');
    } catch (error) {
      this.logger.error(`Error seeding demo data: ${error.message}`, error.stack);
      throw error;
    }
  }
}
