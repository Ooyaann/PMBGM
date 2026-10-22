import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PilihanMasuk } from "@/components/auth/pilihan-masuk";
import { TandaLogo } from "@/components/situs/logo";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilPengguna } from "@/lib/sesi";

export const metadata: Metadata = { title: "Masuk", robots: { index: false } };

/** Hanya izinkan tujuan internal agar tautan masuk tidak bisa dipakai untuk mengalihkan ke situs lain. */
function tujuanAman(nilai: unknown): string {
  return typeof nilai === "string" && nilai.startsWith("/") && !nilai.startsWith("//") ? nilai : "/";
}

async function IsiMasuk({ searchParams }: { searchParams: PageProps<"/masuk">["searchParams"] }) {
  const { lanjut } = await searchParams;
  const tujuan = tujuanAman(lanjut);
  if (await ambilPengguna()) redirect(tujuan);
  return <PilihanMasuk lanjut={tujuan} modeDemo={process.env.NEXT_PUBLIC_MODE_DEMO === "true"} />;
}

export default function HalamanMasuk(props: PageProps<"/masuk">) {
  return (
    <div className="kontainer flex justify-center py-12 sm:py-16">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden /> Kembali ke Beranda
          </Link>
        </div>
        <div className="mb-6 text-center">
          <TandaLogo className="mx-auto size-12" />
          <h1 className="mt-4 text-2xl font-extrabold">Masuk</h1>
          <p className="mt-1 text-sm text-muted-foreground">Tanpa kata sandi</p>
        </div>
        <div className="rounded-3xl border bg-card p-5 sm:p-6">
          <Suspense fallback={<Skeleton className="h-72 w-full rounded-2xl" />}>
            <IsiMasuk searchParams={props.searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
