import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight, BarChart3, ClipboardList, Code2, Eye, FlaskConical, Handshake, Megaphone, Puzzle, Radar, ShieldCheck,
  Target, Users,
} from "lucide-react";
import { LabelSumber } from "@/components/data/label-sumber";
import { BagianInfo, HalamanInfo } from "@/components/info/kerangka";
import { FAKTA_NASIONAL, PLATFORM_LAIN } from "@/lib/konteks";

export const metadata: Metadata = {
  title: "Tentang",
  description: "PantauGizi: platform pengawasan partisipatif program Makan Bergizi Gratis di Jawa Tengah, dari laporan warga sampai tindak lanjut instansi.",
};

const MODUL = [
  { href: "/lapor", ikon: Megaphone, judul: "Lapor", isi: "Warga, guru, dan orang tua melapor dengan bukti; identitas bisa dirahasiakan." },
  { href: "/lacak", ikon: ClipboardList, judul: "Lacak", isi: "Setiap laporan punya kode tiket dan timeline publik sampai selesai." },
  { href: "/data", ikon: BarChart3, judul: "Data Terbuka", isi: "Anggaran, penerima, SPPG, dan kasus yang bisa diunduh dan diakses lewat API." },
  { href: "/insight", ikon: Radar, judul: "Insight", isi: "Peta risiko, prioritas inspeksi, dan peringatan dini untuk pengambil keputusan." },
];

const PRINSIP = [
  { ikon: ShieldCheck, judul: "Terverifikasi dulu", isi: "Hanya laporan yang lolos pemeriksaan yang dihitung dan diumumkan." },
  { ikon: Eye, judul: "Transparan", isi: "Rumus, batas waktu, dan riwayat penanganan terbuka untuk semua orang." },
  { ikon: Users, judul: "Aman bagi pelapor", isi: "Identitas tidak pernah dibagikan ke instansi atau publik." },
  { ikon: Handshake, judul: "Melengkapi", isi: "Menyambung kanal resmi yang ada, bukan menggantikannya." },
];

export default function HalamanTentang() {
  return (
    <HalamanInfo judul="Tentang PantauGizi"
      pengantar="Program sebesar Makan Bergizi Gratis butuh mata sebanyak mungkin. PantauGizi menghubungkan laporan warga dengan instansi yang berwenang, secara terbuka.">
      <BagianInfo judul="Mengapa" ikon={Target}>
        <ul className="grid gap-3 sm:grid-cols-2">
          {FAKTA_NASIONAL.map((f) => (
            <li key={f.label} className="rounded-2xl bg-muted/40 p-4">
              <p className="angka text-2xl font-extrabold">{f.angka}</p>
              <p className="text-sm font-medium">{f.label}</p>
              {f.catatan && <p className="text-xs text-muted-foreground">{f.catatan}</p>}
              <p className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <LabelSumber jenis={f.jenis} />
                <a href={f.sumber.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-muted-foreground hover:text-foreground hover:underline">
                  {f.sumber.nama}, {f.sumber.tanggal} <ArrowUpRight className="size-3" aria-hidden />
                </a>
              </p>
            </li>
          ))}
        </ul>
      </BagianInfo>

      <BagianInfo judul="Empat modul, satu alur" ikon={Puzzle}>
        <ul className="grid gap-3 sm:grid-cols-2">
          {MODUL.map((m) => (
            <li key={m.href}>
              <Link href={m.href} className="flex h-full gap-3 rounded-2xl bg-muted/40 p-4 transition hover:bg-muted">
                <m.ikon className="size-6 shrink-0 text-primary" aria-hidden />
                <span><span className="block font-semibold">{m.judul}</span><span className="text-sm text-muted-foreground">{m.isi}</span></span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">Keempatnya saling terhubung: laporan terverifikasi membentuk Indeks Risiko, dan risiko SPPG menaikkan prioritas laporan berikutnya.</p>
      </BagianInfo>

      <BagianInfo judul="Prinsip" ikon={ShieldCheck}>
        <ul className="grid gap-3 sm:grid-cols-2">
          {PRINSIP.map((p) => (
            <li key={p.judul} className="flex gap-3 rounded-2xl bg-muted/40 p-4">
              <p.ikon className="size-5 shrink-0 text-primary" aria-hidden />
              <span><span className="block font-semibold">{p.judul}</span><span className="text-sm text-muted-foreground">{p.isi}</span></span>
            </li>
          ))}
        </ul>
      </BagianInfo>

      <BagianInfo judul="Melengkapi kanal yang ada" ikon={Handshake}>
        <ul className="space-y-2">
          {PLATFORM_LAIN.map((p) => (
            <li key={p.nama} className="rounded-2xl bg-muted/40 p-4 text-sm">
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold hover:underline">
                {p.nama} <ArrowUpRight className="size-3.5" aria-hidden />
              </a>
              <p className="text-muted-foreground">{p.fungsi}. <span className="text-foreground">Celah:</span> {p.celah}.</p>
            </li>
          ))}
        </ul>
      </BagianInfo>

      <BagianInfo judul="Tim dan status" ikon={Code2}>
        <p>Dibuat oleh tim <strong>Ctrl Win Enter</strong> dari Universitas Negeri Semarang untuk kategori Web In Action, MIA 2026.</p>
        <p className="flex items-start gap-2 rounded-2xl bg-muted/40 p-4 text-sm text-muted-foreground">
          <FlaskConical className="mt-0.5 size-4 shrink-0" aria-hidden />
          Ini prototipe. Data konteks nasional di atas nyata dan bersumber; data SPPG, sekolah, laporan, dan anggaran di platform adalah simulasi.
        </p>
      </BagianInfo>
    </HalamanInfo>
  );
}
