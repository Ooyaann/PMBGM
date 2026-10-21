import { BadgeCheck, Building2, FlaskConical, Users } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SUMBER, type SumberData } from "@/lib/label";
import { cn } from "@/lib/utils";

const IKON = {
  resmi: Building2,
  masyarakat_sipil: Users,
  laporan_warga_terverifikasi: BadgeCheck,
  simulasi: FlaskConical,
} as const;

const WARNA: Record<SumberData, string> = {
  resmi: "bg-info-lembut text-info",
  masyarakat_sipil: "bg-secondary text-secondary-foreground",
  laporan_warga_terverifikasi: "bg-risiko-rendah-lembut text-risiko-rendah",
  simulasi: "bg-muted text-muted-foreground",
};

const SINGKAT: Record<SumberData, string> = {
  resmi: "Resmi",
  masyarakat_sipil: "Masy. sipil",
  laporan_warga_terverifikasi: "Terverifikasi",
  simulasi: "Simulasi",
};

/** Label sumber wajib di setiap tampilan data (PRD 3.4). Ringkas; penjelasan ada di tooltip. */
export function LabelSumber({ jenis, className }: { jenis: SumberData; className?: string }) {
  const Ikon = IKON[jenis];
  return (
    <Tooltip>
      <TooltipTrigger
        aria-label={`Sumber data: ${SUMBER[jenis].label}. ${SUMBER[jenis].penjelasan}`}
        className={cn("inline-flex h-6 items-center gap-1 rounded-full px-2 text-[11px] font-semibold whitespace-nowrap", WARNA[jenis], className)}
      >
        <Ikon className="size-3.5" aria-hidden />
        {SINGKAT[jenis]}
      </TooltipTrigger>
      <TooltipContent className="max-w-64">
        <strong>Sumber: {SUMBER[jenis].label}.</strong> {SUMBER[jenis].penjelasan}
      </TooltipContent>
    </Tooltip>
  );
}
