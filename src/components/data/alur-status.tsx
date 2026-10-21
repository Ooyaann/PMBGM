import { CircleCheck, Inbox, RotateCcw, Send, ShieldCheck, Timer, Wrench, XCircle, type LucideIcon } from "lucide-react";
import type { StatusAlur } from "@/lib/label";
import { cn } from "@/lib/utils";

type Tahap = "diterima" | "diverifikasi" | "diteruskan" | "ditindaklanjuti" | "selesai";

const TAHAP: { kunci: Tahap; label: string; ikon: LucideIcon }[] = [
  { kunci: "diterima", label: "Diterima", ikon: Inbox },
  { kunci: "diverifikasi", label: "Verifikasi", ikon: ShieldCheck },
  { kunci: "diteruskan", label: "Diteruskan", ikon: Send },
  { kunci: "ditindaklanjuti", label: "Ditangani", ikon: Wrench },
  { kunci: "selesai", label: "Selesai", ikon: CircleCheck },
];

/** Posisi status pada lima tahap utama. Cabang ditolak berhenti di verifikasi; dibuka ulang kembali ke "ditangani". */
function indeksTahap(s: StatusAlur): number {
  const peta: Record<StatusAlur, number> = {
    diterima: 0, diverifikasi: 1, ditolak: 1, diteruskan: 2, ditindaklanjuti: 3, dibuka_ulang: 3, selesai: 4,
  };
  return peta[s];
}

/**
 * Alur status laporan (PRD 8.1) sebagai deretan ikon. Tanpa `aktif`, tampil sebagai penjelasan alur.
 * `sla` menampilkan batas waktu tiap tahap, mis. { diterima: "6 jam" }.
 * `vertikal` untuk ruang sempit (panel samping): ikon, label, dan batas waktu dalam satu baris.
 */
export function AlurStatus({ aktif, sla, terlambat = false, vertikal = false, className }: {
  aktif?: StatusAlur;
  sla?: Partial<Record<Tahap, string>>;
  terlambat?: boolean;
  vertikal?: boolean;
  className?: string;
}) {
  const posisi = aktif ? indeksTahap(aktif) : -1;
  return (
    <ol className={cn(vertikal ? "flex flex-col" : "flex items-start", className)} aria-label={aktif ? "Posisi laporan dalam alur" : "Alur penanganan laporan"}>
      {TAHAP.map((t, i) => {
        let Ikon = t.ikon;
        let label = t.label;
        const ditolak = aktif === "ditolak" && i === 1;
        const dibukaUlang = aktif === "dibuka_ulang" && i === 3;
        if (ditolak) { Ikon = XCircle; label = "Ditolak"; }
        if (dibukaUlang) { Ikon = RotateCcw; label = "Dibuka ulang"; }

        const selesai = aktif ? i < posisi || (aktif === "selesai" && i === posisi) : false;
        const sekarang = aktif && i === posisi && aktif !== "selesai";
        const lewat = aktif === "ditolak" && i > 1;

        return (
          <li key={t.kunci} aria-current={sekarang ? "step" : undefined}
            className={cn("relative flex", vertikal ? "items-center gap-3 pb-4 last:pb-0" : "flex-1 flex-col items-center text-center")}>
            {i > 0 && (
              <span
                aria-hidden
                className={cn(
                  "absolute",
                  vertikal ? "-top-[34px] left-[17px] h-[52px] w-0.5" : "top-[18px] right-1/2 h-0.5 w-full -translate-y-1/2",
                  aktif && i <= posisi && !lewat ? "bg-primary" : "bg-border",
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 flex size-9 items-center justify-center rounded-full border-2 bg-card transition",
                !aktif && "border-primary/30 text-primary",
                selesai && "border-primary bg-primary text-primary-foreground",
                sekarang && "border-primary text-primary ring-4 ring-primary/15",
                sekarang && terlambat && "border-risiko-tinggi text-risiko-tinggi ring-risiko-tinggi/15",
                ditolak && "border-muted-foreground/40 bg-muted text-muted-foreground ring-0",
                aktif && !selesai && !sekarang && !ditolak && "border-border text-muted-foreground/60",
                lewat && "opacity-40",
              )}
            >
              <Ikon className="size-4" aria-hidden />
            </span>
            <span className={cn(
              vertikal ? "flex-1 text-sm" : "mt-1.5 text-[11px] leading-tight sm:text-xs",
              sekarang ? "font-semibold text-foreground" : vertikal ? "text-foreground" : "text-muted-foreground",
              lewat && "opacity-40",
            )}>
              {label}
            </span>
            {sla?.[t.kunci] && (
              <span className={cn("inline-flex shrink-0 items-center gap-0.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground", !vertikal && "mt-1")}>
                <Timer className="size-3" aria-label="Batas waktu" />
                {sla[t.kunci]}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
