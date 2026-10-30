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
  Globe,
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
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
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

interface MenuNavigasiGrup {
  label: string;
  submenus?: {
    href: string;
    judul: string;
    deskripsi: string;
    ikon: LucideIcon;
    badge?: string;
    aksenIkon?: string;
  }[];
}

interface MenuItemPeran {
  href: string;
  label: string;
  ikon: LucideIcon;
}

// 1. MENU UNTUK PUBLIK / WARGA
const MENU_PUBLIK: MenuNavigasiGrup[] = [
  {
    label: "Lacak",
    submenus: [
      {
        href: "/lacak",
        judul: "Lacak Tiket Aduan",
        deskripsi: "Pantau progres investigasi dan bukti tindak lanjut terbuka",
        ikon: Search,
        aksenIkon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      },
      {
        href: "/lacak/akuntabilitas",
        judul: "Akuntabilitas SLA",
        deskripsi: "Rekam jejak batas waktu tindak lanjut per SPPG & dinas",
        ikon: Timer,
        aksenIkon: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
      },
    ],
  },
  {
    label: "Data Terbuka",
    submenus: [
      {
        href: "/data",
        judul: "Ringkasan Data Terbuka",
        deskripsi: "Ringkasan agregat nasional, metrik aduan, dan tren kepatuhan",
        ikon: Building2,
        aksenIkon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      },
      {
        href: "/data/wilayah",
        judul: "Data Wilayah & Agregat",
        deskripsi: "Rasio aduan, alokasi anggaran, dan sebaran per kecamatan",
        ikon: MapPin,
        aksenIkon: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
      },
      {
        href: "/data/sppg",
        judul: "Dapur SPPG & SLHS",
        deskripsi: "Status sertifikat higienitas pangan (SLHS) dan kepatuhan dapur",
        ikon: Utensils,
        aksenIkon: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      },
      {
        href: "/cari-sekolah",
        judul: "Sekolah Penerima MBG",
        deskripsi: "Daftar sekolah penerima, SPPG penanggung jawab, dan kasus",
        ikon: School,
        aksenIkon: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      },
      {
        href: "/data/kasus",
        judul: "Arsip Kasus Terbuka",
        deskripsi: "Riwayat kasus dan transparansi audit lapangan yang telah selesai",
        ikon: FolderOpen,
        aksenIkon: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      },
      {
        href: "/data/unduh",
        judul: "Unduh Dataset Terbuka",
        deskripsi: "Unduh data mentah format CSV/Excel untuk riset dan publik",
        ikon: Download,
        aksenIkon: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      },
    ],
  },
  {
    label: "Insight",
    submenus: [
      {
        href: "/insight",
        judul: "Peta Risiko Wilayah",
        deskripsi: "Analisis spasial SAW (Simple Additive Weighting) per kecamatan",
        ikon: Radar,
        badge: "SAW",
        aksenIkon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      },
      {
        href: "/insight/peringatan",
        judul: "Peringatan Dini",
        deskripsi: "Deteksi anomali lonjakan keluhan sebelum menjadi KLB",
        ikon: Siren,
        badge: "24 Jam",
        aksenIkon: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      },
      {
        href: "/insight/prioritas",
        judul: "Prioritas Investigasi",
        deskripsi: "Peringkat kasus yang paling mendesak diaudit lapangan",
        ikon: ShieldAlert,
        aksenIkon: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      },
    ],
  },
  {
    label: "Panduan",
    submenus: [
      {
        href: "/panduan",
        judul: "Panduan & Simulator DSS",
        deskripsi: "Cara melapor, simulasi perhitungan SAW, dan kriteria bobot",
        ikon: BookOpen,
        aksenIkon: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
      },
      {
        href: "/metodologi",
        judul: "Metodologi & SLA",
        deskripsi: "Kriteria penilaian, bobot SAW, dan batas waktu tindak lanjut",
        ikon: Scale,
        aksenIkon: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      },
      {
        href: "/faq",
        judul: "Tanya Jawab (FAQ)",
        deskripsi: "Pertanyaan yang sering diajukan seputar program MBG",
        ikon: HelpCircle,
        aksenIkon: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
      },
    ],
  },
];

// 2. MENU KHUSUS PERAN STAF (Top Navbar langsung berfungsi sebagai menu tugas inti mereka)
const MENU_VERIFIKATOR: MenuItemPeran[] = [
  { href: "/panel/verifikasi", label: "Antrean Verifikasi", ikon: ShieldCheck },
  { href: "/panel/kasus", label: "Kasus Berjalan", ikon: ClipboardList },
  { href: "/insight", label: "Analisis Risiko (SAW)", ikon: Radar },
  { href: "/data/sppg", label: "Data SPPG & Dapur", ikon: Utensils },
  { href: "/panduan", label: "Panduan", ikon: HelpCircle },
];

const MENU_DAPUR: MenuItemPeran[] = [
  { href: "/panel", label: "Dasbor Dapur", ikon: LayoutDashboard },
  { href: "/panel/kasus", label: "Aduan Masuk", ikon: Utensils },
  { href: "/data/sppg", label: "Rapor & SLHS", ikon: ShieldCheck },
  { href: "/cari-sekolah", label: "Sekolah Mitra", ikon: School },
  { href: "/panduan", label: "Panduan Higiene", ikon: HelpCircle },
];

const MENU_DINKES: MenuItemPeran[] = [
  { href: "/panel", label: "Dasbor Medis", ikon: LayoutDashboard },
  { href: "/panel/kasus", label: "Investigasi & KLB", ikon: ShieldAlert },
  { href: "/panel/prioritas", label: "Prioritas Inspeksi", ikon: Radar },
  { href: "/panel/peringatan", label: "Peringatan Dini", ikon: Siren },
  { href: "/data/sppg", label: "Evaluasi SPPG", ikon: Utensils },
];

const MENU_KORWIL: MenuItemPeran[] = [
  { href: "/panel", label: "Pengawasan Wilayah", ikon: LayoutDashboard },
  { href: "/panel/akuntabilitas", label: "Akuntabilitas SLA", ikon: Scale },
  { href: "/insight", label: "Peta Risiko Wilayah", ikon: Radar },
  { href: "/panel/kasus", label: "Kasus Wilayah", ikon: ClipboardList },
  { href: "/data/sppg", label: "Data Dapur SPPG", ikon: Utensils },
];

const MENU_ADMIN: MenuItemPeran[] = [
  { href: "/panel", label: "Dasbor Admin", ikon: LayoutDashboard },
  { href: "/panel/admin/pengguna", label: "Kelola Pengguna", ikon: Users },
  { href: "/panel/admin/sla", label: "Aturan SLA", ikon: Timer },
  { href: "/panel/kasus", label: "Semua Kasus", ikon: ClipboardList },
  { href: "/data", label: "Master Data", ikon: Building2 },
];

export function TopNavbar({ akun }: { akun: InfoAkunNavbar | null }) {
  const pathname = usePathname();
  const [mobileBuka, setMobileBuka] = useState(false);
  const [modeBiasa, setModeBiasa] = useState(false);
  const [sedangKeluar, startKeluar] = useTransition();

  const tanganiKeluar = () => {
    startKeluar(async () => {
      await keluar();
      window.location.href = "/";
    });
  };

  const inisial = akun
    ? akun.nama
        .split(/\s+/)
        .map((k) => k[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  // Tentukan apakah pengguna adalah staf & jenis stafnya
  const adalahVerifikator = akun?.peran === "verifikator";
  const jenisInstansi = akun?.instansi?.jenis;
  const adalahDapur = jenisInstansi === "sppg";
  const adalahDinkes = jenisInstansi === "dinas_kesehatan";
  const adalahKorwil = jenisInstansi === "korwil_bgn";
  const adalahAdmin = akun?.peran === "admin";
  const adalahStaf = adalahVerifikator || adalahDapur || adalahDinkes || adalahKorwil || adalahAdmin;
  const adalahGuru = akun?.peran === "pelapor" && Boolean(akun.sekolahId);

  // Ambil daftar menu kerja staf jika staf, atau null jika pelapor/publik
  let menuStaf: MenuItemPeran[] | null = null;
  let badgePeranStaf: { label: string; klas: string; ikon: LucideIcon } | null = null;

  if (adalahVerifikator) {
    menuStaf = MENU_VERIFIKATOR;
    badgePeranStaf = {
      label: "Tim Verifikator",
      klas: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30",
      ikon: ShieldCheck,
    };
  } else if (adalahDapur) {
    menuStaf = MENU_DAPUR;
    badgePeranStaf = {
      label: "Dapur SPPG",
      klas: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
      ikon: Utensils,
    };
  } else if (adalahDinkes) {
    menuStaf = MENU_DINKES;
    badgePeranStaf = {
      label: "Dinas Kesehatan",
      klas: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30",
      ikon: ShieldAlert,
    };
  } else if (adalahKorwil) {
    menuStaf = MENU_KORWIL;
    badgePeranStaf = {
      label: "Korwil BGN",
      klas: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
      ikon: Scale,
    };
  } else if (adalahAdmin) {
    menuStaf = MENU_ADMIN;
    badgePeranStaf = {
      label: "Administrator",
      klas: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30",
      ikon: Building2,
    };
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/95 backdrop-blur-md transition-all shadow-2xs">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Sisi Kiri: Logo Resmi PMBGM */}
        <div className="flex items-center shrink-0">
          <Logo />
        </div>

        {/* Sisi Tengah: Navigasi Desktop Terpusat Simetris (mx-auto) */}
        <nav className="hidden lg:flex items-center gap-1.5 mx-auto" aria-label="Navigasi Utama">
          {menuStaf && !modeBiasa ? (
            // NAVIGASI LANGSUNG TUGAS INTI STAF (Navbar Top Bersih Spesifik Tugas)
            menuStaf.map((item) => {
              const aktif = pathname === item.href || (item.href !== "/panel" && pathname?.startsWith(item.href));
              const Ikon = item.ikon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0",
                    aktif
                      ? "bg-primary/10 text-primary font-bold shadow-2xs"
                      : "text-foreground/80 hover:bg-muted/70 hover:text-foreground"
                  )}
                >
                  <Ikon className="size-4" aria-hidden />
                  <span>{item.label}</span>
                </Link>
              );
            })
          ) : (
            // NAVIGASI PUBLIK / MODE MENU BIASA
            <>
              {adalahStaf && modeBiasa && (
                <button
                  type="button"
                  onClick={() => setModeBiasa(false)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 px-3 py-1.5 text-xs font-bold mr-1 cursor-pointer hover:bg-amber-500/25 transition"
                  title="Kembali ke navigasi tugas panel kerja"
                >
                  <LayoutDashboard className="size-3.5" />
                  <span>Kembali ke Tugas</span>
                </button>
              )}

              <Link
                href="/"
                className={cn(
                  "rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0",
                  pathname === "/"
                    ? "bg-primary/10 text-primary font-bold shadow-2xs"
                    : "text-foreground/80 hover:bg-muted/70 hover:text-foreground"
                )}
              >
                Beranda
              </Link>

              {MENU_PUBLIK.map((menu) => (
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
            </>
          )}
        </nav>

        {/* Sisi Kanan: Status Staf / Tombol CTA Lapor / Profil Akun */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Label peran staf dihapus dari navbar atas sesuai revisi, ditampilkan di dalam popup profil */}

          {/* Tombol Utama: Lapor Masalah (Hanya tampil untuk Warga / Tamu / Guru) */}
          {!adalahStaf && (
            <Link
              href={adalahGuru ? `/lapor?sekolahId=${akun.sekolahId}` : "/lapor"}
              className={cn(
                buttonVariants({ size: "default" }),
                "rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm shadow-primary/20 gap-1.5 h-10 px-4 whitespace-nowrap shrink-0"
              )}
            >
              <Megaphone className="size-4" aria-hidden />
              <span className="hidden sm:inline">
                {adalahGuru ? "Lapor MBG Sekolah" : "Lapor Masalah"}
              </span>
              <span className="sm:hidden">Lapor</span>
            </Link>
          )}

          {/* Profil Akun / Masuk Pengguna */}
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
              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-72 rounded-2xl border border-border/80 bg-popover/95 p-2 shadow-xl backdrop-blur-md"
              >
                {/* Header Profil */}
                <div className="p-2.5 border-b border-border/60">
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
                  {/* Badge Peran Staf di dalam popup profil */}
                  {badgePeranStaf && (
                    <div className="mt-2 flex items-center">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold",
                          badgePeranStaf.klas
                        )}
                      >
                        <badgePeranStaf.ikon className="size-3" aria-hidden />
                        <span>{badgePeranStaf.label}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Daftar Menu Dropdown Menggunakan Link Murni (Bebas Error & Langsung Navigasi) */}
                <div className="p-1 space-y-1">
                  {adalahStaf ? (
                    // Menu Profil untuk Staf / Petugas
                    <>
                      <Link
                        href="/panel"
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-primary hover:bg-primary/10 transition"
                      >
                        <LayoutDashboard className="size-4 shrink-0" />
                        <span>Buka Dasbor Panel Kerja</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => setModeBiasa((m) => !m)}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-foreground hover:bg-muted transition text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Globe className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>{modeBiasa ? "Kembali ke Menu Tugas" : "Lihat Menu Biasa (Menu Lainnya)"}</span>
                        </div>
                        <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          {modeBiasa ? "Tugas" : "Warga"}
                        </span>
                      </button>
                      <Link
                        href="/"
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition"
                      >
                        <BookOpen className="size-4 text-muted-foreground shrink-0" />
                        <span>Buka Beranda Publik</span>
                      </Link>
                      <Link
                        href="/akun"
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition"
                      >
                        <User className="size-4 text-muted-foreground shrink-0" />
                        <span>Profil & Pengaturan Akun</span>
                      </Link>
                    </>
                  ) : adalahGuru ? (
                    // Menu Profil untuk Guru Sekolah Binaan (Pak Budi)
                    <>
                      <Link
                        href="/akun"
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10 transition"
                      >
                        <School className="size-4 shrink-0" />
                        <span>Laporan & Sekolah Saya</span>
                      </Link>
                      <Link
                        href={`/lapor?sekolahId=${akun.sekolahId}`}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition"
                      >
                        <Megaphone className="size-4 text-muted-foreground shrink-0" />
                        <span>Lapor Masalah MBG Sekolah</span>
                      </Link>
                      <Link
                        href="/cari-sekolah"
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition"
                      >
                        <Search className="size-4 text-muted-foreground shrink-0" />
                        <span>Pantau Sekolah Binaan</span>
                      </Link>
                    </>
                  ) : (
                    // Menu Profil untuk Warga / Orang Tua (Ibu Rina)
                    <>
                      <Link
                        href="/akun"
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10 transition"
                      >
                        <User className="size-4 shrink-0" />
                        <span>Laporan Saya & Riwayat</span>
                      </Link>
                      <Link
                        href="/lapor"
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition"
                      >
                        <Megaphone className="size-4 text-muted-foreground shrink-0" />
                        <span>Buat Laporan Aduan Baru</span>
                      </Link>
                      <Link
                        href="/cari-sekolah"
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition"
                      >
                        <School className="size-4 text-muted-foreground shrink-0" />
                        <span>Cari Sekolah & Dapur Anak</span>
                      </Link>
                    </>
                  )}
                </div>

                <div className="border-t border-border/60 p-1">
                  <button
                    type="button"
                    onClick={tanganiKeluar}
                    disabled={sedangKeluar}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-destructive hover:bg-destructive/10 transition cursor-pointer disabled:opacity-50"
                  >
                    <LogOut className="size-4 shrink-0" />
                    <span>{sedangKeluar ? "Mengeluarkan akun..." : "Keluar dari Akun"}</span>
                  </button>
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
                      {adalahStaf ? (
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
                  {menuStaf && !modeBiasa ? (
                    // Menu Mobile untuk Staf (Hanya Tugas Inti)
                    <div className="space-y-1">
                      <div className="flex items-center justify-between px-3 pb-1">
                        <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                          Modul Tugas Staf
                        </span>
                        <button
                          type="button"
                          onClick={() => setModeBiasa(true)}
                          className="text-xs font-bold text-primary hover:underline cursor-pointer"
                        >
                          Menu Biasa →
                        </button>
                      </div>
                      {menuStaf.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileBuka(false)}
                          className={cn(
                            "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition",
                            pathname === item.href ? "bg-primary/10 text-primary font-bold" : "text-foreground hover:bg-muted"
                          )}
                        >
                          <item.ikon className="size-4 text-muted-foreground shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    // Menu Mobile Publik / Mode Menu Biasa
                    <>
                      {adalahStaf && modeBiasa && (
                        <div className="px-3 pb-1">
                          <button
                            type="button"
                            onClick={() => setModeBiasa(false)}
                            className="flex items-center gap-1.5 w-full justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 py-2 text-xs font-bold"
                          >
                            <LayoutDashboard className="size-3.5" /> Kembali ke Tugas Staf
                          </button>
                        </div>
                      )}

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

                      {MENU_PUBLIK.map((group) => (
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
                    </>
                  )}
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
