import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { HeartPulse, Layers } from "lucide-react";
import { Meter } from "@/components/data-terbuka/remah";
import { GrafikBatang, GrafikTumpuk } from "@/components/grafik/grafik";
import { KartuGrafik, Legenda } from "@/components/grafik/kartu-grafik";
import { SERI_KATEGORI, pivotKategori } from "@/components/grafik/seri-kategori";
import { PenyegarRealtime } from "@/components/lacak/penyegar-realtime";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilKasusProvinsi, ambilKasusSemarang, labelBulan } from "@/lib/data/data-terbuka";
import { angka } from "@/lib/format";

export const metadata: Metadata = {
  title: "Kasus keamanan pangan",
  description: "Kasus dugaan keracunan dan masalah keamanan pangan MBG per wilayah dan waktu, dengan label sumber.",
};

async function KasusProvinsi() {
  const { bulanan, wilayah } = await ambilKasusProvinsi();
  const puncak = bulanan.reduce((m, b) => (b.kasus > m.kasus ? b : m), bulanan[0]);
  const total = bulanan.reduce((s, b) => s + b.kasus, 0);
  const maks = wilayah[0]?.kasus ?? 1;
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <KartuGrafik
        judul="Dugaan keracunan · Jawa Tengah"
        sumber="simulasi"
        ringkasan={`${angka(total)} kasus sepanjang tahun; puncak ${labelBulan(puncak.bulan, true)} (${puncak.kasus} kasus).`}
        tabel={{ kolom: ["Bulan", "Kasus", "Korban"], baris: bulanan.map((b) => [labelBulan(b.bulan), b.kasus, b.korban]) }}
      >
        <GrafikBatang data={bulanan.map((b) => ({ label: labelBulan(b.bulan), nilai: b.kasus }))} labelNilai="Kasus" format="angka"
          tinggi={260} sorot={labelBulan(puncak.bulan)} />
      </KartuGrafik>

      <KartuGrafik
        judul="Terbanyak per kab/kota"
        sumber="simulasi"
        tabel={{ kolom: ["Kab/kota", "Kasus", "Korban"], baris: wilayah.map((w) => [w.nama, w.kasus, w.korban]) }}
      >
        <ol className="space-y-2.5">
          {wilayah.slice(0, 8).map((w) => (
            <li key={w.id}>
              <Link href={`/data/wilayah/${w.id}`} className="group grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 text-sm">
                <span className="truncate group-hover:text-primary group-hover:underline">{w.nama.replace("Kabupaten ", "Kab. ")}</span>
                <span className="angka font-semibold">{w.kasus}</span>
                <Meter nilai={(100 * w.kasus) / maks} className="col-span-2" />
              </Link>
            </li>
          ))}
        </ol>
      </KartuGrafik>
    </div>
  );
}

async function KasusSemarang() {
  const { baris, kecamatan } = await ambilKasusSemarang();
  const pivot = pivotKategori(baris, (b) => labelBulan(b));
  const seriAda = SERI_KATEGORI.filter((s) => baris.some((b) => b.kategori === s.kunci));
  const total = baris.reduce((s, b) => s + b.jumlah_kasus, 0);
  const terbanyak = seriAda
    .map((s) => ({ s, n: baris.filter((b) => b.kategori === s.kunci).reduce((t, b) => t + b.jumlah_kasus, 0) }))
    .sort((a, b) => b.n - a.n)[0];

  const perKec = kecamatan.map((k) => {
    const milik = baris.filter((b) => b.wilayah_id === k.id);
    return {
      ...k,
      total: milik.reduce((t, b) => t + b.jumlah_kasus, 0),
      keracunan: milik.filter((b) => b.kategori === "keracunan").reduce((t, b) => t + b.jumlah_kasus, 0),
    };
  }).sort((a, b) => b.total - a.total);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <KartuGrafik
        judul="Kasus terverifikasi · Kota Semarang"
        sumber="laporan_warga_terverifikasi"
        ringkasan={terbanyak ? `${angka(total)} kasus; paling sering ${terbanyak.s.label.toLowerCase()} (${terbanyak.n}).` : undefined}
        tabel={{ kolom: ["Bulan", ...seriAda.map((s) => s.label)], baris: pivot.map((r) => [String(r.label), ...seriAda.map((s) => Number(r[s.kunci] ?? 0))]) }}
      >
        <Legenda butir={seriAda.map((s) => ({ label: s.label, warna: s.warna }))} />
        <GrafikTumpuk data={pivot} seri={seriAda} />
      </KartuGrafik>

      <KartuGrafik
        judul="Per kecamatan"
        sumber="laporan_warga_terverifikasi"
        tabel={{ kolom: ["Kecamatan", "Semua kasus", "Keracunan"], baris: perKec.map((k) => [k.nama, k.total, k.keracunan]) }}
      >
        <ul className="divide-y text-sm">
          {perKec.slice(0, 10).map((k) => (
            <li key={k.id}>
              <Link href={`/data/wilayah/${k.id}`} className="flex items-center justify-between gap-3 py-2 hover:text-primary">
                <span className="truncate">{k.nama}</span>
                <span className="flex items-center gap-3">
                  {k.keracunan > 0 && (
                    <span className="angka inline-flex items-center gap-1 text-xs text-muted-foreground" title="Kasus keracunan">
                      <HeartPulse className="size-3.5" aria-hidden /> {k.keracunan}
                    </span>
                  )}
                  <span className="angka w-8 text-right font-semibold">{k.total}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </KartuGrafik>
    </div>
  );
}

export default function HalamanKasus() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold">Kasus keamanan pangan</h1>
        <PenyegarRealtime kanal="data-kasus" langganan={[{ tabel: "kasus" }]} />
      </header>

      <Suspense fallback={<Skeleton className="h-80 rounded-3xl" />}>
        <KasusProvinsi />
      </Suspense>

      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Layers className="size-4" aria-hidden /> Rincian dari laporan warga yang lolos verifikasi
      </p>
      <Suspense fallback={<Skeleton className="h-80 rounded-3xl" />}>
        <KasusSemarang />
      </Suspense>
    </div>
  );
}
