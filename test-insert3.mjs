import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lliahczkndxudycvypkz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsaWFoY3prbmR4dWR5Y3Z5cGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MTMzMjEsImV4cCI6MjA4ODE4OTMyMX0.8uAavq7sCk34ElXqL5rS4wWSP5OVZmlttJrp_RRxBZo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'sanju13july@gmail.com',
    password: 'password123'
  });
  
  if (authError) {
    console.log('Auth Error:', authError);
    return;
  }

  console.log('Auth Success:', authData.user.id);

  const { data, error } = await supabase
    .from('invoices')
    .insert([{
      invoice_number: 'INV-TEST-001',
      date: '2026-03-11',
      due_date: '2026-03-18',
      contact_id: null,
      subtotal: 100,
      total_gst: 18,
      total_amount: 118,
      status: 'unpaid',
      type: 'sale',
      invoice_type: 'b2b',
      user_id: authData.user.id
    }])
    .select();

  console.log('Insert Result:', data, error);
}

testInsert();
