import { supabase } from './lib/supabase';
import { describe, it, expect } from 'vitest';

describe('Supabase Connection', () => {
  it('should be able to connect to Supabase', async () => {
    const { data, error } = await supabase.auth.getSession();
    
    // We expect either a session or null (if not logged in), but not an error
    // If there's an error, it might mean connection issue or invalid credentials
    if (error) {
      console.error('Supabase connection error:', error);
    }
    
    expect(error).toBeNull();
  });
});
