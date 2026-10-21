"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, CircleCheck, Clock, FolderOpen, Star, TriangleAlert, type LucideIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { durasiJam, persen } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface BarisAkuntabilitas {
  id: string;
  nama: string;
  sub: string | null;
  href: string | null;
  kasus: number;
  selesai: number | null;
  jamRespons: number | null;
  terlambat: number | null;
  tidakDitanggapi: number;
  kepuasan: number | null;
  jumlahRating: number;
}

type Kolom = "kasus" | "selesai" | "jamRespons" | "terlambat" | "kepuasan";

const KOLOM: { kunci: Kolom; label: string; ikon: LucideIcon; definisi: string; makinKecilMakinBaik?: boolean }[] = [
  { kunci: "kasus", label: "Kasus", ikon: FolderOpen, definisi: "Jumlah kasus terverifikasi" },
  { kunci: "selesai", label: "Selesai", ikon: CircleCheck, definisi: "Persentase kasus yang sudah selesai ditindaklanjuti" },
  { kunci: "jamRespons", label: "Tanggap", ikon: Clock, definisi: "Rata-rata waktu dari diteruskan sampai tanggapan pertama instansi", makinKecilMakinBaik: true },
  { kunci: "terlambat", label: "Terlambat", ikon: TriangleAlert, definisi: "Persentase kasus yang pernah melewati batas waktu", makinKecilMakinBaik: true },
  { kunci: "kepuasan", label: "Kepuasan", ikon: Star, definisi: "Rata-rata penilaian pelapor (1–5)" },
];

function nadaTerlambat(p: number | null) {
  if (p == null) return "text-muted-foreground";
  return p < 30 ? "text-risiko-rendah" : p < 60 ? "text-risiko-sedang" : "text-risiko-tinggi";
}
function nadaKepuasan(k: number | null) {
  if (k == null) return "text-muted-foreground";
  return k >= 4 ? "text-risiko-rendah" : k >= 3 ? "text-foreground" : "text-risiko-tinggi";
}

function BarSelesai({ nilai }: { nilai: number | null }) {
  return (
    <span className="flex items-center gap-2">
      <span className="h-1.5 w-14 overflow-hidden rounded-full bg-muted" aria-hidden>
        <span className="block h-full rounded-full bg-primary" style={{ width: `${nilai ?? 0}%` }} />
      </span>
      <span className="angka w-12 text-right">{persen(nilai)}</span>
    </span>
  );
}

function Nilai({ kolom, b }: { kolom: Kolom; b: BarisAkuntabilitas }) {
  switch (kolom) {
    case "kasus": return <span className="angka font-semibold">{b.kasus}</span>;
    case "selesai": return <BarSelesai nilai={b.selesai} />;
    case "jamRespons": return <span className="angka">{durasiJam(b.jamRespons)}</span>;
    case "terlambat": return (
      <span className={cn("angka inline-flex items-center gap-1.5 font-semibold", nadaTerlambat(b.terlambat))}>
        {persen(b.terlambat)}
        {b.tidakDitanggapi > 0 && (
          <span className="rounded-full bg-risiko-tinggi px-1.5 text-[10px] font-bold text-white" title={`${b.tidakDitanggapi} belum ditanggapi`}>
            {b.tidakDitanggapi}
          </span>
        )}
      </span>
    );
    case "kepuasan": return (
      <span className={cn("angka inline-flex items-center gap-1 font-semibold", nadaKepuasan(b.kepuasan))}>
        <Star className="size-3.5 fill-current" aria-hidden />
        {b.kepuasan?.toLocaleString("id-ID", { maximumFractionDigits: 1 }) ?? "–"}
      </span>
    );
  }
}

/** Papan Akuntabilitas (LC-08): bisa diurutkan per kolom; tabel di layar lebar, kartu di HP. */
export function TabelAkuntabilitas({ sppg, kecamatan }: { sppg: BarisAkuntabilitas[]; kecamatan: BarisAkuntabilitas[] }) {
  const [tampil, setTampil] = useState<"sppg" | "kecamatan">("sppg");
  const [urut, setUrut] = useState<{ kolom: Kolom; turun: boolean }>({ kolom: "kasus", turun: true });

  const baris = useMemo(() => {
    const data = tampil === "sppg" ? sppg : kecamatan;
    return [...data].sort((a, b) => {
      const x = a[urut.kolom] ?? -Infinity;
      const y = b[urut.kolom] ?? -Infinity;
      return urut.turun ? y - x : x - y;
    });
  }, [tampil, sppg, kecamatan, urut]);

  const pilihUrut = (kolom: Kolom) =>
    setUrut((u) => (u.kolom === kolom ? { kolom, turun: !u.turun } : { kolom, turun: true }));

  return (
    <div>
      <Tabs value={tampil} onValueChange={(v) => setTampil(v as typeof tampil)}>
        <TabsList>
          <TabsTrigger value="sppg">Per SPPG</TabsTrigger>
          <TabsTrigger value="kecamatan">Per kecamatan</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Urutkan (dipakai juga di HP) */}
      <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label="Urutkan menurut">
        {KOLOM.map((k) => {
          const aktif = urut.kolom === k.kunci;
          return (
            <Tooltip key={k.kunci}>
              <TooltipTrigger
                render={<button type="button" />}
                onClick={() => pilihUrut(k.kunci)}
                aria-pressed={aktif}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition",
                  aktif ? "border-primary bg-secondary text-secondary-foreground" : "bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                <k.ikon className="size-3.5" aria-hidden /> {k.label}
                {aktif && (urut.turun ? <ArrowDown className="size-3.5" aria-label="menurun" /> : <ArrowUp className="size-3.5" aria-label="menaik" />)}
              </TooltipTrigger>
              <TooltipContent className="max-w-60">{k.definisi}{k.makinKecilMakinBaik ? " · makin kecil makin baik" : ""}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      {/* Tabel (layar lebar) */}
      <div className="mt-4 hidden overflow-hidden rounded-3xl border bg-card md:block">
        <table className="w-full text-sm">
          <caption className="sr-only">Papan akuntabilitas {tampil === "sppg" ? "per SPPG" : "per kecamatan"}</caption>
          <thead className="bg-muted/50 text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="p-3 pl-5 text-left font-medium">{tampil === "sppg" ? "SPPG" : "Kecamatan"}</th>
              {KOLOM.map((k) => (
                <th key={k.kunci} scope="col" className="p-3 text-left font-medium"
                  aria-sort={urut.kolom === k.kunci ? (urut.turun ? "descending" : "ascending") : undefined}>
                  <button type="button" onClick={() => pilihUrut(k.kunci)} className="inline-flex items-center gap-1 hover:text-foreground">
                    <k.ikon className="size-3.5" aria-hidden /> {k.label}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {baris.map((b) => (
              <tr key={b.id} className="transition hover:bg-muted/40">
                <td className="p-3 pl-5">
                  {b.href
                    ? <Link href={b.href} className="font-semibold hover:text-primary hover:underline">{b.nama}</Link>
                    : <span className="font-semibold">{b.nama}</span>}
                  {b.sub && <span className="block text-xs text-muted-foreground">{b.sub}</span>}
                </td>
                {KOLOM.map((k) => <td key={k.kunci} className="p-3"><Nilai kolom={k.kunci} b={b} /></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Kartu (HP) */}
      <ul className="mt-4 grid gap-3 md:hidden">
        {baris.map((b) => (
          <li key={b.id} className="rounded-2xl border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                {b.href
                  ? <Link href={b.href} className="font-semibold hover:text-primary">{b.nama}</Link>
                  : <span className="font-semibold">{b.nama}</span>}
                {b.sub && <span className="block text-xs text-muted-foreground">{b.sub}</span>}
              </div>
              <Nilai kolom="kepuasan" b={b} />
            </div>
            <dl className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
              {KOLOM.filter((k) => k.kunci !== "kepuasan").map((k) => (
                <div key={k.kunci} className="rounded-lg bg-muted/60 p-2">
                  <dt className="flex justify-center text-muted-foreground"><k.ikon className="size-3.5" aria-label={k.label} /></dt>
                  <dd className="mt-1 font-medium">
                    {k.kunci === "selesai" ? <span className="angka">{persen(b.selesai)}</span> : <Nilai kolom={k.kunci} b={b} />}
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
