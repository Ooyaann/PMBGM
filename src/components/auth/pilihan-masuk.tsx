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
    keterangan: "Lapor porsi anak & pantau status",
    ikon: UserRound,
    warnaAksen: "text-emerald-600 dark:text-emerald-400",
    warnaBg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    kunci: "budi",
    nama: "Pak Budi",
    peran: "Guru Terverifikasi",
    instansi: "SMP Negeri Tembalang",
    keterangan: "Pantau gizi sekolah & rapor dapur",
    ikon: GraduationCap,
    warnaAksen: "text-blue-600 dark:text-blue-400",
    warnaBg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    kunci: "sari",
    nama: "Mbak Sari",
    peran: "Verifikator Wilayah",
    instansi: "Tim Verifikasi Independen",
    keterangan: "Verifikasi foto bukti & aduan",
    ikon: ClipboardCheck,
    warnaAksen: "text-teal-600 dark:text-teal-400",
    warnaBg: "bg-teal-500/10 border-teal-500/20",
  },
  {
    kunci: "sppg",
    nama: "Pengelola Dapur",
    peran: "Dapur SPPG",
    instansi: "Mitra SPPG Tembalang",
    keterangan: "Terima keluhan & bukti perbaikan",
    ikon: Utensils,
    warnaAksen: "text-amber-600 dark:text-amber-400",
    warnaBg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    kunci: "hendra",
    nama: "Pak Hendra",
    peran: "Dinas Kesehatan",
    instansi: "Dinas Kesehatan Wilayah",
    keterangan: "Investigasi medis & sertifikat SLHS",
    ikon: Building2,
    warnaAksen: "text-rose-600 dark:text-rose-400",
    warnaBg: "bg-rose-500/10 border-rose-500/20",
  },
  {
    kunci: "korwil",
    nama: "Korwil BGN",
    peran: "Pengawas Wilayah",
    instansi: "Badan Gizi Nasional (BGN)",
    keterangan: "Pantau kepatuhan batas waktu SLA",
    ikon: Users,
    warnaAksen: "text-indigo-600 dark:text-indigo-400",
    warnaBg: "bg-indigo-500/10 border-indigo-500/20",
  },
  {
    kunci: "admin",
    nama: "Admin Sistem",
    peran: "Administrator",
    instansi: "Pusat Data PMBGM",
    keterangan: "Kelola pengguna & master data",
    ikon: Settings,
    warnaAksen: "text-purple-600 dark:text-purple-400",
    warnaBg: "bg-purple-500/10 border-purple-500/20",
  },
];

export function PilihanMasuk({ lanjut, modeDemo }: { lanjut: string; modeDemo: boolean }) {
  const router = useRouter();
  const [sibuk, mulai] = useTransition();
  const [tabAktif, setTabAktif] = useState<"demo" | "password">("demo");
  const [kunciPilihan, setKunciPilihan] = useState<KunciDemo>("rina");

  const selesai = (kunci?: KunciDemo) => {
    let tujuan = lanjut;
    if (tujuan === "/" || !tujuan) {
      if (kunci === "sari") tujuan = "/panel/verifikasi";
      else if (kunci === "sppg" || kunci === "hendra" || kunci === "korwil" || kunci === "admin") tujuan = "/panel";
      else tujuan = "/";
    }
    window.location.href = tujuan;
  };

  const personaTerpilih = DAFTAR_PERSONA.find((p) => p.kunci === kunciPilihan) ?? DAFTAR_PERSONA[0];

  const handleMasukDemo = () => {
    mulai(async () => {
      const hasil = await masukDemo(kunciPilihan);
      if (hasil.ok) {
        toast.success(`Berhasil masuk sebagai ${personaTerpilih.nama} (${personaTerpilih.peran})`);
        selesai(kunciPilihan);
      } else {
        toast.error(hasil.pesan);
      }
    });
  };

  const formPassword = <MasukPassword onBerhasil={selesai} />;

  if (!modeDemo) return formPassword;

  return (
    <div className="w-full space-y-4">
      {/* Tab Switcher Utama Lapang & Sempurna (Tidak Terpotong) */}
      <div className="grid w-full grid-cols-2 rounded-2xl bg-muted/80 p-1.5 border border-border/60">
        <button
          type="button"
          onClick={() => setTabAktif("demo")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs sm:text-sm font-bold transition-all outline-none",
            tabAktif === "demo"
              ? "bg-card text-primary shadow-xs ring-1 ring-border/50"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Sparkles className="size-4 text-primary shrink-0" aria-hidden />
          <span>Mode Uji Coba Demo</span>
        </button>
        <button
          type="button"
          onClick={() => setTabAktif("password")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs sm:text-sm font-bold transition-all outline-none",
            tabAktif === "password"
              ? "bg-card text-foreground shadow-xs ring-1 ring-border/50"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <KeyRound className="size-4 text-muted-foreground shrink-0" aria-hidden />
          <span>Masuk / Daftar Akun</span>
        </button>
      </div>

      {tabAktif === "demo" ? (
        <div className="space-y-3">
          {/* GRID KARTU PERSONA BERSIH & COMPACT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[250px] overflow-y-auto pr-1">
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
                    "flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all duration-150 outline-none",
                    terpilih
                      ? "border-primary bg-primary/5 ring-2 ring-primary/25 shadow-2xs"
                      : "border-border/70 bg-card hover:border-primary/40 hover:bg-muted/40"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-lg border",
                      p.warnaBg
                    )}
                  >
                    <Ikon className={cn("size-4", p.warnaAksen)} aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs sm:text-sm font-bold text-foreground truncate">{p.nama}</span>
                      {terpilih && (
                        <CheckCircle2 className="size-3.5 text-primary shrink-0" aria-hidden />
                      )}
                    </div>
                    <span className="text-[11px] font-semibold text-primary block leading-tight truncate">
                      {p.peran}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* TOMBOL AKSI MASUK */}
          <div className="pt-2 border-t">
            <Button
              type="button"
              size="lg"
              disabled={sibuk}
              onClick={handleMasukDemo}
              className="w-full rounded-xl font-bold shadow-sm shadow-primary/10 text-xs sm:text-sm h-11"
            >
              {sibuk ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                  Mempersiapkan Sesi...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 size-4" aria-hidden />
                  Masuk sebagai {personaTerpilih.nama} ({personaTerpilih.peran})
                  <ArrowRight className="ml-2 size-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="pt-0.5">
          {formPassword}
        </div>
      )}
    </div>
  );
}
