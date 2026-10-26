"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  FolderKanban,
  Globe,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeft,
  PanelLeftClose,
  Radar,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Timer,
  Users,
  Utensils,
  X,
  type LucideIcon,
} from "lucide-react";
import { Bertip } from "@/components/ui/bertip";
import { TandaLogo } from "@/components/situs/logo";
import { keluar } from "@/lib/aksi/auth";
import type { Peran } from "@/lib/sesi";
import { cn } from "@/lib/utils";

export interface InfoPenggunaPanel {
  id: string;
  nama: string;
  email: string | null;
  peran: Peran;
}

export interface InfoInstansiPanel {
  id: string;
  nama: string;
  jenis: string;
  sppgId: string | null;
}

interface ItemMenu {
  href: string;
  label: string;
  ikon: LucideIcon;
  keterangan?: string;
}

function ambilMenuPeran(peran: Peran, instansi: InfoInstansiPanel | null): ItemMenu[] {
  // 1. Dapur SPPG MBG
  if (instansi?.jenis === "sppg") {
    const menu: ItemMenu[] = [
      { href: "/panel", label: "Dasbor Dapur", ikon: LayoutDashboard },
      { href: "/panel/kasus", label: "Aduan Dapur Saya", ikon: FolderKanban },
      { href: "/lacak/akuntabilitas", label: "Papan Akuntabilitas", ikon: Scale },
    ];
    if (instansi.sppgId) {
      menu.push({ href: `/data/sppg/${instansi.sppgId}`, label: "Profil & SLHS", ikon: Utensils });
    }
    return menu;
  }

  // 2. Dinas Kesehatan
  if (instansi?.jenis === "dinas_kesehatan") {
    return [
      { href: "/panel", label: "Dasbor Wilayah", ikon: LayoutDashboard },
      { href: "/panel/kasus", label: "Kasus & Keracunan", ikon: ShieldAlert },
      { href: "/insight/peringatan", label: "Peringatan Dini", ikon: Siren },
      { href: "/insight/prioritas", label: "Prioritas Inspeksi", ikon: Radar },
    ];
  }

  // 3. Korwil BGN
  if (instansi?.jenis === "korwil_bgn") {
    return [
      { href: "/panel", label: "Dasbor Pengawasan", ikon: LayoutDashboard },
      { href: "/panel/kasus", label: "Kasus Wilayah", ikon: FolderKanban },
      { href: "/insight/peringatan", label: "Peringatan Dini", ikon: Siren },
      { href: "/lacak/akuntabilitas", label: "Papan Akuntabilitas", ikon: Scale },
    ];
  }

  // 4. Verifikator Independen
  if (peran === "verifikator") {
    return [
      { href: "/panel", label: "Beranda Verifikasi", ikon: LayoutDashboard },
      { href: "/panel/verifikasi", label: "Antrean Laporan", ikon: Inbox },
      { href: "/panel/kasus", label: "Daftar Kasus", ikon: FolderKanban },
    ];
  }

  // 5. Admin Sistem
  return [
    { href: "/panel", label: "Dasbor Admin", ikon: LayoutDashboard },
    { href: "/panel/admin/pengguna", label: "Pengguna & Guru", ikon: Users },
    { href: "/panel/admin/sla", label: "Batas Waktu (SLA)", ikon: Timer },
    { href: "/panel/kasus", label: "Semua Kasus", ikon: FolderKanban },
  ];
}

function ambilTemaPeran(peran: Peran, instansi: InfoInstansiPanel | null) {
  if (instansi?.jenis === "sppg") {
    return {
      judulPeran: "Dapur SPPG",
      subLabel: instansi.nama,
      badgeKls: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30",
      ikon: Utensils,
    };
  }
  if (instansi?.jenis === "dinas_kesehatan") {
    return {
      judulPeran: "Dinas Kesehatan",
      subLabel: instansi.nama,
      badgeKls: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30",
      ikon: ShieldAlert,
    };
  }
  if (instansi?.jenis === "korwil_bgn") {
    return {
      judulPeran: "Korwil BGN",
      subLabel: instansi.nama,
      badgeKls: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
      ikon: Scale,
    };
  }
  if (peran === "verifikator") {
    return {
      judulPeran: "Verifikator",
      subLabel: "Konsorsium Independen",
      badgeKls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
      ikon: ShieldCheck,
    };
  }
  return {
    judulPeran: "Administrator",
    subLabel: "Sistem PMBGM",
    badgeKls: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30",
    ikon: Building2,
  };
}

export function SidebarPanel({
  pengguna,
  instansi,
}: {
  pengguna: InfoPenggunaPanel;
  instansi: InfoInstansiPanel | null;
}) {
  const [mobileBuka, setMobileBuka] = useState(false);
  const [desktopSembunyi, setDesktopSembunyi] = useState(false);
  const pathname = usePathname();
  const menu = ambilMenuPeran(pengguna.peran, instansi);
  const tema = ambilTemaPeran(pengguna.peran, instansi);
  const IkonTema = tema.ikon;

  // Preferensi hide/show dari localStorage
  useEffect(() => {
    try {
      const tersimpan = localStorage.getItem("pantaugizi_panel_sidebar_tersembunyi");
      if (tersimpan === "true") setDesktopSembunyi(true);
    } catch {}
  }, []);

  const toggleSidebar = () => {
    setDesktopSembunyi((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("pantaugizi_panel_sidebar_tersembunyi", String(next));
      } catch {}
      return next;
    });
  };

  // Keyboard shortcut Ctrl+B atau Cmd+B
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        const target = e.target as HTMLElement | null;
        if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      {/* Mobile Top Bar (selalu standby dan mudah diakses di panel) */}
      <div className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b bg-card px-4 lg:hidden">
        <div className="flex items-center gap-2.5">
          <TandaLogo className="size-7" />
          <span className="font-black text-sm tracking-tight">
            <span className="text-teal-600">P</span>MBG<span className="text-emerald-600">M</span> Panel
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileBuka(!mobileBuka)}
          className="inline-flex size-9 items-center justify-center rounded-lg border bg-background text-foreground hover:bg-muted transition-colors cursor-pointer"
          aria-label={mobileBuka ? "Tutup menu" : "Buka menu"}
        >
          {mobileBuka ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Backdrop Mobile */}
      {mobileBuka && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileBuka(false)}
          aria-hidden
        />
      )}

      {/* Sidebar Kontainer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-card shadow-lg transition-all duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:z-auto lg:shrink-0 lg:shadow-none",
          mobileBuka ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          desktopSembunyi
            ? "lg:w-0 lg:p-0 lg:border-none lg:overflow-hidden lg:opacity-0 lg:pointer-events-none"
            : "lg:w-64 xl:w-72 lg:opacity-100"
        )}
      >
        <div className={cn("flex h-full flex-col justify-between w-72 lg:w-64 xl:w-72 transition-opacity duration-200", desktopSembunyi && "lg:opacity-0")}>
          <div className="flex-1 flex flex-col min-h-0">
            {/* Header Sidebar: Logo & Identitas Peran */}
            <div className="border-b p-5 shrink-0">
              <div className="flex items-center justify-between">
                <Link href="/" className="group flex items-center gap-2.5">
                  <TandaLogo className="size-8" />
                  <div className="flex flex-col leading-none">
                    <span className="text-lg font-black tracking-tight">
                      <span className="text-teal-600">P</span>
                      <span className="text-foreground">MBG</span>
                      <span className="text-emerald-600">M</span>
                    </span>
                    <span className="mt-0.5 text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
                      Panel Kerja
                    </span>
                  </div>
                </Link>
                {/* Tombol Tutup di Mobile & Tombol Sembunyikan di Desktop */}
                <button
                  type="button"
                  onClick={() => setMobileBuka(false)}
                  className="inline-flex size-8 items-center justify-center rounded-xl border border-border/70 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors lg:hidden cursor-pointer"
                  aria-label="Tutup menu"
                >
                  <X className="size-4" />
                </button>
                <Bertip
                  label="Sembunyikan menu (Ctrl+B)"
                  sisi="right"
                  render={
                    <button
                      type="button"
                      onClick={toggleSidebar}
                      className="hidden lg:inline-flex size-8 items-center justify-center rounded-xl border border-border/70 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer"
                      aria-label="Sembunyikan menu"
                    />
                  }
                >
                  <PanelLeftClose className="size-4" />
                </Bertip>
              </div>

              {/* Badge Peran Kerja */}
              <div className={cn("mt-4 flex items-start gap-2.5 rounded-xl border p-2.5", tema.badgeKls)}>
                <IkonTema className="mt-0.5 size-4 shrink-0" aria-hidden />
                <div className="min-w-0 flex-1 leading-tight">
                  <span className="block text-xs font-bold">{tema.judulPeran}</span>
                  <span className="block truncate text-[11px] opacity-85">{tema.subLabel}</span>
                </div>
              </div>
            </div>

            {/* Daftar Navigasi Menu */}
            <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Menu panel kerja">
              {menu.map((m) => {
                const aktif = pathname === m.href || (m.href !== "/panel" && Boolean(pathname?.startsWith(m.href)));
                const IkonItem = m.ikon;
                return (
                  <Link
                    key={m.href}
                    href={m.href}
                    onClick={() => setMobileBuka(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                      aktif
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <IkonItem className="size-4 shrink-0" aria-hidden />
                    <span className="truncate">{m.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer Sidebar: User info, public site & logout */}
          <div className="border-t p-3 space-y-1 bg-muted/20 shrink-0">
            <div className="flex items-center gap-2.5 px-3 py-2 text-xs text-muted-foreground">
              <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-[11px]">
                {pengguna.nama.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1 leading-tight">
                <span className="block truncate font-semibold text-foreground">{pengguna.nama}</span>
                <span className="block truncate text-[10px] text-muted-foreground">{pengguna.email ?? "Akun Staf"}</span>
              </div>
            </div>

            <Link
              href="/"
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <Globe className="size-3.5" aria-hidden /> Lihat Web Publik
            </Link>

            <form action={keluar}>
              <button
                type="submit"
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 transition hover:bg-rose-500/10 dark:text-rose-400 cursor-pointer"
              >
                <LogOut className="size-3.5" aria-hidden /> Keluar
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Tombol Floating untuk Membuka Kembali Sidebar Panel (Show) saat Tersembunyi */}
      {desktopSembunyi && (
        <div className="fixed top-3.5 left-4 z-40 hidden lg:block animate-in fade-in zoom-in-95 duration-200">
          <Bertip
            label="Tampilkan menu panel (Ctrl+B)"
            sisi="right"
            render={
              <button
                type="button"
                onClick={toggleSidebar}
                className="group flex items-center gap-2 rounded-2xl border border-border/80 bg-card/95 px-3 py-2 text-xs font-bold text-foreground shadow-lg shadow-black/5 backdrop-blur-md transition-all hover:bg-primary/10 hover:border-primary/40 hover:text-primary hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer"
                aria-label="Tampilkan menu panel"
              />
            }
          >
            <PanelLeft className="size-4 text-primary transition-transform group-hover:scale-110" />
            <span>Panel Menu</span>
          </Bertip>
        </div>
      )}
    </>
  );
}
