import subprocess
import os
import sys
import time
import urllib.parse

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUTPUT_DIR = r"d:\UNNES\LOMBA\MIA 2026\Web\design\screenshots\screenshoot_per_halaman"
BASE_URL = "http://127.0.0.1:3000"

os.makedirs(OUTPUT_DIR, exist_ok=True)

def dev_url(kunci, path):
    return f"{BASE_URL}/api/dev-login?kunci={kunci}&lanjut={urllib.parse.quote(path)}"

TARGETS = [
    # =========================================================================
    # 1. PUBLIK / GUEST (Tanpa Sesi Login)
    # =========================================================================
    {
        "file": "01_publik_beranda.png",
        "url": f"{BASE_URL}/",
        "h": 1200,
        "kategori": "Publik (Guest)",
        "deskripsi": "Beranda utama portal PMBGM Google-Style search bar, counter 165 sekolah, dan darurat 119"
    },
    {
        "file": "02_publik_lapor_gate.png",
        "url": f"{BASE_URL}/lapor",
        "h": 1100,
        "kategori": "Publik (Guest)",
        "deskripsi": "Halaman pelaporan publik (gate autentikasi sebelum pengisian formulir)"
    },
    {
        "file": "03_publik_lapor_panduan.png",
        "url": f"{BASE_URL}/lapor/panduan",
        "h": 1200,
        "kategori": "Publik (Guest)",
        "deskripsi": "Panduan langkah pelaporan keluhan mutu dan porsi MBG"
    },
    {
        "file": "04_publik_lacak_beranda.png",
        "url": f"{BASE_URL}/lacak",
        "h": 1200,
        "kategori": "Publik (Guest)",
        "deskripsi": "Halaman pencarian nomor tiket pengaduan publik"
    },
    {
        "file": "05_publik_lacak_tiket_aktif.png",
        "url": f"{BASE_URL}/lacak?tiket=MBG-AG2MWK",
        "h": 1400,
        "kategori": "Publik (Guest)",
        "deskripsi": "Hasil pelacakan tiket pengaduan aktif dengan indikator SLA, alur status, dan riwayat investigasi"
    },
    {
        "file": "06_publik_lacak_kasus_detail.png",
        "url": f"{BASE_URL}/lacak/kasus/c12914a8-e455-4abc-9d0f-ec8de214a2d6",
        "h": 1400,
        "kategori": "Publik (Guest)",
        "deskripsi": "Detail kasus publik terbuka: kronologi keluhan, tindak lanjut dapur SPPG, dan verifikasi lapangan"
    },
    {
        "file": "07_publik_lacak_akuntabilitas.png",
        "url": f"{BASE_URL}/lacak/akuntabilitas",
        "h": 1300,
        "kategori": "Publik (Guest)",
        "deskripsi": "Papan akuntabilitas publik kepatuhan Service Level Agreement (SLA) SPPG"
    },
    {
        "file": "08_publik_cari_sekolah.png",
        "url": f"{BASE_URL}/cari-sekolah",
        "h": 1400,
        "kategori": "Publik (Guest)",
        "deskripsi": "Direktori pencarian 165 sekolah sasaran MBG di Kota Semarang beserta mitra SPPG penyedia"
    },
    {
        "file": "09_publik_data_terbuka_provinsi.png",
        "url": f"{BASE_URL}/data",
        "h": 1400,
        "kategori": "Publik (Guest)",
        "deskripsi": "Portal Satu Data MBG Jawa Tengah: pagu anggaran, realisasi bulanan, dan penerima manfaat"
    },
    {
        "file": "10_publik_data_sppg.png",
        "url": f"{BASE_URL}/data/sppg",
        "h": 1300,
        "kategori": "Publik (Guest)",
        "deskripsi": "Direktori 40 Unit Dapur SPPG, status sertifikat SLHS, dan kapasitas porsi harian"
    },
    {
        "file": "11_publik_data_sppg_detail.png",
        "url": f"{BASE_URL}/data/sppg/793d2f16-7350-4c6b-b8c9-8c136383865e",
        "h": 1400,
        "kategori": "Publik (Guest)",
        "deskripsi": "Profil detail SPPG Semarang Tengah 01: indeks risiko SAW, rekam jejak sanitasi, dan sekolah yang dilayani"
    },
    {
        "file": "12_publik_data_wilayah_peta.png",
        "url": f"{BASE_URL}/data/wilayah",
        "h": 1400,
        "kategori": "Publik (Guest)",
        "deskripsi": "Peta spasial interaktif sebaran wilayah kabupaten/kota dan kecamatan di Jawa Tengah"
    },
    {
        "file": "13_publik_data_wilayah_detail.png",
        "url": f"{BASE_URL}/data/wilayah/33.74",
        "h": 1400,
        "kategori": "Publik (Guest)",
        "deskripsi": "Drilldown statistik MBG Kota Semarang: kepatuhan higienitas dapur (SLHS), realisasi anggaran, dan tren kasus"
    },
    {
        "file": "14_publik_data_kasus_rekap.png",
        "url": f"{BASE_URL}/data/kasus",
        "h": 1300,
        "kategori": "Publik (Guest)",
        "deskripsi": "Rekapitulasi kasus laporan terverifikasi terbuka dan tren penyelesaian masalah"
    },
    {
        "file": "15_publik_data_unduh.png",
        "url": f"{BASE_URL}/data/unduh",
        "h": 1200,
        "kategori": "Publik (Guest)",
        "deskripsi": "Pusat unduhan dataset terbuka (format CSV, JSON, serta dokumentasi REST API publik)"
    },
    {
        "file": "16_publik_insight_beranda.png",
        "url": f"{BASE_URL}/insight",
        "h": 1300,
        "kategori": "Publik (Guest)",
        "deskripsi": "Hub Analitik Cerdas dan Ringkasan Sistem Pendukung Keputusan (DSS) MBG"
    },
    {
        "file": "17_publik_insight_prioritas_saw.png",
        "url": f"{BASE_URL}/insight/prioritas",
        "h": 1400,
        "kategori": "Publik (Guest)",
        "deskripsi": "Model Simple Additive Weighting (SAW) untuk penentuan prioritas audit dan pemantauan dapur SPPG"
    },
    {
        "file": "18_publik_insight_peringatan_klb.png",
        "url": f"{BASE_URL}/insight/peringatan",
        "h": 1300,
        "kategori": "Publik (Guest)",
        "deskripsi": "Deteksi dini anomali lonjakan kasus dan peringatan Kejadian Luar Biasa (KLB) keracunan makanan"
    },
    {
        "file": "19_publik_insight_banding_sppg.png",
        "url": f"{BASE_URL}/insight/banding",
        "h": 1300,
        "kategori": "Publik (Guest)",
        "deskripsi": "Fitur komparasi berdampingan performa, kepatuhan SLA, dan indeks mutu antar dua SPPG"
    },
    {
        "file": "20_publik_panduan_sistem.png",
        "url": f"{BASE_URL}/panduan",
        "h": 1300,
        "kategori": "Publik (Guest)",
        "deskripsi": "Panduan lengkap penggunaan sistem PMBGM bagi masyarakat dan pemangku kepentingan"
    },
    {
        "file": "21_publik_metodologi.png",
        "url": f"{BASE_URL}/metodologi",
        "h": 1400,
        "kategori": "Publik (Guest)",
        "deskripsi": "Dokumentasi ilmiah metodologi SAW, klasifikasi Naive Bayes, MLP AI, dan standar matriks SLA"
    },
    {
        "file": "22_publik_tentang.png",
        "url": f"{BASE_URL}/tentang",
        "h": 1200,
        "kategori": "Publik (Guest)",
        "deskripsi": "Tentang platform PMBGM dan profil Tim Pengembang Ctrl Win Enter (MIA 2026)"
    },
    {
        "file": "23_publik_faq.png",
        "url": f"{BASE_URL}/faq",
        "h": 1200,
        "kategori": "Publik (Guest)",
        "deskripsi": "Tanya Jawab (FAQ) seputar program Makan Bergizi Gratis dan tata kelola pengaduan"
    },
    {
        "file": "24_publik_privasi.png",
        "url": f"{BASE_URL}/privasi",
        "h": 1200,
        "kategori": "Publik (Guest)",
        "deskripsi": "Kebijakan privasi, perlindungan identitas pelapor (whistleblower), dan keamanan data"
    },
    {
        "file": "25_publik_masuk_persona.png",
        "url": f"{BASE_URL}/masuk",
        "h": 1200,
        "kategori": "Publik (Guest)",
        "deskripsi": "Halaman autentikasi dengan akun demo 7 peran (Warga, Guru, Verifikator, SPPG, Dinkes, Korwil, Admin)"
    },

    # =========================================================================
    # 2. ALUR LENGKAP PELAPORAN MASALAH (Role Warga / Orang Tua: Ibu Rina)
    # =========================================================================
    {
        "file": "26_alur_lapor_step1_sekolah.png",
        "url": dev_url("rina", "/lapor"),
        "h": 1200,
        "kategori": "Alur Pelaporan (Warga)",
        "deskripsi": "Formulir Lapor Langkah 1: Pencarian dan pemilihan sekolah sasaran MBG"
    },
    {
        "file": "27_alur_lapor_step2_masalah.png",
        "url": dev_url("rina", "/lapor?tahap=1&sekolah=SD Negeri Tembalang 01"),
        "h": 1300,
        "kategori": "Alur Pelaporan (Warga)",
        "deskripsi": "Formulir Lapor Langkah 2: Pemilihan kategori masalah (Keracunan, Tidak Layak, Kebersihan, Porsi/Gizi, dll) & SLA"
    },
    {
        "file": "28_alur_lapor_step3_cerita.png",
        "url": dev_url("rina", "/lapor?tahap=2&sekolah=SD Negeri Tembalang 01&kategori=makanan_tidak_layak"),
        "h": 1300,
        "kategori": "Alur Pelaporan (Warga)",
        "deskripsi": "Formulir Lapor Langkah 3: Pengisian kronologi detail, jam kejadian, jumlah siswa terdampak, & deteksi lokasi GPS"
    },
    {
        "file": "29_alur_lapor_step4_bukti.png",
        "url": dev_url("rina", "/lapor?tahap=3&sekolah=SD Negeri Tembalang 01&kategori=makanan_tidak_layak"),
        "h": 1300,
        "kategori": "Alur Pelaporan (Warga)",
        "deskripsi": "Formulir Lapor Langkah 4: Unggah foto bukti fisik makanan dengan ekstraksi metadata EXIF kamera"
    },
    {
        "file": "30_alur_lapor_step5_identitas.png",
        "url": dev_url("rina", "/lapor?tahap=4&sekolah=SD Negeri Tembalang 01&kategori=makanan_tidak_layak"),
        "h": 1300,
        "kategori": "Alur Pelaporan (Warga)",
        "deskripsi": "Formulir Lapor Langkah 5: Pemilihan mode identitas (Rahasia, Publik, Anonim) & pratinjau ringkasan laporan"
    },
    {
        "file": "31_alur_lapor_step6_sukses.png",
        "url": dev_url("rina", "/lapor/sukses?tiket=MBG-AG2MWK"),
        "h": 1200,
        "kategori": "Alur Pelaporan (Warga)",
        "deskripsi": "Halaman Konfirmasi Sukses: Penerbitan kode tiket MBG, PIN rahasia pelacak, timeline SLA, dan tombol lacak status"
    },
    {
        "file": "32_role_warga_profil_akun.png",
        "url": dev_url("rina", "/akun"),
        "h": 1200,
        "kategori": "Role: Warga / Orang Tua (Ibu Rina)",
        "deskripsi": "Dasbor profil orang tua: daftar riwayat laporan yang diajukan beserta status penyelesaiannya"
    },

    # =========================================================================
    # 3. ROLE GURU / KOMITE SEKOLAH (Pak Budi)
    # =========================================================================
    {
        "file": "33_role_guru_profil_akun.png",
        "url": dev_url("budi", "/akun"),
        "h": 1200,
        "kategori": "Role: Guru / Sekolah (Pak Budi)",
        "deskripsi": "Dasbor profil sekolah: informasi sekolah binaan terhubung dan pemantauan distribusi MBG internal"
    },

    # =========================================================================
    # 4. ROLE TIM VERIFIKATOR INDEPENDEN (Mbak Sari)
    # =========================================================================
    {
        "file": "34_role_verifikator_dasbor.png",
        "url": dev_url("sari", "/panel"),
        "h": 1200,
        "kategori": "Role: Verifikator Independen (Mbak Sari)",
        "deskripsi": "Dasbor utama verifikator: metrik laporan masuk, SLA verifikasi 2 jam, dan grafik tren validasi"
    },
    {
        "file": "35_role_verifikator_antrean.png",
        "url": dev_url("sari", "/panel/verifikasi"),
        "h": 1300,
        "kategori": "Role: Verifikator Independen (Mbak Sari)",
        "deskripsi": "Tabel antrean laporan masuk yang menunggu validasi lapangan dan analisis foto bukti"
    },
    {
        "file": "36_role_verifikator_inspeksi_detail.png",
        "url": dev_url("sari", "/panel/verifikasi/b146955e-0475-4bf5-a987-f69b4a711a63"),
        "h": 1600,
        "kategori": "Role: Verifikator Independen (Mbak Sari)",
        "deskripsi": "Ruang kerja inspeksi laporan: foto bukti, analisis metadata EXIF, skor keaslian AI MLP, dan form keputusan verifikasi"
    },
    {
        "file": "37_role_verifikator_kasus_berjalan.png",
        "url": dev_url("sari", "/panel/kasus"),
        "h": 1300,
        "kategori": "Role: Verifikator Independen (Mbak Sari)",
        "deskripsi": "Daftar kasus terverifikasi yang sedang dalam tahap tindak lanjut dapur SPPG dan pengawasan"
    },

    # =========================================================================
    # 5. ROLE PENGELOLA DAPUR SPPG (Mitra Dapur)
    # =========================================================================
    {
        "file": "38_role_sppg_dasbor.png",
        "url": dev_url("sppg", "/panel"),
        "h": 1200,
        "kategori": "Role: Pengelola Dapur SPPG",
        "deskripsi": "Dasbor operasional SPPG: kapasitas porsi harian, skor kepatuhan sanitasi SLHS, dan rating kepuasan sekolah"
    },
    {
        "file": "39_role_sppg_papan_kasus.png",
        "url": dev_url("sppg", "/panel/kasus"),
        "h": 1300,
        "kategori": "Role: Pengelola Dapur SPPG",
        "deskripsi": "Papan keluhan dan aduan spesifik dapur SPPG untuk segera ditindaklanjuti sesuai batas waktu SLA"
    },
    {
        "file": "40_role_sppg_tindak_lanjut_detail.png",
        "url": dev_url("sari", "/panel/kasus/c12914a8-e455-4abc-9d0f-ec8de214a2d6"),
        "h": 1600,
        "kategori": "Role: Pengelola Dapur SPPG",
        "deskripsi": "Detail penanganan kasus dapur: form klarifikasi penyebab, tindakan korektif, dan unggah bukti perbaikan higienitas"
    },

    # =========================================================================
    # 6. ROLE DINAS KESEHATAN (Pak Hendra)
    # =========================================================================
    {
        "file": "41_role_dinkes_dasbor.png",
        "url": dev_url("hendra", "/panel"),
        "h": 1200,
        "kategori": "Role: Dinas Kesehatan (Pak Hendra)",
        "deskripsi": "Dasbor sanitasi pangan dan kesehatan lingkungan: pemantauan sertifikasi SLHS dan rekap kasus keracunan"
    },
    {
        "file": "42_role_dinkes_investigasi_klb.png",
        "url": dev_url("hendra", "/panel/peringatan"),
        "h": 1300,
        "kategori": "Role: Dinas Kesehatan (Pak Hendra)",
        "deskripsi": "Panel pengawasan peringatan dini KLB keracunan makanan, pelacakan klaster sekolah, dan rekomendasi uji laboratorium"
    },

    # =========================================================================
    # 7. ROLE KOORDINATOR WILAYAH BGN (Pengawas SLA)
    # =========================================================================
    {
        "file": "43_role_korwil_dasbor_akuntabilitas.png",
        "url": dev_url("korwil", "/panel/akuntabilitas"),
        "h": 1300,
        "kategori": "Role: Korwil BGN (Pengawas SLA)",
        "deskripsi": "Pusat komando pemantauan akuntabilitas SLA seluruh SPPG se-wilayah dan peringatan eskalasi kasus tertunda"
    },
    {
        "file": "44_role_korwil_prioritas_audit_saw.png",
        "url": dev_url("korwil", "/panel/prioritas"),
        "h": 1400,
        "kategori": "Role: Korwil BGN (Pengawas SLA)",
        "deskripsi": "Matriks evaluasi SPPG menggunakan algoritma SAW multi-kriteria untuk rekomendasi audit mendalam dan perpanjangan kontrak"
    },

    # =========================================================================
    # 8. ROLE ADMINISTRATOR SISTEM (Admin)
    # =========================================================================
    {
        "file": "45_role_admin_dasbor.png",
        "url": dev_url("admin", "/panel"),
        "h": 1200,
        "kategori": "Role: Administrator Sistem",
        "deskripsi": "Dasbor utama administrasi sistem PMBGM: status operasional server, total pengguna, dan rekapitulasi data"
    },
    {
        "file": "46_role_admin_manajemen_pengguna.png",
        "url": dev_url("admin", "/panel/admin/pengguna"),
        "h": 1300,
        "kategori": "Role: Administrator Sistem",
        "deskripsi": "Manajemen pengguna (RBAC): penugasan peran (Warga, Guru, Verifikator, SPPG, Dinkes, Korwil, Admin) dan aktivasi akun"
    },
    {
        "file": "47_role_admin_konfigurasi_sla.png",
        "url": dev_url("admin", "/panel/admin/sla"),
        "h": 1300,
        "kategori": "Role: Administrator Sistem",
        "deskripsi": "Pengaturan master toleransi batas waktu SLA per kategori pengaduan (Diterima, Diverifikasi, Diteruskan, Ditindaklanjuti)"
    }
]

def main():
    print("=" * 75)
    print("PMBGM - AUTOMATED HIGH-RES PAGE-BY-PAGE SCREENSHOT ENGINE")
    print(f"Total Target Layar: {len(TARGETS)} Halaman Lengkap (Semua Role & Alur Interaktif)")
    print(f"Folder Output: {OUTPUT_DIR}")
    print("=" * 75)

    berhasil = 0
    gagal = 0
    t0 = time.time()

    for idx, item in enumerate(TARGETS, 1):
        target_path = os.path.join(OUTPUT_DIR, item["file"])
        user_data = f"C:/temp/chrome_prof_final_{idx}"
        cmd = [
            CHROME_PATH,
            "--headless=new",
            "--disable-gpu",
            "--hide-scrollbars",
            "--run-all-compositor-stages-before-draw",
            f"--user-data-dir={user_data}",
            f"--screenshot={target_path}",
            f"--window-size=1440,{item['h']}",
            item["url"]
        ]

        sys.stdout.write(f"[{idx:02d}/{len(TARGETS):02d}] {item['kategori']} -> {item['file']} ... ")
        sys.stdout.flush()

        try:
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=25)
            if os.path.exists(target_path) and os.path.getsize(target_path) > 10000:
                size_kb = os.path.getsize(target_path) // 1024
                print(f"OK ({size_kb} KB)")
                berhasil += 1
            else:
                print("GAGAL (File kosong atau di bawah 10KB)")
                gagal += 1
        except Exception as e:
            print(f"ERROR ({e})")
            gagal += 1

    # Tulis file README.md katalog ringkasan
    readme_path = os.path.join(OUTPUT_DIR, "README.md")
    with open(readme_path, "w", encoding="utf-8") as f:
        f.write("# Katalog Tangkapan Layar Lengkap PMBGM (Screenshoot Per Halaman)\n\n")
        f.write(f"> Tanggal Pengambilan: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"> Total Layar: {len(TARGETS)} Halaman Lengkap (Publik, Alur Lapor Multi-Step, & Seluruh Role)\n\n")
        f.write("| No | Nama File | Kategori / Role | Deskripsi Halaman |\n")
        f.write("| :---: | :--- | :--- | :--- |\n")
        for idx, item in enumerate(TARGETS, 1):
            f.write(f"| {idx:02d} | [{item['file']}](./{item['file']}) | **{item['kategori']}** | {item['deskripsi']} |\n")

    durasi = time.time() - t0
    print("=" * 75)
    print(f"SELESAI dalam {durasi:.1f} detik! Berhasil: {berhasil}/{len(TARGETS)}, Gagal: {gagal}")
    print(f"Semua berkas screenshot tersimpan di: {OUTPUT_DIR}")
    print("=" * 75)

if __name__ == "__main__":
    main()
