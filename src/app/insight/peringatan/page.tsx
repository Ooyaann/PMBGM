import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { BadgeCheck, Building2, Clock, Eye, FileStack, History, ShieldCheck, Siren, TrendingUp } from "lucide-react";
import { LabelSumber } from "@/components/data/label-sumber";
import { Waktu } from "@/components/data/waktu";
import { Tile } from "@/components/data-terbuka/remah";
import { PenyegarRealtime } from "@/components/lacak/penyegar-realtime";
import { InfoMetrik } from "@/components/ui/info-metrik";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilPeringatan, type Peringatan } from "@/lib/data/insight";
import { angka } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Peringatan dini",
  description: "Lonjakan laporan terverifikasi per SPPG: lebih dari tiga kali rata-rata harian dalam 24 jam.",
};

/** Aturan deteksi IN-05, sama dengan fungsi deteksi_lonjakan di database. */
const ATURAN = [
  { ikon: Clock, teks: "24 jam terakhir" },
  { ikon: TrendingUp, teks: "> 3× rata-rata harian 30 hari" },
  { ikon: FileStack, teks: "Minimal 3 laporan" },
  { ikon: BadgeCheck, teks: "Hanya laporan terverifikasi" },
];

const rasio = (v: number) => v.toLocaleString("id-ID", { maximumFractionDigits: 1 });

function KartuPeringatan({ p }: { p: Peringatan }) {
  // Bilah pembanding: rata-rata harian vs 24 jam, diskalakan ke nilai terbesar.
  const maks = Math.max(p.jumlah24Jam, p.rataHarian, 1);
  return (
    <li className={cn("rounded-3xl border bg-card p-4 sm:p-5", p.aktif && "border-darurat/40 ring-4 ring-darurat-lembut")}>
      <div className="flex items-start gap-3">
        <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl",
          p.aktif ? "bg-darurat text-white" : "bg-muted text-muted-foreground")}>
          <Siren className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <Link href={`/data/sppg/${p.sppgId}`} className="block truncate font-bold hover:underline">
            {p.sppg}
          </Link>
          <p className="text-xs text-muted-foreground">
            {p.kecamatan} · <span className={p.aktif ? "font-semibold text-darurat" : ""}>{p.aktif ? "Aktif" : "Selesai"}</span> · <Waktu iso={p.dibuatPada} />
          </p>
        </div>
        <p className="text-right">
          <span className="angka block text-2xl font-extrabold">×{rasio(p.rasio)}</span>
          <span className="text-[11px] text-muted-foreground">dari biasanya</span>
        </p>
      </div>

      {p.aktif && (
        <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-risiko-sedang-lembut px-3 py-1.5 text-xs font-medium text-risiko-sedang">
          <Building2 className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">Penanggung Jawab: Dinas Kesehatan Kota & {p.sppg}</span>
        </div>
      )}

      <dl className="mt-4 space-y-1.5 text-xs">
        {[
          { label: "Rata-rata/hari", nilai: p.rataHarian, warna: "bg-[var(--seq-250)]" },
          { label: "24 jam", nilai: p.jumlah24Jam, warna: p.aktif ? "bg-darurat" : "bg-[var(--seq-550)]" },
        ].map((b) => (
          <div key={b.label} className="grid grid-cols-[6.5rem_1fr_2.5rem] items-center gap-2">
            <dt className="text-muted-foreground">{b.label}</dt>
            <dd className="h-2.5 overflow-hidden rounded-full bg-[var(--chart-jalur)]">
              <span className={cn("block h-full rounded-full", b.warna)} style={{ width: `${(100 * b.nilai) / maks}%` }} />
            </dd>
            <dd className="angka text-right font-semibold">{rasio(b.nilai)}</dd>
          </div>
        ))}
      </dl>
    </li>
  );
}

async function Isi() {
  const { daftar, ditinjau } = await ambilPeringatan();
  const aktif = daftar.filter((p) => p.aktif);
  const riwayat = daftar.filter((p) => !p.aktif);
  return (
    <>
      <dl className="grid grid-cols-3 gap-3">
        <Tile ikon={Siren} label="Aktif" nilai={angka(aktif.length)} />
        <Tile
          ikon={Eye}
          label="Sinyal Ditinjau"
          nilai={angka(ditinjau)}
          sub={<InfoMetrik jenis="sinyal">Menunggu verifikasi lapangan</InfoMetrik>}
        />
        <Tile ikon={History} label="90 hari" nilai={angka(daftar.length)} />
      </dl>

      <div className="rounded-2xl border bg-muted/40 p-4 text-xs text-muted-foreground flex items-start gap-3">
        <InfoMetrik jenis="sinyal" className="shrink-0 mt-0.5 text-primary" />
        <p className="leading-relaxed">
          <strong className="text-foreground">Bagaimana sistem bekerja:</strong> Sinyal lonjakan terdeteksi otomatis saat laporan warga terverifikasi melonjak &gt;3× rata-rata harian dalam 24 jam. Tim verifikator bersama Dinas Kesehatan segera melakukan uji lapangan sebelum menetapkan status darurat.
        </p>
      </div>

      {aktif.length ? (
        <ul className="grid gap-3 md:grid-cols-2">{aktif.map((p) => <KartuPeringatan key={p.id} p={p} />)}</ul>
      ) : (
        <p className="flex items-center gap-3 rounded-3xl border bg-card p-5 text-sm">
          <span className="flex size-10 items-center justify-center rounded-xl bg-risiko-rendah-lembut text-risiko-rendah">
            <ShieldCheck className="size-5" aria-hidden />
          </span>
          <span>
            <span className="block font-semibold">Tidak ada lonjakan aktif</span>
            {ditinjau > 0 && <span className="text-muted-foreground">{ditinjau} sinyal aduan sedang diverifikasi oleh tim verifikator dan Dinkes</span>}
          </span>
        </p>
      )}

      {riwayat.length > 0 && (
        <section aria-labelledby="judul-riwayat" className="space-y-3">
          <h2 id="judul-riwayat" className="flex items-center gap-2 font-bold">
            <History className="size-4 text-muted-foreground" aria-hidden /> Riwayat
          </h2>
          <ul className="grid gap-3 md:grid-cols-2">{riwayat.map((p) => <KartuPeringatan key={p.id} p={p} />)}</ul>
        </section>
      )}
    </>
  );
}

export default function HalamanPeringatan() {
  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-center gap-2">
        <h1 className="text-3xl font-extrabold">Peringatan dini</h1>
        <div className="ml-auto flex items-center gap-2">
          <LabelSumber jenis="laporan_warga_terverifikasi" />
          <PenyegarRealtime kanal="peringatan-dini" langganan={[{ tabel: "peringatan_dini" }]} />
        </div>
      </header>
      <ul aria-label="Aturan deteksi lonjakan" className="flex flex-wrap gap-2">
        {ATURAN.map((a) => (
          <li key={a.teks} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-card px-3 text-xs font-medium ring-1 ring-border">
            <a.ikon className="size-3.5 text-primary" aria-hidden /> {a.teks}
          </li>
        ))}
      </ul>
      <Suspense fallback={<Skeleton className="h-96 rounded-3xl" />}>
        <Isi />
      </Suspense>
    </div>
  );
}
