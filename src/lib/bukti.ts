/**
 * Persiapan bukti di browser (LP-02, PRD 7.2–7.3):
 * 1. Baca metadata EXIF (waktu & GPS) SEBELUM kompresi, untuk verifikasi.
 * 2. Kompres foto ke WebP ≤ 1 MB. Hasil kompresi otomatis bersih dari metadata lokasi.
 */
import { BATAS_BUKTI } from "@/lib/validasi/laporan";

export interface MetadataBukti {
  exifWaktu: string | null;
  exifLat: number | null;
  exifLng: number | null;
  perangkat: string | null;
}

export interface BuktiSiap {
  id: string;
  berkas: File;
  jenis: "foto" | "video";
  pratinjau: string;
  metadata: MetadataBukti | null;
  ukuranAsli: number;
}

async function bacaMetadata(berkas: File): Promise<MetadataBukti | null> {
  try {
    const exifr = (await import("exifr")).default;
    const m = await exifr.parse(berkas, { gps: true, pick: ["DateTimeOriginal", "CreateDate", "Make", "Model", "GPSLatitude", "GPSLongitude"] });
    if (!m) return null;
    const waktu: Date | undefined = m.DateTimeOriginal ?? m.CreateDate;
    return {
      exifWaktu: waktu instanceof Date && !Number.isNaN(waktu.getTime()) ? waktu.toISOString() : null,
      exifLat: typeof m.latitude === "number" ? m.latitude : null,
      exifLng: typeof m.longitude === "number" ? m.longitude : null,
      perangkat: [m.Make, m.Model].filter(Boolean).join(" ") || null,
    };
  } catch {
    return null;
  }
}

export async function siapkanBukti(berkas: File): Promise<BuktiSiap> {
  const id = crypto.randomUUID();
  if ((BATAS_BUKTI.jenisVideo as readonly string[]).includes(berkas.type)) {
    if (berkas.size > BATAS_BUKTI.videoMaksMB * 1024 * 1024) {
      throw new Error(`Video maksimal ${BATAS_BUKTI.videoMaksMB} MB. Potong videonya lalu coba lagi.`);
    }
    return { id, berkas, jenis: "video", pratinjau: URL.createObjectURL(berkas), metadata: null, ukuranAsli: berkas.size };
  }
  if (!berkas.type.startsWith("image/")) throw new Error("Hanya foto atau video yang bisa dilampirkan.");

  const metadata = await bacaMetadata(berkas);
  const imageCompression = (await import("browser-image-compression")).default;
  const hasil = await imageCompression(berkas, {
    maxSizeMB: BATAS_BUKTI.fotoMaksMB,
    maxWidthOrHeight: 1920,
    fileType: "image/webp",
    initialQuality: 0.82,
    useWebWorker: true,
  });
  const terkompres = new File([hasil], berkas.name.replace(/\.[^.]+$/, "") + ".webp", { type: "image/webp" });
  return { id, berkas: terkompres, jenis: "foto", pratinjau: URL.createObjectURL(terkompres), metadata, ukuranAsli: berkas.size };
}
