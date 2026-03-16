/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ndzjsaowdxcunitijbya.supabase.co';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kempzYW93ZHhjdW5pdGlqYnlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTcxMzcsImV4cCI6MjA4ODc5MzEzN30.aWWOUqseq-RzWGBYHO1FWbKSFzfyhRChZzO-I6byiUU';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Using default Supabase credentials. For production, please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
