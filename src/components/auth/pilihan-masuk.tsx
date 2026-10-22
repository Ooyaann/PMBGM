"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Building2, ChevronDown, ClipboardCheck, GraduationCap, KeyRound, Loader2, Settings, Sparkles, UserRound, Users, Utensils } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { masukDemo, type KunciDemo } from "@/lib/aksi/auth";
import { MasukPassword } from "./masuk-password";

const PERSONA: { kunci: KunciDemo; nama: string; peran: string; ikon: typeof UserRound; keterangan: string }[] = [
  { kunci: "rina", nama: "Ibu Rina", peran: "Pelapor", ikon: UserRound, keterangan: "Orang tua siswa SD di Tembalang (pelapor warga umum)" },
  { kunci: "budi", nama: "Pak Budi", peran: "Guru", ikon: GraduationCap, keterangan: "Pelapor terverifikasi, penanggung jawab MBG di SMP" },
  { kunci: "sari", nama: "Mbak Sari", peran: "Verifikator", ikon: ClipboardCheck, keterangan: "Memeriksa bukti, memvalidasi & menggabungkan laporan" },
  { kunci: "hendra", nama: "Pak Hendra", peran: "Dinkes", ikon: Building2, keterangan: "Staf Dinas Kesehatan Kota Semarang (tindak lanjut kasus)" },
  { kunci: "sppg", nama: "Pengelola", peran: "SPPG", ikon: Utensils, keterangan: "Pengelola Dapur SPPG Contoh Tembalang 03" },
  { kunci: "korwil", nama: "Korwil", peran: "BGN", ikon: Users, keterangan: "Koordinator Wilayah Badan Gizi Nasional Kota Semarang" },
  { kunci: "admin", nama: "Admin", peran: "Sistem", ikon: Settings, keterangan: "Administrator sistem, data master, dan aturan SLA" },
];

export function PilihanMasuk({ lanjut, modeDemo }: { lanjut: string; modeDemo: boolean }) {
  const router = useRouter();
  const [sibuk, mulai] = useTransition();
  const [kunciPilihan, setKunciPilihan] = useState<KunciDemo>("rina");

  const selesai = () => {
    router.replace(lanjut);
    router.refresh();
  };

  const personaTerpilih = PERSONA.find((p) => p.kunci === kunciPilihan) ?? PERSONA[0];
  const PersonaIkon = personaTerpilih.ikon;

  const handleMasukDemo = () => {
    mulai(async () => {
      const hasil = await masukDemo(kunciPilihan);
      if (hasil.ok) {
        toast.success(`Masuk sebagai ${personaTerpilih.nama} (${personaTerpilih.peran})`);
        selesai();
      } else {
        toast.error(hasil.pesan);
      }
    });
  };

  const formPassword = <MasukPassword onBerhasil={selesai} />;

  // Kalau bukan mode demo, langsung tampilkan form email + password
  if (!modeDemo) return formPassword;

  return (
    <Tabs defaultValue="demo">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="demo"><Sparkles aria-hidden /> Akun Demo</TabsTrigger>
        <TabsTrigger value="password"><KeyRound aria-hidden /> Daftar / Masuk</TabsTrigger>
      </TabsList>

      <TabsContent value="demo" className="mt-5 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="pilih-persona" className="text-xs font-semibold text-muted-foreground">
            Pilih Peran Demo untuk Pengujian:
          </label>
          <div className="relative">
            <select
              id="pilih-persona"
              value={kunciPilihan}
              disabled={sibuk}
              onChange={(e) => setKunciPilihan(e.target.value as KunciDemo)}
              className="flex h-11 w-full appearance-none items-center rounded-xl border border-input bg-background px-3.5 pr-10 text-sm font-medium shadow-xs transition focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {PERSONA.map((p) => (
                <option key={p.kunci} value={p.kunci}>
                  {p.nama} — {p.peran}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          </div>
        </div>

        {/* Kartu detail peran terpilih */}
        <div className="flex items-start gap-3 rounded-2xl border bg-muted/30 p-3.5 transition">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
            <PersonaIkon className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{personaTerpilih.nama}</span>
              <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                {personaTerpilih.peran}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {personaTerpilih.keterangan}
            </p>
          </div>
        </div>

        <Button
          type="button"
          disabled={sibuk}
          onClick={handleMasukDemo}
          className="h-11 w-full rounded-xl text-sm font-semibold"
        >
          {sibuk ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
              Menghubungkan sesi...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 size-4" aria-hidden />
              Masuk sebagai {personaTerpilih.nama}
            </>
          )}
        </Button>
      </TabsContent>

      <TabsContent value="password" className="mt-5">
        {formPassword}
      </TabsContent>
    </Tabs>
  );
}
