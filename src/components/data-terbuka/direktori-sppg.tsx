"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FolderOpen, School, Search, ShieldCheck, ShieldOff, Users } from "lucide-react";
import { BadgeRisiko } from "@/components/data/badge";
import { angka } from "@/lib/format";
import { kategoriRisiko, RISIKO, type KategoriRisiko } from "@/lib/label";
import { cn } from "@/lib/utils";

export interface ButirSppg {
  id: string;
  nama: string;
  kecamatan: string;
  statusOperasional: string;
  statusSlhs: string;
  indeks: number | null;
  jumlahSekolah: number;
  penerima: number;
  kasus: number;
}

const FILTER_RISIKO: (KategoriRisiko | "semua")[] = ["semua", "tinggi", "sedang", "rendah"];

/** Direktori SPPG dengan pencarian dan filter risiko (DT-03). */
export function DirektoriSppg({ data }: { data: ButirSppg[] }) {
  const [kueri, setKueri] = useState("");
  const [risiko, setRisiko] = useState<KategoriRisiko | "semua">("semua");

  const hasil = useMemo(() => {
    const q = kueri.trim().toLowerCase();
    return data
      .filter((s) => !q || s.nama.toLowerCase().includes(q) || s.kecamatan.toLowerCase().includes(q))
      .filter((s) => risiko === "semua" || kategoriRisiko(s.indeks) === risiko)
      .sort((a, b) => (b.indeks ?? 0) - (a.indeks ?? 0));
  }, [data, kueri, risiko]);

  const jumlah = (k: KategoriRisiko) => data.filter((s) => kategoriRisiko(s.indeks) === k).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex h-11 flex-1 items-center gap-2 rounded-2xl border border-input bg-card px-3.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/40">
          <Search className="size-4 text-muted-foreground" aria-hidden />
          <span className="sr-only">Cari SPPG atau kecamatan</span>
          <input value={kueri} onChange={(e) => setKueri(e.target.value)} placeholder="Cari SPPG atau kecamatan"
            className="h-full min-w-0 flex-1 bg-transparent text-base placeholder:text-muted-foreground/80 focus:outline-none" />
        </label>
        <div role="group" aria-label="Filter tingkat risiko" className="flex gap-1.5 overflow-x-auto">
          {FILTER_RISIKO.map((f) => (
            <button key={f} type="button" aria-pressed={risiko === f} onClick={() => setRisiko(f)}
              className={cn("inline-flex h-11 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium whitespace-nowrap transition",
                risiko === f ? "border-primary bg-secondary text-secondary-foreground" : "bg-card text-muted-foreground hover:text-foreground")}>
              {f !== "semua" && <span aria-hidden className={cn("size-2 rounded-full",
                f === "tinggi" ? "bg-risiko-tinggi" : f === "sedang" ? "bg-risiko-sedang" : "bg-risiko-rendah")} />}
              {f === "semua" ? `Semua · ${data.length}` : `${RISIKO[f].label} · ${jumlah(f)}`}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground" aria-live="polite">{hasil.length} SPPG</p>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {hasil.map((s) => (
          <li key={s.id}>
            <Link href={`/data/sppg/${s.id}`}
              className="flex h-full flex-col gap-3 rounded-2xl border bg-card p-4 transition hover:border-primary/40 hover:shadow-md">
              <span className="flex items-start justify-between gap-2">
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{s.nama}</span>
                  <span className="text-xs text-muted-foreground">{s.kecamatan}</span>
                </span>
                <BadgeRisiko skor={s.indeks} />
              </span>
              <span className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><School className="size-3.5" aria-hidden />{s.jumlahSekolah}</span>
                <span className="flex items-center gap-1"><Users className="size-3.5" aria-hidden />{angka(s.penerima)}</span>
                <span className="flex items-center gap-1"><FolderOpen className="size-3.5" aria-hidden />{s.kasus} kasus</span>
                <span className={cn("flex items-center gap-1", s.statusSlhs === "berlaku" ? "text-risiko-rendah" : "text-risiko-sedang")}>
                  {s.statusSlhs === "berlaku" ? <ShieldCheck className="size-3.5" aria-hidden /> : <ShieldOff className="size-3.5" aria-hidden />}
                  {s.statusSlhs === "berlaku" ? "SLHS" : "Tanpa SLHS"}
                </span>
              </span>
              {s.statusOperasional !== "beroperasi" && (
                <span className="w-fit rounded-full bg-risiko-tinggi-lembut px-2 py-0.5 text-[11px] font-semibold text-risiko-tinggi">
                  {s.statusOperasional === "ditutup_sementara" ? "Ditutup sementara" : s.statusOperasional}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
