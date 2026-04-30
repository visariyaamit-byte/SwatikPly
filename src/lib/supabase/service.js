import { createClient } from '@supabase/supabase-js'

// ⚠️ WARNING: This client bypasses Row Level Security (RLS)
// Only use in Server Actions, API Routes, or server-side code
// NEVER import this in Client Components
// NEVER expose service_role key to the browser

export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}