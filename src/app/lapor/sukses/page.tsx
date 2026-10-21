import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ClipboardList, School, TriangleAlert, UserRound } from "lucide-react";
import { AlurStatus } from "@/components/data/alur-status";
import { SalinTiket } from "@/components/lapor/salin-tiket";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilAturanSla } from "@/lib/data/publik";
import { batasJam } from "@/lib/format";
import { KATEGORI, type Kategori, type StatusAlur } from "@/lib/label";
import { buatKlienPublik } from "@/lib/supabase/publik";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Laporan terkirim", robots: { index: false } };

async function IsiSukses({ searchParams }: { searchParams: PageProps<"/lapor/sukses">["searchParams"] }) {
  const { tiket, bukti_gagal: buktiGagal } = await searchParams;
  const kode = typeof tiket === "string" && /^MBG-[A-Z0-9]{6}$/.test(tiket) ? tiket : null;
  if (!kode) notFound();

  // Status dibaca lewat RPC publik yang sama dengan halaman Cek Status (tanpa data pribadi).
  const [{ data }, sla] = await Promise.all([
    buatKlienPublik().rpc("cek_status_tiket", { p_kode: kode }),
    ambilAturanSla(),
  ]);
  const laporan = data as { kategori: Kategori; status: StatusAlur; sekolah: string } | null;
  if (!laporan) notFound();
  const batas = sla[laporan.kategori] ?? {};

  return (
    <div className="mx-auto max-w-lg text-center">
      <CheckCircle2 className="mx-auto size-14 text-risiko-rendah" aria-hidden />
      <h1 className="mt-4 text-3xl font-extrabold">Terkirim</h1>
      <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
        <School className="size-4" aria-hidden /> {KATEGORI[laporan.kategori].label} · {laporan.sekolah}
      </p>

      <div className="mt-8 rounded-3xl border-2 border-dashed border-primary/40 bg-card p-6">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Kode tiket</p>
        <p className="mt-1 font-mono text-4xl font-bold tracking-widest text-primary">{kode}</p>
        <div className="mt-4 flex justify-center"><SalinTiket kode={kode} /></div>
      </div>

      <div className="mt-6 rounded-3xl border bg-card p-5">
        <AlurStatus aktif={laporan.status} sla={{
          diterima: batasJam(batas.diterima),
          diteruskan: batasJam(batas.diteruskan),
          ditindaklanjuti: batasJam(batas.ditindaklanjuti),
        }} />
      </div>

      {buktiGagal && (
        <p role="alert" className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-risiko-sedang-lembut p-3 text-sm">
          <TriangleAlert className="size-4 text-risiko-sedang" aria-hidden /> {buktiGagal} foto gagal terunggah · laporan tetap tersimpan
        </p>
      )}

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link href={`/lacak?tiket=${kode}`} className={buttonVariants({ size: "xl" })}>
          <ClipboardList aria-hidden /> Pantau status
        </Link>
        <Link href="/akun" className={cn(buttonVariants({ size: "xl", variant: "outline" }), "bg-card")}>
          <UserRound aria-hidden /> Laporan saya
        </Link>
      </div>
    </div>
  );
}

export default function HalamanSukses(props: PageProps<"/lapor/sukses">) {
  return (
    <div className="kontainer py-12 sm:py-16">
      <Suspense fallback={<Skeleton className="mx-auto h-96 max-w-lg rounded-3xl" />}>
        <IsiSukses searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
