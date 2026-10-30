import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Lock } from "lucide-react";
import { FormLapor } from "@/components/lapor/form-lapor";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilAturanSla } from "@/lib/data/publik";
import { ambilSekolahPilihan } from "@/lib/data/sekolah";
import { ambilPengguna } from "@/lib/sesi";
import { cn } from "@/lib/utils";

export const maxDuration = 120;

export const metadata: Metadata = {
  title: "Lapor Masalah",
  description: "Formulir pelaporan masalah Makan Bergizi Gratis disertai foto bukti.",
};

async function BagianForm({ searchParams }: { searchParams: PageProps<"/lapor">["searchParams"] }) {
  const params = await searchParams;
  const paramSekolah =
    typeof params?.sekolah === "string" && params.sekolah.trim()
      ? params.sekolah.trim()
      : typeof params?.sekolahId === "string" && params.sekolahId.trim()
      ? params.sekolahId.trim()
      : null;

  const pengguna = await ambilPengguna();

  if (!pengguna) {
    const urlLanjut = `/lapor${paramSekolah ? `?sekolah=${encodeURIComponent(paramSekolah)}` : ""}`;
    return (
      <div className="mx-auto max-w-md rounded-3xl border bg-card p-6 sm:p-8 text-center space-y-5">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Lock className="size-6" aria-hidden />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold tracking-tight">Masuk untuk Melapor</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Identitas Anda tetap dapat disamarkan (Rahasia atau Anonim).
          </p>
        </div>

        <div className="space-y-2">
          <Link
            href={`/masuk?lanjut=${encodeURIComponent(urlLanjut)}`}
            className={cn(
              buttonVariants({ size: "default" }),
              "w-full rounded-xl font-bold h-11 text-sm flex items-center justify-center"
            )}
          >
            Masuk
          </Link>
          <Link
            href={`/masuk?mode=daftar&lanjut=${encodeURIComponent(urlLanjut)}`}
            className={cn(
              buttonVariants({ size: "default", variant: "outline" }),
              "w-full rounded-xl font-semibold bg-card h-11 text-sm flex items-center justify-center"
            )}
          >
            Daftar Akun Baru
          </Link>
        </div>
      </div>
    );
  }

  const kunciSekolah = paramSekolah ?? pengguna.sekolahId ?? null;

  const [sla, sekolahAwal] = await Promise.all([
    ambilAturanSla(),
    kunciSekolah ? ambilSekolahPilihan(kunciSekolah) : null,
  ]);

  return (
    <FormLapor
      pengguna={{ id: pengguna.id, nama: pengguna.nama }}
      sla={sla}
      sekolahAwal={sekolahAwal}
      langsungKeMasalah={Boolean(paramSekolah && sekolahAwal)}
    />
  );
}

export default function HalamanLapor({ searchParams }: PageProps<"/lapor">) {
  return (
    <div className="kontainer py-8 sm:py-10 max-w-5xl">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Lapor Masalah</h1>
        <Link
          href="/panduan?buka=cara-melapor"
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border bg-card px-3.5 text-xs font-semibold hover:bg-muted transition"
        >
          <BookOpen className="size-3.5 text-primary" aria-hidden /> Panduan
        </Link>
      </header>

      <Suspense fallback={<Skeleton className="h-[32rem] w-full rounded-3xl" />}>
        <BagianForm searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
