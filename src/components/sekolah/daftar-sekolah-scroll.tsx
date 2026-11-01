"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUp,
  FolderOpen,
  Loader2,
  Megaphone,
  School,
  ShieldCheck,
  ShieldOff,
  Users,
  Utensils,
} from "lucide-react";
import { BadgeRisiko } from "@/components/data/badge";
import { InfoMetrik } from "@/components/ui/info-metrik";
import { buttonVariants } from "@/components/ui/button";
import type { HasilSekolah } from "@/lib/data/sekolah";
import { angka } from "@/lib/format";
import { cn } from "@/lib/utils";

const JENJANG: Record<string, string> = {
  paud: "PAUD/TK",
  sd: "SD",
  smp: "SMP",
  sma: "SMA",
  smk: "SMK",
  slb: "SLB",
};

const BATCH_SIZE = 12;

export function DaftarSekolahScroll({
  daftar,
  kueri = "",
}: {
  daftar: HasilSekolah[];
  kueri?: string;
}) {
  const [jumlahTampil, setJumlahTampil] = useState(BATCH_SIZE);
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reset pagination saat query pencarian berubah
  useEffect(() => {
    setJumlahTampil(BATCH_SIZE);
    setSedangMemuat(false);
  }, [kueri, daftar]);

  const adaLagi = jumlahTampil < daftar.length;
  const sekolahTampil = daftar.slice(0, jumlahTampil);

  // Infinite Scroll menggunakan IntersectionObserver
  useEffect(() => {
    if (!adaLagi) return;
    const target = sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !sedangMemuat) {
          setSedangMemuat(true);
          // Jeda halus ~180ms agar terasa natural dan tidak membuat browser drop frame
          setTimeout(() => {
            setJumlahTampil((prev) => Math.min(prev + BATCH_SIZE, daftar.length));
            setSedangMemuat(false);
          }, 180);
        }
      },
      { rootMargin: "250px" } // Memuat lebih awal sebelum pengguna mencapai dasar
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [adaLagi, sedangMemuat, daftar.length]);

  return (
    <div className="space-y-4">
      {/* Header Info Status Jumlah */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-sm text-muted-foreground">
        <p>
          Menampilkan{" "}
          <strong className="angka text-foreground">{sekolahTampil.length}</strong> dari{" "}
          <strong className="angka text-foreground">{daftar.length}</strong> sekolah
          {kueri && (
            <>
              {" "}
              untuk &ldquo;<strong className="text-foreground">{kueri}</strong>&rdquo;
            </>
          )}
        </p>
        {kueri && (
          <Link
            href="/cari-sekolah"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Reset pencarian
          </Link>
        )}
      </div>

      {/* Grid Kartu Sekolah */}
      <ul className="grid gap-3.5 md:grid-cols-2" aria-live="polite">
        {sekolahTampil.map((s) => (
          <li
            key={s.id}
            className="flex flex-col gap-3.5 rounded-3xl border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-xs"
          >
            {/* Header Sekolah */}
            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <School className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-foreground leading-snug">{s.nama}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground/80">
                    {JENJANG[s.jenjang] ?? s.jenjang}
                  </span>
                  <span>·</span>
                  <span>{s.kecamatan}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="size-3.5" aria-hidden />
                    {angka(s.siswa)} siswa
                  </span>
                  {s.npsn && (
                    <span className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded">
                      NPSN {s.npsn}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Dapur SPPG Terhubung */}
            {s.sppg ? (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border/60 bg-muted/35 p-3">
                <Link
                  href={`/data/sppg/${s.sppg.id}`}
                  className="flex items-center gap-2 min-w-0 flex-1 truncate hover:text-primary transition-colors"
                >
                  <Utensils className="size-4 text-primary shrink-0" aria-hidden />
                  <span className="truncate text-sm font-semibold">{s.sppg.nama}</span>
                </Link>
                <div className="flex items-center gap-1.5 shrink-0">
                  <InfoMetrik jenis="slhs" side="top" className="shrink-0">
                    <span
                      className={cn(
                        "inline-flex h-6 shrink-0 whitespace-nowrap items-center gap-1 text-xs font-semibold px-2 rounded-full",
                        s.sppg.slhs === "berlaku"
                          ? "bg-risiko-rendah-lembut text-risiko-rendah"
                          : "bg-risiko-sedang-lembut text-risiko-sedang"
                      )}
                    >
                      {s.sppg.slhs === "berlaku" ? (
                        <>
                          <ShieldCheck className="size-3.5 shrink-0" /> SLHS Aktif
                        </>
                      ) : (
                        <>
                          <ShieldOff className="size-3.5 shrink-0" /> Tanpa SLHS
                        </>
                      )}
                    </span>
                  </InfoMetrik>
                  <BadgeRisiko skor={s.sppg.indeks} className="shrink-0" />
                </div>
              </div>
            ) : (
              <p className="rounded-2xl bg-muted/40 p-3 text-xs text-muted-foreground">
                Belum terhubung ke dapur SPPG
              </p>
            )}

            {/* Footer Aksi */}
            <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
              <span
                className={cn(
                  "inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold",
                  s.kasusTerbuka
                    ? "bg-risiko-sedang-lembut text-risiko-sedang"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <FolderOpen className="size-3.5" aria-hidden /> {s.kasusTerbuka} berjalan ·{" "}
                {s.kasusTotal} total
              </span>
              <Link
                href={`/lapor?sekolah=${s.id}`}
                className={cn(
                  buttonVariants({ size: "default" }),
                  "rounded-xl font-bold h-9 px-3.5 text-xs cursor-pointer"
                )}
              >
                <Megaphone className="size-3.5" aria-hidden /> Lapor
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {/* Sentinel Trigger Intersection Observer */}
      {adaLagi && <div ref={sentinelRef} className="h-6 w-full" aria-hidden="true" />}

      {/* Indikator Memuat atau Tombol Cadangan */}
      {adaLagi && (
        <div className="flex flex-col items-center justify-center gap-2 py-4">
          {sedangMemuat ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-primary text-xs font-bold shadow-2xs">
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
              <span>Memuat 12 sekolah berikutnya...</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setJumlahTampil((prev) => Math.min(prev + BATCH_SIZE, daftar.length))}
              className="text-xs font-semibold text-muted-foreground hover:text-primary transition py-1.5 px-3 rounded-lg hover:bg-muted cursor-pointer"
            >
              Muat {Math.min(BATCH_SIZE, daftar.length - jumlahTampil)} sekolah lagi
            </button>
          )}
        </div>
      )}

      {/* Tanda Selesai Seluruh Data Termuat */}
      {!adaLagi && daftar.length > BATCH_SIZE && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 pb-2 border-t border-border/60 text-xs text-muted-foreground">
          <span>Semua {daftar.length} sekolah telah ditampilkan</span>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline cursor-pointer"
          >
            <ArrowUp className="size-3.5" /> Kembali ke Atas
          </button>
        </div>
      )}
    </div>
  );
}
