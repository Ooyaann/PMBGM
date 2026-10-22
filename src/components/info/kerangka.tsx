import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Kerangka halaman informasi: judul, satu kalimat pengantar, dan daftar isi berupa chip ikon. */
export function HalamanInfo({ judul, pengantar, isi, children }: {
  judul: string;
  pengantar: string;
  isi?: { id: string; label: string; ikon: LucideIcon }[];
  children: ReactNode;
}) {
  return (
    <div className="kontainer max-w-4xl space-y-8 py-8 sm:py-12">
      <header className="space-y-3">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{judul}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{pengantar}</p>
        {isi && (
          <nav aria-label="Daftar isi">
            <ul className="flex flex-wrap gap-2 pt-1">
              {isi.map((b) => (
                <li key={b.id}>
                  <a href={`#${b.id}`} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-card px-3 text-sm font-medium ring-1 ring-border transition hover:ring-primary">
                    <b.ikon className="size-4 text-primary" aria-hidden /> {b.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
      {children}
    </div>
  );
}

export function BagianInfo({ id, judul, ikon: Ikon, children, className }: {
  id?: string;
  judul: string;
  ikon: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={id ? `judul-${id}` : undefined} className={cn("scroll-mt-24 rounded-3xl border bg-card p-5 sm:p-7", className)}>
      <h2 id={id ? `judul-${id}` : undefined} className="mb-4 flex items-center gap-2 text-xl font-bold">
        <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-primary"><Ikon className="size-5" aria-hidden /></span>
        {judul}
      </h2>
      <div className="space-y-4 text-[15px] leading-relaxed">{children}</div>
    </section>
  );
}

/** Kotak rumus: baris istilah berwarna yang dijumlahkan. */
export function Rumus({ suku, hasil }: { suku: { label: string; bobot: string; warna?: string }[]; hasil: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-muted/50 p-4 text-sm">
      <span className="font-bold">{hasil} =</span>
      {suku.map((s, i) => (
        <span key={s.label} className="flex items-center gap-2">
          {i > 0 && <span className="text-muted-foreground">+</span>}
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-card px-2 py-1 ring-1 ring-border">
            {s.warna && <span aria-hidden className="size-2.5 rounded-[3px]" style={{ background: s.warna }} />}
            <span className="angka font-semibold">{s.bobot}</span>
            <span>{s.label}</span>
          </span>
        </span>
      ))}
    </div>
  );
}
