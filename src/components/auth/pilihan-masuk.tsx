"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Check,
  ClipboardCheck,
  GraduationCap,
  KeyRound,
  Loader2,
  LogIn,
  Settings,
  Sparkles,
  UserPlus,
  UserRound,
  Users,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { masukDemo, type KunciDemo } from "@/lib/aksi/auth";
import { cn } from "@/lib/utils";
import { MasukPassword } from "./masuk-password";

interface PersonaDemo {
  kunci: KunciDemo;
  nama: string;
  peran: string;
  ikon: LucideIcon;
  warnaAksen: string;
  warnaBg: string;
}

const DAFTAR_PERSONA: PersonaDemo[] = [
  {
    kunci: "rina",
    nama: "Ibu Rina",
    peran: "Warga / Orang Tua",
    ikon: UserRound,
    warnaAksen: "text-primary",
    warnaBg: "bg-secondary border-primary/20",
  },
  {
    kunci: "budi",
    nama: "Pak Budi",
    peran: "Guru Sekolah",
    ikon: GraduationCap,
    warnaAksen: "text-info",
    warnaBg: "bg-info-lembut border-info/20",
  },
  {
    kunci: "sari",
    nama: "Mbak Sari",
    peran: "Verifikator",
    ikon: ClipboardCheck,
    warnaAksen: "text-primary",
    warnaBg: "bg-secondary border-primary/20",
  },
  {
    kunci: "sppg",
    nama: "Mitra Dapur",
    peran: "Dapur SPPG",
    ikon: Utensils,
    warnaAksen: "text-risiko-sedang",
    warnaBg: "bg-risiko-sedang-lembut border-risiko-sedang/25",
  },
  {
    kunci: "hendra",
    nama: "Pak Hendra",
    peran: "Dinas Kesehatan",
    ikon: Building2,
    warnaAksen: "text-risiko-tinggi",
    warnaBg: "bg-risiko-tinggi-lembut border-risiko-tinggi/25",
  },
  {
    kunci: "korwil",
    nama: "Korwil BGN",
    peran: "Pengawas SLA",
    ikon: Users,
    warnaAksen: "text-info",
    warnaBg: "bg-info-lembut border-info/20",
  },
  {
    kunci: "admin",
    nama: "Admin Sistem",
    peran: "Administrator",
    ikon: Settings,
    warnaAksen: "text-primary",
    warnaBg: "bg-secondary border-primary/20",
  },
];

export function PilihanMasuk({
  lanjut,
  modeDemo,
  modeAwal,
}: {
  lanjut: string;
  modeDemo: boolean;
  modeAwal?: "demo" | "masuk" | "daftar";
}) {
  const router = useRouter();
  const [sibuk, mulai] = useTransition();
  const [tabAktif, setTabAktif] = useState<"demo" | "masuk" | "daftar">(
    modeAwal ?? (modeDemo ? "demo" : "masuk")
  );
  const [kunciPilihan, setKunciPilihan] = useState<KunciDemo>("rina");

  const selesai = (kunci?: KunciDemo) => {
    let tujuan = lanjut;
    if (tujuan === "/" || !tujuan) {
      if (kunci === "sari") tujuan = "/panel/verifikasi";
      else if (kunci === "sppg" || kunci === "hendra" || kunci === "korwil" || kunci === "admin")
        tujuan = "/panel";
      else tujuan = "/";
    }
    router.push(tujuan);
    router.refresh();
  };

  const personaTerpilih = DAFTAR_PERSONA.find((p) => p.kunci === kunciPilihan) ?? DAFTAR_PERSONA[0];

  const eksekusiMasukDemo = (kunciTarget: KunciDemo) => {
    const targetPersona = DAFTAR_PERSONA.find((p) => p.kunci === kunciTarget) ?? personaTerpilih;
    mulai(async () => {
      const hasil = await masukDemo(kunciTarget);
      if (hasil.ok) {
        toast.success(`Masuk sebagai ${targetPersona.nama}`);
        selesai(kunciTarget);
      } else {
        toast.error(hasil.pesan);
      }
    });
  };

  if (!modeDemo) {
    return <MasukPassword onBerhasil={() => selesai()} />;
  }

  return (
    <div className="w-full space-y-4">
      {/* 3 Tab Segmented Control */}
      <div className="grid w-full grid-cols-3 rounded-2xl bg-muted/80 p-1 border border-border/70">
        <button
          type="button"
          onClick={() => setTabAktif("demo")}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-xs font-bold transition-all cursor-pointer",
            tabAktif === "demo"
              ? "bg-card text-primary shadow-xs font-extrabold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Sparkles className="size-3.5 shrink-0 text-primary" aria-hidden />
          <span>Simulasi</span>
        </button>
        <button
          type="button"
          onClick={() => setTabAktif("masuk")}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-xs font-bold transition-all cursor-pointer",
            tabAktif === "masuk"
              ? "bg-card text-foreground shadow-xs font-extrabold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <KeyRound className="size-3.5 shrink-0" aria-hidden />
          <span>Masuk</span>
        </button>
        <button
          type="button"
          onClick={() => setTabAktif("daftar")}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-xs font-bold transition-all cursor-pointer",
            tabAktif === "daftar"
              ? "bg-card text-foreground shadow-xs font-extrabold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <UserPlus className="size-3.5 shrink-0" aria-hidden />
          <span>Daftar</span>
        </button>
      </div>

      {tabAktif === "demo" ? (
        <div className="space-y-4 pt-1">
          {/* Grid Persona Card Ringkas */}
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            {DAFTAR_PERSONA.map((p, idx) => {
              const terpilih = kunciPilihan === p.kunci;
              const Ikon = p.ikon;
              const rentangPenuh = idx === DAFTAR_PERSONA.length - 1;

              return (
                <button
                  key={p.kunci}
                  type="button"
                  onClick={() => setKunciPilihan(p.kunci)}
                  disabled={sibuk}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-2xl border p-2.5 sm:p-3 text-left transition-all outline-none cursor-pointer",
                    rentangPenuh && "col-span-2",
                    terpilih
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                      : "border-border/80 bg-background/60 hover:border-primary/40 hover:bg-muted/30"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-xl border transition-transform group-hover:scale-105",
                      p.warnaBg
                    )}
                  >
                    <Ikon className={cn("size-4.5", p.warnaAksen)} aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs sm:text-sm font-extrabold text-foreground truncate">
                        {p.nama}
                      </span>
                      {terpilih && (
                        <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="size-2.5 stroke-[3]" aria-hidden />
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground block truncate mt-0.5">
                      {p.peran}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tombol Aksi Masuk Sesuai Peran Terpilih */}
          <Button
            type="button"
            size="lg"
            disabled={sibuk}
            onClick={() => eksekusiMasukDemo(kunciPilihan)}
            className="w-full rounded-2xl font-bold h-11 text-sm shadow-sm shadow-primary/20 cursor-pointer"
          >
            {sibuk ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                Memproses...
              </>
            ) : (
              <>
                <LogIn className="mr-2 size-4" aria-hidden />
                Masuk sebagai {personaTerpilih.nama}
                <ArrowRight className="ml-1.5 size-4" />
              </>
            )}
          </Button>
        </div>
      ) : (
        <MasukPassword modeTetap={tabAktif} onBerhasil={() => selesai()} />
      )}
    </div>
  );
}
