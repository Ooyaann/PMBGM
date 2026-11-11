import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Building2, Calendar, FileText, MapPin, School, SearchX, ShieldCheck, Users, Utensils, XCircle } from "lucide-react";
import { FormCekTiket } from "@/components/beranda/form-cek-tiket";
import { AlurStatus } from "@/components/data/alur-status";
import { BadgeSla, BadgeStatus } from "@/components/data/badge";
import { IKON_KATEGORI } from "@/components/data/ikon-kategori";
import { LabelSumber } from "@/components/data/label-sumber";
import { Waktu } from "@/components/data/waktu";
import { GaleriBuktiAduan } from "@/components/lacak/galeri-bukti-aduan";
import { HitungMundur } from "@/components/lacak/hitung-mundur";
import { NavLacak } from "@/components/lacak/nav-lacak";
import { Timeline } from "@/components/lacak/timeline";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilKasusTerbaru, ambilStatusTiket } from "@/lib/data/lacak";
import { KATEGORI, type Kategori, type StatusAlur } from "@/lib/label";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Lacak laporan",
  description: "Cek status laporan MBG dengan kode tiket dan ikuti setiap tahap tindak lanjutnya secara terbuka.",
};

async function HasilTiket({ searchParams }: { searchParams: PageProps<"/lacak">["searchParams"] }) {
  const params = await searchParams;
  const { tiket, hari, status, kategori } = params;
  const kode = typeof tiket === "string" ? tiket.trim().toUpperCase() : "";
  if (!kode) return <KasusTerbaru hari={hari} status={status} kategori={kategori} />;

  const hasil = /^[A-Z]{3}-[A-Z0-9]{6}$/.test(kode) ? await ambilStatusTiket(kode) : null;
  if (!hasil) {
    return (
      <div className="flex flex-col items-center rounded-3xl border bg-card px-6 py-12 text-center">
        <SearchX className="size-10 text-muted-foreground" aria-hidden />
        <p className="mt-3 font-semibold">Tiket {kode} tidak ditemukan</p>
        <p className="mt-1 text-sm text-muted-foreground">Periksa kembali kode pada halaman setelah melapor.</p>
      </div>
    );
  }

  const Ikon = IKON_KATEGORI[hasil.kategori];
  const k = hasil.kasus;
  return (
    <article className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-6">
        <section className="rounded-3xl border bg-card p-5 sm:p-6" aria-labelledby="judul-tiket">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="judul-tiket" className="font-mono text-2xl font-bold tracking-wider text-primary">{hasil.kodeTiket}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <BadgeStatus status={hasil.status} />
              {k && <BadgeSla terlambat={k.terlambat} tidakDitanggapi={k.tidakDitanggapi} />}
            </div>
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
            <li className="flex items-center gap-1.5"><Ikon className="size-4" aria-hidden /> {KATEGORI[hasil.kategori].label}</li>
            <li className="flex items-center gap-1.5"><School className="size-4" aria-hidden /> {hasil.sekolah}</li>
            {hasil.kecamatan && <li className="flex items-center gap-1.5"><MapPin className="size-4" aria-hidden /> {hasil.kecamatan}</li>}
          </ul>

          <AlurStatus aktif={hasil.status} terlambat={k?.terlambat} className="mt-6" />

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {hasil.status === "diterima" && hasil.tenggatVerifikasi && (
              <HitungMundur tenggat={hasil.tenggatVerifikasi} mulai={hasil.dibuatPada} label="Batas verifikasi" />
            )}
            {k?.tenggatTahap && k.status !== "selesai" && (
              <HitungMundur tenggat={k.tenggatTahap} mulai={k.statusSejak} label="Batas tahap ini" />
            )}
            <span className="text-xs text-muted-foreground">Dilaporkan <Waktu iso={hasil.dibuatPada} /></span>
          </div>

          {hasil.status === "ditolak" && hasil.alasanTolak && (
            <p className="mt-5 flex gap-2 rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
              <XCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span><span className="font-semibold">Alasan Penolakan: </span>{hasil.alasanTolak}</span>
            </p>
          )}
        </section>

        {/* ========================================================= */}
        {/* RINCIAN ADUAN WARGA (TRANSPARANSI KELUHAN MUTU PANGAN)    */}
        {/* ========================================================= */}
        <section className="rounded-3xl border bg-card p-5 sm:p-6 space-y-4" aria-labelledby="judul-aduan">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="size-5" aria-hidden />
              </span>
              <div>
                <h3 id="judul-aduan" className="font-extrabold text-base sm:text-lg text-foreground">
                  Aduan yang Disampaikan Pelapor
                </h3>
                <p className="text-xs text-muted-foreground">
                  Transparansi substansi keluhan untuk pengawasan mutu pangan bersama.
                </p>
              </div>
            </div>

            {/* Status Perlindungan Privasi */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
              <ShieldCheck className="size-3.5" aria-hidden />
              {hasil.modeIdentitas === "anonim"
                ? "Pelapor Anonim"
                : hasil.modeIdentitas === "rahasia"
                ? "Identitas Dilindungi (UU PDP)"
                : "Pelapor Terverifikasi"}
            </span>
          </div>

          {/* Uraian Keluhan Makanan */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Uraian Masalah Makanan:
            </span>
            <p className="text-sm sm:text-base leading-relaxed font-medium text-foreground whitespace-pre-wrap">
              "{hasil.deskripsi}"
            </p>
          </div>

          {/* Grid Metadata Kejadian */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="rounded-2xl border bg-muted/20 p-3 space-y-0.5">
              <span className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground uppercase">
                <Calendar className="size-3 text-primary" /> Waktu Kejadian
              </span>
              <p className="text-xs font-semibold text-foreground truncate">
                <Waktu iso={hasil.waktuKejadian} />
              </p>
            </div>

            <div className="rounded-2xl border bg-muted/20 p-3 space-y-0.5">
              <span className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground uppercase">
                <Users className="size-3 text-primary" /> Terdampak
              </span>
              <p className="text-xs font-semibold text-foreground">
                {hasil.jumlahTerdampak ? `± ${hasil.jumlahTerdampak} Porsi` : "1 Porsi"}
              </p>
            </div>

            <div className="rounded-2xl border bg-muted/20 p-3 space-y-0.5">
              <span className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground uppercase">
                <School className="size-3 text-primary" /> Sekolah
              </span>
              <p className="text-xs font-semibold text-foreground truncate" title={hasil.sekolah}>
                {hasil.sekolah}
              </p>
            </div>

            <div className="rounded-2xl border bg-muted/20 p-3 space-y-0.5">
              <span className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground uppercase">
                <Utensils className="size-3 text-primary" /> Dapur SPPG
              </span>
              <p className="text-xs font-semibold text-foreground truncate" title={hasil.sppg || "Mitra Wilayah"}>
                {hasil.sppg || "SPPG Wilayah"}
              </p>
            </div>
          </div>

          {/* Galeri Foto Bukti Awal */}
          {hasil.fotoBukti && hasil.fotoBukti.length > 0 && (
            <div className="pt-2 border-t border-border/50">
              <GaleriBuktiAduan foto={hasil.fotoBukti} />
            </div>
          )}
        </section>

        <section className="rounded-3xl border bg-card p-5 sm:p-6" aria-labelledby="judul-riwayat">
          <div className="mb-4">
            <h2 id="judul-riwayat" className="font-extrabold text-base sm:text-lg text-foreground">
              Riwayat Tindak Lanjut & Investigasi Resmi
            </h2>
            <p className="text-xs text-muted-foreground">
              Kronologi langkah nyata penanganan oleh pihak sekolah, verifikator, SPPG, dan instansi.
            </p>
          </div>
          <Timeline peristiwa={hasil.timeline} />
        </section>
      </div>

      {k && (
        <aside>
          <Link href={`/lacak/kasus/${k.id}`}
            className="group block rounded-3xl border bg-card p-5 transition hover:border-primary/40 hover:shadow-lg lg:sticky lg:top-24">
            <p className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-mono">{k.kodeKasus}</span>
              <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
            </p>
            <p className="mt-1 font-semibold leading-snug">{k.judul}</p>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Users className="size-4" aria-hidden /> {k.jumlahLaporan} laporan digabung</li>
              {k.instansi && <li className="flex items-center gap-2"><Building2 className="size-4" aria-hidden /> {k.instansi}</li>}
            </ul>
            <p className="mt-4 text-sm font-semibold text-primary">Halaman kasus publik</p>
          </Link>
        </aside>
      )}
    </article>
  );
}

async function KasusTerbaru({
  hari,
  status,
  kategori,
}: {
  hari?: unknown;
  status?: unknown;
  kategori?: unknown;
}) {
  const rentangHari = hari === "7" ? 7 : hari === "30" ? 30 : null;
  const statusAktif = typeof status === "string" ? status : "semua";
  const katAktif = typeof kategori === "string" ? kategori : "semua";
  const hariAktif = typeof hari === "string" ? hari : "semua";

  const kasus = await ambilKasusTerbaru({
    batas: 12,
    rentangHari,
    status: statusAktif,
    kategori: katAktif,
  });

  return (
    <section aria-labelledby="judul-terbaru" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="judul-terbaru" className="text-xl font-bold">Kasus Terbaru di Wilayah</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Laporan terverifikasi yang sedang atau telah ditangani secara terbuka.
          </p>
        </div>
        <LabelSumber jenis="laporan_warga_terverifikasi" />
      </div>

      {/* BILAH FILTER TANGGAL & STATUS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border bg-card/60 p-3">
        {/* Filter Rentang Tanggal */}
        <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-0.5">
          <span className="font-semibold text-muted-foreground mr-1 shrink-0">Waktu:</span>
          {[
            { id: "semua", label: "Semua" },
            { id: "7", label: "7 Hari" },
            { id: "30", label: "30 Hari" },
          ].map((w) => {
            const isAktif = hariAktif === w.id;
            const href = `/lacak?hari=${w.id}&status=${statusAktif}&kategori=${katAktif}`;
            return (
              <Link
                key={w.id}
                href={href}
                className={cn(
                  "rounded-lg px-2.5 py-1 font-medium transition-colors shrink-0 whitespace-nowrap",
                  isAktif
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {w.label}
              </Link>
            );
          })}
        </div>

        {/* Filter Status Penanganan */}
        <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-0.5">
          <span className="font-semibold text-muted-foreground mr-1 shrink-0">Status:</span>
          {[
            { id: "semua", label: "Semua" },
            { id: "diproses", label: "Diproses" },
            { id: "selesai", label: "Selesai" },
          ].map((s) => {
            const isAktif = statusAktif === s.id;
            const href = `/lacak?hari=${hariAktif}&status=${s.id}&kategori=${katAktif}`;
            return (
              <Link
                key={s.id}
                href={href}
                className={cn(
                  "rounded-lg px-2.5 py-1 font-medium transition-colors shrink-0 whitespace-nowrap",
                  isAktif
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {s.label}
              </Link>
            );
          })}
        </div>
      </div>

      {kasus.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {kasus.map((k) => {
            const Ikon = IKON_KATEGORI[k.kategori as Kategori];
            return (
              <li key={k.id}>
                <Link
                  href={`/lacak/kasus/${k.id}`}
                  className="flex h-full gap-3.5 rounded-2xl border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Ikon className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="line-clamp-1 font-bold text-foreground text-sm sm:text-base">{k.judul}</span>
                    <span className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="size-3.5 shrink-0" aria-hidden />
                      <span className="font-medium text-foreground/80">{k.kecamatan_nama}</span> · <Waktu iso={k.diverifikasi_pada!} />
                    </span>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      <BadgeStatus status={k.status as StatusAlur} />
                      <BadgeSla terlambat={Boolean(k.terlambat)} tidakDitanggapi={Boolean(k.tidak_ditanggapi)} />
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="rounded-3xl border bg-card p-10 text-center text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Tidak ada kasus yang sesuai dengan filter.</p>
          <p className="mt-1 text-xs">Coba ubah filter waktu atau status penanganan di atas.</p>
          <Link
            href="/lacak"
            className="mt-3 inline-block font-semibold text-primary hover:underline text-xs"
          >
            Reset Semua Filter
          </Link>
        </div>
      )}
    </section>
  );
}

async function FormTiket({ searchParams }: { searchParams: PageProps<"/lacak">["searchParams"] }) {
  const { tiket } = await searchParams;
  return <FormCekTiket nilai={typeof tiket === "string" ? tiket : undefined} className="w-full max-w-md" />;
}

export default function HalamanLacak(props: PageProps<"/lacak">) {
  return (
    <div className="kontainer space-y-8 py-8 sm:py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-extrabold">Lacak</h1>
        <NavLacak />
      </header>
      <Suspense fallback={<FormCekTiket className="w-full max-w-md" />}>
        <FormTiket searchParams={props.searchParams} />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-3xl" />}>
        <HasilTiket searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
