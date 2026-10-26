"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  UserRound,
} from "lucide-react";
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
import { keluar } from "@/lib/aksi/auth";
import { cn } from "@/lib/utils";
import { Logo, TandaLogo } from "./logo";
import { NAV_UTAMA } from "./navigasi";

export interface InfoAkunGlobal {
  nama: string;
  peranLabel: string;
  punyaPanel: boolean;
}

function aktif(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarGlobal({ akun }: { akun: InfoAkunGlobal | null }) {
  const pathname = usePathname();

  // Di area kerja panel internal staf, SidebarPanel internal yang tampil
  if (pathname.startsWith("/panel")) {
    return null;
  }

  const inisial = akun
    ? akun.nama
        .split(/\s+/)
        .map((k) => k[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  return (
    <>
      {/* HEADER KHUSUS MOBILE / TABLET (< lg) */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background/90 px-4 backdrop-blur-md lg:hidden">
        <Logo />
        <div className="flex items-center gap-2">
          <Link
            href="/lapor"
            className={cn(
              buttonVariants({ size: "sm" }),
              "h-9 rounded-xl font-semibold shadow-sm text-xs px-3"
            )}
          >
            <Megaphone className="size-3.5" aria-hidden /> Lapor
          </Link>
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-xl border"
                  aria-label="Buka menu navigasi"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[84%] max-w-sm gap-0 p-0">
              <SheetHeader className="border-b p-4">
                <SheetTitle className="flex items-center gap-2">
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Navigasi seluler" className="flex flex-col gap-1 p-3">
                {NAV_UTAMA.map((item) => {
                  const isAktif = aktif(pathname, item.href);
                  const Ikon = item.ikon;
                  return (
                    <SheetClose
                      key={item.href}
                      render={
                        <Link
                          href={item.href}
                          aria-current={isAktif ? "page" : undefined}
                        />
                      }
                      className={cn(
                        "flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-semibold transition",
                        isAktif
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Ikon className="size-5 shrink-0" aria-hidden />
                      {item.label}
                    </SheetClose>
                  );
                })}
              </nav>
              <div className="mt-auto flex flex-col gap-2 border-t p-4">
                {akun ? (
                  <>
                    <div className="px-2 py-1">
                      <p className="text-xs font-semibold text-foreground truncate">{akun.nama}</p>
                      <p className="text-[11px] text-muted-foreground">{akun.peranLabel}</p>
                    </div>
                    <SheetClose
                      render={
                        <Link
                          href="/akun"
                          className={buttonVariants({ variant: "outline", size: "lg" })}
                        />
                      }
                    >
                      <UserRound className="size-4" /> Laporan Saya
                    </SheetClose>
                    {akun.punyaPanel && (
                      <SheetClose
                        render={
                          <Link
                            href="/panel"
                            className={buttonVariants({ variant: "outline", size: "lg" })}
                          />
                        }
                      >
                        <LayoutDashboard className="size-4" /> Panel Staf
                      </SheetClose>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => keluar()}
                      className="text-rose-600 justify-start"
                    >
                      <LogOut className="size-4" /> Keluar
                    </Button>
                  </>
                ) : (
                  <SheetClose
                    render={
                      <Link
                        href="/masuk"
                        className={buttonVariants({ variant: "outline", size: "lg" })}
                      />
                    }
                  >
                    Masuk ke Akun
                  </SheetClose>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* LEFT SIDEBAR KHUSUS DESKTOP (lg+) */}
      <aside className="hidden lg:flex lg:w-64 xl:w-72 lg:flex-col lg:justify-between lg:h-screen lg:sticky lg:top-0 border-r border-border/70 bg-card/95 backdrop-blur-md p-5 z-40 shrink-0">
        <div className="space-y-6">
          {/* Logo Brand Header */}
          <div className="px-1 py-1">
            <Logo />
          </div>

          {/* Tombol Aksi Utama: Lapor Masalah */}
          <Link
            href="/lapor"
            className="group flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-white shadow-md shadow-emerald-900/10 transition hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg"
          >
            <span className="flex items-center gap-2.5 font-bold text-sm tracking-wide">
              <Megaphone className="size-4 text-emerald-100 transition group-hover:scale-110" aria-hidden />
              Lapor Masalah MBG
            </span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">
              Aman
            </span>
          </Link>

          {/* Menu Navigasi Vertikal */}
          <nav aria-label="Navigasi utama situs" className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 px-3 mb-2 block">
              Menu Utama
            </span>
            {NAV_UTAMA.map((item) => {
              const isAktif = aktif(pathname, item.href);
              const Ikon = item.ikon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isAktif ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150",
                    isAktif
                      ? "bg-primary/10 text-primary border-l-4 border-primary pl-2.5 font-bold shadow-xs"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  )}
                >
                  <Ikon
                    className={cn(
                      "size-4.5 shrink-0 transition-colors",
                      isAktif ? "text-primary" : "text-muted-foreground"
                    )}
                    aria-hidden
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar: Profil Akun & Sesi */}
        <div className="border-t pt-4">
          {akun ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex w-full items-center gap-3 rounded-2xl border bg-muted/40 p-2.5 text-left transition hover:bg-muted outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label={`Menu pengguna ${akun.nama}`}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-xs">
                  {inisial}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-bold text-foreground">
                    {akun.nama}
                  </span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {akun.peranLabel}
                  </span>
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top" className="w-56 mb-2">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <span className="block truncate font-semibold text-foreground">{akun.nama}</span>
                    <span className="text-xs font-normal text-muted-foreground">{akun.peranLabel}</span>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/akun" />}>
                  <UserRound className="size-4" /> Laporan saya
                </DropdownMenuItem>
                {akun.punyaPanel && (
                  <DropdownMenuItem render={<Link href="/panel" />}>
                    <LayoutDashboard className="size-4" /> Panel internal
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => keluar()} className="text-rose-600">
                  <LogOut className="size-4" /> Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/masuk"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full rounded-xl font-semibold shadow-xs flex items-center justify-center gap-2"
              )}
            >
              <UserRound className="size-4" /> Masuk ke Akun
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
