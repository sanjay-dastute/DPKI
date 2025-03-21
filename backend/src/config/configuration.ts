import blockchainConfig from './blockchain.config';

export default (): Record<string, any> => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    postgres: {
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'quantumtrust',
    },
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
      database: process.env.MONGODB_DB || 'quantumtrust',
    },
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'quantumtrust_secret_key_replace_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '30m',
  },
  oauth: {
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    callbackUrl: process.env.OAUTH_CALLBACK_URL,
  },
  blockchain: blockchainConfig(),
  security: {
    encryptionKey: process.env.ENCRYPTION_KEY || 'quantumtrust_encryption_key_replace_in_production',
  },
  kafka: {
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    clientId: process.env.KAFKA_CLIENT_ID || 'quantumtrust',
  },
});
