import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { buatKlienPublik, TAG_DATA_PUBLIK } from "@/lib/supabase/publik";

export interface HasilSekolah {
  id: string;
  nama: string;
  npsn: string | null;
  jenjang: string;
  siswa: number;
  kecamatan: string;
  sppg: { id: string; nama: string; slhs: string; indeks: number | null } | null;
  kasusTerbuka: number;
  kasusTotal: number;
}

/** Cari sekolah dengan nama atau NPSN (LM-02), lengkap dengan SPPG pelayan dan jumlah kasus. Jika kueri kosong, menampilkan seluruh sekolah. */
export async function cariSekolah(kueri = ""): Promise<HasilSekolah[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(TAG_DATA_PUBLIK);
  const q = kueri.trim().replace(/[%_,()]/g, "");
  const supabase = buatKlienPublik();
  let kueriDb = supabase
    .from("sekolah")
    .select("id, nama, npsn, jenjang, jumlah_siswa, wilayah:wilayah_id (nama), sppg:sppg_id (id, nama, status_slhs)")
    .order("nama");

  if (q.length >= 2) {
    kueriDb = kueriDb.or(`nama.ilike.%${q}%,npsn.eq.${q}`).limit(50);
  } else {
    kueriDb = kueriDb.limit(200);
  }

  const { data } = await kueriDb;
  const sekolah = data ?? [];
  if (!sekolah.length) return [];

  const ids = sekolah.map((s) => s.id);
  const sppgIds = [...new Set(sekolah.map((s) => s.sppg?.id).filter(Boolean))] as string[];
  const [{ data: kasus }, { data: indeks }] = await Promise.all([
    supabase.from("v_kasus_publik").select("sekolah_id, status").in("sekolah_id", ids),
    sppgIds.length ? supabase.from("indeks_risiko").select("sppg_id, indeks").in("sppg_id", sppgIds) : Promise.resolve({ data: [] }),
  ]);
  const skor = new Map((indeks ?? []).map((i) => [i.sppg_id, Number(i.indeks)]));

  return sekolah.map((s) => {
    const k = (kasus ?? []).filter((x) => x.sekolah_id === s.id);
    return {
      id: s.id,
      nama: s.nama,
      npsn: s.npsn,
      jenjang: s.jenjang,
      siswa: s.jumlah_siswa,
      kecamatan: s.wilayah?.nama ?? "",
      sppg: s.sppg ? { id: s.sppg.id, nama: s.sppg.nama, slhs: s.sppg.status_slhs, indeks: skor.get(s.sppg.id) ?? null } : null,
      kasusTerbuka: k.filter((x) => x.status !== "selesai").length,
      kasusTotal: k.length,
    };
  });
}

/** Satu sekolah dalam bentuk pilihan formulir Lapor (menerima ID UUID atau Nama Sekolah). */
export async function ambilSekolahPilihan(idAtauNama: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(TAG_DATA_PUBLIK);
  const supabase = buatKlienPublik();
  const adalahUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idAtauNama);

  let kueri = supabase
    .from("sekolah")
    .select("id, nama, jenjang, wilayah:wilayah_id (nama), sppg:sppg_id (id, nama)");

  if (adalahUuid) {
    kueri = kueri.eq("id", idAtauNama);
  } else {
    kueri = kueri.ilike("nama", `%${idAtauNama.trim()}%`);
  }

  const { data: s } = await kueri.limit(1).maybeSingle();
  if (!s) return null;
  const { data: i } = s.sppg ? await supabase.from("indeks_risiko").select("indeks").eq("sppg_id", s.sppg.id).maybeSingle() : { data: null };
  return {
    id: s.id,
    nama: s.nama,
    jenjang: s.jenjang,
    kecamatan: s.wilayah?.nama ?? "",
    sppgId: s.sppg?.id ?? null,
    sppgNama: s.sppg?.nama ?? null,
    indeks: i?.indeks != null ? Number(i.indeks) : null,
  };
}
