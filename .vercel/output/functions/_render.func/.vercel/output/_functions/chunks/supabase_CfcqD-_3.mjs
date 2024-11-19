import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://clyqdrmxzefummecbwbs.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNseXFkcm14emVmdW1tZWNid2JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5MDQ1NzAsImV4cCI6MjA0NzQ4MDU3MH0.ttCmrwb5ovQSblzAnAl3KkM-vT5z2jeYqNnqLFh-43E",
  {
    auth: {
      flowType: "pkce",
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: true
    }
  }
);

export { supabase as s };
