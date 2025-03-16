import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CryptoJS from 'crypto-js';
import * as crypto from 'crypto';

/**
 * Encryption Service
 * 
 * This service provides encryption and decryption functionality for documents.
 */
@Injectable()
export class EncryptionService {
  private readonly logger = new Logger(EncryptionService.name);
  private readonly algorithm = 'aes-256-cbc';
  
  constructor(private configService: ConfigService) {
    this.logger.log('Initializing encryption service');
  }
  
  /**
   * Encrypt a file
   * 
   * @param fileBuffer The file buffer to encrypt
   * @param encryptionKey The encryption key
   * @returns The encrypted file as a string
   */
  encryptFile(fileBuffer: Buffer, encryptionKey: string): string {
    this.logger.log('Encrypting file');
    
    try {
      // Generate a random initialization vector
      const iv = crypto.randomBytes(16);
      
      // Create a cipher using the key and iv
      const cipher = crypto.createCipheriv(
        this.algorithm,
        Buffer.from(this.deriveKey(encryptionKey)),
        iv
      );
      
      // Encrypt the file
      const encrypted = Buffer.concat([
        cipher.update(fileBuffer),
        cipher.final(),
      ]);
      
      // Combine the IV and encrypted data
      const result = Buffer.concat([iv, encrypted]);
      
      // Convert to base64 string for storage
      return result.toString('base64');
    } catch (error) {
      this.logger.error(`Error encrypting file: ${error.message}`);
      
      // Fallback to CryptoJS
      try {
        // Convert buffer to WordArray for CryptoJS
        const wordArray = CryptoJS.lib.WordArray.create(fileBuffer as any);
        
        // Encrypt the data
        const encrypted = CryptoJS.AES.encrypt(wordArray, encryptionKey).toString();
        
        return encrypted;
      } catch (fallbackError) {
        this.logger.error(`Error in fallback encryption: ${fallbackError.message}`);
        throw fallbackError;
      }
    }
  }
  
  /**
   * Decrypt a file
   * 
   * @param encryptedData The encrypted file as a string
   * @param encryptionKey The encryption key
   * @returns The decrypted file buffer
   */
  decryptFile(encryptedData: string, encryptionKey: string): Buffer {
    this.logger.log('Decrypting file');
    
    try {
      // Convert the base64 string back to a buffer
      const encryptedBuffer = Buffer.from(encryptedData, 'base64');
      
      // Extract the IV from the first 16 bytes
      const iv = encryptedBuffer.slice(0, 16);
      
      // Extract the encrypted data
      const encrypted = encryptedBuffer.slice(16);
      
      // Create a decipher using the key and iv
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        Buffer.from(this.deriveKey(encryptionKey)),
        iv
      );
      
      // Decrypt the file
      const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
      ]);
      
      return decrypted;
    } catch (error) {
      this.logger.error(`Error decrypting file: ${error.message}`);
      
      // Fallback to CryptoJS
      try {
        // Decrypt the data
        const decrypted = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
        
        // Convert WordArray to Buffer
        const typedArray = new Uint8Array(decrypted.words.length * 4);
        for (let i = 0; i < decrypted.words.length; i++) {
          const word = decrypted.words[i];
          typedArray[i * 4] = (word >> 24) & 0xff;
          typedArray[i * 4 + 1] = (word >> 16) & 0xff;
          typedArray[i * 4 + 2] = (word >> 8) & 0xff;
          typedArray[i * 4 + 3] = word & 0xff;
        }
        
        return Buffer.from(typedArray.buffer, 0, decrypted.sigBytes);
      } catch (fallbackError) {
        this.logger.error(`Error in fallback decryption: ${fallbackError.message}`);
        throw fallbackError;
      }
    }
  }
  
  /**
   * Generate a random encryption key
   * 
   * @returns A random encryption key
   */
  generateEncryptionKey(): string {
    this.logger.log('Generating encryption key');
    
    try {
      // Generate a random 32-byte key
      const key = crypto.randomBytes(32).toString('hex');
      
      return key;
    } catch (error) {
      this.logger.error(`Error generating encryption key: ${error.message}`);
      
      // Fallback to a simpler method
      const fallbackKey = Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      
      return fallbackKey;
    }
  }
  
  /**
   * Derive a 32-byte key from a password
   * 
   * @param password The password to derive the key from
   * @returns A 32-byte key
   */
  private deriveKey(password: string): Buffer {
    // Use a fixed salt for deterministic key derivation
    const salt = this.configService.get<string>('ENCRYPTION_SALT', 'quantum-trust-dpki-salt');
    
    // Derive a 32-byte key using PBKDF2
    return crypto.pbkdf2Sync(password, salt, 10000, 32, 'sha256');
  }
}
