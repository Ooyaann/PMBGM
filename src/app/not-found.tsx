import Link from "next/link";
import { ArrowLeft, Home, Search, Ticket } from "lucide-react";
import { TandaLogo } from "@/components/situs/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HalamanNotFound() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-12 text-center select-none bg-[radial-gradient(ellipse_70%_50%_at_50%_35%,oklch(0.44_0.10_168/0.07),transparent)]">
      <div className="w-full max-w-md space-y-6 mx-auto">
        {/* Logo & 404 Badge */}
        <div className="flex flex-col items-center gap-3">
          <TandaLogo className="size-12 drop-shadow-sm" />
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary border border-primary/20 text-xs font-black tracking-wider text-primary uppercase">
            Kode Galat 404
          </span>
        </div>

        {/* Heading & Penjelasan */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-heading">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Halaman atau tautan yang Anda tuju mungkin telah dipindahkan, dihapus, atau kode pencarian tidak sesuai format.
          </p>
        </div>

        {/* Tombol Aksi Cepat */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          <Link
            href="/"
            className={cn(buttonVariants({ size: "default" }), "w-full sm:w-auto rounded-xl font-bold h-11 px-5 cursor-pointer")}
          >
            <Home className="size-4" /> Beranda
          </Link>
          <Link
            href="/cari-sekolah"
            className={cn(buttonVariants({ variant: "outline", size: "default" }), "w-full sm:w-auto rounded-xl font-semibold h-11 px-4 bg-card cursor-pointer")}
          >
            <Search className="size-4 text-primary" /> Cari Sekolah
          </Link>
          <Link
            href="/lacak"
            className={cn(buttonVariants({ variant: "outline", size: "default" }), "w-full sm:w-auto rounded-xl font-semibold h-11 px-4 bg-card cursor-pointer")}
          >
            <Ticket className="size-4 text-primary" /> Lacak Tiket
          </Link>
        </div>

        {/* Bantuan */}
        <div className="pt-4 border-t border-border/60">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" /> Kembali ke beranda sistem
          </Link>
        </div>
      </div>
    </div>
  );
}

