"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Camera,
  Clock,
  Cpu,
  HelpCircle,
  Lock,
  Megaphone,
  RotateCcw,
  Scale,
  Search,
  ShieldCheck,
  Siren,
  Users,
  Utensils,
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
  kategori: "lapor" | "aktor" | "metrik" | "keamanan" | "status" | "istilah";
  judul: string;
  ringkasan: string;
  ikon: LucideIcon;
  warnaAksen: string;
  warnaBg: string;
  kontenModal: React.ReactNode;
  tautanAksi?: { href: string; label: string };
  kataKunci: string[];
}

const KATEGORI = [
  { id: "semua", label: "Semua" },
  { id: "istilah", label: "Istilah Teknis" },
  { id: "lapor", label: "Lapor" },
  { id: "aktor", label: "Instansi" },
  { id: "metrik", label: "Risiko & SAW" },
  { id: "keamanan", label: "ML & Bukti" },
  { id: "status", label: "SLA" },
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
        if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [kartuTerpilih]);

  const DAFTAR_KARTU: ItemPanduan[] = [
    {
      id: "cara-melapor",
      kategori: "lapor",
      judul: "Alur Pelaporan",
      ringkasan: "Langkah melapor dan mendapatkan kode tiket.",
      ikon: Megaphone,
      warnaAksen: "text-primary",
      warnaBg: "bg-secondary",
      kataKunci: ["lapor", "foto", "bukti", "anonim", "rahasia", "tiket", "keracunan", "darurat"],
      tautanAksi: { href: "/lapor", label: "Buka Form Lapor" },
      kontenModal: (
        <div className="space-y-2.5 text-foreground">
          {[
            ["1. Pilih Masalah & Sekolah", "Tentukan kategori masalah dan sekolah penerima."],
            ["2. Unggah Bukti Foto", "Lampirkan minimal 1 foto kondisi makanan/kejadian."],
            ["3. Pilih Privasi", "Rahasia (bawaan), Publik, atau Anonim."],
            ["4. Simpan Kode Tiket", "Gunakan kode tiket untuk melacak progres."],
          ].map(([judul, sub]) => (
            <div key={judul} className="rounded-xl border bg-card p-3">
              <p className="font-bold text-sm">{judul}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
          <div className="rounded-xl border border-darurat/30 bg-darurat-lembut p-3 flex items-center gap-2.5">
            <Siren className="size-4 text-darurat shrink-0" />
            <p className="text-xs font-medium">
              <strong>Keracunan:</strong> Hubungi <strong>119</strong> dulu, lalu lapor untuk prioritas darurat (≤ 6 jam).
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "pihak-penanggung-jawab",
      kategori: "aktor",
      judul: "Peran Instansi",
      ringkasan: "Tugas Verifikator, SPPG, Dinkes, dan BGN.",
      ikon: Users,
      warnaAksen: "text-primary",
      warnaBg: "bg-secondary",
      kataKunci: ["aktor", "pihak", "verifikator", "sppg", "dinkes", "bgn", "wewenang", "instansi"],
      tautanAksi: { href: "/tentang", label: "Tentang" },
      kontenModal: (
        <div className="grid gap-2.5 sm:grid-cols-2 text-foreground">
          <div className="rounded-xl border bg-card p-3 space-y-1">
            <p className="font-bold text-sm flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-primary" /> Verifikator
            </p>
            <p className="text-xs text-muted-foreground">Memeriksa keaslian bukti sebelum diteruskan.</p>
          </div>
          <div className="rounded-xl border bg-card p-3 space-y-1">
            <p className="font-bold text-sm flex items-center gap-1.5">
              <Utensils className="size-4 text-risiko-sedang" /> Dapur SPPG
            </p>
            <p className="text-xs text-muted-foreground">Memperbaiki layanan dan mengunggah bukti perbaikan.</p>
          </div>
          <div className="rounded-xl border bg-card p-3 space-y-1">
            <p className="font-bold text-sm flex items-center gap-1.5">
              <Building2 className="size-4 text-risiko-tinggi" /> Dinas Kesehatan
            </p>
            <p className="text-xs text-muted-foreground">Investigasi keracunan, uji lab, dan izin SLHS.</p>
          </div>
          <div className="rounded-xl border bg-card p-3 space-y-1">
            <p className="font-bold text-sm flex items-center gap-1.5">
              <Clock className="size-4 text-info" /> Korwil BGN
            </p>
            <p className="text-xs text-muted-foreground">Mengawasi batas waktu (SLA) seluruh SPPG.</p>
          </div>
        </div>
      ),
    },
    {
      id: "arti-angka-label",
      kategori: "metrik",
      judul: "Indeks Risiko (SAW)",
      ringkasan: "Cara hitung skor 0–100 penentu urutan sidak dapur.",
      ikon: HelpCircle,
      warnaAksen: "text-info",
      warnaBg: "bg-info-lembut",
      kataKunci: ["metrik", "skor", "risiko", "slhs", "saw", "arti", "kamus", "bobot"],
      tautanAksi: { href: "/metodologi", label: "Detail Rumus" },
      kontenModal: (
        <div className="space-y-2.5 text-foreground">
          <div className="rounded-xl border bg-card p-3 space-y-1">
            <p className="font-bold text-sm">Apa itu Metode SAW?</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Simple Additive Weighting (SAW)</strong> menjumlahkan 5 kriteria masalah untuk memberi skor 0–100 pada tiap dapur SPPG. Makin tinggi skornya, makin diprioritaskan untuk disidak.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-3 space-y-2">
            <p className="font-bold text-sm">5 Bobot Penilaian SAW</p>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <div className="rounded-lg bg-muted/60 px-2.5 py-1.5 flex justify-between">
                <span>Laporan Warga</span>
                <strong className="text-primary">35%</strong>
              </div>
              <div className="rounded-lg bg-muted/60 px-2.5 py-1.5 flex justify-between">
                <span>Kasus Keracunan</span>
                <strong className="text-risiko-tinggi">25%</strong>
              </div>
              <div className="rounded-lg bg-muted/60 px-2.5 py-1.5 flex justify-between">
                <span>Izin SLHS</span>
                <strong className="text-info">15%</strong>
              </div>
              <div className="rounded-lg bg-muted/60 px-2.5 py-1.5 flex justify-between">
                <span>Terlambat SLA</span>
                <strong className="text-risiko-sedang">15%</strong>
              </div>
              <div className="rounded-lg bg-muted/60 px-2.5 py-1.5 flex justify-between col-span-2">
                <span>Kepuasan Sekolah / Orang Tua</span>
                <strong className="text-primary">10%</strong>
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-3 space-y-2">
            <p className="font-bold text-sm">Kategori Skor Risiko (0–100)</p>
            <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
              <span className="rounded-md bg-risiko-rendah-lembut px-2 py-0.5 text-risiko-rendah">
                0–39 Rendah (Aman)
              </span>
              <span className="rounded-md bg-risiko-sedang-lembut px-2 py-0.5 text-risiko-sedang">
                40–69 Sedang (Waspada)
              </span>
              <span className="rounded-md bg-risiko-tinggi-lembut px-2 py-0.5 text-risiko-tinggi">
                70–100 Tinggi (Sidak Cepat)
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "jaminan-anti-manipulasi",
      kategori: "keamanan",
      judul: "Verifikasi ML & Bukti",
      ringkasan: "Cara kerja deteksi keaslian laporan dan bukti foto.",
      ikon: Cpu,
      warnaAksen: "text-primary",
      warnaBg: "bg-secondary",
      kataKunci: ["manipulasi", "foto", "sanggah", "bap", "dinkes", "rating", "keamanan", "ml", "ai", "ann", "exif", "gps"],
      tautanAksi: { href: "/metodologi#kredibilitas", label: "Skor Kredibilitas" },
      kontenModal: (
        <div className="space-y-2.5 text-foreground">
          <div className="rounded-xl border bg-card p-3 space-y-1">
            <p className="font-bold text-sm flex items-center gap-1.5">
              <Cpu className="size-4 text-primary" /> Apa fungsi ML (Machine Learning)?
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Model jaringan saraf tiruan (<strong>ANN</strong>) memeriksa kecocokan isi keluhan, waktu pengambilan foto, dan titik GPS sekolah untuk memberi skor keaslian awal bagi petugas verifikator.
            </p>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <div className="rounded-xl border bg-card p-3 space-y-1">
              <p className="font-bold text-sm flex items-center gap-1.5">
                <Camera className="size-4 text-primary" /> Bukti Foto Wajib
              </p>
              <p className="text-xs text-muted-foreground">Wajib ada foto saat melapor & saat dapur menutup kasus.</p>
            </div>
            <div className="rounded-xl border bg-card p-3 space-y-1">
              <p className="font-bold text-sm flex items-center gap-1.5">
                <RotateCcw className="size-4 text-primary" /> Buka Ulang Kasus
              </p>
              <p className="text-xs text-muted-foreground">Pelapor bisa membuka ulang dalam 14 hari jika belum tuntas.</p>
            </div>
            <div className="rounded-xl border bg-card p-3 space-y-1">
              <p className="font-bold text-sm flex items-center gap-1.5">
                <Lock className="size-4 text-primary" /> Kunci Kasus Darurat
              </p>
              <p className="text-xs text-muted-foreground">Kasus keracunan wajib melalui pemeriksaan Dinkes.</p>
            </div>
            <div className="rounded-xl border bg-card p-3 space-y-1">
              <p className="font-bold text-sm flex items-center gap-1.5">
                <Scale className="size-4 text-primary" /> Jejak Audit
              </p>
              <p className="text-xs text-muted-foreground">Semua perubahan status tercatat permanen di timeline.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "status-tiket-sla",
      kategori: "status",
      judul: "Status & Batas Waktu (SLA)",
      ringkasan: "5 tahap penanganan dan batas waktu wajib instansi.",
      ikon: Clock,
      warnaAksen: "text-risiko-sedang",
      warnaBg: "bg-risiko-sedang-lembut",
      kataKunci: ["status", "sla", "tiket", "lacak", "diterima", "diverifikasi", "selesai"],
      tautanAksi: { href: "/lacak", label: "Lacak Tiket" },
      kontenModal: (
        <div className="space-y-2 text-foreground text-xs sm:text-sm">
          <div className="rounded-xl border bg-card p-3 space-y-0.5">
            <p className="font-bold text-sm">Apa itu SLA?</p>
            <p className="text-xs text-muted-foreground">
              <strong>Service Level Agreement (SLA)</strong> adalah batas waktu maksimal bagi petugas untuk merespons. Jika lewat, kasus otomatis ditandai merah di Papan Akuntabilitas.
            </p>
          </div>
          {[
            ["1. Diterima (Verifikasi)", "Maks. 6 jam (Darurat) – 72 jam"],
            ["2. Diverifikasi (Penerusan)", "Maks. 2 jam (Darurat) – 48 jam"],
            ["3. Diteruskan (Tanggapan)", "Maks. 6 jam (Darurat) – 7 hari"],
            ["4. Ditindaklanjuti (Selesai)", "Maks. 3 hari (Darurat) – 30 hari"],
            ["5. Selesai / Buka Ulang", "Dapat dinilai atau dibuka ulang (14 hari)"],
          ].map(([tahap, batas]) => (
            <div key={tahap} className="flex items-center justify-between rounded-xl border bg-card p-2.5">
              <span className="font-bold">{tahap}</span>
              <span className="text-muted-foreground font-mono text-xs">{batas}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "kamus-istilah-teknis",
      kategori: "istilah",
      judul: "Kamus Istilah Singkat",
      ringkasan: "Arti SPPG, SLHS, SAW, ML, SLA, dan GPS/EXIF.",
      ikon: BookOpen,
      warnaAksen: "text-primary",
      warnaBg: "bg-secondary",
      kataKunci: ["kamus", "istilah", "saw", "ml", "ai", "ann", "sppg", "slhs", "sla", "exif", "gps", "dss"],
      tautanAksi: { href: "/metodologi", label: "Buka Metodologi" },
      kontenModal: (
        <div className="space-y-2 text-foreground">
          {[
            ["SPPG (Dapur MBG)", "Sentra Pelayanan Pemenuhan Gizi; dapur penyedia yang memasak dan mengirim paket makan ke sekolah."],
            ["SLHS (Izin Sanitasi)", "Sertifikat Laik Higiene Sanitasi dari Dinas Kesehatan yang menyatakan dapur bersih dan layak."],
            ["SAW (Hitung Risiko)", "Rumus penjumlahan berbobot (0–100) untuk menentukan dapur mana yang paling butuh disidak lebih dulu."],
            ["ML / ANN (Deteksi Bukti)", "Algoritma pemeriksa otomatis yang mengecek kecocokan teks laporan, waktu foto, dan lokasi GPS."],
            ["SLA (Batas Waktu)", "Standar waktu maksimal instansi wajib memverifikasi dan menanggapi laporan (misal: keracunan maks. 6 jam)."],
            ["EXIF & GPS Foto", "Catatan waktu dan lokasi otomatis pada foto kamera untuk memvalidasi keaslian kejadian (dihapus sebelum tampil ke publik)."],
          ].map(([istilah, arti]) => (
            <div key={istilah} className="rounded-xl border bg-card p-3 space-y-0.5">
              <p className="font-bold text-xs sm:text-sm text-primary">{istilah}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{arti}</p>
            </div>
          ))}
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (bukaParam) {
      const target = DAFTAR_KARTU.find(
        (k) =>
          k.id === bukaParam ||
          (bukaParam === "lapor-masalah" && k.id === "cara-melapor") ||
          (bukaParam === "alur_lapor" && k.id === "cara-melapor")
      );
      if (target) setKartuTerpilih(target);
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {kat.label}
            </button>
          ))}
        </div>

        <label className="flex h-9 w-full sm:w-64 items-center gap-2 rounded-xl border border-input bg-card px-3 focus-within:border-primary transition">
          <Search className="size-3.5 text-muted-foreground shrink-0" aria-hidden />
          <input
            type="text"
            value={kueri}
            onChange={(e) => setKueri(e.target.value)}
            placeholder="Cari topik..."
            className="h-full w-full bg-transparent text-xs placeholder:text-muted-foreground/60 focus:outline-none"
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {hasilFilter.map((kartu) => {
          const Ikon = kartu.ikon;
          return (
            <button
              key={kartu.id}
              type="button"
              onClick={() => setKartuTerpilih(kartu)}
              className="group rounded-2xl border bg-card p-4 text-left transition-all hover:border-primary/50 hover:shadow-xs flex items-start gap-3.5 cursor-pointer"
            >
              <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", kartu.warnaBg)}>
                <Ikon className={cn("size-5", kartu.warnaAksen)} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {kartu.judul}
                  </h3>
                  <ArrowRight className="size-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition" />
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{kartu.ringkasan}</p>
              </div>
            </button>
          );
        })}
      </div>

      {hasilFilter.length === 0 && (
        <div className="rounded-2xl border border-dashed p-6 text-center text-muted-foreground">
          <p className="text-xs font-semibold text-foreground">Topik tidak ditemukan</p>
        </div>
      )}

      <Dialog open={!!kartuTerpilih} onOpenChange={(buka) => !buka && setKartuTerpilih(null)}>
        {kartuTerpilih && (
          <DialogContent
            initialFocus={false}
            className="sm:max-w-lg max-h-[85vh] p-0 rounded-3xl overflow-hidden flex flex-col"
            showCloseButton={true}
          >
            <DialogHeader className="p-5 border-b bg-muted/15 shrink-0">
              <div className="flex items-center gap-3">
                <span className={cn("flex size-9 items-center justify-center rounded-xl shrink-0", kartuTerpilih.warnaBg)}>
                  <kartuTerpilih.ikon className={cn("size-4.5", kartuTerpilih.warnaAksen)} aria-hidden />
                </span>
                <div>
                  <DialogTitle className="text-base font-extrabold text-foreground">
                    {kartuTerpilih.judul}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    {kartuTerpilih.ringkasan}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-5 space-y-2.5">
              {kartuTerpilih.kontenModal}
            </div>

            <div className="p-3.5 border-t bg-muted/10 shrink-0 flex items-center justify-between gap-3">
              <Button variant="outline" size="sm" className="rounded-xl font-semibold text-xs" onClick={() => setKartuTerpilih(null)}>
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
