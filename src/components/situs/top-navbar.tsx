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
  GitCompareArrows,
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
  Settings,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Timer,
  User,
  Users,
  Utensils,
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
  prefixes: string[];
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
    prefixes: ["/lacak"],
    submenus: [
      {
        href: "/lacak",
        judul: "Lacak Tiket",
        deskripsi: "Pantau status & hasil investigasi laporan",
        ikon: Search,
        aksenIkon: "bg-secondary text-primary",
      },
      {
        href: "/lacak/akuntabilitas",
        judul: "Kepatuhan SLA",
        deskripsi: "Batas waktu respon instansi & SPPG",
        ikon: Timer,
        aksenIkon: "bg-secondary text-primary",
      },
    ],
  },
  {
    label: "Data Terbuka",
    prefixes: ["/data", "/cari-sekolah"],
    submenus: [
      {
        href: "/data",
        judul: "Ringkasan Data",
        deskripsi: "Agregat anggaran & penerima manfaat",
        ikon: Building2,
        aksenIkon: "bg-secondary text-primary",
      },
      {
        href: "/data/wilayah",
        judul: "Sebaran Wilayah",
        deskripsi: "Distribusi kasus & alokasi 35 kab/kota",
        ikon: MapPin,
        aksenIkon: "bg-secondary text-primary",
      },
      {
        href: "/data/sppg",
        judul: "Dapur Mitra SPPG",
        deskripsi: "Daftar dapur & status sertifikasi SLHS",
        ikon: Utensils,
        aksenIkon: "bg-secondary text-primary",
      },
      {
        href: "/cari-sekolah",
        judul: "Cari Sekolah",
        deskripsi: "Daftar sekolah penerima & dapur mitra",
        ikon: School,
        aksenIkon: "bg-secondary text-primary",
      },
      {
        href: "/data/kasus",
        judul: "Kasus Pangan",
        deskripsi: "Statistik insiden keamanan pangan",
        ikon: FolderOpen,
        aksenIkon: "bg-secondary text-primary",
      },
      {
        href: "/data/unduh",
        judul: "Unduh & API",
        deskripsi: "Ekspor dataset terbuka (CSV / JSON)",
        ikon: Download,
        aksenIkon: "bg-secondary text-primary",
      },
    ],
  },
  {
    label: "Insight",
    prefixes: ["/insight"],
    submenus: [
      {
        href: "/insight",
        judul: "Peta Risiko",
        deskripsi: "Analisis spasial zonasi risiko SAW",
        ikon: Radar,
        badge: "SAW",
        aksenIkon: "bg-secondary text-primary",
      },
      {
        href: "/insight/prioritas",
        judul: "Prioritas Inspeksi",
        deskripsi: "Urutan SPPG berdasarkan skor risiko",
        ikon: ShieldAlert,
        aksenIkon: "bg-secondary text-primary",
      },
      {
        href: "/insight/peringatan",
        judul: "Peringatan Dini",
        deskripsi: "Deteksi anomali & lonjakan keluhan",
        ikon: Siren,
        badge: "24 Jam",
        aksenIkon: "bg-risiko-tinggi-lembut text-risiko-tinggi",
      },
      {
        href: "/insight/banding",
        judul: "Bandingkan",
        deskripsi: "Perbandingan kinerja SPPG & wilayah",
        ikon: GitCompareArrows,
        aksenIkon: "bg-secondary text-primary",
      },
    ],
  },
  {
    label: "Panduan",
    prefixes: ["/panduan", "/metodologi", "/faq", "/tentang", "/privasi"],
    submenus: [
      {
        href: "/panduan",
        judul: "Panduan & Kalkulator",
        deskripsi: "Alur pelaporan & simulator risiko SAW",
        ikon: BookOpen,
        aksenIkon: "bg-secondary text-primary",
      },
      {
        href: "/metodologi",
        judul: "Metodologi & SLA",
        deskripsi: "Bobot kriteria SAW & standar SLA",
        ikon: Scale,
        aksenIkon: "bg-secondary text-primary",
      },
      {
        href: "/faq",
        judul: "Tanya Jawab (FAQ)",
        deskripsi: "Jawaban pertanyaan umum seputar MBG",
        ikon: HelpCircle,
        aksenIkon: "bg-secondary text-primary",
      },
    ],
  },
];

// 2. MENU KHUSUS PERAN STAF (Top Navbar murni modul tugas operasional mereka)
const MENU_VERIFIKATOR: MenuItemPeran[] = [
  { href: "/panel", label: "Dasbor Panel", ikon: LayoutDashboard },
  { href: "/panel/verifikasi", label: "Antrean Verifikasi", ikon: ShieldCheck },
  { href: "/panel/kasus", label: "Kasus Berjalan", ikon: ClipboardList },
];

const MENU_DAPUR: MenuItemPeran[] = [
  { href: "/panel", label: "Dasbor Dapur", ikon: LayoutDashboard },
  { href: "/panel/kasus", label: "Aduan Masuk", ikon: Utensils },
  { href: "/data/sppg", label: "Rapor & SLHS", ikon: ShieldCheck },
  { href: "/cari-sekolah", label: "Sekolah Mitra", ikon: School },
];

const MENU_DINKES: MenuItemPeran[] = [
  { href: "/panel", label: "Dasbor Medis", ikon: LayoutDashboard },
  { href: "/panel/kasus", label: "Investigasi & KLB", ikon: ShieldAlert },
  { href: "/panel/prioritas", label: "Prioritas Inspeksi", ikon: Radar },
  { href: "/panel/peringatan", label: "Peringatan Dini", ikon: Siren },
];

const MENU_KORWIL: MenuItemPeran[] = [
  { href: "/panel", label: "Dasbor Wilayah", ikon: LayoutDashboard },
  { href: "/panel/kasus", label: "Kasus Wilayah", ikon: ClipboardList },
  { href: "/panel/akuntabilitas", label: "Akuntabilitas SLA", ikon: Scale },
  { href: "/insight", label: "Peta Risiko Wilayah", ikon: Radar },
];

const MENU_ADMIN: MenuItemPeran[] = [
  { href: "/panel", label: "Dasbor Admin", ikon: LayoutDashboard },
  { href: "/panel/admin/pengguna", label: "Kelola Pengguna", ikon: Users },
  { href: "/panel/admin/sla", label: "Aturan SLA", ikon: Timer },
  { href: "/panel/kasus", label: "Semua Kasus", ikon: ClipboardList },
];

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
      klas: "bg-secondary text-primary border-primary/25",
      ikon: ShieldCheck,
    };
  } else if (adalahDapur) {
    menuStaf = MENU_DAPUR;
    badgePeranStaf = {
      label: "Dapur SPPG",
      klas: "bg-risiko-sedang-lembut text-risiko-sedang border-risiko-sedang/25",
      ikon: Utensils,
    };
  } else if (adalahDinkes) {
    menuStaf = MENU_DINKES;
    badgePeranStaf = {
      label: "Dinas Kesehatan",
      klas: "bg-risiko-tinggi-lembut text-risiko-tinggi border-risiko-tinggi/25",
      ikon: ShieldAlert,
    };
  } else if (adalahKorwil) {
    menuStaf = MENU_KORWIL;
    badgePeranStaf = {
      label: "Korwil BGN",
      klas: "bg-info-lembut text-info border-info/25",
      ikon: Scale,
    };
  } else if (adalahAdmin) {
    menuStaf = MENU_ADMIN;
    badgePeranStaf = {
      label: "Administrator",
      klas: "bg-secondary text-primary border-primary/25",
      ikon: Building2,
    };
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Sisi Kiri: Logo Resmi PMBGM */}
        <div className="flex items-center shrink-0">
          <Logo />
        </div>

        {/* Sisi Tengah: Navigasi Desktop Terpusat Simetris (mx-auto) */}
        <nav className="hidden lg:flex items-center gap-1 mx-auto" aria-label="Navigasi Utama">
          {menuStaf ? (
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
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-foreground/80 hover:bg-muted/70 hover:text-foreground"
                  )}
                >
                  <Ikon className="size-4" aria-hidden />
                  <span>{item.label}</span>
                </Link>
              );
            })
          ) : (
            // NAVIGASI PUBLIK UNTUK WARGA / TAMU / GURU
            <>
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

              {MENU_PUBLIK.map((menu) => {
                const grupAktif = menu.prefixes.some(
                  (pref) => pathname === pref || pathname?.startsWith(`${pref}/`)
                );
                return (
                  <DropdownMenu key={menu.label}>
                    <DropdownMenuTrigger
                      className={cn(
                        "flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors outline-none whitespace-nowrap shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/40",
                        grupAktif
                          ? "bg-primary/10 text-primary font-bold"
                          : "text-foreground/80 hover:bg-muted/70 hover:text-foreground"
                      )}
                    >
                      <span className="whitespace-nowrap">{menu.label}</span>
                      <ChevronDown className="size-3.5 opacity-60 transition-transform duration-200" aria-hidden />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="center"
                      sideOffset={8}
                      className="w-80 rounded-2xl border border-border/80 bg-popover/98 p-2 shadow-xl backdrop-blur-md"
                    >
                      <div className="space-y-0.5">
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
                                  : "hover:bg-muted/70 text-foreground"
                              )}
                            >
                              <span
                                className={cn(
                                  "flex size-9 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105",
                                  item.aksenIkon || "bg-secondary text-primary"
                                )}
                              >
                                <Ikon className="size-4" aria-hidden />
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-sm font-bold leading-tight group-hover:text-primary transition-colors">
                                    {item.judul}
                                  </span>
                                  {item.badge && (
                                    <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-extrabold text-primary">
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
                );
              })}
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
                    <p className="text-[11px] text-primary font-bold mt-1 truncate flex items-center gap-1">
                      <Building2 className="size-3 text-primary shrink-0" />
                      <span className="truncate">{akun.instansi.nama}</span>
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
                    // Menu Profil Khusus Staf Operasional (Murni Tugas & Bantuan)
                    <>
                      <Link
                        href="/panduan"
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
                      >
                        <BookOpen className="size-4 text-primary shrink-0" />
                        <span>Panduan Operasional</span>
                      </Link>
                      <Link
                        href="/akun"
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
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
                      <p className="text-[11px] text-primary font-semibold truncate flex items-center gap-1">
                        <Building2 className="size-3 text-primary shrink-0" />
                        <span className="truncate">{akun.instansi.nama}</span>
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
                  {menuStaf ? (
                    // Menu Mobile untuk Staf (Hanya Tugas Inti)
                    <div className="space-y-1">
                      <div className="px-3 pb-1">
                        <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                          Modul Tugas {badgePeranStaf?.label ?? "Staf"}
                        </span>
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
                      <div className="pt-2 border-t mt-2">
                        <Link
                          href="/panduan"
                          onClick={() => setMobileBuka(false)}
                          className={cn(
                            "flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold transition",
                            pathname === "/panduan" ? "bg-primary/10 text-primary font-bold" : "text-foreground hover:bg-muted"
                          )}
                        >
                          <BookOpen className="size-4 text-muted-foreground shrink-0" />
                          <span>Panduan Operasional</span>
                        </Link>
                        <Link
                          href="/akun"
                          onClick={() => setMobileBuka(false)}
                          className={cn(
                            "flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold transition",
                            pathname === "/akun" ? "bg-primary/10 text-primary font-bold" : "text-foreground hover:bg-muted"
                          )}
                        >
                          <Settings className="size-4 text-muted-foreground shrink-0" />
                          <span>Profil & Pengaturan Akun</span>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    // Menu Mobile Publik
                    <>
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
