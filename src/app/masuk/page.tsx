import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Lock,
  Radar,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { PilihanMasuk } from "@/components/auth/pilihan-masuk";
import { Logo, TandaLogo } from "@/components/situs/logo";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilPengguna } from "@/lib/sesi";

export const metadata: Metadata = {
  title: "Masuk ke Sistem",
  description: "Akses portal pengawasan partisipatif MBG untuk warga, sekolah, dan instansi penanggung jawab.",
  robots: { index: false },
};

function tujuanAman(nilai: unknown): string {
  return typeof nilai === "string" && nilai.startsWith("/") && !nilai.startsWith("//") ? nilai : "/";
}

async function IsiMasuk({ searchParams }: { searchParams: PageProps<"/masuk">["searchParams"] }) {
  const { lanjut } = await searchParams;
  const tujuan = tujuanAman(lanjut);
  if (await ambilPengguna()) redirect(tujuan);
  return <PilihanMasuk lanjut={tujuan} modeDemo={process.env.NEXT_PUBLIC_MODE_DEMO !== "false"} />;
}

export default function HalamanMasuk(props: PageProps<"/masuk">) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* Tombol Navigasi Kembali */}
        <div className="mb-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden /> Kembali ke Beranda
          </Link>
        </div>

        {/* CONTAINER SPLIT HERO DUA KOLOM */}
        <div className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-xl shadow-primary/5 grid grid-cols-1 lg:grid-cols-12">
          {/* KOLOM KIRI: SHOWCASE MISI BERSIH & CERIA (5 Kolom) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-emerald-100/50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-slate-950 p-6 sm:p-8 text-foreground flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-border/80">
            {/* Ambient Decorative Glow Bersih */}
            <div className="absolute -top-16 -left-16 size-56 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 size-56 rounded-full bg-teal-400/20 blur-3xl pointer-events-none" />

            <div className="relative space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <Sparkles className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden /> Portal Resmi PMBGM
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-950 dark:text-emerald-100 leading-tight">
                  Pengawasan Makanan Bergizi Bersama Warga
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-emerald-900/75 dark:text-slate-300 leading-relaxed font-normal">
                  Layanan terpadu menjaga porsi, kebersihan, dan keselamatan pangan anak sekolah di Kota Semarang.
                </p>
              </div>

              {/* 3 Kartu Keunggulan Bersih & Ceria */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center gap-3 rounded-2xl bg-white dark:bg-card/90 p-3 border border-emerald-200/80 dark:border-emerald-800/50 shadow-2xs">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                    <ShieldCheck className="size-5" />
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-foreground">Verifikasi Independen</h4>
                    <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                      Laporan divalidasi tim independen sebelum ke dapur.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-white dark:bg-card/90 p-3 border border-teal-200/80 dark:border-teal-800/50 shadow-2xs">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-teal-500/15 text-teal-700 dark:text-teal-300">
                    <Clock className="size-5" />
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-foreground">Waktu Tanggap Terukur</h4>
                    <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                      Batas waktu tindak lanjut transparan terikat SLA resmi.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-white dark:bg-card/90 p-3 border border-amber-200/80 dark:border-amber-800/50 shadow-2xs">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
                    <CheckCircle2 className="size-5" />
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-foreground">Bukti Nyata Perbaikan</h4>
                    <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                      Penyelesaian wajib melampirkan foto fisik hasil perbaikan.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Kolom Kiri */}
            <div className="relative pt-4 mt-4 border-t border-emerald-200/60 dark:border-white/10 flex items-center justify-between text-xs text-emerald-900/60 dark:text-slate-400">
              <span>Web In Action 2026</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                Tim Ctrl Win Enter · UNNES
              </span>
            </div>
          </div>

          {/* KOLOM KANAN: FORM & AKUN DEMO SELECTION (7 Kolom) */}
          <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                  Masuk ke Portal
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Pilih mode uji coba cepat untuk evaluasi fitur atau masuk dengan akun terdaftar.
                </p>
              </div>

              <Suspense fallback={<Skeleton className="h-72 w-full rounded-2xl" />}>
                <IsiMasuk searchParams={props.searchParams} />
              </Suspense>
            </div>

            <div className="mt-5 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium">
                <Lock className="size-3.5 text-primary" /> Keamanan sesi terlindungi enkripsi
              </span>
              <Link href="/panduan" className="text-primary hover:underline font-semibold">
                Bantuan & Panduan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
