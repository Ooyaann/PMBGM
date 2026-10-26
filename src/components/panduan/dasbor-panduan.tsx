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
  Users,
  UtensilsCrossed,
  X,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

  const DAFTAR_KARTU: ItemPanduan[] = [
    // 1. CARA MELAPOR
    {
      id: "cara-melapor",
      kategori: "lapor",
      judul: "Alur & Tahapan Melapor",
      ringkasan: "Panduan 4 langkah mudah dari kirim foto bukti makanan hingga menerima kode tiket unik.",
      badgeRingkas: ["4 Langkah Mudah", "Opsi Anonim & Rahasia", "Mode Darurat 2 Jam"],
      ikon: Megaphone,
      warnaAksen: "text-emerald-700 dark:text-emerald-300",
      warnaBg: "bg-emerald-500/10",
      warnaBorder: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
      kataKunci: ["lapor", "foto", "bukti", "anonim", "rahasia", "tiket", "keracunan", "darurat", "tahapan"],
      tautanAksi: { href: "/lapor", label: "Buka Formulir Lapor Sekarang" },
      kontenModal: (
        <div className="space-y-6 text-foreground/90">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Warga dan bapak/ibu guru dapat melaporkan segala permasalahan menu makanan MBG secara aman. Sistem kami secara otomatis melindungi privasi pelapor.
          </p>

          <div className="space-y-4">
            <div className="flex gap-4 rounded-2xl border bg-muted/30 p-4 sm:p-5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-sm font-extrabold text-white">
                1
              </span>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-foreground">Ambil Foto Bukti Nyata</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Foto makanan dengan jelas (misal: porsi terlalu sedikit, basi/asam, kemasan rusak, atau ada benda asing). Sistem otomatis membersihkan data lokasi pribadi dari foto.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-2xl border bg-muted/30 p-4 sm:p-5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-sm font-extrabold text-white">
                2
              </span>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-foreground">Pilih Nama Sekolah Penerima</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Cukup ketik nama sekolah anak Anda. Sistem secara otomatis menautkan ke dapur SPPG penyedia makanan tanpa Anda perlu mencari tahu lokasi dapurnya.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-2xl border bg-muted/30 p-4 sm:p-5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-sm font-extrabold text-white">
                3
              </span>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-foreground">Tentukan Privasi Identitas Anda</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Anda memiliki kendali penuh: bisa melapor dengan nama terbuka, opsi <strong>Rahasia</strong> (hanya dilihat verifikator resmi), atau sepenuhnya <strong>Anonim</strong>.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-2xl border bg-muted/30 p-4 sm:p-5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-sm font-extrabold text-white">
                4
              </span>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-foreground">Simpan Kode Tiket Pemantauan</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Setelah terkirim, Anda menerima 8 digit kode tiket unik (contoh: <span className="font-mono font-bold text-foreground">#MBG-7821</span>) untuk memantau kemajuan tindakan di menu Lacak.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 sm:p-5 text-rose-950 dark:text-rose-200">
            <h4 className="flex items-center gap-2 font-bold text-sm sm:text-base">
              <ShieldAlert className="size-5 text-rose-600 dark:text-rose-400" />
              Khusus Keadaan Darurat Medis / Keracunan
            </h4>
            <p className="mt-1.5 text-xs sm:text-sm leading-relaxed">
              Jika siswa mengalami gejala muntah, diare massal, atau pingsan, centang tombol <strong>Darurat Keracunan</strong>. Laporan langsung dialirkan ke jalur prioritas tinggi dengan batas waktu respon 2 jam dan tembusan medis instan ke Dinas Kesehatan Kota.
            </p>
          </div>
        </div>
      ),
    },

    // 2. PIHAK PENANGGUNG JAWAB
    {
      id: "pihak-penanggung-jawab",
      kategori: "aktor",
      judul: "Siapa yang Menangani Laporan?",
      ringkasan: "Pembagian tugas terarah antara verifikator independen, dapur SPPG, Dinas Kesehatan, dan Korwil BGN.",
      badgeRingkas: ["Verifikator Independen", "Dapur SPPG", "Dinas Kesehatan", "Korwil BGN"],
      ikon: Users,
      warnaAksen: "text-teal-700 dark:text-teal-300",
      warnaBg: "bg-teal-500/10",
      warnaBorder: "hover:border-teal-500/50 hover:shadow-teal-500/10",
      kataKunci: ["aktor", "pihak", "verifikator", "sppg", "dinkes", "bgn", "wewenang", "independen", "penanggung"],
      tautanAksi: { href: "/tentang", label: "Pelajari Struktur Tata Kelola" },
      kontenModal: (
        <div className="space-y-5 text-foreground/90">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            PMBGM tidak menggunakan perantara admin manual yang lambat. Setiap pihak memiliki tugas dan batas wewenang yang tegas:
          </p>

          <div className="space-y-3.5">
            <div className="rounded-2xl border bg-card p-4 sm:p-5 space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-teal-500/15 text-teal-700 dark:text-teal-300 font-bold text-xs">
                  A
                </span>
                <h4 className="font-bold text-foreground text-sm sm:text-base">Tim Verifikator Wilayah (Independen)</h4>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground pl-9">
                Bertugas memverifikasi keaslian foto bukti, menyaring laporan palsu/spam, dan menggabungkan aduan serupa dari sekolah yang sama sebelum diteruskan ke dapur.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-4 sm:p-5 space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-teal-500/15 text-teal-700 dark:text-teal-300 font-bold text-xs">
                  B
                </span>
                <h4 className="font-bold text-foreground text-sm sm:text-base">Pengelola Dapur SPPG Mitra</h4>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground pl-9">
                Penanggung jawab utama masakan yang wajib memperbaiki porsi menu, mensterilkan alat dapur, mengganti bahan segar, serta <strong>wajib mengunggah foto bukti fisik perbaikan</strong>.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-4 sm:p-5 space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-teal-500/15 text-teal-700 dark:text-teal-300 font-bold text-xs">
                  C
                </span>
                <h4 className="font-bold text-foreground text-sm sm:text-base">Dinas Kesehatan Kab/Kota</h4>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground pl-9">
                Otoritas medis yang langsung diterjunkan untuk investigasi keracunan, pengujian laboratorium sampel makanan, evaluasi izin Sertifikat Laik Higiene Sanitasi (SLHS), dan menerbitkan Berita Acara Pemeriksaan (BAP).
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-4 sm:p-5 space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-teal-500/15 text-teal-700 dark:text-teal-300 font-bold text-xs">
                  D
                </span>
                <h4 className="font-bold text-foreground text-sm sm:text-base">Korwil BGN (Badan Gizi Nasional)</h4>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground pl-9">
                Pengawas wilayah yang memantau ketepatan waktu penanganan aduan (SLA) semua dapur di kota dan melakukan intervensi teguran bila ada dapur yang mengabaikan aduan warga.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // 3. KAMUS ANGKA & LABEL
    {
      id: "arti-angka-label",
      kategori: "metrik",
      judul: "Kamus Angka, Label & Metrik",
      ringkasan: "Penjelasan arti Skor Risiko 0–100, status SLHS Dinkes, waktu tanggap, dan sinyal lonjakan.",
      badgeRingkas: ["Skor Risiko 0–100", "Izin SLHS", "Waktu Tanggap", "Sinyal Lonjakan"],
      ikon: HelpCircle,
      warnaAksen: "text-blue-700 dark:text-blue-300",
      warnaBg: "bg-blue-500/10",
      warnaBorder: "hover:border-blue-500/50 hover:shadow-blue-500/10",
      kataKunci: ["metrik", "skor", "risiko", "slhs", "tanggap", "selesai", "terlambat", "sinyal", "arti", "kamus"],
      tautanAksi: { href: "/metodologi", label: "Lihat Rumus Matematis Terbuka" },
      kontenModal: (
        <div className="space-y-5 text-foreground/90">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Seluruh data di PMBGM dirancang transparan agar warga awam dapat langsung menilai kondisi dapur yang memasak makanan untuk anak-anaknya:
          </p>

          <div className="space-y-3.5">
            <div className="rounded-2xl border bg-card p-4 sm:p-5 space-y-2">
              <h4 className="font-bold text-foreground text-sm sm:text-base">1. Indeks Risiko Dapur (Skala 0–100)</h4>
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                Tingkat kerentanan dapur. <strong>Makin rendah angkanya, makin aman dan sehat dapurnya</strong>. Dihitung otomatis dari jumlah aduan warga, kasus keracunan, kelengkapan izin sanitasi, ketepatan waktu respon, dan kepuasan orang tua.
              </p>
              <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-3">
                <div className="rounded-xl bg-emerald-500/15 p-2.5 text-center text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  0–39: Rendah (Aman)
                </div>
                <div className="rounded-xl bg-amber-500/15 p-2.5 text-center text-xs font-semibold text-amber-800 dark:text-amber-300">
                  40–69: Sedang (Waspada)
                </div>
                <div className="rounded-xl bg-rose-500/15 p-2.5 text-center text-xs font-semibold text-rose-800 dark:text-rose-300">
                  70+: Tinggi (Perlu Evaluasi)
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-4 sm:p-5 space-y-1.5">
              <h4 className="font-bold text-foreground text-sm sm:text-base">2. SLHS (Sertifikat Laik Higiene Sanitasi)</h4>
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                Bukti inspeksi resmi dari Dinas Kesehatan bahwa sumber air, tempat masak, dan ventilasi dapur memenuhi standar kebersihan pangan. Dapur tanpa SLHS otomatis mendapat penalti risiko tinggi.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-4 sm:p-5 space-y-1.5">
              <h4 className="font-bold text-foreground text-sm sm:text-base">3. Waktu Tanggap & Tingkat Selesai</h4>
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                <strong>Waktu Tanggap:</strong> Berapa jam yang dibutuhkan dapur memberi respon pertama sejak laporan diverifikasi. <br />
                <strong>Tingkat Selesai:</strong> Persentase laporan yang telah diselesaikan tuntas dengan bukti foto nyata.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-4 sm:p-5 space-y-1.5">
              <h4 className="font-bold text-foreground text-sm sm:text-base">4. Sinyal Lonjakan Aduan</h4>
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                Deteksi otomatis saat aduan untuk satu dapur melonjak melebihi 3× rata-rata harian dalam 24 jam terakhir. Sinyal ini memicu verifikasi lapangan cepat bersama Dinas Kesehatan.
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
      ringkasan: "Bagaimana platform memastikan dapur benar-benar melakukan perbaikan nyata di lapangan.",
      badgeRingkas: ["Foto Fisik Wajib", "Masa Sanggah 3 Hari", "Kunci BAP Dinkes", "Jejak Audit Kekal"],
      ikon: ShieldCheck,
      warnaAksen: "text-purple-700 dark:text-purple-300",
      warnaBg: "bg-purple-500/10",
      warnaBorder: "hover:border-purple-500/50 hover:shadow-purple-500/10",
      kataKunci: ["manipulasi", "transparansi", "bukti", "foto", "sanggah", "bap", "dinkes", "rating", "keamanan"],
      tautanAksi: { href: "/lacak/akuntabilitas", label: "Lihat Papan Akuntabilitas Terbuka" },
      kontenModal: (
        <div className="space-y-5 text-foreground/90">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Kami membangun sistem dengan transparansi dua arah sehingga tidak ada pihak yang dapat memanipulasi penyelesaian kasus:
          </p>

          <div className="space-y-3.5">
            <div className="rounded-2xl border bg-card p-4 sm:p-5 space-y-1">
              <div className="flex items-center gap-2">
                <Camera className="size-4 text-primary" />
                <h4 className="font-bold text-foreground text-sm sm:text-base">1. Wajib Unggah Foto Fisik Perbaikan</h4>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                Dapur dilarang menutup aduan hanya dengan kata-kata manis. Setiap tindakan perbaikan wajib melampirkan foto fisik (alat yang dibersihkan, penggantian menu baru, atau nota bahan) yang langsung tampil di linimasa publik kasus.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-4 sm:p-5 space-y-1">
              <div className="flex items-center gap-2">
                <RotateCcw className="size-4 text-primary" />
                <h4 className="font-bold text-foreground text-sm sm:text-base">2. Hak Masa Sanggah 3 Hari bagi Pelapor</h4>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                Ketika pihak dapur menyatakan laporan sudah &quot;Selesai&quot;, status belum ditutup permanen. Pelapor memiliki waktu 3 hari untuk mengonfirmasi hasil, memberi nilai rating bintang 1–5, atau <strong>membuka sanggahan</strong> bila di sekolah anak masalah belum tuntas.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-4 sm:p-5 space-y-1">
              <div className="flex items-center gap-2">
                <Lock className="size-4 text-primary" />
                <h4 className="font-bold text-foreground text-sm sm:text-base">3. Kasus Keracunan Dikunci Dinkes</h4>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                Kasus keracunan makanan dikunci oleh sistem dan tidak dapat diselesaikan secara sepihak oleh pengelola dapur. Kasus hanya dapat ditutup setelah petugas Dinas Kesehatan mengunggah Berita Acara Pemeriksaan (BAP) resmi.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-4 sm:p-5 space-y-1">
              <div className="flex items-center gap-2">
                <Scale className="size-4 text-primary" />
                <h4 className="font-bold text-foreground text-sm sm:text-base">4. Catatan Waktu Tidak Dapat Dihapus (Immutable Log)</h4>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                Seluruh aktivitas perubahan status, jam tindakan, dan berkas foto tercatat permanen di database publik dan tidak dapat dihapus atau diubah diam-diam.
              </p>
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
      ringkasan: "Ketahui arti 5 status tiket Anda dan jaminan batas waktu respon resmi (SLA).",
      badgeRingkas: ["Diterima (6 Jam)", "Diverifikasi (2 Jam)", "Diteruskan (6 Jam)", "Tindak Lanjut (3 Hari)"],
      ikon: Clock,
      warnaAksen: "text-amber-700 dark:text-amber-300",
      warnaBg: "bg-amber-500/10",
      warnaBorder: "hover:border-amber-500/50 hover:shadow-amber-500/10",
      kataKunci: ["status", "sla", "tiket", "lacak", "diterima", "diverifikasi", "diteruskan", "ditindaklanjuti", "selesai"],
      tautanAksi: { href: "/lacak", label: "Cek Status Tiket Anda" },
      kontenModal: (
        <div className="space-y-5 text-foreground/90">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Setiap aduan yang masuk memiliki batas waktu pelayanan (SLA) resmi. Sistem otomatis menghitung mundur sisa waktu penanganan:
          </p>

          <div className="space-y-3">
            <div className="rounded-2xl border bg-card p-4 sm:p-5">
              <span className="font-bold text-foreground block text-sm sm:text-base">1. Status Diterima</span>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Laporan masuk ke sistem dan masuk ke antrean tim verifikator wilayah. <br />
                <span className="font-semibold text-foreground">Batas waktu:</span> Maksimal 6 jam (atau 2 jam untuk darurat keracunan).
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-4 sm:p-5">
              <span className="font-bold text-foreground block text-sm sm:text-base">2. Status Diverifikasi</span>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Foto bukti diperiksa keabsahannya dan laporan serupa telah digabungkan agar tidak tumpang tindih. <br />
                <span className="font-semibold text-foreground">Batas waktu:</span> Maksimal 2 jam.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-4 sm:p-5">
              <span className="font-bold text-foreground block text-sm sm:text-base">3. Status Diteruskan</span>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Sistem otomatis meneruskan tiket ke pengelola dapur SPPG dan Dinas Kesehatan wilayah terkait. <br />
                <span className="font-semibold text-foreground">Batas waktu:</span> Maksimal 6 jam.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-4 sm:p-5">
              <span className="font-bold text-foreground block text-sm sm:text-base">4. Status Ditindaklanjuti</span>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Dapur sedang melakukan tindakan nyata (perbaikan menu, sterilisasi alat, atau penggantian bahan baku). <br />
                <span className="font-semibold text-foreground">Batas waktu:</span> Maksimal 3 hari kerja.
              </p>
            </div>

            <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 sm:p-5">
              <span className="font-bold text-foreground block text-sm sm:text-base">5. Status Selesai & Masa Sanggah</span>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Perbaikan dinyatakan tuntas dengan unggahan foto bukti fisik. Pelapor memiliki waktu 3 hari untuk memberikan konfirmasi dan penilaian rating sebelum status tiket ditutup permanen.
              </p>
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
      ringkasan: "Akses cepat ke seluruh modul pengawasan publik, direktori dapur, dan unduh data terbuka.",
      badgeRingkas: ["Cari Sekolah", "Direktori SPPG", "Peta Risiko", "Unduh Data CSV"],
      ikon: Compass,
      warnaAksen: "text-cyan-700 dark:text-cyan-300",
      warnaBg: "bg-cyan-500/10",
      warnaBorder: "hover:border-cyan-500/50 hover:shadow-cyan-500/10",
      kataKunci: ["pintasan", "fitur", "cari", "sekolah", "data", "insight", "faq", "privasi", "unduh"],
      kontenModal: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Gunakan tautan cepat di bawah ini untuk menjelajahi seluruh fitur yang ada di platform PMBGM:
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href="/cari-sekolah"
              className="flex items-center gap-3.5 rounded-2xl border bg-card p-4 transition hover:border-primary hover:shadow-sm"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <School className="size-5" />
              </span>
              <div>
                <span className="block font-bold text-foreground text-sm">Cari Sekolah Anak</span>
                <span className="text-xs text-muted-foreground">Ketahui SPPG mitra penyuplai makanan</span>
              </div>
            </Link>

            <Link
              href="/data/sppg"
              className="flex items-center gap-3.5 rounded-2xl border bg-card p-4 transition hover:border-primary hover:shadow-sm"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UtensilsCrossed className="size-5" />
              </span>
              <div>
                <span className="block font-bold text-foreground text-sm">Direktori Dapur SPPG</span>
                <span className="text-xs text-muted-foreground">Cek rapor risiko & status izin sanitasi</span>
              </div>
            </Link>

            <Link
              href="/insight"
              className="flex items-center gap-3.5 rounded-2xl border bg-card p-4 transition hover:border-primary hover:shadow-sm"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Radar className="size-5" />
              </span>
              <div>
                <span className="block font-bold text-foreground text-sm">Peta Risiko Wilayah</span>
                <span className="text-xs text-muted-foreground">Analisis prioritas inspeksi se-kota</span>
              </div>
            </Link>

            <Link
              href="/data/unduh"
              className="flex items-center gap-3.5 rounded-2xl border bg-card p-4 transition hover:border-primary hover:shadow-sm"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BarChart3 className="size-5" />
              </span>
              <div>
                <span className="block font-bold text-foreground text-sm">Unduh Data Terbuka</span>
                <span className="text-xs text-muted-foreground">Dataset resmi CSV & API terbuka</span>
              </div>
            </Link>

            <Link
              href="/faq"
              className="flex items-center gap-3.5 rounded-2xl border bg-card p-4 transition hover:border-primary hover:shadow-sm"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="size-5" />
              </span>
              <div>
                <span className="block font-bold text-foreground text-sm">Tanya Jawab (FAQ)</span>
                <span className="text-xs text-muted-foreground">Jawaban pertanyaan umum masyarakat</span>
              </div>
            </Link>

            <Link
              href="/privasi"
              className="flex items-center gap-3.5 rounded-2xl border bg-card p-4 transition hover:border-primary hover:shadow-sm"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldAlert className="size-5" />
              </span>
              <div>
                <span className="block font-bold text-foreground text-sm">Kebijakan Privasi</span>
                <span className="text-xs text-muted-foreground">Jaminan keamanan data pelapor</span>
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
      <div className="space-y-4 rounded-3xl border bg-card p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex h-12 flex-1 items-center gap-3 rounded-2xl border border-input bg-background px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition">
            <Search className="size-5 text-muted-foreground shrink-0" aria-hidden />
            <input
              type="text"
              value={kueri}
              onChange={(e) => setKueri(e.target.value)}
              placeholder="Cari panduan (contoh: cara lapor, rumus skor risiko, masa sanggah, bukti foto, keracunan...)"
              className="h-full w-full bg-transparent text-sm placeholder:text-muted-foreground/70 focus:outline-none"
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
                "group cursor-pointer rounded-3xl border bg-card p-5 sm:p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between",
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
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    {kartu.ringkasan}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {kartu.badgeRingkas.map((b) => (
                    <span
                      key={b}
                      className="rounded-lg bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t flex items-center justify-between text-xs font-bold text-foreground/80 group-hover:text-primary">
                <span>Klik untuk baca detail</span>
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

      {/* MODAL POP-UP DETAIL PANDUAN */}
      <Dialog open={!!kartuTerpilih} onOpenChange={(buka) => !buka && setKartuTerpilih(null)}>
        {kartuTerpilih && (
          <DialogContent
            className="sm:max-w-2xl max-h-[88vh] overflow-y-auto p-6 sm:p-8 rounded-3xl"
            showCloseButton={true}
          >
            <DialogHeader className="space-y-3 border-b pb-4">
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

            <div className="py-2">
              {kartuTerpilih.kontenModal}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4 mt-2">
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
