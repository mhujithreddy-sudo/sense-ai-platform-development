import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

/*
 * Safety guard: block the secret/service-role key from ever
 * being used in the browser.
 */
if (
  typeof window !== "undefined" &&
  supabaseKey &&
  supabaseKey.startsWith("sb_secret_")
) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY contains a secret key. " +
      "Replace it with the Supabase anon/publishable key (starts with eyJ... or sb_publishable_...). " +
      "See .env.example for guidance."
  );
}

export const supabase = createBrowserClient(supabaseUrl, supabaseKey);