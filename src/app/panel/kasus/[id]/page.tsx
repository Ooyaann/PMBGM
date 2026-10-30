import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, Building2, CalendarClock, CircleCheck, ExternalLink, FileText, Files, GitMerge, Globe, Inbox, Lock,
  MessageSquare, RotateCcw, Send, ShieldCheck, Star, TriangleAlert, Users, Utensils, Wrench, XCircle, type LucideIcon,
} from "lucide-react";
import { AlurStatus } from "@/components/data/alur-status";
import { BadgePrioritas, BadgeSla, BadgeStatus } from "@/components/data/badge";
import { IKON_KATEGORI } from "@/components/data/ikon-kategori";
import { HitungMundur } from "@/components/lacak/hitung-mundur";
import { PenyegarRealtime } from "@/components/lacak/penyegar-realtime";
import { AksiInstansi, AksiTeruskan } from "@/components/panel/aksi-kasus";
import { Kredibilitas } from "@/components/panel/baris";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilKasusPanel, urlTindakLanjut, type PeristiwaPanel } from "@/lib/data/panel";
import { angka, tanggalJam } from "@/lib/format";
import { KATEGORI, STATUS, TINDAKAN, type StatusAlur } from "@/lib/label";
import { wajibPeran } from "@/lib/sesi";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Kasus" };

const POLA_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const IKON_STATUS: Record<StatusAlur, LucideIcon> = {
  diterima: Inbox, diverifikasi: ShieldCheck, diteruskan: Send, ditindaklanjuti: Wrench,
  selesai: CircleCheck, ditolak: XCircle, dibuka_ulang: RotateCcw,
};

function judulPeristiwa(p: PeristiwaPanel) {
  if (p.peristiwa === "eskalasi") return { ikon: TriangleAlert, teks: "Melewati batas waktu", awas: true };
  if (p.peristiwa === "penggabungan") return { ikon: GitMerge, teks: "Laporan digabung", awas: false };
  if (p.peristiwa === "tindak_lanjut") return { ikon: Building2, teks: p.jenisTindakan ? TINDAKAN[p.jenisTindakan] : "Tindak lanjut", awas: false };
  if (!p.ke) return { ikon: MessageSquare, teks: "Catatan", awas: false };
  return { ikon: IKON_STATUS[p.ke], teks: STATUS[p.ke].label, awas: false };
}

async function Isi({ params }: { params: PageProps<"/panel/kasus/[id]">["params"] }) {
  const pengguna = await wajibPeran("verifikator", "instansi", "admin");
  const { id } = await params;
  if (!POLA_UUID.test(id)) notFound();
  const d = await ambilKasusPanel(id);
  if (!d) notFound();
  const { kasus: k, laporan, foto, peristiwa, instansi } = d;
  const staf = pengguna.peran !== "instansi";
  // Instansi menangani kasus yang diteruskan kepadanya; SPPG juga dapat memantau kasus di dapurnya.
  const instansiKasus = pengguna.peran === "admin" || (pengguna.peran === "instansi" && pengguna.instansiId === k.instansi_id);
  const sppgTerkait = pengguna.peran === "instansi" && instansi.some((i) => i.id === pengguna.instansiId);
  if (pengguna.peran === "instansi" && !instansiKasus && !sppgTerkait) notFound();
  const status = k.status as StatusAlur;
  const Ikon = IKON_KATEGORI[k.kategori!];
  // Laporan per kasus hanya tampil sekali per verifikasi: ringkas peristiwa level laporan.
  const urut = [...peristiwa].reverse().filter((p, i, a) =>
    !(p.laporanId && p.ke === "diverifikasi" && a.findIndex((x) => x.laporanId && x.ke === "diverifikasi") !== i));

  return (
    <div className="space-y-5">
      <header className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Link href="/panel/kasus" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" aria-hidden /> Kasus
          </Link>
          <PenyegarRealtime kanal={`panel-kasus-${id}`} langganan={[
            { tabel: "kasus", filter: `id=eq.${id}` }, { tabel: "status_log", event: "INSERT", filter: `kasus_id=eq.${id}` },
          ]} />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary"><Ikon className="size-6" aria-hidden /></span>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-extrabold text-balance">{k.judul}</h1>
            <p className="flex flex-wrap gap-x-3 text-sm text-muted-foreground">
              <span className="font-mono">{k.kode_kasus}</span><span>{KATEGORI[k.kategori!].label}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <BadgePrioritas prioritas={k.prioritas!} />
            <BadgeSla terlambat={Boolean(k.terlambat)} tidakDitanggapi={Boolean(k.tidak_ditanggapi)} />
            {k.tenggat_tahap && status !== "selesai" && <HitungMundur tenggat={k.tenggat_tahap} mulai={k.status_sejak} />}
          </div>
        </div>
        <AlurStatus aktif={status} terlambat={Boolean(k.terlambat)} />
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 space-y-5">
          <section aria-label="Ringkasan kasus" className="rounded-3xl border bg-card p-5">
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              {k.sppg_nama && (
                <div className="flex items-center gap-2"><Utensils className="size-4 text-muted-foreground" aria-hidden /><dt className="sr-only">SPPG</dt>
                  <dd><Link href={`/data/sppg/${k.sppg_id}`} className="font-semibold hover:underline">{k.sppg_nama}</Link></dd></div>
              )}
              <div className="flex items-center gap-2"><Building2 className="size-4 text-muted-foreground" aria-hidden /><dt className="sr-only">Instansi</dt>
                <dd>{k.instansi_nama ?? "Belum diteruskan"}</dd></div>
              <div className="flex items-center gap-2"><CalendarClock className="size-4 text-muted-foreground" aria-hidden /><dt className="sr-only">Kejadian</dt>
                <dd>{tanggalJam(k.waktu_kejadian!)} · {k.sekolah_nama}</dd></div>
              <div className="flex items-center gap-2"><Users className="size-4 text-muted-foreground" aria-hidden /><dt className="sr-only">Terdampak</dt>
                <dd>{angka(k.total_terdampak)} terdampak · {k.jumlah_laporan} laporan</dd></div>
              {k.rating_rata != null && (
                <div className="flex items-center gap-2"><Star className="size-4 fill-current text-risiko-sedang" aria-hidden /><dt className="sr-only">Penilaian</dt>
                  <dd>{Number(k.rating_rata).toLocaleString("id-ID", { maximumFractionDigits: 1 })}/5 dari {k.jumlah_rating} pelapor</dd></div>
              )}
            </dl>
            <Link href={`/lacak/kasus/${k.id}`} target="_blank" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              <Globe className="size-4" aria-hidden /> Halaman publik <ExternalLink className="size-3.5" aria-hidden />
            </Link>
          </section>

          <section aria-labelledby="judul-laporan" className="rounded-3xl border bg-card p-5">
            <h2 id="judul-laporan" className="mb-3 flex items-center gap-2 font-bold"><Files className="size-4 text-primary" aria-hidden /> Laporan ({laporan.length})</h2>
            <ul className="space-y-2">
              {laporan.map((l) => {
                const isi = (
                  <>
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs">{l.kode_tiket}</span>
                      {staf && <Kredibilitas skor={l.skor_kredibilitas} />}
                    </span>
                    <span className="line-clamp-2 text-sm text-muted-foreground">{l.deskripsi}</span>
                  </>
                );
                return (
                  <li key={l.id}>
                    {staf
                      ? <Link href={`/panel/verifikasi/${l.id}`} className="block rounded-2xl bg-muted/50 p-3 hover:bg-muted">{isi}</Link>
                      : <div className="rounded-2xl bg-muted/50 p-3">{isi}</div>}
                  </li>
                );
              })}
            </ul>
            {foto.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {foto.map((f) => (
                  <li key={f.id}>
                    <a href={f.url} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-lg ring-1 ring-border hover:ring-primary">
                      {/* eslint-disable-next-line @next/next/no-img-element -- URL bertanda tangan */}
                      <img src={f.url} alt="Bukti warga" className="size-16 object-cover" loading="lazy" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="judul-riwayat" className="rounded-3xl border bg-card p-5">
            <h2 id="judul-riwayat" className="mb-4 font-bold">Riwayat</h2>
            <ol className="space-y-4">
              {urut.map((p) => {
                const t = judulPeristiwa(p);
                return (
                  <li key={p.id} className="flex gap-3">
                    <span className={cn("mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
                      t.awas ? "bg-risiko-tinggi-lembut text-risiko-tinggi" : "bg-secondary text-primary")}>
                      <t.ikon className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-x-2 text-sm">
                        <span className="font-semibold">{t.teks}</span>
                        <span className="text-xs text-muted-foreground">{tanggalJam(p.waktu)} · {p.pelaku}</span>
                        {!p.publik && <span className="inline-flex items-center gap-0.5 text-[11px] text-muted-foreground"><Lock className="size-3" aria-hidden /> Internal</span>}
                      </p>
                      {p.catatan && <p className="mt-0.5 text-sm text-muted-foreground">{p.catatan}</p>}
                      {p.bukti.length > 0 && (
                        <ul className="mt-2 flex flex-wrap gap-2">
                          {p.bukti.map((b) => (
                            <li key={b}>
                              <a href={urlTindakLanjut(b)} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-lg ring-1 ring-border hover:ring-primary">
                                {b.endsWith(".pdf")
                                  ? <span className="flex size-14 flex-col items-center justify-center gap-0.5 bg-muted text-[10px]"><FileText className="size-4" aria-hidden />PDF</span>
                                  // eslint-disable-next-line @next/next/no-img-element -- bucket publik / ilustrasi lokal
                                  : <img src={urlTindakLanjut(b)} alt="Bukti tindak lanjut" className="size-14 object-cover" loading="lazy" />}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          {staf && (status === "diverifikasi" || status === "diteruskan") && (
            <AksiTeruskan kasusId={k.id!} sekarang={k.instansi_id} instansi={instansi} />
          )}
          {instansiKasus && ["diteruskan", "ditindaklanjuti", "dibuka_ulang"].includes(status) && (
            <AksiInstansi kasusId={k.id!} bisaSelesai={status === "ditindaklanjuti"} />
          )}
          {(status === "selesai" || (!staf && !instansiKasus)) && (
            <div className="rounded-3xl border bg-card p-5 text-sm">
              <BadgeStatus status={status} />
              <p className="mt-2 text-muted-foreground">{STATUS[status].penjelasan}</p>
            </div>
          )}
          {staf && !instansiKasus && ["ditindaklanjuti", "dibuka_ulang"].includes(status) && (
            <p className="rounded-3xl border bg-card p-5 text-sm text-muted-foreground">Menunggu instansi menyelesaikan tindak lanjut.</p>
          )}
        </aside>
      </div>
    </div>
  );
}

export default function HalamanKasusDetail({ params }: PageProps<"/panel/kasus/[id]">) {
  return (
    <Suspense fallback={<Skeleton className="h-[40rem] rounded-3xl" />}>
      <Isi params={params} />
    </Suspense>
  );
}
