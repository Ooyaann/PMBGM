/**
 * Label dan deskripsi tampilan. Kunci harus sama dengan enum di database
 * (lihat supabase/migrations/20261021000100_skema_inti.sql).
 */
import type { Database } from "@/lib/supabase/database.types";

type Enum<K extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][K];
export type Kategori = Enum<"kategori_laporan">;
export type StatusAlur = Enum<"status_alur">;
export type ModeIdentitas = Enum<"mode_identitas">;
export type SumberData = Enum<"sumber_data">;
export type TingkatPrioritas = Enum<"tingkat_prioritas">;
export type KategoriRisiko = "rendah" | "sedang" | "tinggi";

/** Petunjuk 2–3 kata untuk tombol kategori. */
export const KATEGORI_PENDEK: Record<Kategori, string> = {
  keracunan: "Mual, muntah, pusing",
  makanan_tidak_layak: "Basi, bau, berulat",
  kebersihan: "Kotor, benda asing",
  gizi_porsi: "Porsi kecil, menu kurang",
  distribusi: "Telat atau kurang",
  pengadaan: "Dugaan penyimpangan",
  lainnya: "Masalah lain",
};

export const KATEGORI: Record<Kategori, { label: string; ringkas: string; contoh: string }> = {
  keracunan: {
    label: "Keracunan",
    ringkas: "Mual, muntah, pusing, atau diare setelah makan MBG",
    contoh: "Beberapa siswa mual dan muntah satu jam setelah makan siang.",
  },
  makanan_tidak_layak: {
    label: "Tidak layak",
    ringkas: "Basi, berbau, berulat, mentah, atau busuk",
    contoh: "Lauk berbau asam dan berlendir saat dibuka.",
  },
  kebersihan: {
    label: "Kebersihan",
    ringkas: "Ompreng kotor, petugas tanpa sarung tangan, ada benda asing",
    contoh: "Ompreng masih ada sisa makanan kemarin.",
  },
  gizi_porsi: {
    label: "Porsi & gizi",
    ringkas: "Porsi terlalu kecil atau menu tidak sesuai standar gizi",
    contoh: "Lauk hanya seukuran setengah jari, tidak ada buah.",
  },
  distribusi: {
    label: "Distribusi",
    ringkas: "Terlambat, tidak dikirim, atau jumlah kurang",
    contoh: "Makanan baru tiba setelah jam pulang sekolah.",
  },
  pengadaan: {
    label: "Anggaran",
    ringkas: "Dugaan penyimpangan belanja bahan atau anggaran",
    contoh: "Kualitas bahan tidak sebanding dengan anggaran per porsi.",
  },
  lainnya: {
    label: "Lainnya",
    ringkas: "Masalah lain terkait layanan MBG",
    contoh: "Sekolah belum menerima jadwal menu dan kontak pengaduan.",
  },
};

export const STATUS: Record<StatusAlur, { label: string; penjelasan: string }> = {
  diterima: { label: "Diterima", penjelasan: "Laporan masuk dan menunggu pemeriksaan tim verifikator." },
  diverifikasi: { label: "Diverifikasi", penjelasan: "Bukti sudah diperiksa dan laporan dinyatakan valid." },
  diteruskan: { label: "Diteruskan", penjelasan: "Kasus sudah diteruskan ke instansi yang berwenang. Batas waktu tanggapan berjalan." },
  ditindaklanjuti: { label: "Ditindaklanjuti", penjelasan: "Instansi sedang menangani dan mengunggah bukti tindak lanjut." },
  selesai: { label: "Selesai", penjelasan: "Tindak lanjut dinyatakan tuntas. Pelapor bisa memberi penilaian." },
  ditolak: { label: "Ditolak", penjelasan: "Laporan tidak bisa diproses. Alasannya ditampilkan kepada pelapor." },
  dibuka_ulang: { label: "Dibuka ulang", penjelasan: "Pelapor menilai masalah belum tuntas; kasus kembali ke instansi." },
};

/** Satu baris untuk pilihan identitas. */
export const MODE_PENDEK: Record<ModeIdentitas, string> = {
  rahasia: "Hanya verifikator yang tahu",
  publik: "Nama boleh ditampilkan",
  anonim: "Tidak ada yang tahu",
};

export const MODE_IDENTITAS: Record<ModeIdentitas, { label: string; penjelasan: string }> = {
  rahasia: {
    label: "Rahasia",
    penjelasan: "Nama Anda hanya diketahui tim verifikator. Instansi dan publik tidak bisa melihatnya.",
  },
  publik: {
    label: "Publik",
    penjelasan: "Nama tampilan Anda boleh disebut sebagai pelapor. Cocok untuk guru atau komite sekolah.",
  },
  anonim: {
    label: "Anonim",
    penjelasan: "Tidak ada yang bisa melihat identitas Anda, termasuk verifikator. Bobot kredibilitas lebih rendah.",
  },
};

export const SUMBER: Record<SumberData, { label: string; penjelasan: string }> = {
  resmi: { label: "Resmi", penjelasan: "Data dari lembaga pemerintah atau pemberitaan atas rilis resmi." },
  masyarakat_sipil: { label: "Masyarakat sipil", penjelasan: "Data dari organisasi masyarakat sipil (mis. JPPI, ICW). Bukan angka resmi pemerintah." },
  laporan_warga_terverifikasi: { label: "Laporan warga terverifikasi", penjelasan: "Diolah dari laporan warga yang sudah lolos verifikasi di platform ini." },
  simulasi: { label: "Simulasi", penjelasan: "Data simulasi untuk keperluan lomba. Strukturnya realistis, angkanya bukan data nyata." },
};

export const RISIKO: Record<KategoriRisiko, { label: string; penjelasan: string }> = {
  rendah: { label: "Rendah", penjelasan: "Skor 0–39. Tidak ada tanda masalah berulang." },
  sedang: { label: "Sedang", penjelasan: "Skor 40–69. Perlu dipantau; ada laporan atau tindak lanjut yang tertunda." },
  tinggi: { label: "Tinggi", penjelasan: "Skor 70–100. Perlu diprioritaskan untuk inspeksi." },
};

export function kategoriRisiko(skor: number | null | undefined): KategoriRisiko {
  if (skor == null || skor < 40) return "rendah";
  return skor < 70 ? "sedang" : "tinggi";
}

export const PRIORITAS: Record<TingkatPrioritas, string> = {
  rendah: "Rendah",
  sedang: "Sedang",
  tinggi: "Tinggi",
  darurat: "Darurat",
};
