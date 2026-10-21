import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

/**
 * Klien Supabase untuk Server Component, Server Action, dan Route Handler.
 * Berjalan dengan sesi pengguna, jadi semua query tunduk pada RLS.
 */
export async function buatKlienServer() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Dipanggil dari Server Component (cookie hanya-baca). Sesi diperbarui oleh proxy.
          }
        },
      },
    },
  );
}
