-- =============================================================================
-- PantauGizi · Migrasi 1: tipe enum dan tabel inti
-- Model data mengikuti PRD bagian 9.1 dan Keputusan-PRD (K3: laporan terverifikasi
-- selalu masuk ke sebuah kasus; status dan SLA melekat pada kasus).
-- =============================================================================

create extension if not exists pgcrypto with schema extensions;
create extension if not exists pg_trgm with schema extensions;   -- autocomplete nama sekolah

-- -----------------------------------------------------------------------------
-- Tipe enum
-- -----------------------------------------------------------------------------
create type public.peran_pengguna as enum ('pelapor', 'verifikator', 'instansi', 'admin');

create type public.jenis_pelapor as enum (
  'orang_tua', 'siswa', 'guru', 'warga', 'sekolah', 'komite_sekolah', 'kader_posyandu'
);

create type public.level_wilayah as enum ('provinsi', 'kabkota', 'kecamatan');

create type public.jenjang_sekolah as enum ('paud', 'sd', 'smp', 'sma', 'smk', 'slb');

create type public.status_operasional as enum (
  'persiapan', 'beroperasi', 'ditutup_sementara', 'ditutup'
);

create type public.status_slhs as enum ('berlaku', 'kedaluwarsa', 'proses', 'tidak_ada');

create type public.jenis_instansi as enum (
  'sppg', 'korwil_bgn', 'dinas_kesehatan', 'dinas_pendidikan', 'ombudsman'
);

-- Label sumber wajib di setiap tampilan data (PRD 3.4).
create type public.sumber_data as enum (
  'resmi', 'masyarakat_sipil', 'laporan_warga_terverifikasi', 'simulasi'
);

create type public.kategori_laporan as enum (
  'keracunan',            -- gangguan kesehatan setelah makan MBG (mode darurat)
  'makanan_tidak_layak',  -- basi, berbau, berulat, mentah
  'kebersihan',           -- kebersihan dapur, alat, atau penyajian
  'gizi_porsi',           -- porsi atau komposisi gizi tidak sesuai
  'distribusi',           -- terlambat, tidak dikirim, jumlah kurang
  'pengadaan',            -- dugaan penyimpangan anggaran atau pengadaan
  'lainnya'
);

create type public.tingkat_prioritas as enum ('rendah', 'sedang', 'tinggi', 'darurat');

create type public.mode_identitas as enum ('publik', 'rahasia', 'anonim');

-- Satu alur status untuk laporan dan kasus (PRD 8.1).
-- Laporan memakai: diterima, diverifikasi, ditolak.
-- Kasus memakai: diverifikasi, diteruskan, ditindaklanjuti, selesai, dibuka_ulang.
create type public.status_alur as enum (
  'diterima', 'diverifikasi', 'diteruskan', 'ditindaklanjuti', 'selesai', 'ditolak', 'dibuka_ulang'
);

create type public.jenis_peristiwa as enum (
  'perubahan_status', 'tindak_lanjut', 'penggabungan', 'eskalasi', 'catatan'
);

create type public.jenis_tindakan as enum (
  'inspeksi', 'penutupan_sementara', 'perbaikan', 'klarifikasi', 'pembinaan', 'lainnya'
);

create type public.jenis_bukti as enum ('foto', 'video');

-- -----------------------------------------------------------------------------
-- Data inti bersama: wilayah, instansi, SPPG, sekolah
-- -----------------------------------------------------------------------------
create table public.wilayah (
  id          text primary key,                       -- kode Kemendagri, mis. '33.74.10'
  nama        text not null,
  level       public.level_wilayah not null,
  induk_id    text references public.wilayah (id),
  pusat_lat   double precision,
  pusat_lng   double precision,
  batas       jsonb,                                  -- geometri GeoJSON
  dibuat_pada timestamptz not null default now()
);
create index wilayah_induk_idx on public.wilayah (induk_id);
create index wilayah_level_idx on public.wilayah (level);

create table public.sppg (
  id                      uuid primary key default gen_random_uuid(),
  kode                    text not null unique,       -- mis. 'SPPG-3374-0103'
  nama                    text not null,              -- wajib fiktif: "SPPG Contoh Tembalang 03"
  wilayah_id              text not null references public.wilayah (id),
  alamat                  text,
  lat                     double precision,
  lng                     double precision,
  pengelola               text,                       -- yayasan mitra (fiktif)
  kapasitas_porsi_harian  integer not null check (kapasitas_porsi_harian > 0),
  status_operasional      public.status_operasional not null default 'beroperasi',
  status_slhs             public.status_slhs not null default 'tidak_ada',
  slhs_berlaku_sampai     date,
  mulai_beroperasi        date,
  sumber                  public.sumber_data not null default 'simulasi',
  dibuat_pada             timestamptz not null default now(),
  diperbarui_pada         timestamptz not null default now()
);
create index sppg_wilayah_idx on public.sppg (wilayah_id);

create table public.instansi (
  id          uuid primary key default gen_random_uuid(),
  nama        text not null,
  jenis       public.jenis_instansi not null,
  wilayah_id  text references public.wilayah (id),
  sppg_id     uuid unique references public.sppg (id),  -- terisi bila instansi = pengelola SPPG
  kontak      text,
  dibuat_pada timestamptz not null default now()
);

create table public.sekolah (
  id             uuid primary key default gen_random_uuid(),
  npsn           text unique,                          -- fiktif
  nama           text not null,                        -- wajib fiktif
  jenjang        public.jenjang_sekolah not null,
  jumlah_siswa   integer not null check (jumlah_siswa >= 0),
  wilayah_id     text not null references public.wilayah (id),
  sppg_id        uuid references public.sppg (id),
  alamat         text,
  lat            double precision,
  lng            double precision,
  sumber         public.sumber_data not null default 'simulasi',
  dibuat_pada    timestamptz not null default now()
);
create index sekolah_sppg_idx on public.sekolah (sppg_id);
create index sekolah_wilayah_idx on public.sekolah (wilayah_id);
create index sekolah_nama_trgm_idx on public.sekolah using gin (lower(nama) extensions.gin_trgm_ops);

-- -----------------------------------------------------------------------------
-- Data program (Modul Data Terbuka)
-- -----------------------------------------------------------------------------
create table public.anggaran_bulanan (
  id               bigint generated always as identity primary key,
  wilayah_id       text not null references public.wilayah (id),
  bulan            date not null check (extract(day from bulan) = 1),
  pagu             numeric(18, 2) not null check (pagu >= 0),
  realisasi        numeric(18, 2) not null check (realisasi >= 0),
  jumlah_penerima  integer not null check (jumlah_penerima >= 0),
  jumlah_sppg      integer not null check (jumlah_sppg >= 0),
  sumber           public.sumber_data not null default 'simulasi',
  unique (wilayah_id, bulan)
);

-- Ringkasan kasus per kab/kota (lapisan agregat Jawa Tengah, PRD 3.3).
-- Detail per kecamatan Kota Semarang berasal dari tabel kasus (laporan warga terverifikasi).
create table public.ringkasan_kasus_bulanan (
  id            bigint generated always as identity primary key,
  wilayah_id    text not null references public.wilayah (id),
  bulan         date not null check (extract(day from bulan) = 1),
  jumlah_kasus  integer not null check (jumlah_kasus >= 0),
  jumlah_korban integer not null check (jumlah_korban >= 0),
  sumber        public.sumber_data not null default 'simulasi',
  unique (wilayah_id, bulan)
);

-- DT-08: harga pangan daerah dibandingkan anggaran per porsi (tanpa vonis).
create table public.harga_pangan (
  id           bigint generated always as identity primary key,
  wilayah_id   text not null references public.wilayah (id),
  bulan        date not null check (extract(day from bulan) = 1),
  komoditas    text not null,
  satuan       text not null default 'kg',
  harga        numeric(12, 2) not null check (harga > 0),
  sumber       public.sumber_data not null default 'simulasi',
  unique (wilayah_id, bulan, komoditas)
);

-- -----------------------------------------------------------------------------
-- Pengguna
-- -----------------------------------------------------------------------------
create table public.profil_pengguna (
  id             uuid primary key references auth.users (id) on delete cascade,
  nama_tampilan  text,
  peran          public.peran_pengguna not null default 'pelapor',
  jenis_pelapor  public.jenis_pelapor,
  terverifikasi  boolean not null default false,       -- Pelapor Terverifikasi (badge)
  instansi_id    uuid references public.instansi (id),
  sekolah_id     uuid references public.sekolah (id),
  dibuat_pada    timestamptz not null default now(),
  constraint instansi_wajib_untuk_peran_instansi
    check (peran <> 'instansi' or instansi_id is not null)
);
create index profil_instansi_idx on public.profil_pengguna (instansi_id);

-- -----------------------------------------------------------------------------
-- Laporan, kasus, dan turunannya (Modul Lapor dan Lacak)
-- -----------------------------------------------------------------------------
create table public.kasus (
  id                 uuid primary key default gen_random_uuid(),
  kode_kasus         text not null unique,             -- mis. 'KS-26-000123'
  kategori           public.kategori_laporan not null,
  sppg_id            uuid references public.sppg (id),
  sekolah_id         uuid references public.sekolah (id),
  wilayah_id         text not null references public.wilayah (id),
  judul              text not null,                    -- ringkasan publik, tanpa data pribadi
  ringkasan_publik   text,
  status             public.status_alur not null default 'diverifikasi'
                     check (status in ('diverifikasi', 'diteruskan', 'ditindaklanjuti', 'selesai', 'dibuka_ulang')),
  status_sejak       timestamptz not null default now(),
  tenggat_tahap      timestamptz,                      -- batas SLA tahap berjalan
  terlambat          boolean not null default false,   -- tahap berjalan melewati SLA
  pernah_terlambat   boolean not null default false,
  prioritas          public.tingkat_prioritas not null default 'sedang',
  skor_prioritas     integer not null default 0,
  instansi_id        uuid references public.instansi (id),
  jumlah_laporan     integer not null default 0,
  total_terdampak    integer not null default 0,
  waktu_kejadian     timestamptz not null,
  diverifikasi_pada  timestamptz not null default now(),
  diteruskan_pada    timestamptz,
  ditanggapi_pada    timestamptz,                      -- tindak lanjut pertama dari instansi
  selesai_pada       timestamptz,
  rating_rata        numeric(3, 2),
  jumlah_rating      integer not null default 0,
  dibuat_pada        timestamptz not null default now(),
  diperbarui_pada    timestamptz not null default now()
);
create index kasus_sppg_idx on public.kasus (sppg_id);
create index kasus_wilayah_idx on public.kasus (wilayah_id);
create index kasus_status_idx on public.kasus (status);
create index kasus_instansi_idx on public.kasus (instansi_id);
create index kasus_kejadian_idx on public.kasus (waktu_kejadian);

create table public.laporan (
  id                     uuid primary key default gen_random_uuid(),
  kode_tiket             text not null unique,
  pelapor_id             uuid not null references auth.users (id) on delete restrict,
  kategori               public.kategori_laporan not null,
  sekolah_id             uuid not null references public.sekolah (id),
  sppg_id                uuid references public.sppg (id),          -- diisi trigger dari sekolah
  wilayah_id             text references public.wilayah (id),       -- diisi trigger dari sekolah
  waktu_kejadian         timestamptz not null,
  jumlah_terdampak       integer not null default 0 check (jumlah_terdampak between 0 and 5000),
  deskripsi              text not null check (char_length(deskripsi) between 20 and 4000),
  lokasi_lat             double precision,
  lokasi_lng             double precision,
  mode_identitas         public.mode_identitas not null default 'rahasia',
  status                 public.status_alur not null default 'diterima'
                         check (status in ('diterima', 'diverifikasi', 'ditolak')),
  kasus_id               uuid references public.kasus (id),
  grup_serupa            uuid,                                       -- laporan pertama di kelompok serupa
  skor_kredibilitas      smallint not null default 0 check (skor_kredibilitas between 0 and 100),
  komponen_kredibilitas  jsonb not null default '{}'::jsonb,
  prioritas              public.tingkat_prioritas not null default 'sedang',
  skor_prioritas         integer not null default 0,
  tenggat_verifikasi     timestamptz,
  terlambat              boolean not null default false,
  jumlah_dukungan        integer not null default 0,
  checklist_verifikasi   jsonb,
  alasan_tolak           text,
  klasifikasi_otomatis   jsonb,                                      -- LP-11: saran kategori/urgensi
  diverifikasi_oleh      uuid references auth.users (id),
  diverifikasi_pada      timestamptz,
  dibuat_pada            timestamptz not null default now(),
  diperbarui_pada        timestamptz not null default now(),
  constraint alasan_tolak_wajib check (status <> 'ditolak' or nullif(trim(alasan_tolak), '') is not null),
  constraint kasus_wajib_saat_terverifikasi check (status <> 'diverifikasi' or kasus_id is not null)
);
create index laporan_pelapor_idx on public.laporan (pelapor_id);
create index laporan_kasus_idx on public.laporan (kasus_id);
create index laporan_sppg_idx on public.laporan (sppg_id);
create index laporan_status_idx on public.laporan (status);
create index laporan_serupa_idx on public.laporan (sekolah_id, kategori, waktu_kejadian);
create index laporan_grup_idx on public.laporan (grup_serupa);
create index laporan_dibuat_idx on public.laporan (dibuat_pada);

-- Bukti foto/video. File berada di bucket privat 'bukti'; baris ini tidak memuat metadata lokasi.
create table public.bukti (
  id            uuid primary key default gen_random_uuid(),
  laporan_id    uuid not null references public.laporan (id) on delete cascade,
  path_storage  text not null unique,
  jenis         public.jenis_bukti not null default 'foto',
  ukuran_byte   integer,
  publik        boolean not null default false,       -- true setelah lolos verifikasi
  dibuat_pada   timestamptz not null default now()
);
create index bukti_laporan_idx on public.bukti (laporan_id);

-- Metadata EXIF dipisah agar hanya pelapor pemilik dan verifikator yang bisa membacanya (PRD 7.2).
create table public.bukti_metadata (
  bukti_id    uuid primary key references public.bukti (id) on delete cascade,
  exif_waktu  timestamptz,
  exif_lat    double precision,
  exif_lng    double precision,
  perangkat   text
);

-- Riwayat status: hanya bisa ditambah (LC-03). Update/delete diblokir trigger.
create table public.status_log (
  id               bigint generated always as identity primary key,
  laporan_id       uuid references public.laporan (id) on delete restrict,
  kasus_id         uuid references public.kasus (id) on delete restrict,
  peristiwa        public.jenis_peristiwa not null default 'perubahan_status',
  dari             public.status_alur,
  ke               public.status_alur,
  jenis_tindakan   public.jenis_tindakan,
  pelaku_id        uuid references auth.users (id),   -- null = sistem
  pelaku_peran     text not null default 'sistem',
  pelaku_label     text,                              -- nama instansi/tim yang tampil publik
  catatan          text,
  bukti_paths      text[] not null default '{}',
  publik           boolean not null default true,
  dibuat_pada      timestamptz not null default now(),
  constraint log_punya_subjek check (laporan_id is not null or kasus_id is not null)
);
create index status_log_kasus_idx on public.status_log (kasus_id, dibuat_pada);
create index status_log_laporan_idx on public.status_log (laporan_id, dibuat_pada);

create table public.aturan_sla (
  kategori   public.kategori_laporan not null,
  tahap      public.status_alur not null,             -- tahap yang diukur lamanya
  batas_jam  integer not null check (batas_jam > 0),
  primary key (kategori, tahap)
);

-- "Saya juga mengalami" (LP-07): dukungan pada kelompok laporan serupa.
create table public.dukungan (
  laporan_id   uuid not null references public.laporan (id) on delete cascade,
  pengguna_id  uuid not null references auth.users (id) on delete cascade,
  dibuat_pada  timestamptz not null default now(),
  primary key (laporan_id, pengguna_id)
);

create table public.rating (
  id           bigint generated always as identity primary key,
  laporan_id   uuid not null unique references public.laporan (id) on delete cascade,
  kasus_id     uuid not null references public.kasus (id) on delete cascade,
  pengguna_id  uuid not null references auth.users (id) on delete cascade,
  skor         smallint not null check (skor between 1 and 5),
  komentar     text check (char_length(komentar) <= 1000),
  dibuat_pada  timestamptz not null default now()
);
create index rating_kasus_idx on public.rating (kasus_id);

create table public.notifikasi (
  id           bigint generated always as identity primary key,
  pengguna_id  uuid not null references auth.users (id) on delete cascade,
  laporan_id   uuid references public.laporan (id) on delete cascade,
  kasus_id     uuid references public.kasus (id) on delete cascade,
  judul        text not null,
  isi          text,
  dibaca       boolean not null default false,
  dibuat_pada  timestamptz not null default now()
);
create index notifikasi_pengguna_idx on public.notifikasi (pengguna_id, dibaca, dibuat_pada desc);

-- IN-05: riwayat peringatan dini lonjakan laporan.
create table public.peringatan_dini (
  id               bigint generated always as identity primary key,
  sppg_id          uuid not null references public.sppg (id) on delete cascade,
  wilayah_id       text not null references public.wilayah (id),
  basis            text not null check (basis in ('terverifikasi', 'semua')),
  jumlah_24_jam    integer not null,
  rata_rata_harian numeric(10, 2) not null,
  rasio            numeric(10, 2) not null,
  aktif            boolean not null default true,
  dibuat_pada      timestamptz not null default now()
);
create index peringatan_aktif_idx on public.peringatan_dini (aktif, dibuat_pada desc);
