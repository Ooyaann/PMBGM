import "server-only";
import type { Kategori, StatusAlur } from "@/lib/label";
import { buatKlienServer } from "@/lib/supabase/server";

/** Batas membuka ulang kasus setelah selesai, sama dengan buka_ulang_kasus() di database. */
export const HARI_BUKA_ULANG = 14;

export interface LaporanSaya {
  id: string;
  kodeTiket: string;
  kategori: Kategori;
  /** Status yang dilihat pelapor: status kasus bila sudah diverifikasi. */
  status: StatusAlur;
  alasanTolak: string | null;
  dibuatPada: string;
  sekolah: string;
  kasus: { id: string; kode: string; selesaiPada: string | null; instansi: string | null } | null;
  rating: { skor: number; komentar: string | null } | null;
  /** Kasus selesai dan masih dalam batas 14 hari untuk dibuka ulang. */
  bisaBukaUlang: boolean;
}

export async function ambilLaporanSaya(penggunaId: string): Promise<LaporanSaya[]> {
  const supabase = await buatKlienServer();
  const { data } = await supabase
    .from("laporan")
    .select("id, kode_tiket, kategori, status, alasan_tolak, dibuat_pada, sekolah:sekolah_id (nama), kasus:kasus_id (id, kode_kasus, status, selesai_pada, instansi:instansi_id (nama)), rating (skor, komentar)")
    .eq("pelapor_id", penggunaId)
    .order("dibuat_pada", { ascending: false })
    .limit(100);
  const kini = Date.now();
  return (data ?? []).map((l) => {
    const r = Array.isArray(l.rating) ? l.rating[0] : l.rating;
    const selesaiPada = l.kasus?.status === "selesai" ? l.kasus.selesai_pada : null;
    return {
      id: l.id,
      kodeTiket: l.kode_tiket,
      kategori: l.kategori,
      status: l.kasus?.status ?? l.status,
      alasanTolak: l.alasan_tolak,
      dibuatPada: l.dibuat_pada,
      sekolah: l.sekolah?.nama ?? "",
      kasus: l.kasus ? { id: l.kasus.id, kode: l.kasus.kode_kasus, selesaiPada: l.kasus.selesai_pada, instansi: l.kasus.instansi?.nama ?? null } : null,
      rating: r ? { skor: r.skor, komentar: r.komentar } : null,
      bisaBukaUlang: !!selesaiPada && kini - Date.parse(selesaiPada) <= HARI_BUKA_ULANG * 86_400_000,
    };
  });
}

export interface Notifikasi {
  id: number;
  judul: string;
  isi: string | null;
  dibaca: boolean;
  dibuatPada: string;
  kodeTiket: string | null;
}

export async function ambilNotifikasi(penggunaId: string): Promise<{ daftar: Notifikasi[]; belumDibaca: number }> {
  const supabase = await buatKlienServer();
  const [{ data }, { count }] = await Promise.all([
    supabase.from("notifikasi").select("id, judul, isi, dibaca, dibuat_pada, laporan:laporan_id (kode_tiket)")
      .eq("pengguna_id", penggunaId).order("dibuat_pada", { ascending: false }).limit(30),
    supabase.from("notifikasi").select("id", { count: "exact", head: true }).eq("pengguna_id", penggunaId).eq("dibaca", false),
  ]);
  return {
    daftar: (data ?? []).map((n) => ({
      id: n.id, judul: n.judul, isi: n.isi, dibaca: n.dibaca, dibuatPada: n.dibuat_pada, kodeTiket: n.laporan?.kode_tiket ?? null,
    })),
    belumDibaca: count ?? 0,
  };
}

export async function ambilProfil(penggunaId: string) {
  const supabase = await buatKlienServer();
  const { data } = await supabase.from("profil_pengguna").select("nama_tampilan, jenis_pelapor, terverifikasi").eq("id", penggunaId).maybeSingle();
  return data;
}
