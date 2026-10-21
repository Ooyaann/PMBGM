-- =============================================================================
-- PantauGizi · Migrasi 5: storage, realtime, jadwal pg_cron, dan aturan SLA bawaan
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Storage
--   bukti          : privat. Path: <user_id>/<laporan_id>/<nama-file>
--   tindak-lanjut  : publik. Foto bukti tindak lanjut instansi yang tampil di timeline.
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('bukti', 'bukti', false, 10485760,
   array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']),
  ('tindak-lanjut', 'tindak-lanjut', true, 10485760,
   array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
on conflict (id) do nothing;

create or replace function public.boleh_lihat_bukti(p_path text)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select
    (storage.foldername(p_path))[1] = (select auth.uid())::text
    or exists (
      select 1
      from public.bukti b
      join public.laporan l on l.id = b.laporan_id
      left join public.kasus k on k.id = l.kasus_id
      where b.path_storage = p_path
        and (
          b.publik
          or l.pelapor_id = (select auth.uid())
          or public.adalah_staf()
          or (k.instansi_id is not null and k.instansi_id = public.instansi_saya())
        )
    )
$$;

revoke execute on function public.boleh_lihat_bukti(text) from public;
grant execute on function public.boleh_lihat_bukti(text) to anon, authenticated;

create policy "pelapor mengunggah bukti ke foldernya" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'bukti'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "bukti terlihat sesuai hak" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'bukti' and public.boleh_lihat_bukti(name));

create policy "instansi dan staf mengunggah bukti tindak lanjut" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'tindak-lanjut'
    and (select public.peran_saya()) in ('instansi', 'verifikator', 'admin')
  );

create policy "bukti tindak lanjut terbuka" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'tindak-lanjut');

-- -----------------------------------------------------------------------------
-- Realtime: dashboard dan notifikasi menerima perubahan langsung (DT-05, LC-10).
-- Supabase Realtime menghormati RLS, jadi setiap peran hanya menerima baris yang boleh dibacanya.
-- -----------------------------------------------------------------------------
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime
      add table public.kasus, public.laporan, public.status_log, public.notifikasi, public.peringatan_dini;
  end if;
end;
$$;

-- -----------------------------------------------------------------------------
-- Jadwal pg_cron (PRD 9.3)
-- -----------------------------------------------------------------------------
create extension if not exists pg_cron with schema pg_catalog;
grant usage on schema cron to postgres;

select cron.schedule('pantaugizi-proses-sla', '*/15 * * * *', $$select public.proses_sla()$$);
select cron.schedule('pantaugizi-indeks-risiko', '7 * * * *', $$select public.segarkan_indeks_risiko()$$);

-- -----------------------------------------------------------------------------
-- Aturan SLA bawaan (jam). Bisa diubah admin dari panel.
-- Tahap = status yang sedang diukur lamanya:
--   diterima → batas verifikasi · diverifikasi → batas diteruskan
--   diteruskan → batas tanggapan instansi · ditindaklanjuti → batas selesai
--   dibuka_ulang → batas tanggapan ulang
-- Keracunan: verifikasi ≤ 6 jam dan tanggapan instansi ≤ 6 jam (PRD 2.2, skenario demo).
-- -----------------------------------------------------------------------------
insert into public.aturan_sla (kategori, tahap, batas_jam)
select k::public.kategori_laporan, t::public.status_alur, j
from (values
  ('keracunan',           'diterima', 6),   ('keracunan',           'diverifikasi', 2),
  ('keracunan',           'diteruskan', 6), ('keracunan',           'ditindaklanjuti', 72),
  ('keracunan',           'dibuka_ulang', 24),
  ('makanan_tidak_layak', 'diterima', 24),  ('makanan_tidak_layak', 'diverifikasi', 12),
  ('makanan_tidak_layak', 'diteruskan', 24),('makanan_tidak_layak', 'ditindaklanjuti', 120),
  ('makanan_tidak_layak', 'dibuka_ulang', 48),
  ('kebersihan',          'diterima', 48),  ('kebersihan',          'diverifikasi', 24),
  ('kebersihan',          'diteruskan', 48),('kebersihan',          'ditindaklanjuti', 168),
  ('kebersihan',          'dibuka_ulang', 72),
  ('gizi_porsi',          'diterima', 48),  ('gizi_porsi',          'diverifikasi', 24),
  ('gizi_porsi',          'diteruskan', 72),('gizi_porsi',          'ditindaklanjuti', 168),
  ('gizi_porsi',          'dibuka_ulang', 72),
  ('distribusi',          'diterima', 24),  ('distribusi',          'diverifikasi', 12),
  ('distribusi',          'diteruskan', 24),('distribusi',          'ditindaklanjuti', 72),
  ('distribusi',          'dibuka_ulang', 48),
  ('pengadaan',           'diterima', 72),  ('pengadaan',           'diverifikasi', 48),
  ('pengadaan',           'diteruskan', 168),('pengadaan',          'ditindaklanjuti', 720),
  ('pengadaan',           'dibuka_ulang', 168),
  ('lainnya',             'diterima', 72),  ('lainnya',             'diverifikasi', 48),
  ('lainnya',             'diteruskan', 120),('lainnya',            'ditindaklanjuti', 336),
  ('lainnya',             'dibuka_ulang', 120)
) as v(k, t, j)
on conflict (kategori, tahap) do nothing;
