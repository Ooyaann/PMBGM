"use client";

import {
  Bar, BarChart, CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
  type TooltipContentProps, type TooltipValueType,
} from "recharts";
import { angka, persen, rupiah, rupiahRingkas } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Format dikirim sebagai nama (fungsi tidak bisa dikirim dari Server Component). */
export type Format = "angka" | "rupiah" | "persen" | "skor";

function fmt(f: Format, v: number, ringkas = false): string {
  // Spasi tak-putus agar label sumbu seperti "Rp750 M" tidak terbelah dua baris.
  return fmtDasar(f, v, ringkas).replace(/ /g, " ");
}

function fmtDasar(f: Format, v: number, ringkas: boolean): string {
  switch (f) {
    case "rupiah": return ringkas ? rupiahRingkas(v) : rupiah(v);
    case "persen": return persen(v);
    case "skor": return v.toLocaleString("id-ID", { maximumFractionDigits: 1 });
    default: return ringkas && v >= 1000 ? new Intl.NumberFormat("id-ID", { notation: "compact" }).format(v) : angka(v);
  }
}

type IsiTooltip = TooltipContentProps<TooltipValueType, string | number>;

const SUMBU = { tickLine: false, axisLine: false, tick: { fontSize: 11 } } as const;
const GRID = <CartesianGrid vertical={false} stroke="var(--chart-grid)" />;

/** Placeholder selama grafik digambar di browser; hilang otomatis begitu SVG Recharts muncul. */
function KerangkaGrafik() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 flex items-end gap-3 px-12 pb-6 group-has-[.recharts-surface]:hidden">
      {[40, 65, 50, 80, 60, 70].map((t, i) => (
        <span key={i} className="flex-1 animate-pulse rounded-t-md bg-muted" style={{ height: `${t}%` }} />
      ))}
    </div>
  );
}

function KotakTooltip({ judul, baris }: { judul: string; baris: { label: string; nilai: string; warna?: string }[] }) {
  return (
    <div className="min-w-36 rounded-xl border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold">{judul}</p>
      {baris.map((b) => (
        <p key={b.label} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            {b.warna && <span aria-hidden className="size-2 rounded-[2px]" style={{ background: b.warna }} />}
            {b.label}
          </span>
          <span className="angka font-semibold">{b.nilai}</span>
        </p>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Target vs realisasi (bullet): jalur target pucat, realisasi tipis di dalamnya.
// ---------------------------------------------------------------------------
export function GrafikTargetRealisasi({ data, labelTarget, labelNilai, format, tinggi = 260 }: {
  data: { label: string; target: number; nilai: number }[];
  labelTarget: string;
  labelNilai: string;
  format: Format;
  tinggi?: number;
}) {
  return (
    <div style={{ height: tinggi }} className="group relative">
      <KerangkaGrafik />
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          {GRID}
          <XAxis dataKey="label" xAxisId="jalur" {...SUMBU} />
          <XAxis dataKey="label" xAxisId="nilai" hide />
          <YAxis {...SUMBU} width={70} tickFormatter={(v: number) => fmt(format, v, true)} />
          <Tooltip
            cursor={{ fill: "var(--muted)", opacity: 0.6 }}
            content={({ active, payload, label }: IsiTooltip) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as { target: number; nilai: number };
              return (
                <KotakTooltip judul={String(label)} baris={[
                  { label: labelNilai, nilai: fmt(format, d.nilai, true), warna: "var(--chart-1)" },
                  { label: labelTarget, nilai: fmt(format, d.target, true), warna: "var(--chart-jalur)" },
                  { label: "Capaian", nilai: persen(d.target ? (100 * d.nilai) / d.target : null) },
                ]} />
              );
            }}
          />
          <Bar dataKey="target" xAxisId="jalur" fill="var(--chart-jalur)" barSize={24} radius={[4, 4, 0, 0]} isAnimationActive={false} />
          <Bar dataKey="nilai" xAxisId="nilai" fill="var(--chart-1)" barSize={12} radius={[4, 4, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Kolom satu seri
// ---------------------------------------------------------------------------
export function GrafikBatang({ data, labelNilai, format, tinggi = 220, sorot }: {
  data: { label: string; nilai: number }[];
  labelNilai: string;
  format: Format;
  tinggi?: number;
  /** Label batang yang disorot; lainnya memakai warna yang sama tetapi lebih pucat. */
  sorot?: string;
}) {
  return (
    <div style={{ height: tinggi }} className="group relative">
      <KerangkaGrafik />
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          {GRID}
          <XAxis dataKey="label" {...SUMBU} />
          <YAxis {...SUMBU} width={48} allowDecimals={false} tickFormatter={(v: number) => fmt(format, v, true)} />
          <Tooltip
            cursor={{ fill: "var(--muted)", opacity: 0.6 }}
            content={({ active, payload, label }: IsiTooltip) =>
              active && payload?.length ? (
                <KotakTooltip judul={String(label)} baris={[{ label: labelNilai, nilai: fmt(format, Number(payload[0].value)) }]} />
              ) : null}
          />
          <Bar dataKey="nilai" barSize={22} radius={[4, 4, 0, 0]} isAnimationActive={false}
            shape={(p: { x?: number; y?: number; width?: number; height?: number; payload?: { label: string } }) => {
              const { x = 0, y = 0, width = 0, height = 0 } = p;
              const r = Math.min(4, height);
              return (
                <path
                  d={`M${x},${y + height} V${y + r} Q${x},${y} ${x + r},${y} H${x + width - r} Q${x + width},${y} ${x + width},${y + r} V${y + height} Z`}
                  fill="var(--chart-1)"
                  opacity={sorot && p.payload?.label !== sorot ? 0.35 : 1}
                />
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Garis satu seri, dengan garis ambang opsional (mis. batas kategori risiko 40 dan 70)
// ---------------------------------------------------------------------------
export function GrafikGaris({ data, labelNilai, format, tinggi = 220, ambang, domain }: {
  data: { label: string; nilai: number }[];
  labelNilai: string;
  format: Format;
  tinggi?: number;
  ambang?: { nilai: number; label: string }[];
  domain?: [number, number];
}) {
  return (
    <div style={{ height: tinggi }} className="group relative">
      <KerangkaGrafik />
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          {GRID}
          <XAxis dataKey="label" {...SUMBU} interval="preserveStartEnd" minTickGap={16} />
          <YAxis {...SUMBU} width={40} domain={domain ?? ["auto", "auto"]} tickFormatter={(v: number) => fmt(format, v, true)} />
          {ambang?.map((a) => (
            <ReferenceLine key={a.nilai} y={a.nilai} stroke="var(--border)" strokeWidth={1}
              label={{ value: a.label, position: "insideTopRight", fontSize: 10, fill: "var(--muted-foreground)" }} />
          ))}
          <Tooltip
            cursor={{ stroke: "var(--border)" }}
            content={({ active, payload, label }: IsiTooltip) =>
              active && payload?.length ? (
                <KotakTooltip judul={String(label)} baris={[{ label: labelNilai, nilai: fmt(format, Number(payload[0].value)) }]} />
              ) : null}
          />
          <Line type="monotone" dataKey="nilai" stroke="var(--chart-1)" strokeWidth={2} isAnimationActive={false}
            dot={false} activeDot={{ r: 5, fill: "var(--chart-1)", stroke: "var(--card)", strokeWidth: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Kolom bertumpuk per kategori: urutan warna tetap, celah 2px warna permukaan antar-segmen.
// ---------------------------------------------------------------------------
export function GrafikTumpuk({ data, seri, tinggi = 260 }: {
  data: Record<string, string | number>[];
  seri: { kunci: string; label: string; warna: string }[];
  tinggi?: number;
}) {
  return (
    <div style={{ height: tinggi }} className="group relative">
      <KerangkaGrafik />
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          {GRID}
          <XAxis dataKey="label" {...SUMBU} />
          <YAxis {...SUMBU} width={36} allowDecimals={false} />
          <Tooltip
            cursor={{ fill: "var(--muted)", opacity: 0.6 }}
            content={({ active, payload, label }: IsiTooltip) => {
              if (!active || !payload?.length) return null;
              const isi = seri
                .map((s) => ({ label: s.label, nilai: Number((payload[0].payload as Record<string, number>)[s.kunci] ?? 0), warna: s.warna }))
                .filter((b) => b.nilai > 0);
              return <KotakTooltip judul={String(label)} baris={isi.map((b) => ({ ...b, nilai: angka(b.nilai) }))} />;
            }}
          />
          {seri.map((s, i) => (
            <Bar key={s.kunci} dataKey={s.kunci} stackId="a" fill={s.warna} barSize={24} isAnimationActive={false}
              stroke="var(--card)" strokeWidth={2}
              radius={i === seri.length - 1 ? [4, 4, 0, 0] : 0} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sumbangan komponen ke Indeks Risiko (0–100) sebagai satu bilah bertumpuk.
// ---------------------------------------------------------------------------
export function BilahKomponen({ komponen, className }: {
  komponen: { label: string; nilai: number; warna: string; keterangan: string }[];
  className?: string;
}) {
  const total = komponen.reduce((s, k) => s + k.nilai, 0);
  return (
    <div className={className}>
      <div className="flex h-4 w-full gap-0.5 overflow-hidden rounded-full bg-[var(--chart-jalur)]" role="img"
        aria-label={`Indeks ${total.toFixed(1)} dari 100: ${komponen.map((k) => `${k.label} ${k.nilai.toFixed(1)}`).join(", ")}`}>
        {komponen.filter((k) => k.nilai > 0.05).map((k) => (
          <span key={k.label} style={{ width: `${k.nilai}%`, background: k.warna }} title={`${k.label}: ${k.nilai.toFixed(1)}`} />
        ))}
      </div>
      <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        {komponen.map((k) => (
          <li key={k.label} className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
            <span className="flex min-w-0 items-center gap-2">
              <span aria-hidden className="size-2.5 shrink-0 rounded-[3px]" style={{ background: k.warna }} />
              <span className="min-w-0">
                <span className="block truncate font-medium">{k.label}</span>
                <span className="block truncate text-xs text-muted-foreground">{k.keterangan}</span>
              </span>
            </span>
            <span className={cn("angka shrink-0 font-semibold", k.nilai < 0.05 && "text-muted-foreground")}>+{k.nilai.toFixed(1)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
