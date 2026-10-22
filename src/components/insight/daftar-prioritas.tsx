"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, MoveDown, MoveRight, MoveUp, Search } from "lucide-react";
import { BadgeRisiko } from "@/components/data/badge";
import { ChipAlasan } from "@/components/data/chip-alasan";
import { BilahMini } from "@/components/insight/bilah-mini";
import type { SppgIndeks } from "@/lib/data/insight";
import { RISIKO, type KategoriRisiko } from "@/lib/label";
import { cn } from "@/lib/utils";

const FILTER: { kunci: KategoriRisiko | "semua"; label: string; titik?: string }[] = [
  { kunci: "semua", label: "Semua" },
  { kunci: "tinggi", label: RISIKO.tinggi.label, titik: "bg-risiko-tinggi" },
  { kunci: "sedang", label: RISIKO.sedang.label, titik: "bg-risiko-sedang" },
  { kunci: "rendah", label: RISIKO.rendah.label, titik: "bg-risiko-rendah" },
];

/** Panah tren 7 hari. Perubahan di bawah 1 poin dianggap stabil. */
export function Tren({ selisih }: { selisih: number | null }) {
  if (selisih == null) return null;
  const stabil = Math.abs(selisih) < 1;
  const Ikon = stabil ? MoveRight : selisih > 0 ? MoveUp : MoveDown;
  const teks = stabil ? "Stabil dibanding 7 hari lalu" : `${selisih > 0 ? "Naik" : "Turun"} ${Math.abs(selisih).toFixed(0)} poin dibanding 7 hari lalu`;
  return (
    <span title={teks} aria-label={teks}
      className={cn("angka inline-flex items-center gap-0.5 text-xs font-semibold",
        stabil ? "text-muted-foreground" : selisih > 0 ? "text-risiko-tinggi" : "text-risiko-rendah")}>
      <Ikon className="size-3.5" aria-hidden />
      {!stabil && Math.abs(selisih).toFixed(0)}
    </span>
  );
}

/** Daftar prioritas inspeksi (IN-02, IN-03), bisa disaring menurut kategori dan nama. */
export function DaftarPrioritas({ daftar }: { daftar: SppgIndeks[] }) {
  const [kategori, setKategori] = useState<KategoriRisiko | "semua">("semua");
  const [cari, setCari] = useState("");
  const q = cari.trim().toLowerCase();
  const tampil = daftar
    .map((s, i) => ({ ...s, peringkat: i + 1 }))
    .filter((s) => (kategori === "semua" || s.kategori === kategori)
      && (!q || s.nama.toLowerCase().includes(q) || s.kecamatan.toLowerCase().includes(q)));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div role="radiogroup" aria-label="Saring kategori risiko" className="inline-flex max-w-full gap-1 overflow-x-auto rounded-xl bg-muted p-1">
          {FILTER.map((f) => {
            const n = f.kunci === "semua" ? daftar.length : daftar.filter((s) => s.kategori === f.kunci).length;
            return (
              <button key={f.kunci} type="button" role="radio" aria-checked={kategori === f.kunci} onClick={() => setKategori(f.kunci)}
                className={cn("inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium transition sm:px-3",
                  kategori === f.kunci ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
                {f.titik && <span aria-hidden className={cn("size-2 rounded-full", f.titik)} />}
                {f.label}
                <span className="angka text-xs text-muted-foreground">{n}</span>
              </button>
            );
          })}
        </div>
        <label className="relative ml-auto w-full sm:w-56">
          <span className="sr-only">Cari SPPG atau kecamatan</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input type="search" value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari"
            className="h-10 w-full rounded-xl border bg-card pr-3 pl-9 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50" />
        </label>
      </div>

      <ol className="divide-y overflow-hidden rounded-3xl border bg-card" aria-live="polite">
        {tampil.map((s) => (
          <li key={s.id} className="group relative">
            <div className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 p-4 hover:bg-muted/40 sm:grid-cols-[2rem_minmax(0,16rem)_minmax(0,1fr)_auto]">
              <span className="angka text-lg font-extrabold text-muted-foreground">{s.peringkat}</span>
              <span className="min-w-0">
                {/* Tautan meregang menutupi baris; chip alasan di atasnya tetap bisa disorot. */}
                <Link href={`/data/sppg/${s.id}`} className="block leading-snug font-semibold outline-none sm:truncate after:absolute after:inset-0 after:rounded-[inherit] group-hover:underline focus-visible:after:ring-3 focus-visible:after:ring-ring/50">
                  {s.nama.replace("SPPG Contoh ", "SPPG ")}
                </Link>
                <span className="block truncate text-xs text-muted-foreground">{s.kecamatan}</span>
              </span>
              <span className="col-span-3 col-start-1 row-start-2 min-w-0 space-y-2 sm:col-span-1 sm:col-start-3 sm:row-start-1">
                <BilahMini komponen={s.komponen} />
                <span className="relative z-10 flex w-fit flex-wrap gap-1">
                  {s.alasan.map((a) => <ChipAlasan key={a.jenis} alasan={a} />)}
                </span>
              </span>
              <span className="flex items-center gap-2">
                <Tren selisih={s.selisih7Hari} />
                <BadgeRisiko skor={s.indeks} />
                <ChevronRight className="hidden size-4 text-muted-foreground sm:block" aria-hidden />
              </span>
            </div>
          </li>
        ))}
        {!tampil.length && <li className="p-6 text-center text-sm text-muted-foreground">Tidak ada SPPG yang cocok</li>}
      </ol>
    </div>
  );
}
