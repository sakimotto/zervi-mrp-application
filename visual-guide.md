# Visual Guide for PostgreSQL Setup

This guide shows you what to expect at each step of the setup process.

## Step 0: Installing PostgreSQL

Since PostgreSQL isn't installed on your system, you'll need to install it first:

1. Download PostgreSQL from the official website:
   ```
   https://www.postgresql.org/download/windows/
   ```

2. Run the installer and follow these steps:
   
   a. Select components (select all):
   ```
   [✓] PostgreSQL Server
   [✓] pgAdmin 4
   [✓] Command Line Tools
   [✓] Stack Builder
   ```

   b. Specify installation directory (use default):
   ```
   C:\Program Files\PostgreSQL\15
   ```

   c. Specify data directory (use default):
   ```
   C:\Program Files\PostgreSQL\15\data
   ```

   d. Set password for database superuser:
   ```
   Password: zervi2025
   Confirm password: zervi2025
   ```

   e. Select port (use default):
   ```
   Port: 5432
   ```

   f. Select locale (use default):
   ```
   Locale: [Default locale]
   ```

   g. Complete the installation

3. After installation, you should see a confirmation screen:
   ```
   Setup has finished installing PostgreSQL on your computer.
   ```

## Step 1: Setting PostgreSQL Password

If you set the password during installation to "zervi2025", you can skip this step.

Otherwise:

1. Open Command Prompt as Administrator:
   ```
   Start Menu > type "cmd" > right-click "Command Prompt" > "Run as administrator"
   ```

2. Navigate to PostgreSQL bin directory:
   ```
   C:\Users\Archie> cd "C:\Program Files\PostgreSQL\15\bin"
   C:\Program Files\PostgreSQL\15\bin>
   ```

3. Connect to PostgreSQL:
   ```
   C:\Program Files\PostgreSQL\15\bin> psql -U postgres
   psql (15.x)
   Type "help" for help.

   postgres=#
   ```

4. Set the password:
   ```
   postgres=# ALTER USER postgres WITH PASSWORD 'zervi2025';
   ALTER ROLE
   postgres=#
   ```

5. Exit psql:
   ```
   postgres=# \q
   C:\Program Files\PostgreSQL\15\bin>
   ```

## Step 2: Creating the Database

1. Connect to PostgreSQL (you'll be prompted for the password you just set):
   ```
   C:\Program Files\PostgreSQL\15\bin> psql -U postgres
   Password for user postgres: [type 'zervi2025' here]
   psql (15.x)
   Type "help" for help.

   postgres=#
   ```

2. Create the database:
   ```
   postgres=# CREATE DATABASE zervi_mrp;
   CREATE DATABASE
   postgres=#
   ```

3. Exit psql:
   ```
   postgres=# \q
   C:\Program Files\PostgreSQL\15\bin>
   ```

## Step 3: Testing the Connection

1. Navigate to the backend directory:
   ```
   C:\Users\Archie> cd "C:\Users\Archie\Desktop\Coding Projects\Manufacturing MRP Application Development Request\src\backend"
   C:\Users\Archie\Desktop\Coding Projects\Manufacturing MRP Application Development Request\src\backend>
   ```

2. Run the connection test:
   ```
   C:\Users\Archie\Desktop\Coding Projects\Manufacturing MRP Application Development Request\src\backend> node test-connection-temp.js
   Testing PostgreSQL connection...
   SUCCESS: Connected to database!
   ```

## Step 4: Running the Setup Script

1. Navigate back to the project root:
   ```
   C:\Users\Archie\Desktop\Coding Projects\Manufacturing MRP Application Development Request\src\backend> cd ..\..
   C:\Users\Archie\Desktop\Coding Projects\Manufacturing MRP Application Development Request>
   ```

2. Run the setup script:
   ```
   C:\Users\Archie\Desktop\Coding Projects\Manufacturing MRP Application Development Request> powershell -ExecutionPolicy Bypass -File .\setup-dev-environment.ps1
   ===================================================
   Zervi MRP Development Environment Setup
   ===================================================

   [1/6] Changing directory to src\backend
   [2/6] Checking environment file...
   Environment file (.env) already exists.
   [3/6] Installing dependencies...
   Dependencies installed successfully.
   [4/6] Checking database connection...
   Testing PostgreSQL connection...
   SUCCESS: Connected to database!
   [5/6] Running database migrations...
   🔍 Checking database connection...
   ✅ Connected to database successfully
   ...
   ✅ Migrations completed successfully
   [6/6] Starting development server...
   Server will be available at http://localhost:4000
   Press Ctrl+C to stop the server.
   ```

3. When the server is running, you can access it at:
   ```
   http://localhost:4000
   ```

## What to Do If Something Goes Wrong

### If PostgreSQL Service is Not Running:

1. Open Services:
   ```
   Start Menu > type "services.msc" > press Enter
   ```

2. Find "PostgreSQL" in the list:
   ```
   Name: postgresql-x64-15
   Status: [blank]
   ```

3. Right-click and select "Start":
   ```
   Name: postgresql-x64-15
   Status: Running
   ```

### If You Can't Connect to PostgreSQL:

Make sure you're using the correct password. If you're still having issues, you can try:

1. Open pgAdmin 4
2. Connect to the server using:
   - Host: localhost
   - Port: 5432
   - Username: postgres
   - Password: zervi2025