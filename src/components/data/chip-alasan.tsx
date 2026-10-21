import { Clock, FileWarning, HeartPulse, ShieldOff, ShieldCheck, ThumbsDown, type LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Alasan, JenisAlasan } from "@/lib/data/publik";
import { cn } from "@/lib/utils";

const TAMPIL: Record<JenisAlasan, { ikon: LucideIcon; kelas: string }> = {
  keracunan: { ikon: HeartPulse, kelas: "bg-risiko-tinggi-lembut text-risiko-tinggi" },
  slhs: { ikon: ShieldOff, kelas: "bg-risiko-sedang-lembut text-risiko-sedang" },
  laporan: { ikon: FileWarning, kelas: "bg-muted text-foreground" },
  terlambat: { ikon: Clock, kelas: "bg-risiko-sedang-lembut text-risiko-sedang" },
  kepuasan: { ikon: ThumbsDown, kelas: "bg-muted text-foreground" },
  aman: { ikon: ShieldCheck, kelas: "bg-risiko-rendah-lembut text-risiko-rendah" },
};

/** Alasan prioritas inspeksi sebagai chip ikon (IN-03); kalimat lengkap di tooltip. */
export function ChipAlasan({ alasan, className }: { alasan: Alasan; className?: string }) {
  const { ikon: Ikon, kelas } = TAMPIL[alasan.jenis];
  return (
    <Tooltip>
      <TooltipTrigger
        aria-label={alasan.lengkap}
        className={cn("inline-flex h-6 items-center gap-1 rounded-md px-1.5 text-[11px] font-semibold", kelas, className)}
      >
        <Ikon className="size-3.5" aria-hidden />
        {alasan.singkat}
      </TooltipTrigger>
      <TooltipContent className="max-w-60">{alasan.lengkap}</TooltipContent>
    </Tooltip>
  );
}
