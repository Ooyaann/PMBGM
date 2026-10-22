"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { aturPeran } from "@/lib/aksi/panel";
import { cn } from "@/lib/utils";

type Peran = "pelapor" | "verifikator" | "instansi" | "admin";
const PERAN: { value: Peran; label: string }[] = [
  { value: "pelapor", label: "Pelapor" },
  { value: "verifikator", label: "Verifikator" },
  { value: "instansi", label: "Instansi" },
  { value: "admin", label: "Admin" },
];

export interface PenggunaAdmin {
  id: string;
  email: string;
  nama: string | null;
  peran: Peran;
  terverifikasi: boolean;
  instansiId: string | null;
  jumlahLaporan: number;
}

/** Satu baris pengelolaan peran (LM-04). Perubahan baru tersimpan setelah tombol simpan ditekan. */
export function BarisPengguna({ u, instansi, diriSendiri }: {
  u: PenggunaAdmin;
  instansi: { value: string; label: string }[];
  diriSendiri: boolean;
}) {
  const router = useRouter();
  const [sibuk, mulai] = useTransition();
  const [peran, setPeran] = useState<Peran>(u.peran);
  const [inst, setInst] = useState<string | null>(u.instansiId);
  const [ver, setVer] = useState(u.terverifikasi);
  const berubah = peran !== u.peran || ver !== u.terverifikasi || (peran === "instansi" && inst !== u.instansiId);

  return (
    <li className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
      <div className="min-w-0 lg:flex-1">
        <p className="flex items-center gap-1.5 truncate font-semibold">
          {u.nama ?? "Tanpa nama"}
          {u.terverifikasi && <BadgeCheck className="size-4 shrink-0 text-risiko-rendah" aria-label="Pelapor terverifikasi" />}
          {diriSendiri && <span className="rounded bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">Anda</span>}
        </p>
        <p className="truncate text-xs text-muted-foreground">{u.email} · {u.jumlahLaporan} laporan</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Select value={peran} items={PERAN} onValueChange={(v) => v && setPeran(v as Peran)} disabled={diriSendiri}>
          <SelectTrigger aria-label={`Peran ${u.email}`} className="h-9 w-36"><SelectValue /></SelectTrigger>
          <SelectContent>{PERAN.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
        </Select>
        {peran === "instansi" ? (
          <Select value={inst} items={instansi} onValueChange={(v) => setInst(v as string | null)}>
            <SelectTrigger aria-label={`Instansi ${u.email}`} className="h-9 w-56 min-w-0"><SelectValue placeholder="Pilih instansi" /></SelectTrigger>
            <SelectContent alignItemWithTrigger={false} className="max-h-72">
              {instansi.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}
            </SelectContent>
          </Select>
        ) : null}
        <label className={cn("inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm", ver && "border-risiko-rendah/40 bg-risiko-rendah-lembut")}>
          <input type="checkbox" checked={ver} onChange={(e) => setVer(e.target.checked)} className="accent-[var(--primary)]" />
          <BadgeCheck className="size-4 text-risiko-rendah" aria-hidden /> <span className="sr-only sm:not-sr-only">Terverifikasi</span>
        </label>
        <Button size="lg" disabled={!berubah || sibuk || (peran === "instansi" && !inst)} onClick={() => mulai(async () => {
          const r = await aturPeran({ penggunaId: u.id, peran, instansiId: peran === "instansi" ? inst : null, terverifikasi: ver });
          if (!r.ok) { toast.error(r.pesan); return; }
          toast.success(`${u.nama ?? u.email} diperbarui`);
          router.refresh();
        })}>
          {sibuk ? <Loader2 className="animate-spin" aria-hidden /> : <Save aria-hidden />} Simpan
        </Button>
      </div>
    </li>
  );
}
