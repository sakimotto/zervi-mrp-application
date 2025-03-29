-- Master Script for Zervi MRP Application Database
-- This script will execute all database creation scripts in the correct order

-- Database Creation
-- This should be run by a user with admin privileges
CREATE DATABASE zervi_mrp;

-- Connect to the new database
\c zervi_mrp

-- Execute all scripts in order
\i '01_core_tables.sql'
\i '02_inventory_tables.sql'
\i '03_bom_tables.sql'
\i '04_operations_tables.sql'
\i '05_manufacturing_orders.sql'
\i '06_costs_and_transfers.sql'

-- Final confirmation message
SELECT 'MRP Database Schema Created Successfully' as status;
