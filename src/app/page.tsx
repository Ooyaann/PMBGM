import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { GoogleSearchBar } from "@/components/beranda/google-search-bar";

export default function Beranda() {
  return (
    <main className="relative h-[calc(100vh-4.5rem)] max-h-[calc(100vh-4.5rem)] overflow-hidden flex flex-col justify-center items-center px-4 bg-[radial-gradient(ellipse_70%_50%_at_50%_35%,rgba(16,185,129,0.08),transparent)]">
      {/* Container Utama Berpusat Penuh (Google-Style Centerpiece) */}
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center space-y-6 -mt-4">
        {/* Logo Resmi PMBGM & Slogan Ringkas */}
        <div className="flex flex-col items-center justify-center space-y-2.5">
          <Image
            src="/logo-pmbgm.png"
            alt="PMBGM - Pemantau MBG Masyarakat"
            width={280}
            height={60}
            priority
            className="h-13 sm:h-15 w-auto object-contain drop-shadow-xs"
          />
          <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-lg mx-auto">
            Portal Pengawasan Terbuka Kualitas, Porsi & Keamanan Pangan Sekolah
          </p>
        </div>

        {/* 3. Smart Search Bar & 2 Tombol Aksi Langsung (Lapor & Lacak) */}
        <GoogleSearchBar />

        {/* 4. Fitur Jaminan & Status Pengawasan Kota Semarang (Visual & Ringkas) */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-card/80 px-3 py-1 text-[11px] font-semibold shadow-2xs">
            <ShieldCheck className="size-3.5 text-primary" /> Identitas Terlindungi
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-card/80 px-3 py-1 text-[11px] font-semibold shadow-2xs">
            <Clock className="size-3.5 text-amber-500" /> Respon SLA 24 Jam
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-card/80 px-3 py-1 text-[11px] font-semibold shadow-2xs">
            <Sparkles className="size-3.5 text-teal-500" /> Deteksi Cerdas ANN
          </span>
        </div>

        {/* 5. Baris Status Ringkas: 394 Sekolah & Darurat Medis 119 */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-muted-foreground/80">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            394 Sekolah Terhubung se-Kota Semarang
          </span>
          <span className="text-border">·</span>
          <a
            href="tel:119"
            className="inline-flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400 hover:underline"
          >
            <Phone className="size-3" /> Darurat Medis 119
          </a>
        </div>
      </div>
    </main>
  );
}
