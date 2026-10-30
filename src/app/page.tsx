import { Phone } from "lucide-react";
import { GoogleSearchBar } from "@/components/beranda/google-search-bar";

export default function Beranda() {
  return (
    <div className="relative h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] overflow-hidden flex flex-col justify-center items-center px-4 sm:px-6 bg-[radial-gradient(ellipse_75%_50%_at_50%_38%,oklch(0.42_0.095_168/0.07),transparent)]">
      {/* Kontainer Utama Berpusat (Clean Google-Style) */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center text-center space-y-7 -mt-10">
        <div className="flex flex-col items-center justify-center space-y-2 select-none">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-primary">
            PMBGM
          </h1>
          <p className="text-xs sm:text-sm font-bold tracking-[0.28em] text-muted-foreground uppercase">
            Pemantau MBG Masyarakat
          </p>
        </div>

        <GoogleSearchBar />
      </div>

      {/* Footer Strip Minimalis */}
      <div className="absolute bottom-5 sm:bottom-6 inset-x-0 mx-auto w-fit max-w-[92vw] px-4 py-1.5 rounded-full border border-border/80 bg-card/90 backdrop-blur-sm shadow-2xs flex items-center justify-center gap-2.5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 font-medium text-foreground/85">
          <span className="size-1.5 rounded-full bg-primary" />
          394 Sekolah
        </span>
        <span className="text-border">·</span>
        <a
          href="tel:119"
          className="inline-flex items-center gap-1 font-bold text-darurat hover:underline"
          aria-label="Hubungi Darurat Medis 119"
        >
          <Phone className="size-3" /> Darurat 119
        </a>
      </div>
    </div>
  );
}
