@echo off
echo ===================================================
echo Zervi MRP Database Setup
echo ===================================================
echo.

echo This script will create the zervi_mrp database in PostgreSQL.
echo Make sure you have set the password for the postgres user first.
echo.

set /p PGPASSWORD="Enter the postgres user password: "

echo.
echo Creating database...
echo.

REM Run the SQL script
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -f create-database.sql

echo.
echo Database setup complete!
echo.
echo You can now run the application setup script:
echo powershell -ExecutionPolicy Bypass -File .\setup-dev-environment.ps1
echo.

pause