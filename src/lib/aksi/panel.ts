"use server";

import { updateTag } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { kirimNotifikasiTertunda } from "@/lib/notifikasi-email";
import { TAG_DATA_PUBLIK } from "@/lib/supabase/publik";
import { buatKlienServer } from "@/lib/supabase/server";

export type HasilAksi<T = undefined> = { ok: true; data?: T } | { ok: false; pesan: string };

/** Pesan dari RPC (cek peran, status, input) sudah berbahasa Indonesia; selain itu pesan umum. */
function pesanGalat(e: { code?: string; message: string } | null): string {
  if (!e) return "Terjadi kesalahan.";
  return ["42501", "22023", "23514"].includes(e.code ?? "") ? e.message : "Aksi gagal. Coba lagi sebentar.";
}

/** Setelah status berubah: segarkan data publik yang di-cache dan kirim email notifikasi di latar. */
function setelahBerubah() {
  updateTag(TAG_DATA_PUBLIK);
  after(() => kirimNotifikasiTertunda());
}

const uuid = z.uuid();
const teks = (maks: number) => z.string().trim().max(maks);

const CHECKLIST = ["bukti_relevan", "waktu_lokasi_wajar", "bukan_duplikat_spam", "kategori_sesuai"] as const;
const skemaChecklist = z.record(z.enum(CHECKLIST), z.boolean()).optional();

// ---------------------------------------------------------------------------
// Verifikator (LP-09)
// ---------------------------------------------------------------------------
const skemaVerifikasi = z.object({
  laporanIds: z.array(uuid).min(1, "Pilih minimal satu laporan").max(50),
  kasusId: uuid.nullable(),
  judul: teks(140).optional(),
  catatan: teks(1000).optional(),
  checklist: skemaChecklist,
});

export async function verifikasiLaporan(input: z.input<typeof skemaVerifikasi>): Promise<HasilAksi<{ kasusId: string }>> {
  const v = skemaVerifikasi.safeParse(input);
  if (!v.success) return { ok: false, pesan: v.error.issues[0].message };
  const d = v.data;
  if (d.checklist && !CHECKLIST.every((k) => d.checklist![k])) {
    return { ok: false, pesan: "Lengkapi semua butir pemeriksaan sebelum memverifikasi." };
  }
  const supabase = await buatKlienServer();
  const { data, error } = await supabase.rpc("verifikasi_laporan", {
    p_laporan_ids: d.laporanIds,
    p_kasus_id: d.kasusId ?? undefined,
    p_checklist: d.checklist ?? undefined,
    p_catatan: d.catatan || undefined,
    p_judul: d.judul || undefined,
  });
  if (error) return { ok: false, pesan: pesanGalat(error) };
  setelahBerubah();
  return { ok: true, data: { kasusId: data } };
}

const skemaTolak = z.object({
  laporanId: uuid,
  alasan: teks(500).min(10, "Tulis alasan penolakan minimal 10 karakter agar pelapor paham."),
  checklist: skemaChecklist,
});

export async function tolakLaporan(input: z.input<typeof skemaTolak>): Promise<HasilAksi> {
  const v = skemaTolak.safeParse(input);
  if (!v.success) return { ok: false, pesan: v.error.issues[0].message };
  const supabase = await buatKlienServer();
  const { error } = await supabase.rpc("tolak_laporan", {
    p_laporan_id: v.data.laporanId, p_alasan: v.data.alasan, p_checklist: v.data.checklist ?? undefined,
  });
  if (error) return { ok: false, pesan: pesanGalat(error) };
  setelahBerubah();
  return { ok: true };
}

const skemaTeruskan = z.object({ kasusId: uuid, instansiId: z.uuid("Pilih instansi tujuan"), catatan: teks(1000).optional() });

export async function teruskanKasus(input: z.input<typeof skemaTeruskan>): Promise<HasilAksi> {
  const v = skemaTeruskan.safeParse(input);
  if (!v.success) return { ok: false, pesan: v.error.issues[0].message };
  const supabase = await buatKlienServer();
  const { error } = await supabase.rpc("teruskan_kasus", {
    p_kasus_id: v.data.kasusId, p_instansi_id: v.data.instansiId, p_catatan: v.data.catatan || undefined,
  });
  if (error) return { ok: false, pesan: pesanGalat(error) };
  setelahBerubah();
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Instansi (LC-04)
// ---------------------------------------------------------------------------
const TINDAKAN = ["inspeksi", "penutupan_sementara", "perbaikan", "klarifikasi", "pembinaan", "lainnya"] as const;
// Path bukti diunggah langsung dari browser ke bucket tindak-lanjut: <kasus_id>/<uuid>.<ext>
const skemaPath = z.string().regex(/^[0-9a-f-]{36}\/[0-9a-f-]{36}\.(webp|jpg|jpeg|png|pdf)$/i, "Berkas bukti tidak valid");

const skemaTindakLanjut = z.object({
  kasusId: uuid,
  jenis: z.enum(TINDAKAN, "Pilih jenis tindakan"),
  catatan: teks(2000).min(10, "Jelaskan tindakan yang dilakukan minimal 10 karakter."),
  bukti: z.array(skemaPath).max(6).default([]),
});

export async function tindakLanjutKasus(input: z.input<typeof skemaTindakLanjut>): Promise<HasilAksi> {
  const v = skemaTindakLanjut.safeParse(input);
  if (!v.success) return { ok: false, pesan: v.error.issues[0].message };
  if (v.data.bukti.some((p) => !p.startsWith(v.data.kasusId))) return { ok: false, pesan: "Berkas bukti tidak cocok dengan kasus." };
  const supabase = await buatKlienServer();
  const { error } = await supabase.rpc("tindak_lanjut_kasus", {
    p_kasus_id: v.data.kasusId, p_jenis: v.data.jenis, p_catatan: v.data.catatan, p_bukti_paths: v.data.bukti,
  });
  if (error) return { ok: false, pesan: pesanGalat(error) };
  setelahBerubah();
  return { ok: true };
}

const skemaSelesai = z.object({
  kasusId: uuid,
  catatan: teks(2000).min(10, "Ringkas hasil penyelesaian minimal 10 karakter."),
  bukti: z.array(skemaPath).max(6).default([]),
});

export async function selesaikanKasus(input: z.input<typeof skemaSelesai>): Promise<HasilAksi> {
  const v = skemaSelesai.safeParse(input);
  if (!v.success) return { ok: false, pesan: v.error.issues[0].message };
  if (v.data.bukti.some((p) => !p.startsWith(v.data.kasusId))) return { ok: false, pesan: "Berkas bukti tidak cocok dengan kasus." };
  const supabase = await buatKlienServer();
  const { error } = await supabase.rpc("selesaikan_kasus", {
    p_kasus_id: v.data.kasusId, p_catatan: v.data.catatan, p_bukti_paths: v.data.bukti,
  });
  if (error) return { ok: false, pesan: pesanGalat(error) };
  setelahBerubah();
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Admin (LM-04, LM-06)
// ---------------------------------------------------------------------------
const skemaPeran = z.object({
  penggunaId: uuid,
  peran: z.enum(["pelapor", "verifikator", "instansi", "admin"]),
  instansiId: uuid.nullable(),
  terverifikasi: z.boolean(),
}).refine((d) => d.peran !== "instansi" || d.instansiId, { message: "Pilih instansi untuk peran Instansi." });

export async function aturPeran(input: z.input<typeof skemaPeran>): Promise<HasilAksi> {
  const v = skemaPeran.safeParse(input);
  if (!v.success) return { ok: false, pesan: v.error.issues[0].message };
  const supabase = await buatKlienServer();
  const { data: klaim } = await supabase.auth.getClaims();
  if (klaim?.claims?.sub === v.data.penggunaId && v.data.peran !== "admin") {
    return { ok: false, pesan: "Anda tidak bisa mencabut peran admin dari akun sendiri." };
  }
  const { error } = await supabase.rpc("atur_peran_pengguna", {
    p_pengguna_id: v.data.penggunaId,
    p_peran: v.data.peran,
    p_instansi_id: v.data.instansiId ?? undefined,
    p_terverifikasi: v.data.terverifikasi,
  });
  if (error) return { ok: false, pesan: pesanGalat(error) };
  return { ok: true };
}

const KATEGORI = ["keracunan", "makanan_tidak_layak", "kebersihan", "gizi_porsi", "distribusi", "pengadaan", "lainnya"] as const;
const TAHAP = ["diterima", "diverifikasi", "diteruskan", "ditindaklanjuti", "dibuka_ulang"] as const;
const skemaSla = z.object({
  kategori: z.enum(KATEGORI),
  tahap: z.enum(TAHAP),
  batasJam: z.number().int("Batas waktu dalam jam bulat").min(1, "Minimal 1 jam").max(24 * 60, "Maksimal 60 hari"),
});

/** Ubah satu batas waktu (LM-06). Berlaku untuk tahap yang dimulai setelah perubahan. */
export async function simpanSla(input: z.input<typeof skemaSla>): Promise<HasilAksi> {
  const v = skemaSla.safeParse(input);
  if (!v.success) return { ok: false, pesan: v.error.issues[0].message };
  const supabase = await buatKlienServer();
  const { error, count } = await supabase
    .from("aturan_sla")
    .upsert({ kategori: v.data.kategori, tahap: v.data.tahap, batas_jam: v.data.batasJam }, { count: "exact" });
  if (error) return { ok: false, pesan: error.code === "42501" ? "Hanya admin yang bisa mengubah batas waktu." : "Batas waktu belum tersimpan." };
  if (count === 0) return { ok: false, pesan: "Hanya admin yang bisa mengubah batas waktu." };
  updateTag(TAG_DATA_PUBLIK);
  return { ok: true };
}
