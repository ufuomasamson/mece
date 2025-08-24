const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, '../dist')));

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = async (req, res, next) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', req.user.userId)
      .single();

    if (error || !user || !user.is_admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MECE Server is running with Supabase',
    timestamp: new Date().toISOString(),
    port: PORT,
    database: 'Supabase'
  });
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      res.status(500).json({ error: 'Database connection failed', details: error.message });
    } else {
      res.json({ message: 'Supabase connection successful' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, full_name, phone, date_of_birth, gender, address, city, state, country, postal_code, occupation, company, education_level, field_of_study, graduation_year, skills, interests } = req.body;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${email},username.eq.${username}`)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email or username already exists' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert([{
        username,
        email,
        password_hash,
        full_name,
        phone,
        date_of_birth,
        gender,
        address,
        city,
        state,
        country,
        postal_code,
        occupation,
        company,
        education_level,
        field_of_study,
        graduation_year,
        skills,
        interests,
        is_admin: false,
        is_verified: false
      }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to create user', details: error.message });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin: user.is_admin },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        is_admin: user.is_admin
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin: user.is_admin },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        is_admin: user.is_admin
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Get user profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, email, full_name, phone, date_of_birth, gender, address, city, state, country, postal_code, occupation, company, education_level, field_of_study, graduation_year, skills, interests, profile_picture, is_admin, is_verified, created_at')
      .eq('id', req.user.userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile', details: error.message });
  }
});

// Update user profile
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { phone, date_of_birth, gender, address, city, state, country, postal_code, occupation, company, education_level, field_of_study, graduation_year, skills, interests, profile_picture } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .update({
        phone,
        date_of_birth,
        gender,
        address,
        city,
        state,
        country,
        postal_code,
        occupation,
        company,
        education_level,
        field_of_study,
        graduation_year,
        skills,
        interests,
        profile_picture
      })
      .eq('id', req.user.userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to update profile', details: error.message });
    }

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile', details: error.message });
  }
});

// Create submission
app.post('/api/submissions', authenticateToken, async (req, res) => {
  try {
    const { submission_type, title, description, content, file_path, file_name, file_size, file_type } = req.body;

    const { data: submission, error } = await supabase
      .from('submissions')
      .insert([{
        user_id: req.user.userId,
        submission_type,
        title,
        description,
        content,
        file_path,
        file_name,
        file_size,
        file_type,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to create submission', details: error.message });
    }

    res.status(201).json({ message: 'Submission created successfully', submission });
  } catch (error) {
    console.error('Create submission error:', error);
    res.status(500).json({ error: 'Failed to create submission', details: error.message });
  }
});

// Get user submissions
app.get('/api/submissions', authenticateToken, async (req, res) => {
  try {
    const { data: submissions, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('user_id', req.user.userId)
      .order('submitted_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to get submissions', details: error.message });
    }

    res.json({ submissions: submissions || [] });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ error: 'Failed to get submissions', details: error.message });
  }
});

// Get all submissions (admin only)
app.get('/api/admin/submissions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data: submissions, error } = await supabase
      .from('submissions')
      .select('*, users(full_name, email)')
      .order('submitted_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to get submissions', details: error.message });
    }

    res.json({ submissions: submissions || [] });
  } catch (error) {
    console.error('Get all submissions error:', error);
    res.status(500).json({ error: 'Failed to get submissions', details: error.message });
  }
});

// Update submission (admin only)
app.put('/api/admin/submissions/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, score, feedback } = req.body;

    const { data: submission, error } = await supabase
      .from('submissions')
      .update({
        status,
        score,
        feedback,
        reviewed_at: new Date().toISOString(),
        reviewed_by: req.user.userId
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to update submission', details: error.message });
    }

    res.json({ message: 'Submission updated successfully', submission });
  } catch (error) {
    console.error('Update submission error:', error);
    res.status(500).json({ error: 'Failed to update submission', details: error.message });
  }
});

// Delete submission (admin only)
app.delete('/api/admin/submissions/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: 'Failed to delete submission', details: error.message });
    }

    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    console.error('Delete submission error:', error);
    res.status(500).json({ error: 'Failed to delete submission', details: error.message });
  }
});

// Paystack payment initialization
app.post('/api/payments/initialize', authenticateToken, async (req, res) => {
  try {
    const { amount, email, callback_url } = req.body;

    // Get Paystack settings
    const { data: paystackSettings, error: settingsError } = await supabase
      .from('paystack_settings')
      .select('*')
      .limit(1)
      .single();

    if (settingsError || !paystackSettings || !paystackSettings.secret_key) {
      return res.status(500).json({ error: 'Paystack not configured' });
    }

    // Generate reference
    const reference = `MECE-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`.toUpperCase();

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert([{
        user_id: req.user.userId,
        reference,
        amount,
        currency: 'NGN',
        status: 'pending',
        description: 'Registration Fee'
      }])
      .select()
      .single();

    if (paymentError) {
      return res.status(500).json({ error: 'Failed to create payment record', details: paymentError.message });
    }

    // Initialize Paystack payment
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSettings.secret_key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        amount: amount * 100, // Convert to kobo
        reference,
        callback_url,
        metadata: {
          user_id: req.user.userId,
          payment_id: payment.id
        }
      })
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      return res.status(500).json({ error: 'Paystack initialization failed', details: paystackData.message });
    }

    // Update payment with Paystack data
    await supabase
      .from('payments')
      .update({
        paystack_transaction_id: paystackData.data.reference,
        paystack_authorization_url: paystackData.data.authorization_url,
        paystack_access_code: paystackData.data.access_code
      })
      .eq('id', payment.id);

    res.json({
      message: 'Payment initialized successfully',
      authorization_url: paystackData.data.authorization_url,
      reference: payment.reference
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({ error: 'Payment initialization failed', details: error.message });
  }
});

// Paystack payment verification
app.post('/api/payments/verify', authenticateToken, async (req, res) => {
  try {
    const { reference } = req.body;

    // Get payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('reference', reference)
      .eq('user_id', req.user.userId)
      .single();

    if (paymentError || !payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Get Paystack settings
    const { data: paystackSettings, error: settingsError } = await supabase
      .from('paystack_settings')
      .select('*')
      .limit(1)
      .single();

    if (settingsError || !paystackSettings || !paystackSettings.secret_key) {
      return res.status(500).json({ error: 'Paystack not configured' });
    }

    // Verify with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${paystackSettings.secret_key}`
      }
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      return res.status(500).json({ error: 'Payment verification failed', details: paystackData.message });
    }

    // Update payment status
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: paystackData.data.status === 'success' ? 'success' : 'failed',
        paid_at: paystackData.data.status === 'success' ? new Date().toISOString() : null
      })
      .eq('id', payment.id);

    if (updateError) {
      return res.status(500).json({ error: 'Failed to update payment status', details: updateError.message });
    }

    res.json({
      message: 'Payment verified successfully',
      status: paystackData.data.status,
      payment: {
        ...payment,
        status: paystackData.data.status === 'success' ? 'success' : 'failed',
        paid_at: paystackData.data.status === 'success' ? new Date().toISOString() : null
      }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Payment verification failed', details: error.message });
  }
});

// Get payment configuration
app.get('/api/payments/config', async (req, res) => {
  try {
    const { data: paystackSettings, error } = await supabase
      .from('paystack_settings')
      .select('public_key, is_active')
      .limit(1)
      .single();

    if (error || !paystackSettings) {
      return res.json({ public_key: null, is_active: false });
    }

    res.json({
      public_key: paystackSettings.public_key,
      is_active: paystackSettings.is_active
    });
  } catch (error) {
    console.error('Get payment config error:', error);
    res.json({ public_key: null, is_active: false });
  }
});

// Get user payments
app.get('/api/payments/my', authenticateToken, async (req, res) => {
  try {
    const { data: payments, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', req.user.userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to get payments', details: error.message });
    }

    res.json({ payments: payments || [] });
  } catch (error) {
    console.error('Get user payments error:', error);
    res.status(500).json({ error: 'Failed to get payments', details: error.message });
  }
});

// Get all payments (admin only)
app.get('/api/payments', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data: payments, error } = await supabase
      .from('payments')
      .select('*, users(full_name, email)')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to get payments', details: error.message });
    }

    res.json({ payments: payments || [] });
  } catch (error) {
    console.error('Get all payments error:', error);
    res.status(500).json({ error: 'Failed to get payments', details: error.message });
  }
});

// Get payment by reference
app.get('/api/payments/:reference', async (req, res) => {
  try {
    const { reference } = req.params;

    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('reference', reference)
      .single();

    if (error || !payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ payment });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Failed to get payment', details: error.message });
  }
});

// Admin: Get all users
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, username, email, full_name, is_admin, is_verified, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to get users', details: error.message });
    }

    res.json({ users: users || [] });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users', details: error.message });
  }
});

// Admin: Delete user
app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is trying to delete themselves
    if (id === req.user.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: 'Failed to delete user', details: error.message });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
});

// Admin: Get social media settings
app.get('/api/admin/social-media', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data: settings, error } = await supabase
      .from('social_media_settings')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      return res.status(500).json({ error: 'Failed to get social media settings', details: error.message });
    }

    res.json({ settings: settings || [] });
  } catch (error) {
    console.error('Get social media settings error:', error);
    res.status(500).json({ error: 'Failed to get social media settings', details: error.message });
  }
});

// Admin: Update social media settings
app.put('/api/admin/social-media', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { platform, updates } = req.body;

    const { data: setting, error } = await supabase
      .from('social_media_settings')
      .update(updates)
      .eq('platform', platform)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to update social media settings', details: error.message });
    }

    res.json({ message: 'Social media settings updated successfully', setting });
  } catch (error) {
    console.error('Update social media settings error:', error);
    res.status(500).json({ error: 'Failed to update social media settings', details: error.message });
  }
});

// Public: Get social media settings
app.get('/api/social-media', async (req, res) => {
  try {
    const { data: settings, error } = await supabase
      .from('social_media_settings')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      return res.status(500).json({ error: 'Failed to get social media settings', details: error.message });
    }

    res.json({ settings: settings || [] });
  } catch (error) {
    console.error('Get social media settings error:', error);
    res.status(500).json({ error: 'Failed to get social media settings', details: error.message });
  }
});

// Admin: Update Paystack settings
app.put('/api/admin/paystack', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { public_key, secret_key, is_active } = req.body;

    // Check if settings exist
    const { data: existingSettings } = await supabase
      .from('paystack_settings')
      .select('*')
      .limit(1)
      .single();

    let result;
    if (existingSettings) {
      // Update existing
      const { data, error } = await supabase
        .from('paystack_settings')
        .update({ public_key, secret_key, is_active })
        .eq('id', existingSettings.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new
      const { data, error } = await supabase
        .from('paystack_settings')
        .insert([{ public_key, secret_key, is_active }])
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    res.json({ message: 'Paystack settings updated successfully', settings: result });
  } catch (error) {
    console.error('Update Paystack settings error:', error);
    res.status(500).json({ error: 'Failed to update Paystack settings', details: error.message });
  }
});

// Admin: Test Paystack connection
app.post('/api/admin/paystack/test', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data: paystackSettings, error: settingsError } = await supabase
      .from('paystack_settings')
      .select('*')
      .limit(1)
      .single();

    if (settingsError || !paystackSettings || !paystackSettings.secret_key) {
      return res.status(400).json({ error: 'Paystack not configured' });
    }

    // Test connection by making a simple API call
    const response = await fetch('https://api.paystack.co/transaction/totals', {
      headers: {
        'Authorization': `Bearer ${paystackSettings.secret_key}`
      }
    });

    if (!response.ok) {
      return res.status(400).json({ error: 'Connection test failed. Please check your API keys.' });
    }

    res.json({ message: 'Connection test successful' });
  } catch (error) {
    console.error('Test Paystack connection error:', error);
    res.status(500).json({ error: 'Connection test failed', details: error.message });
  }
});

// Catch-all route for React app
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`MECE Server running on port ${PORT} with Supabase`);
  console.log(`Supabase URL: ${supabaseUrl}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  process.exit(0);
});

module.exports = app;
