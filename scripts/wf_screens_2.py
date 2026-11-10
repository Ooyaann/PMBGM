"""
PMBGM WIREFRAME ENGINE - PART 2: SCREENS 25 TO 47
"""

from wf_helpers import (
    C_DARK, C_DARK_SUB, C_BORDER, C_BG_CARD, C_BG_MUTED, C_BG_SUBTLE,
    C_TEXT_MUTED, C_TEXT_LIGHT, C_CROSS
)

def build_screens_part2(eng):
    # =========================================================================
    # ROW 4: ALUR PELAPORAN STEP 1 - 5 & PORTAL MASUK (25 - 30)
    # =========================================================================

    # -------------------------------------------------------------------------
    # 25. Portal Masuk Multi-Persona (760px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(4, 0, "25. Masuk Multi Persona", frame_height=760)
    eng.draw_navbar_public(f, active="Masuk", logged_in=False)

    # Left Hero Column
    eng.create_node("rectangle", "M25 LeftHero", 40, 95, 340, 520, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
    eng.draw_image_box(f, "M25 LogoBox", 70, 130, 70, 70, corner=12)
    eng.create_node("text", "M25 H1", 70, 220, parent=f, text="Portal Masuk Multi-Peran", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "M25 HSub", 70, 255, parent=f, text="Sistem PMBGM dirancang untuk kolaborasi\nmulti-sektor. Pilih persona demo Anda untuk\nmengakses alur kerja masing-masing pihak.", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    eng.create_node("text", "M25 HSec", 70, 320, parent=f, text="Role yang Tersedia:\n- Warga & Orang Tua Siswa\n- Guru Piket & Sekolah\n- Tim Verifikator Independen\n- Satuan Pelayanan Pangan (SPPG)\n- Dinas Kesehatan Kota\n- Korwil Pendidikan Jawa Tengah", props={"fontSize": 10, "fill": C_DARK})
    eng.create_node("text", "M25 HFt", 70, 560, parent=f, text="Simulasi Interaktif MIA 2026", props={"fontSize": 9, "fill": C_TEXT_LIGHT})

    # Right: 6 Persona Cards (2 cols x 3 rows)
    personas = [
        ("Warga / Orang Tua", "Ibu Rina (Wali Siswa SDN Tembalang 10)", "Lapor masalah, lacak status, beri rating."),
        ("Guru / Pihak Sekolah", "Pak Budi, S.Pd (SMPN Semarang Tengah 1)", "Lapor atas nama sekolah, pantau ompreng."),
        ("Verifikator Independen", "Mbak Siti (Tim Audit Mutu A1)", "Triage aduan, scoring SAW, investigasi."),
        ("Dapur Penyedia (SPPG)", "Dapur Berkah Tembalang 01", "Terima tiket aduan, unggah foto perbaikan."),
        ("Dinas Kesehatan (Dinkes)", "dr. Hendra (Seksi Sanitasi Pangan)", "Pantau KLB, audit SLHS, uji bakteriologi."),
        ("Koordinator Wilayah", "Bpk. Agus (Korwil MBG Jawa Tengah)", "Dasbor agregat, DSS audit berkala SPPG.")
    ]
    for idx, (prole, pname, pdesc) in enumerate(personas):
        col_i = idx % 2
        row_i = idx // 2
        px = 405 + col_i * 260
        py = 95 + row_i * 125
        eng.create_node("rectangle", f"M25 PCard {idx}", px, py, 245, 115, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
        eng.draw_avatar(f, f"M25 PAv {idx}", px + 25, py + 25, 14)
        eng.create_node("text", f"M25 PRole {idx}", px + 48, py + 14, parent=f, text=prole, props={"fontSize": 11, "fill": C_DARK})
        eng.create_node("text", f"M25 PName {idx}", px + 48, py + 29, parent=f, text=pname, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        eng.create_node("text", f"M25 PDesc {idx}", px + 15, py + 52, parent=f, text=pdesc, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        eng.draw_button(f, f"M25 PBtn {idx}", px + 15, py + 80, 215, 24, "Masuk Sebagai Persona Ini ->", variant="primary", corner=4)

    # Admin Root Card at bottom
    eng.create_node("rectangle", "M25 AdminCard", 405, 480, 515, 65, parent=f, props={"fill": C_DARK, "cornerRadius": 10})
    eng.create_node("text", "M25 AdmTit", 425, 495, parent=f, text="Administrator Sistem (Root / Developer)", props={"fontSize": 12, "fill": "#FFFFFF"})
    eng.create_node("text", "M25 AdmSub", 425, 515, parent=f, text="Akses konfigurasi SLA, audit trail pengguna, dan arsitektur database.", props={"fontSize": 9, "fill": C_CROSS})
    eng.draw_button(f, "M25 AdmBtn", 750, 498, 155, 28, "Masuk Dasbor Admin", variant="outline", corner=6)

    eng.draw_footer_real(f, 650)

    # -------------------------------------------------------------------------
    # 26. Alur Lapor Step 1: Pilih Sekolah (740px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(4, 1, "26. Alur Lapor Step 1", frame_height=740)
    eng.draw_navbar_public(f, active="Lapor Masalah", logged_in=True, user_name="Ibu Rina")

    eng.draw_pill(f, "S26 Pill", 40, 85, 140, 24, "Formulir Lapor MBG", is_active=False)
    eng.create_node("text", "S26 Tit", 40, 115, parent=f, text="Langkah 1: Pilih Sekolah Penerima", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "S26 Sub", 40, 140, parent=f, text="Tentukan sekolah tempat anak Anda menerima paket makanan bergizi gratis hari ini.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    eng.draw_stepper(f, active_step=1)

    # Left: Form Elements
    eng.create_node("rectangle", "S26 FormCard", 40, 290, 580, 390, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
    eng.create_node("text", "S26 F1Lbl", 65, 310, parent=f, text="Pilih Kecamatan", props={"fontSize": 11, "fill": C_DARK})
    eng.create_node("rectangle", "S26 F1Inp", 65, 330, 530, 36, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 6})
    eng.create_node("text", "S26 F1Val", 80, 342, parent=f, text="Kecamatan Tembalang v", props={"fontSize": 11, "fill": C_DARK})

    eng.create_node("text", "S26 F2Lbl", 65, 380, parent=f, text="Cari Nama Sekolah", props={"fontSize": 11, "fill": C_DARK})
    eng.create_node("rectangle", "S26 F2Inp", 65, 400, 530, 36, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 6})
    eng.create_node("text", "S26 F2Val", 80, 412, parent=f, text="SD Negeri Tembalang 10", props={"fontSize": 11, "fill": C_DARK})

    # Auto-detected SPPG Info Box
    eng.create_node("rectangle", "S26 SppgInfo", 65, 450, 530, 65, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
    eng.create_node("text", "S26 SpTit", 80, 465, parent=f, text="Dapur SPPG Penanggung Jawab:", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    eng.create_node("text", "S26 SpNm", 80, 485, parent=f, text="SPPG Tembalang 01 (Dapur Berkah) - SLHS Terverifikasi", props={"fontSize": 11, "fill": C_DARK})

    eng.create_node("text", "S26 F3Lbl", 65, 530, parent=f, text="Kelas / Jenjang Siswa", props={"fontSize": 11, "fill": C_DARK})
    for idx, cname in enumerate(["Kelas 1-3", "Kelas 4-6", "Guru / Tenaga Pendidik"]):
        eng.draw_pill(f, f"S26 CPill {idx}", 65 + idx * 125, 550, 115, 26, cname, is_active=(idx == 1))

    eng.draw_button(f, "S26 NextBtn", 415, 620, 180, 36, "Lanjut ke Langkah 2 ->", variant="primary", corner=6)

    # Right: Sidebar SLA
    eng.draw_sidebar_sla(f)

    # -------------------------------------------------------------------------
    # 27. Alur Lapor Step 2: Kategori & Masalah (740px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(4, 2, "27. Alur Lapor Step 2", frame_height=740)
    eng.draw_navbar_public(f, active="Lapor Masalah", logged_in=True, user_name="Ibu Rina")

    eng.draw_pill(f, "S27 Pill", 40, 85, 140, 24, "Formulir Lapor MBG", is_active=False)
    eng.create_node("text", "S27 Tit", 40, 115, parent=f, text="Langkah 2: Kategori & Rincian Masalah", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "S27 Sub", 40, 140, parent=f, text="Pilih jenis kendala yang ditemukan pada hidangan makanan bergizi gratis.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    eng.draw_stepper(f, active_step=2)

    # Left: 4 Category Cards
    eng.create_node("rectangle", "S27 FormCard", 40, 290, 580, 390, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
    eng.create_node("text", "S27 CatLbl", 65, 310, parent=f, text="Pilih Jenis Masalah Utama", props={"fontSize": 11, "fill": C_DARK})

    cats = [
        ("Porsi / Komposisi Tidak Sesuai", "Gramasi nasi/lauk kurang dari standar gizi, lauk tidak lengkap."),
        ("Makanan Basi / Berbau Asam", "Sayur basi, nasi berlendir, bau tengik, daging belum matang sempurna."),
        ("Benda Asing / Kontaminasi", "Ditemukan rambut, serangga, staples, kerikil, atau serpihan plastik."),
        ("Keterlambatan Distribusi", "Makanan tiba melebihi 30 menit dari jadwal jam istirahat makan siang.")
    ]
    for idx, (ctit, cdesc) in enumerate(cats):
        cy = 330 + idx * 55
        is_sel = (idx == 1) # Basi selected
        eng.create_node("rectangle", f"S27 CCard {idx}", 65, cy, 530, 48, parent=f, props={"fill": C_BG_SUBTLE if is_sel else "#FFFFFF", "stroke": C_DARK if is_sel else C_BORDER, "strokeWeight": 1.5 if is_sel else 1, "cornerRadius": 8})
        eng.create_node("ellipse", f"S27 CRadio {idx}", 80, cy + 18, 12, 12, parent=f, props={"stroke": C_DARK, "strokeWeight": 1.5, "fill": C_DARK if is_sel else "#FFFFFF"})
        eng.create_node("text", f"S27 CTit {idx}", 105, cy + 10, parent=f, text=ctit, props={"fontSize": 11, "fill": C_DARK})
        eng.create_node("text", f"S27 CDesc {idx}", 105, cy + 27, parent=f, text=cdesc, props={"fontSize": 9, "fill": C_TEXT_MUTED})

    eng.create_node("text", "S27 TmLbl", 65, 560, parent=f, text="Waktu Kejadian Jam Makan", props={"fontSize": 11, "fill": C_DARK})
    eng.create_node("rectangle", "S27 TmInp", 65, 580, 250, 32, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 6})
    eng.create_node("text", "S27 TmVal", 80, 590, parent=f, text="Hari Ini, 11:45 WIB", props={"fontSize": 10, "fill": C_DARK})

    eng.draw_button(f, "S27 BackBtn", 65, 630, 100, 36, "<- Kembali", variant="outline", corner=6)
    eng.draw_button(f, "S27 NextBtn", 415, 630, 180, 36, "Lanjut ke Langkah 3 ->", variant="primary", corner=6)

    # Right: Sidebar SLA
    eng.draw_sidebar_sla(f)

    # -------------------------------------------------------------------------
    # 28. Alur Lapor Step 3: Cerita Kejadian (740px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(4, 3, "28. Alur Lapor Step 3", frame_height=740)
    eng.draw_navbar_public(f, active="Lapor Masalah", logged_in=True, user_name="Ibu Rina")

    eng.draw_pill(f, "S28 Pill", 40, 85, 140, 24, "Formulir Lapor MBG", is_active=False)
    eng.create_node("text", "S28 Tit", 40, 115, parent=f, text="Langkah 3: Kronologi & Cerita Kejadian", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "S28 Sub", 40, 140, parent=f, text="Jelaskan secara kronologis apa yang dialami anak Anda saat menerima makanan.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    eng.draw_stepper(f, active_step=3)

    # Left: Textarea Form
    eng.create_node("rectangle", "S28 FormCard", 40, 290, 580, 390, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
    eng.create_node("text", "S28 F1Lbl", 65, 310, parent=f, text="Ceritakan Detail Kejadian", props={"fontSize": 11, "fill": C_DARK})
    eng.create_node("rectangle", "S28 TArea", 65, 330, 530, 130, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
    eng.create_node("text", "S28 TVal", 80, 345, parent=f, text="Sayur sop yang diterima anak saya di kelas 4 SDN Tembalang 10 berbau asam\ndan sedikit berlendir saat kotak makan dibuka pukul 11:45 WIB. Anak-anak di meja\ndepan juga mencium bau yang sama sehingga guru kelas menyuruh untuk jangan\ndimakan dulu.", props={"fontSize": 11, "fill": C_DARK})
    eng.create_node("text", "S28 TCount", 530, 440, parent=f, text="248 / 500 Karakter", props={"fontSize": 9, "fill": C_TEXT_LIGHT})

    # Symptoms checklist
    eng.create_node("text", "S28 SymLbl", 65, 475, parent=f, text="Apakah ada gejala fisik yang dirasakan anak? (Opsional)", props={"fontSize": 11, "fill": C_DARK})
    for idx, (sname, schk) in enumerate([("Mual / Pusing", True), ("Muntah", False), ("Sakit Perut / Diare", False), ("Tidak Ada Gejala", False)]):
        sx = 65 + idx * 130
        eng.create_node("rectangle", f"S28 SymBox {idx}", sx, 500, 120, 28, parent=f, props={"fill": C_BG_SUBTLE if schk else "#FFFFFF", "stroke": C_DARK if schk else C_BORDER, "strokeWeight": 1, "cornerRadius": 6})
        eng.create_node("text", f"S28 SymTxt {idx}", sx + 10, 508, parent=f, text=f"[{'x' if schk else ' '}] {sname}", props={"fontSize": 9, "fill": C_DARK})

    # Saksi
    eng.create_node("text", "S28 SaksiLbl", 65, 545, parent=f, text="Guru / Wali yang Mengetahui di Lokasi", props={"fontSize": 11, "fill": C_DARK})
    eng.create_node("rectangle", "S28 SaksiInp", 65, 565, 530, 32, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 6})
    eng.create_node("text", "S28 SaksiVal", 80, 575, parent=f, text="Ibu Siti Aminah (Wali Kelas 4B)", props={"fontSize": 10, "fill": C_DARK})

    eng.draw_button(f, "S28 BackBtn", 65, 630, 100, 36, "<- Kembali", variant="outline", corner=6)
    eng.draw_button(f, "S28 NextBtn", 415, 630, 180, 36, "Lanjut ke Langkah 4 ->", variant="primary", corner=6)

    # Right: Sidebar SLA
    eng.draw_sidebar_sla(f)

    # -------------------------------------------------------------------------
    # 29. Alur Lapor Step 4: Unggah Bukti Foto (740px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(4, 4, "29. Alur Lapor Step 4", frame_height=740)
    eng.draw_navbar_public(f, active="Lapor Masalah", logged_in=True, user_name="Ibu Rina")

    eng.draw_pill(f, "S29 Pill", 40, 85, 140, 24, "Formulir Lapor MBG", is_active=False)
    eng.create_node("text", "S29 Tit", 40, 115, parent=f, text="Langkah 4: Unggah Bukti Foto", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "S29 Sub", 40, 140, parent=f, text="Bukti foto sangat krusial agar verifikator dan pihak dinas dapat menindaklanjuti secara cepat.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    eng.draw_stepper(f, active_step=4)

    # Left: Upload Area
    eng.create_node("rectangle", "S29 FormCard", 40, 290, 580, 390, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
    eng.draw_image_box(f, "S29 DropBox", 65, 310, 530, 140, corner=8)
    eng.create_node("text", "S29 DropTit", 220, 355, parent=f, text="Klik atau Seret Foto ke Sini", props={"fontSize": 13, "fill": C_DARK})
    eng.create_node("text", "S29 DropSub", 185, 380, parent=f, text="Format didukung: JPG, PNG (Maksimal 3 foto, ukuran tiap file maks. 5MB)", props={"fontSize": 9, "fill": C_TEXT_MUTED})

    # Uploaded Thumbnails
    eng.create_node("text", "S29 UplLbl", 65, 465, parent=f, text="Foto yang Telah Terunggah (2/3):", props={"fontSize": 11, "fill": C_DARK})
    eng.draw_image_box(f, "S29 Th1", 65, 490, 80, 80, corner=6)
    eng.create_node("text", "S29 ThCap1", 160, 505, parent=f, text="Foto_Sayur_Sop_Basi.jpg (2.1 MB)", props={"fontSize": 10, "fill": C_DARK})
    eng.create_node("text", "S29 ThDel1", 160, 525, parent=f, text="[ Hapus Foto ]", props={"fontSize": 9, "fill": C_TEXT_MUTED})

    eng.draw_image_box(f, "S29 Th2", 340, 490, 80, 80, corner=6)
    eng.create_node("text", "S29 ThCap2", 435, 505, parent=f, text="Foto_Label_Wadah_Ompreng.jpg (1.8 MB)", props={"fontSize": 10, "fill": C_DARK})
    eng.create_node("text", "S29 ThDel2", 435, 525, parent=f, text="[ Hapus Foto ]", props={"fontSize": 9, "fill": C_TEXT_MUTED})

    # Checkbox declaration
    eng.create_node("rectangle", "S29 ChkBox", 65, 590, 14, 14, parent=f, props={"fill": C_DARK, "cornerRadius": 3})
    eng.create_node("text", "S29 ChkTxt", 88, 590, parent=f, text="Saya menyatakan bahwa foto ini asli dan diambil langsung pada hari kejadian.", props={"fontSize": 10, "fill": C_DARK})

    eng.draw_button(f, "S29 BackBtn", 65, 630, 100, 36, "<- Kembali", variant="outline", corner=6)
    eng.draw_button(f, "S29 NextBtn", 415, 630, 180, 36, "Lanjut ke Langkah 5 ->", variant="primary", corner=6)

    # Right: Sidebar SLA
    eng.draw_sidebar_sla(f)

    # -------------------------------------------------------------------------
    # 30. Alur Lapor Step 5: Identitas Pelapor (740px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(4, 5, "30. Alur Lapor Step 5", frame_height=740)
    eng.draw_navbar_public(f, active="Lapor Masalah", logged_in=True, user_name="Ibu Rina")

    eng.draw_pill(f, "S30 Pill", 40, 85, 140, 24, "Formulir Lapor MBG", is_active=False)
    eng.create_node("text", "S30 Tit", 40, 115, parent=f, text="Langkah 5: Konfirmasi & Kirim Aduan", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "S30 Sub", 40, 140, parent=f, text="Periksa ringkasan identitas pelapor dan opsi perlindungan privasi data.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    eng.draw_stepper(f, active_step=5)

    # Left: Identity & Confirmation Form
    eng.create_node("rectangle", "S30 FormCard", 40, 290, 580, 390, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
    eng.create_node("text", "S30 F1Lbl", 65, 310, parent=f, text="Nama Lengkap Pelapor", props={"fontSize": 11, "fill": C_DARK})
    eng.create_node("rectangle", "S30 F1Inp", 65, 330, 530, 34, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 6})
    eng.create_node("text", "S30 F1Val", 80, 341, parent=f, text="Ibu Rina Wulandari (Terverifikasi Akun Warga)", props={"fontSize": 11, "fill": C_DARK})

    eng.create_node("text", "S30 F2Lbl", 65, 375, parent=f, text="Nomor WhatsApp untuk Pembaruan Status", props={"fontSize": 11, "fill": C_DARK})
    eng.create_node("rectangle", "S30 F2Inp", 65, 395, 530, 34, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 6})
    eng.create_node("text", "S30 F2Val", 80, 406, parent=f, text="0812-3456-7890", props={"fontSize": 11, "fill": C_DARK})

    # Privacy Toggle Box
    eng.create_node("rectangle", "S30 PrivBox", 65, 445, 530, 65, parent=f, props={"fill": C_BG_MUTED, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
    eng.create_node("text", "S30 PrivTit", 80, 458, parent=f, text="Opsi Anonimitas Publik (Whistleblower Protection):", props={"fontSize": 11, "fill": C_DARK})
    eng.create_node("rectangle", "S30 Toggle", 540, 458, 40, 20, parent=f, props={"fill": C_DARK, "cornerRadius": 10})
    eng.create_node("ellipse", "S30 ToggleCir", 562, 460, 16, 16, parent=f, props={"fill": "#FFFFFF"})
    eng.create_node("text", "S30 PrivDesc", 80, 480, parent=f, text="Nama Anda akan disamarkan menjadi 'Wali Murid SDN Tembalang 10' pada portal publik.", props={"fontSize": 9, "fill": C_TEXT_MUTED})

    # Agreement
    eng.create_node("rectangle", "S30 AgreBox", 65, 530, 14, 14, parent=f, props={"fill": C_DARK, "cornerRadius": 3})
    eng.create_node("text", "S30 AgreTxt", 88, 530, parent=f, text="Saya menyetujui Ketentuan Layanan dan Kebijakan Privasi PMBGM.", props={"fontSize": 10, "fill": C_DARK})

    eng.draw_button(f, "S30 BackBtn", 65, 630, 100, 36, "<- Kembali", variant="outline", corner=6)
    eng.draw_button(f, "S30 SubmitBtn", 375, 630, 220, 36, "Kirim Laporan Resmi [v]", variant="primary", corner=6)

    # Right: Sidebar SLA
    eng.draw_sidebar_sla(f)

    # =========================================================================
    # ROW 5: SUKSES, PROFIL & VERIFIKATOR (31 - 36)
    # =========================================================================

    # -------------------------------------------------------------------------
    # 31. Alur Lapor Step 6: Sukses Tiket (680px - Centered modal/card!)
    # -------------------------------------------------------------------------
    f = eng.start_frame(5, 0, "31. Alur Lapor Step 6 Sukses", frame_height=680)
    eng.draw_navbar_public(f, active="Lapor Masalah", logged_in=True, user_name="Ibu Rina")

    eng.create_node("rectangle", "S31 Card", 220, 100, 520, 480, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    eng.create_node("ellipse", "S31 Cir", 440, 130, 70, 70, parent=f, props={"fill": C_DARK})
    eng.create_node("text", "S31 Chk", 465, 148, parent=f, text="v", props={"fontSize": 26, "fill": "#FFFFFF"})

    eng.create_node("text", "S31 Tit", 345, 215, parent=f, text="Laporan Berhasil Terkirim!", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "S31 Sub1", 270, 245, parent=f, text="Terima kasih telah berpartisipasi menjaga mutu pangan anak-anak kita.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    eng.create_node("text", "S31 Sub2", 295, 263, parent=f, text="Laporan Anda telah tercatat secara resmi di basis data PMBGM.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # Ticket Badge Box
    eng.create_node("rectangle", "S31 TktBox", 270, 295, 420, 65, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1.5, "cornerRadius": 8})
    eng.create_node("text", "S31 TktLbl", 290, 310, parent=f, text="KODE TIKET PELAPORAN ANDA:", props={"fontSize": 9, "fill": C_TEXT_MUTED})
    eng.create_node("text", "S31 TktCode", 290, 330, parent=f, text="KS-NF6YNKK", props={"fontSize": 18, "fill": C_DARK})
    eng.draw_button(f, "S31 CopyBtn", 580, 312, 90, 30, "Salin Kode", variant="outline", corner=6)

    # SLA commitment info
    eng.create_node("rectangle", "S31 SlaBox", 270, 380, 420, 60, parent=f, props={"fill": C_BG_MUTED, "cornerRadius": 8})
    eng.create_node("text", "S31 SlaTit", 290, 393, parent=f, text="Komitmen SLA Verifikasi:", props={"fontSize": 10, "fill": C_DARK})
    eng.create_node("text", "S31 SlaDesc", 290, 412, parent=f, text="Tim verifikator akan mereview laporan ini dalam < 4 Jam. Notifikasi akan dikirim ke WhatsApp Anda.", props={"fontSize": 9, "fill": C_TEXT_MUTED})

    eng.draw_button(f, "S31 BtnTrack", 270, 460, 420, 40, "Pantau Status Laporan Sekarang", variant="primary", corner=8)
    eng.draw_button(f, "S31 BtnHome", 270, 510, 420, 36, "Kembali ke Beranda", variant="outline", corner=8)

    eng.draw_footer_real(f, 600)

    # -------------------------------------------------------------------------
    # 32. Profil Akun Warga (740px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(5, 1, "32. Profil Akun Warga", frame_height=740)
    eng.draw_navbar_public(f, active="Beranda", logged_in=True, user_name="Ibu Rina")

    # Header Card
    eng.create_node("rectangle", "W32 HdrCard", 40, 85, 880, 95, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
    eng.draw_avatar(f, "W32 Av", 85, 132, 28)
    eng.create_node("text", "W32 Name", 130, 115, parent=f, text="Ibu Rina Wulandari", props={"fontSize": 16, "fill": C_DARK})
    eng.create_node("text", "W32 Info", 130, 138, parent=f, text="Wali Murid Siswa Kelas 4  -  SD Negeri Tembalang 10  -  No. WA: 0812-xxxx-7890", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    eng.draw_pill(f, "W32 Pill", 740, 115, 150, 24, "Akun Warga Terverifikasi", is_active=True)

    # Left: Case History (2 cases)
    eng.create_node("text", "W32 HistTit", 40, 205, parent=f, text="Riwayat Aduan yang Anda Kirimkan (2)", props={"fontSize": 13, "fill": C_DARK})

    w_cases = [
        ("KS-NF6YNKK", "Makanan Berbau Asam di SDN Tembalang 10", "Sedang Ditindaklanjuti", "Hari ini 11:45 WIB", "SLA: Sisa 2 jam 45 menit"),
        ("KS-ULJ9X7Y", "Porsi Sayur Kurang & Tidak Segar", "Selesai Ditangani", "28 Oktober 2026", "Rating Diberikan: 5 Bintang (*****)")
    ]
    for idx, (tcode, ttit, tstat, ttime, tsub) in enumerate(w_cases):
        wy = 230 + idx * 105
        eng.create_node("rectangle", f"W32 CCard {idx}", 40, wy, 560, 90, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
        eng.create_node("text", f"W32 CCod {idx}", 58, wy + 15, parent=f, text=tcode, props={"fontSize": 11, "fill": C_DARK})
        eng.create_node("text", f"W32 CTit {idx}", 58, wy + 35, parent=f, text=ttit, props={"fontSize": 12, "fill": C_DARK})
        eng.create_node("text", f"W32 CSub {idx}", 58, wy + 58, parent=f, text=f"{ttime}  |  {tsub}", props={"fontSize": 9, "fill": C_TEXT_MUTED})
        eng.draw_pill(f, f"W32 CSt {idx}", 415, wy + 15, 130, 22, tstat, is_active=(idx == 1))
        eng.draw_button(f, f"W32 CBtn {idx}", 445, wy + 50, 100, 26, "Lihat Tiket ->", variant="subtle", corner=4)

    # Right: Notifications Panel (11 notifications)
    eng.create_node("rectangle", "W32 NotifBox", 620, 205, 300, 380, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
    eng.create_node("text", "W32 NTit", 640, 225, parent=f, text="Notifikasi Masuk (11)", props={"fontSize": 12, "fill": C_DARK})

    notifs = [
        ("Tiket KS-NF6YNKK Telah Diverifikasi", "Verifikator telah menetapkan kategori Kritis.", "10 menit lalu"),
        ("Sampel Sedang Diperiksa Puskesmas", "Tim sanitarian menuju SDN Tembalang 10.", "35 menit lalu"),
        ("Tiket KS-ULJ9X7Y Berhasil Diselesaikan", "Pihak SPPG telah mengirim makanan pengganti.", "3 hari lalu"),
        ("Terima kasih atas rating kepuasan Anda", "Rating 5 bintang telah dicatat di rapor SPPG.", "3 hari lalu")
    ]
    for idx, (ntit, ndesc, ntime) in enumerate(notifs):
        ny = 255 + idx * 68
        eng.create_node("rectangle", f"W32 NRow {idx}", 635, ny, 270, 58, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 6})
        eng.create_node("text", f"W32 NT {idx}", 648, ny + 8, parent=f, text=ntit, props={"fontSize": 9, "fill": C_DARK})
        eng.create_node("text", f"W32 ND {idx}", 648, ny + 23, parent=f, text=ndesc, props={"fontSize": 8, "fill": C_TEXT_MUTED})
        eng.create_node("text", f"W32 NTm {idx}", 648, ny + 40, parent=f, text=ntime, props={"fontSize": 8, "fill": C_TEXT_LIGHT})

    eng.draw_footer_real(f, 600)

    # -------------------------------------------------------------------------
    # 33. Profil Akun Guru (740px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(5, 2, "33. Profil Akun Guru", frame_height=740)
    eng.draw_navbar_public(f, active="Beranda", logged_in=True, user_name="Pak Budi")

    # Header Card
    eng.create_node("rectangle", "G33 HdrCard", 40, 85, 880, 95, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
    eng.draw_avatar(f, "G33 Av", 85, 132, 28)
    eng.create_node("text", "G33 Name", 130, 115, parent=f, text="Pak Budi Santoso, S.Pd", props={"fontSize": 16, "fill": C_DARK})
    eng.create_node("text", "G33 Info", 130, 138, parent=f, text="Guru Piket & Koordinator MBG  -  SMP Negeri Semarang Tengah 1  -  NIP: 19820412xxxxxx", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    eng.draw_pill(f, "G33 Pill", 740, 115, 150, 24, "Akun Guru Terverifikasi", is_active=True)

    # Left: Official Reports by School
    eng.create_node("text", "G33 HistTit", 40, 205, parent=f, text="Laporan Resmi Pihak Sekolah (SMP Semarang Tengah 1)", props={"fontSize": 13, "fill": C_DARK})

    g_cases = [
        ("KS-GH88P22", "Keterlambatan Armada MBG (40 Menit Melewati Jam Istirahat)", "Investigasi Korwil", "Kemarin 12:15 WIB"),
        ("KS-KL45M09", "Ompreng Makanan Kurang 25 Porsi untuk Kelas 8B", "Selesai (Kompensasi)", "22 Oktober 2026")
    ]
    for idx, (tcode, ttit, tstat, ttime) in enumerate(g_cases):
        gy = 230 + idx * 85
        eng.create_node("rectangle", f"G33 CCard {idx}", 40, gy, 560, 75, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
        eng.create_node("text", f"G33 CCod {idx}", 58, gy + 14, parent=f, text=tcode, props={"fontSize": 11, "fill": C_DARK})
        eng.create_node("text", f"G33 CTit {idx}", 58, gy + 32, parent=f, text=ttit, props={"fontSize": 11, "fill": C_DARK})
        eng.create_node("text", f"G33 CSub {idx}", 58, gy + 52, parent=f, text=f"Waktu Lapor: {ttime}", props={"fontSize": 9, "fill": C_TEXT_MUTED})
        eng.draw_pill(f, f"G33 CSt {idx}", 415, gy + 15, 130, 22, tstat, is_active=(idx == 1))

    # Action button for teacher
    eng.draw_button(f, "G33 NewRep", 40, 420, 280, 36, "+ Buat Laporan Resmi Sekolah", variant="primary", corner=6)

    # Right: SPPG Contact & Daily Meal Log
    eng.create_node("rectangle", "G33 SppgBox", 620, 205, 300, 380, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
    eng.create_node("text", "G33 STit", 640, 225, parent=f, text="Kontak Cepat Dapur SPPG Mitra", props={"fontSize": 12, "fill": C_DARK})
    eng.create_node("text", "G33 SNm", 640, 250, parent=f, text="SPPG Semarang Tengah 01", props={"fontSize": 11, "fill": C_DARK})
    eng.create_node("text", "G33 SPh", 640, 270, parent=f, text="Manager Dapur: Pak Joko (0813-9090-xxxx)", props={"fontSize": 9, "fill": C_TEXT_MUTED})
    eng.create_node("line", "G33 SDiv", 640, 295, 260, 0, parent=f, props={"stroke": C_BORDER, "strokeWeight": 1})
    eng.create_node("text", "G33 LTit", 640, 315, parent=f, text="Log Penerimaan Makanan Hari Ini", props={"fontSize": 11, "fill": C_DARK})
    eng.create_node("text", "G33 L1", 640, 335, parent=f, text="- Jam Tiba: 10:45 WIB (Tepat Waktu)", props={"fontSize": 9, "fill": C_TEXT_MUTED})
    eng.create_node("text", "G33 L2", 640, 355, parent=f, text="- Jumlah Porsi: 450 Box (Lengkap)", props={"fontSize": 9, "fill": C_TEXT_MUTED})
    eng.create_node("text", "G33 L3", 640, 375, parent=f, text="- Suhu Sayur: 62°C (Memenuhi Standar)", props={"fontSize": 9, "fill": C_TEXT_MUTED})
    eng.draw_button(f, "G33 LBtn", 640, 420, 260, 32, "Konfirmasi Penerimaan Hari Ini", variant="outline", corner=6)

    eng.draw_footer_real(f, 600)

    # -------------------------------------------------------------------------
    # 34. Dasbor Panel Verifikator (820px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(5, 3, "34. Dasbor Panel Verifikator", frame_height=820)
    eng.draw_navbar_panel(f, active_tab="Dasbor Panel", role="Verifikator", user_code="MS", user_name="Mbak Siti")

    eng.create_node("text", "V34 Tit", 40, 85, parent=f, text="Dasbor Panel Verifikator Independen", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "V34 Sub", 40, 112, parent=f, text="Tinjau validitas aduan warga, jalankan triage risiko SAW, dan teruskan ke dinas terkait.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # 4 Stat Cards
    for idx, (sval, slbl, ssub) in enumerate([("14 Aduan", "Antrean Verifikasi", "Perlu tindakan"), ("8 Kasus", "Dalam Investigasi", "SLA berjalan"), ("92.4%", "Akurasi AI Triage", "Deteksi risiko"), ("3.2 Jam", "Rata-rata Respon", "Di bawah target")]):
        vx = 40 + idx * 225
        eng.create_node("rectangle", f"V34 SBox {idx}", vx, 140, 210, 75, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
        eng.create_node("text", f"V34 SV {idx}", vx + 15, 155, parent=f, text=sval, props={"fontSize": 18, "fill": C_DARK})
        eng.create_node("text", f"V34 SL {idx}", vx + 15, 178, parent=f, text=slbl, props={"fontSize": 11, "fill": C_DARK})
        eng.create_node("text", f"V34 SS {idx}", vx + 15, 194, parent=f, text=ssub, props={"fontSize": 9, "fill": C_TEXT_MUTED})

    # AI Recommendation Card
    eng.create_node("rectangle", "V34 AiCard", 40, 230, 880, 65, parent=f, props={"fill": C_DARK, "cornerRadius": 8})
    eng.create_node("text", "V34 AiTit", 60, 245, parent=f, text="Rekomendasi Cerdas AI Triage:", props={"fontSize": 12, "fill": "#FFFFFF"})
    eng.create_node("text", "V34 AiDesc", 60, 268, parent=f, text="3 Laporan baru terdeteksi berisiko Kritis (potensi kontaminasi bakteri di Kec. Tembalang & Candisari). Prioritaskan penanganan!", props={"fontSize": 10, "fill": C_CROSS})
    eng.draw_button(f, "V34 AiBtn", 750, 246, 150, 32, "Buka Antrean Kritis", variant="outline", corner=6)

    # Queue Table
    eng.create_node("text", "V34 QTit", 40, 315, parent=f, text="Antrean Aduan Masuk yang Menunggu Verifikasi", props={"fontSize": 13, "fill": C_DARK})
    eng.create_node("rectangle", "V34 THead", 40, 340, 880, 28, parent=f, props={"fill": C_BG_MUTED})
    v_headers = [("Kode Tiket", 60), ("Skor SAW", 160), ("Pelapor", 260), ("Sekolah", 400), ("Masalah", 560), ("Sisa SLA", 740), ("Aksi", 840)]
    for htit, hx in v_headers:
        eng.create_node("text", f"V34 TH_{htit}", hx, 348, parent=f, text=htit, props={"fontSize": 10, "fill": C_DARK})

    v_cases = [
        ("KS-NF6YNKK", "84.5 (Kritis)", "Ibu Rina", "SDN Tembalang 10", "Makanan Berbau Asam", "02:45:10", "Periksa"),
        ("KS-CD88X12", "76.2 (Kritis)", "Pak Joko (Guru)", "SDN Candisari 01", "Dugaan Sayur Basi", "03:12:00", "Periksa"),
        ("KS-AA33M45", "64.0 (Sedang)", "Ibu Dian", "SMPN 2 Semarang", "Lauk Ayam Kurang", "08:30:00", "Periksa"),
        ("KS-ZZ99Q78", "52.1 (Sedang)", "Bpk. Rahmat", "SDN Pedurungan 02", "Porsi Nasi Sedikit", "10:15:00", "Periksa")
    ]
    for ridx, (tkt, saw, plr, sch, prb, sla, act) in enumerate(v_cases):
        ry = 375 + ridx * 38
        eng.create_node("rectangle", f"V34 TRow {ridx}", 40, ry, 880, 36, parent=f, props={"fill": "#FFFFFF" if ridx % 2 == 0 else C_BG_SUBTLE})
        eng.create_node("text", f"V34 R1 {ridx}", 60, ry + 11, parent=f, text=tkt, props={"fontSize": 10, "fill": C_DARK})
        eng.draw_pill(f, f"V34 R2 {ridx}", 150, ry + 7, 85, 20, saw, is_active=("Kritis" in saw))
        eng.create_node("text", f"V34 R3 {ridx}", 260, ry + 11, parent=f, text=plr, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        eng.create_node("text", f"V34 R4 {ridx}", 400, ry + 11, parent=f, text=sch, props={"fontSize": 10, "fill": C_DARK})
        eng.create_node("text", f"V34 R5 {ridx}", 560, ry + 11, parent=f, text=prb, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        eng.create_node("text", f"V34 R6 {ridx}", 740, ry + 11, parent=f, text=sla, props={"fontSize": 10, "fill": C_DARK})
        eng.draw_button(f, f"V34 R7 {ridx}", 830, ry + 6, 75, 24, act, variant="primary", corner=4)

    eng.draw_footer_real(f, 560)

    # -------------------------------------------------------------------------
    # 35. Antrean Verifikasi Kasus (840px - Priority cards with circular SAW scores!)
    # -------------------------------------------------------------------------
    f = eng.start_frame(5, 4, "35. Antrean Verifikasi", frame_height=840)
    eng.draw_navbar_panel(f, active_tab="Antrean Verifikasi", role="Verifikator", user_code="MS", user_name="Mbak Siti")

    eng.create_node("text", "A35 Tit", 40, 85, parent=f, text="Antrean Kasus & Penilaian Risiko SAW", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "A35 Sub", 40, 112, parent=f, text="Urutan laporan dihitung otomatis berdasarkan algoritma Simple Additive Weighting.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    for idx, (ftxt, fact) in enumerate([("Semua Antrean (14)", False), ("Kritis (3)", True), ("Sedang (7)", False), ("Ringan (4)", False)]):
        eng.draw_pill(f, f"A35 FP {idx}", 40 + idx * 125, 140, 115, 26, ftxt, is_active=fact)

    # List of 6 priority cards with circular SAW scores (34, 66, 47, 48, 53, 42...)
    score_cards = [
        ("KS-NF6YNKK", 84, "SDN Tembalang 10", "Makanan Berbau Asam / Basi", "Ibu Rina", "Sisa SLA: 02:45:10", "Kritis"),
        ("KS-CD88X12", 76, "SDN Candisari 01", "Sayur Sop Bau Kecut", "Pak Joko", "Sisa SLA: 03:12:00", "Kritis"),
        ("KS-GH88P22", 66, "SMP Semarang Tengah 1", "Keterlambatan Armada 40 Menit", "Pak Budi", "Sisa SLA: 05:20:00", "Sedang"),
        ("KS-AA33M45", 53, "SMPN 2 Semarang", "Lauk Ayam Berkurang", "Ibu Dian", "Sisa SLA: 08:30:00", "Sedang"),
        ("KS-ZZ99Q78", 48, "SDN Pedurungan 02", "Porsi Nasi Tidak Rata", "Bpk. Rahmat", "Sisa SLA: 10:15:00", "Sedang"),
        ("KS-BC44P12", 34, "SD Tembalang 12", "Wadah Ompreng Berminyak", "Ibu Endang", "Sisa SLA: 18:40:00", "Ringan")
    ]
    for idx, (tcode, score, sch, prob, plr, sla, sev) in enumerate(score_cards):
        cy = 180 + idx * 88
        eng.create_node("rectangle", f"A35 Card {idx}", 40, cy, 880, 78, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
        # Score Circle
        eng.create_node("ellipse", f"A35 Cir {idx}", 60, cy + 14, 50, 50, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_DARK, "strokeWeight": 2})
        eng.create_node("text", f"A35 ScTxt {idx}", 72, cy + 30, parent=f, text=str(score), props={"fontSize": 15, "fill": C_DARK})
        # Card Body
        eng.create_node("text", f"A35 Cod {idx}", 130, cy + 14, parent=f, text=tcode, props={"fontSize": 11, "fill": C_DARK})
        eng.create_node("text", f"A35 Sch {idx}", 230, cy + 14, parent=f, text=f"{sch}  (Pelapor: {plr})", props={"fontSize": 10, "fill": C_TEXT_MUTED})
        eng.create_node("text", f"A35 Prb {idx}", 130, cy + 34, parent=f, text=prob, props={"fontSize": 12, "fill": C_DARK})
        eng.create_node("text", f"A35 Sla {idx}", 130, cy + 54, parent=f, text=sla, props={"fontSize": 9, "fill": C_TEXT_LIGHT})
        # Actions
        eng.draw_pill(f, f"A35 Sev {idx}", 610, cy + 26, 75, 22, sev, is_active=(sev == "Kritis"))
        eng.draw_button(f, f"A35 BtnApp {idx}", 700, cy + 24, 85, 28, "Setujui", variant="primary", corner=4)
        eng.draw_button(f, f"A35 BtnAsk {idx}", 795, cy + 24, 110, 28, "Minta Bukti", variant="outline", corner=4)

    eng.draw_footer_real(f, 730)

    # -------------------------------------------------------------------------
    # 36. Inspeksi Detail Laporan (840px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(5, 5, "36. Inspeksi Detail Kasus", frame_height=840)
    eng.draw_navbar_panel(f, active_tab="Antrean Verifikasi", role="Verifikator", user_code="MS", user_name="Mbak Siti")

    eng.create_node("text", "I36 Bc", 40, 80, parent=f, text="Verifikasi  /  Inspeksi Detail  /  KS-NF6YNKK", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    eng.create_node("text", "I36 Tit", 40, 105, parent=f, text="Inspeksi Kasus #KS-NF6YNKK", props={"fontSize": 20, "fill": C_DARK})
    eng.draw_pill(f, "I36 SevPill", 360, 107, 120, 24, "Kategori Kritis", is_active=True)

    # Left: Original Report & Evidence (60%)
    eng.create_node("rectangle", "I36 LeftCard", 40, 145, 540, 480, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
    eng.create_node("text", "I36 LTit", 60, 165, parent=f, text="Laporan Warga & Bukti Lapangan", props={"fontSize": 13, "fill": C_DARK})
    eng.create_node("text", "I36 LSch", 60, 190, parent=f, text="Sekolah: SDN Tembalang 10  -  Dapur Mitra: SPPG Tembalang 01", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    eng.create_node("text", "I36 LDesc", 60, 220, parent=f, text="Pelapor: Ibu Rina Wulandari (0812-3456-7890)\nKronologi:\nSayur sop yang diterima anak saya di kelas 4 SDN Tembalang 10 berbau asam\ndan sedikit berlendir saat kotak makan dibuka pukul 11:45 WIB. Anak-anak di meja\ndepan juga mencium bau yang sama sehingga guru kelas menyuruh untuk jangan\ndimakan dulu.", props={"fontSize": 10, "fill": C_DARK})

    eng.create_node("text", "I36 LPhoTit", 60, 320, parent=f, text="2 Foto Bukti Terlampir:", props={"fontSize": 11, "fill": C_DARK})
    eng.draw_image_box(f, "I36 Pho1", 60, 345, 120, 110, corner=6)
    eng.draw_image_box(f, "I36 Pho2", 195, 345, 120, 110, corner=6)
    eng.create_node("text", "I36 LPhoCap", 60, 470, parent=f, text="Metadata: Foto diambil pukul 11:48 WIB via kamera HP pelapor.", props={"fontSize": 9, "fill": C_TEXT_MUTED})

    # Right: AI Analysis & Verification Actions (40%)
    eng.create_node("rectangle", "I36 RightCard", 600, 145, 320, 480, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
    eng.create_node("text", "I36 RTit", 620, 165, parent=f, text="Analisis AI & Keputusan Verifikator", props={"fontSize": 13, "fill": C_DARK})

    eng.create_node("rectangle", "I36 AiBox", 620, 195, 280, 85, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
    eng.create_node("text", "I36 AiT1", 635, 208, parent=f, text="Deteksi Teks: Indikasi Basi 94%", props={"fontSize": 10, "fill": C_DARK})
    eng.create_node("text", "I36 AiT2", 635, 226, parent=f, text="Kalkulasi Skor SAW: 84.5 (Kritis)", props={"fontSize": 10, "fill": C_DARK})
    eng.create_node("text", "I36 AiT3", 635, 244, parent=f, text="Rekomendasi SLA Respon: < 4 Jam", props={"fontSize": 9, "fill": C_TEXT_MUTED})

    eng.create_node("text", "I36 ActLbl", 620, 300, parent=f, text="Tindakan Keputusan Verifikasi:", props={"fontSize": 11, "fill": C_DARK})
    eng.create_node("rectangle", "I36 ActSel", 620, 320, 280, 32, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 6})
    eng.create_node("text", "I36 ActVal", 635, 330, parent=f, text="Validasi & Teruskan ke SPPG & Dinkes v", props={"fontSize": 10, "fill": C_DARK})

    eng.create_node("text", "I36 CatLbl2", 620, 365, parent=f, text="Catatan Verifikator untuk SPPG:", props={"fontSize": 10, "fill": C_DARK})
    eng.create_node("rectangle", "I36 NoteBox", 620, 385, 280, 70, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 6})
    eng.create_node("text", "I36 NoteVal", 630, 395, parent=f, text="Segera kirim makanan pengganti dalam 45 menit!\nAmankan sampel sisa untuk uji sanitarian.", props={"fontSize": 9, "fill": C_DARK})

    eng.draw_button(f, "I36 BtnApprove", 620, 480, 280, 36, "Teruskan Laporan Sekarang [v]", variant="primary", corner=6)
    eng.draw_button(f, "I36 BtnReject", 620, 525, 280, 32, "Tolak Aduan (Tidak Valid / Spam)", variant="outline", corner=6)

    eng.draw_footer_real(f, 650)

    # =========================================================================
    # ROW 6: SPPG & DINKES OPERASIONAL (37 - 42)
    # =========================================================================

    # -------------------------------------------------------------------------
    # 37. Kasus Berjalan & Eskalasi (840px - 5 tabs!)
    # -------------------------------------------------------------------------
    f = eng.start_frame(6, 0, "37. Kasus Berjalan & Eskalasi", frame_height=840)
    eng.draw_navbar_panel(f, active_tab="Kasus Berjalan", role="Verifikator", user_code="MS", user_name="Mbak Siti")

    eng.create_node("text", "K37 Tit", 40, 85, parent=f, text="Pemantauan Kasus Berjalan & Eskalasi SLA", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "K37 Sub", 40, 112, parent=f, text="Pantau kepatuhan batas waktu respon dapur penyedia dan picu eskalasi otomatis.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # 5 Status Tabs
    tabs_37 = [("Terbuka (66)", True), ("Perlu Diteruskan (3)", False), ("Menunggu SPPG (8)", False), ("Investigasi (4)", False), ("Selesai (587)", False)]
    for tidx, (tname, tact) in enumerate(tabs_37):
        eng.draw_pill(f, f"K37 Tab {tidx}", 40 + tidx * 155, 140, 145, 26, tname, is_active=tact)

    # Table of Cases with SLA Warnings
    eng.create_node("rectangle", "K37 THead", 40, 185, 880, 28, parent=f, props={"fill": C_BG_MUTED})
    k_headers = [("Tiket", 60), ("Sekolah", 160), ("SPPG Penanggung Jawab", 340), ("Masalah", 540), ("Sisa SLA", 720), ("Aksi", 830)]
    for htit, hx in k_headers:
        eng.create_node("text", f"K37 TH_{htit}", hx, 193, parent=f, text=htit, props={"fontSize": 10, "fill": C_DARK})

    k_cases = [
        ("KS-NF6YNKK", "SDN Tembalang 10", "SPPG Tembalang 01", "Makanan Berbau Asam", "02:45:10", "Eskalasi"),
        ("KS-CD88X12", "SDN Candisari 01", "SPPG Candisari 01", "Sayur Sop Basi", "03:12:00", "Eskalasi"),
        ("KS-GH88P22", "SMP Smg Tengah 1", "SPPG Smg Tengah 01", "Keterlambatan Armada", "05:20:00", "Detail"),
        ("KS-AA33M45", "SMPN 2 Semarang", "SPPG Genuk 01", "Lauk Ayam Berkurang", "08:30:00", "Detail"),
        ("KS-ZZ99Q78", "SDN Pedurungan 02", "SPPG Pedurungan 02", "Porsi Nasi Sedikit", "10:15:00", "Detail"),
        ("KS-BC44P12", "SD Tembalang 12", "SPPG Tembalang 01", "Wadah Ompreng Kotor", "18:40:00", "Detail")
    ]
    for ridx, (tkt, sch, spg, prb, sla, act) in enumerate(k_cases):
        ry = 220 + ridx * 42
        eng.create_node("rectangle", f"K37 TRow {ridx}", 40, ry, 880, 38, parent=f, props={"fill": "#FFFFFF" if ridx % 2 == 0 else C_BG_SUBTLE})
        eng.create_node("text", f"K37 R1 {ridx}", 60, ry + 12, parent=f, text=tkt, props={"fontSize": 10, "fill": C_DARK})
        eng.create_node("text", f"K37 R2 {ridx}", 160, ry + 12, parent=f, text=sch, props={"fontSize": 10, "fill": C_DARK})
        eng.create_node("text", f"K37 R3 {ridx}", 340, ry + 12, parent=f, text=spg, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        eng.create_node("text", f"K37 R4 {ridx}", 540, ry + 12, parent=f, text=prb, props={"fontSize": 10, "fill": C_DARK})
        eng.draw_pill(f, f"K37 R5 {ridx}", 710, ry + 8, 90, 22, sla, is_active=(ridx < 2))
        eng.draw_button(f, f"K37 R6 {ridx}", 820, ry + 8, 85, 24, act, variant="primary" if act == "Eskalasi" else "outline", corner=4)

    # Escalation Summary Box
    eng.create_node("rectangle", "K37 EscBox", 40, 500, 880, 80, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
    eng.create_node("text", "K37 EscTit", 60, 518, parent=f, text="Protokol Eskalasi Otomatis:", props={"fontSize": 12, "fill": C_DARK})
    eng.create_node("text", "K37 EscDesc", 60, 540, parent=f, text="Jika SPPG tidak merespon dalam 2 jam sejak notifikasi diteruskan, tiket otomatis dieskalasi ke Korwil MBG Jateng.", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    eng.draw_footer_real(f, 620)

    # -------------------------------------------------------------------------
    # 38. Dasbor Dapur SPPG (820px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(6, 1, "38. Dasbor Dapur SPPG", frame_height=820)
    eng.draw_navbar_panel(f, active_tab="Dasbor Dapur", role="SPPG", user_code="DB", user_name="Dapur Berkah")

    eng.create_node("text", "S38 Tit", 40, 85, parent=f, text="Dasbor Operasional SPPG Tembalang 01", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "S38 Sub", 40, 112, parent=f, text="Dapur Berkah  -  Kapasitas 4.100 Porsi/Hari  -  SLHS Dinkes Terakreditasi A", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # 4 Stat Cards
    for idx, (sval, slbl, ssub) in enumerate([("3 Aduan", "Tiket Terbuka", "Perlu tindakan segera"), ("96.5%", "Kepatuhan Menu", "Pekan ini"), ("SLHS Grade A", "Akreditasi Sanitasi", "Berlaku s/d 2027"), ("4.100 Porsi", "Distribusi Hari Ini", "8 Sekolah Mitra")]):
        sx = 40 + idx * 225
        eng.create_node("rectangle", f"S38 SBox {idx}", sx, 140, 210, 75, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
        eng.create_node("text", f"S38 SV {idx}", sx + 15, 155, parent=f, text=sval, props={"fontSize": 18, "fill": C_DARK})
        eng.create_node("text", f"S38 SL {idx}", sx + 15, 178, parent=f, text=slbl, props={"fontSize": 11, "fill": C_DARK})
        eng.create_node("text", f"S38 SS {idx}", sx + 15, 194, parent=f, text=ssub, props={"fontSize": 9, "fill": C_TEXT_MUTED})

    # Menu of the Day Banner
    eng.create_node("rectangle", "S38 MenuBox", 40, 230, 880, 80, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
    eng.create_node("text", "S38 MTit", 60, 248, parent=f, text="Jadwal Menu Hari Ini (Rabu, 04 November 2026):", props={"fontSize": 12, "fill": C_DARK})
    eng.create_node("text", "S38 MDesc", 60, 272, parent=f, text="Nasi Putih (150g), Ayam Bakar Madu (80g), Tumis Buncis Jagung Manis (60g), Buah Pisang Cavendish (1 bh), Susu UHT 200ml.", props={"fontSize": 10, "fill": C_DARK})

    # Active Tickets List
    eng.create_node("text", "S38 TTit", 40, 330, parent=f, text="Aduan Masuk yang Memerlukan Tindak Lanjut Lapangan", props={"fontSize": 13, "fill": C_DARK})
    s_tickets = [
        ("KS-NF6YNKK", "SDN Tembalang 10", "Sayur Sop Basi / Berbau Asam", "Batas Waktu: 02:45:00", "Unggah Bukti Pengganti"),
        ("KS-BC44P12", "SD Tembalang 12", "Wadah Ompreng Berminyak", "Batas Waktu: 18:40:00", "Klarifikasi Kebersihan")
    ]
    for idx, (tkt, sch, prb, sla, act) in enumerate(s_tickets):
        ty = 355 + idx * 65
        eng.create_node("rectangle", f"S38 TCard {idx}", 40, ty, 880, 55, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
        eng.create_node("text", f"S38 TCod {idx}", 60, ty + 18, parent=f, text=tkt, props={"fontSize": 11, "fill": C_DARK})
        eng.create_node("text", f"S38 TSch {idx}", 180, ty + 18, parent=f, text=sch, props={"fontSize": 11, "fill": C_DARK})
        eng.create_node("text", f"S38 TPrb {idx}", 360, ty + 18, parent=f, text=prb, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        eng.create_node("text", f"S38 TSla {idx}", 580, ty + 18, parent=f, text=sla, props={"fontSize": 10, "fill": C_DARK})
        eng.draw_button(f, f"S38 TBtn {idx}", 720, ty + 12, 185, 30, act, variant="primary", corner=6)

    eng.draw_footer_real(f, 520)

    # -------------------------------------------------------------------------
    # 39. Papan Kasus & Tindak Lanjut SPPG (840px - Authentic 6 complaint cards!)
    # -------------------------------------------------------------------------
    f = eng.start_frame(6, 2, "39. Papan Kasus Dapur SPPG", frame_height=840)
    eng.draw_navbar_panel(f, active_tab="Aduan Masuk", role="SPPG", user_code="DB", user_name="Dapur Berkah")

    eng.create_node("text", "P39 Tit", 40, 85, parent=f, text="Aduan Masuk Dapur Tembalang 01", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "P39 Sub", 40, 112, parent=f, text="Daftar laporan dari sekolah-sekolah mitra di wilayah binaan Kecamatan Tembalang.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # 6 Complaint Cards (SMA Tembalang 3, TK Tembalang 2, SD Tembalang 10, SD Tembalang 12, SD Tembalang 11)
    sppg_cases = [
        ("KS-NF6YNKK", "SD Negeri Tembalang 10", "Makanan Berbau Asam di Kelas 4", "Kritis", "Sisa SLA: 02:45:00", "Segera kirim makanan pengganti"),
        ("KS-TK02A11", "TK Negeri Tembalang 2", "Porsi Lauk Kurang 10 Box", "Sedang", "Sisa SLA: 06:10:00", "Kirim tambahan porsi ke lokasi"),
        ("KS-BC44P12", "SD Negeri Tembalang 12", "Wadah Ompreng Kurang Bersih", "Ringan", "Sisa SLA: 18:40:00", "SOP pembersihan ulang sanitasi"),
        ("KS-SD11Q34", "SD Negeri Tembalang 11", "Keterlambatan Armada 25 Menit", "Sedang", "Sisa SLA: 07:15:00", "Klarifikasi rute pengantaran"),
        ("KS-SM03X89", "SMA Negeri Tembalang 3", "Buah Jeruk Masih Mentah", "Ringan", "Selesai", "Diganti pisang di hari berikutnya"),
        ("KS-SD10M02", "SD Negeri Tembalang 10", "Sayur Sop Kurang Garam", "Ringan", "Selesai", "Evaluasi resep juru masak")
    ]
    for idx, (tcode, sch, prob, sev, sla, sol) in enumerate(sppg_cases):
        cy = 145 + idx * 82
        eng.create_node("rectangle", f"P39 Card {idx}", 40, cy, 880, 72, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
        eng.create_node("text", f"P39 Cod {idx}", 60, cy + 14, parent=f, text=tcode, props={"fontSize": 11, "fill": C_DARK})
        eng.create_node("text", f"P39 Sch {idx}", 180, cy + 14, parent=f, text=sch, props={"fontSize": 12, "fill": C_DARK})
        eng.draw_pill(f, f"P39 Sev {idx}", 420, cy + 12, 75, 20, sev, is_active=(sev == "Kritis"))
        eng.create_node("text", f"P39 Prb {idx}", 60, cy + 34, parent=f, text=prob, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        eng.create_node("text", f"P39 Sol {idx}", 60, cy + 50, parent=f, text=f"Tindakan Diperlukan: {sol}", props={"fontSize": 9, "fill": C_DARK})
        eng.create_node("text", f"P39 Sla {idx}", 520, cy + 14, parent=f, text=sla, props={"fontSize": 10, "fill": C_DARK})
        eng.draw_button(f, f"P39 Btn {idx}", 720, cy + 20, 185, 30, "Unggah Bukti Perbaikan", variant="primary" if idx < 4 else "outline", corner=6)

    eng.draw_footer_real(f, 660)

    # -------------------------------------------------------------------------
    # 40. Formulir Bukti Perbaikan SPPG (820px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(6, 3, "40. Bukti Tindak Lanjut SPPG", frame_height=820)
    eng.draw_navbar_panel(f, active_tab="Aduan Masuk", role="SPPG", user_code="DB", user_name="Dapur Berkah")

    eng.create_node("text", "T40 Bc", 40, 80, parent=f, text="Aduan Masuk  /  Tindak Lanjut  /  KS-NF6YNKK", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    eng.create_node("text", "T40 Tit", 40, 105, parent=f, text="Formulir Bukti Tindak Lanjut #KS-NF6YNKK", props={"fontSize": 20, "fill": C_DARK})

    # Left: Action form (60%)
    eng.create_node("rectangle", "T40 FormCard", 40, 140, 560, 480, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
    eng.create_node("text", "T40 FTit", 60, 160, parent=f, text="Laporan Tindakan Korektif yang Dilakukan", props={"fontSize": 13, "fill": C_DARK})

    eng.create_node("text", "T40 F1Lbl", 60, 190, parent=f, text="Deskripsi Tindakan Penyelesaian", props={"fontSize": 11, "fill": C_DARK})
    eng.create_node("rectangle", "T40 TArea", 60, 210, 520, 90, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 6})
    eng.create_node("text", "T40 TVal", 75, 222, parent=f, text="Pihak Dapur Berkah telah mengirimkan 45 porsi makanan pengganti\n(Ayam Bakar + Sayur Sop Segar yang baru dimasak) tiba di SDN Tembalang 10\npada pukul 12:20 WIB dan diterima langsung oleh guru piket.", props={"fontSize": 10, "fill": C_DARK})

    eng.create_node("text", "T40 F2Lbl", 60, 315, parent=f, text="Unggah Foto Bukti Serah Terima Makanan Pengganti", props={"fontSize": 11, "fill": C_DARK})
    eng.draw_image_box(f, "T40 Proof1", 60, 335, 120, 100, corner=6)
    eng.draw_image_box(f, "T40 Proof2", 195, 335, 120, 100, corner=6)
    eng.create_node("text", "T40 ProofCap", 60, 445, parent=f, text="Foto berita acara serah terima bertanda tangan guru piket.", props={"fontSize": 9, "fill": C_TEXT_MUTED})

    eng.create_node("rectangle", "T40 Chk", 60, 485, 14, 14, parent=f, props={"fill": C_DARK, "cornerRadius": 3})
    eng.create_node("text", "T40 ChkTxt", 82, 485, parent=f, text="Saya menyatakan makanan pengganti memenuhi standar keamanan pangan.", props={"fontSize": 10, "fill": C_DARK})

    eng.draw_button(f, "T40 Submit", 60, 520, 260, 36, "Kirim Bukti ke Verifikator", variant="primary", corner=6)
    eng.draw_button(f, "T40 Draft", 335, 520, 120, 36, "Simpan Draf", variant="outline", corner=6)

    # Right: Case Recap (40%)
    eng.create_node("rectangle", "T40 RecapCard", 620, 140, 300, 480, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
    eng.create_node("text", "T40 RTit", 640, 160, parent=f, text="Ringkasan Kasus Asal", props={"fontSize": 13, "fill": C_DARK})
    eng.create_node("text", "T40 RSch", 640, 190, parent=f, text="Sekolah: SDN Tembalang 10", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    eng.create_node("text", "T40 RPrb", 640, 210, parent=f, text="Keluhan: Sayur Sop Berbau Asam", props={"fontSize": 10, "fill": C_DARK})
    eng.create_node("text", "T40 RSla", 640, 230, parent=f, text="Batas SLA Respon: Sisa 02:45:00", props={"fontSize": 10, "fill": C_DARK})
    eng.create_node("line", "T40 RDiv", 640, 255, 260, 0, parent=f, props={"stroke": C_BORDER, "strokeWeight": 1})
    eng.create_node("text", "T40 RTmTit", 640, 275, parent=f, text="Riwayat Status:", props={"fontSize": 11, "fill": C_DARK})
    eng.create_node("text", "T40 RT1", 640, 295, parent=f, text="11:45 - Laporan masuk dari wali murid", props={"fontSize": 9, "fill": C_TEXT_MUTED})
    eng.create_node("text", "T40 RT2", 640, 315, parent=f, text="11:55 - Diverifikasi oleh Mbak Siti", props={"fontSize": 9, "fill": C_TEXT_MUTED})
    eng.create_node("text", "T40 RT3", 640, 335, parent=f, text="12:00 - Notifikasi diterima SPPG", props={"fontSize": 9, "fill": C_TEXT_MUTED})

    eng.draw_footer_real(f, 640)

    # -------------------------------------------------------------------------
    # 41. Dasbor Pengawasan Medis Dinkes (840px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(6, 4, "41. Dasbor Medis Dinkes", frame_height=840)
    eng.draw_navbar_panel(f, active_tab="Dasbor Medis", role="Dinkes", user_code="DH", user_name="dr. Hendra")

    eng.create_node("text", "D41 Tit", 40, 85, parent=f, text="Dasbor Pengawasan Sanitasi & Medis Dinkes", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "D41 Sub", 40, 112, parent=f, text="Dinas Kesehatan Kota Semarang  -  Bidang Pengendalian Penyakit & Sanitasi Pangan", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # 4 Stat Cards
    for idx, (sval, slbl, ssub) in enumerate([("0 Kasus", "Insiden KLB Aktif", "Kondisi terkendali"), ("12 Dapur", "SPPG Diaudit Rutin", "Sertifikat SLHS aktif"), ("98.4%", "Uji Sampel Higiene", "Lolos parameter lab"), ("4 Tim", "Reaksi Cepat Medis", "Siaga PSC 119")]):
        dx = 40 + idx * 225
        eng.create_node("rectangle", f"D41 SBox {idx}", dx, 140, 210, 75, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
        eng.create_node("text", f"D41 SV {idx}", dx + 15, 155, parent=f, text=sval, props={"fontSize": 18, "fill": C_DARK})
        eng.create_node("text", f"D41 SL {idx}", dx + 15, 178, parent=f, text=slbl, props={"fontSize": 11, "fill": C_DARK})
        eng.create_node("text", f"D41 SS {idx}", dx + 15, 194, parent=f, text=ssub, props={"fontSize": 9, "fill": C_TEXT_MUTED})

    # Lab Test Results & Map
    eng.draw_image_box(f, "D41 MapBox", 40, 230, 560, 240, corner=10)
    eng.create_node("text", "D41 MapTit", 60, 250, parent=f, text="Peta Sebaran Pengambilan Sampel Makanan - Puskesmas Se-Kota", props={"fontSize": 12, "fill": C_DARK})
    eng.create_node("text", "D41 MapSub", 60, 270, parent=f, text="Titik hijau: Sampel aman. Titik oranye: Dalam pengujian biakan 24 jam.", props={"fontSize": 9, "fill": C_TEXT_MUTED})

    # Right: Recent Lab Test Table
    eng.create_node("rectangle", "D41 LabBox", 620, 230, 300, 240, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
    eng.create_node("text", "D41 LabTit", 640, 250, parent=f, text="Hasil Uji Lab Terkini", props={"fontSize": 12, "fill": C_DARK})
    lab_tests = [
        ("SPPG Tembalang 01", "E. Coli: Negatif", "Lolos"),
        ("SPPG Candisari 01", "Salmonella: Negatif", "Lolos"),
        ("SPPG Genuk 01", "Suhu Box: 65°C", "Lolos"),
        ("SPPG Smg Utara 02", "Uji Biakan Berjalan", "Pending")
    ]
    for idx, (spg, res, stt) in enumerate(lab_tests):
        ly = 280 + idx * 42
        eng.create_node("text", f"D41 L1 {idx}", 640, ly, parent=f, text=spg, props={"fontSize": 10, "fill": C_DARK})
        eng.create_node("text", f"D41 L2 {idx}", 640, ly + 16, parent=f, text=res, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        eng.draw_pill(f, f"D41 L3 {idx}", 840, ly + 4, 60, 20, stt, is_active=(stt == "Lolos"))

    eng.draw_footer_real(f, 500)

    # -------------------------------------------------------------------------
    # 42. Investigasi KLB & Peringatan Medis (840px - Authentic alert status & criteria!)
    # -------------------------------------------------------------------------
    f = eng.start_frame(6, 5, "42. Investigasi KLB Medis", frame_height=840)
    eng.draw_navbar_panel(f, active_tab="Investigasi & KLB", role="Dinkes", user_code="DH", user_name="dr. Hendra")

    eng.create_node("text", "K42 Tit", 40, 85, parent=f, text="Peringatan Dini Kesehatan & Wilayah", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "K42 Sub", 40, 112, parent=f, text="Monitoring real-time potensi Kejadian Luar Biasa (KLB) keracunan makanan sekolah.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # 4 Criteria Pills
    crit_pills = [("Gejala Serempak (>=3)", True), ("Keterlambatan (>45m)", False), ("Benda Asing", False), ("Sampel Belum Uji", False)]
    for idx, (cp_txt, cp_act) in enumerate(crit_pills):
        eng.draw_pill(f, f"K42 CP {idx}", 40 + idx * 160, 140, 150, 26, cp_txt, is_active=cp_act)

    # Active Alert Status Card
    eng.create_node("rectangle", "K42 AlertCard", 40, 185, 880, 75, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1.5, "cornerRadius": 10})
    eng.create_node("ellipse", "K42 ACir", 65, 202, 38, 38, parent=f, props={"fill": C_DARK})
    eng.create_node("text", "K42 ATxt", 80, 212, parent=f, text="v", props={"fontSize": 16, "fill": "#FFFFFF"})
    eng.create_node("text", "K42 ATit", 115, 200, parent=f, text="STATUS SISTEM: TIDAK ADA ANCAMAN KLB AKTIF", props={"fontSize": 13, "fill": C_DARK})
    eng.create_node("text", "K42 ASub", 115, 222, parent=f, text="Ambang batas eskalasi darurat medis belum terlampaui dalam 48 jam terakhir.", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    # Past History Cards (SPPG Semarang Utara 02 x4, Banyumanik 01 x20)
    eng.create_node("text", "K42 HistTit", 40, 280, parent=f, text="Riwayat Investigasi Kasus Medis & Investigasi Khusus", props={"fontSize": 13, "fill": C_DARK})

    med_cases = [
        ("SPPG Semarang Utara 02 - SDN Bandarharjo 01", "4 Siswa melaporkan perut mulas setelah makan siang.", "Hasil Uji: Negatif Bakteri Patogen (Alergi Ikan Laut)", "Selesai"),
        ("SPPG Banyumanik 01 - SDN Banyumanik 03", "20 Siswa merasakan mual ringan setelah minum susu.", "Hasil Uji: Intoleransi Laktosa (Diganti Susu Bebas Laktosa)", "Selesai"),
        ("SPPG Candisari 01 - SDN Candisari 01", "Sayur sop berbau asam dilaporkan oleh wali murid.", "Status: Tim Sanitarian sedang mengambil sampel sisa makanan.", "Proses Lab")
    ]
    for idx, (mtitle, mdesc, mres, mstt) in enumerate(med_cases):
        my = 305 + idx * 80
        eng.create_node("rectangle", f"K42 MCard {idx}", 40, my, 880, 70, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
        eng.create_node("text", f"K42 MT1 {idx}", 60, my + 14, parent=f, text=mtitle, props={"fontSize": 12, "fill": C_DARK})
        eng.create_node("text", f"K42 MT2 {idx}", 60, my + 32, parent=f, text=mdesc, props={"fontSize": 10, "fill": C_DARK})
        eng.create_node("text", f"K42 MT3 {idx}", 60, my + 48, parent=f, text=mres, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        eng.draw_pill(f, f"K42 MStt {idx}", 780, my + 22, 110, 24, mstt, is_active=(mstt == "Selesai"))

    eng.draw_footer_real(f, 570)

    # =========================================================================
    # ROW 7: KORWIL & ADMINISTRASI SISTEM (43 - 47)
    # =========================================================================

    # -------------------------------------------------------------------------
    # 43. Dasbor Akuntabilitas Korwil (840px - Banner 4 stats + table 11 SPPGs!)
    # -------------------------------------------------------------------------
    f = eng.start_frame(7, 0, "43. Dasbor Korwil MBG", frame_height=840)
    eng.draw_navbar_panel(f, active_tab="Papan Akuntabilitas", role="Korwil", user_code="BA", user_name="Bpk. Agus")

    eng.create_node("text", "K43 Tit", 40, 85, parent=f, text="Dasbor Akuntabilitas Wilayah - Korwil MBG Jateng", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "K43 Sub", 40, 112, parent=f, text="Monitoring makro kinerja 12 Satuan Pelayanan Pangan Gizi (SPPG) di Kota Semarang.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # Top Banner Card with 4 Stats (698, 90.5%, 46.8 jam, 56.1%)
    eng.create_node("rectangle", "K43 BanCard", 40, 140, 880, 80, parent=f, props={"fill": C_DARK, "cornerRadius": 10})
    k_stats = [("698", "Total Aduan"), ("90.5%", "Kepatuhan SLA"), ("46.8 jam", "Rata-rata Resolusi"), ("56.1%", "Tingkat Kepuasan")]
    for idx, (sval, slbl) in enumerate(k_stats):
        kx = 60 + idx * 215
        eng.create_node("text", f"K43 BV {idx}", kx, 160, parent=f, text=sval, props={"fontSize": 18, "fill": "#FFFFFF"})
        eng.create_node("text", f"K43 BL {idx}", kx, 185, parent=f, text=slbl, props={"fontSize": 10, "fill": C_CROSS})

    # Table of 11 SPPGs with Progress Bars & Star Ratings
    eng.create_node("text", "K43 TabTit", 40, 240, parent=f, text="Matriks Kinerja & Rapor Dapur SPPG se-Kota Semarang", props={"fontSize": 13, "fill": C_DARK})
    eng.create_node("rectangle", "K43 THead", 40, 265, 880, 28, parent=f, props={"fill": C_BG_MUTED})
    k43_headers = [("Nama SPPG", 60), ("Sekolah", 260), ("Porsi/Hari", 360), ("Kepatuhan Menu", 480), ("Rating", 640), ("Status Audit", 780)]
    for htit, hx in k43_headers:
        eng.create_node("text", f"K43 TH_{htit}", hx, 273, parent=f, text=htit, props={"fontSize": 10, "fill": C_DARK})

    sppg_korwil = [
        ("SPPG Semarang Utara 02", "8 Sekolah", "4.200", 88, "[ * * * * ] (4.2)", "Perlu Audit"),
        ("SPPG Genuk 01", "7 Sekolah", "3.800", 84, "[ * * * * ] (4.0)", "Perlu Audit"),
        ("SPPG Pedurungan 02", "9 Sekolah", "4.500", 91, "[ * * * * * ] (4.6)", "Aman"),
        ("SPPG Banyumanik 01", "6 Sekolah", "3.600", 95, "[ * * * * * ] (4.8)", "Aman"),
        ("SPPG Tembalang 01", "8 Sekolah", "4.100", 92, "[ * * * * * ] (4.5)", "Aman"),
        ("SPPG Candisari 01", "6 Sekolah", "3.200", 89, "[ * * * * ] (4.3)", "Monitoring")
    ]
    for ridx, (snm, ssch, spor, spct, srat, saud) in enumerate(sppg_korwil):
        ry = 300 + ridx * 38
        eng.create_node("rectangle", f"K43 TRow {ridx}", 40, ry, 880, 36, parent=f, props={"fill": "#FFFFFF" if ridx % 2 == 0 else C_BG_SUBTLE})
        eng.create_node("text", f"K43 R1 {ridx}", 60, ry + 11, parent=f, text=snm, props={"fontSize": 10, "fill": C_DARK})
        eng.create_node("text", f"K43 R2 {ridx}", 260, ry + 11, parent=f, text=ssch, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        eng.create_node("text", f"K43 R3 {ridx}", 360, ry + 11, parent=f, text=spor, props={"fontSize": 10, "fill": C_DARK})
        # progress bar
        eng.create_node("rectangle", f"K43 BarBg {ridx}", 480, ry + 13, 100, 6, parent=f, props={"fill": C_BG_MUTED, "cornerRadius": 3})
        eng.create_node("rectangle", f"K43 BarFill {ridx}", 480, ry + 13, int(100 * spct / 100), 6, parent=f, props={"fill": C_DARK, "cornerRadius": 3})
        eng.create_node("text", f"K43 R4 {ridx}", 590, ry + 11, parent=f, text=f"{spct}%", props={"fontSize": 9, "fill": C_TEXT_MUTED})
        eng.create_node("text", f"K43 R5 {ridx}", 640, ry + 11, parent=f, text=srat, props={"fontSize": 9, "fill": C_DARK})
        eng.draw_pill(f, f"K43 R6 {ridx}", 780, ry + 7, 95, 22, saud, is_active=(saud == "Perlu Audit"))

    eng.draw_footer_real(f, 560)

    # -------------------------------------------------------------------------
    # 44. Prioritas Audit SPPG DSS Korwil (860px - Rank 1 to 13 with delta indicators!)
    # -------------------------------------------------------------------------
    f = eng.start_frame(7, 1, "44. DSS Prioritas Audit Korwil", frame_height=860)
    eng.draw_navbar_panel(f, active_tab="Prioritas Audit (DSS)", role="Korwil", user_code="BA", user_name="Bpk. Agus")

    eng.create_node("text", "D44 Tit", 40, 85, parent=f, text="Prioritas Inspeksi Dapur SPPG (DSS SAW)", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "D44 Sub", 40, 112, parent=f, text="Peringkat urgensi inspeksi audit lapangan berdasar kalkulasi bobot risiko SAW.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # Table of 8 ranked SPPGs with delta trend indicators (↑ 6, ↓ 2, ↑ 15)
    eng.create_node("rectangle", "D44 THead", 40, 145, 880, 28, parent=f, props={"fill": C_BG_MUTED})
    d44_headers = [("Rank", 60), ("Nama Dapur SPPG", 130), ("Tren Risiko", 340), ("Skor Preferensi Vi", 480), ("Kategori Urgensi", 640), ("Tindakan Korwil", 780)]
    for htit, hx in d44_headers:
        eng.create_node("text", f"D44 TH_{htit}", hx, 153, parent=f, text=htit, props={"fontSize": 10, "fill": C_DARK})

    ranked_korwil = [
        ("1", "SPPG Semarang Utara 02", "[ + ] Naik 6 Poin", "0.884", "Sangat Mendesak", "Jadwal Sidak Besok"),
        ("2", "SPPG Genuk 01", "[ + ] Naik 2 Poin", "0.841", "Mendesak", "Panggil Pengelola"),
        ("3", "SPPG Pedurungan 02", "[ - ] Turun 3 Poin", "0.785", "Waspada", "Audit Sampel"),
        ("4", "SPPG Candisari 01", "[ + ] Naik 15 Poin", "0.742", "Waspada", "Audit Sampel"),
        ("5", "SPPG Smg Tengah 01", "[ - ] Turun 1 Poin", "0.680", "Rutin", "Monitoring"),
        ("6", "SPPG Mijen 01", "[ - ] Turun 5 Poin", "0.520", "Rutin", "Monitoring"),
        ("7", "SPPG Banyumanik 01", "[ - ] Turun 8 Poin", "0.485", "Sangat Baik", "Tanpa Tindakan"),
        ("8", "SPPG Tugu 01", "[ - ] Turun 2 Poin", "0.450", "Sangat Baik", "Tanpa Tindakan")
    ]
    for ridx, (rnk, snm, strn, sscore, surgenza, sact) in enumerate(ranked_korwil):
        ry = 180 + ridx * 40
        eng.create_node("rectangle", f"D44 TRow {ridx}", 40, ry, 880, 38, parent=f, props={"fill": "#FFFFFF" if ridx % 2 == 0 else C_BG_SUBTLE})
        eng.create_node("text", f"D44 R1 {ridx}", 65, ry + 12, parent=f, text=rnk, props={"fontSize": 11, "fill": C_DARK})
        eng.create_node("text", f"D44 R2 {ridx}", 130, ry + 12, parent=f, text=snm, props={"fontSize": 11, "fill": C_DARK})
        eng.create_node("text", f"D44 R3 {ridx}", 340, ry + 12, parent=f, text=strn, props={"fontSize": 10, "fill": C_DARK})
        eng.create_node("text", f"D44 R4 {ridx}", 480, ry + 12, parent=f, text=sscore, props={"fontSize": 11, "fill": C_DARK})
        eng.draw_pill(f, f"D44 R5 {ridx}", 630, ry + 8, 110, 22, surgenza, is_active=(rnk in ["1", "2"]))
        eng.draw_button(f, f"D44 R6 {ridx}", 770, ry + 8, 140, 24, sact, variant="primary" if rnk in ["1", "2"] else "outline", corner=4)

    # Action Summary
    eng.create_node("rectangle", "D44 ActBox", 40, 520, 880, 75, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
    eng.create_node("text", "D44 ATit", 60, 538, parent=f, text="Surat Perintah Tugas Inspeksi Terbit Otomatis:", props={"fontSize": 12, "fill": C_DARK})
    eng.create_node("text", "D44 ADesc", 60, 560, parent=f, text="Surat tugas No. 800/Korwil-MBG/Smg/2026 telah ditandatangani digital untuk Dapur Smg Utara 02.", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    eng.draw_footer_real(f, 620)

    # -------------------------------------------------------------------------
    # 45. Dasbor Utama Administrator (820px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(7, 2, "45. Dasbor Utama Admin", frame_height=820)
    eng.draw_navbar_panel(f, active_tab="Dasbor Admin", role="Admin", user_code="AD", user_name="Administrator")

    eng.create_node("text", "A45 Tit", 40, 85, parent=f, text="Pusat Kendali Sistem PMBGM", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "A45 Sub", 40, 112, parent=f, text="Status infrastruktur server, kinerja antrean asinkron, dan audit trail aktivitas.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # 4 Stat Cards
    for idx, (sval, slbl, ssub) in enumerate([("1.420", "Pengguna Terdaftar", "Warga, Guru, SPPG"), ("47 Halaman", "Layanan Aktif", "100% Responsif"), ("99.98%", "Server Uptime", "30 hari terakhir"), ("0 Error", "Critical Issues", "Gateway operasional")]):
        ax = 40 + idx * 225
        eng.create_node("rectangle", f"A45 SBox {idx}", ax, 140, 210, 75, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
        eng.create_node("text", f"A45 SV {idx}", ax + 15, 155, parent=f, text=sval, props={"fontSize": 18, "fill": C_DARK})
        eng.create_node("text", f"A45 SL {idx}", ax + 15, 178, parent=f, text=slbl, props={"fontSize": 11, "fill": C_DARK})
        eng.create_node("text", f"A45 SS {idx}", ax + 15, 194, parent=f, text=ssub, props={"fontSize": 9, "fill": C_TEXT_MUTED})

    # System Health Cards
    eng.create_node("text", "A45 HltTit", 40, 235, parent=f, text="Kesehatan Modul Layanan Backend", props={"fontSize": 13, "fill": C_DARK})
    services = [
        ("Next.js App Server", "Port 3000 - Latency 24ms", "Normal"),
        ("PostgreSQL Database", "Active Connections: 32 / 100", "Normal"),
        ("AI Triage Background Worker", "Job Queue: 0 Pending", "Normal"),
        ("WhatsApp SLA Gateway", "Delivery Rate: 99.8%", "Normal")
    ]
    for idx, (snm, ssub, sstt) in enumerate(services):
        col_i = idx % 2
        row_i = idx // 2
        sx = 40 + col_i * 450
        sy = 260 + row_i * 65
        eng.create_node("rectangle", f"A45 SvcBox {idx}", sx, sy, 430, 55, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
        eng.create_node("text", f"A45 SvcNm {idx}", sx + 15, sy + 12, parent=f, text=snm, props={"fontSize": 11, "fill": C_DARK})
        eng.create_node("text", f"A45 SvcSub {idx}", sx + 15, sy + 30, parent=f, text=ssub, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        eng.draw_pill(f, f"A45 SvcPill {idx}", sx + 340, sy + 16, 75, 22, sstt, is_active=True)

    # Audit Trail Table
    eng.create_node("text", "A45 AudTit", 40, 410, parent=f, text="Log Audit Aktivitas Sistem Terkini", props={"fontSize": 13, "fill": C_DARK})
    logs = [
        ("04/11/2026 11:55", "Verifikator Mbak Siti", "Validasi Tiket KS-NF6YNKK sebagai Kritis", "Sukses"),
        ("04/11/2026 11:45", "Warga Ibu Rina", "Submit Laporan Masalah SDN Tembalang 10", "Sukses"),
        ("04/11/2026 10:30", "Administrator", "Pembaruan Threshold SLA Kategori Kritis", "Sukses"),
        ("04/11/2026 09:15", "Korwil Bpk. Agus", "Ekspor Laporan Bulanan Akuntabilitas (PDF)", "Sukses")
    ]
    for idx, (ltm, lusr, lact, lstt) in enumerate(logs):
        ly = 435 + idx * 36
        eng.create_node("rectangle", f"A45 LogRow {idx}", 40, ly, 880, 32, parent=f, props={"fill": "#FFFFFF" if idx % 2 == 0 else C_BG_SUBTLE})
        eng.create_node("text", f"A45 L1 {idx}", 55, ly + 9, parent=f, text=ltm, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        eng.create_node("text", f"A45 L2 {idx}", 180, ly + 9, parent=f, text=lusr, props={"fontSize": 10, "fill": C_DARK})
        eng.create_node("text", f"A45 L3 {idx}", 380, ly + 9, parent=f, text=lact, props={"fontSize": 10, "fill": C_DARK})
        eng.create_node("text", f"A45 L4 {idx}", 820, ly + 9, parent=f, text=lstt, props={"fontSize": 9, "fill": C_DARK})

    eng.draw_footer_real(f, 600)

    # -------------------------------------------------------------------------
    # 46. Manajemen Pengguna & Hak Akses (820px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(7, 3, "46. Manajemen Pengguna", frame_height=820)
    eng.draw_navbar_panel(f, active_tab="Kelola Pengguna", role="Admin", user_code="AD", user_name="Administrator")

    eng.create_node("text", "M46 Tit", 40, 85, parent=f, text="Manajemen Pengguna & Hak Akses (RBAC)", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "M46 Sub", 40, 112, parent=f, text="Atur kredensial, peran operasional, dan izin akses data pelapor.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    for idx, (rtxt, ract) in enumerate([("Semua (1.420)", True), ("Warga (1.100)", False), ("Guru (250)", False), ("Verifikator (15)", False), ("SPPG (40)", False), ("Dinkes (10)", False), ("Korwil (5)", False)]):
        eng.draw_pill(f, f"M46 RP {idx}", 40 + idx * 115, 140, 105, 26, rtxt, is_active=ract)

    # User Table
    eng.create_node("rectangle", "M46 THead", 40, 180, 880, 28, parent=f, props={"fill": C_BG_MUTED})
    m46_headers = [("Nama Pengguna", 60), ("Email / Kontak", 220), ("Peran Sistem", 400), ("Institusi / Unit", 540), ("Status", 720), ("Aksi", 820)]
    for htit, hx in m46_headers:
        eng.create_node("text", f"M46 TH_{htit}", hx, 188, parent=f, text=htit, props={"fontSize": 10, "fill": C_DARK})

    users = [
        ("Ibu Rina Wulandari", "rina.w@gmail.com", "Warga", "Wali SDN Tembalang 10", "Aktif"),
        ("Pak Budi Santoso", "budi.s@smg.sch.id", "Guru", "SMPN Smg Tengah 1", "Aktif"),
        ("Mbak Siti Aminah", "siti.a@pantaugizi.id", "Verifikator", "Tim Audit Mutu A1", "Aktif"),
        ("Dapur Berkah Tembalang", "admin@dapurberkah.com", "SPPG", "SPPG Tembalang 01", "Aktif"),
        ("dr. Hendra Pratama", "hendra@dinkes.semarangkota.go.id", "Dinkes", "Dinkes Kota Semarang", "Aktif"),
        ("Bpk. Agus Hermawan", "agus.h@bgn.jateng.go.id", "Korwil", "BGN Jawa Tengah", "Aktif")
    ]
    for ridx, (unm, umail, urol, uinst, ustt) in enumerate(users):
        ry = 215 + ridx * 40
        eng.create_node("rectangle", f"M46 TRow {ridx}", 40, ry, 880, 36, parent=f, props={"fill": "#FFFFFF" if ridx % 2 == 0 else C_BG_SUBTLE})
        eng.create_node("text", f"M46 R1 {ridx}", 60, ry + 11, parent=f, text=unm, props={"fontSize": 10, "fill": C_DARK})
        eng.create_node("text", f"M46 R2 {ridx}", 220, ry + 11, parent=f, text=umail, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        eng.draw_pill(f, f"M46 R3 {ridx}", 390, ry + 7, 95, 22, urol, is_active=(urol in ["Verifikator", "Dinkes", "Korwil"]))
        eng.create_node("text", f"M46 R4 {ridx}", 540, ry + 11, parent=f, text=uinst, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        eng.create_node("text", f"M46 R5 {ridx}", 720, ry + 11, parent=f, text=ustt, props={"fontSize": 10, "fill": C_DARK})
        eng.draw_button(f, f"M46 R6 {ridx}", 815, ry + 6, 85, 24, "Kelola", variant="outline", corner=4)

    # Action bottom
    eng.draw_button(f, "M46 AddUser", 40, 480, 210, 36, "+ Tambah Pengguna Baru", variant="primary", corner=6)

    eng.draw_footer_real(f, 540)

    # -------------------------------------------------------------------------
    # 47. Konfigurasi Aturan Batas Waktu SLA (820px - 4 SLA cards!)
    # -------------------------------------------------------------------------
    f = eng.start_frame(7, 4, "47. Aturan Batas Waktu SLA", frame_height=820)
    eng.draw_navbar_panel(f, active_tab="Aturan SLA", role="Admin", user_code="AD", user_name="Administrator")

    eng.create_node("text", "S47 Tit", 40, 85, parent=f, text="Konfigurasi Aturan Batas Waktu SLA", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "S47 Sub", 40, 112, parent=f, text="Atur tenggat respon wajib, batas resolusi perbaikan, dan matriks eskalasi otomatis.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # 4 SLA Cards
    sla_configs = [
        ("Kategori Kritis (KLB / Basi / Beracun)", "Batas Respon Verifikasi: < 2 Jam", "Batas Resolusi Perbaikan: < 4 Jam", "Eskalasi: SPPG, Puskesmas, Dinkes Kota, Korwil MBG Jateng"),
        ("Kategori Tinggi (Porsi Berkurang Drastis)", "Batas Respon Verifikasi: < 4 Jam", "Batas Resolusi Perbaikan: < 12 Jam", "Eskalasi: SPPG Mitra, Pengawas Sekolah Wilayah"),
        ("Kategori Sedang (Keterlambatan 15-30m)", "Batas Respon Verifikasi: < 8 Jam", "Batas Resolusi Perbaikan: < 24 Jam", "Eskalasi: Dapur SPPG Mitra"),
        ("Kategori Ringan (Pertanyaan Rasa / Menu)", "Batas Respon Verifikasi: < 24 Jam", "Batas Resolusi Perbaikan: < 48 Jam", "Eskalasi: Evaluasi Rapat Mingguan Dapur")
    ]
    for idx, (ctit, crsp, cres, cesk) in enumerate(sla_configs):
        cy = 145 + idx * 95
        eng.create_node("rectangle", f"S47 Card {idx}", 40, cy, 880, 82, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
        eng.create_node("text", f"S47 CTit {idx}", 60, cy + 12, parent=f, text=ctit, props={"fontSize": 12, "fill": C_DARK})
        eng.create_node("text", f"S47 CRsp {idx}", 60, cy + 34, parent=f, text=f"{crsp}   |   {cres}", props={"fontSize": 10, "fill": C_DARK})
        eng.create_node("text", f"S47 CEsk {idx}", 60, cy + 54, parent=f, text=cesk, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        eng.draw_button(f, f"S47 CBtn {idx}", 770, cy + 24, 130, 30, "Ubah Parameter", variant="outline", corner=6)

    # Save button
    eng.draw_button(f, "S47 SaveBtn", 40, 540, 220, 38, "Simpan Konfigurasi SLA", variant="primary", corner=6)

    eng.draw_footer_real(f, 600)

    print(" -> Screens 25 to 47 successfully built!")

