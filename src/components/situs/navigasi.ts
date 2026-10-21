import { BarChart3, ClipboardList, Megaphone, Radar, School, type LucideIcon } from "lucide-react";

export interface ItemNav {
  href: string;
  label: string;
  ikon: LucideIcon;
}

/** Empat modul inti (PRD 3.1) ditambah Cari Sekolah Saya. */
export const NAV_UTAMA: ItemNav[] = [
  { href: "/lapor", label: "Lapor", ikon: Megaphone },
  { href: "/lacak", label: "Lacak", ikon: ClipboardList },
  { href: "/data", label: "Data Terbuka", ikon: BarChart3 },
  { href: "/insight", label: "Insight", ikon: Radar },
  { href: "/cari-sekolah", label: "Cari Sekolah", ikon: School },
];
