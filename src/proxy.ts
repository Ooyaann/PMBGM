import type { NextRequest } from "next/server";
import { perbaruiSesi } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return perbaruiSesi(request);
}

export const config = {
  // Lewati aset statis dan gambar agar proxy hanya berjalan untuk halaman dan API.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|simulasi/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
