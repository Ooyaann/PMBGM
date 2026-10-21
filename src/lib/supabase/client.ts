import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

/** Klien Supabase untuk komponen klien (form Lapor, realtime dashboard, notifikasi). */
export function buatKlienBrowser() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
