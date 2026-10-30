"use client";

import { useState, useTransition } from "react";
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
  kelompok: "pelapor" | "petugas";
  ikon: LucideIcon;
  warnaAksen: string;
  warnaBg: string;
}

const DAFTAR_PERSONA: PersonaDemo[] = [
  {
    kunci: "rina",
    nama: "Ibu Rina",
    peran: "Warga / Orang Tua",
    kelompok: "pelapor",
    ikon: UserRound,
    warnaAksen: "text-primary",
    warnaBg: "bg-secondary border-primary/20",
  },
  {
    kunci: "budi",
    nama: "Pak Budi",
    peran: "Guru Sekolah",
    kelompok: "pelapor",
    ikon: GraduationCap,
    warnaAksen: "text-info",
    warnaBg: "bg-info-lembut border-info/20",
  },
  {
    kunci: "sari",
    nama: "Mbak Sari",
    peran: "Verifikator",
    kelompok: "petugas",
    ikon: ClipboardCheck,
    warnaAksen: "text-primary",
    warnaBg: "bg-secondary border-primary/20",
  },
  {
    kunci: "sppg",
    nama: "Mitra Dapur",
    peran: "Dapur SPPG",
    kelompok: "petugas",
    ikon: Utensils,
    warnaAksen: "text-risiko-sedang",
    warnaBg: "bg-risiko-sedang-lembut border-risiko-sedang/25",
  },
  {
    kunci: "hendra",
    nama: "Pak Hendra",
    peran: "Dinas Kesehatan",
    kelompok: "petugas",
    ikon: Building2,
    warnaAksen: "text-risiko-tinggi",
    warnaBg: "bg-risiko-tinggi-lembut border-risiko-tinggi/25",
  },
  {
    kunci: "korwil",
    nama: "Korwil BGN",
    peran: "Pengawas SLA",
    kelompok: "petugas",
    ikon: Users,
    warnaAksen: "text-info",
    warnaBg: "bg-info-lembut border-info/20",
  },
  {
    kunci: "admin",
    nama: "Admin Sistem",
    peran: "Administrator",
    kelompok: "petugas",
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
    window.location.href = tujuan;
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

  const pelaporList = DAFTAR_PERSONA.filter((p) => p.kelompok === "pelapor");
  const petugasList = DAFTAR_PERSONA.filter((p) => p.kelompok === "petugas");

  const renderKartu = (p: PersonaDemo, rentangPenuh = false) => {
    const terpilih = kunciPilihan === p.kunci;
    const Ikon = p.ikon;
    return (
      <button
        key={p.kunci}
        type="button"
        onClick={() => {
          if (terpilih && !sibuk) {
            eksekusiMasukDemo(p.kunci);
          } else {
            setKunciPilihan(p.kunci);
          }
        }}
        disabled={sibuk}
        className={cn(
          "group flex items-center gap-3 rounded-2xl border p-3 text-left transition-all outline-none cursor-pointer",
          rentangPenuh && "sm:col-span-2",
          terpilih
            ? "border-primary bg-secondary/45 ring-2 ring-primary/20 shadow-2xs"
            : "border-border/80 bg-background/80 hover:border-primary/40 hover:bg-muted/40"
        )}
      >
        <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl border transition-transform group-hover:scale-105", p.warnaBg)}>
          <Ikon className={cn("size-4.5", p.warnaAksen)} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-xs sm:text-sm font-extrabold text-foreground truncate">{p.nama}</span>
            {terpilih && (
              <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="size-2.5 stroke-[3]" aria-hidden />
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium text-muted-foreground block leading-tight truncate mt-0.5">
            {p.peran}
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="w-full space-y-5">
      {/* 3 Tab Segmented Control */}
      <div className="grid w-full grid-cols-3 rounded-xl bg-muted/80 p-1 border border-border/70">
        <button
          type="button"
          onClick={() => setTabAktif("demo")}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-lg py-2 px-2 text-xs font-bold transition-all cursor-pointer",
            tabAktif === "demo"
              ? "bg-card text-primary shadow-2xs"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Users className="size-3.5 shrink-0" aria-hidden />
          <span>Simulasi Peran</span>
        </button>
        <button
          type="button"
          onClick={() => setTabAktif("masuk")}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-lg py-2 px-2 text-xs font-bold transition-all cursor-pointer",
            tabAktif === "masuk"
              ? "bg-card text-foreground shadow-2xs"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <KeyRound className="size-3.5 shrink-0" aria-hidden />
          <span>Masuk Email</span>
        </button>
        <button
          type="button"
          onClick={() => setTabAktif("daftar")}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-lg py-2 px-2 text-xs font-bold transition-all cursor-pointer",
            tabAktif === "daftar"
              ? "bg-card text-foreground shadow-2xs"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <UserPlus className="size-3.5 shrink-0" aria-hidden />
          <span>Daftar Baru</span>
        </button>
      </div>

      {tabAktif === "demo" ? (
        <div className="space-y-3.5">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Pelapor
            </span>
            <div className="grid grid-cols-2 gap-2">{pelaporList.map((p) => renderKartu(p))}</div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Petugas & Instansi
            </span>
            <div className="grid grid-cols-2 gap-2">
              {petugasList.map((p, idx) => renderKartu(p, idx === petugasList.length - 1))}
            </div>
          </div>

          <Button
            type="button"
            size="lg"
            disabled={sibuk}
            onClick={() => eksekusiMasukDemo(kunciPilihan)}
            className="w-full rounded-xl font-bold h-11 text-sm shadow-sm shadow-primary/15 cursor-pointer"
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
