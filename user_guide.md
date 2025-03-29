# Zervi MRP Application User Guide

This comprehensive guide will help you get started with your new MRP (Material Requirements Planning) application, specifically designed for Zervi Group's multi-division manufacturing operations.

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Division Management](#division-management)
4. [Inventory Management](#inventory-management)
5. [Multi-level BOM Management](#multi-level-bom-management)
6. [Manufacturing Operations](#manufacturing-operations)
7. [Inter-Division Transfers](#inter-division-transfers)
8. [Costing and Pricing](#costing-and-pricing)
9. [Reports and Analytics](#reports-and-analytics)
10. [System Administration](#system-administration)

## Introduction

The Zervi MRP application is a comprehensive manufacturing resource planning system designed specifically for Zervi Group's multi-division structure. It supports the entire manufacturing workflow from raw materials to finished products, with specialized features for your Automotive, Camping, Apparel, and Technical Textile (Zervitek) divisions.

### Key Features

- **Multi-division Support**: Manage operations across all your business units with division-specific dashboards
- **Multi-level BOM Management**: Track raw materials, semi-finished goods, and finished products
- **Specialized Manufacturing Operations**: Dedicated tracking for Laminating, Cutting, Sewing, and Embroidery
- **Inter-Division Transfers**: Seamless material flow between divisions, especially from Zervitek to other divisions
- **Comprehensive Costing**: Direct and indirect overhead cost tracking with pricing scenario modeling

## Getting Started

### Logging In

1. Access the application at your company's designated URL
2. Enter your username and password
3. Select your division (if you have access to multiple divisions)

### Main Dashboard

The main dashboard provides an overview of your manufacturing operations with key metrics and quick access to all major functions:

- **Production Overview**: Current manufacturing orders and their status
- **Inventory Status**: Stock levels and alerts for low inventory
- **Recent Transfers**: Latest inter-division transfers
- **Production Schedule**: Upcoming manufacturing activities
- **Quick Actions**: Buttons for common tasks like creating manufacturing orders

## Division Management

The application supports Zervi Group's multi-division structure with specialized interfaces for each division.

### Division Selection

Use the division selector in the top navigation bar to switch between divisions you have access to:

- **Automotive Division**: Focus on seat covers and interior protection products
- **Camping Division**: Manage outdoor and camping product manufacturing
- **Apparel Division**: Track apparel production processes
- **Zervitek (Technical Textile)**: Manage the production of semi-finished goods for other divisions

### Division-Specific Dashboards

Each division has its own dashboard with relevant KPIs and metrics:

- **Zervitek Dashboard**: Emphasizes outgoing transfers to other divisions
- **Automotive Dashboard**: Focuses on OEM compliance and production volumes
- **Camping Dashboard**: Highlights seasonal production planning
- **Apparel Dashboard**: Emphasizes style and size variations

## Inventory Management

### Item Categories

The system supports different item types to match your manufacturing hierarchy:

- **Raw Materials**: Base materials used in production
- **Semi-finished Goods**: Partially completed items (typically from Zervitek)
- **Finished Products**: Completed items ready for sale

### Inventory Tracking

- **Real-time Inventory**: Current stock levels across all warehouses
- **Lot Tracking**: Batch and lot number tracking for quality control
- **Minimum Stock Levels**: Automatic alerts when inventory falls below thresholds
- **Inventory Valuation**: Cost-based inventory valuation

## Multi-level BOM Management

The BOM (Bill of Materials) system supports complex product structures with multiple levels.

### Creating a Multi-level BOM

1. Navigate to **Manufacturing → BOMs → Create New BOM**
2. Select the finished product
3. Add components (can be raw materials or semi-finished goods)
4. Specify quantities and units of measurement
5. Set component levels to create the hierarchy
6. Add operations required for manufacturing

### BOM Versioning

- Create and manage multiple versions of BOMs
- Track changes between versions
- Set active and obsolete versions

## Manufacturing Operations

### Specialized Operations

The system includes dedicated tracking for your key manufacturing operations:

- **Laminating**: Track material bonding processes
- **Cutting**: Manage pattern cutting and material utilization
- **Sewing**: Monitor stitching operations and quality
- **Embroidery**: Track design application and machine utilization

### Manufacturing Order Management

1. Navigate to **Manufacturing → Orders → Create New Order**
2. Select the product and BOM
3. Enter quantity and planned dates
4. Review and adjust operations sequence
5. Assign workstations for each operation
6. Allocate materials from inventory
7. Track progress through each operation

## Inter-Division Transfers

This feature is critical for managing the flow of semi-finished goods from Zervitek to your other divisions.

### Creating a Transfer

1. Navigate to **Inventory → Transfers → Create New Transfer**
2. Select source division (e.g., Zervitek) and destination division
3. Select source and destination warehouses
4. Add items to transfer with quantities
5. Set planned transfer date
6. Submit the transfer request

### Transfer Workflow

- **Planned**: Initial transfer request created
- **In Progress**: Items picked from source warehouse
- **Completed**: Items received at destination warehouse
- **Cancelled**: Transfer cancelled before completion

## Costing and Pricing

### Cost Modeling

1. Navigate to **Finance → Costing → Create New Costing Model**
2. Select the item to cost
3. Add direct costs (materials, labor)
4. Add overhead costs (indirect costs)
5. Set allocation bases for overhead distribution
6. Create pricing scenarios with different markups

### Pricing Scenarios

- Create multiple pricing scenarios for different market conditions
- Set markup percentages and additional costs
- Compare calculated prices across scenarios
- Set default pricing for sales orders

## Reports and Analytics

### Standard Reports

- **Production Efficiency**: Track actual vs. planned production times
- **Material Usage**: Monitor material consumption and variances
- **Cost Analysis**: Analyze production costs across divisions
- **Transfer Analysis**: Track inter-division material flow

### Custom Reports

1. Navigate to **Reports → Custom Reports**
2. Select data sources and fields
3. Set filters and parameters
4. Choose visualization type
5. Save report for future use

## System Administration

### User Management

1. Navigate to **Admin → Users**
2. Create new users with appropriate roles
3. Assign division access permissions
4. Set password policies and account restrictions

### System Configuration

- **Division Setup**: Create and manage divisions
- **Warehouse Configuration**: Set up warehouses and storage locations
- **Workstation Management**: Configure workstations for operations
- **Cost Center Definition**: Define cost centers for financial tracking

---

For additional support or training, please contact your system administrator or refer to the online help documentation accessible from the help icon in the application.
