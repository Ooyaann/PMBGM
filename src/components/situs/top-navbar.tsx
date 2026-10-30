"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeCheck,
  BookOpen,
  Building2,
  ChevronDown,
  ClipboardList,
  Download,
  FolderOpen,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MapPin,
  Megaphone,
  Menu,
  Radar,
  Scale,
  School,
  Search,
  ShieldAlert,
  ShieldCheck,
  Siren,
  SlidersHorizontal,
  Timer,
  Truck,
  User,
  Users,
  Utensils,
  UtensilsCrossed,
  X,
  type LucideIcon,
} from "lucide-react";
import { keluar } from "@/lib/aksi/auth";
import type { Peran } from "@/lib/sesi";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface InfoAkunNavbar {
  id: string;
  nama: string;
  email: string | null;
  peran: Peran;
  peranLabel: string;
  terverifikasi: boolean;
  sekolahId: string | null;
  instansi: {
    id: string;
    nama: string;
    jenis: string;
  } | null;
}

interface ItemSubmenu {
  href: string;
  judul: string;
  deskripsi: string;
  ikon: LucideIcon;
  aksenIkon?: string;
  badge?: string;
}

interface MenuNavigasi {
  label: string;
  href?: string;
  submenus?: ItemSubmenu[];
}

const MENU_NAVIGASI: MenuNavigasi[] = [
  {
    label: "Lacak",
    submenus: [
      {
        href: "/lacak",
        judul: "Lacak Tiket",
        deskripsi: "Pantau perkembangan aduan via kode tiket unik",
        ikon: Search,
        aksenIkon: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
      },
      {
        href: "/lacak/akuntabilitas",
        judul: "Akuntabilitas SLA",
        deskripsi: "Kepatuhan batas waktu respon dapur & instansi",
        ikon: Scale,
        aksenIkon: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
        badge: "SLA",
      },
    ],
  },
  {
    label: "Sekolah",
    submenus: [
      {
        href: "/cari-sekolah",
        judul: "Cari Sekolah Anak",
        deskripsi: "Cek penerima MBG & status dapur penanggung jawab",
        ikon: School,
        aksenIkon: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
      },
      {
        href: "/data/sppg",
        judul: "Dapur SPPG",
        deskripsi: "Profil dapur, sertifikat SLHS, dan kapasitas porsi",
        ikon: UtensilsCrossed,
        aksenIkon: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      },
      {
        href: "/data/wilayah",
        judul: "Wilayah Kecamatan",
        deskripsi: "Sebaran operasional MBG se-Kota Semarang",
        ikon: MapPin,
        aksenIkon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      },
    ],
  },
  {
    label: "Insight",
    submenus: [
      {
        href: "/data/kasus",
        judul: "Kasus Terbuka",
        deskripsi: "Rekap aduan terverifikasi & status penyelesaian",
        ikon: FolderOpen,
        aksenIkon: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      },
      {
        href: "/insight",
        judul: "Peta Risiko SPPG",
        deskripsi: "Skor risiko komposit dapur metode SAW",
        ikon: Radar,
        aksenIkon: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
        badge: "SAW",
      },
      {
        href: "/insight/peringatan",
        judul: "Peringatan Dini",
        deskripsi: "Deteksi anomali keluhan 24 jam cegah KLB",
        ikon: Siren,
        aksenIkon: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
        badge: "24 Jam",
      },
      {
        href: "/insight/prioritas",
        judul: "Prioritas Inspeksi",
        deskripsi: "Sasaran audit lapangan Dinas Kesehatan",
        ikon: ShieldAlert,
        aksenIkon: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      },
      {
        href: "/data/unduh",
        judul: "Unduh Dataset",
        deskripsi: "Akses data format CSV & JSON untuk penelitian",
        ikon: Download,
        aksenIkon: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
      },
    ],
  },
  {
    label: "Panduan",
    submenus: [
      {
        href: "/panduan",
        judul: "Panduan Sistem",
        deskripsi: "Alur peran warga, verifikator, dan dapur",
        ikon: BookOpen,
        aksenIkon: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
      },
      {
        href: "/panduan#simulator-dss",
        judul: "Simulator DSS SAW",
        deskripsi: "Kalkulator simulasi risiko & Level A/B/C",
        ikon: SlidersHorizontal,
        aksenIkon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        badge: "Interaktif",
      },
      {
        href: "/metodologi",
        judul: "Metodologi Terbuka",
        deskripsi: "Formula SAW, eskalasi SLA, & model ANN",
        ikon: ShieldCheck,
        aksenIkon: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      },
      {
        href: "/faq",
        judul: "Tanya Jawab (FAQ)",
        deskripsi: "Pertanyaan yang sering diajukan masyarakat",
        ikon: HelpCircle,
        aksenIkon: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      },
    ],
  },
];

function lencanaPeran(peran: Peran, instansi: InfoAkunNavbar["instansi"]) {
  if (instansi?.jenis === "sppg") {
    return {
      label: "Dapur SPPG",
      sub: instansi.nama,
      klas: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
      ikon: Utensils,
    };
  }
  if (instansi?.jenis === "dinas_kesehatan") {
    return {
      label: "Dinas Kesehatan",
      sub: "Kota Semarang",
      klas: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
      ikon: ShieldAlert,
    };
  }
  if (instansi?.jenis === "korwil_bgn") {
    return {
      label: "Korwil BGN",
      sub: "Kota Semarang",
      klas: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
      ikon: Scale,
    };
  }
  if (peran === "verifikator") {
    return {
      label: "Verifikator",
      sub: "Wilayah Mandiri",
      klas: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
      ikon: ShieldCheck,
    };
  }
  if (peran === "admin") {
    return {
      label: "Administrator",
      sub: "Sistem PMBGM",
      klas: "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30",
      ikon: Building2,
    };
  }
  return null;
}

export function TopNavbar({ akun }: { akun: InfoAkunNavbar | null }) {
  const pathname = usePathname();
  const [mobileBuka, setMobileBuka] = useState(false);
  const [sedangKeluar, startKeluar] = useTransition();

  const tanganiKeluar = () => {
    startKeluar(async () => {
      await keluar();
      window.location.href = "/";
    });
  };

  // Jika sedang di dalam panel kerja staf, TopNavbar publik disembunyikan agar layout panel utuh
  if (pathname?.startsWith("/panel")) {
    return null;
  }

  const peranStaf = akun && akun.peran !== "pelapor" ? lencanaPeran(akun.peran, akun.instansi) : null;
  const inisial = akun
    ? akun.nama
        .split(/\s+/)
        .map((k) => k[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Sisi Kiri: Logo Resmi PMBGM */}
        <div className="flex items-center shrink-0">
          <Logo />
        </div>

        {/* Sisi Tengah: Navigasi Menu Desktop Tepat di Tengah (Center Aligned) */}
        <nav className="hidden lg:flex items-center gap-1.5 mx-auto" aria-label="Navigasi Utama">
          <Link
            href="/"
            className={cn(
              "rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0",
              pathname === "/"
                ? "bg-primary/10 text-primary font-bold"
                : "text-foreground/80 hover:bg-muted/70 hover:text-foreground"
            )}
          >
            Beranda
          </Link>

          {MENU_NAVIGASI.map((menu) => (
            <DropdownMenu key={menu.label}>
              <DropdownMenuTrigger
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors outline-none whitespace-nowrap shrink-0",
                  "text-foreground/80 hover:bg-muted/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer"
                )}
              >
                <span className="whitespace-nowrap">{menu.label}</span>
                <ChevronDown className="size-3.5 opacity-60 transition-transform duration-200" aria-hidden />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                sideOffset={8}
                className="w-88 rounded-2xl border border-border/80 bg-popover/95 p-2 shadow-xl backdrop-blur-md"
              >
                <div className="space-y-1">
                  {menu.submenus?.map((item) => {
                    const Ikon = item.ikon;
                    const aktif = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "group flex items-start gap-3 rounded-xl p-2.5 transition-colors outline-none",
                          aktif
                            ? "bg-primary/10 text-primary font-semibold"
                            : "hover:bg-muted/80 text-foreground"
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105",
                            item.aksenIkon || "bg-primary/10 text-primary"
                          )}
                        >
                          <Ikon className="size-4.5" aria-hidden />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold leading-tight group-hover:text-primary transition-colors">
                              {item.judul}
                            </span>
                            {item.badge && (
                              <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-extrabold text-primary">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1 leading-normal">
                            {item.deskripsi}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </nav>

        {/* Sisi Kanan: Pintasan Panel Peran, Tombol Lapor, & Profil Akun */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Pintasan Khusus Staf: Tampil mencolok jika staf sedang berada di halaman publik */}
          {peranStaf && (
            <Link
              href="/panel"
              className={cn(
                "hidden sm:inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-extrabold transition hover:shadow-xs whitespace-nowrap shrink-0",
                peranStaf.klas
              )}
              title={`Kembali ke Panel Kerja ${peranStaf.label}`}
            >
              <peranStaf.ikon className="size-3.5" aria-hidden />
              <span>Panel {peranStaf.label}</span>
            </Link>
          )}

          {/* Tombol Utama: Lapor Masalah (CTA Utama Warga) */}
          <Link
            href="/lapor"
            className={cn(
              buttonVariants({ size: "default" }),
              "rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm shadow-primary/20 gap-1.5 h-10 px-4 whitespace-nowrap shrink-0"
            )}
          >
            <Megaphone className="size-4" aria-hidden />
            <span className="hidden sm:inline">Lapor Masalah</span>
            <span className="sm:hidden">Lapor</span>
          </Link>

          {/* Profil / Masuk Pengguna */}
          {akun ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center gap-2 rounded-xl border border-border/80 bg-card p-1.5 pr-2.5 hover:bg-muted/70 transition outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/40 shrink-0"
                aria-label="Menu akun pengguna"
              >
                <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-black shrink-0">
                  {inisial}
                </span>
                <span className="hidden sm:inline text-xs font-bold text-foreground max-w-28 truncate">
                  {akun.nama.split(" ")[0]}
                </span>
                <ChevronDown className="size-3.5 opacity-60 shrink-0" aria-hidden />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="w-72 rounded-2xl p-2 shadow-xl">
                <DropdownMenuLabel className="p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-sm truncate">{akun.nama}</span>
                    {akun.terverifikasi && (
                      <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full shrink-0">
                        <BadgeCheck className="size-3 mr-0.5" /> Terverifikasi
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                    {akun.peranLabel}
                  </p>
                  {akun.instansi && (
                    <p className="text-[11px] text-primary font-bold mt-1 truncate">
                      🏢 {akun.instansi.nama}
                    </p>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {/* Menu Khusus Staf / Petugas Instansi, Verifikator, & Admin */}
                  {akun.peran !== "pelapor" && (
                    <>
                      <DropdownMenuItem
                        render={
                          <Link
                            href="/panel"
                            className="flex items-center gap-2 rounded-lg p-2 font-bold text-primary hover:bg-primary/10 cursor-pointer text-xs"
                          />
                        }
                      >
                        <LayoutDashboard className="size-4" /> Buka Panel Kerja
                      </DropdownMenuItem>

                      {/* Khusus Dapur SPPG */}
                      {akun.instansi?.jenis === "sppg" && (
                        <DropdownMenuItem
                          render={
                            <Link
                              href="/panel/kasus"
                              className="flex items-center gap-2 rounded-lg p-2 font-medium cursor-pointer text-xs"
                            />
                          }
                        >
                          <Utensils className="size-4 text-muted-foreground" /> Aduan Masuk Dapur
                        </DropdownMenuItem>
                      )}

                      {/* Khusus Dinas Kesehatan */}
                      {akun.instansi?.jenis === "dinas_kesehatan" && (
                        <>
                          <DropdownMenuItem
                            render={
                              <Link
                                href="/panel/kasus"
                                className="flex items-center gap-2 rounded-lg p-2 font-medium cursor-pointer text-xs"
                              />
                            }
                          >
                            <ShieldAlert className="size-4 text-muted-foreground" /> Investigasi Medis & KLB
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            render={
                              <Link
                                href="/panel/prioritas"
                                className="flex items-center gap-2 rounded-lg p-2 font-medium cursor-pointer text-xs"
                              />
                            }
                          >
                            <Radar className="size-4 text-muted-foreground" /> Prioritas Inspeksi Lapangan
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            render={
                              <Link
                                href="/panel/peringatan"
                                className="flex items-center gap-2 rounded-lg p-2 font-medium cursor-pointer text-xs"
                              />
                            }
                          >
                            <Siren className="size-4 text-muted-foreground" /> Sinyal Peringatan Dini
                          </DropdownMenuItem>
                        </>
                      )}

                      {/* Khusus Korwil BGN */}
                      {akun.instansi?.jenis === "korwil_bgn" && (
                        <>
                          <DropdownMenuItem
                            render={
                              <Link
                                href="/panel/akuntabilitas"
                                className="flex items-center gap-2 rounded-lg p-2 font-medium cursor-pointer text-xs"
                              />
                            }
                          >
                            <Scale className="size-4 text-muted-foreground" /> Papan Akuntabilitas SLA
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            render={
                              <Link
                                href="/panel/kasus"
                                className="flex items-center gap-2 rounded-lg p-2 font-medium cursor-pointer text-xs"
                              />
                            }
                          >
                            <ClipboardList className="size-4 text-muted-foreground" /> Kasus Wilayah Kota
                          </DropdownMenuItem>
                        </>
                      )}

                      {/* Khusus Verifikator */}
                      {akun.peran === "verifikator" && (
                        <DropdownMenuItem
                          render={
                            <Link
                              href="/panel/verifikasi"
                              className="flex items-center gap-2 rounded-lg p-2 font-medium cursor-pointer text-xs"
                            />
                          }
                        >
                          <ShieldCheck className="size-4 text-muted-foreground" /> Antrean Verifikasi Aduan
                        </DropdownMenuItem>
                      )}

                      {/* Khusus Admin Sistem */}
                      {akun.peran === "admin" && (
                        <>
                          <DropdownMenuItem
                            render={
                              <Link
                                href="/panel/admin/pengguna"
                                className="flex items-center gap-2 rounded-lg p-2 font-medium cursor-pointer text-xs"
                              />
                            }
                          >
                            <Users className="size-4 text-muted-foreground" /> Manajemen Pengguna & Guru
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            render={
                              <Link
                                href="/panel/admin/sla"
                                className="flex items-center gap-2 rounded-lg p-2 font-medium cursor-pointer text-xs"
                              />
                            }
                          >
                            <Timer className="size-4 text-muted-foreground" /> Konfigurasi Aturan SLA
                          </DropdownMenuItem>
                        </>
                      )}

                      <DropdownMenuItem
                        render={
                          <Link
                            href="/akun"
                            className="flex items-center gap-2 rounded-lg p-2 font-medium cursor-pointer text-xs"
                          />
                        }
                      >
                        <User className="size-4 text-muted-foreground" /> Profil Pengguna
                      </DropdownMenuItem>
                    </>
                  )}

                  {/* Menu Khusus Pelapor: Dibedakan antara Guru Sekolah vs Warga Umum */}
                  {akun.peran === "pelapor" && (
                    <>
                      {Boolean(akun.sekolahId) ? (
                        <>
                          <DropdownMenuItem
                            render={
                              <Link
                                href="/akun"
                                className="flex items-center gap-2 rounded-lg p-2 font-semibold text-primary cursor-pointer text-xs"
                              />
                            }
                          >
                            <School className="size-4 text-primary" /> Laporan & Sekolah Saya
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            render={
                              <Link
                                href={`/lapor?sekolahId=${akun.sekolahId}`}
                                className="flex items-center gap-2 rounded-lg p-2 font-medium cursor-pointer text-xs"
                              />
                            }
                          >
                            <Megaphone className="size-4 text-muted-foreground" /> Lapor Masalah MBG Sekolah
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            render={
                              <Link
                                href="/cari-sekolah"
                                className="flex items-center gap-2 rounded-lg p-2 font-medium cursor-pointer text-xs"
                              />
                            }
                          >
                            <Search className="size-4 text-muted-foreground" /> Cari & Pantau Sekolah
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem
                            render={
                              <Link
                                href="/akun"
                                className="flex items-center gap-2 rounded-lg p-2 font-semibold text-primary cursor-pointer text-xs"
                              />
                            }
                          >
                            <User className="size-4 text-primary" /> Laporan Saya & Profil
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            render={
                              <Link
                                href="/lapor"
                                className="flex items-center gap-2 rounded-lg p-2 font-medium cursor-pointer text-xs"
                              />
                            }
                          >
                            <Megaphone className="size-4 text-muted-foreground" /> Buat Laporan Baru
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            render={
                              <Link
                                href="/cari-sekolah"
                                className="flex items-center gap-2 rounded-lg p-2 font-medium cursor-pointer text-xs"
                              />
                            }
                          >
                            <School className="size-4 text-muted-foreground" /> Cari Sekolah Anak
                          </DropdownMenuItem>
                        </>
                      )}
                    </>
                  )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {/* Tombol Logout: Handled via Server Action useTransition, responsif & andal */}
                <div className="p-1">
                  <DropdownMenuItem
                    onClick={tanganiKeluar}
                    disabled={sedangKeluar}
                    className="flex w-full items-center gap-2 rounded-lg p-2 font-bold text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive cursor-pointer text-xs transition"
                  >
                    <LogOut className="size-4 shrink-0" />
                    <span>{sedangKeluar ? "Mengeluarkan akun..." : "Keluar dari Akun"}</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/masuk"
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "rounded-xl font-bold bg-card border-border/80 h-10 px-3.5 text-xs sm:text-sm hover:bg-muted"
              )}
            >
              Masuk
            </Link>
          )}

          {/* Tombol Hamburger Mobile (< lg) */}
          <Sheet open={mobileBuka} onOpenChange={setMobileBuka}>
            <SheetTrigger
              render={
                <button
                  type="button"
                  className="inline-flex lg:hidden size-10 items-center justify-center rounded-xl border border-border/80 bg-card text-foreground hover:bg-muted transition cursor-pointer"
                  aria-label="Buka menu navigasi mobile"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm p-0 flex flex-col justify-between">
              <SheetHeader className="border-b p-5 text-left">
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Info Akun Singkat di Mobile Drawer */}
                {akun ? (
                  <div className="rounded-2xl border bg-muted/40 p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm truncate">{akun.nama}</span>
                      {akun.terverifikasi && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0">
                          Terverifikasi
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{akun.peranLabel}</p>
                    {akun.instansi && (
                      <p className="text-[11px] text-primary font-semibold truncate">
                        🏢 {akun.instansi.nama}
                      </p>
                    )}
                    <div className="pt-1 flex flex-col gap-1.5">
                      {akun.peran !== "pelapor" ? (
                        <Link
                          href="/panel"
                          onClick={() => setMobileBuka(false)}
                          className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground"
                        >
                          <LayoutDashboard className="size-3.5" /> Buka Panel Kerja
                        </Link>
                      ) : (
                        <Link
                          href="/akun"
                          onClick={() => setMobileBuka(false)}
                          className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground"
                        >
                          <User className="size-3.5" /> Laporan Saya & Profil
                        </Link>
                      )}
                      <Link
                        href="/akun"
                        onClick={() => setMobileBuka(false)}
                        className="flex items-center justify-center gap-1.5 w-full rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
                      >
                        Pengaturan Profil
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/masuk"
                    onClick={() => setMobileBuka(false)}
                    className="flex items-center justify-center w-full rounded-xl border border-primary/30 bg-primary/5 py-2.5 text-sm font-bold text-primary"
                  >
                    Masuk ke Akun Anda
                  </Link>
                )}

                {/* Navigasi Mobile Terstruktur */}
                <div className="space-y-4">
                  <Link
                    href="/"
                    onClick={() => setMobileBuka(false)}
                    className={cn(
                      "block px-3 py-2 rounded-xl text-sm font-bold",
                      pathname === "/" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                    )}
                  >
                    Beranda
                  </Link>

                  {MENU_NAVIGASI.map((group) => (
                    <div key={group.label} className="space-y-1 pt-2">
                      <span className="px-3 text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                        {group.label}
                      </span>
                      <div className="space-y-0.5 mt-1">
                        {group.submenus?.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileBuka(false)}
                            className={cn(
                              "flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold transition",
                              pathname === item.href
                                ? "bg-primary/10 text-primary font-bold"
                                : "text-foreground/90 hover:bg-muted"
                            )}
                          >
                            <item.ikon className="size-4 text-muted-foreground shrink-0" />
                            <span className="truncate">{item.judul}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Drawer */}
              <div className="border-t p-4 bg-muted/30">
                {akun ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileBuka(false);
                      tanganiKeluar();
                    }}
                    disabled={sedangKeluar}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-destructive/10 py-2.5 text-xs font-bold text-destructive hover:bg-destructive/20 transition cursor-pointer disabled:opacity-50"
                  >
                    <LogOut className="size-3.5" />
                    <span>{sedangKeluar ? "Mengeluarkan akun..." : "Keluar dari Akun"}</span>
                  </button>
                ) : (
                  <Link
                    href="/lapor"
                    onClick={() => setMobileBuka(false)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-sm"
                  >
                    <Megaphone className="size-3.5" /> Buat Laporan Pengaduan
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
