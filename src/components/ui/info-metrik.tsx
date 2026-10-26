"use client";

import * as React from "react";
import { HelpCircle, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * Kamus penjelasan resmi dan ramah warga untuk seluruh istilah & metrik di PMBGM.
 * Bahasa lugas, jelas, dan mudah dipahami orang tua siswa maupun masyarakat umum.
 */
export const KAMUS_METRIK: Record<
  string,
  {
    judul: string;
    subjudul: string;
    deskripsi: string;
    panduan?: { label: string; kelas: string }[];
  }
> = {
  risiko: {
    judul: "Indeks Risiko Dapur (0–100)",
    subjudul: "Tingkat kerentanan keamanan pangan dapur MBG",
    deskripsi:
      "Skor kepatuhan dapur MBG. Makin rendah nilainya, makin aman. Dihitung otomatis dari 5 aspek: jumlah aduan warga, kasus keracunan, izin sanitasi resmi Dinkes, ketepatan waktu perbaikan, dan kepuasan orang tua.",
    panduan: [
      { label: "0–39: Rendah (Aman)", kelas: "text-emerald-700 dark:text-emerald-400 font-semibold" },
      { label: "40–69: Sedang (Waspada)", kelas: "text-amber-700 dark:text-amber-400 font-semibold" },
      { label: "70+: Tinggi (Prioritas Evaluasi)", kelas: "text-rose-700 dark:text-rose-400 font-semibold" },
    ],
  },
  slhs: {
    judul: "SLHS (Laik Higiene Sanitasi)",
    subjudul: "Izin resmi kebersihan tempat masak dari Dinas Kesehatan",
    deskripsi:
      "Sertifikat resmi dari Dinas Kesehatan yang membuktikan sumber air, tempat masak, dan peralatan dapur telah lolos uji laboratorium dan memenuhi standar kebersihan pangan.",
    panduan: [
      { label: "Berlaku: Memenuhi standar Dinkes", kelas: "text-emerald-700 dark:text-emerald-400 font-semibold" },
      { label: "Tanpa SLHS: Dikenakan sanksi & risiko tinggi", kelas: "text-rose-700 dark:text-rose-400 font-semibold" },
    ],
  },
  tanggap: {
    judul: "Waktu Tanggap",
    subjudul: "Kecepatan respon pihak dapur atau dinas",
    deskripsi:
      "Rata-rata waktu (jam) yang dibutuhkan pengelola dapur untuk merespons dan memeriksa masalah sejak laporan warga lolos verifikasi tim independen.",
  },
  selesai: {
    judul: "Tingkat Penyelesaian",
    subjudul: "Persentase masalah yang beres diperbaiki",
    deskripsi:
      "Persentase laporan yang telah selesai ditangani secara nyata dengan unggahan foto fisik perbaikan yang diverifikasi tuntas di linimasa publik.",
  },
  terlambat: {
    judul: "Melewati Batas Waktu (SLA)",
    subjudul: "Kepatuhan terhadap batas waktu resmi",
    deskripsi:
      "Laporan yang belum tuntas diperbaiki padahal sudah melampaui batas waktu standar pelayanan (SLA). Dapur yang sering terlambat akan dievaluasi oleh Korwil BGN.",
  },
  kepuasan: {
    judul: "Kepuasan Pelapor (Skala 1–5)",
    subjudul: "Penilaian langsung dari orang tua siswa",
    deskripsi:
      "Nilai bintang kepuasan yang diberikan langsung oleh orang tua siswa atau guru pelapor setelah makanan selesai diperbaiki dalam masa sanggah 3 hari.",
  },
  sinyal: {
    judul: "Sinyal Lonjakan Peringatan Dini",
    subjudul: "Deteksi dini kenaikan aduan tidak wajar",
    deskripsi:
      "Sistem otomatis mendeteksi jika aduan warga untuk satu dapur melonjak lebih dari 3× rata-rata harian dalam 24 jam terakhir untuk mencegah KLB keracunan meluas.",
  },
  prioritas: {
    judul: "Prioritas Inspeksi Lapangan",
    subjudul: "Urutan dapur yang mendesak diawasi",
    deskripsi:
      "Daftar dapur yang direkomendasikan kepada Dinas Kesehatan dan Korwil BGN untuk inspeksi mendadak berdasarkan tingginya skor risiko dan aduan terkini.",
  },
  status_operasional: {
    judul: "Status Operasional Dapur",
    subjudul: "Izin beroperasi menyuplai makanan",
    deskripsi:
      "Dapur berstatus 'Beroperasi' menyuplai makanan normal. Jika berstatus 'Ditutup Sementara', distribusi makanan dihentikan untuk renovasi atau investigasi medis.",
  },
  kredibilitas: {
    judul: "Kredibilitas Akun Pelapor",
    subjudul: "Tingkat keabsahan laporan warga",
    deskripsi:
      "Akun guru terverifikasi atau warga dengan riwayat laporan valid memiliki bobot verifikasi lebih cepat untuk penanganan kasus darurat.",
  },
  porsi: {
    judul: "Kapasitas Porsi Masak Harian",
    subjudul: "Kemampuan produksi dapur per hari",
    deskripsi:
      "Jumlah porsi makanan bergizi maksimal yang mampu disiapkan dan didistribusikan oleh dapur SPPG ke sekolah-sekolah binaannya setiap hari.",
  },
  pagu: {
    judul: "Pagu Anggaran MBG",
    subjudul: "Batas alokasi anggaran pemerintah",
    deskripsi:
      "Total alokasi anggaran APBN/APBD yang disiapkan pemerintah untuk membiayai program Makan Bergizi Gratis di wilayah ini selama satu tahun anggaran.",
  },
  realisasi: {
    judul: "Realisasi Anggaran MBG",
    subjudul: "Penyerapan dana yang telah dibayarkan",
    deskripsi:
      "Jumlah dana anggaran yang telah resmi dicairkan dan dibelanjakan untuk bahan pangan, pengolahan, dan distribusi makanan bergizi kepada siswa.",
  },
  penerima: {
    judul: "Penerima Manfaat (Siswa & Balita)",
    subjudul: "Jumlah anak yang terlayani",
    deskripsi:
      "Jumlah siswa sekolah (SD/SMP/SMA) dan kelompok sasaran (ibu hamil/balita) yang secara aktif menerima paket makanan bergizi setiap hari sekolah.",
  },
  sppg: {
    judul: "Dapur Satuan Pelayanan (SPPG)",
    subjudul: "Pusat produksi dan distribusi pangan",
    deskripsi:
      "Dapur sentral penyedia makanan bergizi yang ditunjuk resmi oleh Badan Gizi Nasional (BGN) untuk memasak dan mengantarkan porsi makanan ke sekolah.",
  },
  kasus_per_100rb: {
    judul: "Insidensi Kasus per 100.000 Penerima",
    subjudul: "Tingkat keamanan relatif antarwilayah",
    deskripsi:
      "Angka rasio kejadian gangguan pencernaan atau indikasi keracunan selama 3 bulan terakhir per 100 ribu siswa, digunakan untuk membandingkan keamanan wilayah secara adil.",
  },
  laporan_masuk: {
    judul: "Total Laporan Masuk",
    subjudul: "Aspirasi & pengaduan masyarakat",
    deskripsi:
      "Seluruh aduan, keluhan porsi, foto ketidaksesuaian menu, dan laporan insiden yang dikirimkan warga atau sekolah melalui portal PMBGM.",
  },
  terverifikasi: {
    judul: "Tingkat Verifikasi",
    subjudul: "Keabsahan laporan warga",
    deskripsi:
      "Persentase laporan yang telah diperiksa kelayakan bukti fotonya oleh tim independen dan dinyatakan valid untuk ditindaklanjuti oleh pihak dapur atau dinas.",
  },
};

interface InfoMetrikProps {
  jenis: keyof typeof KAMUS_METRIK;
  className?: string;
  children?: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

/**
 * Komponen InfoMetrik dengan interaksi HOVER alami di desktop dan TAP di perangkat sentuh.
 * Dilengkapi penghenti bubbling agar tidak memicu link kartu di sekitarnya.
 */
export function InfoMetrik({
  jenis,
  className,
  children,
  side = "top",
}: InfoMetrikProps) {
  const info = KAMUS_METRIK[jenis];
  if (!info) return <>{children}</>;

  return (
    <TooltipProvider delay={100}>
      <Tooltip>
        <TooltipTrigger
          render={
            <span
              onClick={(e) => {
                // Hentikan bubbling agar tidak memicu link kartu di sekitarnya
                e.stopPropagation();
              }}
              className={cn(
                "group inline-flex shrink-0 items-center gap-1 cursor-help outline-none transition-all hover:opacity-90",
                className
              )}
              aria-label={`Keterangan ${info.judul}`}
            />
          }
        >
          {children ? (
            children
          ) : (
            <span
              className="inline-flex size-4 items-center justify-center rounded-full bg-muted/80 text-muted-foreground transition-colors group-hover:bg-primary/20 group-hover:text-primary"
            >
              <HelpCircle className="size-3" aria-hidden />
            </span>
          )}
        </TooltipTrigger>
        <TooltipContent
          side={side}
          sideOffset={8}
          className="z-50 w-72 sm:w-80 rounded-2xl border-2 border-emerald-200/90 dark:border-emerald-800/80 bg-card p-4 text-card-foreground shadow-xl shadow-emerald-950/10 dark:shadow-black/40 backdrop-blur-md"
        >
          <div className="space-y-2 text-left">
            <div className="flex items-start gap-2.5 border-b border-border/80 pb-2.5">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mt-0.5">
                <Info className="size-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold leading-tight text-foreground">{info.judul}</h4>
                <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">{info.subjudul}</p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">{info.deskripsi}</p>

            {info.panduan && info.panduan.length > 0 && (
              <div className="space-y-1.5 rounded-xl bg-muted/60 p-2.5 text-[11px]">
                {info.panduan.map((p) => (
                  <div key={p.label} className={p.kelas}>
                    • {p.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
