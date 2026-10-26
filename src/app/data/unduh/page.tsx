import type { Metadata } from "next";
import {
  Braces, FileSpreadsheet, FolderOpen, HeartPulse, KeyRound, Map, Radar, Scale, School, ShieldCheck, Utensils, Wallet,
} from "lucide-react";
import { LabelSumber } from "@/components/data/label-sumber";
import { SalinTeks } from "@/components/data-terbuka/salin-teks";
import { buttonVariants } from "@/components/ui/button";
import { DATASET, LISENSI, type Dataset } from "@/lib/data/dataset";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Unduh data & API",
  description: "Unduh data terbuka PMBGM dalam CSV atau JSON, atau akses lewat API publik tanpa kunci.",
};

const IKON: Record<Dataset["ikon"], typeof Map> = {
  map: Map, utensils: Utensils, school: School, wallet: Wallet, folder: FolderOpen, heart: HeartPulse, radar: Radar,
  scale: Scale,
};

const JAMINAN = [
  { ikon: KeyRound, teks: "Tanpa kunci API" },
  { ikon: ShieldCheck, teks: "Tanpa data pribadi" },
  { ikon: Braces, teks: `Lisensi ${LISENSI}` },
];

export default function HalamanUnduh() {
  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <h1 className="text-3xl font-extrabold">Unduh & API</h1>
        <ul className="flex flex-wrap gap-2">
          {JAMINAN.map((j) => (
            <li key={j.teks} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-card px-3 text-xs font-medium ring-1 ring-border">
              <j.ikon className="size-3.5 text-primary" aria-hidden /> {j.teks}
            </li>
          ))}
        </ul>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {DATASET.map((d) => {
          const Ikon = IKON[d.ikon];
          const url = `/api/v1/${d.kunci}`;
          return (
            <li key={d.kunci} className="flex flex-col gap-4 rounded-2xl border bg-card p-4">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Ikon className="size-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{d.nama}</p>
                  <p className="text-xs text-muted-foreground">{d.ringkas}</p>
                </div>
                <LabelSumber jenis={d.sumber} />
              </div>
              <div className="mt-auto flex items-center gap-2">
                <a href={`${url}?format=csv`} download className={cn(buttonVariants({ variant: "outline", size: "lg" }), "bg-card")}>
                  <FileSpreadsheet aria-hidden /> CSV
                </a>
                <a href={url} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "bg-card")}>
                  <Braces aria-hidden /> JSON
                </a>
                <span className="ml-auto flex min-w-0 items-center gap-1 rounded-lg bg-muted/60 pl-2">
                  <code className="truncate text-[11px] text-muted-foreground">{url}</code>
                  <SalinTeks teks={url} label="Salin URL API" />
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <section aria-labelledby="judul-api" className="rounded-3xl border bg-card p-5 sm:p-6">
        <h2 id="judul-api" className="flex items-center gap-2 font-bold"><Braces className="size-4 text-primary" aria-hidden /> API</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-[8rem_1fr]">
          <dt className="text-muted-foreground">Endpoint</dt>
          <dd><code className="rounded bg-muted px-1.5 py-0.5">GET /api/v1/{"{dataset}"}</code></dd>
          <dt className="text-muted-foreground">Format</dt>
          <dd><code className="rounded bg-muted px-1.5 py-0.5">?format=json</code> (bawaan) atau <code className="rounded bg-muted px-1.5 py-0.5">?format=csv</code></dd>
          <dt className="text-muted-foreground">Respons JSON</dt>
          <dd><code className="rounded bg-muted px-1.5 py-0.5">{"{ dataset, sumber, lisensi, jumlah, data[] }"}</code></dd>
        </dl>
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-foreground p-3 text-background">
          <code className="min-w-0 flex-1 overflow-x-auto text-xs whitespace-nowrap">curl &quot;/api/v1/indeks-risiko?format=json&quot;</code>
          <SalinTeks teks="/api/v1/indeks-risiko?format=json" label="Salin URL contoh" />
        </div>
      </section>
    </div>
  );
}
