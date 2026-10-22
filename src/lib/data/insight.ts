import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";
import { alasanRisiko, type Alasan } from "@/lib/data/publik";
import { kanvasPeta } from "@/lib/geo/peta";
import { komponenIndeks, type KomponenIndeks } from "@/lib/indeks";
import { kategoriRisiko, type KategoriRisiko } from "@/lib/label";
import { buatKlienPublik, TAG_DATA_PUBLIK } from "@/lib/supabase/publik";

const n = (v: number | string | null | undefined) => (v == null ? null : Number(v));

// ---------------------------------------------------------------------------
// IN-01: peta risiko. Dua lapisan terpisah menurut sumber (Keputusan-PRD 2.2):
// agregat 35 kab/kota Jawa Tengah dan data platform per kecamatan Kota Semarang.
// ---------------------------------------------------------------------------
export interface KabkotaPeta {
  id: string; nama: string; d: string; pusat: [number, number];
  kasusPer100rb: number | null; kasus: number; korban: number; persen: number | null; penerima: number; sppg: number;
}
export interface KecamatanPeta {
  id: string; nama: string; d: string; pusat: [number, number];
  tertinggi: number | null; rata: number | null; jumlahSppg: number; sppgTertinggi: string | null;
}
export interface TitikSppg {
  id: string; nama: string; kecamatan: string; x: number; y: number; indeks: number | null; kategori: KategoriRisiko;
}
export interface DataPeta {
  /** `bulan`: bulan anggaran terakhir yang sudah tutup, dasar lapisan realisasi. */
  jateng: { lebar: number; tinggi: number; bulan: string | null; wilayah: KabkotaPeta[] };
  semarang: { lebar: number; tinggi: number; wilayah: KecamatanPeta[]; titik: TitikSppg[] };
}

export async function ambilPeta(): Promise<DataPeta> {
  "use cache";
  cacheLife("minutes");
  cacheTag(TAG_DATA_PUBLIK);
  const supabase = buatKlienPublik();
  const [{ data: kab }, { data: anggaran }, { data: kec }, { data: sppg }, { data: indeks }] = await Promise.all([
    supabase.from("v_ringkasan_kabkota")
      .select("wilayah_id, kasus_keracunan_3_bulan, korban_keracunan_3_bulan, kasus_per_100rb_penerima, jumlah_penerima, jumlah_sppg"),
    // Bulan berjalan belum lengkap, jadi realisasi dibaca dari dua bulan terakhir lalu dipilih yang sudah tutup.
    supabase.from("v_anggaran").select("wilayah_id, bulan, persen_realisasi").eq("level", "kabkota")
      .order("bulan", { ascending: false }).limit(70),
    supabase.from("v_risiko_kecamatan").select("wilayah_id, jumlah_sppg, skor_tertinggi, skor_rata_berbobot, sppg_tertinggi_id").eq("induk_id", "33.74"),
    supabase.from("sppg").select("id, nama, lat, lng, wilayah:wilayah_id (nama)"),
    supabase.from("indeks_risiko").select("sppg_id, indeks"),
  ]);

  const kanvasJateng = kanvasPeta("jateng");
  const kanvasSemarang = kanvasPeta("semarang");
  const dataKab = new Map((kab ?? []).map((k) => [k.wilayah_id!, k]));
  const bulanTutup = [...new Set((anggaran ?? []).map((a) => a.bulan!))][1] ?? anggaran?.[0]?.bulan ?? null;
  const realisasi = new Map((anggaran ?? []).filter((a) => a.bulan === bulanTutup).map((a) => [a.wilayah_id!, n(a.persen_realisasi)]));
  const dataKec = new Map((kec ?? []).map((k) => [k.wilayah_id!, k]));
  const skor = new Map((indeks ?? []).map((i) => [i.sppg_id!, n(i.indeks)]));
  const namaSppg = new Map((sppg ?? []).map((s) => [s.id, s.nama]));

  return {
    jateng: {
      lebar: kanvasJateng.lebar,
      tinggi: kanvasJateng.tinggi,
      bulan: bulanTutup,
      wilayah: kanvasJateng.wilayah.map((w) => {
        const k = dataKab.get(w.id);
        return {
          ...w,
          kasusPer100rb: n(k?.kasus_per_100rb_penerima),
          kasus: k?.kasus_keracunan_3_bulan ?? 0,
          korban: k?.korban_keracunan_3_bulan ?? 0,
          persen: realisasi.get(w.id) ?? null,
          penerima: k?.jumlah_penerima ?? 0,
          sppg: k?.jumlah_sppg ?? 0,
        };
      }),
    },
    semarang: {
      lebar: kanvasSemarang.lebar,
      tinggi: kanvasSemarang.tinggi,
      wilayah: kanvasSemarang.wilayah.map((w) => {
        const k = dataKec.get(w.id);
        return {
          ...w,
          tertinggi: n(k?.skor_tertinggi),
          rata: n(k?.skor_rata_berbobot),
          jumlahSppg: k?.jumlah_sppg ?? 0,
          sppgTertinggi: k?.sppg_tertinggi_id ? namaSppg.get(k.sppg_tertinggi_id) ?? null : null,
        };
      }),
      titik: (sppg ?? [])
        .filter((s) => s.lat != null && s.lng != null)
        .map((s) => {
          const [x, y] = kanvasSemarang.titik(Number(s.lng), Number(s.lat));
          const i = skor.get(s.id) ?? null;
          return { id: s.id, nama: s.nama, kecamatan: s.wilayah?.nama ?? "", x, y, indeks: i, kategori: kategoriRisiko(i) };
        })
        // Titik berisiko tinggi digambar paling akhir agar tidak tertutup.
        .sort((a, b) => (a.indeks ?? 0) - (b.indeks ?? 0)),
    },
  };
}

// ---------------------------------------------------------------------------
// IN-02 dan IN-03: Indeks Risiko semua SPPG, urut prioritas inspeksi, beserta alasannya.
// ---------------------------------------------------------------------------
export interface SppgIndeks {
  id: string;
  nama: string;
  kecamatanId: string;
  kecamatan: string;
  indeks: number;
  kategori: KategoriRisiko;
  /** Selisih skor dibanding 7 hari lalu (null bila belum ada pembanding). */
  selisih7Hari: number | null;
  komponen: KomponenIndeks[];
  alasan: Alasan[];
  jumlahLaporan: number;
  jumlahKeracunan: number;
  porsiHarian: number;
}

export async function ambilIndeksSemua(): Promise<{ daftar: SppgIndeks[]; dihitungPada: string | null }> {
  "use cache";
  cacheLife("minutes");
  cacheTag(TAG_DATA_PUBLIK);
  const supabase = buatKlienPublik();
  const [{ data: indeks }, { data: sppg }, { data: lalu }] = await Promise.all([
    supabase.from("indeks_risiko").select("*").order("indeks", { ascending: false }),
    supabase.from("sppg").select("id, nama, kapasitas_porsi_harian, wilayah:wilayah_id (id, nama)"),
    supabase.rpc("indeks_risiko_lalu", { p_hari: 7 }),
  ]);
  const peta = new Map((sppg ?? []).map((s) => [s.id, s]));
  const skorLalu = new Map((lalu ?? []).map((l) => [l.sppg_id, Number(l.indeks)]));

  const daftar = (indeks ?? []).map((i): SppgIndeks => {
    const s = peta.get(i.sppg_id!);
    const skor = Number(i.indeks);
    const sebelum = skorLalu.get(i.sppg_id!);
    return {
      id: i.sppg_id!,
      nama: s?.nama ?? "SPPG",
      kecamatanId: s?.wilayah?.id ?? "",
      kecamatan: s?.wilayah?.nama ?? "",
      indeks: skor,
      kategori: kategoriRisiko(skor),
      selisih7Hari: sebelum == null ? null : Math.round((skor - sebelum) * 10) / 10,
      komponen: komponenIndeks(i),
      alasan: alasanRisiko({
        l: Number(i.l), k: Number(i.k), s: Number(i.s), t: Number(i.t), p: Number(i.p),
        ada_rating: Boolean(i.ada_rating), jumlah_laporan: i.jumlah_laporan ?? 0, jumlah_keracunan: i.jumlah_keracunan ?? 0,
      }),
      jumlahLaporan: i.jumlah_laporan ?? 0,
      jumlahKeracunan: i.jumlah_keracunan ?? 0,
      porsiHarian: s?.kapasitas_porsi_harian ?? 0,
    };
  });
  return { daftar, dihitungPada: indeks?.[0]?.dihitung_pada ?? null };
}

// ---------------------------------------------------------------------------
// IN-05: peringatan dini. Publik hanya membaca basis terverifikasi (RLS); sinyal dari laporan
// yang belum diverifikasi hanya ditampilkan jumlahnya.
// ---------------------------------------------------------------------------
export interface Peringatan {
  id: number;
  sppgId: string;
  sppg: string;
  kecamatan: string;
  jumlah24Jam: number;
  rataHarian: number;
  rasio: number;
  aktif: boolean;
  dibuatPada: string;
}

export async function ambilPeringatan(hari = 90): Promise<{ daftar: Peringatan[]; ditinjau: number }> {
  await connection();
  const supabase = buatKlienPublik();
  const sejak = new Date(Date.now() - hari * 86_400_000).toISOString();
  const [{ data }, { data: ditinjau }] = await Promise.all([
    supabase.from("peringatan_dini")
      .select("id, sppg_id, jumlah_24_jam, rata_rata_harian, rasio, aktif, dibuat_pada, sppg:sppg_id (nama, wilayah:wilayah_id (nama))")
      .eq("basis", "terverifikasi")
      .gte("dibuat_pada", sejak)
      .order("aktif", { ascending: false })
      .order("dibuat_pada", { ascending: false }),
    supabase.rpc("jumlah_sinyal_ditinjau"),
  ]);
  return {
    daftar: (data ?? []).map((p) => ({
      id: p.id,
      sppgId: p.sppg_id,
      sppg: p.sppg?.nama ?? "SPPG",
      kecamatan: p.sppg?.wilayah?.nama ?? "",
      jumlah24Jam: p.jumlah_24_jam,
      rataHarian: Number(p.rata_rata_harian),
      rasio: Number(p.rasio),
      aktif: p.aktif,
      dibuatPada: p.dibuat_pada,
    })),
    ditinjau: ditinjau ?? 0,
  };
}
