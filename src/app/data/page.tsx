import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Banknote, Users, Utensils, Wallet } from "lucide-react";
import { Meter, Tile } from "@/components/data-terbuka/remah";
import { GrafikGaris, GrafikTargetRealisasi } from "@/components/grafik/grafik";
import { KartuGrafik, Legenda } from "@/components/grafik/kartu-grafik";
import { LabelSumber } from "@/components/data/label-sumber";
import { InfoMetrik } from "@/components/ui/info-metrik";
import { ambilDashboardProvinsi, labelBulan } from "@/lib/data/data-terbuka";
import { angka, persen, rupiahRingkas } from "@/lib/format";

export const metadata: Metadata = {
  title: "Data Terbuka",
  description: "Anggaran, realisasi, penerima, dan dapur SPPG program Makan Bergizi Gratis di Jawa Tengah, disajikan terbuka.",
};

export default async function HalamanData() {
  const { bulanan, kabkota } = await ambilDashboardProvinsi();
  if (!bulanan.length) return null;

  // Bulan terakhir adalah bulan berjalan (data belum lengkap): ditandai * dan tidak ikut rata-rata.
  const lengkap = bulanan.slice(0, -1);
  const berjalan = bulanan.at(-1)!;
  const akhirLengkap = lengkap.at(-1) ?? berjalan;
  const label = (b: { bulan: string }) => labelBulan(b.bulan) + (b === berjalan ? "*" : "");

  const totalPagu = bulanan.reduce((s, b) => s + b.pagu, 0);
  const totalRealisasi = bulanan.reduce((s, b) => s + b.realisasi, 0);
  const rataPersen = lengkap.reduce((s, b) => s + (b.persen ?? 0), 0) / Math.max(lengkap.length, 1);
  const tertinggi = lengkap.reduce((m, b) => ((b.persen ?? 0) > (m.persen ?? 0) ? b : m), lengkap[0] ?? berjalan);
  const naikPenerima = bulanan[0].penerima ? (100 * (akhirLengkap.penerima - bulanan[0].penerima)) / bulanan[0].penerima : null;

  const kabkotaUrut = [...kabkota].sort((a, b) => b.penerima - a.penerima);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-extrabold">Data Terbuka</h1>
        <span className="text-sm text-muted-foreground">Tahun Anggaran 2026</span>
        <LabelSumber jenis="simulasi" />
      </header>

      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile ikon={Wallet} label="Pagu" nilai={rupiahRingkas(totalPagu)} sub={`${labelBulan(bulanan[0].bulan)}–${labelBulan(berjalan.bulan)}`} />
        <Tile ikon={Banknote} label="Realisasi" nilai={rupiahRingkas(totalRealisasi)} sub={`${persen((100 * totalRealisasi) / totalPagu)} dari pagu`} />
        <Tile ikon={Users} label="Penerima" nilai={angka(akhirLengkap.penerima)}
          sub={naikPenerima != null ? `${naikPenerima >= 0 ? "+" : ""}${persen(naikPenerima)} sejak ${labelBulan(bulanan[0].bulan)}` : undefined} />
        <Tile ikon={Utensils} label="Dapur SPPG" nilai={angka(akhirLengkap.sppg)} sub={labelBulan(akhirLengkap.bulan, true)} />
      </dl>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <KartuGrafik
          judul="Realisasi vs pagu per bulan"
          sumber="simulasi"
          ringkasan={`Rata-rata terserap ${persen(rataPersen)} per bulan, tertinggi ${labelBulan(tertinggi.bulan, true)} (${persen(tertinggi.persen)}). * bulan berjalan.`}
          tabel={{
            kolom: ["Bulan", "Pagu", "Realisasi", "Terserap"],
            baris: bulanan.map((b) => [label(b), rupiahRingkas(b.pagu), rupiahRingkas(b.realisasi), persen(b.persen)]),
          }}
        >
          <Legenda butir={[{ label: "Realisasi", warna: "var(--chart-1)" }, { label: "Pagu", warna: "var(--chart-jalur)" }]} />
          <GrafikTargetRealisasi
            data={bulanan.map((b) => ({ label: label(b), target: b.pagu, nilai: b.realisasi }))}
            labelTarget="Pagu" labelNilai="Realisasi" format="rupiah"
          />
        </KartuGrafik>

        <KartuGrafik
          judul="Penerima manfaat"
          sumber="simulasi"
          ringkasan={naikPenerima != null ? `Bertambah ${persen(naikPenerima)} sejak ${labelBulan(bulanan[0].bulan, true)}.` : undefined}
          tabel={{ kolom: ["Bulan", "Penerima", "SPPG"], baris: bulanan.map((b) => [label(b), angka(b.penerima), angka(b.sppg)]) }}
        >
          <GrafikGaris data={bulanan.map((b) => ({ label: label(b), nilai: b.penerima }))} labelNilai="Penerima" format="angka" tinggi={276} />
        </KartuGrafik>
      </div>

      <section className="rounded-3xl border bg-card p-5 sm:p-6" aria-labelledby="judul-kabkota">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="judul-kabkota" className="font-bold">Kabupaten/kota</h2>
          <Link href="/data/wilayah" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            Semua {kabkota.length} wilayah <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[34rem] text-sm">
            <caption className="sr-only">Sepuluh kab/kota dengan penerima terbanyak, bulan {labelBulan(berjalan.bulan, true)}</caption>
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b">
                <th scope="col" className="py-2 pr-3 text-left font-medium">Wilayah</th>
                <th scope="col" className="py-2 pr-3 text-left font-medium">Terserap</th>
                <th scope="col" className="py-2 pr-3 text-right font-medium">Penerima</th>
                <th scope="col" className="py-2 pr-3 text-right font-medium">SPPG</th>
                <th scope="col" className="py-2 text-right font-medium">
                  <span className="inline-flex items-center justify-end">
                    <InfoMetrik jenis="kasus_per_100rb" side="top">
                      <span>Kasus/100rb</span>
                    </InfoMetrik>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="angka divide-y">
              {kabkotaUrut.slice(0, 10).map((k) => (
                <tr key={k.id} className="hover:bg-muted/40">
                  <td className="py-2.5 pr-3">
                    <Link href={`/data/wilayah/${k.id}`} className="font-medium hover:text-primary hover:underline">{k.nama.replace("Kabupaten ", "Kab. ")}</Link>
                  </td>
                  <td className="py-2.5 pr-3">
                    <span className="flex items-center gap-2"><Meter nilai={k.persen} className="w-20" /> {persen(k.persen)}</span>
                  </td>
                  <td className="py-2.5 pr-3 text-right">{angka(k.penerima)}</td>
                  <td className="py-2.5 pr-3 text-right">{angka(k.sppg)}</td>
                  <td className="py-2.5 text-right">{k.kasusPer100rb?.toLocaleString("id-ID") ?? "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
