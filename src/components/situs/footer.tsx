import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Logo } from "./logo";
import { NAV_UTAMA } from "./navigasi";

const TAUTAN_INFO = [
  { href: "/metodologi", label: "Metodologi" },
  { href: "/tentang", label: "Tentang" },
  { href: "/faq", label: "FAQ" },
  { href: "/privasi", label: "Privasi" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/40">
      <div className="kontainer flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Logo />
          <Tooltip>
            <TooltipTrigger className="inline-flex h-7 items-center gap-1.5 rounded-full bg-background px-2.5 text-xs font-medium text-muted-foreground ring-1 ring-border">
              <FlaskConical className="size-3.5" aria-hidden /> Prototipe · data simulasi
            </TooltipTrigger>
            <TooltipContent className="max-w-72">
              Prototipe lomba Web In Action MIA 2026. Data SPPG, sekolah, dan laporan adalah simulasi dengan nama fiktif;
              angka nasional mengutip sumber yang disebutkan.
            </TooltipContent>
          </Tooltip>
        </div>
        <nav aria-label="Tautan bawah" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {[...NAV_UTAMA, ...TAUTAN_INFO].map((t) => (
            <Link key={t.href} href={t.href} className="text-muted-foreground hover:text-foreground">{t.label}</Link>
          ))}
        </nav>
      </div>
      <p className="kontainer border-t py-4 text-xs text-muted-foreground">© 2026 Tim Ctrl Win Enter · UNNES</p>
    </footer>
  );
}
