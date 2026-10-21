"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Building2, ClipboardCheck, GraduationCap, Loader2, Mail, Settings, Sparkles, UserRound, Users, Utensils } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { masukDemo, type KunciDemo } from "@/lib/aksi/auth";
import { cn } from "@/lib/utils";
import { MasukEmail } from "./masuk-email";

const PERSONA: { kunci: KunciDemo; nama: string; peran: string; ikon: typeof UserRound; keterangan: string }[] = [
  { kunci: "rina", nama: "Ibu Rina", peran: "Pelapor", ikon: UserRound, keterangan: "Orang tua siswa SD di Tembalang" },
  { kunci: "budi", nama: "Pak Budi", peran: "Guru", ikon: GraduationCap, keterangan: "Pelapor terverifikasi, penanggung jawab MBG di SMP" },
  { kunci: "sari", nama: "Mbak Sari", peran: "Verifikator", ikon: ClipboardCheck, keterangan: "Memeriksa bukti dan menggabungkan laporan serupa" },
  { kunci: "hendra", nama: "Pak Hendra", peran: "Dinkes", ikon: Building2, keterangan: "Staf Dinas Kesehatan Kota Semarang" },
  { kunci: "sppg", nama: "Pengelola", peran: "SPPG", ikon: Utensils, keterangan: "Pengelola SPPG Contoh Tembalang 03" },
  { kunci: "korwil", nama: "Korwil", peran: "BGN", ikon: Users, keterangan: "Koordinator wilayah BGN Kota Semarang" },
  { kunci: "admin", nama: "Admin", peran: "Sistem", ikon: Settings, keterangan: "Pengguna, data master, dan aturan SLA" },
];

export function PilihanMasuk({ lanjut, modeDemo }: { lanjut: string; modeDemo: boolean }) {
  const router = useRouter();
  const [sibuk, mulai] = useTransition();
  const [dipilih, setDipilih] = useState<KunciDemo | null>(null);

  const selesai = () => {
    router.replace(lanjut);
    router.refresh();
  };

  const formEmail = <MasukEmail onBerhasil={selesai} />;
  if (!modeDemo) return formEmail;

  return (
    <Tabs defaultValue="demo">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="demo"><Sparkles aria-hidden /> Akun demo</TabsTrigger>
        <TabsTrigger value="email"><Mail aria-hidden /> Email</TabsTrigger>
      </TabsList>
      <TabsContent value="demo" className="mt-4">
        <ul className="grid grid-cols-2 gap-2">
          {PERSONA.map((p) => (
            <li key={p.kunci} className={cn(p.kunci === "admin" && "col-span-2")}>
              <Tooltip>
                <TooltipTrigger
                  render={<button type="button" />}
                  disabled={sibuk}
                  onClick={() => {
                    setDipilih(p.kunci);
                    mulai(async () => {
                      const hasil = await masukDemo(p.kunci);
                      if (hasil.ok) {
                        toast.success(`Masuk sebagai ${p.nama}`);
                        selesai();
                      } else toast.error(hasil.pesan);
                    });
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl border bg-card p-3 text-left transition hover:border-primary/40 hover:bg-secondary/40 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none disabled:opacity-60"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                    {sibuk && dipilih === p.kunci ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <p.ikon className="size-5" aria-hidden />}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{p.nama}</span>
                    <span className="block text-xs text-muted-foreground">{p.peran}</span>
                  </span>
                </TooltipTrigger>
                <TooltipContent>{p.keterangan}</TooltipContent>
              </Tooltip>
            </li>
          ))}
        </ul>
      </TabsContent>
      <TabsContent value="email" className="mt-4">{formEmail}</TabsContent>
    </Tabs>
  );
}
