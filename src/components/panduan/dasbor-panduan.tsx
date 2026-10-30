"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Camera,
  CheckCircle2,
  Clock,
  Compass,
  EyeOff,
  Globe,
  HelpCircle,
  Lock,
  Megaphone,
  Radar,
  RotateCcw,
  Scale,
  School,
  Search,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sliders,
  Sparkles,
  Users,
  Utensils,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
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
  { id: "semua", label: "Semua" },
  { id: "lapor", label: "Alur Lapor" },
  { id: "aktor", label: "Instansi" },
  { id: "metrik", label: "Indeks Risiko" },
  { id: "keamanan", label: "Anti-Manipulasi" },
  { id: "status", label: "Status & SLA" },
  { id: "pintasan", label: "Pintasan" },
] as const;

export function DasborPanduan() {
  const searchParams = useSearchParams();
  const bukaParam = searchParams.get("buka") || searchParams.get("topik");

  const [kueri, setKueri] = useState("");
  const [kategoriAktif, setKategoriAktif] = useState<string>("semua");
  const [kartuTerpilih, setKartuTerpilih] = useState<ItemPanduan | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
    // 1. CARA MELAPOR
    {
      id: "cara-melapor",
      kategori: "lapor",
      judul: "Alur Pelaporan",
      ringkasan: "4 langkah mudah melapor dengan foto bukti & kode tiket unik.",
      badgeRingkas: ["4 Langkah", "Kode Tiket"],
      ikon: Megaphone,
      warnaAksen: "text-emerald-700 dark:text-emerald-400",
      warnaBg: "bg-emerald-500/10",
      warnaBorder: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
      kataKunci: ["lapor", "foto", "bukti", "anonim", "rahasia", "tiket", "keracunan", "darurat"],
      tautanAksi: { href: "/lapor", label: "Formulir Lapor" },
      kontenModal: (
        <div className="space-y-3 text-foreground">
          {/* LANGKAH 1 */}
          <div className="rounded-2xl border bg-card p-3.5 flex items-start gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-xs font-black text-white">
              1
            </span>
            <div className="space-y-0.5">
              <h4 className="font-bold text-sm text-foreground">Buka Menu Lapor</h4>
              <p className="text-xs text-muted-foreground">
                Klik tombol &quot;Lapor Masalah&quot; di navigasi atas atau beranda.
              </p>
            </div>
          </div>

          {/* LANGKAH 2 */}
          <div className="rounded-2xl border bg-card p-3.5 flex items-start gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-xs font-black text-white">
              2
            </span>
            <div className="space-y-0.5">
              <h4 className="font-bold text-sm text-foreground">Unggah Foto & Pilih Sekolah</h4>
              <p className="text-xs text-muted-foreground">
                Sertakan dokumentasi menu bermasalah dan pilih sekolah penerima MBG.
              </p>
            </div>
          </div>

          {/* LANGKAH 3 */}
          <div className="rounded-2xl border bg-card p-3.5 flex items-start gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-xs font-black text-white">
              3
            </span>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-foreground">Pilih Mode Privasi</h4>
              <p className="text-xs text-muted-foreground">
                Pilih identitas: <strong>Nama Terbuka</strong>, <strong>Rahasia</strong> (hanya verifikator), atau <strong>Anonim</strong>.
              </p>
            </div>
          </div>

          {/* LANGKAH 4 */}
          <div className="rounded-2xl border bg-card p-3.5 flex items-start gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-xs font-black text-white">
              4
            </span>
            <div className="space-y-0.5">
              <h4 className="font-bold text-sm text-foreground">Simpan Kode Tiket</h4>
              <p className="text-xs text-muted-foreground">
                Gunakan kode tiket unik (misal #MBG-7821) untuk memantau proses tindak lanjut.
              </p>
            </div>
          </div>

          {/* Banner Darurat */}
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 flex items-center gap-3 text-rose-950 dark:text-rose-200">
            <Siren className="size-5 text-rose-600 shrink-0" />
            <div className="text-xs">
              <strong className="block text-foreground">Dugaan Keracunan Pangan?</strong>
              <span className="text-muted-foreground">Pilih kategori keracunan untuk penanganan medis darurat prioritas 2 jam.</span>
            </div>
          </div>
        </div>
      ),
    },

    // 2. PIHAK PENANGGUNG JAWAB
    {
      id: "pihak-penanggung-jawab",
      kategori: "aktor",
      judul: "Peran & Instansi",
      ringkasan: "Pembagian tugas Verifikator, Dapur SPPG, Dinkes, dan Korwil BGN.",
      badgeRingkas: ["4 Instansi", "Otomatis"],
      ikon: Users,
      warnaAksen: "text-teal-700 dark:text-teal-400",
      warnaBg: "bg-teal-500/10",
      warnaBorder: "hover:border-teal-500/50 hover:shadow-teal-500/10",
      kataKunci: ["aktor", "pihak", "verifikator", "sppg", "dinkes", "bgn", "wewenang", "instansi"],
      tautanAksi: { href: "/tentang", label: "Tentang Tata Kelola" },
      kontenModal: (
        <div className="grid gap-2.5 sm:grid-cols-2 text-foreground">
          <div className="rounded-2xl border bg-card p-3.5 space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-teal-600" />
              <h4 className="font-bold text-sm">Verifikator Wilayah</h4>
            </div>
            <p className="text-xs text-muted-foreground">
              Memvalidasi foto bukti dan memastikan laporan bebas dari hoaks/spam sebelum diteruskan.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-3.5 space-y-1">
            <div className="flex items-center gap-2">
              <Utensils className="size-4 text-amber-600" />
              <h4 className="font-bold text-sm">Dapur Mitra SPPG</h4>
            </div>
            <p className="text-xs text-muted-foreground">
              Memperbaiki menu makanan dan mengunggah foto bukti perbaikan fisik ke sistem.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-3.5 space-y-1">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-rose-600" />
              <h4 className="font-bold text-sm">Dinas Kesehatan</h4>
            </div>
            <p className="text-xs text-muted-foreground">
              Investigasi medis dugaan keracunan, pengujian laboratorium, dan penerbitan izin SLHS.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-3.5 space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-indigo-600" />
              <h4 className="font-bold text-sm">Korwil BGN</h4>
            </div>
            <p className="text-xs text-muted-foreground">
              Mengawasi kepatuhan batas waktu respon (SLA) dan koordinasi antarinstansi.
            </p>
          </div>
        </div>
      ),
    },

    // 3. KAMUS ANGKA & LABEL
    {
      id: "arti-angka-label",
      kategori: "metrik",
      judul: "Indeks Risiko & Label",
      ringkasan: "Arti skor risiko 0–100, sertifikat SLHS, dan sinyal lonjakan kasus.",
      badgeRingkas: ["Skor 0–100", "Izin SLHS"],
      ikon: HelpCircle,
      warnaAksen: "text-blue-700 dark:text-blue-400",
      warnaBg: "bg-blue-500/10",
      warnaBorder: "hover:border-blue-500/50 hover:shadow-blue-500/10",
      kataKunci: ["metrik", "skor", "risiko", "slhs", "saw", "arti", "kamus"],
      tautanAksi: { href: "/metodologi", label: "Rumus Metodologi" },
      kontenModal: (
        <div className="space-y-3 text-foreground">
          <div className="rounded-2xl border bg-card p-3.5 space-y-1.5">
            <h4 className="font-bold text-sm flex items-center justify-between">
              <span>Indeks Risiko SPPG (Skor 0–100)</span>
              <span className="text-xs text-muted-foreground font-normal">Metode SAW</span>
            </h4>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-emerald-700 dark:text-emerald-400">
                0–34,9 · Rendah (Aman)
              </span>
              <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-amber-700 dark:text-amber-400">
                35–59,9 · Sedang (Waspada)
              </span>
              <span className="rounded-full bg-rose-500/15 px-2.5 py-0.5 text-rose-700 dark:text-rose-400">
                60–100 · Tinggi (Evaluasi)
              </span>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-3.5 space-y-1.5">
            <h4 className="font-bold text-sm">Sertifikat SLHS (Dinkes)</h4>
            <p className="text-xs text-muted-foreground">
              Sertifikat Laik Higiene Sanitasi resmi untuk memastikan standar kebersihan dapur dan peralatan makan.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-3.5 space-y-1.5">
            <h4 className="font-bold text-sm">Sinyal Peringatan Dini</h4>
            <p className="text-xs text-muted-foreground">
              Aktif jika ada lonjakan aduan &gt;3× rata-rata harian dalam 24 jam untuk mendeteksi wabah insidental secara dini.
            </p>
          </div>
        </div>
      ),
    },

    // 4. JAMINAN ANTI-MANIPULASI
    {
      id: "jaminan-anti-manipulasi",
      kategori: "keamanan",
      judul: "Anti-Manipulasi",
      ringkasan: "Validasi foto wajib, masa sanggah 3 hari, dan kunci BAP Dinkes.",
      badgeRingkas: ["Foto Fisik", "Kunci BAP"],
      ikon: ShieldCheck,
      warnaAksen: "text-purple-700 dark:text-purple-400",
      warnaBg: "bg-purple-500/10",
      warnaBorder: "hover:border-purple-500/50 hover:shadow-purple-500/10",
      kataKunci: ["manipulasi", "foto", "sanggah", "bap", "dinkes", "rating", "keamanan"],
      tautanAksi: { href: "/lacak/akuntabilitas", label: "Papan Akuntabilitas" },
      kontenModal: (
        <div className="grid gap-2.5 sm:grid-cols-2 text-foreground">
          <div className="rounded-2xl border bg-card p-3.5 space-y-1">
            <div className="flex items-center gap-2">
              <Camera className="size-4 text-primary" />
              <h4 className="font-bold text-sm">Foto Fisik Wajib</h4>
            </div>
            <p className="text-xs text-muted-foreground">
              Dapur wajib mengunggah foto perbaikan nyata sebelum status kasus dapat diselesaikan.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-3.5 space-y-1">
            <div className="flex items-center gap-2">
              <RotateCcw className="size-4 text-primary" />
              <h4 className="font-bold text-sm">Masa Sanggah 3 Hari</h4>
            </div>
            <p className="text-xs text-muted-foreground">
              Pelapor berhak mengonfirmasi kepuasan atau membuka sanggahan jika masalah belum tuntas.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-3.5 space-y-1">
            <div className="flex items-center gap-2">
              <Lock className="size-4 text-primary" />
              <h4 className="font-bold text-sm">Kunci BAP Dinkes</h4>
            </div>
            <p className="text-xs text-muted-foreground">
              Kasus keracunan hanya dapat ditutup setelah Berita Acara Pemeriksaan (BAP) resmi diterbitkan.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-3.5 space-y-1">
            <div className="flex items-center gap-2">
              <Scale className="size-4 text-primary" />
              <h4 className="font-bold text-sm">Audit Trail Permanen</h4>
            </div>
            <p className="text-xs text-muted-foreground">
              Setiap catatan waktu dan perubahan status tersimpan otomatis tanpa bisa dimanipulasi.
            </p>
          </div>
        </div>
      ),
    },

    // 5. STATUS TIKET & SLA
    {
      id: "status-tiket-sla",
      kategori: "status",
      judul: "Status Tiket & SLA",
      ringkasan: "5 fase penanganan tiket dan batas waktu standar layanan resmi.",
      badgeRingkas: ["5 Status", "Batas SLA"],
      ikon: Clock,
      warnaAksen: "text-amber-700 dark:text-amber-400",
      warnaBg: "bg-amber-500/10",
      warnaBorder: "hover:border-amber-500/50 hover:shadow-amber-500/10",
      kataKunci: ["status", "sla", "tiket", "lacak", "diterima", "diverifikasi", "selesai"],
      tautanAksi: { href: "/lacak", label: "Lacak Tiket" },
      kontenModal: (
        <div className="space-y-2 text-foreground">
          <div className="flex items-center justify-between rounded-xl border bg-card p-3 text-xs sm:text-sm">
            <span className="font-bold">1. Diterima</span>
            <span className="text-muted-foreground font-mono">Maks. 6 Jam (Darurat: 2 Jam)</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border bg-card p-3 text-xs sm:text-sm">
            <span className="font-bold">2. Diverifikasi</span>
            <span className="text-muted-foreground font-mono">Maks. 2 Jam (Oleh Tim Netral)</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border bg-card p-3 text-xs sm:text-sm">
            <span className="font-bold">3. Diteruskan</span>
            <span className="text-muted-foreground font-mono">Maks. 6 Jam ke SPPG / Dinkes</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border bg-card p-3 text-xs sm:text-sm">
            <span className="font-bold">4. Ditindaklanjuti</span>
            <span className="text-muted-foreground font-mono">Maks. 3 Hari Perbaikan Dapur</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 p-3 text-xs sm:text-sm font-bold text-primary">
            <span>5. Selesai</span>
            <span className="font-mono">3 Hari Hak Sanggah Pelapor</span>
          </div>
        </div>
      ),
    },

    // 6. PETA FITUR
    {
      id: "peta-fitur-situs",
      kategori: "pintasan",
      judul: "Pintasan Modul",
      ringkasan: "Akses cepat ke pencarian sekolah, direktori SPPG, dan data terbuka.",
      badgeRingkas: ["Data Terbuka", "Peta Risiko"],
      ikon: Compass,
      warnaAksen: "text-cyan-700 dark:text-cyan-400",
      warnaBg: "bg-cyan-500/10",
      warnaBorder: "hover:border-cyan-500/50 hover:shadow-cyan-500/10",
      kataKunci: ["pintasan", "fitur", "cari", "sekolah", "data", "unduh"],
      kontenModal: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <Link
            href="/cari-sekolah"
            onClick={() => setKartuTerpilih(null)}
            className="flex items-center gap-3 rounded-2xl border bg-card p-3 transition hover:border-primary"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <School className="size-4" />
            </span>
            <div>
              <span className="block font-bold text-xs text-foreground">Cari Sekolah</span>
              <span className="text-[11px] text-muted-foreground">Ketahui SPPG mitra penyuplai</span>
            </div>
          </Link>

          <Link
            href="/data/sppg"
            onClick={() => setKartuTerpilih(null)}
            className="flex items-center gap-3 rounded-2xl border bg-card p-3 transition hover:border-primary"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UtensilsCrossed className="size-4" />
            </span>
            <div>
              <span className="block font-bold text-xs text-foreground">Direktori Dapur SPPG</span>
              <span className="text-[11px] text-muted-foreground">Cek izin sanitasi & skor risiko</span>
            </div>
          </Link>

          <Link
            href="/insight"
            onClick={() => setKartuTerpilih(null)}
            className="flex items-center gap-3 rounded-2xl border bg-card p-3 transition hover:border-primary"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Radar className="size-4" />
            </span>
            <div>
              <span className="block font-bold text-xs text-foreground">Peta Risiko SAW</span>
              <span className="text-[11px] text-muted-foreground">Analisis zonasi risiko wilayah</span>
            </div>
          </Link>

          <Link
            href="/data/unduh"
            onClick={() => setKartuTerpilih(null)}
            className="flex items-center gap-3 rounded-2xl border bg-card p-3 transition hover:border-primary"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BarChart3 className="size-4" />
            </span>
            <div>
              <span className="block font-bold text-xs text-foreground">Unduh Data Terbuka</span>
              <span className="text-[11px] text-muted-foreground">Ekspor dataset CSV & JSON</span>
            </div>
          </Link>
        </div>
      ),
    },
  ];

  // Buka otomatis kartu panduan jika diakses lewat tautan eksternal
  useEffect(() => {
    if (bukaParam) {
      const target = DAFTAR_KARTU.find(
        (k) =>
          k.id === bukaParam ||
          (bukaParam === "lapor-masalah" && k.id === "cara-melapor") ||
          (bukaParam === "alur_lapor" && k.id === "cara-melapor")
      );
      if (target) {
        setKartuTerpilih(target);
      }
    }
  }, [bukaParam]);

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
    <div className="space-y-6">
      {/* Search Bar & Filter Pills Ringkas */}
      <div className="space-y-3 rounded-3xl border bg-card/80 backdrop-blur-sm p-4 sm:p-5">
        <label className="flex h-11 items-center gap-2.5 rounded-2xl border border-input bg-background px-3.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition">
          <Search className="size-4 text-muted-foreground shrink-0" aria-hidden />
          <input
            type="text"
            value={kueri}
            onChange={(e) => setKueri(e.target.value)}
            placeholder="Cari panduan..."
            className="h-full w-full bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none"
          />
          {kueri && (
            <button
              type="button"
              onClick={() => setKueri("")}
              className="text-xs text-muted-foreground hover:text-foreground font-medium px-2 py-0.5 rounded-md cursor-pointer"
            >
              Reset
            </button>
          )}
        </label>

        {/* Filter Tabs Singkat */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar" role="tablist">
          {KATEGORI.map((kat) => (
            <button
              key={kat.id}
              role="tab"
              aria-selected={kategoriAktif === kat.id}
              onClick={() => setKategoriAktif(kat.id)}
              className={cn(
                "inline-flex h-8 items-center rounded-full px-3 text-xs font-semibold whitespace-nowrap transition cursor-pointer",
                kategoriAktif === kat.id
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {kat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Kartu Panduan Bersih */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hasilFilter.map((kartu) => {
          const Ikon = kartu.ikon;
          return (
            <div
              key={kartu.id}
              onClick={() => setKartuTerpilih(kartu)}
              className={cn(
                "group cursor-pointer rounded-2xl border bg-card p-4 sm:p-5 transition-all hover:border-primary/50 hover:shadow-xs flex flex-col justify-between space-y-3",
                kartu.warnaBorder
              )}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "flex size-10 items-center justify-center rounded-xl",
                      kartu.warnaBg
                    )}
                  >
                    <Ikon className={cn("size-5", kartu.warnaAksen)} aria-hidden />
                  </span>
                  <span className="flex size-6 items-center justify-center rounded-full bg-muted/60 text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <ArrowRight className="size-3" />
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {kartu.judul}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {kartu.ringkasan}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border/50">
                {kartu.badgeRingkas.map((b) => (
                  <span
                    key={b}
                    className="rounded-md bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {hasilFilter.length === 0 && (
        <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
          <p className="text-sm font-semibold text-foreground">Topik tidak ditemukan</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => { setKueri(""); setKategoriAktif("semua"); }}>
            Tampilkan Semua
          </Button>
        </div>
      )}

      {/* MODAL POP-UP DETAIL PANDUAN */}
      <Dialog open={!!kartuTerpilih} onOpenChange={(buka) => !buka && setKartuTerpilih(null)}>
        {kartuTerpilih && (
          <DialogContent
            initialFocus={false}
            className="sm:max-w-xl max-h-[85vh] p-0 rounded-3xl overflow-hidden flex flex-col"
            showCloseButton={true}
          >
            {/* Header Dialog */}
            <DialogHeader className="p-5 sm:p-6 border-b bg-muted/15 shrink-0">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-xl shrink-0",
                    kartuTerpilih.warnaBg
                  )}
                >
                  <kartuTerpilih.ikon className={cn("size-5", kartuTerpilih.warnaAksen)} aria-hidden />
                </span>
                <div>
                  <DialogTitle className="text-lg sm:text-xl font-extrabold text-foreground">
                    {kartuTerpilih.judul}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                    {kartuTerpilih.ringkasan}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Container Konten Ringkas */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3"
            >
              {kartuTerpilih.kontenModal}
            </div>

            {/* Footer Dialog */}
            <div className="p-4 border-t bg-muted/10 shrink-0 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl font-semibold text-xs"
                onClick={() => setKartuTerpilih(null)}
              >
                Tutup
              </Button>
              {kartuTerpilih.tautanAksi && (
                <Link
                  href={kartuTerpilih.tautanAksi.href}
                  onClick={() => setKartuTerpilih(null)}
                  className={cn(buttonVariants({ size: "sm" }), "rounded-xl font-bold text-xs")}
                >
                  {kartuTerpilih.tautanAksi.label} <ArrowRight className="size-3.5 ml-1" />
                </Link>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
