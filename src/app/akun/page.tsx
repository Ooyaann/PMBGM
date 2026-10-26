import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, BadgeCheck, Building2, LayoutDashboard, Megaphone, School } from "lucide-react";
import { DaftarNotifikasi, AksiSelesai, FormProfil } from "@/components/akun/aksi-akun";
import { BadgeStatus } from "@/components/data/badge";
import { IKON_KATEGORI } from "@/components/data/ikon-kategori";
import { Waktu } from "@/components/data/waktu";
import { PenyegarRealtime } from "@/components/lacak/penyegar-realtime";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilLaporanSaya, ambilNotifikasi, ambilProfil } from "@/lib/data/akun";
import { KATEGORI } from "@/lib/label";
import { ambilPengguna, LABEL_PERAN } from "@/lib/sesi";
import { buatKlienServer } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Laporan saya", robots: { index: false, follow: false } };

async function Isi() {
  const p = await ambilPengguna();
  if (!p) redirect("/masuk?lanjut=/akun");
  const [laporan, notif, profil] = await Promise.all([ambilLaporanSaya(p.id), ambilNotifikasi(p.id), ambilProfil(p.id)]);
  const aktif = laporan.filter((l) => !["selesai", "ditolak"].includes(l.status)).length;

  let infoSekolah: { nama: string; npsn: string | null; sppgNama: string | null; sppgId: string | null } | null = null;
  if (p.sekolahId) {
    const supabase = await buatKlienServer();
    const { data: sek } = await supabase
      .from("sekolah")
      .select("nama, npsn, sppg:sppg_id (id, nama)")
      .eq("id", p.sekolahId)
      .maybeSingle();
    if (sek) {
      infoSekolah = {
        nama: sek.nama,
        npsn: sek.npsn,
        sppgNama: (sek.sppg as { nama: string } | null)?.nama ?? null,
        sppgId: (sek.sppg as { id: string } | null)?.id ?? null,
      };
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-extrabold">
            {p.nama}
            {p.terverifikasi && <BadgeCheck className="size-6 text-risiko-rendah" aria-label="Pelapor terverifikasi" />}
          </h1>
          <p className="text-sm text-muted-foreground">
            {LABEL_PERAN[p.peran]}{p.terverifikasi ? " terverifikasi" : ""} · {laporan.length} laporan · {aktif} berjalan
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PenyegarRealtime kanal={`akun-${p.id}`} langganan={[{ tabel: "notifikasi", event: "INSERT", filter: `pengguna_id=eq.${p.id}` }]} />
          {p.peran !== "pelapor" && (
            <Link href="/panel" className={buttonVariants({ variant: "outline", size: "lg" })}><LayoutDashboard aria-hidden /> Panel</Link>
          )}
          <FormProfil nama={profil?.nama_tampilan ?? p.nama} jenis={profil?.jenis_pelapor ?? null} />
        </div>
      </header>

      {infoSekolah && (
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <School className="size-6" />
              </span>
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary uppercase">
                  Sekolah yang Didampingi (Akun Guru)
                </span>
                <h3 className="font-extrabold text-lg">{infoSekolah.nama}</h3>
                {infoSekolah.sppgNama && (
                  <p className="text-xs text-muted-foreground">
                    Dapur Mitra MBG: <span className="font-semibold text-foreground">{infoSekolah.sppgNama}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {infoSekolah.sppgId && (
                <Link
                  href={`/data/sppg/${infoSekolah.sppgId}`}
                  className="rounded-xl border bg-card px-3 py-1.5 text-xs font-semibold hover:border-primary/40 transition"
                >
                  Rapor Dapur Mitra
                </Link>
              )}
              <Link
                href={`/lapor?sekolahId=${p.sekolahId}`}
                className="rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition"
              >
                Lapor untuk Sekolah
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section aria-labelledby="judul-laporan" className="space-y-3">
          <h2 id="judul-laporan" className="font-bold">Laporan saya</h2>
          {laporan.length ? (
            <ul className="space-y-3">
              {laporan.map((l) => {
                const Ikon = IKON_KATEGORI[l.kategori];
                const selesai = l.status === "selesai";
                return (
                  <li key={l.id} className={cn("rounded-3xl border bg-card p-4", selesai && !l.rating && "border-primary/40")}>
                    <div className="flex items-start gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary"><Ikon className="size-5" aria-hidden /></span>
                      <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="font-semibold">{KATEGORI[l.kategori].label}</span>
                          <BadgeStatus status={l.status} />
                        </p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                          <span className="font-mono">{l.kodeTiket}</span>
                          <span className="flex items-center gap-1"><School className="size-3.5" aria-hidden />{l.sekolah}</span>
                          {l.kasus?.instansi && <span className="flex items-center gap-1"><Building2 className="size-3.5" aria-hidden />{l.kasus.instansi}</span>}
                          <Waktu iso={l.dibuatPada} />
                        </p>
                      </div>
                      <Link href={`/lacak?tiket=${l.kodeTiket}`} aria-label={`Lihat perkembangan ${l.kodeTiket}`}
                        className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground">
                        <ArrowUpRight className="size-4" aria-hidden />
                      </Link>
                    </div>
                    {l.status === "ditolak" && l.alasanTolak && (
                      <p className="mt-3 rounded-2xl bg-muted/60 p-3 text-sm text-muted-foreground">{l.alasanTolak}</p>
                    )}
                    {selesai && (
                      <div className="mt-3"><AksiSelesai laporanId={l.id} rating={l.rating} bisaBukaUlang={l.bisaBukaUlang} /></div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-3xl border bg-card p-10 text-center">
              <Megaphone className="size-8 text-primary" aria-hidden />
              <p className="text-sm text-muted-foreground">Belum ada laporan</p>
              <Link href="/lapor" className={buttonVariants({ size: "xl" })}><Megaphone aria-hidden /> Lapor</Link>
            </div>
          )}
        </section>
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <DaftarNotifikasi daftar={notif.daftar} belumDibaca={notif.belumDibaca} />
        </aside>
      </div>
    </div>
  );
}

export default function HalamanAkun() {
  return (
    <div className="kontainer py-8 sm:py-10">
      <Suspense fallback={<div className="space-y-6"><Skeleton className="h-12 w-64" /><Skeleton className="h-96 rounded-3xl" /></div>}>
        <Isi />
      </Suspense>
    </div>
  );
}
