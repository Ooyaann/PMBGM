"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  KeyRound,
  Loader2,
  Settings,
  Sparkles,
  UserRound,
  Users,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { masukDemo, type KunciDemo } from "@/lib/aksi/auth";
import { cn } from "@/lib/utils";
import { MasukPassword } from "./masuk-password";

interface PersonaDemo {
  kunci: KunciDemo;
  nama: string;
  peran: string;
  instansi: string;
  keterangan: string;
  ikon: LucideIcon;
  warnaAksen: string;
  warnaBg: string;
}

const DAFTAR_PERSONA: PersonaDemo[] = [
  {
    kunci: "rina",
    nama: "Ibu Rina",
    peran: "Warga / Orang Tua",
    instansi: "SD di Tembalang",
    keterangan: "Melaporkan masalah porsi makan anak & pantau status tiket.",
    ikon: UserRound,
    warnaAksen: "text-emerald-600 dark:text-emerald-400",
    warnaBg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    kunci: "budi",
    nama: "Pak Budi",
    peran: "Guru Terverifikasi",
    instansi: "SMP Negeri Tembalang",
    keterangan: "Memantau distribusi MBG di sekolah & rapor dapur mitra.",
    ikon: GraduationCap,
    warnaAksen: "text-blue-600 dark:text-blue-400",
    warnaBg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    kunci: "sari",
    nama: "Mbak Sari",
    peran: "Verifikator Wilayah",
    instansi: "Tim Independen Semarang",
    keterangan: "Memeriksa keabsahan foto bukti & gabung laporan serupa.",
    ikon: ClipboardCheck,
    warnaAksen: "text-teal-600 dark:text-teal-400",
    warnaBg: "bg-teal-500/10 border-teal-500/20",
  },
  {
    kunci: "sppg",
    nama: "Pengelola Dapur",
    peran: "Dapur SPPG",
    instansi: "SPPG Tembalang 03",
    keterangan: "Menerima aduan dapur, unggah foto perbaikan fisik.",
    ikon: Utensils,
    warnaAksen: "text-amber-600 dark:text-amber-400",
    warnaBg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    kunci: "hendra",
    nama: "Pak Hendra",
    peran: "Dinas Kesehatan",
    instansi: "Dinkes Kota Semarang",
    keterangan: "Investigasi medis keracunan & evaluasi sertifikat SLHS.",
    ikon: Building2,
    warnaAksen: "text-rose-600 dark:text-rose-400",
    warnaBg: "bg-rose-500/10 border-rose-500/20",
  },
  {
    kunci: "korwil",
    nama: "Korwil BGN",
    peran: "Pengawas Kota",
    instansi: "BGN Kota Semarang",
    keterangan: "Memantau kepatuhan batas waktu SLA antar-dapur se-kota.",
    ikon: Users,
    warnaAksen: "text-indigo-600 dark:text-indigo-400",
    warnaBg: "bg-indigo-500/10 border-indigo-500/20",
  },
  {
    kunci: "admin",
    nama: "Admin Sistem",
    peran: "Administrator",
    instansi: "Pusat Data PMBGM",
    keterangan: "Kelola akun pengguna, data master, dan aturan SLA.",
    ikon: Settings,
    warnaAksen: "text-purple-600 dark:text-purple-400",
    warnaBg: "bg-purple-500/10 border-purple-500/20",
  },
];

export function PilihanMasuk({ lanjut, modeDemo }: { lanjut: string; modeDemo: boolean }) {
  const router = useRouter();
  const [sibuk, mulai] = useTransition();
  const [kunciPilihan, setKunciPilihan] = useState<KunciDemo>("rina");

  const selesai = () => {
    router.replace(lanjut);
    router.refresh();
  };

  const personaTerpilih = DAFTAR_PERSONA.find((p) => p.kunci === kunciPilihan) ?? DAFTAR_PERSONA[0];

  const handleMasukDemo = () => {
    mulai(async () => {
      const hasil = await masukDemo(kunciPilihan);
      if (hasil.ok) {
        toast.success(`Berhasil masuk sebagai ${personaTerpilih.nama} (${personaTerpilih.peran})`);
        selesai();
      } else {
        toast.error(hasil.pesan);
      }
    });
  };

  const formPassword = <MasukPassword onBerhasil={selesai} />;

  if (!modeDemo) return formPassword;

  return (
    <Tabs defaultValue="demo" className="w-full">
      <TabsList className="grid w-full grid-cols-2 rounded-2xl p-1.5 bg-muted/70 border border-border/60">
        <TabsTrigger
          value="demo"
          className="rounded-xl text-xs sm:text-sm font-bold py-2.5 transition-all data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm"
        >
          <Sparkles className="size-4 mr-1.5 text-amber-500 shrink-0" aria-hidden />
          <span>Uji Coba Demo (Juri)</span>
        </TabsTrigger>
        <TabsTrigger
          value="password"
          className="rounded-xl text-xs sm:text-sm font-bold py-2.5 transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
        >
          <KeyRound className="size-4 mr-1.5 text-muted-foreground shrink-0" aria-hidden />
          <span>Akun Terdaftar</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="demo" className="mt-5 space-y-5">
        <div>
          <h3 className="text-sm font-bold text-foreground">Pilih Akun Peran Pengujian</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Disediakan khusus bagi dewan juri untuk menjelajahi sudut pandang setiap peran secara instan:
          </p>
        </div>

        {/* GRID KARTU PERSONA INTERAKTIF */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
          {DAFTAR_PERSONA.map((p) => {
            const terpilih = kunciPilihan === p.kunci;
            const Ikon = p.ikon;
            return (
              <button
                key={p.kunci}
                type="button"
                onClick={() => setKunciPilihan(p.kunci)}
                disabled={sibuk}
                className={cn(
                  "flex items-start gap-3 rounded-2xl border p-3 text-left transition-all duration-150 outline-none",
                  terpilih
                    ? "border-primary bg-primary/5 ring-2 ring-primary/30 shadow-xs"
                    : "border-border/70 bg-card hover:border-primary/40 hover:bg-muted/40"
                )}
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-xl border mt-0.5",
                    p.warnaBg
                  )}
                >
                  <Ikon className={cn("size-4.5", p.warnaAksen)} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-bold text-foreground truncate">{p.nama}</span>
                    {terpilih && (
                      <CheckCircle2 className="size-4 text-primary shrink-0" aria-hidden />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-primary block leading-tight">
                    {p.peran}
                  </span>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {p.keterangan}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* TOMBOL AKSI MASUK */}
        <div className="space-y-2 pt-2 border-t">
          <Button
            type="button"
            size="xl"
            disabled={sibuk}
            onClick={handleMasukDemo}
            className="w-full rounded-2xl font-bold shadow-md shadow-primary/10 text-sm h-12"
          >
            {sibuk ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                Mempersiapkan Sesi {personaTerpilih.nama}...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 size-4" aria-hidden />
                Masuk sebagai {personaTerpilih.nama} ({personaTerpilih.peran})
                <ArrowRight className="ml-2 size-4" />
              </>
            )}
          </Button>
          <p className="text-center text-[11px] text-muted-foreground">
            Akses langsung tanpa perlu mengetik kata sandi manual.
          </p>
        </div>
      </TabsContent>

      <TabsContent value="password" className="mt-5">
        {formPassword}
      </TabsContent>
    </Tabs>
  );
}
