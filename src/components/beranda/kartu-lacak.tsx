import Link from "next/link";
import { ArrowUpRight, Building2, Users, Utensils } from "lucide-react";
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
    instansi_nama: string | null;
    jumlah_laporan: number | null;
  };
  timeline: Peristiwa[];
}

/** Contoh kasus nyata (data simulasi) di hero: memperlihatkan bahwa tindak lanjut terlihat publik. */
export function KartuLacak({ kasus, timeline }: Props) {
  const terakhir = timeline.at(-1);
  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-secondary via-background to-risiko-sedang-lembut opacity-80 blur-2xl" />
      <Link
        href={`/lacak/kasus/${kasus.id}`}
        className="group block rounded-3xl border bg-card p-5 shadow-xl shadow-primary/5 transition hover:-translate-y-0.5 hover:shadow-2xl sm:p-6"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs text-muted-foreground">{kasus.kode_kasus}</span>
          {kasus.status && <BadgeStatus status={kasus.status as StatusAlur} />}
        </div>
        <h3 className="mt-2 line-clamp-2 font-semibold leading-snug">{kasus.judul}</h3>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <li className="flex items-center gap-1"><Utensils className="size-3.5" aria-hidden /> {kasus.sppg_nama}</li>
          <li className="flex items-center gap-1"><Building2 className="size-3.5" aria-hidden /> {kasus.instansi_nama}</li>
          <li className="flex items-center gap-1"><Users className="size-3.5" aria-hidden /> {kasus.jumlah_laporan} laporan</li>
        </ul>

        {kasus.status && <AlurStatus aktif={kasus.status as StatusAlur} className="mt-5" />}

        {terakhir && (
          <div className="mt-5 rounded-2xl bg-muted/70 p-3 text-xs">
            <p className="flex items-center justify-between gap-2">
              <span className="font-semibold">{terakhir.pelaku}</span>
              <Waktu iso={terakhir.waktu} className="text-muted-foreground" />
            </p>
            {terakhir.catatan && <p className="mt-1 line-clamp-2 text-muted-foreground">{terakhir.catatan}</p>}
          </div>
        )}
        <span className="mt-4 flex items-center justify-end gap-1 text-xs font-semibold text-primary">
          Timeline lengkap <ArrowUpRight className="size-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
        </span>
      </Link>
    </div>
  );
}
