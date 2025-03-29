# Revised MRP Application Database Schema Design

## Overview
This document outlines the revised database schema design for Zervi Group's custom MRP application, incorporating feedback on multi-level BOM structure, specific manufacturing operations (Laminating, Cutting, Sewing, Embroidery), and enhanced costing models. The schema is designed to support Zervi's multi-division structure (Automotive, Camping Production, Apparel, and Technical Textile/Zervitek) while enabling vertical integration between divisions.

## Key Enhancements

### 1. Multi-level BOM Structure
- Enhanced BOM structure to explicitly support hierarchical relationships from raw materials to semi-finished goods to finished products
- Added parent-child relationships between BOM components
- Improved tracking of material flow across production stages

### 2. Specific Manufacturing Operations
- Added dedicated support for Zervi's key operations: Laminating, Cutting, Sewing, and Embroidery
- Enhanced operation tracking with operation-specific parameters and metrics
- Improved routing capabilities for complex manufacturing processes

### 3. Comprehensive Costing Model
- Expanded costing structure to include direct and indirect overhead costs
- Added support for multiple costing methods and scenarios
- Enhanced cost rollup capabilities across multi-level BOMs
- Implemented pricing scenario modeling

## Database Schema

### Core Tables

#### 1. Companies
```
companies
- id (PK)
- name
- address
- contact_info
- created_at
- updated_at
```

#### 2. Divisions
```
divisions
- id (PK)
- company_id (FK to companies)
- name (Automotive, Camping, Apparel, Zervitek)
- description
- created_at
- updated_at
```

#### 3. Users
```
users
- id (PK)
- username
- email
- password_hash
- first_name
- last_name
- role_id (FK to roles)
- division_id (FK to divisions)
- is_active
- last_login
- created_at
- updated_at
```

#### 4. Roles
```
roles
- id (PK)
- name (Admin, Production Manager, Inventory Manager, etc.)
- permissions (JSON)
- created_at
- updated_at
```

#### 5. User Division Access
```
user_division_access
- id (PK)
- user_id (FK to users)
- division_id (FK to divisions)
- access_level (read, write, admin)
- created_at
- updated_at
```

### Inventory Management

#### 6. Items
```
items
- id (PK)
- division_id (FK to divisions)
- item_code
- name
- description
- type (raw_material, semi_finished, finished_product)
- category_id (FK to item_categories)
- uom_id (FK to units_of_measurement)
- default_supplier_id (FK to suppliers)
- min_stock_level
- reorder_point
- lead_time_days
- is_active
- created_at
- updated_at
```

#### 7. Item Categories
```
item_categories
- id (PK)
- division_id (FK to divisions)
- name
- parent_category_id (FK to item_categories, for hierarchical categories)
- created_at
- updated_at
```

#### 8. Units of Measurement
```
units_of_measurement
- id (PK)
- name
- abbreviation
- created_at
- updated_at
```

#### 9. UOM Conversions
```
uom_conversions
- id (PK)
- from_uom_id (FK to units_of_measurement)
- to_uom_id (FK to units_of_measurement)
- conversion_factor
- created_at
- updated_at
```

#### 10. Inventory
```
inventory
- id (PK)
- item_id (FK to items)
- warehouse_id (FK to warehouses)
- location_id (FK to storage_locations)
- quantity_on_hand
- quantity_allocated
- quantity_available
- last_count_date
- created_at
- updated_at
```

#### 11. Inventory Transactions
```
inventory_transactions
- id (PK)
- item_id (FK to items)
- warehouse_id (FK to warehouses)
- location_id (FK to storage_locations)
- transaction_type (receipt, issue, transfer, adjustment)
- reference_id (FK to various tables based on transaction_type)
- reference_type (purchase_order, manufacturing_order, etc.)
- quantity
- uom_id (FK to units_of_measurement)
- transaction_date
- user_id (FK to users)
- notes
- created_at
- updated_at
```

#### 12. Warehouses
```
warehouses
- id (PK)
- division_id (FK to divisions)
- name
- address
- is_active
- created_at
- updated_at
```

#### 13. Storage Locations
```
storage_locations
- id (PK)
- warehouse_id (FK to warehouses)
- name
- description
- is_active
- created_at
- updated_at
```

#### 14. Lot Tracking
```
lot_tracking
- id (PK)
- item_id (FK to items)
- lot_number
- expiry_date
- manufacturing_date
- quantity
- status (available, quarantine, consumed)
- created_at
- updated_at
```

### Enhanced Multi-level Bill of Materials (BOM)

#### 15. BOMs
```
boms
- id (PK)
- division_id (FK to divisions)
- item_id (FK to items, the finished product)
- name
- description
- version
- bom_level (top_level, intermediate, lowest_level)
- status (draft, active, obsolete)
- effective_date
- created_at
- updated_at
```

#### 16. BOM Components
```
bom_components
- id (PK)
- bom_id (FK to boms)
- component_item_id (FK to items)
- component_type (raw_material, semi_finished, finished_product)
- quantity
- uom_id (FK to units_of_measurement)
- position
- parent_component_id (FK to bom_components, for multi-level BOM structure)
- level_number (0 for top level, 1, 2, etc. for sub-levels)
- notes
- is_critical
- created_at
- updated_at
```

#### 17. BOM Alternatives
```
bom_alternatives
- id (PK)
- bom_component_id (FK to bom_components)
- alternative_item_id (FK to items)
- quantity
- uom_id (FK to units_of_measurement)
- priority
- created_at
- updated_at
```

#### 18. BOM Hierarchy
```
bom_hierarchy
- id (PK)
- parent_bom_id (FK to boms)
- child_bom_id (FK to boms)
- quantity
- uom_id (FK to units_of_measurement)
- notes
- created_at
- updated_at
```

### Enhanced Routing and Operations

#### 19. Routings
```
routings
- id (PK)
- division_id (FK to divisions)
- item_id (FK to items, the finished product)
- name
- description
- version
- status (draft, active, obsolete)
- created_at
- updated_at
```

#### 20. Operations
```
operations
- id (PK)
- routing_id (FK to routings)
- name
- description
- operation_type (general, laminating, cutting, sewing, embroidery)
- workstation_id (FK to workstations)
- setup_time
- run_time
- queue_time
- sequence
- created_at
- updated_at
```

#### 21. Operation Parameters
```
operation_parameters
- id (PK)
- operation_id (FK to operations)
- parameter_name
- parameter_value
- uom_id (FK to units_of_measurement)
- is_critical
- created_at
- updated_at
```

#### 22. Laminating Operations
```
laminating_operations
- id (PK)
- operation_id (FK to operations)
- material_type
- temperature
- pressure
- dwell_time
- adhesive_type
- special_instructions
- created_at
- updated_at
```

#### 23. Cutting Operations
```
cutting_operations
- id (PK)
- operation_id (FK to operations)
- cutting_method (manual, cnc, laser, die)
- material_thickness
- cutting_speed
- pattern_id
- nesting_efficiency
- special_instructions
- created_at
- updated_at
```

#### 24. Sewing Operations
```
sewing_operations
- id (PK)
- operation_id (FK to operations)
- stitch_type
- stitch_density
- thread_type
- needle_size
- seam_type
- special_instructions
- created_at
- updated_at
```

#### 25. Embroidery Operations
```
embroidery_operations
- id (PK)
- operation_id (FK to operations)
- design_id
- stitch_count
- thread_colors
- backing_type
- hoop_size
- special_instructions
- created_at
- updated_at
```

#### 26. Workstations
```
workstations
- id (PK)
- division_id (FK to divisions)
- name
- description
- workstation_type (general, laminating, cutting, sewing, embroidery)
- capacity_per_hour
- hourly_rate
- is_active
- created_at
- updated_at
```

#### 27. Work Centers
```
work_centers
- id (PK)
- division_id (FK to divisions)
- name
- description
- center_type (general, laminating, cutting, sewing, embroidery)
- is_active
- created_at
- updated_at
```

#### 28. Workstation Work Center
```
workstation_work_center
- id (PK)
- workstation_id (FK to workstations)
- work_center_id (FK to work_centers)
- created_at
- updated_at
```

### Production Planning

#### 29. Manufacturing Orders
```
manufacturing_orders
- id (PK)
- division_id (FK to divisions)
- order_number
- item_id (FK to items, the finished product)
- bom_id (FK to boms)
- routing_id (FK to routings)
- quantity
- uom_id (FK to units_of_measurement)
- status (planned, in_progress, completed, cancelled)
- priority
- planned_start_date
- planned_end_date
- actual_start_date
- actual_end_date
- customer_order_id (FK to customer_orders, for make-to-order)
- parent_mo_id (FK to manufacturing_orders, for multi-level production)
- notes
- created_by (FK to users)
- created_at
- updated_at
```

#### 30. Manufacturing Order Operations
```
manufacturing_order_operations
- id (PK)
- manufacturing_order_id (FK to manufacturing_orders)
- operation_id (FK to operations)
- operation_type (general, laminating, cutting, sewing, embroidery)
- workstation_id (FK to workstations)
- status (pending, in_progress, completed)
- planned_start_date
- planned_end_date
- actual_start_date
- actual_end_date
- setup_time_actual
- run_time_actual
- quantity_completed
- quantity_scrapped
- notes
- created_at
- updated_at
```

#### 31. Manufacturing Order Materials
```
manufacturing_order_materials
- id (PK)
- manufacturing_order_id (FK to manufacturing_orders)
- item_id (FK to items, the component)
- bom_component_id (FK to bom_components)
- planned_quantity
- issued_quantity
- returned_quantity
- lot_id (FK to lot_tracking)
- warehouse_id (FK to warehouses)
- location_id (FK to storage_locations)
- created_at
- updated_at
```

#### 32. Production Schedules
```
production_schedules
- id (PK)
- division_id (FK to divisions)
- workstation_id (FK to workstations)
- manufacturing_order_operation_id (FK to manufacturing_order_operations)
- start_time
- end_time
- status (scheduled, in_progress, completed, cancelled)
- created_at
- updated_at
```

### Sales and CRM

#### 33. Customers
```
customers
- id (PK)
- division_id (FK to divisions)
- name
- contact_person
- email
- phone
- address
- credit_limit
- payment_terms
- is_active
- created_at
- updated_at
```

#### 34. Customer Orders
```
customer_orders
- id (PK)
- division_id (FK to divisions)
- order_number
- customer_id (FK to customers)
- order_date
- required_date
- status (draft, confirmed, in_production, ready_for_shipment, shipped, completed, cancelled)
- payment_status
- shipping_address
- billing_address
- total_amount
- currency
- notes
- created_by (FK to users)
- created_at
- updated_at
```

#### 35. Customer Order Items
```
customer_order_items
- id (PK)
- customer_order_id (FK to customer_orders)
- item_id (FK to items)
- quantity
- uom_id (FK to units_of_measurement)
- unit_price
- discount
- tax
- total_price
- status (pending, allocated, shipped)
- required_date
- created_at
- updated_at
```

#### 36. Shipments
```
shipments
- id (PK)
- division_id (FK to divisions)
- shipment_number
- customer_order_id (FK to customer_orders)
- shipment_date
- carrier
- tracking_number
- status (pending, shipped, delivered)
- notes
- created_by (FK to users)
- created_at
- updated_at
```

#### 37. Shipment Items
```
shipment_items
- id (PK)
- shipment_id (FK to shipments)
- customer_order_item_id (FK to customer_order_items)
- item_id (FK to items)
- quantity
- uom_id (FK to units_of_measurement)
- lot_id (FK to lot_tracking)
- warehouse_id (FK to warehouses)
- location_id (FK to storage_locations)
- created_at
- updated_at
```

### Procurement

#### 38. Suppliers
```
suppliers
- id (PK)
- division_id (FK to divisions)
- name
- contact_person
- email
- phone
- address
- payment_terms
- lead_time_days
- is_active
- created_at
- updated_at
```

#### 39. Purchase Orders
```
purchase_orders
- id (PK)
- division_id (FK to divisions)
- order_number
- supplier_id (FK to suppliers)
- order_date
- expected_delivery_date
- status (draft, sent, partially_received, received, cancelled)
- payment_status
- shipping_address
- total_amount
- currency
- notes
- created_by (FK to users)
- created_at
- updated_at
```

#### 40. Purchase Order Items
```
purchase_order_items
- id (PK)
- purchase_order_id (FK to purchase_orders)
- item_id (FK to items)
- quantity
- uom_id (FK to units_of_measurement)
- unit_price
- discount
- tax
- total_price
- required_date
- status (pending, partially_received, received)
- created_at
- updated_at
```

#### 41. Goods Receipts
```
goods_receipts
- id (PK)
- division_id (FK to divisions)
- receipt_number
- purchase_order_id (FK to purchase_orders)
- receipt_date
- supplier_delivery_note
- status (pending, received, quality_check, stored)
- notes
- created_by (FK to users)
- created_at
- updated_at
```

#### 42. Goods Receipt Items
```
goods_receipt_items
- id (PK)
- goods_receipt_id (FK to goods_receipts)
- purchase_order_item_id (FK to purchase_order_items)
- item_id (FK to items)
- quantity
- uom_id (FK to units_of_measurement)
- lot_number
- expiry_date
- warehouse_id (FK to warehouses)
- location_id (FK to storage_locations)
- quality_check_status
- created_at
- updated_at
```

### Quality Control

#### 43. Quality Checks
```
quality_checks
- id (PK)
- division_id (FK to divisions)
- reference_id (FK to various tables)
- reference_type (goods_receipt, manufacturing_order, etc.)
- check_date
- inspector_id (FK to users)
- status (pending, passed, failed)
- notes
- created_at
- updated_at
```

#### 44. Quality Check Items
```
quality_check_items
- id (PK)
- quality_check_id (FK to quality_checks)
- item_id (FK to items)
- lot_id (FK to lot_tracking)
- quantity
- uom_id (FK to units_of_measurement)
- parameter
- expected_value
- actual_value
- is_passed
- notes
- created_at
- updated_at
```

### Inter-Division Transfers (Critical for Zervitek Integration)

#### 45. Inter-Division Transfers
```
inter_division_transfers
- id (PK)
- transfer_number
- from_division_id (FK to divisions)
- to_division_id (FK to divisions)
- transfer_date
- status (draft, in_progress, completed, cancelled)
- notes
- created_by (FK to users)
- created_at
- updated_at
```

#### 46. Inter-Division Transfer Items
```
inter_division_transfer_items
- id (PK)
- inter_division_transfer_id (FK to inter_division_transfers)
- item_id (FK to items)
- quantity
- uom_id (FK to units_of_measurement)
- from_warehouse_id (FK to warehouses)
- from_location_id (FK to storage_locations)
- to_warehouse_id (FK to warehouses)
- to_location_id (FK to storage_locations)
- lot_id (FK to lot_tracking)
- status (pending, transferred)
- created_at
- updated_at
```

### Enhanced Accounting and Finance

#### 47. Currencies
```
currencies
- id (PK)
- code
- name
- symbol
- exchange_rate
- is_base_currency
- created_at
- updated_at
```

#### 48. Cost Centers
```
cost_centers
- id (PK)
- division_id (FK to divisions)
- name
- description
- is_active
- created_at
- updated_at
```

#### 49. Cost Types
```
cost_types
- id (PK)
- name
- description
- category (material, labor, direct_overhead, indirect_overhead)
- is_active
- created_at
- updated_at
```

#### 50. Item Costs
```
item_costs
- id (PK)
- item_id (FK to items)
- cost_type_id (FK to cost_types)
- cost_amount
- currency_id (FK to currencies)
- effective_date
- created_at
- updated_at
```

#### 51. Manufacturing Order Costs
```
manufacturing_order_costs
- id (PK)
- manufacturing_order_id (FK to manufacturing_orders)
- cost_type_id (FK to cost_types)
- planned_cost
- actual_cost
- currency_id (FK to currencies)
- cost_center_id (FK to cost_centers)
- created_at
- updated_at
```

#### 52. Operation Costs
```
operation_costs
- id (PK)
- operation_id (FK to operations)
- cost_type_id (FK to cost_types)
- cost_amount
- currency_id (FK to currencies)
- cost_center_id (FK to cost_centers)
- created_at
- updated_at
```

#### 53. Overhead Rates
```
overhead_rates
- id (PK)
- division_id (FK to divisions)
- cost_center_id (FK to cost_centers)
- overhead_type (fixed, variable, direct, indirect)
- allocation_base (labor_hours, machine_hours, direct_cost)
- rate_amount
- currency_id (FK to currencies)
- effective_date
- expiry_date
- created_at
- updated_at
```

#### 54. Pricing Scenarios
```
pricing_scenarios
- id (PK)
- division_id (FK to divisions)
- name
- description
- markup_percentage
- discount_percentage
- include_indirect_costs (boolean)
- status (draft, active, archived)
- created_at
- updated_at
```

#### 55. Item Pricing
```
item_pricing
- id (PK)
- item_id (FK to items)
- pricing_scenario_id (FK to pricing_scenarios)
- base_cost
- calculated_price
- manual_price_override
- currency_id (FK to currencies)
- effective_date
- expiry_date
- created_at
- updated_at
```

### System Configuration

#### 56. Settings
```
settings
- id (PK)
- division_id (FK to divisions, null for global settings)
- category
- key
- value
- created_at
- updated_at
```

#### 57. Numbering Sequences
```
numbering_sequences
- id (PK)
- division_id (FK to divisions)
- document_type (manufacturing_order, purchase_order, etc.)
- prefix
- suffix
- next_number
- created_at
- updated_at
```

## Key Relationships and Constraints

### 1. Multi-level BOM Structure
- The `bom_components` table now includes a `parent_component_id` field to create hierarchical relationships
- The `level_number` field in `bom_components` indicates the level in the BOM hierarchy
- The `bom_hierarchy` table explicitly defines relationships between BOMs for complex products
- The `component_type` field in `bom_components` distinguishes between raw materials, semi-finished goods, and finished products

### 2. Manufacturing Operations
- The `operations` table includes an `operation_type` field to categorize operations
- Specialized tables for each operation type (laminating, cutting, sewing, embroidery) store operation-specific parameters
- The `operation_parameters` table allows for flexible parameter definition for any operation type
- Workstations are categorized by type to match specific operations

### 3. Enhanced Costing Model
- The `cost_types` table categorizes costs as material, labor, direct overhead, or indirect overhead
- The `overhead_rates` table defines different overhead allocation methods
- The `pricing_scenarios` table supports multiple pricing strategies
- The `item_pricing` table calculates prices based on costs and pricing scenarios

### 4. Division-Based Data Segregation
- Most tables include a `division_id` to segregate data by business unit
- Users can be assigned to specific divisions with appropriate access levels

### 5. Vertical Integration Between Divisions
- The `inter_division_transfers` tables facilitate the movement of materials from Zervitek to other divisions
- The `manufacturing_orders` table includes a `parent_mo_id` field to link dependent manufacturing orders
- Items can be tracked across divisions through their entire lifecycle

### 6. Production Flow
- Raw materials → Semi-finished goods (Zervitek) → Finished products (Other divisions)
- Complete traceability from raw materials to finished products through multi-level BOMs

## Database Indexes and Performance Considerations

1. **Primary Indexes**
   - All tables have primary key indexes

2. **Foreign Key Indexes**
   - All foreign key columns should be indexed

3. **Composite Indexes**
   - Create composite indexes for frequently queried combinations:
     - (division_id, item_id) on inventory table
     - (division_id, status) on manufacturing_orders table
     - (from_division_id, to_division_id, status) on inter_division_transfers table
     - (bom_id, parent_component_id) on bom_components table
     - (operation_id, operation_type) on manufacturing_order_operations table

4. **Partitioning Strategy**
   - Consider partitioning large tables (inventory_transactions, manufacturing_order_operations) by division_id
   - Time-based partitioning for historical data

## Implementation Considerations

### 1. Multi-level BOM Implementation
- Implement recursive queries for BOM explosion (all components at all levels)
- Create views for indented BOM display
- Implement cost rollup procedures that aggregate costs across all BOM levels

### 2. Operation-Specific Functionality
- Create specialized interfaces for each operation type
- Implement operation-specific validation rules
- Develop dashboards for monitoring each operation type

### 3. Costing Model Implementation
- Implement cost rollup procedures that account for all cost types
- Create pricing calculation procedures based on different scenarios
- Develop cost analysis reports comparing planned vs. actual costs

### 4. Data Migration Strategy
- Import existing items with proper categorization (raw material, semi-finished, finished)
- Build BOMs with correct hierarchical relationships
- Set up initial cost data for accurate pricing

## Future Expansion Considerations

1. **Advanced Analytics**
   - Cost variance analysis
   - Production efficiency metrics
   - Yield analysis by operation type

2. **AI/ML Integration**
   - Predictive maintenance for workstations
   - Optimal production scheduling
   - Cost optimization recommendations

3. **IoT Integration**
   - Real-time machine monitoring
   - Automated quality control
   - Environmental monitoring for sensitive operations
