import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowUpRight, Building2, CircleCheck, Clock, FolderOpen, Scale, TriangleAlert } from "lucide-react";
import { LabelSumber } from "@/components/data/label-sumber";
import { TabelAkuntabilitas, type BarisAkuntabilitas } from "@/components/lacak/tabel-akuntabilitas";
import { InfoMetrik } from "@/components/ui/info-metrik";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilAkuntabilitas } from "@/lib/data/lacak";
import { angka, durasiJam, persen } from "@/lib/format";
import { wajibPeran } from "@/lib/sesi";

export const metadata: Metadata = {
  title: "Papan Akuntabilitas Wilayah",
  description: "Evaluasi kinerja tindak lanjut dan penegakan SLA di seluruh SPPG dan kecamatan Kota Semarang.",
};

const angkaAtauNull = (v: number | string | null) => (v == null ? null : Number(v));

async function Isi() {
  await wajibPeran("verifikator", "instansi", "admin");
  const { sppg, kecamatan, belumDitanggapi } = await ambilAkuntabilitas();

  const barisSppg: BarisAkuntabilitas[] = sppg.map((s) => ({
    id: s.sppg_id!,
    nama: s.nama!,
    sub: s.kecamatan_nama,
    href: `/data/sppg/${s.sppg_id}`,
    kasus: s.jumlah_kasus ?? 0,
    selesai: angkaAtauNull(s.persen_selesai),
    jamRespons: angkaAtauNull(s.rata_jam_respons),
    terlambat: angkaAtauNull(s.persen_terlambat),
    tidakDitanggapi: s.kasus_tidak_ditanggapi ?? 0,
    kepuasan: angkaAtauNull(s.kepuasan),
    jumlahRating: s.jumlah_rating ?? 0,
  }));

  const barisKecamatan: BarisAkuntabilitas[] = kecamatan.map((k) => ({
    id: k.wilayah_id!,
    nama: k.nama!,
    sub: null,
    href: null,
    kasus: k.jumlah_kasus ?? 0,
    selesai: angkaAtauNull(k.persen_selesai),
    jamRespons: angkaAtauNull(k.rata_jam_respons),
    terlambat: angkaAtauNull(k.persen_terlambat),
    tidakDitanggapi: k.kasus_tidak_ditanggapi ?? 0,
    kepuasan: angkaAtauNull(k.kepuasan),
    jumlahRating: k.jumlah_rating ?? 0,
  }));

  const total = barisKecamatan.reduce((s, b) => s + b.kasus, 0);
  const berbobot = (f: (b: BarisAkuntabilitas) => number | null) => {
    const ada = barisKecamatan.filter((b) => f(b) != null && b.kasus > 0);
    const bobot = ada.reduce((s, b) => s + b.kasus, 0);
    return bobot ? ada.reduce((s, b) => s + f(b)! * b.kasus, 0) / bobot : null;
  };

  const RINGKASAN = [
    { ikon: FolderOpen, label: "Total Kasus", nilai: angka(total), awas: false },
    { ikon: CircleCheck, label: "Tingkat Penyelesaian", nilai: persen(berbobot((b) => b.selesai)), awas: false },
    { ikon: Clock, label: "Rata-rata Respons", nilai: durasiJam(berbobot((b) => b.jamRespons)), awas: false },
    { ikon: TriangleAlert, label: "Melewati Batas (SLA)", nilai: persen(berbobot((b) => b.terlambat)), awas: true },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300">
              <Scale className="size-3.5 text-indigo-600" aria-hidden /> Pengawasan Kinerja & SLA
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">Papan Akuntabilitas SPPG Wilayah</h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Memantau kedisiplinan dapur dan instansi dalam merespons aduan masyarakat serta memastikan kepatuhan batas waktu (SLA).
            </p>
          </div>
          <LabelSumber jenis="laporan_warga_terverifikasi" />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {RINGKASAN.map((r, i) => (
            <div key={i} className="rounded-2xl border border-border/70 bg-card p-3.5">
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <r.ikon className="size-4 text-indigo-600" aria-hidden /> {r.label}
              </span>
              <p className="angka mt-1.5 text-2xl font-black">{r.nilai}</p>
            </div>
          ))}
        </div>
      </div>

      <TabelAkuntabilitas sppg={barisSppg} kecamatan={barisKecamatan} />
    </div>
  );
}

export default function HalamanPanelAkuntabilitas() {
  return (
    <Suspense fallback={<Skeleton className="h-[40rem] rounded-3xl" />}>
      <Isi />
    </Suspense>
  );
}
