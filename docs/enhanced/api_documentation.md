# QuantumTrust DPKI - Enhanced API Documentation

This document provides comprehensive documentation for the enhanced QuantumTrust DPKI API, including all new endpoints and features.

## Base URL

All API endpoints are relative to the base URL:

```
http://localhost:3000/api
```

## Authentication

Most API endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Authentication

#### Register a new user

```
POST /auth/register
```

Request body:
```json
{
  "username": "user123",
  "email": "user@example.com",
  "password": "securePassword123",
  "role": "individual",
  "country": "Singapore"
}
```

### Decentralized Identifiers (DIDs)

#### Create a new DID

```
POST /did
```

Request body:
```json
{
  "method": "ethereum",
  "name": "My Ethereum DID",
  "description": "Primary identity for document signing",
  "useBlockchain": true,
  "blockchain": "ethereum",
  "network": "sepolia"
}
```

### Verifiable Credentials

#### Create a new credential

```
POST /verifiable-credentials
```

Request body:
```json
{
  "type": "IdentityCredential",
  "issuer": "did:ethr:0x1234567890abcdef1234567890abcdef12345678",
  "holder": "did:ethr:0xabcdef1234567890abcdef1234567890abcdef12",
  "credentialSubject": {
    "name": "John Doe",
    "dateOfBirth": "1990-01-01",
    "nationality": "Singapore",
    "idNumber": "S1234567A"
  },
  "expirationDate": "2025-07-16T12:00:00.000Z",
  "useZkp": true,
  "useBlockchain": true
}
```

#### Verify a credential

```
POST /verifiable-credentials/:id/verify
```

Request body:
```json
{
  "useZkp": true,
  "useBlockchain": true
}
```

### Documents

#### Upload a document

```
POST /documents/upload
```

Request body (multipart/form-data):
```
file: [binary file data]
encrypt: true
storeOnIpfs: true
```

#### Verify a document

```
POST /documents/:id/verify
```

Request body:
```json
{
  "useAI": true,
  "useBlockchain": true
}
```

### AI Services

#### Document Verification

```
POST /ai/document-verification
```

Request body (multipart/form-data):
```
file: [binary file data]
documentType: passport
country: Singapore
```

#### Zero-Knowledge Proof Generation

```
POST /ai/zkp/generate
```

Request body:
```json
{
  "credentialId": "60f1a5b3e6b3f32d4c8b4569",
  "protocol": "groth16",
  "disclosedAttributes": ["name", "nationality"],
  "hiddenAttributes": ["dateOfBirth", "idNumber"]
}
```

### Blockchain Services

#### Register Document Hash

```
POST /blockchain/register-document
```

Request body:
```json
{
  "documentId": "60f1a5b3e6b3f32d4c8b456a",
  "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "blockchain": "ethereum"
}
```

### IPFS Services

#### Upload to IPFS

```
POST /ipfs/upload
```

Request body (multipart/form-data):
```
file: [binary file data]
encrypt: true
```

## Error Handling

All API endpoints return appropriate HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
