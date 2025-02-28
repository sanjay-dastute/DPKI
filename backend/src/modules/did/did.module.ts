import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DIDService } from './did.service';
import { DIDController } from './did.controller';
import { DID } from './entities/did.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DID]),
    UsersModule,
  ],
  controllers: [DIDController],
  providers: [DIDService],
  exports: [DIDService],
})
export class DIDModule {}
