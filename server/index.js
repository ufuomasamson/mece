import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import PaymentService from './services/paymentService.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
// const paymentService = new PaymentService();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for passport photos
app.use(express.static(join(__dirname, '../dist')));

// Database setup
const dbPath = join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// JWT secret
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
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Initialize database tables
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Participate submissions table
      db.run(`
        CREATE TABLE IF NOT EXISTS participate_submissions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          full_name TEXT NOT NULL,
          email_address TEXT NOT NULL,
          phone_number TEXT NOT NULL,
          whatsapp_number TEXT NOT NULL,
          telegram_number TEXT,
          bank_name TEXT NOT NULL,
          account_number TEXT NOT NULL,
          state_of_origin TEXT NOT NULL,
          lga_of_origin TEXT NOT NULL,
          state_of_residence TEXT NOT NULL,
          lga_of_residence TEXT NOT NULL,
          registration_type TEXT NOT NULL,
          areas_of_interest TEXT NOT NULL,
          other_area TEXT,
          passport_photo TEXT,
          status TEXT DEFAULT 'pending',
          admin_notes TEXT,
          payment_status TEXT DEFAULT 'unpaid',
          payment_amount REAL DEFAULT 0,
          payment_id TEXT,
          stripe_customer_id TEXT,
          submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Add missing columns if they don't exist (for existing databases)
      db.run(`ALTER TABLE participate_submissions ADD COLUMN full_name TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.log('Column full_name already exists or error:', err.message);
        }
      });
      
      db.run(`ALTER TABLE participate_submissions ADD COLUMN email_address TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.log('Column email_address already exists or error:', err.message);
        }
      });
      
      db.run(`ALTER TABLE participate_submissions ADD COLUMN phone_number TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.log('Column phone_number already exists or error:', err.message);
        }
      });
      
      db.run(`ALTER TABLE participate_submissions ADD COLUMN whatsapp_number TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.log('Column whatsapp_number already exists or error:', err.message);
        }
      });
      
      db.run(`ALTER TABLE participate_submissions ADD COLUMN telegram_number TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.log('Column telegram_number already exists or error:', err.message);
        }
      });
      
      db.run(`ALTER TABLE participate_submissions ADD COLUMN bank_name TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.log('Column bank_name already exists or error:', err.message);
        }
      });
      
      db.run(`ALTER TABLE participate_submissions ADD COLUMN account_number TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.log('Column account_number already exists or error:', err.message);
        }
      });
      
      db.run(`ALTER TABLE participate_submissions ADD COLUMN state_of_origin TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.log('Column state_of_origin already exists or error:', err.message);
        }
      });
      
      db.run(`ALTER TABLE participate_submissions ADD COLUMN lga_of_origin TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.log('Column lga_of_origin already exists or error:', err.message);
        }
      });
      
      db.run(`ALTER TABLE participate_submissions ADD COLUMN state_of_residence TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.log('Column state_of_residence already exists or error:', err.message);
        }
      });
      
      db.run(`ALTER TABLE participate_submissions ADD COLUMN lga_of_residence TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.log('Column lga_of_residence already exists or error:', err.message);
        }
      });
      
      db.run(`ALTER TABLE participate_submissions ADD COLUMN registration_type TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.log('Column registration_type already exists or error:', err.message);
        }
      });
      
      db.run(`ALTER TABLE participate_submissions ADD COLUMN areas_of_interest TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.log('Column areas_of_interest already exists or error:', err.message);
        }
      });
      
      db.run(`ALTER TABLE participate_submissions ADD COLUMN other_area TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.log('Column other_area already exists or error:', err.message);
        }
      });
      
      db.run(`ALTER TABLE participate_submissions ADD COLUMN passport_photo TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.log('Column passport_photo already exists or error:', err.message);
        }
      });
      
      db.run(`ALTER TABLE participate_submissions ADD COLUMN stripe_customer_id TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.log('Column stripe_customer_id already exists or error:', err.message);
        }
      });

      // Contact submissions table
      db.run(`
        CREATE TABLE IF NOT EXISTS contact_submissions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          message TEXT NOT NULL,
          status TEXT DEFAULT 'unread',
          admin_response TEXT,
          submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Payments table
      db.run(`
        CREATE TABLE IF NOT EXISTS payments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          submission_id INTEGER,
          user_id INTEGER,
          amount REAL NOT NULL,
          currency TEXT DEFAULT 'USD',
          payment_method TEXT NOT NULL,
          payment_id TEXT UNIQUE NOT NULL,
          status TEXT DEFAULT 'pending',
          stripe_payment_intent_id TEXT,
          stripe_customer_id TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (submission_id) REFERENCES participate_submissions (id),
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Blog posts table
      db.run(`
        CREATE TABLE IF NOT EXISTS blog_posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          excerpt TEXT NOT NULL,
          author TEXT NOT NULL,
          tags TEXT,
          image_url TEXT,
          status TEXT DEFAULT 'draft',
          published_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Website content table
      db.run(`
        CREATE TABLE IF NOT EXISTS website_content (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          section TEXT NOT NULL,
          subsection TEXT,
          content_key TEXT NOT NULL,
          content_value TEXT NOT NULL,
          content_type TEXT DEFAULT 'text',
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(section, subsection, content_key)
        )
      `);

      // Populate with default content if table is empty
      db.get('SELECT COUNT(*) as count FROM website_content', [], (err, row) => {
        if (err) {
          console.error('Error checking website_content count:', err);
          return;
        }
        
        if (row.count === 0) {
          console.log('Populating website_content with default content...');
          
          const defaultContent = [
            // Hero section
            ['hero', 'main', 'title', 'Welcome to Mece Consolidated Limited'],
            ['hero', 'main', 'subtitle', 'Empowering Innovation, Talent, and Sustainable Growth'],
            ['hero', 'main', 'tagline1', 'Fueling Dreams. Shaping Realities.'],
            ['hero', 'main', 'tagline2', 'Your Vision, Our Platform.'],
            ['hero', 'main', 'backgroundImage', '/images/Hero-image.jpg'],
            
            // Mission section
            ['mission', 'main', 'title', 'Our Mission'],
            ['mission', 'main', 'description', 'To discover, develop, and empower talents and innovators across all fields by providing the support and global platforms they need to turn their passions into world-changing achievements.'],
            
            // Services section
            ['services', 'main', 'title', 'Our Services'],
            ['services', 'main', 'description', 'We offer a wide range of services across multiple industries, empowering individuals and communities through innovation, opportunity, and passion. Whether you\'re a student, entrepreneur, athlete, creative talent, or farmer — we have something for you. Get in touch and let\'s bring your vision to life.'],
            
            // Competitions section
            ['competitions', 'main', 'title', 'Competition: Show Your Skill'],
            ['competitions', 'main', 'description', 'Discover your talents and turn them into opportunities. Choose your field and start your journey to success.'],
            
            // About section
            ['about', 'main', 'title', 'About MECE Consolidated Limited'],
            ['about', 'main', 'description', 'We are a dynamic organization dedicated to empowering individuals and communities through innovation, talent development, and sustainable growth initiatives.'],
            ['about', 'main', 'vision', 'To be the leading platform for talent discovery and innovation across Africa and beyond.'],
            
            // Blog section
            ['blog', 'main', 'title', 'Our Blog'],
            ['blog', 'main', 'description', 'Stay updated with the latest insights, success stories, and opportunities in talent development and innovation.'],
            
            // Footer section
            ['footer', 'main', 'description', 'Empowering Innovation, Talent, and Sustainable Growth'],
            ['footer', 'contact', 'phone', '+234 8032160583'],
            ['footer', 'contact', 'email', 'contact@mece.org.ng'],
            ['footer', 'contact', 'address', 'NO. 35, AJOSE ADEOGUN STREET, UTAKO, ABUJA, FCT, NIGERIA']
          ];
          
          const insertStmt = db.prepare(`
            INSERT INTO website_content (section, subsection, content_key, content_value)
            VALUES (?, ?, ?, ?)
          `);
          
          defaultContent.forEach(([section, subsection, key, value]) => {
            insertStmt.run([section, subsection, key, value]);
          });
          
          insertStmt.finalize();
          console.log('Default content populated successfully');
        }
      });

      db.run("PRAGMA foreign_keys = ON", (err) => {
        if (err) {
          console.error('Error enabling foreign keys:', err);
          reject(err);
        } else {
          console.log('Database initialized successfully');
          resolve();
        }
      });
    });
  });
};

// Initialize database on startup
initDatabase().catch(console.error);

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (row) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
        [name, email, hashedPassword], 
        function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          
          // Generate JWT token
          const token = jwt.sign(
            { id: this.lastID, email, name, role: 'user' },
            JWT_SECRET,
            { expiresIn: '7d' }
          );
          
          res.json({
            message: 'User registered successfully',
            token,
            user: {
              id: this.lastID,
              name,
              email,
              role: 'user'
            }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Create first admin user (only if no users exist)
app.post('/api/auth/setup-admin', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    // Check if any users exist
    db.get('SELECT COUNT(*) as count FROM users', [], async (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (row.count > 0) {
        return res.status(403).json({ error: 'Admin setup is only allowed when no users exist' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create admin user
      db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', 
        [name, email, hashedPassword, 'admin'], 
        function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          
          // Generate JWT token
          const token = jwt.sign(
            { id: this.lastID, email, name, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '7d' }
          );
          
          res.json({
            message: 'Admin user created successfully',
            token,
            user: {
              id: this.lastID,
              name,
              email,
              role: 'admin'
            }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Promote existing user to admin
app.post('/api/auth/promote-to-admin', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Check if user exists
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update user role to admin
      db.run('UPDATE users SET role = ? WHERE email = ?', ['admin', email], function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        res.json({
          message: 'User promoted to admin successfully',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: 'admin'
          }
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all participate submissions (admin only)
app.get('/api/submissions/participate', authenticateToken, requireAdmin, (req, res) => {
  const query = `
    SELECT ps.*, u.name as user_name, u.email as user_email 
    FROM participate_submissions ps
    LEFT JOIN users u ON ps.user_id = u.id
    ORDER BY ps.submitted_at DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create new participate submission
app.post('/api/submissions/participate', authenticateToken, async (req, res) => {
  const {
    fullName,
    emailAddress,
    phoneNumber,
    whatsappNumber,
    telegramNumber,
    bankName,
    accountNumber,
    stateOfOrigin,
    lgaOfOrigin,
    stateOfResidence,
    lgaOfResidence,
    registrationType,
    areasOfInterest,
    otherArea,
    passportPhoto
  } = req.body;

  try {
    // Create or get Stripe customer
    // const customerResult = await paymentService.createCustomer(emailAddress, fullName);
    // if (!customerResult.success) {
    //   return res.status(500).json({ error: 'Failed to create customer' });
    // }

    // const stripeCustomerId = customerResult.customerId;
    const stripeCustomerId = 'temp_customer_id';

    // Insert submission into database
    const query = `
      INSERT INTO participate_submissions 
      (user_id, full_name, email_address, phone_number, whatsapp_number, telegram_number, bank_name, account_number, state_of_origin, lga_of_origin, state_of_residence, lga_of_residence, registration_type, areas_of_interest, other_area, passport_photo, stripe_customer_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    console.log('Inserting submission with data:', {
      userId: req.user.id,
      fullName,
      emailAddress,
      phoneNumber,
      whatsappNumber,
      telegramNumber,
      bankName,
      accountNumber,
      stateOfOrigin,
      lgaOfOrigin,
      stateOfResidence,
      lgaOfResidence,
      registrationType,
      areasOfInterest: JSON.stringify(areasOfInterest),
      otherArea,
      passportPhotoLength: passportPhoto ? passportPhoto.length : 0
    });

    db.run(query, [req.user.id, fullName, emailAddress, phoneNumber, whatsappNumber, telegramNumber, bankName, accountNumber, stateOfOrigin, lgaOfOrigin, stateOfResidence, lgaOfResidence, registrationType, JSON.stringify(areasOfInterest), otherArea, passportPhoto, stripeCustomerId], function(err) {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: err.message });
        return;
      }
      
      console.log('Submission created successfully with ID:', this.lastID);
      res.json({
        id: this.lastID,
        stripeCustomerId: stripeCustomerId,
        message: 'Submission created successfully'
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all contact submissions (admin only)
app.get('/api/submissions/contact', authenticateToken, requireAdmin, (req, res) => {
  const query = `
    SELECT * FROM contact_submissions 
    ORDER BY submitted_at DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create new contact submission
app.post('/api/submissions/contact', (req, res) => {
  const { name, email, message } = req.body;

  const query = `
    INSERT INTO contact_submissions (name, email, message)
    VALUES (?, ?, ?)
  `;

  db.run(query, [name, email, message], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    res.json({
      id: this.lastID,
      message: 'Message sent successfully'
    });
  });
});

// Update submission status
app.patch('/api/submissions/participate/:id', (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  const query = `
    UPDATE participate_submissions 
    SET status = ?, admin_notes = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(query, [status, adminNotes, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Submission not found' });
      return;
    }
    
    res.json({ message: 'Submission updated successfully' });
  });
});

// Update contact submission status
app.patch('/api/submissions/contact/:id', (req, res) => {
  const { id } = req.params;
  const { status, adminResponse } = req.body;

  const query = `
    UPDATE contact_submissions 
    SET status = ?, admin_response = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(query, [status, adminResponse, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }
    
    res.json({ message: 'Message updated successfully' });
  });
});

// Payment Routes

// Create payment intent
app.post('/api/payments/create-intent', async (req, res) => {
  const { amount, currency = 'USD', submissionId, customerId } = req.body;

  try {
    // Validate amount
    const validation = paymentService.validatePaymentAmount(amount);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Create payment intent
    const result = await paymentService.createPaymentIntent(amount, currency, {
      submission_id: submissionId,
      customer_id: customerId
    });

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    // Store payment record in database
    const query = `
      INSERT INTO payments 
      (submission_id, amount, currency, payment_method, payment_id, stripe_payment_intent_id, stripe_customer_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(query, [submissionId, amount, currency, 'stripe', result.paymentIntentId, result.paymentIntentId, customerId], function(err) {
      if (err) {
        console.error('Error storing payment record:', err);
      }
    });

    res.json({
      clientSecret: result.clientSecret,
      paymentIntentId: result.paymentIntentId,
      amount: result.amount,
      currency: result.currency
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Confirm payment
app.post('/api/payments/confirm', async (req, res) => {
  const { paymentIntentId, submissionId } = req.body;

  try {
    const result = await paymentService.confirmPayment(paymentIntentId);
    
    if (result.success) {
      // Update payment status in database
      const updatePaymentQuery = `
        UPDATE payments 
        SET status = 'completed' 
        WHERE stripe_payment_intent_id = ?
      `;

      const updateSubmissionQuery = `
        UPDATE participate_submissions 
        SET payment_status = 'paid', payment_id = ? 
        WHERE id = ?
      `;

      db.serialize(() => {
        db.run(updatePaymentQuery, [paymentIntentId]);
        db.run(updateSubmissionQuery, [paymentIntentId, submissionId]);
      });

      res.json({
        success: true,
        message: 'Payment confirmed successfully',
        status: result.status
      });
    } else {
      res.json({
        success: false,
        message: result.error,
        status: result.status
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment details
app.get('/api/payments/:paymentIntentId', async (req, res) => {
  const { paymentIntentId } = req.params;

  try {
    const result = await paymentService.getPaymentDetails(paymentIntentId);
    
    if (result.success) {
      res.json(result.paymentIntent);
    } else {
      res.status(404).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all payments
app.get('/api/payments', (req, res) => {
  const query = `
    SELECT p.*, ps.full_name as applicant_name, ps.email_address as applicant_email
    FROM payments p
    LEFT JOIN participate_submissions ps ON p.submission_id = ps.id
    ORDER BY p.created_at DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get all website content
app.get('/api/content', (req, res) => {
  const query = `
    SELECT * FROM website_content 
    ORDER BY section, subsection, content_key
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Convert rows to structured content
    const content = {};
    rows.forEach(row => {
      if (!content[row.section]) {
        content[row.section] = {};
      }
      if (!content[row.section][row.subsection || 'main']) {
        content[row.section][row.subsection || 'main'] = {};
      }
      content[row.section][row.subsection || 'main'][row.content_key] = row.content_value;
    });
    
    res.json(content);
  });
});

// Get website content by section
app.get('/api/content/:section', (req, res) => {
  const { section } = req.params;
  
  const query = `
    SELECT * FROM website_content 
    WHERE section = ?
    ORDER BY content_key
  `;
  
  db.all(query, [section], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Convert rows to structured content
    const content = {};
    rows.forEach(row => {
      if (!content[row.subsection || 'main']) {
        content[row.subsection || 'main'] = {};
      }
      content[row.subsection || 'main'][row.content_key] = row.content_value;
    });
    
    res.json(content);
  });
});

// Save all website content
app.post('/api/content', (req, res) => {
  const content = req.body;
  
  const updates = [];
  const values = [];
  
  Object.entries(content).forEach(([section, sectionData]) => {
    Object.entries(sectionData).forEach(([subsection, items]) => {
      Object.entries(items).forEach(([key, value]) => {
        updates.push(`
          INSERT OR REPLACE INTO website_content 
          (section, subsection, content_key, content_value, updated_at)
          VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        `);
        values.push(section, subsection || 'main', key, value);
      });
    });
  });
  
  db.serialize(() => {
    const stmt = db.prepare(updates[0]);
    
    db.run('BEGIN TRANSACTION');
    
    try {
      updates.forEach((update, index) => {
        const startIndex = index * 4;
        db.run(update, values.slice(startIndex, startIndex + 4));
      });
      
      db.run('COMMIT', (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Content saved successfully' });
      });
    } catch (error) {
      db.run('ROLLBACK');
      res.status(500).json({ error: error.message });
    }
  });
});

// Update website content by section
app.put('/api/content/:section', (req, res) => {
  const { section } = req.params;
  const content = req.body;
  
  const updates = [];
  const values = [];
  
  Object.entries(content).forEach(([subsection, items]) => {
    Object.entries(items).forEach(([key, value]) => {
      updates.push(`
        INSERT OR REPLACE INTO website_content 
        (section, subsection, content_key, content_value, updated_at)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      `);
      values.push(section, subsection || 'main', key, value);
    });
  });
  
  db.serialize(() => {
    const stmt = db.prepare(updates[0]);
    
    db.run('BEGIN TRANSACTION');
    
    try {
      updates.forEach((update, index) => {
        const startIndex = index * 4;
        db.run(update, values.slice(startIndex, startIndex + 4));
      });
      
      db.run('COMMIT', (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Content updated successfully' });
      });
    } catch (error) {
      db.run('ROLLBACK');
      res.status(500).json({ error: error.message });
    }
  });
});

// Get blog posts
app.get('/api/blog', (req, res) => {
  const query = `
    SELECT * FROM blog_posts 
    WHERE status = 'published'
    ORDER BY published_at DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create blog post
app.post('/api/blog', (req, res) => {
  const { title, content, excerpt, author, tags, imageUrl, status } = req.body;

  const query = `
    INSERT INTO blog_posts (title, content, excerpt, author, tags, image_url, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [title, content, excerpt, author, tags, imageUrl, status], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    res.json({
      id: this.lastID,
      message: 'Blog post created successfully'
    });
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database path: ${dbPath}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});
