import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Klien anonim tanpa cookie untuk data publik. Karena tidak bergantung pada sesi,
 * hasilnya aman di-cache dengan "use cache" dan ikut dalam prerender halaman.
 * Yang terbaca dibatasi RLS untuk peran anon (hanya data terverifikasi).
 */
export function buatKlienPublik() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

/** Tag cache untuk data publik; di-revalidate saat ada verifikasi atau tindak lanjut. */
export const TAG_DATA_PUBLIK = "data-publik";
