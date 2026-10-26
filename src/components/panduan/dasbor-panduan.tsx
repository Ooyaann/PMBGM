"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Camera,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  HelpCircle,
  Lock,
  Megaphone,
  Phone,
  Radar,
  RotateCcw,
  Scale,
  School,
  Search,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sparkles,
  Star,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ItemPanduan {
  id: string;
  kategori: "lapor" | "aktor" | "metrik" | "keamanan" | "status" | "pintasan";
  judul: string;
  ringkasan: string;
  badgeRingkas: string[];
  ikon: LucideIcon;
  warnaAksen: string;
  warnaBg: string;
  warnaBorder: string;
  kontenModal: React.ReactNode;
  tautanAksi?: { href: string; label: string };
  kataKunci: string[];
}

const KATEGORI = [
  { id: "semua", label: "Semua Topik" },
  { id: "lapor", label: "Cara Melapor" },
  { id: "aktor", label: "Pihak Penanggung Jawab" },
  { id: "metrik", label: "Arti Angka & Label" },
  { id: "keamanan", label: "Anti-Manipulasi" },
  { id: "status", label: "Status Tiket & SLA" },
  { id: "pintasan", label: "Peta Fitur" },
] as const;

export function DasborPanduan() {
  const [kueri, setKueri] = useState("");
  const [kategoriAktif, setKategoriAktif] = useState<string>("semua");
  const [kartuTerpilih, setKartuTerpilih] = useState<ItemPanduan | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Pastikan posisi scroll modal dialog selalu direset ke paling atas (scrollTop = 0) saat dibuka
  useEffect(() => {
    if (kartuTerpilih) {
      const timer = setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
        }
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [kartuTerpilih]);

  const DAFTAR_KARTU: ItemPanduan[] = [
    // 1. CARA MELAPOR DENGAN ELEMEN UI WEB ASLI
    {
      id: "cara-melapor",
      kategori: "lapor",
      judul: "Alur & Tahapan Melapor",
      ringkasan: "Panduan 4 langkah praktis dengan tombol & menu yang sama persis seperti di web.",
      badgeRingkas: ["4 Langkah Mudah", "Tiruan UI Web Asli", "Mode Darurat 2 Jam"],
      ikon: Megaphone,
      warnaAksen: "text-emerald-700 dark:text-emerald-400",
      warnaBg: "bg-emerald-500/10",
      warnaBorder: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
      kataKunci: ["lapor", "foto", "bukti", "anonim", "rahasia", "tiket", "keracunan", "darurat", "tahapan"],
      tautanAksi: { href: "/lapor", label: "Buka Formulir Lapor Sekarang" },
      kontenModal: (
        <div className="space-y-6 text-foreground">
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Ikuti 4 langkah visual berikut. Tampilan tombol dan menu di panduan ini dibuat sama dengan yang ada di layar Anda:
          </p>

          <div className="space-y-4">
            {/* LANGKAH 1 */}
            <div className="rounded-2xl border bg-muted/20 p-4 sm:p-5 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-xs font-extrabold text-white">
                  1
                </span>
                <h4 className="text-sm sm:text-base font-bold text-foreground">
                  Klik Tombol &quot;Lapor Masalah&quot; di Menu Kiri
                </h4>
              </div>
              <div className="ml-9 space-y-2">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Di bilah kiri website, klik tombol hijau berikut:
                </p>
                {/* Mockup UI Web Asli Tombol Lapor */}
                <div className="w-fit flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-2 text-white shadow-sm pointer-events-none">
                  <Megaphone className="size-4" />
                  <span className="text-xs font-bold">Lapor Masalah MBG</span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">Aman</span>
                </div>
              </div>
            </div>

            {/* LANGKAH 2 */}
            <div className="rounded-2xl border bg-muted/20 p-4 sm:p-5 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-xs font-extrabold text-white">
                  2
                </span>
                <h4 className="text-sm sm:text-base font-bold text-foreground">
                  Ambil Foto Makanan & Cari Nama Sekolah
                </h4>
              </div>
              <div className="ml-9 space-y-2">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Unggah bukti foto porsi atau makanan basi, lalu ketik nama sekolah anak Anda:
                </p>
                {/* Mockup UI Web Asli Form Foto & Sekolah */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md pointer-events-none">
                  <div className="flex items-center gap-2 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/5 p-2.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    <Camera className="size-4" /> Unggah Foto Makanan
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border bg-card p-2.5 text-xs text-muted-foreground">
                    <School className="size-4 text-primary" /> SD Negeri Tembalang 01
                  </div>
                </div>
              </div>
            </div>

            {/* LANGKAH 3 */}
            <div className="rounded-2xl border bg-muted/20 p-4 sm:p-5 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-xs font-extrabold text-white">
                  3
                </span>
                <h4 className="text-sm sm:text-base font-bold text-foreground">
                  Pilih Tingkat Privasi Identitas Anda
                </h4>
              </div>
              <div className="ml-9 space-y-2">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Pilih apakah nama Anda tampil terbuka, dirahasiakan, atau disamarkan:
                </p>
                {/* Mockup UI Web Asli Pilihan Privasi */}
                <div className="flex flex-wrap gap-2 pointer-events-none">
                  <span className="rounded-xl border bg-card px-3 py-1.5 text-xs font-semibold">
                    🌐 Nama Terbuka
                  </span>
                  <span className="rounded-xl border border-primary bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                    🔒 Rahasia (Disarankan)
                  </span>
                  <span className="rounded-xl border bg-card px-3 py-1.5 text-xs font-semibold">
                    🕵️ Pelapor Anonim
                  </span>
                </div>
              </div>
            </div>

            {/* LANGKAH 4 */}
            <div className="rounded-2xl border bg-muted/20 p-4 sm:p-5 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-xs font-extrabold text-white">
                  4
                </span>
                <h4 className="text-sm sm:text-base font-bold text-foreground">
                  Simpan Kode Tiket untuk Melacak Status
                </h4>
              </div>
              <div className="ml-9 space-y-2">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Setelah terkirim, Anda menerima kode tiket unik untuk dipantau kapan saja:
                </p>
                {/* Mockup UI Web Asli Kartu Tiket */}
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 max-w-sm pointer-events-none">
                  <span className="font-mono text-sm font-extrabold text-emerald-800 dark:text-emerald-300">
                    #MBG-7821
                  </span>
                  <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                    Status: Diterima
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Tombol Darurat */}
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 flex items-center justify-between gap-3 text-rose-950 dark:text-rose-200">
            <div className="flex items-center gap-2.5">
              <Siren className="size-5 text-rose-600 shrink-0 animate-pulse" />
              <div className="text-xs sm:text-sm">
                <strong>Anak Muntah / Keracunan?</strong>
                <p className="text-[11px] sm:text-xs text-muted-foreground">
                  Gunakan tombol darurat merah di pojok kanan bawah web untuk respon medis 2 jam.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // 2. PIHAK PENANGGUNG JAWAB DENGAN BAGAN VISUAL
    {
      id: "pihak-penanggung-jawab",
      kategori: "aktor",
      judul: "Siapa yang Menangani Laporan?",
      ringkasan: "Alur penanganan otomatis antara Verifikator, Dapur SPPG, Dinkes, dan Korwil BGN.",
      badgeRingkas: ["Verifikator Independen", "Dapur SPPG", "Dinas Kesehatan", "Korwil BGN"],
      ikon: Users,
      warnaAksen: "text-teal-700 dark:text-teal-400",
      warnaBg: "bg-teal-500/10",
      warnaBorder: "hover:border-teal-500/50 hover:shadow-teal-500/10",
      kataKunci: ["aktor", "pihak", "verifikator", "sppg", "dinkes", "bgn", "wewenang", "independen", "penanggung"],
      tautanAksi: { href: "/tentang", label: "Pelajari Tata Kelola Lengkap" },
      kontenModal: (
        <div className="space-y-6 text-foreground">
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Laporan Anda tidak ditahan oleh birokrasi manual. Begitu disetujui verifikator, sistem langsung meneruskannya ke instansi yang berwenang:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border bg-card p-4 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-teal-500/15 text-teal-700 dark:text-teal-400 font-bold text-xs">
                  1
                </span>
                <span className="font-bold text-sm text-foreground">Verifikator Wilayah</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tim independen menyaring foto bukti & memastikan bukan hoaks sebelum dikirim ke dapur.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-4 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold text-xs">
                  2
                </span>
                <span className="font-bold text-sm text-foreground">Pengelola Dapur SPPG</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Wajib memperbaiki porsi/kebersihan masakan & mengunggah foto perbaikan nyata.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-4 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-rose-500/15 text-rose-700 dark:text-rose-400 font-bold text-xs">
                  3
                </span>
                <span className="font-bold text-sm text-foreground">Dinas Kesehatan Kota</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Investigasi medis keracunan, uji laboratorium sampel makanan, dan evaluasi izin SLHS.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-4 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 font-bold text-xs">
                  4
                </span>
                <span className="font-bold text-sm text-foreground">Korwil BGN Semarang</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Memantau kepatuhan batas waktu respon (SLA) dan menegur dapur yang lambat bertindak.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // 3. KAMUS ANGKA & LABEL DENGAN CONTOH BADGE ASLI
    {
      id: "arti-angka-label",
      kategori: "metrik",
      judul: "Kamus Angka, Label & Metrik",
      ringkasan: "Penjelasan arti Skor Risiko, status SLHS, waktu tanggap, dan sinyal lonjakan.",
      badgeRingkas: ["Skor Risiko 0–100", "Izin SLHS", "Waktu Tanggap", "Sinyal Lonjakan"],
      ikon: HelpCircle,
      warnaAksen: "text-blue-700 dark:text-blue-400",
      warnaBg: "bg-blue-500/10",
      warnaBorder: "hover:border-blue-500/50 hover:shadow-blue-500/10",
      kataKunci: ["metrik", "skor", "risiko", "slhs", "tanggap", "selesai", "terlambat", "sinyal", "arti", "kamus"],
      tautanAksi: { href: "/metodologi", label: "Lihat Rumus Matematis Terbuka" },
      kontenModal: (
        <div className="space-y-6 text-foreground">
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Berikut arti warna dan angka yang tampil di profil dapur anak Anda:
          </p>

          <div className="space-y-4">
            {/* Skor Risiko */}
            <div className="rounded-2xl border bg-card p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground">1. Indeks Risiko Dapur (Skor 0–100)</h4>
              <p className="text-xs text-muted-foreground">
                Makin kecil skornya, makin aman dan sehat dapurnya:
              </p>
              {/* Mockup Badge Asli */}
              <div className="flex flex-wrap items-center gap-2 pointer-events-none">
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  ● 24 · Rendah (Aman)
                </span>
                <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-400">
                  ● 58 · Sedang (Waspada)
                </span>
                <span className="rounded-full bg-rose-500/15 px-3 py-1 text-xs font-bold text-rose-700 dark:text-rose-400">
                  ● 86 · Tinggi (Evaluasi)
                </span>
              </div>
            </div>

            {/* SLHS */}
            <div className="rounded-2xl border bg-card p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground">2. Izin SLHS Dinas Kesehatan</h4>
              <p className="text-xs text-muted-foreground">
                Sertifikat kelayakan kebersihan air, alat masak, dan tempat saji:
              </p>
              <div className="flex flex-wrap items-center gap-2 pointer-events-none">
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="size-3.5" /> SLHS Berlaku (Lolos Uji)
                </span>
                <span className="rounded-full bg-rose-500/15 px-3 py-1 text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1">
                  <ShieldAlert className="size-3.5" /> Tanpa SLHS (Belum Lolos)
                </span>
              </div>
            </div>

            {/* Sinyal Lonjakan */}
            <div className="rounded-2xl border bg-card p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground">3. Sinyal Peringatan Dini</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Muncul bila aduan warga melonjak lebih dari 3× rata-rata harian dalam 24 jam untuk mendeteksi potensi keracunan massal sejak dini.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // 4. JAMINAN ANTI-MANIPULASI
    {
      id: "jaminan-anti-manipulasi",
      kategori: "keamanan",
      judul: "Jaminan Anti-Manipulasi Tindakan",
      ringkasan: "Bagaimana sistem memastikan dapur sungguh-sungguh memperbaiki masalah di lapangan.",
      badgeRingkas: ["Foto Fisik Wajib", "Masa Sanggah 3 Hari", "Kunci BAP Dinkes", "Jejak Audit Kekal"],
      ikon: ShieldCheck,
      warnaAksen: "text-purple-700 dark:text-purple-400",
      warnaBg: "bg-purple-500/10",
      warnaBorder: "hover:border-purple-500/50 hover:shadow-purple-500/10",
      kataKunci: ["manipulasi", "transparansi", "bukti", "foto", "sanggah", "bap", "dinkes", "rating", "keamanan"],
      tautanAksi: { href: "/lacak/akuntabilitas", label: "Lihat Papan Akuntabilitas Terbuka" },
      kontenModal: (
        <div className="space-y-6 text-foreground">
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Dapur tidak bisa menutup aduan hanya dengan kata-kata. Sistem mengunci penyelesaian dengan 4 aturan wajib:
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-2xl border bg-card p-3.5">
              <Camera className="size-5 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm text-foreground block">1. Wajib Unggah Foto Fisik Perbaikan</strong>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Foto alat yang dibersihkan atau menu baru langsung tampil di linimasa publik kasus.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border bg-card p-3.5">
              <RotateCcw className="size-5 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm text-foreground block">2. Hak Masa Sanggah 3 Hari bagi Pelapor</strong>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Pelapor berhak mengonfirmasi hasil, memberi bintang 1–5, atau membuka sanggahan bila makanan masih bermasalah.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border bg-card p-3.5">
              <Lock className="size-5 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm text-foreground block">3. Kasus Keracunan Dikunci Dinkes</strong>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Dapur tidak bisa menutup kasus keracunan sebelum petugas Dinas Kesehatan menerbitkan Berita Acara Pemeriksaan (BAP).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border bg-card p-3.5">
              <Scale className="size-5 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm text-foreground block">4. Catatan Waktu Permanen (Immutable)</strong>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Setiap riwayat perubahan status dan jam tindakan tercatat permanen di database tanpa bisa diedit diam-diam.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // 5. STATUS TIKET & SLA
    {
      id: "status-tiket-sla",
      kategori: "status",
      judul: "Fase Status Tiket & Batas Waktu",
      ringkasan: "Ketahui 5 tahapan penanganan tiket dan batas waktu standar layanan resmi (SLA).",
      badgeRingkas: ["Diterima (6 Jam)", "Diverifikasi (2 Jam)", "Diteruskan (6 Jam)", "Tindak Lanjut (3 Hari)"],
      ikon: Clock,
      warnaAksen: "text-amber-700 dark:text-amber-400",
      warnaBg: "bg-amber-500/10",
      warnaBorder: "hover:border-amber-500/50 hover:shadow-amber-500/10",
      kataKunci: ["status", "sla", "tiket", "lacak", "diterima", "diverifikasi", "diteruskan", "ditindaklanjuti", "selesai"],
      tautanAksi: { href: "/lacak", label: "Cek Status Tiket Anda" },
      kontenModal: (
        <div className="space-y-6 text-foreground">
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Setiap aduan yang masuk dipantau batas waktunya oleh sistem secara transparan:
          </p>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between rounded-2xl border bg-card p-3 text-xs sm:text-sm">
              <span className="font-bold text-foreground">1. Diterima</span>
              <span className="text-muted-foreground">Maksimal 6 Jam (2 Jam Darurat)</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border bg-card p-3 text-xs sm:text-sm">
              <span className="font-bold text-foreground">2. Diverifikasi</span>
              <span className="text-muted-foreground">Maksimal 2 Jam oleh Tim Netral</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border bg-card p-3 text-xs sm:text-sm">
              <span className="font-bold text-foreground">3. Diteruskan</span>
              <span className="text-muted-foreground">Maksimal 6 Jam ke SPPG & Dinkes</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border bg-card p-3 text-xs sm:text-sm">
              <span className="font-bold text-foreground">4. Ditindaklanjuti</span>
              <span className="text-muted-foreground">Maksimal 3 Hari Perbaikan Dapur</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/10 p-3 text-xs sm:text-sm font-bold text-primary">
              <span>5. Selesai & Masa Sanggah</span>
              <span>3 Hari Hak Penilaian Pelapor</span>
            </div>
          </div>
        </div>
      ),
    },

    // 6. PETA FITUR
    {
      id: "peta-fitur-situs",
      kategori: "pintasan",
      judul: "Pintasan Akses & Peta Informasi",
      ringkasan: "Akses cepat ke seluruh fitur pengawasan, profil dapur, peta risiko, dan unduh data.",
      badgeRingkas: ["Cari Sekolah", "Direktori SPPG", "Peta Risiko", "Unduh Data CSV"],
      ikon: Compass,
      warnaAksen: "text-cyan-700 dark:text-cyan-400",
      warnaBg: "bg-cyan-500/10",
      warnaBorder: "hover:border-cyan-500/50 hover:shadow-cyan-500/10",
      kataKunci: ["pintasan", "fitur", "cari", "sekolah", "data", "insight", "faq", "privasi", "unduh"],
      kontenModal: (
        <div className="space-y-4">
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Pilih menu yang ingin Anda kunjungi secara langsung:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/cari-sekolah"
              onClick={() => setKartuTerpilih(null)}
              className="flex items-center gap-3 rounded-2xl border bg-card p-3.5 transition hover:border-primary hover:shadow-sm"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <School className="size-5" />
              </span>
              <div>
                <span className="block font-bold text-sm text-foreground">Cari Sekolah Anak</span>
                <span className="text-xs text-muted-foreground">Ketahui SPPG mitra penyuplai</span>
              </div>
            </Link>

            <Link
              href="/data/sppg"
              onClick={() => setKartuTerpilih(null)}
              className="flex items-center gap-3 rounded-2xl border bg-card p-3.5 transition hover:border-primary hover:shadow-sm"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UtensilsCrossed className="size-5" />
              </span>
              <div>
                <span className="block font-bold text-sm text-foreground">Direktori Dapur SPPG</span>
                <span className="text-xs text-muted-foreground">Cek izin sanitasi & skor risiko</span>
              </div>
            </Link>

            <Link
              href="/insight"
              onClick={() => setKartuTerpilih(null)}
              className="flex items-center gap-3 rounded-2xl border bg-card p-3.5 transition hover:border-primary hover:shadow-sm"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Radar className="size-5" />
              </span>
              <div>
                <span className="block font-bold text-sm text-foreground">Peta Risiko Wilayah</span>
                <span className="text-xs text-muted-foreground">Analisis prioritas kota</span>
              </div>
            </Link>

            <Link
              href="/data/unduh"
              onClick={() => setKartuTerpilih(null)}
              className="flex items-center gap-3 rounded-2xl border bg-card p-3.5 transition hover:border-primary hover:shadow-sm"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BarChart3 className="size-5" />
              </span>
              <div>
                <span className="block font-bold text-sm text-foreground">Unduh Data Terbuka</span>
                <span className="text-xs text-muted-foreground">Dataset resmi CSV & API</span>
              </div>
            </Link>
          </div>
        </div>
      ),
    },
  ];

  const hasilFilter = useMemo(() => {
    const q = kueri.trim().toLowerCase();
    return DAFTAR_KARTU.filter((k) => {
      const cocokKategori = kategoriAktif === "semua" || k.kategori === kategoriAktif;
      if (!cocokKategori) return false;
      if (!q) return true;
      return (
        k.judul.toLowerCase().includes(q) ||
        k.ringkasan.toLowerCase().includes(q) ||
        k.kataKunci.some((kunci) => kunci.toLowerCase().includes(q))
      );
    });
  }, [kueri, kategoriAktif]);

  return (
    <div className="space-y-8">
      {/* Search Bar & Filter Pills */}
      <div className="space-y-4 rounded-3xl border bg-card/90 backdrop-blur-md p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex h-12 flex-1 items-center gap-3 rounded-2xl border border-input bg-background px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition">
            <Search className="size-5 text-muted-foreground shrink-0" aria-hidden />
            <input
              type="text"
              value={kueri}
              onChange={(e) => setKueri(e.target.value)}
              placeholder="Cari panduan (contoh: cara lapor, rumus skor risiko, masa sanggah, bukti foto, keracunan...)"
              className="h-full w-full bg-transparent text-sm sm:text-base placeholder:text-muted-foreground/70 focus:outline-none"
            />
            {kueri && (
              <button
                type="button"
                onClick={() => setKueri("")}
                className="text-xs text-muted-foreground hover:text-foreground font-medium px-2 py-1 rounded-md"
              >
                Reset
              </button>
            )}
          </label>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar" role="tablist">
          {KATEGORI.map((kat) => (
            <button
              key={kat.id}
              role="tab"
              aria-selected={kategoriAktif === kat.id}
              onClick={() => setKategoriAktif(kat.id)}
              className={cn(
                "inline-flex h-9 items-center rounded-full px-4 text-xs font-semibold whitespace-nowrap transition-all",
                kategoriAktif === kat.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {kat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Kartu Kotakan Dashboard Rapi */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {hasilFilter.map((kartu) => {
          const Ikon = kartu.ikon;
          return (
            <div
              key={kartu.id}
              onClick={() => setKartuTerpilih(kartu)}
              className={cn(
                "group cursor-pointer rounded-3xl border bg-card/90 backdrop-blur-md p-5 sm:p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between",
                kartu.warnaBorder
              )}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "flex size-12 items-center justify-center rounded-2xl transition group-hover:scale-105",
                      kartu.warnaBg
                    )}
                  >
                    <Ikon className={cn("size-6", kartu.warnaAksen)} aria-hidden />
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition group-hover:opacity-100">
                    Buka Panduan <ArrowRight className="size-3.5" />
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                    {kartu.judul}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {kartu.ringkasan}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {kartu.badgeRingkas.map((b) => (
                    <span
                      key={b}
                      className="rounded-lg bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t flex items-center justify-between text-xs font-bold text-foreground/80 group-hover:text-primary">
                <span>Klik untuk baca panduan</span>
                <span className="flex size-7 items-center justify-center rounded-full bg-muted group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <ArrowRight className="size-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {hasilFilter.length === 0 && (
        <div className="rounded-3xl border border-dashed p-12 text-center text-muted-foreground">
          <BookOpen className="mx-auto size-10 text-muted-foreground/50 mb-3" />
          <p className="text-base font-semibold text-foreground">Topik tidak ditemukan</p>
          <p className="text-xs mt-1">Coba gunakan kata kunci lain seperti &quot;lapor&quot;, &quot;risiko&quot;, &quot;foto&quot;, atau &quot;tiket&quot;.</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => { setKueri(""); setKategoriAktif("semua"); }}>
            Tampilkan Semua Panduan
          </Button>
        </div>
      )}

      {/* MODAL POP-UP DETAIL PANDUAN (SELALU SCROLL KE PALING ATAS SAAT DIBUKA) */}
      <Dialog open={!!kartuTerpilih} onOpenChange={(buka) => !buka && setKartuTerpilih(null)}>
        {kartuTerpilih && (
          <DialogContent
            initialFocus={false}
            className="sm:max-w-2xl max-h-[88vh] p-0 rounded-3xl overflow-hidden flex flex-col"
            showCloseButton={true}
          >
            {/* Header Dialog Tetap di Atas */}
            <DialogHeader className="p-6 sm:p-7 border-b bg-muted/20 shrink-0">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex size-11 items-center justify-center rounded-2xl shrink-0",
                    kartuTerpilih.warnaBg
                  )}
                >
                  <kartuTerpilih.ikon className={cn("size-6", kartuTerpilih.warnaAksen)} aria-hidden />
                </span>
                <div>
                  <DialogTitle className="text-xl sm:text-2xl font-extrabold text-foreground">
                    {kartuTerpilih.judul}
                  </DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    {kartuTerpilih.ringkasan}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Container Konten yang Dapat Discroll dan Selalu Mulai dari Puncak */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-4"
            >
              {kartuTerpilih.kontenModal}
            </div>

            {/* Footer Dialog Tetap di Bawah */}
            <div className="p-4 sm:p-5 border-t bg-muted/10 shrink-0 flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl font-semibold"
                onClick={() => setKartuTerpilih(null)}
              >
                Tutup Panduan
              </Button>
              {kartuTerpilih.tautanAksi && (
                <Button
                  size="lg"
                  className="rounded-xl font-bold"
                  render={<Link href={kartuTerpilih.tautanAksi.href} onClick={() => setKartuTerpilih(null)} />}
                >
                  {kartuTerpilih.tautanAksi.label} <ArrowRight className="size-4 ml-1.5" />
                </Button>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
