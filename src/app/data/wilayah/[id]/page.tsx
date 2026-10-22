import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowDownRight, ArrowUpRight, Banknote, FolderOpen, HeartPulse, Layers, Minus, ShoppingBasket, Users, Utensils, Wallet,
} from "lucide-react";
import { BadgeRisiko } from "@/components/data/badge";
import { LabelSumber } from "@/components/data/label-sumber";
import { Meter, Remah, Tile } from "@/components/data-terbuka/remah";
import { GrafikBatang, GrafikTargetRealisasi, GrafikTumpuk } from "@/components/grafik/grafik";
import { KartuGrafik, Legenda } from "@/components/grafik/kartu-grafik";
import { SERI_KATEGORI, pivotKategori } from "@/components/grafik/seri-kategori";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ANGGARAN_BAHAN_PORSI, ambilHargaPangan, ambilWilayah, labelBulan,
} from "@/lib/data/data-terbuka";
import { angka, persen, rupiah, rupiahRingkas } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Data wilayah" };

async function KartuHarga({ wilayahId }: { wilayahId: string }) {
  const harga = await ambilHargaPangan(wilayahId);
  if (!harga) return null;
  const rasio = (100 * harga.biayaPorsi) / ANGGARAN_BAHAN_PORSI;
  return (
    <KartuGrafik
      judul="Harga pangan"
      sumber="simulasi"
      ringkasan={`Bahan inti satu porsi ≈ ${rupiah(harga.biayaPorsi)}, ${persen(rasio)} dari asumsi anggaran bahan ${rupiah(ANGGARAN_BAHAN_PORSI)}.`}
      tabel={{
        kolom: ["Komoditas", "Harga", "Perubahan", "Takaran/porsi", "Biaya/porsi"],
        baris: harga.komoditas.map((k) => [k.komoditas, `${rupiah(k.harga)}/${k.satuan}`, persen(k.perubahan), k.takaran ?? "–", rupiah(k.biayaPorsi)]),
      }}
    >
      <ul className="divide-y">
        {harga.komoditas.map((k) => {
          const Arah = k.perubahan == null || Math.abs(k.perubahan) < 0.5 ? Minus : k.perubahan > 0 ? ArrowUpRight : ArrowDownRight;
          return (
            <li key={k.komoditas} className="flex items-center justify-between gap-3 py-2.5 text-sm">
              <span className="min-w-0">
                <span className="block truncate font-medium">{k.komoditas}</span>
                <span className="text-xs text-muted-foreground">{k.takaran} per porsi</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="angka font-semibold">{rupiah(k.harga)}<span className="font-normal text-muted-foreground">/{k.satuan}</span></span>
                <span className="angka inline-flex w-16 items-center justify-end gap-0.5 text-xs text-muted-foreground" title="Dibanding bulan lalu">
                  <Arah className="size-3.5" aria-hidden /> {persen(k.perubahan == null ? null : Math.abs(k.perubahan))}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 rounded-2xl bg-muted/60 p-3">
        <p className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><ShoppingBasket className="size-3.5" aria-hidden /> Bahan inti / porsi</span>
          <span className="angka font-semibold text-foreground">{rupiah(harga.biayaPorsi)} / {rupiah(ANGGARAN_BAHAN_PORSI)}</span>
        </p>
        <Meter nilai={rasio} className="mt-2 block" />
      </div>
    </KartuGrafik>
  );
}

async function IsiWilayah({ params }: { params: PageProps<"/data/wilayah/[id]">["params"] }) {
  const { id } = await params;
  if (id === "33") redirect("/data/wilayah");
  const data = await ambilWilayah(decodeURIComponent(id));
  if (!data) notFound();
  const { wilayah: w, induk, anggaran, kasusAgregat, kasusKategori, kecamatan, sppg } = data;
  const kecamatanMode = w.level === "kecamatan";

  const berjalan = anggaran.at(-1);
  const terakhirLengkap = anggaran.at(-2) ?? berjalan;
  const label = (b: { bulan: string }) => labelBulan(b.bulan) + (b === berjalan ? "*" : "");
  const totalPagu = anggaran.reduce((s, b) => s + b.pagu, 0);
  const totalRealisasi = anggaran.reduce((s, b) => s + b.realisasi, 0);

  const remah = [{ label: "Jawa Tengah", href: "/data/wilayah" }];
  if (induk && induk.level === "kabkota") remah.push({ label: induk.nama, href: `/data/wilayah/${induk.id}` });

  // Kecamatan: kasus terverifikasi per bulan per kategori.
  const kasusPivot = pivotKategori(kasusKategori, (b) => labelBulan(b));
  const seriAda = SERI_KATEGORI.filter((s) => kasusKategori.some((k) => k.kategori === s.kunci));
  const totalKasusKec = kasusKategori.reduce((s, k) => s + k.jumlah_kasus, 0);
  const totalKasusAgregat = kasusAgregat.reduce((s, k) => s + k.kasus, 0);
  const puncak = kasusAgregat.reduce((m, k) => (k.kasus > (m?.kasus ?? -1) ? k : m), kasusAgregat[0]);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <Remah butir={[...remah, { label: w.nama }]} />
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-extrabold">{w.nama}</h1>
          <LabelSumber jenis={kecamatanMode ? "laporan_warga_terverifikasi" : "simulasi"} />
        </div>
      </header>

      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kecamatanMode ? (
          <>
            <Tile ikon={Utensils} label="SPPG" nilai={angka(sppg.length)} />
            <Tile ikon={Users} label="Penerima" nilai={angka(sppg.reduce((s, x) => s + x.penerima, 0))} sub="sampel terpantau" />
            <Tile ikon={FolderOpen} label="Kasus" nilai={angka(totalKasusKec)} sub="terverifikasi" />
            <Tile ikon={HeartPulse} label="Keracunan" nilai={angka(kasusKategori.filter((k) => k.kategori === "keracunan").reduce((s, k) => s + k.jumlah_kasus, 0))} />
          </>
        ) : (
          <>
            <Tile ikon={Wallet} label="Pagu" nilai={rupiahRingkas(totalPagu)} />
            <Tile ikon={Banknote} label="Realisasi" nilai={rupiahRingkas(totalRealisasi)} sub={`${persen(totalPagu ? (100 * totalRealisasi) / totalPagu : null)} dari pagu`} />
            <Tile ikon={Users} label="Penerima" nilai={angka(terakhirLengkap?.penerima)} />
            <Tile ikon={Utensils} label="Dapur SPPG" nilai={angka(terakhirLengkap?.sppg)} />
          </>
        )}
      </dl>

      {!kecamatanMode && (
        <div className="grid gap-6 lg:grid-cols-2">
          <KartuGrafik
            judul="Realisasi vs pagu"
            sumber="simulasi"
            ringkasan={`${persen(totalPagu ? (100 * totalRealisasi) / totalPagu : null)} pagu terserap sejak ${anggaran[0] ? labelBulan(anggaran[0].bulan, true) : "awal tahun"}. * bulan berjalan.`}
            tabel={{ kolom: ["Bulan", "Pagu", "Realisasi", "Terserap"], baris: anggaran.map((b) => [label(b), rupiahRingkas(b.pagu), rupiahRingkas(b.realisasi), persen(b.persen)]) }}
          >
            <Legenda butir={[{ label: "Realisasi", warna: "var(--chart-1)" }, { label: "Pagu", warna: "var(--chart-jalur)" }]} />
            <GrafikTargetRealisasi data={anggaran.map((b) => ({ label: label(b), target: b.pagu, nilai: b.realisasi }))}
              labelTarget="Pagu" labelNilai="Realisasi" format="rupiah" tinggi={230} />
          </KartuGrafik>
          <KartuGrafik
            judul="Kasus keracunan per bulan"
            sumber="simulasi"
            ringkasan={totalKasusAgregat ? `${angka(totalKasusAgregat)} kasus sepanjang tahun, terbanyak ${labelBulan(puncak.bulan, true)} (${puncak.kasus}).` : "Belum ada kasus tercatat."}
            tabel={{ kolom: ["Bulan", "Kasus", "Korban"], baris: kasusAgregat.map((k) => [labelBulan(k.bulan), k.kasus, k.korban]) }}
          >
            <GrafikBatang data={kasusAgregat.map((k) => ({ label: labelBulan(k.bulan), nilai: k.kasus }))}
              labelNilai="Kasus" format="angka" tinggi={254} sorot={puncak ? labelBulan(puncak.bulan) : undefined} />
          </KartuGrafik>
        </div>
      )}

      {kecamatanMode && seriAda.length > 0 && (
        <KartuGrafik
          judul="Kasus per bulan"
          sumber="laporan_warga_terverifikasi"
          ringkasan={`${angka(totalKasusKec)} kasus terverifikasi; terbanyak ${seriAda
            .map((s) => ({ s, n: kasusKategori.filter((k) => k.kategori === s.kunci).reduce((t, k) => t + k.jumlah_kasus, 0) }))
            .sort((a, b) => b.n - a.n)[0].s.label.toLowerCase()}.`}
          tabel={{ kolom: ["Bulan", ...seriAda.map((s) => s.label)], baris: kasusPivot.map((r) => [String(r.label), ...seriAda.map((s) => Number(r[s.kunci] ?? 0))]) }}
        >
          <Legenda butir={seriAda.map((s) => ({ label: s.label, warna: s.warna }))} />
          <GrafikTumpuk data={kasusPivot} seri={seriAda} />
        </KartuGrafik>
      )}

      {kecamatan.length > 0 && (
        <section aria-labelledby="judul-kec" className="rounded-3xl border bg-card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="judul-kec" className="flex items-center gap-2 font-bold"><Layers className="size-4 text-primary" aria-hidden /> Kecamatan</h2>
            <LabelSumber jenis="laporan_warga_terverifikasi" />
          </div>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {kecamatan.map((k) => (
              <li key={k.id}>
                <Link href={`/data/wilayah/${k.id}`}
                  className="flex h-full flex-col gap-2 rounded-2xl border p-4 transition hover:border-primary/40 hover:bg-muted/30">
                  <span className="flex items-start justify-between gap-2">
                    <span className="font-semibold">{k.nama}</span>
                    {k.risikoTertinggi != null && <BadgeRisiko skor={k.risikoTertinggi} />}
                  </span>
                  <span className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Utensils className="size-3.5" aria-hidden />{k.sppg} SPPG</span>
                    <span className="flex items-center gap-1"><FolderOpen className="size-3.5" aria-hidden />{k.kasus} kasus</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {kecamatanMode && (
        <section aria-labelledby="judul-sppg" className="space-y-3">
          <h2 id="judul-sppg" className="font-bold">SPPG</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sppg.map((s) => (
              <li key={s.id}>
                <Link href={`/data/sppg/${s.id}`} className="flex h-full flex-col gap-2 rounded-2xl border bg-card p-4 transition hover:border-primary/40 hover:shadow-md">
                  <span className="flex items-start justify-between gap-2">
                    <span className="font-semibold">{s.nama.replace("SPPG Contoh ", "")}</span>
                    <BadgeRisiko skor={s.indeks} />
                  </span>
                  <span className="flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                    <span>{s.jumlahSekolah} sekolah</span><span>{angka(s.penerima)} penerima</span><span>{s.kasus} kasus</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!kecamatanMode && <Suspense fallback={<Skeleton className="h-72 rounded-3xl" />}><KartuHarga wilayahId={w.id} /></Suspense>}

      {!kecamatanMode && kecamatan.length === 0 && (
        <p className={cn("flex items-center gap-2 rounded-2xl bg-muted/60 p-4 text-sm text-muted-foreground")}>
          <Layers className="size-4" aria-hidden /> Rincian kecamatan dan SPPG tersedia untuk Kota Semarang.
          <Link href="/data/wilayah/33.74" className="font-semibold text-primary hover:underline">Lihat</Link>
        </p>
      )}
    </div>
  );
}

export default function HalamanDetailWilayah(props: PageProps<"/data/wilayah/[id]">) {
  return (
    <Suspense fallback={<Skeleton className="h-[36rem] rounded-3xl" />}>
      <IsiWilayah params={props.params} />
    </Suspense>
  );
}
