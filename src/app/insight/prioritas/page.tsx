import type { Metadata } from "next";
import { Suspense } from "react";
import { LabelSumber } from "@/components/data/label-sumber";
import { Waktu } from "@/components/data/waktu";
import { Legenda } from "@/components/grafik/kartu-grafik";
import { DaftarPrioritas } from "@/components/insight/daftar-prioritas";
import { RumusIndeks } from "@/components/insight/rumus-indeks";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilIndeksSemua } from "@/lib/data/insight";
import { KOMPONEN } from "@/lib/indeks";

export const metadata: Metadata = {
  title: "Prioritas inspeksi",
  description: "Urutan SPPG menurut Indeks Risiko beserta alasan yang mudah dipahami, untuk menentukan inspeksi lebih dulu.",
};

async function Isi() {
  const { daftar, dihitungPada } = await ambilIndeksSemua();
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Legenda butir={KOMPONEN.map((k) => ({ label: k.label, warna: k.warna }))} />
        {dihitungPada && (
          <p className="mb-3 text-xs text-muted-foreground">Dihitung <Waktu iso={dihitungPada} /></p>
        )}
      </div>
      <DaftarPrioritas daftar={daftar} />
    </>
  );
}

export default function HalamanPrioritas() {
  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center gap-2">
        <h1 className="text-3xl font-extrabold">Prioritas inspeksi</h1>
        <RumusIndeks />
        <LabelSumber jenis="laporan_warga_terverifikasi" className="ml-auto" />
      </header>
      <Suspense fallback={<Skeleton className="h-[40rem] rounded-3xl" />}>
        <Isi />
      </Suspense>
    </div>
  );
}
