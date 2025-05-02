# Editor's Guide for Zervi MRP Application

This guide is intended for editors or other developers who need to work with this Manufacturing MRP Application. It provides instructions for setting up the environment, understanding the codebase, and making changes.

## Project Overview

This is a Manufacturing Resource Planning (MRP) application with:
- Backend: Node.js with TypeScript and Express
- Database: PostgreSQL
- Frontend: React-based UI

The application includes modules for:
- Inventory management with batch tracking
- Bill of Materials (BOM) management
- Manufacturing orders
- Specialized operations

## Setup Instructions

### Prerequisites

1. **Node.js**: Version 14+ required
2. **PostgreSQL**: Version 13+ required
3. **Git**: For version control
4. **Code Editor**: VS Code recommended

### Step 1: Database Setup

1. Install PostgreSQL if not already installed
   ```
   https://www.postgresql.org/download/
   ```

2. During installation:
   - Set password to: `zervi2025`
   - Use default port: `5432`

3. After installation, create the database:
   ```sql
   CREATE DATABASE zervi_mrp;
   ```

### Step 2: Project Setup

1. Clone or copy the project to your machine

2. Install dependencies:
   ```
   cd src/backend
   npm install
   ```

3. Create a `.env` file in the `src/backend` directory:
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
   
   # JWT Configuration
   JWT_SECRET=zervi_mrp_secret_key
   JWT_EXPIRATION=1h
   ```

4. Run database migrations:
   ```
   node run-migrations-sequential.js
   ```

5. Start the development server:
   ```
   npm run dev
   ```

### Step 3: Accessing the Application

The application will be available at:
```
http://localhost:4000
```

## Project Structure

### Key Directories

- `src/backend`: Main backend code
  - `src/backend/src/models`: Database models
  - `src/backend/src/controllers`: API controllers
  - `src/backend/src/routes`: API routes
  - `src/backend/src/migrations`: Database migrations

- `src/frontend`: Frontend code
  - `src/frontend/src/pages`: React pages
  - `src/frontend/src/components`: React components
  - `src/frontend/src/services`: API services

- `manus_package`: Implementation code and documentation
  - `manus_package/docs`: Implementation guides
  - `manus_package/phase3_manufacturing_orders`: Manufacturing orders implementation
  - `manus_package/phase4_specialized_operations`: Specialized operations implementation

### Important Files

- `src/backend/src/index.ts`: Main entry point for the backend
- `src/backend/src/config/database.ts`: Database configuration
- `src/backend/run-migrations-sequential.js`: Script to run migrations
- `src/frontend/src/App.js`: Main React application

## Working with the Codebase

### Branch Information

The repository has several branches:
- `main`: The main branch with stable code
- `develop`: Development branch
- `local-modifications`: Branch with local modifications
- `safe-local-backend`: Branch with enhanced inventory features

### Making Changes

1. **Backend Changes**:
   - Models are defined using TypeORM in `src/backend/src/models`
   - Controllers handle API logic in `src/backend/src/controllers`
   - Routes define API endpoints in `src/backend/src/routes`

2. **Database Changes**:
   - Create a new migration file in `src/backend/src/migrations`
   - Run migrations using `node run-migrations-sequential.js`

3. **Frontend Changes**:
   - Pages are in `src/frontend/src/pages`
   - Components are in `src/frontend/src/components`
   - API services are in `src/frontend/src/services`

### Testing Changes

1. **Backend Testing**:
   - Use Postman or similar tool to test API endpoints
   - Check database changes using pgAdmin or psql

2. **Frontend Testing**:
   - Access the application at http://localhost:4000
   - Test UI components and interactions

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. Verify PostgreSQL is running:
   - Windows: Check Services app for postgresql-x64-XX service
   - Linux/Mac: `sudo service postgresql status`

2. Check connection settings in:
   - `.env` file
   - `src/backend/src/config/database.ts`

3. Test connection:
   ```
   cd src/backend
   node test-postgres-connection.js
   ```

### Application Startup Issues

If the application fails to start:

1. Check for errors in the console
2. Verify all dependencies are installed
3. Ensure the database is properly set up
4. Check port conflicts (default is 4000)

## Additional Resources

- `complete-setup-guide.md`: Comprehensive setup instructions
- `visual-guide.md`: Visual guide for PostgreSQL setup
- `reset-postgres-password.md`: Instructions for resetting PostgreSQL password

## GitHub Changes

To view the GitHub changes:

1. Check the commit history:
   ```
   git log --oneline
   ```

2. View differences between branches:
   ```
   git diff main..local-modifications
   git diff main..safe-local-backend
   ```

3. Key commits:
   - "Add enhanced inventory features with batch tracking"
   - "Save local modifications including TypeScript downgrade"
   - "Add BRANCH_INFORMATION.md with detailed explanation"

## Contact Information

If you encounter issues or have questions, please contact the project maintainer.