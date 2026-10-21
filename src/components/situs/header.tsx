import { Suspense } from "react";
import Link from "next/link";
import { Megaphone } from "lucide-react";
import { Bertip } from "@/components/ui/bertip";
import { buttonVariants } from "@/components/ui/button";
import { ambilPengguna, LABEL_PERAN } from "@/lib/sesi";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { MenuAkun, MenuSeluler, NavDesktop, type InfoAkun } from "./nav-klien";

/** Bagian yang bergantung pada sesi; dialirkan terpisah agar kerangka header tetap statis. */
async function SlotAkun() {
  const pengguna = await ambilPengguna();
  const akun: InfoAkun | null = pengguna && {
    nama: pengguna.nama,
    peranLabel: LABEL_PERAN[pengguna.peran] + (pengguna.terverifikasi ? " terverifikasi" : ""),
    punyaPanel: pengguna.peran !== "pelapor",
  };
  return (
    <>
      {akun ? (
        <MenuAkun akun={akun} />
      ) : (
        <Link href="/masuk" className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "hidden h-10 px-3 lg:inline-flex")}>
          Masuk
        </Link>
      )}
      <MenuSeluler akun={akun} />
    </>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="kontainer flex h-16 items-center justify-between gap-3">
        <Logo />
        <NavDesktop />
        <div className="flex items-center gap-2">
          <Link href="/lapor" className={cn(buttonVariants({ size: "lg" }), "hidden h-10 rounded-xl px-4 sm:inline-flex")}>
            <Megaphone /> Lapor
          </Link>
          <Bertip label="Lapor" sisi="bottom" render={<Link href="/lapor" className={cn(buttonVariants({ size: "icon-lg" }), "size-10 rounded-xl sm:hidden")} />}>
            <Megaphone aria-hidden />
          </Bertip>
          <Suspense fallback={<span aria-hidden className="size-10 animate-pulse rounded-full bg-muted" />}>
            <SlotAkun />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
