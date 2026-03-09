import { createClient } from '@supabase/supabase-js';

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const rawSupabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackKey = 'placeholder-key';
const supabaseUrl = rawSupabaseUrl || fallbackUrl;

function createSupabaseWithKey(key: string) {
    return createClient(supabaseUrl, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}

function warnMissingConfig(message: string) {
    if (typeof window === 'undefined') {
        console.warn(message);
    }
}

export const hasSupabasePublicConfig = Boolean(rawSupabaseUrl && rawSupabaseAnonKey);
export const hasSupabaseAdminConfig = Boolean(rawSupabaseUrl && (rawSupabaseServiceRoleKey || rawSupabaseAnonKey));
export const hasSupabaseConfig = hasSupabaseAdminConfig;

if (!hasSupabasePublicConfig) {
    warnMissingConfig('Missing Supabase public environment variables. Expected NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
}

if (!hasSupabaseAdminConfig) {
    warnMissingConfig('Missing Supabase admin environment variables. Expected NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY as a local fallback).');
}

const publicKey = rawSupabaseAnonKey || fallbackKey;
const adminKey = rawSupabaseServiceRoleKey || rawSupabaseAnonKey || fallbackKey;

export const supabasePublic = createSupabaseWithKey(publicKey);
export const supabaseAdmin = createSupabaseWithKey(adminKey);

// Backward-compatible export for existing server-side admin paths.
export const supabase = supabaseAdmin;
