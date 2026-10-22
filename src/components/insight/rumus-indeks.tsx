"use client";

import { HelpCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BOBOT, KOMPONEN } from "@/lib/indeks";

const ARTI: Record<(typeof KOMPONEN)[number]["kunci"], string> = {
  l: "Laporan terverifikasi per 1.000 porsi",
  k: "Kasus keracunan per 1.000 porsi",
  s: "SLHS tidak berlaku = 100",
  t: "Persen kasus lewat batas waktu",
  p: "Kepuasan pelapor (dibalik: 100 − P)",
};

/** Rumus Indeks Risiko (PRD 9.4) dalam popover, agar halaman tetap ringkas. */
export function RumusIndeks() {
  return (
    <Popover>
      <PopoverTrigger aria-label="Cara menghitung Indeks Risiko"
        className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground">
        <HelpCircle className="size-4" aria-hidden />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-4">
        <p className="font-semibold">Indeks Risiko 0–100</p>
        <ul className="space-y-1.5 text-xs">
          {KOMPONEN.map((k) => (
            <li key={k.kunci} className="flex items-center gap-2">
              <span aria-hidden className="size-2.5 shrink-0 rounded-[3px]" style={{ background: k.warna }} />
              <span className="angka w-8 font-semibold">{Math.round(BOBOT[k.kunci] * 100)}%</span>
              <span className="text-muted-foreground">{ARTI[k.kunci]}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">
          Hanya laporan terverifikasi, 30 hari terakhir. L dan K dinormalkan antar-SPPG (dipotong di persentil 95).
          Rendah 0–39 · Sedang 40–69 · Tinggi 70+.
        </p>
      </PopoverContent>
    </Popover>
  );
}
