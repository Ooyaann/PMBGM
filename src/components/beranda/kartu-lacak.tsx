import Link from "next/link";
import { ArrowUpRight, Users, Utensils } from "lucide-react";
import { AlurStatus } from "@/components/data/alur-status";
import { BadgeStatus } from "@/components/data/badge";
import { Waktu } from "@/components/data/waktu";
import type { StatusAlur } from "@/lib/label";

interface Peristiwa {
  waktu: string;
  peristiwa: string;
  ke: string | null;
  pelaku: string;
  catatan: string | null;
}

interface Props {
  kasus: {
    id: string | null;
    kode_kasus: string | null;
    judul: string | null;
    status: string | null;
    sppg_nama: string | null;
    instansi_nama?: string | null;
    jumlah_laporan: number | null;
  };
  timeline: Peristiwa[];
}

/** Kartu ringkas sorotan kasus terkini (Realtime Tracker) di hero landing page. */
export function KartuLacak({ kasus, timeline }: Props) {
  const terakhir = timeline.at(-1);

  return (
    <div className="relative group">
      {/* Ambient background glow lembut */}
      <div
        aria-hidden
        className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-primary/5 opacity-70 blur-2xl transition duration-500 group-hover:opacity-90"
      />

      <Link
        href={`/lacak/kasus/${kasus.id}`}
        className="block rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xl shadow-primary/5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl"
      >
        {/* Header: Indikator Terkini, Kode Kasus & Badge Status */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              Pembaruan Terkini
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {kasus.kode_kasus}
            </span>
          </div>
          {kasus.status && <BadgeStatus status={kasus.status as StatusAlur} />}
        </div>

        {/* Judul Kasus - Ringkas & Tegas */}
        <h3 className="mt-3.5 text-base sm:text-lg font-bold tracking-tight text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          {kasus.judul}
        </h3>

        {/* Metadata Minimal: Hanya SPPG dan Jumlah Laporan, tanpa kata berulang */}
        <div className="mt-2 flex items-center gap-2.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 font-medium text-foreground/85 truncate max-w-[240px]">
            <Utensils className="size-3.5 text-primary shrink-0" aria-hidden />
            {kasus.sppg_nama}
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1 shrink-0">
            <Users className="size-3.5 shrink-0" aria-hidden />
            {kasus.jumlah_laporan ?? 1} laporan
          </span>
        </div>

        {/* Stepper Alur Status */}
        {kasus.status && (
          <div className="mt-5 pt-1">
            <AlurStatus aktif={kasus.status as StatusAlur} />
          </div>
        )}

        {/* Catatan Tindak Lanjut Terakhir - Bersih & Elegan */}
        {terakhir && (
          <div className="mt-4 rounded-2xl border border-border/50 bg-muted/40 p-3 text-xs transition-colors group-hover:bg-muted/60">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-foreground/90 truncate max-w-[200px]">
                {terakhir.pelaku}
              </span>
              <Waktu iso={terakhir.waktu} className="text-[11px] text-muted-foreground shrink-0" />
            </div>
            {terakhir.catatan && (
              <p className="mt-1 line-clamp-2 text-muted-foreground leading-relaxed">
                {terakhir.catatan}
              </p>
            )}
          </div>
        )}

        {/* Footer Aksi - Minimal & Sleek */}
        <div className="mt-4 flex items-center justify-end pt-1">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline">
            Lihat Timeline Lengkap
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </span>
        </div>
      </Link>
    </div>
  );
}
