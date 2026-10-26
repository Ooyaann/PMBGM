"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Layers, MousePointerClick, Users, Utensils, ZoomIn } from "lucide-react";
import { BadgeRisiko } from "@/components/data/badge";
import { LabelSumber } from "@/components/data/label-sumber";
import { TabelData } from "@/components/grafik/kartu-grafik";
import type { DataPeta, KabkotaPeta, KecamatanPeta, TitikSppg } from "@/lib/data/insight";
import { angka } from "@/lib/format";
import { kategoriRisiko, RISIKO, type KategoriRisiko, type SumberData } from "@/lib/label";
import {
  ambangKuantil, ISI_KOSONG, ISI_RISIKO, kelasNilai, langkahRamp, RAMP_SEQ, TITIK_RISIKO,
} from "@/lib/peta-skala";
import { cn } from "@/lib/utils";

export type Lapis = "kasus" | "realisasi" | "tertinggi" | "rata";
type Area = "jateng" | "semarang";
type Wilayah = KabkotaPeta | KecamatanPeta;

interface AturanLapis {
  area: Area;
  label: string;
  judul: string;
  sumber: SumberData;
  skala: "seq" | "risiko";
  desimal: number;
  satuan: string;
  /** Peringkat menampilkan nilai tertinggi ("turun") atau terendah ("naik"). */
  urut: "turun" | "naik";
  nilai: (w: Wilayah) => number | null;
}

const LAPIS: Record<Lapis, AturanLapis> = {
  kasus: {
    area: "jateng", label: "Keracunan", judul: "Kasus keracunan per 100 rb penerima · 3 bulan", sumber: "simulasi",
    skala: "seq", desimal: 1, satuan: "", urut: "turun", nilai: (w) => (w as KabkotaPeta).kasusPer100rb,
  },
  realisasi: {
    area: "jateng", label: "Realisasi", judul: "Realisasi anggaran bulan terakhir", sumber: "simulasi",
    skala: "seq", desimal: 0, satuan: "%", urut: "naik", nilai: (w) => (w as KabkotaPeta).persen,
  },
  tertinggi: {
    area: "semarang", label: "Tertinggi", judul: "Indeks risiko SPPG tertinggi per kecamatan", sumber: "laporan_warga_terverifikasi",
    skala: "risiko", desimal: 0, satuan: "", urut: "turun", nilai: (w) => (w as KecamatanPeta).tertinggi,
  },
  rata: {
    area: "semarang", label: "Rata-rata", judul: "Rata-rata indeks risiko, berbobot porsi", sumber: "laporan_warga_terverifikasi",
    skala: "risiko", desimal: 0, satuan: "", urut: "turun", nilai: (w) => (w as KecamatanPeta).rata,
  },
};

const AREA: Record<Area, { label: string; bawaan: Lapis }> = {
  jateng: { label: "Jawa Tengah", bawaan: "kasus" },
  semarang: { label: "Kota Semarang", bawaan: "tertinggi" },
};

const fmt = (v: number | null, a: AturanLapis) =>
  v == null ? "–" : `${v.toLocaleString("id-ID", { maximumFractionDigits: a.desimal })}${a.satuan}`;

function Segmen<T extends string>({ label, pilihan, nilai, onPilih }: {
  label: string;
  pilihan: { kunci: T; label: string }[];
  nilai: T;
  onPilih: (k: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex gap-1 rounded-xl bg-muted p-1">
      {pilihan.map((p) => (
        <button key={p.kunci} type="button" role="radio" aria-checked={nilai === p.kunci} onClick={() => onPilih(p.kunci)}
          className={cn("h-8 rounded-lg px-3 text-sm font-medium whitespace-nowrap transition",
            nilai === p.kunci ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
          {p.label}
        </button>
      ))}
    </div>
  );
}

/** Posisi tooltip dihitung saat event, termasuk lebar wadah, agar render tidak membaca ref. */
type Posisi = { x: number; y: number; lebar: number };
type Sorotan = ({ jenis: "wilayah"; id: string } | { jenis: "titik"; titik: TitikSppg }) & Posisi;

/** Peta risiko interaktif (IN-01): SVG dari batas BIG, tanpa tile pihak ketiga. */
export function PetaRisikoDasar({ data, lapis, onLapis }: {
  data: DataPeta;
  lapis: Lapis;
  onLapis?: (l: Lapis) => void;
}) {
  const aturan = LAPIS[lapis];
  const area = aturan.area;
  const judul = lapis === "realisasi" && data.jateng.bulan
    ? `Realisasi anggaran · ${new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(data.jateng.bulan))}`
    : aturan.judul;
  const kanvas = data[area];
  const wilayah: Wilayah[] = kanvas.wilayah;
  const titik = area === "semarang" ? data.semarang.titik : [];

  const [sorot, setSorot] = useState<Sorotan | null>(null);
  const [pilih, setPilih] = useState<string | null>(null);
  const wadah = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const idArsir = useId();

  const ambang = aturan.skala === "seq" ? ambangKuantil(wilayah.map(aturan.nilai), 5, aturan.desimal) : [];
  const langkah = langkahRamp(ambang.length + 1);

  function isi(w: Wilayah) {
    const v = aturan.nilai(w);
    if (v == null) return `url(#${idArsir})`;
    if (aturan.skala === "risiko") return ISI_RISIKO[kategoriRisiko(v)].css;
    return RAMP_SEQ[langkah[kelasNilai(v, ambang)]].css;
  }

  function posisi(e: React.PointerEvent): Posisi {
    const r = wadah.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, lebar: r.width };
  }
  function posisiPusat(p: [number, number]): Posisi {
    const r = wadah.current!.getBoundingClientRect();
    const skala = r.width / kanvas.lebar;
    return { x: p[0] * skala, y: p[1] * skala, lebar: r.width };
  }

  function gantiArea(a: Area) {
    if (a === area) return;
    setPilih(null);
    setSorot(null);
    onLapis?.(AREA[a].bawaan);
  }

  const peringkat = [...wilayah]
    .filter((w) => aturan.nilai(w) != null)
    .sort((a, b) => (aturan.urut === "turun" ? 1 : -1) * ((aturan.nilai(b) ?? 0) - (aturan.nilai(a) ?? 0)))
    .slice(0, 5);
  const terpilih = wilayah.find((w) => w.id === pilih) ?? null;
  const tersorot = sorot?.jenis === "wilayah" ? wilayah.find((w) => w.id === sorot.id) : null;

  const legenda = aturan.skala === "risiko"
    ? (["rendah", "sedang", "tinggi"] as KategoriRisiko[]).map((k) => ({
      label: `${RISIKO[k].label} ${k === "rendah" ? "0–39" : k === "sedang" ? "40–69" : "70+"}`, warna: ISI_RISIKO[k].css,
    }))
    : langkah.map((l, i) => ({
      label: i === 0 ? `< ${fmt(ambang[0] ?? 0, aturan)}`
        : i === langkah.length - 1 ? `≥ ${fmt(ambang[i - 1], aturan)}`
          : `${fmt(ambang[i - 1], aturan)}–${fmt(ambang[i], aturan)}`,
      warna: RAMP_SEQ[l].css,
    }));

  const tabel = area === "jateng"
    ? {
      kolom: ["Kab/kota", "Kasus/100 rb", "Kasus 3 bln", "Realisasi", "Penerima", "SPPG"],
      baris: (wilayah as KabkotaPeta[]).map((w) => [
        w.nama, fmt(w.kasusPer100rb, LAPIS.kasus), angka(w.kasus), fmt(w.persen, LAPIS.realisasi), angka(w.penerima), angka(w.sppg),
      ]),
    }
    : {
      kolom: ["Kecamatan", "SPPG", "Tertinggi", "Rata-rata", "SPPG tertinggi"],
      baris: (wilayah as KecamatanPeta[]).map((w) => [
        w.nama, angka(w.jumlahSppg), fmt(w.tertinggi, LAPIS.tertinggi), fmt(w.rata, LAPIS.rata), w.sppgTertinggi ?? "–",
      ]),
    };

  return (
    <section aria-label="Peta risiko" className="rounded-3xl border bg-card p-4 sm:p-6">
      <header className="flex flex-wrap items-center gap-2">
        <Segmen label="Wilayah" nilai={area} onPilih={gantiArea}
          pilihan={(["jateng", "semarang"] as Area[]).map((a) => ({ kunci: a, label: AREA[a].label }))} />
        <Segmen label="Ukuran" nilai={lapis} onPilih={(l) => { setPilih(null); onLapis?.(l); }}
          pilihan={(Object.keys(LAPIS) as Lapis[]).filter((l) => LAPIS[l].area === area).map((l) => ({ kunci: l, label: LAPIS[l].label }))} />
        <LabelSumber jenis={aturan.sumber} className="ml-auto" />
      </header>
      <h2 className="mt-4 flex items-center gap-2 text-sm font-semibold">
        <Layers className="size-4 text-primary" aria-hidden /> {judul}
      </h2>

      <div className="mt-3 grid gap-5 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div>
          <div ref={wadah} className="relative" onPointerLeave={() => setSorot(null)}>
            <svg viewBox={`0 0 ${kanvas.lebar} ${kanvas.tinggi}`} className="h-auto w-full touch-manipulation select-none"
              role="group" aria-label={`Peta ${AREA[area].label}: ${judul}`}>
              <defs>
                <pattern id={idArsir} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="6" height="6" fill={ISI_KOSONG.css} />
                  <line x1="0" y1="0" x2="0" y2="6" stroke="var(--border)" strokeWidth="2" />
                </pattern>
              </defs>
              {wilayah.map((w) => {
                const v = aturan.nilai(w);
                return (
                  <path key={w.id} d={w.d} fill={isi(w)} stroke="var(--card)" strokeWidth={area === "jateng" ? 1 : 1.5}
                    strokeLinejoin="round" tabIndex={0} role="button"
                    aria-label={`${w.nama}: ${v == null ? "tanpa data" : fmt(v, aturan)}`}
                    aria-pressed={pilih === w.id}
                    className="cursor-pointer outline-none transition-[filter] hover:brightness-95"
                    onPointerMove={(e) => setSorot({ jenis: "wilayah", id: w.id, ...posisi(e) })}
                    onFocus={() => setSorot({ jenis: "wilayah", id: w.id, ...posisiPusat(w.pusat) })}
                    onBlur={() => setSorot(null)}
                    onClick={() => setPilih((p) => (p === w.id ? null : w.id))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPilih((p) => (p === w.id ? null : w.id)); }
                    }} />
                );
              })}
              {/* Garis tepi sorotan digambar di atas agar tidak tertutup tetangganya. */}
              {[tersorot, terpilih].filter(Boolean).map((w, i) => (
                <path key={`${w!.id}-${i}`} d={w!.d} fill="none" stroke="var(--foreground)" strokeWidth={i === 1 ? 2.5 : 1.5}
                  strokeLinejoin="round" pointerEvents="none" />
              ))}
              {titik.map((t) => (
                <g key={t.id} role="link" tabIndex={0} aria-label={`${t.nama}, indeks ${fmt(t.indeks, LAPIS.tertinggi)}`}
                  className="cursor-pointer outline-none"
                  onPointerMove={(e) => { e.stopPropagation(); setSorot({ jenis: "titik", titik: t, ...posisi(e) }); }}
                  onFocus={() => setSorot({ jenis: "titik", titik: t, ...posisiPusat([t.x, t.y]) })}
                  onBlur={() => setSorot(null)}
                  onClick={() => router.push(`/data/sppg/${t.id}`)}
                  onKeyDown={(e) => { if (e.key === "Enter") router.push(`/data/sppg/${t.id}`); }}>
                  <circle cx={t.x} cy={t.y} r={12} fill="transparent" />
                  <circle cx={t.x} cy={t.y} r={t.kategori === "tinggi" ? 6.5 : 5} fill={TITIK_RISIKO[t.kategori].css}
                    stroke="var(--card)" strokeWidth={2} />
                </g>
              ))}
            </svg>

            {sorot && (
              <div role="tooltip" className="pointer-events-none absolute z-10 w-max max-w-56 -translate-x-1/2 rounded-xl border bg-popover px-3 py-2 text-xs shadow-lg"
                style={{ left: Math.min(Math.max(sorot.x, 90), sorot.lebar - 90), top: sorot.y + 14 }}>
                {sorot.jenis === "titik" ? (
                  <>
                    <p className="font-semibold">{sorot.titik.nama}</p>
                    <p className="mb-1.5 text-muted-foreground">{sorot.titik.kecamatan}</p>
                    <BadgeRisiko skor={sorot.titik.indeks} />
                  </>
                ) : tersorot && (
                  <IsiTooltip w={tersorot} aturan={aturan} />
                )}
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            {legenda.map((l) => (
              <span key={l.label} className="flex items-center gap-1.5">
                <span aria-hidden className="h-3 w-4 rounded-[3px]" style={{ background: l.warna }} /> {l.label}
              </span>
            ))}
            <span className="flex items-center gap-1.5">
              <svg aria-hidden className="h-3 w-4 rounded-[3px]"><rect width="16" height="12" fill={`url(#${idArsir})`} /></svg>
              Tanpa data
            </span>
            {area === "semarang" && (
              <span className="flex items-center gap-1.5">
                <span aria-hidden className="flex -space-x-0.5">
                  {(["rendah", "sedang", "tinggi"] as KategoriRisiko[]).map((k) => (
                    <span key={k} className="size-2.5 rounded-full ring-2 ring-card" style={{ background: TITIK_RISIKO[k].css }} />
                  ))}
                </span>
                SPPG
              </span>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          {terpilih ? (
            <PanelWilayah w={terpilih} aturan={aturan} titik={titik.filter((t) => t.kecamatan === terpilih.nama)}
              onKecamatan={terpilih.id === "33.74" ? () => { setPilih(null); onLapis?.("tertinggi"); } : undefined} />
          ) : (
            <p className="flex items-center gap-2 rounded-2xl bg-muted/60 p-3 text-sm text-muted-foreground">
              <MousePointerClick className="size-4 shrink-0" aria-hidden /> Pilih wilayah untuk rincian
            </p>
          )}
          <div>
            <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {aturan.urut === "turun" ? "Tertinggi" : "Terendah"}
            </h3>
            <ol className="space-y-1">
              {peringkat.map((w, i) => (
                <li key={w.id}>
                  <button type="button" onClick={() => setPilih(w.id)}
                    className={cn("flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-muted",
                      pilih === w.id && "bg-muted")}>
                    <span className="angka w-4 text-xs text-muted-foreground">{i + 1}</span>
                    <span aria-hidden className="size-2.5 shrink-0 rounded-[3px]" style={{ background: isi(w) }} />
                    <span className="min-w-0 flex-1 truncate">{w.nama.replace(/^Kabupaten /, "Kab. ")}</span>
                    <span className="angka font-semibold">{fmt(aturan.nilai(w), aturan)}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <TabelData tabel={tabel} />
        <p className="text-[11px] text-muted-foreground">Batas wilayah: BIG 2026 (indikatif)</p>
      </footer>
    </section>
  );
}

function IsiTooltip({ w, aturan }: { w: Wilayah; aturan: AturanLapis }) {
  const v = aturan.nilai(w);
  if ("kasusPer100rb" in w) {
    return (
      <>
        <p className="font-semibold">{w.nama}</p>
        <p className="angka mt-1 text-base font-bold">{fmt(v, aturan)}</p>
        <p className="text-muted-foreground">{aturan.label}</p>
        <p className="mt-1.5 flex gap-3 text-muted-foreground">
          <span>{angka(w.kasus)} kasus</span><span>{angka(w.penerima)} penerima</span>
        </p>
      </>
    );
  }
  return (
    <>
      <p className="mb-1.5 font-semibold">{w.nama}</p>
      {v == null ? <p className="text-muted-foreground">Belum ada SPPG terpantau</p> : <BadgeRisiko skor={v} />}
      {w.jumlahSppg > 0 && <p className="mt-1.5 text-muted-foreground">{w.jumlahSppg} SPPG</p>}
    </>
  );
}

function PanelWilayah({ w, aturan, titik, onKecamatan }: {
  w: Wilayah;
  aturan: AturanLapis;
  titik: TitikSppg[];
  onKecamatan?: () => void;
}) {
  const v = aturan.nilai(w);
  return (
    <div className="rounded-2xl border p-4">
      <p className="font-bold">{w.nama}</p>
      {"kasusPer100rb" in w ? (
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div><dt className="text-xs text-muted-foreground">Kasus/100 rb</dt><dd className="angka text-lg font-bold">{fmt(w.kasusPer100rb, LAPIS.kasus)}</dd></div>
          <div><dt className="text-xs text-muted-foreground">Realisasi</dt><dd className="angka text-lg font-bold">{fmt(w.persen, LAPIS.realisasi)}</dd></div>
          <div><dt className="flex items-center gap-1 text-xs text-muted-foreground"><Users className="size-3" aria-hidden /> Penerima</dt><dd className="angka font-semibold">{angka(w.penerima)}</dd></div>
          <div><dt className="flex items-center gap-1 text-xs text-muted-foreground"><Utensils className="size-3" aria-hidden /> SPPG</dt><dd className="angka font-semibold">{angka(w.sppg)}</dd></div>
        </dl>
      ) : (
        <div className="mt-2 space-y-3">
          {v == null ? <p className="text-sm text-muted-foreground">Belum ada SPPG terpantau</p> : <BadgeRisiko skor={v} besar />}
          {titik.length > 0 && (
            <ul className="space-y-1">
              {[...titik].sort((a, b) => (b.indeks ?? 0) - (a.indeks ?? 0)).map((t) => (
                <li key={t.id}>
                  <Link href={`/data/sppg/${t.id}`} className="flex items-center gap-2 rounded-lg px-1.5 py-1 text-sm hover:bg-muted">
                    <span aria-hidden className="size-2.5 shrink-0 rounded-full" style={{ background: TITIK_RISIKO[t.kategori].css }} />
                    <span className="min-w-0 flex-1 truncate">{t.nama}</span>
                    <span className="angka text-xs font-semibold">{fmt(t.indeks, LAPIS.tertinggi)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <Link href={`/data/wilayah/${w.id}`} className="inline-flex h-8 items-center gap-1 rounded-lg bg-secondary px-2.5 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80">
          Profil <ArrowRight className="size-3.5" aria-hidden />
        </Link>
        {onKecamatan && (
          <button type="button" onClick={onKecamatan}
            className="inline-flex h-8 items-center gap-1 rounded-lg bg-primary px-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90">
            <ZoomIn className="size-3.5" aria-hidden /> Kecamatan
          </button>
        )}
      </div>
    </div>
  );
}

const SAH = new Set<string>(Object.keys(LAPIS));

/** Lapisan disimpan di URL (?lapis=) agar tampilan peta bisa dibagikan. */
export function PetaRisiko({ data }: { data: DataPeta }) {
  const param = useSearchParams().get("lapis");
  const lapis = (param && SAH.has(param) ? param : "kasus") as Lapis;
  return (
    <PetaRisikoDasar data={data} lapis={lapis} onLapis={(l) => {
      const url = new URL(window.location.href);
      url.searchParams.set("lapis", l);
      window.history.replaceState(null, "", url);
    }} />
  );
}
