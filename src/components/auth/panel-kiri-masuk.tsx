import { ShieldCheck, Cpu, Clock } from "lucide-react";
import { TandaLogo } from "@/components/situs/logo";
import { IlustrasiMasuk } from "./ilustrasi-masuk";

export function PanelKiriMasuk() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between p-10 xl:p-12 h-full bg-gradient-to-br from-[#0c5947] via-[#094738] to-[#04281f] text-white overflow-hidden select-none">
      {/* Ambient Radial Background Glows */}
      <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-teal-300/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-80 rounded-full bg-white/5 blur-2xl" />

      {/* Top Branding */}
      <div className="relative z-10 flex items-center gap-3">
        <TandaLogo className="size-10 shrink-0 drop-shadow-md brightness-110" />
        <div>
          <span className="text-base font-black tracking-tight text-white block font-heading">
            PMBGM
          </span>
          <span className="text-xs font-medium text-white/75 block">
            Kawal Gizi, Jaga Generasi
          </span>
        </div>
      </div>

      {/* Center Hero Content */}
      <div className="relative z-10 my-auto py-6 space-y-5 max-w-lg">
        <h2 className="text-3xl xl:text-4xl font-black text-white tracking-tight leading-tight">
          Kawal Gizi,<br />Jaga Generasi.
        </h2>

        <p className="text-sm text-white/80 leading-relaxed font-normal">
          Platform kolaborasi sipil terpadu untuk memastikan distribusi Makan Bergizi Gratis (MBG) tepat sasaran, higienis, dan terverifikasi secara akuntabel.
        </p>

        {/* 3 Pills (Ala Reference Image) */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs font-medium backdrop-blur-xs">
            <ShieldCheck className="size-3.5 text-emerald-300" aria-hidden />
            Verifikasi Bertingkat
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs font-medium backdrop-blur-xs">
            <Cpu className="size-3.5 text-sky-300" aria-hidden />
            Bukti AI & EXIF
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs font-medium backdrop-blur-xs">
            <Clock className="size-3.5 text-amber-300" aria-hidden />
            Respon SLA 24 Jam
          </span>
        </div>

        {/* Minimalist Isometric Graphic */}
        <IlustrasiMasuk />
      </div>

      {/* Bottom Footer Attribution */}
      <div className="relative z-10 pt-4 border-t border-white/10">
        <p className="text-xs text-white/60 font-medium tracking-wide">
          Inovasi Pengawasan MBG • MIA 2026
        </p>
      </div>
    </div>
  );
}
