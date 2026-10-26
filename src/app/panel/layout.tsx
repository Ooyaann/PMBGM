import type { Metadata } from "next";
import { Suspense } from "react";
import { SidebarPanel, type InfoInstansiPanel } from "@/components/panel/sidebar-panel";
import { wajibPeran } from "@/lib/sesi";
import { buatKlienServer } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: { template: "%s · Panel PMBGM", default: "Panel" },
  robots: { index: false, follow: false },
};

function SidebarSkeleton() {
  return (
    <>
      {/* Mobile topbar skeleton */}
      <div className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b bg-card px-4 lg:hidden">
        <div className="h-6 w-32 rounded-lg bg-muted animate-pulse" />
        <div className="size-9 rounded-lg bg-muted animate-pulse" />
      </div>
      {/* Desktop sidebar skeleton */}
      <aside className="hidden lg:flex lg:w-64 xl:w-72 lg:h-screen lg:sticky lg:top-0 border-r bg-card p-5 shrink-0 animate-pulse flex-col justify-between">
        <div className="space-y-6">
          <div className="h-10 w-44 rounded-lg bg-muted" />
          <div className="h-14 w-full rounded-xl bg-muted" />
          <div className="space-y-2 pt-2">
            <div className="h-9 w-full rounded-lg bg-muted/60" />
            <div className="h-9 w-full rounded-lg bg-muted/60" />
            <div className="h-9 w-full rounded-lg bg-muted/60" />
            <div className="h-9 w-full rounded-lg bg-muted/60" />
          </div>
        </div>
        <div className="h-12 w-full rounded-xl bg-muted" />
      </aside>
    </>
  );
}

async function SidebarSlot() {
  const p = await wajibPeran("verifikator", "instansi", "admin");
  let instansi: InfoInstansiPanel | null = null;
  if (p.instansiId) {
    const supabase = await buatKlienServer();
    const { data } = await supabase
      .from("instansi")
      .select("id, nama, jenis, sppg_id")
      .eq("id", p.instansiId)
      .maybeSingle();
    if (data) {
      instansi = {
        id: data.id,
        nama: data.nama,
        jenis: data.jenis,
        sppgId: data.sppg_id,
      };
    }
  }

  return (
    <SidebarPanel
      pengguna={{
        id: p.id,
        nama: p.nama,
        email: p.email,
        peran: p.peran,
      }}
      instansi={instansi}
    />
  );
}

export default function LayoutPanel({ children }: LayoutProps<"/panel">) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-muted/15">
      <Suspense fallback={<SidebarSkeleton />}>
        <SidebarSlot />
      </Suspense>
      <main id="konten" className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}

