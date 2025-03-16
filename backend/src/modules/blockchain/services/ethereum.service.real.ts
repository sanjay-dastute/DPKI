import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ethers from 'ethers';

/**
 * Ethereum Service
 * 
 * This service provides integration with Ethereum blockchain networks.
 * It uses ethers.js for Ethereum interactions.
 */
@Injectable()
export class EthereumService {
  private readonly logger = new Logger(EthereumService.name);
  private provider: ethers.providers.JsonRpcProvider;
  
  constructor(private configService: ConfigService) {
    this.logger.log('Initializing Ethereum service');
    this.initProvider();
  }
  
  /**
   * Initialize the Ethereum provider
   */
  private initProvider() {
    try {
      const rpcUrl = this.configService.get<string>('ETHEREUM_RPC_URL', 'https://mainnet.infura.io/v3/your-infura-key');
      
      // Check if we're using a local development network
      if (rpcUrl.includes('localhost') || rpcUrl.includes('127.0.0.1')) {
        this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        this.logger.log(`Connected to local Ethereum network at ${rpcUrl}`);
      } else {
        // For production networks, we might want to use a WebSocketProvider for real-time events
        this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        this.logger.log(`Connected to Ethereum network at ${rpcUrl}`);
      }
    } catch (error) {
      this.logger.error(`Failed to initialize Ethereum provider: ${error.message}`);
      // Fallback to a simulated provider for development
      this.provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
      this.logger.warn('Using fallback local provider for development');
    }
  }

  /**
   * Deploy a smart contract
   * 
   * @param contractName The name of the contract
   * @param contractABI The ABI of the contract
   * @param contractBytecode The bytecode of the contract
   * @param deployerAddress The address of the deployer
   * @param constructorArgs The constructor arguments
   * @returns The contract address and transaction hash
   */
  async deployContract(
    contractName: string,
    contractABI: any,
    contractBytecode: string,
    deployerAddress: string,
    constructorArgs: any[] = [],
  ): Promise<{ contractAddress: string; transactionHash: string }> {
    this.logger.log(`Deploying contract ${contractName} from address ${deployerAddress}`);
    
    try {
      // Get the private key from the config
      const privateKey = this.configService.get<string>(`ETHEREUM_PRIVATE_KEY_${deployerAddress.replace('0x', '')}`);
      
      if (!privateKey) {
        throw new Error(`Private key not found for address ${deployerAddress}`);
      }
      
      // Create a wallet with the private key
      const wallet = new ethers.Wallet(privateKey, this.provider);
      
      // Create a contract factory
      const factory = new ethers.ContractFactory(contractABI, contractBytecode, wallet);
      
      // Deploy the contract
      const contract = await factory.deploy(...constructorArgs);
      
      // Wait for the contract to be deployed
      await contract.waitForDeployment();
      
      const contractAddress = await contract.getAddress();
      this.logger.log(`Contract deployed at address: ${contractAddress}`);
      
      const deployTx = contract.deploymentTransaction();
      
      return {
        contractAddress: contractAddress,
        transactionHash: deployTx.hash,
      };
    } catch (error) {
      this.logger.error(`Error deploying contract: ${error.message}`);
      throw error;
    }
  }

  /**
   * Call a smart contract method (read-only)
   * 
   * @param contractAddress The address of the contract
   * @param contractABI The ABI of the contract
   * @param methodName The name of the method to call
   * @param methodArgs The arguments to pass to the method
   * @returns The result of the method call
   */
  async callContractMethod(
    contractAddress: string,
    contractABI: any,
    methodName: string,
    methodArgs: any[] = [],
  ): Promise<any> {
    this.logger.log(`Calling method ${methodName} on contract ${contractAddress}`);
    
    try {
      // Create a contract instance
      const contract = new ethers.Contract(contractAddress, contractABI, this.provider);
      
      // Call the method
      const result = await contract[methodName](...methodArgs);
      
      return result;
    } catch (error) {
      this.logger.error(`Error calling contract method: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send a transaction to a smart contract (state-changing)
   * 
   * @param contractAddress The address of the contract
   * @param contractABI The ABI of the contract
   * @param methodName The name of the method to call
   * @param methodArgs The arguments to pass to the method
   * @param senderAddress The address of the sender
   * @param privateKey The private key of the sender (optional)
   * @returns The transaction hash and block number
   */
  async sendContractTransaction(
    contractAddress: string,
    contractABI: any,
    methodName: string,
    methodArgs: any[] = [],
    senderAddress: string,
    privateKey?: string,
  ): Promise<{ transactionHash: string; blockNumber: number }> {
    this.logger.log(`Sending transaction to method ${methodName} on contract ${contractAddress} from ${senderAddress}`);
    
    try {
      // If private key is not provided, try to get it from the config
      if (!privateKey) {
        privateKey = this.configService.get<string>(`ETHEREUM_PRIVATE_KEY_${senderAddress.replace('0x', '')}`);
        
        if (!privateKey) {
          throw new Error(`Private key not found for address ${senderAddress}`);
        }
      }
      
      // Create a wallet with the private key
      const wallet = new ethers.Wallet(privateKey, this.provider);
      
      // Create a contract instance
      const contract = new ethers.Contract(contractAddress, contractABI, wallet);
      
      // Send the transaction
      const tx = await contract[methodName](...methodArgs);
      
      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      
      this.logger.log(`Transaction sent: ${receipt.transactionHash} in block ${receipt.blockNumber}`);
      
      return {
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
      };
    } catch (error) {
      this.logger.error(`Error sending contract transaction: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get transaction receipt
   * 
   * @param transactionHash The hash of the transaction
   * @returns The transaction receipt
   */
  async getTransactionReceipt(transactionHash: string): Promise<any> {
    this.logger.log(`Getting receipt for transaction ${transactionHash}`);
    
    try {
      // Get the transaction receipt
      const receipt = await this.provider.getTransactionReceipt(transactionHash);
      
      return receipt;
    } catch (error) {
      this.logger.error(`Error getting transaction receipt: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create a new Ethereum account
   * 
   * @returns The address and private key of the new account
   */
  async createAccount(): Promise<{ address: string; privateKey: string }> {
    this.logger.log('Creating new Ethereum account');
    
    try {
      // Create a new random wallet
      const wallet = ethers.Wallet.createRandom();
      
      this.logger.log(`Created new Ethereum account: ${wallet.address}`);
      
      return {
        address: wallet.address,
        privateKey: wallet.privateKey,
      };
    } catch (error) {
      this.logger.error(`Error creating account: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get account balance
   * 
   * @param address The address to get the balance for
   * @returns The balance in wei
   */
  async getBalance(address: string): Promise<string> {
    this.logger.log(`Getting balance for address ${address}`);
    
    try {
      // Get the balance
      const balance = await this.provider.getBalance(address);
      
      return balance.toString();
    } catch (error) {
      this.logger.error(`Error getting balance: ${error.message}`);
      throw error;
    }
  }

  /**
   * Sign a message with a private key
   * 
   * @param message The message to sign
   * @param privateKey The private key to sign with
   * @returns The signature
   */
  async signMessage(message: string, privateKey: string): Promise<string> {
    this.logger.log(`Signing message: ${message}`);
    
    try {
      // Create a wallet with the private key
      const wallet = new ethers.Wallet(privateKey);
      
      // Sign the message
      const signature = await wallet.signMessage(message);
      
      return signature;
    } catch (error) {
      this.logger.error(`Error signing message: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify a message signature
   * 
   * @param message The message that was signed
   * @param signature The signature to verify
   * @param address The address that supposedly signed the message
   * @returns Whether the signature is valid
   */
  async verifySignature(message: string, signature: string, address: string): Promise<boolean> {
    this.logger.log(`Verifying signature for message: ${message}`);
    
    try {
      // Recover the address from the signature
      const recoveredAddress = ethers.utils.verifyMessage(message, signature);
      
      // Check if the recovered address matches the expected address
      return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
      this.logger.error(`Error verifying signature: ${error.message}`);
      return false;
    }
  }
}
