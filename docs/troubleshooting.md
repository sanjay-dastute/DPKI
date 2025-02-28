# QuantumTrust DPKI - Troubleshooting Guide

This guide provides solutions to common issues you may encounter while using the QuantumTrust DPKI application, along with auto-fixing procedures.

## Table of Contents
1. [Installation Issues](#installation-issues)
2. [Authentication Issues](#authentication-issues)
3. [DID Management Issues](#did-management-issues)
4. [Verifiable Credentials Issues](#verifiable-credentials-issues)
5. [Document Management Issues](#document-management-issues)
6. [Blockchain Integration Issues](#blockchain-integration-issues)
7. [Performance Issues](#performance-issues)
8. [Security Issues](#security-issues)
9. [Auto-Fixing Procedures](#auto-fixing-procedures)
10. [Contacting Support](#contacting-support)

## Installation Issues

### Database Connection Failures

**Issue**: Unable to connect to PostgreSQL, MongoDB, or Redis databases during installation.

**Symptoms**:
- Error messages like "ECONNREFUSED" or "Connection refused"
- Application fails to start with database-related errors

**Solutions**:

1. **Check Database Services**:
   ```bash
   # For PostgreSQL
   sudo systemctl status postgresql
   
   # For MongoDB
   sudo systemctl status mongod
   
   # For Redis
   sudo systemctl status redis-server
   ```

2. **Verify Connection Settings**:
   - Check the `.env` files to ensure database connection parameters are correct
   - Verify that the database host, port, username, and password are correct

3. **Test Database Connections**:
   ```bash
   # For PostgreSQL
   psql -h localhost -U postgres -d quantumtrust
   
   # For MongoDB
   mongosh mongodb://localhost:27017/quantumtrust
   
   # For Redis
   redis-cli ping
   ```

4. **Auto-Fix**:
   ```bash
   # Restart database services
   sudo systemctl restart postgresql
   sudo systemctl restart mongod
   sudo systemctl restart redis-server
   
   # Verify database existence and create if missing
   sudo -u postgres psql -c "SELECT 1 FROM pg_database WHERE datname = 'quantumtrust'" | grep -q 1 || sudo -u postgres psql -c "CREATE DATABASE quantumtrust"
   ```

### Node.js Dependency Issues

**Issue**: Problems with Node.js dependencies during installation.

**Symptoms**:
- Error messages during `npm install`
- Missing modules errors when starting the application
- Version conflicts

**Solutions**:

1. **Clear NPM Cache**:
   ```bash
   npm cache clean --force
   ```

2. **Remove and Reinstall Dependencies**:
   ```bash
   rm -rf node_modules
   rm package-lock.json
   npm install
   ```

3. **Check Node.js Version**:
   ```bash
   node --version
   ```
   Ensure you're using Node.js version 16.x or higher.

4. **Auto-Fix**:
   ```bash
   # Update npm
   npm install -g npm@latest
   
   # Install specific dependencies that might be causing issues
   npm install --save-exact [problematic-package]@[specific-version]
   ```

### Docker Issues

**Issue**: Problems with Docker containers during installation.

**Symptoms**:
- Docker containers fail to start
- Container exits immediately after starting
- Network connectivity issues between containers

**Solutions**:

1. **Check Docker Status**:
   ```bash
   docker ps -a
   docker-compose ps
   ```

2. **View Container Logs**:
   ```bash
   docker logs [container_name]
   docker-compose logs
   ```

3. **Rebuild Containers**:
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

4. **Auto-Fix**:
   ```bash
   # Reset Docker environment
   docker-compose down -v
   docker system prune -f
   docker-compose up -d
   ```

## Authentication Issues

### Login Failures

**Issue**: Unable to log in to the application.

**Symptoms**:
- "Invalid credentials" error messages
- Authentication token errors
- Endless login loops

**Solutions**:

1. **Verify Credentials**:
   - Ensure username and password are correct
   - Check for caps lock or typing errors

2. **Clear Browser Cache and Cookies**:
   - Clear browser cache and cookies
   - Try using incognito/private browsing mode

3. **Check JWT Configuration**:
   - Verify JWT secret in backend `.env` file
   - Check JWT expiration settings

4. **Auto-Fix**:
   ```bash
   # Reset user password (Admin only)
   # Run this in the backend directory
   npm run cli -- reset-password --username [username] --password [new_password]
   ```

### Token Expiration Issues

**Issue**: Frequent session timeouts or "Token expired" errors.

**Symptoms**:
- Unexpectedly logged out during active use
- "Token expired" error messages
- Need to log in repeatedly

**Solutions**:

1. **Check JWT Expiration Settings**:
   - Review the `JWT_EXPIRATION` setting in the backend `.env` file
   - Increase the expiration time if needed

2. **Implement Token Refresh**:
   - Ensure the frontend is using the token refresh endpoint
   - Check that token refresh is happening before expiration

3. **Auto-Fix**:
   ```javascript
   // Add this to your frontend authentication service
   // to automatically refresh tokens before they expire
   
   function setupTokenRefresh() {
     const token = localStorage.getItem('access_token');
     if (!token) return;
     
     try {
       const payload = JSON.parse(atob(token.split('.')[1]));
       const expiresIn = payload.exp * 1000 - Date.now();
       const refreshThreshold = 5 * 60 * 1000; // 5 minutes
       
       if (expiresIn < refreshThreshold) {
         refreshToken();
       } else {
         setTimeout(refreshToken, expiresIn - refreshThreshold);
       }
     } catch (error) {
       console.error('Error setting up token refresh:', error);
     }
   }
   ```

### Role-Based Access Control Issues

**Issue**: Unable to access features that should be available to your role.

**Symptoms**:
- "Forbidden" or "Unauthorized" error messages
- Missing menu items or features
- Access denied to specific endpoints

**Solutions**:

1. **Verify User Role**:
   - Check your assigned role in the user profile
   - Contact an administrator to verify role assignments

2. **Clear Local Storage**:
   - Clear browser local storage to refresh role information
   - Log out and log back in

3. **Auto-Fix**:
   ```bash
   # Update user role (Admin only)
   # Run this in the backend directory
   npm run cli -- update-user-role --username [username] --role [ADMIN|GOVERNMENT|BUSINESS|INDIVIDUAL|TOURIST]
   ```

## DID Management Issues

### DID Creation Failures

**Issue**: Unable to create new Decentralized Identifiers (DIDs).

**Symptoms**:
- Error messages during DID creation
- Timeout errors
- Blockchain connection errors

**Solutions**:

1. **Check Blockchain Connectivity**:
   - Verify that the blockchain services are running
   - Check network connectivity to blockchain nodes

2. **Verify DID Method Support**:
   - Ensure the selected DID method is supported
   - Check for any method-specific configuration issues

3. **Auto-Fix**:
   ```bash
   # Restart blockchain services
   docker-compose restart indy-node
   docker-compose restart ethereum-node
   
   # Clear DID creation cache
   npm run cli -- clear-cache --service did
   ```

### DID Resolution Issues

**Issue**: Unable to resolve DIDs to their DID Documents.

**Symptoms**:
- "DID not found" error messages
- Timeout during DID resolution
- Empty or incomplete DID Documents

**Solutions**:

1. **Verify DID Format**:
   - Ensure the DID follows the correct format for its method
   - Check for typos in the DID string

2. **Check DID Registry**:
   - Verify that the DID is registered on the appropriate ledger
   - Check the status of the DID (active, revoked)

3. **Auto-Fix**:
   ```bash
   # Sync DID registry
   npm run cli -- sync-did-registry
   
   # Rebuild DID resolution cache
   npm run cli -- rebuild-did-cache
   ```

### Key Management Issues

**Issue**: Problems with cryptographic keys associated with DIDs.

**Symptoms**:
- "Invalid key" error messages
- Signature verification failures
- Unable to perform operations requiring private keys

**Solutions**:

1. **Check Key Storage**:
   - Verify that key storage is properly configured
   - Check for permission issues on key files

2. **Regenerate Keys**:
   - If possible, regenerate keys for the DID
   - Update key references in the DID Document

3. **Auto-Fix**:
   ```bash
   # Rotate keys for a DID (if supported by the method)
   npm run cli -- rotate-did-keys --did [did]
   
   # Verify key integrity
   npm run cli -- verify-keys --did [did]
   ```

## Verifiable Credentials Issues

### Credential Issuance Failures

**Issue**: Unable to issue verifiable credentials.

**Symptoms**:
- Error messages during credential issuance
- Timeout errors
- Signature failures

**Solutions**:

1. **Check Issuer DID**:
   - Verify that the issuer DID is valid and active
   - Ensure the issuer has the necessary permissions

2. **Verify Credential Schema**:
   - Check that the credential follows the required schema
   - Validate all required fields are present

3. **Auto-Fix**:
   ```bash
   # Verify issuer capabilities
   npm run cli -- verify-issuer --did [issuer_did]
   
   # Update credential schemas
   npm run cli -- update-credential-schemas
   ```

### Credential Verification Failures

**Issue**: Unable to verify credentials or receiving verification errors.

**Symptoms**:
- "Invalid signature" error messages
- "Revoked credential" warnings
- "Expired credential" notices

**Solutions**:

1. **Check Credential Status**:
   - Verify that the credential has not been revoked
   - Check if the credential has expired

2. **Validate Issuer**:
   - Ensure the issuer DID is valid and trusted
   - Check the issuer's verification method

3. **Auto-Fix**:
   ```bash
   # Update revocation registry
   npm run cli -- update-revocation-registry
   
   # Rebuild verification cache
   npm run cli -- rebuild-verification-cache
   ```

### Selective Disclosure Issues

**Issue**: Problems with selective disclosure of credential attributes.

**Symptoms**:
- Error messages during presentation creation
- Verification failures for selective disclosures
- Privacy leaks (more information disclosed than intended)

**Solutions**:

1. **Check ZKP Configuration**:
   - Verify that zero-knowledge proof libraries are properly configured
   - Check for compatibility issues between ZKP versions

2. **Validate Disclosure Requests**:
   - Ensure the disclosure request is properly formatted
   - Check that requested attributes exist in the credential

3. **Auto-Fix**:
   ```bash
   # Update ZKP libraries
   npm run cli -- update-zkp-libraries
   
   # Test selective disclosure
   npm run cli -- test-selective-disclosure --credential [credential_id]
   ```

## Document Management Issues

### Document Upload Failures

**Issue**: Unable to upload documents to the system.

**Symptoms**:
- Error messages during document upload
- Timeout errors
- "File too large" warnings

**Solutions**:

1. **Check File Size and Type**:
   - Verify that the file size is within limits
   - Ensure the file type is supported

2. **Check Storage Configuration**:
   - Verify that document storage is properly configured
   - Check for storage space issues

3. **Auto-Fix**:
   ```bash
   # Clear upload cache
   npm run cli -- clear-upload-cache
   
   # Verify storage configuration
   npm run cli -- verify-storage-config
   ```

### Document Access Issues

**Issue**: Unable to access or download documents.

**Symptoms**:
- "Access denied" error messages
- Broken download links
- Corrupted document downloads

**Solutions**:

1. **Check Permissions**:
   - Verify that you have the necessary permissions to access the document
   - Check if the document has been shared with you

2. **Verify Document Status**:
   - Ensure the document has not been deleted or archived
   - Check if the document has expired

3. **Auto-Fix**:
   ```bash
   # Rebuild document index
   npm run cli -- rebuild-document-index
   
   # Verify document integrity
   npm run cli -- verify-document-integrity --document [document_id]
   ```

### Document Verification Issues

**Issue**: Problems with document verification.

**Symptoms**:
- "Verification failed" error messages
- Inconsistent verification results
- AI verification timeouts

**Solutions**:

1. **Check Document Quality**:
   - Ensure the document image is clear and legible
   - Check for proper document formatting

2. **Verify AI Services**:
   - Check that AI verification services are running
   - Verify API connections to external verification services

3. **Auto-Fix**:
   ```bash
   # Restart AI services
   docker-compose restart ai-service
   
   # Update document verification models
   npm run cli -- update-verification-models
   ```

## Blockchain Integration Issues

### Blockchain Connection Issues

**Issue**: Unable to connect to blockchain networks.

**Symptoms**:
- "Connection refused" error messages
- Timeout errors when interacting with blockchain
- Missing blockchain data

**Solutions**:

1. **Check Network Configuration**:
   - Verify blockchain node URLs in configuration
   - Check network connectivity to blockchain nodes

2. **Verify Node Status**:
   - Ensure blockchain nodes are running and synchronized
   - Check for blockchain network outages

3. **Auto-Fix**:
   ```bash
   # Restart blockchain connections
   npm run cli -- restart-blockchain-connections
   
   # Update blockchain node list
   npm run cli -- update-blockchain-nodes
   ```

### Smart Contract Issues

**Issue**: Problems with smart contract interactions.

**Symptoms**:
- "Transaction failed" error messages
- Gas estimation errors
- Contract execution reverts

**Solutions**:

1. **Check Contract Addresses**:
   - Verify that contract addresses are correct
   - Ensure contracts are deployed on the expected networks

2. **Validate Transaction Parameters**:
   - Check gas limits and prices
   - Verify transaction data format

3. **Auto-Fix**:
   ```bash
   # Verify contract integrity
   npm run cli -- verify-contracts
   
   # Update contract ABIs
   npm run cli -- update-contract-abis
   ```

### Consensus Issues

**Issue**: Problems with blockchain consensus.

**Symptoms**:
- Inconsistent transaction results
- Long confirmation times
- Fork detection warnings

**Solutions**:

1. **Check Network Status**:
   - Verify the blockchain network is operating normally
   - Check for known network issues or upgrades

2. **Adjust Confirmation Requirements**:
   - Increase the number of confirmations required for critical operations
   - Implement retry mechanisms for failed transactions

3. **Auto-Fix**:
   ```bash
   # Update consensus parameters
   npm run cli -- update-consensus-params
   
   # Sync blockchain state
   npm run cli -- sync-blockchain-state
   ```

## Performance Issues

### Slow Application Response

**Issue**: The application is responding slowly or timing out.

**Symptoms**:
- Long loading times
- Request timeouts
- Browser console errors

**Solutions**:

1. **Check Server Resources**:
   - Verify CPU, memory, and disk usage on the server
   - Check for resource-intensive processes

2. **Optimize Database Queries**:
   - Review and optimize slow database queries
   - Ensure proper indexing

3. **Auto-Fix**:
   ```bash
   # Clear application cache
   npm run cli -- clear-app-cache
   
   # Optimize database
   npm run cli -- optimize-database
   ```

### Memory Leaks

**Issue**: The application consumes increasing amounts of memory over time.

**Symptoms**:
- Increasing memory usage
- Performance degradation over time
- Application crashes

**Solutions**:

1. **Restart Services**:
   - Restart the application services
   - Implement regular service restarts

2. **Identify Memory Leaks**:
   - Use memory profiling tools to identify leaks
   - Check for unresolved promises or event listeners

3. **Auto-Fix**:
   ```bash
   # Implement memory monitoring
   npm run cli -- install-memory-monitor
   
   # Set up automatic service restarts
   echo "0 3 * * * docker-compose restart" | sudo tee -a /etc/crontab
   ```

### Database Performance Issues

**Issue**: Slow database operations affecting application performance.

**Symptoms**:
- Slow query responses
- Database timeout errors
- High database CPU usage

**Solutions**:

1. **Optimize Indexes**:
   - Review and optimize database indexes
   - Remove unnecessary indexes

2. **Implement Caching**:
   - Use Redis for caching frequently accessed data
   - Implement query result caching

3. **Auto-Fix**:
   ```bash
   # Analyze and optimize database
   npm run cli -- analyze-database
   
   # Implement recommended indexes
   npm run cli -- implement-recommended-indexes
   ```

## Security Issues

### Suspicious Login Attempts

**Issue**: Detection of suspicious login attempts or potential security breaches.

**Symptoms**:
- Multiple failed login attempts
- Logins from unusual locations
- Account lockouts

**Solutions**:

1. **Review Login Logs**:
   - Check authentication logs for suspicious patterns
   - Identify the source of suspicious attempts

2. **Strengthen Authentication**:
   - Enable multi-factor authentication
   - Implement IP-based restrictions

3. **Auto-Fix**:
   ```bash
   # Enable enhanced security monitoring
   npm run cli -- enable-security-monitoring
   
   # Reset user password and enable MFA
   npm run cli -- secure-account --username [username]
   ```

### Data Encryption Issues

**Issue**: Problems with data encryption or decryption.

**Symptoms**:
- "Decryption failed" error messages
- Corrupted encrypted data
- Key management errors

**Solutions**:

1. **Verify Encryption Keys**:
   - Check that encryption keys are properly stored
   - Verify key rotation policies

2. **Test Encryption Services**:
   - Run encryption service diagnostics
   - Verify encryption algorithm implementations

3. **Auto-Fix**:
   ```bash
   # Verify encryption configuration
   npm run cli -- verify-encryption-config
   
   # Rotate encryption keys
   npm run cli -- rotate-encryption-keys
   ```

### API Security Vulnerabilities

**Issue**: Potential security vulnerabilities in API endpoints.

**Symptoms**:
- Unusual API usage patterns
- Unexpected error responses
- Security scanner warnings

**Solutions**:

1. **Review API Logs**:
   - Analyze API access logs for suspicious patterns
   - Check for attempted exploits

2. **Implement Rate Limiting**:
   - Enable or strengthen API rate limiting
   - Implement IP-based restrictions for suspicious sources

3. **Auto-Fix**:
   ```bash
   # Enable API security monitoring
   npm run cli -- enable-api-security
   
   # Update security headers
   npm run cli -- update-security-headers
   ```

## Auto-Fixing Procedures

### System Health Check

The System Health Check is an automated procedure that diagnoses and fixes common issues:

```bash
# Run the system health check
npm run cli -- system-health-check
```

This command performs the following actions:
1. Checks database connections
2. Verifies blockchain connectivity
3. Tests API endpoints
4. Validates configuration settings
5. Checks for security vulnerabilities
6. Repairs common issues automatically

### Database Maintenance

The Database Maintenance procedure optimizes database performance:

```bash
# Run database maintenance
npm run cli -- database-maintenance
```

This command performs the following actions:
1. Analyzes database performance
2. Optimizes indexes
3. Cleans up unused data
4. Vacuums and reindexes tables
5. Updates statistics for query optimization

### Security Audit

The Security Audit procedure identifies and fixes security issues:

```bash
# Run security audit
npm run cli -- security-audit
```

This command performs the following actions:
1. Checks for outdated dependencies
2. Scans for known vulnerabilities
3. Verifies authentication mechanisms
4. Tests encryption implementation
5. Validates API security measures
6. Implements security patches where possible

### Blockchain Synchronization

The Blockchain Synchronization procedure ensures proper blockchain integration:

```bash
# Run blockchain synchronization
npm run cli -- blockchain-sync
```

This command performs the following actions:
1. Verifies blockchain node connections
2. Synchronizes local state with blockchain
3. Updates smart contract ABIs
4. Validates DID registry entries
5. Checks credential revocation status

### Cache Optimization

The Cache Optimization procedure improves application performance:

```bash
# Run cache optimization
npm run cli -- optimize-cache
```

This command performs the following actions:
1. Clears outdated cache entries
2. Rebuilds critical caches
3. Optimizes cache configuration
4. Implements intelligent cache prefetching
5. Balances memory usage for caching

## Contacting Support

If you continue to experience issues after trying the troubleshooting steps and auto-fixing procedures, please contact the QuantumTrust DPKI support team:

- **Email**: support@quantumtrust.io
- **Phone**: +65 6123 4567 (Singapore) / +966 11 234 5678 (Saudi Arabia)
- **Support Portal**: https://support.quantumtrust.io
- **Hours**: 24/7 for critical issues, 9 AM - 6 PM (local time) for standard support

When contacting support, please provide the following information:
1. Your username and organization
2. Detailed description of the issue
3. Steps to reproduce the problem
4. Error messages or screenshots
5. System logs (if available)
6. Actions you've already taken to resolve the issue

The support team will respond within 1 hour for critical issues and within 24 hours for standard issues.
