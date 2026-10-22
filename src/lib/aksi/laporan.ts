"use server";

import { after } from "next/server";
import { klasifikasiKataKunci } from "@/lib/klasifikasi";
import { gabungKlasifikasi, klasifikasiDenganAi } from "@/lib/klasifikasi-ai";
import { buatKlienAdmin } from "@/lib/supabase/admin";
import { buatKlienServer } from "@/lib/supabase/server";
import { skemaLaporan, type InputLaporan } from "@/lib/validasi/laporan";

export type HasilKirim =
  | { ok: true; id: string; kodeTiket: string; pelaporId: string }
  | { ok: false; pesan: string; perluMasuk?: boolean };

/**
 * Simpan laporan baru (LP-01, LP-05). Validasi diulang di server dengan skema yang sama;
 * kolom turunan (SPPG, wilayah, kode tiket, kelompok serupa, skor) diisi trigger database.
 */
export async function kirimLaporan(input: InputLaporan): Promise<HasilKirim> {
  const hasil = skemaLaporan.safeParse(input);
  if (!hasil.success) return { ok: false, pesan: hasil.error.issues[0].message };
  const d = hasil.data;

  const supabase = await buatKlienServer();
  const { data: klaim } = await supabase.auth.getClaims();
  const pelaporId = klaim?.claims?.sub;
  if (!pelaporId) return { ok: false, pesan: "Masuk dengan email terlebih dahulu.", perluMasuk: true };

  const { data, error } = await supabase
    .from("laporan")
    .insert({
      pelapor_id: pelaporId,
      kategori: d.kategori,
      sekolah_id: d.sekolahId,
      waktu_kejadian: d.waktuKejadian,
      jumlah_terdampak: d.jumlahTerdampak,
      deskripsi: d.deskripsi,
      lokasi_lat: d.lokasi?.lat ?? null,
      lokasi_lng: d.lokasi?.lng ?? null,
      mode_identitas: d.modeIdentitas,
      klasifikasi_otomatis: { ...klasifikasiKataKunci(d.deskripsi, d.jumlahTerdampak) },
    })
    .select("id, kode_tiket")
    .single();

  if (error) {
    // Pesan dari trigger (batas harian, waktu tidak valid) sudah berbahasa Indonesia.
    const dariTrigger = ["54000", "22023"].includes(error.code ?? "");
    return { ok: false, pesan: dariTrigger ? error.message : "Laporan belum tersimpan. Coba lagi sebentar." };
  }
  // LP-11: saran AI diminta setelah respons terkirim agar pelapor tidak menunggu.
  // Kolom ini hanya bisa diubah server, jadi ditulis dengan klien admin.
  after(async () => {
    const ai = await klasifikasiDenganAi(d.deskripsi, d.jumlahTerdampak, d.kategori);
    const admin = buatKlienAdmin();
    if (!ai || !admin) return;
    await admin.from("laporan").update({ klasifikasi_otomatis: { ...gabungKlasifikasi(d.deskripsi, d.jumlahTerdampak, ai) } }).eq("id", data.id);
  });
  return { ok: true, id: data.id, kodeTiket: data.kode_tiket, pelaporId };
}
