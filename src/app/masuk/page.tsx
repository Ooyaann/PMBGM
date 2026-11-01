import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PilihanMasuk } from "@/components/auth/pilihan-masuk";
import { ShowcaseMasuk } from "@/components/auth/showcase-masuk";
import { TandaLogo } from "@/components/situs/logo";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilPengguna } from "@/lib/sesi";

export const metadata: Metadata = {
  title: "Masuk & Akses Simulasi",
  description: "Masuk ke sistem PMBGM atau pilih peran simulasi pengawasan MBG.",
  robots: { index: false },
};

function tujuanAman(nilai: unknown): string {
  return typeof nilai === "string" && nilai.startsWith("/") && !nilai.startsWith("//") ? nilai : "/";
}

async function IsiMasuk({ searchParams }: { searchParams: PageProps<"/masuk">["searchParams"] }) {
  const resolvedParams = searchParams ? await searchParams : {};
  const lanjut = typeof resolvedParams.lanjut === "string" ? resolvedParams.lanjut : undefined;
  const mode = typeof resolvedParams.mode === "string" ? resolvedParams.mode : undefined;
  const tujuan = tujuanAman(lanjut);

  if (await ambilPengguna()) redirect(tujuan);
  const modeAwal = mode === "daftar" ? "daftar" : mode === "masuk" ? "masuk" : undefined;

  return (
    <PilihanMasuk
      lanjut={tujuan}
      modeDemo={process.env.NEXT_PUBLIC_MODE_DEMO !== "false"}
      modeAwal={modeAwal}
    />
  );
}

export default function HalamanMasuk(props: PageProps<"/masuk">) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_80%_60%_at_50%_15%,oklch(0.44_0.10_168/0.08),transparent)]">
      <div className="mx-auto w-full max-w-6xl">
        {/* Tombol Navigasi Kembali */}
        <div className="mb-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground transition hover:text-foreground px-3 py-1.5 rounded-xl hover:bg-muted/70 cursor-pointer"
          >
            <ArrowLeft className="size-3.5" aria-hidden /> Kembali ke Beranda
          </Link>
        </div>

        {/* 2-Kolom Responsive Grid: Kiri Showcase, Kanan Kartu Auth */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Kolom Kiri: Showcase Informasi & Keunggulan (Desktop) */}
          <div className="lg:col-span-6">
            <ShowcaseMasuk />
          </div>

          {/* Kolom Kanan: Kartu Autentikasi / Simulasi Peran */}
          <div className="lg:col-span-6 w-full max-w-xl mx-auto">
            <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xl shadow-primary/5 space-y-6">
              {/* Header Kartu */}
              <div className="flex items-center gap-3.5 border-b border-border/60 pb-5">
                <TandaLogo className="size-10 shrink-0 drop-shadow-xs" />
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-heading">
                    Portal Masuk PMBGM
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Pilih peran simulasi atau masuk dengan email terdaftar
                  </p>
                </div>
              </div>

              {/* Isi Tab Interaktif */}
              <Suspense fallback={<Skeleton className="h-80 w-full rounded-2xl" />}>
                <IsiMasuk searchParams={props.searchParams} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
