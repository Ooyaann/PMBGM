import { Suspense } from "react";
import { FileDown } from "lucide-react";
import { NavInsight, NavInsightDasar } from "@/components/insight/nav-insight";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LayoutInsight({ children }: LayoutProps<"/insight">) {
  return (
    <div className="kontainer space-y-6 py-8 sm:py-10">
      <div className="flex items-center justify-between gap-3">
        <Suspense fallback={<NavInsightDasar />}>
          <NavInsight />
        </Suspense>
        {/* IN-07: laporan ringkas siap cetak untuk rapat atau surat ke instansi. */}
        <a
          href="/insight/laporan"
          download
          className={cn(
            buttonVariants({ variant: "outline" }),
            "shrink-0 bg-card hover:bg-secondary hover:text-primary hover:border-primary/40 font-bold transition shadow-2xs h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm"
          )}
          title="Unduh laporan ringkas (PDF)"
        >
          <FileDown className="size-4 text-primary" aria-hidden />{" "}
          <span className="hidden sm:inline">Unduh PDF Resmi</span>
          <span className="sm:hidden">PDF</span>
        </a>
      </div>
      {children}
    </div>
  );
}
