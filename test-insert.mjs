import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lliahczkndxudycvypkz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsaWFoY3prbmR4dWR5Y3Z5cGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MTMzMjEsImV4cCI6MjA4ODE4OTMyMX0.8uAavq7sCk34ElXqL5rS4wWSP5OVZmlttJrp_RRxBZo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  const { data: user, error: userError } = await supabase.auth.getUser();
  console.log('User:', user, userError);

  const { data, error } = await supabase
    .from('invoices')
    .insert([{
      invoice_number: 'INV-001',
      date: '2026-03-11',
      due_date: '2026-03-18',
      contact_id: null,
      subtotal: 100,
      total_gst: 18,
      total_amount: 118,
      status: 'unpaid',
      type: 'sale',
      invoice_type: 'b2b',
      user_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' // dummy user id
    }])
    .select();

  console.log('Insert Result:', data, error);
}

testInsert();
