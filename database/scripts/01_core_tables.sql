-- Core Tables for Zervi MRP Application
-- Part 1: Core organizational and user tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Companies Table
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    contact_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Divisions Table
CREATE TABLE divisions (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Roles Table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    permissions JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role_id INTEGER REFERENCES roles(id),
    division_id INTEGER REFERENCES divisions(id),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create User Division Access Table
CREATE TABLE user_division_access (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    division_id INTEGER NOT NULL REFERENCES divisions(id),
    access_level VARCHAR(20) NOT NULL, -- read, write, admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, division_id)
);

-- Add Indexes
CREATE INDEX idx_divisions_company_id ON divisions(company_id);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_division_id ON users(division_id);
CREATE INDEX idx_user_division_access_user_id ON user_division_access(user_id);
CREATE INDEX idx_user_division_access_division_id ON user_division_access(division_id);

-- Seed essential company data
INSERT INTO companies (name, address, contact_info)
VALUES ('Zervi Group', 'Jakarta, Indonesia', 'info@zervigroup.com');

-- Seed divisions
INSERT INTO divisions (company_id, name, description)
VALUES 
(1, 'Automotive', 'Automotive division producing seat covers and textiles'),
(1, 'Camping', 'Camping production division making tents and outdoor equipment'),
(1, 'Apparel', 'Apparel division producing clothing and accessories'),
(1, 'Zervitek', 'Technical Textile division providing materials to other divisions');

-- Seed roles
INSERT INTO roles (name, permissions)
VALUES 
('Admin', '{"all": true}'),
('Production Manager', '{"production": true, "inventory": true, "bom": true}'),
('Inventory Manager', '{"inventory": true}');

-- Default admin user (password: change_me)
INSERT INTO users (username, email, password_hash, first_name, last_name, role_id, division_id)
VALUES ('admin', 'admin@zervigroup.com', '$2a$10$XK5.sYI6kQvmNxVHRjIoWeJW3Z6mM8RZ.Y42HK2Gm2U5Jv7xP5jHe', 'System', 'Admin', 1, NULL);

-- Add admin access to all divisions
INSERT INTO user_division_access (user_id, division_id, access_level)
VALUES 
(1, 1, 'admin'),
(1, 2, 'admin'),
(1, 3, 'admin'),
(1, 4, 'admin');

-- Comments:
-- 1. Additional validation or constraints may be necessary
-- 2. Password should be properly hashed during application runtime
-- 3. Additional indexes may be required based on query patterns
