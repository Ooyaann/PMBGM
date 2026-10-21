"use client";

import { useSyncExternalStore } from "react";
import { relatif, tanggalJam } from "@/lib/format";

// Detak per menit, dibagi semua komponen <Waktu> di halaman.
let sekarang = Date.now();
const pendengar = new Set<() => void>();
let detak: ReturnType<typeof setInterval> | null = null;

function langganan(cb: () => void) {
  pendengar.add(cb);
  if (!detak) {
    detak = setInterval(() => {
      sekarang = Date.now();
      pendengar.forEach((p) => p());
    }, 60_000);
  }
  return () => {
    pendengar.delete(cb);
    if (!pendengar.size && detak) {
      clearInterval(detak);
      detak = null;
    }
  };
}

/**
 * Waktu relatif ("3 jam lalu") yang dihitung di browser. Server merender tanggal absolut
 * sehingga HTML prerender tetap deterministik dan tidak terjadi hydration mismatch.
 */
export function Waktu({ iso, className }: { iso: string; className?: string }) {
  const nilai = useSyncExternalStore(langganan, () => sekarang, () => null);
  return (
    <time dateTime={iso} title={tanggalJam(iso)} className={className}>
      {nilai === null ? tanggalJam(iso) : relatif(iso, nilai)}
    </time>
  );
}
