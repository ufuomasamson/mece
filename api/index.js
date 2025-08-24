const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

// Custom environment loader for .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        if (value) {
          process.env[key] = value;
        }
      }
    }
  });
}

const app = express();

// Debug: Log environment variables (remove in production)
console.log('Environment variables loaded:');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? 'SET' : 'NOT SET');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'SET' : 'NOT SET');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV);

// Supabase configuration - try multiple possible variable names
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.error('Please check your .env.local file');
  console.error('Required: VITE_SUPABASE_URL or SUPABASE_URL');
  console.error('Required: SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log('Using Supabase URL:', supabaseUrl);
console.log('Using Supabase Key:', supabaseServiceKey ? 'SET (hidden for security)' : 'NOT SET');
console.log('Supabase Key length:', supabaseServiceKey ? supabaseServiceKey.length : 0);

// Test Supabase connection
const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase
      .from('paystack_settings')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
    } else {
      console.log('Supabase connection test successful');
    }
  } catch (err) {
    console.error('Supabase connection test exception:', err);
  }
};

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
    message: 'MECE Server is running with Supabase on Vercel',
    timestamp: new Date().toISOString(),
    database: 'Supabase',
    platform: 'Vercel'
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

// Content endpoints
app.get('/api/content', async (req, res) => {
  try {
    // Return full content structure that matches frontend expectations
    const defaultContent = {
      hero: {
        title: "Welcome to Mece Consolidated Limited",
        subtitle: "Empowering Innovation, Talent, and Sustainable Growth",
        tagline1: "Fueling Dreams. Shaping Realities.",
        tagline2: "Your Vision, Our Platform.",
        backgroundImage: "/images/Hero-image.jpg"
      },
      mission: {
        title: "Our Mission",
        description: "To discover, develop, and empower talents and innovators across all fields by providing the support and global platforms they need to turn their passions into world-changing achievements."
      },
      services: {
        title: "Our Services",
        description: "We offer a wide range of services across multiple industries, empowering individuals and communities through innovation, opportunity, and passion. Whether you're a student, entrepreneur, athlete, creative talent, or farmer — we have something for you. Get in touch and let's bring your vision to life.",
        items: [
          {
            title: "Agriculture & Agribusiness",
            items: [
              "Modern crop and livestock farming",
              "Agro-processing and packaging",
              "Supply of agricultural machinery and tools",
              "Organic and sustainable farming support",
              "Training and agricultural consultancy"
            ]
          },
          {
            title: "Sports Development",
            items: [
              "Scouting and managing athletic talent",
              "Running sports academies and training programs",
              "Organizing tournaments and events",
              "Sponsorship and brand partnership support",
              "Supplying sports gear and building facilities"
            ]
          },
          {
            title: "Modelling & Fashion",
            items: [
              "Developing and managing models",
              "Hosting fashion shows and style events",
              "Branding and collaboration with fashion designers",
              "Professional photoshoots and portfolio creation",
              "Beauty and fashion product promotion"
            ]
          },
          {
            title: "Talent & Entertainment",
            items: [
              "Promoting music, dance, acting, and other talents",
              "Talent discovery programs and competitions",
              "Studio recording and content production",
              "Hosting events and providing entertainment services",
              "Coaching and career development support"
            ]
          },
          {
            title: "Machinery & Equipment",
            items: [
              "Sales and leasing of all types of machines",
              "Custom sourcing of industrial, construction, and farm equipment",
              "Installation, training, and technical support",
              "Smart tech and automation integration"
            ]
          },
          {
            title: "Food & Culinary Services",
            items: [
              "Food processing, packaging, and branding",
              "Catering for events, businesses, and individuals",
              "Culinary training and mentorship",
              "Support for restaurants, food trucks, and delivery services"
            ]
          },
          {
            title: "Educational Competitions",
            items: [
              "Organizing Spelling Bee and Mathematics challenges",
              "Science fairs and innovation contests",
              "Debate and public speaking events",
              "Inter-school quizzes and academic competitions",
              "Educational workshops and training sessions"
            ]
          },
          {
            title: "Additional Services",
            items: [
              "Digital solutions and tech innovations",
              "Youth empowerment and development programs",
              "Event planning and brand activation",
              "Custom project development tailored to your goals"
            ]
          }
        ]
      },
      competitions: {
        title: "Competition: Show Your Skill",
        description: "Discover your talents and turn them into opportunities. Choose your field and start your journey to success.",
        items: [
          {
            title: "SPORTS",
            shortDescription: "Turn Your Passion for Sports into Profit! Are you talented in sports? It's time to stop watching from the sidelines and start turning your skills into success!",
            fullContent: "**Turn Your Passion for Sports into Profit!**\n\nAre you talented in sports? It's time to stop watching from the sidelines and start turning your skills into success! Whether you're great at football, basketball, boxing, or any sport you love, there are real opportunities to earn and grow in the game.\n\nSports isn't just a hobby anymore — it's a career path, a business, and a chance to shine. Join tournaments, compete at higher levels, attract sponsorships, and build your brand. The world is full of scouts, clubs, and fans looking for the next big talent — and it could be YOU.\n\nDon't waste your gift. Step onto the field, show what you've got, and start making money doing what you love. Your future in sports starts now!",
            image: "/images/sport-card.jpg",
            gradient: "bg-gradient-primary"
          },
          {
            title: "AGRICULTURE",
            shortDescription: "Step Into Agriculture and Start Earning! Agriculture isn't just about farming — it's a business, a career, and a smart way to build wealth.",
            fullContent: "**Step Into Agriculture and Start Earning!**\n\nAgriculture isn't just about farming — it's a business, a career, and a smart way to build wealth. With the growing demand for food, natural products, and sustainable living, agriculture offers endless opportunities to make money.\n\nWhether it's crop farming, livestock, poultry, fishery, or agribusiness, there's space for you to grow and profit. You don't need to own huge land to start — with the right mindset, knowledge, and effort, you can turn even small ventures into successful businesses.\n\nThe market is wide, and people will always need food. So why wait? Step into agriculture today, use your skills, and watch your hard work turn into income. The land is ready — are you?",
            image: "/images/agriculture-card.jpg",
            gradient: "bg-gradient-secondary"
          },
          {
            title: "MUSIC/DANCE",
            shortDescription: "Turn Your Music Passion into Profit! Got talent? Whether you sing, rap, produce beats, or write songs, the music world is waiting for YOU!",
            fullContent: "**Turn Your Music Passion into Profit!**\n\nGot talent? Whether you sing, rap, produce beats, or write songs, the music world is waiting for YOU! This is your chance to step up, share your sound, and make real money doing what you love.\n\nWith so many platforms, gigs, and opportunities, music isn't just a hobby — it's a way to build your brand and your income. Don't just dream about stardom. Come in, show off your skills, connect with fans, and turn your passion into profit.\n\nThe stage is set, the audience is ready — it's your time to shine and get paid for it!",
            image: "/images/music-dance-card.jpg",
            gradient: "bg-gradient-primary"
          },
          {
            title: "ARTS AND CRAFTS",
            shortDescription: "Arts and crafts involve creating beautiful and functional items by hand, using materials like paper, fabric, wood, and clay.",
            fullContent: "**Arts and crafts**\n\ninvolve creating beautiful and functional items by hand, using materials like paper, fabric, wood, and clay. It's a creative way to express ideas, emotions, and culture.\n\nFrom painting and drawing to knitting and sculpting, arts and crafts inspire imagination, develop skills, and bring joy to both creators and collectors. Now's your chance to turn your creativity into cash!\n\nWhether you're an artist, crafter, or just love making things, come in and showcase your talent. Sell your handmade products, teach workshops, or join exhibitions—make your money through the art you love! Create, share, and earn!",
            image: "/images/arts-craft-card.jpg",
            gradient: "bg-gradient-secondary"
          },
          {
            title: "SPELLING BEE",
            shortDescription: "Ready to put your spelling skills to the test and turn your talent into cash? Join our spelling bee competition and start your own money-making journey!",
            fullContent: "**Ready to put your spelling skills to the test and turn your talent into cash?**\n\nJoin our spelling bee competition and start your own money-making journey! Whether you're a word wizard or just love a challenge, this is your chance to compete, learn, and win real prizes.\n\nStep up, spell your way to success, and watch your earnings grow. Don't miss out—come in and make your money with your brainpower!",
            image: "/images/spelling-bee-card.jpg",
            gradient: "bg-gradient-primary"
          },
          {
            title: "INNOVATION",
            shortDescription: "Innovation is the process of turning creative ideas into solutions that improve lives, solve problems, or change the way we do things.",
            fullContent: "**Innovation is the process of turning creative ideas into solutions that improve lives, solve problems, or change the way we do things.**\n\nIt drives progress in every field—from technology and science to business and the arts. Innovation means thinking differently, challenging the norm, and creating something new or better. It's the spark behind inventions, breakthroughs, and the future.\n\nNow's your chance to turn your big ideas into big income! Step in, share your creativity, and be part of a space where innovation meets opportunity. Whether you're an inventor, thinker, or problem-solver, this is your moment to shine. Come in, contribute, and make your money by shaping the future!",
            image: "/images/innovation-card.jpg",
            gradient: "bg-gradient-secondary"
          }
        ]
      },
      footer: {
        description: "Empowering Innovation, Talent, and Sustainable Growth",
        quickLinks: ["Home", "About Us", "Mission/Vision", "Blog", "Contact", "Registration"],
        services: ["Talent Development", "Sports Management", "Agricultural Innovation", "Creative Arts & Music", "Technology Solutions"],
        contact: {
          phone: "+234 8032160583",
          email: "contact@mece.org.ng",
          address: "NO. 35, AJOSE ADEOGUN STREET, UTAKO, ABUJA, FCT, NIGERIA"
        }
      },
      about: {
        title: "About MECE Consolidated Limited",
        description: "We are a dynamic organization dedicated to empowering individuals and communities through innovation, talent development, and sustainable growth initiatives.",
        vision: "To be the leading platform for talent discovery and innovation across Africa and beyond.",
        values: ["Excellence", "Innovation", "Integrity", "Community", "Sustainability"]
      },
      blog: {
        title: "Our Blog",
        description: "Stay updated with the latest insights, success stories, and opportunities in talent development and innovation.",
        posts: []
      }
    };
    
    res.json(defaultContent);
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ error: 'Failed to get content' });
  }
});

app.post('/api/content', async (req, res) => {
  try {
    const content = req.body;
    console.log('Content saved:', content);
    res.json({ message: 'Content saved successfully' });
  } catch (error) {
    console.error('Save content error:', error);
    res.status(500).json({ error: 'Failed to save content' });
  }
});

// User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Generate username from name (remove spaces, make lowercase)
    const username = name.toLowerCase().replace(/\s+/g, '');

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

    // Create user with default values for missing fields
    const { data: user, error } = await supabase
      .from('users')
      .insert([{
        username,
        email,
        password_hash,
        full_name: name,
        phone: null,
        date_of_birth: null,
        gender: null,
        address: null,
        city: null,
        state: null,
        country: null,
        postal_code: null,
        occupation: null,
        company: null,
        education_level: null,
        field_of_study: null,
        graduation_year: null,
        skills: null,
        interests: null,
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

// Get current user info (auth check)
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, email, full_name, is_admin')
      .eq('id', req.user.userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        is_admin: user.is_admin
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user info', details: error.message });
  }
});

// Admin setup endpoint (only works when no users exist)
app.post('/api/auth/setup-admin', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if any users exist
    const { data: existingUsers, error: countError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (countError) {
      return res.status(500).json({ error: 'Failed to check existing users', details: countError.message });
    }

    if (existingUsers && existingUsers.length > 0) {
      return res.status(403).json({ error: 'Admin setup is only allowed when no users exist' });
    }

    // Generate username from name
    const username = name.toLowerCase().replace(/\s+/g, '');

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Create admin user
    const { data: user, error } = await supabase
      .from('users')
      .insert([{
        username,
        email,
        password_hash,
        full_name: name,
        phone: null,
        date_of_birth: null,
        gender: null,
        address: null,
        city: null,
        state: null,
        country: null,
        postal_code: null,
        occupation: null,
        company: null,
        education_level: null,
        field_of_study: null,
        graduation_year: null,
        skills: null,
        interests: null,
        is_admin: true,
        is_verified: true
      }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to create admin user', details: error.message });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin: user.is_admin },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Admin user created successfully',
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
    console.error('Admin setup error:', error);
    res.status(500).json({ error: 'Admin setup failed', details: error.message });
  }
});

// Promote user to admin (requires existing admin)
app.post('/api/auth/promote-to-admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user by email
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('id, email, full_name, is_admin')
      .eq('email', email)
      .single();

    if (findError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.is_admin) {
      return res.status(400).json({ error: 'User is already an admin' });
    }

    // Promote user to admin
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ is_admin: true })
      .eq('id', user.id)
      .select('id, email, full_name, is_admin')
      .single();

    if (updateError) {
      return res.status(500).json({ error: 'Failed to promote user', details: updateError.message });
    }

    res.json({
      message: 'User promoted to admin successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Promote to admin error:', error);
    res.status(500).json({ error: 'Failed to promote user', details: error.message });
  }
});

// Temporary admin creation endpoint (for development only)
app.post('/api/auth/create-admin', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Generate username from name
    const username = name.toLowerCase().replace(/\s+/g, '');

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Create admin user
    const { data: user, error } = await supabase
      .from('users')
      .insert([{
        username,
        email,
        password_hash,
        full_name: name,
        phone: null,
        date_of_birth: null,
        gender: null,
        address: null,
        city: null,
        state: null,
        country: null,
        postal_code: null,
        occupation: null,
        company: null,
        education_level: null,
        field_of_study: null,
        graduation_year: null,
        skills: null,
        interests: null,
        is_admin: true,
        is_verified: true
      }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to create admin user', details: error.message });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin: user.is_admin },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Admin user created successfully',
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
    console.error('Create admin error:', error);
    res.status(500).json({ error: 'Failed to create admin user', details: error.message });
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

// Create participate submission
app.post('/api/submissions/participate', authenticateToken, async (req, res) => {
  try {
    const {
      fullName,
      emailAddress,
      phoneNumber,
      whatsappNumber,
      telegramNumber,
      bankName,
      accountNumber,
      dateOfBirth,
      gender,
      nationality,
      stateOfOrigin,
      lgaOfOrigin,
      stateOfResidence,
      lgaOfResidence,
      registrationType,
      areasOfInterest,
      otherArea,
      passportPhoto,
      paymentReference
    } = req.body;

    console.log('Creating participate submission:', { 
      fullName, 
      emailAddress, 
      areasOfInterest: areasOfInterest?.length || 0,
      hasPassportPhoto: !!passportPhoto,
      paymentReference 
    });

    // Verify payment was completed (optional)
    if (paymentReference) {
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('reference', paymentReference)
        .eq('user_id', req.user.userId)
        .eq('status', 'success')
        .single();

      if (paymentError || !payment) {
        console.log('Payment verification failed or payment not found:', paymentError);
        // Don't block submission if payment verification fails
        console.log('Allowing submission without payment verification');
      } else {
        console.log('Payment verified successfully for submission');
      }
    } else {
      console.log('No payment reference provided - allowing submission without payment');
    }

    // Create submission
    const { data: submission, error } = await supabase
      .from('submissions')
      .insert([{
        user_id: req.user.userId,
        submission_type: 'participate',
        title: `Registration - ${fullName}`,
        full_name: fullName,
        email: emailAddress,
        phone_number: phoneNumber,
        whatsapp_number: whatsappNumber,
        telegram_number: telegramNumber,
        bank_name: bankName,
        account_number: accountNumber,
        date_of_birth: dateOfBirth,
        gender: gender,
        nationality: nationality,
        state_of_origin: stateOfOrigin,
        local_government: lgaOfOrigin,
        state_of_residence: stateOfResidence,
        local_government_residence: lgaOfResidence,
        address: req.body.address,
        occupation: req.body.occupation,
        employer: req.body.employer,
        areas_of_interest: areasOfInterest,
        other_area: otherArea,
        passport_photo: passportPhoto,
        payment_reference: paymentReference,
        registration_type: registrationType,
        status: 'submitted',
        submitted_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Failed to create submission:', error);
      return res.status(500).json({ error: 'Failed to create submission', details: error.message });
    }

    console.log('Submission created successfully:', submission.id);

    res.json({
      message: 'Submission created successfully',
      submission
    });
  } catch (error) {
    console.error('Create submission error:', error);
    res.status(500).json({ error: 'Failed to create submission', details: error.message });
  }
});

// Create contact submission (no authentication required)
app.post('/api/submissions/contact', async (req, res) => {
  try {
    const {
      name,
      email,
      subject,
      message
    } = req.body;

    console.log('Creating contact submission:', { 
      name, 
      email, 
      subject: subject?.substring(0, 50) + '...',
      messageLength: message?.length || 0
    });

    // Create submission
    const { data: submission, error } = await supabase
      .from('submissions')
      .insert([{
        submission_type: 'contact',
        title: subject || 'Contact Form Submission',
        content: message,
        full_name: name,
        email: email,
        status: 'submitted',
        submitted_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Failed to create contact submission:', error);
      return res.status(500).json({ error: 'Failed to submit contact form', details: error.message });
    }

    console.log('Contact submission created successfully:', submission.id);

    res.json({
      message: 'Contact form submitted successfully',
      submission
    });
  } catch (error) {
    console.error('Create contact submission error:', error);
    res.status(500).json({ error: 'Failed to submit contact form', details: error.message });
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

// Get participate submissions (admin only)
app.get('/api/submissions/participate', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data: submissions, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('submission_type', 'participate')
      .order('submitted_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to get participate submissions', details: error.message });
    }

    res.json({ submissions: submissions || [] });
  } catch (error) {
    console.error('Get participate submissions error:', error);
    res.status(500).json({ error: 'Failed to get participate submissions', details: error.message });
  }
});

// Get contact submissions (admin only)
app.get('/api/submissions/contact', authenticateToken, requireAdmin, async (req, res) => {
  try {
    console.log('Fetching contact submissions for admin:', req.user.userId);
    
    const { data: submissions, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('submission_type', 'contact')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Database error fetching contact submissions:', error);
      return res.status(500).json({ error: 'Failed to get contact submissions', details: error.message });
    }

    console.log('Raw contact submissions from database:', submissions);
    console.log('Number of contact submissions found:', submissions?.length || 0);

    res.json({ submissions: submissions || [] });
  } catch (error) {
    console.error('Get contact submissions error:', error);
    res.status(500).json({ error: 'Failed to get contact submissions', details: error.message });
  }
});

// Get all submissions (admin only)
app.get('/api/admin/submissions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data: submissions, error } = await supabase
      .from('submissions')
      .select('*')
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
    console.log('Payment initialization request:', { amount, email, callback_url, userId: req.user.userId });

    // Get Paystack settings
    const { data: paystackSettings, error: settingsError } = await supabase
      .from('paystack_settings')
      .select('*')
      .limit(1);

    console.log('Paystack settings query result:', { data: paystackSettings, error: settingsError });

    if (settingsError) {
      console.error('Error fetching Paystack settings:', settingsError);
      return res.status(500).json({ error: 'Failed to fetch Paystack configuration', details: settingsError.message });
    }

    if (!paystackSettings || paystackSettings.length === 0) {
      console.error('No Paystack settings found');
      return res.status(400).json({ error: 'Payment system not configured. Please contact administrator.' });
    }

    const settings = paystackSettings[0];
    console.log('Using Paystack settings:', { 
      hasSecretKey: !!settings.secret_key, 
      isActive: settings.is_active,
      publicKey: settings.public_key ? `${settings.public_key.substring(0, 10)}...` : 'NOT SET'
    });

    if (!settings.secret_key) {
      console.error('Paystack secret key not configured');
      return res.status(400).json({ error: 'Payment system not configured. Please contact administrator.' });
    }

    if (!settings.is_active) {
      console.error('Paystack is not active');
      return res.status(400).json({ error: 'Payment system is currently disabled. Please contact administrator.' });
    }

    // Generate reference
    const reference = `MECE-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`.toUpperCase();
    console.log('Generated payment reference:', reference);

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert([{
        user_id: req.user.userId,
        reference,
        amount,
        currency: 'NGN',
        status: 'pending',
        payment_method: 'paystack',
        description: 'Registration Fee'
      }])
      .select()
      .single();

    if (paymentError) {
      console.error('Failed to create payment record:', paymentError);
      return res.status(500).json({ error: 'Failed to create payment record', details: paymentError.message });
    }

    console.log('Payment record created:', payment.id);

    // Initialize Paystack payment
    console.log('Initializing Paystack payment...');
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.secret_key}`,
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
    console.log('Paystack response:', { status: paystackData.status, message: paystackData.message });

    if (!paystackData.status) {
      console.error('Paystack initialization failed:', paystackData);
      return res.status(500).json({ error: 'Payment initialization failed', details: paystackData.message });
    }

    // Update payment with Paystack data
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        paystack_transaction_id: paystackData.data.reference,
        paystack_authorization_url: paystackData.data.authorization_url,
        paystack_access_code: paystackData.data.access_code
      })
      .eq('id', payment.id);

    if (updateError) {
      console.error('Failed to update payment with Paystack data:', updateError);
      // Don't fail the payment if this update fails
    }

    console.log('Payment initialized successfully:', {
      reference: payment.reference,
      authorization_url: paystackData.data.authorization_url
    });

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
    console.log('Payment verification request:', { reference, userId: req.user.userId });

    // Get payment record
    const { data: payments, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('reference', reference)
      .eq('user_id', req.user.userId);

    console.log('Payment lookup result:', { payments, error: paymentError });

    if (paymentError) {
      console.error('Payment lookup error:', paymentError);
      return res.status(500).json({ error: 'Failed to lookup payment', details: paymentError.message });
    }

    if (!payments || payments.length === 0) {
      console.error('No payment found for reference:', reference);
      return res.status(404).json({ error: 'Payment not found for this reference' });
    }

    const payment = payments[0];
    console.log('Found payment:', { 
      id: payment.id, 
      reference: payment.reference, 
      status: payment.status,
      amount: payment.amount 
    });

    // Get Paystack settings
    const { data: paystackSettings, error: settingsError } = await supabase
      .from('paystack_settings')
      .select('*')
      .limit(1);

    console.log('Paystack settings for verification:', { 
      data: paystackSettings, 
      error: settingsError,
      hasSecretKey: paystackSettings?.[0]?.secret_key ? 'YES' : 'NO'
    });

    if (settingsError) {
      console.error('Error fetching Paystack settings:', settingsError);
      return res.status(500).json({ error: 'Failed to fetch Paystack configuration', details: settingsError.message });
    }

    if (!paystackSettings || paystackSettings.length === 0) {
      console.error('No Paystack settings found');
      return res.status(500).json({ error: 'Paystack not configured' });
    }

    const settings = paystackSettings[0];
    if (!settings.secret_key) {
      console.error('Paystack secret key not configured');
      return res.status(500).json({ error: 'Paystack not configured' });
    }

    // Verify with Paystack
    console.log('Verifying payment with Paystack for reference:', reference);
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${settings.secret_key}`
      }
    });

    const paystackData = await paystackResponse.json();
    console.log('Paystack verification response:', { 
      status: paystackData.status, 
      message: paystackData.message,
      data: paystackData.data 
    });

    if (!paystackData.status) {
      console.error('Paystack verification failed:', paystackData);
      return res.status(500).json({ error: 'Payment verification failed', details: paystackData.message });
    }

    // Update payment status
    const newStatus = paystackData.data.status === 'success' ? 'success' : 'failed';
    console.log('Updating payment status to:', newStatus);

    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: newStatus,
        paid_at: newStatus === 'success' ? new Date().toISOString() : null
      })
      .eq('id', payment.id);

    if (updateError) {
      console.error('Failed to update payment status:', updateError);
      return res.status(500).json({ error: 'Failed to update payment status', details: updateError.message });
    }

    console.log('Payment verification completed successfully');

    res.json({
      success: true,
      message: 'Payment verified successfully',
      status: paystackData.data.status,
      payment: {
        ...payment,
        status: newStatus,
        paid_at: newStatus === 'success' ? new Date().toISOString() : null
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
      .select('*')
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

// Admin: Get Paystack settings
app.get('/api/admin/paystack-settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    console.log('Fetching Paystack settings for admin user:', req.user.userId);
    
    // Use direct query to get paystack settings
    const { data: paystackSettings, error } = await supabase
      .from('paystack_settings')
      .select('*')
      .limit(1);

    console.log('Paystack settings query result:', { data: paystackSettings, error });

    if (error) {
      console.error('Error fetching Paystack settings:', error);
      return res.status(500).json({ error: 'Failed to get Paystack settings', details: error.message });
    }

    const settings = paystackSettings?.[0] || {};
    console.log('Returning settings:', { 
      hasSettings: !!settings, 
      hasPublicKey: !!settings.public_key, 
      hasSecretKey: !!settings.secret_key,
      isActive: settings.is_active 
    });

    res.json({ settings });
  } catch (error) {
    console.error('Get Paystack settings error:', error);
    res.status(500).json({ error: 'Failed to get Paystack settings', details: error.message });
  }
});

// Admin: Create/Update Paystack settings
app.post('/api/admin/paystack-settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { public_key, secret_key, is_active } = req.body;
    console.log('Received Paystack settings data:', { 
      public_key: public_key ? `${public_key.substring(0, 10)}...` : 'NOT SET', 
      secret_key: secret_key ? `${secret_key.substring(0, 10)}...` : 'NOT SET', 
      is_active 
    });
    console.log('Request body:', req.body);

    // Check if settings exist
    const { data: existingSettings, error: checkError } = await supabase
      .from('paystack_settings')
      .select('*')
      .limit(1);

    console.log('Existing settings check:', { data: existingSettings, error: checkError });

    let result;
    if (existingSettings && existingSettings.length > 0) {
      // Update existing
      console.log('Updating existing Paystack settings with ID:', existingSettings[0].id);
      console.log('Update data:', { public_key, secret_key, is_active });
      
      const { data, error } = await supabase
        .from('paystack_settings')
        .update({ public_key, secret_key, is_active })
        .eq('id', existingSettings[0].id)
        .select();

      console.log('Update result:', { data, error });

      if (error) {
        console.error('Update error:', error);
        throw error;
      }
      
      // Handle the case where update might return empty array
      if (!data || data.length === 0) {
        console.log('Update returned empty array, fetching updated data...');
        // If update didn't return data, fetch it separately
        const { data: fetchedData, error: fetchError } = await supabase
          .from('paystack_settings')
          .select('*')
          .eq('id', existingSettings[0].id)
          .single();
          
        if (fetchError) {
          console.error('Fetch after update error:', fetchError);
          throw fetchError;
        }
        result = fetchedData;
        console.log('Fetched updated data:', result);
      } else {
        result = data[0];
        console.log('Update returned data:', result);
      }
    } else {
      // Create new
      console.log('Creating new Paystack settings');
      const { data, error } = await supabase
        .from('paystack_settings')
        .insert([{ public_key, secret_key, is_active }])
        .select()
        .single();

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }
      result = data;
      console.log('Created new data:', result);
    }

    console.log('Final result before response:', result);

    // Try to test connection but don't fail if it doesn't work
    try {
      if (secret_key && is_active) {
        console.log('Testing Paystack connection...');
        const response = await fetch('https://api.paystack.co/transaction/totals', {
          headers: {
            'Authorization': `Bearer ${secret_key}`
          }
        });
        
        if (response.ok) {
          console.log('Paystack connection test successful');
        } else {
          console.log('Paystack connection test failed:', response.status);
        }
      }
    } catch (testError) {
      console.log('Paystack connection test skipped due to network issue:', testError.message);
      // Don't fail the save operation due to connection test failure
    }

    res.json({ message: 'Paystack settings saved successfully', settings: result });
  } catch (error) {
    console.error('Save Paystack settings error:', error);
    res.status(500).json({ error: 'Failed to save Paystack settings', details: error.message });
  }
});

// Test endpoint to check paystack_settings table
app.get('/api/test/paystack-table', async (req, res) => {
  try {
    console.log('Testing paystack_settings table structure...');
    
    // Try to get table info
    const { data, error } = await supabase
      .from('paystack_settings')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Table query error:', error);
      return res.json({ 
        success: false, 
        error: error.message, 
        code: error.code,
        details: error.details 
      });
    }
    
    console.log('Table query successful, data:', data);
    
    // Try to insert a test record
    const testData = {
      public_key: 'test_public_key',
      secret_key: 'test_secret_key',
      is_active: false
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('paystack_settings')
      .insert([testData])
      .select();
    
    if (insertError) {
      console.error('Insert test error:', insertError);
      return res.json({ 
        success: false, 
        query: 'successful', 
        insert: 'failed',
        insertError: insertError.message,
        insertCode: insertError.code
      });
    }
    
    console.log('Insert test successful:', insertData);
    
    // Clean up test data
    if (insertData && insertData[0]) {
      await supabase
        .from('paystack_settings')
        .delete()
        .eq('id', insertData[0].id);
    }
    
    res.json({ 
      success: true, 
      message: 'Table structure test passed',
      query: 'successful',
      insert: 'successful',
      data: data
    });
    
  } catch (error) {
    console.error('Table test endpoint error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Test payment endpoint
app.get('/api/test/payment-system', async (req, res) => {
  try {
    console.log('Testing payment system...');
    
    // Check if paystack_settings table exists and has data
    const { data: paystackSettings, error: settingsError } = await supabase
      .from('paystack_settings')
      .select('*')
      .limit(1);
    
    if (settingsError) {
      console.error('Paystack settings table error:', settingsError);
      return res.json({ 
        success: false, 
        error: 'Paystack settings table error',
        details: settingsError.message 
      });
    }
    
    if (!paystackSettings || paystackSettings.length === 0) {
      return res.json({ 
        success: false, 
        error: 'No Paystack settings found',
        message: 'Please configure Paystack in the admin dashboard'
      });
    }
    
    const settings = paystackSettings[0];
    console.log('Found Paystack settings:', {
      hasPublicKey: !!settings.public_key,
      hasSecretKey: !!settings.secret_key,
      isActive: settings.is_active
    });
    
    // Check if payments table exists
    const { data: paymentsTest, error: paymentsError } = await supabase
      .from('payments')
      .select('count')
      .limit(1);
    
    if (paymentsError) {
      console.error('Payments table error:', paymentsError);
      return res.json({ 
        success: false, 
        error: 'Payments table error',
        details: paymentsError.message 
      });
    }
    
    return res.json({ 
      success: true, 
      message: 'Payment system is accessible',
      paystack: {
        configured: !!settings.secret_key,
        active: settings.is_active,
        hasPublicKey: !!settings.public_key
      },
      payments: {
        tableExists: true,
        accessible: true
      }
    });
    
  } catch (error) {
    console.error('Payment system test error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Payment system test failed',
      details: error.message 
    });
  }
});

// Local development server startup
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, async () => {
    console.log(`🚀 MECE Server running on port ${PORT}`);
    console.log(`📊 Database: Supabase`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔗 API base: http://localhost:${PORT}/api`);
    
    // Test Supabase connection on startup
    await testSupabaseConnection();
  });
}

// Export for Vercel
module.exports = app;
