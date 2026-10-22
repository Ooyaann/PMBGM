import type { SumberData } from "@/lib/label";

/**
 * Registri dataset terbuka (DT-07). Dipakai bersama oleh halaman Unduh dan API /api/v1/[dataset],
 * jadi daftar keduanya selalu sama. Hanya kolom publik: tanpa data pelapor, laporan yang belum
 * terverifikasi, atau metadata lokasi foto.
 */
export interface Dataset {
  kunci: string;
  nama: string;
  ringkas: string;
  sumber: SumberData;
  ikon: "map" | "utensils" | "school" | "wallet" | "folder" | "heart" | "radar" | "scale" | "basket";
  tabel: string;
  kolom: string;
  urut: string;
}

export const DATASET: Dataset[] = [
  { kunci: "wilayah", nama: "Wilayah", ringkas: "Provinsi, kab/kota, kecamatan", sumber: "resmi", ikon: "map",
    tabel: "wilayah", kolom: "id,nama,level,induk_id,pusat_lat,pusat_lng", urut: "id" },
  { kunci: "sppg", nama: "SPPG", ringkas: "Dapur, kapasitas, status SLHS", sumber: "simulasi", ikon: "utensils",
    tabel: "sppg", kolom: "id,kode,nama,wilayah_id,kapasitas_porsi_harian,status_operasional,status_slhs,slhs_berlaku_sampai,mulai_beroperasi,lat,lng,sumber", urut: "kode" },
  { kunci: "sekolah", nama: "Sekolah", ringkas: "Jenjang, siswa, SPPG pelayan", sumber: "simulasi", ikon: "school",
    tabel: "sekolah", kolom: "id,npsn,nama,jenjang,jumlah_siswa,wilayah_id,sppg_id,sumber", urut: "nama" },
  { kunci: "anggaran", nama: "Anggaran bulanan", ringkas: "Pagu, realisasi, penerima", sumber: "simulasi", ikon: "wallet",
    tabel: "v_anggaran", kolom: "wilayah_id,nama,level,bulan,pagu,realisasi,persen_realisasi,jumlah_penerima,jumlah_sppg,realisasi_per_penerima,sumber", urut: "bulan" },
  { kunci: "kasus", nama: "Kasus terverifikasi", ringkas: "Status, batas waktu, instansi", sumber: "laporan_warga_terverifikasi", ikon: "folder",
    tabel: "v_kasus_publik", kolom: "id,kode_kasus,kategori,judul,status,terlambat,tidak_ditanggapi,jumlah_laporan,total_terdampak,waktu_kejadian,diverifikasi_pada,diteruskan_pada,ditanggapi_pada,selesai_pada,rating_rata,sppg_id,sekolah_id,wilayah_id,instansi_nama", urut: "waktu_kejadian" },
  { kunci: "kasus-kabkota", nama: "Keracunan per kab/kota", ringkas: "Kasus & korban per bulan", sumber: "simulasi", ikon: "heart",
    tabel: "v_kasus_keracunan_bulanan", kolom: "wilayah_id,bulan,jumlah_kasus,jumlah_korban,sumber", urut: "bulan" },
  { kunci: "indeks-risiko", nama: "Indeks Risiko SPPG", ringkas: "Skor 0–100 dan komponennya", sumber: "laporan_warga_terverifikasi", ikon: "radar",
    tabel: "indeks_risiko", kolom: "sppg_id,wilayah_id,periode_awal,periode_akhir,porsi,jumlah_laporan,jumlah_keracunan,l,k,s,t,p,indeks,kategori_risiko,dihitung_pada", urut: "indeks" },
  { kunci: "akuntabilitas", nama: "Akuntabilitas SPPG", ringkas: "Selesai, tanggap, terlambat", sumber: "laporan_warga_terverifikasi", ikon: "scale",
    tabel: "v_akuntabilitas_sppg", kolom: "sppg_id,nama,wilayah_id,jumlah_kasus,kasus_selesai,persen_selesai,rata_jam_respons,persen_terlambat,kasus_tidak_ditanggapi,kepuasan,jumlah_rating", urut: "nama" },
  { kunci: "harga-pangan", nama: "Harga pangan", ringkas: "Lima bahan pokok per kab/kota", sumber: "simulasi", ikon: "basket",
    tabel: "harga_pangan", kolom: "wilayah_id,bulan,komoditas,satuan,harga,sumber", urut: "bulan" },
];

export const LISENSI = "CC BY 4.0";
