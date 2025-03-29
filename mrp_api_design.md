# MRP Application API Design

## Overview
This document outlines the API design for Zervi Group's custom MRP application. The API is designed to support Zervi's multi-division structure (Automotive, Camping Production, Apparel, and Technical Textile/Zervitek) while enabling vertical integration between divisions, particularly the flow of semi-finished goods from Zervitek to other production divisions.

## API Architecture

### Architecture Style
- RESTful API design
- JSON as the primary data exchange format
- Token-based authentication
- Role-based access control
- Division-based data segregation

### Base URL Structure
```
/api/v1/{resource}
```

### Common HTTP Methods
- GET: Retrieve resources
- POST: Create new resources
- PUT: Update existing resources
- DELETE: Remove resources
- PATCH: Partial updates to resources

### Common Response Formats
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  }
}
```

### Pagination Format
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "count": 10,
    "per_page": 10,
    "current_page": 1,
    "total_pages": 10,
    "links": {
      "next": "/api/v1/resource?page=2",
      "prev": null
    }
  }
}
```

### Filtering, Sorting, and Searching
- Filtering: `?filter[field]=value`
- Sorting: `?sort=field` or `?sort=-field` (descending)
- Searching: `?search=term`
- Division filtering: `?division_id=1` (automatically applied based on user's division access)

## API Endpoints

### Authentication and User Management

#### Authentication
```
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/refresh
GET /api/v1/auth/user
```

#### Users
```
GET /api/v1/users
GET /api/v1/users/{id}
POST /api/v1/users
PUT /api/v1/users/{id}
DELETE /api/v1/users/{id}
```

#### Roles
```
GET /api/v1/roles
GET /api/v1/roles/{id}
POST /api/v1/roles
PUT /api/v1/roles/{id}
DELETE /api/v1/roles/{id}
```

#### User Division Access
```
GET /api/v1/users/{id}/divisions
POST /api/v1/users/{id}/divisions
DELETE /api/v1/users/{id}/divisions/{division_id}
```

### Company and Division Management

#### Companies
```
GET /api/v1/companies
GET /api/v1/companies/{id}
POST /api/v1/companies
PUT /api/v1/companies/{id}
DELETE /api/v1/companies/{id}
```

#### Divisions
```
GET /api/v1/divisions
GET /api/v1/divisions/{id}
POST /api/v1/divisions
PUT /api/v1/divisions/{id}
DELETE /api/v1/divisions/{id}
```

### Inventory Management

#### Items
```
GET /api/v1/items
GET /api/v1/items/{id}
POST /api/v1/items
PUT /api/v1/items/{id}
DELETE /api/v1/items/{id}
```

#### Item Categories
```
GET /api/v1/item-categories
GET /api/v1/item-categories/{id}
POST /api/v1/item-categories
PUT /api/v1/item-categories/{id}
DELETE /api/v1/item-categories/{id}
```

#### Units of Measurement
```
GET /api/v1/uoms
GET /api/v1/uoms/{id}
POST /api/v1/uoms
PUT /api/v1/uoms/{id}
DELETE /api/v1/uoms/{id}
```

#### UOM Conversions
```
GET /api/v1/uom-conversions
GET /api/v1/uom-conversions/{id}
POST /api/v1/uom-conversions
PUT /api/v1/uom-conversions/{id}
DELETE /api/v1/uom-conversions/{id}
```

#### Inventory
```
GET /api/v1/inventory
GET /api/v1/inventory/{id}
POST /api/v1/inventory/adjust
```

#### Inventory Transactions
```
GET /api/v1/inventory-transactions
GET /api/v1/inventory-transactions/{id}
POST /api/v1/inventory-transactions
```

#### Warehouses
```
GET /api/v1/warehouses
GET /api/v1/warehouses/{id}
POST /api/v1/warehouses
PUT /api/v1/warehouses/{id}
DELETE /api/v1/warehouses/{id}
```

#### Storage Locations
```
GET /api/v1/warehouses/{warehouse_id}/locations
GET /api/v1/warehouses/{warehouse_id}/locations/{id}
POST /api/v1/warehouses/{warehouse_id}/locations
PUT /api/v1/warehouses/{warehouse_id}/locations/{id}
DELETE /api/v1/warehouses/{warehouse_id}/locations/{id}
```

#### Lot Tracking
```
GET /api/v1/lots
GET /api/v1/lots/{id}
POST /api/v1/lots
PUT /api/v1/lots/{id}
DELETE /api/v1/lots/{id}
```

### Bill of Materials (BOM)

#### BOMs
```
GET /api/v1/boms
GET /api/v1/boms/{id}
POST /api/v1/boms
PUT /api/v1/boms/{id}
DELETE /api/v1/boms/{id}
```

#### BOM Components
```
GET /api/v1/boms/{bom_id}/components
GET /api/v1/boms/{bom_id}/components/{id}
POST /api/v1/boms/{bom_id}/components
PUT /api/v1/boms/{bom_id}/components/{id}
DELETE /api/v1/boms/{bom_id}/components/{id}
```

#### BOM Alternatives
```
GET /api/v1/bom-components/{component_id}/alternatives
GET /api/v1/bom-components/{component_id}/alternatives/{id}
POST /api/v1/bom-components/{component_id}/alternatives
PUT /api/v1/bom-components/{component_id}/alternatives/{id}
DELETE /api/v1/bom-components/{component_id}/alternatives/{id}
```

### Routing and Operations

#### Routings
```
GET /api/v1/routings
GET /api/v1/routings/{id}
POST /api/v1/routings
PUT /api/v1/routings/{id}
DELETE /api/v1/routings/{id}
```

#### Operations
```
GET /api/v1/routings/{routing_id}/operations
GET /api/v1/routings/{routing_id}/operations/{id}
POST /api/v1/routings/{routing_id}/operations
PUT /api/v1/routings/{routing_id}/operations/{id}
DELETE /api/v1/routings/{routing_id}/operations/{id}
```

#### Workstations
```
GET /api/v1/workstations
GET /api/v1/workstations/{id}
POST /api/v1/workstations
PUT /api/v1/workstations/{id}
DELETE /api/v1/workstations/{id}
```

#### Work Centers
```
GET /api/v1/work-centers
GET /api/v1/work-centers/{id}
POST /api/v1/work-centers
PUT /api/v1/work-centers/{id}
DELETE /api/v1/work-centers/{id}
```

### Production Planning

#### Manufacturing Orders
```
GET /api/v1/manufacturing-orders
GET /api/v1/manufacturing-orders/{id}
POST /api/v1/manufacturing-orders
PUT /api/v1/manufacturing-orders/{id}
DELETE /api/v1/manufacturing-orders/{id}
```

#### Manufacturing Order Operations
```
GET /api/v1/manufacturing-orders/{mo_id}/operations
GET /api/v1/manufacturing-orders/{mo_id}/operations/{id}
POST /api/v1/manufacturing-orders/{mo_id}/operations
PUT /api/v1/manufacturing-orders/{mo_id}/operations/{id}
DELETE /api/v1/manufacturing-orders/{mo_id}/operations/{id}
```

#### Manufacturing Order Materials
```
GET /api/v1/manufacturing-orders/{mo_id}/materials
GET /api/v1/manufacturing-orders/{mo_id}/materials/{id}
POST /api/v1/manufacturing-orders/{mo_id}/materials
PUT /api/v1/manufacturing-orders/{mo_id}/materials/{id}
DELETE /api/v1/manufacturing-orders/{mo_id}/materials/{id}
```

#### Production Schedules
```
GET /api/v1/production-schedules
GET /api/v1/production-schedules/{id}
POST /api/v1/production-schedules
PUT /api/v1/production-schedules/{id}
DELETE /api/v1/production-schedules/{id}
```

### Sales and CRM

#### Customers
```
GET /api/v1/customers
GET /api/v1/customers/{id}
POST /api/v1/customers
PUT /api/v1/customers/{id}
DELETE /api/v1/customers/{id}
```

#### Customer Orders
```
GET /api/v1/customer-orders
GET /api/v1/customer-orders/{id}
POST /api/v1/customer-orders
PUT /api/v1/customer-orders/{id}
DELETE /api/v1/customer-orders/{id}
```

#### Customer Order Items
```
GET /api/v1/customer-orders/{order_id}/items
GET /api/v1/customer-orders/{order_id}/items/{id}
POST /api/v1/customer-orders/{order_id}/items
PUT /api/v1/customer-orders/{order_id}/items/{id}
DELETE /api/v1/customer-orders/{order_id}/items/{id}
```

#### Shipments
```
GET /api/v1/shipments
GET /api/v1/shipments/{id}
POST /api/v1/shipments
PUT /api/v1/shipments/{id}
DELETE /api/v1/shipments/{id}
```

#### Shipment Items
```
GET /api/v1/shipments/{shipment_id}/items
GET /api/v1/shipments/{shipment_id}/items/{id}
POST /api/v1/shipments/{shipment_id}/items
PUT /api/v1/shipments/{shipment_id}/items/{id}
DELETE /api/v1/shipments/{shipment_id}/items/{id}
```

### Procurement

#### Suppliers
```
GET /api/v1/suppliers
GET /api/v1/suppliers/{id}
POST /api/v1/suppliers
PUT /api/v1/suppliers/{id}
DELETE /api/v1/suppliers/{id}
```

#### Purchase Orders
```
GET /api/v1/purchase-orders
GET /api/v1/purchase-orders/{id}
POST /api/v1/purchase-orders
PUT /api/v1/purchase-orders/{id}
DELETE /api/v1/purchase-orders/{id}
```

#### Purchase Order Items
```
GET /api/v1/purchase-orders/{order_id}/items
GET /api/v1/purchase-orders/{order_id}/items/{id}
POST /api/v1/purchase-orders/{order_id}/items
PUT /api/v1/purchase-orders/{order_id}/items/{id}
DELETE /api/v1/purchase-orders/{order_id}/items/{id}
```

#### Goods Receipts
```
GET /api/v1/goods-receipts
GET /api/v1/goods-receipts/{id}
POST /api/v1/goods-receipts
PUT /api/v1/goods-receipts/{id}
DELETE /api/v1/goods-receipts/{id}
```

#### Goods Receipt Items
```
GET /api/v1/goods-receipts/{receipt_id}/items
GET /api/v1/goods-receipts/{receipt_id}/items/{id}
POST /api/v1/goods-receipts/{receipt_id}/items
PUT /api/v1/goods-receipts/{receipt_id}/items/{id}
DELETE /api/v1/goods-receipts/{receipt_id}/items/{id}
```

### Quality Control

#### Quality Checks
```
GET /api/v1/quality-checks
GET /api/v1/quality-checks/{id}
POST /api/v1/quality-checks
PUT /api/v1/quality-checks/{id}
DELETE /api/v1/quality-checks/{id}
```

#### Quality Check Items
```
GET /api/v1/quality-checks/{check_id}/items
GET /api/v1/quality-checks/{check_id}/items/{id}
POST /api/v1/quality-checks/{check_id}/items
PUT /api/v1/quality-checks/{check_id}/items/{id}
DELETE /api/v1/quality-checks/{check_id}/items/{id}
```

### Inter-Division Transfers (Critical for Zervitek Integration)

#### Inter-Division Transfers
```
GET /api/v1/inter-division-transfers
GET /api/v1/inter-division-transfers/{id}
POST /api/v1/inter-division-transfers
PUT /api/v1/inter-division-transfers/{id}
DELETE /api/v1/inter-division-transfers/{id}
```

#### Inter-Division Transfer Items
```
GET /api/v1/inter-division-transfers/{transfer_id}/items
GET /api/v1/inter-division-transfers/{transfer_id}/items/{id}
POST /api/v1/inter-division-transfers/{transfer_id}/items
PUT /api/v1/inter-division-transfers/{transfer_id}/items/{id}
DELETE /api/v1/inter-division-transfers/{transfer_id}/items/{id}
```

### Accounting and Finance

#### Currencies
```
GET /api/v1/currencies
GET /api/v1/currencies/{id}
POST /api/v1/currencies
PUT /api/v1/currencies/{id}
DELETE /api/v1/currencies/{id}
```

#### Cost Centers
```
GET /api/v1/cost-centers
GET /api/v1/cost-centers/{id}
POST /api/v1/cost-centers
PUT /api/v1/cost-centers/{id}
DELETE /api/v1/cost-centers/{id}
```

#### Item Costs
```
GET /api/v1/items/{item_id}/costs
GET /api/v1/items/{item_id}/costs/{id}
POST /api/v1/items/{item_id}/costs
PUT /api/v1/items/{item_id}/costs/{id}
DELETE /api/v1/items/{item_id}/costs/{id}
```

#### Manufacturing Order Costs
```
GET /api/v1/manufacturing-orders/{mo_id}/costs
GET /api/v1/manufacturing-orders/{mo_id}/costs/{id}
POST /api/v1/manufacturing-orders/{mo_id}/costs
PUT /api/v1/manufacturing-orders/{mo_id}/costs/{id}
DELETE /api/v1/manufacturing-orders/{mo_id}/costs/{id}
```

### System Configuration

#### Settings
```
GET /api/v1/settings
GET /api/v1/settings/{id}
POST /api/v1/settings
PUT /api/v1/settings/{id}
DELETE /api/v1/settings/{id}
```

#### Numbering Sequences
```
GET /api/v1/numbering-sequences
GET /api/v1/numbering-sequences/{id}
POST /api/v1/numbering-sequences
PUT /api/v1/numbering-sequences/{id}
DELETE /api/v1/numbering-sequences/{id}
```

### Reports and Analytics

#### Dashboard
```
GET /api/v1/dashboard
GET /api/v1/dashboard/inventory-summary
GET /api/v1/dashboard/production-summary
GET /api/v1/dashboard/sales-summary
GET /api/v1/dashboard/procurement-summary
```

#### Reports
```
GET /api/v1/reports/inventory
GET /api/v1/reports/production
GET /api/v1/reports/sales
GET /api/v1/reports/procurement
GET /api/v1/reports/inter-division-transfers
GET /api/v1/reports/quality
```

## API Implementation Details

### Authentication and Authorization

#### JWT Authentication
- JSON Web Tokens (JWT) for authentication
- Access tokens with short expiry (15-30 minutes)
- Refresh tokens with longer expiry (7 days)
- Token blacklisting for logout

#### Role-Based Access Control
- Roles define permissions for various resources
- Permissions include: view, create, update, delete
- Division-based access control for data segregation

### Request Validation

All API endpoints will implement appropriate request validation:

```json
// Example validation error response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "name": ["The name field is required"],
      "quantity": ["The quantity must be a positive number"]
    }
  }
}
```

### Division-Based Data Filtering

- All endpoints automatically filter data based on user's division access
- Cross-division data access is controlled by permissions
- Inter-division transfer endpoints handle data from multiple divisions

### API Versioning

- Version included in URL path (/api/v1/)
- Future versions will maintain backward compatibility where possible
- Version deprecation notices will be provided in headers

### Rate Limiting

- Basic rate limiting implemented to prevent abuse
- Different limits for authenticated vs. unauthenticated requests
- Headers indicate rate limit status:
  - X-RateLimit-Limit
  - X-RateLimit-Remaining
  - X-RateLimit-Reset

### Error Handling

Standardized error responses with appropriate HTTP status codes:

- 400 Bad Request: Invalid input
- 401 Unauthorized: Authentication required
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Resource not found
- 409 Conflict: Resource conflict
- 422 Unprocessable Entity: Validation errors
- 429 Too Many Requests: Rate limit exceeded
- 500 Internal Server Error: Server-side error

### Bulk Operations

For efficiency, bulk operations are supported for certain endpoints:

```
POST /api/v1/items/bulk
POST /api/v1/inventory/bulk-adjust
```

### Webhooks

Webhook support for integration with external systems:

```
GET /api/v1/webhooks
POST /api/v1/webhooks
DELETE /api/v1/webhooks/{id}
```

Events that trigger webhooks:
- Inventory changes
- Order status changes
- Manufacturing order status changes
- Inter-division transfers

## API Implementation Technologies

### Backend Framework
- Node.js with Express.js
- TypeScript for type safety
- PostgreSQL database

### API Documentation
- OpenAPI/Swagger specification
- Interactive API documentation

### Testing
- Unit tests for validation and business logic
- Integration tests for API endpoints
- Load testing for performance validation

## Security Considerations

### Data Protection
- All API communications over HTTPS
- Sensitive data encryption at rest
- Input sanitization to prevent injection attacks

### Authentication Security
- Password hashing with bcrypt
- Token-based authentication
- CSRF protection
- Rate limiting for authentication endpoints

### Audit Logging
- All API actions logged for audit purposes
- User activity tracking
- System changes recorded

## API Development Roadmap

### Phase 1: Core API
- Authentication and user management
- Basic inventory management
- Item and BOM management

### Phase 2: Production Management
- Manufacturing orders
- Production scheduling
- Quality control

### Phase 3: Sales and Procurement
- Customer orders
- Purchase orders
- Shipments and goods receipts

### Phase 4: Inter-Division Integration
- Inter-division transfers
- Zervitek integration
- Cross-division reporting

### Phase 5: Advanced Features
- Advanced reporting and analytics
- External system integrations
- Mobile API optimizations
