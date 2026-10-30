import { Suspense } from "react";
import { ambilPengguna, LABEL_PERAN } from "@/lib/sesi";
import { buatKlienServer } from "@/lib/supabase/server";
import { TopNavbar, type InfoAkunNavbar } from "./top-navbar";

function TopNavbarSkeleton() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <div className="h-8 w-36 rounded-xl bg-muted/70 animate-pulse" />
          <div className="hidden lg:flex items-center gap-2">
            <div className="h-8 w-20 rounded-xl bg-muted/60 animate-pulse" />
            <div className="h-8 w-32 rounded-xl bg-muted/60 animate-pulse" />
            <div className="h-8 w-28 rounded-xl bg-muted/60 animate-pulse" />
            <div className="h-8 w-36 rounded-xl bg-muted/60 animate-pulse" />
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-28 rounded-xl bg-muted/70 animate-pulse" />
          <div className="h-10 w-10 rounded-xl bg-muted/70 animate-pulse" />
        </div>
      </div>
    </header>
  );
}

async function SlotKonten() {
  const p = await ambilPengguna();
  let instansi: InfoAkunNavbar["instansi"] = null;

  if (p?.instansiId) {
    const supabase = await buatKlienServer();
    const { data } = await supabase
      .from("instansi")
      .select("id, nama, jenis")
      .eq("id", p.instansiId)
      .maybeSingle();
    if (data) instansi = data;
  }

  const akun: InfoAkunNavbar | null = p && {
    id: p.id,
    nama: p.nama,
    email: p.email,
    peran: p.peran,
    peranLabel: LABEL_PERAN[p.peran],
    terverifikasi: p.terverifikasi,
    sekolahId: p.sekolahId,
    instansi,
  };

  return <TopNavbar akun={akun} />;
}

export function TopNavbarSlot() {
  return (
    <Suspense fallback={<TopNavbarSkeleton />}>
      <SlotKonten />
    </Suspense>
  );
}
