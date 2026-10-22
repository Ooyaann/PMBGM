import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import {
  BarChart3, Check, CheckCircle2, FolderOpen, GraduationCap, HeartPulse, Map, MapPin, ShieldAlert, ShieldCheck, Star,
  Timer, Trophy, Users, Utensils, Wallet, type LucideIcon,
} from "lucide-react";
import { BadgeRisiko } from "@/components/data/badge";
import { LabelSumber } from "@/components/data/label-sumber";
import { GrafikGarisMulti } from "@/components/grafik/grafik";
import { KartuGrafik, Legenda } from "@/components/grafik/kartu-grafik";
import { PemilihBanding } from "@/components/insight/pemilih-banding";
import { WARNA_BUTIR } from "@/components/insight/warna-butir";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ambilBanding, ambilPilihanBanding, JENIS_BANDING, saranBanding, type FormatMetrik, type HasilBanding, type JenisBanding,
  type MetrikBanding,
} from "@/lib/data/banding";
import { angka, durasiJam, persen, rupiahRingkas } from "@/lib/format";
import { KOMPONEN } from "@/lib/indeks";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Bandingkan",
  description: "Bandingkan dua sampai tiga SPPG, kecamatan, atau kab/kota dalam bahasa sederhana atau angka lengkap.",
};

type Mode = "warga" | "analis";

const JENIS: Record<JenisBanding, { label: string; ikon: LucideIcon }> = {
  sppg: { label: "SPPG", ikon: Utensils },
  kecamatan: { label: "Kecamatan", ikon: MapPin },
  kabkota: { label: "Kab/kota", ikon: Map },
};

const IKON_METRIK: Record<string, LucideIcon> = {
  indeks: ShieldAlert, tertinggi: ShieldAlert, keracunan: HeartPulse, per100rb: HeartPulse, kasus: FolderOpen,
  selesai: CheckCircle2, respons: Timer, kepuasan: Star, slhs: ShieldCheck, realisasi: Wallet, penerima: Users,
  sekolah: GraduationCap,
};

function fmt(f: FormatMetrik, v: number | null): string {
  if (v == null) return "–";
  switch (f) {
    case "jam": return durasiJam(v);
    case "persen": return persen(v);
    case "rupiah": return rupiahRingkas(v);
    case "rating": return `${v.toLocaleString("id-ID", { maximumFractionDigits: 1 })}/5`;
    case "skor": return v.toLocaleString("id-ID", { maximumFractionDigits: 0 });
    case "desimal": return v.toLocaleString("id-ID", { maximumFractionDigits: 2 });
    default: return angka(v);
  }
}

/** Indeks butir dengan nilai terbaik; kosong bila tidak ada arah atau semua sama. */
function terbaik(m: MetrikBanding): Set<number> {
  if (!m.baik) return new Set();
  const ada = m.nilai.map((v, i) => ({ v, i })).filter((x): x is { v: number; i: number } => x.v != null);
  if (ada.length < 2) return new Set();
  const target = m.baik === "tinggi" ? Math.max(...ada.map((x) => x.v)) : Math.min(...ada.map((x) => x.v));
  const menang = ada.filter((x) => x.v === target);
  return menang.length === ada.length ? new Set() : new Set(menang.map((x) => x.i));
}

const huruf = (i: number) => String.fromCharCode(65 + i);
const singkat = (nama: string) => nama.replace("SPPG Contoh ", "SPPG ").replace(/^Kabupaten /, "Kab. ");

function Penanda({ i }: { i: number }) {
  return (
    <span aria-hidden className="inline-flex size-5 shrink-0 items-center justify-center rounded-md text-[11px] font-bold text-white"
      style={{ background: WARNA_BUTIR[i] }}>
      {huruf(i)}
    </span>
  );
}

function ModeWarga({ h }: { h: HasilBanding }) {
  const ukuran = h.metrik.filter((m) => m.warga);
  const menang = h.butir.map((_, i) => ukuran.filter((m) => terbaik(m).has(i)).length);
  const berarah = ukuran.filter((m) => m.baik).length;
  const juara = menang.indexOf(Math.max(...menang));
  const seri = menang.filter((x) => x === menang[juara]).length > 1;
  return (
    <div className="space-y-4">
      <p className="flex items-center gap-2 rounded-2xl bg-secondary px-4 py-3 text-sm font-medium text-secondary-foreground">
        <Trophy className="size-4 shrink-0" aria-hidden />
        {seri || menang[juara] === 0
          ? "Hasilnya berimbang: masing-masing unggul di ukuran yang berbeda."
          : `${singkat(h.butir[juara].nama)} lebih baik di ${menang[juara]} dari ${berarah} ukuran.`}
      </p>
      <ul className={cn("grid gap-3", h.butir.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2")}>
        {h.butir.map((b, i) => (
          <li key={b.id} className="relative overflow-hidden rounded-3xl border bg-card p-4 pt-5">
            <span aria-hidden className="absolute inset-x-0 top-0 h-1.5" style={{ background: WARNA_BUTIR[i] }} />
            <div className="flex items-start gap-2">
              <Penanda i={i} />
              <div className="min-w-0 flex-1">
                <Link href={b.href} className="block truncate font-bold hover:underline">{singkat(b.nama)}</Link>
                <p className="text-xs text-muted-foreground">{b.sub}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {b.skor != null && <BadgeRisiko skor={b.skor} />}
              <span className={cn("inline-flex h-6 items-center gap-1 rounded-full px-2 text-xs font-semibold",
                menang[i] === Math.max(...menang) && menang[i] > 0 ? "bg-risiko-rendah-lembut text-risiko-rendah" : "bg-muted text-muted-foreground")}>
                <Trophy className="size-3.5" aria-hidden /> Unggul {menang[i]}/{berarah}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <ul className="divide-y rounded-3xl border bg-card">
        {ukuran.map((m) => {
          const Ikon = IKON_METRIK[m.kunci] ?? BarChart3;
          const baik = terbaik(m);
          return (
            <li key={m.kunci} className="grid gap-2 p-4 sm:grid-cols-[minmax(0,14rem)_1fr] sm:items-center">
              <p className="flex items-center gap-2 text-sm font-medium">
                <Ikon className="size-4 text-muted-foreground" aria-hidden /> {m.label}
              </p>
              <ul className={cn("grid gap-2", h.butir.length === 3 ? "grid-cols-3" : "grid-cols-2")}>
                {m.nilai.map((v, i) => (
                  <li key={i} className={cn("flex items-center gap-2 rounded-xl px-2.5 py-2",
                    baik.has(i) ? "bg-risiko-rendah-lembut" : "bg-muted/50")}>
                    <Penanda i={i} />
                    <span className="angka min-w-0 truncate font-bold">{m.teks?.[i] ?? fmt(m.format, v)}</span>
                    {baik.has(i) && <Check className="ml-auto size-4 shrink-0 text-risiko-rendah" aria-label="Terbaik" />}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ModeAnalis({ h }: { h: HasilBanding }) {
  const legenda = h.butir.map((b, i) => ({ label: `${huruf(i)} · ${singkat(b.nama)}`, warna: WARNA_BUTIR[i] }));
  return (
    <div className="space-y-6">
      <section aria-label="Tabel perbandingan" className="overflow-x-auto rounded-3xl border bg-card">
        <table className="w-full min-w-[34rem] text-sm">
          <thead className="bg-muted/60 text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="p-3 text-left font-medium">Ukuran</th>
              {h.butir.map((b, i) => (
                <th key={b.id} scope="col" className="p-3 text-right font-medium">
                  <span className="inline-flex items-center gap-1.5"><Penanda i={i} /> {singkat(b.nama)}</span>
                </th>
              ))}
              <th scope="col" className="p-3 text-right font-medium">Lebih baik</th>
            </tr>
          </thead>
          <tbody className="angka divide-y">
            {h.metrik.map((m) => {
              const baik = terbaik(m);
              return (
                <tr key={m.kunci}>
                  <th scope="row" className="p-3 text-left font-normal">{m.label}</th>
                  {m.nilai.map((v, i) => (
                    <td key={i} className={cn("p-3 text-right", baik.has(i) && "font-bold text-risiko-rendah")}>
                      {m.teks?.[i] ?? fmt(m.format, v)}
                    </td>
                  ))}
                  <td className="p-3 text-right text-xs text-muted-foreground">
                    {m.baik === "tinggi" ? "Tinggi ↑" : m.baik === "rendah" ? "Rendah ↓" : "–"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <div className={cn("grid gap-6", h.komponen && "lg:grid-cols-2")}>
        {h.komponen && (
          <KartuGrafik judul="Sumbangan komponen indeks" sumber={h.sumber}
            tabel={{
              kolom: ["Komponen", ...h.butir.map((_, i) => huruf(i))],
              baris: KOMPONEN.map((k, j) => [k.label, ...h.komponen!.map((c) => (c[j]?.nilai ?? 0).toFixed(1))]),
            }}>
            <Legenda butir={legenda} />
            <ul className="space-y-3">
              {KOMPONEN.map((k, j) => (
                <li key={k.kunci} className="grid grid-cols-[6.5rem_1fr] items-center gap-3">
                  <span className="text-xs text-muted-foreground">{k.label}</span>
                  <span className="space-y-1">
                    {h.komponen!.map((c, i) => {
                      const v = c[j]?.nilai ?? 0;
                      return (
                        <span key={i} className="flex items-center gap-2">
                          {/* Skala 0–35: bobot komponen terbesar, agar perbedaan kecil tetap terlihat. */}
                          <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--chart-jalur)]">
                            <span className="block h-full rounded-full" style={{ width: `${(100 * v) / 35}%`, background: WARNA_BUTIR[i] }} />
                          </span>
                          <span className="angka w-8 text-right text-xs font-semibold">{v.toFixed(1)}</span>
                        </span>
                      );
                    })}
                  </span>
                </li>
              ))}
            </ul>
          </KartuGrafik>
        )}
        {h.seri && h.seri.label.length > 1 && (
          <KartuGrafik judul={h.seri.judul} sumber={h.sumber}
            tabel={{
              kolom: ["Periode", ...h.butir.map((_, i) => huruf(i))],
              baris: h.seri.label.map((l, j) => [l, ...h.seri!.nilai.map((s) => fmt(h.seri!.format, s[j] ?? null))]),
            }}>
            <Legenda butir={legenda.map((l) => ({ ...l, bentuk: "garis" as const }))} />
            <GrafikGarisMulti label={h.seri.label} format={h.seri.format} domain={h.seri.domain} ambang={h.seri.ambang}
              seri={h.butir.map((b, i) => ({ label: huruf(i), warna: WARNA_BUTIR[i], nilai: h.seri!.nilai[i] ?? [] }))} />
          </KartuGrafik>
        )}
      </div>
    </div>
  );
}

async function Isi({ searchParams }: { searchParams: PageProps<"/insight/banding">["searchParams"] }) {
  const sp = await searchParams;
  const ambil = (k: string) => (Array.isArray(sp[k]) ? sp[k]![0] : sp[k]) ?? "";
  const jenis = (JENIS_BANDING as string[]).includes(ambil("jenis")) ? (ambil("jenis") as JenisBanding) : "sppg";
  const mode: Mode = ambil("mode") === "analis" ? "analis" : "warga";

  const pilihan = (await ambilPilihanBanding())[jenis];
  const sah = new Set(pilihan.map((p) => p.id));
  let ids = [...new Set(ambil("id").split(",").filter((x) => sah.has(x)))].slice(0, 3);
  if (ids.length < 2) ids = await saranBanding(jenis);
  const hasil = await ambilBanding(jenis, ids);
  const href = (ubah: Partial<{ jenis: JenisBanding; mode: Mode }>) => {
    const j = ubah.jenis ?? jenis;
    const q = new URLSearchParams({ jenis: j, mode: ubah.mode ?? mode });
    if (j === jenis) q.set("id", ids.join(","));
    return `/insight/banding?${q}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <nav aria-label="Jenis perbandingan" className="inline-flex gap-1 rounded-xl bg-muted p-1">
          {JENIS_BANDING.map((j) => {
            const J = JENIS[j];
            return (
              <Link key={j} href={href({ jenis: j })} aria-current={j === jenis ? "page" : undefined} scroll={false}
                className={cn("inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition",
                  j === jenis ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
                <J.ikon className="size-4" aria-hidden /> {J.label}
              </Link>
            );
          })}
        </nav>
        <nav aria-label="Mode tampilan" className="ml-auto inline-flex gap-1 rounded-xl bg-muted p-1">
          {(["warga", "analis"] as Mode[]).map((m) => (
            <Link key={m} href={href({ mode: m })} aria-current={m === mode ? "page" : undefined} scroll={false}
              className={cn("inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition",
                m === mode ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
              {m === "warga" ? <Users className="size-4" aria-hidden /> : <BarChart3 className="size-4" aria-hidden />}
              {m === "warga" ? "Warga" : "Analis"}
            </Link>
          ))}
        </nav>
        {hasil && <LabelSumber jenis={hasil.sumber} />}
      </div>

      <PemilihBanding key={`${jenis}:${ids.join(",")}`} jenis={jenis} ids={ids} mode={mode} pilihan={pilihan} />

      {hasil ? (mode === "warga" ? <ModeWarga h={hasil} /> : <ModeAnalis h={hasil} />) : (
        <p className="rounded-3xl border bg-card p-6 text-center text-sm text-muted-foreground">Pilih minimal dua untuk dibandingkan</p>
      )}
    </div>
  );
}

export default function HalamanBanding({ searchParams }: PageProps<"/insight/banding">) {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-extrabold">Bandingkan</h1>
      <Suspense fallback={<Skeleton className="h-[36rem] rounded-3xl" />}>
        <Isi searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
