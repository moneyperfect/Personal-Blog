import { createClient } from '@supabase/supabase-js'

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const rawSupabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseUrl = rawSupabaseUrl || 'https://placeholder.supabase.co'
const supabaseKey = rawSupabaseKey || 'placeholder-key'

if (!rawSupabaseUrl || !rawSupabaseKey) {
    if (typeof window === 'undefined') {
        // Only warn on server side to avoid cluttering client console
        console.warn('Missing Supabase environment variables. Expected NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY).')
    }
}

export const supabase = createClient(supabaseUrl, supabaseKey)
