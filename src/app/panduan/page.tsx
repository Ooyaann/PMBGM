import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Megaphone, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DasborPanduan } from "@/components/panduan/dasbor-panduan";

export const metadata: Metadata = {
  title: "Panduan & Pusat Informasi",
  description: "Pusat panduan lengkap cara kerja PMBGM: tahapan lapor, pembagian tugas verifikator dan dapur, kamus metrik awam, hingga jaminan anti-manipulasi.",
};

export default function HalamanPanduan() {
  return (
    <div className="kontainer space-y-10 py-8 sm:py-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-b from-card via-card to-secondary/30 p-6 sm:p-10 shadow-sm">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" aria-hidden />
            Pusat Informasi & Tata Kelola Pengawasan
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Panduan Lengkap & Cara Kerja PMBGM
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Semua yang perlu Anda ketahui tentang pengawasan Program Makan Bergizi Gratis (MBG): alur aduan dari warga, siapa yang memverifikasi, arti setiap angka metrik risiko dapur, hingga bagaimana sistem menjamin transparansi tanpa manipulasi.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button size="lg" className="rounded-xl font-semibold shadow-sm" render={<Link href="/lapor" />}>
              <Megaphone className="size-4" aria-hidden /> Buat Laporan Sekarang
            </Button>
            <Button variant="outline" size="lg" className="rounded-xl font-semibold" render={<Link href="/lacak" />}>
              <ShieldCheck className="size-4" aria-hidden /> Lacak Kode Tiket
            </Button>
          </div>
        </div>
      </div>

      {/* Dasbor Kotakan Menu Panduan dengan Suspense untuk useSearchParams */}
      <Suspense fallback={<div className="h-96 rounded-3xl bg-muted/40 animate-pulse" />}>
        <DasborPanduan />
      </Suspense>
    </div>
  );
}
