import type { KomponenIndeks } from "@/lib/indeks";
import { cn } from "@/lib/utils";

/**
 * Indeks sebagai bilah 0–100 bertumpuk menurut sumbangan komponen.
 * Lebar penuh = 100 poin, jadi panjang bilah langsung terbaca sebagai skor.
 */
export function BilahMini({ komponen, className }: { komponen: KomponenIndeks[]; className?: string }) {
  const total = komponen.reduce((s, k) => s + k.nilai, 0);
  return (
    <div role="img" className={cn("flex h-2.5 w-full gap-px overflow-hidden rounded-full bg-[var(--chart-jalur)]", className)}
      aria-label={`Indeks ${total.toFixed(0)}: ${komponen.filter((k) => k.nilai >= 0.5).map((k) => `${k.label} ${k.nilai.toFixed(0)}`).join(", ")}`}>
      {komponen.filter((k) => k.nilai >= 0.5).map((k, i, arr) => (
        <span key={k.kunci} title={`${k.label} +${k.nilai.toFixed(1)}`}
          className={cn(i === arr.length - 1 && "rounded-r-full")}
          style={{ width: `${k.nilai}%`, background: k.warna }} />
      ))}
    </div>
  );
}
