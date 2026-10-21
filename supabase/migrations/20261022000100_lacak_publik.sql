-- =============================================================================
-- PantauGizi · Migrasi 6: data publik Modul Lacak (LC-07)
-- =============================================================================

-- Bukti foto/video yang sudah lolos verifikasi untuk satu kasus. Anon tidak bisa membaca tabel
-- laporan, jadi daftar bukti publik diambil lewat fungsi ini. Metadata lokasi tidak ikut.
create or replace function public.bukti_publik_kasus(p_kasus_id uuid)
returns table (path_storage text, jenis public.jenis_bukti, kategori public.kategori_laporan)
language sql stable security definer set search_path = ''
as $$
  select b.path_storage, b.jenis, l.kategori
  from public.bukti b
  join public.laporan l on l.id = b.laporan_id
  where l.kasus_id = p_kasus_id and b.publik
  order by b.dibuat_pada
  limit 12
$$;

revoke execute on function public.bukti_publik_kasus(uuid) from public;
grant execute on function public.bukti_publik_kasus(uuid) to anon, authenticated;
