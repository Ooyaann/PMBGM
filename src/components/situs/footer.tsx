"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FlaskConical, PhoneCall, ShieldAlert } from "lucide-react";
import { Logo } from "./logo";

export function Footer() {
  const pathname = usePathname();
  if (pathname === "/" || pathname?.startsWith("/panel")) return null;

  return (
    <footer className="mt-auto border-t bg-card/60 backdrop-blur-xs text-foreground">
      <div className="kontainer py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Kolom 1 & 2: Identitas & Visi */}
          <div className="space-y-4 lg:col-span-2">
            <Logo />
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
              Platform pengawasan partisipatif masyarakat untuk transparansi dan mutu Program Makan Bergizi Gratis.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                <FlaskConical className="size-3.5 text-emerald-600" aria-hidden /> Data Simulasi · MIA 2026
              </span>
            </div>
          </div>

          {/* Kolom 3: Layanan Warga */}
          <div className="space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-foreground tracking-wide uppercase">
              Layanan Warga
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/lapor" className="text-muted-foreground hover:text-primary transition-colors">
                  Lapor Masalah
                </Link>
              </li>
              <li>
                <Link href="/lacak" className="text-muted-foreground hover:text-primary transition-colors">
                  Lacak Tiket
                </Link>
              </li>
              <li>
                <Link href="/cari-sekolah" className="text-muted-foreground hover:text-primary transition-colors">
                  Cari Sekolah & Dapur
                </Link>
              </li>
              <li>
                <Link href="/panduan" className="text-muted-foreground hover:text-primary transition-colors">
                  Panduan & Simulator
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Transparansi & Analisis */}
          <div className="space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-foreground tracking-wide uppercase">
              Transparansi Data
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/data" className="text-muted-foreground hover:text-primary transition-colors">
                  Data Terbuka
                </Link>
              </li>
              <li>
                <Link href="/insight" className="text-muted-foreground hover:text-primary transition-colors">
                  Peta Risiko SAW
                </Link>
              </li>
              <li>
                <Link href="/metodologi" className="text-muted-foreground hover:text-primary transition-colors">
                  Metodologi & SLA
                </Link>
              </li>
              <li>
                <Link href="/data/unduh" className="text-muted-foreground hover:text-primary transition-colors">
                  Unduh Data
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 5: Bantuan & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-foreground tracking-wide uppercase">
              Bantuan & Regulasi
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  Tanya Jawab (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/privasi" className="text-muted-foreground hover:text-primary transition-colors">
                  Privasi Pelapor
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="text-muted-foreground hover:text-primary transition-colors">
                  Tentang PMBGM
                </Link>
              </li>
              <li className="pt-1">
                <a
                  href="tel:119"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
                >
                  <PhoneCall className="size-3.5" /> Darurat Ambulans: 119
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Baris Bawah Copyright */}
        <div className="mt-12 border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© 2026 PMBGM · Tim Ctrl Win Enter · Universitas Negeri Semarang (UNNES)</p>
          <p className="font-medium">Dibuat untuk Web In Action (MIA) 2026</p>
        </div>
      </div>
    </footer>
  );
}
