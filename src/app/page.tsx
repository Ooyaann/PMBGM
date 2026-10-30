import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Phone,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { GoogleSearchBar } from "@/components/beranda/google-search-bar";
import { ambilKasusSorotan } from "@/lib/data/publik";

export default async function Beranda() {
  const sorotan = await ambilKasusSorotan();

  return (
    <main className="min-h-[calc(100vh-4.5rem)] flex flex-col justify-between items-center px-4 py-4 sm:py-6 overflow-hidden">
      {/* 1. Area Atas: Kasus Baru Ticker / Pill Terkini (Clickable) */}
      <div className="w-full flex justify-center pt-1">
        {sorotan?.kasus ? (
          <Link
            href={`/lacak?tiket=${sorotan.kasus.kode_kasus}`}
            className="group inline-flex items-center gap-2.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-xs font-bold text-rose-700 dark:text-rose-300 backdrop-blur-md transition hover:bg-rose-500/20 hover:shadow-xs max-w-full"
            title="Klik untuk melihat perkembangan kasus ini"
          >
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-rose-500" />
            </span>
            <span className="font-extrabold uppercase tracking-wider text-[10px] text-rose-600 dark:text-rose-400 shrink-0">
              Kasus Terkini:
            </span>
            <span className="truncate max-w-[14rem] sm:max-w-md font-semibold text-foreground group-hover:text-primary transition-colors">
              {sorotan.kasus.judul}
            </span>
            <span className="text-[10px] bg-background/80 px-2 py-0.5 rounded-full text-muted-foreground border shrink-0">
              {sorotan.kasus.status?.replace("_", " ") ?? "Proses"}
            </span>
            <ArrowRight className="size-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition shrink-0" />
          </Link>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="size-3.5" /> Pengawasan Partisipatif Makan Bergizi Gratis Aktif
          </div>
        )}
      </div>

      {/* 2. Area Tengah: Google-Style Centerpiece (Logo + Headline Singkat + Search Bar + 2 Tombol) */}
      <div className="w-full max-w-3xl mx-auto text-center space-y-6 my-auto py-2">
        {/* Identitas PMBGM */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center gap-3">
            <span className="flex size-14 sm:size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
              <UtensilsCrossed className="size-8 sm:size-9" />
            </span>
            <div className="text-left">
              <div className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                PMBGM
              </div>
              <p className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-muted-foreground">
                Pemantau MBG Masyarakat
              </p>
            </div>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            Kawal mutu gizi, kebersihan, dan ketepatan menu anak sekolah Kota Semarang.
          </p>
        </div>

        {/* Input Google Search Bar & 2 Tombol Utama */}
        <GoogleSearchBar />

        {/* Elemen Visual (Icon Chips) — Tanpa Tembok Tulisan */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-card/60 px-3 py-1 text-[11px] font-semibold text-muted-foreground shadow-2xs">
            <ShieldCheck className="size-3.5 text-primary" /> Identitas Terlindungi
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-card/60 px-3 py-1 text-[11px] font-semibold text-muted-foreground shadow-2xs">
            <Clock className="size-3.5 text-amber-500" /> Respon SLA Terikat 24 Jam
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-card/60 px-3 py-1 text-[11px] font-semibold text-muted-foreground shadow-2xs">
            <Sparkles className="size-3.5 text-teal-500" /> Deteksi Cerdas ANN
          </span>
        </div>
      </div>

      {/* 3. Area Bawah: Status Layanan & Hotline Darurat 119 (1 Baris Bersih) */}
      <footer className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-3 border-t border-border/40 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Kota Semarang · Sistem Terhubung 394 Sekolah & Dapur SPPG</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="tel:119"
            className="flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400 hover:underline"
          >
            <Phone className="size-3.5" /> Darurat Medis 119
          </a>
          <span className="text-border">|</span>
          <Link href="/panduan" className="hover:text-foreground hover:underline">
            Panduan
          </Link>
          <Link href="/insight" className="hover:text-foreground hover:underline">
            Peta Risiko
          </Link>
        </div>
      </footer>
    </main>
  );
}
