/**
 * Data referensi untuk seed.
 * - Nama dan kode wilayah asli (kode Kemendagri). Koordinat pusat dan jumlah penduduk adalah
 *   perkiraan kasar untuk simulasi, bukan data resmi.
 * - Nama SPPG dan sekolah wajib fiktif (PRD 3.4) dan dibuat di generator.
 */

export type Kategori =
  | "keracunan"
  | "makanan_tidak_layak"
  | "kebersihan"
  | "gizi_porsi"
  | "distribusi"
  | "pengadaan"
  | "lainnya";

export type JenisTindakan =
  | "inspeksi"
  | "penutupan_sementara"
  | "perbaikan"
  | "klarifikasi"
  | "pembinaan"
  | "lainnya";

export type Tahap = "diterima" | "diverifikasi" | "diteruskan" | "ditindaklanjuti" | "dibuka_ulang";

export interface WilayahRef {
  id: string;
  nama: string;
  lat: number;
  lng: number;
  /** Perkiraan penduduk (ribu jiwa) untuk membagi agregat secara proporsional. */
  penduduk: number;
}

export const PROVINSI = { id: "33", nama: "Jawa Tengah", lat: -7.15, lng: 110.14 };

export const KABKOTA: WilayahRef[] = [
  { id: "33.01", nama: "Kabupaten Cilacap", lat: -7.69, lng: 109.02, penduduk: 2000 },
  { id: "33.02", nama: "Kabupaten Banyumas", lat: -7.45, lng: 109.16, penduduk: 1830 },
  { id: "33.03", nama: "Kabupaten Purbalingga", lat: -7.39, lng: 109.36, penduduk: 1030 },
  { id: "33.04", nama: "Kabupaten Banjarnegara", lat: -7.4, lng: 109.68, penduduk: 1040 },
  { id: "33.05", nama: "Kabupaten Kebumen", lat: -7.67, lng: 109.65, penduduk: 1400 },
  { id: "33.06", nama: "Kabupaten Purworejo", lat: -7.71, lng: 110.01, penduduk: 780 },
  { id: "33.07", nama: "Kabupaten Wonosobo", lat: -7.36, lng: 109.9, penduduk: 900 },
  { id: "33.08", nama: "Kabupaten Magelang", lat: -7.48, lng: 110.22, penduduk: 1320 },
  { id: "33.09", nama: "Kabupaten Boyolali", lat: -7.53, lng: 110.6, penduduk: 1090 },
  { id: "33.10", nama: "Kabupaten Klaten", lat: -7.7, lng: 110.6, penduduk: 1280 },
  { id: "33.11", nama: "Kabupaten Sukoharjo", lat: -7.68, lng: 110.84, penduduk: 920 },
  { id: "33.12", nama: "Kabupaten Wonogiri", lat: -7.82, lng: 110.92, penduduk: 1060 },
  { id: "33.13", nama: "Kabupaten Karanganyar", lat: -7.6, lng: 110.97, penduduk: 950 },
  { id: "33.14", nama: "Kabupaten Sragen", lat: -7.43, lng: 111.02, penduduk: 1000 },
  { id: "33.15", nama: "Kabupaten Grobogan", lat: -7.09, lng: 110.92, penduduk: 1480 },
  { id: "33.16", nama: "Kabupaten Blora", lat: -7.0, lng: 111.42, penduduk: 900 },
  { id: "33.17", nama: "Kabupaten Rembang", lat: -6.71, lng: 111.35, penduduk: 650 },
  { id: "33.18", nama: "Kabupaten Pati", lat: -6.75, lng: 111.04, penduduk: 1350 },
  { id: "33.19", nama: "Kabupaten Kudus", lat: -6.8, lng: 110.84, penduduk: 870 },
  { id: "33.20", nama: "Kabupaten Jepara", lat: -6.59, lng: 110.67, penduduk: 1220 },
  { id: "33.21", nama: "Kabupaten Demak", lat: -6.89, lng: 110.64, penduduk: 1250 },
  { id: "33.22", nama: "Kabupaten Semarang", lat: -7.2, lng: 110.4, penduduk: 1090 },
  { id: "33.23", nama: "Kabupaten Temanggung", lat: -7.31, lng: 110.17, penduduk: 800 },
  { id: "33.24", nama: "Kabupaten Kendal", lat: -7.03, lng: 110.2, penduduk: 1050 },
  { id: "33.25", nama: "Kabupaten Batang", lat: -6.91, lng: 109.73, penduduk: 830 },
  { id: "33.26", nama: "Kabupaten Pekalongan", lat: -7.03, lng: 109.6, penduduk: 1010 },
  { id: "33.27", nama: "Kabupaten Pemalang", lat: -6.89, lng: 109.38, penduduk: 1520 },
  { id: "33.28", nama: "Kabupaten Tegal", lat: -6.98, lng: 109.13, penduduk: 1650 },
  { id: "33.29", nama: "Kabupaten Brebes", lat: -6.87, lng: 108.9, penduduk: 2000 },
  { id: "33.71", nama: "Kota Magelang", lat: -7.48, lng: 110.22, penduduk: 125 },
  { id: "33.72", nama: "Kota Surakarta", lat: -7.57, lng: 110.82, penduduk: 525 },
  { id: "33.73", nama: "Kota Salatiga", lat: -7.33, lng: 110.5, penduduk: 200 },
  { id: "33.74", nama: "Kota Semarang", lat: -7.0, lng: 110.42, penduduk: 1700 },
  { id: "33.75", nama: "Kota Pekalongan", lat: -6.89, lng: 109.67, penduduk: 315 },
  { id: "33.76", nama: "Kota Tegal", lat: -6.87, lng: 109.13, penduduk: 280 },
];

export const KOTA_SEMARANG = "33.74";

export const KECAMATAN_SEMARANG: WilayahRef[] = [
  { id: "33.74.01", nama: "Semarang Tengah", lat: -6.978, lng: 110.418, penduduk: 60 },
  { id: "33.74.02", nama: "Semarang Utara", lat: -6.962, lng: 110.41, penduduk: 120 },
  { id: "33.74.03", nama: "Semarang Timur", lat: -6.976, lng: 110.437, penduduk: 70 },
  { id: "33.74.04", nama: "Gayamsari", lat: -6.99, lng: 110.453, penduduk: 75 },
  { id: "33.74.05", nama: "Genuk", lat: -6.958, lng: 110.48, penduduk: 125 },
  { id: "33.74.06", nama: "Pedurungan", lat: -7.005, lng: 110.475, penduduk: 190 },
  { id: "33.74.07", nama: "Semarang Selatan", lat: -6.993, lng: 110.425, penduduk: 65 },
  { id: "33.74.08", nama: "Candisari", lat: -7.012, lng: 110.42, penduduk: 75 },
  { id: "33.74.09", nama: "Gajahmungkur", lat: -7.02, lng: 110.405, penduduk: 60 },
  { id: "33.74.10", nama: "Tembalang", lat: -7.06, lng: 110.445, penduduk: 190 },
  { id: "33.74.11", nama: "Banyumanik", lat: -7.075, lng: 110.42, penduduk: 140 },
  { id: "33.74.12", nama: "Gunungpati", lat: -7.09, lng: 110.37, penduduk: 95 },
  { id: "33.74.13", nama: "Semarang Barat", lat: -6.985, lng: 110.385, penduduk: 150 },
  { id: "33.74.14", nama: "Mijen", lat: -7.06, lng: 110.32, penduduk: 80 },
  { id: "33.74.15", nama: "Ngaliyan", lat: -7.01, lng: 110.34, penduduk: 140 },
  { id: "33.74.16", nama: "Tugu", lat: -6.975, lng: 110.32, penduduk: 33 },
];

/**
 * Profil SPPG simulasi. Pola yang sengaja ditanam (PRD 3.4):
 *  1. Tiga SPPG bermasalah: banyak laporan, tanpa SLHS, sering terlambat ditindaklanjuti.
 *  2. Satu lonjakan keracunan di satu kecamatan pada minggu tertentu (Banyumanik).
 *  3. Satu kecamatan responsif sebagai contoh positif (Gajahmungkur).
 *  4. Laporan duplikat dari sekolah yang sama (dari kejadian yang dilaporkan beberapa orang).
 *  5. Beberapa laporan ditolak dengan alasan yang jelas.
 */
export type ProfilSppg = "normal" | "bermasalah" | "responsif" | "demo" | "lonjakan";

export interface RencanaSppg {
  kecamatanId: string;
  nomor: number;
  profil: ProfilSppg;
}

export const RENCANA_SPPG: RencanaSppg[] = [
  { kecamatanId: "33.74.01", nomor: 1, profil: "normal" },
  { kecamatanId: "33.74.02", nomor: 1, profil: "normal" },
  { kecamatanId: "33.74.02", nomor: 2, profil: "bermasalah" },
  { kecamatanId: "33.74.03", nomor: 1, profil: "normal" },
  { kecamatanId: "33.74.04", nomor: 1, profil: "normal" },
  { kecamatanId: "33.74.05", nomor: 1, profil: "bermasalah" },
  { kecamatanId: "33.74.05", nomor: 2, profil: "normal" },
  { kecamatanId: "33.74.06", nomor: 1, profil: "normal" },
  { kecamatanId: "33.74.06", nomor: 2, profil: "bermasalah" },
  { kecamatanId: "33.74.06", nomor: 3, profil: "normal" },
  { kecamatanId: "33.74.07", nomor: 1, profil: "normal" },
  { kecamatanId: "33.74.08", nomor: 1, profil: "normal" },
  { kecamatanId: "33.74.09", nomor: 1, profil: "responsif" },
  { kecamatanId: "33.74.10", nomor: 1, profil: "normal" },
  { kecamatanId: "33.74.10", nomor: 2, profil: "normal" },
  { kecamatanId: "33.74.10", nomor: 3, profil: "demo" },
  { kecamatanId: "33.74.11", nomor: 1, profil: "lonjakan" },
  { kecamatanId: "33.74.11", nomor: 2, profil: "normal" },
  { kecamatanId: "33.74.12", nomor: 1, profil: "normal" },
  { kecamatanId: "33.74.13", nomor: 1, profil: "normal" },
  { kecamatanId: "33.74.13", nomor: 2, profil: "normal" },
  { kecamatanId: "33.74.14", nomor: 1, profil: "normal" },
  { kecamatanId: "33.74.15", nomor: 1, profil: "normal" },
  { kecamatanId: "33.74.15", nomor: 2, profil: "normal" },
  { kecamatanId: "33.74.16", nomor: 1, profil: "normal" },
];

/** Bobot frekuensi kejadian dan sebaran kategori per profil. */
export const PERILAKU: Record<
  ProfilSppg,
  {
    frekuensi: number;
    kategori: Record<Kategori, number>;
    /** Pengali lama tanggapan terhadap batas SLA. */
    respons: [number, number];
    rating: [number, number];
  }
> = {
  normal: {
    frekuensi: 1,
    kategori: {
      keracunan: 0.05, makanan_tidak_layak: 0.22, kebersihan: 0.14, gizi_porsi: 0.24,
      distribusi: 0.19, pengadaan: 0.06, lainnya: 0.1,
    },
    respons: [0.25, 1.15],
    rating: [3, 5],
  },
  bermasalah: {
    frekuensi: 2.6,
    kategori: {
      keracunan: 0.12, makanan_tidak_layak: 0.28, kebersihan: 0.22, gizi_porsi: 0.15,
      distribusi: 0.12, pengadaan: 0.06, lainnya: 0.05,
    },
    respons: [0.7, 2.8],
    rating: [1, 3],
  },
  responsif: {
    frekuensi: 0.7,
    kategori: {
      keracunan: 0.03, makanan_tidak_layak: 0.2, kebersihan: 0.12, gizi_porsi: 0.3,
      distribusi: 0.2, pengadaan: 0.05, lainnya: 0.1,
    },
    respons: [0.08, 0.45],
    rating: [4, 5],
  },
  demo: {
    frekuensi: 2.1,
    kategori: {
      keracunan: 0.08, makanan_tidak_layak: 0.27, kebersihan: 0.2, gizi_porsi: 0.18,
      distribusi: 0.14, pengadaan: 0.05, lainnya: 0.08,
    },
    respons: [0.5, 1.6],
    rating: [2, 4],
  },
  lonjakan: {
    frekuensi: 1,
    kategori: {
      keracunan: 0.06, makanan_tidak_layak: 0.24, kebersihan: 0.14, gizi_porsi: 0.22,
      distribusi: 0.18, pengadaan: 0.06, lainnya: 0.1,
    },
    respons: [0.3, 1.2],
    rating: [3, 5],
  },
};

/** Sama dengan aturan_sla di migrasi 5 (jam). */
export const SLA: Record<Kategori, Record<Tahap, number>> = {
  keracunan: { diterima: 6, diverifikasi: 2, diteruskan: 6, ditindaklanjuti: 72, dibuka_ulang: 24 },
  makanan_tidak_layak: { diterima: 24, diverifikasi: 12, diteruskan: 24, ditindaklanjuti: 120, dibuka_ulang: 48 },
  kebersihan: { diterima: 48, diverifikasi: 24, diteruskan: 48, ditindaklanjuti: 168, dibuka_ulang: 72 },
  gizi_porsi: { diterima: 48, diverifikasi: 24, diteruskan: 72, ditindaklanjuti: 168, dibuka_ulang: 72 },
  distribusi: { diterima: 24, diverifikasi: 12, diteruskan: 24, ditindaklanjuti: 72, dibuka_ulang: 48 },
  pengadaan: { diterima: 72, diverifikasi: 48, diteruskan: 168, ditindaklanjuti: 720, dibuka_ulang: 168 },
  lainnya: { diterima: 72, diverifikasi: 48, diteruskan: 120, ditindaklanjuti: 336, dibuka_ulang: 120 },
};

export const LABEL_KATEGORI: Record<Kategori, string> = {
  keracunan: "Dugaan keracunan",
  makanan_tidak_layak: "Makanan tidak layak",
  kebersihan: "Kebersihan dapur/penyajian",
  gizi_porsi: "Porsi/gizi tidak sesuai",
  distribusi: "Masalah distribusi",
  pengadaan: "Dugaan masalah pengadaan",
  lainnya: "Lainnya",
};

// -----------------------------------------------------------------------------
// Teks laporan. Tidak memuat nama anak (PRD 7.2).
// -----------------------------------------------------------------------------
export const MENU = [
  "nasi, ayam goreng, tumis buncis, dan pisang",
  "nasi, telur balado, sayur sop, dan jeruk",
  "nasi, ikan tongkol suwir, capcay, dan semangka",
  "nasi kuning, ayam suwir, orek tempe, dan melon",
  "nasi, semur ayam, sayur bening bayam, dan susu",
  "nasi, rolade daging, tumis kangkung, dan pepaya",
];

export const LAUK = ["ayam suwir", "telur balado", "ikan tongkol", "semur ayam", "orek tempe", "rolade daging"];

export const TEMPLAT_DESKRIPSI: Record<Kategori, string[]> = {
  keracunan: [
    "Setelah makan siang MBG sekitar pukul {jam}, {n} siswa mengeluh mual dan pusing. Beberapa muntah dan dibawa ke puskesmas terdekat. Menu hari itu {menu}.",
    "Anak saya pulang sekolah dalam keadaan sakit perut dan diare setelah makan {menu}. Menurut wali kelas ada {n} anak lain dengan keluhan serupa.",
    "Sekitar {n} siswa mengalami mual dan pusing kurang dari dua jam setelah makan MBG. Lauk {lauk} tercium agak asam saat dibuka.",
    "Ada {n} siswa yang mengeluh sakit perut dan lemas setelah jam makan siang. Pihak sekolah sudah menghubungi puskesmas dan menyimpan sisa makanan.",
  ],
  makanan_tidak_layak: [
    "Lauk {lauk} pada menu hari ini berbau asam dan teksturnya berlendir. Banyak siswa tidak menghabiskan makanannya.",
    "Nasi masih keras dan kurang matang, sayur sudah layu saat dibagikan. Ini sudah terjadi dua kali dalam minggu ini.",
    "Ditemukan ulat kecil pada sayur di beberapa ompreng. Foto terlampir. Siswa jadi takut makan.",
    "Buah yang dibagikan sudah lembek dan sebagian busuk. {lauk} juga terasa tidak segar.",
  ],
  kebersihan: [
    "Ompreng yang datang masih ada sisa makanan kemarin dan berbau. Sepertinya tidak dicuci bersih.",
    "Petugas pengantar membagikan makanan tanpa sarung tangan dan penutup kepala. Wadah makanan tidak tertutup rapat.",
    "Ada rambut di dalam makanan di beberapa ompreng. Mohon kebersihan dapur diperiksa.",
  ],
  gizi_porsi: [
    "Porsi lauk hari ini sangat kecil: {lauk} hanya seukuran setengah jari dan tidak ada buah. Tidak sesuai menu yang diumumkan.",
    "Selama seminggu menu didominasi karbohidrat dan gorengan; sayur dan buah jarang ada.",
    "Porsi untuk siswa SMP sama dengan porsi siswa PAUD, sehingga banyak siswa masih lapar.",
  ],
  distribusi: [
    "Makanan baru tiba pukul {jam_telat}, jauh setelah jam istirahat. Siswa sudah kelaparan dan sebagian sudah pulang.",
    "Jumlah ompreng yang dikirim kurang {kurang} porsi dari jumlah siswa terdaftar.",
    "Hari ini makanan tidak dikirim sama sekali tanpa pemberitahuan ke sekolah.",
  ],
  pengadaan: [
    "Ada dugaan bahan baku dibeli dari satu pemasok dengan harga di atas pasar. Kualitas bahan tidak sebanding dengan anggaran per porsi.",
    "Menu yang disajikan tampak jauh di bawah standar anggaran per porsi. Mohon penggunaan anggarannya ditelusuri.",
  ],
  lainnya: [
    "Sekolah belum menerima jadwal menu dan kontak pengaduan SPPG. Orang tua kesulitan menyampaikan keluhan.",
    "Makanan untuk siswa dengan alergi tidak dibedakan, padahal sudah diinformasikan ke SPPG.",
  ],
};

export const ALASAN_TOLAK = [
  "Foto yang dilampirkan tidak berkaitan dengan makanan MBG (foto jajanan kantin).",
  "Kejadian terjadi di luar program MBG: makanan berasal dari kantin sekolah.",
  "Sekolah yang dipilih tidak sesuai dengan lokasi kejadian, dan pelapor tidak merespons konfirmasi dalam 48 jam.",
  "Informasi tidak cukup untuk diverifikasi: tidak ada bukti dan pelapor tidak dapat dihubungi.",
  "Laporan ganda dari akun yang sama untuk kejadian yang sudah dilaporkan sebelumnya.",
];

/** Langkah tindak lanjut per kategori: [jenis, catatan]. Langkah terakhir menjadi catatan penyelesaian. */
export const TINDAK_LANJUT: Record<Kategori, [JenisTindakan, string][]> = {
  keracunan: [
    ["inspeksi", "Tim Dinas Kesehatan melakukan inspeksi dapur SPPG dan mengambil sampel makanan untuk uji laboratorium."],
    ["penutupan_sementara", "SPPG ditutup sementara sambil menunggu hasil uji laboratorium dan perbaikan sanitasi."],
    ["pembinaan", "Hasil uji laboratorium menunjukkan cemaran bakteri pada lauk. SPPG wajib mengganti pemasok dan mengikuti pelatihan keamanan pangan."],
    ["lainnya", "Perbaikan sanitasi sudah diperiksa ulang. SPPG boleh beroperasi kembali dengan pengawasan mingguan selama satu bulan."],
  ],
  makanan_tidak_layak: [
    ["klarifikasi", "Pengelola SPPG mengonfirmasi lauk dimasak terlalu awal. Jadwal memasak digeser lebih dekat ke jam distribusi."],
    ["perbaikan", "Bahan yang tidak layak ditarik dan pemasok sayur diganti."],
    ["lainnya", "Pemeriksaan acak tiga hari berturut-turut menunjukkan makanan dalam kondisi baik."],
  ],
  kebersihan: [
    ["inspeksi", "Petugas memeriksa area pencucian alat makan dan alur penyajian di dapur SPPG."],
    ["perbaikan", "Ditambahkan wastafel dan jadwal pembersihan alat makan harian. Petugas pengantar wajib memakai sarung tangan dan penutup kepala."],
    ["lainnya", "Perbaikan kebersihan sudah dicek ulang dan didokumentasikan."],
  ],
  gizi_porsi: [
    ["klarifikasi", "Ahli gizi SPPG meninjau takaran porsi untuk setiap jenjang sekolah."],
    ["perbaikan", "Takaran lauk dan buah disesuaikan dengan standar porsi jenjang. Menu mingguan diumumkan ke sekolah."],
    ["lainnya", "Sekolah mengonfirmasi porsi sudah sesuai menu selama satu minggu terakhir."],
  ],
  distribusi: [
    ["klarifikasi", "Pengelola SPPG menjelaskan keterlambatan disebabkan armada yang kurang."],
    ["perbaikan", "Satu armada distribusi ditambahkan dan jadwal kirim dimajukan 30 menit."],
    ["lainnya", "Pengiriman tepat waktu selama lima hari sekolah berturut-turut."],
  ],
  pengadaan: [
    ["klarifikasi", "Korwil BGN meminta dokumen pengadaan bahan kepada pengelola SPPG. Penelaahan sedang berjalan."],
    ["pembinaan", "Hasil telaah administrasi disampaikan ke pengelola; pengadaan berikutnya wajib memakai pembanding harga minimal tiga pemasok."],
    ["lainnya", "Telaah administrasi selesai. Temuan diteruskan ke unit pengawasan internal sesuai prosedur."],
  ],
  lainnya: [
    ["klarifikasi", "SPPG menghubungi sekolah untuk mengklarifikasi kebutuhan yang disampaikan."],
    ["perbaikan", "Jadwal menu dan kontak pengaduan SPPG dibagikan ke sekolah dan grup orang tua."],
    ["lainnya", "Sekolah mengonfirmasi kebutuhan sudah dipenuhi."],
  ],
};

export const KOMENTAR_RATING: Record<number, string[]> = {
  1: ["Tidak ada perubahan berarti.", "Tanggapan sangat lambat dan belum menyelesaikan masalah."],
  2: ["Ada tanggapan, tetapi masalah masih sering terjadi.", "Terlalu lama sampai ada tindakan."],
  3: ["Cukup, semoga ke depan lebih cepat.", "Sudah ada perbaikan meski belum sempurna."],
  4: ["Tanggapan jelas dan ada perbaikan.", "Terima kasih, makanan sekarang lebih baik."],
  5: ["Cepat dan tuntas. Terima kasih!", "Sangat membantu, perbaikannya langsung terasa."],
};

export const KOMODITAS: { nama: string; satuan: string; harga: [number, number] }[] = [
  { nama: "Beras medium", satuan: "kg", harga: [13200, 14800] },
  { nama: "Telur ayam ras", satuan: "kg", harga: [27500, 31500] },
  { nama: "Daging ayam ras", satuan: "kg", harga: [35000, 40500] },
  { nama: "Minyak goreng", satuan: "liter", harga: [16800, 18800] },
  { nama: "Bawang merah", satuan: "kg", harga: [32000, 45000] },
];
