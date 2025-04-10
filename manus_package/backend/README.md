# Zervi Minimal Backend

This is a minimal backend implementation for the Zervi MRP application. It provides a basic API that connects to the PostgreSQL database and supports the frontend UI without modifying it.

## Features

- TypeORM connection to PostgreSQL database
- Express REST API with TypeScript
- Authentication endpoints (mock implementation)
- Division management endpoints
- Error handling middleware
- CORS support for frontend connection

## Getting Started

### Prerequisites
1. Node.js (v14+)
2. npm or yarn
3. PostgreSQL database

### Installation
1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Configure environment variables in `.env` file

### Port Configuration

The server port is configured in the `.env` file. By default, the server runs on port 4000. If you're experiencing port conflicts, modify the `PORT` value in the `.env` file before starting the server.

### Running the Application

#### Development mode
```bash
npm run dev
```

#### Production mode
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login with username and password
- `POST /api/v1/auth/refresh` - Refresh authentication token

### Division Management
- `GET /api/v1/divisions` - Get all divisions
- `GET /api/v1/divisions/:id` - Get division by ID
- `POST /api/v1/divisions` - Create a new division
- `PUT /api/v1/divisions/:id` - Update a division
- `DELETE /api/v1/divisions/:id` - Delete a division

## Development Notes

This is a minimal implementation to ensure the frontend can connect to a working backend. For production use, additional features and security measures would need to be implemented.
