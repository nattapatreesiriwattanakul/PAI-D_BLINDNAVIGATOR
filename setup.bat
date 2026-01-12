@echo off
echo ========================================
echo Pai Dee (ไปดี) - Setup Script
echo Indoor Navigation for Blind People
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js found: 
node --version
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
)

echo [OK] npm found:
npm --version
echo.

REM Check if PostgreSQL is installed
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] PostgreSQL command line tools not found in PATH
    echo Please ensure PostgreSQL is installed and accessible
    echo Download from: https://www.postgresql.org/download/windows/
    echo.
)

echo ========================================
echo Step 1: Installing Backend Dependencies
echo ========================================
cd backend
if not exist "package.json" (
    echo [ERROR] backend/package.json not found!
    cd ..
    pause
    exit /b 1
)

echo Installing backend packages...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed
cd ..
echo.

echo ========================================
echo Step 2: Installing Mobile Dependencies
echo ========================================
cd mobile
if not exist "package.json" (
    echo [ERROR] mobile/package.json not found!
    cd ..
    pause
    exit /b 1
)

echo Installing mobile packages (this may take a few minutes)...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install mobile dependencies
    cd ..
    pause
    exit /b 1
)
echo [OK] Mobile dependencies installed
cd ..
echo.

echo ========================================
echo Step 3: Setting up Environment Files
echo ========================================
cd backend
if not exist ".env" (
    if exist ".env.example" (
        echo Creating .env file from .env.example...
        copy .env.example .env >nul
        echo [OK] .env file created
        echo [IMPORTANT] Please edit backend/.env with your database credentials
        echo.
    ) else (
        echo [WARNING] .env.example not found
    )
) else (
    echo [OK] .env file already exists
)
cd ..
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo.
echo 1. Configure Database:
echo    - Open PostgreSQL and create database: pai_dee_db
echo    - Run: psql -U postgres -d pai_dee_db -f backend/src/database/schema.sql
echo    - Run: psql -U postgres -d pai_dee_db -f backend/src/database/sample-data.sql
echo.
echo 2. Edit backend/.env file:
echo    - Set DB_PASSWORD to your PostgreSQL password
echo    - Update other settings as needed
echo.
echo 3. Start Backend Server:
echo    cd backend
echo    npm run dev
echo.
echo 4. Start Mobile App (in new terminal):
echo    cd mobile
echo    npm start
echo.
echo 5. Open Admin Panel:
echo    Open backend/admin-panel.html in your web browser
echo.
echo For detailed instructions, see SETUP.md
echo.
pause
