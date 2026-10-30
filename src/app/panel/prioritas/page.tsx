import type { Metadata } from "next";
import { Suspense } from "react";
import { Radar } from "lucide-react";
import { LabelSumber } from "@/components/data/label-sumber";
import { Waktu } from "@/components/data/waktu";
import { Legenda } from "@/components/grafik/kartu-grafik";
import { DaftarPrioritas } from "@/components/insight/daftar-prioritas";
import { RumusIndeks } from "@/components/insight/rumus-indeks";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilIndeksSemua } from "@/lib/data/insight";
import { KOMPONEN } from "@/lib/indeks";
import { wajibPeran } from "@/lib/sesi";

export const metadata: Metadata = {
  title: "Prioritas Inspeksi SPPG",
  description: "Daftar SPPG terurut berdasarkan Indeks Risiko Komposit untuk prioritas inspeksi lapangan Dinas Kesehatan dan pengawas.",
};

async function Isi() {
  await wajibPeran("verifikator", "instansi", "admin");
  const { daftar, dihitungPada } = await ambilIndeksSemua();

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-primary/20 bg-secondary/40 p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">
              <Radar className="size-3.5 text-primary" aria-hidden /> Panduan Lapangan Dinkes & Pengawas
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">Prioritas Inspeksi Dapur SPPG</h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Urutan audit SPPG disusun objektif berdasarkan Indeks Risiko Komposit (riwayat keluhan, tren kepatuhan SLHS, porsi, dan kepuasan warga) untuk menentukan titik inspeksi harian.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <RumusIndeks />
            <LabelSumber jenis="laporan_warga_terverifikasi" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Legenda butir={KOMPONEN.map((k) => ({ label: k.label, warna: k.warna }))} />
        {dihitungPada && (
          <p className="text-xs text-muted-foreground">Kalkulasi berkala: <Waktu iso={dihitungPada} /></p>
        )}
      </div>

      <DaftarPrioritas daftar={daftar} />
    </div>
  );
}

export default function HalamanPanelPrioritas() {
  return (
    <Suspense fallback={<Skeleton className="h-[40rem] rounded-3xl" />}>
      <Isi />
    </Suspense>
  );
}
