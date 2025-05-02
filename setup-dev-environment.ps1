# Zervi MRP Development Environment Setup Script
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "Zervi MRP Development Environment Setup" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Navigate to the backend directory
Write-Host "[1/6] Changing directory to src\backend" -ForegroundColor Green
Set-Location -Path ".\src\backend"

# Step 2: Check if .env file exists, if not create it from .env.fix
Write-Host "[2/6] Checking environment file..." -ForegroundColor Green
if (-not (Test-Path -Path ".env")) {
    Write-Host "Creating .env file from .env.fix..." -ForegroundColor Yellow
    Copy-Item -Path ".env.fix" -Destination ".env"
    Write-Host "Environment file created successfully." -ForegroundColor Green
} else {
    Write-Host "Environment file (.env) already exists." -ForegroundColor Green
}

# Step 3: Install dependencies
Write-Host "[3/6] Installing dependencies..." -ForegroundColor Green
npm install
Write-Host "Dependencies installed successfully." -ForegroundColor Green

# Step 4: Check PostgreSQL connection
Write-Host "[4/6] Checking database connection..." -ForegroundColor Green
node test-postgres-connection.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "Database connection failed. Please ensure PostgreSQL is running" -ForegroundColor Red
    Write-Host "and the credentials in .env are correct." -ForegroundColor Red
    exit 1
}

# Step 5: Run migrations
Write-Host "[5/6] Running database migrations..." -ForegroundColor Green
node run-migrations-sequential.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "Migration failed. Please check the error messages above." -ForegroundColor Red
    exit 1
}
Write-Host "Migrations completed successfully." -ForegroundColor Green

# Step 6: Start the development server
Write-Host "[6/6] Starting development server..." -ForegroundColor Green
Write-Host "Server will be available at http://localhost:4000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Cyan
Write-Host ""
npm run dev