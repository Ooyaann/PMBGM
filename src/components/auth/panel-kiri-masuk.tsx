import { TandaLogo } from "@/components/situs/logo";
import { KartuPratinjauGizi } from "./kartu-pratinjau-gizi";

export function PanelKiriMasuk() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between p-8 xl:p-12 h-full bg-gradient-to-br from-[#0c5947] via-[#094738] to-[#04281f] text-white overflow-hidden select-none">
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
          <span className="text-xs font-medium text-white/75 block">
            Pemantau MBG Masyarakat
          </span>
        </div>
      </div>

      {/* Konten Hero Pusat */}
      <div className="relative z-10 my-auto py-4 space-y-4 max-w-lg">
        <div className="space-y-2">
          <h2 className="text-2xl xl:text-3xl font-black text-white tracking-tight leading-snug">
            Kawal Kualitas Makan Bergizi Gratis.
          </h2>
          <p className="text-xs xl:text-sm text-white/80 leading-relaxed font-normal">
            Platform pengawasan partisipatif masyarakat untuk memastikan setiap porsi makanan anak sekolah terjamin higienitasnya, mencukupi gizi harian, dan tersalurkan tepat waktu.
          </p>
        </div>

        {/* Mockup Pemantauan Menu Gizi Nyata */}
        <KartuPratinjauGizi />

        {/* Ringkasan Dampak Nyata */}
        <div className="grid grid-cols-3 gap-3 pt-2 text-center border-t border-white/10">
          <div>
            <span className="text-base xl:text-lg font-black text-white block">165+</span>
            <span className="text-[10px] xl:text-[11px] text-white/70 block mt-0.5">Sekolah Terdata</span>
          </div>
          <div>
            <span className="text-base xl:text-lg font-black text-white block">40</span>
            <span className="text-[10px] xl:text-[11px] text-white/70 block mt-0.5">Dapur Mitra SPPG</span>
          </div>
          <div>
            <span className="text-base xl:text-lg font-black text-white block">&lt; 24 Jam</span>
            <span className="text-[10px] xl:text-[11px] text-white/70 block mt-0.5">Respons Cepat</span>
          </div>
        </div>
      </div>

      {/* Footer Bawah */}
      <div className="relative z-10 pt-3 border-t border-white/10">
        <p className="text-xs text-white/60 font-medium tracking-wide">
          Inovasi Pengawasan MBG • MIA 2026
        </p>
      </div>
    </div>
  );
}
