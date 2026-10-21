import { z } from "zod";

export const DAFTAR_KATEGORI = [
  "keracunan", "makanan_tidak_layak", "kebersihan", "gizi_porsi", "distribusi", "pengadaan", "lainnya",
] as const;

export const DAFTAR_MODE = ["rahasia", "publik", "anonim"] as const;

/** Skema laporan yang sama untuk validasi di browser dan di server (PRD 10.2). */
export const skemaLaporan = z.object({
  kategori: z.enum(DAFTAR_KATEGORI, { error: "Pilih jenis masalah." }),
  sekolahId: z.uuid({ error: "Pilih sekolah dari daftar." }),
  waktuKejadian: z.iso
    .datetime({ offset: true, error: "Isi waktu kejadian." })
    .refine((w) => Date.parse(w) <= Date.now() + 60 * 60 * 1000, { error: "Waktu kejadian tidak boleh di masa depan." })
    .refine((w) => Date.parse(w) >= Date.now() - 30 * 24 * 60 * 60 * 1000, {
      error: "Kejadian lebih dari 30 hari lalu tidak bisa dilaporkan di sini.",
    }),
  jumlahTerdampak: z.number({ error: "Isi perkiraan jumlah." }).int().min(0).max(5000, { error: "Maksimal 5.000 orang." }),
  deskripsi: z
    .string()
    .trim()
    .min(20, { error: "Ceritakan minimal 20 karakter agar bisa diverifikasi." })
    .max(4000, { error: "Maksimal 4.000 karakter." }),
  lokasi: z.object({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) }).nullable(),
  modeIdentitas: z.enum(DAFTAR_MODE),
});

export type InputLaporan = z.infer<typeof skemaLaporan>;

/** Batas berkas bukti (sesuai bucket "bukti" di Supabase). */
export const BATAS_BUKTI = {
  jumlah: 3,
  fotoMaksMB: 1,
  videoMaksMB: 10,
  jenisFoto: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"],
  jenisVideo: ["video/mp4", "video/webm", "video/quicktime"],
} as const;
