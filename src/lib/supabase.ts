import { createClient } from "@supabase/supabase-js";

if (!import.meta.env.PUBLIC_SUPABASE_URL) {
  throw new Error('Missing PUBLIC_SUPABASE_URL environment variable');
}

if (!import.meta.env.PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing PUBLIC_SUPABASE_ANON_KEY environment variable');
}

export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      flowType: "pkce",
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: true,
    },
  }
);
