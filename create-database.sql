-- PostgreSQL setup script for Zervi MRP application
-- Run this script after setting the postgres user password

-- Create the database if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'zervi_mrp') THEN
        CREATE DATABASE zervi_mrp;
    END IF;
END
$$;

-- Connect to the zervi_mrp database
\c zervi_mrp;

-- Create a schema for our application
CREATE SCHEMA IF NOT EXISTS zervi;

-- Set the search path
SET search_path TO zervi, public;

-- Output success message
\echo 'Database zervi_mrp has been created successfully!'
\echo 'You can now run the application setup script.'