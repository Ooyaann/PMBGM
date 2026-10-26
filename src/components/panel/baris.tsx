import Link from "next/link";
import { ChevronRight, Files, Image as IkonFoto, Lock, ShieldCheck, Users, UserRound, EyeOff } from "lucide-react";
import { BadgePrioritas, BadgeSla, BadgeStatus } from "@/components/data/badge";
import { IKON_KATEGORI } from "@/components/data/ikon-kategori";
import { HitungMundur } from "@/components/lacak/hitung-mundur";
import type { ButirAntrean, ButirKasus } from "@/lib/data/panel";
import { angka } from "@/lib/format";
import { KATEGORI, type ModeIdentitas } from "@/lib/label";
import { cn } from "@/lib/utils";

export const IKON_MODE: Record<ModeIdentitas, typeof Lock> = { rahasia: Lock, publik: UserRound, anonim: EyeOff };

/** Skor kredibilitas 0–100 sebagai cincin kecil: cepat dipindai di antrean. */
export function Kredibilitas({ skor, besar = false }: { skor: number; besar?: boolean }) {
  const r = besar ? 22 : 15;
  const k = 2 * Math.PI * r;
  const warna = skor >= 70 ? "var(--risiko-rendah)" : skor >= 45 ? "var(--risiko-sedang)" : "var(--risiko-tinggi)";
  const ukuran = (r + 4) * 2;
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" title={`Kredibilitas ${skor}/100`}
      role="img" aria-label={`Kredibilitas ${skor} dari 100`} style={{ width: ukuran, height: ukuran }}>
      <svg viewBox={`0 0 ${ukuran} ${ukuran}`} className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx={ukuran / 2} cy={ukuran / 2} r={r} fill="none" stroke="var(--chart-jalur)" strokeWidth={besar ? 5 : 4} />
        <circle cx={ukuran / 2} cy={ukuran / 2} r={r} fill="none" stroke={warna} strokeWidth={besar ? 5 : 4}
          strokeDasharray={`${(k * skor) / 100} ${k}`} strokeLinecap="round" />
      </svg>
      <span className={cn("angka relative font-bold", besar ? "text-base" : "text-[11px]")}>{skor}</span>
    </span>
  );
}

export function BarisAntrean({ l }: { l: ButirAntrean }) {
  const Ikon = IKON_KATEGORI[l.kategori];
  const Mode = IKON_MODE[l.mode];
  return (
    <li>
      <Link href={`/panel/verifikasi/${l.id}`}
        className={cn("group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-3 transition hover:bg-muted/40 sm:p-4",
          l.prioritas === "darurat" && "bg-darurat-lembut/60")}>
        <span className={cn("flex size-10 items-center justify-center rounded-xl",
          l.prioritas === "darurat" ? "bg-darurat text-white" : "bg-secondary text-primary")}>
          <Ikon className="size-5" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="truncate font-semibold group-hover:underline">{l.sekolah}</span>
            <BadgePrioritas prioritas={l.prioritas} />
          </span>
          <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="font-mono">{l.kodeTiket}</span>
            <span>{KATEGORI[l.kategori].label}</span>
            <span>{l.kecamatan}</span>
            {l.terdampak > 0 && <span className="flex items-center gap-1"><Users className="size-3.5" aria-hidden />{angka(l.terdampak)}</span>}
            <span className="flex items-center gap-1" title={`${l.jumlahBukti} bukti`}><IkonFoto className="size-3.5" aria-hidden />{l.jumlahBukti}</span>
            <span title={`Identitas ${l.mode}`}><Mode className="size-3.5" aria-label={`Identitas ${l.mode}`} /></span>
            {l.serupa > 0 && (
              <span className="flex items-center gap-1 rounded-md bg-info-lembut px-1.5 font-semibold text-info">
                <Files className="size-3.5" aria-hidden />+{l.serupa} serupa
              </span>
            )}
          </span>
        </span>
        <span className="flex items-center gap-2">
          {l.tenggat && <HitungMundur tenggat={l.tenggat} mulai={l.dibuatPada} className="hidden sm:inline-flex" />}
          <Kredibilitas skor={l.kredibilitas} />
          <ChevronRight className="hidden size-4 text-muted-foreground sm:block" aria-hidden />
        </span>
      </Link>
    </li>
  );
}

export function BarisKasus({ k }: { k: ButirKasus }) {
  const Ikon = IKON_KATEGORI[k.kategori];
  return (
    <li>
      <Link href={`/panel/kasus/${k.id}`}
        className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-3 transition hover:bg-muted/40 sm:p-4">
        <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
          <Ikon className="size-5" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block truncate font-semibold group-hover:underline">{k.judul}</span>
          <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="font-mono">{k.kode}</span>
            {k.sppg && <span>{k.sppg}</span>}
            {k.instansi && <span className="flex items-center gap-1"><ShieldCheck className="size-3.5" aria-hidden />{k.instansi}</span>}
            <span className="flex items-center gap-1"><Files className="size-3.5" aria-hidden />{k.jumlahLaporan}</span>
          </span>
        </span>
        <span className="flex flex-wrap items-center justify-end gap-2">
          <BadgeSla terlambat={k.terlambat} tidakDitanggapi={k.tidakDitanggapi} />
          <BadgeStatus status={k.status} />
          {k.tenggat && k.status !== "selesai" && <HitungMundur tenggat={k.tenggat} mulai={k.statusSejak} className="hidden md:inline-flex" />}
          <ChevronRight className="hidden size-4 text-muted-foreground sm:block" aria-hidden />
        </span>
      </Link>
    </li>
  );
}
