-- Manufacturing Orders Tables for Zervi MRP Application
-- Part 5: Production planning and execution

-- Create Customer Orders Table (for make-to-order production)
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    division_id INTEGER REFERENCES divisions(id),
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(100),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Customer Orders Table
CREATE TABLE customer_orders (
    id SERIAL PRIMARY KEY,
    division_id INTEGER NOT NULL REFERENCES divisions(id),
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    order_number VARCHAR(50) NOT NULL,
    order_date DATE NOT NULL,
    required_date DATE,
    status VARCHAR(20) CHECK (status IN ('draft', 'confirmed', 'in_production', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Customer Order Items Table
CREATE TABLE customer_order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES customer_orders(id),
    item_id INTEGER NOT NULL REFERENCES items(id),
    quantity DECIMAL(15,5) NOT NULL,
    uom_id INTEGER NOT NULL REFERENCES units_of_measurement(id),
    unit_price DECIMAL(15,2),
    required_date DATE,
    status VARCHAR(20) CHECK (status IN ('pending', 'in_production', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Manufacturing Orders Table
CREATE TABLE manufacturing_orders (
    id SERIAL PRIMARY KEY,
    division_id INTEGER NOT NULL REFERENCES divisions(id),
    order_number VARCHAR(50) NOT NULL,
    item_id INTEGER NOT NULL REFERENCES items(id),
    bom_id INTEGER NOT NULL REFERENCES boms(id),
    routing_id INTEGER NOT NULL REFERENCES routings(id),
    quantity DECIMAL(15,5) NOT NULL,
    uom_id INTEGER NOT NULL REFERENCES units_of_measurement(id),
    status VARCHAR(20) CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
    priority INTEGER DEFAULT 5,
    planned_start_date TIMESTAMP,
    planned_end_date TIMESTAMP,
    actual_start_date TIMESTAMP,
    actual_end_date TIMESTAMP,
    customer_order_id INTEGER REFERENCES customer_orders(id),
    parent_mo_id INTEGER REFERENCES manufacturing_orders(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Manufacturing Order Components Table
CREATE TABLE manufacturing_order_components (
    id SERIAL PRIMARY KEY,
    manufacturing_order_id INTEGER NOT NULL REFERENCES manufacturing_orders(id),
    component_item_id INTEGER NOT NULL REFERENCES items(id),
    bom_component_id INTEGER REFERENCES bom_components(id),
    required_quantity DECIMAL(15,5) NOT NULL,
    issued_quantity DECIMAL(15,5) DEFAULT 0,
    uom_id INTEGER NOT NULL REFERENCES units_of_measurement(id),
    warehouse_id INTEGER REFERENCES warehouses(id),
    status VARCHAR(20) CHECK (status IN ('pending', 'partial', 'complete')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Manufacturing Order Operations Table
CREATE TABLE manufacturing_order_operations (
    id SERIAL PRIMARY KEY,
    manufacturing_order_id INTEGER NOT NULL REFERENCES manufacturing_orders(id),
    operation_id INTEGER NOT NULL REFERENCES operations(id),
    sequence INTEGER NOT NULL,
    workstation_id INTEGER REFERENCES workstations(id),
    status VARCHAR(20) CHECK (status IN ('pending', 'setup', 'in_progress', 'completed')),
    planned_start_time TIMESTAMP,
    planned_end_time TIMESTAMP,
    actual_start_time TIMESTAMP,
    actual_end_time TIMESTAMP,
    setup_time DECIMAL(10,2),
    run_time DECIMAL(10,2),
    completed_quantity DECIMAL(15,5) DEFAULT 0,
    scrap_quantity DECIMAL(15,5) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Operation Time Logs Table
CREATE TABLE operation_time_logs (
    id SERIAL PRIMARY KEY,
    manufacturing_order_operation_id INTEGER NOT NULL REFERENCES manufacturing_order_operations(id),
    user_id INTEGER REFERENCES users(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('setup', 'running', 'paused', 'complete')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Quality Checks Table
CREATE TABLE quality_checks (
    id SERIAL PRIMARY KEY,
    manufacturing_order_id INTEGER NOT NULL REFERENCES manufacturing_orders(id),
    operation_id INTEGER REFERENCES operations(id),
    check_type VARCHAR(50) NOT NULL,
    result VARCHAR(20) CHECK (result IN ('pass', 'conditional_pass', 'fail')),
    checked_by INTEGER REFERENCES users(id),
    checked_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Defects Table
CREATE TABLE defects (
    id SERIAL PRIMARY KEY,
    quality_check_id INTEGER NOT NULL REFERENCES quality_checks(id),
    defect_type VARCHAR(100) NOT NULL,
    quantity DECIMAL(15,5),
    severity VARCHAR(20) CHECK (severity IN ('minor', 'major', 'critical')),
    action_taken VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add Indexes
CREATE INDEX idx_customer_orders_division_id ON customer_orders(division_id);
CREATE INDEX idx_customer_orders_customer_id ON customer_orders(customer_id);
CREATE INDEX idx_customer_order_items_order_id ON customer_order_items(order_id);
CREATE INDEX idx_customer_order_items_item_id ON customer_order_items(item_id);
CREATE INDEX idx_manufacturing_orders_division_id ON manufacturing_orders(division_id);
CREATE INDEX idx_manufacturing_orders_item_id ON manufacturing_orders(item_id);
CREATE INDEX idx_manufacturing_orders_bom_id ON manufacturing_orders(bom_id);
CREATE INDEX idx_manufacturing_orders_routing_id ON manufacturing_orders(routing_id);
CREATE INDEX idx_manufacturing_orders_customer_order_id ON manufacturing_orders(customer_order_id);
CREATE INDEX idx_manufacturing_orders_parent_mo_id ON manufacturing_orders(parent_mo_id);
CREATE INDEX idx_manufacturing_order_components_mo_id ON manufacturing_order_components(manufacturing_order_id);
CREATE INDEX idx_manufacturing_order_components_item_id ON manufacturing_order_components(component_item_id);
CREATE INDEX idx_manufacturing_order_operations_mo_id ON manufacturing_order_operations(manufacturing_order_id);
CREATE INDEX idx_manufacturing_order_operations_operation_id ON manufacturing_order_operations(operation_id);
CREATE INDEX idx_manufacturing_order_operations_workstation_id ON manufacturing_order_operations(workstation_id);
CREATE INDEX idx_operation_time_logs_mo_operation_id ON operation_time_logs(manufacturing_order_operation_id);
CREATE INDEX idx_quality_checks_mo_id ON quality_checks(manufacturing_order_id);
CREATE INDEX idx_defects_quality_check_id ON defects(quality_check_id);

-- Comments:
-- 1. Manufacturing orders support multi-level production with parent_mo_id
-- 2. Component requirements are tracked and linked back to BOM components
-- 3. Operations are scheduled and tracked with detailed time logging
-- 4. Quality checks and defects are recorded for quality control
