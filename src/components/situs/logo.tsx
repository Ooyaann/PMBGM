import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Simbol Ikon Resmi PMBGM (Kaca Pembesar & Ompreng MBG Berwarna).
 */
export function TandaLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo-pmbgm-ikon.png"
      alt="Ikon PMBGM"
      width={40}
      height={40}
      className={cn(
        "size-9 shrink-0 object-contain transition-transform duration-200 group-hover:scale-105",
        className
      )}
    />
  );
}

/**
 * Komponen Logo Lengkap PMBGM: Simbol Kaca Pembesar & Ompreng MBG
 * beserta tipografi resmi Pemantau MBG Masyarakat.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group flex items-center gap-2 rounded-xl outline-none transition focus-visible:ring-2 focus-visible:ring-ring/50",
        className
      )}
    >
      <Image
        src="/logo-pmbgm.png"
        alt="PMBGM - Pemantau MBG Masyarakat"
        width={185}
        height={38}
        priority
        className="h-8 sm:h-9 w-auto max-w-[190px] object-contain transition-transform duration-200 group-hover:opacity-95"
      />
    </Link>
  );
}
