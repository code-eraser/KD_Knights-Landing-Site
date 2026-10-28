import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Copy .env.example to .env and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

// The anon key is safe to expose in the browser ONLY because Row Level Security
// restricts it to INSERT on `students` (see supabase/schema.sql).
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
