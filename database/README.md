# Zervi MRP Application Database

This directory contains the database schema scripts for the Zervi Manufacturing Resource Planning (MRP) application. 

## Structure

- **scripts/** - SQL scripts for creating and initializing the database schema
  - `00_create_all.sql` - Master script that runs all other scripts in order
  - `01_core_tables.sql` - Core organizational tables (companies, divisions, users, roles)
  - `02_inventory_tables.sql` - Inventory management tables
  - `03_bom_tables.sql` - Bill of Materials tables with multi-level support
  - `04_operations_tables.sql` - Manufacturing operations tables with specialized operations
  - `05_manufacturing_orders.sql` - Production planning and execution tables
  - `06_costs_and_transfers.sql` - Costing and inter-division transfer tables

- **migrations/** - Database migration files for future schema updates

## Features

The schema supports the following key features:

1. **Multi-Division Support** - Dedicated structures for all four divisions (Automotive, Camping, Apparel, Zervitek)
2. **Multi-level BOM Management** - Hierarchical product structures
3. **Specialized Manufacturing Operations** - Support for Laminating, Cutting, Sewing, and Embroidery
4. **Inter-Division Transfer System** - Vertical integration between divisions
5. **Comprehensive Costing Model** - Direct and indirect cost tracking

## Database Setup

### Option 1: Using the Master Script

1. Connect to your PostgreSQL server as a user with database creation privileges
2. Run the master script: `00_create_all.sql`

### Option 2: Manual Script Execution

For more control, run scripts individually in this order:
1. Create the database: `CREATE DATABASE zervi_mrp;`
2. Connect to the new database
3. Run `01_core_tables.sql`
4. Run `02_inventory_tables.sql`
5. Run `03_bom_tables.sql`
6. Run `04_operations_tables.sql`
7. Run `05_manufacturing_orders.sql`
8. Run `06_costs_and_transfers.sql`

## Default Credentials

The scripts create a default admin user:
- Username: `admin`
- Email: `admin@zervigroup.com`
- Password: `change_me` (hashed in database)

**Important**: Change the default password in a production environment.

## Schema Visualization

The schema can be visualized using DB visualization tools such as DBSchema, pgAdmin, or DBeaver.

## Database Connection

The application expects database connection details in the backend `.env` file:

```
DB_HOST=zervi-postgresql-u34072.vm.elestio.app
DB_PORT=25432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=zervi_mrp
```
