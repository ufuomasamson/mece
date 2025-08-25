// Simple script to promote a user to admin
// Run this locally: node promote-admin.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Get Supabase credentials from environment
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function promoteToAdmin(email) {
  try {
    console.log(`🔍 Looking for user with email: ${email}`);
    
    // Find user by email
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('id, email, full_name, is_admin')
      .eq('email', email)
      .single();

    if (findError || !user) {
      console.error('❌ User not found:', findError?.message || 'No user found');
      return;
    }

    console.log(`👤 Found user: ${user.full_name} (${user.email})`);
    console.log(`🔑 Current admin status: ${user.is_admin ? 'Yes' : 'No'}`);

    if (user.is_admin) {
      console.log('✅ User is already an admin!');
      return;
    }

    // Promote user to admin
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ is_admin: true })
      .eq('id', user.id)
      .select('id, email, full_name, is_admin')
      .single();

    if (updateError) {
      console.error('❌ Failed to promote user:', updateError.message);
      return;
    }

    console.log('🎉 User promoted to admin successfully!');
    console.log(`👑 New admin: ${updatedUser.full_name} (${updatedUser.email})`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Get email from command line argument or prompt
const email = process.argv[2];

if (!email) {
  console.log('📧 Usage: node promote-admin.js <email>');
  console.log('📧 Example: node promote-admin.js your-email@example.com');
  process.exit(1);
}

console.log('🚀 Starting admin promotion...');
promoteToAdmin(email);
