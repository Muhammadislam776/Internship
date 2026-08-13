const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('⚠️ WARNING: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in backend/.env');
}

// Create Supabase client using Service Role Key (Backend Only)
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

const BUCKET_NAME = 'profile-pictures';

/**
 * Ensures the 'profile-pictures' storage bucket exists and is set to public.
 */
async function ensureBucketExists() {
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('⚠️ Supabase connection / list buckets error:', listError.message);
      return false;
    }

    const bucketExists = buckets.some(b => b.name === BUCKET_NAME);
    
    if (!bucketExists) {
      console.log(`📦 Creating Supabase storage bucket '${BUCKET_NAME}'...`);
      const { data, error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
      });

      if (createError) {
        console.error('⚠️ Failed to create bucket:', createError.message);
        return false;
      }
      console.log(`✅ Supabase bucket '${BUCKET_NAME}' created successfully.`);
    } else {
      console.log(`✅ Supabase storage bucket '${BUCKET_NAME}' is ready.`);
    }
    return true;
  } catch (err) {
    console.error('⚠️ Error ensuring bucket exists:', err.message);
    return false;
  }
}

module.exports = {
  supabase,
  BUCKET_NAME,
  ensureBucketExists
};
