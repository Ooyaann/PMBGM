"use client";

import type { ReactElement, ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Elemen ikon dengan label yang muncul saat hover/fokus. Label yang sama dipakai sebagai aria-label,
 * jadi pembaca layar tetap mendapat nama tombol. Pakai hanya untuk ikon yang maknanya jelas tanpa teks
 * (panah, silang, tempat sampah), karena tooltip tidak muncul di layar sentuh.
 */
export function Bertip({ label, render, children, sisi = "top" }: {
  label: string;
  /** Elemen pemicu tanpa children, mis. <button type="button" /> atau <Link href="/" />. */
  render: ReactElement;
  children: ReactNode;
  sisi?: "top" | "bottom" | "left" | "right";
}) {
  return (
    <Tooltip>
      <TooltipTrigger render={render} aria-label={label}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={sisi}>{label}</TooltipContent>
    </Tooltip>
  );
}
