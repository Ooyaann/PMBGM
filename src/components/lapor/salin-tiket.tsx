"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Salin atau bagikan kode tiket (bagikan hanya muncul di perangkat yang mendukung). */
export function SalinTiket({ kode }: { kode: string }) {
  const [tersalin, setTersalin] = useState(false);
  const bisaBagikan = useSyncExternalStore(() => () => {}, () => "share" in navigator, () => false);
  return (
    <div className="flex gap-2">
      <Button type="button" variant="outline" size="lg" className="bg-card" aria-live="polite"
        onClick={async () => {
          await navigator.clipboard.writeText(kode);
          setTersalin(true);
          setTimeout(() => setTersalin(false), 2000);
        }}>
        {tersalin ? <Check aria-hidden /> : <Copy aria-hidden />} {tersalin ? "Tersalin" : "Salin"}
      </Button>
      {bisaBagikan && (
        <Button type="button" variant="outline" size="lg" className="bg-card"
          onClick={() => navigator.share({ title: "Tiket laporan PMBGM", text: `Kode tiket laporan MBG: ${kode}`, url: `${location.origin}/lacak?tiket=${kode}` }).catch(() => {})}>
          <Share2 aria-hidden /> Bagikan
        </Button>
      )}
    </div>
  );
}
