import type { Metadata } from "next";
import Link from "next/link";
import { Camera, Check, EyeOff, Lock, Megaphone, Package, RotateCcw, Timer, UserRound, UserX, X, XCircle } from "lucide-react";
import { AlurStatus } from "@/components/data/alur-status";
import { PanelDarurat } from "@/components/lapor/panel-darurat";
import { buttonVariants } from "@/components/ui/button";
import { MODE_IDENTITAS, MODE_PENDEK } from "@/lib/label";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Panduan melapor",
  description: "Langkah darurat keracunan, foto yang membantu, pilihan identitas, dan alur penanganan laporan MBG.",
};

const FOTO = [
  { ikon: Camera, teks: "Makanan dari dekat", boleh: true },
  { ikon: Package, teks: "Ompreng atau label", boleh: true },
  { ikon: UserX, teks: "Wajah anak", boleh: false },
];

const IDENTITAS = [
  { kunci: "rahasia", ikon: Lock },
  { kunci: "publik", ikon: UserRound },
  { kunci: "anonim", ikon: EyeOff },
] as const;

const ATURAN = [
  { ikon: XCircle, judul: "Ditolak", teks: "Alasannya selalu ditampilkan" },
  { ikon: Timer, judul: "Lewat batas", teks: "Prioritas naik, label Tidak ditanggapi" },
  { ikon: RotateCcw, judul: "Belum tuntas", teks: "Buka ulang maks. 14 hari" },
];

function Judul({ id, children }: { id: string; children: React.ReactNode }) {
  return <h2 id={id} className="text-xl font-bold">{children}</h2>;
}

export default function HalamanPanduan() {
  return (
    <div className="kontainer max-w-3xl space-y-12 py-10 sm:py-14">
      <h1 className="text-3xl font-extrabold">Panduan melapor</h1>

      <section id="darurat" aria-labelledby="judul-darurat" className="scroll-mt-24 space-y-4">
        <Judul id="judul-darurat">Darurat keracunan</Judul>
        <PanelDarurat />
      </section>

      <section aria-labelledby="judul-foto" className="space-y-4">
        <Judul id="judul-foto">Foto bukti</Judul>
        <ul className="grid grid-cols-3 gap-3">
          {FOTO.map((f) => (
            <li key={f.teks} className={cn("flex flex-col items-center gap-2 rounded-2xl border p-4 text-center",
              f.boleh ? "bg-card" : "border-risiko-tinggi/25 bg-risiko-tinggi-lembut")}>
              <span className="relative">
                <f.ikon className={cn("size-8", f.boleh ? "text-primary" : "text-risiko-tinggi")} aria-hidden />
                <span className={cn("absolute -right-2 -bottom-1 flex size-5 items-center justify-center rounded-full text-white",
                  f.boleh ? "bg-primary" : "bg-risiko-tinggi")}>
                  {f.boleh ? <Check className="size-3" aria-label="Boleh" /> : <X className="size-3" aria-label="Jangan" />}
                </span>
              </span>
              <span className="text-sm font-medium">{f.teks}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="judul-identitas" className="space-y-4">
        <Judul id="judul-identitas">Identitas</Judul>
        <ul className="grid gap-3 sm:grid-cols-3">
          {IDENTITAS.map(({ kunci, ikon: Ikon }) => (
            <li key={kunci} title={MODE_IDENTITAS[kunci].penjelasan} className="flex items-center gap-3 rounded-2xl border bg-card p-4 sm:flex-col sm:items-start">
              <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary"><Ikon className="size-5" aria-hidden /></span>
              <span>
                <span className="block font-semibold">{MODE_IDENTITAS[kunci].label}</span>
                <span className="block text-xs text-muted-foreground">{MODE_PENDEK[kunci]}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="judul-alur" className="space-y-4">
        <Judul id="judul-alur">Alur penanganan</Judul>
        <div className="rounded-3xl border bg-card p-5">
          <AlurStatus />
        </div>
        <ul className="grid gap-3 sm:grid-cols-3">
          {ATURAN.map((a) => (
            <li key={a.judul} className="flex items-start gap-3 rounded-2xl bg-muted/60 p-4">
              <a.ikon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <span>
                <span className="block text-sm font-semibold">{a.judul}</span>
                <span className="block text-xs text-muted-foreground">{a.teks}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <Link href="/lapor" className={buttonVariants({ size: "xl" })}><Megaphone aria-hidden /> Mulai melapor</Link>
    </div>
  );
}
