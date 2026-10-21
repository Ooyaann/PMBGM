import {
  Building2, CircleCheck, ClipboardCheck, GitMerge, Inbox, Lock, MessageSquare, RotateCcw, Send, ShieldCheck,
  TriangleAlert, Wrench, XCircle, type LucideIcon,
} from "lucide-react";
import { Waktu } from "@/components/data/waktu";
import type { FotoBukti, Peristiwa } from "@/lib/data/lacak";
import { STATUS, TINDAKAN, type StatusAlur } from "@/lib/label";
import { cn } from "@/lib/utils";

const IKON_STATUS: Record<StatusAlur, LucideIcon> = {
  diterima: Inbox,
  diverifikasi: ShieldCheck,
  diteruskan: Send,
  ditindaklanjuti: Wrench,
  selesai: CircleCheck,
  ditolak: XCircle,
  dibuka_ulang: RotateCcw,
};

function tampilan(p: Peristiwa): { ikon: LucideIcon; judul: string; nada: "biasa" | "baik" | "awas" | "redup" } {
  if (p.peristiwa === "eskalasi") return { ikon: TriangleAlert, judul: "Melewati batas waktu", nada: "awas" };
  if (p.peristiwa === "penggabungan") return { ikon: GitMerge, judul: "Laporan serupa digabung", nada: "biasa" };
  if (p.peristiwa === "tindak_lanjut") return { ikon: ClipboardCheck, judul: p.jenisTindakan ? TINDAKAN[p.jenisTindakan] : "Tindak lanjut", nada: "biasa" };
  if (p.peristiwa === "catatan" || !p.ke) return { ikon: MessageSquare, judul: "Catatan", nada: "biasa" };
  return {
    ikon: IKON_STATUS[p.ke],
    judul: STATUS[p.ke].label,
    nada: p.ke === "selesai" ? "baik" : p.ke === "ditolak" ? "redup" : "biasa",
  };
}

function Galeri({ foto }: { foto: FotoBukti[] }) {
  if (!foto.length) return null;
  return (
    <ul className="mt-2 flex flex-wrap gap-2">
      {foto.map((f, i) => (
        <li key={`${f.url}-${i}`}>
          <a href={f.url} target="_blank" rel="noopener noreferrer"
            className="block overflow-hidden rounded-lg ring-1 ring-border transition hover:ring-primary"
            aria-label={f.ilustrasi ? "Ilustrasi bukti (data simulasi)" : "Buka foto bukti"}>
            {/* eslint-disable-next-line @next/next/no-img-element -- URL storage bertanda tangan/ilustrasi lokal */}
            <img src={f.url} alt="" loading="lazy" className="size-16 object-cover" />
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Timeline publik (LC-02, LC-07). Terbaru di atas; riwayat hanya bisa ditambah (LC-03). */
export function Timeline({ peristiwa }: { peristiwa: Peristiwa[] }) {
  const urut = [...peristiwa].reverse();
  return (
    <ol className="relative space-y-0" aria-label="Riwayat penanganan">
      {urut.map((p, i) => {
        const { ikon: Ikon, judul, nada } = tampilan(p);
        const terakhir = i === urut.length - 1;
        const terbaru = i === 0;
        return (
          <li key={`${p.waktu}-${i}`} className="relative flex gap-3 pb-6 last:pb-0">
            {!terakhir && <span aria-hidden className="absolute top-9 left-[17px] h-[calc(100%-2.25rem)] w-0.5 bg-border" />}
            <span className={cn(
              "relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full",
              nada === "awas" && "bg-risiko-tinggi-lembut text-risiko-tinggi",
              nada === "baik" && "bg-risiko-rendah-lembut text-risiko-rendah",
              nada === "redup" && "bg-muted text-muted-foreground",
              nada === "biasa" && (terbaru ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"),
              terbaru && "ring-4 ring-primary/15",
            )}>
              <Ikon className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className={cn("font-semibold", nada === "awas" && "text-risiko-tinggi")}>{judul}</p>
                <Waktu iso={p.waktu} className="text-xs text-muted-foreground" />
              </div>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                {p.pelaku === "Pelapor" ? <Lock className="size-3" aria-hidden /> : <Building2 className="size-3" aria-hidden />}
                {p.pelaku}
              </p>
              {p.catatan && <p className="mt-1.5 text-sm leading-relaxed">{p.catatan}</p>}
              <Galeri foto={p.bukti} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export { Galeri as GaleriBukti };
