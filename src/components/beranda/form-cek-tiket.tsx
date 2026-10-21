import { ArrowRight, Ticket } from "lucide-react";
import { Bertip } from "@/components/ui/bertip";

/** Cek status tanpa login (LC-01). Form GET biasa, tetap berfungsi tanpa JavaScript. */
export function FormCekTiket({ className, nilai }: { className?: string; nilai?: string }) {
  return (
    <form action="/lacak" method="get" className={className} role="search" aria-label="Cek status laporan">
      <label htmlFor="tiket-beranda" className="sr-only">Kode tiket laporan</label>
      <div className="flex h-12 items-center gap-2 rounded-2xl border border-input bg-card pr-1.5 pl-3.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/40">
        <Ticket className="size-5 shrink-0 text-muted-foreground" aria-hidden />
        <input
          id="tiket-beranda"
          name="tiket"
          defaultValue={nilai}
          required
          placeholder="Cek status: MBG-XXXXXX"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          pattern="[A-Za-z]{3}-[A-Za-z0-9]{6}"
          title="Format kode: MBG- diikuti 6 huruf/angka"
          className="h-full min-w-0 flex-1 bg-transparent font-mono text-base uppercase tracking-wider placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-foreground/80 focus:outline-none"
        />
        <Bertip label="Cek status" render={<button type="submit" className="flex size-9 items-center justify-center rounded-xl bg-secondary text-primary transition hover:bg-primary hover:text-primary-foreground" />}>
          <ArrowRight className="size-5" aria-hidden />
        </Bertip>
      </div>
    </form>
  );
}
