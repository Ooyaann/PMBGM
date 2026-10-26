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
          {/* KOLOM KIRI: SHOWCASE MISI CERIA & TRUST BADGE (5 Kolom) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-emerald-800/40 shadow-inner">
            {/* Ambient Decorative Glow Ceria */}
            <div className="absolute -top-16 -left-16 size-64 rounded-full bg-emerald-400/25 blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 -right-20 size-56 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 size-64 rounded-full bg-teal-400/30 blur-3xl pointer-events-none" />

            <div className="relative space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-white shadow-xs">
                <Sparkles className="size-3.5 text-amber-300" aria-hidden /> Portal Resmi PMBGM
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight drop-shadow-xs">
                  Pengawasan Makanan Bergizi Bersama Warga
                </h1>
                <p className="mt-2.5 text-xs sm:text-sm text-emerald-100 leading-relaxed font-normal">
                  Layanan terpadu menjaga porsi, kebersihan, dan keselamatan pangan anak sekolah di Kota Semarang.
                </p>
              </div>

              {/* 3 Kartu Keunggulan Ceria (Glassmorphism, tidak putih pucat) */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3.5 rounded-2xl bg-white/12 border border-white/20 p-3.5 backdrop-blur-md shadow-xs transition hover:bg-white/18">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/25 text-emerald-100 border border-emerald-300/30">
                    <ShieldCheck className="size-5.5" />
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">Verifikasi Independen</h4>
                    <p className="text-xs text-emerald-100/90 leading-tight mt-0.5">
                      Laporan divalidasi tim independen sebelum ke dapur.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 rounded-2xl bg-white/12 border border-white/20 p-3.5 backdrop-blur-md shadow-xs transition hover:bg-white/18">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/25 text-cyan-100 border border-cyan-300/30">
                    <Clock className="size-5.5" />
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">Waktu Tanggap Terukur</h4>
                    <p className="text-xs text-emerald-100/90 leading-tight mt-0.5">
                      Batas waktu tindak lanjut transparan terikat SLA resmi.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 rounded-2xl bg-white/12 border border-white/20 p-3.5 backdrop-blur-md shadow-xs transition hover:bg-white/18">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/25 text-amber-200 border border-amber-300/30">
                    <CheckCircle2 className="size-5.5" />
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">Bukti Nyata Perbaikan</h4>
                    <p className="text-xs text-emerald-100/90 leading-tight mt-0.5">
                      Penyelesaian wajib melampirkan foto fisik hasil perbaikan.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Kolom Kiri */}
            <div className="relative pt-6 mt-6 border-t border-white/20 flex items-center justify-between text-xs text-emerald-100/80">
              <span>Web In Action 2026</span>
              <span className="font-semibold text-white bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20">
                Tim Ctrl Win Enter · UNNES
              </span>
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
