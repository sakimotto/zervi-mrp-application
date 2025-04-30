# PostgreSQL Database Setup Guide

## Current Configuration

### Database Settings
- **Host**: localhost
- **Port**: 5432
- **Username**: postgres
- **Password**: zervi2025
- **Database**: zervi_mrp

### Environment Files
The project contains multiple `.env` files that need to be synchronized:
- `src/backend/.env`
- `home/ubuntu/mrp-app/backend/.env`

## Setup Steps Completed

1. ✅ PostgreSQL has been installed locally
2. ✅ Local database `zervi_mrp` has been created
3. ✅ `.env` files have been updated with local credentials
4. ✅ SSL configuration has been commented out in `database.ts`
5. ✅ Created test scripts to verify connection:
   - `test-db-connection.ts` (TypeORM-based)
   - `simple-db-test.js` (Native pg client)

## Current Issues

1. **Authentication Errors**: Despite correct credentials, password authentication errors persist
2. **Connection Testing**: Need to verify if PostgreSQL is properly accepting connections
3. **Environment Variables**: Potential issues with how environment variables are loaded

## Next Steps

1. **Verify PostgreSQL Service**:
   ```powershell
   # Check if PostgreSQL service is running
   Get-Service -Name postgresql*
   
   # Start the service if it's not running
   Start-Service -Name postgresql*
   ```

2. **Test Direct Connection**:
   ```powershell
   # Connect using psql (if installed)
   psql -U postgres -d zervi_mrp
   
   # Alternative: Use the simple-db-test.js script
   node src/backend/simple-db-test.js
   ```

3. **Run Migrations** (after connection is verified):
   ```powershell
   # Navigate to backend directory
   cd src/backend
   
   # Run migrations
   npm run migration:run
   ```

## Troubleshooting Common Issues

### PostgreSQL Authentication Failed
1. Verify PostgreSQL is running
2. Check if password is correct in PostgreSQL
3. Try changing authentication method in `pg_hba.conf`
4. Ensure environment variables are loaded correctly

### Connection Refused
1. Verify PostgreSQL is running on port 5432
2. Check firewall settings
3. Ensure PostgreSQL is configured to accept connections

### Database Does Not Exist
1. Create the database manually:
   ```sql
   CREATE DATABASE zervi_mrp;
   ```

## Project Structure
The database configuration is located in:
- `src/backend/src/config/database.ts`

Migration files are located in:
- `src/backend/src/migrations/`

## Additional Resources
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeORM Documentation](https://typeorm.io/)
