"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { simpanSla } from "@/lib/aksi/panel";
import { cn } from "@/lib/utils";

type Kategori = Parameters<typeof simpanSla>[0]["kategori"];
type Tahap = Parameters<typeof simpanSla>[0]["tahap"];

/** Satu sel batas waktu (jam). Tersimpan saat fokus lepas atau Enter. */
export function SelSla({ kategori, tahap, awal, label }: { kategori: Kategori; tahap: Tahap; awal: number | null; label: string }) {
  const [nilai, setNilai] = useState(awal?.toString() ?? "");
  const [tersimpan, setTersimpan] = useState(awal);
  const [ok, setOk] = useState(false);
  const [sibuk, mulai] = useTransition();

  function simpan() {
    const jam = Number(nilai);
    if (!nilai || jam === tersimpan) return;
    mulai(async () => {
      const r = await simpanSla({ kategori, tahap, batasJam: jam });
      if (!r.ok) { toast.error(r.pesan); setNilai(tersimpan?.toString() ?? ""); return; }
      setTersimpan(jam);
      setOk(true);
      setTimeout(() => setOk(false), 1500);
    });
  }

  return (
    <span className="relative inline-flex items-center">
      <input type="number" inputMode="numeric" min={1} max={1440} value={nilai} aria-label={label}
        onChange={(e) => setNilai(e.target.value)} onBlur={simpan}
        onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
        className={cn("angka h-9 w-20 rounded-lg border bg-background pr-7 pl-2 text-right text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          Number(nilai) !== tersimpan && "border-risiko-sedang")} />
      <span className="pointer-events-none absolute right-2 text-xs text-muted-foreground">
        {sibuk ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : ok ? <Check className="size-3.5 text-risiko-rendah" aria-hidden /> : "j"}
      </span>
    </span>
  );
}
