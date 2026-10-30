/**
 * Model Machine Learning Multimodal Artificial Neural Network (ANN)
 * untuk Verifikasi Keaslian Laporan Warga & Integritas Bukti Foto.
 *
 * Menggunakan arsitektur Feedforward Multi-Layer Perceptron (MLP):
 * - Input Layer: 7 Neuron Fitur Multimodal (Leksikal, Anomali, Koherensi, EXIF Waktu, EXIF GPS, Reputasi, Kewajaran)
 * - Hidden Layer: 12 Neuron dengan Aktivasi Rectified Linear Unit (ReLU)
 * - Output Layer: 3 Neuron dengan Aktivasi Softmax (Otentik, Meragukan, Indikasi Fiktif)
 *
 * Berjalan 100% native di server tanpa ketergantungan API pihak ketiga (Non-LLM).
 */

import type { Kategori } from "@/lib/label";

export interface InputMultimodalLaporan {
  deskripsi: string;
  jumlahTerdampak: number;
  kategoriPelapor: Kategori;
  terverifikasi: boolean;
  kapasitasSiswaSekolah?: number | null;
  fotoExif?: {
    adaExif: boolean;
    waktuFotoCocok: boolean;
    lokasiGpsCocok: boolean;
    jarakKm?: number | null;
    selisihJam?: number | null;
  } | null;
}

export interface HasilVerifikasiAnn {
  metode: "ann_multimodal";
  skorOtentisitas: number; // 0 - 100%
  klasifikasiKeaslian: "Otentik & Valid" | "Meragukan / Perlu Tambahan Bukti" | "Indikasi Fiktif / Tidak Sesuai";
  probabilitas: {
    otentik: number;
    meragukan: number;
    fiktif: number;
  };
  kategoriSaran: Kategori;
  urgensi: "darurat" | "tinggi" | "normal";
  radarFitur: {
    leksikonMenu: number; // 0 - 100
    anomaliGejala: number; // 0 - 100
    koherensiTeks: number; // 0 - 100
    integritasWaktuFoto: number; // 0 - 100
    integritasGpsFoto: number; // 0 - 100
    reputasiPelapor: number; // 0 - 100
    kewajaranDampak: number; // 0 - 100
  };
  penjelasanFitur: string[];
  rekomendasiVerifikator: string;
}

// -----------------------------------------------------------------------------
// 1. Matriks Bobot & Bias Model ANN (Trained Feedforward Weights dari Google Colab)
//    Sumber Training: ml-training/Training_Model_ML_PMBGM.ipynb
//    Dataset: ml-training/dataset_laporan_mbg.csv (1.500 sampel, 80% Train / 20% Test)
//    Optimizer: Adam (lr=0.015, 300 Epochs, L2=1e-4) · Test Accuracy: 95.33%
// -----------------------------------------------------------------------------
const W1: number[][] = [
  // 7 input nodes -> 12 hidden neurons (ReLU)
  [0.1047, -0.0649, -0.1853, 0.3622, 0.0, -0.2908, 0.0, -0.5505, -0.3108, 0.0, 0.8679, 0.4437],
  [-0.4086, 0.0119, 0.5438, -0.2462, 0.0, -0.7273, 0.0, -0.2963, 0.4457, 0.0, -1.7908, -0.0982],
  [3.5696, 0.0709, 0.3394, 1.4458, 0.0, 1.7436, 0.0, 1.3765, -4.0579, 0.0, -1.4123, -0.5047],
  [-0.0394, 0.1431, 1.3736, -0.3154, 0.0, -0.6531, 0.0, 2.3853, -0.2309, 0.0, 2.0424, -2.5337],
  [0.4062, 0.1759, 1.0436, -0.2872, 0.0, -0.3108, 0.0, 0.4217, 0.1226, 0.0, 1.5944, -0.8189],
  [0.7131, -0.1746, 1.0204, -1.8548, 0.0, -0.8313, 0.0, -0.3832, 1.2035, 0.0, 0.024, 0.1181],
  [1.8427, -0.2019, 1.9993, -1.7609, 0.0, -2.7442, 0.0, -0.5412, 2.9009, 0.0, 1.9261, 0.8451],
];

const B1: number[] = [
  -3.9992, -0.7395, -3.3221, 2.6805, -0.1121, 3.1036, -0.5268, -0.7787, -0.8416, -0.0009, -2.221, 2.8046,
];

const W2: number[][] = [
  // 12 hidden neurons -> 3 output classes (0: Otentik, 1: Meragukan, 2: Fiktif)
  [1.7809, 1.1266, -5.1536],
  [-0.0064, -0.0946, -0.0125],
  [1.84, -0.2898, -2.4559],
  [-1.4314, -0.6705, 2.3543],
  [0.0, 0.0, 0.0],
  [-3.0092, -0.8022, 3.2443],
  [0.0, 0.0, 0.0],
  [0.3178, -0.7845, 0.5356],
  [-1.0275, 4.1984, -3.1878],
  [0.0, 0.0, 0.0],
  [1.837, 0.2861, -2.1364],
  [-1.5781, 1.2489, 0.9795],
];

const B2: number[] = [-2.7199, 0.8807, 2.4582];

// -----------------------------------------------------------------------------
// 2. Kamus Leksikon MBG & Gejala Medis
// -----------------------------------------------------------------------------
const KATA_MBG = /\b(ompreng|baki|nasi|lauk|sayur|buah|susu|menu|porsi|dapur|sppg|katering|makan bergizi|kotak makan|distribusi)\b/gi;
const KATA_ANOMALI = /\b(basi|busuk|asam|berlendir|ulat|bau|mentah|kotor|lalat|rambut|kecoa|jamur|kedaluwarsa|mual|muntah|pusing|diare|mencret|sakit perut|keracunan|lemas|pingsan|kejang|demam|igd|rumah sakit|puskesmas)\b/gi;
const KATA_DARURAT = /\b(pingsan|kejang|sesak|darah|tidak sadar|dirawat|rawat inap|rumah sakit|igd|keracunan massal)\b/gi;

function relu(x: number): number {
  return Math.max(0, x);
}

function softmax(arr: number[]): number[] {
  const max = Math.max(...arr);
  const exps = arr.map((x) => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((x) => x / sum);
}

// -----------------------------------------------------------------------------
// 3. Ekstraksi 7 Vektor Fitur Multimodal
// -----------------------------------------------------------------------------
export function ekstrakVektorFitur(input: InputMultimodalLaporan) {
  const teks = input.deskripsi || "";
  const len = teks.trim().length;

  // x1: Leksikon Menu MBG (0 - 1)
  const cocokanMbg = (teks.match(KATA_MBG) || []).length;
  const x1 = Math.min(cocokanMbg / 3, 1.0);

  // x2: Anomali Gejala Medis & Higiene (0 - 1)
  const cocokanAnomali = (teks.match(KATA_ANOMALI) || []).length;
  const x2 = Math.min(cocokanAnomali / 3, 1.0);

  // x3: Koherensi & Kerapatan Teks (0 - 1)
  // Menolak random keyboard spamming seperti "asdfghjk"
  const kataUnik = new Set(teks.toLowerCase().split(/\s+/)).size;
  const rasioUnik = len > 0 ? kataUnik / Math.max(teks.split(/\s+/).length, 1) : 0;
  const x3 = len >= 25 && rasioUnik > 0.4 ? Math.min(len / 120, 1.0) : 0.2;

  // x4: Integritas Waktu Pengambilan Foto (0 - 1)
  let x4 = 0.5; // default tanpa foto
  if (input.fotoExif?.adaExif) {
    x4 = input.fotoExif.waktuFotoCocok ? 1.0 : 0.35;
  } else if (input.fotoExif) {
    x4 = 0.75; // ada foto tanpa EXIF kompresi
  }

  // x5: Integritas Geolokasi GPS Foto ke Titik Sekolah (0 - 1)
  let x5 = 0.5;
  if (input.fotoExif?.adaExif) {
    x5 = input.fotoExif.lokasiGpsCocok ? 1.0 : 0.3;
  } else if (input.fotoExif) {
    x5 = 0.75;
  }

  // x6: Reputasi & Verifikasi Akun Pelapor (0 - 1)
  const x6 = input.terverifikasi ? 1.0 : 0.7;

  // x7: Kewajaran Rasio Korban Terdampak (0 - 1)
  const maxSiswa = input.kapasitasSiswaSekolah || 600;
  let x7 = 0.8;
  if (input.jumlahTerdampak > 0) {
    if (input.jumlahTerdampak <= maxSiswa) {
      x7 = 0.95;
    } else {
      x7 = 0.25; // angka melebihi total murid sekolah
    }
  }

  return [x1, x2, x3, x4, x5, x6, x7];
}

// -----------------------------------------------------------------------------
// 4. Inferensi Model ANN Feedforward (Prediction Pipeline)
// -----------------------------------------------------------------------------
export function klasifikasiOtentisitasAnn(input: InputMultimodalLaporan): HasilVerifikasiAnn {
  const x = ekstrakVektorFitur(input);

  // Feedforward Hidden Layer (12 neuron)
  const hidden: number[] = new Array(12).fill(0);
  for (let j = 0; j < 12; j++) {
    let sum = B1[j];
    for (let i = 0; i < 7; i++) {
      sum += x[i] * W1[i][j];
    }
    hidden[j] = relu(sum);
  }

  // Feedforward Output Layer (3 kelas)
  const logits: number[] = new Array(3).fill(0);
  for (let k = 0; k < 3; k++) {
    let sum = B2[k];
    for (let j = 0; j < 12; j++) {
      sum += hidden[j] * W2[j][k];
    }
    logits[k] = sum;
  }

  const [p0, p1, p2] = softmax(logits); // [Otentik, Meragukan, Fiktif]
  const skorOtentisitas = Math.round(p0 * 1000) / 10;

  // Penentuan Label
  let klasifikasiKeaslian: HasilVerifikasiAnn["klasifikasiKeaslian"] = "Otentik & Valid";
  let rekomendasiVerifikator = "Bukti narasi dan metadata visual konsisten. Laporan layak diverifikasi untuk diteruskan ke instansi.";

  if (p2 > 0.45 || skorOtentisitas < 40) {
    klasifikasiKeaslian = "Indikasi Fiktif / Tidak Sesuai";
    rekomendasiVerifikator = "Peringatan model: Metadata foto tidak cocok dengan lokasi sekolah atau narasi tidak relevan dengan MBG. Periksa seksama bukti sebelum menolak.";
  } else if (p1 > 0.35 || skorOtentisitas < 70) {
    klasifikasiKeaslian = "Meragukan / Perlu Tambahan Bukti";
    rekomendasiVerifikator = "Bukti foto kurang memadai atau informasi narasi terlalu minim. Verifikator dapat meminta klarifikasi pelapor.";
  }

  // Deteksi Kategori & Urgensi Cerdas
  const teks = input.deskripsi.toLowerCase();
  let kategoriSaran: Kategori = input.kategoriPelapor;
  if (/mual|muntah|diare|keracunan|pusing|igd|puskesmas/i.test(teks)) {
    kategoriSaran = "keracunan";
  } else if (/basi|busuk|ulat|asam|berlendir|jamur/i.test(teks)) {
    kategoriSaran = "makanan_tidak_layak";
  } else if (/kotor|lalat|rambut|kecoa|serangga/i.test(teks)) {
    kategoriSaran = "kebersihan";
  } else if (/terlambat|telat|kurang|porsi/i.test(teks)) {
    kategoriSaran = /kurang|porsi/i.test(teks) ? "gizi_porsi" : "distribusi";
  }

  const adaDarurat = KATA_DARURAT.test(teks) || (kategoriSaran === "keracunan" && input.jumlahTerdampak >= 5);
  const urgensi: HasilVerifikasiAnn["urgensi"] = adaDarurat
    ? "darurat"
    : kategoriSaran === "keracunan" || input.jumlahTerdampak >= 20
    ? "tinggi"
    : "normal";

  // Catatan Fitur yang Berkontribusi
  const penjelasanFitur: string[] = [];
  if (x[0] > 0.4) penjelasanFitur.push("Menyebutkan entitas program baki/porsi MBG");
  if (x[1] > 0.4) penjelasanFitur.push("Mendeteksi terminologi gejala/anomali medis");
  if (x[3] >= 0.8) penjelasanFitur.push("Waktu pengambilan foto sesuai dengan waktu kejadian");
  if (x[4] >= 0.8) penjelasanFitur.push("Koordinat GPS foto berada dalam radius sekolah");
  if (x[5] === 1.0) penjelasanFitur.push("Pelapor berstatus akun terverifikasi");

  return {
    metode: "ann_multimodal",
    skorOtentisitas,
    klasifikasiKeaslian,
    probabilitas: {
      otentik: Math.round(p0 * 100) / 100,
      meragukan: Math.round(p1 * 100) / 100,
      fiktif: Math.round(p2 * 100) / 100,
    },
    kategoriSaran,
    urgensi,
    radarFitur: {
      leksikonMenu: Math.round(x[0] * 100),
      anomaliGejala: Math.round(x[1] * 100),
      koherensiTeks: Math.round(x[2] * 100),
      integritasWaktuFoto: Math.round(x[3] * 100),
      integritasGpsFoto: Math.round(x[4] * 100),
      reputasiPelapor: Math.round(x[5] * 100),
      kewajaranDampak: Math.round(x[6] * 100),
    },
    penjelasanFitur,
    rekomendasiVerifikator,
  };
}
