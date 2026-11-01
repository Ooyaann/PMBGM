"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error untuk diagnosis lokal
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-12 text-center bg-[radial-gradient(ellipse_70%_50%_at_50%_35%,oklch(0.52_0.19_27/0.06),transparent)] select-none">
      <div className="w-full max-w-md space-y-6 mx-auto rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xl shadow-destructive/5">
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/25 text-destructive">
            <AlertCircle className="size-6" aria-hidden />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-destructive">
            Kendala Sistem
          </span>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-heading">
            Terjadi Kesalahan Sementara
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Sistem mengalami kendala saat memuat data ini. Silakan coba muat ulang atau kembali ke beranda.
          </p>
        </div>

        {error.digest && (
          <p className="font-mono text-[10px] text-muted-foreground/60 bg-muted/60 py-1 px-2.5 rounded-lg inline-block">
            ID Referensi: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          <Button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto rounded-xl font-bold h-11 px-5 cursor-pointer shadow-sm shadow-primary/15"
          >
            <RefreshCw className="size-4" /> Coba Lagi
          </Button>
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto rounded-xl font-semibold h-11 px-4 bg-card cursor-pointer")}
          >
            <Home className="size-4" /> Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
