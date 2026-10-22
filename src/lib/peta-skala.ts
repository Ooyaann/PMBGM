import type { KategoriRisiko } from "@/lib/label";

/**
 * Skala warna peta. Dipakai bersama oleh peta web (variabel CSS) dan PDF (hex),
 * jadi keduanya selalu membaca kelas yang sama.
 */

/** Ramp sekuensial biru (magnitudo), satu hue terang → gelap. */
export const RAMP_SEQ = [
  { css: "var(--seq-100)", hex: "#cde2fb" },
  { css: "var(--seq-250)", hex: "#86b6ef" },
  { css: "var(--seq-400)", hex: "#3987e5" },
  { css: "var(--seq-550)", hex: "#1c5cab" },
  { css: "var(--seq-700)", hex: "#0d366b" },
] as const;

/** Isian wilayah menurut kategori risiko: tint lembut agar titik SPPG tetap terbaca di atasnya. */
export const ISI_RISIKO: Record<KategoriRisiko, { css: string; hex: string }> = {
  rendah: { css: "var(--peta-rendah)", hex: "#b9e2c4" },
  sedang: { css: "var(--peta-sedang)", hex: "#f6d58a" },
  tinggi: { css: "var(--peta-tinggi)", hex: "#f0a093" },
};

/** Titik SPPG: warna kategori penuh. */
export const TITIK_RISIKO: Record<KategoriRisiko, { css: string; hex: string }> = {
  rendah: { css: "var(--risiko-rendah)", hex: "#1f7a3f" },
  sedang: { css: "var(--risiko-sedang)", hex: "#8a5a00" },
  tinggi: { css: "var(--risiko-tinggi)", hex: "#b8261c" },
};

export const ISI_KOSONG = { css: "var(--peta-kosong)", hex: "#ebe9e4" };

/**
 * Ambang kelas berbasis kuantil, dibulatkan agar legenda mudah dibaca.
 * Mengembalikan paling banyak `kelas − 1` ambang yang naik tegas.
 */
export function ambangKuantil(nilai: (number | null)[], kelas = 5, desimal = 0): number[] {
  const urut = nilai.filter((v): v is number => v != null && Number.isFinite(v)).sort((a, b) => a - b);
  if (urut.length < 2) return [];
  const f = 10 ** desimal;
  const ambang: number[] = [];
  for (let i = 1; i < kelas; i++) {
    const q = urut[Math.min(urut.length - 1, Math.floor((i / kelas) * urut.length))];
    const v = Math.round(q * f) / f;
    if (v > urut[0] && v > (ambang.at(-1) ?? -Infinity)) ambang.push(v);
  }
  return ambang;
}

/** Indeks kelas (0…ambang.length) untuk satu nilai. */
export function kelasNilai(v: number, ambang: number[]): number {
  let i = 0;
  while (i < ambang.length && v >= ambang[i]) i++;
  return i;
}

/** Pilih langkah ramp yang tersebar rata untuk jumlah kelas yang lebih sedikit dari ramp. */
export function langkahRamp(jumlahKelas: number): number[] {
  if (jumlahKelas >= RAMP_SEQ.length) return RAMP_SEQ.map((_, i) => i);
  if (jumlahKelas <= 1) return [2];
  return Array.from({ length: jumlahKelas }, (_, i) => Math.round((i * (RAMP_SEQ.length - 1)) / (jumlahKelas - 1)));
}
