"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Download, HeartPulse, Map, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

const TAUTAN = [
  { href: "/data", label: "Ringkasan", ikon: BarChart3 },
  { href: "/data/wilayah", label: "Wilayah", ikon: Map },
  { href: "/data/sppg", label: "SPPG", ikon: Utensils },
  { href: "/data/kasus", label: "Kasus", ikon: HeartPulse },
  { href: "/data/unduh", label: "Unduh & API", ikon: Download },
];

function aktif(pathname: string | undefined, href: string) {
  if (!pathname) return false;
  return href === "/data" ? pathname === "/data" : pathname.startsWith(href);
}

/** Sub-navigasi Data Terbuka. Tanpa `pathname` (fallback Suspense) tampil tanpa penanda aktif. */
export function NavDataDasar({ pathname }: { pathname?: string }) {
  return (
    <nav aria-label="Menu Data Terbuka" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="inline-flex min-w-max gap-1 rounded-xl bg-muted p-1">
        {TAUTAN.map((t) => (
          <li key={t.href}>
            <Link href={t.href} aria-current={aktif(pathname, t.href) ? "page" : undefined}
              className={cn("inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium whitespace-nowrap transition",
                aktif(pathname, t.href) ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
              <t.ikon className="size-4" aria-hidden /> {t.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function NavData() {
  return <NavDataDasar pathname={usePathname()} />;
}
