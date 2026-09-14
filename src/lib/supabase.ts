import { createClient } from '@supabase/supabase-js';

const meta = import.meta as any;
const env = meta.env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://dnvdnijlsnibjvnwhjak.supabase.co';
const supabaseKey = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Ni-S6vEed2pU9Mt1ebuZaQ_Txof-PO5';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey && !supabaseKey.includes('MY_'));

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
