import type { Metadata } from "next";
import { Suspense } from "react";
import { Info } from "lucide-react";
import { IKON_KATEGORI } from "@/components/data/ikon-kategori";
import { SelSla } from "@/components/panel/sel-sla";
import { Skeleton } from "@/components/ui/skeleton";
import { KATEGORI, STATUS, type Kategori } from "@/lib/label";
import { wajibPeran } from "@/lib/sesi";
import { buatKlienServer } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Batas waktu" };

const URUT_KATEGORI = Object.keys(KATEGORI) as Kategori[];
const TAHAP = ["diterima", "diverifikasi", "diteruskan", "ditindaklanjuti", "dibuka_ulang"] as const;
const LABEL_TAHAP: Record<(typeof TAHAP)[number], string> = {
  diterima: "Verifikasi",
  diverifikasi: "Diteruskan",
  diteruskan: "Ditanggapi",
  ditindaklanjuti: "Selesai",
  dibuka_ulang: "Buka ulang",
};

async function Tabel() {
  await wajibPeran("admin");
  const supabase = await buatKlienServer();
  const { data } = await supabase.from("aturan_sla").select("kategori, tahap, batas_jam");
  const nilai = new Map((data ?? []).map((r) => [`${r.kategori}:${r.tahap}`, r.batas_jam]));

  return (
    <div className="overflow-x-auto rounded-3xl border bg-card">
      <table className="w-full min-w-[40rem] text-sm">
        <thead className="bg-muted/60 text-xs text-muted-foreground">
          <tr>
            <th scope="col" className="p-3 text-left font-medium">Kategori</th>
            {TAHAP.map((t) => (
              <th key={t} scope="col" className="p-3 text-right font-medium" title={`Lama maksimum tahap ${STATUS[t].label}`}>
                {LABEL_TAHAP[t]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {URUT_KATEGORI.map((k) => {
            const Ikon = IKON_KATEGORI[k];
            return (
              <tr key={k}>
                <th scope="row" className="p-3 text-left font-medium">
                  <span className="flex items-center gap-2"><Ikon className="size-4 text-primary" aria-hidden /> {KATEGORI[k].label}</span>
                </th>
                {TAHAP.map((t) => (
                  <td key={t} className="p-2 text-right">
                    <SelSla kategori={k} tahap={t} awal={nilai.get(`${k}:${t}`) ?? null} label={`${KATEGORI[k].label}, ${LABEL_TAHAP[t]} (jam)`} />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function HalamanSla() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-extrabold">Batas waktu</h1>
      <p className="flex items-start gap-2 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        Dalam jam. Berlaku untuk tahap yang dimulai setelah diubah; lewat batas otomatis ditandai dan dinaikkan prioritasnya.
      </p>
      <Suspense fallback={<Skeleton className="h-96 rounded-3xl" />}>
        <Tabel />
      </Suspense>
    </div>
  );
}
