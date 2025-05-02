# Development Environment Setup Guide

This guide provides instructions for setting up the development environment for the Zervi MRP application. It includes an automated setup script that handles environment configuration, database setup, and starting the development server.

## Automated Setup Script

Create a file named `setup-dev-environment.bat` in the root directory with the following content:

```batch
@echo off
echo ===================================================
echo Zervi MRP Development Environment Setup
echo ===================================================
echo.

REM Navigate to the backend directory
cd src\backend
echo [1/6] Changed directory to src\backend

REM Check if .env file exists, if not create it from .env.fix
if not exist .env (
    echo [2/6] Creating .env file from .env.fix...
    copy .env.fix .env
    echo       Environment file created successfully.
) else (
    echo [2/6] Environment file (.env) already exists.
)

REM Install dependencies
echo [3/6] Installing dependencies...
call npm install
echo       Dependencies installed successfully.

REM Check PostgreSQL connection and create database if needed
echo [4/6] Checking database connection...
node test-postgres-connection.js
if %ERRORLEVEL% NEQ 0 (
    echo       Database connection failed. Please ensure PostgreSQL is running
    echo       and the credentials in .env are correct.
    exit /b 1
)

REM Run migrations
echo [5/6] Running database migrations...
node run-migrations-sequential.js
if %ERRORLEVEL% NEQ 0 (
    echo       Migration failed. Please check the error messages above.
    exit /b 1
)
echo       Migrations completed successfully.

REM Start the development server
echo [6/6] Starting development server...
echo       Server will be available at http://localhost:4000
echo       Press Ctrl+C to stop the server.
echo.
call npm run dev

exit /b 0
```

## Manual Setup Steps

If you prefer to run the steps manually, follow these instructions:

### 1. Environment Configuration

Create a `.env` file in the `src/backend` directory by copying from `.env.fix`:

```
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=zervi2025
DB_DATABASE=zervi_mrp

# Application Configuration
PORT=4000
NODE_ENV=development

# JWT Configuration (if using authentication)
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRATION=1h
```

### 2. Install Dependencies

Navigate to the backend directory and install dependencies:

```bash
cd src/backend
npm install
```

### 3. Database Setup

Ensure PostgreSQL is running and test the connection:

```bash
node test-postgres-connection.js
```

### 4. Run Migrations

Run the database migrations to set up the schema:

```bash
node run-migrations-sequential.js
```

### 5. Start the Development Server

Start the development server:

```bash
npm run dev
```

The server will be available at http://localhost:4000.

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. Ensure PostgreSQL is installed and running
2. Verify the credentials in the `.env` file match your PostgreSQL setup
3. Make sure the `zervi_mrp` database exists or the user has permissions to create it

### Migration Errors

If migrations fail:

1. Check if the database already has tables that conflict with the migrations
2. Look for error messages in the console output
3. Try running `node check-tables.js` to see the current state of the database

### Dependency Issues

If you encounter dependency issues:

1. Delete the `node_modules` directory
2. Delete the `package-lock.json` file
3. Run `npm install` again

## Development Workflow

After setting up the environment, you can:

1. Make changes to the code
2. The server will automatically restart when you save changes (thanks to ts-node)
3. Test your changes using API tools like Postman or the browser

## API Endpoints

Once the server is running, you can access the following endpoints:

- Authentication:
  - `POST /api/v1/auth/login` - Login with username and password
  - `POST /api/v1/auth/refresh` - Refresh authentication token

- Division Management:
  - `GET /api/v1/divisions` - Get all divisions
  - `GET /api/v1/divisions/:id` - Get division by ID
  - `POST /api/v1/divisions` - Create a new division
  - `PUT /api/v1/divisions/:id` - Update a division
  - `DELETE /api/v1/divisions/:id` - Delete a division

- Inventory Management:
  - Various endpoints for managing items, warehouses, lot tracking, etc.