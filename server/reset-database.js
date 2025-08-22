import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Resetting database schema...');

db.serialize(() => {
  // Drop the existing participate_submissions table
  db.run('DROP TABLE IF EXISTS participate_submissions', (err) => {
    if (err) {
      console.error('Error dropping table:', err);
    } else {
      console.log('Dropped existing participate_submissions table');
    }
  });

  // Recreate the table with correct schema
  db.run(`
    CREATE TABLE participate_submissions (
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
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Created new participate_submissions table with correct schema');
    }
  });

  // Close database
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database reset complete!');
      process.exit(0);
    }
  });
});
