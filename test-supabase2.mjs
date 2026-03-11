import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lliahczkndxudycvypkz.supabase.co';
const supabaseAnonKey = 'sb_publishable_QGkvNQb9ld9BioCx-7ZiDA_Or8fjl0D';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  const { data, error } = await supabase.from('non_existent_table').select('*').limit(1);
  console.log('Error:', error);
}

testConnection();
