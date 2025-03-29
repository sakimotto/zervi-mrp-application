
-- Bill of Materials (BOM) Tables
-- This script creates tables related to bill of materials including:
-- - BOMs
-- - BOM Components
-- - BOM Alternatives
-- - BOM Hierarchy

-- Bill of Materials
CREATE TABLE boms (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES items(id) NOT NULL,
    bom_name VARCHAR(100),
    version VARCHAR(20) NOT NULL DEFAULT '1.0',
    description TEXT,
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    is_engineering BOOLEAN DEFAULT FALSE, -- Flag for BOM in engineering/design phase
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by INTEGER REFERENCES users(id),
    approved_date TIMESTAMP,
    division_id INTEGER REFERENCES divisions(id) NOT NULL,
    batch_size DECIMAL(10, 2) DEFAULT 1,
    batch_uom_id INTEGER REFERENCES units_of_measurement(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(item_id, version, division_id)
);
CREATE INDEX boms_item_id_idx ON boms(item_id);
CREATE INDEX boms_division_id_idx ON boms(division_id);
CREATE INDEX boms_is_active_idx ON boms(is_active);

-- BOM Components
CREATE TABLE bom_components (
    id SERIAL PRIMARY KEY,
    bom_id INTEGER REFERENCES boms(id) NOT NULL,
    component_item_id INTEGER REFERENCES items(id) NOT NULL,
    quantity DECIMAL(10, 4) NOT NULL,
    uom_id INTEGER REFERENCES units_of_measurement(id) NOT NULL,
    component_type VARCHAR(50) DEFAULT 'standard', -- 'standard', 'assembly', 'phantom', etc.
    position_in_assembly VARCHAR(50), -- For physical positioning
    reference_designator VARCHAR(50), -- For electronics
    operation_id INTEGER, -- would reference operations table when created
    is_critical BOOLEAN DEFAULT FALSE,
    notes TEXT,
    scrap_percentage DECIMAL(5, 2) DEFAULT 0,
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(bom_id, component_item_id, position_in_assembly, operation_id)
);
CREATE INDEX bom_components_bom_id_idx ON bom_components(bom_id);
CREATE INDEX bom_components_component_item_id_idx ON bom_components(component_item_id);

-- BOM Alternatives (substitute components)
CREATE TABLE bom_alternatives (
    id SERIAL PRIMARY KEY,
    bom_component_id INTEGER REFERENCES bom_components(id) NOT NULL,
    alternative_item_id INTEGER REFERENCES items(id) NOT NULL,
    quantity DECIMAL(10, 4) NOT NULL,
    uom_id INTEGER REFERENCES units_of_measurement(id) NOT NULL,
    priority INTEGER DEFAULT 1, -- Lower number = higher priority
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(bom_component_id, alternative_item_id)
);
CREATE INDEX bom_alternatives_bom_component_id_idx ON bom_alternatives(bom_component_id);
CREATE INDEX bom_alternatives_alternative_item_id_idx ON bom_alternatives(alternative_item_id);

-- BOM Hierarchy (for multi-level BOM analysis)
CREATE TABLE bom_hierarchy (
    id SERIAL PRIMARY KEY,
    parent_bom_id INTEGER REFERENCES boms(id) NOT NULL,
    child_bom_id INTEGER REFERENCES boms(id) NOT NULL,
    level_number INTEGER NOT NULL, -- 1 = level immediately below parent, 2 = two levels below, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(parent_bom_id, child_bom_id)
);
CREATE INDEX bom_hierarchy_parent_bom_id_idx ON bom_hierarchy(parent_bom_id);
CREATE INDEX bom_hierarchy_child_bom_id_idx ON bom_hierarchy(child_bom_id);

-- BOM Cost Rollup (for calculating total BOM costs)
CREATE TABLE bom_cost_rollups (
    id SERIAL PRIMARY KEY,
    bom_id INTEGER REFERENCES boms(id) NOT NULL,
    material_cost DECIMAL(12, 4) DEFAULT 0,
    labor_cost DECIMAL(12, 4) DEFAULT 0,
    overhead_cost DECIMAL(12, 4) DEFAULT 0,
    total_cost DECIMAL(12, 4) GENERATED ALWAYS AS (material_cost + labor_cost + overhead_cost) STORED,
    currency VARCHAR(10) DEFAULT 'USD',
    rollup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rolled_up_by INTEGER REFERENCES users(id),
    division_id INTEGER REFERENCES divisions(id) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(bom_id, rollup_date, division_id)
);
CREATE INDEX bom_cost_rollups_bom_id_idx ON bom_cost_rollups(bom_id);
CREATE INDEX bom_cost_rollups_division_id_idx ON bom_cost_rollups(division_id);

-- BOM Document References (for attaching documents to BOMs)
CREATE TABLE bom_documents (
    id SERIAL PRIMARY KEY,
    bom_id INTEGER REFERENCES boms(id) NOT NULL,
    document_type VARCHAR(50) NOT NULL, -- 'drawing', 'specification', 'procedure', etc.
    document_name VARCHAR(255) NOT NULL,
    document_url VARCHAR(1024),
    document_version VARCHAR(20),
    notes TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX bom_documents_bom_id_idx ON bom_documents(bom_id);

-- Seed some simple BOM data (will be expanded when more tables are available)
-- First, let's create a few sample items for our BOMs
INSERT INTO items (item_code, name, description, category_id, primary_uom_id, item_type, division_id)
VALUES
('FG-JACKET-001', 'Textile Jacket Model A', 'Premium textile jacket with standard configuration', 2, 1, 'finished_good', 1),
('SF-SLEEVE-001', 'Jacket Sleeve Assembly', 'Standard sleeve assembly for jackets', 3, 1, 'semi_finished', 2),
('RM-FABRIC-001', 'Waterproof Textile', 'High-quality waterproof textile material', 9, 3, 'raw_material', 2),
('RM-ZIPPER-001', 'Metal Zipper 20cm', 'Standard metal zipper for jackets', 14, 1, 'raw_material', 3),
('RM-BUTTON-001', 'Plastic Button 15mm', 'Standard plastic buttons', 13, 1, 'raw_material', 3);

-- Now create some basic BOMs
INSERT INTO boms (item_id, bom_name, version, description, is_active, is_approved, division_id, batch_size, batch_uom_id)
VALUES
(1, 'Standard Jacket BOM', '1.0', 'Standard production BOM for Textile Jacket Model A', TRUE, TRUE, 1, 10, 1),
(2, 'Standard Sleeve Assembly', '1.0', 'Standard sleeve assembly BOM', TRUE, TRUE, 2, 20, 1);

-- Add components to the jacket BOM
INSERT INTO bom_components (bom_id, component_item_id, quantity, uom_id, component_type, scrap_percentage)
VALUES
(1, 2, 2, 1, 'assembly', 5), -- 2 sleeve assemblies per jacket
(1, 4, 1, 1, 'standard', 2), -- 1 zipper per jacket
(1, 5, 6, 1, 'standard', 10); -- 6 buttons per jacket with 10% scrap rate

-- Add components to the sleeve assembly BOM
INSERT INTO bom_components (bom_id, component_item_id, quantity, uom_id, component_type, scrap_percentage)
VALUES
(2, 3, 0.5, 3, 'standard', 15); -- 0.5 meters of fabric per sleeve with 15% scrap rate

-- Set up BOM hierarchy
INSERT INTO bom_hierarchy (parent_bom_id, child_bom_id, level_number)
VALUES
(1, 2, 1); -- Sleeve assembly is one level below the jacket in BOM hierarchy

-- Comments:
-- 1. Additional validation or constraints may be necessary
-- 2. Additional indexes may be required based on query patterns
-- 3. When populating with real data, ensure all references exist
-- 4. Consider adding triggers for BOM version control