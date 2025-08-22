# cPanel Deployment Guide

This guide will help you deploy your MECE application to cPanel hosting.

## Prerequisites

- cPanel hosting account with Node.js support
- SSH access (recommended)
- Domain name pointing to your hosting

## Step 1: Prepare Your Application

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Ensure your server is configured for production:**
   - The server will use SQLite database (already configured)
   - Update environment variables in production

## Step 2: Upload Files to cPanel

### Option A: Using cPanel File Manager
1. Log into your cPanel
2. Open File Manager
3. Navigate to `public_html` or your desired directory
4. Upload the contents of your `dist` folder (built React app)
5. Upload the `.htaccess` file to the same directory

### Option B: Using FTP/SFTP
1. Use an FTP client (FileZilla, WinSCP, etc.)
2. Connect to your hosting server
3. Upload the contents of `dist` folder to `public_html`
4. Upload the `.htaccess` file

## Step 3: Set Up Node.js Application

1. **In cPanel, go to "Setup Node.js App"**
2. **Create a new Node.js application:**
   - App name: `mece-backend`
   - Node.js version: Select the latest LTS version
   - App mode: Production
   - App root: `/home/username/mece-backend` (create this directory)
   - App URL: `yourdomain.com` (or subdomain)
   - App startup file: `server/index.js`
   - Passenger port: Leave default or set to 5001

3. **Upload backend files:**
   - Upload the entire `server` folder to the Node.js app directory
   - Upload `package.json` and `package-lock.json`
   - Upload `.env` file (create one with production values)

## Step 4: Configure Environment Variables

Create a `.env` file in your Node.js app directory:

```env
NODE_ENV=production
PORT=5001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Step 5: Install Dependencies and Start

1. **SSH into your server:**
   ```bash
   ssh username@yourdomain.com
   ```

2. **Navigate to your Node.js app directory:**
   ```bash
   cd ~/mece-backend
   ```

3. **Install dependencies:**
   ```bash
   npm install --production
   ```

4. **Start the application:**
   ```bash
   node server/index.js
   ```

## Step 6: Configure Domain and SSL

1. **Point your domain to your hosting**
2. **Set up SSL certificate** (Let's Encrypt is free)
3. **Update DNS records** if needed

## Step 7: Test Your Application

1. Visit your domain to test the frontend
2. Test API endpoints at `yourdomain.com/api/...`
3. Check that the SQLite database is working

## Troubleshooting

### Common Issues:

1. **500 Internal Server Error:**
   - Check Node.js app logs in cPanel
   - Verify file permissions
   - Check that all dependencies are installed

2. **Database Connection Issues:**
   - Ensure SQLite file has proper permissions
   - Check file paths in the server code

3. **Frontend Routing Issues:**
   - Verify `.htaccess` file is uploaded
   - Check that mod_rewrite is enabled

4. **API Not Working:**
   - Verify Node.js app is running
   - Check port configuration
   - Test API endpoints directly

### File Permissions:
```bash
chmod 755 public_html
chmod 644 public_html/.htaccess
chmod 755 mece-backend
chmod 644 mece-backend/server/database.sqlite
```

## Maintenance

1. **Regular backups** of your SQLite database
2. **Monitor logs** for errors
3. **Update dependencies** regularly
4. **Monitor disk space** usage

## Security Notes

1. **Change default JWT secret** in production
2. **Use strong passwords** for admin accounts
3. **Enable SSL/HTTPS** for all traffic
4. **Regular security updates** for your hosting environment

## Support

If you encounter issues:
1. Check cPanel error logs
2. Review Node.js application logs
3. Test locally first
4. Contact your hosting provider for server-level issues
