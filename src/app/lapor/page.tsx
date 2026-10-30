import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Lock, ShieldAlert, Sparkles, UserPlus } from "lucide-react";
import { FormLapor } from "@/components/lapor/form-lapor";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilAturanSla } from "@/lib/data/publik";
import { ambilSekolahPilihan } from "@/lib/data/sekolah";
import { ambilPengguna } from "@/lib/sesi";
import { cn } from "@/lib/utils";

export const maxDuration = 120;

export const metadata: Metadata = {
  title: "Lapor Masalah MBG",
  description: "Formulir resmi pelaporan masalah Makan Bergizi Gratis di sekolah. Identitas terlindungi, wajib bukti autentik, dan diteruskan berbatas waktu.",
};

const POLA_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function BagianForm({ searchParams }: { searchParams: PageProps<"/lapor">["searchParams"] }) {
  const { sekolah } = await searchParams;
  const pengguna = await ambilPengguna();

  // 1. Auth Guard (Poin 1 Revisi Dosen): Wajib login sebelum mengakses pengisian form lapor
  if (!pengguna) {
    const urlLanjut = `/lapor${typeof sekolah === "string" ? `?sekolah=${sekolah}` : ""}`;
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-primary/20 bg-card p-6 sm:p-10 shadow-lg text-center space-y-6">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Lock className="size-7" aria-hidden />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-tight">Wajib Masuk Sebelum Melapor</h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Demi menjaga integritas aduan dan mencegah laporan palsu/fiktif yang merugikan pihak sekolah atau dapur,
            setiap pelapor diwajibkan masuk ke akun terdaftar.
          </p>
        </div>

        <div className="rounded-2xl border bg-muted/30 p-4 text-xs text-muted-foreground text-left space-y-2">
          <p className="font-bold text-foreground flex items-center gap-1.5">
            <ShieldAlert className="size-4 text-primary" /> Jaminan Perlindungan Identitas:
          </p>
          <p>
            Meskipun Anda wajib masuk, Anda tetap dapat memilih opsi <strong>Identitas Rahasia</strong> atau <strong>Anonim</strong> di akhir pengisian formulir. Data pribadi Anda tidak akan pernah dibagikan ke pihak dapur tanpa izin.
          </p>
        </div>

        <div className="pt-2 max-w-sm mx-auto space-y-3">
          <Link
            href={`/masuk?lanjut=${encodeURIComponent(urlLanjut)}`}
            className={cn(
              buttonVariants({ size: "xl" }),
              "w-full rounded-2xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground h-12 shadow-md shadow-primary/15 text-base flex items-center justify-center gap-2"
            )}
          >
            Masuk ke Akun Anda
          </Link>
          <Link
            href={`/masuk?mode=daftar&lanjut=${encodeURIComponent(urlLanjut)}`}
            className={cn(
              buttonVariants({ size: "xl", variant: "outline" }),
              "w-full rounded-2xl font-bold bg-card border-border/80 h-12 text-base flex items-center justify-center gap-2 hover:bg-muted"
            )}
          >
            Daftar Akun Pelapor Baru
          </Link>
        </div>
      </div>
    );
  }

  // 2. Otomatisasi Input Sekolah (Poin 1.3 Revisi Dosen)
  // Utamakan sekolah dari query string, jika tidak ada fallback ke sekolahId dari profil akun pengguna
  const idSekolah =
    typeof sekolah === "string" && POLA_UUID.test(sekolah)
      ? sekolah
      : pengguna.sekolahId && POLA_UUID.test(pengguna.sekolahId)
      ? pengguna.sekolahId
      : null;

  const [sla, sekolahAwal] = await Promise.all([
    ambilAturanSla(),
    idSekolah ? ambilSekolahPilihan(idSekolah) : null,
  ]);

  return (
    <FormLapor
      pengguna={{ id: pengguna.id, nama: pengguna.nama }}
      sla={sla}
      sekolahAwal={sekolahAwal}
    />
  );
}

export default function HalamanLapor({ searchParams }: PageProps<"/lapor">) {
  return (
    <div className="kontainer py-8 sm:py-12 max-w-5xl">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <Sparkles className="size-3.5" aria-hidden /> Layanan Aduan Partisipatif MBG
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">Formulir Laporan Masalah</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sampaikan kejadian secara objektif disertai foto bukti untuk ditindaklanjuti secara resmi.
          </p>
        </div>
        <Link
          href="/panduan?buka=cara-melapor"
          className="inline-flex h-10 items-center gap-1.5 rounded-xl border bg-card px-4 text-xs sm:text-sm font-semibold hover:bg-muted transition"
        >
          <BookOpen className="size-4 text-primary" aria-hidden /> Panduan Melapor
        </Link>
      </header>

      <Suspense fallback={<Skeleton className="h-[32rem] w-full rounded-3xl" />}>
        <BagianForm searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
