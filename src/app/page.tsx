import Link from "next/link";
import {
  ArrowRight, BarChart3, Check, ClipboardList, Clock, ExternalLink, HeartPulse, Megaphone, Phone, Radar,
  School, Search, ShieldCheck, Star, ThumbsUp,
} from "lucide-react";
import { FormCekTiket } from "@/components/beranda/form-cek-tiket";
import { KartuLacak } from "@/components/beranda/kartu-lacak";
import { AlurStatus } from "@/components/data/alur-status";
import { BadgeRisiko } from "@/components/data/badge";
import { ChipAlasan } from "@/components/data/chip-alasan";
import { LabelSumber } from "@/components/data/label-sumber";
import { Bertip } from "@/components/ui/bertip";
import { buttonVariants } from "@/components/ui/button";
import {
  ambilKasusSorotan, ambilKecamatanResponsif, ambilPrioritasInspeksi, ambilStatistik,
} from "@/lib/data/publik";
import { angka, durasiJam, persen } from "@/lib/format";
import { FAKTA_NASIONAL } from "@/lib/konteks";
import { cn } from "@/lib/utils";

const MODUL = [
  { ikon: Megaphone, judul: "Lapor", teks: "Foto, kirim, dapat tiket", href: "/lapor" },
  { ikon: ClipboardList, judul: "Lacak", teks: "Pantau setiap tahap", href: "/lacak" },
  { ikon: BarChart3, judul: "Data", teks: "Angka program terbuka", href: "/data" },
  { ikon: Radar, judul: "Insight", teks: "Prioritas inspeksi", href: "/insight" },
];

export default async function Beranda() {
  const [statistik, prioritas, responsif, sorotan] = await Promise.all([
    ambilStatistik(),
    ambilPrioritasInspeksi(5),
    ambilKecamatanResponsif(),
    ambilKasusSorotan(),
  ]);

  const persenTerverifikasi = statistik?.laporan_masuk ? (100 * statistik.laporan_terverifikasi) / statistik.laporan_masuk : null;
  const persenSelesai = statistik?.kasus_total ? (100 * statistik.kasus_selesai) / statistik.kasus_total : null;

  return (
    <>
      {/* Darurat (LP-06): satu baris, satu tindakan */}
      <div className="border-b border-darurat/15 bg-darurat-lembut">
        <div className="kontainer flex h-11 items-center justify-between gap-3 text-sm text-darurat">
          <span className="flex items-center gap-2 font-semibold">
            <HeartPulse className="size-4" aria-hidden /> Darurat keracunan?
          </span>
          <span className="flex items-center gap-3">
            <Link href="/lapor/panduan#darurat" className="hidden font-medium underline-offset-2 hover:underline sm:inline">Pertolongan pertama</Link>
            <a href="tel:119" className="inline-flex h-8 items-center gap-1.5 rounded-full bg-darurat px-3 font-bold text-white hover:bg-darurat/90">
              <Phone className="size-3.5" aria-hidden /> 119
            </a>
          </span>
        </div>
      </div>

      {/* Hero */}
      <section className="kontainer grid items-center gap-12 py-12 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:py-20">
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
            <ShieldCheck className="size-3.5" aria-hidden /> Pengawasan MBG oleh warga
          </p>
          <h1 className="mt-5 text-4xl leading-[1.05] font-extrabold sm:text-5xl lg:text-[3.5rem]">
            Makanan anak kita,<br /><span className="text-primary">kita jaga bersama.</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">Lapor masalah, pantau tindak lanjut, cek dapur sekolah.</p>
          <div className="mt-8 grid gap-3 sm:flex">
            <Link href="/lapor" className={buttonVariants({ size: "xl" })}>
              <Megaphone aria-hidden /> Lapor
            </Link>
            <Link href="/cari-sekolah" className={cn(buttonVariants({ size: "xl", variant: "outline" }), "bg-card")}>
              <School aria-hidden /> Cek dapur sekolah
            </Link>
          </div>
          <FormCekTiket className="mt-4 max-w-md" />
        </div>
        {sorotan && <KartuLacak kasus={sorotan.kasus} timeline={sorotan.timeline} />}
      </section>

      {/* Konteks nasional */}
      <section aria-labelledby="judul-konteks" className="border-y bg-card">
        <div className="kontainer py-10">
          <h2 id="judul-konteks" className="sr-only">Skala program MBG</h2>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
            {FAKTA_NASIONAL.map((f) => (
              <li key={f.label}>
                <p className="angka text-3xl font-extrabold tracking-tight sm:text-4xl">{f.angka}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{f.label}</p>
                <p className="mt-2 flex items-center gap-1.5">
                  <LabelSumber jenis={f.jenis} />
                  <Bertip label={`${f.sumber.nama}, ${f.sumber.tanggal}`}
                    render={<a href={f.sumber.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground" />}>
                    <ExternalLink className="size-3.5" aria-hidden />
                  </Bertip>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Empat modul + alur transparan */}
      <section aria-labelledby="judul-modul" className="kontainer py-16">
        <h2 id="judul-modul" className="text-2xl font-bold sm:text-3xl">Satu laporan, empat lensa</h2>
        <ol className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {MODUL.map((m, i) => (
            <li key={m.judul} className="relative">
              <Link href={m.href}
                className="group flex h-full flex-col gap-4 rounded-2xl border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                <span className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                    <m.ikon className="size-6" aria-hidden />
                  </span>
                  <span className="angka text-xs font-semibold text-muted-foreground">0{i + 1}</span>
                </span>
                <span>
                  <span className="block text-lg font-bold">{m.judul}</span>
                  <span className="block text-sm text-muted-foreground">{m.teks}</span>
                </span>
              </Link>
              {i < MODUL.length - 1 && (
                <ArrowRight aria-hidden className="absolute top-1/2 -right-3 z-10 hidden size-5 -translate-y-1/2 rounded-full bg-background text-muted-foreground lg:block" />
              )}
            </li>
          ))}
        </ol>

        <div className="mt-6 rounded-3xl border bg-card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 font-semibold"><Clock className="size-4 text-primary" aria-hidden /> Setiap tahap tercatat dan berbatas waktu</h3>
            <span className="text-xs text-muted-foreground">Batas waktu untuk kasus keracunan</span>
          </div>
          <AlurStatus className="mt-5" sla={{ diterima: "6 jam", diverifikasi: "2 jam", diteruskan: "6 jam", ditindaklanjuti: "3 hari" }} />
        </div>
      </section>

      {/* Statistik platform */}
      {statistik && (
        <section aria-labelledby="judul-statistik" className="bg-primary text-primary-foreground">
          <div className="kontainer py-12">
            <div className="flex items-center justify-between gap-3">
              <h2 id="judul-statistik" className="text-xl font-bold sm:text-2xl">Kota Semarang</h2>
              <LabelSumber jenis="simulasi" className="bg-primary-foreground/15 text-primary-foreground" />
            </div>
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3 lg:grid-cols-5">
              {[
                { label: "Laporan", nilai: angka(statistik.laporan_masuk) },
                { label: "Terverifikasi", nilai: persen(persenTerverifikasi) },
                { label: "Kasus selesai", nilai: persen(persenSelesai) },
                { label: "Waktu tanggap", nilai: durasiJam(statistik.rata_jam_respons) },
                { label: "Kepuasan", nilai: statistik.kepuasan ? `${statistik.kepuasan.toLocaleString("id-ID")}/5` : "–" },
              ].map((s) => (
                <div key={s.label}>
                  <dt className="text-sm text-primary-foreground/75">{s.label}</dt>
                  <dd className="angka mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">{s.nilai}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* Prioritas inspeksi + contoh baik + cari sekolah */}
      <section aria-labelledby="judul-prioritas" className="kontainer grid gap-6 py-16 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border bg-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 id="judul-prioritas" className="flex items-center gap-2 text-xl font-bold">
              <Radar className="size-5 text-primary" aria-hidden /> Prioritas inspeksi
            </h2>
            <LabelSumber jenis="laporan_warga_terverifikasi" />
          </div>
          <ol className="mt-5 divide-y">
            {prioritas.map((s, i) => (
              <li key={s.sppgId} className="py-3.5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <span className="angka w-4 text-sm font-bold text-muted-foreground">{i + 1}</span>
                  <Link href={`/data/sppg/${s.sppgId}`} className="min-w-0 flex-1 truncate font-semibold hover:text-primary">
                    {s.nama.replace("SPPG Contoh ", "")}
                  </Link>
                  <BadgeRisiko skor={s.indeks} />
                </div>
                <ul className="mt-2 ml-7 flex flex-wrap gap-1.5">
                  {s.alasan.map((a) => <li key={a.jenis}><ChipAlasan alasan={a} /></li>)}
                </ul>
              </li>
            ))}
          </ol>
          <Link href="/insight" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            Peta risiko & rumus <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <div className="flex flex-col gap-6">
          {responsif && (
            <Link href="/lacak/akuntabilitas" className="group rounded-3xl border border-risiko-rendah/20 bg-risiko-rendah-lembut p-5 transition hover:shadow-lg sm:p-6">
              <p className="flex items-center gap-1.5 text-xs font-bold text-risiko-rendah"><ThumbsUp className="size-4" aria-hidden /> Paling responsif</p>
              <h3 className="mt-1 text-xl font-bold">{responsif.nama}</h3>
              <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  { ikon: Check, nilai: persen(responsif.persen_selesai), label: "selesai" },
                  { ikon: Clock, nilai: durasiJam(responsif.rata_jam_respons), label: "tanggap" },
                  { ikon: Star, nilai: responsif.kepuasan?.toLocaleString("id-ID") ?? "–", label: "kepuasan" },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-card/80 p-2">
                    <m.ikon className="mx-auto size-4 text-risiko-rendah" aria-hidden />
                    <dd className="angka mt-1 text-base font-bold">{m.nilai}</dd>
                    <dt className="text-[11px] text-muted-foreground">{m.label}</dt>
                  </div>
                ))}
              </dl>
            </Link>
          )}

          <form action="/cari-sekolah" method="get" role="search" className="rounded-3xl border bg-card p-5 sm:p-6">
            <label htmlFor="cari-sekolah-beranda" className="flex items-center gap-2 text-lg font-bold">
              <School className="size-5 text-primary" aria-hidden /> Dapur sekolah anak aman?
            </label>
            <div className="mt-4 flex h-12 items-center gap-2 rounded-2xl border border-input bg-background pr-1.5 pl-3.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/40">
              <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden />
              <input id="cari-sekolah-beranda" name="q" placeholder="Nama sekolah"
                className="h-full min-w-0 flex-1 bg-transparent text-base placeholder:text-muted-foreground/80 focus:outline-none" />
              <Bertip label="Cari" render={<button type="submit" className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90" />}>
                <ArrowRight className="size-5" aria-hidden />
              </Bertip>
            </div>
          </form>
        </div>
      </section>

      {/* Ajakan akhir */}
      <section className="kontainer py-16">
        <div className="flex flex-col items-start gap-6 rounded-3xl bg-foreground p-8 text-background sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <h2 className="text-2xl font-bold sm:text-3xl">Lihat masalah di MBG?</h2>
          <div className="flex w-full gap-3 sm:w-auto">
            <Link href="/lapor" className={cn(buttonVariants({ size: "xl" }), "flex-1 bg-background text-foreground hover:bg-background/90 sm:flex-none")}>
              <Megaphone aria-hidden /> Lapor
            </Link>
            <a href="tel:119" className={cn(buttonVariants({ size: "xl", variant: "outline" }), "border-background/30 bg-transparent text-background hover:bg-background/10 hover:text-background")}>
              <Phone aria-hidden /> 119
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
