import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { JenisPeristiwa, JenisTindakan, Kategori, StatusAlur } from "@/lib/label";
import { buatKlienPublik, TAG_DATA_PUBLIK } from "@/lib/supabase/publik";

export interface Peristiwa {
  waktu: string;
  peristiwa: JenisPeristiwa;
  dari: StatusAlur | null;
  ke: StatusAlur | null;
  jenisTindakan: JenisTindakan | null;
  pelaku: string;
  catatan: string | null;
  bukti: FotoBukti[];
}

export interface FotoBukti {
  url: string;
  jenis: "foto" | "video";
  ilustrasi: boolean;
}

const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL!;

/** Bukti tindak lanjut ada di bucket publik; bukti data simulasi memakai ilustrasi berlabel. */
function urlTindakLanjut(path: string): FotoBukti {
  if (path.startsWith("simulasi/")) return { url: "/simulasi/tindak-lanjut.svg", jenis: "foto", ilustrasi: true };
  return { url: `${URL_SUPABASE}/storage/v1/object/public/tindak-lanjut/${path}`, jenis: "foto", ilustrasi: false };
}

interface PeristiwaMentah {
  waktu: string;
  peristiwa: JenisPeristiwa;
  dari: StatusAlur | null;
  ke: StatusAlur | null;
  jenis_tindakan: JenisTindakan | null;
  pelaku: string;
  catatan: string | null;
  bukti: string[] | null;
}

function olahPeristiwa(p: PeristiwaMentah): Peristiwa {
  return {
    waktu: p.waktu,
    peristiwa: p.peristiwa,
    dari: p.dari,
    ke: p.ke,
    jenisTindakan: p.jenis_tindakan,
    pelaku: p.pelaku,
    catatan: p.catatan,
    bukti: (p.bukti ?? []).map(urlTindakLanjut),
  };
}

export interface StatusTiket {
  kodeTiket: string;
  kategori: Kategori;
  status: StatusAlur;
  dibuatPada: string;
  waktuKejadian: string;
  alasanTolak: string | null;
  sekolah: string;
  sppg: string | null;
  sppgId: string | null;
  kecamatan: string | null;
  tenggatVerifikasi: string | null;
  kasus: {
    id: string;
    kodeKasus: string;
    judul: string;
    status: StatusAlur;
    statusSejak: string;
    tenggatTahap: string | null;
    terlambat: boolean;
    tidakDitanggapi: boolean;
    instansi: string | null;
    jumlahLaporan: number;
  } | null;
  timeline: Peristiwa[];
}

/** Cek status tiket tanpa login (LC-01). Tidak di-cache: status harus selalu terkini. */
export async function ambilStatusTiket(kode: string): Promise<StatusTiket | null> {
  const { data } = await buatKlienPublik().rpc("cek_status_tiket", { p_kode: kode });
  if (!data) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- bentuk JSON dari RPC
  const d = data as any;
  return {
    kodeTiket: d.kode_tiket,
    kategori: d.kategori,
    status: d.status,
    dibuatPada: d.dibuat_pada,
    waktuKejadian: d.waktu_kejadian,
    alasanTolak: d.alasan_tolak,
    sekolah: d.sekolah,
    sppg: d.sppg,
    sppgId: d.sppg_id,
    kecamatan: d.kecamatan,
    tenggatVerifikasi: d.tenggat_verifikasi,
    kasus: d.kasus && {
      id: d.kasus.id,
      kodeKasus: d.kasus.kode_kasus,
      judul: d.kasus.judul,
      status: d.kasus.status,
      statusSejak: d.kasus.status_sejak,
      tenggatTahap: d.kasus.tenggat_tahap,
      terlambat: d.kasus.terlambat,
      tidakDitanggapi: d.kasus.tidak_ditanggapi,
      instansi: d.kasus.instansi,
      jumlahLaporan: d.kasus.jumlah_laporan,
    },
    timeline: (d.timeline as PeristiwaMentah[]).map(olahPeristiwa),
  };
}

/** Kasus publik beserta timeline dan bukti (LC-07). Tidak di-cache agar pembaruan realtime langsung tampil. */
export async function ambilKasus(id: string) {
  const supabase = buatKlienPublik();
  const [{ data: kasus }, { data: timeline }, { data: bukti }] = await Promise.all([
    supabase.from("v_kasus_publik").select("*").eq("id", id).maybeSingle(),
    supabase.rpc("timeline_kasus", { p_kasus_id: id }),
    supabase.rpc("bukti_publik_kasus", { p_kasus_id: id }),
  ]);
  if (!kasus) return null;

  // Foto warga ada di bucket privat; yang sudah publik dibuka lewat URL bertanda tangan 1 jam.
  const asli = (bukti ?? []).filter((b) => !b.path_storage.startsWith("simulasi/"));
  const { data: bertanda } = asli.length
    ? await supabase.storage.from("bukti").createSignedUrls(asli.map((b) => b.path_storage), 3600)
    : { data: [] };
  const petaUrl = new Map((bertanda ?? []).map((t) => [t.path, t.signedUrl]));

  const fotoWarga: FotoBukti[] = (bukti ?? []).map((b) => b.path_storage.startsWith("simulasi/")
    ? { url: "/simulasi/makanan.svg", jenis: b.jenis, ilustrasi: true }
    : { url: petaUrl.get(b.path_storage) ?? "", jenis: b.jenis, ilustrasi: false })
    .filter((f) => f.url);

  return {
    kasus,
    timeline: (timeline ?? []).map((p) => olahPeristiwa({ ...p, jenis_tindakan: p.jenis_tindakan, bukti: p.bukti } as PeristiwaMentah)),
    fotoWarga,
  };
}

export async function ambilKasusTerbaru(opsi?: {
  batas?: number;
  rentangHari?: number | null;
  status?: string | null;
  kategori?: string | null;
}) {
  const batas = opsi?.batas ?? 12;
  let kueri = buatKlienPublik()
    .from("v_kasus_publik")
    .select("id, kode_kasus, judul, kategori, status, terlambat, tidak_ditanggapi, kecamatan_nama, sppg_nama, diverifikasi_pada, jumlah_laporan")
    .order("diverifikasi_pada", { ascending: false });

  if (opsi?.status && opsi.status !== "semua") {
    if (opsi.status === "diproses") {
      kueri = kueri.neq("status", "selesai");
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      kueri = kueri.eq("status", opsi.status as any);
    }
  }

  if (opsi?.kategori && opsi.kategori !== "semua") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kueri = kueri.eq("kategori", opsi.kategori as any);
  }

  if (opsi?.rentangHari && opsi.rentangHari > 0) {
    const batasTgl = new Date(Date.now() - opsi.rentangHari * 24 * 60 * 60 * 1000).toISOString();
    kueri = kueri.gte("diverifikasi_pada", batasTgl);
  }

  const { data } = await kueri.limit(batas);
  return data ?? [];
}

export async function ambilAkuntabilitas() {
  "use cache";
  cacheLife("minutes");
  cacheTag(TAG_DATA_PUBLIK);
  const supabase = buatKlienPublik();
  const [{ data: sppg }, { data: kecamatan }, { data: belum }] = await Promise.all([
    supabase.from("v_akuntabilitas_sppg").select("*").order("jumlah_kasus", { ascending: false }),
    supabase.from("v_akuntabilitas_kecamatan").select("*").order("jumlah_kasus", { ascending: false }),
    supabase
      .from("v_kasus_publik")
      .select("id, kode_kasus, judul, kategori, sppg_nama, instansi_nama, tenggat_tahap, diteruskan_pada, status_sejak")
      .eq("tidak_ditanggapi", true)
      .order("tenggat_tahap", { ascending: true }),
  ]);
  return { sppg: sppg ?? [], kecamatan: kecamatan ?? [], belumDitanggapi: belum ?? [] };
}
