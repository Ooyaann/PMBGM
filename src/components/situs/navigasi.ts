import { BarChart3, BookOpen, ClipboardList, Home, Megaphone, Radar, School, type LucideIcon } from "lucide-react";

export interface ItemNav {
  href: string;
  label: string;
  ikon: LucideIcon;
}

/** Navigasi utama situs PMBGM */
export const NAV_UTAMA: ItemNav[] = [
  { href: "/", label: "Beranda", ikon: Home },
  { href: "/lapor", label: "Lapor", ikon: Megaphone },
  { href: "/lacak", label: "Lacak", ikon: ClipboardList },
  { href: "/data", label: "Data Terbuka", ikon: BarChart3 },
  { href: "/insight", label: "Insight", ikon: Radar },
  { href: "/cari-sekolah", label: "Cari Sekolah", ikon: School },
  { href: "/panduan", label: "Panduan", ikon: BookOpen },
];

