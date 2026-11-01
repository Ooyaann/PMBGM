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
    peran: "Verifikator Lapangan",
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
  const [tabUtama, setTabUtama] = useState<"demo" | "email">(
    modeAwal === "masuk" || modeAwal === "daftar" ? "email" : "demo"
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
    <div className="w-full space-y-5">
      {/* 2 Tab Segmented Control (Ala Referensi) */}
      <div className="grid w-full grid-cols-2 rounded-2xl bg-muted/70 p-1 border border-border/70 shadow-2xs">
        <button
          type="button"
          onClick={() => setTabUtama("demo")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-bold transition-all cursor-pointer",
            tabUtama === "demo"
              ? "bg-card text-foreground shadow-xs font-extrabold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Sparkles className="size-4 shrink-0 text-primary" aria-hidden />
          <span>Simulasi Peran</span>
        </button>
        <button
          type="button"
          onClick={() => setTabUtama("email")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-bold transition-all cursor-pointer",
            tabUtama === "email"
              ? "bg-card text-foreground shadow-xs font-extrabold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <KeyRound className="size-4 shrink-0" aria-hidden />
          <span>Masuk Email</span>
        </button>
      </div>

      {tabUtama === "demo" ? (
        <div className="space-y-4 pt-1">
          {/* Grid Persona Card: Bersih & Terpilih via Klik */}
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
                    "group flex items-center gap-2.5 rounded-2xl border p-2.5 sm:p-3 text-left transition-all duration-150 outline-none cursor-pointer",
                    rentangPenuh && "col-span-2",
                    terpilih
                      ? "border-primary bg-primary/8 ring-2 ring-primary/20 shadow-xs"
                      : "border-border/70 bg-card hover:border-primary/40 hover:bg-muted/30"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-xl border transition-transform duration-150 group-hover:scale-105",
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

          {/* Tombol Masuk Utama (Ala 'Masuk ->' di referensi) */}
          <Button
            type="button"
            size="lg"
            disabled={sibuk}
            onClick={() => eksekusiMasukDemo(kunciPilihan)}
            className="w-full rounded-2xl font-bold h-12 text-sm shadow-md shadow-primary/20 cursor-pointer transition-all duration-150 active:scale-[0.99]"
          >
            {sibuk ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                Memproses Akses...
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
        <MasukPassword
          modeAwal={modeAwal === "daftar" ? "daftar" : "masuk"}
          onBerhasil={() => selesai()}
          onBeralihKeDemo={() => setTabUtama("demo")}
        />
      )}
    </div>
  );
}
