"use server";

import { updateTag } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import type { HasilAksi } from "@/lib/aksi/panel";
import { kirimNotifikasiTertunda } from "@/lib/notifikasi-email";
import { TAG_DATA_PUBLIK } from "@/lib/supabase/publik";
import { buatKlienServer } from "@/lib/supabase/server";

function pesanGalat(e: { code?: string; message: string }): string {
  return ["42501", "22023"].includes(e.code ?? "") ? e.message : "Belum tersimpan. Coba lagi sebentar.";
}

const skemaRating = z.object({
  laporanId: z.uuid(),
  skor: z.number().int().min(1, "Pilih 1–5 bintang").max(5),
  komentar: z.string().trim().max(500).optional(),
});

/** Penilaian pelapor atas tindak lanjut kasus yang sudah selesai (LC-09). */
export async function beriRating(input: z.input<typeof skemaRating>): Promise<HasilAksi> {
  const v = skemaRating.safeParse(input);
  if (!v.success) return { ok: false, pesan: v.error.issues[0].message };
  const supabase = await buatKlienServer();
  const { error } = await supabase.rpc("beri_rating", {
    p_laporan_id: v.data.laporanId, p_skor: v.data.skor, p_komentar: v.data.komentar || undefined,
  });
  if (error) return { ok: false, pesan: pesanGalat(error) };
  updateTag(TAG_DATA_PUBLIK);
  return { ok: true };
}

const skemaBukaUlang = z.object({
  laporanId: z.uuid(),
  alasan: z.string().trim().min(10, "Jelaskan bagian yang belum tuntas minimal 10 karakter.").max(1000),
});

/** Buka ulang kasus yang dinilai belum tuntas, paling lambat 14 hari setelah selesai. */
export async function bukaUlangKasus(input: z.input<typeof skemaBukaUlang>): Promise<HasilAksi> {
  const v = skemaBukaUlang.safeParse(input);
  if (!v.success) return { ok: false, pesan: v.error.issues[0].message };
  const supabase = await buatKlienServer();
  const { error } = await supabase.rpc("buka_ulang_kasus", { p_laporan_id: v.data.laporanId, p_alasan: v.data.alasan });
  if (error) return { ok: false, pesan: pesanGalat(error) };
  updateTag(TAG_DATA_PUBLIK);
  after(() => kirimNotifikasiTertunda());
  return { ok: true };
}

/** Tandai notifikasi dibaca; tanpa id berarti semuanya. RLS membatasi ke milik sendiri. */
export async function tandaiDibaca(ids?: number[]): Promise<HasilAksi> {
  const supabase = await buatKlienServer();
  const { data: klaim } = await supabase.auth.getClaims();
  const id = klaim?.claims?.sub;
  if (!id) return { ok: false, pesan: "Masuk terlebih dahulu." };
  let q = supabase.from("notifikasi").update({ dibaca: true }).eq("pengguna_id", id).eq("dibaca", false);
  if (ids?.length) q = q.in("id", ids.slice(0, 100));
  const { error } = await q;
  return error ? { ok: false, pesan: "Belum tersimpan." } : { ok: true };
}

const JENIS = ["orang_tua", "siswa", "guru", "warga", "sekolah", "komite_sekolah", "kader_posyandu"] as const;
const skemaProfil = z.object({
  nama: z.string().trim().min(2, "Nama minimal 2 karakter").max(60),
  jenis: z.enum(JENIS).nullable(),
});

export async function ubahProfil(input: z.input<typeof skemaProfil>): Promise<HasilAksi> {
  const v = skemaProfil.safeParse(input);
  if (!v.success) return { ok: false, pesan: v.error.issues[0].message };
  const supabase = await buatKlienServer();
  const { data: klaim } = await supabase.auth.getClaims();
  const id = klaim?.claims?.sub;
  if (!id) return { ok: false, pesan: "Masuk terlebih dahulu." };
  const { error } = await supabase.from("profil_pengguna").update({ nama_tampilan: v.data.nama, jenis_pelapor: v.data.jenis }).eq("id", id);
  return error ? { ok: false, pesan: "Profil belum tersimpan." } : { ok: true };
}
