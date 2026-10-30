"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  History,
  Megaphone,
  School,
  Search,
  Sparkles,
  Utensils,
  X,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { buatKlienBrowser } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface RekomendasiItem {
  id?: string;
  nama: string;
  sub: string;
  jenis: "sekolah" | "sppg" | "tiket";
}

const REKOMENDASI_DEFAULT_SD: RekomendasiItem[] = [
  { nama: "SD Tembalang 10", sub: "Sekolah Dasar · Tembalang", jenis: "sekolah" },
  { nama: "SD Negeri 01 Semarang", sub: "Sekolah Dasar · Semarang Tengah", jenis: "sekolah" },
  { nama: "SD Banyumanik 02", sub: "Sekolah Dasar · Banyumanik", jenis: "sekolah" },
  { nama: "SD Sendangmulyo 04", sub: "Sekolah Dasar · Tembalang", jenis: "sekolah" },
  { nama: "SD Palebon 01", sub: "Sekolah Dasar · Pedurungan", jenis: "sekolah" },
];

const REKOMENDASI_DEFAULT_SPPG: RekomendasiItem[] = [
  { nama: "SPPG Tembalang 03", sub: "Dapur Pengolah MBG · SLHS Aktif", jenis: "sppg" },
  { nama: "SPPG Candisari 01", sub: "Dapur Pengolah MBG · SLHS Aktif", jenis: "sppg" },
  { nama: "SPPG Banyumanik 02", sub: "Dapur Pengolah MBG · SLHS Aktif", jenis: "sppg" },
  { nama: "SPPG Pedurungan 01", sub: "Dapur Pengolah MBG · SLHS Aktif", jenis: "sppg" },
];

const REKOMENDASI_DEFAULT_SMP: RekomendasiItem[] = [
  { nama: "SMP Negeri 01 Semarang", sub: "Sekolah Menengah Pertama · Semarang Tengah", jenis: "sekolah" },
  { nama: "SMP Negeri 05 Semarang", sub: "Sekolah Menengah Pertama · Semarang Barat", jenis: "sekolah" },
  { nama: "SMP Negeri 29 Semarang", sub: "Sekolah Menengah Pertama · Banyumanik", jenis: "sekolah" },
];

export function GoogleSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [rekomendasi, setRekomendasi] = useState<RekomendasiItem[]>([]);
  const [bukaRekomendasi, setBukaRekomendasi] = useState(false);
  const kontainerRef = useRef<HTMLDivElement>(null);

  // Deteksi spasi: rekomendasi baru muncul jika string mengandung spasi
  const adaSpasi = query.includes(" ");

  // Handle klik di luar untuk menutup dropdown rekomendasi
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (kontainerRef.current && !kontainerRef.current.contains(event.target as Node)) {
        setBukaRekomendasi(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch rekomendasi saat user mengetik spasi
  useEffect(() => {
    if (!adaSpasi) {
      setRekomendasi([]);
      setBukaRekomendasi(false);
      return;
    }

    const bersih = query.trim().toLowerCase();
    let dibatalkan = false;

    // Rekomendasi preset cepat jika baru ketik prefix + spasi (misal "SD ", "SPPG ", "SMP ")
    if (bersih === "sd") {
      setRekomendasi(REKOMENDASI_DEFAULT_SD);
      setBukaRekomendasi(true);
      return;
    }
    if (bersih === "sppg") {
      setRekomendasi(REKOMENDASI_DEFAULT_SPPG);
      setBukaRekomendasi(true);
      return;
    }
    if (bersih === "smp") {
      setRekomendasi(REKOMENDASI_DEFAULT_SMP);
      setBukaRekomendasi(true);
      return;
    }

    // Jika kata kunci lebih panjang dengan spasi, query langsung database Supabase
    const jeda = setTimeout(async () => {
      try {
        const supabase = buatKlienBrowser();
        const { data: sekolahData } = await supabase
          .from("sekolah")
          .select("id, nama, jenjang, wilayah:wilayah_id (nama)")
          .ilike("nama", `%${bersih}%`)
          .limit(5);

        if (dibatalkan) return;

        if (sekolahData && sekolahData.length > 0) {
          const list: RekomendasiItem[] = sekolahData.map((s) => ({
            id: s.id,
            nama: s.nama,
            sub: `${s.jenjang?.toUpperCase() || "Sekolah"} · ${(s.wilayah as { nama: string } | null)?.nama || "Nasional"}`,
            jenis: "sekolah",
          }));
          setRekomendasi(list);
          setBukaRekomendasi(true);
        } else {
          // Fallback rekomendasi berdasarkan awalan
          if (bersih.startsWith("sd")) {
            setRekomendasi(REKOMENDASI_DEFAULT_SD.filter((r) => r.nama.toLowerCase().includes(bersih)));
          } else if (bersih.startsWith("sppg")) {
            setRekomendasi(REKOMENDASI_DEFAULT_SPPG.filter((r) => r.nama.toLowerCase().includes(bersih)));
          } else {
            setRekomendasi([]);
          }
          setBukaRekomendasi(true);
        }
      } catch {
        // Fallback jika offline/error
        setRekomendasi([]);
      }
    }, 180);

    return () => {
      dibatalkan = true;
      clearTimeout(jeda);
    };
  }, [query, adaSpasi]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBukaRekomendasi(false);
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

  const pilihRekomendasi = (item: RekomendasiItem) => {
    setQuery(item.nama);
    setBukaRekomendasi(false);
    if (item.jenis === "sppg") {
      router.push(`/cari-sekolah?q=${encodeURIComponent(item.nama)}`);
    } else if (item.id) {
      router.push(`/cari-sekolah?q=${encodeURIComponent(item.nama)}`);
    } else {
      router.push(`/cari-sekolah?q=${encodeURIComponent(item.nama)}`);
    }
  };

  return (
    <div ref={kontainerRef} className="w-full max-w-2xl mx-auto space-y-4 relative">
      {/* Search Bar Utama (Google-Style Centerpiece) */}
      <form onSubmit={handleSubmit} role="search" aria-label="Pencarian Cepat PMBGM" className="w-full relative">
        <div className="group relative flex h-14 sm:h-16 w-full items-center rounded-2xl sm:rounded-full border border-border/80 bg-card/95 backdrop-blur-md px-4 sm:px-6 shadow-lg shadow-primary/5 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20">
          <Search className="size-5 shrink-0 text-muted-foreground group-focus-within:text-primary transition-colors" aria-hidden />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (adaSpasi && rekomendasi.length > 0) setBukaRekomendasi(true);
            }}
            placeholder="Cari sekolah, dapur SPPG, atau nomor tiket aduan..."
            className="h-full min-w-0 flex-1 bg-transparent px-3.5 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            aria-label="Cari tiket pengaduan atau nama sekolah"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setBukaRekomendasi(false);
              }}
              className="mr-1.5 flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
              aria-label="Hapus kata kunci pencarian"
            >
              <X className="size-4" />
            </button>
          )}

          {/* Tombol Panah Submit: HANYA MUNCUL JIKA USER SUDAH MENGETIK SESUATU */}
          {query.trim().length > 0 && (
            <button
              type="submit"
              className="flex size-9 sm:size-10 items-center justify-center rounded-xl sm:rounded-full bg-primary text-primary-foreground shadow-sm transition hover:bg-primary/90 hover:scale-105 active:scale-95 cursor-pointer animate-in fade-in zoom-in-90 duration-150 shrink-0"
              aria-label="Kirim pencarian"
            >
              <ArrowRight className="size-4.5" />
            </button>
          )}
        </div>

        {/* Dropdown Rekomendasi Pencarian Google-Style (Hanya muncul jika ada spasi) */}
        {bukaRekomendasi && rekomendasi.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden rounded-2xl border border-border/80 bg-popover/98 p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150 text-left">
            <div className="px-3 py-1.5 flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/50">
              <span className="flex items-center gap-1.5">
                <Sparkles className="size-3 text-primary" /> Rekomendasi Pencarian
              </span>
              <span className="text-[10px] lowercase text-muted-foreground/70">tekan enter untuk cari</span>
            </div>
            <div className="p-1 space-y-0.5">
              {rekomendasi.map((item, index) => {
                const Ikon = item.jenis === "sppg" ? Utensils : School;
                return (
                  <button
                    key={`${item.nama}-${index}`}
                    type="button"
                    onClick={() => pilihRekomendasi(item)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl p-2.5 text-left transition hover:bg-muted/80 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                        <Ikon className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                          {item.nama}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{item.sub}</p>
                      </div>
                    </div>
                    <ArrowUpRight className="size-4 text-muted-foreground/60 group-hover:text-primary shrink-0 transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
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
