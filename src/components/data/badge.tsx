import { AlertTriangle, CheckCircle2, Circle, CircleDot, Clock, HelpCircle, RotateCcw, Send, ShieldCheck, XCircle } from "lucide-react";
import { InfoMetrik } from "@/components/ui/info-metrik";
import { kategoriRisiko, PRIORITAS, RISIKO, STATUS, type StatusAlur, type TingkatPrioritas } from "@/lib/label";
import { cn } from "@/lib/utils";

const WARNA_RISIKO = {
  rendah: "bg-risiko-rendah-lembut text-risiko-rendah ring-risiko-rendah/25",
  sedang: "bg-risiko-sedang-lembut text-risiko-sedang ring-risiko-sedang/30",
  tinggi: "bg-risiko-tinggi-lembut text-risiko-tinggi ring-risiko-tinggi/25",
} as const;

/** Skor Indeks Risiko dengan warna, teks kategori, dan tooltip info saat kursor diarahkan (hover). */
export function BadgeRisiko({
  skor,
  besar = false,
  className,
  tampilkanBantuan = true,
}: {
  skor: number | null;
  besar?: boolean;
  className?: string;
  tampilkanBantuan?: boolean;
}) {
  const kategori = kategoriRisiko(skor);
  return (
    <InfoMetrik jenis="risiko" className="inline-flex shrink-0">
      <span
        className={cn(
          "angka inline-flex shrink-0 items-center gap-1.5 rounded-full font-semibold ring-1 ring-inset cursor-help transition-all hover:scale-105 whitespace-nowrap select-none",
          besar ? "h-8 px-3 text-sm" : "h-6 px-2.5 text-xs",
          WARNA_RISIKO[kategori],
          className,
        )}
      >
        <span className={cn("shrink-0 rounded-full bg-current", besar ? "size-2" : "size-1.5")} aria-hidden />
        <span className="tabular-nums font-bold leading-none">{skor == null ? "–" : skor.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</span>
        <span className="font-medium opacity-90 leading-none whitespace-nowrap">· {RISIKO[kategori].label}</span>
        {tampilkanBantuan && (
          <span
            className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-full bg-current/15 text-current ml-0.5"
            aria-hidden
          >
            <HelpCircle className="size-2.5" />
          </span>
        )}
      </span>
    </InfoMetrik>
  );
}

const STATUS_TAMPIL: Record<StatusAlur, { ikon: typeof Circle; kelas: string }> = {
  diterima: { ikon: Circle, kelas: "bg-muted text-muted-foreground" },
  diverifikasi: { ikon: ShieldCheck, kelas: "bg-info-lembut text-info" },
  diteruskan: { ikon: Send, kelas: "bg-info-lembut text-info" },
  ditindaklanjuti: { ikon: CircleDot, kelas: "bg-risiko-sedang-lembut text-risiko-sedang" },
  selesai: { ikon: CheckCircle2, kelas: "bg-risiko-rendah-lembut text-risiko-rendah" },
  ditolak: { ikon: XCircle, kelas: "bg-muted text-muted-foreground" },
  dibuka_ulang: { ikon: RotateCcw, kelas: "bg-risiko-sedang-lembut text-risiko-sedang" },
};

export function BadgeStatus({ status, className }: { status: StatusAlur; className?: string }) {
  const { ikon: Ikon, kelas } = STATUS_TAMPIL[status];
  return (
    <span className={cn("inline-flex h-6 shrink-0 items-center gap-1 rounded-full px-2 text-xs font-medium whitespace-nowrap", kelas, className)}>
      <Ikon className="size-3.5 shrink-0" aria-hidden />
      {STATUS[status].label}
    </span>
  );
}

/** Penanda SLA publik: "Tidak Ditanggapi" bila instansi melewati batas waktu (LC-06). */
export function BadgeSla({ terlambat, tidakDitanggapi }: { terlambat: boolean; tidakDitanggapi?: boolean }) {
  if (tidakDitanggapi) {
    return (
      <InfoMetrik jenis="terlambat" className="inline-flex shrink-0">
        <span className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full bg-risiko-tinggi-lembut px-2.5 text-xs font-semibold text-risiko-tinggi whitespace-nowrap cursor-help">
          <AlertTriangle className="size-3.5 shrink-0" aria-hidden />
          Tidak ditanggapi
        </span>
      </InfoMetrik>
    );
  }
  if (terlambat) {
    return (
      <InfoMetrik jenis="terlambat" className="inline-flex shrink-0">
        <span className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full bg-risiko-sedang-lembut px-2.5 text-xs font-semibold text-risiko-sedang whitespace-nowrap cursor-help">
          <Clock className="size-3.5 shrink-0" aria-hidden />
          Melewati batas waktu
        </span>
      </InfoMetrik>
    );
  }
  return null;
}

export function BadgePrioritas({ prioritas }: { prioritas: TingkatPrioritas }) {
  const kelas = {
    darurat: "bg-darurat text-white",
    tinggi: "bg-risiko-tinggi-lembut text-risiko-tinggi",
    sedang: "bg-risiko-sedang-lembut text-risiko-sedang",
    rendah: "bg-muted text-muted-foreground",
  }[prioritas];
  return (
    <InfoMetrik jenis="prioritas" className="inline-flex shrink-0">
      <span className={cn("inline-flex h-6 shrink-0 items-center rounded-full px-2.5 text-xs font-semibold whitespace-nowrap cursor-help", kelas)}>
        {PRIORITAS[prioritas]}
      </span>
    </InfoMetrik>
  );
}
