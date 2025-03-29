# Deployment Guide for Zervi MRP Application

This document provides instructions for deploying the Zervi MRP application to a production environment.

## Prerequisites

- Node.js 16+ and npm 8+
- PostgreSQL 14+
- A server with at least 2GB RAM and 10GB storage
- Domain name (optional for production deployment)

## Backend Deployment

### 1. Database Setup

1. Create a PostgreSQL database for the application:
   ```sql
   CREATE DATABASE zervi_mrp;
   CREATE USER zervi_mrp_user WITH ENCRYPTED PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE zervi_mrp TO zervi_mrp_user;
   ```

2. Update the `.env` file in the backend directory with your production database credentials:
   ```
   DB_HOST=your_db_host
   DB_PORT=5432
   DB_NAME=zervi_mrp
   DB_USER=zervi_mrp_user
   DB_PASSWORD=your_secure_password
   JWT_SECRET=your_secure_jwt_secret
   PORT=3000
   NODE_ENV=production
   ```

### 2. Backend Build and Deployment

1. Navigate to the backend directory:
   ```bash
   cd /path/to/mrp-app/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the application:
   ```bash
   npm run build
   ```

4. Start the application:
   ```bash
   npm start
   ```

5. For production deployment, it's recommended to use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start dist/index.js --name zervi-mrp-backend
   pm2 save
   pm2 startup
   ```

## Frontend Deployment

### 1. Frontend Configuration

1. Update the API endpoint in the frontend configuration:
   ```bash
   cd /path/to/mrp-app/frontend
   ```

2. Create or update the `.env` file:
   ```
   REACT_APP_API_URL=https://your-api-domain.com/api
   ```

### 2. Frontend Build and Deployment

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the application:
   ```bash
   npm run build
   ```

3. The build folder can be deployed to any static hosting service like Netlify, Vercel, or a traditional web server.

4. For a simple deployment using a web server like Nginx:
   ```
   server {
       listen 80;
       server_name your-domain.com;
       root /path/to/mrp-app/frontend/build;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Initial Setup After Deployment

1. Access the application at your domain or IP address
2. Log in with the default admin credentials:
   - Email: admin@zervi.com
   - Password: admin123
3. Change the default password immediately
4. Set up the company structure:
   - Create divisions (Automotive, Camping, Apparel, Zervitek)
   - Create user accounts and assign division access
   - Configure warehouses and storage locations
   - Set up cost centers and cost types

## Backup and Maintenance

1. Set up regular database backups:
   ```bash
   pg_dump -U zervi_mrp_user zervi_mrp > backup_$(date +%Y%m%d).sql
   ```

2. Schedule the backup script to run daily using cron:
   ```
   0 0 * * * /path/to/backup_script.sh
   ```

3. Monitor application logs:
   ```bash
   pm2 logs zervi-mrp-backend
   ```

## Troubleshooting

- If the application fails to start, check the logs:
  ```bash
  pm2 logs zervi-mrp-backend
  ```

- If database connection issues occur, verify the database credentials and ensure the database server is running.

- For frontend routing issues, ensure the web server is configured to serve the React application correctly.

## Support

For additional support, please contact the development team at support@example.com.
