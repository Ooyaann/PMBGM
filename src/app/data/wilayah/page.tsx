import type { Metadata } from "next";
import Link from "next/link";
import { Layers, Users } from "lucide-react";
import { LabelSumber } from "@/components/data/label-sumber";
import { Meter, Remah } from "@/components/data-terbuka/remah";
import { ambilDashboardProvinsi } from "@/lib/data/data-terbuka";
import { angka, persen } from "@/lib/format";

export const metadata: Metadata = {
  title: "Data per wilayah",
  description: "Anggaran, penerima, dan kasus MBG untuk 35 kabupaten/kota di Jawa Tengah.",
};

const KOTA_DETAIL = "33.74";

export default async function HalamanWilayah() {
  const { kabkota } = await ambilDashboardProvinsi();
  const kelompok = [
    { judul: "Kota", isi: kabkota.filter((k) => k.nama.startsWith("Kota")) },
    { judul: "Kabupaten", isi: kabkota.filter((k) => k.nama.startsWith("Kabupaten")) },
  ];

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <Remah butir={[{ label: "Jawa Tengah" }]} />
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-extrabold">Wilayah</h1>
          <LabelSumber jenis="simulasi" />
        </div>
      </header>

      {kelompok.map((g) => (
        <section key={g.judul} aria-labelledby={`judul-${g.judul}`} className="space-y-3">
          <h2 id={`judul-${g.judul}`} className="text-sm font-semibold text-muted-foreground">{g.judul} · {g.isi.length}</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {g.isi.map((k) => (
              <li key={k.id}>
                <Link href={`/data/wilayah/${k.id}`}
                  className="flex h-full flex-col gap-3 rounded-2xl border bg-card p-4 transition hover:border-primary/40 hover:shadow-md">
                  <span className="flex items-start justify-between gap-2">
                    <span className="font-semibold leading-tight">{k.nama.replace(/^(Kabupaten|Kota) /, "")}</span>
                    {k.id === KOTA_DETAIL && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground"
                        title="Rincian sampai kecamatan dan SPPG">
                        <Layers className="size-3" aria-hidden /> Detail
                      </span>
                    )}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="size-3.5" aria-hidden /> {angka(k.penerima)} penerima
                  </span>
                  <span className="mt-auto flex items-center gap-2 text-xs">
                    <Meter nilai={k.persen} className="flex-1" />
                    <span className="angka w-12 text-right font-medium">{persen(k.persen)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
