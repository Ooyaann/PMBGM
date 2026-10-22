import { KATEGORI, type Kategori } from "@/lib/label";

/** Urutan dan warna kategori tetap di semua grafik (warna mengikuti entitas, bukan peringkat). */
export const URUTAN_KATEGORI: Kategori[] = [
  "keracunan", "makanan_tidak_layak", "kebersihan", "gizi_porsi", "distribusi", "pengadaan", "lainnya",
];

export const SERI_KATEGORI = URUTAN_KATEGORI.map((k, i) => ({
  kunci: k,
  label: KATEGORI[k].label,
  warna: `var(--chart-${i + 1})`,
}));

/** Baris {bulan, kategori, jumlah} → satu baris per bulan dengan kolom per kategori. */
export function pivotKategori(baris: { bulan: string; kategori: string; jumlah_kasus: number }[], label: (bulan: string) => string) {
  const peta = new Map<string, Record<string, string | number>>();
  for (const b of baris) {
    const r = peta.get(b.bulan) ?? { label: label(b.bulan), bulan: b.bulan };
    r[b.kategori] = Number(r[b.kategori] ?? 0) + b.jumlah_kasus;
    peta.set(b.bulan, r);
  }
  return [...peta.values()].sort((a, b) => String(a.bulan).localeCompare(String(b.bulan)));
}
