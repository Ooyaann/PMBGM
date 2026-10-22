import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, CircleAlert, Inbox, Send, Timer, Wrench, type LucideIcon } from "lucide-react";
import { BarisAntrean, BarisKasus } from "@/components/panel/baris";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilAntrean, ambilDaftarKasus, ambilRingkasanPanel } from "@/lib/data/panel";
import { angka } from "@/lib/format";
import { wajibPeran } from "@/lib/sesi";
import { cn } from "@/lib/utils";

function Ubin({ href, ikon: Ikon, label, nilai, awas }: { href: string; ikon: LucideIcon; label: string; nilai: number; awas?: boolean }) {
  return (
    <Link href={href} className={cn("group rounded-2xl border bg-card p-4 transition hover:border-primary/40",
      awas && nilai > 0 && "border-risiko-tinggi/40 bg-risiko-tinggi-lembut/50")}>
      <span className={cn("flex items-center gap-1.5 text-sm text-muted-foreground", awas && nilai > 0 && "text-risiko-tinggi")}>
        <Ikon className="size-4" aria-hidden /> {label}
      </span>
      <span className="mt-1 flex items-end justify-between">
        <span className="angka text-3xl font-extrabold">{angka(nilai)}</span>
        <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}

async function Isi() {
  const p = await wajibPeran("verifikator", "instansi", "admin");
  const staf = p.peran !== "instansi";
  const r = await ambilRingkasanPanel(staf ? null : p.instansiId);

  if (!staf) {
    const kasus = (await ambilDaftarKasus({ instansiId: p.instansiId, selesaiHari: 0 }))
      .filter((k) => k.status !== "selesai")
      .sort((a, b) => Number(b.tidakDitanggapi) - Number(a.tidakDitanggapi) || Date.parse(a.tenggat ?? "") - Date.parse(b.tenggat ?? ""));
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-extrabold">Halo, {p.nama}</h1>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <Ubin href="/panel/kasus?status=menunggu" ikon={Send} label="Perlu ditanggapi" nilai={r.menungguInstansi} />
          <Ubin href="/panel/kasus?status=menunggu" ikon={CircleAlert} label="Lewat batas" nilai={r.tidakDitanggapi} awas />
          <Ubin href="/panel/kasus?status=ditindaklanjuti" ikon={Wrench} label="Sedang ditangani" nilai={r.ditindaklanjuti} />
        </div>
        <section className="space-y-2">
          <h2 className="font-bold">Perlu tindakan</h2>
          <ul className="divide-y overflow-hidden rounded-3xl border bg-card">
            {kasus.slice(0, 8).map((k) => <BarisKasus key={k.id} k={k} />)}
            {!kasus.length && <li className="p-6 text-center text-sm text-muted-foreground">Tidak ada kasus terbuka</li>}
          </ul>
        </section>
      </div>
    );
  }

  const antrean = await ambilAntrean();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">Halo, {p.nama}</h1>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Ubin href="/panel/verifikasi" ikon={Inbox} label="Antrean" nilai={r.antrean} />
        <Ubin href="/panel/verifikasi" ikon={Timer} label="Verifikasi lewat batas" nilai={r.antreanTerlambat} awas />
        <Ubin href="/panel/kasus?status=diverifikasi" ikon={Send} label="Perlu diteruskan" nilai={r.perluDiteruskan} />
        <Ubin href="/panel/kasus?status=menunggu" ikon={CircleAlert} label="Tidak ditanggapi" nilai={r.tidakDitanggapi} awas />
      </div>
      <section className="space-y-2">
        <header className="flex items-center justify-between">
          <h2 className="font-bold">Prioritas antrean</h2>
          <Link href="/panel/verifikasi" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            Semua <ArrowRight className="size-4" aria-hidden />
          </Link>
        </header>
        <ul className="divide-y overflow-hidden rounded-3xl border bg-card">
          {antrean.slice(0, 6).map((l) => <BarisAntrean key={l.id} l={l} />)}
          {!antrean.length && <li className="p-6 text-center text-sm text-muted-foreground">Antrean kosong</li>}
        </ul>
      </section>
    </div>
  );
}

export default function BerandaPanel() {
  return (
    <Suspense fallback={<div className="space-y-6"><Skeleton className="h-10 w-56" /><Skeleton className="h-28 rounded-2xl" /><Skeleton className="h-96 rounded-3xl" /></div>}>
      <Isi />
    </Suspense>
  );
}
