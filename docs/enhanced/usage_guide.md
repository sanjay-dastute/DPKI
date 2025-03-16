# QuantumTrust DPKI - Enhanced Usage Guide

## Overview

QuantumTrust DPKI is a comprehensive Decentralized Public Key Infrastructure application that provides secure document management, verifiable credentials, and decentralized identity services. This enhanced version includes advanced features such as AI-powered document verification, zero-knowledge proofs, blockchain integration, IPFS document storage, and anomaly detection.

## Installation

### Prerequisites
- Node.js 16.x or higher
- Docker and Docker Compose
- PostgreSQL
- MongoDB
- Redis
- IPFS (optional, can use public gateways)
- Ethereum node (optional, can use public nodes)

### Installation on Ubuntu

1. Clone the repository
   ```bash
   git clone https://github.com/sanjay-dastute/DPKI.git
   cd DPKI
   ```

2. Install dependencies
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables
   Create `.env` files in the root, backend, and frontend directories with the required configuration:

   **Backend .env**
   ```
   # Database Configuration
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=password
   DATABASE_NAME=dpki
   
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/dpki
   
   # Redis Configuration
   REDIS_HOST=localhost
   REDIS_PORT=6379
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRATION=1d
   
   # Blockchain Configuration
   ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/your_infura_key
   ETHEREUM_PRIVATE_KEY=your_private_key
   
   # IPFS Configuration
   IPFS_API_URL=http://localhost:5001
   IPFS_GATEWAY_URL=http://localhost:8080
   
   # AI Services Configuration
   AI_SERVICE_URL=http://localhost:3001
   ```

   **Frontend .env**
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   NEXT_PUBLIC_IPFS_GATEWAY=http://localhost:8080
   ```

4. Start the application
   ```bash
   # Start the backend
   cd backend
   npm run start:dev
   
   # Start the frontend (in a new terminal)
   cd frontend
   npm run dev
   ```

### Installation on Windows

1. Clone the repository
   ```powershell
   git clone https://github.com/sanjay-dastute/DPKI.git
   cd DPKI
   ```

2. Install dependencies
   ```powershell
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ..\frontend
   npm install
   ```

3. Set up environment variables
   Create `.env` files in the root, backend, and frontend directories with the same configuration as shown in the Ubuntu installation.

4. Start the application
   ```powershell
   # Start the backend
   cd backend
   npm run start:dev
   
   # Start the frontend (in a new terminal)
   cd frontend
   npm run dev
   ```

## Usage Guide

### Managing Decentralized Identifiers (DIDs)

1. Navigate to the DID management page
2. Click "Create DID" to create a new decentralized identifier
3. Select the blockchain method (Indy, Ethereum, or Fabric)
4. Enter a name and description for the DID
5. Click "Submit" to create the DID

The DID will be registered on the selected blockchain network, providing a secure and verifiable digital identity that can be used for issuing and verifying credentials.

### Managing Verifiable Credentials

1. Navigate to the Verifiable Credentials page
2. To issue a credential:
   - Click "Issue Credential"
   - Select the credential type and recipient
   - Enter the credential claims in JSON format
   - Enable Zero-Knowledge Proof option if privacy is required
   - Select the blockchain for anchoring the credential
   - Click "Issue" to create the credential

3. To verify a credential:
   - Click "Verify" on any credential in your list
   - The system will verify the credential using both blockchain and zero-knowledge proofs
   - View the verification results, including confidence scores

4. To revoke a credential:
   - Click "Revoke" on any credential you've issued
   - Provide a reason for revocation
   - The revocation will be recorded on the blockchain

### Managing Documents

1. Navigate to the Documents page
2. To upload a document:
   - Click "Upload Document"
   - Select the document type and file
   - Choose encryption options
   - Select blockchain for verification
   - Click "Upload" to securely store the document on IPFS

3. To verify a document:
   - Click "Verify" on any document in your list
   - The system will verify the document using AI and blockchain
   - View the verification results, including AI confidence scores

4. To share a document:
   - Click "Share" on any document you own
   - Enter the recipient's ID
   - Select permissions to grant
   - Click "Share" to securely share the document

5. To delete a document:
   - Click "Delete" on any document you own
   - Confirm the deletion
   - The document will be removed from IPFS and its status updated on the blockchain

## Enhanced Features

### AI-Powered Document Verification

The system uses Optical Character Recognition (OCR) and machine learning to verify the authenticity of uploaded documents. Key features include:

- Text extraction and analysis
- Template matching for known document types
- Anomaly detection for potential forgeries
- Confidence scoring for verification results

### Zero-Knowledge Proofs

The system supports privacy-preserving verification using zero-knowledge proofs, allowing users to prove possession of credentials without revealing the actual data. Key features include:

- Support for multiple ZKP protocols (Groth16, PlonK)
- Selective disclosure of credential attributes
- Non-interactive proofs for efficient verification
- Integration with blockchain for proof anchoring

### Blockchain Integration

The system integrates with multiple blockchain networks for secure, immutable storage of DIDs, credential proofs, and document verification. Supported networks include:

- Ethereum (public and private networks)
- Hyperledger Indy
- Hyperledger Fabric

Key features include:
- Smart contract deployment for credential registries
- Transaction signing and verification
- Multi-chain support with fallback mechanisms
- Gas optimization for Ethereum transactions

### IPFS Document Storage

Documents are securely stored on the InterPlanetary File System (IPFS) with optional encryption. Key features include:

- Content-addressable storage for immutability
- AES-256-CBC encryption for sensitive documents
- Pinning service integration for persistence
- Gateway access for easy retrieval

### Anomaly Detection

The system uses machine learning to detect suspicious activities and potential fraud. Key features include:

- Behavioral analysis of user actions
- Pattern recognition for unusual document submissions
- Risk scoring for verification requests
- Alert system for potential security threats

## Troubleshooting

### Common Issues

1. **Connection to blockchain fails**
   - Check your internet connection
   - Verify that the blockchain node URL is correct in your .env file
   - Ensure your private key has sufficient funds for transactions

2. **IPFS upload fails**
   - Check that the IPFS daemon is running
   - Verify IPFS API URL in your .env file
   - Try using a public IPFS gateway as fallback

3. **Document verification returns low confidence**
   - Ensure the document is clearly scanned
   - Check that the document type is supported
   - Try re-uploading with higher resolution

4. **Zero-knowledge proof generation fails**
   - Verify that the credential schema is correctly defined
   - Check that all required attributes are present
   - Ensure the ZKP service is properly configured

### Getting Help

For additional support, please refer to:
- The project's GitHub repository: https://github.com/sanjay-dastute/DPKI
- The troubleshooting guide in the docs directory
- The API documentation for detailed endpoint information

## Security Considerations

- All sensitive data should be encrypted both in transit and at rest
- Private keys should never be shared or stored in plaintext
- Regular security audits are recommended
- Keep all dependencies updated to patch security vulnerabilities
- Enable two-factor authentication for administrative access
