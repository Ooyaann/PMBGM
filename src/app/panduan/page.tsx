import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Megaphone, ShieldCheck, Sliders, Sparkles } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { DasborPanduan } from "@/components/panduan/dasbor-panduan";
import { SimulatorDss } from "@/components/panduan/simulator-dss";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Panduan, Metodologi, & Simulator DSS",
  description: "Pusat panduan lengkap cara kerja PMBGM: tahapan lapor, pembagian tugas verifikator dan dapur, simulator interaktif DSS SAW, hingga jaminan anti-manipulasi.",
};

export default function HalamanPanduan() {
  return (
    <div className="kontainer space-y-12 py-8 sm:py-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-b from-card via-card to-secondary/30 p-6 sm:p-10 shadow-sm">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" aria-hidden />
            Pusat Informasi & Tata Kelola Pengawasan
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Panduan Sistem & Cara Kerja PMBGM
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Panduan resmi alur pengawasan Makan Bergizi Gratis (MBG), tugas instansi, hingga simulasi interaktif perhitungan risiko SPPG.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link href="/lapor" className={cn(buttonVariants({ size: "default" }), "rounded-xl font-bold shadow-xs")}>
              <Megaphone className="size-4" aria-hidden /> Buat Laporan
            </Link>
            <Link href="#simulator-dss" className={cn(buttonVariants({ variant: "outline", size: "default" }), "rounded-xl font-semibold bg-card")}>
              <Sliders className="size-4 text-primary" aria-hidden /> Coba Simulator DSS
            </Link>
          </div>
        </div>
      </div>

      {/* Dasbor Kotakan Menu Panduan dengan Suspense untuk useSearchParams */}
      <Suspense fallback={<div className="h-96 rounded-3xl bg-muted/40 animate-pulse" />}>
        <DasborPanduan />
      </Suspense>

      {/* Simulator Interaktif DSS (Metode SAW & Level A/B/C) */}
      <SimulatorDss />
    </div>
  );
}
