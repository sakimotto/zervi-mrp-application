
-- Inventory Management Tables
-- This script creates tables related to inventory management including:
-- - Item categories
-- - Items
-- - Units of measurement
-- - Warehouses
-- - Storage locations
-- - Inventory
-- - Lot tracking
-- - Inventory transactions

-- Item Categories
CREATE TABLE item_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_category_id INTEGER REFERENCES item_categories(id),
    division_id INTEGER REFERENCES divisions(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Units of Measurement
CREATE TABLE units_of_measurement (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    abbreviation VARCHAR(10) NOT NULL,
    description TEXT,
    is_base_unit BOOLEAN DEFAULT FALSE,
    conversion_factor DECIMAL(10, 4) DEFAULT 1,
    base_unit_id INTEGER REFERENCES units_of_measurement(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Items (Products, Raw Materials, Semi-Finished Goods)
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    item_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES item_categories(id),
    primary_uom_id INTEGER REFERENCES units_of_measurement(id) NOT NULL,
    secondary_uom_id INTEGER REFERENCES units_of_measurement(id),
    uom_conversion_factor DECIMAL(10, 4) DEFAULT 1,
    item_type VARCHAR(50) NOT NULL, -- 'raw_material', 'finished_good', 'semi_finished', 'consumable'
    min_order_quantity DECIMAL(10, 2) DEFAULT 0,
    lead_time_days INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    division_id INTEGER REFERENCES divisions(id),
    specifications JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX items_item_code_idx ON items(item_code);
CREATE INDEX items_division_id_idx ON items(division_id);
CREATE INDEX items_item_type_idx ON items(item_type);

-- Warehouses
CREATE TABLE warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    description TEXT,
    division_id INTEGER REFERENCES divisions(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Storage Locations
CREATE TABLE storage_locations (
    id SERIAL PRIMARY KEY,
    warehouse_id INTEGER REFERENCES warehouses(id) NOT NULL,
    location_code VARCHAR(50) NOT NULL,
    description TEXT,
    capacity DECIMAL(10, 2),
    capacity_uom_id INTEGER REFERENCES units_of_measurement(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(warehouse_id, location_code)
);
CREATE INDEX storage_locations_warehouse_id_idx ON storage_locations(warehouse_id);

-- Lot Tracking
CREATE TABLE lot_tracking (
    id SERIAL PRIMARY KEY,
    lot_number VARCHAR(100) NOT NULL,
    item_id INTEGER REFERENCES items(id) NOT NULL,
    supplier_id INTEGER,  -- Would reference a suppliers table if needed
    received_date DATE NOT NULL,
    expiration_date DATE,
    manufacturing_date DATE,
    quality_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    certification_info TEXT,
    division_id INTEGER REFERENCES divisions(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(lot_number, item_id)
);
CREATE INDEX lot_tracking_lot_number_idx ON lot_tracking(lot_number);
CREATE INDEX lot_tracking_item_id_idx ON lot_tracking(item_id);

-- Inventory
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES items(id) NOT NULL,
    warehouse_id INTEGER REFERENCES warehouses(id) NOT NULL,
    storage_location_id INTEGER REFERENCES storage_locations(id),
    lot_id INTEGER REFERENCES lot_tracking(id),
    quantity_on_hand DECIMAL(10, 2) DEFAULT 0,
    quantity_allocated DECIMAL(10, 2) DEFAULT 0,
    quantity_available DECIMAL(10, 2) GENERATED ALWAYS AS (quantity_on_hand - quantity_allocated) STORED,
    last_count_date TIMESTAMP,
    division_id INTEGER REFERENCES divisions(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(item_id, warehouse_id, storage_location_id, lot_id, division_id)
);
CREATE INDEX inventory_item_id_idx ON inventory(item_id);
CREATE INDEX inventory_warehouse_id_idx ON inventory(warehouse_id);
CREATE INDEX inventory_division_id_idx ON inventory(division_id);

-- Inventory Transactions
CREATE TABLE inventory_transactions (
    id SERIAL PRIMARY KEY,
    transaction_type VARCHAR(50) NOT NULL, -- 'receipt', 'issue', 'transfer', 'adjustment', 'production'
    item_id INTEGER REFERENCES items(id) NOT NULL,
    warehouse_id INTEGER REFERENCES warehouses(id) NOT NULL,
    storage_location_id INTEGER REFERENCES storage_locations(id),
    lot_id INTEGER REFERENCES lot_tracking(id),
    quantity DECIMAL(10, 2) NOT NULL,
    uom_id INTEGER REFERENCES units_of_measurement(id) NOT NULL,
    reference_document VARCHAR(100), -- PO number, MO number, etc.
    reference_document_id INTEGER,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    user_id INTEGER REFERENCES users(id),
    division_id INTEGER REFERENCES divisions(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX inventory_transactions_item_id_idx ON inventory_transactions(item_id);
CREATE INDEX inventory_transactions_transaction_type_idx ON inventory_transactions(transaction_type);
CREATE INDEX inventory_transactions_transaction_date_idx ON inventory_transactions(transaction_date);
CREATE INDEX inventory_transactions_division_id_idx ON inventory_transactions(division_id);

-- Seed some basic units of measurement
INSERT INTO units_of_measurement (name, abbreviation, is_base_unit, description)
VALUES 
('Piece', 'pc', TRUE, 'Individual item count'),
('Kilogram', 'kg', TRUE, 'Metric weight unit'),
('Meter', 'm', TRUE, 'Metric length unit'),
('Square Meter', 'm2', TRUE, 'Metric area unit'),
('Liter', 'L', TRUE, 'Metric volume unit'),
('Pair', 'pr', TRUE, 'Set of two matching items'),
('Roll', 'roll', TRUE, 'Material in rolled form'),
('Bundle', 'bndl', TRUE, 'Group of items bundled together'),
('Box', 'box', TRUE, 'Standard packaging box'),
('Dozen', 'dz', FALSE, '12 pieces'),
('Gram', 'g', FALSE, '1/1000 of a kilogram');

-- Update conversion factors for non-base units
UPDATE units_of_measurement SET base_unit_id = 1, conversion_factor = 12 WHERE name = 'Dozen';
UPDATE units_of_measurement SET base_unit_id = 2, conversion_factor = 0.001 WHERE name = 'Gram';

-- Seed some common item categories
INSERT INTO item_categories (name, description, division_id)
VALUES 
('Raw Materials', 'Basic materials used in production', 1),
('Finished Goods', 'Completed products ready for sale', 1),
('Semi-Finished Goods', 'Partially completed products', 1),
('Consumables', 'Items consumed during production', 1),
('Packaging Materials', 'Materials used for product packaging', 1),
('Textiles', 'Fabric and textile-related materials', 2),
('Accessories', 'Product accessories and components', 3),
('Electronics', 'Electronic components and assemblies', 4);

-- Add some subcategories
INSERT INTO item_categories (name, description, parent_category_id, division_id)
VALUES 
('Cotton Fabrics', 'Natural cotton-based fabrics', 6, 2),
('Synthetic Fabrics', 'Man-made synthetic fabrics', 6, 2),
('Threads', 'Sewing and embroidery threads', 6, 2),
('Buttons', 'Various button types and styles', 7, 3),
('Zippers', 'Various zipper types and sizes', 7, 3),
('Labels', 'Product labels and tags', 7, 3);

-- Comments:
-- 1. Additional validation or constraints may be necessary
-- 2. Additional indexes may be required based on query patterns
-- 3. Review the data types and lengths based on actual requirements