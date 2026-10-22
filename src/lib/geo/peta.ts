import "server-only";
import { geoMercator, geoPath } from "d3-geo";
import type { FeatureCollection, MultiPolygon, Polygon } from "geojson";
import kabkota from "./kabkota-jateng.json";
import kecamatan from "./kecamatan-semarang.json";

/**
 * Batas wilayah: Badan Informasi Geospasial (BIG), BATASWILAYAH edisi 2026-06-12, melalui
 * wilayah-id (github.com/dhanyyudi/wilayah-id). Disederhanakan dengan mapshaper dan cincinnya
 * diputar searah jarum jam untuk d3-geo. Batas indikatif, bukan dasar hukum.
 * Lapisan kab/kota tidak memuat pulau kecil dan Kepulauan Karimunjawa (Jepara) agar peta
 * daratan Jawa Tengah tidak mengecil; datanya tetap tercakup di tabel dan tooltip Jepara.
 */
export const SUMBER_BATAS = "Batas wilayah: Badan Informasi Geospasial (BIG) 2026, via wilayah-id";

export type LapisanGeo = "jateng" | "semarang";

type Koleksi = FeatureCollection<Polygon | MultiPolygon, { id: string; nama: string }>;
const KOLEKSI: Record<LapisanGeo, Koleksi> = {
  jateng: kabkota as unknown as Koleksi,
  semarang: kecamatan as unknown as Koleksi,
};

export interface BentukWilayah {
  id: string;
  nama: string;
  /** Path SVG dalam koordinat kanvas. */
  d: string;
  /** Titik tengah visual, untuk posisi tooltip saat dipilih dengan keyboard. */
  pusat: [number, number];
}

export interface KanvasPeta {
  lebar: number;
  tinggi: number;
  wilayah: BentukWilayah[];
  /** Proyeksikan titik (lng, lat) ke kanvas yang sama. */
  titik: (lng: number, lat: number) => [number, number];
}

const tembolok = new Map<string, KanvasPeta>();

/**
 * Proyeksi Mercator yang dipaskan ke lebar kanvas; tinggi mengikuti bentuk wilayah.
 * Dihitung di server sehingga peramban hanya menerima path SVG jadi.
 */
export function kanvasPeta(lapisan: LapisanGeo, lebar = 800, tepi = 8): KanvasPeta {
  const kunci = `${lapisan}:${lebar}:${tepi}`;
  const ada = tembolok.get(kunci);
  if (ada) return ada;

  const fc = KOLEKSI[lapisan];
  const proyeksi = geoMercator().fitWidth(lebar - tepi * 2, fc);
  const jalur = geoPath(proyeksi).digits(1);
  const [[, y0], [, y1]] = jalur.bounds(fc);
  proyeksi.translate([proyeksi.translate()[0] + tepi, proyeksi.translate()[1] - y0 + tepi]);

  const hasil: KanvasPeta = {
    lebar,
    tinggi: Math.ceil(y1 - y0 + tepi * 2),
    wilayah: fc.features.map((f) => {
      const [x, y] = jalur.centroid(f);
      return { id: f.properties.id, nama: f.properties.nama, d: jalur(f) ?? "", pusat: [Math.round(x), Math.round(y)] };
    }),
    titik: (lng, lat) => {
      const [x, y] = proyeksi([lng, lat]) ?? [0, 0];
      return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
    },
  };
  tembolok.set(kunci, hasil);
  return hasil;
}
