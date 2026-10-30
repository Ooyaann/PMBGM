import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Megaphone, Sliders } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { DasborPanduan } from "@/components/panduan/dasbor-panduan";
import { SimulatorDss } from "@/components/panduan/simulator-dss";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Panduan & Simulator DSS - PMBGM",
  description: "Alur pengawasan MBG, wewenang instansi, dan simulasi risiko SPPG metode SAW.",
};

export default function HalamanPanduan() {
  return (
    <div className="kontainer space-y-10 py-8 sm:py-10">
      {/* Header Ringkas & To-The-Point */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border bg-card/80 backdrop-blur-sm p-6 sm:p-8">
        <div className="space-y-1 max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Panduan PMBGM
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Alur pelaporan warga, wewenang instansi, hingga simulasi kalkulator risiko SPPG.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/lapor"
            className={cn(buttonVariants({ size: "default" }), "rounded-xl font-bold shadow-xs")}
          >
            <Megaphone className="size-4" aria-hidden /> Lapor Masalah
          </Link>
          <Link
            href="#simulator-dss"
            className={cn(buttonVariants({ variant: "outline", size: "default" }), "rounded-xl font-semibold bg-card")}
          >
            <Sliders className="size-4 text-primary" aria-hidden /> Kalkulator DSS
          </Link>
        </div>
      </div>

      {/* Dasbor Kotakan Menu Panduan Ringkas */}
      <Suspense fallback={<div className="h-96 rounded-3xl bg-muted/40 animate-pulse" />}>
        <DasborPanduan />
      </Suspense>

      {/* Simulator Interaktif DSS (Metode SAW & Level A/B/C) */}
      <SimulatorDss />
    </div>
  );
}
