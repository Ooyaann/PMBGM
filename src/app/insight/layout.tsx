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
            buttonVariants({ variant: "outline", size: "lg" }),
            "shrink-0 bg-card hover:bg-emerald-500/10 hover:text-emerald-700 hover:border-emerald-300 font-bold transition shadow-2xs"
          )}
          title="Unduh laporan ringkas (PDF)"
        >
          <FileDown className="size-4 text-emerald-600" aria-hidden />{" "}
          <span className="hidden sm:inline">Unduh PDF Resmi</span>
          <span className="sr-only sm:hidden">Unduh laporan ringkas PDF</span>
        </a>
      </div>
      {children}
    </div>
  );
}
