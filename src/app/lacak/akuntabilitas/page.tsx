import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Building2, CircleCheck, Clock, FolderOpen, TriangleAlert } from "lucide-react";
import { IKON_KATEGORI } from "@/components/data/ikon-kategori";
import { LabelSumber } from "@/components/data/label-sumber";
import { HitungMundur } from "@/components/lacak/hitung-mundur";
import { NavLacak } from "@/components/lacak/nav-lacak";
import { TabelAkuntabilitas, type BarisAkuntabilitas } from "@/components/lacak/tabel-akuntabilitas";
import { ambilAkuntabilitas } from "@/lib/data/lacak";
import { angka, durasiJam, persen } from "@/lib/format";
import type { Kategori } from "@/lib/label";

export const metadata: Metadata = {
  title: "Papan Akuntabilitas",
  description: "Kinerja tindak lanjut laporan MBG per SPPG dan kecamatan: penyelesaian, waktu tanggap, keterlambatan, dan kepuasan pelapor.",
};

const angkaAtauNull = (v: number | string | null) => (v == null ? null : Number(v));

export default async function HalamanAkuntabilitas() {
  const { sppg, kecamatan, belumDitanggapi } = await ambilAkuntabilitas();

  const barisSppg: BarisAkuntabilitas[] = sppg.map((s) => ({
    id: s.sppg_id!,
    nama: s.nama!.replace("SPPG Contoh ", ""),
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

  // Ringkasan kota dari agregat per kecamatan (berbobot jumlah kasus).
  const total = barisKecamatan.reduce((s, b) => s + b.kasus, 0);
  const berbobot = (f: (b: BarisAkuntabilitas) => number | null) => {
    const ada = barisKecamatan.filter((b) => f(b) != null && b.kasus > 0);
    const bobot = ada.reduce((s, b) => s + b.kasus, 0);
    return bobot ? ada.reduce((s, b) => s + f(b)! * b.kasus, 0) / bobot : null;
  };

  const RINGKASAN = [
    { ikon: FolderOpen, label: "Kasus", nilai: angka(total) },
    { ikon: CircleCheck, label: "Selesai", nilai: persen(berbobot((b) => b.selesai)) },
    { ikon: Clock, label: "Rata tanggap", nilai: durasiJam(berbobot((b) => b.jamRespons)) },
    { ikon: TriangleAlert, label: "Belum ditanggapi", nilai: angka(belumDitanggapi.length), awas: belumDitanggapi.length > 0 },
  ];

  return (
    <div className="kontainer space-y-8 py-8 sm:py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-extrabold">Akuntabilitas</h1>
          <LabelSumber jenis="laporan_warga_terverifikasi" />
        </div>
        <NavLacak />
      </header>

      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {RINGKASAN.map((r) => (
          <div key={r.label} className={r.awas ? "rounded-2xl border border-risiko-tinggi/25 bg-risiko-tinggi-lembut p-4" : "rounded-2xl border bg-card p-4"}>
            <dt className={r.awas ? "flex items-center gap-1.5 text-sm text-risiko-tinggi" : "flex items-center gap-1.5 text-sm text-muted-foreground"}>
              <r.ikon className="size-4" aria-hidden /> {r.label}
            </dt>
            <dd className="angka mt-1 text-2xl font-extrabold sm:text-3xl">{r.nilai}</dd>
          </div>
        ))}
      </dl>

      {belumDitanggapi.length > 0 && (
        <section aria-labelledby="judul-belum" className="space-y-3">
          <h2 id="judul-belum" className="flex items-center gap-2 font-bold text-risiko-tinggi">
            <TriangleAlert className="size-5" aria-hidden /> Belum ditanggapi
          </h2>
          <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {belumDitanggapi.map((k) => {
              const Ikon = IKON_KATEGORI[k.kategori as Kategori];
              return (
                <li key={k.id}>
                  <Link href={`/lacak/kasus/${k.id}`}
                    className="group flex h-full flex-col gap-3 rounded-2xl border border-risiko-tinggi/20 bg-card p-4 transition hover:shadow-md">
                    <span className="flex items-start justify-between gap-2">
                      <span className="flex min-w-0 items-center gap-2">
                        <Ikon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                        <span className="line-clamp-1 text-sm font-semibold">{k.judul}</span>
                      </span>
                      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition group-hover:text-foreground" aria-hidden />
                    </span>
                    <span className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Building2 className="size-3.5" aria-hidden /> {k.instansi_nama}</span>
                      {k.tenggat_tahap && <HitungMundur tenggat={k.tenggat_tahap} mulai={k.status_sejak} />}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section aria-label="Kinerja per SPPG dan kecamatan">
        <TabelAkuntabilitas sppg={barisSppg} kecamatan={barisKecamatan} />
      </section>
    </div>
  );
}
