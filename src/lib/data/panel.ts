import "server-only";
import type { JenisPeristiwa, JenisTindakan, Kategori, ModeIdentitas, StatusAlur, TingkatPrioritas } from "@/lib/label";
import { buatKlienServer } from "@/lib/supabase/server";

/**
 * Data panel internal. Semua query memakai sesi pengguna (buatKlienServer), jadi hasilnya
 * dibatasi RLS: verifikator/admin membaca semua laporan, instansi hanya kasus yang diteruskan kepadanya.
 * Tidak di-cache karena antrean harus selalu terkini.
 */

const URUT_PRIORITAS: Record<TingkatPrioritas, number> = { darurat: 0, tinggi: 1, sedang: 2, rendah: 3 };
const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export interface FotoPanel {
  id: string;
  url: string;
  jenis: "foto" | "video";
  ilustrasi: boolean;
  exif: { waktu: string | null; lat: number | null; lng: number | null; perangkat: string | null } | null;
}

/** URL bukti warga untuk staf: bertanda tangan 1 jam; data simulasi memakai ilustrasi berlabel. */
async function urlBukti(supabase: Awaited<ReturnType<typeof buatKlienServer>>, paths: string[]) {
  const asli = paths.filter((p) => !p.startsWith("simulasi/"));
  const { data } = asli.length ? await supabase.storage.from("bukti").createSignedUrls(asli, 3600) : { data: [] };
  const peta = new Map((data ?? []).map((t) => [t.path, t.signedUrl]));
  return (p: string) => (p.startsWith("simulasi/") ? "/simulasi/makanan.svg" : peta.get(p) ?? "");
}

export function urlTindakLanjut(path: string) {
  return path.startsWith("simulasi/")
    ? "/simulasi/tindak-lanjut.svg"
    : `${URL_SUPABASE}/storage/v1/object/public/tindak-lanjut/${path}`;
}

// ---------------------------------------------------------------------------
// Antrean verifikasi (LP-09)
// ---------------------------------------------------------------------------
export interface ButirAntrean {
  id: string;
  kodeTiket: string;
  kategori: Kategori;
  prioritas: TingkatPrioritas;
  skorPrioritas: number;
  kredibilitas: number;
  terdampak: number;
  waktuKejadian: string;
  dibuatPada: string;
  tenggat: string | null;
  terlambat: boolean;
  mode: ModeIdentitas;
  dukungan: number;
  sekolah: string;
  kecamatan: string;
  sppg: string | null;
  /** Jumlah laporan lain di kelompok serupa yang juga masih menunggu. */
  serupa: number;
  jumlahBukti: number;
}

export async function ambilAntrean(): Promise<ButirAntrean[]> {
  const supabase = await buatKlienServer();
  const { data } = await supabase
    .from("laporan")
    .select("id, kode_tiket, kategori, prioritas, skor_prioritas, skor_kredibilitas, jumlah_terdampak, waktu_kejadian, dibuat_pada, tenggat_verifikasi, terlambat, mode_identitas, jumlah_dukungan, grup_serupa, sekolah:sekolah_id (nama), wilayah:wilayah_id (nama), sppg:sppg_id (nama), bukti (id)")
    .eq("status", "diterima");
  const baris = data ?? [];
  const grup = new Map<string, number>();
  for (const l of baris) if (l.grup_serupa) grup.set(l.grup_serupa, (grup.get(l.grup_serupa) ?? 0) + 1);

  return baris
    .map((l) => ({
      id: l.id,
      kodeTiket: l.kode_tiket,
      kategori: l.kategori,
      prioritas: l.prioritas,
      skorPrioritas: l.skor_prioritas,
      kredibilitas: l.skor_kredibilitas,
      terdampak: l.jumlah_terdampak,
      waktuKejadian: l.waktu_kejadian,
      dibuatPada: l.dibuat_pada,
      tenggat: l.tenggat_verifikasi,
      terlambat: l.terlambat,
      mode: l.mode_identitas,
      dukungan: l.jumlah_dukungan,
      sekolah: l.sekolah?.nama ?? "",
      kecamatan: l.wilayah?.nama ?? "",
      sppg: l.sppg?.nama ?? null,
      serupa: l.grup_serupa ? (grup.get(l.grup_serupa) ?? 1) - 1 : 0,
      jumlahBukti: l.bukti?.length ?? 0,
    }))
    .sort((a, b) => URUT_PRIORITAS[a.prioritas] - URUT_PRIORITAS[b.prioritas]
      || Number(b.terlambat) - Number(a.terlambat)
      || b.skorPrioritas - a.skorPrioritas
      || Date.parse(a.dibuatPada) - Date.parse(b.dibuatPada));
}

// ---------------------------------------------------------------------------
// Detail laporan untuk verifikasi
// ---------------------------------------------------------------------------
export interface KomponenKredibilitas {
  bukti: number; metadata: number; pelapor: number; dukungan: number; kelengkapan: number;
  jumlah_bukti?: number; waktu_foto_cocok?: boolean; lokasi_foto_cocok?: boolean; jumlah_dukungan?: number;
}

export interface IdentitasPelapor {
  mode: ModeIdentitas;
  nama?: string;
  email?: string;
  terverifikasi: boolean;
  jenis_pelapor: string | null;
  jumlah_laporan?: number;
  jumlah_ditolak?: number;
}

export async function ambilLaporanPanel(id: string) {
  const supabase = await buatKlienServer();
  const { data: l } = await supabase
    .from("laporan")
    .select("*, sekolah:sekolah_id (id, nama, jenjang, npsn, lat, lng, jumlah_siswa), sppg:sppg_id (id, nama, status_slhs), wilayah:wilayah_id (id, nama)")
    .eq("id", id)
    .maybeSingle();
  if (!l) return null;

  const batasAwal = new Date(Date.parse(l.waktu_kejadian) - 14 * 86_400_000).toISOString();
  const [{ data: bukti }, { data: identitas }, { data: serupa }, { data: kasusTerbuka }, { data: riwayat }, { data: indeks }] = await Promise.all([
    supabase.from("bukti").select("id, path_storage, jenis, bukti_metadata (exif_waktu, exif_lat, exif_lng, perangkat)").eq("laporan_id", id),
    supabase.rpc("identitas_pelapor", { p_laporan_id: id }),
    l.grup_serupa
      ? supabase.from("laporan").select("id, kode_tiket, deskripsi, jumlah_terdampak, waktu_kejadian, skor_kredibilitas, status, mode_identitas")
        .eq("grup_serupa", l.grup_serupa).neq("id", id).eq("status", "diterima").order("dibuat_pada")
      : Promise.resolve({ data: [] }),
    supabase.from("kasus").select("id, kode_kasus, judul, status, jumlah_laporan, waktu_kejadian, sekolah_id")
      .neq("status", "selesai").eq("kategori", l.kategori).gte("waktu_kejadian", batasAwal)
      .or(`sekolah_id.eq.${l.sekolah_id}${l.sppg_id ? `,sppg_id.eq.${l.sppg_id}` : ""}`)
      .order("waktu_kejadian", { ascending: false }).limit(5),
    supabase.from("status_log").select("id, dibuat_pada, peristiwa, dari, ke, pelaku_label, pelaku_peran, catatan").eq("laporan_id", id).order("dibuat_pada"),
    l.sppg_id ? supabase.from("indeks_risiko").select("indeks").eq("sppg_id", l.sppg_id).maybeSingle() : Promise.resolve({ data: null }),
  ]);

  const url = await urlBukti(supabase, (bukti ?? []).map((b) => b.path_storage));
  const foto: FotoPanel[] = (bukti ?? []).map((b) => {
    const m = Array.isArray(b.bukti_metadata) ? b.bukti_metadata[0] : b.bukti_metadata;
    return {
      id: b.id,
      url: url(b.path_storage),
      jenis: b.jenis,
      ilustrasi: b.path_storage.startsWith("simulasi/"),
      exif: m ? { waktu: m.exif_waktu, lat: m.exif_lat, lng: m.exif_lng, perangkat: m.perangkat } : null,
    };
  });

  return {
    laporan: l,
    komponen: l.komponen_kredibilitas as unknown as KomponenKredibilitas,
    foto,
    identitas: identitas as unknown as IdentitasPelapor | null,
    serupa: serupa ?? [],
    kasusTerbuka: kasusTerbuka ?? [],
    riwayat: riwayat ?? [],
    indeksSppg: indeks?.indeks != null ? Number(indeks.indeks) : null,
  };
}

// ---------------------------------------------------------------------------
// Kasus (LC-04, LC-05): daftar dan detail untuk verifikator, instansi, admin
// ---------------------------------------------------------------------------
export interface ButirKasus {
  id: string;
  kode: string;
  judul: string;
  kategori: Kategori;
  status: StatusAlur;
  statusSejak: string;
  tenggat: string | null;
  terlambat: boolean;
  tidakDitanggapi: boolean;
  prioritas: TingkatPrioritas;
  jumlahLaporan: number;
  terdampak: number;
  sppg: string | null;
  kecamatan: string | null;
  instansi: string | null;
  waktuKejadian: string;
}

export async function ambilDaftarKasus(opsi: { instansiId?: string | null; selesaiHari?: number } = {}): Promise<ButirKasus[]> {
  const supabase = await buatKlienServer();
  const sejak = new Date(Date.now() - (opsi.selesaiHari ?? 14) * 86_400_000).toISOString();
  let q = supabase
    .from("v_kasus_publik")
    .select("id, kode_kasus, judul, kategori, status, status_sejak, tenggat_tahap, terlambat, tidak_ditanggapi, prioritas, jumlah_laporan, total_terdampak, sppg_nama, kecamatan_nama, instansi_nama, instansi_id, waktu_kejadian, selesai_pada")
    .or(`status.neq.selesai,selesai_pada.gte.${sejak}`);
  if (opsi.instansiId) {
    const { data: inst } = await supabase.from("instansi").select("sppg_id").eq("id", opsi.instansiId).single();
    if (inst?.sppg_id) {
      q = q.or(`instansi_id.eq.${opsi.instansiId},sppg_id.eq.${inst.sppg_id}`);
    } else {
      q = q.eq("instansi_id", opsi.instansiId);
    }
  }
  const { data } = await q.order("status_sejak", { ascending: false }).limit(300);
  return (data ?? []).map((k) => ({
    id: k.id!,
    kode: k.kode_kasus!,
    judul: k.judul!,
    kategori: k.kategori!,
    status: k.status!,
    statusSejak: k.status_sejak!,
    tenggat: k.tenggat_tahap,
    terlambat: Boolean(k.terlambat),
    tidakDitanggapi: Boolean(k.tidak_ditanggapi),
    prioritas: k.prioritas!,
    jumlahLaporan: k.jumlah_laporan ?? 0,
    terdampak: k.total_terdampak ?? 0,
    sppg: k.sppg_nama,
    kecamatan: k.kecamatan_nama,
    instansi: k.instansi_nama,
    waktuKejadian: k.waktu_kejadian!,
  }));
}

export interface PeristiwaPanel {
  id: number;
  waktu: string;
  peristiwa: JenisPeristiwa;
  dari: StatusAlur | null;
  ke: StatusAlur | null;
  jenisTindakan: JenisTindakan | null;
  pelaku: string;
  catatan: string | null;
  bukti: string[];
  publik: boolean;
  laporanId: string | null;
}

export async function ambilKasusPanel(id: string) {
  const supabase = await buatKlienServer();
  const { data: k } = await supabase.from("v_kasus_publik").select("*").eq("id", id).maybeSingle();
  if (!k) return null;

  const [{ data: laporan }, { data: log }, { data: instansi }] = await Promise.all([
    supabase.from("laporan").select("id, kode_tiket, deskripsi, jumlah_terdampak, waktu_kejadian, skor_kredibilitas, mode_identitas, bukti (id, path_storage, jenis)")
      .eq("kasus_id", id).order("waktu_kejadian"),
    supabase.from("status_log").select("id, dibuat_pada, peristiwa, dari, ke, jenis_tindakan, pelaku_label, pelaku_peran, catatan, bukti_paths, publik, laporan_id")
      .eq("kasus_id", id).order("dibuat_pada").order("id"),
    supabase.from("instansi").select("id, nama, jenis, sppg_id").order("nama"),
  ]);

  const url = await urlBukti(supabase, (laporan ?? []).flatMap((l) => (l.bukti ?? []).map((b) => b.path_storage)));
  const foto = (laporan ?? []).flatMap((l) => (l.bukti ?? []).map((b) => ({
    id: b.id, url: url(b.path_storage), jenis: b.jenis, ilustrasi: b.path_storage.startsWith("simulasi/"),
  }))).filter((f) => f.url);

  // Saran instansi tujuan: pengelola SPPG terkait, Korwil BGN, dan Dinkes untuk dugaan keracunan.
  const saran = new Set<string>();
  for (const i of instansi ?? []) {
    if (i.sppg_id && i.sppg_id === k.sppg_id) saran.add(i.id);
    if (i.jenis === "korwil_bgn") saran.add(i.id);
    if (i.jenis === "dinas_kesehatan" && (k.kategori === "keracunan" || k.kategori === "kebersihan" || k.kategori === "makanan_tidak_layak")) saran.add(i.id);
    if (i.jenis === "dinas_pendidikan" && k.kategori === "distribusi") saran.add(i.id);
    if (i.jenis === "ombudsman" && k.kategori === "pengadaan") saran.add(i.id);
  }

  return {
    kasus: k,
    laporan: laporan ?? [],
    foto,
    peristiwa: (log ?? []).map((g): PeristiwaPanel => ({
      id: g.id,
      waktu: g.dibuat_pada,
      peristiwa: g.peristiwa,
      dari: g.dari,
      ke: g.ke,
      jenisTindakan: g.jenis_tindakan,
      pelaku: g.pelaku_label ?? g.pelaku_peran,
      catatan: g.catatan,
      bukti: g.bukti_paths ?? [],
      publik: g.publik,
      laporanId: g.laporan_id,
    })),
    instansi: (instansi ?? [])
      // Pengelola SPPG lain tidak relevan untuk kasus ini.
      .filter((i) => !i.sppg_id || i.sppg_id === k.sppg_id)
      .map((i) => ({ id: i.id, nama: i.nama, jenis: i.jenis, disarankan: saran.has(i.id) }))
      .sort((a, b) => Number(b.disarankan) - Number(a.disarankan)),
  };
}

// ---------------------------------------------------------------------------
// Ringkasan beranda panel
// ---------------------------------------------------------------------------
export async function ambilRingkasanPanel(instansiId: string | null) {
  const supabase = await buatKlienServer();
  const hitung = (q: PromiseLike<{ count: number | null }>) => q.then((r) => r.count ?? 0);

  let sppgId: string | null = null;
  if (instansiId) {
    const { data: inst } = await supabase.from("instansi").select("sppg_id").eq("id", instansiId).single();
    sppgId = inst?.sppg_id ?? null;
  }

  const kasus = () => {
    const q = supabase.from("kasus").select("id", { count: "exact", head: true });
    if (instansiId && sppgId) {
      return q.or(`instansi_id.eq.${instansiId},sppg_id.eq.${sppgId}`);
    }
    return instansiId ? q.eq("instansi_id", instansiId) : q;
  };
  const [antrean, antreanTerlambat, perluDiteruskan, menungguInstansi, tidakDitanggapi, ditindaklanjuti] = await Promise.all([
    instansiId ? 0 : hitung(supabase.from("laporan").select("id", { count: "exact", head: true }).eq("status", "diterima")),
    instansiId ? 0 : hitung(supabase.from("laporan").select("id", { count: "exact", head: true }).eq("status", "diterima").eq("terlambat", true)),
    instansiId ? 0 : hitung(kasus().eq("status", "diverifikasi")),
    hitung(kasus().in("status", ["diteruskan", "dibuka_ulang"])),
    hitung(kasus().in("status", ["diteruskan", "dibuka_ulang"]).eq("terlambat", true)),
    hitung(kasus().eq("status", "ditindaklanjuti")),
  ]);
  return { antrean, antreanTerlambat, perluDiteruskan, menungguInstansi, tidakDitanggapi, ditindaklanjuti };
}
