import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { BadgeCheck, Building2, Clock, Eye, FileStack, ShieldAlert, Siren, TrendingUp } from "lucide-react";
import { LabelSumber } from "@/components/data/label-sumber";
import { Waktu } from "@/components/data/waktu";
import { PenyegarRealtime } from "@/components/lacak/penyegar-realtime";
import { InfoMetrik } from "@/components/ui/info-metrik";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilPeringatan, type Peringatan } from "@/lib/data/insight";
import { wajibPeran } from "@/lib/sesi";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Peringatan Dini Wilayah",
  description: "Deteksi lonjakan laporan terverifikasi per SPPG di wilayah pengawasan medis dan operasional.",
};

const ATURAN = [
  { ikon: Clock, teks: "Jendela 24 jam terakhir" },
  { ikon: TrendingUp, teks: "> 3× rata-rata harian 30 hari" },
  { ikon: FileStack, teks: "Minimal 3 laporan aktif" },
  { ikon: BadgeCheck, teks: "Hanya laporan terverifikasi" },
];

const rasio = (v: number) => v.toLocaleString("id-ID", { maximumFractionDigits: 1 });

function KartuPeringatan({ p }: { p: Peringatan }) {
  return (
    <li className={cn("rounded-3xl border bg-card p-4 sm:p-5 transition hover:shadow-xs", p.aktif && "border-darurat/40 bg-darurat-lembut/50 ring-2 ring-darurat/15")}>
      <div className="flex items-start gap-3">
        <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl",
          p.aktif ? "bg-darurat text-white shadow-xs" : "bg-muted text-muted-foreground")}>
          <Siren className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <Link href={`/data/sppg/${p.sppgId}`} className="block truncate font-bold hover:underline">
            {p.sppg}
          </Link>
          <p className="text-xs text-muted-foreground">
            {p.kecamatan} · <span className={p.aktif ? "font-bold text-darurat" : ""}>{p.aktif ? "Lonjakan Aktif" : "Normal"}</span> · Terdeteksi <Waktu iso={p.dibuatPada} />
          </p>
        </div>
        <p className="text-right">
          <span className="angka block text-2xl font-extrabold text-darurat">×{rasio(p.rasio)}</span>
          <span className="text-[11px] text-muted-foreground">dari batas normal</span>
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Building2 className="size-3.5 shrink-0" aria-hidden />
          <span>Fokus Penanganan: Dinas Kesehatan & SPPG Terkait</span>
        </div>
        <Link
          href={`/panel/kasus?status=menunggu`}
          className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
        >
          Lihat Kasus Dapur Ini →
        </Link>
      </div>
    </li>
  );
}

async function Isi() {
  await wajibPeran("verifikator", "instansi", "admin");
  const { daftar } = await ambilPeringatan();
  const aktif = daftar.filter((p) => p.aktif);
  const riwayat = daftar.filter((p) => !p.aktif);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-darurat/25 bg-darurat-lembut/40 p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-darurat-lembut px-3 py-1 text-xs font-bold text-darurat">
              <Siren className="size-3.5 text-darurat" aria-hidden /> Deteksi Lonjakan Cepat
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">Peringatan Dini Kesehatan & Wilayah</h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Sistem memantau anomali lonjakan keluhan terverifikasi dalam 24 jam terakhir untuk deteksi dini dugaan keracunan makanan sebelum meluas.
            </p>
          </div>
          <LabelSumber jenis="laporan_warga_terverifikasi" />
        </div>

        <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {ATURAN.map((a, i) => (
            <li key={i} className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card/80 px-3 py-2 text-xs font-medium">
              <a.ikon className="size-4 shrink-0 text-darurat" aria-hidden />
              <span>{a.teks}</span>
            </li>
          ))}
        </ul>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold flex items-center gap-2">
            <span className="size-2 rounded-full bg-darurat animate-pulse" />
            Peringatan Lonjakan Aktif ({aktif.length})
          </h2>
          <PenyegarRealtime kanal="panel-peringatan" langganan={[{ tabel: "peringatan_dini" }]} />
        </div>
        <ul className="space-y-3">
          {aktif.map((p) => <KartuPeringatan key={p.id} p={p} />)}
          {!aktif.length && (
            <li className="rounded-3xl border bg-card p-8 text-center text-sm text-muted-foreground">
              Tidak ada lonjakan anomali aktif saat ini. Semua dapur SPPG berada dalam batas laporan wajar.
            </li>
          )}
        </ul>
      </section>

      {riwayat.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-bold text-muted-foreground">Riwayat Peringatan Sebelumnya</h2>
          <ul className="space-y-3 opacity-80">
            {riwayat.slice(0, 5).map((p) => <KartuPeringatan key={p.id} p={p} />)}
          </ul>
        </section>
      )}
    </div>
  );
}

export default function HalamanPanelPeringatan() {
  return (
    <Suspense fallback={<Skeleton className="h-[32rem] rounded-3xl" />}>
      <Isi />
    </Suspense>
  );
}
