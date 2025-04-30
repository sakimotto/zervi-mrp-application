# Zervi MRP Application

## Project Overview

This project is a comprehensive Manufacturing Resource Planning (MRP) application developed specifically for Zervi Group's multi-division manufacturing operations. The application supports the company's unique business structure with specialized features for Automotive, Camping, Apparel, and Zervitek (Technical Textile) divisions.

## Key Features

- **Multi-Division Support**: Dedicated dashboards for all four divisions with division-specific workflows and KPIs
- **Advanced Inventory Management**: Complete inventory tracking with batch/lot numbers, serial tracking, barcode support, and specialized fabric roll management
- **Multi-level BOM Management**: Hierarchical product structures with raw materials, semi-finished goods, and finished products
- **Specialized Manufacturing Operations**: Tracking for Laminating, Cutting, Sewing, and Embroidery operations
- **Inter-Division Transfer System**: Seamless material flow between divisions supporting vertical integration
- **Comprehensive Costing Model**: Direct and indirect overhead cost tracking with pricing scenario modeling
- **Production Planning and Scheduling**: Manufacturing order management with Gantt chart visualization

## Technical Implementation

- **Backend**: Node.js with Express.js framework, TypeScript, PostgreSQL database with TypeORM
- **Frontend**: React.js with Material UI components, Redux for state management
- **Authentication**: JWT authentication and role-based authorization

## Repository Structure

```shell
├── home/ubuntu/mrp-app/     # Original Application Code
├── src/
│   ├── backend/             # Minimal Backend API (Node/Express TS)
│   └── frontend/            # Static UI Preview (HTML/JS)
├── database/                # Database Scripts and Migrations
├── manus_package/           # Manus deliverables and guides
└── *.md                     # Top-level documentation
```

## Documentation

- `mrp_requirements.md` - Original requirements document
- `mrp_database_schema.md` - Database schema documentation
- `revised_mrp_database_schema.md` - Enhanced database schema with multi-level BOM support
- `mrp_api_design.md` - RESTful API design documentation
- `project_summary.md` - Overall project summary and features
- `deployment_guide.md` - Instructions for deployment
- `user_guide.md` - User manual

## UI Preview

The `src/frontend` directory contains static HTML pages that showcase the UI design without requiring the full application stack. These pages provide a visual representation of the interface and can be viewed directly in any web browser.

## Getting Started

1. Clone this repository
2. Backend:
   - cd src/backend
   - npm install
   - npm start
3. Frontend:
   - Open src/frontend/index.html in a browser

## License

Proprietary - All rights reserved
