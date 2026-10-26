import Link from "next/link";
import { ChevronRight } from "lucide-react";

/** Jejak drill-down provinsi → kab/kota → kecamatan (DT-02). */
export function Remah({ butir }: { butir: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Jejak wilayah">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {butir.map((b, i) => (
          <li key={b.label} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="size-3.5" aria-hidden />}
            {b.href ? (
              <Link href={b.href} className="rounded px-1 hover:bg-muted hover:text-foreground">{b.label}</Link>
            ) : (
              <span aria-current="page" className="px-1 font-semibold text-foreground">{b.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Tile angka ringkas: label kecil, nilai besar (angka proporsional, bukan tabular). */
export function Tile({ label, nilai, sub, ikon: Ikon }: {
  label: string;
  nilai: string;
  sub?: React.ReactNode;
  ikon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <dt className="flex items-center gap-1.5 text-sm text-muted-foreground">
        {Ikon && <Ikon className="size-4" />} {label}
      </dt>
      <dd className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{nilai}</dd>
      {sub && <dd className="mt-0.5 text-xs text-muted-foreground">{sub}</dd>}
    </div>
  );
}

/** Meter persentase (fill + jalur dari ramp yang sama). */
export function Meter({ nilai, className }: { nilai: number | null; className?: string }) {
  return (
    <span className={className}>
      <span className="block h-1.5 w-full overflow-hidden rounded-full bg-[var(--seq-100)]" aria-hidden>
        <span className="block h-full rounded-full bg-[var(--chart-1)]" style={{ width: `${Math.min(100, nilai ?? 0)}%` }} />
      </span>
    </span>
  );
}
