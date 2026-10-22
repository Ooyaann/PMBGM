"use client";

import { usePathname } from "next/navigation";
import { BarChart3, Download, HeartPulse, Map, Utensils } from "lucide-react";
import { NavSubDasar } from "@/components/situs/nav-sub";

const TAUTAN = [
  { href: "/data", label: "Ringkasan", ikon: BarChart3 },
  { href: "/data/wilayah", label: "Wilayah", ikon: Map },
  { href: "/data/sppg", label: "SPPG", ikon: Utensils },
  { href: "/data/kasus", label: "Kasus", ikon: HeartPulse },
  { href: "/data/unduh", label: "Unduh & API", ikon: Download },
];

/** Sub-navigasi Data Terbuka. Tanpa `pathname` (fallback Suspense) tampil tanpa penanda aktif. */
export function NavDataDasar({ pathname }: { pathname?: string }) {
  return <NavSubDasar label="Menu Data Terbuka" akar="/data" tautan={TAUTAN} pathname={pathname} />;
}

export function NavData() {
  return <NavDataDasar pathname={usePathname()} />;
}
