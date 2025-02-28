# QuantumTrust DPKI - API Documentation

This document provides comprehensive documentation for the QuantumTrust DPKI API, covering both REST and GraphQL endpoints.

## Table of Contents
1. [Authentication](#authentication)
2. [REST API](#rest-api)
3. [GraphQL API](#graphql-api)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)
6. [Webhooks](#webhooks)

## Authentication

The QuantumTrust DPKI API uses JWT (JSON Web Token) for authentication.

### Obtaining a JWT Token

```
POST /auth/login
```

Request body:
```json
{
  "username": "your_username",
  "password": "your_password"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 86400,
  "user": {
    "id": "user_id",
    "username": "your_username",
    "email": "your_email@example.com",
    "role": "INDIVIDUAL"
  }
}
```

Include the JWT token in the Authorization header of your requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## REST API

### Auth Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| `/auth/register` | POST | Register a new user | No |
| `/auth/login` | POST | Authenticate and get JWT token | No |
| `/auth/logout` | POST | Invalidate current token | Yes |
| `/auth/refresh` | POST | Refresh JWT token | Yes |
| `/auth/reset-password-request` | POST | Request password reset | No |
| `/auth/reset-password` | POST | Reset password with token | No |

#### Register a New User

```
POST /auth/register
```

Request body:
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "securePassword123",
  "fullName": "New User",
  "country": "Singapore",
  "organization": "Example Corp"
}
```

Response:
```json
{
  "id": "user_id",
  "username": "newuser",
  "email": "newuser@example.com",
  "role": "INDIVIDUAL",
  "createdAt": "2025-02-28T09:30:00.000Z"
}
```

#### Login

```
POST /auth/login
```

Request body:
```json
{
  "username": "newuser",
  "password": "securePassword123"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 86400,
  "user": {
    "id": "user_id",
    "username": "newuser",
    "email": "newuser@example.com",
    "role": "INDIVIDUAL"
  }
}
```

### User Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| `/users/me` | GET | Get current user profile | Yes |
| `/users/:id` | GET | Get user by ID | Yes |
| `/users/:id` | PUT | Update user profile | Yes |
| `/users/change-password` | POST | Change user password | Yes |
| `/users` | GET | Get all users (Admin only) | Yes (Admin) |

#### Get Current User Profile

```
GET /users/me
```

Response:
```json
{
  "id": "user_id",
  "username": "newuser",
  "email": "newuser@example.com",
  "fullName": "New User",
  "country": "Singapore",
  "organization": "Example Corp",
  "role": "INDIVIDUAL",
  "createdAt": "2025-02-28T09:30:00.000Z",
  "updatedAt": "2025-02-28T09:30:00.000Z"
}
```

#### Update User Profile

```
PUT /users/:id
```

Request body:
```json
{
  "fullName": "Updated Name",
  "country": "Saudi Arabia",
  "organization": "New Corp"
}
```

Response:
```json
{
  "id": "user_id",
  "username": "newuser",
  "email": "newuser@example.com",
  "fullName": "Updated Name",
  "country": "Saudi Arabia",
  "organization": "New Corp",
  "role": "INDIVIDUAL",
  "updatedAt": "2025-02-28T10:00:00.000Z"
}
```

### DID Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| `/did` | POST | Create a new DID | Yes |
| `/did/:id` | GET | Get DID by ID | Yes |
| `/did/my-dids` | GET | Get DIDs for current user | Yes |
| `/did/:id` | PUT | Update DID | Yes |
| `/did/:id` | DELETE | Revoke DID | Yes |
| `/did/resolve/:did` | GET | Resolve DID to DID Document | Yes |

#### Create a New DID

```
POST /did
```

Request body:
```json
{
  "method": "indy",
  "name": "My Primary DID",
  "description": "DID for personal identity"
}
```

Response:
```json
{
  "id": "did_id",
  "did": "did:indy:123456789abcdefghi",
  "method": "indy",
  "name": "My Primary DID",
  "description": "DID for personal identity",
  "status": "ACTIVE",
  "createdAt": "2025-02-28T10:15:00.000Z",
  "userId": "user_id",
  "publicKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...\n-----END PUBLIC KEY-----"
}
```

#### Get DIDs for Current User

```
GET /did/my-dids
```

Response:
```json
[
  {
    "id": "did_id_1",
    "did": "did:indy:123456789abcdefghi",
    "method": "indy",
    "name": "My Primary DID",
    "description": "DID for personal identity",
    "status": "ACTIVE",
    "createdAt": "2025-02-28T10:15:00.000Z"
  },
  {
    "id": "did_id_2",
    "did": "did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK",
    "method": "key",
    "name": "My Secondary DID",
    "description": "DID for business transactions",
    "status": "ACTIVE",
    "createdAt": "2025-02-28T10:20:00.000Z"
  }
]
```

### Verifiable Credentials Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| `/verifiable-credentials/issue` | POST | Issue a new credential | Yes |
| `/verifiable-credentials/:id` | GET | Get credential by ID | Yes |
| `/verifiable-credentials/issued` | GET | Get credentials issued by current user | Yes |
| `/verifiable-credentials/held` | GET | Get credentials held by current user | Yes |
| `/verifiable-credentials/verify/:id` | POST | Verify a credential | Yes |
| `/verifiable-credentials/revoke/:id` | POST | Revoke a credential | Yes |
| `/verifiable-credentials/:id/status` | PUT | Update credential status | Yes |

#### Issue a New Credential

```
POST /verifiable-credentials/issue
```

Request body:
```json
{
  "type": "IdentityCredential",
  "recipientDid": "did:indy:987654321ihgfedcba",
  "claims": {
    "name": "John Doe",
    "dateOfBirth": "1990-01-01",
    "nationality": "Singapore",
    "idNumber": "S1234567A"
  },
  "expirationDate": "2026-02-28T00:00:00.000Z"
}
```

Response:
```json
{
  "id": "credential_id",
  "type": "IdentityCredential",
  "issuerDid": "did:indy:123456789abcdefghi",
  "holderDid": "did:indy:987654321ihgfedcba",
  "issuanceDate": "2025-02-28T10:30:00.000Z",
  "expirationDate": "2026-02-28T00:00:00.000Z",
  "status": "ACTIVE",
  "claims": {
    "name": "John Doe",
    "dateOfBirth": "1990-01-01",
    "nationality": "Singapore",
    "idNumber": "S1234567A"
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2025-02-28T10:30:00.000Z",
    "verificationMethod": "did:indy:123456789abcdefghi#keys-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "z58DAdFfa9SkqZMVPxAQpic7ndSayn1PzZs6ZjWp1CktyGesjuTdwQZHZVKfpHFhEYAQU15NC48aPh5YcXFT5RKiP"
  }
}
```

#### Verify a Credential

```
POST /verifiable-credentials/verify/:id
```

Response:
```json
{
  "verified": true,
  "checks": {
    "signature": true,
    "expiration": true,
    "revocation": true,
    "issuer": true
  },
  "issuer": {
    "did": "did:indy:123456789abcdefghi",
    "name": "Government of Singapore"
  }
}
```

### Document Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| `/documents` | POST | Upload a new document | Yes |
| `/documents/:id` | GET | Get document by ID | Yes |
| `/documents/:id/download` | GET | Download document | Yes |
| `/documents/my-documents` | GET | Get documents for current user | Yes |
| `/documents/:id` | PUT | Update document metadata | Yes |
| `/documents/:id` | DELETE | Delete document | Yes |
| `/documents/:id/verify` | POST | Verify document authenticity | Yes |
| `/documents/:id/share` | POST | Share document with other users | Yes |

#### Upload a New Document

```
POST /documents
```

Request body (multipart/form-data):
```
file: [binary file data]
type: "IDENTITY"
name: "Passport"
description: "Singapore passport"
metadata: {"issueDate": "2020-01-01", "expiryDate": "2030-01-01"}
```

Response:
```json
{
  "id": "document_id",
  "name": "Passport",
  "type": "IDENTITY",
  "description": "Singapore passport",
  "fileType": "application/pdf",
  "fileSize": 1024000,
  "uploadDate": "2025-02-28T11:00:00.000Z",
  "metadata": {
    "issueDate": "2020-01-01",
    "expiryDate": "2030-01-01"
  },
  "status": "ACTIVE",
  "userId": "user_id",
  "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```

#### Share Document with Other Users

```
POST /documents/:id/share
```

Request body:
```json
{
  "recipientIds": ["user_id_1", "user_id_2"],
  "permissions": ["VIEW", "DOWNLOAD"],
  "expirationDate": "2025-03-28T00:00:00.000Z"
}
```

Response:
```json
{
  "id": "share_id",
  "documentId": "document_id",
  "ownerId": "user_id",
  "recipients": [
    {
      "userId": "user_id_1",
      "permissions": ["VIEW", "DOWNLOAD"]
    },
    {
      "userId": "user_id_2",
      "permissions": ["VIEW", "DOWNLOAD"]
    }
  ],
  "expirationDate": "2025-03-28T00:00:00.000Z",
  "createdAt": "2025-02-28T11:15:00.000Z"
}
```

### AI Service Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| `/ai/document-verification` | POST | Verify document using AI | Yes |
| `/ai/anomaly-detection/analyze` | POST | Analyze for anomalies | Yes |
| `/ai/zero-knowledge-proof/generate` | POST | Generate ZKP | Yes |
| `/ai/zero-knowledge-proof/verify` | POST | Verify ZKP | Yes |

#### Verify Document Using AI

```
POST /ai/document-verification
```

Request body (multipart/form-data):
```
file: [binary file data]
documentType: "PASSPORT"
```

Response:
```json
{
  "verified": true,
  "confidence": 0.95,
  "details": {
    "documentType": "PASSPORT",
    "country": "Singapore",
    "documentNumber": "S1234567A",
    "name": "John Doe",
    "dateOfBirth": "1990-01-01",
    "expiryDate": "2030-01-01",
    "securityFeatures": {
      "hologram": true,
      "microprint": true,
      "ultravioletFeatures": true
    },
    "possibleTampering": false
  }
}
```

### Admin Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| `/admin/users` | GET | Get all users with pagination | Yes (Admin) |
| `/admin/users/:id` | PUT | Update user role and status | Yes (Admin) |
| `/admin/stats` | GET | Get system statistics | Yes (Admin) |
| `/admin/logs` | GET | Get system logs | Yes (Admin) |
| `/admin/settings` | GET | Get system settings | Yes (Admin) |
| `/admin/settings` | PUT | Update system settings | Yes (Admin) |

#### Get System Statistics

```
GET /admin/stats
```

Response:
```json
{
  "users": {
    "total": 1250,
    "active": 1200,
    "byRole": {
      "ADMIN": 5,
      "GOVERNMENT": 50,
      "BUSINESS": 200,
      "INDIVIDUAL": 900,
      "TOURIST": 95
    },
    "newLast7Days": 75
  },
  "dids": {
    "total": 1500,
    "active": 1450,
    "byMethod": {
      "indy": 900,
      "key": 400,
      "web": 200
    }
  },
  "credentials": {
    "total": 3000,
    "active": 2950,
    "revoked": 50,
    "byType": {
      "IdentityCredential": 1200,
      "EducationCredential": 500,
      "EmploymentCredential": 800,
      "VisaCredential": 500
    },
    "issuedLast7Days": 150
  },
  "documents": {
    "total": 5000,
    "byType": {
      "IDENTITY": 2000,
      "FINANCIAL": 1500,
      "MEDICAL": 1000,
      "TRAVEL": 500
    },
    "uploadedLast7Days": 300
  },
  "system": {
    "uptime": "30 days, 5 hours, 20 minutes",
    "apiRequests": {
      "total": 1500000,
      "last24Hours": 50000
    }
  }
}
```

## GraphQL API

The QuantumTrust DPKI GraphQL API provides a flexible way to query and mutate data. The GraphQL endpoint is available at:

```
POST /graphql
```

### Authentication

Include the JWT token in the Authorization header of your GraphQL requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Schema

The GraphQL schema defines the available queries, mutations, and types. Here's an overview of the main components:

#### Types

```graphql
type User {
  id: ID!
  username: String!
  email: String!
  fullName: String
  country: String
  organization: String
  role: UserRole!
  createdAt: DateTime!
  updatedAt: DateTime!
  dids: [Did!]
  issuedCredentials: [VerifiableCredential!]
  heldCredentials: [VerifiableCredential!]
  documents: [Document!]
}

type Did {
  id: ID!
  did: String!
  method: String!
  name: String!
  description: String
  status: DidStatus!
  createdAt: DateTime!
  updatedAt: DateTime!
  user: User!
  publicKey: String!
  issuedCredentials: [VerifiableCredential!]
  heldCredentials: [VerifiableCredential!]
}

type VerifiableCredential {
  id: ID!
  type: String!
  issuerDid: Did!
  holderDid: Did!
  issuanceDate: DateTime!
  expirationDate: DateTime
  status: CredentialStatus!
  claims: JSON!
  proof: JSON!
}

type Document {
  id: ID!
  name: String!
  type: DocumentType!
  description: String
  fileType: String!
  fileSize: Int!
  uploadDate: DateTime!
  metadata: JSON
  status: DocumentStatus!
  user: User!
  hash: String!
  sharedWith: [DocumentShare!]
}

type DocumentShare {
  id: ID!
  document: Document!
  owner: User!
  recipient: User!
  permissions: [DocumentPermission!]!
  expirationDate: DateTime
  createdAt: DateTime!
}
```

#### Queries

```graphql
type Query {
  # User queries
  me: User!
  user(id: ID!): User
  users(skip: Int, take: Int): [User!]!
  
  # DID queries
  did(id: ID!): Did
  didByDid(did: String!): Did
  myDids: [Did!]!
  resolveDid(did: String!): JSON!
  
  # Verifiable Credential queries
  verifiableCredential(id: ID!): VerifiableCredential
  myIssuedCredentials: [VerifiableCredential!]!
  myHeldCredentials: [VerifiableCredential!]!
  verifyCredential(id: ID!): VerificationResult!
  
  # Document queries
  document(id: ID!): Document
  myDocuments(type: DocumentType): [Document!]!
  sharedWithMe: [Document!]!
  
  # Admin queries
  adminStats: AdminStats!
  adminLogs(skip: Int, take: Int, filter: LogFilterInput): [SystemLog!]!
  adminSettings: SystemSettings!
}
```

#### Mutations

```graphql
type Mutation {
  # Auth mutations
  register(input: RegisterInput!): User!
  login(input: LoginInput!): AuthPayload!
  refreshToken: AuthPayload!
  changePassword(input: ChangePasswordInput!): Boolean!
  
  # User mutations
  updateUser(id: ID!, input: UpdateUserInput!): User!
  
  # DID mutations
  createDid(input: CreateDidInput!): Did!
  updateDid(id: ID!, input: UpdateDidInput!): Did!
  revokeDid(id: ID!): Did!
  
  # Verifiable Credential mutations
  issueCredential(input: IssueCredentialInput!): VerifiableCredential!
  revokeCredential(id: ID!): VerifiableCredential!
  updateCredentialStatus(id: ID!, status: CredentialStatus!): VerifiableCredential!
  
  # Document mutations
  uploadDocument(input: UploadDocumentInput!): Document!
  updateDocument(id: ID!, input: UpdateDocumentInput!): Document!
  deleteDocument(id: ID!): Boolean!
  shareDocument(id: ID!, input: ShareDocumentInput!): DocumentShare!
  verifyDocument(id: ID!): DocumentVerificationResult!
  
  # Admin mutations
  updateUserRole(id: ID!, role: UserRole!): User!
  updateSystemSettings(input: UpdateSystemSettingsInput!): SystemSettings!
}
```

### Example Queries

#### Get Current User Profile

```graphql
query {
  me {
    id
    username
    email
    fullName
    country
    organization
    role
    dids {
      id
      did
      method
      name
      status
    }
    heldCredentials {
      id
      type
      issuanceDate
      status
    }
  }
}
```

#### Get User's DIDs with Credentials

```graphql
query {
  myDids {
    id
    did
    method
    name
    status
    heldCredentials {
      id
      type
      issuerDid {
        did
        user {
          organization
        }
      }
      issuanceDate
      expirationDate
      status
    }
  }
}
```

#### Get User's Documents

```graphql
query {
  myDocuments {
    id
    name
    type
    description
    fileType
    uploadDate
    status
    sharedWith {
      recipient {
        username
      }
      permissions
      expirationDate
    }
  }
}
```

### Example Mutations

#### Create a New DID

```graphql
mutation {
  createDid(input: {
    method: "indy",
    name: "My Primary DID",
    description: "DID for personal identity"
  }) {
    id
    did
    method
    name
    status
    publicKey
  }
}
```

#### Issue a Verifiable Credential

```graphql
mutation {
  issueCredential(input: {
    type: "IdentityCredential",
    recipientDidId: "did_id",
    claims: {
      name: "John Doe",
      dateOfBirth: "1990-01-01",
      nationality: "Singapore",
      idNumber: "S1234567A"
    },
    expirationDate: "2026-02-28T00:00:00.000Z"
  }) {
    id
    type
    issuerDid {
      did
    }
    holderDid {
      did
    }
    issuanceDate
    expirationDate
    status
    claims
    proof
  }
}
```

#### Share a Document

```graphql
mutation {
  shareDocument(
    id: "document_id",
    input: {
      recipientIds: ["user_id_1", "user_id_2"],
      permissions: [VIEW, DOWNLOAD],
      expirationDate: "2025-03-28T00:00:00.000Z"
    }
  ) {
    id
    document {
      name
    }
    recipient {
      username
    }
    permissions
    expirationDate
  }
}
```

## Error Handling

The QuantumTrust DPKI API uses standard HTTP status codes and structured error responses.

### REST API Error Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters long"
    }
  ]
}
```

### GraphQL API Error Format

```json
{
  "errors": [
    {
      "message": "Validation failed",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": [
        "createDid"
      ],
      "extensions": {
        "code": "BAD_USER_INPUT",
        "details": [
          {
            "field": "method",
            "message": "Method must be one of: indy, key, web"
          }
        ]
      }
    }
  ],
  "data": null
}
```

### Common Error Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

## Rate Limiting

The QuantumTrust DPKI API implements rate limiting to prevent abuse and ensure fair usage.

### Rate Limit Headers

Rate limit information is included in the response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1614556800
```

### Rate Limit Tiers

| User Role | Requests per Minute |
|-----------|---------------------|
| ADMIN | 1000 |
| GOVERNMENT | 500 |
| BUSINESS | 200 |
| INDIVIDUAL | 100 |
| TOURIST | 50 |

### Rate Limit Exceeded Response

```json
{
  "statusCode": 429,
  "message": "Rate limit exceeded. Try again in 30 seconds.",
  "error": "Too Many Requests"
}
```

## Webhooks

QuantumTrust DPKI supports webhooks for event-driven integrations.

### Webhook Events

| Event | Description |
|-------|-------------|
| `user.created` | A new user has been created |
| `user.updated` | A user has been updated |
| `did.created` | A new DID has been created |
| `did.updated` | A DID has been updated |
| `did.revoked` | A DID has been revoked |
| `credential.issued` | A new credential has been issued |
| `credential.verified` | A credential has been verified |
| `credential.revoked` | A credential has been revoked |
| `document.uploaded` | A new document has been uploaded |
| `document.shared` | A document has been shared |
| `document.verified` | A document has been verified |

### Webhook Payload Format

```json
{
  "id": "event_id",
  "type": "credential.issued",
  "createdAt": "2025-02-28T12:00:00.000Z",
  "data": {
    "credentialId": "credential_id",
    "type": "IdentityCredential",
    "issuerDid": "did:indy:123456789abcdefghi",
    "holderDid": "did:indy:987654321ihgfedcba"
  }
}
```

### Webhook Security

Webhook payloads are signed with HMAC-SHA256 to ensure authenticity. The signature is included in the `X-Signature` header:

```
X-Signature: sha256=7682fe7328c9e35f855bed093f89b8a91f93a02c5b012d9a8857a73a3c0ed411
```

To verify the signature:

1. Get the webhook secret from your account settings
2. Compute HMAC-SHA256 of the request body using the webhook secret
3. Compare the computed signature with the `X-Signature` header value

### Webhook Configuration

Webhooks can be configured in the admin dashboard or via the API:

```
POST /admin/webhooks
```

Request body:
```json
{
  "url": "https://example.com/webhook",
  "events": ["credential.issued", "credential.revoked"],
  "active": true,
  "description": "Credential events webhook"
}
```

Response:
```json
{
  "id": "webhook_id",
  "url": "https://example.com/webhook",
  "events": ["credential.issued", "credential.revoked"],
  "active": true,
  "description": "Credential events webhook",
  "secret": "whsec_8KYYXyDTYEDXGjKmm4Xh5xxEPmBa4Qhn",
  "createdAt": "2025-02-28T12:30:00.000Z"
}
```

For more detailed information on specific endpoints or features, please refer to the [QuantumTrust DPKI Developer Portal](https://developer.quantumtrust.io) or contact the support team.
