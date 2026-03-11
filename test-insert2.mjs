import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lliahczkndxudycvypkz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsaWFoY3prbmR4dWR5Y3Z5cGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MTMzMjEsImV4cCI6MjA4ODE4OTMyMX0.8uAavq7sCk34ElXqL5rS4wWSP5OVZmlttJrp_RRxBZo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'sanju13july@gmail.com',
    password: 'password123' // I don't know the password, so I can't do this.
  });
  
  console.log(authData, authError);
}

testInsert();