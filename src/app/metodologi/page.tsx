import type { Metadata } from "next";
import { Suspense } from "react";
import {
  BadgeCheck, Database, Gauge, Layers, ListOrdered, Map, Radar, ShieldCheck, Siren, Timer, TriangleAlert,
} from "lucide-react";
import { LabelSumber } from "@/components/data/label-sumber";
import { IKON_KATEGORI } from "@/components/data/ikon-kategori";
import { BagianInfo, HalamanInfo, Rumus } from "@/components/info/kerangka";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilAturanSla, type TahapSla } from "@/lib/data/publik";
import { batasJam } from "@/lib/format";
import { KOMPONEN } from "@/lib/indeks";
import { KATEGORI, RISIKO, SUMBER, type Kategori, type SumberData } from "@/lib/label";

export const metadata: Metadata = {
  title: "Metodologi",
  description: "Cara PMBGM menghitung Indeks Risiko SPPG, skor kredibilitas dan prioritas laporan, batas waktu, peringatan dini, serta sumber datanya.",
};

const ISI = [
  { id: "indeks", label: "Indeks Risiko", ikon: Gauge },
  { id: "kredibilitas", label: "Kredibilitas", ikon: BadgeCheck },
  { id: "prioritas", label: "Prioritas", ikon: ListOrdered },
  { id: "sla", label: "Batas waktu", ikon: Timer },
  { id: "peringatan", label: "Peringatan dini", ikon: Siren },
  { id: "peta", label: "Peta", ikon: Map },
  { id: "sumber", label: "Sumber data", ikon: Database },
  { id: "batasan", label: "Batasan", ikon: TriangleAlert },
];

const ARTI_KOMPONEN: Record<(typeof KOMPONEN)[number]["kunci"], string> = {
  l: "Laporan terverifikasi per 1.000 porsi dalam 30 hari",
  k: "Kasus dugaan keracunan terverifikasi per 1.000 porsi dalam 30 hari",
  s: "100 bila Sertifikat Laik Higiene Sanitasi tidak berlaku, 0 bila berlaku",
  t: "Persentase kasus yang pernah melewati batas waktu",
  p: "Kepuasan pelapor 90 hari (1–5 bintang menjadi 0–100). Belum ada penilaian dianggap netral (50)",
};
const BOBOT_LABEL: Record<string, string> = { l: "0,35", k: "0,25", s: "0,15", t: "0,15", p: "0,10" };

const KREDIBILITAS = [
  { label: "Bukti", maks: 30, arti: "Dua foto/video atau lebih: 30, satu: 25, tanpa bukti: 0" },
  { label: "Metadata foto", maks: 25, arti: "Waktu foto ≤ 48 jam dari kejadian (12) dan lokasi foto ≤ ±2 km dari sekolah (13)" },
  { label: "Status pelapor", maks: 25, arti: "Pelapor terverifikasi 25, identitas publik 15, rahasia 12, anonim 6" },
  { label: "Dukungan warga", maks: 15, arti: "5 poin untuk setiap warga yang menekan “Saya juga mengalami”" },
  { label: "Kelengkapan", maks: 5, arti: "Deskripsi ≥ 80 karakter dan jumlah terdampak diisi" },
];

const PRIORITAS = [
  { label: "Kategori", nilai: "10–60", arti: "Keracunan 60, tidak layak 40, kebersihan 30, distribusi 25, porsi/anggaran 20, lainnya 10" },
  { label: "Terdampak", nilai: "≤ 20", arti: "0,4 per orang, maksimal 50 orang" },
  { label: "Kredibilitas", nilai: "≤ 10", arti: "10% dari skor kredibilitas" },
  { label: "Risiko SPPG", nilai: "≤ 20", arti: "20% dari Indeks Risiko SPPG terkait" },
  { label: "Dukungan", nilai: "≤ 10", arti: "2 poin per dukungan warga" },
  { label: "Lewat batas", nilai: "+15", arti: "Ditambahkan saat tahap berjalan melewati batas waktu" },
];

const TAHAP: { kunci: TahapSla; label: string }[] = [
  { kunci: "diterima", label: "Verifikasi" },
  { kunci: "diverifikasi", label: "Diteruskan" },
  { kunci: "diteruskan", label: "Ditanggapi" },
  { kunci: "ditindaklanjuti", label: "Selesai" },
];

async function TabelSla() {
  const sla = await ambilAturanSla();
  return (
    <div className="overflow-x-auto rounded-2xl border">
      <table className="w-full min-w-[34rem] text-sm">
        <thead className="bg-muted/60 text-xs text-muted-foreground">
          <tr>
            <th scope="col" className="p-2.5 text-left font-medium">Kategori</th>
            {TAHAP.map((t) => <th key={t.kunci} scope="col" className="p-2.5 text-right font-medium">{t.label}</th>)}
          </tr>
        </thead>
        <tbody className="angka divide-y">
          {(Object.keys(KATEGORI) as Kategori[]).map((k) => {
            const Ikon = IKON_KATEGORI[k];
            return (
              <tr key={k}>
                <th scope="row" className="p-2.5 text-left font-medium">
                  <span className="flex items-center gap-2"><Ikon className="size-4 text-primary" aria-hidden />{KATEGORI[k].label}</span>
                </th>
                {TAHAP.map((t) => <td key={t.kunci} className="p-2.5 text-right">{batasJam(sla[k]?.[t.kunci]) ?? "–"}</td>)}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function HalamanMetodologi() {
  return (
    <HalamanInfo judul="Metodologi" isi={ISI}
      pengantar="Semua angka di PMBGM dihitung dengan aturan terbuka di bawah ini, hanya dari laporan yang sudah diverifikasi.">
      <BagianInfo id="indeks" judul="Indeks Risiko SPPG" ikon={Gauge}>
        <p>Skor 0–100 untuk setiap dapur SPPG, dihitung ulang tiap jam dan setiap ada verifikasi.</p>
        <Rumus hasil="Indeks" suku={KOMPONEN.map((k) => ({
          label: k.kunci === "p" ? "(100 − Kepuasan)" : k.label, bobot: BOBOT_LABEL[k.kunci], warna: k.warna,
        }))} />
        <ul className="grid gap-2 sm:grid-cols-2">
          {KOMPONEN.map((k) => (
            <li key={k.kunci} className="flex gap-2.5 rounded-2xl bg-muted/40 p-3 text-sm">
              <span aria-hidden className="mt-1 size-2.5 shrink-0 rounded-[3px]" style={{ background: k.warna }} />
              <span><strong>{k.label}.</strong> {ARTI_KOMPONEN[k.kunci]}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">
          Laporan dan keracunan dinormalkan min–maks antar-SPPG setelah dipotong di persentil 95, agar satu dapur ekstrem
          tidak menekan skor dapur lain. Skor kecamatan di peta memakai SPPG tertinggi di kecamatan itu (atau rata-rata berbobot porsi).
        </p>
        <ul className="flex flex-wrap gap-2">
          {(["rendah", "sedang", "tinggi"] as const).map((k) => (
            <li key={k} className="rounded-full bg-muted px-3 py-1 text-sm"><strong>{RISIKO[k].label}</strong> · {RISIKO[k].penjelasan.split(".")[0]}</li>
          ))}
        </ul>
      </BagianInfo>

      <BagianInfo id="kredibilitas" judul="Skor kredibilitas laporan" ikon={BadgeCheck}>
        <p>Membantu verifikator memeriksa laporan paling meyakinkan lebih dulu. Skor ini tidak pernah menolak laporan secara otomatis.</p>
        <ul className="space-y-2">
          {KREDIBILITAS.map((k) => (
            <li key={k.label} className="grid grid-cols-[7.5rem_3rem_1fr] items-baseline gap-2 text-sm">
              <span className="font-semibold">{k.label}</span>
              <span className="angka text-muted-foreground">{k.maks}</span>
              <span className="text-muted-foreground">{k.arti}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">Metadata lokasi foto dibaca di perangkat pelapor, lalu foto dikompres sehingga file yang tersimpan tidak lagi memuat lokasi.</p>
      </BagianInfo>

      <BagianInfo id="prioritas" judul="Prioritas laporan" ikon={ListOrdered}>
        <p>Antrean verifikasi diurutkan dengan skor prioritas. Dugaan keracunan selalu masuk <strong>Darurat</strong>; selain itu Tinggi ≥ 60, Sedang ≥ 35, sisanya Rendah.</p>
        <ul className="space-y-2">
          {PRIORITAS.map((p) => (
            <li key={p.label} className="grid grid-cols-[7.5rem_3rem_1fr] items-baseline gap-2 text-sm">
              <span className="font-semibold">{p.label}</span><span className="angka text-muted-foreground">{p.nilai}</span>
              <span className="text-muted-foreground">{p.arti}</span>
            </li>
          ))}
        </ul>
        <p className="flex items-start gap-2 text-sm text-muted-foreground"><Radar className="mt-0.5 size-4 shrink-0" aria-hidden />
          Risiko SPPG ikut menaikkan prioritas: dapur yang sering bermasalah lebih cepat diperiksa (integrasi Insight ke Lapor).</p>
      </BagianInfo>

      <BagianInfo id="sla" judul="Batas waktu penanganan" ikon={Timer}>
        <p>Setiap tahap punya batas waktu. Bila terlewati, laporan atau kasus ditandai, prioritasnya dinaikkan, dan instansi yang belum menanggapi tampil sebagai <strong>Tidak ditanggapi</strong> di Papan Akuntabilitas.</p>
        <Suspense fallback={<Skeleton className="h-72 rounded-2xl" />}><TabelSla /></Suspense>
        <p className="text-sm text-muted-foreground">Pelapor bisa membuka ulang kasus paling lambat 14 hari setelah selesai bila masalah belum tuntas.</p>
      </BagianInfo>

      <BagianInfo id="peringatan" judul="Peringatan dini" ikon={Siren}>
        <p>Sistem memeriksa setiap 15 menit. Peringatan muncul bila laporan terverifikasi untuk satu SPPG dalam 24 jam lebih dari tiga kali rata-rata hariannya selama 30 hari, dengan minimal 3 laporan.</p>
        <p className="text-sm text-muted-foreground">Lonjakan dari laporan yang belum diverifikasi hanya terlihat oleh verifikator; publik hanya melihat jumlahnya, agar tidak ada tuduhan sebelum bukti diperiksa.</p>
      </BagianInfo>

      <BagianInfo id="peta" judul="Peta" ikon={Map}>
        <p>Dua lapisan dengan sumber berbeda tidak dicampur: 35 kab/kota Jawa Tengah memakai data agregat, sedangkan 16 kecamatan Kota Semarang memakai laporan warga terverifikasi dari SPPG yang dipantau.</p>
        <p className="flex items-start gap-2 text-sm text-muted-foreground"><Layers className="mt-0.5 size-4 shrink-0" aria-hidden />
          Batas wilayah: Badan Informasi Geospasial (BIG) edisi 2026 melalui wilayah-id, disederhanakan. Batas bersifat indikatif, bukan dasar hukum.</p>
      </BagianInfo>

      <BagianInfo id="sumber" judul="Label sumber data" ikon={Database}>
        <p>Setiap angka diberi label sumbernya.</p>
        <ul className="space-y-2">
          {(Object.keys(SUMBER) as SumberData[]).map((s) => (
            <li key={s} className="flex flex-wrap items-center gap-2 text-sm">
              <LabelSumber jenis={s} /> <span className="text-muted-foreground">{SUMBER[s].penjelasan}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">Data terbuka berlisensi CC BY 4.0 dan bisa diunduh di Data Terbuka › Unduh & API.</p>
      </BagianInfo>

      <BagianInfo id="batasan" judul="Batasan" ikon={ShieldCheck}>
        <ul className="list-disc space-y-1.5 pl-5 text-sm">
          <li>Prototipe lomba: SPPG, sekolah, laporan, anggaran, dan kasus per kab/kota adalah data simulasi dengan struktur realistis.</li>
          <li>Indeks Risiko adalah alat bantu prioritas inspeksi, bukan putusan bahwa sebuah dapur bersalah.</li>
          <li>Wilayah dengan sedikit laporan bisa tampak berisiko rendah karena kurang terpantau, bukan karena pasti aman.</li>
          <li>Hasil klasifikasi otomatis dan AI hanya saran; keputusan selalu di tangan verifikator.</li>
        </ul>
      </BagianInfo>
    </HalamanInfo>
  );
}
