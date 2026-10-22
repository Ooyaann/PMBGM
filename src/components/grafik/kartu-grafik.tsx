import type { ReactNode } from "react";
import { ChevronDown, Lightbulb, Table2 } from "lucide-react";
import { LabelSumber } from "@/components/data/label-sumber";
import type { SumberData } from "@/lib/label";
import { cn } from "@/lib/utils";

export interface DataTabel {
  kolom: string[];
  baris: (string | number)[][];
}

/**
 * Bingkai setiap grafik: judul, ringkasan bahasa awam (DT-06), label sumber (PRD 3.4),
 * dan tampilan tabel sebagai padanan aksesibel grafik.
 */
export function KartuGrafik({ judul, ringkasan, sumber, tabel, aksi, children, className }: {
  judul: string;
  ringkasan?: string;
  sumber: SumberData;
  tabel?: DataTabel;
  aksi?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("min-w-0 rounded-3xl border bg-card p-5 sm:p-6", className)} aria-label={judul}>
      <header className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="font-bold">{judul}</h2>
        <div className="flex items-center gap-2">
          {aksi}
          <LabelSumber jenis={sumber} />
        </div>
      </header>
      {ringkasan && (
        <p className="mt-1.5 flex gap-1.5 text-sm text-muted-foreground">
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-risiko-sedang" aria-hidden /> {ringkasan}
        </p>
      )}
      <div className="mt-4">{children}</div>
      {tabel && <TabelData tabel={tabel} className="mt-3" />}
    </section>
  );
}

/** Padanan tabel untuk grafik atau peta, terlipat secara bawaan. */
export function TabelData({ tabel, className }: { tabel: DataTabel; className?: string }) {
  return (
    <details className={cn("group", className)}>
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground [&::-webkit-details-marker]:hidden">
        <Table2 className="size-3.5" aria-hidden /> Tabel
        <ChevronDown className="size-3.5 transition group-open:rotate-180" aria-hidden />
      </summary>
      <div className="mt-2 max-h-80 overflow-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted text-xs text-muted-foreground">
            <tr>{tabel.kolom.map((k) => <th key={k} scope="col" className="p-2 text-left font-medium">{k}</th>)}</tr>
          </thead>
          <tbody className="angka divide-y">
            {tabel.baris.map((b, i) => (
              <tr key={i}>{b.map((sel, j) => <td key={j} className="p-2">{sel}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

/** Legenda untuk grafik ≥ 2 seri: penanda berwarna di samping teks, teks tetap warna teks. */
export function Legenda({ butir }: { butir: { label: string; warna: string; bentuk?: "kotak" | "garis" }[] }) {
  return (
    <ul className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
      {butir.map((b) => (
        <li key={b.label} className="flex items-center gap-1.5">
          <span aria-hidden className={b.bentuk === "garis" ? "h-0.5 w-3 rounded" : "size-2.5 rounded-[3px]"} style={{ background: b.warna }} />
          {b.label}
        </li>
      ))}
    </ul>
  );
}
