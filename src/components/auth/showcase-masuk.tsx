import { ShieldCheck, Cpu, Clock, CheckCircle2, Award, LockKeyhole } from "lucide-react";
import { TandaLogo } from "@/components/situs/logo";

export function ShowcaseMasuk() {
  return (
    <div className="hidden lg:flex flex-col justify-between space-y-8 pr-4 lg:pr-8 py-2">
      {/* Header & Tagline */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold tracking-wide">
          <Award className="size-3.5" aria-hidden />
          <span>MIA 2026 • Inovasi Pengawasan MBG</span>
        </div>

        <div className="flex items-center gap-3.5 pt-1">
          <TandaLogo className="size-11 shrink-0 drop-shadow-sm" />
          <div>
            <h2 className="text-2xl font-black tracking-tight text-foreground font-heading">
              PMBGM
            </h2>
            <p className="text-xs font-medium text-muted-foreground">
              Pemantau MBG Mandiri & Terdesentralisasi
            </p>
          </div>
        </div>

        <h3 className="text-3xl font-extrabold text-foreground tracking-tight leading-snug">
          Transparansi Menu Gizi Nasional di Tangan Komunitas & Petugas.
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Platform kolaborasi sipil terpadu untuk memastikan distribusi Makan Bergizi Gratis (MBG) tepat sasaran, higienis, dan terverifikasi secara akuntabel.
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="space-y-3.5">
        <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-card/60 border border-border/80 shadow-2xs backdrop-blur-xs transition hover:border-primary/30">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/25 text-primary">
            <ShieldCheck className="size-5" aria-hidden />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-foreground">Verifikasi Bertingkat 3 Lapis</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Laporan warga & sekolah diverifikasi silang oleh relawan lapangan sebelum diteruskan ke instansi berwenang.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-card/60 border border-border/80 shadow-2xs backdrop-blur-xs transition hover:border-primary/30">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-info-lembut border border-info/25 text-info">
            <Cpu className="size-5" aria-hidden />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-foreground">Integritas Bukti Digital & AI</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Pemeriksaan otomatis metadata EXIF kamera, koordinat geofencing sekolah, dan deteksi anomali gizi.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-card/60 border border-border/80 shadow-2xs backdrop-blur-xs transition hover:border-primary/30">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-risiko-sedang-lembut border border-risiko-sedang/25 text-risiko-sedang">
            <Clock className="size-5" aria-hidden />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-foreground">Akuntabilitas SLA Respons 24–48 Jam</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Eskalasi otomatis dan pemantauan batas waktu tindak lanjut bagi Dapur SPPG, Dinkes, dan Korwil BGN.
            </p>
          </div>
        </div>
      </div>

      {/* Trust Badges Footer */}
      <div className="pt-2 border-t border-border/60">
        <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-[11px] font-semibold text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-primary" aria-hidden />
            Row-Level Security (RLS)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <LockKeyhole className="size-3.5 text-primary" aria-hidden />
            Enkripsi TLS & Audit Trail
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-primary" aria-hidden />
            WCAG 2.1 AA Compliant
          </span>
        </div>
      </div>
    </div>
  );
}
