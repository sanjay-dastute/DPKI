# QuantumTrust DPKI - Windows Installation Guide

This guide provides step-by-step instructions for installing and configuring the QuantumTrust DPKI (Decentralized Public Key Infrastructure) application on Windows.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [System Requirements](#system-requirements)
3. [Installing Dependencies](#installing-dependencies)
4. [Setting Up the Environment](#setting-up-the-environment)
5. [Installing QuantumTrust DPKI](#installing-quantumtrust-dpki)
6. [Configuration](#configuration)
7. [Starting the Application](#starting-the-application)
8. [Verifying Installation](#verifying-installation)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

Before installing QuantumTrust DPKI, ensure you have the following prerequisites:

- Windows 10 or Windows 11 (64-bit)
- Administrator privileges
- Internet connection
- At least 8GB of RAM
- At least 20GB of free disk space

## System Requirements

- **Processor**: Intel Core i5 or equivalent (2.0 GHz or higher)
- **Memory**: 8GB RAM minimum, 16GB recommended
- **Storage**: 20GB of available space
- **Display**: 1280 x 720 screen resolution or higher
- **Internet**: Broadband connection

## Installing Dependencies

### 1. Install Node.js and npm

1. Download the latest LTS version of Node.js from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the installation wizard
3. Verify the installation by opening Command Prompt and running:
   ```
   node --version
   npm --version
   ```

### 2. Install Git

1. Download Git for Windows from [git-scm.com](https://git-scm.com/download/win)
2. Run the installer and follow the installation wizard
3. Verify the installation by opening Command Prompt and running:
   ```
   git --version
   ```

### 3. Install Docker Desktop

1. Download Docker Desktop for Windows from [docker.com](https://www.docker.com/products/docker-desktop)
2. Run the installer and follow the installation wizard
3. Ensure Hyper-V and Windows Containers features are enabled if prompted
4. Start Docker Desktop and verify it's running properly
5. Verify the installation by opening Command Prompt and running:
   ```
   docker --version
   docker-compose --version
   ```

### 4. Install PostgreSQL

1. Download PostgreSQL for Windows from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the installation wizard
3. Remember the password you set for the postgres user
4. Verify the installation by opening Command Prompt and running:
   ```
   psql --version
   ```

### 5. Install MongoDB

1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the installation wizard
3. Choose "Complete" installation
4. Install MongoDB Compass when prompted (optional but recommended)
5. Verify the installation by opening Command Prompt and running:
   ```
   mongod --version
   ```

### 6. Install Redis

1. Download the latest Redis Windows release from [github.com/microsoftarchive/redis/releases](https://github.com/microsoftarchive/redis/releases)
2. Extract the zip file to a location of your choice (e.g., `C:\Program Files\Redis`)
3. Open Command Prompt as Administrator and navigate to the Redis directory
4. Install Redis as a Windows service by running:
   ```
   redis-server --service-install redis.windows.conf
   ```
5. Start the Redis service:
   ```
   redis-server --service-start
   ```
6. Verify the installation by running:
   ```
   redis-cli ping
   ```
   You should receive a response of "PONG"

## Setting Up the Environment

### 1. Clone the Repository

1. Open Command Prompt
2. Navigate to the directory where you want to install QuantumTrust DPKI
3. Clone the repository:
   ```
   git clone https://github.com/sanjay-dastute/DPKI.git
   cd DPKI
   ```

### 2. Set Up Environment Variables

1. Create a `.env` file in the root directory of the project
2. Create a `.env` file in the `backend` directory
3. Create a `.env` file in the `frontend` directory
4. Add the following environment variables to the root `.env` file:
   ```
   # Database Configuration
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_password
   POSTGRES_DB=quantumtrust
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/quantumtrust

   # Redis Configuration
   REDIS_HOST=localhost
   REDIS_PORT=6379

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRATION=1d

   # Application Configuration
   NODE_ENV=development
   PORT=3000
   FRONTEND_URL=http://localhost:3001
   ```
5. Add the following environment variables to the `backend/.env` file:
   ```
   # Database Configuration
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_password
   POSTGRES_DB=quantumtrust
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/quantumtrust

   # Redis Configuration
   REDIS_HOST=localhost
   REDIS_PORT=6379

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRATION=1d

   # Application Configuration
   NODE_ENV=development
   PORT=3000
   FRONTEND_URL=http://localhost:3001

   # Blockchain Configuration
   ETHEREUM_RPC_URL=http://localhost:8545
   HYPERLEDGER_INDY_POOL_NAME=sandbox
   HYPERLEDGER_INDY_POOL_CONFIG={"genesis_txn":"path/to/genesis/file"}
   HYPERLEDGER_FABRIC_CONNECTION_PROFILE=path/to/connection/profile.json
   HYPERLEDGER_FABRIC_CHANNEL_NAME=mychannel
   HYPERLEDGER_FABRIC_CHAINCODE_NAME=dpki
   ```
6. Add the following environment variables to the `frontend/.env` file:
   ```
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3000/graphql

   # Application Configuration
   NEXT_PUBLIC_APP_NAME=QuantumTrust DPKI
   NEXT_PUBLIC_APP_DESCRIPTION=Decentralized Public Key Infrastructure
   ```

## Installing QuantumTrust DPKI

### 1. Install Backend Dependencies

1. Open Command Prompt
2. Navigate to the backend directory:
   ```
   cd DPKI/backend
   ```
3. Install dependencies:
   ```
   npm install
   ```

### 2. Install Frontend Dependencies

1. Open Command Prompt
2. Navigate to the frontend directory:
   ```
   cd DPKI/frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Configuration

### 1. Configure PostgreSQL

1. Open Command Prompt as Administrator
2. Connect to PostgreSQL:
   ```
   psql -U postgres
   ```
3. Create a new database:
   ```sql
   CREATE DATABASE quantumtrust;
   ```
4. Exit PostgreSQL:
   ```
   \q
   ```

### 2. Configure MongoDB

1. Open MongoDB Compass
2. Connect to the local MongoDB server
3. Create a new database named `quantumtrust`

### 3. Configure Docker

1. Open Docker Desktop
2. Ensure Docker is running properly
3. Navigate to the project root directory in Command Prompt
4. Start the Docker containers:
   ```
   docker-compose up -d
   ```

## Starting the Application

### 1. Start the Backend

1. Open Command Prompt
2. Navigate to the backend directory:
   ```
   cd DPKI/backend
   ```
3. Start the development server:
   ```
   npm run start:dev
   ```
4. The backend server should start and be available at `http://localhost:3000`

### 2. Start the Frontend

1. Open another Command Prompt
2. Navigate to the frontend directory:
   ```
   cd DPKI/frontend
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. The frontend application should start and be available at `http://localhost:3001`

## Verifying Installation

### 1. Verify Backend

1. Open a web browser
2. Navigate to `http://localhost:3000/api`
3. You should see the Swagger API documentation

### 2. Verify Frontend

1. Open a web browser
2. Navigate to `http://localhost:3001`
3. You should see the QuantumTrust DPKI login page

### 3. Verify Database Connections

1. Open the backend logs in Command Prompt
2. Verify that the application has successfully connected to PostgreSQL, MongoDB, and Redis
3. Check for any error messages

## Troubleshooting

### Common Issues and Solutions

#### Port Conflicts

If you encounter port conflicts, you can change the ports in the `.env` files and `docker-compose.yml` file.

#### Database Connection Issues

1. Ensure that PostgreSQL, MongoDB, and Redis services are running
2. Check the connection strings in the `.env` files
3. Verify that the database credentials are correct

#### Node.js Version Issues

QuantumTrust DPKI requires Node.js version 16 or higher. If you encounter issues with Node.js, try:
1. Updating Node.js to the latest LTS version
2. Clearing the npm cache:
   ```
   npm cache clean --force
   ```
3. Reinstalling dependencies:
   ```
   rm -rf node_modules
   npm install
   ```

#### Docker Issues

1. Ensure Docker Desktop is running
2. Restart Docker Desktop if necessary
3. Check Docker logs for any error messages
4. Try rebuilding the Docker containers:
   ```
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

#### Windows-Specific Issues

1. Ensure Windows Defender Firewall is not blocking any required connections
2. Run Command Prompt as Administrator when necessary
3. Check Windows Event Viewer for any relevant error messages

For additional support, please refer to the [Troubleshooting Guide](troubleshooting.md) or contact the QuantumTrust DPKI support team.
