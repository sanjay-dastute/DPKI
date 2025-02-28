# QuantumTrust DPKI - Application Architecture

## Overview

QuantumTrust DPKI is a decentralized public key infrastructure system that replaces traditional certificate authorities. It enables users to generate self-sovereign identities (DIDs) and verifiable credentials (VCs) by securely uploading government-mandated documents. The system complies with Singapore's PDPA and Saudi Arabia's SDAIA/NDMO regulations, ensuring data privacy, consent management, and ethical AI use.

## System Architecture

The application follows a microservices architecture with the following components:

## 1. Core Development Tech Stack

### 1.1 Blockchain & Smart Contracts

| Component | Technology/Platform |
|-----------|---------------------|
| Blockchain Framework | Hyperledger Indy (for Decentralized Identity) |
| Smart Contract Platform | Ethereum (Solidity) & Hyperledger Fabric (Chaincode) |
| Smart Contract Languages | Solidity (Ethereum), Go (Hyperledger Fabric) |
| DID & Verifiable Credentials | Hyperledger Aries & Indy SDK |
| Consensus Mechanism | Proof-of-Stake (PoS) (Ethereum), PBFT (Indy) |
| Identity Verification | DIDComm (Decentralized Identity Communication) |
| Regulatory Compliance Ledger | Hedera Hashgraph for GDPR/HIPAA Audit Trail |

## 2. Backend Development

| Component | Technology/Platform |
|-----------|---------------------|
| Backend Framework | Node.js (NestJS for modular architecture) |
| API Gateway | GraphQL (Apollo Server) |
| Authentication | OAuth2, OpenID Connect (OIDC), JWT |
| Data Storage | PostgreSQL (structured), MongoDB (audit logs) |
| Security & Encryption | AES-256, mTLS, Quantum-Resistant CRYSTALS-Kyber |
| Caching | Redis (for fast identity lookups) |
| Containerization | Docker |
| Event Streaming | Apache Kafka (for real-time credential issuance & updates) |

## 3. AI/ML Integration

| Component | Technology/Platform |
|-----------|---------------------|
| AI/ML Framework | Python Django (FastAPI for microservices) |
| Zero-Knowledge Proofs (ZKP) | ZoKrates (for proving identity without revealing data) |
| AI-Powered Anomaly Detection | TensorFlow/PyTorch |
| Explainable AI (XAI) for Compliance | LIME (Local Interpretable Model-agnostic Explanations) |
| AI Ethics & Fairness Audits | IBM AI Fairness 360 (AIF360) |
| Document Verification (OCR + NLP) | Tesseract OCR + spaCy/NLTK |
| Fraud Detection in Identity Verification | Deep Learning models (LSTMs, GANs) |

## 4. Frontend Development

| Component | Technology/Platform |
|-----------|---------------------|
| Frontend Framework | React.js + Next.js |
| State Management | Redux Toolkit |
| Authentication | DID-based SSO, OAuth2 |
| Wallet Integration | Metamask, Ledger, SSI Wallet (Hyperledger Aries) |
| Data Visualization | D3.js / Chart.js for compliance analytics |
| Web3 Integration | ethers.js (for Ethereum interaction) |
| User Dashboard | React Admin Panel (Material UI/Tailwind) |

## 5. Security & Compliance

| Security Layer | Technology Used |
|----------------|-----------------|
| End-to-End Encryption | AES-256, Quantum-Resistant TLS 1.3 |
| DID-Based Authentication | Hyperledger Indy & Aries |
| Consent Ledger for GDPR Compliance | Hedera Hashgraph |
| Zero-Knowledge Proofs for Data Privacy | ZoKrates, Circom |
| Role-Based Access Control (RBAC) | AWS IAM, ABAC |
| Multi-Factor Authentication (MFA) | WebAuthn, FIDO2 |
| Immutable Audit Logs | Hyperledger Fabric & MongoDB |

## 6. Microservices & APIs

### 6.1 Microservices Architecture

| Service | Tech Stack |
|---------|------------|
| DID Manager | Node.js (NestJS) |
| Verifiable Credential Issuer | Node.js (Express) |
| Smart Contract Executor | Node.js (web3.js, ethers.js) |
| AI-Powered Anomaly Detection | Python (Django, TensorFlow) |
| Compliance Auditor | Python (Django + Hyperledger SDK) |
| Document Verification | Python (Django + OpenCV, Tesseract) |

## 7. Data Models

### 7.1 User Model
```json
{
  "id": "uuid",
  "username": "string",
  "password": "hashed_string",
  "email": "string",
  "role": "enum(citizen, tourist, business, government, admin)",
  "country": "string",
  "did": "string",
  "walletAddress": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### 7.2 DID Model
```json
{
  "id": "string",
  "userId": "uuid",
  "publicKey": "string",
  "status": "enum(active, revoked)",
  "method": "string",
  "controller": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "expiresAt": "timestamp"
}
```

### 7.3 Document Model
```json
{
  "id": "uuid",
  "userId": "uuid",
  "did": "string",
  "type": "enum(passport, nric, business_license, etc)",
  "hash": "string",
  "ipfsHash": "string",
  "encryptionMethod": "string",
  "status": "enum(pending, verified, rejected)",
  "aiVerificationResult": "json",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "expiresAt": "timestamp"
}
```

### 7.4 Verifiable Credential Model
```json
{
  "id": "uuid",
  "did": "string",
  "type": "string",
  "issuer": "string",
  "issuanceDate": "timestamp",
  "expirationDate": "timestamp",
  "credentialSubject": "json",
  "proof": {
    "type": "CRYSTALS-Dilithium",
    "created": "timestamp",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "string",
    "proofValue": "string"
  },
  "status": "enum(active, revoked)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### 7.5 Domain Validation Model
```json
{
  "id": "uuid",
  "userId": "uuid",
  "domain": "string",
  "challenge": "string",
  "validationMethod": "enum(zkp, dns)",
  "zkProof": "json",
  "status": "enum(pending, verified, rejected)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "expiresAt": "timestamp"
}
```

### 7.6 Smart Contract Model
```json
{
  "id": "uuid",
  "address": "string",
  "blockchain": "enum(ethereum, hyperledger)",
  "abi": "json",
  "bytecode": "string",
  "deployedBy": "uuid",
  "status": "enum(active, inactive)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## 8. User Types and Workflows

### 8.1 Individual Citizen
1. Register and login with DID-based SSO
2. Upload required documents (NRIC, proof of residency)
3. AI/ML verification of document authenticity
4. Receive DID and quantum-resistant VCs
5. Manage documents and credentials via SSI wallet
6. Control consent for data sharing with ZKPs

### 8.2 Tourist
1. Register and login with passport-based verification
2. Upload required documents (Passport, eVisa)
3. Receive temporary DID and time-bound VCs
4. Access services during visit via mobile wallet
5. Automatic credential revocation upon visa expiry

### 8.3 Business Entity
1. Register and login with multi-sig authentication
2. Upload required documents (Business registration, licenses)
3. Smart contract verification with government registries
4. Receive business DID and role-based VCs for employees
5. Manage employee verification and access control

### 8.4 Government Entity
1. Login with special government credentials and MFA
2. Access audit dashboard with real-time analytics
3. Issue public-sector VCs with quantum-resistant signatures
4. Revoke compromised DIDs via consensus mechanism
5. Generate compliance reports for regulatory bodies

### 8.5 Admin
1. Login with admin credentials and hardware-based MFA
2. Manage users and system settings
3. View immutable audit logs and compliance reports
4. Monitor system performance and security metrics
5. Manage smart contracts and blockchain parameters

## 9. Sample Data

The system will be preloaded with 20 sample users across all categories:
- 5 Individual Citizens
- 5 Tourists
- 5 Business Entities
- 4 Government Entities
- 1 Admin

Each user will have appropriate sample documents, DIDs, and VCs based on their user type and country.

## 10. Local Development Architecture

For local development and testing:
- Docker containers for each microservice
- Docker Compose for orchestration
- Local PostgreSQL and MongoDB instances
- Local Hyperledger Indy network
- Local Ethereum development network (Ganache)

## 11. Ownership and License

This project is owned by:
SANJAY K R - Founder & CEO of Dastute Switcher Technologies LLP

Licensed under MIT License.
