import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { buatKlienPublik, TAG_DATA_PUBLIK } from "@/lib/supabase/publik";

const n = (v: number | string | null | undefined) => (v == null ? null : Number(v));

/** Bulan "2026-08-01" → "Agu". */
export function labelBulan(iso: string, panjang = false) {
  return new Intl.DateTimeFormat("id-ID", { month: panjang ? "long" : "short", timeZone: "UTC" })
    .format(new Date(`${iso.slice(0, 10)}T00:00:00Z`));
}

// ---------------------------------------------------------------------------
// DT-01: dashboard program Jawa Tengah
// ---------------------------------------------------------------------------
export async function ambilDashboardProvinsi() {
  "use cache";
  cacheLife("hours");
  cacheTag(TAG_DATA_PUBLIK);
  const supabase = buatKlienPublik();
  const [{ data: bulanan }, { data: kabkota }] = await Promise.all([
    supabase.from("v_anggaran_provinsi").select("*").order("bulan"),
    supabase.from("v_ringkasan_kabkota").select("*").order("nama"),
  ]);
  return {
    bulanan: (bulanan ?? []).map((b) => ({
      bulan: b.bulan!,
      pagu: n(b.pagu) ?? 0,
      realisasi: n(b.realisasi) ?? 0,
      persen: n(b.persen_realisasi),
      penerima: b.jumlah_penerima ?? 0,
      sppg: b.jumlah_sppg ?? 0,
    })),
    kabkota: (kabkota ?? []).map((k) => ({
      id: k.wilayah_id!,
      nama: k.nama!,
      pagu: n(k.pagu) ?? 0,
      realisasi: n(k.realisasi) ?? 0,
      persen: n(k.persen_realisasi),
      penerima: k.jumlah_penerima ?? 0,
      sppg: k.jumlah_sppg ?? 0,
      kasus3Bulan: k.kasus_keracunan_3_bulan ?? 0,
      kasusPer100rb: n(k.kasus_per_100rb_penerima),
    })),
  };
}

// ---------------------------------------------------------------------------
// DT-02: drill-down provinsi → kab/kota → kecamatan
// ---------------------------------------------------------------------------
export async function ambilWilayah(id: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag(TAG_DATA_PUBLIK);
  const supabase = buatKlienPublik();
  const { data: w } = await supabase.from("wilayah").select("id, nama, level, induk_id").eq("id", id).maybeSingle();
  if (!w) return null;

  const [{ data: induk }, { data: anggaran }, { data: kasus }, { data: anak }] = await Promise.all([
    w.induk_id ? supabase.from("wilayah").select("id, nama, level").eq("id", w.induk_id).maybeSingle() : Promise.resolve({ data: null }),
    supabase.from("v_anggaran").select("bulan, pagu, realisasi, jumlah_penerima, jumlah_sppg, persen_realisasi").eq("wilayah_id", id).order("bulan"),
    w.level === "kabkota"
      ? supabase.from("v_kasus_keracunan_bulanan").select("bulan, jumlah_kasus, jumlah_korban, sumber").eq("wilayah_id", id).order("bulan")
      : supabase.from("v_kasus_kecamatan_bulanan").select("bulan, kategori, jumlah_kasus, jumlah_terdampak").eq("wilayah_id", id).order("bulan"),
    supabase.from("wilayah").select("id, nama").eq("induk_id", id).order("id"),
  ]);

  // Kab/kota dengan data detail (Kota Semarang): ringkasan per kecamatan.
  let kecamatan: {
    id: string; nama: string; sppg: number; penerima: number | null; risikoTertinggi: number | null;
    kasus: number; persenSelesai: number | null;
  }[] = [];
  if (w.level === "kabkota" && anak?.length) {
    const ids = anak.map((a) => a.id);
    const [{ data: risiko }, { data: akun }, { data: angKec }] = await Promise.all([
      supabase.from("v_risiko_kecamatan").select("wilayah_id, jumlah_sppg, skor_tertinggi").in("wilayah_id", ids),
      supabase.from("v_akuntabilitas_kecamatan").select("wilayah_id, jumlah_kasus, persen_selesai").in("wilayah_id", ids),
      supabase.from("anggaran_bulanan").select("wilayah_id, bulan, jumlah_penerima").in("wilayah_id", ids).order("bulan", { ascending: false }),
    ]);
    const penerima = new Map<string, number>();
    for (const a of angKec ?? []) if (!penerima.has(a.wilayah_id)) penerima.set(a.wilayah_id, a.jumlah_penerima);
    kecamatan = anak.map((a) => {
      const r = risiko?.find((x) => x.wilayah_id === a.id);
      const k = akun?.find((x) => x.wilayah_id === a.id);
      return {
        id: a.id, nama: a.nama, sppg: r?.jumlah_sppg ?? 0, penerima: penerima.get(a.id) ?? null,
        risikoTertinggi: n(r?.skor_tertinggi), kasus: k?.jumlah_kasus ?? 0, persenSelesai: n(k?.persen_selesai),
      };
    });
  }

  // Kecamatan: daftar SPPG beserta indeks risikonya.
  let sppg: Awaited<ReturnType<typeof ambilDaftarSppg>> = [];
  if (w.level === "kecamatan") sppg = (await ambilDaftarSppg()).filter((s) => s.wilayahId === id);

  return {
    wilayah: w,
    induk,
    anggaran: (anggaran ?? []).map((a) => ({
      bulan: a.bulan!, pagu: n(a.pagu) ?? 0, realisasi: n(a.realisasi) ?? 0, persen: n(a.persen_realisasi),
      penerima: a.jumlah_penerima ?? 0, sppg: a.jumlah_sppg ?? 0,
    })),
    kasusAgregat: w.level === "kabkota"
      ? ((kasus ?? []) as { bulan: string; jumlah_kasus: number; jumlah_korban: number }[]).map((k) => ({ bulan: k.bulan, kasus: k.jumlah_kasus, korban: k.jumlah_korban }))
      : [],
    kasusKategori: w.level === "kecamatan"
      ? ((kasus ?? []) as { bulan: string; kategori: string; jumlah_kasus: number }[])
      : [],
    kecamatan,
    sppg,
  };
}

// ---------------------------------------------------------------------------
// DT-03: direktori dan profil SPPG
// ---------------------------------------------------------------------------
export async function ambilDaftarSppg() {
  "use cache";
  cacheLife("minutes");
  cacheTag(TAG_DATA_PUBLIK);
  const supabase = buatKlienPublik();
  const [{ data: sppg }, { data: indeks }, { data: akun }, { data: sekolah }] = await Promise.all([
    supabase.from("sppg").select("id, nama, wilayah_id, kapasitas_porsi_harian, status_operasional, status_slhs, wilayah:wilayah_id (nama)").order("nama"),
    supabase.from("indeks_risiko").select("sppg_id, indeks, kategori_risiko"),
    supabase.from("v_akuntabilitas_sppg").select("sppg_id, jumlah_kasus, persen_selesai, kepuasan"),
    supabase.from("sekolah").select("sppg_id, jumlah_siswa"),
  ]);
  return (sppg ?? []).map((s) => {
    const i = indeks?.find((x) => x.sppg_id === s.id);
    const a = akun?.find((x) => x.sppg_id === s.id);
    const sek = (sekolah ?? []).filter((x) => x.sppg_id === s.id);
    return {
      id: s.id,
      nama: s.nama,
      wilayahId: s.wilayah_id,
      kecamatan: s.wilayah?.nama ?? "",
      kapasitas: s.kapasitas_porsi_harian,
      statusOperasional: s.status_operasional,
      statusSlhs: s.status_slhs,
      indeks: n(i?.indeks),
      jumlahSekolah: sek.length,
      penerima: sek.reduce((t, x) => t + x.jumlah_siswa, 0),
      kasus: a?.jumlah_kasus ?? 0,
      persenSelesai: n(a?.persen_selesai),
      kepuasan: n(a?.kepuasan),
    };
  });
}

/** Profil SPPG (DT-03). Tidak di-cache agar skor risiko dan kasus terbaru langsung tampil. */
export async function ambilProfilSppg(id: string) {
  const supabase = buatKlienPublik();
  const { data: s } = await supabase
    .from("sppg")
    .select("id, kode, nama, alamat, lat, lng, pengelola, kapasitas_porsi_harian, status_operasional, status_slhs, slhs_berlaku_sampai, mulai_beroperasi, sumber, wilayah:wilayah_id (id, nama)")
    .eq("id", id)
    .maybeSingle();
  if (!s) return null;

  const [{ data: indeks }, { data: riwayat }, { data: akun }, { data: sekolah }, { data: kasus }] = await Promise.all([
    supabase.from("indeks_risiko").select("*").eq("sppg_id", id).maybeSingle(),
    supabase.rpc("riwayat_indeks_sppg", { p_sppg_id: id, p_minggu: 12 }),
    supabase.from("v_akuntabilitas_sppg").select("*").eq("sppg_id", id).maybeSingle(),
    supabase.from("sekolah").select("id, nama, jenjang, jumlah_siswa").eq("sppg_id", id).order("nama"),
    supabase.from("v_kasus_publik")
      .select("id, kode_kasus, judul, kategori, status, terlambat, tidak_ditanggapi, waktu_kejadian, jumlah_laporan")
      .eq("sppg_id", id).order("waktu_kejadian", { ascending: false }),
  ]);

  return {
    sppg: s,
    indeks,
    riwayat: (riwayat ?? []).map((r) => ({ tanggal: r.periode_akhir, indeks: n(r.indeks) ?? 0 })),
    akuntabilitas: akun,
    sekolah: sekolah ?? [],
    kasus: kasus ?? [],
  };
}

// ---------------------------------------------------------------------------
// DT-04: data kasus keamanan pangan
// ---------------------------------------------------------------------------
export async function ambilKasusProvinsi() {
  "use cache";
  cacheLife("hours");
  cacheTag(TAG_DATA_PUBLIK);
  const supabase = buatKlienPublik();
  const [{ data: kasus }, { data: kabkota }] = await Promise.all([
    supabase.from("v_kasus_keracunan_bulanan").select("wilayah_id, bulan, jumlah_kasus, jumlah_korban").order("bulan"),
    supabase.from("wilayah").select("id, nama").eq("level", "kabkota"),
  ]);
  const nama = new Map((kabkota ?? []).map((k) => [k.id, k.nama]));
  const perBulan = new Map<string, { kasus: number; korban: number }>();
  const perWilayah = new Map<string, { kasus: number; korban: number }>();
  for (const k of kasus ?? []) {
    const b = perBulan.get(k.bulan!) ?? { kasus: 0, korban: 0 };
    b.kasus += k.jumlah_kasus ?? 0;
    b.korban += k.jumlah_korban ?? 0;
    perBulan.set(k.bulan!, b);
    const w = perWilayah.get(k.wilayah_id!) ?? { kasus: 0, korban: 0 };
    w.kasus += k.jumlah_kasus ?? 0;
    w.korban += k.jumlah_korban ?? 0;
    perWilayah.set(k.wilayah_id!, w);
  }
  return {
    bulanan: [...perBulan.entries()].map(([bulan, v]) => ({ bulan, ...v })),
    wilayah: [...perWilayah.entries()]
      .map(([id, v]) => ({ id, nama: nama.get(id) ?? id, ...v }))
      .sort((a, b) => b.kasus - a.kasus),
  };
}

/** Kasus terverifikasi Kota Semarang per bulan dan kategori. Tidak di-cache: diperbarui realtime (DT-05). */
export async function ambilKasusSemarang() {
  const supabase = buatKlienPublik();
  const [{ data }, { data: kec }] = await Promise.all([
    supabase.from("v_kasus_kecamatan_bulanan").select("wilayah_id, bulan, kategori, jumlah_kasus, jumlah_terdampak"),
    supabase.from("wilayah").select("id, nama").eq("level", "kecamatan"),
  ]);
  return {
    baris: (data ?? []).map((d) => ({
      wilayah_id: d.wilayah_id ?? "", bulan: d.bulan ?? "", kategori: d.kategori ?? "lainnya",
      jumlah_kasus: d.jumlah_kasus ?? 0, jumlah_terdampak: d.jumlah_terdampak ?? 0,
    })),
    kecamatan: kec ?? [],
  };
}

// ---------------------------------------------------------------------------
// DT-08: Kepatuhan dan Keamanan Dapur SPPG Wilayah (SLHS & Operasional)
// ---------------------------------------------------------------------------
export async function ambilKepatuhanWilayah(wilayahId: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(TAG_DATA_PUBLIK);
  const daftar = await ambilDaftarSppg();
  const sppgWilayah = wilayahId === "33.74"
    ? daftar
    : daftar.filter((s) => s.wilayahId === wilayahId);

  if (!sppgWilayah.length) return null;

  const total = sppgWilayah.length;
  const slhsBerlaku = sppgWilayah.filter((s) => s.statusSlhs === "berlaku").length;
  const slhsProses = sppgWilayah.filter((s) => s.statusSlhs === "proses").length;
  const slhsTanpa = sppgWilayah.filter((s) => s.statusSlhs === "tidak_ada" || s.statusSlhs === "kedaluwarsa").length;
  const beroperasi = sppgWilayah.filter((s) => s.statusOperasional === "beroperasi").length;
  const ditutup = sppgWilayah.filter((s) => s.statusOperasional === "ditutup_sementara").length;

  return {
    total,
    slhsBerlaku,
    slhsProses,
    slhsTanpa,
    persenSlhs: total ? Math.round((100 * slhsBerlaku) / total) : 0,
    beroperasi,
    ditutup,
    daftar: sppgWilayah.slice(0, 6),
  };
}

