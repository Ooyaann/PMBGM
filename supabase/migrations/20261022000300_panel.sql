-- =============================================================================
-- PantauGizi · Migrasi: dukungan Panel internal dan notifikasi email (LM-04, LM-06, LC-10)
-- =============================================================================

-- Daftar pengguna untuk admin. Email ada di auth.users yang tidak terbuka lewat API,
-- jadi dibaca lewat fungsi yang memeriksa peran admin lebih dulu.
create or replace function public.daftar_pengguna(p_cari text default null, p_batas integer default 50)
returns table (
  id uuid, email text, nama text, peran public.peran_pengguna, terverifikasi boolean,
  instansi_id uuid, instansi_nama text, jumlah_laporan integer, dibuat_pada timestamptz
)
language plpgsql stable security definer set search_path = ''
as $$
begin
  perform public.wajib_peran('admin');
  return query
    select p.id, u.email::text, p.nama_tampilan, p.peran, p.terverifikasi, p.instansi_id, i.nama,
           (select count(*)::integer from public.laporan l where l.pelapor_id = p.id), p.dibuat_pada
    from public.profil_pengguna p
    join auth.users u on u.id = p.id
    left join public.instansi i on i.id = p.instansi_id
    where nullif(trim(p_cari), '') is null
       or u.email ilike '%' || trim(p_cari) || '%'
       or p.nama_tampilan ilike '%' || trim(p_cari) || '%'
    -- Staf di atas agar mudah dikelola, lalu pelapor terbaru.
    order by (p.peran = 'pelapor'), p.dibuat_pada desc
    limit least(greatest(p_batas, 1), 200);
end;
$$;

revoke execute on function public.daftar_pengguna(text, integer) from public, anon;
grant execute on function public.daftar_pengguna(text, integer) to authenticated;

-- Notifikasi email (LC-10): baris notifikasi tetap sumber kebenaran; pengirim email menandai
-- yang sudah terkirim agar tidak dikirim dua kali.
alter table public.notifikasi add column if not exists email_terkirim_pada timestamptz;
create index if not exists notifikasi_email_antre_idx on public.notifikasi (dibuat_pada)
  where email_terkirim_pada is null;
