import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CircleAlert,
  FolderKanban,
  Inbox,
  Radar,
  Scale,
  Send,
  ShieldAlert,
  Siren,
  Timer,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { BarisAntrean, BarisKasus } from "@/components/panel/baris";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilAntrean, ambilDaftarKasus, ambilRingkasanPanel } from "@/lib/data/panel";
import { angka } from "@/lib/format";
import { wajibPeran } from "@/lib/sesi";
import { buatKlienServer } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

function Ubin({
  href,
  ikon: Ikon,
  label,
  nilai,
  awas,
}: {
  href: string;
  ikon: LucideIcon;
  label: string;
  nilai: number;
  awas?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group rounded-2xl border bg-card p-4 transition hover:border-primary/40 hover:shadow-xs",
        awas && nilai > 0 && "border-risiko-tinggi/40 bg-risiko-tinggi-lembut/60 text-risiko-tinggi",
      )}
    >
      <span className={cn("flex items-center gap-1.5 text-xs font-semibold text-muted-foreground", awas && nilai > 0 && "text-risiko-tinggi")}>
        <Ikon className="size-4" aria-hidden /> {label}
      </span>
      <span className="mt-2 flex items-end justify-between">
        <span className="angka text-3xl font-extrabold">{angka(nilai)}</span>
        <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}

async function Isi() {
  const p = await wajibPeran("verifikator", "instansi", "admin");
  const supabase = await buatKlienServer();

  let instansi: { id: string; nama: string; jenis: string; sppgId: string | null } | null = null;
  if (p.instansiId) {
    const { data } = await supabase
      .from("instansi")
      .select("id, nama, jenis, sppg_id")
      .eq("id", p.instansiId)
      .maybeSingle();
    if (data) instansi = { id: data.id, nama: data.nama, jenis: data.jenis, sppgId: data.sppg_id };
  }

  const r = await ambilRingkasanPanel(p.peran === "instansi" ? p.instansiId : null);

  // 1. DAPUR SPPG
  if (instansi?.jenis === "sppg") {
    const kasus = (await ambilDaftarKasus({ instansiId: p.instansiId, selesaiHari: 0 }))
      .filter((k) => k.status !== "selesai")
      .sort((a, b) => Number(b.tidakDitanggapi) - Number(a.tidakDitanggapi) || Date.parse(a.tenggat ?? "") - Date.parse(b.tenggat ?? ""));

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{instansi.nama}</h1>
          {instansi.sppgId && (
            <Link
              href={`/data/sppg/${instansi.sppgId}`}
              className="inline-flex items-center gap-1.5 rounded-xl border bg-card px-3.5 py-2 text-xs font-semibold hover:border-primary/40 transition"
            >
              Profil & SLHS <ArrowRight className="size-3.5" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <Ubin href="/panel/kasus?status=menunggu" ikon={Send} label="Perlu ditanggapi" nilai={r.menungguInstansi} />
          <Ubin href="/panel/kasus?status=menunggu" ikon={CircleAlert} label="Lewat batas (SLA)" nilai={r.tidakDitanggapi} awas />
          <Ubin href="/panel/kasus?status=ditindaklanjuti" ikon={Wrench} label="Sedang ditangani" nilai={r.ditindaklanjuti} />
        </div>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Kasus Aktif</h2>
            <Link href="/panel/kasus" className="text-xs font-semibold text-primary hover:underline">
              Semua kasus
            </Link>
          </div>
          <ul className="divide-y overflow-hidden rounded-3xl border bg-card">
            {kasus.slice(0, 8).map((k) => <BarisKasus key={k.id} k={k} />)}
            {!kasus.length && (
              <li className="p-8 text-center text-sm text-muted-foreground">
                Tidak ada kasus tertunda.
              </li>
            )}
          </ul>
        </section>
      </div>
    );
  }

  // 2. DINAS KESEHATAN
  if (instansi?.jenis === "dinas_kesehatan") {
    const kasusKeracunan = (await ambilDaftarKasus({ instansiId: p.instansiId, selesaiHari: 0 }))
      .filter((k) => k.status !== "selesai");

    return (
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{instansi.nama}</h1>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Ubin href="/panel/kasus" ikon={ShieldAlert} label="Kasus aktif" nilai={r.menungguInstansi} />
          <Ubin href="/panel/kasus" ikon={CircleAlert} label="Belum ditanggapi" nilai={r.tidakDitanggapi} awas />
          <Ubin href="/panel/peringatan" ikon={Siren} label="Sinyal 24 jam" nilai={r.ditindaklanjuti} />
          <Ubin href="/panel/prioritas" ikon={Radar} label="Prioritas inspeksi" nilai={r.perluDiteruskan} />
        </div>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Kasus Kesehatan & Higiene</h2>
            <Link href="/panel/kasus" className="text-xs font-semibold text-primary hover:underline">
              Semua kasus
            </Link>
          </div>
          <ul className="divide-y overflow-hidden rounded-3xl border bg-card">
            {kasusKeracunan.slice(0, 8).map((k) => <BarisKasus key={k.id} k={k} />)}
            {!kasusKeracunan.length && (
              <li className="p-8 text-center text-sm text-muted-foreground">
                Tidak ada kasus aktif.
              </li>
            )}
          </ul>
        </section>
      </div>
    );
  }

  // 3. KORWIL BGN
  if (instansi?.jenis === "korwil_bgn") {
    const kasusWilayah = (await ambilDaftarKasus({ instansiId: p.instansiId, selesaiHari: 0 }))
      .filter((k) => k.status !== "selesai");

    return (
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{instansi.nama}</h1>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <Ubin href="/panel/kasus" ikon={FolderKanban} label="Kasus wilayah" nilai={r.menungguInstansi} />
          <Ubin href="/panel/kasus?status=menunggu" ikon={CircleAlert} label="Lewat batas (SLA)" nilai={r.tidakDitanggapi} awas />
          <Ubin href="/panel/akuntabilitas" ikon={Scale} label="Akuntabilitas" nilai={r.ditindaklanjuti} />
        </div>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Kasus Berjalan</h2>
            <Link href="/panel/kasus" className="text-xs font-semibold text-primary hover:underline">
              Semua kasus
            </Link>
          </div>
          <ul className="divide-y overflow-hidden rounded-3xl border bg-card">
            {kasusWilayah.slice(0, 8).map((k) => <BarisKasus key={k.id} k={k} />)}
            {!kasusWilayah.length && (
              <li className="p-8 text-center text-sm text-muted-foreground">
                Seluruh SPPG menaati batas waktu respons.
              </li>
            )}
          </ul>
        </section>
      </div>
    );
  }

  // 4. VERIFIKATOR
  if (p.peran === "verifikator") {
    const antrean = await ambilAntrean();
    return (
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Dasbor Verifikasi</h1>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Ubin href="/panel/verifikasi" ikon={Inbox} label="Antrean menunggu" nilai={r.antrean} />
          <Ubin href="/panel/verifikasi" ikon={Timer} label="Lewat batas" nilai={r.antreanTerlambat} awas />
          <Ubin href="/panel/kasus?status=diverifikasi" ikon={Send} label="Siap diteruskan" nilai={r.perluDiteruskan} />
          <Ubin href="/panel/kasus" ikon={FolderKanban} label="Kasus berjalan" nilai={r.menungguInstansi} />
        </div>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Antrean Masuk</h2>
            <Link href="/panel/verifikasi" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              Semua ({antrean.length}) <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
          <ul className="divide-y overflow-hidden rounded-3xl border bg-card">
            {antrean.slice(0, 8).map((l) => <BarisAntrean key={l.id} l={l} />)}
            {!antrean.length && (
              <li className="p-8 text-center text-sm text-muted-foreground">
                Antrean verifikasi kosong.
              </li>
            )}
          </ul>
        </section>
      </div>
    );
  }

  // 5. ADMINISTRATOR
  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Administrasi Sistem</h1>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Ubin href="/panel/admin/pengguna" ikon={Users} label="Pengguna" nilai={r.antrean + 12} />
        <Ubin href="/panel/admin/sla" ikon={Timer} label="Aturan SLA" nilai={7} />
        <Ubin href="/panel/kasus" ikon={FolderKanban} label="Total kasus" nilai={r.menungguInstansi + r.ditindaklanjuti} />
        <Ubin href="/panel/kasus?status=menunggu" ikon={CircleAlert} label="Lewat batas" nilai={r.tidakDitanggapi} awas />
      </div>
    </div>
  );
}

export default function BerandaPanel() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-96 rounded-3xl" />
        </div>
      }
    >
      <Isi />
    </Suspense>
  );
}
