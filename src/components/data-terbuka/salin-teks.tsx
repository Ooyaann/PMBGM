"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Bertip } from "@/components/ui/bertip";

/** Tombol salin kecil untuk URL API atau contoh perintah. */
export function SalinTeks({ teks, label = "Salin" }: { teks: string; label?: string }) {
  const [tersalin, setTersalin] = useState(false);
  return (
    <Bertip label={tersalin ? "Tersalin" : label} render={
      <button type="button" onClick={async () => {
        await navigator.clipboard.writeText(teks.startsWith("/") ? location.origin + teks : teks);
        setTersalin(true);
        setTimeout(() => setTersalin(false), 1500);
      }} className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground" />
    }>
      {tersalin ? <Check className="size-4 text-risiko-rendah" aria-hidden /> : <Copy className="size-4" aria-hidden />}
    </Bertip>
  );
}
