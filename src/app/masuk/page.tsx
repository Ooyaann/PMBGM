import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { PilihanMasuk } from "@/components/auth/pilihan-masuk";
import { TandaLogo } from "@/components/situs/logo";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilPengguna } from "@/lib/sesi";

export const metadata: Metadata = {
  title: "Masuk ke Sistem",
  description: "Akses portal pengawasan partisipatif MBG untuk warga, sekolah, dan instansi penanggung jawab.",
  robots: { index: false },
};

function tujuanAman(nilai: unknown): string {
  return typeof nilai === "string" && nilai.startsWith("/") && !nilai.startsWith("//") ? nilai : "/";
}

async function IsiMasuk({ searchParams }: { searchParams: PageProps<"/masuk">["searchParams"] }) {
  const { lanjut } = await searchParams;
  const tujuan = tujuanAman(lanjut);
  if (await ambilPengguna()) redirect(tujuan);
  return <PilihanMasuk lanjut={tujuan} modeDemo={process.env.NEXT_PUBLIC_MODE_DEMO !== "false"} />;
}

export default function HalamanMasuk(props: PageProps<"/masuk">) {
  return (
    <div className="kontainer flex min-h-[calc(100vh-12rem)] items-center justify-center py-10 sm:py-14">
      <div className="w-full max-w-lg">
        <div className="mb-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden /> Kembali ke Beranda
          </Link>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-xl shadow-primary/5">
          {/* Header Kartu Masuk */}
          <div className="border-b bg-muted/30 px-6 py-6 text-center sm:px-8">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <TandaLogo className="size-8" />
            </div>
            <h1 className="mt-3.5 text-2xl font-extrabold tracking-tight">Portal Pengawasan MBG</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Masuk untuk memantau aduan, menindaklanjuti kasus, atau menguji alur sistem.
            </p>
          </div>

          {/* Form / Tab Masuk */}
          <div className="p-6 sm:p-8">
            <Suspense fallback={<Skeleton className="h-72 w-full rounded-2xl" />}>
              <IsiMasuk searchParams={props.searchParams} />
            </Suspense>
          </div>

          {/* Footer Kartu Masuk */}
          <div className="border-t bg-muted/20 px-6 py-3.5 text-center text-xs text-muted-foreground sm:px-8">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <ShieldCheck className="size-3.5 text-primary" aria-hidden /> Akses terenkripsi & data pelapor dilindungi
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
