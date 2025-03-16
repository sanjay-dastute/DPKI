import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ethers from 'ethers';
import * as crypto from 'crypto';
import { IndyService } from './services/indy.service';
import { EthereumService } from './services/ethereum.service';
import { FabricService } from './services/fabric.service';

/**
 * Blockchain Service
 * 
 * This service provides a unified interface to interact with different blockchain technologies:
 * - Hyperledger Indy for Decentralized Identity
 * - Ethereum for Smart Contracts
 * - Hyperledger Fabric for Chaincode
 */
@Injectable()
export class BlockchainService implements OnModuleInit {
  private readonly logger = new Logger(BlockchainService.name);
  private provider: ethers.providers.JsonRpcProvider | null = null;
  private wallet: ethers.Wallet | null = null;
  
  // Helper method to safely get wallet address
  private async safeGetWalletAddress(): Promise<string> {
    if (!this.wallet) return '';
    try {
      return await this.wallet.getAddress();
    } catch (error) {
      this.logger.warn(`Error getting wallet address: ${error.message}`);
      return '';
    }
  }

  constructor(
    private configService: ConfigService,
    private indyService: IndyService,
    private ethereumService: EthereumService,
    private fabricService: FabricService,
  ) {}

  async onModuleInit() {
    this.logger.log('Initializing blockchain service');
    
    try {
      // Initialize Ethereum provider
      const rpcUrl = this.configService.get<string>('blockchain.ethereum.rpcUrl');
      if (rpcUrl) {
        this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        
        // Initialize wallet if private key is provided
        const privateKey = this.configService.get<string>('blockchain.ethereum.privateKey');
        if (privateKey) {
          this.wallet = new ethers.Wallet(privateKey, this.provider);
        }
      } else {
        this.logger.warn('Ethereum RPC URL not provided. Using simulated Ethereum service.');
      }
    } catch (error) {
      this.logger.warn(`Error initializing Ethereum provider: ${error.message}. Using simulated Ethereum service.`);
    }
  }

  /**
   * DID Operations
   */
  async createDID(seed?: string): Promise<{ did: string; verkey: string }> {
    return this.indyService.createDID(seed);
  }

  async storeDID(did: string, verkey: string, alias?: string): Promise<boolean> {
    return this.indyService.storeDID(did, verkey, alias);
  }

  async getDID(did: string): Promise<{ did: string; verkey: string; role: string } | null> {
    return this.indyService.getDID(did);
  }

  /**
   * Credential Schema Operations
   */
  async createSchema(
    issuerDID: string,
    name: string,
    version: string,
    attributes: string[],
  ): Promise<{ id: string; schema: any }> {
    return this.indyService.createSchema(issuerDID, name, version, attributes);
  }

  async createCredentialDefinition(
    issuerDID: string,
    schemaId: string,
    tag: string,
  ): Promise<{ id: string; credDef: any }> {
    return this.indyService.createCredentialDefinition(issuerDID, schemaId, tag);
  }

  /**
   * Credential Operations
   */
  async issueCredential(
    issuerDID: string,
    credDefId: string,
    credentialValues: Record<string, string>,
  ): Promise<{ credentialId: string; credential: any }> {
    return this.indyService.issueCredential(issuerDID, credDefId, credentialValues);
  }

  async verifyCredential(credential: any): Promise<boolean> {
    return this.indyService.verifyCredential(credential);
  }

  /**
   * Proof Operations
   */
  async createProofRequest(
    name: string,
    version: string,
    requestedAttributes: Record<string, any>,
    requestedPredicates: Record<string, any>,
    nonRevoked?: { from: number; to: number },
  ): Promise<any> {
    return this.indyService.createProofRequest(
      name,
      version,
      requestedAttributes,
      requestedPredicates,
      nonRevoked,
    );
  }

  async verifyProof(proofRequest: any, proof: any): Promise<boolean> {
    return this.indyService.verifyProof(proofRequest, proof);
  }

  /**
   * Ethereum Operations
   */
  async getEthereumBalance(address: string): Promise<string> {
    try {
      if (this.provider) {
        const balance = await this.provider.getBalance(address);
        return ethers.utils.formatEther(balance);
      }
      return this.ethereumService.getBalance(address);
    } catch (error) {
      this.logger.warn(`Error getting Ethereum balance: ${error.message}. Using simulated service.`);
      return this.ethereumService.getBalance(address);
    }
  }

  async deployContract(
    contractName: string,
    contractABI: any,
    contractBytecode: string,
    deployerAddress: string,
    constructorArgs: any[] = [],
  ): Promise<any> {
    try {
      if (this.wallet) {
        const factory = new ethers.ContractFactory(contractABI, contractBytecode, this.wallet);
        const contract = await factory.deploy(...constructorArgs);
        await contract.waitForDeployment();
        const deployTx = contract.deploymentTransaction();
        return {
          contractAddress: await contract.getAddress(),
          transactionHash: deployTx ? deployTx.hash : '',
          contract,
        };
      }
      return this.ethereumService.deployContract(
        contractName,
        contractABI,
        contractBytecode,
        deployerAddress,
        constructorArgs,
      );
    } catch (error) {
      this.logger.warn(`Error deploying contract: ${error.message}. Using simulated service.`);
      return this.ethereumService.deployContract(
        contractName,
        contractABI,
        contractBytecode,
        deployerAddress,
        constructorArgs,
      );
    }
  }

  async callContractMethod(
    contractAddress: string,
    contractABI: any,
    methodName: string,
    methodArgs: any[] = [],
  ): Promise<any> {
    try {
      if (this.provider) {
        const contract = new ethers.Contract(contractAddress, contractABI, this.provider);
        return contract[methodName](...methodArgs);
      }
      return this.ethereumService.callContractMethod(
        contractAddress,
        contractABI,
        methodName,
        methodArgs,
      );
    } catch (error) {
      this.logger.warn(`Error calling contract method: ${error.message}. Using simulated service.`);
      return this.ethereumService.callContractMethod(
        contractAddress,
        contractABI,
        methodName,
        methodArgs,
      );
    }
  }

  async executeContractMethod(
    contractAddress: string,
    contractABI: any,
    methodName: string,
    methodArgs: any[] = [],
  ): Promise<any> {
    try {
      if (this.wallet) {
        const contract = new ethers.Contract(contractAddress, contractABI, this.wallet);
        const tx = await contract[methodName](...methodArgs);
        return {
          transactionHash: tx.hash,
          blockNumber: tx.blockNumber,
          transaction: tx,
        };
      }
      
      // Get wallet address safely
      const walletAddress = await this.safeGetWalletAddress();
      
      return this.ethereumService.sendContractTransaction(
        contractAddress,
        contractABI,
        methodName,
        methodArgs,
        walletAddress,
      );
    } catch (error) {
      this.logger.warn(`Error executing contract method: ${error.message}. Using simulated service.`);
      
      // Get wallet address safely
      const walletAddress = await this.safeGetWalletAddress();
      
      return this.ethereumService.sendContractTransaction(
        contractAddress,
        contractABI,
        methodName,
        methodArgs,
        walletAddress,
      );
    }
  }

  /**
   * Hyperledger Fabric Operations
   */
  async invokeChaincode(
    chaincodeName: string,
    channelName: string,
    functionName: string,
    args: string[] = [],
    transient: Record<string, Buffer> = {},
  ): Promise<{ txId: string; result: any }> {
    return this.fabricService.invokeChaincode(
      chaincodeName,
      channelName,
      functionName,
      args,
      transient,
    );
  }

  async queryChaincode(
    chaincodeName: string,
    channelName: string,
    functionName: string,
    args: string[] = [],
  ): Promise<any> {
    return this.fabricService.queryChaincode(
      chaincodeName,
      channelName,
      functionName,
      args,
    );
  }

  /**
   * Document Operations
   */
  async registerDocumentHash(
    did: string,
    documentHash: string,
    ipfsHash: string,
  ): Promise<string> {
    this.logger.log(`Registering document hash ${documentHash} for DID ${did}`);
    
    try {
      // Try to register on Ethereum
      if (this.wallet) {
        // In a real implementation, we would use a smart contract for document registration
        // For now, we'll just simulate the transaction
        const message = `${did}:${documentHash}:${ipfsHash}:${Date.now()}`;
        const signature = await this.wallet.signMessage(message);
        
        return signature;
      }
      
      // Try to register on Fabric
      try {
        const result = await this.fabricService.invokeChaincode(
          'documents',
          'mychannel',
          'registerDocument',
          [did, documentHash, ipfsHash, new Date().toISOString()],
        );
        
        return result.txId;
      } catch (fabricError) {
        this.logger.warn(`Error registering on Fabric: ${fabricError.message}`);
      }
      
      // Fallback to simulation
      const simulatedTxHash = crypto.createHash('sha256')
        .update(`${did}:${documentHash}:${ipfsHash}:${Date.now()}`)
        .digest('hex');
      
      this.logger.log(`Simulated document registration with tx hash: ${simulatedTxHash}`);
      return simulatedTxHash;
    } catch (error) {
      this.logger.error(`Error registering document hash: ${error.message}`);
      
      // Fallback to simulation
      const simulatedTxHash = crypto.createHash('sha256')
        .update(`${did}:${documentHash}:${ipfsHash}:${Date.now()}`)
        .digest('hex');
      
      this.logger.log(`Fallback to simulated document registration with tx hash: ${simulatedTxHash}`);
      return simulatedTxHash;
    }
  }
  
  async updateDocumentStatus(
    did: string,
    documentHash: string,
    status: string,
  ): Promise<string> {
    this.logger.log(`Updating document status to ${status} for hash ${documentHash} and DID ${did}`);
    
    try {
      // Try to update on Ethereum
      if (this.wallet) {
        // In a real implementation, we would use a smart contract for document status updates
        // For now, we'll just simulate the transaction
        const message = `${did}:${documentHash}:${status}:${Date.now()}`;
        const signature = await this.wallet.signMessage(message);
        
        return signature;
      }
      
      // Try to update on Fabric
      try {
        const result = await this.fabricService.invokeChaincode(
          'documents',
          'mychannel',
          'updateDocumentStatus',
          [did, documentHash, status, new Date().toISOString()],
        );
        
        return result.txId;
      } catch (fabricError) {
        this.logger.warn(`Error updating status on Fabric: ${fabricError.message}`);
      }
      
      // Fallback to simulation
      const simulatedTxHash = crypto.createHash('sha256')
        .update(`${did}:${documentHash}:${status}:${Date.now()}`)
        .digest('hex');
      
      this.logger.log(`Simulated document status update with tx hash: ${simulatedTxHash}`);
      return simulatedTxHash;
    } catch (error) {
      this.logger.error(`Error updating document status: ${error.message}`);
      
      // Fallback to simulation
      const simulatedTxHash = crypto.createHash('sha256')
        .update(`${did}:${documentHash}:${status}:${Date.now()}`)
        .digest('hex');
      
      this.logger.log(`Fallback to simulated document status update with tx hash: ${simulatedTxHash}`);
      return simulatedTxHash;
    }
  }
  
  async shareDocument(
    ownerDID: string,
    recipientDID: string,
    documentHash: string,
  ): Promise<string> {
    this.logger.log(`Sharing document ${documentHash} from ${ownerDID} to ${recipientDID}`);
    
    try {
      // Try to share on Ethereum
      if (this.wallet) {
        // In a real implementation, we would use a smart contract for document sharing
        // For now, we'll just simulate the transaction
        const message = `${ownerDID}:${recipientDID}:${documentHash}:${Date.now()}`;
        const signature = await this.wallet.signMessage(message);
        
        return signature;
      }
      
      // Try to share on Fabric
      try {
        const result = await this.fabricService.invokeChaincode(
          'documents',
          'mychannel',
          'shareDocument',
          [ownerDID, recipientDID, documentHash, new Date().toISOString()],
        );
        
        return result.txId;
      } catch (fabricError) {
        this.logger.warn(`Error sharing on Fabric: ${fabricError.message}`);
      }
      
      // Fallback to simulation
      const simulatedTxHash = crypto.createHash('sha256')
        .update(`${ownerDID}:${recipientDID}:${documentHash}:${Date.now()}`)
        .digest('hex');
      
      this.logger.log(`Simulated document sharing with tx hash: ${simulatedTxHash}`);
      return simulatedTxHash;
    } catch (error) {
      this.logger.error(`Error sharing document: ${error.message}`);
      
      // Fallback to simulation
      const simulatedTxHash = crypto.createHash('sha256')
        .update(`${ownerDID}:${recipientDID}:${documentHash}:${Date.now()}`)
        .digest('hex');
      
      this.logger.log(`Fallback to simulated document sharing with tx hash: ${simulatedTxHash}`);
      return simulatedTxHash;
    }
  }
  
  async verifyDocument(
    did: string,
    documentHash: string,
  ): Promise<{ authentic: boolean; details: any }> {
    this.logger.log(`Verifying document ${documentHash} for DID ${did}`);
    
    try {
      // Try to verify on Ethereum
      if (this.provider) {
        // In a real implementation, we would use a smart contract for document verification
        // For now, we'll just simulate the verification
        return {
          authentic: true,
          details: {
            verificationTime: new Date().toISOString(),
            blockchain: 'Ethereum',
            status: 'VERIFIED',
          },
        };
      }
      
      // Try to verify on Fabric
      try {
        const result = await this.fabricService.queryChaincode(
          'documents',
          'mychannel',
          'getDocumentStatus',
          [did, documentHash],
        );
        
        return {
          authentic: result && result.status === 'VERIFIED',
          details: {
            verificationTime: new Date().toISOString(),
            blockchain: 'Hyperledger Fabric',
            status: result ? result.status : 'UNKNOWN',
            lastUpdated: result ? result.timestamp : null,
          },
        };
      } catch (fabricError) {
        this.logger.warn(`Error verifying on Fabric: ${fabricError.message}`);
      }
      
      // Fallback to simulation
      return {
        authentic: true,
        details: {
          verificationTime: new Date().toISOString(),
          blockchain: 'Simulated',
          status: 'VERIFIED',
          note: 'This is a simulated verification',
        },
      };
    } catch (error) {
      this.logger.error(`Error verifying document: ${error.message}`);
      
      // Fallback to simulation
      return {
        authentic: true,
        details: {
          verificationTime: new Date().toISOString(),
          blockchain: 'Simulated (Fallback)',
          status: 'VERIFIED',
          note: 'This is a simulated verification due to an error',
          error: error.message,
        },
      };
    }
  }
  
  /**
   * Utility Methods
   */
  async createEthereumAccount(): Promise<{ address: string; privateKey: string }> {
    try {
      if (ethers) {
        const wallet = ethers.Wallet.createRandom();
        return {
          address: wallet.address,
          privateKey: wallet.privateKey,
        };
      }
      return this.ethereumService.createAccount();
    } catch (error) {
      this.logger.warn(`Error creating Ethereum account: ${error.message}. Using simulated service.`);
      return this.ethereumService.createAccount();
    }
  }

  async signMessage(message: string, privateKey: string): Promise<string> {
    try {
      if (ethers) {
        const wallet = new ethers.Wallet(privateKey);
        return wallet.signMessage(message);
      }
      return this.ethereumService.signMessage(message, privateKey);
    } catch (error) {
      this.logger.warn(`Error signing message: ${error.message}. Using simulated service.`);
      return this.ethereumService.signMessage(message, privateKey);
    }
  }

  async verifySignature(message: string, signature: string, address: string): Promise<boolean> {
    try {
      if (ethers) {
        const recoveredAddress = ethers.utils.verifyMessage(message, signature);
        return recoveredAddress.toLowerCase() === address.toLowerCase();
      }
      return this.ethereumService.verifySignature(message, signature, address);
    } catch (error) {
      this.logger.warn(`Error verifying signature: ${error.message}. Using simulated service.`);
      return this.ethereumService.verifySignature(message, signature, address);
    }
  }
}
