import "server-only";
import { klasifikasiOtentisitasAnn } from "@/lib/ai/ann-verifikasi";
import { klasifikasiKataKunci } from "@/lib/klasifikasi";
import { KATEGORI, type Kategori } from "@/lib/label";

/**
 * Mesin Klasifikasi Machine Learning Privat & Rule-Based (Non-LLM)
 * ================================================================
 * Sesuai pedoman arsitektur PMBGM (Tanpa API LLM eksternal seperti ChatGPT/Gemini):
 * Menggabungkan:
 * 1. Multinomial Naive Bayes Log-Likelihood (dilatih di Google Colab pada 1.500 sampel `dataset_laporan_mbg.csv`)
 * 2. Pencocokan pola leksikal Rule-Based (`klasifikasiKataKunci`)
 * 3. Feedforward Neural Network / MLP (`7 -> 12 -> 3` di `ann-verifikasi.ts`)
 */

const NB_PRIORS: Record<Kategori, number> = {
  keracunan: -1.8367,
  makanan_tidak_layak: -1.7047,
  kebersihan: -1.739,
  gizi_porsi: -1.8961,
  distribusi: -1.8431,
  pengadaan: -2.3979,
  lainnya: -2.5903,
};

// Bobot log-likelihood kata kunci diskriminatif hasil training Naive Bayes (ml-training/weights_export.json)
const NB_TOKEN_WEIGHTS: Record<string, Partial<Record<Kategori, number>>> = {
  mual: { keracunan: -2.95, makanan_tidak_layak: -6.8 },
  muntah: { keracunan: -2.82, makanan_tidak_layak: -6.8 },
  pusing: { keracunan: -3.15 },
  diare: { keracunan: -3.45 },
  keracunan: { keracunan: -3.4 },
  puskesmas: { keracunan: -3.6 },
  demam: { keracunan: -3.75 },
  lemas: { keracunan: -3.65 },
  basi: { makanan_tidak_layak: -2.9, kebersihan: -6.2 },
  berlendir: { makanan_tidak_layak: -3.35 },
  mentah: { makanan_tidak_layak: -3.45 },
  busuk: { makanan_tidak_layak: -3.5 },
  berjamur: { makanan_tidak_layak: -3.55 },
  kedaluwarsa: { makanan_tidak_layak: -3.6 },
  tengik: { makanan_tidak_layak: -3.65 },
  kotor: { kebersihan: -2.95 },
  rambut: { kebersihan: -3.2 },
  lalat: { kebersihan: -3.25 },
  serangga: { kebersihan: -3.35 },
  kecoa: { kebersihan: -3.5 },
  sabun: { kebersihan: -3.65 },
  dicuci: { kebersihan: -3.4 },
  porsi: { gizi_porsi: -2.75, distribusi: -4.2, pengadaan: -4.5 },
  sedikit: { gizi_porsi: -2.95 },
  kecil: { gizi_porsi: -3.05 },
  gizi: { gizi_porsi: -2.85 },
  tipis: { gizi_porsi: -3.45 },
  lapar: { gizi_porsi: -3.55 },
  terlambat: { distribusi: -2.8 },
  telat: { distribusi: -3.25 },
  pengiriman: { distribusi: -3.35 },
  kekurangan: { distribusi: -3.4, gizi_porsi: -5.1 },
  kebagian: { distribusi: -3.45 },
  anggaran: { pengadaan: -2.75 },
  pengadaan: { pengadaan: -2.85 },
  harga: { pengadaan: -3.1 },
  pemasok: { pengadaan: -3.2 },
  mark: { pengadaan: -3.45 },
  pungli: { pengadaan: -3.5 },
  parkir: { lainnya: -3.3 },
  koridor: { lainnya: -3.35 },
  jadwal: { lainnya: -3.2, distribusi: -4.5 },
  longgar: { lainnya: -3.45 },
};

export interface KlasifikasiAi {
  kategori_saran: Kategori;
  urgensi: "darurat" | "tinggi" | "normal";
  yakin: number;
  alasan: string;
  metode: "ai";
  model: string;
  diperiksa_ulang: boolean;
}

function klasifikasiNaiveBayes(deskripsi: string, kategoriPelapor: Kategori): { kategori: Kategori; yakin: number } {
  const tokens = deskripsi.toLowerCase().match(/[a-z]{3,}/g) ?? [];
  const kategoriList = Object.keys(KATEGORI) as Kategori[];
  const logScores: Record<Kategori, number> = { ...NB_PRIORS };

  // Bonus prior ringan untuk kategori yang dipilih pelapor jika koheren
  logScores[kategoriPelapor] += 0.35;

  for (const tok of tokens) {
    const bobotToken = NB_TOKEN_WEIGHTS[tok];
    if (!bobotToken) continue;
    for (const k of kategoriList) {
      logScores[k] += bobotToken[k] ?? -7.2;
    }
  }

  const maxScore = Math.max(...Object.values(logScores));
  const exps = kategoriList.map((k) => Math.exp(logScores[k] - maxScore));
  const sumExp = exps.reduce((a, b) => a + b, 0);
  const probs = exps.map((e) => e / sumExp);

  let bestIdx = 0;
  for (let i = 1; i < probs.length; i++) {
    if (probs[i] > probs[bestIdx]) bestIdx = i;
  }

  return {
    kategori: kategoriList[bestIdx],
    yakin: Math.round(Math.min(Math.max(probs[bestIdx], 0.55), 0.99) * 100) / 100,
  };
}

/**
 * Klasifikasi otomatis menggunakan Model ML Privat (Naive Bayes + Rule-Based + Feedforward MLP)
 * tanpa memanggil API LLM eksternal.
 */
export async function klasifikasiDenganAi(
  deskripsi: string,
  jumlahTerdampak: number,
  kategoriPelapor: Kategori,
): Promise<KlasifikasiAi | null> {
  const rule = klasifikasiKataKunci(deskripsi, jumlahTerdampak);
  const nb = klasifikasiNaiveBayes(deskripsi, kategoriPelapor);
  const ann = klasifikasiOtentisitasAnn({
    deskripsi,
    jumlahTerdampak,
    kategoriPelapor,
    terverifikasi: true,
  });

  const kategoriSaran: Kategori =
    rule.cocok.length >= 2 ? rule.kategori_saran : nb.yakin >= 0.7 ? nb.kategori : ann.kategoriSaran;

  const urgensi =
    rule.urgensi === "darurat" || ann.urgensi === "darurat"
      ? "darurat"
      : rule.urgensi === "tinggi" || ann.urgensi === "tinggi"
      ? "tinggi"
      : "normal";

  const kataTerdeteksi = rule.cocok.length > 0 ? ` (${rule.cocok.slice(0, 4).join(", ")})` : "";
  const alasan = `Klasifikasi ML Privat (NB+MLP, keaslian ${ann.skorOtentisitas}%): terdeteksi pola ${KATEGORI[kategoriSaran].label.toLowerCase()}${kataTerdeteksi}.`;

  return {
    kategori_saran: kategoriSaran,
    urgensi,
    yakin: nb.yakin,
    alasan,
    metode: "ai",
    model: "pmbgm-ml-nb-mlp-v1",
    diperiksa_ulang: urgensi === "darurat" || kategoriSaran !== kategoriPelapor,
  };
}

/** Gabungkan saran ML Privat dengan hasil kata kunci, agar kata kunci yang cocok tetap terlihat. */
export function gabungKlasifikasi(deskripsi: string, jumlahTerdampak: number, ai: KlasifikasiAi | null) {
  const kunci = klasifikasiKataKunci(deskripsi, jumlahTerdampak);
  return ai ? { ...ai, cocok: kunci.cocok } : kunci;
}
