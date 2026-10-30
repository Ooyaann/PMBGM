"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Megaphone, Search, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function GoogleSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bersih = query.trim();
    if (!bersih) {
      router.push("/lacak");
      return;
    }

    // Jika format kode tiket (MBG-xxxxxx atau serupa)
    if (/^[A-Za-z]{3}-[A-Za-z0-9]{4,10}$/i.test(bersih) || bersih.toUpperCase().startsWith("MBG-")) {
      router.push(`/lacak?tiket=${encodeURIComponent(bersih.toUpperCase())}`);
    } else {
      router.push(`/cari-sekolah?q=${encodeURIComponent(bersih)}`);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Search Bar Utama (Google-Style Centerpiece) */}
      <form onSubmit={handleSubmit} role="search" aria-label="Pencarian Cepat PMBGM" className="w-full">
        <div className="group relative flex h-14 sm:h-16 w-full items-center rounded-2xl sm:rounded-full border border-border/80 bg-card/95 backdrop-blur-md px-4 sm:px-6 shadow-lg shadow-primary/5 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20">
          <Search className="size-5 shrink-0 text-muted-foreground group-focus-within:text-primary transition-colors" aria-hidden />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari sekolah, dapur SPPG, atau nomor tiket aduan..."
            className="h-full min-w-0 flex-1 bg-transparent px-3.5 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            aria-label="Cari tiket pengaduan atau nama sekolah"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mr-1.5 flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
              aria-label="Hapus kata kunci pencarian"
            >
              <X className="size-4" />
            </button>
          )}

          <button
            type="submit"
            className="flex size-9 sm:size-10 items-center justify-center rounded-xl sm:rounded-full bg-primary text-primary-foreground shadow-sm transition hover:bg-primary/90 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Kirim pencarian"
          >
            <ArrowRight className="size-4.5" />
          </button>
        </div>
      </form>

      {/* 2 Tombol Aksi Langsung: Lapor & Lacak */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/lapor"
          className={cn(
            buttonVariants({ size: "default" }),
            "h-11 sm:h-12 rounded-xl px-6 sm:px-7 font-extrabold text-sm sm:text-base bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-600/20 gap-2 transition hover:-translate-y-0.5 active:translate-y-0"
          )}
        >
          <Megaphone className="size-4.5" aria-hidden />
          <span>Lapor Masalah MBG</span>
        </Link>

        <button
          type="button"
          onClick={() => {
            if (query.trim()) {
              handleSubmit({ preventDefault: () => {} } as React.FormEvent);
            } else {
              router.push("/lacak");
            }
          }}
          className={cn(
            buttonVariants({ variant: "outline", size: "default" }),
            "h-11 sm:h-12 rounded-xl px-6 sm:px-7 font-bold text-sm sm:text-base bg-card hover:bg-muted/80 border-border/80 shadow-xs gap-2 transition hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          )}
        >
          <Search className="size-4.5 text-muted-foreground" aria-hidden />
          <span>Lacak Kasus & Tiket</span>
        </button>
      </div>
    </div>
  );
}
