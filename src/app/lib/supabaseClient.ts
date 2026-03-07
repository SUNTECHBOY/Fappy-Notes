import { createClient } from '@supabase/supabase-js';

// Load Supabase settings from Vite environment variables (browser) or
// from Node process env (scripts). Do NOT commit real keys to source control.
const viteEnv = typeof import.meta !== 'undefined' && (import.meta as any).env ? (import.meta as any).env : undefined;
const viteUrl = viteEnv ? (viteEnv.VITE_SUPABASE_URL as string | undefined) : undefined;
const viteKey = viteEnv ? (viteEnv.VITE_SUPABASE_ANON_KEY as string | undefined) : undefined;

const supabaseUrl = viteUrl || process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = viteKey || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error(
		'Missing Supabase environment variables. In dev: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env. For scripts: set SUPABASE_URL and SUPABASE_ANON_KEY.'
	);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
