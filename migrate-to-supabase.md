# 🚀 **Migration Guide: SQLite → Supabase**

## 📋 **Overview**
This guide will help you migrate your MECE project from SQLite to Supabase, solving all deployment issues and providing a scalable, cloud-based database solution.

## 🔧 **Step 1: Set Up Supabase Project**

### **1.1 Create Supabase Account**
1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up/Login with GitHub**
3. **Click "New Project"**

### **1.2 Create New Project**
1. **Choose your organization**
2. **Project name:** `mece-website`
3. **Database password:** Create a strong password
4. **Region:** Choose closest to your users
5. **Click "Create new project"**

### **1.3 Get Your Credentials**
1. **Wait for project setup (2-3 minutes)**
2. **Go to Settings → API**
3. **Copy these values:**
   - **Project URL** (e.g., `https://abcdefghijklmnop.supabase.co`)
   - **Anon Key** (public key)
   - **Service Role Key** (private key - keep secret!)

## 🗄️ **Step 2: Set Up Database Schema**

### **2.1 Run SQL Schema**
1. **Go to SQL Editor in Supabase**
2. **Copy the contents of `supabase-schema.sql`**
3. **Paste and run the entire script**
4. **Verify all tables are created**

### **2.2 Verify Tables Created**
You should see these tables:
- ✅ `users`
- ✅ `submissions`
- ✅ `payments`
- ✅ `paystack_settings`
- ✅ `social_media_settings`
- ✅ `app_settings`

## 🔑 **Step 3: Update Environment Variables**

### **3.1 Create `.env` File**
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Server Configuration
PORT=5001
NODE_ENV=production
```

### **3.2 Update Frontend Environment**
1. **Copy `.env` to your project root**
2. **Replace placeholder values with your actual Supabase credentials**

## 🚀 **Step 4: Test Locally**

### **4.1 Install Dependencies**
```bash
npm install
```

### **4.2 Start Server**
```bash
npm run server
```

### **4.3 Test Endpoints**
1. **Health check:** `http://localhost:5001/api/health`
2. **Database test:** `http://localhost:5001/api/test-db`
3. **Registration:** `POST http://localhost:5001/api/auth/register`

## 📦 **Step 5: Deploy to cPanel**

### **5.1 Build Project**
```bash
npm run build
```

### **5.2 Prepare for Upload**
1. **Create `mece-deployment` folder**
2. **Copy these files/folders:**
   - `dist/` (built React app)
   - `server/` (server files)
   - `package-supabase.json` → rename to `package.json`
   - `.env` (with Supabase credentials)
   - `.htaccess`

### **5.3 Upload to cPanel**
1. **Use File Manager to upload `mece-deployment` folder**
2. **Extract contents to your domain directory**

### **5.4 Configure Node.js App**
1. **Go to cPanel → Node.js Apps**
2. **Create New Application:**
   - **Application Root:** `/home/username/public_html` (or your actual path)
   - **Application URL:** `yourdomain.com`
   - **Application Startup File:** `server/server-supabase.js`
   - **Node.js Version:** 18.x or higher
   - **Environment Mode:** Production
   - **Install Command:** `npm install`
   - **Build Command:** (leave empty)
   - **Run Command:** `npm start`

### **5.5 Start Application**
1. **Click "Create"**
2. **Wait for npm install to complete**
3. **Click "Run" button**

## 🔍 **Step 6: Verify Deployment**

### **6.1 Check Server Status**
- **Visit:** `yourdomain.com/api/health`
- **Expected:** `{"status":"OK","database":"Supabase"}`

### **6.2 Test Database Connection**
- **Visit:** `yourdomain.com/api/test-db`
- **Expected:** `{"message":"Supabase connection successful"}`

### **6.3 Test Frontend**
- **Visit:** `yourdomain.com`
- **Expected:** MECE website loads correctly

## 🎯 **Step 7: Create Admin User**

### **7.1 First User Registration**
1. **Visit your website**
2. **Register a new user account**
3. **Note the email and password**

### **7.2 Make User Admin**
1. **Go to Supabase Dashboard → Table Editor**
2. **Select `users` table**
3. **Find your user record**
4. **Set `is_admin` to `true`**
5. **Save changes**

### **7.3 Test Admin Access**
1. **Login with your account**
2. **You should see admin dashboard**
3. **Configure Paystack settings**

## ⚙️ **Step 8: Configure Paystack**

### **8.1 Get Paystack Keys**
1. **Go to [paystack.com](https://paystack.com)**
2. **Login to your account**
3. **Go to Settings → API Keys**
4. **Copy Public Key and Secret Key**

### **8.2 Set Keys in Admin Dashboard**
1. **Login as admin**
2. **Go to Admin → Paystack Integration**
3. **Enter your Paystack keys**
4. **Click "Save Configuration"**
5. **Test connection**

## 🔄 **Step 9: Data Migration (Optional)**

### **9.1 Export SQLite Data**
If you have existing data in SQLite:
1. **Use SQLite Browser or command line**
2. **Export data as SQL or CSV**
3. **Manually import to Supabase tables**

### **9.2 Import to Supabase**
1. **Go to Supabase → Table Editor**
2. **Select appropriate table**
3. **Use "Insert Row" or bulk import**

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **1. "Missing Supabase environment variables"**
- **Solution:** Check `.env` file exists and has correct values
- **Verify:** All three Supabase variables are set

#### **2. "Database connection failed"**
- **Solution:** Check Supabase project is active
- **Verify:** Service role key is correct

#### **3. "Table doesn't exist"**
- **Solution:** Run `supabase-schema.sql` again
- **Verify:** All tables are created in Supabase

#### **4. "CORS error"**
- **Solution:** Check server is running
- **Verify:** Frontend and backend URLs match

#### **5. "JWT verification failed"**
- **Solution:** Check JWT_SECRET is set
- **Verify:** Same secret on frontend and backend

## ✅ **Success Checklist**

- [ ] Supabase project created
- [ ] Database schema imported
- [ ] Environment variables configured
- [ ] Local testing successful
- [ ] Project deployed to cPanel
- [ ] Node.js app running
- [ ] Health check endpoint working
- [ ] Database connection successful
- [ ] Frontend loading correctly
- [ ] Admin user created
- [ ] Paystack configured
- [ ] Payment testing successful

## 🎉 **Benefits of Migration**

### **Before (SQLite):**
- ❌ File-based database
- ❌ Deployment issues
- ❌ No scalability
- ❌ Manual backups
- ❌ Limited concurrent users

### **After (Supabase):**
- ✅ Cloud-hosted database
- ✅ Easy deployment
- ✅ Auto-scaling
- ✅ Automatic backups
- ✅ Unlimited concurrent users
- ✅ Real-time subscriptions
- ✅ Built-in authentication
- ✅ Row-level security

## 📞 **Support**

If you encounter issues:
1. **Check Supabase logs in dashboard**
2. **Verify environment variables**
3. **Test endpoints individually**
4. **Check cPanel error logs**

## 🚀 **Next Steps**

After successful migration:
1. **Set up monitoring**
2. **Configure backups**
3. **Set up staging environment**
4. **Implement real-time features**
5. **Add analytics**

---

**🎯 Goal:** Deploy MECE website with Supabase database to cPanel successfully!

**⏱️ Estimated Time:** 30-60 minutes

**🔄 Status:** Ready to migrate!
