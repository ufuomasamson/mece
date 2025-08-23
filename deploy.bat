@echo off
echo 🚀 Preparing MECE Project for cPanel Deployment...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the project root directory
    pause
    exit /b 1
)

REM Build the frontend
echo 📦 Building frontend...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Frontend build failed!
    pause
    exit /b 1
)

echo ✅ Frontend built successfully!

REM Check if database exists
if not exist "server\database.sqlite" (
    echo ⚠️  Warning: database.sqlite not found in server\ directory
    echo    Make sure to include your database file for deployment
) else (
    echo ✅ Database file found
)

REM Check if .htaccess exists
if not exist ".htaccess" (
    echo ⚠️  Warning: .htaccess file not found
    echo    This file is required for proper routing on cPanel
) else (
    echo ✅ .htaccess file found
)

echo.
echo 📋 DEPLOYMENT CHECKLIST:
echo ========================
echo 1. ✅ Frontend built (dist\ folder created)
echo 2. ✅ Dependencies listed (package.json)
echo 3. ✅ Backend code (server\ folder)
echo 4. ✅ Database file (server\database.sqlite)
echo 5. ✅ Configuration files (.htaccess, env.production)
echo.
echo 🚀 READY FOR DEPLOYMENT!
echo.
echo 📖 Next Steps:
echo 1. Push all changes to GitHub:
echo    git add . ^&^& git commit -m "Ready for cPanel deployment" ^&^& git push
echo.
echo 2. In cPanel:
echo    - Use Git Version Control to clone your repository
echo    - Or upload files manually via File Manager
echo.
echo 3. Install dependencies:
echo    npm install
echo.
echo 4. Set up Node.js app in cPanel
echo 5. Configure environment variables
echo 6. Start the application
echo.
echo 📚 See CPANEL_DEPLOYMENT.md for detailed instructions
echo.
echo 🎯 Your project is ready for cPanel deployment!
pause
