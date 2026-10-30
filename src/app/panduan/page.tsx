import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Megaphone, Sliders } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { DasborPanduan } from "@/components/panduan/dasbor-panduan";
import { SimulatorDss } from "@/components/panduan/simulator-dss";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Panduan",
  description: "Alur pengawasan MBG, peran instansi, dan kalkulator risiko SPPG.",
};

export default function HalamanPanduan() {
  return (
    <div className="kontainer space-y-8 py-8 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Panduan</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/lapor"
            className={cn(buttonVariants({ size: "default" }), "rounded-xl font-bold")}
          >
            <Megaphone className="size-4" aria-hidden /> Lapor
          </Link>
          <Link
            href="#simulator-dss"
            className={cn(buttonVariants({ variant: "outline", size: "default" }), "rounded-xl font-semibold bg-card")}
          >
            <Sliders className="size-4 text-primary" aria-hidden /> Kalkulator Risiko
          </Link>
        </div>
      </div>

      <Suspense fallback={<div className="h-80 rounded-3xl bg-muted/40 animate-pulse" />}>
        <DasborPanduan />
      </Suspense>

      <SimulatorDss />
    </div>
  );
}
