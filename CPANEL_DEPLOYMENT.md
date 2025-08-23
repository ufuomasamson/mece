# cPanel Deployment Guide for MECE Project

## Overview
This guide will help you deploy your MECE project from GitHub to cPanel, including the SQLite database and all project files.

## Prerequisites
- cPanel hosting account
- Git access enabled on your hosting
- Node.js support (Node.js 18+ recommended)
- SSH access (optional but recommended)

## Method 1: Deploy from GitHub (Recommended)

### Step 1: Prepare Your GitHub Repository
1. **Push all changes to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for cPanel deployment"
   git push origin main
   ```

2. **Ensure these files are in your repository:**
   - `package.json` and `package-lock.json`
   - `server/` folder (Node.js backend)
   - `src/` folder (React frontend)
   - `public/` folder (static assets)
   - `.htaccess` file
   - `server/database.sqlite` (your SQLite database)

### Step 2: cPanel Setup

#### Option A: Using cPanel Git Version Control
1. **Login to cPanel**
2. **Find "Git Version Control"** in the Files section
3. **Click "Create"**
4. **Repository URL:** Enter your GitHub repository URL
   - Example: `https://github.com/yourusername/mece.git`
5. **Repository Branch:** `main` or `master`
6. **Directory:** Leave as default (usually `public_html` or your domain folder)
7. **Click "Create"**

#### Option B: Using SSH (Advanced)
1. **Enable SSH in cPanel** (if not already enabled)
2. **Connect via SSH:**
   ```bash
   ssh username@yourdomain.com
   ```
3. **Navigate to your domain directory:**
   ```bash
   cd public_html
   ```
4. **Clone your repository:**
   ```bash
   git clone https://github.com/yourusername/mece.git .
   ```

### Step 3: Install Dependencies
1. **In cPanel Terminal or SSH:**
   ```bash
   cd public_html
   npm install
   ```

### Step 4: Build the Frontend
```bash
npm run build
```

### Step 5: Configure Environment Variables
1. **Create `.env` file in your domain root:**
   ```env
   PORT=5001
   JWT_SECRET=your-secret-key-here
   NODE_ENV=production
   ```

### Step 6: Set Up Node.js App
1. **In cPanel, find "Node.js"**
2. **Click "Create Application"**
3. **Application Root:** `/public_html`
4. **Application URL:** Your domain
5. **Application Startup File:** `server/index.js`
6. **Node.js Version:** 18.x or higher
7. **Environment Mode:** Production
8. **Click "Create"**

### Step 7: Configure .htaccess
Ensure your `.htaccess` file is in the root directory:

```apache
RewriteEngine On

# Handle React routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [QSA,L]

# Proxy API requests to Node.js backend
RewriteCond %{REQUEST_URI} ^/api/(.*)$
RewriteRule ^/api/(.*)$ http://localhost:5001/api/$1 [P,L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
```

### Step 8: Start the Application
1. **In cPanel Node.js section:**
2. **Click "Restart"** on your application
3. **Check the logs** for any errors

## Method 2: Manual Upload (Alternative)

### Step 1: Prepare Files
1. **Build your project locally:**
   ```bash
   npm run build
   ```

2. **Create deployment package:**
   - `dist/` folder (built React app)
   - `server/` folder (Node.js backend)
   - `package.json` and `package-lock.json`
   - `.htaccess`
   - `server/database.sqlite`

### Step 2: Upload to cPanel
1. **Use File Manager** or **FTP**
2. **Upload all files** to your domain directory
3. **Install dependencies** via Terminal
4. **Configure Node.js app** as in Method 1

## Database Considerations

### SQLite Database
- **Location:** `server/database.sqlite`
- **Permissions:** Ensure the file is readable/writable by the web server
- **Backup:** Always backup your database before deployment

### Database Permissions
```bash
chmod 644 server/database.sqlite
chmod 755 server/
```

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
- **Solution:** Change the port in your `.env` file
- **Update:** `.htaccess` proxy rule accordingly

#### 2. Database Permission Denied
- **Solution:** Check file permissions
- **Command:** `chmod 644 server/database.sqlite`

#### 3. Node.js App Not Starting
- **Check:** Application logs in cPanel
- **Verify:** Startup file path is correct
- **Ensure:** All dependencies are installed

#### 4. API Routes Not Working
- **Check:** `.htaccess` configuration
- **Verify:** Node.js app is running
- **Test:** Direct access to Node.js port

### Logs and Debugging
1. **Check Node.js logs** in cPanel
2. **Check error logs** in cPanel
3. **Test API endpoints** directly
4. **Verify file permissions**

## Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] API endpoints respond
- [ ] Database connections work
- [ ] File uploads function
- [ ] Authentication works
- [ ] Payment system functions
- [ ] Admin dashboard accessible
- [ ] Social media links work
- [ ] QR code generation works

## Security Considerations

1. **Environment Variables:** Never commit sensitive data
2. **Database:** Secure your SQLite file
3. **HTTPS:** Enable SSL certificate
4. **Firewall:** Configure server security
5. **Updates:** Keep dependencies updated

## Maintenance

### Regular Tasks
1. **Backup database** weekly
2. **Update dependencies** monthly
3. **Monitor logs** for errors
4. **Check disk space**
5. **Update SSL certificates**

### Backup Strategy
- **Database:** `server/database.sqlite`
- **Code:** GitHub repository
- **Uploads:** `public/uploads/` folder
- **Configuration:** `.env` file

## Support

If you encounter issues:
1. **Check cPanel error logs**
2. **Verify Node.js configuration**
3. **Test locally first**
4. **Contact hosting support** if needed

---

**Note:** This deployment method ensures your entire project, including the SQLite database, is deployed to cPanel. The database will be live and functional on your production server.
