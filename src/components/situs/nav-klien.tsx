"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, Menu, UserRound } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { keluar } from "@/lib/aksi/auth";
import { cn } from "@/lib/utils";
import { NAV_UTAMA } from "./navigasi";
import { TandaLogo } from "./logo";

function aktif(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavDesktop() {
  const pathname = usePathname();
  return (
    <nav aria-label="Navigasi utama" className="hidden items-center gap-1 lg:flex">
      {NAV_UTAMA.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={aktif(pathname, item.href) ? "page" : undefined}
          className={cn(
            "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            "aria-[current=page]:bg-secondary aria-[current=page]:text-secondary-foreground",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export interface InfoAkun {
  nama: string;
  peranLabel: string;
  punyaPanel: boolean;
}

export function MenuAkun({ akun }: { akun: InfoAkun }) {
  const inisial = akun.nama.split(/\s+/).map((k) => k[0]).join("").slice(0, 2).toUpperCase();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex size-10 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-label={`Menu akun ${akun.nama}`}
      >
        {inisial}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <span className="block truncate font-semibold text-foreground">{akun.nama}</span>
            <span className="text-xs font-normal">{akun.peranLabel}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/akun" />}>
          <UserRound /> Laporan saya
        </DropdownMenuItem>
        {akun.punyaPanel && (
          <DropdownMenuItem render={<Link href="/panel" />}>
            <LayoutDashboard /> Panel internal
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => keluar()}>
          <LogOut /> Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MenuSeluler({ akun }: { akun: InfoAkun | null }) {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="ghost" size="icon-lg" className="lg:hidden" aria-label="Buka menu" />}>
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="right" className="w-[86%] gap-0 p-0">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="flex items-center gap-2">
            <TandaLogo className="size-7" /> Menu
          </SheetTitle>
        </SheetHeader>
        <nav aria-label="Navigasi seluler" className="flex flex-col gap-1 p-3">
          {NAV_UTAMA.map((item) => (
            <SheetClose
              key={item.href}
              render={<Link href={item.href} aria-current={aktif(pathname, item.href) ? "page" : undefined} />}
              className="flex h-12 items-center gap-3 rounded-xl px-3 font-semibold hover:bg-muted aria-[current=page]:bg-secondary aria-[current=page]:text-secondary-foreground"
            >
              <item.ikon className="size-5 text-primary" aria-hidden />
              {item.label}
            </SheetClose>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2 border-t p-4">
          {akun ? (
            <>
              <SheetClose render={<Link href="/akun" className={buttonVariants({ variant: "outline", size: "xl" })} />}>
                <UserRound /> Laporan saya
              </SheetClose>
              {akun.punyaPanel && (
                <SheetClose render={<Link href="/panel" className={buttonVariants({ variant: "outline", size: "xl" })} />}>
                  <LayoutDashboard /> Panel internal
                </SheetClose>
              )}
            </>
          ) : (
            <SheetClose render={<Link href="/masuk" className={buttonVariants({ variant: "outline", size: "xl" })} />}>
              Masuk
            </SheetClose>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
