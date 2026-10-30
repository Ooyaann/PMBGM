import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, FolderOpen, Megaphone, School, Search, ShieldCheck, ShieldOff, Users, Utensils } from "lucide-react";
import { BadgeRisiko } from "@/components/data/badge";
import { LabelSumber } from "@/components/data/label-sumber";
import { InfoMetrik } from "@/components/ui/info-metrik";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cariSekolah } from "@/lib/data/sekolah";
import { angka } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Cari Sekolah",
  description: "Cari sekolah penerima MBG untuk melihat dapur SPPG yang melayaninya, skor risiko, dan status kasus.",
};

const JENJANG: Record<string, string> = { paud: "PAUD/TK", sd: "SD", smp: "SMP", sma: "SMA", smk: "SMK", slb: "SLB" };

async function Hasil({ searchParams }: { searchParams: PageProps<"/cari-sekolah">["searchParams"] }) {
  const { q } = await searchParams;
  const kueri = typeof q === "string" ? q.slice(0, 80) : "";
  const hasil = await cariSekolah(kueri);
  if (!hasil.length) {
    return (
      <div className="rounded-3xl border bg-card p-10 text-center text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">Sekolah “{kueri}” tidak ditemukan</p>
        <p className="mt-1 text-xs">Coba gunakan kata kunci nama sekolah, kecamatan, atau NPSN lain.</p>
        <Link href="/cari-sekolah" className="mt-3 inline-block font-semibold text-primary hover:underline">
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
            <>Menampilkan <strong className="angka text-foreground">{hasil.length}</strong> sekolah untuk “<strong className="text-foreground">{kueri}</strong>”</>
          ) : (
            <>Menampilkan <strong className="angka text-foreground">{hasil.length}</strong> sekolah terdaftar</>
          )}
        </p>
        {kueri && (
          <Link href="/cari-sekolah" className="text-xs font-semibold text-primary hover:underline">
            Reset pencarian
          </Link>
        )}
      </div>
      <ul className="grid gap-3.5 md:grid-cols-2" aria-live="polite">
        {hasil.map((s) => (
          <li key={s.id} className="flex flex-col gap-3.5 rounded-3xl border bg-card p-5 transition hover:border-primary/40 hover:shadow-xs">
            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <School className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-foreground leading-snug">{s.nama}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground/80">{JENJANG[s.jenjang] ?? s.jenjang}</span>
                  <span>·</span>
                  <span>{s.kecamatan}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1"><Users className="size-3.5" aria-hidden />{angka(s.siswa)} siswa</span>
                  {s.npsn && <span className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded">NPSN {s.npsn}</span>}
                </p>
              </div>
            </div>

            {s.sppg ? (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border/60 bg-muted/35 p-3">
                <Link href={`/data/sppg/${s.sppg.id}`} className="flex items-center gap-2 min-w-0 flex-1 truncate hover:text-primary transition-colors">
                  <Utensils className="size-4 text-primary shrink-0" aria-hidden />
                  <span className="truncate text-sm font-semibold">{s.sppg.nama}</span>
                </Link>
                <div className="flex items-center gap-1.5 shrink-0">
                  <InfoMetrik jenis="slhs" side="top" className="shrink-0">
                    <span className={cn(
                      "inline-flex h-6 shrink-0 whitespace-nowrap items-center gap-1 text-xs font-semibold px-2 rounded-full",
                      s.sppg.slhs === "berlaku"
                        ? "bg-risiko-rendah-lembut text-risiko-rendah"
                        : "bg-risiko-sedang-lembut text-risiko-sedang"
                    )}>
                      {s.sppg.slhs === "berlaku" ? (
                        <><ShieldCheck className="size-3.5 shrink-0" /> SLHS Aktif</>
                      ) : (
                        <><ShieldOff className="size-3.5 shrink-0" /> Tanpa SLHS</>
                      )}
                    </span>
                  </InfoMetrik>
                  <BadgeRisiko skor={s.sppg.indeks} className="shrink-0" />
                </div>
              </div>
            ) : (
              <p className="rounded-2xl bg-muted/40 p-3 text-xs text-muted-foreground">Belum terhubung ke dapur SPPG</p>
            )}

            <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
              <span className={cn(
                "inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold",
                s.kasusTerbuka ? "bg-risiko-sedang-lembut text-risiko-sedang" : "bg-muted text-muted-foreground"
              )}>
                <FolderOpen className="size-3.5" aria-hidden /> {s.kasusTerbuka} berjalan · {s.kasusTotal} total
              </span>
              <Link href={`/lapor?sekolah=${s.id}`} className={cn(buttonVariants({ size: "default" }), "rounded-xl font-bold h-9 px-3.5 text-xs")}>
                <Megaphone className="size-3.5" aria-hidden /> Lapor
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
    <div className="kontainer space-y-6 py-8 sm:py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Cari Sekolah</h1>
          <LabelSumber jenis="simulasi" />
        </div>
        <form role="search" action="/cari-sekolah" className="relative w-full sm:max-w-md">
          <label htmlFor="q" className="sr-only">Nama sekolah, kecamatan, atau NPSN</label>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Suspense fallback={<input id="q" name="q" type="search" placeholder="Cari sekolah, kecamatan, SPPG, atau NPSN..." className="h-11 w-full rounded-xl border bg-card pr-11 pl-10 text-sm shadow-2xs" />}>
            <InputCari searchParams={searchParams} />
          </Suspense>
          <button
            type="submit"
            className="absolute top-1/2 right-1.5 -translate-y-1/2 flex size-8 items-center justify-center rounded-lg bg-secondary text-primary hover:bg-primary hover:text-primary-foreground transition"
            aria-label="Cari sekolah"
          >
            <ArrowRight className="size-4" />
          </button>
        </form>
      </header>
      <Suspense fallback={<div className="grid gap-3.5 md:grid-cols-2">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-48 rounded-3xl" />)}</div>}>
        <Hasil searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function InputCari({ searchParams }: { searchParams: PageProps<"/cari-sekolah">["searchParams"] }) {
  const { q } = await searchParams;
  return (
    <input
      id="q"
      name="q"
      type="search"
      defaultValue={typeof q === "string" ? q : ""}
      placeholder="Cari sekolah, kecamatan, SPPG, atau NPSN..."
      autoComplete="off"
      className="h-11 w-full rounded-xl border bg-card pr-11 pl-10 text-sm shadow-2xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
    />
  );
}
