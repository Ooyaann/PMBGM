import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { FormLapor } from "@/components/lapor/form-lapor";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilAturanSla } from "@/lib/data/publik";
import { ambilSekolahPilihan } from "@/lib/data/sekolah";
import { ambilPengguna } from "@/lib/sesi";

export const metadata: Metadata = {
  title: "Lapor",
  description: "Laporkan masalah Makan Bergizi Gratis di sekolah. Identitas bisa dirahasiakan, kode tiket langsung terbit.",
};

const POLA_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function BagianForm({ searchParams }: { searchParams: PageProps<"/lapor">["searchParams"] }) {
  const { sekolah } = await searchParams;
  const idSekolah = typeof sekolah === "string" && POLA_UUID.test(sekolah) ? sekolah : null;
  const [pengguna, sla, sekolahAwal] = await Promise.all([
    ambilPengguna(), ambilAturanSla(), idSekolah ? ambilSekolahPilihan(idSekolah) : null,
  ]);
  return <FormLapor pengguna={pengguna && { id: pengguna.id, nama: pengguna.nama }} sla={sla} sekolahAwal={sekolahAwal} />;
}

export default function HalamanLapor({ searchParams }: PageProps<"/lapor">) {
  return (
    <div className="kontainer py-8 sm:py-10">
      <header className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold">Lapor</h1>
        <Link href="/lapor/panduan" className="inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-primary hover:bg-secondary">
          <BookOpen className="size-4" aria-hidden /> Panduan
        </Link>
      </header>
      <Suspense fallback={<Skeleton className="h-[30rem] w-full rounded-3xl" />}>
        <BagianForm searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
