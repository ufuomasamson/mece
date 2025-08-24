const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, '../dist')));

// Database setup
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MECE Server is running',
    timestamp: new Date().toISOString(),
    port: PORT,
    database: dbPath
  });
});

// Test database connection
app.get('/api/test-db', (req, res) => {
  db.get('SELECT 1 as test', [], (err, row) => {
    if (err) {
      res.status(500).json({ error: 'Database connection failed', details: err.message });
    } else {
      res.json({ message: 'Database connection successful', test: row.test });
    }
  });
});

// Serve React app for all other GET routes (but not API routes)
app.get('*', (req, res) => {
  // Don't serve React app for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`MECE Server running on port ${PORT}`);
  console.log(`Database path: ${dbPath}`);
  console.log(`Static files served from: ${path.join(__dirname, '../dist')}`);
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

module.exports = app;
