/**
 * Supabase Client Configuration
 * 
 * Initialize Supabase client for database operations.
 * Requires SUPABASE_URL and SUPABASE_KEY in .env
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('[Supabase] Warning: SUPABASE_URL or SUPABASE_KEY not configured');
}

const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

module.exports = { supabase };
