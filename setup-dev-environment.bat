@echo off
echo ===================================================
echo Zervi MRP Development Environment Setup
echo ===================================================
echo.

echo [1/6] Changing directory to src\backend
cd src\backend

echo [2/6] Checking environment file...
if not exist .env (
    echo Creating .env file from .env.fix...
    copy .env.fix .env
    echo Environment file created successfully.
) else (
    echo Environment file (.env) already exists.
)

echo [3/6] Installing dependencies...
call npm install
echo Dependencies installed successfully.

echo [4/6] Checking database connection...
node test-postgres-connection.js
if %ERRORLEVEL% NEQ 0 (
    echo Database connection failed. Please ensure PostgreSQL is running
    echo and the credentials in .env are correct.
    exit /b 1
)

echo [5/6] Running database migrations...
node run-migrations-sequential.js
if %ERRORLEVEL% NEQ 0 (
    echo Migration failed. Please check the error messages above.
    exit /b 1
)
echo Migrations completed successfully.

echo [6/6] Starting development server...
echo Server will be available at http://localhost:4000
echo Press Ctrl+C to stop the server.
echo.
call npm run dev

exit /b 0