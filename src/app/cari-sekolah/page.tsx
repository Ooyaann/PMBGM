import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { FolderOpen, Megaphone, School, Search, ShieldCheck, ShieldOff, Users, Utensils } from "lucide-react";
import { BadgeRisiko } from "@/components/data/badge";
import { LabelSumber } from "@/components/data/label-sumber";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cariSekolah } from "@/lib/data/sekolah";
import { angka } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Cari Sekolah",
  description: "Cari sekolah anak Anda untuk melihat dapur SPPG yang melayaninya, skor risikonya, dan kasus yang sedang ditangani.",
};

const JENJANG: Record<string, string> = { paud: "PAUD/TK", sd: "SD", smp: "SMP", sma: "SMA", smk: "SMK", slb: "SLB" };

async function Hasil({ searchParams }: { searchParams: PageProps<"/cari-sekolah">["searchParams"] }) {
  const { q } = await searchParams;
  const kueri = typeof q === "string" ? q.slice(0, 80) : "";
  const hasil = await cariSekolah(kueri);
  if (!hasil.length) {
    return (
      <div className="rounded-3xl border bg-card p-10 text-center text-sm text-muted-foreground">
        <p>Sekolah “{kueri}” tidak ditemukan</p>
        <Link href="/cari-sekolah" className="mt-2 inline-block font-semibold text-primary hover:underline">
          Tampilkan semua sekolah
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-sm text-muted-foreground">
        <p>
          {kueri ? (
            <>Menampilkan <strong className="text-foreground">{hasil.length}</strong> sekolah untuk “<strong className="text-foreground">{kueri}</strong>”</>
          ) : (
            <>Menampilkan seluruh <strong className="text-foreground">{hasil.length}</strong> sekolah terdaftar di Kota Semarang</>
          )}
        </p>
        {kueri && (
          <Link href="/cari-sekolah" className="text-xs font-semibold text-primary hover:underline">
            Tampilkan semua
          </Link>
        )}
      </div>
      <ul className="grid gap-3 md:grid-cols-2" aria-live="polite">
      {hasil.map((s) => (
        <li key={s.id} className="flex flex-col gap-4 rounded-3xl border bg-card p-5">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary"><School className="size-5" aria-hidden /></span>
            <div className="min-w-0">
              <p className="font-bold">{s.nama}</p>
              <p className="flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                <span>{JENJANG[s.jenjang] ?? s.jenjang}</span>
                <span>{s.kecamatan}</span>
                <span className="flex items-center gap-1"><Users className="size-3.5" aria-hidden />{angka(s.siswa)}</span>
                {s.npsn && <span className="font-mono">NPSN {s.npsn}</span>}
              </p>
            </div>
          </div>
          {s.sppg ? (
            <Link href={`/data/sppg/${s.sppg.id}`} className="flex flex-wrap items-center gap-2 rounded-2xl bg-muted/50 p-3 hover:bg-muted">
              <Utensils className="size-4 text-muted-foreground" aria-hidden />
              <span className="min-w-0 flex-1 truncate text-sm font-semibold">{s.sppg.nama.replace("SPPG Contoh ", "SPPG ")}</span>
              {s.sppg.slhs === "berlaku"
                ? <ShieldCheck className="size-4 text-risiko-rendah" aria-label="SLHS berlaku" />
                : <ShieldOff className="size-4 text-risiko-sedang" aria-label="SLHS belum berlaku" />}
              <BadgeRisiko skor={s.sppg.indeks} />
            </Link>
          ) : <p className="rounded-2xl bg-muted/50 p-3 text-sm text-muted-foreground">Belum terhubung ke SPPG</p>}
          <div className="mt-auto flex flex-wrap items-center gap-2">
            <span className={cn("inline-flex h-7 items-center gap-1 rounded-full px-2.5 text-xs font-semibold",
              s.kasusTerbuka ? "bg-risiko-sedang-lembut text-risiko-sedang" : "bg-muted text-muted-foreground")}>
              <FolderOpen className="size-3.5" aria-hidden /> {s.kasusTerbuka} kasus berjalan · {s.kasusTotal} total
            </span>
            <Link href={`/lapor?sekolah=${s.id}`} className={cn(buttonVariants({ size: "lg" }), "ml-auto")}>
              <Megaphone aria-hidden /> Lapor
            </Link>
          </div>
        </li>
      ))}
    </ul>
    </div>
  );
}

export default function HalamanCariSekolah({ searchParams }: PageProps<"/cari-sekolah">) {
  return (
    <div className="kontainer space-y-6 py-8 sm:py-12">
      <header className="mx-auto max-w-2xl space-y-4 text-center">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Cari sekolah</h1>
        <form role="search" action="/cari-sekolah" className="relative">
          <label htmlFor="q" className="sr-only">Nama sekolah atau NPSN</label>
          <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Suspense fallback={<input id="q" name="q" type="search" placeholder="Nama sekolah atau NPSN" className="h-14 w-full rounded-2xl border bg-card pr-4 pl-12 text-base shadow-sm" />}>
            <InputCari searchParams={searchParams} />
          </Suspense>
        </form>
        <div className="flex justify-center"><LabelSumber jenis="simulasi" /></div>
      </header>
      <Suspense fallback={<div className="grid gap-3 md:grid-cols-2">{[0, 1].map((i) => <Skeleton key={i} className="h-56 rounded-3xl" />)}</div>}>
        <Hasil searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function InputCari({ searchParams }: { searchParams: PageProps<"/cari-sekolah">["searchParams"] }) {
  const { q } = await searchParams;
  return (
    <input id="q" name="q" type="search" defaultValue={typeof q === "string" ? q : ""} placeholder="Nama sekolah atau NPSN" autoComplete="off"
      className="h-14 w-full rounded-2xl border bg-card pr-4 pl-12 text-base shadow-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50" />
  );
}
