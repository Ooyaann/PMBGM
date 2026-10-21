-- =============================================================================
-- PantauGizi · Migrasi 3: fungsi bantu, trigger, dan RPC alur laporan
-- Aturan pengolahan mengikuti PRD 9.3. Semua perubahan status lewat RPC
-- SECURITY DEFINER yang memeriksa peran, lalu mencatat ke status_log.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Fungsi bantu peran
-- -----------------------------------------------------------------------------
create or replace function public.peran_saya()
returns public.peran_pengguna
language sql stable security definer set search_path = ''
as $$ select peran from public.profil_pengguna where id = (select auth.uid()) $$;

create or replace function public.instansi_saya()
returns uuid
language sql stable security definer set search_path = ''
as $$ select instansi_id from public.profil_pengguna where id = (select auth.uid()) $$;

create or replace function public.adalah_staf()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select coalesce((select peran in ('verifikator', 'admin')
                   from public.profil_pengguna where id = (select auth.uid())), false)
$$;

create or replace function public.adalah_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select coalesce((select peran = 'admin'
                   from public.profil_pengguna where id = (select auth.uid())), false)
$$;

create or replace function public.wajib_peran(variadic p_peran public.peran_pengguna[])
returns void
language plpgsql stable security definer set search_path = ''
as $$
begin
  if (select auth.uid()) is null or coalesce(public.peran_saya() <> all (p_peran), true) then
    raise exception 'Akses ditolak: butuh peran %', array_to_string(p_peran, ', ')
      using errcode = '42501';
  end if;
end;
$$;

-- -----------------------------------------------------------------------------
-- Fungsi bantu umum
-- -----------------------------------------------------------------------------
create or replace function public.label_kategori(p public.kategori_laporan)
returns text
language sql immutable set search_path = ''
as $$
  select case p
    when 'keracunan' then 'Dugaan keracunan'
    when 'makanan_tidak_layak' then 'Makanan tidak layak'
    when 'kebersihan' then 'Kebersihan dapur/penyajian'
    when 'gizi_porsi' then 'Porsi/gizi tidak sesuai'
    when 'distribusi' then 'Masalah distribusi'
    when 'pengadaan' then 'Dugaan masalah pengadaan'
    else 'Lainnya'
  end
$$;

create or replace function public.label_status(p public.status_alur)
returns text
language sql immutable set search_path = ''
as $$
  select case p
    when 'diterima' then 'Diterima'
    when 'diverifikasi' then 'Diverifikasi'
    when 'diteruskan' then 'Diteruskan ke instansi'
    when 'ditindaklanjuti' then 'Ditindaklanjuti'
    when 'selesai' then 'Selesai'
    when 'ditolak' then 'Ditolak'
    when 'dibuka_ulang' then 'Dibuka ulang'
  end
$$;

-- Kode acak tanpa karakter yang mudah tertukar (0/O, 1/I).
create or replace function public.buat_kode(p_awalan text, p_panjang integer default 6)
returns text
language plpgsql volatile set search_path = ''
as $$
declare
  alfabet constant text := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  acak bytea := extensions.gen_random_bytes(p_panjang);
  hasil text := '';
begin
  for i in 0 .. p_panjang - 1 loop
    hasil := hasil || substr(alfabet, (get_byte(acak, i) % 32) + 1, 1);
  end loop;
  return p_awalan || hasil;
end;
$$;

alter table public.laporan alter column kode_tiket set default public.buat_kode('MBG-');

create or replace function public.batas_sla(p_kategori public.kategori_laporan, p_tahap public.status_alur)
returns interval
language sql stable set search_path = ''
as $$
  select make_interval(hours => coalesce(
    (select batas_jam from public.aturan_sla where kategori = p_kategori and tahap = p_tahap), 72))
$$;

create or replace function public.skor_risiko_sppg(p_sppg_id uuid)
returns numeric
language sql stable set search_path = ''
as $$ select coalesce((select indeks from public.indeks_risiko where sppg_id = p_sppg_id), 0) $$;

-- Skor prioritas antrean (PRD 9.3, IN-04: risiko SPPG tinggi menaikkan prioritas).
create or replace function public.hitung_skor_prioritas(
  p_kategori     public.kategori_laporan,
  p_terdampak    integer,
  p_kredibilitas numeric,
  p_risiko_sppg  numeric,
  p_dukungan     integer,
  p_terlambat    boolean
)
returns integer
language sql immutable set search_path = ''
as $$
  select round(
    case p_kategori
      when 'keracunan' then 60
      when 'makanan_tidak_layak' then 40
      when 'kebersihan' then 30
      when 'distribusi' then 25
      when 'gizi_porsi' then 20
      when 'pengadaan' then 20
      else 10
    end
    + least(coalesce(p_terdampak, 0), 50) * 0.4      -- maks 20
    + coalesce(p_kredibilitas, 0) * 0.1              -- maks 10
    + coalesce(p_risiko_sppg, 0) * 0.2               -- maks 20 (integrasi melingkar)
    + least(coalesce(p_dukungan, 0) * 2, 10)         -- maks 10
    + case when p_terlambat then 15 else 0 end       -- eskalasi SLA
  )::integer
$$;

create or replace function public.tingkat_prioritas_dari(p_kategori public.kategori_laporan, p_skor integer)
returns public.tingkat_prioritas
language sql immutable set search_path = ''
as $$
  select case
    when p_kategori = 'keracunan' then 'darurat'
    when p_skor >= 60 then 'tinggi'
    when p_skor >= 35 then 'sedang'
    else 'rendah'
  end::public.tingkat_prioritas
$$;

-- -----------------------------------------------------------------------------
-- Skor kredibilitas laporan (LP-08)
--   bukti 30 · kecocokan metadata 25 · status pelapor 25 · dukungan 15 · kelengkapan 5
-- -----------------------------------------------------------------------------
create or replace function public.segarkan_skor_laporan(p_laporan_id uuid)
returns void
language plpgsql volatile security definer set search_path = ''
as $$
declare
  l              public.laporan%rowtype;
  v_sekolah      public.sekolah%rowtype;
  v_profil       public.profil_pengguna%rowtype;
  v_jumlah_bukti integer;
  v_waktu_cocok  boolean;
  v_lokasi_cocok boolean;
  v_dukungan     integer;
  s_bukti        integer;
  s_metadata     integer;
  s_pelapor      integer;
  s_dukungan     integer;
  s_lengkap      integer;
  v_total        integer;
  v_skor         integer;
begin
  select * into l from public.laporan where id = p_laporan_id;
  if not found then return; end if;

  select * into v_sekolah from public.sekolah where id = l.sekolah_id;
  select * into v_profil from public.profil_pengguna where id = l.pelapor_id;

  select count(*) into v_jumlah_bukti from public.bukti where laporan_id = l.id;

  -- Waktu foto ≤ 48 jam dari kejadian; lokasi foto ≤ ±2 km dari sekolah.
  select
    coalesce(bool_or(abs(extract(epoch from m.exif_waktu - l.waktu_kejadian)) <= 48 * 3600), false),
    coalesce(bool_or(
      m.exif_lat is not null and v_sekolah.lat is not null
      and abs(m.exif_lat - v_sekolah.lat) <= 0.018
      and abs(m.exif_lng - v_sekolah.lng) <= 0.018), false)
  into v_waktu_cocok, v_lokasi_cocok
  from public.bukti b
  join public.bukti_metadata m on m.bukti_id = b.id
  where b.laporan_id = l.id;

  select count(*) into v_dukungan from public.dukungan where laporan_id = coalesce(l.grup_serupa, l.id);

  s_bukti    := case when v_jumlah_bukti >= 2 then 30 when v_jumlah_bukti = 1 then 25 else 0 end;
  s_metadata := (case when v_waktu_cocok then 12 else 0 end) + (case when v_lokasi_cocok then 13 else 0 end);
  s_pelapor  := case
                  when coalesce(v_profil.terverifikasi, false) then 25
                  when l.mode_identitas = 'publik' then 15
                  when l.mode_identitas = 'rahasia' then 12
                  else 6   -- anonim: bobot lebih rendah (PRD 12)
                end;
  s_dukungan := least(v_dukungan * 5, 15);
  s_lengkap  := case when char_length(l.deskripsi) >= 80 and l.jumlah_terdampak > 0 then 5
                     when char_length(l.deskripsi) >= 80 or l.jumlah_terdampak > 0 then 3
                     else 0 end;
  v_total := s_bukti + s_metadata + s_pelapor + s_dukungan + s_lengkap;

  v_skor := public.hitung_skor_prioritas(
    l.kategori, l.jumlah_terdampak, v_total, public.skor_risiko_sppg(l.sppg_id), v_dukungan, l.terlambat);

  update public.laporan set
    skor_kredibilitas = v_total,
    komponen_kredibilitas = jsonb_build_object(
      'bukti', s_bukti, 'metadata', s_metadata, 'pelapor', s_pelapor,
      'dukungan', s_dukungan, 'kelengkapan', s_lengkap,
      'jumlah_bukti', v_jumlah_bukti, 'waktu_foto_cocok', v_waktu_cocok,
      'lokasi_foto_cocok', v_lokasi_cocok, 'jumlah_dukungan', v_dukungan),
    jumlah_dukungan = v_dukungan,
    skor_prioritas = v_skor,
    prioritas = public.tingkat_prioritas_dari(l.kategori, v_skor)
  where id = l.id;
end;
$$;

-- Hitung ulang agregat kasus dari laporan anggotanya.
create or replace function public.segarkan_kasus(p_kasus_id uuid)
returns void
language plpgsql volatile security definer set search_path = ''
as $$
declare
  k            public.kasus%rowtype;
  v_jumlah     integer;
  v_terdampak  integer;
  v_kejadian   timestamptz;
  v_kred       numeric;
  v_skor       integer;
begin
  select * into k from public.kasus where id = p_kasus_id;
  if not found then return; end if;

  select count(*), coalesce(sum(jumlah_terdampak), 0), min(waktu_kejadian), avg(skor_kredibilitas)
  into v_jumlah, v_terdampak, v_kejadian, v_kred
  from public.laporan where kasus_id = p_kasus_id;

  v_skor := public.hitung_skor_prioritas(
    k.kategori, v_terdampak, v_kred, public.skor_risiko_sppg(k.sppg_id), greatest(v_jumlah - 1, 0), k.terlambat);

  update public.kasus set
    jumlah_laporan = v_jumlah,
    total_terdampak = v_terdampak,
    waktu_kejadian = coalesce(v_kejadian, k.waktu_kejadian),
    skor_prioritas = v_skor,
    prioritas = public.tingkat_prioritas_dari(k.kategori, v_skor),
    rating_rata = (select round(avg(skor), 2) from public.rating where kasus_id = p_kasus_id),
    jumlah_rating = (select count(*) from public.rating where kasus_id = p_kasus_id)
  where id = p_kasus_id;
end;
$$;

create or replace function public.segarkan_indeks_risiko()
returns void
language plpgsql volatile security definer set search_path = ''
as $$
begin
  refresh materialized view concurrently public.indeks_risiko;
end;
$$;

-- -----------------------------------------------------------------------------
-- Trigger
-- -----------------------------------------------------------------------------
create or replace function public.atur_diperbarui_pada()
returns trigger
language plpgsql set search_path = ''
as $$
begin
  new.diperbarui_pada := now();
  return new;
end;
$$;

create trigger sppg_diperbarui before update on public.sppg
  for each row execute function public.atur_diperbarui_pada();
create trigger kasus_diperbarui before update on public.kasus
  for each row execute function public.atur_diperbarui_pada();
create trigger laporan_diperbarui before update on public.laporan
  for each row execute function public.atur_diperbarui_pada();

-- Profil otomatis untuk setiap akun baru. Peran selalu 'pelapor'; peran lain diatur admin.
create or replace function public.tangani_pengguna_baru()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profil_pengguna (id, nama_tampilan)
  values (new.id, coalesce(nullif(new.raw_user_meta_data ->> 'nama', ''), split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger pengguna_baru after insert on auth.users
  for each row execute function public.tangani_pengguna_baru();

-- Sebelum laporan disimpan: tautkan ke SPPG/wilayah, buat kode tiket, kelompokkan laporan serupa,
-- terapkan batas harian dan validasi waktu (PRD 9.3, 7.1).
create or replace function public.laporan_sebelum_simpan()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  v_sekolah public.sekolah%rowtype;
  v_jumlah_hari_ini integer;
begin
  select * into v_sekolah from public.sekolah where id = new.sekolah_id;
  if not found then
    raise exception 'Sekolah tidak ditemukan' using errcode = '23503';
  end if;
  new.sppg_id := v_sekolah.sppg_id;
  new.wilayah_id := v_sekolah.wilayah_id;

  -- Validasi tambahan untuk laporan dari aplikasi (seed berjalan tanpa sesi pengguna).
  if (select auth.uid()) is not null then
    if new.waktu_kejadian > now() + interval '1 hour' then
      raise exception 'Waktu kejadian tidak boleh di masa depan' using errcode = '22023';
    end if;
    if new.waktu_kejadian < now() - interval '30 days' then
      raise exception 'Waktu kejadian lebih dari 30 hari yang lalu' using errcode = '22023';
    end if;
    select count(*) into v_jumlah_hari_ini
    from public.laporan
    where pelapor_id = new.pelapor_id and dibuat_pada > now() - interval '24 hours';
    if v_jumlah_hari_ini >= 5 then
      raise exception 'Batas 5 laporan per 24 jam tercapai' using errcode = '54000';
    end if;
  end if;

  -- Kode bawaan dari default kolom; buat ulang bila (sangat jarang) bertabrakan.
  while new.kode_tiket is null or exists (select 1 from public.laporan where kode_tiket = new.kode_tiket) loop
    new.kode_tiket := public.buat_kode('MBG-');
  end loop;

  -- Deteksi duplikat: sekolah sama + kategori sama + selisih kejadian ≤ 24 jam.
  select coalesce(l.grup_serupa, l.id) into new.grup_serupa
  from public.laporan l
  where l.sekolah_id = new.sekolah_id
    and l.kategori = new.kategori
    and l.status <> 'ditolak'
    and abs(extract(epoch from l.waktu_kejadian - new.waktu_kejadian)) <= 24 * 3600
  order by l.dibuat_pada
  limit 1;
  new.grup_serupa := coalesce(new.grup_serupa, new.id);

  new.tenggat_verifikasi := new.dibuat_pada + public.batas_sla(new.kategori, 'diterima');

  -- Prioritas awal agar nilai yang dikembalikan ke klien sudah benar; skor lengkap
  -- (kredibilitas, bukti, dukungan) dihitung ulang oleh segarkan_skor_laporan().
  new.skor_prioritas := public.hitung_skor_prioritas(
    new.kategori, new.jumlah_terdampak, 0, public.skor_risiko_sppg(new.sppg_id), 0, false);
  new.prioritas := public.tingkat_prioritas_dari(new.kategori, new.skor_prioritas);
  return new;
end;
$$;

create trigger laporan_sebelum_simpan before insert on public.laporan
  for each row execute function public.laporan_sebelum_simpan();

create or replace function public.laporan_setelah_simpan()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.status_log (laporan_id, peristiwa, ke, pelaku_id, pelaku_peran, pelaku_label, catatan, dibuat_pada)
  values (new.id, 'perubahan_status', 'diterima', new.pelapor_id, 'pelapor', 'Pelapor',
          'Laporan diterima dan menunggu verifikasi.', new.dibuat_pada);
  perform public.segarkan_skor_laporan(new.id);
  return null;
end;
$$;

create trigger laporan_setelah_simpan after insert on public.laporan
  for each row execute function public.laporan_setelah_simpan();

-- Bukti, metadata, dan dukungan memengaruhi skor kredibilitas.
create or replace function public.picu_skor_dari_bukti()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  perform public.segarkan_skor_laporan(coalesce(new.laporan_id, old.laporan_id));
  return null;
end;
$$;

create trigger bukti_ubah_skor after insert or delete on public.bukti
  for each row execute function public.picu_skor_dari_bukti();

create or replace function public.picu_skor_dari_metadata()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  perform public.segarkan_skor_laporan((select laporan_id from public.bukti where id = new.bukti_id));
  return null;
end;
$$;

create trigger metadata_ubah_skor after insert or update on public.bukti_metadata
  for each row execute function public.picu_skor_dari_metadata();

create or replace function public.picu_skor_dari_dukungan()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  v_laporan record;
begin
  for v_laporan in
    select id from public.laporan where grup_serupa = coalesce(new.laporan_id, old.laporan_id)
  loop
    perform public.segarkan_skor_laporan(v_laporan.id);
  end loop;
  return null;
end;
$$;

create trigger dukungan_ubah_skor after insert or delete on public.dukungan
  for each row execute function public.picu_skor_dari_dukungan();

-- status_log hanya bisa ditambah (LC-03, PRD 7.1).
create or replace function public.tolak_ubah_status_log()
returns trigger
language plpgsql set search_path = ''
as $$
begin
  raise exception 'Riwayat status hanya bisa ditambah, tidak bisa diubah atau dihapus'
    using errcode = '42501';
end;
$$;

create trigger status_log_tambah_saja before update or delete on public.status_log
  for each row execute function public.tolak_ubah_status_log();

-- Notifikasi web untuk pelapor setiap ada peristiwa publik (LC-10).
create or replace function public.kirim_notifikasi_status()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  v_judul text;
  v_isi   text;
begin
  if not new.publik then return null; end if;

  v_judul := case
    when new.peristiwa = 'eskalasi' then 'Batas waktu terlewati'
    when new.peristiwa = 'tindak_lanjut' then 'Ada tindak lanjut baru'
    when new.peristiwa = 'penggabungan' then 'Laporan digabung dengan laporan serupa'
    when new.ke = 'selesai' then 'Kasus selesai, beri penilaian'
    when new.ke is not null then public.label_status(new.ke)
    else 'Pembaruan laporan'
  end;
  v_isi := coalesce(new.catatan, '');

  if new.laporan_id is not null then
    insert into public.notifikasi (pengguna_id, laporan_id, kasus_id, judul, isi, dibuat_pada)
    select l.pelapor_id, l.id, l.kasus_id, v_judul, v_isi, new.dibuat_pada
    from public.laporan l
    where l.id = new.laporan_id
      and l.pelapor_id is distinct from new.pelaku_id;
  else
    insert into public.notifikasi (pengguna_id, laporan_id, kasus_id, judul, isi, dibuat_pada)
    select l.pelapor_id, l.id, new.kasus_id, v_judul, v_isi, new.dibuat_pada
    from public.laporan l
    where l.kasus_id = new.kasus_id
      and l.dibuat_pada <= new.dibuat_pada   -- jangan kabari peristiwa sebelum laporannya ada
      and l.pelapor_id is distinct from new.pelaku_id;
  end if;
  return null;
end;
$$;

create trigger status_log_notifikasi after insert on public.status_log
  for each row execute function public.kirim_notifikasi_status();

-- -----------------------------------------------------------------------------
-- RPC verifikator (LP-09)
-- -----------------------------------------------------------------------------

-- Verifikasi satu atau beberapa laporan sekaligus. Bila p_kasus_id kosong, kasus baru dibuat;
-- bila diisi, laporan digabung ke kasus yang sudah ada (Keputusan K2, K3).
create or replace function public.verifikasi_laporan(
  p_laporan_ids uuid[],
  p_kasus_id    uuid  default null,
  p_checklist   jsonb default null,
  p_catatan     text  default null,
  p_judul       text  default null
)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_pertama  public.laporan%rowtype;
  v_kasus_id uuid := p_kasus_id;
  v_sekolah  text;
  v_jumlah   integer;
  v_lap      record;
begin
  perform public.wajib_peran('verifikator', 'admin');

  if coalesce(array_length(p_laporan_ids, 1), 0) = 0 then
    raise exception 'Pilih minimal satu laporan' using errcode = '22023';
  end if;

  perform 1 from public.laporan where id = any (p_laporan_ids) for update;
  select count(*) into v_jumlah from public.laporan where id = any (p_laporan_ids) and status = 'diterima';
  if v_jumlah <> array_length(p_laporan_ids, 1) then
    raise exception 'Semua laporan harus berstatus Diterima' using errcode = '22023';
  end if;

  select * into v_pertama from public.laporan
  where id = any (p_laporan_ids) order by waktu_kejadian limit 1;

  if v_kasus_id is null then
    select nama into v_sekolah from public.sekolah where id = v_pertama.sekolah_id;
    insert into public.kasus (
      kode_kasus, kategori, sppg_id, sekolah_id, wilayah_id, judul, status, status_sejak,
      tenggat_tahap, waktu_kejadian, diverifikasi_pada)
    values (
      public.buat_kode('KS-', 7), v_pertama.kategori, v_pertama.sppg_id, v_pertama.sekolah_id,
      v_pertama.wilayah_id,
      coalesce(nullif(trim(p_judul), ''), public.label_kategori(v_pertama.kategori) || ' di ' || v_sekolah),
      'diverifikasi', now(), now() + public.batas_sla(v_pertama.kategori, 'diverifikasi'),
      v_pertama.waktu_kejadian, now())
    returning id into v_kasus_id;
  elsif not exists (select 1 from public.kasus where id = v_kasus_id and status <> 'selesai') then
    raise exception 'Kasus tidak ditemukan atau sudah selesai' using errcode = '22023';
  end if;

  update public.laporan set
    status = 'diverifikasi',
    kasus_id = v_kasus_id,
    checklist_verifikasi = coalesce(p_checklist, checklist_verifikasi),
    diverifikasi_oleh = (select auth.uid()),
    diverifikasi_pada = now(),
    terlambat = false
  where id = any (p_laporan_ids);

  update public.bukti set publik = true where laporan_id = any (p_laporan_ids);

  for v_lap in select id from public.laporan where id = any (p_laporan_ids) loop
    insert into public.status_log (laporan_id, kasus_id, peristiwa, dari, ke, pelaku_id, pelaku_peran, pelaku_label, catatan)
    values (v_lap.id, v_kasus_id, 'perubahan_status', 'diterima', 'diverifikasi', (select auth.uid()),
            'verifikator', 'Tim Verifikator', coalesce(p_catatan, 'Bukti diperiksa dan laporan dinyatakan valid.'));
  end loop;

  if array_length(p_laporan_ids, 1) > 1 or p_kasus_id is not null then
    insert into public.status_log (kasus_id, peristiwa, pelaku_id, pelaku_peran, pelaku_label, catatan)
    values (v_kasus_id, 'penggabungan', (select auth.uid()), 'verifikator', 'Tim Verifikator',
            array_length(p_laporan_ids, 1) || ' laporan serupa digabung ke kasus ini.');
  end if;

  perform public.segarkan_kasus(v_kasus_id);
  perform public.segarkan_indeks_risiko();
  return v_kasus_id;
end;
$$;

create or replace function public.tolak_laporan(
  p_laporan_id uuid,
  p_alasan     text,
  p_checklist  jsonb default null
)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  perform public.wajib_peran('verifikator', 'admin');
  if nullif(trim(p_alasan), '') is null then
    raise exception 'Alasan penolakan wajib diisi' using errcode = '22023';
  end if;

  update public.laporan set
    status = 'ditolak',
    alasan_tolak = trim(p_alasan),
    checklist_verifikasi = coalesce(p_checklist, checklist_verifikasi),
    diverifikasi_oleh = (select auth.uid()),
    diverifikasi_pada = now()
  where id = p_laporan_id and status = 'diterima';
  if not found then
    raise exception 'Laporan tidak ditemukan atau sudah diproses' using errcode = '22023';
  end if;

  insert into public.status_log (laporan_id, peristiwa, dari, ke, pelaku_id, pelaku_peran, pelaku_label, catatan)
  values (p_laporan_id, 'perubahan_status', 'diterima', 'ditolak', (select auth.uid()),
          'verifikator', 'Tim Verifikator', trim(p_alasan));
end;
$$;

create or replace function public.teruskan_kasus(
  p_kasus_id    uuid,
  p_instansi_id uuid,
  p_catatan     text default null
)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  k public.kasus%rowtype;
  v_instansi text;
begin
  perform public.wajib_peran('verifikator', 'admin');
  select * into k from public.kasus where id = p_kasus_id for update;
  if not found or k.status not in ('diverifikasi', 'diteruskan') then
    raise exception 'Kasus hanya bisa diteruskan dari status Diverifikasi' using errcode = '22023';
  end if;
  select nama into v_instansi from public.instansi where id = p_instansi_id;
  if v_instansi is null then
    raise exception 'Instansi tidak ditemukan' using errcode = '22023';
  end if;

  update public.kasus set
    status = 'diteruskan',
    status_sejak = now(),
    tenggat_tahap = now() + public.batas_sla(k.kategori, 'diteruskan'),
    terlambat = false,
    instansi_id = p_instansi_id,
    diteruskan_pada = now()
  where id = p_kasus_id;

  insert into public.status_log (kasus_id, peristiwa, dari, ke, pelaku_id, pelaku_peran, pelaku_label, catatan)
  values (p_kasus_id, 'perubahan_status', k.status, 'diteruskan', (select auth.uid()), 'verifikator',
          'Tim Verifikator',
          coalesce(p_catatan, 'Diteruskan ke ' || v_instansi || '. Batas waktu tanggapan mulai dihitung.'));

  perform public.segarkan_kasus(p_kasus_id);
end;
$$;

-- -----------------------------------------------------------------------------
-- RPC instansi (LC-04)
-- -----------------------------------------------------------------------------
create or replace function public.tindak_lanjut_kasus(
  p_kasus_id    uuid,
  p_jenis       public.jenis_tindakan,
  p_catatan     text,
  p_bukti_paths text[] default '{}'
)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  k public.kasus%rowtype;
  v_label text;
begin
  perform public.wajib_peran('instansi', 'admin');
  select * into k from public.kasus where id = p_kasus_id for update;
  if not found then
    raise exception 'Kasus tidak ditemukan' using errcode = '22023';
  end if;
  if not public.adalah_admin() and k.instansi_id is distinct from public.instansi_saya() then
    raise exception 'Kasus ini tidak diteruskan ke instansi Anda' using errcode = '42501';
  end if;
  if k.status not in ('diteruskan', 'ditindaklanjuti', 'dibuka_ulang') then
    raise exception 'Kasus belum diteruskan atau sudah selesai' using errcode = '22023';
  end if;
  if nullif(trim(p_catatan), '') is null then
    raise exception 'Catatan tindak lanjut wajib diisi' using errcode = '22023';
  end if;

  select nama into v_label from public.instansi where id = k.instansi_id;

  update public.kasus set
    status = 'ditindaklanjuti',
    status_sejak = case when k.status <> 'ditindaklanjuti' then now() else k.status_sejak end,
    tenggat_tahap = case when k.status <> 'ditindaklanjuti'
                         then now() + public.batas_sla(k.kategori, 'ditindaklanjuti')
                         else k.tenggat_tahap end,
    terlambat = case when k.status <> 'ditindaklanjuti' then false else k.terlambat end,
    ditanggapi_pada = coalesce(k.ditanggapi_pada, now())
  where id = p_kasus_id;

  insert into public.status_log (
    kasus_id, peristiwa, dari, ke, jenis_tindakan, pelaku_id, pelaku_peran, pelaku_label, catatan, bukti_paths)
  values (
    p_kasus_id, 'tindak_lanjut', k.status, 'ditindaklanjuti', p_jenis, (select auth.uid()), 'instansi',
    coalesce(v_label, 'Instansi'), trim(p_catatan), coalesce(p_bukti_paths, '{}'));

  perform public.segarkan_kasus(p_kasus_id);
end;
$$;

create or replace function public.selesaikan_kasus(
  p_kasus_id    uuid,
  p_catatan     text,
  p_bukti_paths text[] default '{}'
)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  k public.kasus%rowtype;
  v_label text;
begin
  perform public.wajib_peran('instansi', 'admin');
  select * into k from public.kasus where id = p_kasus_id for update;
  if not found or k.status <> 'ditindaklanjuti' then
    raise exception 'Kasus hanya bisa diselesaikan dari status Ditindaklanjuti' using errcode = '22023';
  end if;
  if not public.adalah_admin() and k.instansi_id is distinct from public.instansi_saya() then
    raise exception 'Kasus ini tidak diteruskan ke instansi Anda' using errcode = '42501';
  end if;

  select nama into v_label from public.instansi where id = k.instansi_id;

  update public.kasus set
    status = 'selesai', status_sejak = now(), tenggat_tahap = null, terlambat = false, selesai_pada = now()
  where id = p_kasus_id;

  insert into public.status_log (kasus_id, peristiwa, dari, ke, pelaku_id, pelaku_peran, pelaku_label, catatan, bukti_paths)
  values (p_kasus_id, 'perubahan_status', 'ditindaklanjuti', 'selesai', (select auth.uid()), 'instansi',
          coalesce(v_label, 'Instansi'), coalesce(nullif(trim(p_catatan), ''), 'Tindak lanjut dinyatakan selesai.'),
          coalesce(p_bukti_paths, '{}'));

  perform public.segarkan_kasus(p_kasus_id);
  perform public.segarkan_indeks_risiko();
end;
$$;

-- -----------------------------------------------------------------------------
-- RPC pelapor (LP-07, LC-09)
-- -----------------------------------------------------------------------------
create or replace function public.beri_rating(
  p_laporan_id uuid,
  p_skor       smallint,
  p_komentar   text default null
)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  l public.laporan%rowtype;
begin
  select * into l from public.laporan where id = p_laporan_id;
  if not found or l.pelapor_id is distinct from (select auth.uid()) then
    raise exception 'Laporan tidak ditemukan' using errcode = '42501';
  end if;
  if not exists (select 1 from public.kasus where id = l.kasus_id and status = 'selesai') then
    raise exception 'Penilaian hanya bisa diberikan setelah kasus selesai' using errcode = '22023';
  end if;

  insert into public.rating (laporan_id, kasus_id, pengguna_id, skor, komentar)
  values (l.id, l.kasus_id, l.pelapor_id, p_skor, nullif(trim(p_komentar), ''))
  on conflict (laporan_id) do update set skor = excluded.skor, komentar = excluded.komentar, dibuat_pada = now();

  perform public.segarkan_kasus(l.kasus_id);
end;
$$;

create or replace function public.buka_ulang_kasus(p_laporan_id uuid, p_alasan text)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  l public.laporan%rowtype;
  k public.kasus%rowtype;
begin
  select * into l from public.laporan where id = p_laporan_id;
  if not found or l.pelapor_id is distinct from (select auth.uid()) then
    raise exception 'Laporan tidak ditemukan' using errcode = '42501';
  end if;
  select * into k from public.kasus where id = l.kasus_id for update;
  if not found or k.status <> 'selesai' then
    raise exception 'Hanya kasus berstatus Selesai yang bisa dibuka ulang' using errcode = '22023';
  end if;
  if k.selesai_pada < now() - interval '14 days' then
    raise exception 'Batas membuka ulang adalah 14 hari setelah kasus selesai' using errcode = '22023';
  end if;
  if nullif(trim(p_alasan), '') is null then
    raise exception 'Jelaskan bagian yang belum tuntas' using errcode = '22023';
  end if;

  update public.kasus set
    status = 'dibuka_ulang',
    status_sejak = now(),
    tenggat_tahap = now() + public.batas_sla(k.kategori, 'dibuka_ulang'),
    terlambat = false,
    selesai_pada = null
  where id = k.id;

  insert into public.status_log (kasus_id, peristiwa, dari, ke, pelaku_id, pelaku_peran, pelaku_label, catatan)
  values (k.id, 'perubahan_status', 'selesai', 'dibuka_ulang', (select auth.uid()), 'pelapor', 'Pelapor',
          trim(p_alasan));

  perform public.segarkan_kasus(k.id);
end;
$$;

-- "Saya juga mengalami": dukungan disimpan pada laporan pertama di kelompok serupa.
create or replace function public.dukung_laporan(p_grup_serupa uuid)
returns integer
language plpgsql security definer set search_path = ''
as $$
declare
  v_jumlah integer;
begin
  if (select auth.uid()) is null then
    raise exception 'Masuk terlebih dahulu' using errcode = '42501';
  end if;
  if not exists (select 1 from public.laporan where id = p_grup_serupa and status <> 'ditolak') then
    raise exception 'Laporan tidak ditemukan' using errcode = '22023';
  end if;
  if exists (select 1 from public.laporan where grup_serupa = p_grup_serupa and pelapor_id = (select auth.uid())) then
    raise exception 'Anda sudah melaporkan kejadian ini' using errcode = '22023';
  end if;

  insert into public.dukungan (laporan_id, pengguna_id)
  values (p_grup_serupa, (select auth.uid()))
  on conflict do nothing;

  select count(*) into v_jumlah from public.dukungan where laporan_id = p_grup_serupa;
  return v_jumlah;
end;
$$;

-- Laporan serupa dalam 24 jam untuk form Lapor (LP-07). Tanpa isi atau identitas laporan.
create or replace function public.cari_laporan_serupa(
  p_sekolah_id uuid,
  p_kategori   public.kategori_laporan,
  p_waktu      timestamptz default now()
)
returns table (grup_serupa uuid, jumlah_laporan integer, jumlah_dukungan integer, laporan_pertama timestamptz)
language sql stable security definer set search_path = ''
as $$
  select
    l.grup_serupa,
    count(*)::integer,
    (select count(*)::integer from public.dukungan d where d.laporan_id = l.grup_serupa),
    min(l.dibuat_pada)
  from public.laporan l
  where l.sekolah_id = p_sekolah_id
    and l.kategori = p_kategori
    and l.status <> 'ditolak'
    and abs(extract(epoch from l.waktu_kejadian - p_waktu)) <= 24 * 3600
  group by l.grup_serupa
$$;

-- -----------------------------------------------------------------------------
-- RPC publik
-- -----------------------------------------------------------------------------

-- Cek status dengan kode tiket tanpa login (LC-01, LC-02). Tidak memuat data pribadi.
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
    'status', coalesce(k.status, l.status),
    'dibuat_pada', l.dibuat_pada,
    'waktu_kejadian', l.waktu_kejadian,
    'alasan_tolak', l.alasan_tolak,
    'sekolah', s.nama,
    'sppg', p.nama,
    'sppg_id', l.sppg_id,
    'kecamatan', w.nama,
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

-- Timeline publik per kasus (LC-07).
create or replace function public.timeline_kasus(p_kasus_id uuid)
returns table (
  waktu timestamptz, peristiwa public.jenis_peristiwa, dari public.status_alur, ke public.status_alur,
  jenis_tindakan public.jenis_tindakan, pelaku text, catatan text, bukti text[]
)
language sql stable security definer set search_path = ''
as $$
  select g.dibuat_pada, g.peristiwa, g.dari, g.ke, g.jenis_tindakan,
         coalesce(g.pelaku_label, g.pelaku_peran), g.catatan, g.bukti_paths
  from public.status_log g
  where g.publik
    and g.kasus_id = p_kasus_id
    -- Peristiwa level kasus, ditambah satu entri verifikasi pertama (kasus gabungan punya banyak).
    and (g.laporan_id is null
         or g.id = (select min(x.id) from public.status_log x
                    where x.kasus_id = p_kasus_id and x.ke = 'diverifikasi'))
  order by g.dibuat_pada, g.id
$$;

-- Statistik ringkas untuk landing page (LM-01).
create or replace function public.statistik_publik()
returns jsonb
language sql stable security definer set search_path = ''
as $$
  select jsonb_build_object(
    'laporan_masuk', (select count(*) from public.laporan),
    'laporan_terverifikasi', (select count(*) from public.laporan where status = 'diverifikasi'),
    'laporan_ditolak', (select count(*) from public.laporan where status = 'ditolak'),
    'kasus_total', (select count(*) from public.kasus),
    'kasus_selesai', (select count(*) from public.kasus where status = 'selesai'),
    'kasus_aktif', (select count(*) from public.kasus where status <> 'selesai'),
    'kasus_tidak_ditanggapi', (select count(*) from public.kasus
                               where terlambat and status in ('diteruskan', 'dibuka_ulang')),
    'rata_jam_respons', (select round((avg(extract(epoch from ditanggapi_pada - diteruskan_pada)) / 3600)::numeric, 1)
                         from public.kasus where ditanggapi_pada is not null),
    'kepuasan', (select round(avg(skor), 2) from public.rating),
    'jumlah_sppg', (select count(*) from public.sppg),
    'jumlah_sekolah', (select count(*) from public.sekolah),
    'jumlah_penerima', (select coalesce(sum(jumlah_siswa), 0) from public.sekolah),
    'diperbarui_pada', now()
  )
$$;

-- Riwayat indeks mingguan satu SPPG untuk grafik profil (DT-03).
create or replace function public.riwayat_indeks_sppg(p_sppg_id uuid, p_minggu integer default 12)
returns table (periode_akhir timestamptz, indeks numeric, kategori_risiko text)
language sql stable security definer set search_path = ''
as $$
  select i.periode_akhir, i.indeks, i.kategori_risiko
  from generate_series(0, least(p_minggu, 26) - 1) as g(n)
  cross join lateral public.hitung_indeks_risiko(
    date_trunc('day', now()) - make_interval(weeks => g.n), 30) i
  where i.sppg_id = p_sppg_id
  order by i.periode_akhir
$$;

-- -----------------------------------------------------------------------------
-- Proses terjadwal: SLA, eskalasi, dan peringatan dini (pg_cron, migrasi 5)
-- -----------------------------------------------------------------------------

-- IN-05: laporan 24 jam terakhir > 3× rata-rata harian 30 hari sebelumnya (minimal 3 laporan).
create or replace function public.deteksi_lonjakan()
returns integer
language plpgsql security definer set search_path = ''
as $$
declare
  v_jumlah integer := 0;
begin
  update public.peringatan_dini set aktif = false
  where aktif and dibuat_pada < now() - interval '48 hours';

  with hitung as (
    select
      b.basis,
      l.sppg_id,
      count(*) filter (where l.dibuat_pada >= now() - interval '24 hours') as n24,
      count(*) filter (where l.dibuat_pada < now() - interval '24 hours') / 30.0 as rata
    from public.laporan l
    cross join (values ('semua'), ('terverifikasi')) as b(basis)
    where l.sppg_id is not null
      and l.dibuat_pada >= now() - interval '31 days'
      and (b.basis = 'semua' or l.status = 'diverifikasi')
    group by b.basis, l.sppg_id
  ),
  baru as (
    insert into public.peringatan_dini (sppg_id, wilayah_id, basis, jumlah_24_jam, rata_rata_harian, rasio)
    select h.sppg_id, s.wilayah_id, h.basis, h.n24, round(h.rata, 2),
           round(h.n24 / greatest(h.rata, 0.1), 2)
    from hitung h
    join public.sppg s on s.id = h.sppg_id
    where h.n24 >= 3 and h.n24 > 3 * h.rata
      and not exists (
        select 1 from public.peringatan_dini p
        where p.sppg_id = h.sppg_id and p.basis = h.basis and p.aktif)
    returning 1
  )
  select count(*) into v_jumlah from baru;
  return v_jumlah;
end;
$$;

create or replace function public.proses_sla()
returns integer
language plpgsql security definer set search_path = ''
as $$
declare
  v_jumlah integer := 0;
  r record;
begin
  -- Laporan menunggu verifikasi melewati batas.
  for r in
    select id from public.laporan
    where status = 'diterima' and not terlambat and tenggat_verifikasi < now()
    for update
  loop
    update public.laporan set terlambat = true where id = r.id;
    insert into public.status_log (laporan_id, peristiwa, ke, pelaku_peran, pelaku_label, catatan)
    values (r.id, 'eskalasi', 'diterima', 'sistem', 'Sistem PantauGizi',
            'Verifikasi melewati batas waktu. Prioritas laporan dinaikkan.');
    perform public.segarkan_skor_laporan(r.id);
    v_jumlah := v_jumlah + 1;
  end loop;

  -- Kasus yang tahap berjalannya melewati SLA (LC-05, LC-06).
  for r in
    select id, status from public.kasus
    where status <> 'selesai' and not terlambat and tenggat_tahap < now()
    for update
  loop
    update public.kasus set terlambat = true, pernah_terlambat = true where id = r.id;
    insert into public.status_log (kasus_id, peristiwa, ke, pelaku_peran, pelaku_label, catatan)
    values (r.id, 'eskalasi', r.status, 'sistem', 'Sistem PantauGizi',
            case when r.status in ('diteruskan', 'dibuka_ulang')
                 then 'Instansi belum menanggapi dalam batas waktu. Ditandai "Tidak Ditanggapi" dan prioritas dinaikkan.'
                 else 'Tahap ' || public.label_status(r.status) || ' melewati batas waktu. Prioritas dinaikkan.' end);
    perform public.segarkan_kasus(r.id);
    v_jumlah := v_jumlah + 1;
  end loop;

  perform public.deteksi_lonjakan();
  return v_jumlah;
end;
$$;

-- Identitas pelapor hanya untuk verifikator/admin. Mode anonim tidak membuka identitas
-- kepada siapa pun; mode rahasia hanya kepada verifikator (PRD 7.2, LP-04).
create or replace function public.identitas_pelapor(p_laporan_id uuid)
returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
declare
  v_hasil jsonb;
begin
  perform public.wajib_peran('verifikator', 'admin');
  select case
    when l.mode_identitas = 'anonim' then jsonb_build_object(
      'mode', l.mode_identitas, 'terverifikasi', p.terverifikasi, 'jenis_pelapor', p.jenis_pelapor)
    else jsonb_build_object(
      'mode', l.mode_identitas, 'nama', p.nama_tampilan, 'email', u.email,
      'terverifikasi', p.terverifikasi, 'jenis_pelapor', p.jenis_pelapor,
      'jumlah_laporan', (select count(*) from public.laporan x where x.pelapor_id = l.pelapor_id),
      'jumlah_ditolak', (select count(*) from public.laporan x
                         where x.pelapor_id = l.pelapor_id and x.status = 'ditolak'))
  end
  into v_hasil
  from public.laporan l
  join public.profil_pengguna p on p.id = l.pelapor_id
  join auth.users u on u.id = l.pelapor_id
  where l.id = p_laporan_id;
  return v_hasil;
end;
$$;

-- -----------------------------------------------------------------------------
-- RPC admin (LM-04, LM-06)
-- -----------------------------------------------------------------------------
create or replace function public.atur_peran_pengguna(
  p_pengguna_id   uuid,
  p_peran         public.peran_pengguna,
  p_instansi_id   uuid    default null,
  p_terverifikasi boolean default null
)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  perform public.wajib_peran('admin');
  update public.profil_pengguna set
    peran = p_peran,
    instansi_id = case when p_peran = 'instansi' then p_instansi_id else null end,
    terverifikasi = coalesce(p_terverifikasi, terverifikasi)
  where id = p_pengguna_id;
  if not found then
    raise exception 'Pengguna tidak ditemukan' using errcode = '22023';
  end if;
end;
$$;
