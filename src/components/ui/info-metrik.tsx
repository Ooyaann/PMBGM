"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, HelpCircle, Info, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/**
 * Kamus penjelasan ramah awam untuk metrik teknis.
 * Ditulis dalam bahasa manusia yang lugas, tidak rapat, dan nyaman dibaca warga.
 */
export const KAMUS_METRIK: Record<
  string,
  {
    judul: string;
    subjudul: string;
    deskripsi: string;
    panduan?: { label: string; warna: string }[];
    tautan?: string;
  }
> = {
  risiko: {
    judul: "Indeks Risiko Dapur (0–100)",
    subjudul: "Tingkat kerentanan keamanan pangan dapur MBG",
    deskripsi:
      "Skor kesehatan dan kepatuhan dapur MBG. Makin rendah nilainya, makin aman. Dihitung otomatis dari 5 aspek: aduan warga terverifikasi, riwayat keracunan, sertifikat sanitasi resmi Dinkes, ketepatan waktu perbaikan, dan penilaian kepuasan orang tua.",
    panduan: [
      { label: "0–39: Rendah (Aman)", warna: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" },
      { label: "40–69: Sedang (Waspada)", warna: "bg-amber-500/15 text-amber-700 dark:text-amber-400" },
      { label: "70+: Tinggi (Prioritas Pengawasan)", warna: "bg-rose-500/15 text-rose-700 dark:text-rose-400" },
    ],
    tautan: "/metodologi#indeks",
  },
  tanggap: {
    judul: "Waktu Tanggap",
    subjudul: "Kecepatan respon pihak dapur atau instansi",
    deskripsi:
      "Rata-rata waktu (dalam jam) yang dibutuhkan pihak dapur atau dinas untuk memberikan respon pertama dan memeriksa masalah sejak laporan warga lolos verifikasi.",
    tautan: "/panduan",
  },
  selesai: {
    judul: "Tingkat Penyelesaian",
    subjudul: "Persentase masalah yang beres diperbaiki",
    deskripsi:
      "Perbandingan jumlah aduan yang telah tuntas diperbaiki dengan bukti foto nyata dibanding seluruh laporan yang masuk. Bukan sekadar janji, tapi dibuktikan dengan foto fisik.",
    tautan: "/lacak/akuntabilitas",
  },
  terlambat: {
    judul: "Melewati Batas Waktu (SLA)",
    subjudul: "Kepatuhan terhadap batas waktu resmi",
    deskripsi:
      "Persentase laporan yang penanganannya molor melampaui batas waktu standar pelayanan (SLA). Dapur dengan tingkat keterlambatan tinggi akan mendapat perhatian khusus dari Korwil BGN.",
    tautan: "/panduan",
  },
  kepuasan: {
    judul: "Kepuasan Pelapor (Skala 1–5)",
    subjudul: "Penilaian langsung dari orang tua siswa",
    deskripsi:
      "Bintang kepuasan yang diberikan langsung oleh orang tua siswa atau guru pelapor setelah makanan/dapur selesai diperbaiki dalam masa sanggah 3 hari.",
    tautan: "/lacak/akuntabilitas",
  },
  slhs: {
    judul: "Sertifikat Laik Higiene Sanitasi (SLHS)",
    subjudul: "Izin resmi kebersihan tempat masak dari Dinkes",
    deskripsi:
      "Sertifikat resmi dari Dinas Kesehatan yang membuktikan bahwa sumber air, tempat memasak, ventilasi, dan peralatan dapur telah lolos uji laboratorium dan memenuhi standar sanitasi pangan.",
    tautan: "/data/sppg",
  },
  sinyal: {
    judul: "Sinyal Lonjakan Peringatan Dini",
    subjudul: "Deteksi dini kenaikan aduan tidak wajar",
    deskripsi:
      "Sistem mendeteksi jika aduan warga untuk satu dapur melonjak lebih dari 3 kali lipat dalam 24 jam terakhir. Sinyal ini langsung dikirim ke Dinas Kesehatan untuk uji laboratorium lapangan sebelum status darurat ditetapkan.",
    tautan: "/insight/peringatan",
  },
};

interface InfoMetrikProps {
  jenis: keyof typeof KAMUS_METRIK;
  className?: string;
  children?: React.ReactNode;
}

export function InfoMetrik({ jenis, className, children }: InfoMetrikProps) {
  const [buka, setBuka] = useState(false);
  const info = KAMUS_METRIK[jenis];
  if (!info) return <>{children}</>;

  return (
    <Popover open={buka} onOpenChange={setBuka}>
      <PopoverTrigger
        type="button"
        onClick={(e) => {
          // Mencegah klik memicu event navigasi pada elemen kartu Link induk
          e.stopPropagation();
          setBuka((prev) => !prev);
        }}
        className={cn(
          "inline-flex items-center gap-1.5 cursor-pointer rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          className
        )}
        aria-label={`Lihat keterangan ${info.judul}`}
      >
        {children ? (
          children
        ) : (
          <span className="inline-flex size-4 items-center justify-center rounded-full bg-muted/80 text-muted-foreground transition hover:bg-primary/20 hover:text-primary">
            <HelpCircle className="size-3.5" aria-hidden />
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="top"
        sideOffset={6}
        onClick={(e) => e.stopPropagation()}
        className="w-80 sm:w-96 rounded-2xl border bg-popover p-4 text-popover-foreground shadow-xl ring-1 ring-border/50 animate-in fade-in-0 zoom-in-95"
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2 border-b pb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Info className="size-4" aria-hidden />
              </span>
              <div>
                <h4 className="font-bold text-sm leading-tight text-foreground">{info.judul}</h4>
                <p className="text-[11px] text-muted-foreground">{info.subjudul}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBuka(false)}
              className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Tutup penjelasan"
            >
              <X className="size-3.5" />
            </button>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">{info.deskripsi}</p>

          {info.panduan && info.panduan.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-foreground block">Panduan Nilai:</span>
              <div className="space-y-1">
                {info.panduan.map((p) => (
                  <div key={p.label} className={cn("rounded-md px-2 py-1 text-[11px] font-medium", p.warna)}>
                    {p.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {info.tautan && (
            <div className="border-t pt-2.5 flex justify-end">
              <Link
                href={info.tautan}
                onClick={() => setBuka(false)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
              >
                Pelajari selengkapnya <ArrowRight className="size-3" aria-hidden />
              </Link>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
