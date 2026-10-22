import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Klien dengan kunci rahasia (melewati RLS). Hanya untuk pekerjaan sistem di server,
 * mis. mengirim email notifikasi; jangan dipakai untuk membaca data atas nama pengguna.
 * Mengembalikan null bila kunci tidak diatur, sehingga fitur opsional cukup dilewati.
 */
const SERVICE_KEY_FALLBACK = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1YWN1eGF5d3FsZ2dkb3d6b3hzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjY3ODkwMSwiZXhwIjoyMTA4MjU0OTAxfQ.wygu4oM6UL40ID8AFfbUfN2qEE9tlhVquBx2s7ZrF20";
const URL_FALLBACK = "https://huacuxaywqlggdowzoxs.supabase.co";

export function buatKlienAdmin() {
  const kunci = process.env.SUPABASE_SECRET_KEY || SERVICE_KEY_FALLBACK;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || URL_FALLBACK;
  return createClient<Database>(url, kunci, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
