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
  const { lanjut, mode } = await searchParams;
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
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-6 px-4 sm:px-6 bg-[radial-gradient(ellipse_75%_50%_at_50%_30%,oklch(0.42_0.095_168/0.07),transparent)]">
      <div className="mx-auto w-full max-w-md space-y-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden /> Beranda
        </Link>

        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-md shadow-primary/5 space-y-5">
          <div className="flex items-center gap-3">
            <TandaLogo className="size-9 shrink-0" />
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground">
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
