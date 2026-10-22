import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { komponenIndeks, type KomponenIndeks } from "@/lib/indeks";
import type { SumberData } from "@/lib/label";
import { buatKlienPublik, TAG_DATA_PUBLIK } from "@/lib/supabase/publik";

// ---------------------------------------------------------------------------
// IN-06: perbandingan 2–3 SPPG, kecamatan, atau kab/kota.
// Semua jenis menghasilkan bentuk yang sama sehingga satu tampilan melayani ketiganya.
// ---------------------------------------------------------------------------
export type JenisBanding = "sppg" | "kecamatan" | "kabkota";
export const JENIS_BANDING: JenisBanding[] = ["sppg", "kecamatan", "kabkota"];

export type FormatMetrik = "angka" | "persen" | "skor" | "jam" | "rupiah" | "rating" | "desimal";

export interface ButirBanding {
  id: string;
  nama: string;
  sub: string;
  href: string;
  skor: number | null;
}

export interface MetrikBanding {
  kunci: string;
  label: string;
  /** Arah yang lebih baik; null bila angka hanya konteks (mis. jumlah penerima). */
  baik: "tinggi" | "rendah" | null;
  format: FormatMetrik;
  nilai: (number | null)[];
  /** Teks pengganti angka (mis. status SLHS). */
  teks?: (string | null)[];
  /** Tampil juga di Mode Warga. */
  warga: boolean;
}

export interface SeriBanding {
  judul: string;
  format: "skor" | "angka" | "persen";
  domain?: [number, number];
  ambang?: { nilai: number; label: string }[];
  label: string[];
  /** nilai[i][j]: butir ke-i, titik ke-j. */
  nilai: (number | null)[][];
}

export interface HasilBanding {
  jenis: JenisBanding;
  sumber: SumberData;
  butir: ButirBanding[];
  metrik: MetrikBanding[];
  komponen?: KomponenIndeks[][];
  seri?: SeriBanding;
}

export interface PilihanBanding {
  id: string;
  nama: string;
  sub: string;
}

const n = (v: number | string | null | undefined) => (v == null ? null : Number(v));
const bulanPendek = (iso: string) =>
  new Intl.DateTimeFormat("id-ID", { month: "short", timeZone: "UTC" }).format(new Date(`${iso.slice(0, 10)}T00:00:00Z`));

export async function ambilPilihanBanding(): Promise<Record<JenisBanding, PilihanBanding[]>> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAG_DATA_PUBLIK);
  const supabase = buatKlienPublik();
  const [{ data: sppg }, { data: wilayah }] = await Promise.all([
    supabase.from("sppg").select("id, nama, wilayah:wilayah_id (nama)").order("nama"),
    supabase.from("wilayah").select("id, nama, level").in("level", ["kabkota", "kecamatan"]).order("nama"),
  ]);
  return {
    sppg: (sppg ?? []).map((s) => ({ id: s.id, nama: s.nama, sub: s.wilayah?.nama ?? "" })),
    kecamatan: (wilayah ?? []).filter((w) => w.level === "kecamatan").map((w) => ({ id: w.id, nama: w.nama, sub: "Kota Semarang" })),
    kabkota: (wilayah ?? []).filter((w) => w.level === "kabkota").map((w) => ({ id: w.id, nama: w.nama, sub: "Jawa Tengah" })),
  };
}

/** Saran awal saat belum ada pilihan: dua teratas dan satu terbawah menurut risiko. */
export async function saranBanding(jenis: JenisBanding): Promise<string[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(TAG_DATA_PUBLIK);
  const supabase = buatKlienPublik();
  if (jenis === "sppg") {
    const { data } = await supabase.from("indeks_risiko").select("sppg_id, indeks").order("indeks", { ascending: false });
    const d = data ?? [];
    return [d[0]?.sppg_id, d.at(-1)?.sppg_id].filter((x): x is string => !!x);
  }
  if (jenis === "kecamatan") {
    const { data } = await supabase.from("v_risiko_kecamatan").select("wilayah_id, skor_tertinggi")
      .eq("induk_id", "33.74").not("skor_tertinggi", "is", null).order("skor_tertinggi", { ascending: false });
    const d = data ?? [];
    return [d[0]?.wilayah_id, d.at(-1)?.wilayah_id].filter((x): x is string => !!x);
  }
  const { data } = await supabase.from("v_ringkasan_kabkota").select("wilayah_id, kasus_per_100rb_penerima")
    .order("kasus_per_100rb_penerima", { ascending: false });
  const d = data ?? [];
  return ["33.74", d[0]?.wilayah_id].filter((x, i, a): x is string => !!x && a.indexOf(x) === i);
}

function urutkan<T>(ids: string[], baris: T[], kunci: (b: T) => string | null): (T | undefined)[] {
  const peta = new Map(baris.map((b) => [kunci(b), b]));
  return ids.map((id) => peta.get(id));
}

export async function ambilBanding(jenis: JenisBanding, ids: string[]): Promise<HasilBanding | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(TAG_DATA_PUBLIK);
  if (ids.length < 2) return null;
  if (jenis === "sppg") return bandingSppg(ids);
  if (jenis === "kecamatan") return bandingKecamatan(ids);
  return bandingKabkota(ids);
}

async function bandingSppg(ids: string[]): Promise<HasilBanding | null> {
  const supabase = buatKlienPublik();
  const [{ data: sppg }, { data: indeks }, { data: akun }, { data: sekolah }, ...riwayat] = await Promise.all([
    supabase.from("sppg").select("id, nama, kapasitas_porsi_harian, status_slhs, wilayah:wilayah_id (nama)").in("id", ids),
    supabase.from("indeks_risiko").select("*").in("sppg_id", ids),
    supabase.from("v_akuntabilitas_sppg").select("*").in("sppg_id", ids),
    supabase.from("sekolah").select("sppg_id, jumlah_siswa").in("sppg_id", ids),
    ...ids.map((id) => supabase.rpc("riwayat_indeks_sppg", { p_sppg_id: id, p_minggu: 12 })),
  ]);
  const s = urutkan(ids, sppg ?? [], (x) => x.id);
  if (s.some((x) => !x)) return null;
  const i = urutkan(ids, indeks ?? [], (x) => x.sppg_id);
  const a = urutkan(ids, akun ?? [], (x) => x.sppg_id);
  const siswa = ids.map((id) => (sekolah ?? []).filter((x) => x.sppg_id === id));
  const SLHS: Record<string, string> = { berlaku: "Berlaku", proses: "Diproses", kedaluwarsa: "Kedaluwarsa", tidak_ada: "Belum ada" };
  const rw = riwayat.map((r) => (r.data ?? []) as { periode_akhir: string; indeks: number }[]);

  return {
    jenis: "sppg",
    sumber: "laporan_warga_terverifikasi",
    butir: s.map((x, k) => ({
      id: x!.id, nama: x!.nama, sub: x!.wilayah?.nama ?? "", href: `/data/sppg/${x!.id}`, skor: n(i[k]?.indeks),
    })),
    metrik: [
      { kunci: "indeks", label: "Indeks risiko", baik: "rendah", format: "skor", warga: true, nilai: i.map((x) => n(x?.indeks)) },
      { kunci: "keracunan", label: "Keracunan · 30 hari", baik: "rendah", format: "angka", warga: true, nilai: i.map((x) => x?.jumlah_keracunan ?? 0) },
      { kunci: "laporan", label: "Laporan terverifikasi · 30 hari", baik: "rendah", format: "angka", warga: false, nilai: i.map((x) => x?.jumlah_laporan ?? 0) },
      { kunci: "selesai", label: "Kasus selesai", baik: "tinggi", format: "persen", warga: true, nilai: a.map((x) => n(x?.persen_selesai)) },
      { kunci: "respons", label: "Rata-rata waktu tanggap", baik: "rendah", format: "jam", warga: true, nilai: a.map((x) => n(x?.rata_jam_respons)) },
      { kunci: "terlambat", label: "Kasus lewat batas waktu", baik: "rendah", format: "persen", warga: false, nilai: a.map((x) => n(x?.persen_terlambat)) },
      { kunci: "abaikan", label: "Tidak ditanggapi", baik: "rendah", format: "angka", warga: false, nilai: a.map((x) => x?.kasus_tidak_ditanggapi ?? 0) },
      { kunci: "kepuasan", label: "Kepuasan pelapor", baik: "tinggi", format: "rating", warga: true, nilai: a.map((x) => n(x?.kepuasan)) },
      {
        kunci: "slhs", label: "Sertifikat higiene (SLHS)", baik: "tinggi", format: "angka", warga: true,
        nilai: s.map((x) => (x!.status_slhs === "berlaku" ? 1 : 0)), teks: s.map((x) => SLHS[x!.status_slhs] ?? x!.status_slhs),
      },
      { kunci: "porsi", label: "Porsi per hari", baik: null, format: "angka", warga: false, nilai: s.map((x) => x!.kapasitas_porsi_harian) },
      { kunci: "sekolah", label: "Sekolah dilayani", baik: null, format: "angka", warga: false, nilai: siswa.map((x) => x.length) },
      { kunci: "penerima", label: "Penerima", baik: null, format: "angka", warga: false, nilai: siswa.map((x) => x.reduce((t, y) => t + y.jumlah_siswa, 0)) },
      { kunci: "l_mentah", label: "Laporan per 1.000 porsi", baik: "rendah", format: "desimal", warga: false, nilai: i.map((x) => n(x?.l_mentah)) },
      { kunci: "k_mentah", label: "Keracunan per 1.000 porsi", baik: "rendah", format: "desimal", warga: false, nilai: i.map((x) => n(x?.k_mentah)) },
    ],
    komponen: i.map((x) => (x ? komponenIndeks(x) : [])),
    seri: {
      judul: "Indeks · 12 minggu",
      format: "skor",
      domain: [0, 100],
      ambang: [{ nilai: 70, label: "Tinggi" }, { nilai: 40, label: "Sedang" }],
      label: (rw[0] ?? []).map((r) => new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" }).format(new Date(r.periode_akhir))),
      nilai: rw.map((r) => r.map((x) => n(x.indeks))),
    },
  };
}

async function bandingKecamatan(ids: string[]): Promise<HasilBanding | null> {
  const supabase = buatKlienPublik();
  const [{ data: wil }, { data: risiko }, { data: akun }, { data: kasus }, { data: anggaran }] = await Promise.all([
    supabase.from("wilayah").select("id, nama").eq("level", "kecamatan").in("id", ids),
    supabase.from("v_risiko_kecamatan").select("*").in("wilayah_id", ids),
    supabase.from("v_akuntabilitas_kecamatan").select("*").in("wilayah_id", ids),
    supabase.from("v_kasus_kecamatan_bulanan").select("wilayah_id, bulan, kategori, jumlah_kasus").in("wilayah_id", ids),
    supabase.from("anggaran_bulanan").select("wilayah_id, bulan, jumlah_penerima").in("wilayah_id", ids).order("bulan", { ascending: false }),
  ]);
  const w = urutkan(ids, wil ?? [], (x) => x.id);
  if (w.some((x) => !x)) return null;
  const r = urutkan(ids, risiko ?? [], (x) => x.wilayah_id);
  const a = urutkan(ids, akun ?? [], (x) => x.wilayah_id);
  const penerima = ids.map((id) => (anggaran ?? []).find((x) => x.wilayah_id === id)?.jumlah_penerima ?? null);

  // Kasus per bulan, 6 bulan terakhir yang ada datanya.
  const bulan = [...new Set((kasus ?? []).map((k) => k.bulan!))].sort().slice(-6);
  const jumlah = (id: string, b: string, kategori?: string) => (kasus ?? [])
    .filter((k) => k.wilayah_id === id && k.bulan === b && (!kategori || k.kategori === kategori))
    .reduce((t, k) => t + (k.jumlah_kasus ?? 0), 0);

  return {
    jenis: "kecamatan",
    sumber: "laporan_warga_terverifikasi",
    butir: w.map((x, k) => ({ id: x!.id, nama: x!.nama, sub: "Kota Semarang", href: `/data/wilayah/${x!.id}`, skor: n(r[k]?.skor_tertinggi) })),
    metrik: [
      { kunci: "tertinggi", label: "Risiko SPPG tertinggi", baik: "rendah", format: "skor", warga: true, nilai: r.map((x) => n(x?.skor_tertinggi)) },
      { kunci: "rata", label: "Rata-rata risiko (berbobot porsi)", baik: "rendah", format: "skor", warga: false, nilai: r.map((x) => n(x?.skor_rata_berbobot)) },
      { kunci: "keracunan", label: "Keracunan · 6 bulan", baik: "rendah", format: "angka", warga: true, nilai: ids.map((id) => bulan.reduce((t, b) => t + jumlah(id, b, "keracunan"), 0)) },
      { kunci: "kasus", label: "Semua kasus", baik: "rendah", format: "angka", warga: false, nilai: a.map((x) => x?.jumlah_kasus ?? 0) },
      { kunci: "selesai", label: "Kasus selesai", baik: "tinggi", format: "persen", warga: true, nilai: a.map((x) => n(x?.persen_selesai)) },
      { kunci: "respons", label: "Rata-rata waktu tanggap", baik: "rendah", format: "jam", warga: true, nilai: a.map((x) => n(x?.rata_jam_respons)) },
      { kunci: "terlambat", label: "Kasus lewat batas waktu", baik: "rendah", format: "persen", warga: false, nilai: a.map((x) => n(x?.persen_terlambat)) },
      { kunci: "abaikan", label: "Tidak ditanggapi", baik: "rendah", format: "angka", warga: false, nilai: a.map((x) => x?.kasus_tidak_ditanggapi ?? 0) },
      { kunci: "kepuasan", label: "Kepuasan pelapor", baik: "tinggi", format: "rating", warga: true, nilai: a.map((x) => n(x?.kepuasan)) },
      { kunci: "sppg", label: "SPPG terpantau", baik: null, format: "angka", warga: false, nilai: r.map((x) => x?.jumlah_sppg ?? 0) },
      { kunci: "penerima", label: "Penerima", baik: null, format: "angka", warga: false, nilai: penerima },
    ],
    seri: {
      judul: "Kasus terverifikasi per bulan",
      format: "angka",
      label: bulan.map(bulanPendek),
      nilai: ids.map((id) => bulan.map((b) => jumlah(id, b))),
    },
  };
}

async function bandingKabkota(ids: string[]): Promise<HasilBanding | null> {
  const supabase = buatKlienPublik();
  const [{ data: wil }, { data: ringkas }, { data: anggaran }] = await Promise.all([
    supabase.from("wilayah").select("id, nama").eq("level", "kabkota").in("id", ids),
    supabase.from("v_ringkasan_kabkota").select("*").in("wilayah_id", ids),
    supabase.from("v_anggaran").select("wilayah_id, bulan, pagu, persen_realisasi, realisasi_per_penerima").in("wilayah_id", ids).order("bulan"),
  ]);
  const w = urutkan(ids, wil ?? [], (x) => x.id);
  if (w.some((x) => !x)) return null;
  const r = urutkan(ids, ringkas ?? [], (x) => x.wilayah_id);
  // Bulan berjalan belum tutup: perbandingan realisasi memakai bulan terakhir yang lengkap.
  const semuaBulan = [...new Set((anggaran ?? []).map((x) => x.bulan!))].sort();
  const bulanTutup = semuaBulan.at(-2) ?? semuaBulan.at(-1);
  const pada = (id: string, b?: string) => (anggaran ?? []).find((x) => x.wilayah_id === id && x.bulan === b);
  const bulanSeri = semuaBulan.slice(0, -1);

  return {
    jenis: "kabkota",
    sumber: "simulasi",
    butir: w.map((x) => ({ id: x!.id, nama: x!.nama, sub: "Jawa Tengah", href: `/data/wilayah/${x!.id}`, skor: null })),
    metrik: [
      { kunci: "per100rb", label: "Keracunan per 100 rb penerima · 3 bulan", baik: "rendah", format: "desimal", warga: true, nilai: r.map((x) => n(x?.kasus_per_100rb_penerima)) },
      { kunci: "kasus", label: "Kasus keracunan · 3 bulan", baik: "rendah", format: "angka", warga: true, nilai: r.map((x) => x?.kasus_keracunan_3_bulan ?? 0) },
      { kunci: "korban", label: "Korban · 3 bulan", baik: "rendah", format: "angka", warga: false, nilai: r.map((x) => x?.korban_keracunan_3_bulan ?? 0) },
      { kunci: "realisasi", label: `Realisasi anggaran · ${bulanTutup ? bulanPendek(bulanTutup) : ""}`, baik: "tinggi", format: "persen", warga: true, nilai: ids.map((id) => n(pada(id, bulanTutup)?.persen_realisasi)) },
      { kunci: "per_penerima", label: "Realisasi per penerima", baik: null, format: "rupiah", warga: false, nilai: ids.map((id) => n(pada(id, bulanTutup)?.realisasi_per_penerima)) },
      { kunci: "pagu", label: "Pagu bulanan", baik: null, format: "rupiah", warga: false, nilai: ids.map((id) => n(pada(id, bulanTutup)?.pagu)) },
      { kunci: "penerima", label: "Penerima", baik: null, format: "angka", warga: true, nilai: r.map((x) => x?.jumlah_penerima ?? null) },
      { kunci: "sppg", label: "SPPG", baik: null, format: "angka", warga: false, nilai: r.map((x) => x?.jumlah_sppg ?? null) },
    ],
    seri: {
      judul: "Realisasi anggaran per bulan",
      format: "persen",
      domain: [0, 100],
      label: bulanSeri.map(bulanPendek),
      nilai: ids.map((id) => bulanSeri.map((b) => n(pada(id, b)?.persen_realisasi))),
    },
  };
}
