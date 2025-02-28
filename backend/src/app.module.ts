import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import configuration from './config/configuration';

// Import modules
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { DIDModule } from './modules/did/did.module';
import { BlockchainModule } from './modules/blockchain/blockchain.module';
import { VerifiableCredentialsModule } from './modules/verifiable-credentials/verifiable-credentials.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { AdminModule } from './modules/admin/admin.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    
    // PostgreSQL Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.postgres.host'),
        port: configService.get('database.postgres.port'),
        username: configService.get('database.postgres.username'),
        password: configService.get('database.postgres.password'),
        database: configService.get('database.postgres.database'),
        entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
        synchronize: true, // Set to false in production
      }),
    }),
    
    // MongoDB Database
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: `${configService.get('database.mongodb.uri')}/${configService.get('database.mongodb.database')}`,
      }),
    }),
    
    // GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
    }),
    
    // Application Modules
    UsersModule,
    AuthModule,
    DIDModule,
    BlockchainModule,
    VerifiableCredentialsModule,
    DocumentsModule,
    AdminModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
