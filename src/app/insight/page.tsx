import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, ShieldAlert, Siren, TriangleAlert, Utensils } from "lucide-react";
import { BadgeRisiko } from "@/components/data/badge";
import { ChipAlasan } from "@/components/data/chip-alasan";
import { Waktu } from "@/components/data/waktu";
import { Tile } from "@/components/data-terbuka/remah";
import { PetaRisiko, PetaRisikoDasar } from "@/components/insight/peta-risiko";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilIndeksSemua, ambilPeringatan, ambilPeta } from "@/lib/data/insight";
import { angka } from "@/lib/format";

export const metadata: Metadata = {
  title: "Insight",
  description: "Peta risiko, prioritas inspeksi SPPG, dan peringatan dini program Makan Bergizi Gratis.",
};

async function Ringkasan() {
  const { daftar } = await ambilIndeksSemua();
  const { daftar: peringatan, ditinjau } = await ambilPeringatan();
  const aktif = peringatan.filter((p) => p.aktif).length;
  const jumlah = (k: string) => daftar.filter((d) => d.kategori === k).length;
  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Tile ikon={ShieldAlert} label="Risiko tinggi" nilai={angka(jumlah("tinggi"))} sub="SPPG" />
      <Tile ikon={TriangleAlert} label="Risiko sedang" nilai={angka(jumlah("sedang"))} sub="SPPG" />
      <Tile ikon={Siren} label="Peringatan aktif" nilai={angka(aktif)} sub={ditinjau ? `${ditinjau} sinyal ditinjau` : "Terverifikasi"} />
      <Tile ikon={Utensils} label="SPPG terpantau" nilai={angka(daftar.length)} sub="Kota Semarang" />
    </dl>
  );
}

async function Peta() {
  const data = await ambilPeta();
  return (
    <Suspense fallback={<PetaRisikoDasar data={data} lapis="kasus" />}>
      <PetaRisiko data={data} />
    </Suspense>
  );
}

async function PrioritasTeratas() {
  const { daftar, dihitungPada } = await ambilIndeksSemua();
  return (
    <section aria-labelledby="judul-prioritas" className="rounded-3xl border bg-card p-5 sm:p-6">
      <header className="flex items-center justify-between gap-2">
        <h2 id="judul-prioritas" className="font-bold">Prioritas inspeksi</h2>
        <Link href="/insight/prioritas" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
          Semua <ArrowRight className="size-4" aria-hidden />
        </Link>
      </header>
      <ol className="mt-3 divide-y">
        {daftar.slice(0, 5).map((s, i) => (
          <li key={s.id} className="flex flex-wrap items-center gap-x-3 gap-y-1.5 py-3">
            <span className="angka w-5 text-sm font-bold text-muted-foreground">{i + 1}</span>
            <Link href={`/data/sppg/${s.id}`} className="min-w-0 flex-1 hover:underline">
              <span className="block truncate font-semibold">{s.nama.replace("SPPG Contoh ", "SPPG ")}</span>
              <span className="block text-xs text-muted-foreground">{s.kecamatan}</span>
            </Link>
            <BadgeRisiko skor={s.indeks} />
            <span className="flex w-full flex-wrap gap-1 pl-8">
              {s.alasan.slice(0, 3).map((a) => <ChipAlasan key={a.jenis} alasan={a} />)}
            </span>
          </li>
        ))}
      </ol>
      {dihitungPada && <p className="mt-2 text-xs text-muted-foreground">Dihitung <Waktu iso={dihitungPada} /></p>}
    </section>
  );
}

async function PeringatanTerkini() {
  const { daftar, ditinjau } = await ambilPeringatan();
  return (
    <section aria-labelledby="judul-peringatan" className="rounded-3xl border bg-card p-5 sm:p-6">
      <header className="flex items-center justify-between gap-2">
        <h2 id="judul-peringatan" className="font-bold">Peringatan dini</h2>
        <Link href="/insight/peringatan" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
          Semua <ArrowRight className="size-4" aria-hidden />
        </Link>
      </header>
      <ul className="mt-3 space-y-2">
        {daftar.slice(0, 3).map((p) => (
          <li key={p.id} className="flex items-center gap-3 rounded-2xl bg-muted/50 p-3">
            <span className={p.aktif ? "flex size-9 items-center justify-center rounded-xl bg-darurat text-white" : "flex size-9 items-center justify-center rounded-xl bg-muted text-muted-foreground"}>
              <Siren className="size-4" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{p.sppg.replace("SPPG Contoh ", "SPPG ")}</span>
              <span className="block text-xs text-muted-foreground">{p.aktif ? "Aktif" : "Selesai"} · <Waktu iso={p.dibuatPada} /></span>
            </span>
            <span className="angka text-lg font-extrabold">×{p.rasio.toLocaleString("id-ID", { maximumFractionDigits: 1 })}</span>
          </li>
        ))}
        {!daftar.length && <li className="rounded-2xl bg-muted/50 p-3 text-sm text-muted-foreground">Tidak ada lonjakan dalam 90 hari</li>}
      </ul>
      {ditinjau > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">{ditinjau} sinyal dari laporan belum terverifikasi sedang ditinjau</p>
      )}
    </section>
  );
}

export default function HalamanInsight() {
  return (
    <div className="space-y-6">
      <h1 className="sr-only">Insight</h1>
      <Suspense fallback={<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}</div>}>
        <Ringkasan />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-[34rem] rounded-3xl" />}>
        <Peta />
      </Suspense>
      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<Skeleton className="h-96 rounded-3xl" />}>
          <PrioritasTeratas />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-96 rounded-3xl" />}>
          <PeringatanTerkini />
        </Suspense>
      </div>
    </div>
  );
}
