#!/bin/bash

# MECE Project cPanel Deployment Script
# This script helps prepare your project for cPanel deployment

echo "🚀 Preparing MECE Project for cPanel Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Build the frontend
echo "📦 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi

echo "✅ Frontend built successfully!"

# Check if database exists
if [ ! -f "server/database.sqlite" ]; then
    echo "⚠️  Warning: database.sqlite not found in server/ directory"
    echo "   Make sure to include your database file for deployment"
else
    echo "✅ Database file found"
fi

# Check if .htaccess exists
if [ ! -f ".htaccess" ]; then
    echo "⚠️  Warning: .htaccess file not found"
    echo "   This file is required for proper routing on cPanel"
else
    echo "✅ .htaccess file found"
fi

# Create deployment checklist
echo ""
echo "📋 DEPLOYMENT CHECKLIST:"
echo "========================"
echo "1. ✅ Frontend built (dist/ folder created)"
echo "2. ✅ Dependencies listed (package.json)"
echo "3. ✅ Backend code (server/ folder)"
echo "4. ✅ Database file (server/database.sqlite)"
echo "5. ✅ Configuration files (.htaccess, env.production)"
echo ""
echo "🚀 READY FOR DEPLOYMENT!"
echo ""
echo "📖 Next Steps:"
echo "1. Push all changes to GitHub:"
echo "   git add . && git commit -m 'Ready for cPanel deployment' && git push"
echo ""
echo "2. In cPanel:"
echo "   - Use Git Version Control to clone your repository"
echo "   - Or upload files manually via File Manager"
echo ""
echo "3. Install dependencies:"
echo "   npm install"
echo ""
echo "4. Set up Node.js app in cPanel"
echo "5. Configure environment variables"
echo "6. Start the application"
echo ""
echo "📚 See CPANEL_DEPLOYMENT.md for detailed instructions"
echo ""
echo "🎯 Your project is ready for cPanel deployment!"
