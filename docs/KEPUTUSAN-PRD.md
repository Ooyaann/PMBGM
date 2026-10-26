# Keputusan Desain & Pembaruan PRD — PMBGM

**Proyek**: PMBGM (Pemantau MBG Masyarakat)  
**Kompetisi**: Web In Action (WIA) · MIA 2026  
**Tim Pengembang**: Ctrl Win Enter  
**Status**: Disahkan & Terimplementasi Penuh

---

## 1. Identitas Brand (Rebranding)
- **Nama Resmi**: **PMBGM** (*Pemantau MBG Masyarakat*).
- **Filosofi Visual**: Simbol kaca pembesar meneliti baki ompreng bersekat MBG dengan garis kontur tebal putih (*bold contour*) yang dinamis mengikuti lekukan siluet asli, memadukan warna *Fresh Emerald* (keamanan pangan) dan *Teal Cyan* (transparansi data publik).
- **Aset Master**: Tersedia di direktori `public/` dalam format SVG vektor serta PNG ultra-resolusi (1024×1024, 2048×2048, dan 2500×500).

---

## 2. Rangkuman Keputusan Utama (K1 – K9)

### [K1] Verifikasi Independen Bertingkat (*Verified-First*)
Laporan warga tidak langsung masuk ke publik sebagai tuduhan mentah, melainkan diverifikasi terlebih dahulu oleh tim verifikator wilayah independen guna menyaring hoaks, memvalidasi bukti foto, dan menggabungkan aduan serupa.

### [K2] Tautan Otomatis Wilayah & Dapur
Setiap sekolah dihubungkan ke SPPG mitra penyedia makanannya dan wilayah administratifnya (kecamatan/kabupaten). Pengguna cukup memilih sekolah; sistem otomatis mengaitkan SPPG penanggung jawab.

### [K3] Penanganan Kasus Darurat (Keracunan & Higiene Berat)
Kategori keracunan makanan mendapatkan jalur darurat (*fast-track*) dengan SLA respons 2 jam, notifikasi instan ke Dinas Kesehatan Kota, dan **tidak dapat diselesaikan sepihak oleh SPPG tanpa Berita Acara Pemeriksaan (BAP) resmi Dinas Kesehatan**.

### [K4] Otentikasi & Akun Demo
Menggunakan kombinasi Email + Kata Sandi terdaftar dengan kredibilitas pelapor bertingkat. Untuk evaluasi juri lomba, disediakan mode demo instan multi-peran dengan kata sandi terstandar.

### [K5] Alur 4 Langkah Pengawasan Terbuka (Menggantikan 4 Lensa)
Beranda publik menyajikan proses konkret yang mudah dipahami warga awam:
1. **Lapor Cepat & Aman**: Warga/Guru melapor dengan bukti foto (opsi Rahasia/Anonim).
2. **Verifikasi Objektif**: Verifikator memeriksa keabsahan bukti dan menggabungkan duplikat.
3. **Tindak Lanjut Nyata**: Diteruskan langsung ke SPPG dan Dinas Kesehatan wilayah.
4. **Pengawasan Terbuka**: Linimasa perbaikan, batas waktu SLA, dan rapor dapur terpampang transparan.

### [K6] Data Terbuka Kepatuhan Dapur (Menggantikan Komoditas Harga Pangan)
Modul DT-08 diganti dari tabel harga mentah (minyak/beras) menjadi **Kepatuhan Dapur SPPG Wilayah**:
- Rasio kepemilikan Sertifikat Laik Higiene Sanitasi (SLHS) aktif vs kedaluwarsa vs tanpa izin.
- Status operasional dapur (normal vs ditutup sementara untuk perbaikan).
- Rata-rata Skor Risiko dapur per kecamatan.

### [K7] Routing Otomatis Penanggung Jawab
Menghapus kebutuhan seleksi manual oleh admin. Begitu laporan disetujui verifikator:
- Sistem otomatis menetapkan SPPG pengelola sebagai penanggung jawab perbaikan.
- Tembusan otomatis dikirim ke Dinas Kesehatan untuk masalah kebersihan dan keracunan.
- Korwil BGN menerima ringkasan eskalasi untuk pengawasan kepatuhan SLA.

### [K8] Pemisahan Peran & Tata Letak Antarmuka (Left Sidebar Panel)
- **Area Publik & Warga (`/`, `/lapor`, `/lacak`, `/data`, `/insight`, `/akun`)**: Memakai navigasi atas bersih (*top navbar*) untuk kemudahan eksplorasi.
- **Area Kerja Staf (`/panel/*`)**: Memakai **Left Sidebar Layout** terdedikasi dengan warna aksen identitas per instansi, memuat menu spesifik:
  - **Dapur SPPG**: Kotak masuk kasus dapurnya, tombol unggah foto perbaikan, dan rapor performa dapur.
  - **Dinas Kesehatan**: Dasbor investigasi medis keracunan, prioritas inspeksi sanitasi, dan peringatan dini KLB.
  - **Korwil BGN**: Dasbor pengawasan SLA se-kota, penanganan dapur telat/macet, dan audit kepatuhan mitra.
  - **Verifikator Independen**: Antrean laporan masuk, checklist verifikasi bukti, dan merger aduan serupa.
  - **Admin Sistem**: Pengelolaan akun guru/sekolah, data master, aturan waktu SLA, dan log audit sistem.

### [K9] Literasi Publik & Kamus Metrik Ramah Awam
Setiap angka teknis (Skor Risiko 0–100, Waktu Tanggap, Persentase Selesai, Keterlambatan SLA, SLHS, Sinyal Lonjakan) dilengkapi komponen interaktif `InfoMetrik` (tooltip desktop dan popover layar sentuh) dengan penjelasan bahasa manusia tanpa jargon rumit.

---

## 3. Mekanisme Anti-Manipulasi & Transparansi Dua Arah

Untuk menjamin tidak ada manipulasi tindakan oleh dapur nakal:
1. **Wajib Foto Bukti Perbaikan**: SPPG dilarang menutup aduan hanya dengan teks. Setiap penyelesaian wajib melampirkan foto fisik dapur yang telah dibersihkan, penggantian menu, atau bukti uji lab yang langsung muncul di linimasa publik kasus.
2. **Masa Sanggah 3 Hari bagi Pelapor**: Setelah status dinyatakan "Selesai", pelapor menerima notifikasi dan memiliki masa sanggah 3 hari untuk mengonfirmasi hasil perbaikan, memberikan rating kepuasan (1–5 bintang), atau membuka sanggahan jika makanan masih bermasalah.
3. **Kunci Verifikasi Dinas Kesehatan**: Kasus keracunan makanan tidak dapat ditutup oleh dapur sebelum verifikator Dinas Kesehatan mengunggah verifikasi lapangan.
4. **Log Audit Tak Terhapus (*Immutable Audit Trail*)**: Seluruh perubahan status, catatan petugas, dan unggahan foto tercatat permanen dengan cap waktu presisi di database.
5. **Indeks Risiko Otomatis**: Skor reputasi dapur dihitung langsung oleh rumus sistematis dari 5 indikator matematis tanpa bisa diubah manual oleh pengelola dapur.
