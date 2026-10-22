import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Inbox } from "lucide-react";
import { PenyegarRealtime } from "@/components/lacak/penyegar-realtime";
import { BarisAntrean } from "@/components/panel/baris";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilAntrean } from "@/lib/data/panel";
import { PRIORITAS, type TingkatPrioritas } from "@/lib/label";
import { wajibPeran } from "@/lib/sesi";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Antrean verifikasi" };

const SARING: (TingkatPrioritas | "semua")[] = ["semua", "darurat", "tinggi", "sedang", "rendah"];

async function Daftar({ searchParams }: { searchParams: PageProps<"/panel/verifikasi">["searchParams"] }) {
  await wajibPeran("verifikator", "admin");
  const { prioritas } = await searchParams;
  const pilih = (SARING as string[]).includes(String(prioritas)) ? (prioritas as TingkatPrioritas | "semua") : "semua";
  const antrean = await ambilAntrean();
  const tampil = pilih === "semua" ? antrean : antrean.filter((l) => l.prioritas === pilih);

  return (
    <>
      <nav aria-label="Saring prioritas" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <ul className="inline-flex min-w-max gap-1 rounded-xl bg-muted p-1">
          {SARING.map((s) => {
            const n = s === "semua" ? antrean.length : antrean.filter((l) => l.prioritas === s).length;
            return (
              <li key={s}>
                <Link href={s === "semua" ? "/panel/verifikasi" : `/panel/verifikasi?prioritas=${s}`} scroll={false}
                  aria-current={pilih === s ? "page" : undefined}
                  className={cn("inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition",
                    pilih === s ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
                  {s === "semua" ? "Semua" : PRIORITAS[s]}
                  <span className="angka text-xs text-muted-foreground">{n}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <ul className="divide-y overflow-hidden rounded-3xl border bg-card">
        {tampil.map((l) => <BarisAntrean key={l.id} l={l} />)}
        {!tampil.length && (
          <li className="flex flex-col items-center gap-2 p-10 text-center text-sm text-muted-foreground">
            <Inbox className="size-8" aria-hidden /> Antrean kosong
          </li>
        )}
      </ul>
    </>
  );
}

export default function HalamanAntrean({ searchParams }: PageProps<"/panel/verifikasi">) {
  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-3xl font-extrabold">Antrean verifikasi</h1>
        <PenyegarRealtime kanal="panel-antrean" langganan={[{ tabel: "laporan" }]} />
      </header>
      <Suspense fallback={<Skeleton className="h-[32rem] rounded-3xl" />}>
        <Daftar searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
