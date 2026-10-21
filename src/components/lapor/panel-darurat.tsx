import { ChevronDown, HeartPulse, Phone, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const PERTOLONGAN = [
  "Hentikan makan, simpan sisa makanan & ompreng",
  "Beri air putih sedikit-sedikit, jangan paksa muntah",
  "Ke puskesmas/IGD bila muntah terus, sesak, lemas, atau kejang",
  "Catat jumlah anak, gejala, dan jam makan",
];

/** Mode darurat kategori keracunan (LP-06). Bukan pengganti pertolongan medis. */
export function PanelDarurat({ ringkas = false, className }: { ringkas?: boolean; className?: string }) {
  return (
    <section aria-label="Panduan darurat keracunan" className={cn("rounded-2xl border border-darurat/25 bg-darurat-lembut p-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-bold text-darurat">
          <HeartPulse className="size-5" aria-hidden /> Utamakan keselamatan anak
        </p>
        <div className="flex gap-2">
          <a href="tel:119" className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-darurat px-4 font-bold text-white hover:bg-darurat/90">
            <Phone className="size-4" aria-hidden /> 119
          </a>
          <a href="tel:112" className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-darurat/30 bg-card px-4 font-semibold text-darurat hover:bg-darurat/5">
            <Phone className="size-4" aria-hidden /> 112
          </a>
        </div>
      </div>

      {!ringkas && (
        <details className="group mt-3 rounded-xl bg-card/70">
          <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold [&::-webkit-details-marker]:hidden">
            Pertolongan pertama
            <ChevronDown className="size-4 transition group-open:rotate-180" aria-hidden />
          </summary>
          <ol className="space-y-2 px-3 pb-3 text-sm">
            {PERTOLONGAN.map((l, i) => (
              <li key={l} className="flex gap-2.5">
                <span className="angka flex size-5 shrink-0 items-center justify-center rounded-full bg-darurat text-[11px] font-bold text-white">{i + 1}</span>
                {l}
              </li>
            ))}
          </ol>
        </details>
      )}

      <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-card px-2.5 py-1 text-xs font-semibold text-darurat">
        <Zap className="size-3.5" aria-hidden /> Prioritas tertinggi · verifikasi maks. 6 jam
      </p>
    </section>
  );
}
