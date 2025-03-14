# QuantumTrust DPKI - User Login Instructions

This document provides instructions on how to log in to the QuantumTrust DPKI application using both predefined test accounts and newly registered accounts.

## Predefined Test Accounts

The QuantumTrust DPKI application includes predefined test accounts that can be used for testing:

1. **Admin User**:
   - Username: `admin`
   - Password: `Admin123!`
   - Role: ADMIN
   - Access: Full system administration capabilities

2. **Individual User**:
   - Username: `john_citizen`
   - Password: `Password123!`
   - Role: INDIVIDUAL
   - Access: Personal identity management

3. **Government User**:
   - Username: `sg_gov_health`
   - Password: `Password123!`
   - Role: GOVERNMENT
   - Access: Credential issuance and verification

4. **Business User**:
   - Username: `singapore_tech`
   - Password: `Password123!`
   - Role: BUSINESS
   - Access: Business credential management

5. **Tourist User**:
   - Username: `emma_tourist`
   - Password: `Password123!`
   - Role: TOURIST
   - Access: Temporary credential management

## Login Instructions

### Using Predefined Test Accounts

1. Start the frontend application:
   ```bash
   cd frontend
   npm run dev
   ```

2. Navigate to the login page:
   - Open your browser and go to http://localhost:3000/auth/login
   - Or click the "Login" button in the top-right corner of the application

3. Enter the username and password for the desired account from the list above

4. Click the "Login" button

5. You will be redirected to the dashboard if the login is successful

### Development Mode

The frontend application includes a development mode that automatically recognizes the predefined test accounts, so you don't need to set up a database with these users. This allows you to test the application without running the backend server.

### Using Newly Registered Accounts

For newly registered users, their data will be stored in the database, and they can log in using the same login form with their registered username and password.

To use newly registered accounts:

1. Start both the backend and frontend applications:
   ```bash
   # Terminal 1 - Start the backend
   cd backend
   npm run start:dev

   # Terminal 2 - Start the frontend
   cd frontend
   npm run dev
   ```

2. Ensure the database services are running:
   ```bash
   docker-compose up -d
   ```

3. Navigate to the login page and enter the credentials used during registration

## Loading Existing User Data

If you want to load existing user data from the database:

1. Ensure the database services are running:
   ```bash
   docker-compose up -d
   ```

2. Start the backend application with the seed option:
   ```bash
   cd backend
   npm run seed
   npm run start:dev
   ```

This will load the predefined users from the seed data files located in `backend/src/database/seed-data/`.

## Troubleshooting

- If you encounter a "Network error" message when trying to log in, ensure that the backend server is running and accessible.
- If you're using development mode, you don't need the backend server to log in with predefined test accounts.
- If you've registered a new user but can't log in, ensure that the database services are running and properly configured.

For more detailed troubleshooting information, please refer to the [Troubleshooting Guide](docs/troubleshooting.md).
