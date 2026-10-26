import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Simbol Resmi PMBGM: Kaca Pembesar & Ompreng MBG Ceria Berwarna
 * dengan garis kontur tebal putih (die-cut sticker border) yang mengikuti persis siluet logo
 * serta tipografi identitas PMBGM yang elegan dan berwibawa.
 */
export function TandaLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden
      className={cn(
        "size-9 shrink-0 transition-transform duration-200 group-hover:scale-105",
        className,
      )}
      fill="none"
    >
      <defs>
        {/* Bayangan halus agar kontur putih terlihat tegas dan kontras di background putih maupun gelap */}
        <filter id="pmbgm-contour-shadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#0f172a" floodOpacity="0.2" />
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0d9488" floodOpacity="0.14" />
        </filter>
        <linearGradient id="pmbgm-gagang-grad" x1="28" y1="28" x2="41" y2="41" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
        <linearGradient id="pmbgm-ring-grad" x1="5" y1="5" x2="33" y2="33" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
      </defs>

      {/* KONTUR BOLD PUTIH (Mengikuti Lekukan Siluet Kaca Pembesar Persis, Bukan Bulat / Kotak) */}
      <g filter="url(#pmbgm-contour-shadow)">
        {/* Gagang Kaca Pembesar Putih Tebal */}
        <path d="M28 28 L40.5 40.5" stroke="#ffffff" strokeWidth="9.5" strokeLinecap="round" />
        {/* Kepala Lensa Putih Tebal yang Menyatu dengan Gagang */}
        <circle cx="19" cy="19" r="16.5" fill="#ffffff" stroke="#ffffff" strokeWidth="2" />
      </g>

      {/* Gagang Kaca Pembesar Teal Segar */}
      <path d="M28.5 28.5 L40.5 40.5" stroke="#0f766e" strokeWidth="5.2" strokeLinecap="round" />
      <path d="M28.5 28.5 L39.5 39.5" stroke="url(#pmbgm-gagang-grad)" strokeWidth="4.2" strokeLinecap="round" />
      <path d="M29.5 29.5 L38 38" stroke="#5eead4" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="40.5" cy="40.5" r="2.2" fill="#042f2e" />

      {/* Ring Lensa Kaca Pembesar */}
      <circle cx="19" cy="19" r="14.5" stroke="url(#pmbgm-ring-grad)" strokeWidth="3" />
      <circle cx="19" cy="19" r="13" stroke="#0f766e" strokeWidth="0.6" fill="#f8fafc" />

      {/* Baki Ompreng MBG Stainless Steel */}
      <rect x="9.5" y="10" width="19" height="18" rx="3.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
      <rect x="10.5" y="11" width="17" height="16" rx="2.8" fill="#ffffff" />

      {/* Kompartemen Makanan Ceria Berwarna */}
      {/* 1. Lauk Ayam Goreng / Protein (Oranye Keemasan) */}
      <rect x="11.5" y="12" width="7" height="6.5" rx="1.8" fill="#f97316" />
      <circle cx="15" cy="15.2" r="1.8" fill="#fdba74" />
      <path d="M14.5 15.2 L16.8 16.5" stroke="#fff7ed" strokeWidth="0.8" strokeLinecap="round" />

      {/* 2. Sayuran Brokoli Hijau Segar */}
      <rect x="19.5" y="12" width="7" height="6.5" rx="1.8" fill="#10b981" />
      <circle cx="22.2" cy="15" r="1.3" fill="#6ee7b7" />
      <circle cx="23.8" cy="15" r="1.3" fill="#6ee7b7" />

      {/* 3. Buah Stroberi/Semangka Merah Ceria */}
      <rect x="11.5" y="19.5" width="4.8" height="6.5" rx="1.5" fill="#ef4444" />
      <circle cx="13.9" cy="22.7" r="1.2" fill="#fca5a5" />

      {/* 4. Nasi Putih Pulen Hangat & Bergizi */}
      <rect x="17.3" y="19.5" width="9.2" height="6.5" rx="1.5" fill="#f59e0b" />
      <rect x="18" y="20.2" width="7.8" height="5.1" rx="1.2" fill="#ffffff" />
      <circle cx="21.9" cy="22.7" r="1" fill="#fef08a" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group flex items-center gap-2.5 rounded-xl outline-none transition focus-visible:ring-2 focus-visible:ring-ring/50",
        className,
      )}
    >
      <TandaLogo />
      <div className="flex flex-col justify-center text-left">
        <div className="flex items-baseline leading-none">
          <span className="text-[1.35rem] font-black tracking-tight select-none">
            <span className="text-teal-600 transition-colors group-hover:text-teal-500">P</span>
            <span className="text-slate-900 transition-colors dark:text-white">MBG</span>
            <span className="text-emerald-600 transition-colors group-hover:text-emerald-500">M</span>
          </span>
        </div>
        <span className="mt-0.5 text-[9.5px] font-bold tracking-[0.08em] text-slate-500 transition-colors group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200 uppercase select-none">
          Pemantau MBG Masyarakat
        </span>
      </div>
    </Link>
  );
}
