@echo off
echo ===================================================
echo EASY SETUP FOR ZERVI MRP APPLICATION
echo ===================================================
echo.

:CHECK_POSTGRES
echo Checking if PostgreSQL is installed...
if exist "C:\Program Files\PostgreSQL\15\bin\psql.exe" (
    echo PostgreSQL 15 found!
    goto MAIN_MENU
) else if exist "C:\Program Files\PostgreSQL\14\bin\psql.exe" (
    echo PostgreSQL 14 found!
    set PG_PATH=C:\Program Files\PostgreSQL\14
    goto MAIN_MENU
) else if exist "C:\Program Files\PostgreSQL\13\bin\psql.exe" (
    echo PostgreSQL 13 found!
    set PG_PATH=C:\Program Files\PostgreSQL\13
    goto MAIN_MENU
) else (
    echo PostgreSQL not found in the expected location.
    echo You need to install PostgreSQL first.
    echo.
    echo Would you like to open the PostgreSQL download page? (Y/N)
    set /p OPEN_DOWNLOAD="> "
    if /i "%OPEN_DOWNLOAD%" EQU "Y" (
        start https://www.postgresql.org/download/windows/
        echo.
        echo Please install PostgreSQL with these settings:
        echo 1. Version: 13 or newer
        echo 2. Components: Select all components
        echo 3. Data Directory: Use the default
        echo 4. Password: Remember the password you set!
        echo 5. Port: Use the default (5432)
        echo.
        echo After installation, run this script again.
        echo.
        pause
        exit
    ) else (
        goto MAIN_MENU
    )
)

:MAIN_MENU
cls
echo ===================================================
echo ZERVI MRP SETUP MENU
echo ===================================================
echo.
echo What would you like to do?
echo.
echo 1. Set PostgreSQL password
echo 2. Create database
echo 3. Test database connection
echo 4. Run application setup
echo 5. Exit
echo.
set /p MENU_CHOICE="> "

if "%MENU_CHOICE%"=="1" goto STEP1
if "%MENU_CHOICE%"=="2" goto STEP2
if "%MENU_CHOICE%"=="3" goto STEP3
if "%MENU_CHOICE%"=="4" goto STEP4
if "%MENU_CHOICE%"=="5" exit
goto MAIN_MENU

:STEP1
cls
echo ===================================================
echo STEP 1: Set PostgreSQL Password
echo ===================================================
echo.
echo First, we need to set a password for PostgreSQL.
echo.
echo What is the path to your PostgreSQL installation?
echo (Press Enter to use the default: C:\Program Files\PostgreSQL\15)
echo.
set PG_PATH=C:\Program Files\PostgreSQL\15
set /p CUSTOM_PATH="> "
if not "%CUSTOM_PATH%"=="" set PG_PATH=%CUSTOM_PATH%

echo.
echo Using PostgreSQL path: %PG_PATH%
echo.
echo 1. Open a new Command Prompt window as Administrator
echo    (Right-click on Command Prompt and select "Run as administrator")
echo.
echo 2. Type this command and press Enter:
echo    "%PG_PATH%\bin\psql.exe" -U postgres
echo.
echo 3. If it connects without asking for a password, type this command:
echo    ALTER USER postgres WITH PASSWORD 'zervi2025';
echo.
echo 4. Type \q and press Enter to exit
echo.
echo Have you completed these steps? (Y/N)
set /p STEP1_DONE="> "
if /i "%STEP1_DONE%" NEQ "Y" goto STEP1
goto MAIN_MENU

:STEP2
cls
echo ===================================================
echo STEP 2: Create Database
echo ===================================================
echo.
echo Now we'll create the database.
echo.
echo What is the path to your PostgreSQL installation?
echo (Press Enter to use the default: %PG_PATH%)
echo.
set /p CUSTOM_PATH="> "
if not "%CUSTOM_PATH%"=="" set PG_PATH=%CUSTOM_PATH%

echo.
echo Using PostgreSQL path: %PG_PATH%
echo.
echo 1. Open a new Command Prompt window as Administrator
echo.
echo 2. Type this command and press Enter:
echo    "%PG_PATH%\bin\psql.exe" -U postgres
echo.
echo 3. When prompted for password, enter: zervi2025
echo.
echo 4. Type this command and press Enter:
echo    CREATE DATABASE zervi_mrp;
echo.
echo 5. Type \q and press Enter to exit
echo.
echo Have you completed these steps? (Y/N)
set /p STEP2_DONE="> "
if /i "%STEP2_DONE%" NEQ "Y" goto STEP2
goto MAIN_MENU

:STEP3
cls
echo ===================================================
echo STEP 3: Test Database Connection
echo ===================================================
echo.
echo Let's test if the database connection works.
echo.
echo First, we need to update the connection settings in the test file.
echo.
echo What is your PostgreSQL password? (default: zervi2025)
set PG_PASSWORD=zervi2025
set /p CUSTOM_PASSWORD="> "
if not "%CUSTOM_PASSWORD%"=="" set PG_PASSWORD=%CUSTOM_PASSWORD%

echo.
echo Updating connection settings...
echo.

cd src\backend
echo const { Client } = require('pg'); > test-connection-temp.js
echo. >> test-connection-temp.js
echo async function testConnection() { >> test-connection-temp.js
echo   console.log('Testing PostgreSQL connection...'); >> test-connection-temp.js
echo   const client = new Client({ >> test-connection-temp.js
echo     host: 'localhost', >> test-connection-temp.js
echo     port: 5432, >> test-connection-temp.js
echo     database: 'zervi_mrp', >> test-connection-temp.js
echo     user: 'postgres', >> test-connection-temp.js
echo     password: '%PG_PASSWORD%' >> test-connection-temp.js
echo   }); >> test-connection-temp.js
echo. >> test-connection-temp.js
echo   try { >> test-connection-temp.js
echo     await client.connect(); >> test-connection-temp.js
echo     console.log('SUCCESS: Connected to database!'); >> test-connection-temp.js
echo     await client.end(); >> test-connection-temp.js
echo     return true; >> test-connection-temp.js
echo   } catch (err) { >> test-connection-temp.js
echo     console.error('FAILED: Connection failed:', err.message); >> test-connection-temp.js
echo     return false; >> test-connection-temp.js
echo   } >> test-connection-temp.js
echo } >> test-connection-temp.js
echo. >> test-connection-temp.js
echo testConnection().catch(err =^> { >> test-connection-temp.js
echo   console.error('Unhandled error:', err); >> test-connection-temp.js
echo }); >> test-connection-temp.js

echo Running connection test...
node test-connection-temp.js

echo.
echo Did you see "SUCCESS: Connected to database!" message? (Y/N)
set /p STEP3_DONE="> "
if /i "%STEP3_DONE%" NEQ "Y" (
    echo.
    echo Connection failed. Let's try to fix it:
    echo.
    echo 1. Make sure PostgreSQL service is running
    echo    (Open Services app, find PostgreSQL service, make sure it's started)
    echo.
    echo 2. Verify you set the password correctly in Step 1
    echo.
    echo 3. Verify you created the database in Step 2
    echo.
    pause
    goto STEP3
)
goto MAIN_MENU

:STEP4
cls
echo ===================================================
echo STEP 4: Run Application Setup
echo ===================================================
echo.
echo Now we'll set up and start the application.
echo.
echo First, we need to update the connection settings in the application.
echo.
echo Updating connection settings...

cd ..\..
echo // Updated database connection > src\backend\updated-connection.js
echo const dbConfig = { >> src\backend\updated-connection.js
echo   host: 'localhost', >> src\backend\updated-connection.js
echo   port: 5432, >> src\backend\updated-connection.js
echo   database: 'zervi_mrp', >> src\backend\updated-connection.js
echo   user: 'postgres', >> src\backend\updated-connection.js
echo   password: '%PG_PASSWORD%' >> src\backend\updated-connection.js
echo }; >> src\backend\updated-connection.js
echo module.exports = dbConfig; >> src\backend\updated-connection.js

echo.
echo Press any key to run the setup script...
pause > nul

echo Running setup script...
powershell -ExecutionPolicy Bypass -File .\setup-dev-environment.ps1

echo.
echo ===================================================
echo SETUP COMPLETE!
echo ===================================================
echo.
echo If everything went well, the application should be running at:
echo http://localhost:4000
echo.
echo You can now view the GitHub changes through the application.
echo.
pause
goto MAIN_MENU