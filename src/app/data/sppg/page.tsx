import type { Metadata } from "next";
import { LabelSumber } from "@/components/data/label-sumber";
import { DirektoriSppg } from "@/components/data-terbuka/direktori-sppg";
import { ambilDaftarSppg } from "@/lib/data/data-terbuka";

export const metadata: Metadata = {
  title: "Direktori SPPG",
  description: "Daftar dapur SPPG Kota Semarang beserta skor risiko, status SLHS, sekolah yang dilayani, dan jumlah kasus.",
};

export default async function HalamanDirektori() {
  const data = await ambilDaftarSppg();
  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-extrabold">Direktori SPPG</h1>
        <LabelSumber jenis="simulasi" />
      </header>
      <DirektoriSppg data={data.map((s) => ({
        id: s.id, nama: s.nama, kecamatan: s.kecamatan, statusOperasional: s.statusOperasional,
        statusSlhs: s.statusSlhs, indeks: s.indeks, jumlahSekolah: s.jumlahSekolah, penerima: s.penerima, kasus: s.kasus,
      }))} />
    </div>
  );
}
