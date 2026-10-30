"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Megaphone,
  School,
  Search,
  Ticket,
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

export function GoogleSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [rekomendasi, setRekomendasi] = useState<RekomendasiItem[]>([]);
  const [bukaRekomendasi, setBukaRekomendasi] = useState(false);
  const [indeksAktif, setIndeksAktif] = useState<number>(-1);
  const kontainerRef = useRef<HTMLDivElement>(null);

  const cukupHuruf = query.trim().length >= 2;
  const daftarTampil = cukupHuruf ? rekomendasi : [];

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (kontainerRef.current && !kontainerRef.current.contains(event.target as Node)) {
        setBukaRekomendasi(false);
        setIndeksAktif(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch rekomendasi sekolah & SPPG secara paralel saat mengetik >= 2 karakter
  useEffect(() => {
    if (!cukupHuruf) {
      setRekomendasi([]);
      setIndeksAktif(-1);
      return;
    }

    const bersih = query.trim().toLowerCase();
    let dibatalkan = false;

    const jeda = setTimeout(async () => {
      try {
        const supabase = buatKlienBrowser();
        const kataSppg = bersih.replace(/^sppg\s*/i, "").trim() || bersih;

        const [resSekolah, resSppg] = await Promise.all([
          supabase
            .from("sekolah")
            .select("id, nama, jenjang, wilayah:wilayah_id (nama)")
            .ilike("nama", `%${bersih}%`)
            .limit(4),
          supabase
            .from("sppg")
            .select("id, nama, status_slhs, wilayah:wilayah_id (nama)")
            .ilike("nama", `%${kataSppg}%`)
            .limit(3),
        ]);

        if (dibatalkan) return;

        const gabungan: RekomendasiItem[] = [];

        if (resSekolah.data) {
          for (const s of resSekolah.data) {
            gabungan.push({
              id: s.id,
              nama: s.nama,
              sub: `${s.jenjang?.toUpperCase() || "Sekolah"} · ${(s.wilayah as { nama: string } | null)?.nama || "Kota Semarang"}`,
              jenis: "sekolah",
            });
          }
        }

        if (resSppg.data) {
          for (const d of resSppg.data) {
            gabungan.push({
              id: d.id,
              nama: d.nama,
              sub: `Dapur SPPG · ${(d.wilayah as { nama: string } | null)?.nama || "Kota Semarang"}`,
              jenis: "sppg",
            });
          }
        }

        if (/^[A-Za-z]{3}-[A-Za-z0-9]{2,10}$/i.test(bersih) || bersih.startsWith("mbg-")) {
          gabungan.unshift({
            nama: bersih.toUpperCase(),
            sub: "Lacak status kode tiket laporan",
            jenis: "tiket",
          });
        }

        setRekomendasi(gabungan);
        setIndeksAktif(-1);
        setBukaRekomendasi(true);
      } catch {
        setRekomendasi([]);
      }
    }, 140);

    return () => {
      dibatalkan = true;
      clearTimeout(jeda);
    };
  }, [query, cukupHuruf]);

  const pilihRekomendasi = (item: RekomendasiItem) => {
    setQuery(item.nama);
    setBukaRekomendasi(false);
    setIndeksAktif(-1);
    if (item.jenis === "tiket") {
      router.push(`/lacak?tiket=${encodeURIComponent(item.nama.toUpperCase())}`);
    } else if (item.jenis === "sppg" && item.id) {
      router.push(`/data/sppg/${item.id}`);
    } else if (item.jenis === "sppg") {
      router.push(`/data/sppg`);
    } else {
      router.push(`/cari-sekolah?q=${encodeURIComponent(item.nama)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bukaRekomendasi && indeksAktif >= 0 && indeksAktif < daftarTampil.length) {
      pilihRekomendasi(daftarTampil[indeksAktif]);
      return;
    }

    setBukaRekomendasi(false);
    const bersih = query.trim();
    if (!bersih) {
      router.push("/cari-sekolah");
      return;
    }

    if (/^[A-Za-z]{3}-[A-Za-z0-9]{4,10}$/i.test(bersih) || bersih.toUpperCase().startsWith("MBG-")) {
      router.push(`/lacak?tiket=${encodeURIComponent(bersih.toUpperCase())}`);
    } else {
      router.push(`/cari-sekolah?q=${encodeURIComponent(bersih)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!bukaRekomendasi || daftarTampil.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndeksAktif((prev) => (prev + 1) % daftarTampil.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndeksAktif((prev) => (prev <= 0 ? daftarTampil.length - 1 : prev - 1));
    } else if (e.key === "Escape") {
      setBukaRekomendasi(false);
      setIndeksAktif(-1);
    }
  };

  return (
    <div ref={kontainerRef} className="w-full max-w-2xl mx-auto space-y-4 relative z-20">
      {/* Search Bar Utama */}
      <form onSubmit={handleSubmit} role="search" aria-label="Pencarian Cepat PMBGM" className="w-full relative">
        <div
          className={cn(
            "group relative flex h-14 sm:h-15 w-full items-center rounded-2xl border bg-card/95 backdrop-blur-md px-4 sm:px-5 transition-all duration-200",
            bukaRekomendasi
              ? "border-primary ring-4 ring-primary/15 shadow-xl shadow-primary/10"
              : "border-border/90 shadow-md shadow-primary/5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
          )}
        >
          <Search
            className={cn(
              "size-5 shrink-0 transition-colors",
              bukaRekomendasi ? "text-primary" : "text-muted-foreground group-hover:text-primary"
            )}
            aria-hidden
          />

          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setBukaRekomendasi(true);
            }}
            onFocus={() => {
              if (cukupHuruf && rekomendasi.length > 0) setBukaRekomendasi(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Cari sekolah, dapur SPPG, atau kode tiket..."
            className="h-full min-w-0 flex-1 bg-transparent px-3.5 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            aria-label="Cari tiket pengaduan, nama sekolah, atau SPPG"
            autoComplete="off"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setBukaRekomendasi(false);
                setIndeksAktif(-1);
              }}
              className="mr-1.5 flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
              aria-label="Hapus kata kunci pencarian"
            >
              <X className="size-4" />
            </button>
          )}

          {query.trim().length > 0 && (
            <button
              type="submit"
              className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs transition hover:bg-primary/90 active:scale-95 cursor-pointer shrink-0"
              aria-label="Kirim pencarian"
            >
              <ArrowRight className="size-4" />
            </button>
          )}
        </div>

        {/* Dropdown Rekomendasi (Hanya muncul saat mengetik) */}
        {bukaRekomendasi && daftarTampil.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden rounded-2xl border border-border/90 bg-popover/98 p-1.5 shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-top-1 duration-150 text-left">
            <div className="p-0.5 space-y-0.5 max-h-64 overflow-y-auto">
              {daftarTampil.map((item, index) => {
                const Ikon = item.jenis === "sppg" ? Utensils : item.jenis === "tiket" ? Ticket : School;
                const aktif = index === indeksAktif;
                return (
                  <div
                    key={`${item.jenis}-${item.nama}-${index}`}
                    onMouseEnter={() => setIndeksAktif(index)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-xl p-2 text-left transition group",
                      aktif ? "bg-secondary/70" : "hover:bg-muted/70"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => pilihRekomendasi(item)}
                      className="flex flex-1 items-center gap-3 min-w-0 text-left cursor-pointer"
                    >
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-lg transition-transform",
                          item.jenis === "sppg"
                            ? "bg-info-lembut text-info"
                            : "bg-secondary text-primary"
                        )}
                      >
                        <Ikon className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                          {item.nama}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{item.sub}</p>
                      </div>
                    </button>
                    {item.jenis === "sekolah" ? (
                      <Link
                        href={`/lapor?sekolah=${encodeURIComponent(item.id || item.nama)}`}
                        onClick={() => setBukaRekomendasi(false)}
                        className="inline-flex h-7 items-center gap-1 rounded-lg bg-secondary px-2.5 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground shrink-0 transition"
                      >
                        <Megaphone className="size-3" /> Lapor
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => pilihRekomendasi(item)}
                        className="p-1.5 text-muted-foreground/60 group-hover:text-primary shrink-0 transition-colors cursor-pointer"
                        aria-label={`Buka ${item.nama}`}
                      >
                        <ArrowUpRight className="size-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </form>

      {/* Tombol Aksi Utama */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
        <Link
          href="/lapor"
          className={cn(
            buttonVariants({ size: "default" }),
            "h-11 rounded-xl px-6 font-bold text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm shadow-primary/15 gap-2 transition"
          )}
        >
          <Megaphone className="size-4" aria-hidden />
          <span>Buat Laporan</span>
        </Link>

        <Link
          href={query.trim() ? `/lacak?tiket=${encodeURIComponent(query.trim().toUpperCase())}` : "/lacak"}
          className={cn(
            buttonVariants({ variant: "outline", size: "default" }),
            "h-11 rounded-xl px-5 font-semibold text-sm bg-card hover:bg-secondary/50 hover:text-primary hover:border-primary/30 border-border shadow-2xs gap-2 transition"
          )}
        >
          <Ticket className="size-4 text-primary" aria-hidden />
          <span>Lacak Tiket</span>
        </Link>
      </div>
    </div>
  );
}
