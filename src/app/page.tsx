import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  Lock,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { GoogleSearchBar } from "@/components/beranda/google-search-bar";

export default function Beranda() {
  return (
    <main className="relative h-[calc(100vh-4.5rem)] max-h-[calc(100vh-4.5rem)] overflow-hidden flex flex-col justify-center items-center px-4 sm:px-6 bg-[radial-gradient(ellipse_80%_60%_at_50%_30%,rgba(16,185,129,0.12),transparent)]">
      {/* Ambient Decorative Blur Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Container Utama Berpusat Penuh (Zero Scroll) */}
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center space-y-5 -mt-2">
        {/* Badge Pengumuman / Status Resmi */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 shadow-2xs">
          <Sparkles className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden />
          <span>Platform Pengawasan MBG Resmi Kota Semarang</span>
        </div>

        {/* Logo Resmi PMBGM & Tagline Ringkas */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <Image
            src="/logo-pmbgm.png"
            alt="PMBGM - Pemantau MBG Masyarakat"
            width={320}
            height={70}
            priority
            className="h-14 sm:h-16 w-auto object-contain drop-shadow-sm"
          />
          <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-md mx-auto leading-relaxed">
            Kawal Kualitas, Porsi & Keamanan Pangan Anak Sekolah Secara Terbuka
          </p>
        </div>

        {/* Smart Search Bar & Tombol Aksi */}
        <GoogleSearchBar />

        {/* 3 Pilar Jaminan Transparansi & Keamanan */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card/80 px-3 py-1 font-semibold shadow-2xs">
            <Lock className="size-3 text-primary" /> Identitas Terlindungi
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card/80 px-3 py-1 font-semibold shadow-2xs">
            <Clock className="size-3 text-amber-500" /> Respon Tanggap 24 Jam
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card/80 px-3 py-1 font-semibold shadow-2xs">
            <ShieldCheck className="size-3 text-teal-500" /> Verifikasi Independen
          </span>
        </div>

        {/* Baris Status: 394 Sekolah & Darurat Medis 119 */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-muted-foreground/80">
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
