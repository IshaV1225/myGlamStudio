/**
 * lib/supabase.ts — Single Supabase client for the entire app.
 *
 * WHY ONE FILE?
 * Supabase (and most SDKs) should only be initialised once. If every component
 * called createClient() on its own, you'd get multiple connections, duplicate
 * listeners, and wasted resources. Exporting a single `supabase` object from
 * here means every file shares the same connection.
 *
 * WHY ENVIRONMENT VARIABLES?
 * The URL and anon key are stored in .env.local (never committed to git).
 * Next.js automatically loads that file. The NEXT_PUBLIC_ prefix means these
 * values are safe to expose to the browser — Supabase security comes from
 * Row Level Security rules in the database, not from hiding the key.
 *
 * HOW TO USE IN OTHER FILES:
 *   import { supabase } from '@/lib/supabase';
 *   const { data, error } = await supabase.auth.signInWithPassword(...);
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// createClient returns an object with .auth (authentication) and
// .from() (database queries). Everything Supabase flows through this.
export const supabase = createClient(supabaseUrl, supabaseAnon);
