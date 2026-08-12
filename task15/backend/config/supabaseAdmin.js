const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseAdmin = null;
let isConfigured = false;

if (
  supabaseUrl &&
  supabaseServiceRoleKey &&
  !supabaseUrl.includes('your-supabase-project') &&
  !supabaseServiceRoleKey.includes('your_supabase_service_role_key')
) {
  try {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    isConfigured = true;
    console.log('✅ Supabase Admin Client initialized securely using Service Role Key on SERVER');
  } catch (err) {
    console.error('❌ Error initializing Supabase Admin Client:', err.message);
  }
} else {
  console.log('⚠️ Supabase credentials not set or using placeholders in backend/.env');
  console.log('ℹ️ Server will serve high-quality mock data & interactive demo mode.');
}

module.exports = {
  supabaseAdmin,
  isConfigured,
  supabaseUrl
};
