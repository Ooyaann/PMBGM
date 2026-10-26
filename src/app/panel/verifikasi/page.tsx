import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowDownUp,
  CalendarClock,
  Clock,
  History,
  Inbox,
  Sparkles,
  Timer,
  type LucideIcon,
} from "lucide-react";
import { PenyegarRealtime } from "@/components/lacak/penyegar-realtime";
import { BarisAntrean } from "@/components/panel/baris";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilAntrean, type ButirAntrean } from "@/lib/data/panel";
import { PRIORITAS, type TingkatPrioritas } from "@/lib/label";
import { wajibPeran } from "@/lib/sesi";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Antrean verifikasi" };

const SARING: (TingkatPrioritas | "semua")[] = ["semua", "darurat", "tinggi", "sedang", "rendah"];

const PILIHAN_URUT: { kunci: string; label: string; ikon: LucideIcon }[] = [
  { kunci: "mendesak", label: "Prioritas", ikon: Sparkles },
  { kunci: "terbaru", label: "Terbaru", ikon: Clock },
  { kunci: "terlama", label: "Terlama", ikon: History },
  { kunci: "mepet", label: "Waktu Paling Mepet", ikon: Timer },
  { kunci: "panjang", label: "Waktu Masih Panjang", ikon: CalendarClock },
];

function buatUrl(p: string, u: string) {
  const params = new URLSearchParams();
  if (p !== "semua") params.set("prioritas", p);
  if (u !== "mendesak") params.set("urut", u);
  const q = params.toString();
  return q ? `/panel/verifikasi?${q}` : "/panel/verifikasi";
}

async function Daftar({ searchParams }: { searchParams: PageProps<"/panel/verifikasi">["searchParams"] }) {
  await wajibPeran("verifikator", "admin");
  const { prioritas, urut } = await searchParams;
  const pilihPrioritas = (SARING as string[]).includes(String(prioritas)) ? (prioritas as TingkatPrioritas | "semua") : "semua";
  const kunciValid = PILIHAN_URUT.map((u) => u.kunci);
  const pilihUrut = kunciValid.includes(String(urut)) ? String(urut) : "mendesak";

  const antrean = await ambilAntrean();
  let tampil = pilihPrioritas === "semua" ? antrean : antrean.filter((l) => l.prioritas === pilihPrioritas);

  // Sorting berdasarkan pilihan pengguna
  if (pilihUrut === "terbaru") {
    tampil = [...tampil].sort((a, b) => Date.parse(b.dibuatPada) - Date.parse(a.dibuatPada));
  } else if (pilihUrut === "terlama") {
    tampil = [...tampil].sort((a, b) => Date.parse(a.dibuatPada) - Date.parse(b.dibuatPada));
  } else if (pilihUrut === "mepet") {
    // Waktu paling mepet: sisa tenggat terkecil/paling mendekati sekarang di atas
    tampil = [...tampil].sort((a, b) => Date.parse(a.tenggat ?? "9999-12-31") - Date.parse(b.tenggat ?? "9999-12-31"));
  } else if (pilihUrut === "panjang") {
    // Waktu masih panjang: sisa tenggat paling jauh/lama di atas
    tampil = [...tampil].sort((a, b) => Date.parse(b.tenggat ?? "1970-01-01") - Date.parse(a.tenggat ?? "1970-01-01"));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2.5">
        {/* Baris Navigasi Filter: Prioritas (Kiri) dan Urutan (Kanan) */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Filter Tab Prioritas */}
          <nav aria-label="Saring prioritas" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <ul className="inline-flex min-w-max gap-1 rounded-xl bg-muted p-1">
              {SARING.map((s) => {
                const n = s === "semua" ? antrean.length : antrean.filter((l) => l.prioritas === s).length;
                return (
                  <li key={s}>
                    <Link
                      href={buatUrl(s, pilihUrut)}
                      scroll={false}
                      aria-current={pilihPrioritas === s ? "page" : undefined}
                      className={cn(
                        "inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs sm:text-sm font-semibold transition",
                        pilihPrioritas === s
                          ? "bg-card text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {s === "semua" ? "Semua" : PRIORITAS[s]}
                      <span className="angka text-xs text-muted-foreground">{n}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Filter Tab Urutan */}
          <nav aria-label="Urutan laporan" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <div className="inline-flex min-w-max items-center gap-1 rounded-xl border border-border/80 bg-card p-1 shadow-2xs">
              <span className="flex items-center gap-1 px-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <ArrowDownUp className="size-3 text-primary" /> Urut:
              </span>
              {PILIHAN_URUT.map((u) => {
                const IkonU = u.ikon;
                const aktif = pilihUrut === u.kunci;
                return (
                  <Link
                    key={u.kunci}
                    href={buatUrl(pilihPrioritas, u.kunci)}
                    scroll={false}
                    aria-current={aktif ? "page" : undefined}
                    className={cn(
                      "inline-flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition",
                      aktif
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <IkonU className="size-3.5 shrink-0" aria-hidden />
                    <span>{u.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      <ul className="divide-y overflow-hidden rounded-3xl border bg-card">
        {tampil.map((l) => <BarisAntrean key={l.id} l={l} />)}
        {!tampil.length && (
          <li className="flex flex-col items-center gap-2 p-10 text-center text-sm text-muted-foreground">
            <Inbox className="size-8" aria-hidden /> Antrean kosong untuk kriteria ini
          </li>
        )}
      </ul>
    </div>
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
