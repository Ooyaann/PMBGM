-- =============================================================================
-- PantauGizi · Migrasi 4: Row Level Security dan hak akses (PRD 7.1)
-- Prinsip:
--   * Data master dan kasus terverifikasi terbuka untuk publik.
--   * Laporan belum terverifikasi hanya bisa dibaca pelapornya dan verifikator.
--   * Instansi hanya melihat laporan/kasus yang diteruskan kepadanya.
--   * Semua perubahan status lewat RPC; tabel tidak bisa di-update langsung dari klien.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Aktifkan RLS di semua tabel
-- -----------------------------------------------------------------------------
alter table public.wilayah                 enable row level security;
alter table public.sppg                    enable row level security;
alter table public.instansi                enable row level security;
alter table public.sekolah                 enable row level security;
alter table public.anggaran_bulanan        enable row level security;
alter table public.ringkasan_kasus_bulanan enable row level security;
alter table public.harga_pangan            enable row level security;
alter table public.profil_pengguna         enable row level security;
alter table public.kasus                   enable row level security;
alter table public.laporan                 enable row level security;
alter table public.bukti                   enable row level security;
alter table public.bukti_metadata          enable row level security;
alter table public.status_log              enable row level security;
alter table public.aturan_sla              enable row level security;
alter table public.dukungan                enable row level security;
alter table public.rating                  enable row level security;
alter table public.notifikasi              enable row level security;
alter table public.peringatan_dini         enable row level security;

-- -----------------------------------------------------------------------------
-- Data master terbuka; hanya admin yang boleh mengubah (data master, aturan SLA, impor data)
-- -----------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'wilayah', 'sppg', 'instansi', 'sekolah', 'anggaran_bulanan',
    'ringkasan_kasus_bulanan', 'harga_pangan', 'aturan_sla'
  ] loop
    execute format('create policy "publik membaca %1$s" on public.%1$I for select to anon, authenticated using (true)', t);
    execute format('create policy "admin mengelola %1$s" on public.%1$I for all to authenticated
                    using ((select public.adalah_admin())) with check ((select public.adalah_admin()))', t);
    execute format('revoke insert, update, delete, truncate on public.%I from anon', t);
  end loop;
end;
$$;

-- -----------------------------------------------------------------------------
-- Profil pengguna
-- -----------------------------------------------------------------------------
create policy "pengguna membaca profil sendiri" on public.profil_pengguna
  for select to authenticated
  using (id = (select auth.uid()) or (select public.adalah_staf()));

create policy "pengguna mengubah profil sendiri" on public.profil_pengguna
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

revoke all on public.profil_pengguna from anon;
revoke insert, update, delete, truncate on public.profil_pengguna from authenticated;
-- Peran, status terverifikasi, dan instansi hanya bisa diubah admin lewat atur_peran_pengguna().
grant update (nama_tampilan, jenis_pelapor) on public.profil_pengguna to authenticated;

-- -----------------------------------------------------------------------------
-- Kasus: semuanya sudah terverifikasi, jadi terbuka. Perubahan hanya lewat RPC.
-- -----------------------------------------------------------------------------
create policy "publik membaca kasus" on public.kasus
  for select to anon, authenticated using (true);

revoke insert, update, delete, truncate on public.kasus from anon, authenticated;

-- -----------------------------------------------------------------------------
-- Laporan
-- -----------------------------------------------------------------------------
create policy "pelapor, staf, dan instansi terkait membaca laporan" on public.laporan
  for select to authenticated
  using (
    pelapor_id = (select auth.uid())
    or (select public.adalah_staf())
    or exists (
      select 1 from public.kasus k
      where k.id = laporan.kasus_id and k.instansi_id = (select public.instansi_saya())
    )
  );

create policy "pelapor membuat laporan atas namanya" on public.laporan
  for insert to authenticated
  with check (pelapor_id = (select auth.uid()));

-- Anon tetap punya hak SELECT (tanpa policy, jadi hasilnya selalu kosong) karena kebijakan
-- status_log dan bukti memeriksa tabel laporan di subquery.
revoke insert, update, delete, truncate on public.laporan from anon, authenticated;
-- Kolom turunan (status, skor, kasus, kode tiket) selalu diisi server.
grant insert (
  id, pelapor_id, kategori, sekolah_id, waktu_kejadian, jumlah_terdampak, deskripsi,
  lokasi_lat, lokasi_lng, mode_identitas, klasifikasi_otomatis
) on public.laporan to authenticated;

-- -----------------------------------------------------------------------------
-- Bukti dan metadata (bucket privat; publik hanya setelah verifikasi)
-- -----------------------------------------------------------------------------
create policy "bukti terbaca sesuai hak" on public.bukti
  for select to anon, authenticated
  using (
    publik
    or exists (
      select 1 from public.laporan l
      where l.id = bukti.laporan_id
        and (
          l.pelapor_id = (select auth.uid())
          or (select public.adalah_staf())
          or exists (select 1 from public.kasus k
                     where k.id = l.kasus_id and k.instansi_id = (select public.instansi_saya()))
        )
    )
  );

create policy "pelapor menambah bukti laporannya" on public.bukti
  for insert to authenticated
  with check (
    exists (select 1 from public.laporan l
            where l.id = bukti.laporan_id
              and l.pelapor_id = (select auth.uid())
              and l.status = 'diterima')
  );

revoke insert, update, delete, truncate on public.bukti from anon, authenticated;
-- Kolom publik hanya diubah verifikasi_laporan().
grant insert (id, laporan_id, path_storage, jenis, ukuran_byte) on public.bukti to authenticated;

create policy "metadata hanya untuk pemilik dan staf" on public.bukti_metadata
  for select to authenticated
  using (
    (select public.adalah_staf())
    or exists (select 1 from public.bukti b join public.laporan l on l.id = b.laporan_id
               where b.id = bukti_metadata.bukti_id and l.pelapor_id = (select auth.uid()))
  );

create policy "pemilik menambah metadata" on public.bukti_metadata
  for insert to authenticated
  with check (
    exists (select 1 from public.bukti b join public.laporan l on l.id = b.laporan_id
            where b.id = bukti_metadata.bukti_id
              and l.pelapor_id = (select auth.uid())
              and l.status = 'diterima')
  );

revoke all on public.bukti_metadata from anon;
revoke update, delete, truncate on public.bukti_metadata from authenticated;

-- -----------------------------------------------------------------------------
-- Riwayat status (hanya ditambah lewat RPC/trigger)
-- -----------------------------------------------------------------------------
create policy "riwayat terbaca sesuai hak" on public.status_log
  for select to anon, authenticated
  using (
    (publik and kasus_id is not null and laporan_id is null)
    or (select public.adalah_staf())
    or exists (select 1 from public.laporan l
               where l.id = status_log.laporan_id and l.pelapor_id = (select auth.uid()))
    or exists (select 1 from public.kasus k
               where k.id = status_log.kasus_id and k.instansi_id = (select public.instansi_saya()))
  );

revoke insert, update, delete, truncate on public.status_log from anon, authenticated;

-- -----------------------------------------------------------------------------
-- Dukungan, rating, notifikasi
-- -----------------------------------------------------------------------------
create policy "pengguna membaca dukungannya" on public.dukungan
  for select to authenticated
  using (pengguna_id = (select auth.uid()) or (select public.adalah_staf()));
revoke all on public.dukungan from anon;
revoke insert, update, delete, truncate on public.dukungan from authenticated;

create policy "rating terbaca pemilik dan staf" on public.rating
  for select to authenticated
  using (pengguna_id = (select auth.uid()) or (select public.adalah_staf()));
revoke all on public.rating from anon;
revoke insert, update, delete, truncate on public.rating from authenticated;

create policy "pengguna membaca notifikasinya" on public.notifikasi
  for select to authenticated
  using (pengguna_id = (select auth.uid()));
create policy "pengguna menandai notifikasi dibaca" on public.notifikasi
  for update to authenticated
  using (pengguna_id = (select auth.uid()))
  with check (pengguna_id = (select auth.uid()));
revoke all on public.notifikasi from anon;
revoke insert, update, delete, truncate on public.notifikasi from authenticated;
grant update (dibaca) on public.notifikasi to authenticated;

-- -----------------------------------------------------------------------------
-- Peringatan dini: publik hanya melihat yang berbasis laporan terverifikasi
-- -----------------------------------------------------------------------------
create policy "peringatan terbaca sesuai basis" on public.peringatan_dini
  for select to anon, authenticated
  using (basis = 'terverifikasi' or (select public.adalah_staf()));
revoke insert, update, delete, truncate on public.peringatan_dini from anon, authenticated;

-- -----------------------------------------------------------------------------
-- Materialized view tidak mendukung RLS; isinya hanya data publik terverifikasi.
-- -----------------------------------------------------------------------------
revoke all on public.indeks_risiko from anon, authenticated;
grant select on public.indeks_risiko to anon, authenticated;

-- -----------------------------------------------------------------------------
-- Hak eksekusi fungsi. Fungsi internal tidak boleh dipanggil dari klien.
-- -----------------------------------------------------------------------------
revoke execute on all functions in schema public from public, anon, authenticated;

-- Dipakai di kebijakan RLS.
grant execute on function
  public.peran_saya(), public.instansi_saya(), public.adalah_staf(), public.adalah_admin()
  to anon, authenticated;

-- Dipakai nilai default laporan.kode_tiket; ekspresi default berjalan dengan hak pengirim.
grant execute on function public.buat_kode(text, integer) to authenticated;

-- Publik tanpa login.
grant execute on function
  public.cek_status_tiket(text),
  public.timeline_kasus(uuid),
  public.statistik_publik(),
  public.riwayat_indeks_sppg(uuid, integer),
  public.hitung_indeks_risiko(timestamptz, integer),
  public.cari_laporan_serupa(uuid, public.kategori_laporan, timestamptz),
  public.label_kategori(public.kategori_laporan),
  public.label_status(public.status_alur)
  to anon, authenticated;

-- Pengguna masuk; fungsi memeriksa peran atau kepemilikan sendiri.
grant execute on function
  public.dukung_laporan(uuid),
  public.beri_rating(uuid, smallint, text),
  public.buka_ulang_kasus(uuid, text),
  public.verifikasi_laporan(uuid[], uuid, jsonb, text, text),
  public.tolak_laporan(uuid, text, jsonb),
  public.teruskan_kasus(uuid, uuid, text),
  public.tindak_lanjut_kasus(uuid, public.jenis_tindakan, text, text[]),
  public.selesaikan_kasus(uuid, text, text[]),
  public.identitas_pelapor(uuid),
  public.atur_peran_pengguna(uuid, public.peran_pengguna, uuid, boolean)
  to authenticated;
