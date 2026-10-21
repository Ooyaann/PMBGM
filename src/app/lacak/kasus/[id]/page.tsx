import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, Building2, Calendar, EyeOff, ImageIcon, MapPin, School, Star, Users, Utensils,
} from "lucide-react";
import { AlurStatus } from "@/components/data/alur-status";
import { BadgeSla, BadgeStatus } from "@/components/data/badge";
import { IKON_KATEGORI } from "@/components/data/ikon-kategori";
import { LabelSumber } from "@/components/data/label-sumber";
import { HitungMundur } from "@/components/lacak/hitung-mundur";
import { PenyegarRealtime } from "@/components/lacak/penyegar-realtime";
import { GaleriBukti, Timeline } from "@/components/lacak/timeline";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilKasus } from "@/lib/data/lacak";
import { angka, tanggalJam } from "@/lib/format";
import { KATEGORI, type Kategori, type StatusAlur } from "@/lib/label";

export const metadata: Metadata = {
  title: "Kasus",
  description: "Timeline publik penanganan kasus MBG: verifikasi, penerusan ke instansi, tindak lanjut, dan buktinya.",
};

const POLA_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function Info({ ikon: Ikon, label, children }: { ikon: typeof School; label: string; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2.5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground" title={label}>
        <Ikon className="size-4" aria-hidden />
      </span>
      <span className="min-w-0 text-sm"><span className="sr-only">{label}: </span>{children}</span>
    </li>
  );
}

async function IsiKasus({ params }: { params: PageProps<"/lacak/kasus/[id]">["params"] }) {
  const { id } = await params;
  if (!POLA_UUID.test(id)) notFound();
  const data = await ambilKasus(id);
  if (!data) notFound();
  const { kasus: k, timeline, fotoWarga } = data;
  const Ikon = IKON_KATEGORI[k.kategori as Kategori];
  const status = k.status as StatusAlur;

  return (
    <>
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-primary"><Ikon className="size-4" aria-hidden /></span>
            {KATEGORI[k.kategori as Kategori].label} · <span className="font-mono">{k.kode_kasus}</span>
          </p>
          <PenyegarRealtime kasusId={id} />
        </div>
        <h1 className="text-2xl font-extrabold sm:text-3xl">{k.judul}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <BadgeStatus status={status} />
          <BadgeSla terlambat={Boolean(k.terlambat)} tidakDitanggapi={Boolean(k.tidak_ditanggapi)} />
          {k.tenggat_tahap && status !== "selesai" && (
            <HitungMundur tenggat={k.tenggat_tahap} mulai={k.status_sejak} label="Batas tahap ini" />
          )}
          <LabelSumber jenis="laporan_warga_terverifikasi" />
        </div>
      </header>

      <section aria-label="Posisi kasus" className="mt-6 rounded-3xl border bg-card p-5 sm:p-6">
        <AlurStatus aktif={status} terlambat={Boolean(k.terlambat)} />
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <section aria-labelledby="judul-riwayat" className="rounded-3xl border bg-card p-5 sm:p-6">
          <h2 id="judul-riwayat" className="mb-5 font-bold">Riwayat penanganan</h2>
          <Timeline peristiwa={timeline} />
        </section>

        <aside className="space-y-4">
          <section aria-label="Rincian kasus" className="rounded-3xl border bg-card p-5">
            <ul className="space-y-3">
              {k.sppg_nama && <Info ikon={Utensils} label="Dapur SPPG">
                <Link href={`/data/sppg/${k.sppg_id}`} className="font-semibold hover:text-primary hover:underline">{k.sppg_nama}</Link>
              </Info>}
              <Info ikon={School} label="Sekolah">{k.sekolah_nama}</Info>
              <Info ikon={MapPin} label="Kecamatan">{k.kecamatan_nama}</Info>
              {k.instansi_nama && <Info ikon={Building2} label="Ditangani">{k.instansi_nama}</Info>}
              <Info ikon={Users} label="Laporan">{angka(k.jumlah_laporan)} laporan · {angka(k.total_terdampak)} terdampak</Info>
              <Info ikon={Calendar} label="Kejadian">{k.waktu_kejadian && tanggalJam(k.waktu_kejadian)}</Info>
              {k.rating_rata != null && (
                <Info ikon={Star} label="Kepuasan pelapor">
                  <span className="font-semibold">{Number(k.rating_rata).toLocaleString("id-ID")}/5</span> dari {k.jumlah_rating} penilaian
                </Info>
              )}
            </ul>
          </section>

          {fotoWarga.length > 0 && (
            <section aria-labelledby="judul-foto" className="rounded-3xl border bg-card p-5">
              <h2 id="judul-foto" className="flex items-center gap-2 text-sm font-semibold">
                <ImageIcon className="size-4 text-muted-foreground" aria-hidden /> Foto warga
              </h2>
              <GaleriBukti foto={fotoWarga} />
            </section>
          )}

          <p className="flex items-center gap-2 rounded-2xl bg-muted/70 p-3 text-xs text-muted-foreground">
            <EyeOff className="size-4 shrink-0" aria-hidden /> Identitas pelapor dan data anak tidak ditampilkan
          </p>
        </aside>
      </div>
    </>
  );
}

export default function HalamanKasus(props: PageProps<"/lacak/kasus/[id]">) {
  return (
    <div className="kontainer py-8 sm:py-10">
      <Link href="/lacak" className="mb-6 inline-flex h-9 items-center gap-1.5 rounded-lg pr-3 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden /> Lacak
      </Link>
      <Suspense fallback={<Skeleton className="h-[32rem] w-full rounded-3xl" />}>
        <IsiKasus params={props.params} />
      </Suspense>
    </div>
  );
}
