# Zervi MRP Application Database

This directory contains the database schema and scripts for the Zervi MRP application.

## Database Structure

The Zervi MRP database is designed to support a multi-division manufacturing company with vertical integration capabilities. The schema is organized into the following components:

1. **Core Tables** - Companies, Divisions, Users, Roles, and access control
2. **Inventory Management** - Items, Categories, Warehouses, Storage, and Inventory tracking
3. **Bill of Materials (BOM)** - Product structures with multi-level BOM support
4. **Manufacturing Operations** - Work centers, Workstations, Routings, and specialized operations
5. **Manufacturing Orders** - Production planning and execution
6. **Costs and Transfers** - Costing and inter-division transfer capabilities

## Implementation Instructions

### Prerequisites

- PostgreSQL 12+ (Elestio PostgreSQL instance)
- Connection details configured in environment variables or connection strings
- Administrator rights to create extensions and tables

### Database Connection

The application uses the following connection parameters:

```sql
DB_HOST=zervi-postgresql-u34072.vm.elestio.app
DB_PORT=25432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=zervi_mrp
```

### Script Execution Order

The scripts must be executed in the following specific order to ensure all dependencies are satisfied:

1. `00_create_all.sql` - Master script that executes all other scripts (alternative: run scripts individually)
2. `01_core_tables.sql` - Organizational structure and users
3. `02_inventory_tables.sql` - Inventory management
4. `03_bom_tables.sql` - Bill of Materials
5. `04_operations_tables.sql` - Manufacturing operations
6. `05_manufacturing_orders.sql` - Production orders
7. `06_costs_and_transfers.sql` - Costing and vertical integration

### Execution Method

For best results, use one of these methods:

#### Using pgAdmin (Recommended)

1. Connect to the Zervi MRP database in pgAdmin
2. Open a new Query Tool window
3. Copy and paste each script's contents
4. Execute scripts in order, one at a time
5. Verify tables were created after each script

#### Using DBSchema

1. Connect to the Zervi MRP database in DBSchema
2. Open SQL Editor
3. Execute scripts one at a time in order
4. Refresh model after execution to visualize tables

## Implementation Notes and Lessons Learned

### Extension Creation

When executing `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`, you may encounter permission issues if your database user doesn't have superuser privileges. Solutions:

1. Execute extension creation separately using a superuser account
2. Grant necessary permissions to your database user
3. Skip extension creation if it's already installed

### Dependencies Between Scripts

Scripts must be executed in the correct order due to table dependencies:

- Core tables must be created first as they're referenced by all other tables
- Inventory tables must be created before BOM tables
- Operation tables must be created before manufacturing order tables
- Costs and transfer tables should be created last

Common errors you might encounter:

- `relation 'routings' does not exist` - Run 04_operations_tables.sql first
- `relation 'operations' does not exist` - Ensure previous scripts completed successfully

### Script Execution Best Practices

1. Always run scripts in a clean query window to avoid partial execution
2. Check for and resolve any errors before proceeding to the next script
3. Verify table creation by refreshing the database schema view
4. Keep track of which scripts have been executed successfully

### Seed Data

The scripts include seed data for:

- Default company and divisions
- User roles and admin account
- Units of measurement
- Item categories
- Sample BOMs
- Work centers
- Cost types
- Division integration relationships

## Troubleshooting

### Common Issues

1. **Permission Errors**: Ensure your database user has sufficient privileges.
2. **Relation Does Not Exist**: Scripts are being executed out of order. Follow the sequence above.
3. **Duplicate Key Violations**: The script was already partially executed. Clear the schema or use IF NOT EXISTS clauses.
4. **Connection Issues**: Verify your connection parameters and network access to the database server.

### Schema Visualization

If tables are created but not visible in DBSchema:

1. Refresh the model in DBSchema
2. Check if the correct schema is selected (usually "public")
3. Verify the connection is still active

## Next Steps

After successfully implementing the database schema:

1. Configure the application's database connection
2. Set up proper backup procedures
3. Implement data access layer in application code
4. Consider performance tuning for production deployments

## Database Schema Diagram

The complete database schema visualization is available in DBSchema after all tables are created. This provides a visual representation of table relationships and structure.
