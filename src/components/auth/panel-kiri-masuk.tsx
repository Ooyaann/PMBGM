import { TandaLogo } from "@/components/situs/logo";

export function PanelKiriMasuk() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between p-12 xl:p-16 h-full bg-gradient-to-br from-[#0c5947] via-[#094738] to-[#04281f] text-white overflow-hidden select-none">
      {/* Pendar Halus Latar Belakang */}
      <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-teal-300/10 blur-3xl" />

      {/* Brand Header */}
      <div className="relative z-10 flex items-center gap-3">
        <TandaLogo className="size-10 shrink-0 drop-shadow-md brightness-110" />
        <div>
          <span className="text-base font-black tracking-tight text-white block font-heading">
            PMBGM
          </span>
          <span className="text-xs font-medium text-white/70 block">
            Pemantau MBG Masyarakat
          </span>
        </div>
      </div>

      {/* Konten Hero Tengah - Super Simple & Bersih (Persis Gaya Referensi) */}
      <div className="relative z-10 my-auto py-8 space-y-4 max-w-md">
        <h2 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-[1.15]">
          Kawal Gizi,<br />
          Jaga Generasi.
        </h2>

        <p className="text-sm xl:text-base text-white/75 leading-relaxed font-normal pt-1">
          Pengawasan independen mutu dan distribusi Makan Bergizi Gratis di seluruh Indonesia.
        </p>
      </div>

      {/* Footer Bawah */}
      <div className="relative z-10 pt-4 border-t border-white/10">
        <p className="text-xs text-white/50 font-medium">
          MIA 2026 • Inovasi Pengawasan MBG
        </p>
      </div>
    </div>
  );
}
