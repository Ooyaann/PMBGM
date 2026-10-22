import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { buatKlienServer } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type Peran = Database["public"]["Enums"]["peran_pengguna"];

export interface Pengguna {
  id: string;
  email: string | null;
  nama: string;
  peran: Peran;
  terverifikasi: boolean;
  instansiId: string | null;
  sekolahId: string | null;
}

/**
 * Pengguna yang sedang masuk, atau null. Di-cache per permintaan.
 * Identitas diambil dari klaim JWT yang sudah diverifikasi (getClaims), bukan dari cookie mentah.
 */
export const ambilPengguna = cache(async (): Promise<Pengguna | null> => {
  // Verifikasi token memakai jam saat ini, jadi wajib berjalan saat request, bukan saat prefetch App Shell.
  await connection();
  const supabase = await buatKlienServer();
  const { data } = await supabase.auth.getClaims();
  const klaim = data?.claims;
  if (!klaim?.sub) return null;

  const { data: profil } = await supabase
    .from("profil_pengguna")
    .select("nama_tampilan, peran, terverifikasi, instansi_id, sekolah_id")
    .eq("id", klaim.sub)
    .single();

  return {
    id: klaim.sub,
    email: (klaim.email as string | undefined) ?? null,
    nama: profil?.nama_tampilan ?? "Pengguna",
    peran: profil?.peran ?? "pelapor",
    terverifikasi: profil?.terverifikasi ?? false,
    instansiId: profil?.instansi_id ?? null,
    sekolahId: profil?.sekolah_id ?? null,
  };
});

/**
 * Penjaga halaman panel: wajib masuk dan punya salah satu peran. Pelapor diarahkan ke akunnya,
 * staf dengan peran lain ke beranda panel. RLS dan RPC tetap memeriksa ulang di database.
 */
export async function wajibPeran(...peran: Peran[]): Promise<Pengguna> {
  const p = await ambilPengguna();
  if (!p) redirect("/masuk?lanjut=/panel");
  if (!peran.includes(p.peran)) redirect(p.peran === "pelapor" ? "/akun" : "/panel");
  return p;
}

export const LABEL_PERAN: Record<Peran, string> = {
  pelapor: "Pelapor",
  verifikator: "Verifikator",
  instansi: "Instansi",
  admin: "Admin",
};
