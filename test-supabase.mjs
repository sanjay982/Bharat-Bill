import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://lliahczkndxudycvypkz.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_QGkvNQb9ld9BioCx-7ZiDA_Or8fjl0D';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    const { data, error } = await supabase.from('products').select('*').limit(1);
    if (error) {
      console.error('Supabase connection failed:', error.message);
      process.exit(1);
    } else {
      console.log('Supabase connected successfully! Data:', data);
      process.exit(0);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

testConnection();
