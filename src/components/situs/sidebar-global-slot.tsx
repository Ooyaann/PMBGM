import { Suspense } from "react";
import { ambilPengguna, LABEL_PERAN } from "@/lib/sesi";
import { SidebarGlobal, type InfoAkunGlobal } from "./sidebar-global";

function SidebarGlobalSkeleton() {
  return (
    <>
      {/* Mobile skeleton */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background px-4 lg:hidden">
        <div className="h-8 w-28 rounded-lg bg-muted animate-pulse" />
        <div className="h-9 w-20 rounded-xl bg-muted animate-pulse" />
      </header>
      {/* Desktop skeleton */}
      <aside className="hidden lg:flex lg:w-64 xl:w-72 lg:flex-col lg:justify-between lg:h-screen lg:sticky lg:top-0 border-r bg-card p-5 z-40 shrink-0">
        <div className="space-y-6">
          <div className="h-10 w-44 rounded-lg bg-muted animate-pulse" />
          <div className="h-12 w-full rounded-2xl bg-muted animate-pulse" />
          <div className="space-y-2 pt-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-10 w-full rounded-xl bg-muted/60 animate-pulse" />
            ))}
          </div>
        </div>
        <div className="h-14 w-full rounded-2xl bg-muted animate-pulse" />
      </aside>
    </>
  );
}

async function SlotKonten() {
  const pengguna = await ambilPengguna();
  const akun: InfoAkunGlobal | null = pengguna && {
    nama: pengguna.nama,
    peranLabel: LABEL_PERAN[pengguna.peran] + (pengguna.terverifikasi ? " terverifikasi" : ""),
    punyaPanel: pengguna.peran !== "pelapor",
  };

  return <SidebarGlobal akun={akun} />;
}

export function SidebarGlobalSlot() {
  return (
    <Suspense fallback={<SidebarGlobalSkeleton />}>
      <SlotKonten />
    </Suspense>
  );
}
