<div align="center">

# PMBGM
### Platform Pemantauan Partisipatif Berbasis Website untuk Mendukung Transparansi dan Akuntabilitas Program Makan Bergizi Gratis

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-087EA4?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_17-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Python ML](https://img.shields.io/badge/ML_Pipeline-NumPy_%26_Colab-F9AB00?style=flat-square&logo=googlecolab)](./ml-training/Training_Model_ML_PMBGM.ipynb)

*Dikembangkan oleh Tim **Ctrl Win Enter** — Kompetisi Web In Action (WIA) MIA 2026*

</div>

---

## 1. Judul Project & Deskripsi Singkat

**Judul Project**  
**PMBGM: Platform Pemantauan Partisipatif Berbasis Website untuk Mendukung Transparansi dan Akuntabilitas Program Makan Bergizi Gratis**

**Deskripsi Singkat (2 Kalimat)**  
**PMBGM** adalah platform pengawasan publik partisipatif berbasis web yang memfasilitasi orang tua murid, guru, dan warga dalam melaporkan kendala layanan, melacak kepatuhan batas waktu tindak lanjut (SLA), serta memantau kualitas dapur Satuan Pelayanan Pemenuhan Gizi (SPPG) pada Program Makan Bergizi Gratis secara transparan dan *real-time*. Sistem ini mengintegrasikan metode pendukung keputusan *Simple Additive Weighting* (SAW) dan model *Machine Learning* privat (*Naive Bayes* & *Multi-Layer Perceptron*) untuk mendeteksi keaslian bukti laporan, memetakan prioritas inspeksi Dinas Kesehatan, serta mencegah Kejadian Luar Biasa (KLB) keracunan pangan.

---

## 2. Tech Stack yang Digunakan

| Lapisan Sistem | Teknologi Utama | Peran dalam Aplikasi |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 16.4 (App Router & Turbopack)** | *Server Components*, *Server Actions*, *Cache Components* (`"use cache"`), dan *React Compiler*. |
| **Bahasa & Core UI** | **React 19.3, TypeScript 5, HTML5, CSS3** | Komponen antarmuka reaktif dengan pemeriksaan tipe statis menyeluruh (`strict mode`). |
| **Styling & UI Primitives** | **Tailwind CSS v4, Base UI, Lucide React** | Sistem desain berbasis token semantik OKLCH, kontras aksesibel (WCAG AA), dan komponen responsif. |
| **Database & Keamanan** | **Supabase (PostgreSQL 17)** | Penyimpanan relasional dengan *Row Level Security* (RLS), *Materialized View*, fungsi RPC, dan *Trigger*. |
| **Realtime & Otomasi** | **Supabase Realtime & `pg_cron`** | Pembaruan langsung antrean/linimasa kasus serta eskalasi otomatis keterlambatan SLA setiap 15 menit. |
| **Penyimpanan Berkas** | **Supabase Storage (`exifr`, kompresi klien)** | Bucket privat bukti warga (URL bertanda tangan) dan pembersihan metadata lokasi sebelum publikasi. |
| **Machine Learning & DSS** | **Python (Colab/NumPy) → TypeScript Native** | Pelatihan model *Multinomial Naive Bayes* & *Feedforward MLP ANN* (`7 → 12 → 3`) di Google Colab serta perhitungan DSS SAW. |
| **Peta & Visualisasi Data** | **D3-Geo (`d3-geo`) & Recharts 3** | Peta koroplet interaktif 35 kab/kota Jawa Tengah & 16 kecamatan Kota Semarang serta grafik analitik. |
| **Validasi & Dokumen** | **Zod 4 & `@react-pdf/renderer`** | Validasi skema input klien-server dan pembuatan dokumen laporan resmi berformat PDF. |

---

## 3. Cara Menjalankan Project (`clone => install => run`)

### Prasyarat
- **Node.js** versi 20.x atau lebih baru
- **NPM** versi 10.x atau lebih baru

### Langkah 1 — Clone Repository
```bash
git clone https://github.com/Ooyaann/PMBGM.git
cd PMBGM
```

### Langkah 2 — Install Dependensi
```bash
npm install
```

### Langkah 3 — Konfigurasi Environment (`.env.local`)
Salin berkas `.env.example` menjadi `.env.local` lalu isi kredensial Supabase:
```bash
cp .env.example .env.local
```
Variabel utama di dalam `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<supabase-anon-publishable-key>
SUPABASE_SECRET_KEY=<supabase-service-role-secret-key>
DATABASE_URL=postgresql://postgres.<project-ref>:<password>@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres
DEMO_PASSWORD=DemoPMBGM-2026!
NEXT_PUBLIC_MODE_DEMO=true
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Langkah 4 — Inisialisasi Data Simulasi (Opsional bila DB belum terisi)
```bash
npm run seed
```

### Langkah 5 — Jalankan Aplikasi (`Run`)
```bash
npm run dev
```
Akses aplikasi di peramban melalui alamat **[http://localhost:3000](http://localhost:3000)**.

| Perintah Tambahan | Fungsi |
| :--- | :--- |
| `npm run build` | Membangun bundel produksi Next.js |
| `npm run start` | Menjalankan server produksi hasil build |
| `npm run typecheck` | Memeriksa tipe statis TypeScript (`tsc --noEmit`) |
| `npm run lint` | Menjalankan pemeriksaan kode dengan ESLint |
| `npm run seed` | Menyegarkan data simulasi, akun demo, dan indeks risiko di database |

---

## 4. Progress Saat Ini

Seluruh modul utama, basis data, model *Machine Learning*, dan antarmuka pengguna telah selesai **100% (Siap Pakai / Production Ready)**:

- [x] **Beranda Pencarian Terpadu (`/`)**: Pencarian instan sekolah, dapur SPPG, dan nomor tiket aduan beserta pemantauan metrik program.
- [x] **Modul Lapor Masalah 2 Langkah (`/lapor`)**: Pengisian laporan dengan ekstraksi otomatis waktu & GPS foto (`EXIF`), kompresi gambar di sisi klien, deteksi laporan serupa (*deduplikasi*), dan 3 opsi perlindungan identitas (*Rahasia*, *Publik*, *Anonim*).
- [x] **Modul Lacak Tiket & Papan Akuntabilitas (`/lacak`, `/lacak/[kode]`, `/lacak/kasus/[id]`)**: Pelacakan progres 5 tahap penanganan tanpa wajib login, hitung mundur tenggat SLA, penanda otomatis *"Tidak Ditanggapi"*, serta pemberian rating kepuasan (1–5) dan buka ulang kasus.
- [x] **Direktori Pencarian Sekolah (`/cari-sekolah`)**: Pencarian 165 sekolah berdasarkan nama, NPSN, kecamatan, atau dapur SPPG penyedia dengan tautan pelaporan langsung (`?sekolah=`).
- [x] **Portal Data Terbuka & Unduh Dataset (`/data`, `/data/sppg`, `/data/wilayah`, `/data/unduh`)**: Profil lengkap 25 SPPG, riwayat indeks risiko 12 minggu, rekapitulasi anggaran & kasus 35 kab/kota Jawa Tengah, serta unduhan CSV/JSON dan REST API publik (`/api/v1/[dataset]`) berlisensi CC BY 4.0.
- [x] **Insight, Peta Risiko & Komparasi (`/insight`, `/insight/banding`)**: Peta koroplet interaktif Jawa Tengah & Kota Semarang, tabel prioritas inspeksi SPPG, deteksi dini lonjakan kasus 24 jam, komparasi *side-by-side* antar-SPPG/wilayah, dan ekspor laporan PDF.
- [x] **Panduan Interaktif & Simulator DSS SAW (`/panduan`, `/metodologi`, `/faq`)**: Kamus istilah teknis ramah warga dan simulator interaktif untuk menguji perhitungan rumus Indeks Risiko SAW secara langsung.
- [x] **Panel Kerja Multi-Peran (`/panel`)**: Dasbor khusus **Verifikator** (antrean prioritas, skor kredibilitas, evaluasi ML Multimodal), **Instansi/Dapur SPPG/Dinkes/Korwil BGN** (tindak lanjut dan unggah bukti perbaikan), serta **Admin** (kelola peran pengguna dan batas waktu SLA per kategori).

---

## 5. Metode Komputasi & Model AI / Machine Learning

PMBGM menggunakan pendekatan **White-Box Decision Support System** dan **Private Machine Learning (Non-LLM)** yang berjalan langsung di server aplikasi dan database tanpa ketergantungan API LLM berbayar:

1. **Simple Additive Weighting (SAW) — Indeks Risiko SPPG (0–100)**  
   Menentukan urutan prioritas inspeksi dapur SPPG setiap jam berdasarkan 5 kriteria berbobot:
   $$\text{Indeks Risiko} = 0{,}35 L + 0{,}25 K + 0{,}15 S + 0{,}15 T + 0{,}10 (100 - P)$$
   - $L$ (**35%**): Tingkat laporan terverifikasi 30 hari terakhir per 1.000 porsi harian (dinormalisasi persentil ke-95).
   - $K$ (**25%**): Tingkat kasus dugaan keracunan 30 hari terakhir per 1.000 porsi harian.
   - $S$ (**15%**): Status kepatuhan Sertifikat Laik Higiene Sanitasi / SLHS (`berlaku = 0`, `proses = 50`, `kedaluwarsa/tidak ada = 100`).
   - $T$ (**15%**): Persentase kasus melewati batas waktu SLA dalam 90 hari terakhir.
   - $P$ (**10%**): Skor kepuasan pelapor yang dibalik ($100 - P$) dengan *Bayesian smoothing* ke rata-rata kota.
   - **Ambang Kategori**: `0–39` Rendah · `40–69` Sedang · `70–100` Tinggi.

2. **Feedforward Multi-Layer Perceptron (MLP / ANN `7 → 12 → 3`) — Verifikasi Keaslian Laporan**  
   Model jaringan saraf tiruan yang dilatih di Google Colab ([`ml-training/Training_Model_ML_PMBGM.ipynb`](./ml-training/Training_Model_ML_PMBGM.ipynb)) pada 1.500 sampel dataset laporan MBG ([`ml-training/dataset_laporan_mbg.csv`](./ml-training/dataset_laporan_mbg.csv)) dengan akurasi uji **95,33%**:
   - **Input Layer (7 Fitur Multimodal)**: Leksikon menu MBG ($x_1$), anomali gejala medis ($x_2$), koherensi & kerapatan teks anti-spam ($x_3$), kecocokan waktu foto EXIF $\le 48$ jam ($x_4$), kecocokan koordinat GPS foto $\le 2$ km dari sekolah ($x_5$), status verifikasi pelapor ($x_6$), dan kewajaran rasio siswa terdampak ($x_7$).
   - **Hidden Layer**: 12 neuron dengan fungsi aktivasi *Rectified Linear Unit* (`ReLU`).
   - **Output Layer**: 3 neuron dengan aktivasi `Softmax` (*Otentik & Valid*, *Meragukan*, *Indikasi Fiktif*).

3. **Multinomial Naive Bayes & Pencocokan Leksikal — Klasifikasi Kategori & Urgensi Otomatis**  
   Menghitung *log-likelihood* kata kunci gejala dan masalah pangan untuk menyarankan kategori laporan serta menandai tingkat urgensi (`darurat`, `tinggi`, `normal`) secara instan saat laporan dibuat.

4. **Rule-Based Credibility Scoring (0–100) & Anomaly Spike Detection**  
   - **Skor Kredibilitas Laporan**: Menggabungkan kelengkapan bukti foto/video (maks 30 poin), kecocokan metadata EXIF waktu & lokasi (maks 25 poin), reputasi pelapor (maks 25 poin), dukungan warga *"Saya juga mengalami"* (maks 15 poin), dan kelengkapan kronologi (maks 5 poin).
   - **Deteksi Dini KLB**: Memicu peringatan darurat otomatis apabila dalam 24 jam terakhir sebuah SPPG menerima $\ge 3$ laporan dengan laju $> 3\times$ rata-rata harian 30 hari sebelumnya.

---

## 6. Akun Demo Pengujian (Untuk Dewan Juri)

Seluruh akun demo dapat langsung diakses melalui tombol pilih cepat di halaman **`/masuk`** (atau menggunakan kata sandi sesuai variabel `DEMO_PASSWORD` di `.env.local`):

| Peran | Email Akun | Persona & Skenario Uji |
| :--- | :--- | :--- |
| **Pelapor (Orang Tua)** | `rina@pmbgm.test` | **Ibu Rina** — Melapor masalah makanan di SD Tembalang 10 & memantau tiket. |
| **Pelapor Terverifikasi** | `budi@pmbgm.test` | **Pak Budi** — Guru SMP Semarang Tengah 1 dengan bobot kredibilitas terverifikasi. |
| **Verifikator** | `sari@pmbgm.test` | **Mbak Sari** — Memeriksa antrean laporan, hasil evaluasi ML/EXIF, dan meneruskan kasus. |
| **Dinas Kesehatan** | `hendra@pmbgm.test` | **Pak Hendra** — Menangani kasus keracunan/higiene, memantau sinyal KLB & prioritas inspeksi. |
| **Pengelola SPPG** | `sppg@pmbgm.test` | **Pengelola SPPG Tembalang 03** — Menanggapi kasus yang diteruskan dan mengunggah bukti perbaikan. |
| **Korwil BGN** | `korwil@pmbgm.test` | **Korwil BGN Kota Semarang** — Memantau kepatuhan SLA dan papan akuntabilitas SPPG wilayah. |
| **Administrator** | `admin@pmbgm.test` | **Admin PMBGM** — Mengelola peran pengguna dan mengatur batas waktu SLA per kategori. |

---

<div align="center">
  <small>© 2026 Tim Ctrl Win Enter — PMBGM. Lisensi Data Terbuka CC BY 4.0.</small>
</div>
