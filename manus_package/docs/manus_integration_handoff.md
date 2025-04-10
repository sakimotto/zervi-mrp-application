# Zervi MRP Application - Integration Handoff Document

## Project Overview

The Zervi MRP (Manufacturing Resource Planning) application is a multi-division manufacturing management system designed for Zervi Group's vertically integrated production operations. This document provides all current implementation details to facilitate seamless collaboration.

## 1. Current Backend Implementation

### Technology Stack
- **Framework**: Node.js with Express
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM (Mock implementation currently)
- **Authentication**: JWT-based authentication
- **Documentation**: Swagger UI

### Current Directory Structure
```
zervi-minimal-backend/
├── dist/                  # Compiled TypeScript output
├── node_modules/          # Dependencies
├── src/
│   ├── controllers/       # API endpoint controllers
│   │   ├── auth.controller.ts
│   │   ├── division.controller.ts
│   │   └── ... (other controllers)
│   ├── middleware/        # Express middleware
│   │   ├── auth.middleware.ts
│   │   └── ... (other middleware)
│   ├── models/            # Data models
│   │   ├── division.model.ts
│   │   ├── user.model.ts
│   │   └── ... (other models)
│   ├── routes/            # API route definitions
│   │   └── api.routes.ts
│   ├── services/          # Business logic
│   │   └── ... (service files)
│   ├── utils/             # Utility functions
│   │   └── ... (utility files)
│   └── index.ts           # Application entry point
├── .env                   # Environment configuration
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

### Environment Configuration
Currently using the following environment variables (in .env):
```
PORT=4002                   # Server port (changed from 4000 to avoid conflicts)
NODE_ENV=development        # Environment mode
DB_HOST=zervi-postgresql-u34072.vm.elestio.app
DB_PORT=25432
DB_USERNAME=postgres
DB_PASSWORD=HcbzewvA-ObJp-BZhXVYmE
DB_DATABASE=zervi_mrp
```

## 2. API Implementation Status

### Base URL Structure
All API endpoints follow the pattern: `/api/v1/{resource}`

### Implemented Endpoints

#### Authentication
- `POST /api/v1/auth/login`
  - Request: `{ email: string, password: string }`
  - Response: `{ user: UserObject, token: string, refreshToken: string, expiresIn: number }`
  - Status: ✅ Implemented with mock authentication

#### Division Management
- `GET /api/v1/divisions`
  - Response: `{ value: Division[], Count: number }`
  - Status: ✅ Implemented with mock data
  - Note: The frontend explicitly expects the `value` array and `Count` property format

### Pending Implementation
The following endpoints are specified in the frontend's api.js but not yet implemented:

- User management endpoints
- BOM management endpoints
- Item management endpoints
- Manufacturing Order endpoints
- Specialized Operations endpoints (Laminating, Cutting, Sewing)
- Inter-Division Transfer endpoints
- Customer and Purchase Order endpoints
- Costing endpoints

## 3. Data Format Requirements

The frontend has specific expectations for response formats:

1. **All list endpoints** must return: `{ value: Item[], Count: number }`
2. **Authentication** must return: `{ user: UserObject, token: string, refreshToken: string, expiresIn: number }`
3. **Error responses** must follow: `{ success: false, error: { code: string, message: string } }`

## 4. Key Implementation Notes

### Authentication Flow
- JWT-based authentication is implemented
- Tokens are expected to be included in request headers as: `Authorization: Bearer {token}`
- Mock authentication currently accepts `admin@example.com` / `admin123`

### CORS Configuration
- CORS is enabled for all origins during development
- Headers and methods are properly configured for frontend requests

### Error Handling
- Central error handling middleware catches and formats all errors
- Port conflict detection is implemented for server startup issues

## 5. Frontend Integration

The frontend is currently in design freeze and cannot be modified. Key points:

- Frontend API client expects the base URL of `/api`
- We've changed our backend to use `/api/v1` to match these expectations
- Response formats must exactly match the frontend expectations
- Authentication flow follows standard JWT pattern with localStorage

## 6. Testing and Verification

We've verified the following work correctly:
- Authentication endpoint returns proper token
- Division listing endpoint returns data in the expected format
- Protected routes properly validate JWT tokens

## 7. Next Steps and Priorities

Immediate implementation priorities:

1. Complete core entity controllers (Users, Items, BOM)
2. Implement specialized operation endpoints
3. Add inter-division transfer functionality
4. Implement manufacturing order management

## 8. Contact and Collaboration

Your contributions will be integrated into our current implementation. Please maintain the existing code style and patterns, particularly the response format standards required by the frontend.

We look forward to your assistance in completing the remaining API implementations and providing high-level diagrams of the integrated codebase.

## 9. Prompt Request for Manus.im

### Priority Implementation Requests

We request your assistance with the following specific tasks:

1. **Implement BOM Management API Endpoints**
   - Create the controller, routes, and mock data for BOM management
   - Ensure response formats match frontend expectations
   - Focus on these endpoints from the frontend's api.js:
     - `GET /api/v1/boms` (with support for parameters)
     - `GET /api/v1/boms/:id`
     - `POST /api/v1/boms`
     - `PUT /api/v1/boms/:id`
     - `POST /api/v1/boms/:id/components`

2. **Implement Item Management API Endpoints**
   - Create the controller, routes, and mock data for Item management
   - Ensure response formats match frontend expectations
   - Focus on these endpoints from the frontend's api.js:
     - `GET /api/v1/items` (with support for parameters)
     - `GET /api/v1/items/:id`
     - `POST /api/v1/items`
     - `PUT /api/v1/items/:id`

3. **Implementation of Manufacturing Order Endpoints**
   - Create the controller, routes, and mock data for manufacturing orders
   - Ensure response formats match frontend expectations
   - Focus on these endpoints from the frontend's api.js:
     - `GET /api/v1/manufacturing-orders` (with support for parameters)
     - `GET /api/v1/manufacturing-orders/:id`
     - `POST /api/v1/manufacturing-orders`
     - `PUT /api/v1/manufacturing-orders/:id`

### Documentation Request

4. **Create High-Level System Diagrams**
   - Provide updated architecture diagrams showing the integrated system
   - Include sequence diagrams for key processes (authentication, BOM creation, manufacturing order flow)
   - Document the relationships between controllers, routes, and mock data sources

### Implementation Guidelines

- Follow the existing project structure and coding patterns
- Maintain consistent error handling throughout all new endpoints
- Return mock data that realistically represents what would come from the database
- All list endpoints must return: `{ value: Item[], Count: number }` format
- Ensure proper authentication middleware is applied to protected routes

We appreciate your assistance in accelerating the development of this complex MRP application and look forward to your contribution to our team.
