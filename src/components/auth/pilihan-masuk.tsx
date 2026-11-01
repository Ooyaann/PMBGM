"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Check,
  ClipboardCheck,
  Compass,
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
  kelompok: "pelapor" | "petugas";
  ikon: LucideIcon;
  warnaAksen: string;
  warnaBg: string;
  tujuanLabel: string;
  tujuanRute: string;
  hakAkses: string;
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
    tujuanLabel: "Beranda & Lapor",
    tujuanRute: "/",
    hakAkses: "Kirim laporan menu gizi mandiri, pantau riwayat, & lacak status kasus.",
  },
  {
    kunci: "budi",
    nama: "Pak Budi",
    peran: "Guru Sekolah",
    kelompok: "pelapor",
    ikon: GraduationCap,
    warnaAksen: "text-info",
    warnaBg: "bg-info-lembut border-info/20",
    tujuanLabel: "Lapor Sekolah",
    tujuanRute: "/",
    hakAkses: "Pelaporan resmi distribusi makan harian tingkat satuan pendidikan.",
  },
  {
    kunci: "sari",
    nama: "Mbak Sari",
    peran: "Verifikator",
    kelompok: "petugas",
    ikon: ClipboardCheck,
    warnaAksen: "text-primary",
    warnaBg: "bg-secondary border-primary/20",
    tujuanLabel: "Panel Verifikasi",
    tujuanRute: "/panel/verifikasi",
    hakAkses: "Verifikasi lapangan 3 lapis, validasi bukti foto EXIF, dan penetapan status.",
  },
  {
    kunci: "sppg",
    nama: "Mitra Dapur",
    peran: "Dapur SPPG",
    kelompok: "petugas",
    ikon: Utensils,
    warnaAksen: "text-risiko-sedang",
    warnaBg: "bg-risiko-sedang-lembut border-risiko-sedang/25",
    tujuanLabel: "Panel SPPG",
    tujuanRute: "/panel",
    hakAkses: "Monitor kepatuhan porsi menu gizi, evaluasi audit dapur, & respon tanggapan.",
  },
  {
    kunci: "hendra",
    nama: "Pak Hendra",
    peran: "Dinas Kesehatan",
    kelompok: "petugas",
    ikon: Building2,
    warnaAksen: "text-risiko-tinggi",
    warnaBg: "bg-risiko-tinggi-lembut border-risiko-tinggi/25",
    tujuanLabel: "Panel Kasus & Dinkes",
    tujuanRute: "/panel",
    hakAkses: "Intervensi insiden kritis, pemantauan status kesehatan & investigasi sampel.",
  },
  {
    kunci: "korwil",
    nama: "Korwil BGN",
    peran: "Pengawas SLA",
    kelompok: "petugas",
    ikon: Users,
    warnaAksen: "text-info",
    warnaBg: "bg-info-lembut border-info/20",
    tujuanLabel: "Panel Pengawas SLA",
    tujuanRute: "/panel",
    hakAkses: "Pengawasan menyeluruh kepatuhan SLA 24-48 jam & tata kelola regional.",
  },
  {
    kunci: "admin",
    nama: "Admin Sistem",
    peran: "Administrator",
    kelompok: "petugas",
    ikon: Settings,
    warnaAksen: "text-primary",
    warnaBg: "bg-secondary border-primary/20",
    tujuanLabel: "Panel Administrasi",
    tujuanRute: "/panel",
    hakAkses: "Akses penuh manajemen master data, konfigurasi sistem, & log audit trail.",
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
        toast.success(`Berhasil masuk sebagai ${targetPersona.nama} (${targetPersona.peran})`);
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
          "group relative flex flex-col justify-between rounded-2xl border p-3.5 text-left transition-all duration-200 outline-none cursor-pointer",
          rentangPenuh && "sm:col-span-2",
          terpilih
            ? "border-primary bg-primary/5 ring-2 ring-primary/25 shadow-sm shadow-primary/10 translate-y-[-1px]"
            : "border-border/80 bg-card hover:border-primary/40 hover:bg-muted/30 hover:shadow-2xs"
        )}
      >
        <div className="flex items-start gap-3 w-full">
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-105",
              p.warnaBg
            )}
          >
            <Ikon className={cn("size-5", p.warnaAksen)} aria-hidden />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-xs sm:text-sm font-extrabold text-foreground truncate">
                {p.nama}
              </span>
              {terpilih ? (
                <span className="inline-flex size-4.5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xs">
                  <Check className="size-3 stroke-[3]" aria-hidden />
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-muted-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity">
                  Pilih
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium text-muted-foreground block leading-tight truncate mt-0.5">
              {p.peran}
            </span>
          </div>
        </div>

        {/* Destination badge on card footer */}
        <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
          <span className="inline-flex items-center gap-1 text-primary/90 font-medium">
            <Compass className="size-3" aria-hidden />
            <span className="truncate max-w-[140px] sm:max-w-none">{p.tujuanLabel}</span>
          </span>
          <span className="text-[9px] text-muted-foreground/60 group-hover:text-primary transition-colors">
            {terpilih ? "Aktif" : "Klik 2x Masuk"}
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="w-full space-y-5">
      {/* 3 Tab Segmented Control */}
      <div className="grid w-full grid-cols-3 rounded-2xl bg-muted/80 p-1.5 border border-border/70 shadow-2xs">
        <button
          type="button"
          onClick={() => setTabAktif("demo")}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-xs font-bold transition-all duration-200 cursor-pointer",
            tabAktif === "demo"
              ? "bg-card text-primary shadow-xs font-extrabold"
              : "text-muted-foreground hover:text-foreground hover:bg-card/40"
          )}
        >
          <Sparkles className="size-3.5 shrink-0 text-primary" aria-hidden />
          <span className="truncate">Simulasi Peran</span>
        </button>
        <button
          type="button"
          onClick={() => setTabAktif("masuk")}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-xs font-bold transition-all duration-200 cursor-pointer",
            tabAktif === "masuk"
              ? "bg-card text-foreground shadow-xs font-extrabold"
              : "text-muted-foreground hover:text-foreground hover:bg-card/40"
          )}
        >
          <KeyRound className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">Masuk Email</span>
        </button>
        <button
          type="button"
          onClick={() => setTabAktif("daftar")}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-xs font-bold transition-all duration-200 cursor-pointer",
            tabAktif === "daftar"
              ? "bg-card text-foreground shadow-xs font-extrabold"
              : "text-muted-foreground hover:text-foreground hover:bg-card/40"
          )}
        >
          <UserPlus className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">Daftar Baru</span>
        </button>
      </div>

      {tabAktif === "demo" ? (
        <div className="space-y-4">
          {/* Quick Notice for Jury */}
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-[11px] text-foreground">
            <Sparkles className="size-4 shrink-0 text-primary" aria-hidden />
            <span>
              <strong>Akses Cepat Pengujian:</strong> Pilih salah satu akun persona di bawah untuk masuk seketika tanpa memerlukan kata sandi.
            </span>
          </div>

          {/* Group 1: Pelapor */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              1. Kelompok Pelapor Lapangan
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {pelaporList.map((p) => renderKartu(p))}
            </div>
          </div>

          {/* Group 2: Petugas & Instansi */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              2. Kelompok Petugas & Pengawas
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {petugasList.map((p, idx) => renderKartu(p, idx === petugasList.length - 1))}
            </div>
          </div>

          {/* Selected Role Action Banner */}
          <div className="rounded-2xl border border-primary/25 bg-secondary/35 p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
                  Peran Terpilih
                </span>
                <h4 className="text-sm font-extrabold text-foreground">
                  {personaTerpilih.nama} — <span className="font-semibold text-muted-foreground">{personaTerpilih.peran}</span>
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {personaTerpilih.hakAkses}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-background border border-border text-[10px] font-semibold text-foreground shrink-0 shadow-2xs">
                <Compass className="size-3 text-primary" />
                {personaTerpilih.tujuanLabel}
              </span>
            </div>

            <Button
              type="button"
              size="lg"
              disabled={sibuk}
              onClick={() => eksekusiMasukDemo(kunciPilihan)}
              className="w-full rounded-xl font-bold h-11 text-sm shadow-sm shadow-primary/20 cursor-pointer"
            >
              {sibuk ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                  Memproses Akses Masuk...
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
        </div>
      ) : (
        <MasukPassword modeTetap={tabAktif} onBerhasil={() => selesai()} />
      )}
    </div>
  );
}
