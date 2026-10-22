import type { Metadata } from "next";
import { Suspense } from "react";
import { Building2, ShieldCheck } from "lucide-react";
import { NavPanel, NavPanelDasar } from "@/components/panel/nav-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { LABEL_PERAN, wajibPeran } from "@/lib/sesi";
import { buatKlienServer } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: { template: "%s · Panel PantauGizi", default: "Panel" },
  robots: { index: false, follow: false },
};

async function KepalaPanel() {
  const p = await wajibPeran("verifikator", "instansi", "admin");
  let instansi: string | null = null;
  if (p.instansiId) {
    const supabase = await buatKlienServer();
    const { data } = await supabase.from("instansi").select("nama").eq("id", p.instansiId).maybeSingle();
    instansi = data?.nama ?? null;
  }
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Suspense fallback={<NavPanelDasar peran={p.peran} />}>
        <NavPanel peran={p.peran} />
      </Suspense>
      <p className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
        {instansi ? <Building2 className="size-3.5" aria-hidden /> : <ShieldCheck className="size-3.5" aria-hidden />}
        {instansi ?? LABEL_PERAN[p.peran]}
      </p>
    </div>
  );
}

export default function LayoutPanel({ children }: LayoutProps<"/panel">) {
  return (
    <div className="kontainer space-y-6 py-8 sm:py-10">
      <Suspense fallback={<Skeleton className="h-11 w-80 rounded-xl" />}>
        <KepalaPanel />
      </Suspense>
      {children}
    </div>
  );
}
