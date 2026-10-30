import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { GoogleSearchBar } from "@/components/beranda/google-search-bar";
import { ambilKasusSorotan } from "@/lib/data/publik";

export default async function Beranda() {
  const sorotan = await ambilKasusSorotan();

  return (
    <main className="h-[calc(100vh-4.5rem)] max-h-[calc(100vh-4.5rem)] overflow-hidden flex flex-col justify-between items-center px-4 py-3 sm:py-5">
      {/* 1. Baris Atas: Kasus Terkini (Pill Ticker) & Hotline Darurat 119 */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 pt-1">
        {sorotan?.kasus ? (
          <Link
            href={`/lacak?tiket=${sorotan.kasus.kode_kasus}`}
            className="group inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1 text-xs font-bold text-rose-700 dark:text-rose-300 backdrop-blur-md transition hover:bg-rose-500/20"
            title="Klik untuk melihat perkembangan kasus ini"
          >
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-rose-500" />
            </span>
            <span className="font-extrabold uppercase tracking-wider text-[10px] text-rose-600 dark:text-rose-400 shrink-0">
              Kasus Terkini:
            </span>
            <span className="truncate max-w-[12rem] sm:max-w-xs md:max-w-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {sorotan.kasus.judul}
            </span>
            <span className="text-[10px] bg-background/80 px-2 py-0.5 rounded-full text-muted-foreground border shrink-0">
              {sorotan.kasus.status?.replace("_", " ") ?? "Proses"}
            </span>
            <ArrowRight className="size-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition shrink-0" />
          </Link>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            Sistem Aktif 394 Sekolah Kota Semarang
          </div>
        )}

        {/* Hotline 119 di Sudut Kanan Atas yang Bersih */}
        <a
          href="tel:119"
          className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/5 px-3 py-1 text-xs font-extrabold text-rose-600 dark:text-rose-400 hover:bg-rose-500/15 transition"
        >
          <Phone className="size-3" /> 119 Darurat Medis
        </a>
      </div>

      {/* 2. Centerpiece Google: Logo Proporsional, Tagline, Search Box, 2 Tombol */}
      <div className="w-full max-w-2xl mx-auto text-center space-y-6 my-auto py-2">
        {/* Logo PMBGM Resmi & Simetris */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <Image
            src="/logo-pmbgm.png"
            alt="PMBGM - Pemantau MBG Masyarakat"
            width={260}
            height={54}
            priority
            className="h-11 sm:h-13 w-auto object-contain drop-shadow-xs"
          />
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Pengawasan Terbuka Kualitas, Porsi & Keamanan Makan Bergizi Gratis
          </p>
        </div>

        {/* Google Search Bar & 2 Tombol Utama */}
        <GoogleSearchBar />

        {/* 3 Tagline Mini Visual */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-card/60 px-3 py-1 text-[11px] font-medium shadow-2xs">
            <ShieldCheck className="size-3.5 text-primary" /> Identitas Terlindungi
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-card/60 px-3 py-1 text-[11px] font-medium shadow-2xs">
            <Clock className="size-3.5 text-amber-500" /> Respon SLA 24 Jam
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-card/60 px-3 py-1 text-[11px] font-medium shadow-2xs">
            <Sparkles className="size-3.5 text-teal-500" /> Deteksi Cerdas ANN
          </span>
        </div>
      </div>

      {/* 3. Baris Bawah: Status Tunggal (Tanpa Footer Kotak yang Bikin Scroll) */}
      <div className="w-full max-w-4xl flex items-center justify-between text-[11px] text-muted-foreground/80 pb-1">
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Kawal Bersama Masa Depan Anak
        </span>
        <div className="flex items-center gap-3">
          <Link href="/panduan" className="hover:text-primary transition-colors">
            Panduan
          </Link>
          <span>·</span>
          <Link href="/insight" className="hover:text-primary transition-colors">
            Peta Risiko
          </Link>
          <span>·</span>
          <Link href="/cari-sekolah" className="hover:text-primary transition-colors">
            Cari Sekolah
          </Link>
        </div>
      </div>
    </main>
  );
}
