import { Module } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersResolver } from './resolvers/users.resolver';
import { DIDResolver } from './resolvers/did.resolver';
import { VerifiableCredentialsResolver } from './resolvers/verifiable-credentials.resolver';
import { DocumentsResolver } from './resolvers/documents.resolver';
import { UsersModule } from '../users/users.module';
import { DIDModule } from '../did/did.module';
import { VerifiableCredentialsModule } from '../verifiable-credentials/verifiable-credentials.module';
import { DocumentsModule } from '../documents/documents.module';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { AuthModule } from '../auth/auth.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    ConfigModule,
    NestGraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
        playground: configService.get('NODE_ENV') !== 'production',
        introspection: configService.get('NODE_ENV') !== 'production',
        context: ({ req }) => ({ req }),
        cors: {
          origin: configService.get('CORS_ORIGIN', '*'),
          credentials: true,
        },
        formatError: (error) => {
          const graphQLFormattedError = {
            message: error.message,
            path: error.path,
            extensions: {
              code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
              stacktrace: 
                configService.get('NODE_ENV') !== 'production'
                  ? error.extensions?.stacktrace
                  : undefined,
            },
          };
          return graphQLFormattedError;
        },
      }),
    }),
    UsersModule,
    DIDModule,
    VerifiableCredentialsModule,
    DocumentsModule,
    BlockchainModule,
    AuthModule,
    AiModule,
  ],
  providers: [
    UsersResolver,
    DIDResolver,
    VerifiableCredentialsResolver,
    DocumentsResolver,
  ],
})
export class GraphQLModule {}
