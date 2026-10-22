import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, BadgeCheck, CalendarClock, Camera, CircleCheck, CircleX, ExternalLink, MapPin, School, Sparkles, Users,
  Utensils,
} from "lucide-react";
import { BadgePrioritas, BadgeRisiko, BadgeStatus } from "@/components/data/badge";
import { IKON_KATEGORI } from "@/components/data/ikon-kategori";
import { HitungMundur } from "@/components/lacak/hitung-mundur";
import { AksiVerifikasi } from "@/components/panel/aksi-verifikasi";
import { IKON_MODE, Kredibilitas } from "@/components/panel/baris";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilLaporanPanel, type FotoPanel } from "@/lib/data/panel";
import { angka, tanggalJam } from "@/lib/format";
import { KATEGORI, MODE_IDENTITAS, STATUS, type Kategori } from "@/lib/label";
import { wajibPeran } from "@/lib/sesi";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Periksa laporan" };

const POLA_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const JENIS_PELAPOR: Record<string, string> = {
  orang_tua: "Orang tua", siswa: "Siswa", guru: "Guru", warga: "Warga", sekolah: "Pihak sekolah",
  komite_sekolah: "Komite sekolah", kader_posyandu: "Kader posyandu",
};

/** Komponen skor kredibilitas (LP-08) dengan bobot maksimumnya. */
const BOBOT_KREDIBILITAS = [
  { kunci: "bukti", label: "Bukti", maks: 30 },
  { kunci: "metadata", label: "Metadata foto", maks: 25 },
  { kunci: "pelapor", label: "Status pelapor", maks: 25 },
  { kunci: "dukungan", label: "Dukungan warga", maks: 15 },
  { kunci: "kelengkapan", label: "Kelengkapan", maks: 5 },
] as const;

function Cek({ ok, label }: { ok: boolean | null; label: string }) {
  if (ok === null) return <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">– {label}</span>;
  return (
    <span className={cn("inline-flex items-center gap-1 text-[11px] font-semibold", ok ? "text-risiko-rendah" : "text-risiko-sedang")}>
      {ok ? <CircleCheck className="size-3.5" aria-hidden /> : <CircleX className="size-3.5" aria-hidden />} {label}
    </span>
  );
}

function KartuFoto({ f, waktuKejadian, sekolah }: {
  f: FotoPanel;
  waktuKejadian: string;
  sekolah: { lat: number | null; lng: number | null };
}) {
  // Aturan yang sama dengan segarkan_skor_laporan: waktu ≤ 48 jam, lokasi ≤ ±0,018° (~2 km).
  const waktuOk = f.exif?.waktu ? Math.abs(Date.parse(f.exif.waktu) - Date.parse(waktuKejadian)) <= 48 * 3_600_000 : null;
  const lokasiOk = f.exif?.lat != null && f.exif.lng != null && sekolah.lat != null && sekolah.lng != null
    ? Math.abs(f.exif.lat - sekolah.lat) <= 0.018 && Math.abs(f.exif.lng - sekolah.lng) <= 0.018
    : null;
  return (
    <li className="overflow-hidden rounded-2xl border bg-background">
      <a href={f.url} target="_blank" rel="noopener noreferrer" className="group relative block aspect-[4/3] bg-muted">
        {f.jenis === "video"
          ? <video src={f.url} className="size-full object-cover" muted />
          // eslint-disable-next-line @next/next/no-img-element -- URL storage bertanda tangan
          : <img src={f.url} alt="Bukti laporan" className="size-full object-cover" loading="lazy" />}
        <ExternalLink className="absolute top-2 right-2 size-4 text-white opacity-0 drop-shadow transition group-hover:opacity-100" aria-hidden />
        {f.ilustrasi && <span className="absolute bottom-2 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">Ilustrasi · simulasi</span>}
      </a>
      <div className="flex flex-wrap gap-x-3 gap-y-1 p-2">
        <Cek ok={waktuOk} label="Waktu" />
        <Cek ok={lokasiOk} label="Lokasi" />
        {f.exif?.perangkat && <span className="truncate text-[11px] text-muted-foreground">{f.exif.perangkat}</span>}
      </div>
    </li>
  );
}

async function Isi({ params }: { params: PageProps<"/panel/verifikasi/[id]">["params"] }) {
  await wajibPeran("verifikator", "admin");
  const { id } = await params;
  if (!POLA_UUID.test(id)) notFound();
  const d = await ambilLaporanPanel(id);
  if (!d) notFound();
  const { laporan: l, komponen, foto, identitas, serupa, kasusTerbuka, riwayat, indeksSppg } = d;
  const Ikon = IKON_KATEGORI[l.kategori];
  const Mode = IKON_MODE[l.mode_identitas];
  const ai = l.klasifikasi_otomatis as { kategori_saran?: Kategori; urgensi?: string; cocok?: string[]; metode?: string; alasan?: string } | null;
  const sekolah = l.sekolah!;

  return (
    <div className="space-y-5">
      <header className="space-y-3">
        <Link href="/panel/verifikasi" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden /> Antrean
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary"><Ikon className="size-6" aria-hidden /></span>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-extrabold">{KATEGORI[l.kategori].label}</h1>
            <p className="font-mono text-sm text-muted-foreground">{l.kode_tiket}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <BadgePrioritas prioritas={l.prioritas} />
            {l.status === "diterima" && l.tenggat_verifikasi && <HitungMundur tenggat={l.tenggat_verifikasi} mulai={l.dibuat_pada} />}
            {l.status !== "diterima" && <BadgeStatus status={l.status} />}
          </div>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 space-y-5">
          <section aria-label="Isi laporan" className="rounded-3xl border bg-card p-5">
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="flex items-start gap-2"><School className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                <div><dt className="sr-only">Sekolah</dt><dd className="font-semibold">{sekolah.nama}</dd>
                  <dd className="text-xs text-muted-foreground">{sekolah.jenjang.toUpperCase()} · {angka(sekolah.jumlah_siswa)} siswa · {l.wilayah?.nama}</dd></div></div>
              {l.sppg && (
                <div className="flex items-start gap-2"><Utensils className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <div><dt className="sr-only">SPPG</dt>
                    <dd><Link href={`/data/sppg/${l.sppg.id}`} className="font-semibold hover:underline">{l.sppg.nama.replace("SPPG Contoh ", "SPPG ")}</Link></dd>
                    {indeksSppg != null && <dd className="mt-1"><BadgeRisiko skor={indeksSppg} /></dd>}</div></div>
              )}
              <div className="flex items-center gap-2"><CalendarClock className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                <dt className="sr-only">Waktu kejadian</dt><dd>{tanggalJam(l.waktu_kejadian)}</dd></div>
              <div className="flex items-center gap-2"><Users className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                <dt className="sr-only">Terdampak</dt><dd>{angka(l.jumlah_terdampak)} terdampak</dd></div>
              {l.lokasi_lat != null && (
                <div className="flex items-center gap-2"><MapPin className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <dt className="sr-only">Lokasi pelapor</dt><dd className="angka text-xs">{l.lokasi_lat.toFixed(4)}, {l.lokasi_lng?.toFixed(4)}</dd></div>
              )}
            </dl>
            <p className="mt-4 rounded-2xl bg-muted/50 p-4 text-sm leading-relaxed whitespace-pre-line">{l.deskripsi}</p>
            {ai?.kategori_saran && (
              <p className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full bg-info-lembut px-2 py-1 font-semibold text-info">
                  <Sparkles className="size-3.5" aria-hidden /> Saran {ai.metode === "ai" ? "AI" : "otomatis"}
                </span>
                <span className={cn("font-semibold", ai.kategori_saran !== l.kategori && "text-risiko-sedang")}>
                  {KATEGORI[ai.kategori_saran].label}{ai.kategori_saran !== l.kategori ? " (berbeda dari pilihan pelapor)" : ""}
                </span>
                {ai.urgensi && ai.urgensi !== "normal" && <span className="text-muted-foreground">· urgensi {ai.urgensi}</span>}
                {ai.alasan && <span className="w-full text-muted-foreground">{ai.alasan}</span>}
              </p>
            )}
          </section>

          <section aria-labelledby="judul-bukti" className="rounded-3xl border bg-card p-5">
            <h2 id="judul-bukti" className="mb-3 flex items-center gap-2 font-bold"><Camera className="size-4 text-primary" aria-hidden /> Bukti</h2>
            {foto.length ? (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {foto.map((f) => <KartuFoto key={f.id} f={f} waktuKejadian={l.waktu_kejadian} sekolah={{ lat: sekolah.lat, lng: sekolah.lng }} />)}
              </ul>
            ) : <p className="text-sm text-muted-foreground">Tanpa bukti foto</p>}
          </section>

          <div className="grid gap-5 sm:grid-cols-2">
            <section aria-labelledby="judul-kred" className="rounded-3xl border bg-card p-5">
              <h2 id="judul-kred" className="mb-3 font-bold">Kredibilitas</h2>
              <div className="flex items-center gap-4">
                <Kredibilitas skor={l.skor_kredibilitas} besar />
                <ul className="flex-1 space-y-1.5">
                  {BOBOT_KREDIBILITAS.map((b) => {
                    const v = Number(komponen?.[b.kunci] ?? 0);
                    return (
                      <li key={b.kunci} className="grid grid-cols-[6.5rem_1fr_2.25rem] items-center gap-2 text-xs">
                        <span className="text-muted-foreground">{b.label}</span>
                        <span className="h-1.5 overflow-hidden rounded-full bg-[var(--chart-jalur)]">
                          <span className="block h-full rounded-full bg-primary" style={{ width: `${(100 * v) / b.maks}%` }} />
                        </span>
                        <span className="angka text-right font-semibold">{v}/{b.maks}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>

            <section aria-labelledby="judul-pelapor" className="rounded-3xl border bg-card p-5">
              <h2 id="judul-pelapor" className="mb-3 flex items-center gap-2 font-bold">
                <Mode className="size-4 text-primary" aria-hidden /> Pelapor · {MODE_IDENTITAS[l.mode_identitas].label}
              </h2>
              {identitas ? (
                <dl className="space-y-1.5 text-sm">
                  {identitas.nama && <div><dt className="sr-only">Nama</dt><dd className="font-semibold">{identitas.nama}</dd></div>}
                  {identitas.email && <div><dt className="sr-only">Email</dt><dd className="text-muted-foreground">{identitas.email}</dd></div>}
                  {!identitas.nama && <dd className="text-muted-foreground">Identitas disembunyikan (anonim)</dd>}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {identitas.terverifikasi && (
                      <span className="inline-flex h-6 items-center gap-1 rounded-full bg-risiko-rendah-lembut px-2 text-xs font-semibold text-risiko-rendah">
                        <BadgeCheck className="size-3.5" aria-hidden /> Terverifikasi
                      </span>
                    )}
                    {identitas.jenis_pelapor && (
                      <span className="inline-flex h-6 items-center rounded-full bg-muted px-2 text-xs">{JENIS_PELAPOR[identitas.jenis_pelapor] ?? identitas.jenis_pelapor}</span>
                    )}
                    {identitas.jumlah_laporan != null && (
                      <span className="inline-flex h-6 items-center rounded-full bg-muted px-2 text-xs">
                        {identitas.jumlah_laporan} laporan · {identitas.jumlah_ditolak} ditolak
                      </span>
                    )}
                  </div>
                </dl>
              ) : <p className="text-sm text-muted-foreground">Tidak tersedia</p>}
              <p className="mt-3 text-[11px] text-muted-foreground">Identitas tidak pernah dibagikan ke instansi atau publik.</p>
            </section>
          </div>

          {riwayat.length > 0 && (
            <section aria-labelledby="judul-riwayat" className="rounded-3xl border bg-card p-5">
              <h2 id="judul-riwayat" className="mb-3 font-bold">Riwayat</h2>
              <ol className="space-y-2 text-sm">
                {riwayat.map((r) => (
                  <li key={r.id} className="flex flex-wrap items-center gap-2">
                    {r.ke && <BadgeStatus status={r.ke} />}
                    <span className="text-muted-foreground">{tanggalJam(r.dibuat_pada)} · {r.pelaku_label ?? r.pelaku_peran}</span>
                    {r.catatan && <span className="w-full text-muted-foreground">{r.catatan}</span>}
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          {l.status === "diterima" ? (
            <AksiVerifikasi
              laporanId={l.id}
              judulAwal={`${KATEGORI[l.kategori].label} di ${sekolah.nama}`}
              serupa={serupa.map((s) => ({ id: s.id, kode: s.kode_tiket, ringkas: s.deskripsi.slice(0, 140) }))}
              kasusTerbuka={kasusTerbuka.map((k) => ({ id: k.id, kode: k.kode_kasus, judul: k.judul, jumlah: k.jumlah_laporan }))}
            />
          ) : (
            <div className="space-y-3 rounded-3xl border bg-card p-5 text-sm">
              <BadgeStatus status={l.status} />
              <p className="text-muted-foreground">{l.status === "ditolak" ? l.alasan_tolak : STATUS[l.status].penjelasan}</p>
              {l.kasus_id && (
                <Link href={`/panel/kasus/${l.kasus_id}`} className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
                  Buka kasus <ExternalLink className="size-3.5" aria-hidden />
                </Link>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default function HalamanPeriksa({ params }: PageProps<"/panel/verifikasi/[id]">) {
  return (
    <Suspense fallback={<Skeleton className="h-[40rem] rounded-3xl" />}>
      <Isi params={params} />
    </Suspense>
  );
}
