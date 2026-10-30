import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  CheckCircle2,
  Clock,
  Database,
  Gauge,
  Layers,
  ListOrdered,
  MapPin,
  Radar,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sliders,
  Timer,
  TriangleAlert,
  Utensils,
} from "lucide-react";
import { LabelSumber } from "@/components/data/label-sumber";
import { IKON_KATEGORI } from "@/components/data/ikon-kategori";
import { BagianInfo, HalamanInfo, Rumus } from "@/components/info/kerangka";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilAturanSla, type TahapSla } from "@/lib/data/publik";
import { batasJam } from "@/lib/format";
import { KOMPONEN } from "@/lib/indeks";
import { KATEGORI, SUMBER, type Kategori, type SumberData } from "@/lib/label";

export const metadata: Metadata = {
  title: "Metodologi Terbuka",
  description: "Formula matematis dan parameter objektif sistem PMBGM: Indeks Risiko SAW, skor kredibilitas laporan, batas waktu SLA, dan deteksi anomali.",
};

const ISI = [
  { id: "indeks", label: "Indeks Risiko SAW", ikon: Gauge },
  { id: "kredibilitas", label: "Kredibilitas Bukti", ikon: BadgeCheck },
  { id: "prioritas", label: "Prioritas & SLA", ikon: Timer },
  { id: "peringatan", label: "Deteksi Dini", ikon: Siren },
  { id: "sumber", label: "Sumber Data", ikon: Database },
];

const BOBOT_SAW = [
  { nama: "Laporan Warga 30 Hari", bobot: "35%", skor: 35, warna: "var(--chart-1)", desc: "Frekuensi keluhan terverifikasi per 1.000 porsi" },
  { nama: "Kasus Dugaan Keracunan", bobot: "25%", skor: 25, warna: "var(--chart-2)", desc: "Insiden gangguan kesehatan terverifikasi medis" },
  { nama: "Sertifikat SLHS Kemenkes", bobot: "15%", skor: 15, warna: "var(--chart-3)", desc: "Kepatuhan laik higiene sanitasi dapur SPPG" },
  { nama: "Keterlambatan Respon SLA", bobot: "15%", skor: 15, warna: "var(--chart-4)", desc: "Persentase aduan melewati batas waktu resmi" },
  { nama: "Penilaian Kepuasan Konsumen", bobot: "10%", skor: 10, warna: "var(--chart-5)", desc: "Rata-rata rating kepuasan orang tua / guru" },
];

const BOBOT_KREDIBILITAS = [
  { label: "Bukti Foto / Video", poin: 30, desc: "Bukti autentik minimal 1 dokumentasi fisik menu/kejadian" },
  { label: "Integritas Metadata Foto", poin: 25, desc: "Kesesuaian timestamp waktu ≤ 48 jam & radius GPS ≤ 2 km" },
  { label: "Status Verifikasi Pelapor", poin: 25, desc: "Pelapor terverifikasi data kependudukan / nomor HP resmi" },
  { label: "Dukungan Validasi Warga", poin: 15, desc: "Konfirmasi kesaksian dari warga sekolah lain ('Saya juga mengalami')" },
  { label: "Kelengkapan Uraian Kasus", poin: 5, desc: "Deskripsi kronologi lengkap dan jumlah siswa terdampak diisi" },
];

const TAHAP: { kunci: TahapSla; label: string }[] = [
  { kunci: "diterima", label: "Verifikasi" },
  { kunci: "diverifikasi", label: "Diteruskan" },
  { kunci: "diteruskan", label: "Ditanggapi" },
  { kunci: "ditindaklanjuti", label: "Selesai" },
];

async function TabelSlaRingkas() {
  const sla = await ambilAturanSla();
  return (
    <div className="overflow-x-auto rounded-2xl border bg-card">
      <table className="w-full min-w-[32rem] text-xs sm:text-sm">
        <thead className="bg-muted/50 text-xs text-muted-foreground uppercase tracking-wider">
          <tr>
            <th scope="col" className="p-3 text-left font-bold">Kategori Aduan</th>
            {TAHAP.map((t) => (
              <th key={t.kunci} scope="col" className="p-3 text-right font-bold">{t.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="angka divide-y">
          {(Object.keys(KATEGORI) as Kategori[]).map((k) => {
            const Ikon = IKON_KATEGORI[k];
            const isKeracunan = k === "keracunan";
            return (
              <tr key={k} className={isKeracunan ? "bg-darurat-lembut/60 font-semibold text-darurat" : ""}>
                <th scope="row" className="p-3 text-left font-semibold">
                  <span className="flex items-center gap-2">
                    <Ikon className="size-4 shrink-0" aria-hidden />
                    {KATEGORI[k].label}
                    {isKeracunan && (
                      <span className="rounded bg-darurat-lembut px-1.5 py-0.5 text-[10px] font-black uppercase text-darurat">
                        Darurat
                      </span>
                    )}
                  </span>
                </th>
                {TAHAP.map((t) => (
                  <td key={t.kunci} className="p-3 text-right">
                    {batasJam(sla[k]?.[t.kunci]) ?? "–"}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function HalamanMetodologi() {
  return (
    <HalamanInfo
      judul="Metodologi"
      pengantar="Rumus Indeks Risiko SAW, bobot kredibilitas, dan standar waktu SLA."
      isi={ISI}
    >
      {/* 1. INDEKS RISIKO SAW */}
      <BagianInfo id="indeks" judul="Indeks Risiko Komposit (Metode SAW)" ikon={Gauge}>
        <div className="space-y-4">
          <Rumus
            hasil="Skor Risiko"
            suku={[
              { label: "Laporan", bobot: "0,35", warna: "var(--chart-1)" },
              { label: "Keracunan", bobot: "0,25", warna: "var(--chart-2)" },
              { label: "SLHS", bobot: "0,15", warna: "var(--chart-3)" },
              { label: "SLA", bobot: "0,15", warna: "var(--chart-4)" },
              { label: "Kepuasan", bobot: "0,10", warna: "var(--chart-5)" },
            ]}
          />

          {/* 5 Kartu Bobot Kriteria Visual */}
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {BOBOT_SAW.map((b) => (
              <div key={b.nama} className="rounded-2xl border bg-card p-3.5 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-foreground">{b.nama}</span>
                  <span className="font-black text-primary text-sm">{b.bobot}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${b.skor * 2.5}%`, background: b.warna }} />
                </div>
                <p className="text-[11px] text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>

          {/* 3 Level Risiko Resmi */}
          <div className="pt-2 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Tingkat Pengawasan & Target Audit Dinas Kesehatan:
            </span>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-risiko-rendah/30 bg-risiko-rendah-lembut p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-risiko-rendah">Level A</span>
                  <span className="text-xs font-mono font-bold">0 – 39</span>
                </div>
                <p className="text-xs font-bold text-foreground">Risiko Rendah</p>
                <p className="text-[11px] text-muted-foreground">Inspeksi berkala 6 bulan sekali.</p>
              </div>

              <div className="rounded-2xl border border-risiko-sedang/30 bg-risiko-sedang-lembut p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-risiko-sedang">Level B</span>
                  <span className="text-xs font-mono font-bold">40 – 69</span>
                </div>
                <p className="text-xs font-bold text-foreground">Risiko Sedang (Waspada)</p>
                <p className="text-[11px] text-muted-foreground">Pembinaan sanitasi rutin 1 bulan sekali.</p>
              </div>

              <div className="rounded-2xl border border-risiko-tinggi/30 bg-risiko-tinggi-lembut p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-risiko-tinggi">Level C</span>
                  <span className="text-xs font-mono font-bold">70 – 100</span>
                </div>
                <p className="text-xs font-bold text-foreground">Risiko Tinggi (Kritis)</p>
                <p className="text-[11px] text-muted-foreground">Inspeksi mendadak Dinkes 1×24 jam.</p>
              </div>
            </div>
          </div>

          <div className="pt-1">
            <Link
              href="/panduan#simulator-dss"
              className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2 text-xs font-bold text-primary hover:bg-primary/15 transition"
            >
              <Sliders className="size-4" /> Uji Coba Simulator DSS SAW Interaktif →
            </Link>
          </div>
        </div>
      </BagianInfo>

      {/* 2. KREDIBILITAS BUKTI */}
      <BagianInfo id="kredibilitas" judul="Verifikasi Skor Kredibilitas (0 – 100 Poin)" ikon={BadgeCheck}>
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Sistem secara otomatis mengevaluasi integritas aduan untuk memprioritaskan telaah tanpa menghapus hak pelapor.
          </p>

          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {BOBOT_KREDIBILITAS.map((k) => (
              <div key={k.label} className="rounded-2xl border bg-card p-3.5 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">{k.label}</span>
                  <span className="font-black text-primary">+{k.poin} Poin</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(k.poin / 30) * 100}%` }} />
                </div>
                <p className="text-[11px] text-muted-foreground">{k.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </BagianInfo>

      {/* 3. PRIORITAS & TABEL SLA */}
      <BagianInfo id="prioritas" judul="Batas Waktu Respon Resmi (SLA)" ikon={Timer}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="rounded-xl border bg-card p-3 text-center">
              <span className="block text-[10px] uppercase font-bold text-darurat">Keracunan</span>
              <span className="text-sm font-black text-foreground">Maks 2 Jam</span>
            </div>
            <div className="rounded-xl border bg-card p-3 text-center">
              <span className="block text-[10px] uppercase font-bold text-risiko-sedang">Kebersihan</span>
              <span className="text-sm font-black text-foreground">Maks 24 Jam</span>
            </div>
            <div className="rounded-xl border bg-card p-3 text-center">
              <span className="block text-[10px] uppercase font-bold text-primary">Gizi / Menu</span>
              <span className="text-sm font-black text-foreground">Maks 48 Jam</span>
            </div>
            <div className="rounded-xl border bg-card p-3 text-center">
              <span className="block text-[10px] uppercase font-bold text-muted-foreground">Distribusi</span>
              <span className="text-sm font-black text-foreground">Maks 72 Jam</span>
            </div>
          </div>

          <Suspense fallback={<Skeleton className="h-64 rounded-2xl" />}>
            <TabelSlaRingkas />
          </Suspense>
        </div>
      </BagianInfo>

      {/* 4. PERINGATAN DINI CEGAH KLB */}
      <BagianInfo id="peringatan" judul="Deteksi Dini Anomali (Cegah KLB)" ikon={Siren}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border bg-risiko-tinggi-lembut border-risiko-tinggi/25 p-4 space-y-1.5">
            <span className="flex items-center gap-2 text-xs font-bold text-risiko-tinggi">
              <ShieldAlert className="size-4" /> Ambang Batas Peringatan:
            </span>
            <p className="text-xs text-foreground font-semibold">
              Lonjakan aduan ≥ 3 laporan terverifikasi pada 1 SPPG dalam 24 jam melebihi 3× lipat rata-rata harian.
            </p>
          </div>
          <div className="rounded-2xl border bg-secondary border-primary/20 p-4 space-y-1.5">
            <span className="flex items-center gap-2 text-xs font-bold text-primary">
              <Clock className="size-4" /> Frekuensi Pemindaian:
            </span>
            <p className="text-xs text-foreground font-semibold">
              Komputasi anomali berjalan otomatis setiap 15 menit dan langsung meneruskan peringatan darurat ke Dinas Kesehatan.
            </p>
          </div>
        </div>
      </BagianInfo>

      {/* 5. SUMBER DATA */}
      <BagianInfo id="sumber" judul="Transparansi & Sumber Data Terbuka" ikon={Database}>
        <div className="grid gap-2 sm:grid-cols-2">
          {(Object.keys(SUMBER) as SumberData[]).map((s) => (
            <div key={s} className="flex items-center gap-2.5 rounded-xl border bg-card p-3 text-xs">
              <LabelSumber jenis={s} />
              <span className="text-muted-foreground">{SUMBER[s].penjelasan}</span>
            </div>
          ))}
        </div>
      </BagianInfo>
    </HalamanInfo>
  );
}
