import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";

/** Awalan rute panel internal yang wajib login (verifikator, instansi, admin). */
const RUTE_PANEL = "/panel";
/** Rute akun pelapor yang wajib login. */
const RUTE_AKUN = "/akun";

/**
 * Memperbarui token sesi di setiap permintaan, lalu mengalihkan pengunjung yang belum login
 * dari halaman terlindungi. Pemeriksaan peran yang sebenarnya tetap di server dan RLS.
 */
export async function perbaruiSesi(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          Object.entries(headers).forEach(([kunci, nilai]) => response.headers.set(kunci, nilai));
        },
      },
    },
  );

  // Jangan sisipkan kode di antara pembuatan klien dan getClaims(): sesi bisa terputus acak.
  const { data } = await supabase.auth.getClaims();
  const masuk = Boolean(data?.claims);

  const { pathname } = request.nextUrl;
  if (!masuk && (pathname.startsWith(RUTE_PANEL) || pathname.startsWith(RUTE_AKUN))) {
    const url = request.nextUrl.clone();
    url.pathname = "/masuk";
    url.searchParams.set("lanjut", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}
