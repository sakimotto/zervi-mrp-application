# Zervi MRP Application - File Structure Documentation

## Overview

This document outlines the organization of the Zervi MRP Application codebase. Understanding this structure will help developers navigate the project efficiently, locate relevant files quickly, and maintain consistency when adding new components.

## Root Directory

```
zervi-mrp-application/
├── docs/                  # Project documentation
├── src/                   # Source code
│   ├── backend/           # Node.js/Express backend (TypeScript)
│   └── frontend/          # React.js frontend
├── database/              # Database scripts and migrations
├── manus_package/         # Manufacturing specifications and guides
├── *.md                   # Root-level documentation files
└── temp_zervi_repo/       # Archive of original repository structure
```

## Backend Structure (`src/backend/`)

The backend follows a standard TypeScript Node.js architecture with clear separation of concerns:

```
src/backend/
├── dist/                  # Compiled JavaScript output (generated)
├── node_modules/          # Dependencies (generated)
├── src/
│   ├── config/            # Application configuration
│   │   ├── database.ts    # Database connection settings
│   │   └── server.ts      # Server configuration
│   ├── controllers/       # Request handlers (REST API endpoints)
│   │   ├── auth.controller.ts
│   │   ├── division.controller.ts
│   │   ├── fabric-roll.controller.ts
│   │   ├── item.controller.ts
│   │   ├── lot-tracking.controller.ts
│   │   └── specialized-operation.controller.ts
│   ├── middleware/        # Express middleware
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── models/            # Data models and types
│   │   ├── auth/
│   │   ├── bom/
│   │   ├── inventory/
│   │   ├── manufacturing/
│   │   └── shared/
│   ├── repositories/      # Database access layer
│   │   ├── fabric-roll.repository.ts
│   │   ├── item.repository.ts
│   │   └── lot-tracking.repository.ts
│   ├── routes/            # API route definitions
│   │   ├── api.routes.ts
│   │   ├── auth.routes.ts
│   │   └── specialized-operation.routes.ts
│   ├── services/          # Business logic
│   │   ├── fabric-roll.service.ts
│   │   ├── item.service.ts
│   │   └── lot-tracking.service.ts
│   ├── utils/             # Helper functions and utilities
│   └── app.ts             # Express application entry point
├── .eslintrc.js           # ESLint configuration
├── .prettierrc            # Prettier configuration
├── package.json           # Dependencies and scripts
├── package-lock.json      # Dependency lock file
└── tsconfig.json          # TypeScript configuration
```

## Frontend Structure (`src/frontend/`)

The frontend follows React best practices with a component-based architecture:

```
src/frontend/
├── build/                 # Production build output (generated)
├── node_modules/          # Dependencies (generated)
├── public/                # Static assets
│   ├── images/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── common/        # Shared components (buttons, tables, etc.)
│   │   ├── layout/        # Page layout components
│   │   └── widgets/       # Dashboard widgets and charts
│   ├── contexts/          # React context providers
│   │   ├── AuthContext.js # Authentication state
│   │   └── ThemeContext.js # UI theme settings
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components (routes)
│   │   ├── auth/          # Authentication pages
│   │   ├── bom/           # Bill of Materials pages
│   │   ├── dashboard/     # Dashboard pages
│   │   ├── inventory/     # Inventory management pages
│   │   │   ├── BatchManagementPage.js
│   │   │   ├── InventoryDashboard.js
│   │   │   ├── InventoryListPage.js
│   │   │   ├── ItemDetailsPage.js
│   │   │   ├── ItemFormPage.js
│   │   │   └── WarehousesPage.js
│   │   └── manufacturing/ # Manufacturing operations pages
│   │       ├── CuttingOperationsPage.js
│   │       └── SewingOperationsPage.js
│   ├── services/          # API service functions
│   │   ├── api.js         # API client setup
│   │   ├── auth.js        # Authentication API calls
│   │   └── inventory.js   # Inventory API calls
│   ├── utils/             # Helper functions and utilities
│   ├── App.js             # Application component and routes
│   ├── index.js           # React entry point
│   └── theme.js           # Material UI theme configuration
├── static-preview-archive/ # Archived static HTML previews
├── package.json           # Dependencies and scripts
└── package-lock.json      # Dependency lock file
```

## Documentation Structure (`docs/`)

All project documentation is organized as follows:

```
docs/
├── development_roadmap.md        # Central development guide
├── development_changelog.md      # Chronological record of changes
├── file_structure.md             # This file - codebase organization
├── inventory_module_documentation.md # Inventory feature documentation
└── [future module documentation] # Documentation for other modules
```

## Database Structure (`database/`)

Database scripts and migrations:

```
database/
├── migrations/            # SQL migration scripts
├── scripts/               # Database administration scripts
└── schema/                # Schema definition files
```

## Best Practices for Working with This Structure

### Adding New Components

1. **Backend**:
   - New controllers go in `src/backend/src/controllers/`
   - New models go in `src/backend/src/models/` in the appropriate subdirectory
   - New routes should be added to existing route files or create new ones in `src/backend/src/routes/`

2. **Frontend**:
   - New pages go in `src/frontend/src/pages/` in the appropriate module directory
   - New reusable components go in `src/frontend/src/components/`
   - New API service functions go in `src/frontend/src/services/`

### Naming Conventions

- **Backend**:
  - Files: kebab-case (e.g., `fabric-roll.controller.ts`)
  - Classes: PascalCase (e.g., `FabricRollController`)
  - Methods: camelCase (e.g., `getAllRolls()`)
  - Interfaces: PascalCase with "I" prefix (e.g., `IInventoryItem`)

- **Frontend**:
  - Component files: PascalCase (e.g., `BatchManagementPage.js`)
  - Non-component files: camelCase (e.g., `authUtils.js`)
  - Component names: PascalCase (e.g., `<InventoryList>`)
  - Props and state: camelCase (e.g., `selectedItem`)

### Import Order Convention

1. External libraries
2. Internal modules from other directories
3. Local imports from the same directory
4. CSS/SCSS imports

Example:
```javascript
// External libraries
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

// Internal modules
import { fetchItems } from '../../services/api';
import { formatDate } from '../../utils/dateUtils';

// Local imports
import ItemCard from './ItemCard';

// Styles
import './styles.css';
```

---

*Last updated: May 1, 2025*
