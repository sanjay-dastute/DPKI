# QuantumTrust DPKI - Ubuntu Installation Guide

This guide provides step-by-step instructions for installing and configuring the QuantumTrust DPKI (Decentralized Public Key Infrastructure) application on Ubuntu.

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

- Ubuntu 20.04 LTS or newer
- Sudo privileges
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

### 1. Update System Packages

```bash
sudo apt update
sudo apt upgrade -y
```

### 2. Install Node.js and npm

```bash
# Install Node.js 16.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### 3. Install Git

```bash
sudo apt install -y git

# Verify installation
git --version
```

### 4. Install Docker and Docker Compose

```bash
# Install Docker
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Add your user to the docker group to run Docker without sudo
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

Note: You may need to log out and log back in for the group changes to take effect.

### 5. Install PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
psql --version
```

### 6. Install MongoDB

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -

# Create a list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

# Reload local package database
sudo apt update

# Install MongoDB
sudo apt install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify installation
mongod --version
```

### 7. Install Redis

```bash
sudo apt install -y redis-server

# Configure Redis to start on boot
sudo systemctl enable redis-server

# Verify installation
redis-cli ping
```

You should receive a response of "PONG".

## Setting Up the Environment

### 1. Clone the Repository

```bash
# Navigate to your preferred directory
cd ~
mkdir -p repos
cd repos

# Clone the repository
git clone https://github.com/sanjay-dastute/DPKI.git
cd DPKI
```

### 2. Set Up Environment Variables

Create the necessary environment files:

```bash
# Create .env files
touch .env
touch backend/.env
touch frontend/.env
```

Add the following environment variables to the root `.env` file:

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

Add the following environment variables to the `backend/.env` file:

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

Add the following environment variables to the `frontend/.env` file:

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

```bash
# Navigate to the backend directory
cd ~/repos/DPKI/backend

# Install dependencies
npm install
```

### 2. Install Frontend Dependencies

```bash
# Navigate to the frontend directory
cd ~/repos/DPKI/frontend

# Install dependencies
npm install
```

## Configuration

### 1. Configure PostgreSQL

```bash
# Connect to PostgreSQL as the postgres user
sudo -u postgres psql

# Create a new database
CREATE DATABASE quantumtrust;

# Create a new user (optional)
CREATE USER quantumuser WITH ENCRYPTED PASSWORD 'your_password';

# Grant privileges to the user
GRANT ALL PRIVILEGES ON DATABASE quantumtrust TO quantumuser;

# Exit PostgreSQL
\q
```

If you create a new user, update the `.env` files with the new username and password.

### 2. Configure MongoDB

```bash
# Start the MongoDB shell
mongosh

# Create a new database
use quantumtrust

# Exit MongoDB shell
exit
```

### 3. Configure Docker

```bash
# Navigate to the project root directory
cd ~/repos/DPKI

# Start the Docker containers
docker-compose up -d
```

## Starting the Application

### 1. Start the Backend

```bash
# Navigate to the backend directory
cd ~/repos/DPKI/backend

# Start the development server
npm run start:dev
```

The backend server should start and be available at `http://localhost:3000`.

### 2. Start the Frontend

Open a new terminal window and run:

```bash
# Navigate to the frontend directory
cd ~/repos/DPKI/frontend

# Start the development server
npm run dev
```

The frontend application should start and be available at `http://localhost:3001`.

## Verifying Installation

### 1. Verify Backend

Open a web browser and navigate to `http://localhost:3000/api`. You should see the Swagger API documentation.

### 2. Verify Frontend

Open a web browser and navigate to `http://localhost:3001`. You should see the QuantumTrust DPKI login page.

### 3. Verify Database Connections

Check the backend logs to verify that the application has successfully connected to PostgreSQL, MongoDB, and Redis. Look for any error messages.

## Troubleshooting

### Common Issues and Solutions

#### Port Conflicts

If you encounter port conflicts, you can change the ports in the `.env` files and `docker-compose.yml` file.

#### Database Connection Issues

1. Ensure that PostgreSQL, MongoDB, and Redis services are running:

```bash
sudo systemctl status postgresql
sudo systemctl status mongod
sudo systemctl status redis-server
```

2. Check the connection strings in the `.env` files.
3. Verify that the database credentials are correct.

#### Node.js Version Issues

QuantumTrust DPKI requires Node.js version 16 or higher. If you encounter issues with Node.js, try:

```bash
# Update Node.js to the latest LTS version
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# Clear the npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install
```

#### Docker Issues

1. Ensure Docker service is running:

```bash
sudo systemctl status docker
```

2. Check Docker logs for any error messages:

```bash
docker logs <container_id>
```

3. Try rebuilding the Docker containers:

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

#### Permission Issues

If you encounter permission issues, ensure that your user has the necessary permissions:

```bash
# Add your user to the docker group
sudo usermod -aG docker $USER

# Fix permissions for the project directory
sudo chown -R $USER:$USER ~/repos/DPKI
```

#### Network Issues

If you encounter network issues, check your firewall settings:

```bash
# Check if ufw is enabled
sudo ufw status

# If enabled, allow the necessary ports
sudo ufw allow 3000
sudo ufw allow 3001
sudo ufw allow 5432
sudo ufw allow 27017
sudo ufw allow 6379
```

For additional support, please refer to the [Troubleshooting Guide](troubleshooting.md) or contact the QuantumTrust DPKI support team.
