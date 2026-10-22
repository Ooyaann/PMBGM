-- =============================================================================
-- PantauGizi · Migrasi: dukungan Modul Insight (IN-02, IN-03, IN-05)
-- =============================================================================

-- Indeks setiap SPPG p_hari yang lalu, untuk panah tren di daftar prioritas inspeksi.
-- SECURITY DEFINER karena perhitungan membaca laporan terverifikasi yang tidak terbuka untuk anon;
-- yang dikembalikan hanya skor agregat.
create or replace function public.indeks_risiko_lalu(p_hari integer default 7)
returns table (sppg_id uuid, indeks numeric)
language sql stable security definer set search_path = ''
as $$
  select i.sppg_id, i.indeks
  from public.hitung_indeks_risiko(now() - make_interval(days => least(greatest(p_hari, 1), 90)), 30) i
$$;

-- Jumlah sinyal lonjakan aktif yang baru berbasis semua laporan (belum terverifikasi).
-- Publik hanya melihat jumlahnya, bukan SPPG-nya, agar transparan tanpa menuduh lebih dulu (IN-05).
create or replace function public.jumlah_sinyal_ditinjau()
returns integer
language sql stable security definer set search_path = ''
as $$
  select count(*)::integer
  from public.peringatan_dini p
  where p.aktif and p.basis = 'semua'
    and not exists (
      select 1 from public.peringatan_dini v
      where v.sppg_id = p.sppg_id and v.basis = 'terverifikasi' and v.aktif)
$$;

revoke execute on function public.indeks_risiko_lalu(integer), public.jumlah_sinyal_ditinjau() from public;
grant execute on function public.indeks_risiko_lalu(integer), public.jumlah_sinyal_ditinjau() to anon, authenticated;
