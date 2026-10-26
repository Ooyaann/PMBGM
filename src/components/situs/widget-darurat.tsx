"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HeartPulse,
  Phone,
  Siren,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PERTOLONGAN_CEPAT = [
  "Hentikan konsumsi dan amankan sisa makanan untuk uji lab.",
  "Beri minum air putih secukupnya, hindari memaksakan muntah.",
  "Bawa segera ke Puskesmas/IGD jika anak lemas, muntah berulang, atau demam.",
];

export function WidgetDarurat() {
  const [buka, setBuka] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith("/panel")) return null;

  return (
    <aside
      aria-label="Bantuan darurat keracunan MBG"
      className="fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-auto"
    >
      {/* POP-UP RINGKAS DAN JELAS */}
      {buka && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="judul-darurat-popup"
          className="mb-3 w-80 max-w-[calc(100vw-2.5rem)] rounded-2xl border-2 border-rose-500/40 bg-card p-4 text-card-foreground shadow-2xl shadow-rose-950/20 backdrop-blur-md animate-in fade-in-0 slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-center justify-between gap-2 border-b border-rose-500/20 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-rose-500 text-white shadow-xs">
                <Siren className="size-4 animate-pulse" aria-hidden />
              </span>
              <div>
                <h3
                  id="judul-darurat-popup"
                  className="text-sm font-extrabold leading-tight text-rose-600 dark:text-rose-400"
                >
                  Darurat Keracunan MBG
                </h3>
                <p className="text-[11px] text-muted-foreground">Bantuan medis cepat & responsif</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBuka(false)}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition"
              aria-label="Tutup jendela darurat"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-3 space-y-2.5">
            {/* Tombol Panggilan Cepat 119 & 112 */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:119"
                className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-2 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700"
              >
                <Phone className="size-3.5" aria-hidden /> Ambulans 119
              </a>
              <a
                href="tel:112"
                className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-rose-600/30 bg-rose-500/10 px-2 text-xs font-bold text-rose-700 dark:text-rose-300 transition hover:bg-rose-500/20"
              >
                <Phone className="size-3.5" aria-hidden /> Halo 112
              </a>
            </div>

            {/* 3 Langkah Pertolongan Pertama - Jelas & Mudah Dibaca */}
            <div className="rounded-xl bg-muted/50 p-2.5 space-y-1.5">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <HeartPulse className="size-3.5 text-rose-600" /> Tindakan Pertama:
              </span>
              <ul className="space-y-1 text-xs text-foreground/90 pl-1">
                {PERTOLONGAN_CEPAT.map((p, idx) => (
                  <li key={p} className="flex items-start gap-1.5 leading-snug">
                    <span className="font-bold text-rose-600 shrink-0">{idx + 1}.</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tombol Lapor Darurat */}
            <Link
              href="/lapor"
              onClick={() => setBuka(false)}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 py-2.5 px-3 text-xs font-bold text-white shadow-sm transition hover:from-rose-700 hover:to-amber-700"
            >
              <Zap className="size-3.5 text-amber-300" />
              Lapor Insiden Medis (Target 2 Jam)
            </Link>
          </div>
        </div>
      )}

      {/* TOMBOL MENGAPUNG (COMPACT CIRCLE -> EXPANDS ON HOVER) */}
      <button
        type="button"
        onClick={() => setBuka((prev) => !prev)}
        aria-expanded={buka}
        className={cn(
          "group flex items-center rounded-full p-3 shadow-xl transition-all duration-300 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/40",
          buka
            ? "bg-slate-900 text-white dark:bg-card dark:text-foreground"
            : "bg-gradient-to-r from-rose-600 to-red-600 text-white hover:shadow-rose-900/40"
        )}
        aria-label="Darurat Keracunan Makanan"
      >
        <span className="relative flex size-6 items-center justify-center">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-40" />
          <Siren className="size-5 shrink-0" aria-hidden />
        </span>
        <span className="max-w-0 opacity-0 group-hover:max-w-[150px] group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 overflow-hidden whitespace-nowrap text-xs font-bold tracking-tight">
          Darurat Keracunan
        </span>
      </button>
    </aside>
  );
}
