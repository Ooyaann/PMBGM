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
    <aside className="w-full lg:w-72 lg:min-h-screen border-b lg:border-b-0 lg:border-r bg-card p-5 animate-pulse">
      <div className="h-10 w-44 bg-muted rounded mb-6" />
      <div className="h-16 w-full bg-muted rounded-xl mb-6" />
      <div className="space-y-2">
        <div className="h-9 w-full bg-muted rounded-lg" />
        <div className="h-9 w-full bg-muted rounded-lg" />
        <div className="h-9 w-full bg-muted rounded-lg" />
      </div>
    </aside>
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
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}

