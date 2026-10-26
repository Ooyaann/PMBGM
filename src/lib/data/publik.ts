import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { buatKlienPublik, TAG_DATA_PUBLIK } from "@/lib/supabase/publik";

export interface StatistikPublik {
  laporan_masuk: number;
  laporan_terverifikasi: number;
  laporan_ditolak: number;
  kasus_total: number;
  kasus_selesai: number;
  kasus_aktif: number;
  kasus_tidak_ditanggapi: number;
  rata_jam_respons: number | null;
  kepuasan: number | null;
  jumlah_sppg: number;
  jumlah_sekolah: number;
  jumlah_penerima: number;
}

export async function ambilStatistik(): Promise<StatistikPublik | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(TAG_DATA_PUBLIK);
  const supabase = buatKlienPublik();
  const { data } = await supabase.rpc("statistik_publik");
  return (data as unknown as StatistikPublik) ?? null;
}

export type JenisAlasan = "keracunan" | "slhs" | "laporan" | "terlambat" | "kepuasan" | "aman";
export interface Alasan {
  jenis: JenisAlasan;
  /** Label 1–3 kata untuk chip. */
  singkat: string;
  /** Kalimat lengkap untuk tooltip dan pembaca layar. */
  lengkap: string;
}

export interface SppgPrioritas {
  sppgId: string;
  nama: string;
  kecamatan: string;
  indeks: number;
  kategori: string;
  alasan: Alasan[];
}

/** Komponen indeks → alasan yang bisa dipahami orang awam (IN-03). */
export function alasanRisiko(i: {
  l: number; k: number; s: number; t: number; p: number; ada_rating: boolean;
  jumlah_laporan: number; jumlah_keracunan: number;
}): Alasan[] {
  const alasan: Alasan[] = [];
  if (i.jumlah_keracunan > 0) alasan.push({
    jenis: "keracunan", singkat: `${i.jumlah_keracunan} keracunan`,
    lengkap: `${i.jumlah_keracunan} kasus dugaan keracunan terverifikasi dalam 30 hari terakhir`,
  });
  if (i.s === 100) alasan.push({ jenis: "slhs", singkat: "Tanpa SLHS", lengkap: "Belum memiliki Sertifikat Laik Higiene Sanitasi yang berlaku" });
  if (i.l >= 60) alasan.push({
    jenis: "laporan", singkat: `${i.jumlah_laporan} laporan`,
    lengkap: `${i.jumlah_laporan} laporan terverifikasi dalam 30 hari, tinggi dibanding SPPG lain per 1.000 porsi`,
  });
  if (i.t >= 50) alasan.push({
    jenis: "terlambat", singkat: `${Math.round(i.t)}% terlambat`,
    lengkap: `${Math.round(i.t)}% kasus melewati batas waktu tindak lanjut`,
  });
  if (i.ada_rating && i.p < 45) alasan.push({ jenis: "kepuasan", singkat: "Kepuasan rendah", lengkap: "Rata-rata penilaian pelapor atas tindak lanjut rendah" });
  return alasan.length ? alasan : [{ jenis: "aman", singkat: "Tanpa faktor menonjol", lengkap: "Tidak ada faktor risiko yang menonjol" }];
}

export async function ambilPrioritasInspeksi(batas = 5): Promise<SppgPrioritas[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(TAG_DATA_PUBLIK);
  const supabase = buatKlienPublik();
  const { data: indeks } = await supabase
    .from("indeks_risiko")
    .select("sppg_id, indeks, kategori_risiko, l, k, s, t, p, ada_rating, jumlah_laporan, jumlah_keracunan")
    .order("indeks", { ascending: false })
    .limit(batas);
  if (!indeks?.length) return [];

  const { data: sppg } = await supabase
    .from("sppg")
    .select("id, nama, wilayah:wilayah_id (nama)")
    .in("id", indeks.map((i) => i.sppg_id!));
  const peta = new Map(sppg?.map((s) => [s.id, s]));

  return indeks.map((i) => ({
    sppgId: i.sppg_id!,
    nama: peta.get(i.sppg_id!)?.nama ?? "SPPG",
    kecamatan: peta.get(i.sppg_id!)?.wilayah?.nama ?? "",
    indeks: Number(i.indeks),
    kategori: i.kategori_risiko ?? "rendah",
    alasan: alasanRisiko({
      l: Number(i.l), k: Number(i.k), s: Number(i.s), t: Number(i.t), p: Number(i.p),
      ada_rating: Boolean(i.ada_rating), jumlah_laporan: i.jumlah_laporan ?? 0, jumlah_keracunan: i.jumlah_keracunan ?? 0,
    }),
  }));
}

/** Metrik positif juga ditampilkan (PRD 7.2): kecamatan paling responsif. */
export async function ambilKecamatanResponsif() {
  "use cache";
  cacheLife("minutes");
  cacheTag(TAG_DATA_PUBLIK);
  const supabase = buatKlienPublik();
  const { data } = await supabase
    .from("v_akuntabilitas_kecamatan")
    .select("wilayah_id, nama, jumlah_kasus, persen_selesai, rata_jam_respons, persen_terlambat, kepuasan")
    .gte("jumlah_kasus", 10)
    .order("persen_terlambat", { ascending: true })
    .order("rata_jam_respons", { ascending: true })
    .limit(1)
    .maybeSingle();
  return data;
}

/** Kasus terkini untuk kartu pelacakan di hero: selalu memuat kasus paling mutakhir yang ada pembaruan di database. */
export async function ambilKasusSorotan() {
  "use cache";
  cacheLife("minutes");
  cacheTag(TAG_DATA_PUBLIK);
  const supabase = buatKlienPublik();
  const { data: kasus } = await supabase
    .from("v_kasus_publik")
    .select("id, kode_kasus, judul, kategori, status, sppg_nama, kecamatan_nama, instansi_nama, jumlah_laporan, terlambat, tidak_ditanggapi, tenggat_tahap, status_sejak")
    .order("status_sejak", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!kasus?.id) return null;
  const { data: timeline } = await supabase.rpc("timeline_kasus", { p_kasus_id: kasus.id });
  return { kasus, timeline: timeline ?? [] };
}

export type TahapSla = "diterima" | "diverifikasi" | "diteruskan" | "ditindaklanjuti" | "dibuka_ulang";
export type AturanSla = Record<string, Partial<Record<TahapSla, number>>>;

/** Batas waktu per kategori dan tahap (jam), sesuai yang berlaku di database. */
export async function ambilAturanSla(): Promise<AturanSla> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAG_DATA_PUBLIK);
  const supabase = buatKlienPublik();
  const { data } = await supabase.from("aturan_sla").select("kategori, tahap, batas_jam");
  const hasil: AturanSla = {};
  for (const r of data ?? []) (hasil[r.kategori] ??= {})[r.tahap as TahapSla] = r.batas_jam;
  return hasil;
}
