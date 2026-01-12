#!/bin/bash

echo "========================================"
echo "Pai Dee (ไปดี) - Setup Script"
echo "Indoor Navigation for Blind People"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi

echo "[OK] Node.js found: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm is not installed!"
    exit 1
fi

echo "[OK] npm found: $(npm --version)"
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "[WARNING] PostgreSQL command line tools not found in PATH"
    echo "Please ensure PostgreSQL is installed and accessible"
    echo ""
fi

echo "========================================"
echo "Step 1: Installing Backend Dependencies"
echo "========================================"
cd backend
if [ ! -f "package.json" ]; then
    echo "[ERROR] backend/package.json not found!"
    cd ..
    exit 1
fi

echo "Installing backend packages..."
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install backend dependencies"
    cd ..
    exit 1
fi
echo "[OK] Backend dependencies installed"
cd ..
echo ""

echo "========================================"
echo "Step 2: Installing Mobile Dependencies"
echo "========================================"
cd mobile
if [ ! -f "package.json" ]; then
    echo "[ERROR] mobile/package.json not found!"
    cd ..
    exit 1
fi

echo "Installing mobile packages (this may take a few minutes)..."
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install mobile dependencies"
    cd ..
    exit 1
fi
echo "[OK] Mobile dependencies installed"
cd ..
echo ""

echo "========================================"
echo "Step 3: Setting up Environment Files"
echo "========================================"
cd backend
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "Creating .env file from .env.example..."
        cp .env.example .env
        echo "[OK] .env file created"
        echo "[IMPORTANT] Please edit backend/.env with your database credentials"
        echo ""
    else
        echo "[WARNING] .env.example not found"
    fi
else
    echo "[OK] .env file already exists"
fi
cd ..
echo ""

echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Next Steps:"
echo ""
echo "1. Configure Database:"
echo "   - Create database: createdb pai_dee_db"
echo "   - Run: psql -d pai_dee_db -f backend/src/database/schema.sql"
echo "   - Run: psql -d pai_dee_db -f backend/src/database/sample-data.sql"
echo ""
echo "2. Edit backend/.env file:"
echo "   - Set DB_PASSWORD to your PostgreSQL password"
echo "   - Update other settings as needed"
echo ""
echo "3. Start Backend Server:"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "4. Start Mobile App (in new terminal):"
echo "   cd mobile"
echo "   npm start"
echo ""
echo "5. Open Admin Panel:"
echo "   Open backend/admin-panel.html in your web browser"
echo ""
echo "For detailed instructions, see SETUP.md"
echo ""
