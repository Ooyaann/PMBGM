"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeAlert,
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
  Radar,
  RotateCcw,
  Scale,
  School,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InfoMetrik } from "@/components/ui/info-metrik";
import { cn } from "@/lib/utils";

interface KartuPanduan {
  id: string;
  kategori: "lapor" | "aktor" | "metrik" | "keamanan" | "status" | "pintasan";
  judul: string;
  subjudul: string;
  ikon: LucideIcon;
  warnaAksen: string;
  warnaBg: string;
  kontenUtama: React.ReactNode;
  tautan?: { href: string; label: string };
  kataKunci: string[];
}

const KATEGORI = [
  { id: "semua", label: "Semua Panduan" },
  { id: "lapor", label: "Tahapan Lapor" },
  { id: "aktor", label: "Pihak & Wewenang" },
  { id: "metrik", label: "Kamus Label & Metrik" },
  { id: "keamanan", label: "Anti-Manipulasi" },
  { id: "status", label: "Status & Batas Waktu" },
  { id: "pintasan", label: "Pintasan Fitur" },
] as const;

export function DasborPanduan() {
  const [kueri, setKueri] = useState("");
  const [kategoriAktif, setKategoriAktif] = useState<string>("semua");

  const DAFTAR_KARTU: KartuPanduan[] = [
    // 1. TAHAPAN LAPOR
    {
      id: "tahapan-lapor",
      kategori: "lapor",
      judul: "Alur & Tahapan Melapor",
      subjudul: "Panduan langkah demi langkah warga & guru melapor masalah menu makanan.",
      ikon: Megaphone,
      warnaAksen: "text-emerald-700 dark:text-emerald-400",
      warnaBg: "bg-emerald-500/10 border-emerald-500/20",
      kataKunci: ["lapor", "foto", "bukti", "anonim", "rahasia", "tiket", "keracunan", "darurat", "tahapan"],
      tautan: { href: "/lapor", label: "Buka Formulir Lapor" },
      kontenUtama: (
        <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
          <div className="space-y-2">
            <div className="flex gap-2.5">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white">1</span>
              <div>
                <strong className="text-foreground">Ambil Foto Bukti Nyata:</strong> Foto makanan dengan jelas (porsi kurang, bau basi, kemasan rusak, atau benda asing). Foto otomatis dibersihkan dari metadata privasi lokasi.
              </div>
            </div>
            <div className="flex gap-2.5">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white">2</span>
              <div>
                <strong className="text-foreground">Pilih Sekolah:</strong> Tentukan sekolah penerima. Sistem akan langsung menghubungkan ke dapur SPPG penyedia tanpa Anda perlu tahu alamat dapurnya.
              </div>
            </div>
            <div className="flex gap-2.5">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white">3</span>
              <div>
                <strong className="text-foreground">Pilih Tingkat Privasi:</strong> Anda bebas memilih nama terbuka, nama rahasia (hanya dilihat verifikator), atau pelapor anonim.
              </div>
            </div>
            <div className="flex gap-2.5">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white">4</span>
              <div>
                <strong className="text-foreground">Dapatkan Kode Tiket:</strong> Simpan 8 karakter kode tiket (misal <span className="font-mono font-semibold text-foreground">#MBG-7821</span>) untuk memantau kemajuan tindak lanjut di menu Lacak.
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-2.5 text-rose-800 dark:text-rose-300">
            <strong>Mode Darurat:</strong> Jika ada anak muntah, diare, atau pingsan, aktifkan tombol darurat keracunan. SLA respons langsung dipersingkat menjadi maksimal 2 jam dengan rujukan medis instan.
          </div>
        </div>
      ),
    },

    // 2. PIHAK & WEWENANG
    {
      id: "pihak-wewenang",
      kategori: "aktor",
      judul: "Siapa yang Memproses Laporan?",
      subjudul: "Pembagian tugas terarah tanpa birokrasi berbelit dan tanpa perantara manual.",
      ikon: Users,
      warnaAksen: "text-teal-700 dark:text-teal-400",
      warnaBg: "bg-teal-500/10 border-teal-500/20",
      kataKunci: ["aktor", "pihak", "verifikator", "sppg", "dinkes", "bgn", "wewenang", "independen"],
      tautan: { href: "/tentang", label: "Pelajari Tata Kelola" },
      kontenUtama: (
        <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
          <div className="rounded-lg border bg-card p-2.5">
            <span className="font-semibold text-foreground">1. Tim Verifikator Wilayah:</span>
            <p className="mt-0.5">Tim independen yang memeriksa keabsahan foto bukti, memastikan bukan hoaks, dan menggabungkan aduan serupa sebelum diteruskan ke dapur.</p>
          </div>
          <div className="rounded-lg border bg-card p-2.5">
            <span className="font-semibold text-foreground">2. Pengelola Dapur SPPG:</span>
            <p className="mt-0.5">Penanggung jawab operasional yang wajib memperbaiki menu, mensterilkan alat, dan mengunggah foto bukti perbaikan nyata.</p>
          </div>
          <div className="rounded-lg border bg-card p-2.5">
            <span className="font-semibold text-foreground">3. Dinas Kesehatan Kab/Kota:</span>
            <p className="mt-0.5">Otoritas medis yang langsung menangani investigasi keracunan, pengujian laboratorium sampel makanan, dan evaluasi izin SLHS dapur.</p>
          </div>
          <div className="rounded-lg border bg-card p-2.5">
            <span className="font-semibold text-foreground">4. Korwil BGN (Badan Gizi Nasional):</span>
            <p className="mt-0.5">Pengawas wilayah yang memantau batas waktu respon (SLA) semua dapur dan menegur dapur yang lambat menindaklanjuti.</p>
          </div>
        </div>
      ),
    },

    // 3. KAMUS METRIK & LABEL
    {
      id: "kamus-metrik",
      kategori: "metrik",
      judul: "Kamus Angka, Label & Metrik",
      subjudul: "Penjelasan lengkap ramah awam tanpa rumus rumit atau jargon membingungkan.",
      ikon: HelpCircle,
      warnaAksen: "text-blue-700 dark:text-blue-400",
      warnaBg: "bg-blue-500/10 border-blue-500/20",
      kataKunci: ["metrik", "skor", "risiko", "slhs", "tanggap", "selesai", "terlambat", "sinyal", "arti", "kamus"],
      tautan: { href: "/metodologi", label: "Buka Metodologi Terbuka" },
      kontenUtama: (
        <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
          <div className="flex items-start gap-2 rounded-lg border bg-card p-2.5">
            <InfoMetrik jenis="risiko" className="mt-0.5" />
            <div>
              <strong className="text-foreground">Indeks Risiko Dapur (0–100):</strong>
              <p>Makin rendah makin aman. 0–39 Rendah (Aman), 40–69 Sedang (Waspada), 70+ Tinggi (Prioritas Pengawasan). Dihitung otomatis dari 5 faktor: aduan warga, keracunan, sertifikat sanitasi, ketepatan waktu, dan rating kepuasan.</p>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-lg border bg-card p-2.5">
            <InfoMetrik jenis="slhs" className="mt-0.5" />
            <div>
              <strong className="text-foreground">SLHS (Sertifikat Laik Higiene Sanitasi):</strong>
              <p>Sertifikat resmi kelayakan air, tempat masak, dan kebersihan alat dari Dinas Kesehatan. Dapur tanpa SLHS otomatis mendapat penalti risiko tinggi.</p>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-lg border bg-card p-2.5">
            <InfoMetrik jenis="tanggap" className="mt-0.5" />
            <div>
              <strong className="text-foreground">Waktu Tanggap:</strong>
              <p>Rata-rata waktu (jam) yang dibutuhkan dapur memberikan tanggapan resmi sejak aduan dinyatakan lolos verifikasi.</p>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-lg border bg-card p-2.5">
            <InfoMetrik jenis="sinyal" className="mt-0.5" />
            <div>
              <strong className="text-foreground">Sinyal Lonjakan Peringatan Dini:</strong>
              <p>Deteksi otomatis jika aduan untuk 1 dapur melonjak lebih dari 3× rata-rata harian dalam 24 jam terakhir. Mencegah KLB meluas.</p>
            </div>
          </div>
        </div>
      ),
    },

    // 4. JAMINAN ANTI-MANIPULASI
    {
      id: "anti-manipulasi",
      kategori: "keamanan",
      judul: "Jaminan Anti-Manipulasi & Integritas",
      subjudul: "Bagaimana sistem menjamin laporan ditindaklanjuti sungguhan, bukan sekadar janji di atas kertas.",
      ikon: ShieldCheck,
      warnaAksen: "text-purple-700 dark:text-purple-400",
      warnaBg: "bg-purple-500/10 border-purple-500/20",
      kataKunci: ["manipulasi", "transparansi", "bukti", "foto", "sanggah", "bap", "dinkes", "rating", "keamanan"],
      tautan: { href: "/lacak/akuntabilitas", label: "Lihat Papan Akuntabilitas" },
      kontenUtama: (
        <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
          <div className="rounded-lg border bg-card p-2.5">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <Camera className="size-3.5 text-primary" /> 1. Wajib Unggah Foto Fisik Perbaikan
            </div>
            <p className="mt-1">Dapur dilarang menutup aduan hanya dengan kata-kata. Dapur wajib mengunggah foto dapur bersih, penggantian menu, atau nota bahan baru yang langsung tampil di linimasa publik kasus.</p>
          </div>
          <div className="rounded-lg border bg-card p-2.5">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <RotateCcw className="size-3.5 text-primary" /> 2. Masa Sanggah 3 Hari bagi Pelapor
            </div>
            <p className="mt-1">Saat dapur menandai laporan selesai, status belum final. Pelapor memiliki waktu 3 hari untuk mengonfirmasi perbaikan, memberi rating bintang 1–5, atau membuka sanggahan jika makanan masih bermasalah.</p>
          </div>
          <div className="rounded-lg border bg-card p-2.5">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <Lock className="size-3.5 text-primary" /> 3. Kasus Keracunan Dikunci Dinkes
            </div>
            <p className="mt-1">Kasus keracunan makanan tidak bisa diselesaikan sepihak oleh dapur SPPG. Hanya verifikator Dinas Kesehatan yang berhak menutup kasus setelah Berita Acara Pemeriksaan (BAP) selesai.</p>
          </div>
          <div className="rounded-lg border bg-card p-2.5">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <Scale className="size-3.5 text-primary" /> 4. Jejak Audit Tak Terhapus (Immutable)
            </div>
            <p className="mt-1">Semua riwayat perubahan status, jam tindakan, dan berkas foto tercatat permanen di database publik dan tidak dapat dihapus atau diubah diam-diam.</p>
          </div>
        </div>
      ),
    },

    // 5. STATUS TIKET & BATAS WAKTU SLA
    {
      id: "status-sla",
      kategori: "status",
      judul: "Arti Status Tiket & Batas Waktu SLA",
      subjudul: "Memahami 5 fase penanganan aduan dan jaminan batas waktu layanan resmi.",
      ikon: Clock,
      warnaAksen: "text-amber-700 dark:text-amber-400",
      warnaBg: "bg-amber-500/10 border-amber-500/20",
      kataKunci: ["status", "sla", "tiket", "lacak", "diterima", "diverifikasi", "diteruskan", "ditindaklanjuti", "selesai"],
      tautan: { href: "/lacak", label: "Cek Status Tiket Anda" },
      kontenUtama: (
        <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            <div className="rounded-lg border bg-card p-2">
              <span className="font-semibold text-foreground">Diterima:</span> Laporan masuk sistem, sedang dalam antrean tim verifikasi (SLA: maksimal 6 jam).
            </div>
            <div className="rounded-lg border bg-card p-2">
              <span className="font-semibold text-foreground">Diverifikasi:</span> Bukti dinyatakan valid dan laporan serupa telah digabung (SLA: 2 jam).
            </div>
            <div className="rounded-lg border bg-card p-2">
              <span className="font-semibold text-foreground">Diteruskan:</span> Otomatis dikirim ke SPPG & Dinas Kesehatan penanggung jawab (SLA: 6 jam).
            </div>
            <div className="rounded-lg border bg-card p-2">
              <span className="font-semibold text-foreground">Ditindaklanjuti:</span> Dapur sedang melakukan perbaikan fisik menu/sanitasi (SLA: 3 hari kerja).
            </div>
          </div>
          <div className="rounded-lg border border-primary/20 bg-secondary/30 p-2.5">
            <strong className="text-foreground">Selesai & Masa Sanggah:</strong>
            <p className="mt-0.5">Perbaikan selesai dengan unggahan foto bukti. Masuk masa konfirmasi 3 hari bagi pelapor sebelum tiket ditutup secara permanen.</p>
          </div>
        </div>
      ),
    },

    // 6. PINTASAN FITUR & EKSPLORASI
    {
      id: "pintasan-fitur",
      kategori: "pintasan",
      judul: "Pintasan Akses & Peta Informasi",
      subjudul: "Akses cepat ke seluruh modul dan alat pengawasan terbuka PMBGM.",
      ikon: Compass,
      warnaAksen: "text-cyan-700 dark:text-cyan-400",
      warnaBg: "bg-cyan-500/10 border-cyan-500/20",
      kataKunci: ["pintasan", "fitur", "cari", "sekolah", "data", "insight", "faq", "privasi", "unduh"],
      kontenUtama: (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <Link href="/cari-sekolah" className="flex items-center gap-2 rounded-lg border bg-card p-2.5 transition hover:border-primary">
            <School className="size-4 text-primary" />
            <div>
              <span className="block font-semibold text-foreground">Cari Sekolah</span>
              <span className="text-[11px] text-muted-foreground">Cek SPPG penyuplai</span>
            </div>
          </Link>
          <Link href="/data/sppg" className="flex items-center gap-2 rounded-lg border bg-card p-2.5 transition hover:border-primary">
            <UtensilsCrossed className="size-4 text-primary" />
            <div>
              <span className="block font-semibold text-foreground">Direktori Dapur</span>
              <span className="text-[11px] text-muted-foreground">Cek rapor kepatuhan</span>
            </div>
          </Link>
          <Link href="/insight" className="flex items-center gap-2 rounded-lg border bg-card p-2.5 transition hover:border-primary">
            <Radar className="size-4 text-primary" />
            <div>
              <span className="block font-semibold text-foreground">Peta Risiko</span>
              <span className="text-[11px] text-muted-foreground">Analisis prioritas kota</span>
            </div>
          </Link>
          <Link href="/data/unduh" className="flex items-center gap-2 rounded-lg border bg-card p-2.5 transition hover:border-primary">
            <BarChart3 className="size-4 text-primary" />
            <div>
              <span className="block font-semibold text-foreground">Unduh Data</span>
              <span className="text-[11px] text-muted-foreground">Dataset CSV & API terbuka</span>
            </div>
          </Link>
          <Link href="/faq" className="flex items-center gap-2 rounded-lg border bg-card p-2.5 transition hover:border-primary">
            <FileText className="size-4 text-primary" />
            <div>
              <span className="block font-semibold text-foreground">Tanya Jawab (FAQ)</span>
              <span className="text-[11px] text-muted-foreground">Jawaban pertanyaan umum</span>
            </div>
          </Link>
          <Link href="/privasi" className="flex items-center gap-2 rounded-lg border bg-card p-2.5 transition hover:border-primary">
            <ShieldAlert className="size-4 text-primary" />
            <div>
              <span className="block font-semibold text-foreground">Privasi & Keamanan</span>
              <span className="text-[11px] text-muted-foreground">Perlindungan pelapor</span>
            </div>
          </Link>
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
      const teksCocok =
        k.judul.toLowerCase().includes(q) ||
        k.subjudul.toLowerCase().includes(q) ||
        k.kataKunci.some((kunci) => kunci.toLowerCase().includes(q));
      return teksCocok;
    });
  }, [kueri, kategoriAktif]);

  return (
    <div className="space-y-8">
      {/* Search Bar & Filter Tabs */}
      <div className="space-y-4 rounded-3xl border bg-card p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex h-12 flex-1 items-center gap-3 rounded-2xl border border-input bg-background px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <Search className="size-5 text-muted-foreground shrink-0" aria-hidden />
            <input
              type="text"
              value={kueri}
              onChange={(e) => setKueri(e.target.value)}
              placeholder="Cari topik (misal: cara lapor, rumus risiko, anti manipulasi, batas waktu, foto valid...)"
              className="h-full w-full bg-transparent text-sm placeholder:text-muted-foreground/70 focus:outline-none"
            />
            {kueri && (
              <button
                type="button"
                onClick={() => setKueri("")}
                className="text-xs text-muted-foreground hover:text-foreground font-medium"
              >
                Reset
              </button>
            )}
          </label>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar" role="tablist">
          {KATEGORI.map((kat) => (
            <button
              key={kat.id}
              role="tab"
              aria-selected={kategoriAktif === kat.id}
              onClick={() => setKategoriAktif(kat.id)}
              className={cn(
                "inline-flex h-9 items-center rounded-full px-4 text-xs font-semibold whitespace-nowrap transition",
                kategoriAktif === kat.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {kat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Kotakan Menu Panduan */}
      <div className="grid gap-6 md:grid-cols-2">
        {hasilFilter.map((kartu) => {
          const Ikon = kartu.ikon;
          return (
            <div
              key={kartu.id}
              className="flex flex-col justify-between rounded-3xl border bg-card p-5 sm:p-6 shadow-sm transition hover:border-primary/40 hover:shadow-md"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={cn("flex size-11 items-center justify-center rounded-2xl border", kartu.warnaBg)}>
                      <Ikon className={cn("size-6", kartu.warnaAksen)} aria-hidden />
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-foreground leading-snug">{kartu.judul}</h2>
                      <p className="text-xs text-muted-foreground">{kartu.subjudul}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3">
                  {kartu.kontenUtama}
                </div>
              </div>

              {kartu.tautan && (
                <div className="mt-5 border-t pt-3 flex justify-end">
                  <Link
                    href={kartu.tautan.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    {kartu.tautan.label} <ArrowRight className="size-3.5" aria-hidden />
                  </Link>
                </div>
              )}
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
    </div>
  );
}
