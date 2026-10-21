"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scale, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

const TAUTAN = [
  { href: "/lacak", label: "Cek tiket", ikon: Ticket },
  { href: "/lacak/akuntabilitas", label: "Akuntabilitas", ikon: Scale },
];

export function NavLacak() {
  const pathname = usePathname();
  return (
    <nav aria-label="Menu Lacak" className="inline-flex rounded-xl bg-muted p-1">
      {TAUTAN.map((t) => {
        const aktif = t.href === "/lacak" ? pathname === "/lacak" : pathname.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href} aria-current={aktif ? "page" : undefined}
            className={cn("inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition",
              aktif ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
            <t.ikon className="size-4" aria-hidden /> {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
