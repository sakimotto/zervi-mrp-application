# Zervi MRP Application - Development Roadmap

## Overview

This document serves as the central hub for all development activities on the Zervi MRP Application. It provides links to key documentation, outlines current development priorities, and helps team members quickly locate the most up-to-date components of the system.

## Quick Reference

| Component | Status | Latest Branch | Key Files | Owner |
|-----------|--------|---------------|-----------|-------|
| Backend API | Active Development | `schema-documentation-updates` | [src/backend/src/controllers](../src/backend/src/controllers) | Arthur |
| Frontend UI | Stable | `safe-local-backend` | [src/frontend/src/pages](../src/frontend/src/pages) | Arthur |
| Database | Active Development | `schema-documentation-updates` | [src/backend/src/repositories](../src/backend/src/repositories) | Arthur |
| Documentation | Ongoing | `safe-local-backend` | [/docs](../docs) | Arthur |

## Current Development Priorities

### 1. PostgreSQL Integration (In Progress)
- **Description**: Connecting inventory management features to PostgreSQL database
- **Branch**: `schema-documentation-updates`
- **Key Files**:
  - [src/backend/src/controllers/fabric-roll.controller.ts](../src/backend/src/controllers/fabric-roll.controller.ts)
  - [src/backend/src/controllers/lot-tracking.controller.ts](../src/backend/src/controllers/lot-tracking.controller.ts)
  - [src/backend/src/services/fabric-roll.service.ts](../src/backend/src/services/fabric-roll.service.ts)
- **Status**: Controllers and services implemented, testing in progress
- **Next Steps**: Complete repository implementations and testing

### 2. Manufacturing Operations (In Progress)
- **Description**: Implementation of specialized manufacturing operations for textiles
- **Branch**: `schema-documentation-updates`
- **Key Files**:
  - Frontend: [src/frontend/src/pages/manufacturing/CuttingOperationsPage.js](../src/frontend/src/pages/manufacturing/CuttingOperationsPage.js)
  - Frontend: [src/frontend/src/pages/manufacturing/SewingOperationsPage.js](../src/frontend/src/pages/manufacturing/SewingOperationsPage.js)
  - Backend: [src/backend/src/controllers/specialized-operation.controller.ts](../src/backend/src/controllers/specialized-operation.controller.ts)
- **Status**: Frontend components mostly implemented, backend integration in progress
- **Next Steps**: Complete backend API endpoints and connect to frontend

### 3. Inventory Management (Completed)
- **Description**: Advanced inventory features including batch/lot tracking and barcode support
- **Branch**: `safe-local-backend`
- **Key Files**:
  - [src/frontend/src/pages/inventory/BatchManagementPage.js](../src/frontend/src/pages/inventory/BatchManagementPage.js)
  - [src/frontend/src/pages/inventory/ItemFormPage.js](../src/frontend/src/pages/inventory/ItemFormPage.js)
  - [docs/inventory_module_documentation.md](../docs/inventory_module_documentation.md)
- **Status**: Frontend implementation complete, backend integration in progress
- **Next Steps**: Connect to PostgreSQL backend

## Documentation Map

| Document | Purpose | Location |
|----------|---------|----------|
| Project Overview | High-level introduction | [README.md](../README.md) |
| File Structure | Codebase organization | [docs/file_structure.md](./file_structure.md) |
| Inventory Module | Inventory features | [docs/inventory_module_documentation.md](./inventory_module_documentation.md) |
| Branch Strategy | Git workflow | [BRANCH_INFORMATION.md](../BRANCH_INFORMATION.md) |
| Development Changelog | Recent changes | [docs/development_changelog.md](./development_changelog.md) |

## Timeline and Milestones

| Milestone | Target Date | Status | Description |
|-----------|-------------|--------|-------------|
| Inventory Module Frontend | April 30, 2025 | ✅ Complete | Basic and advanced inventory management UI |
| PostgreSQL Integration | May 7, 2025 | 🔄 In Progress | Database connections for all modules |
| Manufacturing Operations | May 15, 2025 | 🔄 In Progress | Specialized textile operations |
| BOM Management | May 30, 2025 | 📅 Planned | Multi-level bill of materials |
| User Acceptance Testing | June 15, 2025 | 📅 Planned | Feature verification with stakeholders |
| Production Deployment | July 1, 2025 | 📅 Planned | Launch of full system |

## Getting Started for Developers

1. Check this roadmap first to understand the current focus areas
2. Pull the appropriate branch for the component you're working on
3. Reference the file structure documentation for proper code organization
4. Update the development changelog when making significant changes
5. Keep documentation in sync with code changes

## Decision Log

| Date | Decision | Rationale | Stakeholders |
|------|----------|-----------|--------------|
| Apr 30, 2025 | Switched to PostgreSQL for database | Better support for complex inventory relationships and performance | Arthur, Dev Team |
| Apr 29, 2025 | Implemented auth bypass for development | Speed up testing during development phase | Arthur |
| Apr 28, 2025 | Created safe-local-backend branch | Protect local development work | Arthur |

---

*Last updated: May 1, 2025*
