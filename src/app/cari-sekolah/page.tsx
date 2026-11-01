import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { LabelSumber } from "@/components/data/label-sumber";
import { DaftarSekolahScroll } from "@/components/sekolah/daftar-sekolah-scroll";
import { Skeleton } from "@/components/ui/skeleton";
import { cariSekolah } from "@/lib/data/sekolah";

export const metadata: Metadata = {
  title: "Cari Sekolah",
  description: "Cari sekolah penerima MBG untuk melihat dapur SPPG yang melayaninya, skor risiko, dan status kasus.",
};

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

  return <DaftarSekolahScroll daftar={hasil} kueri={kueri} />;
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
            className="absolute top-1/2 right-1.5 -translate-y-1/2 flex size-8 items-center justify-center rounded-lg bg-secondary text-primary hover:bg-primary hover:text-primary-foreground transition cursor-pointer"
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
