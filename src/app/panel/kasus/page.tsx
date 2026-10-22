import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { FolderOpen } from "lucide-react";
import { PenyegarRealtime } from "@/components/lacak/penyegar-realtime";
import { BarisKasus } from "@/components/panel/baris";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilDaftarKasus, type ButirKasus } from "@/lib/data/panel";
import { wajibPeran } from "@/lib/sesi";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Kasus" };

const SARING = {
  semua: { label: "Terbuka", cocok: (k: ButirKasus) => k.status !== "selesai" },
  diverifikasi: { label: "Perlu diteruskan", cocok: (k: ButirKasus) => k.status === "diverifikasi" },
  menunggu: { label: "Menunggu instansi", cocok: (k: ButirKasus) => k.status === "diteruskan" || k.status === "dibuka_ulang" },
  ditindaklanjuti: { label: "Ditangani", cocok: (k: ButirKasus) => k.status === "ditindaklanjuti" },
  selesai: { label: "Selesai 14 hari", cocok: (k: ButirKasus) => k.status === "selesai" },
} as const;
type Saring = keyof typeof SARING;

async function Daftar({ searchParams }: { searchParams: PageProps<"/panel/kasus">["searchParams"] }) {
  const p = await wajibPeran("verifikator", "instansi", "admin");
  const instansi = p.peran === "instansi";
  const { status } = await searchParams;
  const pilih: Saring = String(status) in SARING ? (status as Saring) : "semua";
  const semua = await ambilDaftarKasus({ instansiId: instansi ? p.instansiId : null });
  // Yang paling mendesak di atas: tidak ditanggapi, lalu batas waktu terdekat.
  const tampil = semua.filter(SARING[pilih].cocok).sort((a, b) =>
    Number(b.tidakDitanggapi) - Number(a.tidakDitanggapi) || Number(b.terlambat) - Number(a.terlambat)
    || (Date.parse(a.tenggat ?? "9999") - Date.parse(b.tenggat ?? "9999")));
  const kunci = (Object.keys(SARING) as Saring[]).filter((s) => !(instansi && s === "diverifikasi"));

  return (
    <>
      <nav aria-label="Saring status" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <ul className="inline-flex min-w-max gap-1 rounded-xl bg-muted p-1">
          {kunci.map((s) => (
            <li key={s}>
              <Link href={s === "semua" ? "/panel/kasus" : `/panel/kasus?status=${s}`} scroll={false}
                aria-current={pilih === s ? "page" : undefined}
                className={cn("inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition",
                  pilih === s ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
                {SARING[s].label}
                <span className="angka text-xs text-muted-foreground">{semua.filter(SARING[s].cocok).length}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <ul className="divide-y overflow-hidden rounded-3xl border bg-card">
        {tampil.map((k) => <BarisKasus key={k.id} k={k} />)}
        {!tampil.length && (
          <li className="flex flex-col items-center gap-2 p-10 text-center text-sm text-muted-foreground">
            <FolderOpen className="size-8" aria-hidden /> Tidak ada kasus
          </li>
        )}
      </ul>
    </>
  );
}

export default function HalamanKasusPanel({ searchParams }: PageProps<"/panel/kasus">) {
  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-3xl font-extrabold">Kasus</h1>
        <PenyegarRealtime kanal="panel-kasus" langganan={[{ tabel: "kasus" }]} />
      </header>
      <Suspense fallback={<Skeleton className="h-[32rem] rounded-3xl" />}>
        <Daftar searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
