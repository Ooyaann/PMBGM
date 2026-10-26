"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { Bertip } from "@/components/ui/bertip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { JenisBanding, PilihanBanding } from "@/lib/data/banding";
import { WARNA_BUTIR } from "@/components/insight/warna-butir";

/** Pilih 2–3 butir untuk dibandingkan; pilihan disimpan di URL agar bisa dibagikan. */
export function PemilihBanding({ jenis, ids, mode, pilihan }: {
  jenis: JenisBanding;
  ids: string[];
  mode: "warga" | "analis";
  pilihan: PilihanBanding[];
}) {
  const router = useRouter();
  const [slotKosong, setSlotKosong] = useState(false);
  const nama = new Map(pilihan.map((p) => [p.id, p.nama]));

  function ganti(baru: string[]) {
    setSlotKosong(false);
    router.push(`/insight/banding?jenis=${jenis}&id=${baru.join(",")}&mode=${mode}`, { scroll: false });
  }

  const slot = [...ids, ...(slotKosong && ids.length < 3 ? [""] : [])];

  return (
    <ul className="grid gap-2 sm:grid-cols-3">
      {slot.map((id, i) => (
        <li key={`${i}-${id}`} className="flex items-center gap-2 rounded-2xl border bg-card p-2">
          <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
            style={{ background: WARNA_BUTIR[i] }}>
            {String.fromCharCode(65 + i)}
          </span>
          <Select value={id || null} items={pilihan.map((p) => ({ value: p.id, label: p.nama }))}
            onValueChange={(v) => {
              if (!v) return;
              const baru = [...ids];
              baru[i] = v as string;
              ganti(baru);
            }}>
            <SelectTrigger aria-label={`Pilihan ${String.fromCharCode(65 + i)}`} className="h-10 min-w-0 flex-1 border-0 bg-transparent px-1 font-semibold">
              <SelectValue placeholder="Pilih…">{id ? nama.get(id) : undefined}</SelectValue>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} className="max-h-80">
              {pilihan.filter((p) => p.id === id || !ids.includes(p.id)).map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  <span className="truncate">{p.nama}</span>
                  <span className="text-xs text-muted-foreground">{p.sub}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {slot.length > 2 && (
            <Bertip label="Hapus dari perbandingan" render={
              <button type="button" onClick={() => (id ? ganti(ids.filter((x) => x !== id)) : setSlotKosong(false))}
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground" />
            }>
              <X className="size-4" aria-hidden />
            </Bertip>
          )}
        </li>
      ))}
      {slot.length < 3 && (
        <li>
          <button type="button" onClick={() => setSlotKosong(true)}
            className="flex h-full min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-dashed text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground">
            <Plus className="size-4" aria-hidden /> Tambah
          </button>
        </li>
      )}
    </ul>
  );
}
