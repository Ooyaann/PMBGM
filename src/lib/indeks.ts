import { persen } from "@/lib/format";

/** Kolom indeks_risiko yang dibutuhkan untuk menguraikan skor. */
export interface NilaiIndeks {
  l: number | string | null;
  k: number | string | null;
  s: number | string | null;
  t: number | string | null;
  p: number | string | null;
  ada_rating: boolean | null;
  jumlah_laporan: number | null;
  jumlah_keracunan: number | null;
}

export interface KomponenIndeks {
  kunci: "l" | "k" | "s" | "t" | "p";
  label: string;
  /** Sumbangan ke skor 0–100 (sudah dikali bobot). */
  nilai: number;
  bobot: number;
  warna: string;
  keterangan: string;
}

/** Bobot rumus PRD 9.4: 0,35L + 0,25K + 0,15S + 0,15T + 0,10(100 − P). */
export const BOBOT = { l: 0.35, k: 0.25, s: 0.15, t: 0.15, p: 0.1 } as const;

/** Warna tetap per komponen, dipakai di profil SPPG, prioritas, perbandingan, dan PDF. */
export const KOMPONEN = [
  { kunci: "l", label: "Laporan", warna: "var(--chart-1)", hex: "#2a78d6" },
  { kunci: "k", label: "Keracunan", warna: "var(--chart-2)", hex: "#eb6834" },
  { kunci: "s", label: "SLHS", warna: "var(--chart-3)", hex: "#1baf7a" },
  { kunci: "t", label: "Keterlambatan", warna: "var(--chart-4)", hex: "#eda100" },
  { kunci: "p", label: "Kepuasan", warna: "var(--chart-5)", hex: "#e87ba4" },
] as const;

/** Uraikan skor indeks menjadi sumbangan tiap komponen. */
export function komponenIndeks(i: NilaiIndeks): KomponenIndeks[] {
  const n = (v: number | string | null) => Number(v ?? 0);
  const p = n(i.p);
  const isi = {
    l: { nilai: BOBOT.l * n(i.l), keterangan: `${i.jumlah_laporan ?? 0} terverifikasi · 30 hari` },
    k: { nilai: BOBOT.k * n(i.k), keterangan: `${i.jumlah_keracunan ?? 0} kasus · 30 hari` },
    s: { nilai: BOBOT.s * n(i.s), keterangan: n(i.s) === 100 ? "Belum berlaku" : "Berlaku" },
    t: { nilai: BOBOT.t * n(i.t), keterangan: `${persen(n(i.t))} kasus lewat batas` },
    p: { nilai: BOBOT.p * (100 - p), keterangan: i.ada_rating ? `Skor kepuasan ${Math.round(p)}/100` : "Belum ada penilaian (netral)" },
  };
  return KOMPONEN.map((k) => ({ kunci: k.kunci, label: k.label, warna: k.warna, bobot: BOBOT[k.kunci], ...isi[k.kunci] }));
}
