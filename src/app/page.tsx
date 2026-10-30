import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Megaphone,
  Phone,
  Radar,
  School,
  Send,
  ShieldCheck,
} from "lucide-react";
import { FormCekTiket } from "@/components/beranda/form-cek-tiket";
import { KartuLacak } from "@/components/beranda/kartu-lacak";
import { AlurStatus } from "@/components/data/alur-status";
import { buttonVariants } from "@/components/ui/button";
import { ambilKasusSorotan } from "@/lib/data/publik";
import { cn } from "@/lib/utils";

const LANGKAH_ALUR = [
  {
    ikon: Megaphone,
    judul: "1. Lapor Mudah",
    teks: "Kirim foto ompreng dan catatan kejadian secara aman tanpa ribet.",
    href: "/lapor",
  },
  {
    ikon: ShieldCheck,
    judul: "2. Verifikasi Objektif",
    teks: "Validasi bukti laporan didukung model Machine Learning & tim wilayah.",
    href: "/lacak",
  },
  {
    ikon: Send,
    judul: "3. Tindak Lanjut Nyata",
    teks: "Otomatis diteruskan ke dapur SPPG dan Dinas Kesehatan berbatas waktu.",
    href: "/lacak/akuntabilitas",
  },
  {
    ikon: Radar,
    judul: "4. Pengawasan Terbuka",
    teks: "Pantau linimasa perbaikan dan kepatuhan dapur secara transparan.",
    href: "/data/kasus",
  },
];

export default async function Beranda() {
  const sorotan = await ambilKasusSorotan();

  return (
    <div className="space-y-12 sm:space-y-16 py-6 sm:py-10">
      {/* Hero Utama: Sederhana, Bersih, dan Fokus Penuh pada Pelaporan */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/50 via-background to-background dark:from-emerald-950/20 py-10 sm:py-16 lg:py-20 rounded-3xl border border-border/60 mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-10 lg:px-12">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr] max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs sm:text-sm font-bold text-primary shadow-2xs">
              <ShieldCheck className="size-4" aria-hidden /> Pengawasan Partisipatif MBG oleh Masyarakat
            </div>
            <h1 className="text-3xl leading-tight font-extrabold sm:text-4xl lg:text-5xl tracking-tight">
              Makanan anak kita,<br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                kita jaga bersama.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Temukan porsi kurang, makanan basi, atau anak mengeluh sakit perut? Laporkan langsung di sini.
              Identitas Anda aman, aduan diverifikasi secara objektif, dan langsung diteruskan ke pihak berwenang.
            </p>

            {/* Tombol Aksi Utama yang Ramah & Manusiawi */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/lapor"
                className={cn(
                  buttonVariants({ size: "xl" }),
                  "rounded-2xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 h-13 px-7 text-base gap-2"
                )}
              >
                <Megaphone className="size-5" aria-hidden /> Lapor Masalah Sekarang
              </Link>
              <Link
                href="/cari-sekolah"
                className={cn(
                  buttonVariants({ size: "xl", variant: "outline" }),
                  "rounded-2xl font-bold bg-card border-border/80 h-13 px-6 text-base shadow-2xs gap-2 hover:bg-muted"
                )}
              >
                <School className="size-5 text-muted-foreground" aria-hidden /> Cari Sekolah Anak
              </Link>
            </div>

            {/* Cek Cepat Kode Tiket */}
            <div className="pt-2 max-w-md">
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                Sudah pernah melapor sebelumnya? Cek status tiket Anda:
              </p>
              <FormCekTiket />
            </div>
          </div>

          {/* Kartu Sorotan Kasus Riil */}
          <div>
            {sorotan ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-muted-foreground px-1">
                  <span>Kasus yang Sedang Ditangani Terbuka</span>
                  <Link href="/lacak" className="text-primary hover:underline">
                    Lihat Semua Tiket →
                  </Link>
                </div>
                <KartuLacak kasus={sorotan.kasus} timeline={sorotan.timeline} />
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground bg-card/50">
                Sistem aktif memantau dapur SPPG dan sekolah se-Kota Semarang.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Alur Pengawasan Terbuka 4 Langkah (Sangat Mudah Dipahami Orang Awam) */}
      <section aria-labelledby="judul-alur" className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 id="judul-alur" className="text-2xl font-extrabold sm:text-3xl tracking-tight">
            Bagaimana Aduan Anda Diproses?
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Empat langkah transparan untuk memastikan setiap keluhan mendapatkan tindak lanjut nyata tanpa ditutup-tutupi.
          </p>
        </div>

        <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LANGKAH_ALUR.map((m, i) => (
            <li key={m.judul} className="relative">
              <Link
                href={m.href}
                className="group flex h-full flex-col justify-between gap-4 rounded-3xl border border-border/80 bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                    <m.ikon className="size-6" aria-hidden />
                  </span>
                  <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                    Langkah 0{i + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-foreground group-hover:text-primary transition-colors">
                    {m.judul}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {m.teks}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ol>

        {/* Informasi Batas Waktu Kepatuhan (SLA) */}
        <div className="mt-6 rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 text-sm font-bold">
              <Clock className="size-4 text-primary" aria-hidden /> Setiap Tahap Memiliki Batas Waktu (SLA) Terukur
            </h3>
            <Link href="/panduan" className="text-xs font-semibold text-primary hover:underline">
              Pelajari Standar Batas Waktu →
            </Link>
          </div>
          <AlurStatus
            className="mt-4"
            sla={{
              diterima: "6 jam",
              diverifikasi: "2 jam",
              diteruskan: "6 jam",
              ditindaklanjuti: "3 hari",
            }}
          />
        </div>
      </section>

      {/* Ajakan Akhir & Saluran Darurat Medis 119 */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-start gap-6 rounded-3xl bg-foreground p-8 text-background sm:flex-row sm:items-center sm:justify-between sm:p-10 shadow-xl">
          <div className="space-y-1 max-w-xl">
            <h2 className="text-2xl font-black sm:text-3xl tracking-tight">
              Anak Mengalami Gejala Keracunan Makanan?
            </h2>
            <p className="text-sm text-background/80 leading-relaxed">
              Utamakan keselamatan medis anak terlebih dahulu. Segera hubungi saluran darurat kesehatan atau bawa ke fasilitas kesehatan terdekat.
            </p>
          </div>
          <div className="flex w-full flex-wrap gap-3 sm:w-auto">
            <a
              href="tel:119"
              className={cn(
                buttonVariants({ size: "xl" }),
                "flex-1 sm:flex-none rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold h-12 px-6 shadow-md gap-2"
              )}
            >
              <Phone className="size-5" aria-hidden /> Darurat Medis 119
            </a>
            <Link
              href="/lapor"
              className={cn(
                buttonVariants({ size: "xl", variant: "outline" }),
                "flex-1 sm:flex-none rounded-2xl border-background/30 bg-background/10 hover:bg-background/20 text-background font-bold h-12 px-6 gap-2"
              )}
            >
              <Megaphone className="size-5" aria-hidden /> Buat Laporan Kasus
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
