"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TautanSub {
  href: string;
  label: string;
  ikon: LucideIcon;
}

function aktif(pathname: string | undefined, href: string, akar: string) {
  if (!pathname) return false;
  return href === akar ? pathname === akar : pathname.startsWith(href);
}

/** Sub-navigasi modul. Tanpa `pathname` (fallback Suspense) tampil tanpa penanda aktif. */
export function NavSubDasar({ label, akar, tautan, pathname }: {
  label: string;
  akar: string;
  tautan: TautanSub[];
  pathname?: string;
}) {
  return (
    <nav aria-label={label} className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="inline-flex min-w-max gap-1 rounded-xl bg-muted p-1">
        {tautan.map((t) => (
          <li key={t.href}>
            <Link href={t.href} aria-current={aktif(pathname, t.href, akar) ? "page" : undefined}
              className={cn("inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium whitespace-nowrap transition",
                aktif(pathname, t.href, akar) ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
              <t.ikon className="size-4" aria-hidden /> {t.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
