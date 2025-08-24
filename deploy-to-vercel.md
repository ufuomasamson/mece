# 🚀 **Deploy MECE Website to Vercel with Supabase**

## 📋 **Overview**
This guide will help you deploy your MECE project to Vercel through GitHub, using Supabase as the cloud database. This approach eliminates all deployment issues and provides a scalable, serverless solution.

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

## 🔑 **Step 3: Update Project Files**

### **3.1 Replace Package.json**
```bash
# Rename the Vercel package.json
mv package-vercel.json package.json
```

### **3.2 Update Environment Variables**
1. **Copy `env.vercel.example` to `.env.local`**
2. **Update with your actual Supabase credentials**

### **3.3 Verify File Structure**
```
mece/
├── api/
│   └── index.js          # Vercel API routes
├── src/                  # React components
├── dist/                 # Built React app
├── vercel.json           # Vercel configuration
├── package.json          # Vercel dependencies
└── .env.local           # Environment variables
```

## 🚀 **Step 4: Deploy to GitHub**

### **4.1 Initialize Git (if not already done)**
```bash
git init
git add .
git commit -m "Initial commit: MECE website with Supabase and Vercel"
```

### **4.2 Create GitHub Repository**
1. **Go to [github.com](https://github.com)**
2. **Click "New repository"**
3. **Name:** `mece-website`
4. **Make it public or private**
5. **Don't initialize with README**

### **4.3 Push to GitHub**
```bash
git remote add origin https://github.com/yourusername/mece-website.git
git branch -M main
git push -u origin main
```

## 🌐 **Step 5: Deploy to Vercel**

### **5.1 Connect Vercel to GitHub**
1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login with GitHub**
3. **Click "New Project"**
4. **Import your GitHub repository**

### **5.2 Configure Project**
1. **Project Name:** `mece-website` (or your preference)
2. **Framework Preset:** Other
3. **Root Directory:** `./`
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. **Install Command:** `npm install`

### **5.3 Set Environment Variables**
Click "Environment Variables" and add:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
JWT_SECRET=your_super_secret_jwt_key_here
```

### **5.4 Deploy**
1. **Click "Deploy"**
2. **Wait for build to complete**
3. **Your site will be live at:** `https://your-project.vercel.app`

## 🔍 **Step 6: Verify Deployment**

### **6.1 Check Frontend**
- **Visit your Vercel URL**
- **Expected:** MECE website loads correctly

### **6.2 Test API Endpoints**
- **Health check:** `https://your-project.vercel.app/api/health`
- **Expected:** `{"status":"OK","database":"Supabase","platform":"Vercel"}`

### **6.3 Test Database Connection**
- **Database test:** `https://your-project.vercel.app/api/test-db`
- **Expected:** `{"message":"Supabase connection successful"}`

## 🎯 **Step 7: Create Admin User**

### **7.1 First User Registration**
1. **Visit your Vercel site**
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

## 🔄 **Step 9: Set Up Auto-Deployment**

### **9.1 Automatic Deployments**
- **Every push to `main` branch triggers automatic deployment**
- **Vercel automatically builds and deploys your changes**
- **Preview deployments for pull requests**

### **9.2 Custom Domain (Optional)**
1. **Go to Vercel Dashboard → Domains**
2. **Add your custom domain**
3. **Update DNS records as instructed**

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **1. "Build failed"**
- **Solution:** Check build logs in Vercel dashboard
- **Verify:** All dependencies are in `package.json`

#### **2. "Environment variables missing"**
- **Solution:** Check Vercel environment variables
- **Verify:** All Supabase variables are set

#### **3. "API routes not working"**
- **Solution:** Check `vercel.json` configuration
- **Verify:** API routes are properly configured

#### **4. "Database connection failed"**
- **Solution:** Check Supabase project is active
- **Verify:** Service role key is correct

#### **5. "CORS error"**
- **Solution:** Check API routes are working
- **Verify:** Frontend and backend URLs match

## ✅ **Success Checklist**

- [ ] Supabase project created
- [ ] Database schema imported
- [ ] Project files updated for Vercel
- [ ] GitHub repository created and pushed
- [ ] Vercel project connected to GitHub
- [ ] Environment variables configured
- [ ] Deployment successful
- [ ] Frontend loading correctly
- [ ] API endpoints working
- [ ] Database connection successful
- [ ] Admin user created
- [ ] Paystack configured
- [ ] Payment testing successful

## 🎉 **Benefits of This Setup**

### **Before (SQLite + cPanel):**
- ❌ File-based database
- ❌ Deployment issues
- ❌ Manual server management
- ❌ Limited scalability

### **After (Supabase + Vercel):**
- ✅ Cloud-hosted database
- ✅ Automatic deployments
- ✅ Serverless architecture
- ✅ Unlimited scalability
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Zero maintenance

## 📞 **Support**

If you encounter issues:
1. **Check Vercel build logs**
2. **Verify environment variables**
3. **Check Supabase dashboard**
4. **Review GitHub repository**

## 🚀 **Next Steps**

After successful deployment:
1. **Set up monitoring**
2. **Configure custom domain**
3. **Set up staging environment**
4. **Implement CI/CD pipeline**
5. **Add analytics**

---

**🎯 Goal:** Deploy MECE website with Supabase database to Vercel successfully!

**⏱️ Estimated Time:** 20-40 minutes

**🔄 Status:** Ready to deploy to Vercel!

## 📋 **Quick Commands**

```bash
# Build project
npm run build

# Deploy to GitHub
git add .
git commit -m "Update for Vercel deployment"
git push

# Check Vercel deployment
# Visit your Vercel dashboard
```
