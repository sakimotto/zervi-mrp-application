-- Manufacturing Operations Tables for Zervi MRP Application
-- Part 4: Routings, Operations, and specialized manufacturing processes

-- Create Routings Table
CREATE TABLE routings (
    id SERIAL PRIMARY KEY,
    division_id INTEGER NOT NULL REFERENCES divisions(id),
    item_id INTEGER NOT NULL REFERENCES items(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    version VARCHAR(20),
    status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'active', 'obsolete')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Work Centers Table
CREATE TABLE work_centers (
    id SERIAL PRIMARY KEY,
    division_id INTEGER NOT NULL REFERENCES divisions(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    center_type VARCHAR(20) CHECK (center_type IN ('general', 'laminating', 'cutting', 'sewing', 'embroidery')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Workstations Table
CREATE TABLE workstations (
    id SERIAL PRIMARY KEY,
    division_id INTEGER NOT NULL REFERENCES divisions(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    workstation_type VARCHAR(20) CHECK (workstation_type IN ('general', 'laminating', 'cutting', 'sewing', 'embroidery')),
    capacity_per_hour DECIMAL(10,2),
    hourly_rate DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Workstation Work Center Junction Table
CREATE TABLE workstation_work_center (
    id SERIAL PRIMARY KEY,
    workstation_id INTEGER NOT NULL REFERENCES workstations(id),
    work_center_id INTEGER NOT NULL REFERENCES work_centers(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workstation_id, work_center_id)
);

-- Create Operations Table
CREATE TABLE operations (
    id SERIAL PRIMARY KEY,
    routing_id INTEGER NOT NULL REFERENCES routings(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    operation_type VARCHAR(20) NOT NULL CHECK (operation_type IN ('general', 'laminating', 'cutting', 'sewing', 'embroidery')),
    workstation_id INTEGER REFERENCES workstations(id),
    setup_time DECIMAL(10,2) DEFAULT 0,
    run_time DECIMAL(10,2) DEFAULT 0,
    queue_time DECIMAL(10,2) DEFAULT 0,
    sequence INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Operation Parameters Table
CREATE TABLE operation_parameters (
    id SERIAL PRIMARY KEY,
    operation_id INTEGER NOT NULL REFERENCES operations(id),
    parameter_name VARCHAR(100) NOT NULL,
    parameter_value VARCHAR(255),
    uom_id INTEGER REFERENCES units_of_measurement(id),
    is_critical BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Laminating Operations Table (specialized)
CREATE TABLE laminating_operations (
    id SERIAL PRIMARY KEY,
    operation_id INTEGER NOT NULL REFERENCES operations(id),
    material_type VARCHAR(100),
    temperature DECIMAL(10,2),
    pressure DECIMAL(10,2),
    dwell_time DECIMAL(10,2),
    adhesive_type VARCHAR(100),
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT laminating_operations_check CHECK (
        EXISTS (
            SELECT 1 FROM operations o 
            WHERE o.id = operation_id AND o.operation_type = 'laminating'
        )
    )
);

-- Create Cutting Operations Table (specialized)
CREATE TABLE cutting_operations (
    id SERIAL PRIMARY KEY,
    operation_id INTEGER NOT NULL REFERENCES operations(id),
    cutting_method VARCHAR(20) CHECK (cutting_method IN ('manual', 'cnc', 'laser', 'die')),
    material_thickness DECIMAL(10,2),
    cutting_speed DECIMAL(10,2),
    pattern_id VARCHAR(100),
    nesting_efficiency DECIMAL(5,2),
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT cutting_operations_check CHECK (
        EXISTS (
            SELECT 1 FROM operations o 
            WHERE o.id = operation_id AND o.operation_type = 'cutting'
        )
    )
);

-- Create Sewing Operations Table (specialized)
CREATE TABLE sewing_operations (
    id SERIAL PRIMARY KEY,
    operation_id INTEGER NOT NULL REFERENCES operations(id),
    stitch_type VARCHAR(100),
    stitch_density DECIMAL(10,2),
    thread_type VARCHAR(100),
    needle_size VARCHAR(20),
    seam_type VARCHAR(100),
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT sewing_operations_check CHECK (
        EXISTS (
            SELECT 1 FROM operations o 
            WHERE o.id = operation_id AND o.operation_type = 'sewing'
        )
    )
);

-- Create Embroidery Operations Table (specialized)
CREATE TABLE embroidery_operations (
    id SERIAL PRIMARY KEY,
    operation_id INTEGER NOT NULL REFERENCES operations(id),
    design_id VARCHAR(100),
    stitch_count INTEGER,
    thread_colors INTEGER,
    backing_type VARCHAR(100),
    hoop_size VARCHAR(50),
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT embroidery_operations_check CHECK (
        EXISTS (
            SELECT 1 FROM operations o 
            WHERE o.id = operation_id AND o.operation_type = 'embroidery'
        )
    )
);

-- Add Indexes
CREATE INDEX idx_routings_division_id ON routings(division_id);
CREATE INDEX idx_routings_item_id ON routings(item_id);
CREATE INDEX idx_work_centers_division_id ON work_centers(division_id);
CREATE INDEX idx_workstations_division_id ON workstations(division_id);
CREATE INDEX idx_operations_routing_id ON operations(routing_id);
CREATE INDEX idx_operations_workstation_id ON operations(workstation_id);
CREATE INDEX idx_operation_parameters_operation_id ON operation_parameters(operation_id);
CREATE INDEX idx_laminating_operations_operation_id ON laminating_operations(operation_id);
CREATE INDEX idx_cutting_operations_operation_id ON cutting_operations(operation_id);
CREATE INDEX idx_sewing_operations_operation_id ON sewing_operations(operation_id);
CREATE INDEX idx_embroidery_operations_operation_id ON embroidery_operations(operation_id);

-- Seed Work Centers
INSERT INTO work_centers (division_id, name, center_type, description)
VALUES
(4, 'Laminating Department', 'laminating', 'Technical textile lamination center'),
(1, 'Cutting Department', 'cutting', 'Automotive division cutting center'),
(3, 'Sewing Department', 'sewing', 'Apparel division sewing center'),
(3, 'Embroidery Department', 'embroidery', 'Apparel division embroidery center'),
(2, 'Assembly Department', 'general', 'Camping division general assembly');

-- Comments:
-- 1. The specialized operation tables enforce that the parent operation is of the correct type
-- 2. Parameters are flexible to accommodate different types of operations
-- 3. The structure allows for detailed tracking of process parameters
