# MECE Website - Admin Dashboard with SQLite & Payment Integration

A modern React-based website with a comprehensive admin dashboard, SQLite database, and Paystack payment integration.

## 🚀 Features

- **Modern React 18 + TypeScript** frontend
- **SQLite database** for data persistence
- **Express.js backend** API server
- **Paystack payment integration** for form submissions
- **Admin dashboard** for content management
- **Blog management system**
- **Form submission handling** with payment processing
- **Responsive design** with Tailwind CSS
- **Real-time updates** and notifications

## 🗄️ Database Structure

### Tables

1. **users** - User accounts and authentication
2. **participate_submissions** - Competition participation forms
3. **contact_submissions** - Contact form messages
4. **payments** - Payment records and Stripe integration
5. **blog_posts** - Blog content management
6. **website_content** - Dynamic website content

### Key Features

- **Foreign key relationships** for data integrity
- **Payment status tracking** for submissions
- **Paystack transaction integration** for payment processing
- **Admin notes and responses** for submissions
- **Content versioning** with timestamps

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Paystack account (for payments)

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Environment Configuration

Copy `env.example` to `.env` and configure:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_PATH=./server/database.sqlite

# Paystack Configuration
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key_here
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Payment Configuration
DEFAULT_PAYMENT_AMOUNT=50.00
DEFAULT_CURRENCY=USD
```

### 3. Paystack Setup

1. Create a Paystack account at [paystack.com](https://paystack.com)
2. Get your API keys from the Paystack Dashboard
3. Update the `.env` file with your keys
4. Test with Paystack's test mode first

### 4. Development Mode

```bash
# Start both frontend and backend
npm run dev:full

# Or start separately:
npm run dev          # Frontend only
npm run server       # Backend only
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Admin Dashboard: http://localhost:5173/admin

## 🗂️ Project Structure

```
mece/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   └── ...
├── server/                 # Express backend
│   ├── index.js           # Main server file
│   ├── services/          # Business logic
│   └── database.sqlite    # SQLite database
├── dist/                   # Built frontend (after build)
└── package.json           # Dependencies and scripts
```

## 💳 Payment Integration

### How It Works

1. **User submits form** → Creates Stripe customer
2. **Payment intent created** → User redirected to payment
3. **Payment processed** → Stripe handles payment
4. **Webhook confirmation** → Database updated
5. **Admin notification** → Payment status tracked

### Payment Flow

```
Form Submission → Stripe Customer → Payment Intent → Payment Processing → Confirmation → Database Update
```

### Supported Payment Methods

- Credit/Debit Cards
- Digital Wallets (Apple Pay, Google Pay)
- Bank Transfers (ACH, SEPA)
- Local Payment Methods

## 🚀 Deployment

### cPanel Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload to cPanel:**
   - Upload `dist/` contents to `public_html/`
   - Upload `server/` folder to your domain root
   - Create `.htaccess` for SPA routing

3. **Configure environment:**
   - Set up `.env` file with production values
   - Configure Stripe live keys
   - Set `NODE_ENV=production`

4. **Start the server:**
   ```bash
   cd server
   npm install
   node index.js
   ```

### Environment Variables for Production

```bash
NODE_ENV=production
PORT=5000
STRIPE_SECRET_KEY=sk_live_your_live_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
JWT_SECRET=your_secure_jwt_secret
```

## 🔧 API Endpoints

### Submissions
- `GET /api/submissions/participate` - Get all submissions
- `POST /api/submissions/participate` - Create submission
- `PATCH /api/submissions/participate/:id` - Update submission
- `GET /api/submissions/contact` - Get contact messages
- `POST /api/submissions/contact` - Send message

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/:id` - Get payment details
- `GET /api/payments` - Get all payments

### Content Management
- `GET /api/content/:section` - Get website content
- `PUT /api/content/:section` - Update content
- `GET /api/blog` - Get blog posts
- `POST /api/blog` - Create blog post

## 🎯 Admin Dashboard Features

### Content Management
- Edit hero section content
- Update mission and services
- Modify about section
- Real-time content updates

### Blog Management
- Create new blog posts
- Edit existing posts
- Publish/unpublish posts
- Image and tag management

### Submissions Management
- View all form submissions
- Update submission status
- Add admin notes
- Track payment status
- Respond to contact messages

### Payment Tracking
- View all payments
- Track payment status
- Handle refunds
- Customer management

## 🔒 Security Features

- **Input validation** on all forms
- **SQL injection protection** with parameterized queries
- **CORS configuration** for API security
- **Environment variable protection**
- **Stripe webhook verification**
- **JWT authentication** (ready for implementation)

## 📱 Mobile Responsiveness

- **Responsive design** for all screen sizes
- **Touch-friendly** admin interface
- **Mobile-optimized** forms
- **Progressive Web App** ready

## 🚨 Troubleshooting

### Common Issues

1. **Database not created:**
   - Check server logs for errors
   - Ensure write permissions in server directory

2. **Paystack payments failing:**
   - Verify API keys in `.env`
   - Check Paystack dashboard for errors
   - Ensure API keys are configured in admin dashboard

3. **Port conflicts:**
   - Change `PORT` in `.env`
   - Check if port 5000 is available

4. **Build errors:**
   - Clear `node_modules` and reinstall
   - Use `--legacy-peer-deps` flag

### Logs and Debugging

```bash
# View server logs
npm run server

# Check database
sqlite3 server/database.sqlite ".tables"

# Test API endpoints
curl http://localhost:5000/api/health
```

## 🔄 Updates and Maintenance

### Regular Tasks

1. **Database backups:**
   ```bash
   cp server/database.sqlite backup_$(date +%Y%m%d).sqlite
   ```

2. **Log rotation:**
   - Monitor server logs
   - Archive old logs

3. **Security updates:**
   - Keep dependencies updated
   - Monitor Paystack security notices

### Monitoring

- **Server health:** `/api/health` endpoint
- **Database size:** Monitor `database.sqlite` file size
- **Payment success rate:** Paystack dashboard
- **Error logs:** Server console output

## 🚀 Deployment

### Quick Deployment (File Manager)
1. **Run deployment script:**
   ```bash
   # Windows
   deploy-filemanager.bat
   
   # Linux/Mac
   ./deploy-filemanager.sh
   ```

2. **Upload to cPanel:**
   - Use File Manager to upload `mece-deployment/` contents
   - Set up Node.js App in cPanel
   - Configure environment variables

3. **Start application:**
   - Run `npm install` in Node.js app settings
   - Restart the application

**📖 See `FILEMANAGER_DEPLOYMENT.md` for quick guide or `CPANEL_DEPLOYMENT.md` for detailed instructions.**

## 📞 Support

For technical support or questions:
- Check the troubleshooting section
- Review Paystack documentation
- Check server logs for errors
- Verify environment configuration

## 📄 License

This project is proprietary software. All rights reserved.

---

**Built with ❤️ using React, Express, SQLite, and Paystack**
