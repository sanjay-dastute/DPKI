import { registerAs } from '@nestjs/config';

export default registerAs('blockchain', () => ({
  ethereum: {
    rpcUrl: process.env.ETHEREUM_RPC_URL || 'http://localhost:8545',
    privateKey: process.env.ETHEREUM_PRIVATE_KEY,
    network: process.env.ETHEREUM_NETWORK || 'development',
    contracts: {
      didRegistry: process.env.ETHEREUM_DID_REGISTRY_ADDRESS,
      credentialRegistry: process.env.ETHEREUM_CREDENTIAL_REGISTRY_ADDRESS,
    },
  },
  hyperledgerIndy: {
    poolName: process.env.INDY_POOL_NAME || 'quantum_trust_pool',
    poolConfig: process.env.INDY_POOL_CONFIG || '{"genesis_txn": "./config/indy/pool_transactions_genesis"}',
    walletName: process.env.INDY_WALLET_NAME || 'quantum_trust_wallet',
    walletKey: process.env.INDY_WALLET_KEY,
    did: process.env.INDY_DID,
    seed: process.env.INDY_SEED,
  },
  hyperledgerFabric: {
    connectionProfile: process.env.FABRIC_CONNECTION_PROFILE || './config/fabric/connection-profile.json',
    channelName: process.env.FABRIC_CHANNEL_NAME || 'quantumtrust-channel',
    chaincodeId: process.env.FABRIC_CHAINCODE_ID || 'quantumtrust-chaincode',
    walletPath: process.env.FABRIC_WALLET_PATH || './config/fabric/wallet',
    identityLabel: process.env.FABRIC_IDENTITY_LABEL || 'admin',
    mspId: process.env.FABRIC_MSP_ID || 'Org1MSP',
  },
  didComm: {
    endpoint: process.env.DIDCOMM_ENDPOINT || 'http://localhost:3000/api/didcomm',
    mediatorUrl: process.env.DIDCOMM_MEDIATOR_URL,
  },
  cryptography: {
    quantumResistant: process.env.USE_QUANTUM_RESISTANT === 'true' || false,
    kyberParams: process.env.KYBER_PARAMS || 'kyber768',
    dilithiumParams: process.env.DILITHIUM_PARAMS || 'dilithium3',
  },
}));
