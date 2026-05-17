import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

// Service role client — yalnızca sunucu tarafında (API routes) kullanılır.
// RLS'i bypass eder. Frontend'e asla expose edilmez.
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
