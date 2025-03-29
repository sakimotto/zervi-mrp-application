-- Costs and Inter-Division Transfers for Zervi MRP Application
-- Part 6: Costing and vertical integration between divisions

-- Create Cost Types Table
CREATE TABLE cost_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_direct BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Item Costs Table
CREATE TABLE item_costs (
    id SERIAL PRIMARY KEY,
    item_id INTEGER NOT NULL REFERENCES items(id),
    cost_type_id INTEGER NOT NULL REFERENCES cost_types(id),
    cost_value DECIMAL(15,2) NOT NULL,
    effective_date DATE NOT NULL,
    expiration_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Operation Costs Table
CREATE TABLE operation_costs (
    id SERIAL PRIMARY KEY,
    operation_id INTEGER NOT NULL REFERENCES operations(id),
    cost_type_id INTEGER NOT NULL REFERENCES cost_types(id),
    cost_value DECIMAL(15,2) NOT NULL,
    effective_date DATE NOT NULL,
    expiration_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Product Costing Table
CREATE TABLE product_costing (
    id SERIAL PRIMARY KEY,
    item_id INTEGER NOT NULL REFERENCES items(id),
    bom_id INTEGER REFERENCES boms(id),
    routing_id INTEGER REFERENCES routings(id),
    material_cost DECIMAL(15,2) DEFAULT 0,
    labor_cost DECIMAL(15,2) DEFAULT 0,
    overhead_cost DECIMAL(15,2) DEFAULT 0,
    total_cost DECIMAL(15,2) DEFAULT 0,
    calculation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Inter-Division Transfer Headers Table
CREATE TABLE inter_division_transfers (
    id SERIAL PRIMARY KEY,
    transfer_number VARCHAR(50) NOT NULL,
    from_division_id INTEGER NOT NULL REFERENCES divisions(id),
    to_division_id INTEGER NOT NULL REFERENCES divisions(id),
    status VARCHAR(20) CHECK (status IN ('draft', 'pending', 'partial', 'completed', 'cancelled')),
    transfer_date DATE,
    requested_by INTEGER REFERENCES users(id),
    approved_by INTEGER REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Inter-Division Transfer Details Table
CREATE TABLE inter_division_transfer_details (
    id SERIAL PRIMARY KEY,
    transfer_id INTEGER NOT NULL REFERENCES inter_division_transfers(id),
    item_id INTEGER NOT NULL REFERENCES items(id),
    from_warehouse_id INTEGER REFERENCES warehouses(id),
    to_warehouse_id INTEGER REFERENCES warehouses(id),
    quantity DECIMAL(15,5) NOT NULL,
    uom_id INTEGER NOT NULL REFERENCES units_of_measurement(id),
    status VARCHAR(20) CHECK (status IN ('pending', 'in_transit', 'received', 'cancelled')),
    transfer_cost DECIMAL(15,2),
    received_quantity DECIMAL(15,5),
    received_date TIMESTAMP,
    received_by INTEGER REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Division Integration Table (for vertical integration)
CREATE TABLE division_integration (
    id SERIAL PRIMARY KEY,
    from_division_id INTEGER NOT NULL REFERENCES divisions(id),
    to_division_id INTEGER NOT NULL REFERENCES divisions(id),
    integration_type VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT different_divisions CHECK (from_division_id != to_division_id)
);

-- Create Integrated Products Table
CREATE TABLE integrated_products (
    id SERIAL PRIMARY KEY,
    division_integration_id INTEGER NOT NULL REFERENCES division_integration(id),
    source_item_id INTEGER NOT NULL REFERENCES items(id),
    target_item_id INTEGER NOT NULL REFERENCES items(id),
    conversion_ratio DECIMAL(15,5) DEFAULT 1,
    conversion_notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add Indexes
CREATE INDEX idx_item_costs_item_id ON item_costs(item_id);
CREATE INDEX idx_item_costs_cost_type_id ON item_costs(cost_type_id);
CREATE INDEX idx_operation_costs_operation_id ON operation_costs(operation_id);
CREATE INDEX idx_product_costing_item_id ON product_costing(item_id);
CREATE INDEX idx_inter_division_transfers_from_division_id ON inter_division_transfers(from_division_id);
CREATE INDEX idx_inter_division_transfers_to_division_id ON inter_division_transfers(to_division_id);
CREATE INDEX idx_transfer_details_transfer_id ON inter_division_transfer_details(transfer_id);
CREATE INDEX idx_transfer_details_item_id ON inter_division_transfer_details(item_id);
CREATE INDEX idx_division_integration_from_division_id ON division_integration(from_division_id);
CREATE INDEX idx_division_integration_to_division_id ON division_integration(to_division_id);
CREATE INDEX idx_integrated_products_division_integration_id ON integrated_products(division_integration_id);
CREATE INDEX idx_integrated_products_source_item_id ON integrated_products(source_item_id);
CREATE INDEX idx_integrated_products_target_item_id ON integrated_products(target_item_id);

-- Seed Cost Types
INSERT INTO cost_types (name, description, is_direct)
VALUES
('Direct Material', 'Cost of raw materials directly used in production', TRUE),
('Direct Labor', 'Cost of labor directly involved in production', TRUE),
('Manufacturing Overhead', 'Indirect costs associated with production', FALSE),
('Tooling', 'Cost of tooling specific to a product', TRUE),
('Packaging', 'Cost of packaging materials', TRUE);

-- Insert Vertical Integration Between Divisions
INSERT INTO division_integration (from_division_id, to_division_id, integration_type, description)
VALUES
(4, 1, 'Material Supply', 'Zervitek supplies technical textiles to Automotive'),
(4, 2, 'Material Supply', 'Zervitek supplies technical textiles to Camping'),
(4, 3, 'Material Supply', 'Zervitek supplies technical textiles to Apparel');

-- Comments:
-- 1. The costing system allows tracking of direct and indirect costs
-- 2. Inter-division transfers support the vertical integration model
-- 3. The division_integration table documents relationships between divisions
-- 4. integrated_products maps products between divisions for vertical integration
