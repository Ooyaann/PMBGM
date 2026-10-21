"use client";

import { Timer, TimerOff } from "lucide-react";
import { useSekarang } from "@/components/data/waktu";
import { tanggalJam } from "@/lib/format";
import { cn } from "@/lib/utils";

function sisa(ms: number): string {
  const menit = Math.round(Math.abs(ms) / 60_000);
  if (menit < 60) return `${menit} mnt`;
  const jam = Math.floor(menit / 60);
  if (jam < 48) return `${jam} j ${menit % 60} mnt`;
  return `${Math.round(jam / 24)} hari`;
}

/**
 * Batas waktu tahap berjalan (LC-05): tepat waktu, hampir lewat (< 25% sisa), atau terlambat.
 * `mulai` dipakai untuk menghitung proporsi sisa waktu.
 */
export function HitungMundur({ tenggat, mulai, label = "Batas", className }: {
  tenggat: string;
  mulai?: string | null;
  label?: string;
  className?: string;
}) {
  const kini = useSekarang();
  const akhir = Date.parse(tenggat);
  const awal = mulai ? Date.parse(mulai) : null;

  if (kini === null) {
    return (
      <span className={cn("inline-flex h-7 items-center gap-1.5 rounded-full bg-muted px-2.5 text-xs font-semibold text-muted-foreground", className)}>
        <Timer className="size-3.5" aria-hidden /> {label} {tanggalJam(tenggat)}
      </span>
    );
  }

  const selisih = akhir - kini;
  const lewat = selisih < 0;
  const hampir = !lewat && awal !== null && selisih < (akhir - awal) * 0.25;

  return (
    <span
      title={`${label}: ${tanggalJam(tenggat)}`}
      className={cn(
        "angka inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold",
        lewat ? "bg-risiko-tinggi-lembut text-risiko-tinggi" : hampir ? "bg-risiko-sedang-lembut text-risiko-sedang" : "bg-secondary text-secondary-foreground",
        className,
      )}
    >
      {lewat ? <TimerOff className="size-3.5" aria-hidden /> : <Timer className="size-3.5" aria-hidden />}
      {lewat ? `Lewat ${sisa(selisih)}` : `Sisa ${sisa(selisih)}`}
    </span>
  );
}
