import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Klien dengan kunci rahasia (melewati RLS). Hanya untuk pekerjaan sistem di server,
 * mis. mengirim email notifikasi; jangan dipakai untuk membaca data atas nama pengguna.
 * Mengembalikan null bila kunci tidak diatur, sehingga fitur opsional cukup dilewati.
 */
export function buatKlienAdmin() {
  const kunci = process.env.SUPABASE_SECRET_KEY;
  if (!kunci) return null;
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, kunci, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
