"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ShieldCheck,
  Siren,
  Star,
  TriangleAlert,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PresetDSS {
  nama: string;
  laporan: number;
  keracunan: number;
  slhsBerlaku: boolean;
  terlambatSla: number;
  ratingKepuasan: number;
}

const PRESET_CONTOH: PresetDSS[] = [
  {
    nama: "Level A (Aman)",
    laporan: 1,
    keracunan: 0,
    slhsBerlaku: true,
    terlambatSla: 5,
    ratingKepuasan: 4.8,
  },
  {
    nama: "Level B (Waspada)",
    laporan: 11,
    keracunan: 0,
    slhsBerlaku: false,
    terlambatSla: 55,
    ratingKepuasan: 3.2,
  },
  {
    nama: "Level C (Kritis)",
    laporan: 18,
    keracunan: 2,
    slhsBerlaku: false,
    terlambatSla: 75,
    ratingKepuasan: 2.1,
  },
];

export function SimulatorDss() {
  const [laporan, setLaporan] = useState(6);
  const [keracunan, setKeracunan] = useState(0);
  const [slhsBerlaku, setSlhsBerlaku] = useState(true);
  const [terlambatSla, setTerlambatSla] = useState(20);
  const [ratingKepuasan, setRatingKepuasan] = useState(4.2);

  const lNorm = Math.min((laporan / 20) * 100, 100);
  const kNorm = Math.min((keracunan / 3) * 100, 100);
  const sNorm = slhsBerlaku ? 0 : 100;
  const tNorm = terlambatSla;
  const pNorm = (ratingKepuasan / 5) * 100;
  const pBiaya = 100 - pNorm;

  const kontribusi = useMemo(() => {
    return {
      l: Math.round(0.35 * lNorm * 10) / 10,
      k: Math.round(0.25 * kNorm * 10) / 10,
      s: Math.round(0.15 * sNorm * 10) / 10,
      t: Math.round(0.15 * tNorm * 10) / 10,
      p: Math.round(0.1 * pBiaya * 10) / 10,
    };
  }, [lNorm, kNorm, sNorm, tNorm, pBiaya]);

  const skorTotal = useMemo(() => {
    const raw = kontribusi.l + kontribusi.k + kontribusi.s + kontribusi.t + kontribusi.p;
    return Math.min(Math.max(Math.round(raw * 10) / 10, 0), 100);
  }, [kontribusi]);

  const klasifikasi = useMemo(() => {
    if (skorTotal < 40) {
      return {
        level: "Level A",
        kategori: "Rendah (0–39)",
        bg: "bg-risiko-rendah-lembut border-risiko-rendah/30 text-risiko-rendah",
        ikon: ShieldCheck,
        rekomendasi: "Inspeksi berkala 6 bulan sekali.",
      };
    }
    if (skorTotal < 70) {
      return {
        level: "Level B",
        kategori: "Sedang (40–69)",
        bg: "bg-risiko-sedang-lembut border-risiko-sedang/30 text-risiko-sedang",
        ikon: TriangleAlert,
        rekomendasi: "Teguran SLA & pembinaan sanitasi bulanan.",
      };
    }
    return {
      level: "Level C",
      kategori: "Tinggi (70–100)",
      bg: "bg-risiko-tinggi-lembut border-risiko-tinggi/30 text-risiko-tinggi",
      ikon: Siren,
      rekomendasi: "Inspeksi lapangan mendadak Dinkes & BGN 1×24 jam.",
    };
  }, [skorTotal]);

  const terapkanPreset = (p: PresetDSS) => {
    setLaporan(p.laporan);
    setKeracunan(p.keracunan);
    setSlhsBerlaku(p.slhsBerlaku);
    setTerlambatSla(p.terlambatSla);
    setRatingKepuasan(p.ratingKepuasan);
  };

  const IkonLevel = klasifikasi.ikon;

  return (
    <section
      id="simulator-dss"
      className="scroll-mt-24 rounded-3xl border bg-card p-5 sm:p-7 space-y-6"
      aria-labelledby="judul-simulator"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div>
          <h2 id="judul-simulator" className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Kalkulator Risiko SPPG (SAW)
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            SAW (Simple Additive Weighting) menjumlahkan 5 bobot masalah menjadi skor 0–100 penentu prioritas sidak dapur.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {PRESET_CONTOH.map((p) => (
            <button
              key={p.nama}
              type="button"
              onClick={() => terapkanPreset(p)}
              className="rounded-xl border bg-background px-3 py-1 text-xs font-bold hover:bg-primary/10 hover:text-primary transition cursor-pointer"
            >
              {p.nama}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] items-start">
        <div className="space-y-3">
          <div className="rounded-2xl border bg-background p-3.5 space-y-1.5">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="font-bold">Laporan 30 Hari (35%)</span>
              <span className="angka font-black text-primary">{laporan}</span>
            </div>
            <input
              type="range"
              min={0}
              max={25}
              value={laporan}
              onChange={(e) => setLaporan(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          <div className="rounded-2xl border bg-background p-3.5 space-y-1.5">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="font-bold text-risiko-tinggi">Kasus Keracunan (25%)</span>
              <span className="angka font-black text-risiko-tinggi">{keracunan}</span>
            </div>
            <input
              type="range"
              min={0}
              max={3}
              value={keracunan}
              onChange={(e) => setKeracunan(Number(e.target.value))}
              className="w-full accent-risiko-tinggi cursor-pointer"
            />
          </div>

          <div className="rounded-2xl border bg-background p-3.5 flex items-center justify-between gap-3">
            <span className="font-bold text-xs sm:text-sm">Sertifikat SLHS (15%)</span>
            <button
              type="button"
              onClick={() => setSlhsBerlaku(!slhsBerlaku)}
              className={cn(
                "rounded-xl px-3 py-1 text-xs font-bold transition cursor-pointer border",
                slhsBerlaku
                  ? "bg-risiko-rendah-lembut border-risiko-rendah/30 text-risiko-rendah"
                  : "bg-risiko-tinggi-lembut border-risiko-tinggi/30 text-risiko-tinggi"
              )}
            >
              {slhsBerlaku ? (
                <span className="inline-flex items-center gap-1">
                  <Check className="size-3" /> Aktif
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <X className="size-3" /> Tidak Ada
                </span>
              )}
            </button>
          </div>

          <div className="rounded-2xl border bg-background p-3.5 space-y-1.5">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="font-bold">Terlambat SLA (15%)</span>
              <span className="angka font-black text-risiko-sedang">{terlambatSla}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={terlambatSla}
              onChange={(e) => setTerlambatSla(Number(e.target.value))}
              className="w-full accent-risiko-sedang cursor-pointer"
            />
          </div>

          <div className="rounded-2xl border bg-background p-3.5 space-y-1.5">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="font-bold">Rating Kepuasan (10%)</span>
              <span className="angka font-black text-primary inline-flex items-center gap-1">
                <Star className="size-3.5 fill-risiko-sedang text-risiko-sedang" /> {ratingKepuasan.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={0.1}
              value={ratingKepuasan}
              onChange={(e) => setRatingKepuasan(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>
        </div>

        <div className="rounded-2xl border bg-background p-5 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-muted-foreground">Skor Indeks Risiko</span>
              <p className="angka text-5xl font-black tracking-tight text-foreground mt-0.5">
                {skorTotal.toFixed(1)}
                <span className="text-base font-bold text-muted-foreground">/100</span>
              </p>
            </div>

            <div className={cn("rounded-2xl border px-4 py-3 text-center shrink-0 min-w-28", klasifikasi.bg)}>
              <IkonLevel className="size-5 mx-auto mb-1" />
              <span className="block text-lg font-black">{klasifikasi.level}</span>
              <span className="text-[10px] font-bold block uppercase">{klasifikasi.kategori}</span>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t">
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex">
              <div style={{ width: `${kontribusi.l}%`, background: "var(--chart-1)" }} />
              <div style={{ width: `${kontribusi.k}%`, background: "var(--chart-2)" }} />
              <div style={{ width: `${kontribusi.s}%`, background: "var(--chart-3)" }} />
              <div style={{ width: `${kontribusi.t}%`, background: "var(--chart-4)" }} />
              <div style={{ width: `${kontribusi.p}%`, background: "var(--chart-5)" }} />
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="size-2 rounded-full" style={{ background: "var(--chart-1)" }} /> Laporan: {kontribusi.l}</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full" style={{ background: "var(--chart-2)" }} /> Keracunan: {kontribusi.k}</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full" style={{ background: "var(--chart-3)" }} /> SLHS: {kontribusi.s}</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full" style={{ background: "var(--chart-4)" }} /> SLA: {kontribusi.t}</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full" style={{ background: "var(--chart-5)" }} /> Kepuasan: {kontribusi.p}</span>
            </div>
          </div>

          <div className="rounded-xl bg-muted/50 p-3 text-xs">
            <span className="font-bold text-foreground">Tindakan: </span>
            <span className="text-muted-foreground">{klasifikasi.rekomendasi}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
