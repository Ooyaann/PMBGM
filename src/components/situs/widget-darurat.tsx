"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  HeartPulse,
  Phone,
  Siren,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PERTOLONGAN_CEPAT = [
  "Hentikan makan & simpan sisa ompreng untuk uji lab",
  "Beri air putih sedikit-sedikit, jangan paksa muntah",
  "Segera ke IGD/Puskesmas jika anak muntah terus, lemas, atau sesak",
  "Catat perkiraan jam makan dan menu yang dikonsumsi",
];

export function WidgetDarurat() {
  const [buka, setBuka] = useState(false);

  return (
    <aside
      aria-label="Akses darurat keracunan MBG"
      className="fixed bottom-5 right-5 z-50 flex flex-col items-end"
    >
      {/* KARTU POP-UP MODAL DARURAT DI POJOK KANAN BAWAH */}
      {buka && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="judul-darurat-popup"
          className="mb-3 w-[calc(100vw-2.5rem)] max-w-sm rounded-3xl border-2 border-rose-500/40 bg-card p-5 text-card-foreground shadow-2xl shadow-rose-900/20 backdrop-blur-md animate-in fade-in-0 slide-in-from-bottom-4 duration-200"
        >
          <div className="flex items-start justify-between gap-2 border-b border-rose-500/20 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white shadow-xs animate-pulse">
                <Siren className="size-5" aria-hidden />
              </span>
              <div>
                <h3
                  id="judul-darurat-popup"
                  className="text-base font-extrabold leading-tight text-rose-600 dark:text-rose-400"
                >
                  Bantuan Darurat Medis
                </h3>
                <p className="text-xs text-muted-foreground">Keracunan makanan siswa MBG</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBuka(false)}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
              aria-label="Tutup jendela darurat"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-3.5 space-y-3">
            {/* Tombol Panggilan Cepat */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:119"
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-rose-600 px-3 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700"
              >
                <Phone className="size-4" aria-hidden /> Ambulans 119
              </a>
              <a
                href="tel:112"
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-rose-600/30 bg-rose-500/10 px-3 text-xs font-bold text-rose-700 dark:text-rose-300 transition hover:bg-rose-500/20"
              >
                <Phone className="size-4" aria-hidden /> Darurat 112
              </a>
            </div>

            {/* Langkah Tindakan Cepat */}
            <div className="rounded-2xl bg-muted/60 p-3 space-y-1.5">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <HeartPulse className="size-3.5 text-rose-600" /> Pertolongan Pertama:
              </span>
              <ol className="space-y-1 text-xs text-muted-foreground pl-1">
                {PERTOLONGAN_CEPAT.map((p, idx) => (
                  <li key={p} className="flex items-start gap-1.5">
                    <span className="font-bold text-rose-600 shrink-0">{idx + 1}.</span>
                    <span className="leading-tight">{p}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Tombol Lapor Darurat */}
            <Link
              href="/lapor"
              onClick={() => setBuka(false)}
              className="group flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 p-3 text-xs font-bold text-white shadow-md transition hover:from-rose-700 hover:to-amber-700"
            >
              <span className="flex items-center gap-1.5">
                <Zap className="size-4 text-amber-300" />
                Lapor Jalur Darurat (SLA 2 Jam)
              </span>
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      )}

      {/* TOMBOL MENGAPUNG (FLOATING ACTION BUTTON) */}
      <button
        type="button"
        onClick={() => setBuka((prev) => !prev)}
        aria-expanded={buka}
        className={cn(
          "group flex items-center gap-2.5 rounded-full px-4 py-3 shadow-xl transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/40",
          buka
            ? "bg-slate-900 text-white dark:bg-card dark:text-foreground"
            : "bg-gradient-to-r from-rose-600 to-red-600 text-white hover:from-rose-700 hover:to-red-700 hover:shadow-rose-900/30"
        )}
      >
        <span className="relative flex size-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex size-3 rounded-full bg-white" />
        </span>
        <span className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold tracking-wide">
          <Siren className="size-4 text-rose-200" aria-hidden />
          Darurat Keracunan?
        </span>
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold text-white">
          119 / 112
        </span>
      </button>
    </aside>
  );
}
