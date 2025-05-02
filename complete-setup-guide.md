# Complete Setup Guide for Zervi MRP Application

This guide will walk you through the complete process of setting up the Zervi MRP application on your machine.

## Prerequisites

- PostgreSQL installed
- Node.js installed
- PowerShell (for Windows)

## Step 1: Set the PostgreSQL Password

Since you reinstalled PostgreSQL and weren't prompted for a password, you need to set one manually:

1. Open Command Prompt as Administrator
2. Navigate to PostgreSQL bin directory:
   ```
   cd "C:\Program Files\PostgreSQL\15\bin"
   ```
3. Connect to PostgreSQL as the postgres user:
   ```
   psql -U postgres
   ```
4. If it connects without asking for a password, set a new password:
   ```sql
   ALTER USER postgres WITH PASSWORD 'zervi2025';
   ```
5. Type `\q` to exit psql

If you can't connect using the above method, refer to `reset-postgres-password.md` for alternative approaches.

## Step 2: Create the Database

You can create the database manually or use the provided scripts:

### Using the Batch Script:

1. Run `run-database-setup.bat`
2. Enter the password you set in Step 1

### Manually:

1. Connect to PostgreSQL:
   ```
   psql -U postgres
   ```
2. Create the database:
   ```sql
   CREATE DATABASE zervi_mrp;
   ```
3. Type `\q` to exit psql

## Step 3: Test the Database Connection

1. Navigate to the backend directory:
   ```
   cd src/backend
   ```
2. Run the connection test:
   ```
   node test-postgres-connection.js
   ```
3. If successful, you'll see: "SUCCESS: Connected without SSL!"

## Step 4: Run the Application Setup Script

1. Return to the project root:
   ```
   cd ../..
   ```
2. Run the setup script:
   ```
   powershell -ExecutionPolicy Bypass -File .\setup-dev-environment.ps1
   ```

This will:
- Install dependencies
- Run database migrations
- Start the development server

The server will be available at http://localhost:4000 when complete.

## Troubleshooting

### Connection Issues

If you encounter connection issues:

1. Verify the PostgreSQL service is running
2. Check if the password was set correctly
3. Ensure the database was created
4. Check the connection settings in:
   - `src/backend/run-migrations-sequential.js`
   - `src/backend/test-postgres-connection.js`

Both files have hardcoded connection settings that should match your PostgreSQL setup:
- host: 'localhost'
- port: 5432
- database: 'zervi_mrp'
- user: 'postgres'
- password: 'zervi2025'

If your PostgreSQL setup is different, update these files accordingly.

### PostgreSQL Service

If PostgreSQL isn't running:

1. Open Services (services.msc)
2. Find "PostgreSQL" service
3. Right-click and select "Start"

## Next Steps

After successfully setting up the application, you can:

1. Explore the API endpoints
2. Review the code structure
3. Make changes to the application as needed

The GitHub changes you wanted to look at are now accessible through the running application.