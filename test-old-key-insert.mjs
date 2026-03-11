import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lliahczkndxudycvypkz.supabase.co';
const supabaseAnonKey = 'sb_publishable_QGkvNQb9ld9BioCx-7ZiDA_Or8fjl0D';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
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

  console.log('Old Key Insert Error:', error);
}

testInsert();
