"use client";

import { usePathname } from "next/navigation";
import { GitCompareArrows, ListOrdered, Map, Siren } from "lucide-react";
import { NavSubDasar } from "@/components/situs/nav-sub";

const TAUTAN = [
  { href: "/insight", label: "Peta", ikon: Map },
  { href: "/insight/prioritas", label: "Prioritas", ikon: ListOrdered },
  { href: "/insight/peringatan", label: "Peringatan", ikon: Siren },
  { href: "/insight/banding", label: "Banding", ikon: GitCompareArrows },
];

export function NavInsightDasar({ pathname }: { pathname?: string }) {
  return <NavSubDasar label="Menu Insight" akar="/insight" tautan={TAUTAN} pathname={pathname} />;
}

export function NavInsight() {
  return <NavInsightDasar pathname={usePathname()} />;
}
