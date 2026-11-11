"use client";

import { useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, Maximize2, ShieldCheck, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { FotoBukti } from "@/lib/data/lacak";

export function GaleriBuktiAduan({ foto }: { foto: FotoBukti[] }) {
  const [terpilih, setTerpilih] = useState<FotoBukti | null>(null);

  if (!foto || foto.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <ImageIcon className="size-3.5 text-primary" /> Bukti Foto Mutu Makanan ({foto.length})
        </span>
        <span className="text-[11px] text-muted-foreground">Klik foto untuk memperbesar</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {foto.map((f, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setTerpilih(f)}
            className="group relative aspect-4/3 w-full overflow-hidden rounded-2xl border bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-left transition-all hover:border-primary/50 hover:shadow-sm"
          >
            <Image
              src={f.url}
              alt={`Foto bukti makanan #${idx + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, 200px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {f.ilustrasi && (
              <span className="absolute top-2 left-2 rounded-md bg-background/80 px-2 py-0.5 text-[10px] font-semibold backdrop-blur-xs">
                Simulasi
              </span>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 text-foreground p-1.5 rounded-xl shadow-xs">
                <Maximize2 className="size-4" />
              </span>
            </div>
          </button>
        ))}
      </div>

      <Dialog open={!!terpilih} onOpenChange={(buka) => !buka && setTerpilih(null)}>
        <DialogContent className="max-w-2xl p-4 sm:p-6 overflow-hidden rounded-3xl">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <ImageIcon className="size-4 text-primary" /> Pratinjau Foto Bukti Makanan
            </DialogTitle>
          </DialogHeader>
          {terpilih && (
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border bg-muted">
              <Image
                src={terpilih.url}
                alt="Foto bukti mutu makanan"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-contain"
                priority
              />
            </div>
          )}
          <div className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1">
            <ShieldCheck className="size-3.5 text-primary" />
            <span>Foto bukti pengaduan diverifikasi keasliannya dan disanitasi dari informasi pribadi.</span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

