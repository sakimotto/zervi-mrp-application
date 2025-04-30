# Zervi MRP - Inventory Management Module

## Overview

The Inventory Management Module is a comprehensive system for tracking, managing, and optimizing inventory across all divisions. The module supports standard inventory operations while providing specialized features for manufacturing environments, including batch/lot tracking, serial numbers, and barcode integration.

## Core Features

### Inventory Dashboard

- Visual metrics showing inventory status across warehouses
- Low stock alerts with status indicators
- Category breakdown charts
- Recent transactions tracking
- Warehouse utilization visualization

### Inventory List

- Comprehensive item list with search and filter capabilities
- Status indicators for stock levels
- Multi-criteria sorting
- Item quick actions (view, edit, delete)

### Item Details

- Complete item information view
- Inventory metrics with visual indicators
- Transaction history
- Warehouse location mapping
- Related data (BOMs, suppliers)

### Item Management

- Add/Edit form with validation
- Category and supplier selection
- Inventory thresholds (min/max, reorder points)
- Costing information

### Warehouse Management

- Multiple warehouse support
- Section and bin location tracking
- Capacity and utilization metrics
- Location-specific inventory views

## Advanced Tracking Features

### Batch/Lot Tracking

- Unique batch/lot numbers for groups of items
- Batch-specific details (manufacturing date, expiry date)
- Supplier batch reference tracking
- Quality control status per batch
- Notes and documentation capabilities

### Serial Number Tracking

- Individual item tracking for high-value items
- Serial number generation and assignment
- Serial-specific history tracking
- Print labels for serialized items

### Barcode Integration

- Barcode generation for items, batches, and serials
- Multiple barcode format support (Code128, QR, etc.)
- Label printing functionality

### Split Batch Management

- Support for dividing batches into smaller units
- Example: Fabric roll management with varying measurements
- Individual unit tracking within batches
- Parent-child relationship maintenance

## Specialized Features for Manufacturing

### Fabric Roll Management

- Track fabric batches with multiple rolls
- Individual roll measurements (e.g., 45-50 meters per roll)
- Roll-specific serial numbers
- Support for splitting rolls as needed
- Roll-specific quality information

### Material Consumption Tracking

- Track consumed materials across production orders
- Link consumption to specific batches/serials
- Automatic inventory adjustments

## Technical Implementation

### Frontend

- React components with Material UI
- Form validation with Formik and Yup
- Interactive data visualizations with Chart.js
- Responsive design for all devices

### Data Model

- Hierarchical inventory structure
- Many-to-many relationships for batch/serial tracking
- Transaction history with audit trails
- Location tracking with granular detail

## Integration Points

- **BOM Module**: Links inventory items to bill of materials
- **Manufacturing Module**: Consumes inventory for production orders
- **Purchasing Module**: Replenishes inventory through purchase orders
- **Quality Control**: Updates batch/serial status based on QC results

## Future Enhancements

- Barcode scanner integration
- Automated inventory alerts
- RFID tag support
- Mobile app for warehouse operations
- AI-powered inventory optimization
