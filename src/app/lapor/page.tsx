import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { FormLapor } from "@/components/lapor/form-lapor";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilAturanSla } from "@/lib/data/publik";
import { ambilPengguna } from "@/lib/sesi";

export const metadata: Metadata = {
  title: "Lapor",
  description: "Laporkan masalah Makan Bergizi Gratis di sekolah. Identitas bisa dirahasiakan, kode tiket langsung terbit.",
};

async function BagianForm() {
  const [pengguna, sla] = await Promise.all([ambilPengguna(), ambilAturanSla()]);
  return <FormLapor pengguna={pengguna && { id: pengguna.id, nama: pengguna.nama }} sla={sla} />;
}

export default function HalamanLapor() {
  return (
    <div className="kontainer py-8 sm:py-10">
      <header className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold">Lapor</h1>
        <Link href="/lapor/panduan" className="inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-primary hover:bg-secondary">
          <BookOpen className="size-4" aria-hidden /> Panduan
        </Link>
      </header>
      <Suspense fallback={<Skeleton className="h-[30rem] w-full rounded-3xl" />}>
        <BagianForm />
      </Suspense>
    </div>
  );
}
