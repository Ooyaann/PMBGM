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
    <div className="min-h-[calc(100vh-4rem)] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Tombol Navigasi Kembali */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden /> Kembali ke Beranda
          </Link>
        </div>

        {/* CONTAINER SPLIT HERO DUA KOLOM */}
        <div className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-2xl shadow-primary/5 grid grid-cols-1 lg:grid-cols-12">
          {/* KOLOM KIRI: SHOWCASE MISI & TRUST BADGE (5 Kolom) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Ambient Decorative Glow */}
            <div className="absolute -top-24 -left-24 size-72 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 size-72 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />

            <div className="relative space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300">
                <Sparkles className="size-3.5" aria-hidden /> Portal Resmi PMBGM
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                  Transparansi Menjaga Makanan Bergizi Anak Bangsa
                </h1>
                <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Platform partisipatif terintegrasi untuk mengawasi kualitas makanan, keamanan dapur SPPG, dan kepatuhan standar pelayanan MBG.
                </p>
              </div>

              {/* 3 Keunggulan Utama */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/20">
                    <ShieldCheck className="size-5" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">Verifikasi Objektif Independen</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                      Laporan disaring dan divalidasi oleh tim independen sebelum diteruskan ke dapur.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400 border border-teal-400/20">
                    <Clock className="size-5" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">Standar Waktu Tanggap (SLA)</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                      Setiap tahapan penanganan terikat batas waktu resmi dengan eskalasi otomatis.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/20">
                    <Radar className="size-5" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">Jaminan Anti-Manipulasi</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                      Penyelesaian wajib melampirkan foto fisik dengan masa sanggah 3 hari bagi pelapor.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Kolom Kiri */}
            <div className="relative pt-8 mt-8 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>Web In Action · MIA 2026</span>
              <span className="font-semibold text-emerald-300">Tim Ctrl Win Enter</span>
            </div>
          </div>

          {/* KOLOM KANAN: FORM & AKUN DEMO SELECTION (7 Kolom) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                  Masuk ke Portal
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Pilih mode uji coba cepat untuk evaluasi fitur atau masuk dengan akun terdaftar.
                </p>
              </div>

              <Suspense fallback={<Skeleton className="h-80 w-full rounded-2xl" />}>
                <IsiMasuk searchParams={props.searchParams} />
              </Suspense>
            </div>

            <div className="mt-8 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
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
