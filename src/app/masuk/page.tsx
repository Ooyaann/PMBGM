import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PilihanMasuk } from "@/components/auth/pilihan-masuk";
import { TandaLogo } from "@/components/situs/logo";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilPengguna } from "@/lib/sesi";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke sistem PMBGM.",
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
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-8 px-4 sm:px-6 bg-[radial-gradient(ellipse_75%_50%_at_50%_25%,oklch(0.44_0.10_168/0.06),transparent)]">
      <div className="mx-auto w-full max-w-[460px] space-y-3.5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden /> Beranda
        </Link>

        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-lg shadow-primary/5 space-y-5">
          <div className="flex items-center gap-3">
            <TandaLogo className="size-9 shrink-0 drop-shadow-xs" />
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-foreground font-heading">
                Masuk PMBGM
              </h1>
              <p className="text-xs text-muted-foreground">
                Pilih peran simulasi atau masuk dengan email
              </p>
            </div>
          </div>

          <Suspense fallback={<Skeleton className="h-72 w-full rounded-2xl" />}>
            <IsiMasuk searchParams={props.searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
