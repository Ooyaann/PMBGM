import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight, CircleCheck, Clock, FolderOpen, HelpCircle, School, ShieldCheck, ShieldOff, Star, TriangleAlert, Users, Utensils,
} from "lucide-react";
import { BadgeRisiko, BadgeSla, BadgeStatus } from "@/components/data/badge";
import { IKON_KATEGORI } from "@/components/data/ikon-kategori";
import { LabelSumber } from "@/components/data/label-sumber";
import { Waktu } from "@/components/data/waktu";
import { Remah, Tile } from "@/components/data-terbuka/remah";
import { BilahKomponen, GrafikGaris } from "@/components/grafik/grafik";
import { KartuGrafik } from "@/components/grafik/kartu-grafik";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoMetrik } from "@/components/ui/info-metrik";
import { ambilProfilSppg } from "@/lib/data/data-terbuka";
import { komponenIndeks } from "@/lib/indeks";
import { angka, durasiJam, persen, tanggal } from "@/lib/format";
import { kategoriRisiko, RISIKO, type Kategori, type StatusAlur } from "@/lib/label";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Profil SPPG" };

const POLA_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const JENJANG: Record<string, string> = { paud: "TK", sd: "SD", smp: "SMP", sma: "SMA", smk: "SMK", slb: "SLB" };

async function IsiProfil({ params }: { params: PageProps<"/data/sppg/[id]">["params"] }) {
  const { id } = await params;
  if (!POLA_UUID.test(id)) notFound();
  const data = await ambilProfilSppg(id);
  if (!data) notFound();
  const { sppg: s, indeks: i, riwayat, akuntabilitas: a, sekolah, kasus } = data;

  const skor = i ? Number(i.indeks) : null;
  const penerima = sekolah.reduce((t, x) => t + x.jumlah_siswa, 0);
  const slhsBerlaku = s.status_slhs === "berlaku";
  const awal = riwayat[0]?.indeks;
  const arah = skor != null && awal != null ? skor - awal : null;

  const komponen = i ? komponenIndeks(i) : [];

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <Remah butir={[
          { label: "Jawa Tengah", href: "/data/wilayah" },
          { label: "Kota Semarang", href: "/data/wilayah/33.74" },
          { label: s.wilayah?.nama ?? "", href: `/data/wilayah/${s.wilayah?.id}` },
          { label: s.nama },
        ]} />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">{s.nama}</h1>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="font-mono">{s.kode}</span>·<span>{s.pengelola}</span>
            </p>
          </div>
          {skor != null && (
            <div className="flex flex-col items-start gap-1 sm:items-end shrink-0">
              <BadgeRisiko skor={skor} besar className="shrink-0" />
              {arah != null && Math.abs(arah) >= 1 && (
                <span className="text-xs text-muted-foreground whitespace-nowrap">{arah > 0 ? "▲" : "▼"} {Math.abs(arah).toFixed(0)} poin dalam 12 minggu</span>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {s.status_operasional !== "beroperasi" && (
            <InfoMetrik jenis="status_operasional" className="shrink-0">
              <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-risiko-tinggi-lembut px-2.5 text-xs font-semibold text-risiko-tinggi whitespace-nowrap cursor-help">
                {s.status_operasional === "ditutup_sementara" ? "Ditutup sementara" : s.status_operasional}
              </span>
            </InfoMetrik>
          )}
          <InfoMetrik jenis="slhs" className="shrink-0">
            <span className={cn(
              "inline-flex h-6 shrink-0 items-center gap-1 rounded-full px-2.5 text-xs font-semibold whitespace-nowrap cursor-help",
              slhsBerlaku
                ? "bg-risiko-rendah-lembut text-risiko-rendah"
                : "bg-risiko-sedang-lembut text-risiko-sedang"
            )}>
              {slhsBerlaku ? <ShieldCheck className="size-3.5 shrink-0" aria-hidden /> : <ShieldOff className="size-3.5 shrink-0" aria-hidden />}
              {slhsBerlaku ? `SLHS s.d. ${s.slhs_berlaku_sampai ? tanggal(s.slhs_berlaku_sampai) : "–"}` : s.status_slhs === "proses" ? "SLHS diproses" : s.status_slhs === "kedaluwarsa" ? "SLHS kedaluwarsa" : "Tanpa SLHS"}
            </span>
          </InfoMetrik>
          <LabelSumber jenis="simulasi" className="shrink-0" />
        </div>
      </header>

      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile ikon={Utensils} label="Porsi/hari" nilai={angka(s.kapasitas_porsi_harian)} infoKey="porsi" />
        <Tile ikon={School} label="Sekolah" nilai={angka(sekolah.length)} />
        <Tile ikon={Users} label="Penerima" nilai={angka(penerima)} infoKey="penerima" />
        <Tile
          ikon={FolderOpen}
          label="Kasus"
          nilai={angka(kasus.length)}
          sub={a?.persen_selesai != null ? <InfoMetrik jenis="selesai">{persen(Number(a.persen_selesai))} selesai</InfoMetrik> : undefined}
        />
      </dl>

      {i && skor != null && (
        <div className="grid gap-6 lg:grid-cols-2">
          <KartuGrafik
            judul={`Kenapa skornya ${skor.toLocaleString("id-ID", { maximumFractionDigits: 0 })}?`}
            sumber="laporan_warga_terverifikasi"
            ringkasan={`Risiko ${RISIKO[kategoriRisiko(skor)].label.toLowerCase()}; penyumbang terbesar: ${[...komponen].sort((x, y) => y.nilai - x.nilai)[0].label.toLowerCase()}.`}
            tabel={{ kolom: ["Komponen", "Sumbangan", "Bobot", "Nilai mentah"], baris: [
              ["Laporan (L)", komponen[0].nilai.toFixed(1), "35%", Number(i.l).toFixed(1)],
              ["Keracunan (K)", komponen[1].nilai.toFixed(1), "25%", Number(i.k).toFixed(1)],
              ["SLHS (S)", komponen[2].nilai.toFixed(1), "15%", Number(i.s).toFixed(0)],
              ["Keterlambatan (T)", komponen[3].nilai.toFixed(1), "15%", Number(i.t).toFixed(1)],
              ["Kepuasan (100−P)", komponen[4].nilai.toFixed(1), "10%", (100 - Number(i.p)).toFixed(1)],
            ] }}
            aksi={
              <Link href="/metodologi#indeks" className="inline-flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Rumus Indeks Risiko" title="Rumus Indeks Risiko">
                <HelpCircle className="size-4" aria-hidden />
              </Link>
            }
          >
            <BilahKomponen komponen={komponen} />
          </KartuGrafik>

          <KartuGrafik
            judul="Riwayat indeks"
            sumber="laporan_warga_terverifikasi"
            ringkasan={arah != null ? (Math.abs(arah) < 1 ? "Stabil dalam 12 minggu terakhir." : `${arah > 0 ? "Naik" : "Turun"} ${Math.abs(arah).toFixed(0)} poin dalam 12 minggu.`) : undefined}
            tabel={{ kolom: ["Pekan berakhir", "Indeks", "Kategori"], baris: riwayat.map((r) => [tanggal(r.tanggal), r.indeks.toFixed(1), RISIKO[kategoriRisiko(r.indeks)].label]) }}
          >
            <GrafikGaris
              data={riwayat.map((r) => ({ label: tanggal(r.tanggal, { day: "numeric", month: "short" }), nilai: r.indeks }))}
              labelNilai="Indeks" format="skor" domain={[0, 100]} tinggi={250}
              ambang={[{ nilai: 70, label: "Tinggi" }, { nilai: 40, label: "Sedang" }]}
            />
          </KartuGrafik>
        </div>
      )}

      {a && (
        <dl className="grid grid-cols-2 gap-3 rounded-3xl border bg-card p-4 sm:grid-cols-4" aria-label="Kinerja tindak lanjut">
          {[
            { jenis: "selesai" as const, ikon: CircleCheck, label: "Selesai", nilai: persen(a.persen_selesai == null ? null : Number(a.persen_selesai)) },
            { jenis: "tanggap" as const, ikon: Clock, label: "Tanggap", nilai: durasiJam(a.rata_jam_respons == null ? null : Number(a.rata_jam_respons)) },
            { jenis: "terlambat" as const, ikon: TriangleAlert, label: "Terlambat", nilai: persen(a.persen_terlambat == null ? null : Number(a.persen_terlambat)) },
            { jenis: "kepuasan" as const, ikon: Star, label: "Kepuasan", nilai: a.kepuasan != null ? `${Number(a.kepuasan).toLocaleString("id-ID")}/5` : "–" },
          ].map((m) => (
            <div key={m.label} className="flex items-center gap-3 rounded-2xl bg-muted/50 p-3">
              <m.ikon className="size-5 shrink-0 text-primary" aria-hidden />
              <div>
                <dt className="text-xs text-muted-foreground">
                  <InfoMetrik jenis={m.jenis}>
                    <span className="inline-flex items-center gap-1 underline decoration-dotted underline-offset-2 cursor-help">
                      {m.label}
                    </span>
                  </InfoMetrik>
                </dt>
                <dd className="angka font-bold">{m.nilai}</dd>
              </div>
            </div>
          ))}
        </dl>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <section aria-labelledby="judul-sekolah" className="rounded-3xl border bg-card p-5 sm:p-6">
          <h2 id="judul-sekolah" className="flex items-center gap-2 font-bold"><School className="size-4 text-primary" aria-hidden /> Sekolah dilayani</h2>
          <ul className="mt-3 divide-y text-sm">
            {sekolah.map((x) => (
              <li key={x.id} className="flex items-center justify-between gap-3 py-2.5">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="w-9 shrink-0 rounded-md bg-muted py-0.5 text-center text-[11px] font-semibold text-muted-foreground">{JENJANG[x.jenjang]}</span>
                  <span className="truncate">{x.nama}</span>
                </span>
                <span className="angka shrink-0 text-muted-foreground">{angka(x.jumlah_siswa)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="judul-kasus" className="rounded-3xl border bg-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <h2 id="judul-kasus" className="flex items-center gap-2 font-bold"><FolderOpen className="size-4 text-primary" aria-hidden /> Kasus terbaru</h2>
            <LabelSumber jenis="laporan_warga_terverifikasi" />
          </div>
          {kasus.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Belum ada kasus terverifikasi.</p>
          ) : (
            <ul className="mt-3 divide-y">
              {kasus.slice(0, 8).map((k) => {
                const Ikon = IKON_KATEGORI[k.kategori as Kategori];
                return (
                  <li key={k.id}>
                    <Link href={`/lacak/kasus/${k.id}`} className="flex items-center gap-3 rounded-lg py-2.5 hover:bg-muted/40">
                      <Ikon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{k.judul}</span>
                        <span className="text-xs text-muted-foreground"><Waktu iso={k.waktu_kejadian!} /></span>
                      </span>
                      <span className="flex shrink-0 flex-col items-end gap-1">
                        <BadgeStatus status={k.status as StatusAlur} />
                        <BadgeSla terlambat={Boolean(k.terlambat)} tidakDitanggapi={Boolean(k.tidak_ditanggapi)} />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          {kasus.length > 8 && (
            <p className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
              +{kasus.length - 8} kasus lain · <Link href="/lacak/akuntabilitas" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">Akuntabilitas <ArrowRight className="size-3.5" aria-hidden /></Link>
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

export default function HalamanProfilSppg(props: PageProps<"/data/sppg/[id]">) {
  return (
    <Suspense fallback={<Skeleton className="h-[40rem] rounded-3xl" />}>
      <IsiProfil params={props.params} />
    </Suspense>
  );
}
