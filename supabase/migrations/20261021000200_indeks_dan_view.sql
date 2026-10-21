-- =============================================================================
-- PantauGizi · Migrasi 2: Indeks Risiko SPPG dan view agregat publik
-- Rumus (PRD 9.4, Keputusan-PRD 2.2):
--   Indeks = 0,35·L + 0,25·K + 0,15·S + 0,15·T + 0,10·(100 − P)
-- Hanya data terverifikasi yang dihitung (verified-first).
-- =============================================================================

-- Hitung indeks untuk semua SPPG pada periode yang berakhir di p_akhir.
-- Dipakai oleh materialized view (nilai terkini) dan grafik riwayat.
create or replace function public.hitung_indeks_risiko(
  p_akhir timestamptz default now(),
  p_hari  integer     default 30
)
returns table (
  sppg_id          uuid,
  wilayah_id       text,
  periode_awal     timestamptz,
  periode_akhir    timestamptz,
  porsi            numeric,
  jumlah_laporan   integer,
  jumlah_keracunan integer,
  jumlah_kasus     integer,
  l_mentah         numeric,
  k_mentah         numeric,
  l                numeric,
  k                numeric,
  s                numeric,
  t                numeric,
  p                numeric,
  ada_rating       boolean,
  indeks           numeric,
  kategori_risiko  text
)
language sql
stable
set search_path = ''
as $$
  with periode as (
    select p_akhir - make_interval(days => p_hari) as awal, p_akhir as akhir
  ),
  dasar as (
    select
      s.id as sppg_id,
      s.wilayah_id,
      s.kapasitas_porsi_harian,
      s.status_slhs,
      s.slhs_berlaku_sampai,
      greatest(1, least(p_hari,
        p_akhir::date - greatest(
          (select awal from periode)::date,
          coalesce(s.mulai_beroperasi, (select awal from periode)::date)
        )
      )) as hari_operasi
    from public.sppg s
  ),
  lap as (
    select l.sppg_id, count(*)::integer as n
    from public.laporan l, periode
    where l.status = 'diverifikasi'
      and l.waktu_kejadian >= periode.awal and l.waktu_kejadian < periode.akhir
    group by l.sppg_id
  ),
  kas as (
    select
      k.sppg_id,
      count(*)::integer as n,
      count(*) filter (where k.kategori = 'keracunan')::integer as n_keracunan,
      count(*) filter (where k.pernah_terlambat)::integer as n_terlambat
    from public.kasus k, periode
    where k.waktu_kejadian >= periode.awal and k.waktu_kejadian < periode.akhir
    group by k.sppg_id
  ),
  -- Kepuasan memakai rating 90 hari terakhir karena rating baru masuk setelah kasus selesai.
  rat as (
    select k.sppg_id, avg(r.skor)::numeric as rata, count(*)::integer as n
    from public.rating r
    join public.kasus k on k.id = r.kasus_id
    where r.dibuat_pada >= p_akhir - interval '90 days' and r.dibuat_pada < p_akhir
    group by k.sppg_id
  ),
  mentah as (
    select
      d.*,
      (d.kapasitas_porsi_harian::numeric * d.hari_operasi) as porsi,
      coalesce(lap.n, 0) as n_lap,
      coalesce(kas.n, 0) as n_kasus,
      coalesce(kas.n_keracunan, 0) as n_ker,
      coalesce(kas.n_terlambat, 0) as n_terl,
      coalesce(lap.n, 0) * 1000.0 / (d.kapasitas_porsi_harian::numeric * d.hari_operasi) as l_mentah,
      coalesce(kas.n_keracunan, 0) * 1000.0 / (d.kapasitas_porsi_harian::numeric * d.hari_operasi) as k_mentah,
      rat.rata as rating_rata,
      coalesce(rat.n, 0) as n_rating
    from dasar d
    left join lap on lap.sppg_id = d.sppg_id
    left join kas on kas.sppg_id = d.sppg_id
    left join rat on rat.sppg_id = d.sppg_id
  ),
  -- Potong di persentil 95 agar satu outlier tidak menekan SPPG lain.
  -- Bila persentil 95 = 0 (data sangat jarang), pakai nilai maksimum.
  batas as (
    select
      case when percentile_cont(0.95) within group (order by l_mentah) > 0
           then (percentile_cont(0.95) within group (order by l_mentah))::numeric
           else max(l_mentah) end as l_atas,
      case when percentile_cont(0.95) within group (order by k_mentah) > 0
           then (percentile_cont(0.95) within group (order by k_mentah))::numeric
           else max(k_mentah) end as k_atas
    from mentah
  ),
  terpotong as (
    select m.*, least(m.l_mentah, b.l_atas) as l_c, least(m.k_mentah, b.k_atas) as k_c
    from mentah m cross join batas b
  ),
  rentang as (
    select min(l_c) as l_min, max(l_c) as l_max, min(k_c) as k_min, max(k_c) as k_max
    from terpotong
  ),
  komponen as (
    select
      t.*,
      case when r.l_max > r.l_min then 100 * (t.l_c - r.l_min) / (r.l_max - r.l_min) else 0 end as l_norm,
      case when r.k_max > r.k_min then 100 * (t.k_c - r.k_min) / (r.k_max - r.k_min) else 0 end as k_norm,
      case when t.status_slhs = 'berlaku'
                and (t.slhs_berlaku_sampai is null or t.slhs_berlaku_sampai >= p_akhir::date)
           then 0 else 100 end::numeric as s_nilai,
      case when t.n_kasus > 0 then 100.0 * t.n_terl / t.n_kasus else 0 end as t_nilai,
      case when t.n_rating > 0 then (t.rating_rata - 1) / 4 * 100 else 50 end as p_nilai
    from terpotong t cross join rentang r
  )
  select
    c.sppg_id,
    c.wilayah_id,
    (select awal from periode),
    p_akhir,
    c.porsi,
    c.n_lap,
    c.n_ker,
    c.n_kasus,
    round(c.l_mentah, 3),
    round(c.k_mentah, 3),
    round(c.l_norm, 1),
    round(c.k_norm, 1),
    c.s_nilai,
    round(c.t_nilai, 1),
    round(c.p_nilai, 1),
    c.n_rating > 0,
    round(0.35 * c.l_norm + 0.25 * c.k_norm + 0.15 * c.s_nilai + 0.15 * c.t_nilai + 0.10 * (100 - c.p_nilai), 1),
    case
      when 0.35 * c.l_norm + 0.25 * c.k_norm + 0.15 * c.s_nilai + 0.15 * c.t_nilai + 0.10 * (100 - c.p_nilai) >= 70 then 'tinggi'
      when 0.35 * c.l_norm + 0.25 * c.k_norm + 0.15 * c.s_nilai + 0.15 * c.t_nilai + 0.10 * (100 - c.p_nilai) >= 40 then 'sedang'
      else 'rendah'
    end
  from komponen c
$$;

comment on function public.hitung_indeks_risiko is
  'Indeks Risiko SPPG 0–100 (PRD 9.4). L dan K per 1.000 porsi, dinormalisasi min-max setelah dipotong di persentil 95.';

-- Nilai terkini. Di-refresh tiap jam oleh pg_cron dan setiap kali ada verifikasi.
create materialized view public.indeks_risiko as
  select i.*, now() as dihitung_pada
  from public.hitung_indeks_risiko(now(), 30) i;

create unique index indeks_risiko_sppg_idx on public.indeks_risiko (sppg_id);

-- -----------------------------------------------------------------------------
-- View publik. security_invoker = true: tunduk pada RLS tabel sumbernya.
-- -----------------------------------------------------------------------------

-- Kasus untuk halaman publik dan Lacak (LC-07). Tanpa data pribadi pelapor.
create view public.v_kasus_publik with (security_invoker = true) as
select
  k.id, k.kode_kasus, k.kategori, k.judul, k.ringkasan_publik,
  k.status, k.status_sejak, k.tenggat_tahap, k.terlambat, k.pernah_terlambat,
  (k.terlambat and k.status in ('diteruskan', 'dibuka_ulang')) as tidak_ditanggapi,
  k.prioritas, k.skor_prioritas, k.jumlah_laporan, k.total_terdampak,
  k.waktu_kejadian, k.diverifikasi_pada, k.diteruskan_pada, k.ditanggapi_pada, k.selesai_pada,
  k.rating_rata, k.jumlah_rating,
  k.sppg_id, s.nama as sppg_nama,
  k.sekolah_id, sk.nama as sekolah_nama, sk.jenjang as sekolah_jenjang,
  k.wilayah_id, w.nama as kecamatan_nama, w.induk_id as kabkota_id,
  k.instansi_id, i.nama as instansi_nama, i.jenis as instansi_jenis
from public.kasus k
left join public.sppg s on s.id = k.sppg_id
left join public.sekolah sk on sk.id = k.sekolah_id
left join public.wilayah w on w.id = k.wilayah_id
left join public.instansi i on i.id = k.instansi_id;

-- Papan Akuntabilitas per SPPG (LC-08).
create view public.v_akuntabilitas_sppg with (security_invoker = true) as
select
  s.id as sppg_id, s.nama, s.wilayah_id, w.nama as kecamatan_nama,
  s.status_operasional, s.status_slhs,
  count(k.id)::integer as jumlah_kasus,
  count(k.id) filter (where k.status = 'selesai')::integer as kasus_selesai,
  round(100.0 * count(k.id) filter (where k.status = 'selesai') / nullif(count(k.id), 0), 1) as persen_selesai,
  round((avg(extract(epoch from k.ditanggapi_pada - k.diteruskan_pada) / 3600)
         filter (where k.ditanggapi_pada is not null and k.diteruskan_pada is not null))::numeric, 1) as rata_jam_respons,
  round(100.0 * count(k.id) filter (where k.pernah_terlambat) / nullif(count(k.id), 0), 1) as persen_terlambat,
  count(k.id) filter (where k.terlambat and k.status in ('diteruskan', 'dibuka_ulang'))::integer as kasus_tidak_ditanggapi,
  round(sum(k.rating_rata * k.jumlah_rating) / nullif(sum(k.jumlah_rating), 0), 2) as kepuasan,
  coalesce(sum(k.jumlah_rating), 0)::integer as jumlah_rating
from public.sppg s
join public.wilayah w on w.id = s.wilayah_id
left join public.kasus k on k.sppg_id = s.id
group by s.id, w.nama;

-- Papan Akuntabilitas per kecamatan (LC-08).
create view public.v_akuntabilitas_kecamatan with (security_invoker = true) as
select
  w.id as wilayah_id, w.nama,
  count(k.id)::integer as jumlah_kasus,
  count(k.id) filter (where k.status = 'selesai')::integer as kasus_selesai,
  round(100.0 * count(k.id) filter (where k.status = 'selesai') / nullif(count(k.id), 0), 1) as persen_selesai,
  round((avg(extract(epoch from k.ditanggapi_pada - k.diteruskan_pada) / 3600)
         filter (where k.ditanggapi_pada is not null and k.diteruskan_pada is not null))::numeric, 1) as rata_jam_respons,
  round(100.0 * count(k.id) filter (where k.pernah_terlambat) / nullif(count(k.id), 0), 1) as persen_terlambat,
  count(k.id) filter (where k.terlambat and k.status in ('diteruskan', 'dibuka_ulang'))::integer as kasus_tidak_ditanggapi,
  round(sum(k.rating_rata * k.jumlah_rating) / nullif(sum(k.jumlah_rating), 0), 2) as kepuasan,
  coalesce(sum(k.jumlah_rating), 0)::integer as jumlah_rating
from public.wilayah w
left join public.kasus k on k.wilayah_id = w.id
where w.level = 'kecamatan'
group by w.id;

-- Risiko per kecamatan untuk peta (IN-01): skor tertinggi dan rata-rata berbobot porsi.
create view public.v_risiko_kecamatan with (security_invoker = true) as
select
  w.id as wilayah_id, w.nama, w.induk_id,
  count(i.sppg_id)::integer as jumlah_sppg,
  max(i.indeks) as skor_tertinggi,
  round(sum(i.indeks * i.porsi) / nullif(sum(i.porsi), 0), 1) as skor_rata_berbobot,
  (array_agg(i.sppg_id order by i.indeks desc) filter (where i.sppg_id is not null))[1] as sppg_tertinggi_id
from public.wilayah w
left join public.sppg s on s.wilayah_id = w.id
left join public.indeks_risiko i on i.sppg_id = s.id
where w.level = 'kecamatan'
group by w.id;

-- Anggaran per wilayah dan bulan (DT-01).
create view public.v_anggaran with (security_invoker = true) as
select
  a.wilayah_id, w.nama, w.level, w.induk_id, a.bulan,
  a.pagu, a.realisasi, a.jumlah_penerima, a.jumlah_sppg,
  round(100 * a.realisasi / nullif(a.pagu, 0), 1) as persen_realisasi,
  round(a.realisasi / nullif(a.jumlah_penerima, 0), 0) as realisasi_per_penerima,
  a.sumber
from public.anggaran_bulanan a
join public.wilayah w on w.id = a.wilayah_id;

create view public.v_anggaran_provinsi with (security_invoker = true) as
select
  a.bulan,
  sum(a.pagu) as pagu,
  sum(a.realisasi) as realisasi,
  sum(a.jumlah_penerima)::integer as jumlah_penerima,
  sum(a.jumlah_sppg)::integer as jumlah_sppg,
  round(100 * sum(a.realisasi) / nullif(sum(a.pagu), 0), 1) as persen_realisasi,
  'simulasi'::public.sumber_data as sumber
from public.anggaran_bulanan a
join public.wilayah w on w.id = a.wilayah_id and w.level = 'kabkota'
group by a.bulan;

-- Kasus keracunan per kab/kota per bulan (DT-04), lapisan agregat untuk ke-35 kab/kota.
-- Sengaja tidak dicampur dengan kasus dari laporan warga: sampel detail Kota Semarang punya
-- sumber dan cakupan berbeda, dan tersedia di v_kasus_kecamatan_bulanan.
create view public.v_kasus_keracunan_bulanan with (security_invoker = true) as
select r.wilayah_id, r.bulan, r.jumlah_kasus, r.jumlah_korban, r.sumber
from public.ringkasan_kasus_bulanan r;

-- Kasus per kecamatan, bulan, dan kategori (DT-04, drill-down DT-02).
create view public.v_kasus_kecamatan_bulanan with (security_invoker = true) as
select
  k.wilayah_id,
  date_trunc('month', k.waktu_kejadian at time zone 'Asia/Jakarta')::date as bulan,
  k.kategori,
  count(*)::integer as jumlah_kasus,
  coalesce(sum(k.total_terdampak), 0)::integer as jumlah_terdampak,
  'laporan_warga_terverifikasi'::public.sumber_data as sumber
from public.kasus k
group by k.wilayah_id, 2, k.kategori;

-- Ringkasan kab/kota untuk lapisan peta Jawa Tengah (IN-01, DT-02).
create view public.v_ringkasan_kabkota with (security_invoker = true) as
with bulan_terakhir as (
  select max(bulan) as bulan from public.anggaran_bulanan
),
kasus_3_bulan as (
  select v.wilayah_id, sum(v.jumlah_kasus)::integer as kasus, sum(v.jumlah_korban)::integer as korban
  from public.v_kasus_keracunan_bulanan v, bulan_terakhir b
  where v.bulan > (b.bulan - interval '3 months')
  group by v.wilayah_id
)
select
  w.id as wilayah_id, w.nama, w.pusat_lat, w.pusat_lng,
  a.bulan, a.pagu, a.realisasi, a.jumlah_penerima, a.jumlah_sppg,
  round(100 * a.realisasi / nullif(a.pagu, 0), 1) as persen_realisasi,
  coalesce(k.kasus, 0) as kasus_keracunan_3_bulan,
  coalesce(k.korban, 0) as korban_keracunan_3_bulan,
  round(coalesce(k.kasus, 0) * 100000.0 / nullif(a.jumlah_penerima, 0), 2) as kasus_per_100rb_penerima
from public.wilayah w
cross join bulan_terakhir b
left join public.anggaran_bulanan a on a.wilayah_id = w.id and a.bulan = b.bulan
left join kasus_3_bulan k on k.wilayah_id = w.id
where w.level = 'kabkota';
