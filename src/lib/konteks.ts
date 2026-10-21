/**
 * Data konteks nasional (riil) untuk landing page, PRD 1.1.
 * Temuan masyarakat sipil ditulis sebagai dugaan dan diberi label sumbernya (PRD 7.2).
 */
import type { SumberData } from "@/lib/label";

export interface FaktaKonteks {
  angka: string;
  label: string;
  catatan?: string;
  sumber: { nama: string; url: string; tanggal: string };
  jenis: SumberData;
}

export const FAKTA_NASIONAL: FaktaKonteks[] = [
  {
    angka: "Rp268 T",
    label: "Pagu anggaran MBG 2026",
    catatan: "Dipangkas dari Rp335 T pada Mei 2026",
    sumber: {
      nama: "Infobank",
      url: "https://infobanknews.com/purbaya-pangkas-anggaran-mbg-2026-dari-rp335-triliun-jadi-rp268-triliun-ini-alasannya/",
      tanggal: "21 Mei 2026",
    },
    jenis: "resmi",
  },
  {
    angka: "57 juta",
    label: "Penerima manfaat",
    catatan: "Realisasi anggaran Rp153,2 T s.d. 30 September 2026",
    sumber: {
      nama: "Katadata",
      url: "https://katadata.co.id/finansial/makro/6ac87f14389ac/realisasi-anggaran-mbg-capai-rp153-2-triliun-jangkau-57-juta-penerima-manfaat",
      tanggal: "9 Oktober 2026",
    },
    jenis: "resmi",
  },
  {
    angka: "27.485",
    label: "Dapur SPPG beroperasi",
    catatan: "1.276 SPPG ditutup karena belum punya SLHS",
    sumber: {
      nama: "Katadata",
      url: "https://katadata.co.id/finansial/makro/6ac87f14389ac/realisasi-anggaran-mbg-capai-rp153-2-triliun-jangkau-57-juta-penerima-manfaat",
      tanggal: "9 Oktober 2026",
    },
    jenis: "resmi",
  },
  {
    angka: "43.838",
    label: "Korban dugaan keracunan sejak 2025",
    catatan: "Di 36 provinsi; Jawa Tengah 35% kasus Agustus 2026",
    sumber: {
      nama: "JPPI via Suara.com",
      url: "https://www.suara.com/news/2026/09/03/092507/korban-keracunan-mbg-mencapai-43838-orang-jppi-heran-tak-ada-sppg-yang-diproses-hukum",
      tanggal: "3 September 2026",
    },
    jenis: "masyarakat_sipil",
  },
];

/** Platform resmi yang dilengkapi, bukan digantikan (PRD 1.3). */
export const PLATFORM_LAIN = [
  {
    nama: "Radar MBG (BGN)",
    url: "https://www.rctiplus.com/news/detail/terkini/5452393/masyarakat-kini-bisa-pantau-menu-mbg-hingga-dapur-sppg-secara-online-lewat-portal-ini",
    fungsi: "Menu harian per sekolah dan data SPPG per wilayah",
    celah: "Belum ada kanal pengaduan publik dan analisis risiko",
  },
  {
    nama: "Reviu Menu MBG (BGN)",
    url: "https://www.metrotvnews.com/read/kj2CD2eW-mulai-juni-2026-publik-bisa-pantau-program-mbg-lewat-aplikasi",
    fungsi: "Penilaian menu oleh penilai yang ditunjuk",
    celah: "Masyarakat umum belum bisa melapor; proses verifikasi tidak dijelaskan",
  },
  {
    nama: "SP4N-LAPOR!",
    url: "https://www.lapor.go.id/",
    fungsi: "Pengaduan pelayanan publik umum dengan pelacakan",
    celah: "Belum terhubung ke data sekolah dan SPPG, tanpa mode darurat dan indeks risiko",
  },
] as const;

