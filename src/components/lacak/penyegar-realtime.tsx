"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Radio } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { buatKlienBrowser } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export interface Langganan {
  tabel: "kasus" | "status_log" | "laporan" | "peringatan_dini";
  event?: "INSERT" | "UPDATE" | "*";
  filter?: string;
}

/**
 * Memperbarui halaman saat data yang ditampilkan berubah (Supabase Realtime, RLS tetap berlaku).
 * Target PRD 7.3: tampil ≤ 3 detik setelah data berubah.
 */
export function PenyegarRealtime({ kanal: namaKanal, langganan }: { kanal: string; langganan: Langganan[] }) {
  const router = useRouter();
  const [tersambung, setTersambung] = useState(false);
  const [baru, setBaru] = useState(false);
  const jeda = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const supabase = buatKlienBrowser();
    const segarkan = () => {
      if (jeda.current) clearTimeout(jeda.current);
      // Satu perubahan status biasanya menulis beberapa baris sekaligus; gabungkan jadi satu refresh.
      jeda.current = setTimeout(() => {
        router.refresh();
        setBaru(true);
        setTimeout(() => setBaru(false), 2500);
      }, 300);
    };
    let kanal = supabase.channel(namaKanal);
    for (const l of langganan) {
      kanal = kanal.on("postgres_changes", { event: l.event ?? "*", schema: "public", table: l.tabel, filter: l.filter }, segarkan);
    }
    kanal.subscribe((status, galat) => {
      setTersambung(status === "SUBSCRIBED");
      if (process.env.NODE_ENV === "development" && status !== "SUBSCRIBED") {
        console.warn("[realtime]", status, galat?.message ?? "");
      }
    });
    return () => {
      if (jeda.current) clearTimeout(jeda.current);
      supabase.removeChannel(kanal);
    };
    // Daftar langganan dianggap tetap selama komponen hidup; kanal dibuat ulang bila namanya berubah.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namaKanal, router]);

  return (
    <Tooltip>
      <TooltipTrigger
        aria-label={tersambung ? "Pembaruan langsung aktif" : "Menyambungkan pembaruan langsung"}
        className={cn(
          "inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold transition",
          tersambung ? "bg-risiko-rendah-lembut text-risiko-rendah" : "bg-muted text-muted-foreground",
          baru && "ring-4 ring-risiko-rendah/30",
        )}
      >
        <span className="relative flex size-2">
          {tersambung && <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-60" />}
          <span className="relative inline-flex size-2 rounded-full bg-current" />
        </span>
        <Radio className="size-3.5" aria-hidden />
        {baru ? "Diperbarui" : "Langsung"}
      </TooltipTrigger>
      <TooltipContent>Halaman ini diperbarui otomatis saat ada perkembangan</TooltipContent>
    </Tooltip>
  );
}
