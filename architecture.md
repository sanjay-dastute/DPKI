# QuantumTrust DPKI - Application Architecture

## Overview

QuantumTrust DPKI is a decentralized public key infrastructure system that replaces traditional certificate authorities. It enables users to generate self-sovereign identities (DIDs) and verifiable credentials (VCs) by securely uploading government-mandated documents. The system complies with Singapore's PDPA and Saudi Arabia's SDAIA/NDMO regulations, ensuring data privacy, consent management, and ethical AI use.

## System Architecture

The application follows a microservices architecture with the following components:

### Backend Services

1. **Document Management Service**
   - Handles document upload, validation, encryption, and IPFS storage
   - Tech Stack: Node.js (NestJS), Tesseract.js, IPFS
   - Key Endpoints:
     - POST /documents/upload
     - GET /documents/{did}
     - DELETE /documents/{did}

2. **DID Management Service**
   - Generates, revokes, and manages DIDs with Hyperledger Indy
   - Tech Stack: Node.js, Hyperledger Indy/Aries, PostgreSQL
   - Key Endpoints:
     - POST /did/create
     - POST /did/revoke
     - GET /did/{id}

3. **VC Issuance Service**
   - Creates and verifies quantum-resistant Verifiable Credentials
   - Tech Stack: Python (FastAPI), MongoDB
   - Key Endpoints:
     - POST /vc/issue
     - GET /vc/verify/{id}
     - GET /vc/list/{did}

4. **Compliance Engine**
   - Enforces PDPA (SG), SDAIA (KSA), and sector-specific regulations
   - Tech Stack: Node.js, Open Policy Agent (OPA)
   - Key Endpoints:
     - POST /compliance/validate
     - GET /compliance/report

5. **User Management Service**
   - Manages user roles and access control
   - Tech Stack: Node.js (NestJS), PostgreSQL
   - Key Endpoints:
     - POST /users/register
     - POST /users/login
     - GET /users/profile
     - PUT /users/update
     - GET /users/list (admin only)

6. **Domain Validation Service**
   - Validates domain ownership using ZKP or DNS TXT records
   - Tech Stack: Node.js (NestJS)
   - Key Endpoints:
     - POST /domain/initiate
     - POST /domain/verify
     - POST /domain/vc/issue

7. **Admin Service**
   - Provides administrative capabilities for system management
   - Tech Stack: Node.js (NestJS), PostgreSQL
   - Key Endpoints:
     - GET /admin/users
     - PUT /admin/users/{id}
     - GET /admin/logs
     - GET /admin/stats

### Frontend Components

1. **User Portal**
   - Document upload and management
   - DID/VC management
   - Domain validation
   - Tech Stack: React.js, Material-UI, Web3.js

2. **Admin Dashboard**
   - User management
   - System monitoring
   - Compliance reporting
   - Tech Stack: React.js, Material-UI, Recharts

### Database Layer

1. **PostgreSQL**
   - User accounts and profiles
   - DID metadata
   - Audit logs

2. **MongoDB**
   - Document metadata
   - Verifiable Credentials
   - Domain validation records

### Security Layer

1. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control (RBAC)
   - Attribute-based access control (ABAC) via OPA

2. **Encryption**
   - AES-256 for data at rest
   - TLS 1.3 with CRYSTALS-Kyber for communication
   - CRYSTALS-Dilithium for digital signatures

## Data Models

### User Model
```json
{
  "id": "uuid",
  "username": "string",
  "password": "hashed_string",
  "email": "string",
  "role": "enum(citizen, tourist, business, government, admin)",
  "country": "string",
  "did": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### DID Model
```json
{
  "id": "string",
  "userId": "uuid",
  "publicKey": "string",
  "status": "enum(active, revoked)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "expiresAt": "timestamp"
}
```

### Document Model
```json
{
  "id": "uuid",
  "userId": "uuid",
  "did": "string",
  "type": "enum(passport, nric, business_license, etc)",
  "hash": "string",
  "ipfsHash": "string",
  "status": "enum(pending, verified, rejected)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "expiresAt": "timestamp"
}
```

### Verifiable Credential Model
```json
{
  "id": "uuid",
  "did": "string",
  "type": "string",
  "issuer": "string",
  "issuanceDate": "timestamp",
  "expirationDate": "timestamp",
  "credentialSubject": "json",
  "proof": "json",
  "status": "enum(active, revoked)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Domain Validation Model
```json
{
  "id": "uuid",
  "userId": "uuid",
  "domain": "string",
  "challenge": "string",
  "validationMethod": "enum(zkp, dns)",
  "status": "enum(pending, verified, rejected)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "expiresAt": "timestamp"
}
```

## User Types and Workflows

### Individual Citizen
1. Register and login
2. Upload required documents (NRIC, proof of residency)
3. Receive DID and VCs
4. Manage documents and credentials

### Tourist
1. Register and login
2. Upload required documents (Passport, eVisa)
3. Receive temporary DID and VCs
4. Access services during visit

### Business Entity
1. Register and login
2. Upload required documents (Business registration, licenses)
3. Receive business DID and VCs
4. Manage employee verification

### Government Entity
1. Login with special government credentials
2. Access audit dashboard
3. Issue public-sector VCs
4. Revoke compromised DIDs

### Admin
1. Login with admin credentials
2. Manage users and system settings
3. View audit logs and compliance reports
4. Monitor system performance

## Sample Data

The system will be preloaded with 20 sample users across all categories:
- 5 Individual Citizens
- 5 Tourists
- 5 Business Entities
- 4 Government Entities
- 1 Admin

Each user will have appropriate sample documents, DIDs, and VCs based on their user type and country.

## Deployment Architecture

For local development and testing:
- Docker containers for each microservice
- Docker Compose for orchestration
- Local PostgreSQL and MongoDB instances

## Ownership and License

This project is owned by:
SANJAY K R - Founder & CEO of Dastute Switcher Technologies LLP

Licensed under MIT License.
