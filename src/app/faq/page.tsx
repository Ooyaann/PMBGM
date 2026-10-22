import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown, ClipboardList, HelpCircle, Megaphone, Radar, ShieldCheck } from "lucide-react";
import { HalamanInfo } from "@/components/info/kerangka";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Pertanyaan yang sering diajukan tentang melapor, melacak, keamanan identitas, dan data di PantauGizi.",
};

const KELOMPOK = [
  {
    id: "lapor", judul: "Melapor", ikon: Megaphone, tanya: [
      ["Siapa yang boleh melapor?", "Siapa saja: orang tua, siswa, guru, komite sekolah, kader posyandu, atau warga. Cukup daftar dengan email dan kata sandi."],
      ["Apa yang harus saya lakukan bila ada keracunan?", "Utamakan keselamatan: bawa korban ke puskesmas atau IGD terdekat dan hubungi 119. Setelah itu laporkan di PantauGizi dengan kategori Keracunan agar langsung masuk antrean darurat."],
      ["Apakah wajib melampirkan foto?", "Tidak wajib, tetapi foto menaikkan skor kredibilitas sehingga laporan lebih cepat diperiksa."],
      ["Ada orang lain yang sudah melapor kejadian yang sama.", "Formulir akan menampilkan laporan serupa. Tekan “Saya juga mengalami” untuk mendukungnya, atau tetap kirim laporan Anda; verifikator akan menggabungkannya menjadi satu kasus."],
      ["Berapa banyak laporan yang bisa saya kirim?", "Maksimal 5 laporan dalam 24 jam per akun, untuk mencegah spam."],
    ],
  },
  {
    id: "lacak", judul: "Melacak", ikon: ClipboardList, tanya: [
      ["Bagaimana mengetahui perkembangan laporan?", "Gunakan kode tiket di halaman Lacak, buka Laporan saya, atau tunggu notifikasi dan email setiap ada perubahan status."],
      ["Berapa lama laporan diproses?", "Setiap kategori punya batas waktu per tahap. Dugaan keracunan diverifikasi paling lambat 6 jam. Lihat tabel lengkapnya di Metodologi."],
      ["Bagaimana bila instansi tidak menanggapi?", "Setelah batas waktu lewat, kasus otomatis ditandai “Tidak ditanggapi”, prioritasnya naik, dan tampil di Papan Akuntabilitas."],
      ["Masalahnya belum tuntas padahal kasus selesai.", "Buka ulang kasus dari Laporan saya paling lambat 14 hari setelah selesai, lalu jelaskan bagian yang belum tuntas."],
      ["Mengapa laporan saya ditolak?", "Alasannya selalu ditampilkan, misalnya bukti tidak relevan atau di luar lingkup MBG. Anda bisa melapor lagi dengan informasi yang lebih lengkap."],
    ],
  },
  {
    id: "aman", judul: "Keamanan", ikon: ShieldCheck, tanya: [
      ["Apakah SPPG atau sekolah tahu saya yang melapor?", "Tidak. Instansi hanya melihat isi laporan. Pada mode Rahasia hanya verifikator yang tahu nama Anda; pada mode Anonim tidak ada yang tahu."],
      ["Apakah lokasi rumah saya terlihat dari foto?", "Tidak. Lokasi di foto dibaca untuk verifikasi lalu dihapus saat foto dikompres sebelum diunggah."],
      ["Bagaimana mencegah laporan palsu?", "Setiap laporan diperiksa verifikator dengan checklist, dibantu skor kredibilitas dan pencocokan waktu/lokasi foto. Hanya laporan terverifikasi yang diumumkan."],
    ],
  },
  {
    id: "data", judul: "Data dan Insight", ikon: Radar, tanya: [
      ["Apakah Indeks Risiko berarti SPPG itu bersalah?", "Bukan. Indeks adalah alat bantu menentukan urutan inspeksi berdasarkan laporan terverifikasi, bukan putusan."],
      ["Apakah datanya nyata?", "Data konteks nasional di beranda nyata dan bersumber. Data SPPG, sekolah, laporan, dan anggaran di prototipe ini adalah simulasi dan diberi label Simulasi."],
      ["Bisakah saya memakai datanya?", "Bisa. Unduh CSV/JSON atau gunakan API tanpa kunci di Data Terbuka, dengan lisensi CC BY 4.0."],
    ],
  },
] as const;

export default function HalamanFaq() {
  return (
    <HalamanInfo judul="Pertanyaan umum" pengantar="Jawaban singkat untuk hal yang paling sering ditanyakan."
      isi={KELOMPOK.map((k) => ({ id: k.id, label: k.judul, ikon: k.ikon }))}>
      {KELOMPOK.map((k) => (
        <section key={k.id} id={k.id} aria-labelledby={`judul-${k.id}`} className="scroll-mt-24 space-y-2">
          <h2 id={`judul-${k.id}`} className="flex items-center gap-2 text-xl font-bold"><k.ikon className="size-5 text-primary" aria-hidden />{k.judul}</h2>
          <div className="divide-y overflow-hidden rounded-3xl border bg-card">
            {k.tanya.map(([t, j]) => (
              <details key={t} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 font-semibold hover:bg-muted/40 [&::-webkit-details-marker]:hidden">
                  {t}
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground transition group-open:rotate-180" aria-hidden />
                </summary>
                <p className="px-4 pb-4 text-[15px] leading-relaxed text-muted-foreground">{j}</p>
              </details>
            ))}
          </div>
        </section>
      ))}
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <HelpCircle className="size-4" aria-hidden /> Belum terjawab? Baca <Link href="/metodologi" className="font-semibold text-primary hover:underline">Metodologi</Link> atau <Link href="/privasi" className="font-semibold text-primary hover:underline">Privasi</Link>.
      </p>
    </HalamanInfo>
  );
}
