# PantauGizi

Platform pengawasan partisipatif Program Makan Bergizi Gratis (MBG): warga melapor masalah MBG, memantau tindak lanjutnya secara terbuka, dan melihat data program serta indeks risiko dapur (SPPG) di satu tempat. Karya tim **Ctrl Win Enter** untuk lomba Web In Action (WIA) MIA 2026.

> Nama kerja. Semua nama SPPG dan sekolah dalam data simulasi adalah **fiktif**; nama wilayah asli.

## Tech stack

| Lapisan | Teknologi |
|---|---|
| Frontend | Next.js 16 (App Router, React 19, React Compiler) · TypeScript · Tailwind CSS 4 |
| Backend & database | Supabase: PostgreSQL 17 (RLS, trigger, materialized view), Auth, Storage, Realtime, pg_cron |
| Validasi | Zod |
| Data simulasi | Script seed deterministik (TypeScript + postgres.js) |
| Hosting | Vercel (aplikasi) · Supabase (database) |

Pengolahan data utama berjalan di database:

- **Lapor**: tautan otomatis sekolah → SPPG → wilayah, kode tiket, deteksi laporan serupa (≤ 24 jam), skor kredibilitas.
- **Lacak**: riwayat status yang hanya bisa ditambah, SLA per kategori dan tahap, eskalasi otomatis tiap 15 menit.
- **Data Terbuka**: agregasi anggaran, penerima, dan kasus per wilayah dan bulan.
- **Insight**: Indeks Risiko SPPG 0–100 dengan rumus terbuka, prioritas inspeksi, dan peringatan dini lonjakan.

## Cara menjalankan

Prasyarat: **Node.js 20+** dan **Docker Desktop** (untuk Supabase lokal).

```bash
git clone <url-repository> pantaugizi
cd pantaugizi
npm install
cp .env.example .env.local
npm run db:start
```

`npm run db:start` menyalakan Supabase lokal dan menerapkan semua migrasi di `supabase/migrations`. Setelah selesai:

1. Jalankan `npm run db:status`, lalu salin **API URL** dan **Publishable key** ke `.env.local`.
2. Isi data simulasi:

   ```bash
   npm run seed
   ```

3. Jalankan aplikasi:

   ```bash
   npm run dev
   ```

Buka http://localhost:3000. Supabase Studio lokal ada di http://localhost:54323.

### Perintah lain

| Perintah | Fungsi |
|---|---|
| `npm run db:reset` | Hapus database lokal, terapkan ulang migrasi, lalu seed |
| `npm run db:types` | Buat tipe TypeScript dari skema database |
| `npm run db:stop` | Matikan Supabase lokal |
| `npm run typecheck` / `npm run lint` | Pemeriksaan kode |

### Akun demo

Seed membuat satu akun untuk setiap peran. Kata sandinya adalah nilai `DEMO_PASSWORD` di `.env.local`.

| Peran | Email | Persona |
|---|---|---|
| Pelapor | `rina@pantaugizi.test` | Ibu Rina, orang tua siswa SD di Tembalang |
| Pelapor terverifikasi | `budi@pantaugizi.test` | Pak Budi, guru penanggung jawab MBG |
| Verifikator | `sari@pantaugizi.test` | Mbak Sari, tim verifikasi |
| Instansi | `hendra@pantaugizi.test` | Pak Hendra, Dinas Kesehatan Kota Semarang |
| Instansi | `sppg@pantaugizi.test` | Pengelola SPPG Contoh Tembalang 03 |
| Instansi | `korwil@pantaugizi.test` | Korwil BGN Kota Semarang |
| Admin | `admin@pantaugizi.test` | Pengelola sistem |

### Data simulasi

`npm run seed` selalu menghasilkan data yang sama, dihitung relatif terhadap waktu seed dijalankan:

- Jawa Tengah (35 kab/kota): agregat anggaran, penerima, jumlah SPPG, dan ringkasan kasus per bulan.
- Kota Semarang (16 kecamatan): sampel 25 SPPG, ±165 sekolah, ±1.000 laporan selama ±3,5 bulan, beserta riwayat statusnya.
- Pola yang sengaja ditanam: tiga SPPG bermasalah, lonjakan keracunan di Banyumanik, kecamatan responsif (Gajahmungkur), laporan duplikat, dan laporan yang ditolak dengan alasan jelas.

Sebelum demo, buka dashboard sekali agar layanan Realtime sudah "panas"; event pertama setelah Supabase baru menyala bisa tertunda. Jalankan seed sekitar satu jam sebelum demo. Tiga laporan keracunan untuk skenario demo dibuat dua jam sebelum waktu seed, dan laporan baru dianggap serupa bila jarak kejadiannya ≤ 24 jam.

## Struktur

```
supabase/migrations/   skema, view & indeks risiko, fungsi & trigger, RLS, storage/realtime/cron
scripts/seed/          generator data simulasi deterministik
src/lib/supabase/      klien Supabase (browser, server, proxy sesi)
src/proxy.ts           pembaruan sesi dan perlindungan rute /panel dan /akun
```

## Progres

- [x] Skema database, Row Level Security, trigger, RPC per peran, Indeks Risiko, view publik
- [x] Seed data simulasi Jawa Tengah dan Kota Semarang, akun demo per peran
- [x] Proyek Next.js 16 dan koneksi Supabase ber-tipe (browser, server, proxy)
- [x] Diuji di Supabase lokal: login 7 akun demo, RLS per peran, storage bukti privat/publik, realtime (±0,2 detik), eskalasi SLA via pg_cron
- [ ] Landing page dan halaman publik
- [ ] Modul Lapor (form bertahap, mode darurat, unggah bukti)
- [ ] Modul Lacak (cek status, timeline, Papan Akuntabilitas)
- [ ] Modul Data Terbuka (dashboard, profil SPPG, unduh data)
- [ ] Modul Insight (peta risiko, prioritas inspeksi, peringatan dini)
- [ ] Panel verifikator, instansi, dan admin
