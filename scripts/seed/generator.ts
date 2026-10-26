/**
 * Generator data simulasi PantauGizi.
 *
 * Semua waktu dihitung relatif terhadap `acuan` (waktu seed dijalankan, dibulatkan ke jam),
 * sehingga struktur data selalu sama dan tetap "terkini" kapan pun seed dijalankan.
 * Peristiwa yang jatuh setelah acuan tidak dimasukkan; status kasus adalah keadaan pada acuan.
 */
import { Acak } from "./acak";
import {
  ALASAN_TOLAK, KABKOTA, KECAMATAN_SEMARANG, KOMENTAR_RATING, KOMODITAS, KOTA_SEMARANG, LABEL_KATEGORI,
  LAUK, MENU, PERILAKU, PROVINSI, RENCANA_SPPG, SLA, TEMPLAT_DESKRIPSI, TINDAK_LANJUT,
  type JenisTindakan, type Kategori, type ProfilSppg, type Tahap,
} from "./referensi";

const MENIT = 60_000;
const JAM = 60 * MENIT;
const HARI = 24 * JAM;
const WIB = 7 * JAM;
const PERIODE_HARI = 112;
const BENIH = 20261021;

type Baris = Record<string, unknown>;
type StatusAlur =
  | "diterima" | "diverifikasi" | "diteruskan" | "ditindaklanjuti" | "selesai" | "ditolak" | "dibuka_ulang";

// -----------------------------------------------------------------------------
// Utilitas waktu (semua dalam milidetik UTC; hari dan jam dihitung dalam WIB)
// -----------------------------------------------------------------------------
const iso = (ms: number) => new Date(ms).toISOString();
const bulatMenit = (ms: number) => Math.round(ms / MENIT) * MENIT;
const awalHariWib = (ms: number) => Math.floor((ms + WIB) / HARI) * HARI - WIB;
const hariSekolah = (ms: number) => {
  const d = new Date(ms + WIB).getUTCDay();
  return d >= 1 && d <= 5;
};
const tanggalWib = (ms: number) => new Date(ms + WIB).toISOString().slice(0, 10);
const bulanKe = (tahun: number, bulan0: number) =>
  `${tahun}-${String(bulan0 + 1).padStart(2, "0")}-01`;
/** Mundur ke hari sekolah terdekat (jam WIB tertentu). */
function hariSekolahSebelum(ms: number, jamWib: number): number {
  let hari = awalHariWib(ms);
  while (!hariSekolah(hari)) hari -= HARI;
  return hari + jamWib * JAM;
}

// -----------------------------------------------------------------------------
// Tipe hasil
// -----------------------------------------------------------------------------
export interface SppgGen {
  id: string;
  kode: string;
  nama: string;
  wilayahId: string;
  kecamatan: string;
  lat: number;
  lng: number;
  kapasitas: number;
  profil: ProfilSppg;
  instansiId: string;
  ditutupPada: number | null;
  sekolah: SekolahGen[];
}

export interface SekolahGen {
  id: string;
  nama: string;
  jenjang: string;
  siswa: number;
  wilayahId: string;
  sppg: SppgGen;
  lat: number;
  lng: number;
}

export interface PenggunaGen {
  id: string;
  email: string;
  nama: string;
  peran: "pelapor" | "verifikator" | "instansi" | "admin";
  jenisPelapor: string | null;
  terverifikasi: boolean;
  instansiId: string | null;
  sekolahId: string | null;
  demo: string | null;
}

interface Paksaan {
  /** Durasi tiap tahap (jam). */
  verifikasi?: number;
  teruskan?: number;
  tanggapan?: number;
  selesai?: number;
  bukaUlang?: boolean;
  /** Skor rating per pelapor (id pengguna). */
  rating?: Record<string, number>;
}

interface Kejadian {
  sppg: SppgGen;
  sekolah: SekolahGen;
  kategori: Kategori;
  waktu: number;
  terdampak: number;
  valid: boolean;
  pelapor: PenggunaGen[];
  /** Jeda (jam) dari kejadian ke laporan ke-i dibuat. */
  jedaLapor: number[];
  paksa?: Paksaan;
  tertunda?: boolean;
}

export interface DataSeed {
  acuan: number;
  wilayah: Baris[];
  sppg: Baris[];
  instansi: Baris[];
  sekolah: Baris[];
  anggaran: Baris[];
  ringkasanKasus: Baris[];
  hargaPangan: Baris[];
  pengguna: PenggunaGen[];
  laporan: Baris[];
  bukti: Baris[];
  buktiMetadata: Baris[];
  /** Dukungan ditentukan setelah grup_serupa dihitung database: [indeks kejadian, jumlah]. */
  dukunganPerLaporanPertama: { laporanId: string; jumlah: number }[];
  kasus: Baris[];
  pembaruanLaporan: Baris[];
  statusLog: Baris[];
  rating: Baris[];
  peringatan: Baris[];
  demo: {
    sppgId: string;
    sppgNama: string;
    sekolahId: string;
    sekolahNama: string;
    akun: { kunci: string; email: string; peran: string }[];
  };
}

// -----------------------------------------------------------------------------
// Generator
// -----------------------------------------------------------------------------
export function buatDataSeed(acuanMentah: number): DataSeed {
  const a = new Acak(BENIH);
  const acuan = Math.floor(acuanMentah / JAM) * JAM;
  const mulaiPeriode = awalHariWib(acuan - PERIODE_HARI * HARI);

  // --- Wilayah ---------------------------------------------------------------
  const wilayah: Baris[] = [
    { id: PROVINSI.id, nama: PROVINSI.nama, level: "provinsi", induk_id: null, pusat_lat: PROVINSI.lat, pusat_lng: PROVINSI.lng },
    ...KABKOTA.map((w) => ({ id: w.id, nama: w.nama, level: "kabkota", induk_id: PROVINSI.id, pusat_lat: w.lat, pusat_lng: w.lng })),
    ...KECAMATAN_SEMARANG.map((w) => ({ id: w.id, nama: w.nama, level: "kecamatan", induk_id: KOTA_SEMARANG, pusat_lat: w.lat, pusat_lng: w.lng })),
  ];
  const kecamatanById = new Map(KECAMATAN_SEMARANG.map((k) => [k.id, k]));

  // --- Instansi pemerintah (simulasi) -------------------------------------------
  const instansi: Baris[] = [];
  const instansiDinkes = a.uuid();
  const instansiKorwil = a.uuid();
  const instansiDisdik = a.uuid();
  const instansiOmbudsman = a.uuid();
  instansi.push(
    { id: instansiDinkes, nama: "Dinas Kesehatan Kota Semarang", jenis: "dinas_kesehatan", wilayah_id: KOTA_SEMARANG, sppg_id: null, kontak: "Simulasi" },
    { id: instansiKorwil, nama: "Korwil BGN Kota Semarang", jenis: "korwil_bgn", wilayah_id: KOTA_SEMARANG, sppg_id: null, kontak: "Simulasi" },
    { id: instansiDisdik, nama: "Dinas Pendidikan Kota Semarang", jenis: "dinas_pendidikan", wilayah_id: KOTA_SEMARANG, sppg_id: null, kontak: "Simulasi" },
    { id: instansiOmbudsman, nama: "Ombudsman RI Perwakilan Jawa Tengah", jenis: "ombudsman", wilayah_id: PROVINSI.id, sppg_id: null, kontak: "Simulasi" },
  );
  const namaInstansi = new Map<string, string>([
    [instansiDinkes, "Dinas Kesehatan Kota Semarang"],
    [instansiKorwil, "Korwil BGN Kota Semarang"],
    [instansiDisdik, "Dinas Pendidikan Kota Semarang"],
    [instansiOmbudsman, "Ombudsman RI Perwakilan Jawa Tengah"],
  ]);

  // --- SPPG ----------------------------------------------------------------------
  const NAMA_YAYASAN = ["Gizi Sehat", "Mitra Pangan", "Bina Anak", "Harapan Bangsa", "Sejahtera Bersama", "Pelita Gizi"];
  const NAMA_JALAN = ["Melati", "Kenanga", "Flamboyan", "Cempaka", "Anggrek", "Mawar", "Dahlia", "Teratai", "Bougenville", "Kamboja"];
  const sppgGen: SppgGen[] = [];
  const sppg: Baris[] = [];
  for (const rencana of RENCANA_SPPG) {
    const kec = kecamatanById.get(rencana.kecamatanId)!;
    const id = a.uuid();
    const nomor = String(rencana.nomor).padStart(2, "0");
    const nama = `SPPG ${kec.nama} ${nomor}`;
    const kapasitas = a.int(48, 68) * 50;
    let statusSlhs = "berlaku";
    let slhsSampai: string | null = tanggalWib(acuan + a.int(60, 330) * HARI);
    let statusOperasional = "beroperasi";
    let ditutupPada: number | null = null;
    if (rencana.profil === "normal" && a.peluang(0.15)) {
      statusSlhs = "proses";
      slhsSampai = null;
    }
    if (rencana.profil === "demo") {
      statusSlhs = "proses";
      slhsSampai = null;
    }
    if (rencana.profil === "bermasalah") {
      if (kec.nama === "Semarang Utara") {
        statusSlhs = "kedaluwarsa";
        slhsSampai = tanggalWib(acuan - 40 * HARI);
      } else {
        statusSlhs = "tidak_ada";
        slhsSampai = null;
      }
      if (kec.nama === "Genuk") {
        statusOperasional = "ditutup_sementara";
        ditutupPada = hariSekolahSebelum(acuan - 10 * HARI, 15);
      }
    }
    const instansiId = a.uuid();
    const g: SppgGen = {
      id, kode: `SPPG-${kec.id.replace(/\./g, "")}-${nomor}`, nama, wilayahId: kec.id, kecamatan: kec.nama,
      lat: kec.lat + a.antara(-0.01, 0.01), lng: kec.lng + a.antara(-0.01, 0.01),
      kapasitas, profil: rencana.profil, instansiId, ditutupPada, sekolah: [],
    };
    sppgGen.push(g);
    sppg.push({
      id, kode: g.kode, nama, wilayah_id: kec.id,
      alamat: `Jl. ${a.pilih(NAMA_JALAN)} No. ${a.int(1, 120)}, ${kec.nama}`,
      lat: g.lat, lng: g.lng,
      pengelola: `Yayasan ${a.pilih(NAMA_YAYASAN)} ${kec.nama}`,
      kapasitas_porsi_harian: kapasitas,
      status_operasional: statusOperasional,
      status_slhs: statusSlhs,
      slhs_berlaku_sampai: slhsSampai,
      mulai_beroperasi: tanggalWib(acuan - a.int(160, 420) * HARI),
      sumber: "simulasi",
    });
    instansi.push({ id: instansiId, nama: `Pengelola ${nama}`, jenis: "sppg", wilayah_id: kec.id, sppg_id: id, kontak: "Simulasi" });
    namaInstansi.set(instansiId, `Pengelola ${nama}`);
  }

  // --- Sekolah -----------------------------------------------------------------------
  const JENJANG = {
    paud: { awalan: "TK", siswa: [40, 90] },
    sd: { awalan: "SD", siswa: [180, 600] },
    smp: { awalan: "SMP", siswa: [300, 900] },
    sma: { awalan: "SMA", siswa: [400, 1000] },
    smk: { awalan: "SMK", siswa: [400, 1100] },
    slb: { awalan: "SLB", siswa: [40, 120] },
  } as const;
  type Jenjang = keyof typeof JENJANG;
  const penghitungNama = new Map<string, number>();
  const sekolahGen: SekolahGen[] = [];
  const sekolah: Baris[] = [];
  let npsn = 1;
  for (const s of sppgGen) {
    const target = s.kapasitas * a.antara(0.88, 0.97);
    let total = 0;
    while ((total < target && s.sekolah.length < 8) || s.sekolah.length < 4) {
      let jenjang = a.berbobot<Jenjang>({ sd: 0.45, smp: 0.2, paud: 0.15, sma: 0.1, smk: 0.08, slb: 0.02 });
      if (s.sekolah.length === 0) jenjang = "sd"; // setiap SPPG melayani minimal satu SD
      const ref = JENJANG[jenjang];
      const kunciNama = `${s.wilayahId}|${jenjang}`;
      const urut = (penghitungNama.get(kunciNama) ?? 0) + 1;
      penghitungNama.set(kunciNama, urut);
      const siswa = a.int(ref.siswa[0], ref.siswa[1]);
      const g: SekolahGen = {
        id: a.uuid(), nama: `${ref.awalan} ${s.kecamatan} ${urut}`, jenjang, siswa,
        wilayahId: s.wilayahId, sppg: s,
        lat: s.lat + a.antara(-0.018, 0.018), lng: s.lng + a.antara(-0.018, 0.018),
      };
      s.sekolah.push(g);
      sekolahGen.push(g);
      total += siswa;
      sekolah.push({
        id: g.id, npsn: `99${String(npsn++).padStart(6, "0")}`, nama: g.nama, jenjang, jumlah_siswa: siswa,
        wilayah_id: s.wilayahId, sppg_id: s.id,
        alamat: `Jl. ${a.pilih(NAMA_JALAN)} No. ${a.int(1, 150)}, ${s.kecamatan}`,
        lat: g.lat, lng: g.lng, sumber: "simulasi",
      });
    }
  }

  const sppgDemo = sppgGen.find((s) => s.profil === "demo")!;
  const sekolahDemo = sppgDemo.sekolah.find((s) => s.jenjang === "sd")!;
  const sppgLonjakan = sppgGen.find((s) => s.profil === "lonjakan")!;
  const sppgDitutup = sppgGen.find((s) => s.ditutupPada !== null)!;
  const sppgLonjakanBaru = sppgGen.find((s) => s.profil === "bermasalah" && s.kecamatan === "Pedurungan")!;
  const sekolahBudi = sekolahGen.find((s) => s.jenjang === "smp" && s.sppg.profil === "normal")!;

  // --- Pengguna ------------------------------------------------------------------------
  const NAMA_DEPAN = ["Siti", "Dewi", "Ani", "Rina", "Lestari", "Wulan", "Agus", "Bambang", "Dedi", "Eko", "Hadi", "Joko",
    "Nur", "Ratna", "Sri", "Tri", "Yuni", "Fajar", "Rizky", "Putri", "Indah", "Arif", "Bayu", "Dian"];
  const NAMA_BELAKANG = ["Wijaya", "Santoso", "Lestari", "Pratama", "Hidayat", "Saputra", "Kurniawan", "Rahayu", "Purnomo",
    "Setiawan", "Handayani", "Nugroho", "Susanti", "Wibowo", "Utami", "Permana"];

  const pengguna: PenggunaGen[] = [];
  const akunDemo = (kunci: string, nama: string, peran: PenggunaGen["peran"], ekstra: Partial<PenggunaGen> = {}) => {
    const p: PenggunaGen = {
      id: a.uuid(), email: `${kunci}@pmbgm.test`, nama, peran, jenisPelapor: null, terverifikasi: false,
      instansiId: null, sekolahId: null, demo: kunci, ...ekstra,
    };
    pengguna.push(p);
    return p;
  };
  const rina = akunDemo("rina", "Ibu Rina", "pelapor", { jenisPelapor: "orang_tua", sekolahId: sekolahDemo.id });
  const budi = akunDemo("budi", "Pak Budi", "pelapor", { jenisPelapor: "guru", terverifikasi: true, sekolahId: sekolahBudi.id });
  const sari = akunDemo("sari", "Mbak Sari", "verifikator");
  const hendra = akunDemo("hendra", "Pak Hendra", "instansi", { instansiId: instansiDinkes });
  const akunSppg = akunDemo("sppg", `Pengelola ${sppgDemo.nama}`, "instansi", { instansiId: sppgDemo.instansiId });
  const korwil = akunDemo("korwil", "Korwil BGN Kota Semarang", "instansi", { instansiId: instansiKorwil });
  akunDemo("admin", "Admin PMBGM", "admin");

  const pelakuInstansi = new Map<string, string>([
    [instansiDinkes, hendra.id], [sppgDemo.instansiId, akunSppg.id], [instansiKorwil, korwil.id],
  ]);

  const pelaporUmum: PenggunaGen[] = [];
  for (let i = 1; i <= 260; i++) {
    const terverifikasi = a.peluang(0.2);
    const jenis = terverifikasi
      ? a.berbobot({ guru: 0.45, komite_sekolah: 0.3, kader_posyandu: 0.15, sekolah: 0.1 })
      : a.berbobot({ orang_tua: 0.62, warga: 0.24, siswa: 0.14 });
    const p: PenggunaGen = {
      id: a.uuid(), email: `pelapor${String(i).padStart(3, "0")}@pmbgm.test`,
      nama: `${a.pilih(NAMA_DEPAN)} ${a.pilih(NAMA_BELAKANG)}`, peran: "pelapor", jenisPelapor: jenis,
      terverifikasi, instansiId: null, sekolahId: terverifikasi ? a.pilih(sekolahGen).id : null, demo: null,
    };
    pengguna.push(p);
    pelaporUmum.push(p);
  }
  const pilihPelapor = (jumlah: number, kecuali: PenggunaGen[] = []): PenggunaGen[] => {
    const hasil: PenggunaGen[] = [];
    while (hasil.length < jumlah) {
      const p = a.pilih(pelaporUmum);
      if (!hasil.includes(p) && !kecuali.includes(p)) hasil.push(p);
    }
    return hasil;
  };

  // --- Kejadian ---------------------------------------------------------------------------
  const kejadian: Kejadian[] = [];
  const terdampakUntuk = (kategori: Kategori, sekolahK: SekolahGen): number => {
    const batas = sekolahK.siswa;
    switch (kategori) {
      case "keracunan": return Math.min(batas, a.int(3, 22));
      case "makanan_tidak_layak": return Math.min(batas, a.int(5, 45));
      case "kebersihan": return Math.min(batas, a.int(0, 30));
      case "gizi_porsi": return Math.min(batas, a.int(10, 80));
      case "distribusi": return Math.min(batas, a.int(20, 150));
      case "pengadaan": return 0;
      default: return Math.min(batas, a.int(0, 20));
    }
  };
  const jamKejadian = (kategori: Kategori) =>
    kategori === "keracunan" || kategori === "makanan_tidak_layak" ? a.antara(11, 13.5)
      : kategori === "distribusi" ? a.antara(10, 12.5) : a.antara(9, 14.5);
  const jumlahLaporanUntuk = (kategori: Kategori) =>
    kategori === "keracunan" ? Number(a.berbobot({ "1": 0.25, "2": 0.3, "3": 0.25, "4": 0.12, "5": 0.08 }))
      : kategori === "makanan_tidak_layak" ? Number(a.berbobot({ "1": 0.7, "2": 0.22, "3": 0.08 }))
        : Number(a.berbobot({ "1": 0.86, "2": 0.14 }));
  const jedaLaporUntuk = (kategori: Kategori, jumlah: number) =>
    Array.from({ length: jumlah }, (_, i) =>
      (kategori === "keracunan" ? a.antara(1.5, 8) : a.antara(1, 26)) + i * a.antara(0.3, 6));

  const poisson = (lambda: number) => {
    const batas = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
      k++;
      p *= a.next();
    } while (p > batas);
    return k - 1;
  };

  // Kejadian acak harian. ~760 kejadian dalam 112 hari (hanya hari sekolah).
  const totalFrekuensi = sppgGen.reduce((s, x) => s + PERILAKU[x.profil].frekuensi, 0);
  const jumlahHariSekolah = Array.from({ length: PERIODE_HARI }, (_, i) => mulaiPeriode + i * HARI).filter(hariSekolah).length;
  const dasar = 760 / (totalFrekuensi * jumlahHariSekolah);
  for (let hari = mulaiPeriode; hari < acuan; hari += HARI) {
    if (!hariSekolah(hari)) continue;
    for (const s of sppgGen) {
      if (s.ditutupPada !== null && hari > s.ditutupPada) continue;
      const n = poisson(dasar * PERILAKU[s.profil].frekuensi);
      for (let i = 0; i < n; i++) {
        let kategori = a.berbobot(PERILAKU[s.profil].kategori);
        // SPPG demo sengaja tanpa kasus keracunan 30 hari terakhir (skor awal ±62, kuning).
        while (s.profil === "demo" && kategori === "keracunan" && hari > acuan - 30 * HARI) {
          kategori = a.berbobot(PERILAKU[s.profil].kategori);
        }
        const sekolahK = a.pilih(s.sekolah);
        const jumlah = jumlahLaporanUntuk(kategori);
        kejadian.push({
          sppg: s, sekolah: sekolahK, kategori,
          waktu: bulatMenit(hari + jamKejadian(kategori) * JAM),
          terdampak: terdampakUntuk(kategori, sekolahK),
          valid: a.peluang(0.93),
          pelapor: pilihPelapor(jumlah),
          jedaLapor: jedaLaporUntuk(kategori, jumlah),
        });
      }
    }
  }

  // Pola 2: lonjakan keracunan di Banyumanik pada satu minggu (±5 minggu lalu).
  for (let i = 0; i < 4; i++) {
    const waktu = hariSekolahSebelum(acuan - (38 - i * 1.5) * HARI, 11.5) + a.int(0, 90) * MENIT;
    const jumlah = a.int(3, 6);
    kejadian.push({
      sppg: sppgLonjakan, sekolah: sppgLonjakan.sekolah[i % sppgLonjakan.sekolah.length], kategori: "keracunan",
      waktu, terdampak: a.int(10, 35), valid: true, pelapor: pilihPelapor(jumlah),
      jedaLapor: jedaLaporUntuk("keracunan", jumlah),
      paksa: { verifikasi: a.antara(1, 4), teruskan: a.antara(0.3, 1.5), tanggapan: a.antara(2, 5) },
    });
  }

  // Penutupan sementara SPPG bermasalah di Genuk setelah dugaan keracunan.
  kejadian.push({
    sppg: sppgDitutup, sekolah: sppgDitutup.sekolah[0], kategori: "keracunan",
    waktu: hariSekolahSebelum(sppgDitutup.ditutupPada! - 2 * HARI, 12), terdampak: 18, valid: true,
    pelapor: pilihPelapor(4), jedaLapor: [2, 3.5, 5, 9],
    paksa: { verifikasi: 3, teruskan: 1, tanggapan: 9, selesai: 900, bukaUlang: false },
  });

  // Pola 1 (lanjutan): lonjakan laporan baru di SPPG bermasalah Pedurungan, belum diverifikasi.
  for (let i = 0; i < 4; i++) {
    const kategori: Kategori = i % 2 === 0 ? "kebersihan" : "makanan_tidak_layak";
    kejadian.push({
      sppg: sppgLonjakanBaru, sekolah: sppgLonjakanBaru.sekolah[i % sppgLonjakanBaru.sekolah.length], kategori,
      waktu: bulatMenit(acuan - (20 - i * 4) * JAM), terdampak: a.int(8, 30), valid: true,
      pelapor: pilihPelapor(1), jedaLapor: [a.antara(0.5, 2)], tertunda: true,
    });
  }

  // Pola 1 (lanjutan): kasus yang belum ditanggapi instansi melewati SLA → label "Tidak Ditanggapi".
  const sppgUtara = sppgGen.find((s) => s.profil === "bermasalah" && s.kecamatan === "Semarang Utara")!;
  const belumDitanggapi: [SppgGen, Kategori, number][] = [
    [sppgUtara, "distribusi", 3], [sppgLonjakanBaru, "kebersihan", 5], [sppgDemo, "kebersihan", 6],
  ];
  for (const [s, kategori, hariLalu] of belumDitanggapi) {
    kejadian.push({
      sppg: s, sekolah: s.sekolah[1 % s.sekolah.length], kategori,
      waktu: hariSekolahSebelum(acuan - hariLalu * HARI, 10.5), terdampak: a.int(15, 60), valid: true,
      pelapor: pilihPelapor(2), jedaLapor: [1, 4],
      paksa: { verifikasi: 4, teruskan: 2, tanggapan: 400, bukaUlang: false },
    });
  }

  // Riwayat akun demo.
  kejadian.push({
    sppg: sppgDemo, sekolah: sekolahDemo, kategori: "gizi_porsi",
    waktu: hariSekolahSebelum(acuan - 40 * HARI, 11.5), terdampak: 30, valid: true,
    pelapor: [rina], jedaLapor: [3],
    paksa: { verifikasi: 10, teruskan: 4, tanggapan: 50, selesai: 110, bukaUlang: false, rating: { [rina.id]: 3 } },
  });
  kejadian.push({
    sppg: sppgDemo, sekolah: sekolahDemo, kategori: "makanan_tidak_layak",
    waktu: hariSekolahSebelum(acuan - 4 * HARI, 12), terdampak: 22, valid: true,
    pelapor: [rina, ...pilihPelapor(1)], jedaLapor: [2, 5],
    paksa: { verifikasi: 3, teruskan: 1.5, tanggapan: 20, selesai: 114, bukaUlang: false },
  });
  kejadian.push({
    sppg: sekolahBudi.sppg, sekolah: sekolahBudi, kategori: "distribusi",
    waktu: hariSekolahSebelum(acuan - 60 * HARI, 12.5), terdampak: 120, valid: true,
    pelapor: [budi], jedaLapor: [1],
    paksa: { verifikasi: 6, teruskan: 2, tanggapan: 8, selesai: 40, bukaUlang: false, rating: { [budi.id]: 4 } },
  });
  kejadian.push({
    sppg: sekolahBudi.sppg, sekolah: sekolahBudi, kategori: "kebersihan",
    waktu: hariSekolahSebelum(acuan - 18 * HARI, 10.5), terdampak: 0, valid: true,
    pelapor: [budi, ...pilihPelapor(1)], jedaLapor: [1.5, 7],
  });

  // Skenario demo (PRD 8.2): 3 laporan keracunan dari SD Ibu Rina dalam 2 jam terakhir, menunggu
  // verifikasi. Laporan Ibu Rina saat demo menjadi laporan ke-4 di kelompok yang sama.
  kejadian.push({
    sppg: sppgDemo, sekolah: sekolahDemo, kategori: "keracunan",
    waktu: bulatMenit(acuan - 2 * JAM), terdampak: 7, valid: true,
    pelapor: pilihPelapor(3), jedaLapor: [0.5, 1, 1.4], tertunda: true,
  });

  kejadian.sort((x, y) => x.waktu - y.waktu);

  // --- Laporan, kasus, dan riwayat -----------------------------------------------------------
  const laporan: Baris[] = [];
  const bukti: Baris[] = [];
  const buktiMetadata: Baris[] = [];
  const kasus: Baris[] = [];
  const pembaruanLaporan: Baris[] = [];
  const statusLog: Baris[] = [];
  const rating: Baris[] = [];
  const dukunganPerLaporanPertama: { laporanId: string; jumlah: number }[] = [];

  const ceklisValid = { bukti_relevan: true, waktu_wajar: true, lokasi_sesuai: true, bukan_spam: true, data_anak_aman: true };
  const labelVerifikator = "Tim Verifikator";

  const isiDeskripsi = (kategori: Kategori, terdampak: number) =>
    a.pilih(TEMPLAT_DESKRIPSI[kategori])
      .replace("{jam}", `${a.int(11, 13)}.${a.pilih(["00", "15", "30", "45"])}`)
      .replace("{n}", String(Math.max(2, terdampak)))
      .replace("{menu}", a.pilih(MENU))
      .replace("{lauk}", a.pilih(LAUK))
      .replace("{jam_telat}", `${a.int(13, 14)}.${a.pilih(["10", "30", "45"])}`)
      .replace("{kurang}", String(a.int(10, 60)));

  const instansiTujuan = (k: Kejadian): string => {
    switch (k.kategori) {
      case "keracunan": return instansiDinkes;
      case "makanan_tidak_layak": return a.peluang(0.6) ? k.sppg.instansiId : instansiDinkes;
      case "kebersihan": return a.peluang(0.5) ? k.sppg.instansiId : instansiDinkes;
      case "gizi_porsi": return a.peluang(0.6) ? k.sppg.instansiId : instansiKorwil;
      case "distribusi": return a.peluang(0.7) ? k.sppg.instansiId : instansiKorwil;
      case "pengadaan": return a.peluang(0.7) ? instansiKorwil : instansiOmbudsman;
      default: return instansiKorwil;
    }
  };

  const tambahLog = (baris: Baris) => {
    if ((baris.dibuat_pada as number) <= acuan) {
      statusLog.push({
        laporan_id: null, kasus_id: null, peristiwa: "perubahan_status", dari: null, ke: null,
        jenis_tindakan: null, pelaku_id: null, pelaku_peran: "sistem", pelaku_label: "Sistem PMBGM",
        catatan: null, bukti_paths: [], publik: true, ...baris,
      });
    }
  };

  for (const k of kejadian) {
    const perilaku = PERILAKU[k.sppg.profil];
    const sla = SLA[k.kategori];
    const rentang = () => a.antara(perilaku.respons[0], perilaku.respons[1]);

    // 1) Laporan warga untuk kejadian ini
    type LaporanSim = { id: string; dibuat: number; pelapor: PenggunaGen };
    const daftar: LaporanSim[] = [];
    k.pelapor.forEach((pelapor, i) => {
      const dibuat = bulatMenit(k.waktu + k.jedaLapor[i] * JAM);
      if (dibuat > acuan) return;
      const id = a.uuid();
      const terdampak = i === 0 ? k.terdampak : Math.min(k.terdampak, a.int(1, Math.max(1, k.terdampak)));
      const modeIdentitas = pelapor.demo
        ? "rahasia"
        : a.berbobot({ rahasia: 0.55, publik: 0.25, anonim: 0.2 });
      const adaLokasi = a.peluang(0.7);
      laporan.push({
        id, kode_tiket: a.kode("MBG-", 6), pelapor_id: pelapor.id, kategori: k.kategori,
        sekolah_id: k.sekolah.id,
        waktu_kejadian: iso(bulatMenit(k.waktu + a.int(-20, 20) * MENIT)),
        jumlah_terdampak: terdampak,
        deskripsi: isiDeskripsi(k.kategori, terdampak),
        lokasi_lat: adaLokasi ? k.sekolah.lat + a.antara(-0.002, 0.002) : null,
        lokasi_lng: adaLokasi ? k.sekolah.lng + a.antara(-0.002, 0.002) : null,
        mode_identitas: modeIdentitas,
        dibuat_pada: iso(dibuat),
        diperbarui_pada: iso(dibuat),
      });
      // Bukti foto/video (berkas simulasi dilayani dari /public/simulasi)
      const jumlahBukti = Number(a.berbobot({ "0": 0.15, "1": 0.45, "2": 0.3, "3": 0.1 }));
      for (let b = 0; b < jumlahBukti; b++) {
        const buktiId = a.uuid();
        const video = a.peluang(0.08);
        bukti.push({
          id: buktiId, laporan_id: id,
          path_storage: `simulasi/${k.kategori}/${id}-${b + 1}.${video ? "mp4" : "webp"}`,
          jenis: video ? "video" : "foto", ukuran_byte: a.int(180_000, 950_000),
          dibuat_pada: iso(dibuat + MENIT),
        });
        if (!video && a.peluang(0.55)) {
          const waktuCocok = a.peluang(0.85);
          const lokasiCocok = a.peluang(0.8);
          buktiMetadata.push({
            bukti_id: buktiId,
            exif_waktu: iso(waktuCocok ? k.waktu + a.int(-60, 180) * MENIT : k.waktu - a.int(4, 30) * HARI),
            exif_lat: lokasiCocok ? k.sekolah.lat + a.antara(-0.003, 0.003) : k.sekolah.lat + a.antara(0.05, 0.2),
            exif_lng: lokasiCocok ? k.sekolah.lng + a.antara(-0.003, 0.003) : k.sekolah.lng + a.antara(0.05, 0.2),
            perangkat: a.pilih(["Android", "Android", "Android", "iPhone"]),
          });
        }
      }
      daftar.push({ id, dibuat, pelapor });
    });
    if (daftar.length === 0) continue;

    // Dukungan "Saya juga mengalami" untuk sebagian kelompok.
    if (a.peluang(k.kategori === "keracunan" ? 0.45 : 0.15)) {
      dukunganPerLaporanPertama.push({ laporanId: daftar[0].id, jumlah: a.int(1, k.kategori === "keracunan" ? 7 : 3) });
    }

    const eskalasiLaporan = (l: LaporanSim, selesaiPada: number) => {
      const tenggat = l.dibuat + sla.diterima * JAM;
      if (tenggat < Math.min(selesaiPada, acuan)) {
        tambahLog({
          laporan_id: l.id, peristiwa: "eskalasi", ke: "diterima", dibuat_pada: tenggat,
          catatan: "Verifikasi melewati batas waktu. Prioritas laporan dinaikkan.",
        });
        return true;
      }
      return false;
    };

    // 2) Laporan tidak valid: ditolak dengan alasan jelas
    if (!k.valid) {
      const alasan = a.pilih(ALASAN_TOLAK);
      for (const l of daftar) {
        const waktuTolak = bulatMenit(l.dibuat + sla.diterima * rentang() * JAM);
        const terlambat = eskalasiLaporan(l, waktuTolak);
        if (waktuTolak > acuan) {
          pembaruanLaporan.push({ id: l.id, status: "diterima", terlambat });
          continue;
        }
        pembaruanLaporan.push({
          id: l.id, status: "ditolak", alasan_tolak: alasan, terlambat: false,
          checklist_verifikasi: { ...ceklisValid, bukti_relevan: false },
          diverifikasi_oleh: sari.id, diverifikasi_pada: iso(waktuTolak),
        });
        tambahLog({
          laporan_id: l.id, dari: "diterima", ke: "ditolak", pelaku_id: sari.id, pelaku_peran: "verifikator",
          pelaku_label: labelVerifikator, catatan: alasan, dibuat_pada: waktuTolak,
        });
      }
      continue;
    }

    // 3) Verifikasi pertama membentuk kasus
    const jedaVerifikasi = k.paksa?.verifikasi ?? sla.diterima * (a.peluang(0.12) ? a.antara(1.05, 1.8) : a.antara(0.1, 0.9));
    const V = bulatMenit(daftar[0].dibuat + jedaVerifikasi * JAM);
    if (k.tertunda || V > acuan) {
      for (const l of daftar) {
        const terlambat = eskalasiLaporan(l, Infinity);
        pembaruanLaporan.push({ id: l.id, status: "diterima", terlambat });
      }
      continue;
    }

    const kasusId = a.uuid();
    const tujuan = instansiTujuan(k);
    const labelTujuan = namaInstansi.get(tujuan)!;
    const pelakuTujuan = pelakuInstansi.get(tujuan) ?? null;

    // Rencana tahap: durasi dalam jam
    const durTeruskan = k.paksa?.teruskan ?? sla.diverifikasi * (a.peluang(0.08) ? a.antara(1.1, 2) : a.antara(0.1, 0.85));
    const durTanggapan = k.paksa?.tanggapan ?? sla.diteruskan * rentang();
    const durSelesai = k.paksa?.selesai ?? sla.ditindaklanjuti * rentang();
    const peluangBuka = k.sppg.profil === "bermasalah" ? 0.18 : k.sppg.profil === "demo" ? 0.1 : 0.04;
    const bukaUlang = k.paksa?.bukaUlang ?? a.peluang(peluangBuka);

    const F = bulatMenit(V + durTeruskan * JAM);
    const R1 = bulatMenit(F + durTanggapan * JAM);
    const C = bulatMenit(R1 + durSelesai * JAM);

    // Laporan masuk ke kasus: yang dibuat sebelum V diverifikasi di V; sisanya digabung belakangan.
    const anggota: { l: LaporanSim; waktu: number }[] = [];
    for (const l of daftar) {
      if (l.dibuat <= V) anggota.push({ l, waktu: V });
      else {
        const w = bulatMenit(Math.min(l.dibuat + sla.diterima * a.antara(0.1, 0.8) * JAM, C - JAM));
        anggota.push({ l, waktu: Math.max(w, l.dibuat + 10 * MENIT) });
      }
    }
    for (const { l, waktu } of anggota) {
      const terlambat = eskalasiLaporan(l, waktu);
      if (waktu > acuan) {
        pembaruanLaporan.push({ id: l.id, status: "diterima", terlambat });
        continue;
      }
      pembaruanLaporan.push({
        id: l.id, status: "diverifikasi", kasus_id: kasusId, terlambat: false,
        checklist_verifikasi: ceklisValid, diverifikasi_oleh: sari.id, diverifikasi_pada: iso(waktu),
      });
      tambahLog({
        laporan_id: l.id, kasus_id: kasusId, dari: "diterima", ke: "diverifikasi", pelaku_id: sari.id,
        pelaku_peran: "verifikator", pelaku_label: labelVerifikator,
        catatan: "Bukti diperiksa dan laporan dinyatakan valid.", dibuat_pada: waktu,
      });
      if (waktu > V) {
        tambahLog({
          kasus_id: kasusId, peristiwa: "penggabungan", pelaku_id: sari.id, pelaku_peran: "verifikator",
          pelaku_label: labelVerifikator, catatan: "1 laporan serupa digabung ke kasus ini.", dibuat_pada: waktu + MENIT,
        });
      }
    }
    const awal = anggota.filter((x) => x.waktu === V).length;
    if (awal > 1) {
      tambahLog({
        kasus_id: kasusId, peristiwa: "penggabungan", pelaku_id: sari.id, pelaku_peran: "verifikator",
        pelaku_label: labelVerifikator, catatan: `${awal} laporan serupa digabung ke kasus ini.`, dibuat_pada: V + MENIT,
      });
    }

    // 4) Simulasi tahap kasus sampai waktu acuan
    let status: StatusAlur = "diverifikasi";
    let statusSejak = V;
    let pernahTerlambat = false;
    let terlambat = false;
    let diteruskanPada: number | null = null;
    let ditanggapiPada: number | null = null;
    let selesaiPada: number | null = null;
    let selesaiAkhir: number | null = null;

    /** Jalankan satu tahap. Mengembalikan false bila acuan tercapai sebelum tahap selesai. */
    const tahap = (tahapIni: Tahap, mulai: number, akhir: number): boolean => {
      const tenggat = mulai + sla[tahapIni] * JAM;
      if (tenggat < Math.min(akhir, acuan)) {
        pernahTerlambat = true;
        tambahLog({
          kasus_id: kasusId, peristiwa: "eskalasi", ke: tahapIni, dibuat_pada: tenggat,
          catatan: tahapIni === "diteruskan" || tahapIni === "dibuka_ulang"
            ? 'Instansi belum menanggapi dalam batas waktu. Ditandai "Tidak Ditanggapi" dan prioritas dinaikkan.'
            : `Tahap ${tahapIni === "diverifikasi" ? "Diverifikasi" : "Ditindaklanjuti"} melewati batas waktu. Prioritas dinaikkan.`,
        });
        if (akhir > acuan) terlambat = true;
      }
      return akhir <= acuan;
    };

    const langkah = [...TINDAK_LANJUT[k.kategori]];
    const catatanSelesai = langkah.pop()![1];
    if (k.kategori === "keracunan" && k.sppg.ditutupPada === null && k.sppg.profil !== "bermasalah" && a.peluang(0.5)) {
      const i = langkah.findIndex(([j]) => j === "penutupan_sementara");
      if (i >= 0) langkah.splice(i, 1);
    }
    const buktiTindakLanjut = (n: number) =>
      a.peluang(0.55) ? [`simulasi/tindak-lanjut/${kasusId}-${n}.webp`] : [];

    let berjalan = tahap("diverifikasi", V, F);
    if (berjalan) {
      status = "diteruskan";
      statusSejak = F;
      diteruskanPada = F;
      tambahLog({
        kasus_id: kasusId, dari: "diverifikasi", ke: "diteruskan", pelaku_id: sari.id, pelaku_peran: "verifikator",
        pelaku_label: labelVerifikator,
        catatan: `Diteruskan ke ${labelTujuan}. Batas waktu tanggapan mulai dihitung.`, dibuat_pada: F,
      });
      berjalan = tahap("diteruskan", F, R1);
    }
    if (berjalan) {
      status = "ditindaklanjuti";
      statusSejak = R1;
      ditanggapiPada = R1;
      langkah.forEach(([jenis, catatan], i) => {
        const w = i === 0 ? R1 : bulatMenit(R1 + (C - R1) * (i / langkah.length) * a.antara(0.7, 1));
        tambahLog({
          kasus_id: kasusId, peristiwa: "tindak_lanjut", dari: i === 0 ? "diteruskan" : "ditindaklanjuti",
          ke: "ditindaklanjuti", jenis_tindakan: jenis as JenisTindakan, pelaku_id: pelakuTujuan,
          pelaku_peran: "instansi", pelaku_label: labelTujuan, catatan, bukti_paths: buktiTindakLanjut(i + 1),
          dibuat_pada: w,
        });
      });
      berjalan = tahap("ditindaklanjuti", R1, C);
    }
    if (berjalan) {
      status = "selesai";
      statusSejak = C;
      selesaiPada = C;
      selesaiAkhir = C;
      tambahLog({
        kasus_id: kasusId, dari: "ditindaklanjuti", ke: "selesai", pelaku_id: pelakuTujuan, pelaku_peran: "instansi",
        pelaku_label: labelTujuan, catatan: catatanSelesai, bukti_paths: buktiTindakLanjut(9), dibuat_pada: C,
      });

      if (bukaUlang) {
        const O = bulatMenit(C + a.int(20, 120) * JAM);
        const R2 = bulatMenit(O + sla.dibuka_ulang * rentang() * JAM);
        const C2 = bulatMenit(R2 + sla.ditindaklanjuti * a.antara(0.2, 0.7) * JAM);
        if (O <= acuan) {
          const pembuka = anggota.find((x) => x.waktu <= acuan)?.l.pelapor ?? daftar[0].pelapor;
          status = "dibuka_ulang";
          statusSejak = O;
          selesaiPada = null;
          selesaiAkhir = null;
          tambahLog({
            kasus_id: kasusId, dari: "selesai", ke: "dibuka_ulang", pelaku_id: pembuka.id, pelaku_peran: "pelapor",
            pelaku_label: "Pelapor", catatan: "Masalah yang sama terulang beberapa hari setelah kasus dinyatakan selesai.",
            dibuat_pada: O,
          });
          if (tahap("dibuka_ulang", O, R2)) {
            status = "ditindaklanjuti";
            statusSejak = R2;
            tambahLog({
              kasus_id: kasusId, peristiwa: "tindak_lanjut", dari: "dibuka_ulang", ke: "ditindaklanjuti",
              jenis_tindakan: "perbaikan", pelaku_id: pelakuTujuan, pelaku_peran: "instansi", pelaku_label: labelTujuan,
              catatan: "Tindak lanjut ulang: pemeriksaan kembali dilakukan dan perbaikan tambahan diterapkan.",
              bukti_paths: buktiTindakLanjut(10), dibuat_pada: R2,
            });
            if (tahap("ditindaklanjuti", R2, C2)) {
              status = "selesai";
              statusSejak = C2;
              selesaiPada = C2;
              selesaiAkhir = C2;
              tambahLog({
                kasus_id: kasusId, dari: "ditindaklanjuti", ke: "selesai", pelaku_id: pelakuTujuan,
                pelaku_peran: "instansi", pelaku_label: labelTujuan,
                catatan: "Perbaikan tambahan sudah diperiksa dan dinyatakan tuntas.", dibuat_pada: C2,
              });
            }
          }
        }
      }
    }

    // 5) Rating pelapor setelah kasus selesai
    if (selesaiAkhir !== null) {
      for (const { l, waktu } of anggota) {
        if (waktu > acuan) continue;
        const paksaan = k.paksa?.rating?.[l.pelapor.id];
        if (paksaan === undefined && (l.pelapor.demo || !a.peluang(0.72))) continue;
        const dibuat = bulatMenit(selesaiAkhir + a.int(3, 96) * JAM);
        if (dibuat > acuan) continue;
        const skor = paksaan ?? Math.max(1, Math.min(5,
          a.int(perilaku.rating[0], perilaku.rating[1]) - (bukaUlang ? 1 : 0)));
        rating.push({
          laporan_id: l.id, kasus_id: kasusId, pengguna_id: l.pelapor.id, skor,
          komentar: a.peluang(0.6) ? a.pilih(KOMENTAR_RATING[skor]) : null, dibuat_pada: iso(dibuat),
        });
      }
    }

    const sekolahNama = k.sekolah.nama;
    const tenggat = status === "selesai" ? null
      : statusSejak + SLA[k.kategori][status as Tahap] * JAM;
    kasus.push({
      id: kasusId,
      kode_kasus: a.kode("KS-", 7),
      kategori: k.kategori,
      sppg_id: k.sppg.id,
      sekolah_id: k.sekolah.id,
      wilayah_id: k.sekolah.wilayahId,
      judul: `${LABEL_KATEGORI[k.kategori]} di ${sekolahNama}`,
      ringkasan_publik: `Laporan warga tentang ${LABEL_KATEGORI[k.kategori].toLowerCase()} di ${sekolahNama} `
        + `(layanan ${k.sppg.nama}). Identitas pelapor dan data anak tidak ditampilkan.`,
      status,
      status_sejak: iso(statusSejak),
      tenggat_tahap: tenggat === null ? null : iso(tenggat),
      terlambat,
      pernah_terlambat: pernahTerlambat,
      instansi_id: diteruskanPada !== null ? tujuan : null,
      waktu_kejadian: iso(k.waktu),
      diverifikasi_pada: iso(V),
      diteruskan_pada: diteruskanPada === null ? null : iso(diteruskanPada),
      ditanggapi_pada: ditanggapiPada === null ? null : iso(ditanggapiPada),
      selesai_pada: selesaiPada === null ? null : iso(selesaiPada),
      dibuat_pada: iso(V),
      diperbarui_pada: iso(statusSejak),
    });
  }

  for (const l of statusLog) l.dibuat_pada = iso(l.dibuat_pada as number);

  // --- Peringatan dini historis untuk lonjakan Banyumanik --------------------------------------------
  const peringatan: Baris[] = [];
  const laporanLonjakan = laporan
    .filter((l) => sppgLonjakan.sekolah.some((s) => s.id === l.sekolah_id))
    .map((l) => Date.parse(l.dibuat_pada as string));
  let puncak = { waktu: 0, n: 0 };
  for (const t of laporanLonjakan) {
    const n = laporanLonjakan.filter((x) => x > t - HARI && x <= t).length;
    if (n > puncak.n) puncak = { waktu: t, n };
  }
  if (puncak.n >= 3) {
    const sebelumnya = laporanLonjakan.filter((x) => x <= puncak.waktu - HARI && x > puncak.waktu - 31 * HARI).length;
    const rata = Math.round((sebelumnya / 30) * 100) / 100;
    for (const basis of ["semua", "terverifikasi"]) {
      peringatan.push({
        sppg_id: sppgLonjakan.id, wilayah_id: sppgLonjakan.wilayahId, basis,
        jumlah_24_jam: puncak.n, rata_rata_harian: rata,
        rasio: Math.round((puncak.n / Math.max(rata, 0.1)) * 100) / 100,
        aktif: false, dibuat_pada: iso(puncak.waktu + (basis === "semua" ? 15 : 6 * 60) * MENIT),
      });
    }
  }

  // --- Data program: anggaran, ringkasan kasus, harga pangan -------------------------------------------
  const tglAcuan = new Date(acuan + WIB);
  const tahun = tglAcuan.getUTCFullYear();
  const bulanAcuan = tglAcuan.getUTCMonth();
  const hariDalamBulanAcuan = new Date(Date.UTC(tahun, bulanAcuan + 1, 0)).getUTCDate();
  const porsiBulanBerjalan = tglAcuan.getUTCDate() / hariDalamBulanAcuan;
  const TINGKAT_REALISASI = [0.4, 0.45, 0.5, 0.52, 0.55, 0.58, 0.6, 0.63, 0.66, 0.68, 0.7, 0.72];
  const KASUS_PROVINSI = [18, 22, 25, 28, 30, 26, 34, 52, 40, 30, 28, 24];

  const anggaran: Baris[] = [];
  const ringkasanKasus: Baris[] = [];
  const hargaPangan: Baris[] = [];
  const totalPenduduk = KABKOTA.reduce((s, w) => s + w.penduduk, 0);
  const PAGU_PROVINSI = 2.97e12; // per bulan (simulasi, ±13% dari pagu nasional Rp268 T / 12)

  // Kecamatan Kota Semarang dihitung dari data detail (sampel 25 SPPG yang dipantau platform).
  // Baris kab/kota Kota Semarang tetap agregat setara kab/kota lain agar peta provinsi sebanding.
  const agregatKecamatan = KECAMATAN_SEMARANG.map((kec) => {
    const daftarSppg = sppgGen.filter((s) => s.wilayahId === kec.id);
    return {
      kec,
      sppg: daftarSppg.length,
      penerima: daftarSppg.reduce((s, x) => s + x.sekolah.reduce((t, y) => t + y.siswa, 0), 0),
    };
  });

  for (let b = 0; b <= bulanAcuan; b++) {
    const bulan = bulanKe(tahun, b);
    const faktorBulan = b === bulanAcuan ? porsiBulanBerjalan : 1;
    const tingkat = TINGKAT_REALISASI[b];
    const kemajuan = b / 11;
    for (const ag of agregatKecamatan) {
      if (ag.sppg === 0) continue;
      const pagu = Math.round(ag.penerima * 15000 * 21);
      const realisasi = Math.round(pagu * Math.min(1, tingkat * a.antara(0.95, 1.25)) * faktorBulan);
      anggaran.push({
        wilayah_id: ag.kec.id, bulan, pagu, realisasi, jumlah_penerima: ag.penerima, jumlah_sppg: ag.sppg, sumber: "simulasi",
      });
    }
    for (const w of KABKOTA) {
      const bagian = (w.penduduk / totalPenduduk) * a.antara(0.92, 1.08);
      const pagu = Math.round(PAGU_PROVINSI * bagian);
      anggaran.push({
        wilayah_id: w.id, bulan, pagu,
        realisasi: Math.round(pagu * Math.min(1, tingkat * a.antara(0.88, 1.12)) * faktorBulan),
        jumlah_penerima: Math.round((6.9e6 + 0.7e6 * kemajuan) * bagian),
        jumlah_sppg: Math.round((3150 + 500 * kemajuan - (b >= 8 ? 60 : 0)) * bagian),
        sumber: "simulasi",
      });
    }

    // Ringkasan kasus keracunan kab/kota (lapisan agregat).
    const target = Math.round(KASUS_PROVINSI[b] * faktorBulan);
    const perWilayah = new Map<string, number>();
    for (let i = 0; i < target; i++) {
      let r = a.next() * totalPenduduk;
      const w = KABKOTA.find((x) => (r -= x.penduduk) < 0) ?? KABKOTA[0];
      perWilayah.set(w.id, (perWilayah.get(w.id) ?? 0) + 1);
    }
    for (const w of KABKOTA) {
      const n = perWilayah.get(w.id) ?? 0;
      let korban = 0;
      for (let i = 0; i < n; i++) korban += a.int(8, 70);
      ringkasanKasus.push({ wilayah_id: w.id, bulan, jumlah_kasus: n, jumlah_korban: korban, sumber: "simulasi" });
    }
  }

  // Harga pangan 3 bulan terakhir (DT-08)
  const hargaDasar = new Map<string, number>();
  for (let b = Math.max(0, bulanAcuan - 2); b <= bulanAcuan; b++) {
    for (const w of KABKOTA) {
      for (const kom of KOMODITAS) {
        const kunci = `${w.id}|${kom.nama}`;
        const dasarHarga = hargaDasar.get(kunci) ?? a.antara(kom.harga[0], kom.harga[1]);
        const harga = Math.round((dasarHarga * a.antara(0.98, 1.03)) / 50) * 50;
        hargaDasar.set(kunci, harga);
        hargaPangan.push({ wilayah_id: w.id, bulan: bulanKe(tahun, b), komoditas: kom.nama, satuan: kom.satuan, harga, sumber: "simulasi" });
      }
    }
  }

  return {
    acuan,
    wilayah, sppg, instansi, sekolah, anggaran, ringkasanKasus, hargaPangan,
    pengguna, laporan, bukti, buktiMetadata, dukunganPerLaporanPertama,
    kasus, pembaruanLaporan, statusLog, rating, peringatan,
    demo: {
      sppgId: sppgDemo.id, sppgNama: sppgDemo.nama, sekolahId: sekolahDemo.id, sekolahNama: sekolahDemo.nama,
      akun: pengguna.filter((p) => p.demo).map((p) => ({ kunci: p.demo!, email: p.email, peran: p.peran })),
    },
  };
}

