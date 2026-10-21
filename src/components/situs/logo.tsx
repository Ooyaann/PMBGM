import Link from "next/link";
import { cn } from "@/lib/utils";

/** Tanda: piring dari atas dengan tanda centang, makanan yang sudah diperiksa. */
export function TandaLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-8", className)}>
      <rect width="32" height="32" rx="9" className="fill-primary" />
      <circle cx="16" cy="16" r="9.5" className="fill-none stroke-primary-foreground/35" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="6.5" className="fill-primary-foreground/15" />
      <path
        d="M12.2 16.3l2.6 2.6 5.2-5.6"
        className="fill-none stroke-primary-foreground"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50", className)}>
      <TandaLogo />
      <span className="text-[1.05rem] font-bold tracking-tight">
        Pantau<span className="text-primary">Gizi</span>
      </span>
    </Link>
  );
}
