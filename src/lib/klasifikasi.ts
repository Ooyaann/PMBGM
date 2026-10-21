import type { Kategori } from "@/lib/label";

/**
 * Klasifikasi kategori dan urgensi berbasis aturan kata kunci (LP-11, jalur cadangan).
 * Hasilnya hanya saran untuk verifikator; kategori pilihan pelapor tetap dipakai.
 */
const KATA_KUNCI: Record<Exclude<Kategori, "lainnya">, RegExp> = {
  keracunan: /\b(mual|muntah|pusing|diare|mencret|sakit perut|keracunan|lemas|pingsan|kejang|demam|puskesmas|igd|rumah sakit)\b/i,
  makanan_tidak_layak: /\b(basi|busuk|asam|berlendir|berulat|ulat|bau|mentah|keras|layu|jamur|kedaluwarsa)\b/i,
  kebersihan: /\b(kotor|rambut|lalat|kecoa|serangga|tanpa sarung tangan|tidak dicuci|ompreng kotor|benda asing)\b/i,
  gizi_porsi: /\b(porsi|sedikit|kecil|kurang gizi|tanpa buah|tidak ada sayur|gorengan|karbohidrat|tidak sesuai menu)\b/i,
  distribusi: /\b(terlambat|telat|tidak dikirim|tidak datang|kurang \d+|jumlah kurang|kekurangan ompreng)\b/i,
  pengadaan: /\b(anggaran|mark ?up|harga|pemasok|monopoli|korupsi|pungli|pengadaan|tender)\b/i,
};

const GEJALA_BERAT = /\b(pingsan|kejang|sesak|darah|tidak sadar|dirawat|rawat inap|rumah sakit|igd)\b/i;

export interface HasilKlasifikasi {
  kategori_saran: Kategori;
  urgensi: "darurat" | "tinggi" | "normal";
  cocok: string[];
  metode: "kata_kunci";
}

export function klasifikasiKataKunci(deskripsi: string, jumlahTerdampak: number): HasilKlasifikasi {
  const skor = Object.entries(KATA_KUNCI)
    .map(([kategori, pola]) => ({
      kategori: kategori as Kategori,
      cocok: [...deskripsi.matchAll(new RegExp(pola.source, "gi"))].map((m) => m[0].toLowerCase()),
    }))
    .filter((k) => k.cocok.length > 0)
    .sort((a, b) => b.cocok.length - a.cocok.length);

  const teratas = skor[0];
  const kategori = teratas?.kategori ?? "lainnya";
  const urgensi = kategori === "keracunan" && (GEJALA_BERAT.test(deskripsi) || jumlahTerdampak >= 5)
    ? "darurat"
    : kategori === "keracunan" || jumlahTerdampak >= 30 ? "tinggi" : "normal";

  return { kategori_saran: kategori, urgensi, cocok: [...new Set(skor.flatMap((k) => k.cocok))].slice(0, 8), metode: "kata_kunci" };
}
