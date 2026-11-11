-- =============================================================================
-- PantauGizi · Migrasi: Menambahkan deskripsi, jumlah_terdampak, mode_identitas,
-- dan bukti_awal pada kembalian cek_status_tiket untuk transparansi warga.
-- =============================================================================

create or replace function public.cek_status_tiket(p_kode text)
returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
declare
  l public.laporan%rowtype;
  v_hasil jsonb;
begin
  select * into l from public.laporan where kode_tiket = upper(trim(p_kode));
  if not found then return null; end if;

  select jsonb_build_object(
    'kode_tiket', l.kode_tiket,
    'kategori', l.kategori,
    'deskripsi', l.deskripsi,
    'jumlah_terdampak', l.jumlah_terdampak,
    'mode_identitas', l.mode_identitas,
    'status', coalesce(k.status, l.status),
    'dibuat_pada', l.dibuat_pada,
    'waktu_kejadian', l.waktu_kejadian,
    'alasan_tolak', l.alasan_tolak,
    'sekolah', s.nama,
    'sppg', p.nama,
    'sppg_id', l.sppg_id,
    'kecamatan', w.nama,
    'bukti_awal', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', b.id,
        'path_storage', b.path_storage,
        'jenis', b.jenis
      ))
      from public.bukti b
      where b.laporan_id = l.id
    ), '[]'::jsonb),
    'tenggat_verifikasi', case when l.status = 'diterima' then l.tenggat_verifikasi end,
    'kasus', case when k.id is null then null else jsonb_build_object(
      'id', k.id, 'kode_kasus', k.kode_kasus, 'judul', k.judul, 'status', k.status,
      'status_sejak', k.status_sejak, 'tenggat_tahap', k.tenggat_tahap, 'terlambat', k.terlambat,
      'tidak_ditanggapi', k.terlambat and k.status in ('diteruskan', 'dibuka_ulang'),
      'instansi', i.nama, 'jumlah_laporan', k.jumlah_laporan, 'rating_rata', k.rating_rata) end,
    'timeline', coalesce((
      select jsonb_agg(jsonb_build_object(
        'waktu', g.dibuat_pada, 'peristiwa', g.peristiwa, 'dari', g.dari, 'ke', g.ke,
        'jenis_tindakan', g.jenis_tindakan, 'pelaku', coalesce(g.pelaku_label, g.pelaku_peran),
        'catatan', g.catatan, 'bukti', g.bukti_paths) order by g.dibuat_pada, g.id)
      from public.status_log g
      where g.publik
        and (g.laporan_id = l.id or (g.kasus_id = l.kasus_id and g.laporan_id is null))
    ), '[]'::jsonb)
  )
  into v_hasil
  from public.sekolah s
  left join public.sppg p on p.id = l.sppg_id
  left join public.wilayah w on w.id = l.wilayah_id
  left join public.kasus k on k.id = l.kasus_id
  left join public.instansi i on i.id = k.instansi_id
  where s.id = l.sekolah_id;

  return v_hasil;
end;
$$;

