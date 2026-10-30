"use client";

import { useMemo, useState } from "react";
import {
  Award,
  Check,
  CheckCircle2,
  FileSpreadsheet,
  Gauge,
  HelpCircle,
  Info,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sliders,
  Sparkles,
  Star,
  TriangleAlert,
  Utensils,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PresetDSS {
  nama: string;
  laporan: number;
  keracunan: number;
  slhsBerlaku: boolean;
  terlambatSla: number;
  ratingKepuasan: number;
  keterangan: string;
}

const PRESET_CONTOH: PresetDSS[] = [
  {
    nama: "Dapur Teladan (Level A)",
    laporan: 1,
    keracunan: 0,
    slhsBerlaku: true,
    terlambatSla: 5,
    ratingKepuasan: 4.8,
    keterangan: "Dapur higienis, porsi tertib, kepatuhan SLA tinggi.",
  },
  {
    nama: "Dapur Waspada (Level B)",
    laporan: 7,
    keracunan: 0,
    slhsBerlaku: true,
    terlambatSla: 45,
    ratingKepuasan: 3.2,
    keterangan: "Sering terlambat mengirim menu dan rating kepuasan menurun.",
  },
  {
    nama: "Dapur Kritis / Bahaya (Level C)",
    laporan: 18,
    keracunan: 2,
    slhsBerlaku: false,
    terlambatSla: 75,
    ratingKepuasan: 2.1,
    keterangan: "Tanpa sertifikat SLHS dan terindikasi insiden keracunan pangan.",
  },
];

export function SimulatorDss() {
  const [laporan, setLaporan] = useState(6);
  const [keracunan, setKeracunan] = useState(0);
  const [slhsBerlaku, setSlhsBerlaku] = useState(true);
  const [terlambatSla, setTerlambatSla] = useState(20);
  const [ratingKepuasan, setRatingKepuasan] = useState(4.2);

  // Normalisasi Min-Max kriteria (skala 0 - 100)
  const lNorm = Math.min((laporan / 20) * 100, 100);
  const kNorm = Math.min((keracunan / 3) * 100, 100);
  const sNorm = slhsBerlaku ? 0 : 100; // cost criterion
  const tNorm = terlambatSla; // persentase
  const pNorm = (ratingKepuasan / 5) * 100;
  const pBiaya = 100 - pNorm;

  // Rumus Simple Additive Weighting (SAW):
  // Bobot: Laporan 0.35 + Keracunan 0.25 + SLHS 0.15 + Keterlambatan 0.15 + Kepuasan 0.10
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

  // Klasifikasi Level Risiko Resmi (Poin 3 Revisi Dosen)
  const klasifikasi = useMemo(() => {
    if (skorTotal < 35) {
      return {
        level: "Level A",
        kategori: "Risiko Rendah (Kepatuhan Tinggi)",
        warna: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300",
        ikon: ShieldCheck,
        rekomendasi: "SPPG berkinerja sehat. Audit berkala rutin setiap 6 bulan sekali. Jadikan rujukan percontohan bagi dapur lain.",
        auditDinkes: "Inspeksi Berkala Standar (6 Bulan)",
      };
    }
    if (skorTotal < 60) {
      return {
        level: "Level B",
        kategori: "Risiko Sedang (Waspada & Pembinaan)",
        warna: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300",
        ikon: TriangleAlert,
        rekomendasi: "Pemberian surat teguran kepatuhan SLA. Wajib evaluasi manajemen rantai pasok dan sanitasi oleh Korwil BGN dalam 14 hari.",
        auditDinkes: "Inspeksi Berkala Rutin (1 Bulan Sekali)",
      };
    }
    return {
      level: "Level C",
      kategori: "Risiko Tinggi (Kritis & Audit Lapangan)",
      warna: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300",
      ikon: Siren,
      rekomendasi: "PRIORITAS AUDIT MENDESAK! Dinas Kesehatan dan Korwil BGN wajib melakukan inspeksi lapangan mendadak dalam 1x24 jam untuk pengujian sampel makanan.",
      auditDinkes: "Audit Khusus Lapangan 1x24 Jam",
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
      className="scroll-mt-24 rounded-3xl border border-primary/20 bg-card p-6 sm:p-8 lg:p-10 shadow-lg space-y-8"
      aria-labelledby="judul-simulator"
    >
      {/* Header Simulator */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <Sliders className="size-3.5" aria-hidden /> Simulator Interaktif DSS (SAW)
          </div>
          <h2 id="judul-simulator" className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Kalkulator Risiko SPPG
          </h2>
        </div>

        {/* Preset Cepat Uji Coba */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground">Preset:</span>
          {PRESET_CONTOH.map((p) => (
            <button
              key={p.nama}
              type="button"
              onClick={() => terapkanPreset(p)}
              className="rounded-xl border border-border bg-card px-3 py-1 text-xs font-bold hover:bg-primary/10 hover:text-primary transition cursor-pointer shadow-2xs"
            >
              {p.nama.split(" ")[1]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] items-start">
        {/* Kolom Kiri: Pengaturan Nilai Kriteria (Sliders & Toggles) */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
            <FileSpreadsheet className="size-4 text-primary" /> Parameter Bobot Penilaian
          </h3>

          {/* Kriteria 1: Jumlah Laporan Masuk */}
          <div className="rounded-2xl border bg-card p-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold">Laporan Masuk (35%)</span>
              <span className="angka font-black text-primary">{laporan} aduan</span>
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

          {/* Kriteria 2: Kasus Dugaan Keracunan */}
          <div className="rounded-2xl border bg-card p-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-rose-600 dark:text-rose-400">Kasus Keracunan (25%)</span>
              <span className="angka font-black text-rose-600 dark:text-rose-400">{keracunan} kasus</span>
            </div>
            <input
              type="range"
              min={0}
              max={3}
              value={keracunan}
              onChange={(e) => setKeracunan(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
          </div>

          {/* Kriteria 3: Sertifikasi SLHS */}
          <div className="rounded-2xl border bg-card p-4 flex items-center justify-between gap-3">
            <div>
              <span className="font-bold text-sm block">Sertifikat SLHS (15%)</span>
              <span className="text-xs text-muted-foreground">
                {slhsBerlaku ? "Sertifikat Higiene Berlaku" : "Tanpa Sertifikat SLHS"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSlhsBerlaku(!slhsBerlaku)}
              className={cn(
                "rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer border",
                slhsBerlaku
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                  : "bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-300"
              )}
            >
              {slhsBerlaku ? (
                <span className="inline-flex items-center gap-1">
                  <Check className="size-3" /> Berlaku
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <X className="size-3" /> Belum Ada
                </span>
              )}
            </button>
          </div>

          {/* Kriteria 4: Keterlambatan SLA */}
          <div className="rounded-2xl border bg-card p-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold">Terlambat Respon SLA (15%)</span>
              <span className="angka font-black text-amber-600 dark:text-amber-400">{terlambatSla}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={terlambatSla}
              onChange={(e) => setTerlambatSla(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          {/* Kriteria 5: Rating Kepuasan Pelapor */}
          <div className="rounded-2xl border bg-card p-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold">Penilaian Kepuasan (10%)</span>
              <span className="angka font-black text-primary inline-flex items-center gap-1">
                <Star className="size-3.5 fill-amber-400 text-amber-500" /> {ratingKepuasan.toFixed(1)} / 5.0
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

        {/* Kolom Kanan: Output Skor Real-Time & Klasifikasi Level Resmi */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-border/80 bg-gradient-to-b from-card via-card to-muted/30 p-6 sm:p-7 shadow-md space-y-5">
            <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              Hasil Komputasi DSS Real-Time
            </span>

            {/* Skor Besar */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="angka text-5xl sm:text-6xl font-black tracking-tight text-foreground">
                  {skorTotal.toFixed(1)}
                  <span className="text-lg font-bold text-muted-foreground">/100</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">Skor Indeks Risiko Komposit (SAW)</p>
              </div>

              {/* Badge Level */}
              <div className={cn("rounded-2xl border p-4 text-center shrink-0 min-w-32", klasifikasi.bg)}>
                <IkonLevel className="size-6 mx-auto mb-1" />
                <span className="block text-xl font-black">{klasifikasi.level}</span>
                <span className="text-[10px] font-bold block uppercase tracking-wide">
                  {klasifikasi.kategori.split(" ")[1]}
                </span>
              </div>
            </div>

            {/* Breakdown Kontribusi Tiap Kriteria (SAW Matrix) */}
            <div className="space-y-2 pt-2 border-t">
              <span className="text-xs font-extrabold text-foreground flex items-center justify-between">
                <span>Rincian Bobot SAW Terkalkulasi:</span>
                <span className="text-muted-foreground font-mono">Total: {skorTotal.toFixed(1)}</span>
              </span>
              <div className="h-4 w-full rounded-full bg-muted overflow-hidden flex shadow-inner">
                <div style={{ width: `${kontribusi.l}%` }} className="bg-primary" title={`Laporan: ${kontribusi.l}`} />
                <div style={{ width: `${kontribusi.k}%` }} className="bg-rose-500" title={`Keracunan: ${kontribusi.k}`} />
                <div style={{ width: `${kontribusi.s}%` }} className="bg-indigo-500" title={`SLHS: ${kontribusi.s}`} />
                <div style={{ width: `${kontribusi.t}%` }} className="bg-amber-500" title={`Terlambat: ${kontribusi.t}`} />
                <div style={{ width: `${kontribusi.p}%` }} className="bg-sky-500" title={`Kepuasan: ${kontribusi.p}`} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" /> Laporan: {kontribusi.l}</span>
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-rose-500" /> Keracunan: {kontribusi.k}</span>
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-indigo-500" /> SLHS: {kontribusi.s}</span>
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-amber-500" /> SLA: {kontribusi.t}</span>
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-sky-500" /> Kepuasan: {kontribusi.p}</span>
              </div>
            </div>

            {/* Rekomendasi Tindakan Otomatis untuk Pengambil Keputusan */}
            <div className="rounded-2xl border bg-background/80 p-4 space-y-2">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-primary" /> Rekomendasi Tindakan Instansi:
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {klasifikasi.rekomendasi}
              </p>
              <div className="pt-2 border-t flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Prioritas Dinas Kesehatan:</span>
                <span className="font-extrabold text-foreground">{klasifikasi.auditDinkes}</span>
              </div>
            </div>
          </div>

          {/* Badge Keabsahan Metode */}
          <div className="flex items-center justify-between rounded-2xl border bg-card/60 px-4 py-2.5 text-xs text-muted-foreground shadow-2xs">
            <span className="flex items-center gap-1.5 font-medium">
              <Info className="size-3.5 text-primary" /> Algoritma SAW Deterministik
            </span>
            <span className="font-bold text-foreground">Normalisasi Min-Max</span>
          </div>
        </div>
      </div>
    </section>
  );
}
