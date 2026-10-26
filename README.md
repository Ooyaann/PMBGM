<div align="center">

# 🥗 PMBGM
### **Pemantau Makan Bergizi Gratis Masyarakat**
**Platform Pengawasan Partisipatif & Akuntabilitas Publik Program MBG Kota Semarang**

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_17-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Status](https://img.shields.io/badge/Status-Production_Ready-emerald?style=for-the-badge)](https://github.com/Ooyaann/Pantau-Gizi)

---

*Dikembangkan oleh Tim **Ctrl Win Enter** untuk kompetisi **Web In Action (WIA) MIA 2026**.*

</div>

<br />

## 📌 1. Judul Project & Deskripsi Singkat

> **PMBGM (Pemantau MBG Masyarakat)** adalah platform pengawasan publik partisipatif berbasis web yang memberdayakan orang tua murid, guru, dan warga untuk mengawal kualitas Program Makan Bergizi Gratis (MBG) secara transparan, akuntabel, dan *real-time*. Melalui pelaporan masalah terlindungi, pelacakan SLA terbuka, dan pemantauan Indeks Risiko Dapur Satuan Pelayanan (SPPG), PMBGM mencegah risiko keracunan pangan dan memastikan hak nutrisi terbaik bagi generasi penerus bangsa.

---

## 🛠️ 2. Tech Stack yang Digunakan

Aplikasi ini dibangun menggunakan arsitektur modern yang mengedepankan performa tinggi, keandalan data, serta aksesibilitas ramah warga:

| Komponen / Lapisan | Teknologi | Penjelasan & Peran dalam Sistem |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 16 (Turbopack)** | Framework React dengan *App Router*, *Partial Prerendering*, dan kompilasi *React Compiler*. |
| **Core UI & Language** | **React 19 & TypeScript 5** | Manajemen antarmuka berbasis komponen modern dengan ketelitian tipe statis menyeluruh. |
| **Styling & Design System** | **Tailwind CSS v4 & CSS Tokens** | Desain ceria, kontras tinggi, tata letak responsif, serta palet warna ramah warga (WCAG AA). |
| **Komponen Interaktif** | **Base UI & Radix UI** | Primitif UI nir-gaya (*headless*) untuk modal, dialog, dropdown, dan tooltip aksesibel. |
| **Iconography** | **Lucide React** | Ikon visual yang konsisten dan informatif untuk kemudahan pemahaman warga. |
| **Database & Engine** | **Supabase (PostgreSQL 17)** | Skema relasional kuat, *Row Level Security* (RLS), *Materialized Views*, dan *Triggers*. |
| **Realtime Engine** | **Supabase Realtime** | Pembaruan linimasa aduan dan papan akuntabilitas secara instan (latensi <0.2 detik). |
| **Scheduled Automation** | **pg_cron** | Eksekusi otomatis per 15 menit untuk eskalasi batas waktu penanganan (SLA) instansi. |
| **Object Storage** | **Supabase Storage** | Penyimpanan aman bukti foto laporan warga (akses privat untuk pelapor & publik tersaring). |
| **Ekspor Dokumen** | **@react-pdf/renderer** | Mesin pembuatan berkas PDF resmi untuk Berita Acara Perbaikan dan Laporan Insight. |
| **Form & Validasi** | **React Hook Form & Zod** | Validasi masukan data lapor di sisi klien dan server yang ketat dan aman. |
| **Hosting & Deployment** | **Vercel & Supabase Cloud** | Infrastruktur *Edge Network* berkecepatan tinggi dengan ketersediaan global 99.9%. |

---

## 🚀 3. Cara Menjalankan Project (`clone => install => run`)

Berikut adalah panduan lengkap menjalankan proyek PMBGM di lingkungan pengembang lokal:

### Prasyarat Sistem
- **Node.js**: Versi 20.x atau lebih baru (`node -v`)
- **NPM**: Versi 10.x atau lebih baru (`npm -v`)
- **Docker Desktop** *(hanya jika ingin menjalankan Supabase secara lokal)*

---

### Langkah 1: Clone Repository
Buka terminal dan unduh repositori dari GitHub:
```bash
git clone https://github.com/Ooyaann/Pantau-Gizi.git
cd Pantau-Gizi
```

### Langkah 2: Install Dependensi
Pasang seluruh paket pustaka yang dibutuhkan proyek:
```bash
npm install
```

### Langkah 3: Konfigurasi Environment Variable
Salin berkas contoh konfigurasi ke berkas `.env.local`:
```bash
cp .env.example .env.local
```
> Pastikan nilai `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, dan `SUPABASE_SERVICE_ROLE_KEY` terisi (dapat menggunakan instance Supabase Cloud Anda atau Supabase lokal).

### Langkah 4: Inisialisasi Database & Data Simulasi
Jalankan kontainer database lokal dan isi data sampel deterministik Kota Semarang:
```bash
# Menyalakan Supabase lokal beserta migrasi skema
npm run db:start

# Mengisi data simulasi (25 SPPG, 165 sekolah, ~1.000 laporan)
npm run seed
```
*(Jika menggunakan Supabase Cloud yang sudah terisi, Anda dapat melewati langkah `db:start`)*.

### Langkah 5: Jalankan Server Pengembang (`Run`)
Nyalakan server pengembang Next.js:
```bash
npm run dev
```
Buka peramban Anda di alamat: **[http://localhost:3000](http://localhost:3000)** 🌐

---

### Perintah Penting Lainnya
| Perintah | Deskripsi |
| :--- | :--- |
| `npm run build` | Membuat bundel produksi teroptimasi (*Production Build*) |
| `npm run start` | Menjalankan server aplikasi dari hasil build produksi |
| `npm run lint` | Menjalankan audit linter ESLint |
| `npx tsc --noEmit` | Memeriksa integritas tipe TypeScript (*Static Typecheck*) |
| `npm run db:reset` | Mereset database lokal dan mengaplikasikan ulang seed data |
| `npm run db:stop` | Menghentikan kontainer Supabase lokal |

---

## 📈 4. Progress Saat Ini (Daftar Fitur yang Selesai)

Aplikasi **PMBGM** telah selesai diimplementasikan secara komprehensif dengan cakupan modul sebagai berikut:

- [x] **🏠 Beranda Interaktif & Partisipatif (`/`)**
  - Statistik real-time nasional & Kota Semarang (Porsi makan, anggaran, dapur aktif, kepuasan).
  - Tautan aksi cepat ramah warga: *Lapor Masalah*, *Lacak Status*, *Cari Sekolah*, dan *Data Terbuka*.
  - Pemantauan SPPG Prioritas Inspeksi dan sinyal peringatan dini lonjakan aduan.
- [x] **📝 Modul Lapor Masalah Terlindungi (`/lapor`)**
  - Form bertahap (*multi-step wizard*) yang mudah dan inklusif.
  - Mode Anonim/Kerahasiaan Identitas untuk melindungi pelapor dari intimidasi.
  - Deteksi instan laporan serupa (dalam radius & rentang 24 jam) untuk mencegah tiket duplikat.
  - Unggah bukti foto langsung melalui kamera gawai atau berkas galeri.
  - Geolokasi otomatis untuk mendeteksi sekolah dan dapur SPPG pemasok secara akurat.
- [x] **🔍 Modul Lacak & Papan Akuntabilitas SLA (`/lacak`, `/lacak/[kode]`)**
  - Cek progres penanganan tiket menggunakan kode tiket unik (contoh: `MBG-2026-X8Y9`).
  - Linimasa audit terbuka (*transparent audit trail*) yang mencatat setiap aksi penanganan.
  - Status kepatuhan batas waktu (SLA) instansi dengan penanda tegas *"Melewati Batas Waktu"* dan *"Tidak Ditanggapi"*.
  - Formulir penilaian kepuasan orang tua siswa pasca perbaikan (bintang 1–5 dan sanggahan).
- [x] **🏫 Direktori Pencarian Sekolah & SPPG (`/cari-sekolah`)**
  - Pencarian cepat sekolah berdasarkan nama, jenjang (TK, SD, SMP, SMA), atau kecamatan.
  - Kartu informasi sekolah lengkap dengan SPPG penyedia, status SLHS, dan jumlah kasus berjalan.
- [x] **📊 Modul Data Terbuka Program MBG (`/data`)**
  - Direktori Lengkap SPPG Kota Semarang dengan skor Indeks Risiko dan status operasional (`/data/sppg`).
  - Halaman profil mendalam setiap SPPG (`/data/sppg/[id]`) disertai grafik riwayat tren 12 minggu.
  - Rekapitulasi per wilayah kecamatan dan kabupaten/kota se-Jawa Tengah (`/data/wilayah`).
  - Pusat unduh data publik format CSV dan JSON terstandarisasi Satu Data Indonesia (`/data/unduh`).
- [x] **🧭 Modul Insight & Analitik Risiko (`/insight`)**
  - **Peta Risiko Interaktif**: Visualisasi peta sebaran SPPG dengan filter kategori risiko tinggi, sedang, dan rendah.
  - **Daftar Prioritas Inspeksi**: Rekomendasi audit lapangan berbasis skor risiko gabungan 5 parameter.
  - **Sinyal Lonjakan Kasus**: Algoritma deteksi anomali kenaikan aduan >3× rata-rata harian (pencegahan KLB).
  - **Komparasi SPPG (`/insight/banding`)**: Fitur perbandingan *side-by-side* kinerja antar dua dapur katering.
- [x] **📑 Ekspor Dokumen Resmi PDF**
  - Pembuatan lembar Laporan Analisis Kepatuhan & Risiko SPPG berstandar resmi instansi via `@react-pdf/renderer`.
- [x] **💡 Pusat Panduan Interaktif & Kamus Warga (`/panduan`)**
  - Dasbor panduan alur lapor, arti label metrik, dan hak partisipasi warga dengan ilustrasi antarmuka nyata.
  - Tooltip edukatif pintar (`InfoMetrik`) di setiap istilah teknis (SLHS, SLA, Indeks Risiko) dengan penjelasan sederhana.
- [x] **🚨 Widget Tanggap Darurat Keracunan**
  - Tombol darurat mengambang di pojok layar dengan akses cepat hotline 112/119 dan SOP pertolongan pertama keracunan.
- [x] **🔐 Panel Pengawasan Multi-Peran (`/panel`)**
  - **Verifikator Independen**: Verifikasi keabsahan bukti foto dan kategorisasi prioritas kasus.
  - **Dapur SPPG**: Unggah berita acara perbaikan fisik dan klarifikasi menu.
  - **Dinas Kesehatan (Dinkes)**: Audit izin SLHS dan investigasi sampel makanan.
  - **Korwil BGN & Admin**: Pengawasan kepatuhan lintas wilayah dan penutupan sementara operasional.

---

## 🔑 Akun Demo Pengujian (Untuk Dewan Juri)

Untuk menguji seluruh alur kerja dan variasi hak akses sistem, telah disiapkan 7 akun persona siap pakai:

| Peran | Akun Email | Persona & Tugas Pengujian |
| :--- | :--- | :--- |
| **Warga (Orang Tua)** | `rina@pmbgm.test` | Ibu Rina · Melaporkan porsi kurang dan memberi nilai kepuasan. |
| **Guru (Terverifikasi)** | `budi@pmbgm.test` | Pak Budi · Guru pelapor dengan bobot verifikasi prioritas cepat. |
| **Verifikator Wilayah** | `sari@pmbgm.test` | Mbak Sari · Memeriksa foto bukti, menyetujui atau menolak tiket aduan. |
| **Pengelola SPPG** | `sppg@pmbgm.test` | Dapur Tembalang 03 · Merespons keluhan dan mengunggah bukti perbaikan menu. |
| **Dinas Kesehatan** | `hendra@pmbgm.test` | Pak Hendra (Dinkes) · Menindaklanjuti kasus higienitas dan pembaruan izin SLHS. |
| **Korwil BGN** | `korwil@pmbgm.test` | Pengawas Badan Gizi Nasional · Mengevaluasi dapur bermasalah & eskalasi SLA. |
| **Admin Sistem** | `admin@pmbgm.test` | Administrator · Pengelolaan master data sekolah, SPPG, dan konfigurasi wilayah. |

> **Kata Sandi Akun Demo**: Gunakan nilai yang ditentukan pada `DEMO_PASSWORD` di `.env.local` (default: `Pmbgm2026!`).

---

## ✨ Inovasi & Nilai Tambah Utama

1. **Rumus Indeks Risiko Terbuka (0–100)**:
   Perhitungan transparan berbasis 5 bobot indikator: frekuensi aduan (30%), insidensi keracunan (25%), kepemilikan sertifikat Laik Higiene Sanitasi/SLHS (20%), ketepatan waktu tanggap SLA (15%), dan kepuasan warga (10%).
2. **Akuntabilitas Waktu Nyata Tanpa Manipulasi**:
   Log riwayat status bersumber dari tabel PostgreSQL *append-only* dengan aturan RLS ketat, memastikan tidak ada instansi yang dapat menghapus atau memanipulasi keterlambatan penanganan.
3. **Pencegahan KLB Keracunan Pangan**:
   Sistem memantau kenaikan jumlah anak yang terdampak gejala pencernaan dan secara otomatis memunculkan sinyal merah darurat di dasbor Korwil BGN serta Dinkes jika terjadi indikasi kontaminasi massal.
4. **Desain Ceria & Ramah Warga**:
   Antarmuka memadukan kesederhanaan navigasi, tipografi yang nyaman dibaca, serta penjelasan istilah teknis secara langsung, sehingga dapat digunakan dengan mudah oleh seluruh lapisan masyarakat.

---

## 👥 Tim Pengembang

Platform **PMBGM** dirancang dan dibangun dengan dedikasi penuh oleh tim:

### **Ctrl Win Enter** 
*Kompetisi Web In Action (WIA) — MIA 2026*

---
<div align="center">
  <small>© 2026 PMBGM (Pemantau MBG Masyarakat). Didedikasikan untuk transparansi gizi anak Indonesia.</small>
</div>
