"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Megaphone, Search, Ticket, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
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

    // Jika format menyerupai kode tiket (MBG-xxxxxx atau kode tiket huruf/angka dengan strip)
    if (/^[A-Za-z]{3}-[A-Za-z0-9]{4,10}$/i.test(bersih) || bersih.toUpperCase().startsWith("MBG-")) {
      router.push(`/lacak?tiket=${encodeURIComponent(bersih.toUpperCase())}`);
    } else {
      // Pencarian sekolah atau SPPG
      router.push(`/cari-sekolah?q=${encodeURIComponent(bersih)}`);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Search Bar Utama (Google-Style Centerpiece) */}
      <form onSubmit={handleSubmit} role="search" aria-label="Pencarian Cepat PMBGM" className="w-full">
        <div className="group relative flex h-14 sm:h-15 w-full items-center rounded-full border border-border/80 bg-card px-4 sm:px-6 shadow-md transition-all hover:border-primary/40 hover:shadow-lg focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20">
          <Search className="size-5 shrink-0 text-muted-foreground group-focus-within:text-primary transition-colors" aria-hidden />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik kode tiket (cth: MBG-2026-...) atau cari sekolah..."
            className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
            aria-label="Cari tiket pengaduan atau nama sekolah"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mr-1.5 flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition"
              aria-label="Hapus kata kunci pencarian"
            >
              <X className="size-4" />
            </button>
          )}

          <button
            type="submit"
            className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition hover:bg-primary/90 hover:scale-105 active:scale-95"
            aria-label="Kirim pencarian"
          >
            <ArrowRight className="size-4.5" />
          </button>
        </div>
      </form>

      {/* 2 Tombol Aksi Langsung Gaya Google: Lapor & Lacak */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <Link
          href="/lapor"
          className={cn(
            buttonVariants({ size: "default" }),
            "h-11 sm:h-12 rounded-2xl px-6 sm:px-7 font-extrabold text-sm sm:text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 gap-2 transition hover:-translate-y-0.5 active:translate-y-0"
          )}
        >
          <Megaphone className="size-4.5" aria-hidden />
          <span>Lapor Masalah</span>
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
            "h-11 sm:h-12 rounded-2xl px-6 sm:px-7 font-bold text-sm sm:text-base bg-card hover:bg-muted border-border/80 shadow-xs gap-2 transition hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          )}
        >
          <Search className="size-4.5 text-muted-foreground" aria-hidden />
          <span>Lacak Kasus & Tiket</span>
        </button>
      </div>
    </div>
  );
}
