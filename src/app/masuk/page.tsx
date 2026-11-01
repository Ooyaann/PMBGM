import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PilihanMasuk } from "@/components/auth/pilihan-masuk";
import { PanelKiriMasuk } from "@/components/auth/panel-kiri-masuk";
import { TandaLogo } from "@/components/situs/logo";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilPengguna } from "@/lib/sesi";

export const metadata: Metadata = {
  title: "Masuk",
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
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Sisi Kiri: Branding, Headline, 3 Pills, & Isometric Graphic (Ala Referensi) */}
      <PanelKiriMasuk />

      {/* Sisi Kanan: Form Autentikasi Bersih */}
      <div className="relative flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 min-h-screen bg-card lg:bg-background">
        {/* Top Bar Sisi Kanan: Navigasi Kembali */}
        <div className="flex items-center justify-between w-full">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors py-1.5 px-3 rounded-xl hover:bg-muted/70 cursor-pointer"
          >
            <ArrowLeft className="size-3.5" aria-hidden /> Kembali ke Beranda
          </Link>

          {/* Mobile Branding (Hanya tampil pada layar < lg) */}
          <div className="flex items-center gap-2 lg:hidden">
            <TandaLogo className="size-6 shrink-0" />
            <span className="font-extrabold text-sm tracking-tight text-foreground font-heading">
              PMBGM
            </span>
          </div>
        </div>

        {/* Center Container Form */}
        <div className="my-auto w-full max-w-[420px] mx-auto py-8 space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-heading">
              Masuk
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Pilih peranmu, lalu masuk untuk mengakses sistem.
            </p>
          </div>

          <Suspense fallback={<Skeleton className="h-80 w-full rounded-2xl" />}>
            <IsiMasuk searchParams={props.searchParams} />
          </Suspense>
        </div>

        {/* Bottom Sisi Kanan */}
        <div className="pt-4 text-center lg:text-left text-[11px] text-muted-foreground/60 border-t border-border/40">
          <span>Inovasi Pengawasan MBG • MIA 2026</span>
        </div>
      </div>
    </div>
  );
}
