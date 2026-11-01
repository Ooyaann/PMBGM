import { CheckCircle2, ShieldCheck, Utensils, School, MapPin, Sparkles } from "lucide-react";

export function KartuPratinjauGizi() {
  return (
    <div className="relative mx-auto my-5 w-full max-w-[430px] rounded-3xl border border-white/20 bg-white/10 p-5 text-white shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-white/30 select-none">
      {/* Glow Ambient Card */}
      <div className="pointer-events-none absolute -top-8 -right-8 size-32 rounded-full bg-emerald-400/20 blur-2xl" />

      {/* Header Kartu */}
      <div className="flex items-start justify-between gap-3 border-b border-white/15 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/15 border border-white/20 text-white">
            <School className="size-4.5" aria-hidden />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">SDN 04 Menteng</span>
              <span className="text-[10px] text-white/60">·</span>
              <span className="text-[11px] text-white/75">Jakarta Pusat</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-200 mt-0.5">
              <MapPin className="size-2.5" />
              <span>Radius Dapur: 2.1 km (Mitra SPPG 02)</span>
            </div>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/25 border border-emerald-400/40 px-2.5 py-1 text-[10px] font-bold text-emerald-200 shadow-2xs">
          <ShieldCheck className="size-3" aria-hidden />
          Terverifikasi
        </span>
      </div>

      {/* Menu Makanan Terpantau */}
      <div className="py-3.5 space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/80">
          <Utensils className="size-3.5 text-amber-300" aria-hidden />
          <span>Menu MBG Hari Ini:</span>
        </div>
        <p className="text-xs text-white/95 font-medium leading-relaxed bg-black/20 rounded-xl p-2.5 border border-white/10">
          Nasi Putih, Ayam Panggang Fillet, Sayur Sop Bening Brokoli-Wortel, Buah Pisang, & Susu UHT 200ml
        </p>
      </div>

      {/* Metrik Gizi & Higienitas */}
      <div className="grid grid-cols-3 gap-2 pt-1 pb-2">
        <div className="rounded-xl bg-white/8 p-2 border border-white/10 text-center">
          <span className="text-[10px] text-white/70 block">Kalori & Gizi</span>
          <span className="text-xs font-extrabold text-white mt-0.5 block">645 kkal</span>
          <span className="text-[9px] text-emerald-300 font-medium">Memenuhi AKG</span>
        </div>
        <div className="rounded-xl bg-white/8 p-2 border border-white/10 text-center">
          <span className="text-[10px] text-white/70 block">Suhu Makanan</span>
          <span className="text-xs font-extrabold text-white mt-0.5 block">62°C</span>
          <span className="text-[9px] text-emerald-300 font-medium">Hangat Higienis</span>
        </div>
        <div className="rounded-xl bg-white/8 p-2 border border-white/10 text-center">
          <span className="text-[10px] text-white/70 block">Validasi AI</span>
          <span className="text-xs font-extrabold text-white mt-0.5 block">EXIF GPS</span>
          <span className="text-[9px] text-sky-300 font-medium">Kamera Asli</span>
        </div>
      </div>

      {/* Footer Kartu Pengawas */}
      <div className="mt-2.5 pt-2.5 border-t border-white/15 flex items-center justify-between text-[10px] text-white/75">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="size-3 text-emerald-300" />
          <span>Divalidasi Tim Lapangan & Komite Sekolah</span>
        </div>
        <span className="text-white/60">11:30 WIB</span>
      </div>
    </div>
  );
}
