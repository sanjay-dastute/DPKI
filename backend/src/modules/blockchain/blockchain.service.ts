import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
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
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;

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
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        
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
        return ethers.formatEther(balance);
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
      let walletAddress = '';
      if (this.wallet) {
        walletAddress = await this.wallet.getAddress();
      }
      
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
      let walletAddress = '';
      if (this.wallet) {
        walletAddress = await this.wallet.getAddress();
      }
      
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
        const recoveredAddress = ethers.verifyMessage(message, signature);
        return recoveredAddress.toLowerCase() === address.toLowerCase();
      }
      return this.ethereumService.verifySignature(message, signature, address);
    } catch (error) {
      this.logger.warn(`Error verifying signature: ${error.message}. Using simulated service.`);
      return this.ethereumService.verifySignature(message, signature, address);
    }
  }
}
