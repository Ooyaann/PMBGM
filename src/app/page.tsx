import { Phone } from "lucide-react";
import { GoogleSearchBar } from "@/components/beranda/google-search-bar";

export default function Beranda() {
  return (
    <main className="relative h-[calc(100vh-4.5rem)] max-h-[calc(100vh-4.5rem)] overflow-hidden flex flex-col justify-center items-center px-4 sm:px-6 bg-[radial-gradient(ellipse_80%_60%_at_50%_35%,rgba(16,185,129,0.12),transparent)]">
      {/* Ambient Decorative Blur Background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Container Utama Berpusat Penuh (Zero Scroll, Clean Google-Style) */}
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center space-y-6 -mt-6">
        {/* Tipografi PMBGM Terpusat, Proporsional, Justified Alignment */}
        <div className="flex flex-col items-center justify-center space-y-2 select-none">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-200 bg-clip-text text-transparent drop-shadow-xs">
            PMBGM
          </h1>
          <p className="text-xs sm:text-sm font-extrabold tracking-[0.24em] sm:tracking-[0.32em] text-foreground/85 uppercase">
            Pemantau MBG Masyarakat
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-lg mx-auto pt-1 leading-relaxed">
            Pengawasan Partisipatif Kualitas, Porsi & Keamanan Pangan Program Makan Bergizi Gratis
          </p>
        </div>

        {/* Smart Search Bar & Tombol Aksi Langsung */}
        <GoogleSearchBar />
      </div>

      {/* Footer Mini Strip Rapi di Bagian Bawah Layar */}
      <div className="absolute bottom-5 sm:bottom-6 inset-x-0 mx-auto w-fit max-w-[92vw] px-4 sm:px-5 py-2 rounded-2xl sm:rounded-full border border-border/80 bg-card/85 backdrop-blur-md shadow-xs flex flex-wrap items-center justify-center gap-2 sm:gap-3.5 text-[11px] sm:text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          394 Sekolah Terhubung
        </span>
        <span className="text-border">·</span>
        <span className="font-medium text-foreground/75">
          Layanan Pengawasan Terbuka
        </span>
        <span className="text-border">·</span>
        <a
          href="tel:119"
          className="inline-flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400 hover:underline"
          aria-label="Hubungi Darurat Medis 119"
        >
          <Phone className="size-3" /> Darurat Medis 119
        </a>
      </div>
    </main>
  );
}
