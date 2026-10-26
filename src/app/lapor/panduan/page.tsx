import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2, Camera, Check, EyeOff, Lock, Megaphone, Package, RotateCcw,
  Scale, ShieldCheck, Timer, UserCheck, UserRound, UserX, Utensils, X, XCircle,
} from "lucide-react";
import { AlurStatus } from "@/components/data/alur-status";
import { PanelDarurat } from "@/components/lapor/panel-darurat";
import { buttonVariants } from "@/components/ui/button";
import { MODE_IDENTITAS, MODE_PENDEK } from "@/lib/label";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Panduan pengawasan & alur laporan",
  description: "Panduan lengkap alur pengawasan partisipatif MBG: verifikasi independen, routing otomatis, perlindungan identitas, dan mekanisme anti-manipulasi.",
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

const TATA_KELOLA = [
  {
    ikon: UserCheck,
    peran: "Verifikator Independen",
    wewenang: "Pemeriksaan Awal Bukti",
    penjelasan: "Memeriksa keaslian foto dan kewajaran waktu aduan agar tidak ada laporan palsu atau spam. Verifikator tidak memiliki kepentingan bisnis dengan dapur SPPG.",
  },
  {
    ikon: Utensils,
    peran: "Dapur SPPG Terkait",
    wewenang: "Tindak Lanjut & Perbaikan Nyata",
    penjelasan: "Laporan yang diverifikasi otomatis diteruskan ke SPPG penyedia sekolah. Dapur wajib mengunggah foto perbaikan nyata yang langsung terlihat oleh publik.",
  },
  {
    ikon: Building2,
    peran: "Dinas Kesehatan Kota",
    wewenang: "Investigasi Kasus Keracunan",
    penjelasan: "Khusus dugaan keracunan makanan dan masalah higienitas berat, Dinkes otomatis menerima tembusan untuk investigasi lapangan dan pengujian sampel.",
  },
  {
    ikon: Scale,
    peran: "Korwil BGN Wilayah",
    wewenang: "Pengawasan Kepatuhan SLA",
    penjelasan: "Memantau keterlambatan respons seluruh dapur se-wilayah. Jika dapur mengabaikan aduan, kasus naik status menjadi Tidak Ditanggapi di Papan Akuntabilitas.",
  },
];

const ATURAN = [
  { ikon: XCircle, judul: "Ditolak", teks: "Alasannya selalu ditampilkan transparan bila bukti tidak relevan" },
  { ikon: Timer, judul: "Lewat batas", teks: "Jika dapur tidak merespons, prioritas naik dan masuk rekor publik" },
  { ikon: RotateCcw, judul: "Masa sanggah 3 hari", teks: "Pelapor berhak mengonfirmasi selesai atau membuka ulang jika belum tuntas" },
];

function Judul({ id, children }: { id: string; children: React.ReactNode }) {
  return <h2 id={id} className="text-xl font-bold">{children}</h2>;
}

export default function HalamanPanduan() {
  return (
    <div className="kontainer max-w-3xl space-y-12 py-10 sm:py-14">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Panduan Alur Pengawasan</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sistem PMBGM dirancang transparan dan otomatis. Laporan Anda langsung diteruskan ke pihak penanggung jawab tanpa perantara admin manual.
        </p>
      </div>

      <section aria-labelledby="judul-tata-kelola" className="space-y-4">
        <Judul id="judul-tata-kelola">Siapa yang memproses laporan Anda?</Judul>
        <div className="grid gap-3 sm:grid-cols-2">
          {TATA_KELOLA.map((t) => (
            <div key={t.peran} className="rounded-2xl border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600">
                  <t.ikon className="size-4" aria-hidden />
                </span>
                <div>
                  <h3 className="font-bold text-sm">{t.peran}</h3>
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase">{t.wewenang}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{t.penjelasan}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="judul-foto" className="space-y-4">
        <Judul id="judul-foto">Panduan foto bukti</Judul>
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
        <Judul id="judul-identitas">Perlindungan identitas pelapor</Judul>
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
        <Judul id="judul-alur">Alur penanganan transparan & anti-manipulasi</Judul>
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

      <section id="darurat" aria-labelledby="judul-darurat" className="scroll-mt-24 space-y-4">
        <Judul id="judul-darurat">Kontak Darurat Keracunan Medis</Judul>
        <PanelDarurat ringkas />
      </section>

      <div className="pt-2">
        <Link href="/lapor" className={buttonVariants({ size: "xl" })}><Megaphone aria-hidden /> Mulai Melapor</Link>
      </div>
    </div>
  );
}
