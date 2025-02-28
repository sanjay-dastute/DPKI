# QuantumTrust DPKI - Usage Guide

This guide provides comprehensive instructions for using the QuantumTrust DPKI (Decentralized Public Key Infrastructure) application. It covers all major features and workflows for different user roles.

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [User Roles and Permissions](#user-roles-and-permissions)
4. [Authentication](#authentication)
5. [Dashboard Overview](#dashboard-overview)
6. [Managing DIDs (Decentralized Identifiers)](#managing-dids)
7. [Verifiable Credentials](#verifiable-credentials)
8. [Document Management](#document-management)
9. [Wallet Integration](#wallet-integration)
10. [Analytics and Reporting](#analytics-and-reporting)
11. [Administration](#administration)
12. [Security Best Practices](#security-best-practices)

## Introduction

QuantumTrust DPKI is a comprehensive Decentralized Public Key Infrastructure system designed for Singapore and Saudi Arabia. It provides secure, compliant digital identity management with quantum-resistant encryption and regulatory compliance features.

The application enables users to:
- Create and manage decentralized identifiers (DIDs)
- Issue, verify, and manage verifiable credentials
- Securely store and share digital documents
- Connect with blockchain wallets for enhanced security
- Monitor and analyze identity-related activities
- Ensure compliance with regulatory requirements

## Getting Started

### System Requirements

Before using QuantumTrust DPKI, ensure your system meets the following requirements:
- Modern web browser (Chrome, Firefox, Edge, or Safari)
- Internet connection
- Screen resolution of 1280 x 720 or higher

### Accessing the Application

1. Open your web browser
2. Navigate to the application URL (e.g., `http://localhost:3001` for local installations)
3. You will be directed to the login page

## User Roles and Permissions

QuantumTrust DPKI supports the following user roles, each with specific permissions:

### Individual User
- Create and manage personal DIDs
- Receive and store verifiable credentials
- Upload and manage personal documents
- Connect personal blockchain wallets
- View personal analytics

### Business User
- Create and manage organizational DIDs
- Issue verifiable credentials to individuals
- Verify credentials presented by individuals
- Upload and manage business documents
- Connect organizational blockchain wallets
- View business-related analytics

### Government User
- Create and manage government agency DIDs
- Issue official verifiable credentials
- Verify credentials presented by individuals and businesses
- Upload and manage government documents
- View comprehensive analytics
- Access regulatory compliance features

### Tourist User
- Create temporary DIDs
- Receive and store temporary verifiable credentials
- Upload and manage travel documents
- View limited analytics

### Admin User
- Manage all users and their permissions
- Configure system settings
- Monitor system performance
- Access all features and data
- Generate system-wide reports

## Authentication

### Registration

1. Click on the "Register" button on the login page
2. Fill in the registration form with the following information:
   - Username (required)
   - Email (required)
   - Password (required)
   - Confirm Password (required)
   - Full Name
   - Country (Singapore, Saudi Arabia, or Other)
   - Organization (if applicable)
3. Click the "Register" button to create your account
4. You will receive a confirmation email (if email verification is enabled)
5. Click the verification link in the email to activate your account

### Login

1. Navigate to the login page
2. Enter your username and password
3. Click the "Login" button
4. If your credentials are valid, you will be redirected to the dashboard

### Password Recovery

1. Click on the "Forgot Password" link on the login page
2. Enter your registered email address
3. Click the "Reset Password" button
4. Check your email for a password reset link
5. Click the link and follow the instructions to create a new password

### Logout

1. Click on your username in the top-right corner of the application
2. Select "Logout" from the dropdown menu
3. You will be redirected to the login page

## Dashboard Overview

The dashboard is the main interface of the QuantumTrust DPKI application. It provides an overview of your activities and quick access to all features.

### Dashboard Components

1. **Navigation Bar**: Located at the top of the screen, it provides access to all main features
2. **User Profile**: Displays your user information and provides access to profile settings
3. **Quick Stats**: Shows key metrics such as the number of DIDs, credentials, and documents
4. **Recent Activities**: Displays your recent actions within the system
5. **Notifications**: Shows important alerts and updates
6. **Quick Actions**: Provides shortcuts to common tasks

### Customizing the Dashboard

1. Click on the "Customize" button in the top-right corner of the dashboard
2. Select the widgets you want to display
3. Arrange the widgets by dragging and dropping them
4. Click "Save" to apply your changes

## Managing DIDs

Decentralized Identifiers (DIDs) are the foundation of your digital identity in QuantumTrust DPKI.

### Creating a New DID

1. Navigate to the "DIDs" section from the main menu
2. Click on the "Create New DID" button
3. Select the DID method (e.g., "did:indy", "did:web", "did:key")
4. Enter the required information for the selected method
5. Click "Create" to generate your new DID
6. Your DID will be stored securely and displayed in your DID list

### Viewing Your DIDs

1. Navigate to the "DIDs" section from the main menu
2. You will see a list of all your DIDs
3. Click on a DID to view its details, including:
   - DID identifier
   - Creation date
   - Status (active, revoked, expired)
   - Associated verifiable credentials
   - Public key information

### Updating a DID

1. Navigate to the "DIDs" section from the main menu
2. Find the DID you want to update
3. Click on the "Edit" button
4. Update the relevant information
5. Click "Save" to apply your changes

### Revoking a DID

1. Navigate to the "DIDs" section from the main menu
2. Find the DID you want to revoke
3. Click on the "Revoke" button
4. Confirm the revocation
5. The DID status will be updated to "Revoked"

## Verifiable Credentials

Verifiable Credentials are digital attestations that can be cryptographically verified.

### Issuing a Credential (for Issuers)

1. Navigate to the "Verifiable Credentials" section from the main menu
2. Click on the "Issue New Credential" button
3. Select the credential type (e.g., "Identity", "Education", "Employment")
4. Enter the recipient's DID or select from your contacts
5. Fill in the credential details
6. Set an expiration date (optional)
7. Click "Issue" to create and send the credential
8. The credential will be cryptographically signed with your DID

### Receiving a Credential

1. When someone issues a credential to you, you will receive a notification
2. Navigate to the "Verifiable Credentials" section from the main menu
3. Click on the "Pending" tab to see incoming credential offers
4. Review the credential details
5. Click "Accept" to add the credential to your wallet
6. The credential will now appear in your credentials list

### Viewing Your Credentials

1. Navigate to the "Verifiable Credentials" section from the main menu
2. You will see a list of all your credentials
3. Click on a credential to view its details, including:
   - Issuer information
   - Issue date
   - Expiration date
   - Credential claims
   - Verification status

### Verifying a Credential

1. Navigate to the "Verifiable Credentials" section from the main menu
2. Click on the "Verify" tab
3. Enter the credential ID or scan a QR code
4. The system will verify the credential's authenticity
5. View the verification results, including:
   - Issuer verification
   - Signature validation
   - Revocation status
   - Expiration check

### Revoking a Credential (for Issuers)

1. Navigate to the "Verifiable Credentials" section from the main menu
2. Find the credential you want to revoke
3. Click on the "Revoke" button
4. Provide a reason for revocation
5. Confirm the revocation
6. The credential status will be updated to "Revoked"

### Sharing a Credential

1. Navigate to the "Verifiable Credentials" section from the main menu
2. Find the credential you want to share
3. Click on the "Share" button
4. Select the sharing method:
   - Generate a QR code
   - Send via email
   - Create a shareable link
5. Set sharing permissions and expiration
6. Complete the sharing process

## Document Management

QuantumTrust DPKI allows you to securely store, manage, and share digital documents.

### Uploading a Document

1. Navigate to the "Documents" section from the main menu
2. Click on the "Upload Document" button
3. Select the document type (e.g., "Identity", "Financial", "Medical")
4. Choose the file from your computer
5. Add metadata such as title, description, and tags
6. Set privacy settings
7. Click "Upload" to store the document securely

### Viewing Your Documents

1. Navigate to the "Documents" section from the main menu
2. You will see a list of all your documents
3. Use filters to narrow down the list by type, date, or tags
4. Click on a document to view its details and preview

### Organizing Documents

1. Navigate to the "Documents" section from the main menu
2. Click on the "Folders" tab
3. Create new folders by clicking "New Folder"
4. Drag and drop documents into folders
5. Use tags to categorize documents across folders

### Sharing Documents

1. Navigate to the "Documents" section from the main menu
2. Find the document you want to share
3. Click on the "Share" button
4. Select the recipient(s) by entering their DID or email
5. Set permissions (view, download, edit)
6. Set an expiration date for access (optional)
7. Click "Share" to grant access

### Document Verification

1. Navigate to the "Documents" section from the main menu
2. Find the document you want to verify
3. Click on the "Verify" button
4. The system will check the document's authenticity
5. View the verification results, including:
   - Digital signature validation
   - Timestamp verification
   - Integrity check

## Wallet Integration

QuantumTrust DPKI supports integration with blockchain wallets for enhanced security.

### Connecting a Wallet

1. Navigate to the "Wallet" section from the main menu
2. Click on the "Connect Wallet" button
3. Select your wallet provider (e.g., MetaMask, Ledger)
4. Follow the wallet-specific instructions to connect
5. Approve the connection request in your wallet
6. Your wallet will now be connected to your QuantumTrust DPKI account

### Managing Connected Wallets

1. Navigate to the "Wallet" section from the main menu
2. View all your connected wallets
3. Click on a wallet to see details such as:
   - Wallet address
   - Connection date
   - Associated DIDs
4. Disconnect a wallet by clicking the "Disconnect" button

### Using Your Wallet for Authentication

1. Navigate to the login page
2. Click on the "Login with Wallet" button
3. Select your wallet provider
4. Sign the authentication message with your wallet
5. You will be logged in to your QuantumTrust DPKI account

### Signing Documents with Your Wallet

1. Navigate to the "Documents" section from the main menu
2. Find the document you want to sign
3. Click on the "Sign with Wallet" button
4. Select the wallet you want to use
5. Confirm the signing operation in your wallet
6. The document will be cryptographically signed with your wallet key

## Analytics and Reporting

QuantumTrust DPKI provides comprehensive analytics and reporting features.

### Viewing Analytics Dashboard

1. Navigate to the "Analytics" section from the main menu
2. View the analytics dashboard with key metrics and visualizations
3. Explore different categories:
   - Identity metrics
   - Credential statistics
   - Document analytics
   - Security insights
   - Compliance reports

### Generating Custom Reports

1. Navigate to the "Analytics" section from the main menu
2. Click on the "Reports" tab
3. Click "Create New Report"
4. Select the report type
5. Configure the report parameters:
   - Time period
   - Data categories
   - Visualization options
6. Click "Generate" to create the report
7. View, download, or share the report

### Setting Up Alerts

1. Navigate to the "Analytics" section from the main menu
2. Click on the "Alerts" tab
3. Click "Create New Alert"
4. Select the alert type (e.g., security, credential expiration)
5. Configure the alert conditions
6. Set notification preferences (email, in-app)
7. Click "Save" to activate the alert

## Administration

The administration features are available only to users with admin privileges.

### User Management

1. Navigate to the "Admin" section from the main menu
2. Click on the "Users" tab
3. View all users in the system
4. Perform user management tasks:
   - Create new users
   - Edit user details
   - Assign roles and permissions
   - Activate or deactivate accounts
   - Reset passwords

### System Configuration

1. Navigate to the "Admin" section from the main menu
2. Click on the "Settings" tab
3. Configure various system settings:
   - Security policies
   - Authentication methods
   - Email notifications
   - Blockchain connections
   - API integrations

### Audit Logs

1. Navigate to the "Admin" section from the main menu
2. Click on the "Audit Logs" tab
3. View all system activities
4. Filter logs by:
   - User
   - Action type
   - Date range
   - Status
5. Export logs for compliance reporting

### Backup and Recovery

1. Navigate to the "Admin" section from the main menu
2. Click on the "Backup" tab
3. Configure backup settings:
   - Backup frequency
   - Retention policy
   - Storage location
4. Perform manual backups
5. Restore from backups when needed

## Security Best Practices

To ensure the security of your QuantumTrust DPKI account and data, follow these best practices:

### Account Security

1. Use a strong, unique password
2. Enable two-factor authentication
3. Regularly review your account activity
4. Log out when using shared computers
5. Keep your email address up to date for recovery purposes

### DID Security

1. Backup your DID recovery keys
2. Store recovery keys in secure, offline locations
3. Use multiple DIDs for different contexts
4. Regularly rotate DID keys
5. Revoke compromised DIDs immediately

### Credential Security

1. Verify the issuer before accepting credentials
2. Regularly check credential expiration dates
3. Revoke credentials when no longer needed
4. Be cautious when sharing credentials
5. Use selective disclosure when possible

### Document Security

1. Encrypt sensitive documents
2. Set appropriate access controls
3. Regularly review shared document permissions
4. Use secure channels for document sharing
5. Verify document integrity before using

### Wallet Security

1. Use hardware wallets for enhanced security
2. Never share your wallet seed phrase
3. Keep your wallet software updated
4. Use different wallets for different purposes
5. Verify all transaction requests before signing

For additional security guidance, please refer to the [Security Guide](security_guide.md) or contact the QuantumTrust DPKI support team.
