import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Search, Users } from "lucide-react";
import { BarisPengguna } from "@/components/panel/baris-pengguna";
import { Skeleton } from "@/components/ui/skeleton";
import { wajibPeran } from "@/lib/sesi";
import { buatKlienServer } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Pengguna" };

async function Daftar({ searchParams }: { searchParams: PageProps<"/panel/admin/pengguna">["searchParams"] }) {
  const admin = await wajibPeran("admin");
  const { q } = await searchParams;
  const cari = typeof q === "string" ? q.slice(0, 80) : "";
  const supabase = await buatKlienServer();
  const [{ data: pengguna }, { data: instansi }] = await Promise.all([
    supabase.rpc("daftar_pengguna", { p_cari: cari || undefined, p_batas: 60 }),
    supabase.from("instansi").select("id, nama").order("nama"),
  ]);
  const pilihanInstansi = (instansi ?? []).map((i) => ({ value: i.id, label: i.nama }));

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <form role="search" className="relative w-full max-w-md">
          <label htmlFor="cari-pengguna" className="sr-only">Cari nama atau email</label>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            id="cari-pengguna"
            name="q"
            type="search"
            defaultValue={cari}
            placeholder="Cari nama atau email pengguna..."
            className="h-11 w-full rounded-xl border bg-card pr-11 pl-10 text-sm shadow-2xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
          />
          <button
            type="submit"
            className="absolute top-1/2 right-1.5 -translate-y-1/2 flex size-8 items-center justify-center rounded-lg bg-secondary text-primary hover:bg-primary hover:text-primary-foreground transition cursor-pointer"
            aria-label="Cari pengguna"
          >
            <ArrowRight className="size-4" />
          </button>
        </form>
        {cari && (
          <Link href="/panel/admin/pengguna" className="text-xs font-semibold text-primary hover:underline">
            Reset pencarian
          </Link>
        )}
      </div>
      <ul className="divide-y overflow-hidden rounded-3xl border bg-card">
        {(pengguna ?? []).map((u) => (
          <BarisPengguna key={u.id} diriSendiri={u.id === admin.id} instansi={pilihanInstansi} u={{
            id: u.id, email: u.email, nama: u.nama, peran: u.peran, terverifikasi: u.terverifikasi,
            instansiId: u.instansi_id, jumlahLaporan: u.jumlah_laporan,
          }} />
        ))}
        {!pengguna?.length && (
          <li className="flex flex-col items-center gap-2 p-10 text-sm text-muted-foreground"><Users className="size-8" aria-hidden /> Tidak ditemukan</li>
        )}
      </ul>
    </>
  );
}

export default function HalamanPengguna({ searchParams }: PageProps<"/panel/admin/pengguna">) {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-extrabold">Pengguna</h1>
      <Suspense fallback={<Skeleton className="h-[32rem] rounded-3xl" />}>
        <Daftar searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
