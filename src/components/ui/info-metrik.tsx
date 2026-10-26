"use client";

import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * Kamus penjelasan ringkas untuk metrik teknis agar ramah bagi masyarakat umum.
 * Bahasa lugas, padat, dan tanpa jargon teknis.
 */
export const KAMUS_METRIK: Record<string, { judul: string; deskripsi: string }> = {
  risiko: {
    judul: "Indeks Risiko Dapur (0–100)",
    deskripsi: "Tingkat kerentanan dapur MBG. Makin rendah angkanya makin aman (0–39 Rendah, 40–69 Sedang, 70+ Tinggi). Dihitung dari jumlah aduan, kasus keracunan, sertifikat sanitasi, dan ketepatan waktu perbaikan.",
  },
  tanggap: {
    judul: "Waktu Tanggap",
    deskripsi: "Rata-rata waktu yang dibutuhkan pengelola dapur atau instansi untuk merespons dan memeriksa laporan sejak pertama kali masuk.",
  },
  selesai: {
    judul: "Tingkat Penyelesaian",
    deskripsi: "Persentase masalah makanan yang telah selesai diperbaiki dan diverifikasi tuntas dengan bukti foto atau tindakan perbaikan.",
  },
  terlambat: {
    judul: "Melewati Batas Waktu",
    deskripsi: "Laporan yang belum ditindaklanjuti padahal sudah melampaui batas waktu standar pelayanan (SLA).",
  },
  kepuasan: {
    judul: "Kepuasan Pelapor (Skala 1–5)",
    deskripsi: "Penilaian langsung dari orang tua siswa atau pelapor setelah aduan selesai ditangani oleh pihak dapur.",
  },
  slhs: {
    judul: "Sertifikat Laik Higiene Sanitasi (SLHS)",
    deskripsi: "Bukti uji laboratorium dan inspeksi resmi dari Dinas Kesehatan bahwa tempat masak, air, dan peralatan dapur memenuhi standar kebersihan.",
  },
  sinyal: {
    judul: "Sinyal Lonjakan Aduan",
    deskripsi: "Peningkatan jumlah aduan warga yang melebihi 3 kali lipat rata-rata harian dalam 24 jam terakhir. Sedang dalam verifikasi cepat petugas lapangan.",
  },
};

interface InfoMetrikProps {
  jenis: keyof typeof KAMUS_METRIK;
  className?: string;
  children?: React.ReactNode;
}

export function InfoMetrik({ jenis, className, children }: InfoMetrikProps) {
  const info = KAMUS_METRIK[jenis];
  if (!info) return <>{children}</>;

  return (
    <TooltipProvider delay={150}>
      <Tooltip>
        {children ? (
          <TooltipTrigger className={cn("inline-flex cursor-help items-center gap-1", className)}>
            {children}
          </TooltipTrigger>
        ) : (
          <TooltipTrigger
            className={cn("inline-flex size-4 items-center justify-center text-muted-foreground/80 transition-colors hover:text-foreground", className)}
            aria-label={`Informasi ${info.judul}`}
          >
            <HelpCircle className="size-3.5" aria-hidden />
          </TooltipTrigger>
        )}
        <TooltipContent side="top" className="max-w-xs space-y-1 p-2.5 text-xs leading-relaxed shadow-md">
          <p className="font-semibold text-foreground">{info.judul}</p>
          <p className="text-muted-foreground">{info.deskripsi}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
