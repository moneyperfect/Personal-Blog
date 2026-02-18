import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
    if (typeof window === 'undefined') {
        // Only warn on server side to avoid cluttering client console
        console.warn('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
    }
}

export const supabase = createClient(supabaseUrl, supabaseKey)
