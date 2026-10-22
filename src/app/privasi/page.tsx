import type { Metadata } from "next";
import { Check, Database, EyeOff, FileLock2, ImageOff, Lock, Mail, Minus, Scale, Trash2, UserRound, Users } from "lucide-react";
import { BagianInfo, HalamanInfo } from "@/components/info/kerangka";
import { MODE_IDENTITAS, type ModeIdentitas } from "@/lib/label";

export const metadata: Metadata = {
  title: "Privasi",
  description: "Data apa yang dikumpulkan PantauGizi, siapa yang bisa melihatnya, dan bagaimana identitas pelapor dilindungi.",
};

const ISI = [
  { id: "identitas", label: "Identitas", ikon: UserRound },
  { id: "akses", label: "Siapa melihat apa", ikon: Users },
  { id: "foto", label: "Foto & lokasi", ikon: ImageOff },
  { id: "data", label: "Data disimpan", ikon: Database },
  { id: "hak", label: "Hak Anda", ikon: Scale },
];

const IKON_MODE: Record<ModeIdentitas, typeof Lock> = { rahasia: Lock, publik: UserRound, anonim: EyeOff };

type Akses = "ya" | "tidak" | "sebagian";
const PERAN = ["Publik", "Instansi", "Verifikator", "Admin"] as const;
const MATRIKS: { data: string; akses: Akses[]; catatan?: string }[] = [
  { data: "Isi laporan terverifikasi (kategori, sekolah, ringkasan)", akses: ["ya", "ya", "ya", "ya"] },
  { data: "Foto bukti", akses: ["sebagian", "ya", "ya", "ya"], catatan: "Publik hanya setelah laporan lolos verifikasi" },
  { data: "Laporan yang belum diverifikasi atau ditolak", akses: ["tidak", "tidak", "ya", "ya"] },
  { data: "Nama dan email pelapor", akses: ["tidak", "tidak", "sebagian", "tidak"], catatan: "Verifikator hanya untuk mode Publik dan Rahasia" },
  { data: "Lokasi asli foto (metadata)", akses: ["tidak", "tidak", "ya", "tidak"], catatan: "Hanya untuk mencocokkan lokasi kejadian" },
  { data: "Riwayat penanganan kasus", akses: ["ya", "ya", "ya", "ya"] },
];

function SelAkses({ a }: { a: Akses }) {
  if (a === "ya") return <Check className="mx-auto size-5 text-risiko-rendah" aria-label="Ya" />;
  if (a === "sebagian") return <span className="mx-auto block size-3 rounded-full border-2 border-risiko-sedang" aria-label="Sebagian" title="Sebagian" />;
  return <Minus className="mx-auto size-5 text-muted-foreground/60" aria-label="Tidak" />;
}

export default function HalamanPrivasi() {
  return (
    <HalamanInfo judul="Privasi" isi={ISI}
      pengantar="Melapor tidak boleh membahayakan pelapor. Identitas Anda hanya dibuka sejauh yang Anda pilih.">
      <BagianInfo id="identitas" judul="Tiga pilihan identitas" ikon={UserRound}>
        <ul className="grid gap-3 sm:grid-cols-3">
          {(["rahasia", "publik", "anonim"] as ModeIdentitas[]).map((m) => {
            const Ikon = IKON_MODE[m];
            return (
              <li key={m} className="rounded-2xl bg-muted/40 p-4">
                <p className="flex items-center gap-2 font-semibold"><Ikon className="size-4 text-primary" aria-hidden />{MODE_IDENTITAS[m].label}{m === "rahasia" && <span className="rounded bg-secondary px-1.5 text-[10px] font-semibold text-secondary-foreground">Bawaan</span>}</p>
                <p className="mt-1 text-sm text-muted-foreground">{MODE_IDENTITAS[m].penjelasan}</p>
              </li>
            );
          })}
        </ul>
        <p className="text-sm text-muted-foreground">Masuk dengan kode OTP email tetap diperlukan agar laporan bisa dilacak dan tidak disalahgunakan, termasuk untuk mode Anonim. Email tidak pernah ditampilkan ke instansi maupun publik.</p>
      </BagianInfo>

      <BagianInfo id="akses" judul="Siapa melihat apa" ikon={Users}>
        <div className="overflow-x-auto rounded-2xl border">
          <table className="w-full min-w-[34rem] text-sm">
            <thead className="bg-muted/60 text-xs text-muted-foreground">
              <tr>
                <th scope="col" className="p-2.5 text-left font-medium">Data</th>
                {PERAN.map((p) => <th key={p} scope="col" className="p-2.5 text-center font-medium">{p}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y">
              {MATRIKS.map((m) => (
                <tr key={m.data}>
                  <th scope="row" className="p-2.5 text-left font-normal">
                    {m.data}
                    {m.catatan && <span className="block text-xs text-muted-foreground">{m.catatan}</span>}
                  </th>
                  {m.akses.map((a, i) => <td key={PERAN[i]} className="p-2.5 text-center"><SelAkses a={a} /></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="flex items-start gap-2 text-sm text-muted-foreground"><FileLock2 className="mt-0.5 size-4 shrink-0" aria-hidden />
          Aturan ini ditegakkan di database (Row Level Security), bukan hanya di tampilan, dan setiap perubahan status tercatat permanen.</p>
      </BagianInfo>

      <BagianInfo id="foto" judul="Foto dan lokasi" ikon={ImageOff}>
        <ul className="list-disc space-y-1.5 pl-5 text-sm">
          <li>Waktu dan lokasi foto dibaca di perangkat Anda untuk mencocokkan kejadian, lalu disimpan terpisah dan hanya bisa dibaca verifikator.</li>
          <li>Foto dikompres di perangkat sebelum diunggah. File yang tersimpan tidak lagi memuat metadata lokasi.</li>
          <li>Hindari memotret wajah anak. Verifikator dapat menolak foto yang menampilkan identitas anak dengan jelas.</li>
        </ul>
      </BagianInfo>

      <BagianInfo id="data" judul="Data yang disimpan" ikon={Database}>
        <ul className="list-disc space-y-1.5 pl-5 text-sm">
          <li>Akun: email, nama tampilan, dan peran Anda sebagai pelapor (mis. orang tua atau guru).</li>
          <li>Laporan: kategori, sekolah, waktu, jumlah terdampak, deskripsi, bukti, dan pilihan identitas.</li>
          <li>Tidak ada nomor KTP, alamat rumah, atau data anak yang diminta.</li>
          <li>Data publik yang diunduh lewat API hanya berisi agregat dan kasus terverifikasi tanpa data pribadi.</li>
        </ul>
      </BagianInfo>

      <BagianInfo id="hak" judul="Hak Anda" ikon={Scale}>
        <ul className="grid gap-3 sm:grid-cols-3">
          <li className="rounded-2xl bg-muted/40 p-4 text-sm"><p className="flex items-center gap-2 font-semibold"><UserRound className="size-4 text-primary" aria-hidden />Mengubah profil</p><p className="mt-1 text-muted-foreground">Nama tampilan dan peran pelapor bisa diubah kapan saja di Laporan saya.</p></li>
          <li className="rounded-2xl bg-muted/40 p-4 text-sm"><p className="flex items-center gap-2 font-semibold"><Trash2 className="size-4 text-primary" aria-hidden />Meminta penghapusan</p><p className="mt-1 text-muted-foreground">Akun dan identitas dapat dihapus; isi kasus yang sudah publik tetap ada tanpa identitas Anda.</p></li>
          <li className="rounded-2xl bg-muted/40 p-4 text-sm"><p className="flex items-center gap-2 font-semibold"><Mail className="size-4 text-primary" aria-hidden />Menghubungi kami</p><p className="mt-1 text-muted-foreground">Ajukan pertanyaan atau keberatan lewat email tim pengelola.</p></li>
        </ul>
        <p className="text-sm text-muted-foreground">Kebijakan ini disusun mengacu pada UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi.</p>
      </BagianInfo>
    </HalamanInfo>
  );
}
