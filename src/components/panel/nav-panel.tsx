"use client";

import { usePathname } from "next/navigation";
import { FolderKanban, Inbox, LayoutDashboard, Timer, Users } from "lucide-react";
import { NavSubDasar, type TautanSub } from "@/components/situs/nav-sub";
import type { Peran } from "@/lib/sesi";

function tautan(peran: Peran): TautanSub[] {
  const t: TautanSub[] = [{ href: "/panel", label: "Beranda", ikon: LayoutDashboard }];
  if (peran === "verifikator" || peran === "admin") t.push({ href: "/panel/verifikasi", label: "Antrean", ikon: Inbox });
  t.push({ href: "/panel/kasus", label: "Kasus", ikon: FolderKanban });
  if (peran === "admin") {
    t.push({ href: "/panel/admin/pengguna", label: "Pengguna", ikon: Users });
    t.push({ href: "/panel/admin/sla", label: "Batas waktu", ikon: Timer });
  }
  return t;
}

export function NavPanelDasar({ peran, pathname }: { peran: Peran; pathname?: string }) {
  return <NavSubDasar label="Menu panel" akar="/panel" tautan={tautan(peran)} pathname={pathname} />;
}

export function NavPanel({ peran }: { peran: Peran }) {
  return <NavPanelDasar peran={peran} pathname={usePathname()} />;
}
