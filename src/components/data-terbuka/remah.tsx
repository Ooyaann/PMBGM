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

import { InfoMetrik } from "@/components/ui/info-metrik";

/** Tile angka ringkas: label nyaman dibaca, nilai tegas, dilengkapi hover keterangan metrik jika relevan. */
export function Tile({
  label,
  nilai,
  sub,
  ikon: Ikon,
  infoKey,
}: {
  label: string;
  nilai: string;
  sub?: React.ReactNode;
  ikon?: React.ComponentType<{ className?: string }>;
  infoKey?: "pagu" | "realisasi" | "penerima" | "sppg" | "risiko" | "slhs" | "tanggap" | "selesai" | "terlambat" | "kepuasan" | "sinyal" | "prioritas" | "status_operasional" | "kredibilitas" | "porsi" | "kasus_per_100rb";
}) {
  const kunci =
    infoKey ??
    (label.toLowerCase().includes("pagu")
      ? "pagu"
      : label.toLowerCase().includes("realisasi")
        ? "realisasi"
        : label.toLowerCase().includes("penerima")
          ? "penerima"
          : label.toLowerCase().includes("sppg") || label.toLowerCase().includes("dapur")
            ? "sppg"
            : undefined);

  return (
    <div className="rounded-2xl border bg-card p-4 transition-shadow hover:shadow-xs">
      <dt className="flex items-center justify-between text-sm text-muted-foreground font-medium">
        <span className="flex items-center gap-1.5">
          {Ikon && <Ikon className="size-4 shrink-0" />} {label}
        </span>
        {kunci && (
          <InfoMetrik jenis={kunci} side="top">
            <span className="text-[11px] font-semibold text-primary/80 group-hover:underline">info</span>
          </InfoMetrik>
        )}
      </dt>
      <dd className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">{nilai}</dd>
      {sub && <dd className="mt-1 text-xs text-muted-foreground">{sub}</dd>}
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
