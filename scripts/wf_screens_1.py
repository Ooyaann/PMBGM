"""
PMBGM WIREFRAME ENGINE - PART 1: SCREENS 01 TO 24
"""

from wf_helpers import (
    C_DARK, C_DARK_SUB, C_BORDER, C_BG_CARD, C_BG_MUTED, C_BG_SUBTLE,
    C_TEXT_MUTED, C_TEXT_LIGHT, C_CROSS
)

def build_screens_part1(eng):
    # =========================================================================
    # ROW 0: PUBLIK - BERANDA & LACAK INTI (01 - 06)
    # =========================================================================

    # -------------------------------------------------------------------------
    # 01. Beranda Utama (760px - 100% EXACT TO 01_publik_beranda.png)
    # Minimalist Google-style search portal, NO footer, NO fake cards!
    # -------------------------------------------------------------------------
    f = eng.start_frame(0, 0, "01. Beranda Utama", frame_height=760)
    
    # Navbar
    eng.create_node("rectangle", "Navbar Base", 0, 0, 960, 64, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1})
    eng.create_node("ellipse", "Nav Logo Cir", 36, 18, 28, 28, parent=f, props={"fill": C_BG_MUTED, "stroke": C_BORDER, "strokeWeight": 1})
    eng.create_node("text", "Nav Logo Txt", 44, 23, parent=f, text="P", props={"fontSize": 14, "fill": C_DARK})
    eng.create_node("text", "Nav Brand Name", 72, 20, parent=f, text="PMBGM", props={"fontSize": 15, "fill": C_DARK})
    eng.create_node("text", "Nav Brand Sub", 72, 36, parent=f, text="PEMANTAU MBG MASYARAKAT", props={"fontSize": 8, "fill": C_TEXT_MUTED, "letterSpacing": "10%"})

    nav_links = [("Beranda", True, False), ("Lacak", False, True), ("Data Terbuka", False, True), ("Insight", False, True), ("Panduan", False, True)]
    cur_x = 320
    for ltext, is_act, has_drop in nav_links:
        disp = f"{ltext} v" if has_drop else ltext
        w = len(disp) * 7.5 + 16
        if is_act:
            eng.create_node("rectangle", f"NavPill_{ltext}", cur_x - 8, 18, w, 28, parent=f, props={"fill": C_BG_MUTED, "cornerRadius": 14})
            eng.create_node("text", f"NavTxt_{ltext}", cur_x, 25, parent=f, text=disp, props={"fontSize": 12, "fill": C_DARK})
        else:
            eng.create_node("text", f"NavTxt_{ltext}", cur_x, 25, parent=f, text=disp, props={"fontSize": 12, "fill": C_TEXT_MUTED})
        cur_x += w + 14

    eng.draw_button(f, "Nav Lapor", 760, 16, 115, 32, "Lapor Masalah", variant="primary", corner=16)
    eng.draw_button(f, "Nav Masuk", 885, 16, 60, 32, "Masuk", variant="outline", corner=16)

    # Hero Center Content
    eng.create_node("text", "H1 Title", 360, 220, parent=f, text="PMBGM", props={"fontSize": 64, "fill": C_DARK, "letterSpacing": "2%"})
    eng.create_node("text", "H1 Sub", 375, 305, parent=f, text="P E M A N T A U   M B G   M A S Y A R A K A T", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    # Search Bar (Width 520, centered at x=220)
    eng.create_node("rectangle", "H1 Search Bar", 220, 345, 520, 48, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1.5, "cornerRadius": 24})
    eng.create_node("ellipse", "H1 Search Icon Cir", 240, 361, 14, 14, parent=f, props={"stroke": C_TEXT_MUTED, "strokeWeight": 1.5, "fill": "#FFFFFF"})
    eng.create_node("line", "H1 Search Icon Stem", 251, 372, 4, 4, parent=f, props={"stroke": C_TEXT_MUTED, "strokeWeight": 1.5})
    eng.create_node("text", "H1 Search Plh", 266, 361, parent=f, text="Cari sekolah, dapur SPPG, atau kode tiket...", props={"fontSize": 12, "fill": C_TEXT_LIGHT})

    # Two Action Buttons below Search Bar: y=415
    eng.draw_button(f, "H1 Btn Buat Lapor", 345, 415, 130, 36, "Buat Laporan", variant="primary", corner=18)
    eng.draw_button(f, "H1 Btn Lacak Tiket", 485, 415, 125, 36, "Lacak Tiket", variant="outline", corner=18)

    # Info Status Pill below buttons: y=475
    eng.create_node("rectangle", "H1 Status Pill", 340, 475, 280, 26, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 13})
    eng.create_node("ellipse", "H1 Status Dot", 354, 486, 5, 5, parent=f, props={"fill": C_DARK})
    eng.create_node("text", "H1 Status Txt 1", 365, 482, parent=f, text="165 Sekolah", props={"fontSize": 10, "fill": C_DARK})
    eng.create_node("text", "H1 Status Txt 2", 435, 482, parent=f, text="40 Dapur SPPG", props={"fontSize": 10, "fill": C_DARK})
    eng.create_node("text", "H1 Status Txt 3", 525, 482, parent=f, text="Darurat 119", props={"fontSize": 10, "fill": C_DARK})
    # NO FOOTER FOR SCREEN 01!

    # -------------------------------------------------------------------------
    # 02. Gate Akses Pelaporan (760px - 100% EXACT TO 02_publik_lapor_gate.png)
    # -------------------------------------------------------------------------
    f = eng.start_frame(0, 1, "02. Gate Akses Pelaporan", frame_height=760)
    eng.draw_navbar_public(f, active="Lapor Masalah", logged_in=False)

    # Header: "Lapor Masalah" and "[Panduan]" button
    eng.create_node("text", "G2 Header Tit", 40, 95, parent=f, text="Lapor Masalah", props={"fontSize": 24, "fill": C_DARK})
    eng.draw_button(f, "G2 Panduan Btn", 840, 92, 90, 32, "Panduan", variant="outline", corner=16)

    # Centered Card: width 400, height 300, centered at x=280, y=150
    eng.create_node("rectangle", "G2 Center Card", 280, 150, 400, 300, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})

    # Lock icon in circle
    eng.create_node("ellipse", "G2 Lock Cir", 456, 178, 48, 48, parent=f, props={"fill": C_BG_MUTED, "stroke": C_BORDER, "strokeWeight": 1})
    eng.create_node("rectangle", "G2 Lock Body", 472, 204, 16, 13, parent=f, props={"fill": C_DARK, "cornerRadius": 2})
    eng.create_node("rectangle", "G2 Lock Shackle", 475, 194, 10, 12, parent=f, props={"stroke": C_DARK, "strokeWeight": 1.5, "fill": "transparent"})

    eng.create_node("text", "G2 Card Tit", 405, 240, parent=f, text="Masuk untuk Melapor", props={"fontSize": 16, "fill": C_DARK})
    eng.create_node("text", "G2 Card Sub 1", 330, 268, parent=f, text="Identitas Anda tetap dapat disamarkan (Rahasia", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    eng.create_node("text", "G2 Card Sub 2", 435, 285, parent=f, text="atau Anonim).", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    eng.draw_button(f, "G2 Btn Masuk", 310, 320, 340, 40, "Masuk", variant="primary", corner=20)
    eng.draw_button(f, "G2 Btn Daftar", 310, 372, 340, 40, "Daftar Akun Baru", variant="outline", corner=20)

    # Real Footer at bottom (y=560)
    eng.draw_footer_real(f, 560)

    # -------------------------------------------------------------------------
    # 03. Panduan Pelaporan & Kalkulator SAW (820px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(0, 2, "03. Panduan & Kalkulator SAW", frame_height=820)
    eng.draw_navbar_public(f, active="Panduan", logged_in=False)

    eng.create_node("text", "G3 Tit", 40, 85, parent=f, text="Panduan Pelaporan & Kalkulator Risiko (SAW)", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "G3 Sub", 40, 112, parent=f, text="Pelajari kriteria pelaporan yang baik serta cara sistem kami menghitung bobot risiko aduan menggunakan Simple Additive Weighting.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # 6 Guide Cards (2x3)
    guides = [
        ("Kategori Masalah", "Kenali 4 kategori: Porsi kurang, Basi/Bau, Benda Asing, dan Keterlambatan distribusi."),
        ("Bukti Foto yang Valid", "Ambil foto pencahayaan jelas, perlihatkan label menu, dan sertakan objek pembanding."),
        ("SLA & Batas Waktu", "Respon kritis < 4 jam, investigasi sedang < 12 jam, tindak lanjut evaluasi < 24 jam."),
        ("Kerahasiaan Identitas", "Nama Anda tidak akan dipublikasikan ke pihak dapur demi melindungi privasi pelapor."),
        ("Peran Tim Verifikator", "Setiap aduan diperiksa silang secara objektif sebelum diteruskan ke dinas terkait."),
        ("Sanksi & Evaluasi SPPG", "Dapur penyedia dievaluasi mingguan berdasarkan poin penalti dan kepuasan sekolah.")
    ]
    for idx, (gtit, gdesc) in enumerate(guides):
        col_i = idx % 3
        row_i = idx // 3
        gx = 40 + col_i * 300
        gy = 145 + row_i * 85
        eng.create_node("rectangle", f"G3 Guide {idx}", gx, gy, 280, 75, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
        eng.create_node("ellipse", f"G3 GNumCir {idx}", gx + 15, gy + 15, 20, 20, parent=f, props={"fill": C_BG_MUTED, "stroke": C_BORDER, "strokeWeight": 1})
        eng.create_node("text", f"G3 GNum {idx}", gx + 22, gy + 19, parent=f, text=str(idx + 1), props={"fontSize": 10, "fill": C_DARK})
        eng.create_node("text", f"G3 GTit {idx}", gx + 45, gy + 17, parent=f, text=gtit, props={"fontSize": 11, "fill": C_DARK})
        eng.create_node("text", f"G3 GDesc {idx}", gx + 15, gy + 42, parent=f, text=gdesc, props={"fontSize": 9, "fill": C_TEXT_MUTED})

    # Interactive Simulator Box
    eng.create_node("rectangle", "G3 SimBox", 40, 335, 880, 270, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
    eng.create_node("text", "G3 SimTit", 60, 355, parent=f, text="Simulasi Kalkulator Bobot Risiko SAW", props={"fontSize": 14, "fill": C_DARK})
    eng.create_node("text", "G3 SimDesc", 60, 375, parent=f, text="Geser slider kriteria di bawah untuk melihat bagaimana algoritma menentukan tingkat urgensi investigasi.", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    # 5 Sliders
    sliders = [
        ("Tingkat Bahaya Pangan (C1: 30%)", 85),
        ("Jumlah Siswa Terdampak (C2: 25%)", 70),
        ("Riwayat Ketidakpatuhan SPPG (C3: 20%)", 60),
        ("Kecepatan Waktu Pelaporan (C4: 15%)", 90),
        ("Kelengkapan Bukti Foto (C5: 10%)", 80)
    ]
    for idx, (s_label, s_val) in enumerate(sliders):
        sy = 405 + idx * 36
        eng.create_node("text", f"G3 Slbl {idx}", 60, sy, parent=f, text=s_label, props={"fontSize": 10, "fill": C_DARK})
        eng.create_node("rectangle", f"G3 STrack {idx}", 320, sy + 3, 260, 6, parent=f, props={"fill": C_BORDER, "cornerRadius": 3})
        eng.create_node("rectangle", f"G3 SFill {idx}", 320, sy + 3, int(260 * s_val / 100), 6, parent=f, props={"fill": C_DARK, "cornerRadius": 3})
        eng.create_node("ellipse", f"G3 SThumb {idx}", 320 + int(260 * s_val / 100) - 5, sy - 1, 14, 14, parent=f, props={"fill": "#FFFFFF", "stroke": C_DARK, "strokeWeight": 2})
        eng.create_node("text", f"G3 SVal {idx}", 595, sy, parent=f, text=f"{s_val}%", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    # Result Card on Right
    eng.create_node("rectangle", "G3 ResCard", 645, 395, 250, 190, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
    eng.create_node("text", "G3 ResTit", 665, 415, parent=f, text="Skor Komposit Risiko", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    eng.create_node("ellipse", "G3 ScoreCir", 735, 440, 70, 70, parent=f, props={"fill": C_BG_MUTED, "stroke": C_DARK, "strokeWeight": 3})
    eng.create_node("text", "G3 ScoreVal", 750, 465, parent=f, text="84.5", props={"fontSize": 20, "fill": C_DARK})
    eng.draw_pill(f, "G3 LevelPill", 705, 520, 130, 24, "Level A - Kritis", is_active=True)
    eng.create_node("text", "G3 SlaEst", 685, 555, parent=f, text="Target SLA Investigasi: < 4 Jam", props={"fontSize": 10, "fill": C_DARK})

    eng.draw_footer_real(f, 630)

    # -------------------------------------------------------------------------
    # 04. Beranda Lacak Tiket (640px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(0, 3, "04. Beranda Lacak Aduan", frame_height=640)
    eng.draw_navbar_public(f, active="Lacak", logged_in=False)

    eng.create_node("text", "T4 Tit", 340, 110, parent=f, text="Lacak Status Aduan Anda", props={"fontSize": 24, "fill": C_DARK})
    eng.create_node("text", "T4 Sub", 270, 145, parent=f, text="Masukkan 8 digit kode tiket yang Anda dapatkan saat mengirimkan laporan MBG", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # Search Bar
    eng.create_node("rectangle", "T4 Input", 230, 180, 500, 48, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1.5, "cornerRadius": 24})
    eng.create_node("ellipse", "T4 SIcon", 252, 197, 14, 14, parent=f, props={"stroke": C_TEXT_MUTED, "strokeWeight": 1.5, "fill": "#FFFFFF"})
    eng.create_node("text", "T4 Plh", 278, 196, parent=f, text="Contoh: KS-NF6YNKK", props={"fontSize": 13, "fill": C_TEXT_LIGHT})
    eng.draw_button(f, "T4 SBtn", 615, 186, 105, 36, "Cari Tiket", variant="primary", corner=18)

    # Recent tickets
    eng.create_node("text", "T4 RecTit", 230, 255, parent=f, text="Pencarian Terkini / Contoh Kasus Publik:", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    recent_tickets = [
        ("KS-NF6YNKK", "Makanan Berbau Asam di SDN Candisari 01", "Sedang Ditindaklanjuti", "2 jam lalu"),
        ("KS-ULJ9X7Y", "Porsi Lauk Kurang di SMPN 2 Semarang", "Selesai", "Kemarin"),
        ("KS-BC44P12", "Keterlambatan Distribusi 45 Menit di SD Tembalang 10", "Verifikasi Lapangan", "1 hari lalu")
    ]
    for idx, (tcode, ttit, tstat, ttime) in enumerate(recent_tickets):
        ty = 280 + idx * 60
        eng.create_node("rectangle", f"T4 RCard {idx}", 230, ty, 500, 50, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
        eng.create_node("text", f"T4 RCod {idx}", 245, ty + 12, parent=f, text=tcode, props={"fontSize": 11, "fill": C_DARK})
        eng.create_node("text", f"T4 RTit {idx}", 245, ty + 28, parent=f, text=ttit, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        eng.draw_pill(f, f"T4 RStat {idx}", 540, ty + 14, 110, 22, tstat, is_active=(tstat == "Selesai"))
        eng.create_node("text", f"T4 RTm {idx}", 660, ty + 18, parent=f, text=ttime, props={"fontSize": 9, "fill": C_TEXT_LIGHT})

    # Alert info
    eng.create_node("rectangle", "T4 InfoBox", 230, 480, 500, 45, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
    eng.create_node("text", "T4 InfoTxt", 260, 495, parent=f, text="Setiap aduan ditindaklanjuti transparan sesuai SOP & jaminan SLA", props={"fontSize": 10, "fill": C_DARK})

    eng.draw_footer_real(f, 550)

    # -------------------------------------------------------------------------
    # 05. Lacak Tiket Aktif (780px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(0, 4, "05. Lacak Tiket Aktif", frame_height=780)
    eng.draw_navbar_public(f, active="Lacak", logged_in=False)

    # Breadcrumb & Status Header
    eng.create_node("text", "L5 Bc", 40, 80, parent=f, text="Lacak Aduan  /  Tiket  /  KS-NF6YNKK", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    eng.create_node("text", "L5 Tit", 40, 105, parent=f, text="Aduan Tiket #KS-NF6YNKK", props={"fontSize": 20, "fill": C_DARK})
    eng.draw_pill(f, "L5 StatPill", 360, 105, 140, 26, "Sedang Ditindaklanjuti", is_active=False)

    # Horizontal Stepper
    steps_5 = ["Laporan Diterima", "Verifikasi Awal", "Teruskan SPPG", "Investigasi & Solusi", "Selesai"]
    for idx, sname in enumerate(steps_5):
        sx = 40 + idx * 175
        is_done = idx < 3
        is_curr = idx == 3
        if idx > 0:
            eng.create_node("line", f"L5 SLine {idx}", sx - 65, 160, 60, 0, parent=f, props={"stroke": C_DARK if is_done else C_BORDER, "strokeWeight": 2})
        eng.create_node("ellipse", f"L5 SCir {idx}", sx, 148, 24, 24, parent=f, props={"fill": C_DARK if is_done else ("#FFFFFF" if is_curr else C_BG_MUTED), "stroke": C_DARK, "strokeWeight": 1.5})
        eng.create_node("text", f"L5 SNum {idx}", sx + 8, 153, parent=f, text="v" if is_done else str(idx + 1), props={"fontSize": 10, "fill": "#FFFFFF" if is_done else C_DARK})
        eng.create_node("text", f"L5 SLbl {idx}", sx - 15, 180, parent=f, text=sname, props={"fontSize": 9, "fill": C_DARK if (is_done or is_curr) else C_TEXT_MUTED})

    # Left Column: Report Details
    eng.create_node("rectangle", "L5 DetailBox", 40, 220, 560, 240, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
    eng.create_node("text", "L5 DTit", 60, 240, parent=f, text="Rincian Masalah yang Dilaporkan", props={"fontSize": 13, "fill": C_DARK})
    eng.create_node("text", "L5 DSch", 60, 265, parent=f, text="Sekolah: SDN Candisari 01  -  Kecamatan Candisari", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    eng.create_node("text", "L5 DKat", 60, 285, parent=f, text="Kategori: Makanan Basi / Berbau Asam  -  Menu: Sayur Sop & Ayam Suwir", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    eng.create_node("text", "L5 DDesc", 60, 315, parent=f, text="Sayur sop yang diterima siswa kelas 4 berbau kecut dan sedikit berlendir saat\nkotak makan dibuka pada jam makan siang (11:30 WIB). Guru piket telah meminta\nsiswa untuk tidak mengonsumsi sayur tersebut.", props={"fontSize": 11, "fill": C_DARK})
    # Photo thumbnail
    eng.draw_image_box(f, "L5 Photo1", 60, 370, 75, 75, corner=6)
    eng.draw_image_box(f, "L5 Photo2", 145, 370, 75, 75, corner=6)
    eng.create_node("text", "L5 Pcap", 230, 395, parent=f, text="2 Foto bukti kondisi makanan diunggah oleh pelapor", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    # Right Column: Metadata & SLA Countdown
    eng.create_node("rectangle", "L5 MetaBox", 620, 220, 300, 240, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
    eng.create_node("text", "L5 MTit", 640, 240, parent=f, text="Status Penanganan SLA", props={"fontSize": 13, "fill": C_DARK})
    eng.create_node("text", "L5 MCount", 640, 270, parent=f, text="Sisa Waktu SLA: 02:45:12", props={"fontSize": 15, "fill": C_DARK})
    eng.create_node("text", "L5 MTarget", 640, 295, parent=f, text="Batas Maksimal: Hari ini 16:00 WIB (Kategori Kritis)", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    eng.create_node("line", "L5 MDiv", 640, 320, 260, 0, parent=f, props={"stroke": C_BORDER, "strokeWeight": 1})
    eng.create_node("text", "L5 MSp", 640, 335, parent=f, text="SPPG Mitra: Dapur Candisari 01", props={"fontSize": 10, "fill": C_DARK})
    eng.create_node("text", "L5 MVer", 640, 355, parent=f, text="Verifikator: Mbak Siti (Tim A1)", props={"fontSize": 10, "fill": C_DARK})
    eng.create_node("text", "L5 MStat", 640, 375, parent=f, text="Tindakan Lapangan: Tim investigasi sedang menuju lokasi", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    eng.draw_button(f, "L5 BtnHub", 640, 405, 260, 32, "Hubungi Layanan Bantuan", variant="outline", corner=6)

    # Vertical History Timeline
    eng.create_node("text", "L5 HistTit", 40, 485, parent=f, text="Riwayat Log Aktivitas Tiket", props={"fontSize": 13, "fill": C_DARK})
    timeline_5 = [
        ("08:30 WIB", "Laporan Diterima Sistem", "Laporan terdaftar secara resmi oleh Ibu Rina via portal warga."),
        ("08:45 WIB", "Verifikasi & Penilaian SAW", "Diverifikasi oleh Verifikator Mbak Siti. Skor risiko: 78.5 (Kategori Kritis)."),
        ("09:10 WIB", "Diteruskan ke SPPG & Dinkes", "Perintah inspeksi sampel dikirimkan ke Dapur Candisari 01 dan Puskesmas."),
        ("10:15 WIB", "Investigasi Fisik Dimulai", "Petugas verifikator tiba di SDN Candisari 01 untuk mengamankan sampel.")
    ]
    for idx, (ttime, tstep, tdesc) in enumerate(timeline_5):
        ty = 515 + idx * 35
        eng.create_node("ellipse", f"L5 TPin {idx}", 45, ty + 4, 8, 8, parent=f, props={"fill": C_DARK})
        if idx < 3:
            eng.create_node("line", f"L5 TLine {idx}", 48, ty + 12, 0, 23, parent=f, props={"stroke": C_BORDER, "strokeWeight": 2})
        eng.create_node("text", f"L5 TTm {idx}", 65, ty + 2, parent=f, text=ttime, props={"fontSize": 10, "fill": C_DARK})
        eng.create_node("text", f"L5 TSt {idx}", 145, ty + 2, parent=f, text=tstep, props={"fontSize": 10, "fill": C_DARK})
        eng.create_node("text", f"L5 TDs {idx}", 320, ty + 2, parent=f, text=tdesc, props={"fontSize": 9, "fill": C_TEXT_MUTED})

    eng.draw_footer_real(f, 680)

    # -------------------------------------------------------------------------
    # 06. Lacak Kasus Detail Selesai (780px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(0, 5, "06. Lacak Kasus Detail Selesai", frame_height=780)
    eng.draw_navbar_public(f, active="Lacak", logged_in=False)

    eng.create_node("text", "C6 Bc", 40, 80, parent=f, text="Lacak Aduan  /  Arsip Kasus  /  KS-ULJ9X7Y", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    eng.create_node("text", "C6 Tit", 40, 105, parent=f, text="Masalah Distribusi di SD Candisari 2", props={"fontSize": 20, "fill": C_DARK})
    eng.draw_pill(f, "C6 StatPill", 460, 105, 90, 26, "Kasus Selesai", is_active=True)

    # Completed Stepper (All checked)
    for idx, sname in enumerate(steps_5):
        sx = 40 + idx * 175
        if idx > 0:
            eng.create_node("line", f"C6 SLine {idx}", sx - 65, 160, 60, 0, parent=f, props={"stroke": C_DARK, "strokeWeight": 2})
        eng.create_node("ellipse", f"C6 SCir {idx}", sx, 148, 24, 24, parent=f, props={"fill": C_DARK, "stroke": C_DARK, "strokeWeight": 1.5})
        eng.create_node("text", f"C6 SNum {idx}", sx + 8, 153, parent=f, text="v", props={"fontSize": 10, "fill": "#FFFFFF"})
        eng.create_node("text", f"C6 SLbl {idx}", sx - 15, 180, parent=f, text=sname, props={"fontSize": 9, "fill": C_DARK})

    # Left: Resolution Report
    eng.create_node("rectangle", "C6 ResBox", 40, 220, 560, 260, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
    eng.create_node("text", "C6 RTit", 60, 240, parent=f, text="Laporan Hasil Investigasi & Penyelesaian", props={"fontSize": 13, "fill": C_DARK})
    eng.create_node("text", "C6 RDesc", 60, 268, parent=f, text="Dapur SPPG Candisari 01 telah mengirimkan makanan pengganti (45 porsi) pada pukul\n12.15 WIB. Sampel makanan telah diuji oleh Sanitarian Puskesmas Candisari dan\nmemastikan tidak ada gejala keracunan pada siswa.", props={"fontSize": 11, "fill": C_DARK})
    eng.create_node("text", "C6 RAction", 60, 320, parent=f, text="Tindakan Korektif SPPG: Pembersihan total wadah ompreng, penyesuaian SOP pengemasan\nsayur bersantan, dan peneguran kepada juru masak shift pagi.", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    # Resolution photos
    eng.draw_image_box(f, "C6 RPhoto1", 60, 375, 80, 80, corner=6)
    eng.draw_image_box(f, "C6 RPhoto2", 150, 375, 80, 80, corner=6)
    eng.create_node("text", "C6 RPcap", 245, 410, parent=f, text="Foto bukti pengiriman makanan pengganti dan form berita acara serah terima.", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    # Right: Rating & Verification Card
    eng.create_node("rectangle", "C6 RightCard", 620, 220, 300, 260, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
    eng.create_node("text", "C6 RgtTit", 640, 240, parent=f, text="Verifikasi & Evaluasi Pelapor", props={"fontSize": 13, "fill": C_DARK})
    eng.create_node("text", "C6 StarLbl", 640, 270, parent=f, text="Tingkat Kepuasan Pelapor:", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    eng.create_node("text", "C6 Stars", 640, 290, parent=f, text="[ * ]  [ * ]  [ * ]  [ * ]  [ * ]   (5/5)", props={"fontSize": 14, "fill": C_DARK})
    eng.create_node("text", "C6 FeedTxt", 640, 320, parent=f, text="'Terima kasih respon sangat cepat, anak-anak tetap bisa makan siang dengan tenang.'", props={"fontSize": 9, "fill": C_TEXT_MUTED})
    eng.create_node("line", "C6 RgtDiv", 640, 360, 260, 0, parent=f, props={"stroke": C_BORDER, "strokeWeight": 1})
    eng.create_node("text", "C6 TotTime", 640, 380, parent=f, text="Total Waktu Penanganan: 3 Jam 15 Menit", props={"fontSize": 10, "fill": C_DARK})
    eng.create_node("text", "C6 SlaAch", 640, 400, parent=f, text="Kepatuhan SLA: Memenuhi Target (< 4 Jam)", props={"fontSize": 10, "fill": C_DARK})
    eng.draw_button(f, "C6 BtnUnduh", 640, 430, 260, 34, "Unduh Berita Acara (PDF)", variant="outline", corner=6)

    eng.draw_footer_real(f, 660)

    # =========================================================================
    # ROW 1: PUBLIK - DATA TERBUKA & DIREKTORI (07 - 12)
    # =========================================================================

    # -------------------------------------------------------------------------
    # 07. Papan Akuntabilitas Publik (840px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(1, 0, "07. Papan Akuntabilitas Publik", frame_height=840)
    eng.draw_navbar_public(f, active="Lacak", logged_in=False)

    eng.create_node("text", "A7 Tit", 40, 85, parent=f, text="Papan Akuntabilitas Publik", props={"fontSize": 22, "fill": C_DARK})
    eng.create_node("text", "A7 Sub", 40, 115, parent=f, text="Daftar laporan terbuka masyarakat untuk memantau kecepatan resolusi dan kepatuhan standar mutu MBG.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # 4 Stat Cards
    for idx, (stitle, snum, ssub) in enumerate([("698", "Total Aduan", "Tercatat"), ("90.5%", "Tepat Waktu", "Sesuai SLA"), ("46.8 jam", "Rata-rata Resolusi", "Waktu tuntas"), ("24", "Belum Ditanggapi", "Perlu atensi")]):
        ax = 40 + idx * 225
        eng.create_node("rectangle", f"A7 StBox {idx}", ax, 140, 210, 65, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
        eng.create_node("text", f"A7 StN {idx}", ax + 15, 155, parent=f, text=stitle, props={"fontSize": 18, "fill": C_DARK})
        eng.create_node("text", f"A7 StT {idx}", ax + 15, 180, parent=f, text=f"{snum} - {ssub}", props={"fontSize": 9, "fill": C_TEXT_MUTED})

    # Filter Bar
    eng.draw_pill(f, "A7 F1", 40, 220, 95, 26, "Semua Status v", is_active=True)
    eng.draw_pill(f, "A7 F2", 145, 220, 120, 26, "Semua Kecamatan v", is_active=False)
    eng.draw_pill(f, "A7 F3", 275, 220, 110, 26, "Semua Kategori v", is_active=False)
    eng.create_node("text", "A7 Sort", 760, 226, parent=f, text="Urutkan: Terbaru v", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # 3-column x 3-row Case Grid (9 cards)
    cases_9 = [
        ("KS-NF6YNKK", "SDN Candisari 01", "Makanan Berbau Asam", "Sedang Ditindaklanjuti", "2 jam lalu"),
        ("KS-ULJ9X7Y", "SMPN 2 Semarang", "Porsi Sayur Kurang", "Selesai", "5 jam lalu"),
        ("KS-BC44P12", "SD Tembalang 10", "Keterlambatan 45 Menit", "Dalam Investigasi", "1 hari lalu"),
        ("KS-AA90Z11", "SDN Pedurungan 02", "Benda Asing Rambut", "Selesai", "1 hari lalu"),
        ("KS-KK88M90", "SMPN 12 Semarang", "Ompreng Tidak Bersih", "Diteruskan ke SPPG", "2 hari lalu"),
        ("KS-JJ12Q45", "SDN Banyumanik 03", "Lauk Ayam Kurang Matang", "Selesai", "2 hari lalu"),
        ("KS-MM67W23", "SMA Negeri 3 Smg", "Keterlambatan 30 Menit", "Selesai", "3 hari lalu"),
        ("KS-PP34K89", "SDN Ngaliyan 01", "Buah Pisang Terlalu Mentah", "Selesai", "3 hari lalu"),
        ("KS-RR89T67", "SMPN 9 Semarang", "Porsi Nasi Tidak Rata", "Selesai", "4 hari lalu")
    ]
    for idx, (ccode, csch, cprob, cstat, ctime) in enumerate(cases_9):
        col_i = idx % 3
        row_i = idx // 3
        cx = 40 + col_i * 300
        cy = 260 + row_i * 105
        eng.create_node("rectangle", f"A7 Card {idx}", cx, cy, 280, 95, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
        eng.create_node("text", f"A7 CCode {idx}", cx + 15, cy + 14, parent=f, text=ccode, props={"fontSize": 11, "fill": C_DARK})
        eng.create_node("text", f"A7 CTime {idx}", cx + 200, cy + 14, parent=f, text=ctime, props={"fontSize": 9, "fill": C_TEXT_LIGHT})
        eng.create_node("text", f"A7 CSch {idx}", cx + 15, cy + 32, parent=f, text=csch, props={"fontSize": 12, "fill": C_DARK})
        eng.create_node("text", f"A7 CPrb {idx}", cx + 15, cy + 50, parent=f, text=cprob, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        eng.draw_pill(f, f"A7 CSt {idx}", cx + 15, cy + 68, 120, 18, cstat, is_active=(cstat == "Selesai"))

    # Pagination
    eng.create_node("text", "A7 Paging", 410, 600, parent=f, text="< Sebelumnya    1   2   3   ...   78    Selanjutnya >", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    eng.draw_footer_real(f, 650)

    # -------------------------------------------------------------------------
    # 08. Cari Sekolah & SPPG (740px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(1, 1, "08. Cari Sekolah & SPPG", frame_height=740)
    eng.draw_navbar_public(f, active="Data Terbuka", logged_in=False)

    eng.create_node("text", "S8 Tit", 40, 85, parent=f, text="Direktori Sekolah & Dapur SPPG Mitra", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "S8 Sub", 40, 112, parent=f, text="Cari profil sekolah penerima MBG, alokasi siswa, dan dapur SPPG penanggung jawab distribusi.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # Search + Filter pills
    eng.create_node("rectangle", "S8 SBox", 40, 140, 520, 38, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 19})
    eng.create_node("text", "S8 SPlh", 65, 152, parent=f, text="Ketik nama sekolah, npsn, atau kecamatan...", props={"fontSize": 11, "fill": C_TEXT_LIGHT})
    for idx, ptxt in enumerate(["Semua Jenjang", "SD/MI (245)", "SMP/MTs (112)", "SMA/SMK (55)", "Dapur SPPG (12)"]):
        eng.draw_pill(f, f"S8 FPill {idx}", 40 + idx * 105, 190, 95, 24, ptxt, is_active=(idx == 0))

    # Left: School list
    schools = [
        ("SD Negeri Candisari 01", "Jl. Dr. Wahidin No. 45, Candisari", "345 Siswa", "Dapur Candisari 01", "Kinerja: 94%"),
        ("SMP Negeri 02 Semarang", "Jl. Brigjen Katamso No. 14, Smg Timur", "780 Siswa", "Dapur Genuk 01", "Kinerja: 91%"),
        ("SD Negeri Tembalang 10", "Jl. Prof. Soedarto No. 8, Tembalang", "420 Siswa", "Dapur Tembalang 01", "Kinerja: 96%"),
        ("SD Negeri Pedurungan 02", "Jl. Majapahit No. 120, Pedurungan", "510 Siswa", "Dapur Pedurungan 02", "Kinerja: 88%"),
        ("SMP Negeri 12 Semarang", "Jl. Raya Gunungpati No. 3, Gn.Pati", "650 Siswa", "Dapur Banyumanik 01", "Kinerja: 92%")
    ]
    for idx, (sname, saddr, scnt, ssppg, sscore) in enumerate(schools):
        sy = 230 + idx * 75
        eng.create_node("rectangle", f"S8 SCard {idx}", 40, sy, 520, 65, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
        eng.create_node("text", f"S8 SNm {idx}", 55, sy + 12, parent=f, text=sname, props={"fontSize": 12, "fill": C_DARK})
        eng.create_node("text", f"S8 SAd {idx}", 55, sy + 30, parent=f, text=saddr, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        eng.create_node("text", f"S8 SCn {idx}", 55, sy + 46, parent=f, text=f"Penerima: {scnt}   |   Mitra: {ssppg}", props={"fontSize": 9, "fill": C_TEXT_MUTED})
        eng.draw_pill(f, f"S8 SSc {idx}", 430, sy + 20, 110, 24, sscore, is_active=True)

    # Right: Map / Info Preview
    eng.draw_image_box(f, "S8 MapPreview", 580, 140, 340, 440, corner=12)
    eng.create_node("text", "S8 MapTit", 600, 160, parent=f, text="Pemetaan Wilayah MBG", props={"fontSize": 13, "fill": C_DARK})
    eng.create_node("text", "S8 MapDesc", 600, 185, parent=f, text="Peta interaktif sebaran 412 sekolah dan 12 dapur SPPG di Kota Semarang.", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    eng.draw_footer_real(f, 600)

    # -------------------------------------------------------------------------
    # 09. Data Terbuka Provinsi Jateng (880px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(1, 2, "09. Data Terbuka Jawa Tengah", frame_height=880)
    eng.draw_navbar_public(f, active="Data Terbuka", logged_in=False)

    eng.create_node("text", "D9 Tit", 40, 85, parent=f, text="Transparansi MBG Provinsi Jawa Tengah", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "D9 Sub", 40, 112, parent=f, text="Data agregat realisasi anggaran, cakupan penerima manfaat, dan dapur penyedia di 35 Kabupaten/Kota.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # 4 Stat Cards
    jateng_stats = [
        ("Rp29,8 T", "Alokasi Anggaran", "APBN Jateng 2025/2026"),
        ("Rp16,5 T", "Realisasi Penyerapan", "55,4% target terserap"),
        ("7.474.698", "Siswa Terdaftar", "Penerima manfaat aktif"),
        ("3.484", "Dapur SPPG Aktif", "Tersebar di 35 Kab/Kota")
    ]
    for idx, (jval, jlbl, jsub) in enumerate(jateng_stats):
        jx = 40 + idx * 225
        eng.create_node("rectangle", f"D9 StatBox {idx}", jx, 140, 210, 75, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
        eng.create_node("text", f"D9 StV {idx}", jx + 15, 155, parent=f, text=jval, props={"fontSize": 18, "fill": C_DARK})
        eng.create_node("text", f"D9 StL {idx}", jx + 15, 178, parent=f, text=jlbl, props={"fontSize": 11, "fill": C_DARK})
        eng.create_node("text", f"D9 StS {idx}", jx + 15, 194, parent=f, text=jsub, props={"fontSize": 9, "fill": C_TEXT_MUTED})

    # 2 Charts Side by Side
    eng.create_node("rectangle", "D9 CBox1", 40, 230, 430, 180, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
    eng.create_node("text", "D9 CTit1", 60, 248, parent=f, text="Tren Realisasi Penyerapan Bulanan (Triliun Rp)", props={"fontSize": 12, "fill": C_DARK})
    # Simulated bar chart
    for bidx, bval in enumerate([1.2, 1.8, 2.4, 2.9, 3.5, 4.7]):
        bx = 70 + bidx * 60
        bh = int(bval * 20)
        by = 380 - bh
        eng.create_node("rectangle", f"D9 Bar1 {bidx}", bx, by, 35, bh, parent=f, props={"fill": C_DARK, "cornerRadius": 3})
        eng.create_node("text", f"D9 BarLbl1 {bidx}", bx + 6, 390, parent=f, text=f"Bln {bidx+1}", props={"fontSize": 9, "fill": C_TEXT_MUTED})

    eng.create_node("rectangle", "D9 CBox2", 490, 230, 430, 180, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
    eng.create_node("text", "D9 CTit2", 510, 248, parent=f, text="Distribusi Masalah Berdasarkan Kategori", props={"fontSize": 12, "fill": C_DARK})
    categories_bar = [("Porsi Kurang", 38), ("Keterlambatan", 28), ("Basi / Bau", 20), ("Benda Asing", 14)]
    for cidx, (clbl, cpct) in enumerate(categories_bar):
        cy = 280 + cidx * 30
        eng.create_node("text", f"D9 CatLbl {cidx}", 510, cy, parent=f, text=clbl, props={"fontSize": 10, "fill": C_DARK})
        eng.create_node("rectangle", f"D9 CatBg {cidx}", 620, cy + 3, 220, 8, parent=f, props={"fill": C_BG_MUTED, "cornerRadius": 4})
        eng.create_node("rectangle", f"D9 CatFill {cidx}", 620, cy + 3, int(220 * cpct / 100), 8, parent=f, props={"fill": C_DARK, "cornerRadius": 4})
        eng.create_node("text", f"D9 CatPct {cidx}", 855, cy, parent=f, text=f"{cpct}%", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    # 10 Kab/Kota Table
    eng.create_node("text", "D9 TabTit", 40, 430, parent=f, text="10 Kabupaten / Kota dengan Alokasi Terbesar di Jawa Tengah", props={"fontSize": 13, "fill": C_DARK})
    eng.create_node("rectangle", "D9 THead", 40, 455, 880, 28, parent=f, props={"fill": C_BG_MUTED})
    headers = [("Wilayah", 60), ("Jumlah Siswa", 260), ("Dapur SPPG", 420), ("Alokasi Dana", 560), ("Realisasi", 700), ("Kinerja", 820)]
    for htit, hx in headers:
        eng.create_node("text", f"D9 TH_{htit}", hx, 463, parent=f, text=htit, props={"fontSize": 10, "fill": C_DARK})

    sample_kabkota = [
        ("Kota Semarang", "340.073", "12 SPPG", "Rp1.42 T", "66,3%", "Baik"),
        ("Kab. Brebes", "394.642", "24 SPPG", "Rp1.68 T", "72.0%", "Sangat Baik"),
        ("Kab. Cilacap", "376.592", "22 SPPG", "Rp1.55 T", "74.0%", "Sangat Baik"),
        ("Kab. Banyumas", "372.445", "21 SPPG", "Rp1.52 T", "66.9%", "Baik"),
        ("Kab. Demak", "239.216", "15 SPPG", "Rp0.98 T", "62.2%", "Cukup"),
        ("Kab. Boyolali", "226.986", "14 SPPG", "Rp0.94 T", "68.3%", "Baik")
    ]
    for ridx, (wly, ssw, spg, dana, rls, knjr) in enumerate(sample_kabkota):
        ry = 490 + ridx * 32
        eng.create_node("rectangle", f"D9 TRow {ridx}", 40, ry, 880, 30, parent=f, props={"fill": "#FFFFFF" if ridx % 2 == 0 else C_BG_SUBTLE})
        eng.create_node("text", f"D9 TR1 {ridx}", 60, ry + 8, parent=f, text=wly, props={"fontSize": 10, "fill": C_DARK})
        eng.create_node("text", f"D9 TR2 {ridx}", 260, ry + 8, parent=f, text=ssw, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        eng.create_node("text", f"D9 TR3 {ridx}", 420, ry + 8, parent=f, text=spg, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        eng.create_node("text", f"D9 TR4 {ridx}", 560, ry + 8, parent=f, text=dana, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        eng.create_node("text", f"D9 TR5 {ridx}", 700, ry + 8, parent=f, text=rls, props={"fontSize": 10, "fill": C_DARK})
        eng.draw_pill(f, f"D9 TR6 {ridx}", 815, ry + 5, 80, 20, knjr, is_active=(knjr == "Sangat Baik"))

    eng.draw_footer_real(f, 700)

    # -------------------------------------------------------------------------
    # 10. Direktori SPPG Jawa Tengah (860px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(1, 3, "10. Direktori SPPG Jawa Tengah", frame_height=860)
    eng.draw_navbar_public(f, active="Data Terbuka", logged_in=False)

    eng.create_node("text", "P10 Tit", 40, 85, parent=f, text="Direktori Satuan Pelayanan Pangan Gizi (SPPG)", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "P10 Sub", 40, 112, parent=f, text="Profil lengkap dapur penyedia, kapasitas harian, sertifikasi higienis SLHS, dan rekam jejak kepatuhan.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    for idx, ftxt in enumerate(["Semua Kab/Kota", "Kota Semarang (12)", "Kota Surakarta (6)", "Kab. Banyumas (21)", "Kab. Brebes (24)"]):
        eng.draw_pill(f, f"P10 FP {idx}", 40 + idx * 135, 140, 125, 26, ftxt, is_active=(idx == 1))

    # 3-column x 4-row grid of SPPG cards
    sppg_12 = [
        ("SPPG Semarang Utara 02", "Kec. Semarang Utara", "4.200 porsi/hari", "8 Sekolah", "SLHS Terverifikasi", "88.4 / 100"),
        ("SPPG Genuk 01", "Kec. Genuk", "3.800 porsi/hari", "7 Sekolah", "SLHS Terverifikasi", "84.1 / 100"),
        ("SPPG Pedurungan 02", "Kec. Pedurungan", "4.500 porsi/hari", "9 Sekolah", "SLHS Terverifikasi", "91.5 / 100"),
        ("SPPG Banyumanik 01", "Kec. Banyumanik", "3.600 porsi/hari", "6 Sekolah", "SLHS Terverifikasi", "95.0 / 100"),
        ("SPPG Tembalang 01", "Kec. Tembalang", "4.100 porsi/hari", "8 Sekolah", "SLHS Terverifikasi", "92.3 / 100"),
        ("SPPG Candisari 01", "Kec. Candisari", "3.200 porsi/hari", "6 Sekolah", "SLHS Terverifikasi", "89.0 / 100"),
        ("SPPG Mijen 01", "Kec. Mijen", "2.900 porsi/hari", "5 Sekolah", "SLHS Terverifikasi", "96.4 / 100"),
        ("SPPG Ngaliyan 01", "Kec. Ngaliyan", "4.000 porsi/hari", "7 Sekolah", "SLHS Terverifikasi", "90.2 / 100"),
        ("SPPG Gajahmungkur 01", "Kec. Gajahmungkur", "2.500 porsi/hari", "4 Sekolah", "SLHS Terverifikasi", "93.8 / 100"),
        ("SPPG Semarang Tengah 01", "Kec. Semarang Tengah", "3.400 porsi/hari", "6 Sekolah", "SLHS Terverifikasi", "87.6 / 100"),
        ("SPPG Semarang Barat 01", "Kec. Semarang Barat", "3.900 porsi/hari", "7 Sekolah", "SLHS Terverifikasi", "89.4 / 100"),
        ("SPPG Tugu 01", "Kec. Tugu", "2.200 porsi/hari", "4 Sekolah", "SLHS Terverifikasi", "94.1 / 100")
    ]
    for idx, (sname, sloc, scap, ssch, sslhs, sscore) in enumerate(sppg_12):
        col_i = idx % 3
        row_i = idx // 3
        sx = 40 + col_i * 300
        sy = 180 + row_i * 115
        eng.create_node("rectangle", f"P10 Card {idx}", sx, sy, 280, 105, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
        eng.create_node("text", f"P10 SNm {idx}", sx + 15, sy + 14, parent=f, text=sname, props={"fontSize": 12, "fill": C_DARK})
        eng.create_node("text", f"P10 SLoc {idx}", sx + 15, sy + 32, parent=f, text=f"{sloc}  -  {scap}", props={"fontSize": 9, "fill": C_TEXT_MUTED})
        eng.create_node("text", f"P10 SSch {idx}", sx + 15, sy + 50, parent=f, text=f"Mitra: {ssch}", props={"fontSize": 9, "fill": C_TEXT_MUTED})
        eng.draw_pill(f, f"P10 SLHS {idx}", sx + 15, sy + 72, 115, 20, sslhs, is_active=True)
        eng.create_node("text", f"P10 SSc {idx}", sx + 200, sy + 76, parent=f, text=sscore, props={"fontSize": 10, "fill": C_DARK})

    eng.draw_footer_real(f, 660)

    # -------------------------------------------------------------------------
    # 11. Detail Profil SPPG (860px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(1, 4, "11. Detail Profil SPPG", frame_height=860)
    eng.draw_navbar_public(f, active="Data Terbuka", logged_in=False)

    eng.create_node("text", "D11 Bc", 40, 80, parent=f, text="Data Terbuka  /  SPPG  /  SPPG Semarang Utara 02", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    eng.create_node("text", "D11 Tit", 40, 105, parent=f, text="SPPG Semarang Utara 02", props={"fontSize": 22, "fill": C_DARK})
    eng.draw_pill(f, "D11 Pill", 380, 107, 160, 24, "SLHS Dinkes Terverifikasi", is_active=True)
    eng.create_node("text", "D11 Sub", 40, 135, parent=f, text="Jl. Kolonel Sugiono No. 22, Semarang Utara  |  Kapasitas Produksi: 4.200 porsi/hari  |  Penanggung Jawab: Ibu Hj. Mahmudah", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    # 3 Stat Cards
    for idx, (sval, slbl, ssub) in enumerate([("8 Sekolah", "Cakupan Layanan", "3.420 Siswa"), ("94.2%", "Indeks Higiene SLHS", "Grade A Kemenkes"), ("0 Kasus", "Insiden KLB Medis", "Tahun 2025/2026")]):
        dx = 40 + idx * 300
        eng.create_node("rectangle", f"D11 SBox {idx}", dx, 165, 280, 65, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
        eng.create_node("text", f"D11 SV {idx}", dx + 15, 180, parent=f, text=sval, props={"fontSize": 16, "fill": C_DARK})
        eng.create_node("text", f"D11 SL {idx}", dx + 15, 203, parent=f, text=f"{slbl} ({ssub})", props={"fontSize": 9, "fill": C_TEXT_MUTED})

    # Trend Chart Box
    eng.create_node("rectangle", "D11 CBox", 40, 245, 540, 190, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
    eng.create_node("text", "D11 CTit", 60, 265, parent=f, text="Tren Kepatuhan Menu & Mutu Makanan (6 Bulan Terakhir)", props={"fontSize": 12, "fill": C_DARK})
    for bidx, bscore in enumerate([91, 93, 89, 94, 95, 94]):
        bx = 75 + bidx * 75
        bh = int(bscore * 1.1)
        by = 400 - bh
        eng.create_node("rectangle", f"D11 Bar {bidx}", bx, by, 45, bh, parent=f, props={"fill": C_DARK, "cornerRadius": 3})
        eng.create_node("text", f"D11 BarLbl {bidx}", bx + 8, 410, parent=f, text=f"Bln {bidx+1}", props={"fontSize": 9, "fill": C_TEXT_MUTED})
        eng.create_node("text", f"D11 BarVal {bidx}", bx + 10, by - 14, parent=f, text=f"{bscore}%", props={"fontSize": 8, "fill": C_TEXT_MUTED})

    # Right: List of 7 Schools Served
    eng.create_node("rectangle", "D11 SchBox", 600, 245, 320, 190, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
    eng.create_node("text", "D11 SchTit", 620, 265, parent=f, text="Daftar 8 Sekolah Mitra yang Dilayani", props={"fontSize": 12, "fill": C_DARK})
    schools_served = ["SDN Bandarharjo 01 (450 siswa)", "SDN Bandarharjo 02 (380 siswa)", "SDN Tanjung Mas 01 (410 siswa)", "SMPN 12 Semarang (650 siswa)", "SMPN 25 Semarang (520 siswa)", "SDN Dadapsari 01 (320 siswa)"]
    for sidx, sname in enumerate(schools_served):
        eng.create_node("text", f"D11 SchItem {sidx}", 620, 295 + sidx * 20, parent=f, text=f"- {sname}", props={"fontSize": 9, "fill": C_TEXT_MUTED})

    # Recent Complaints
    eng.create_node("text", "D11 CmpTit", 40, 455, parent=f, text="Riwayat Laporan Masuk Terkait Dapur Ini", props={"fontSize": 13, "fill": C_DARK})
    cmps = [
        ("KS-ZZ88X99", "Sayur sop sedikit terlalu asin", "SDN Tanjung Mas 01", "Selesai ditanggapi", "1 minggu lalu"),
        ("KS-WW44M11", "Keterlambatan armada 15 menit karena hujan lebat", "SMPN 12 Semarang", "Selesai dikompensasi", "2 minggu lalu")
    ]
    for cidx, (ccode, cdesc, csch, cstat, ctime) in enumerate(cmps):
        cy = 480 + cidx * 45
        eng.create_node("rectangle", f"D11 CmpRow {cidx}", 40, cy, 880, 38, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 6})
        eng.create_node("text", f"D11 C1 {cidx}", 55, cy + 12, parent=f, text=ccode, props={"fontSize": 10, "fill": C_DARK})
        eng.create_node("text", f"D11 C2 {cidx}", 160, cy + 12, parent=f, text=cdesc, props={"fontSize": 10, "fill": C_DARK})
        eng.create_node("text", f"D11 C3 {cidx}", 480, cy + 12, parent=f, text=csch, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        eng.draw_pill(f, f"D11 C4 {cidx}", 680, cy + 8, 110, 20, cstat, is_active=True)
        eng.create_node("text", f"D11 C5 {cidx}", 810, cy + 12, parent=f, text=ctime, props={"fontSize": 9, "fill": C_TEXT_LIGHT})

    eng.draw_footer_real(f, 600)

    # -------------------------------------------------------------------------
    # 12. Direktori Wilayah Jawa Tengah (860px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(1, 5, "12. Peta Spasial Jawa Tengah", frame_height=860)
    eng.draw_navbar_public(f, active="Data Terbuka", logged_in=False)

    for pidx, (pname, pact) in enumerate([("Ringkasan", False), ("Wilayah", True), ("SPPG", False), ("Kasus", False), ("Unduh & API", False)]):
        eng.draw_pill(f, f"W12P_{pidx}", 40 + pidx * 90, 85, 80, 26, pname, is_active=pact)

    eng.create_node("text", "W12 Tit", 40, 130, parent=f, text="Wilayah", props={"fontSize": 24, "fill": C_DARK})
    eng.create_node("text", "W12 Sub", 150, 135, parent=f, text="Jawa Tengah", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    eng.draw_pill(f, "W12 Sim", 250, 133, 70, 20, "Simulasi", is_active=False)

    eng.create_node("text", "W12 Sec 1", 40, 175, parent=f, text="Kota (6)", props={"fontSize": 13, "fill": C_DARK})
    kota_list = [
        ("Magelang", "24.065 penerima", "72,7%"),
        ("Pekalongan", "62.346 penerima", "72,4%"),
        ("Salatiga", "40.674 penerima", "62,9%"),
        ("Semarang", "340.073 penerima", "66,3%"),
        ("Surakarta", "105.153 penerima", "75,8%"),
        ("Tegal", "57.822 penerima", "60%")
    ]
    for idx, (kname, krec, kpct) in enumerate(kota_list):
        col_i = idx % 4
        row_i = idx // 4
        kx = 40 + col_i * 225
        ky = 200 + row_i * 75
        eng.create_node("rectangle", f"KotaCard {idx}", kx, ky, 210, 65, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
        eng.create_node("text", f"KotaTit {idx}", kx + 15, ky + 12, parent=f, text=kname, props={"fontSize": 12, "fill": C_DARK})
        eng.create_node("text", f"KotaRec {idx}", kx + 15, ky + 30, parent=f, text=krec, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        eng.create_node("rectangle", f"KotaBarBg {idx}", kx + 15, ky + 46, 130, 4, parent=f, props={"fill": C_BG_MUTED, "cornerRadius": 2})
        eng.create_node("rectangle", f"KotaBarFill {idx}", kx + 15, ky + 46, 90, 4, parent=f, props={"fill": C_DARK, "cornerRadius": 2})
        eng.create_node("text", f"KotaPct {idx}", kx + 160, ky + 42, parent=f, text=kpct, props={"fontSize": 9, "fill": C_TEXT_MUTED})

    eng.create_node("text", "W12 Sec 2", 40, 370, parent=f, text="Kabupaten (29)", props={"fontSize": 13, "fill": C_DARK})
    kab_list = [
        ("Banjarnegara", "201.506", "62,2%"),
        ("Banyumas", "372.445", "66,9%"),
        ("Batang", "175.021", "64%"),
        ("Blora", "167.873", "72,9%"),
        ("Boyolali", "226.986", "68,3%"),
        ("Brebes", "394.642", "72%"),
        ("Cilacap", "376.592", "74%"),
        ("Demak", "239.216", "62,2%")
    ]
    for idx, (kname, krec, kpct) in enumerate(kab_list):
        col_i = idx % 4
        row_i = idx // 4
        kx = 40 + col_i * 225
        ky = 395 + row_i * 75
        eng.create_node("rectangle", f"KabCard {idx}", kx, ky, 210, 65, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
        eng.create_node("text", f"KabTit {idx}", kx + 15, ky + 12, parent=f, text=kname, props={"fontSize": 12, "fill": C_DARK})
        eng.create_node("text", f"KabRec {idx}", kx + 15, ky + 30, parent=f, text=f"{krec} penerima", props={"fontSize": 9, "fill": C_TEXT_MUTED})
        eng.create_node("rectangle", f"KabBarBg {idx}", kx + 15, ky + 46, 130, 4, parent=f, props={"fill": C_BG_MUTED, "cornerRadius": 2})
        eng.create_node("rectangle", f"KabBarFill {idx}", kx + 15, ky + 46, 90, 4, parent=f, props={"fill": C_DARK, "cornerRadius": 2})
        eng.create_node("text", f"KabPct {idx}", kx + 160, ky + 42, parent=f, text=kpct, props={"fontSize": 9, "fill": C_TEXT_MUTED})

    eng.draw_footer_real(f, 600)

    # =========================================================================
    # ROW 2: PUBLIK - INSIGHT, WILAYAH & DATA LANJUTAN (13 - 18)
    # =========================================================================

    # -------------------------------------------------------------------------
    # 13. Detail Wilayah Kota Semarang (880px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(2, 0, "13. Detail Spasial Semarang", frame_height=880)
    eng.draw_navbar_public(f, active="Data Terbuka", logged_in=False)

    eng.create_node("text", "W13 Bc", 40, 80, parent=f, text="Data Terbuka  /  Wilayah  /  Kota Semarang", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    eng.create_node("text", "W13 Tit", 40, 105, parent=f, text="Statistik MBG Kota Semarang", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "W13 Sub", 40, 130, parent=f, text="Rincian 16 Kecamatan, 412 Sekolah, dan 12 Satuan Pelayanan Pangan Gizi (SPPG).", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # 4 Stat Cards
    for idx, (sval, slbl) in enumerate([("340.073", "Siswa Penerima"), ("12 Dapur", "SPPG Beroperasi"), ("412 Unit", "Sekolah Terlayani"), ("91.2%", "Ketepatan Waktu")]):
        wx = 40 + idx * 225
        eng.create_node("rectangle", f"W13 SBox {idx}", wx, 155, 210, 65, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
        eng.create_node("text", f"W13 SV {idx}", wx + 15, 170, parent=f, text=sval, props={"fontSize": 17, "fill": C_DARK})
        eng.create_node("text", f"W13 SL {idx}", wx + 15, 193, parent=f, text=slbl, props={"fontSize": 10, "fill": C_TEXT_MUTED})

    # 16 Kecamatan Cards Grid (4x4)
    kec_list = [
        ("Banyumanik", "28.450 siswa", "1 SPPG", "94%"),
        ("Candisari", "19.320 siswa", "1 SPPG", "89%"),
        ("Gajahmungkur", "14.210 siswa", "1 SPPG", "93%"),
        ("Gayamsari", "16.890 siswa", "Mitra Smg Tmr", "90%"),
        ("Genuk", "32.140 siswa", "1 SPPG", "84%"),
        ("Gunungpati", "25.600 siswa", "Mitra Bnymnk", "92%"),
        ("Mijen", "18.400 siswa", "1 SPPG", "96%"),
        ("Ngaliyan", "35.200 siswa", "1 SPPG", "90%"),
        ("Pedurungan", "41.500 siswa", "1 SPPG", "91%"),
        ("Semarang Barat", "38.900 siswa", "1 SPPG", "89%"),
        ("Semarang Selatan", "17.400 siswa", "Mitra Cndsri", "92%"),
        ("Semarang Tengah", "15.300 siswa", "1 SPPG", "87%"),
        ("Semarang Timur", "22.800 siswa", "Mitra Genuk", "91%"),
        ("Semarang Utara", "26.100 siswa", "1 SPPG", "88%"),
        ("Tembalang", "39.400 siswa", "1 SPPG", "92%"),
        ("Tugu", "11.200 siswa", "1 SPPG", "94%")
    ]
    eng.create_node("text", "W13 KecTit", 40, 235, parent=f, text="Sebaran 16 Kecamatan di Kota Semarang", props={"fontSize": 13, "fill": C_DARK})
    for idx, (kname, kssw, kspg, kscore) in enumerate(kec_list):
        col_i = idx % 4
        row_i = idx // 4
        kx = 40 + col_i * 225
        ky = 260 + row_i * 75
        eng.create_node("rectangle", f"W13 KCard {idx}", kx, ky, 210, 65, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
        eng.create_node("text", f"W13 KNm {idx}", kx + 12, ky + 12, parent=f, text=kname, props={"fontSize": 11, "fill": C_DARK})
        eng.create_node("text", f"W13 KSw {idx}", kx + 12, ky + 28, parent=f, text=f"{kssw}  |  {kspg}", props={"fontSize": 9, "fill": C_TEXT_MUTED})
        eng.draw_pill(f, f"W13 KSc {idx}", kx + 135, ky + 10, 65, 20, kscore, is_active=True)

    eng.draw_footer_real(f, 600)

    # -------------------------------------------------------------------------
    # 14. Rekapitulasi Kasus Keamanan Pangan (860px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(2, 1, "14. Rekapitulasi Kasus", frame_height=860)
    eng.draw_navbar_public(f, active="Data Terbuka", logged_in=False)

    eng.create_node("text", "K14 Tit", 40, 85, parent=f, text="Rekapitulasi Kasus & Investigasi Mutu", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "K14 Sub", 40, 112, parent=f, text="Laporan berkala insiden kualitas pangan, waktu respon SLA, dan audit korektif dinas terkait.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # 4 Analytics Cards
    analytics_cards = [
        ("Jateng Overview", "35 Wilayah", "698 Laporan Terdaftar"),
        ("Top 5 Wilayah", "Smg, Brebes, Clp", "Terkonsentrasi padat siswa"),
        ("Kategori Dominan", "Porsi & Jam Kirim", "72% dari total keluhan"),
        ("Resolusi SLA", "90.5% Tercapai", "Rata-rata selesai 46.8 jam")
    ]
    for idx, (atit, aval, asub) in enumerate(analytics_cards):
        ax = 40 + idx * 225
        eng.create_node("rectangle", f"K14 ABox {idx}", ax, 140, 210, 75, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
        eng.create_node("text", f"K14 ATit {idx}", ax + 15, 155, parent=f, text=atit, props={"fontSize": 11, "fill": C_DARK})
        eng.create_node("text", f"K14 AVal {idx}", ax + 15, 175, parent=f, text=aval, props={"fontSize": 14, "fill": C_DARK})
        eng.create_node("text", f"K14 ASub {idx}", ax + 15, 194, parent=f, text=asub, props={"fontSize": 9, "fill": C_TEXT_MUTED})

    # Filter Bar
    eng.draw_pill(f, "K14 F1", 40, 230, 110, 24, "Rentang Tanggal v", is_active=False)
    eng.draw_pill(f, "K14 F2", 160, 230, 100, 24, "Semua Tingkat v", is_active=True)
    eng.draw_pill(f, "K14 F3", 270, 230, 90, 24, "Kritis (24)", is_active=False)
    eng.draw_pill(f, "K14 F4", 370, 230, 90, 24, "Sedang (112)", is_active=False)

    # 8 Verified Cases Table
    eng.create_node("rectangle", "K14 THead", 40, 270, 880, 28, parent=f, props={"fill": C_BG_MUTED})
    headers_14 = [("Tiket", 60), ("Tanggal", 160), ("Sekolah", 260), ("Masalah", 440), ("Keparahan", 640), ("Status Resolusi", 780)]
    for htit, hx in headers_14:
        eng.create_node("text", f"K14 TH_{htit}", hx, 278, parent=f, text=htit, props={"fontSize": 10, "fill": C_DARK})

    sample_cases_14 = [
        ("KS-NF6YNKK", "04/11/2026", "SDN Candisari 01", "Makanan Berbau Asam", "Kritis", "Investigasi"),
        ("KS-ULJ9X7Y", "03/11/2026", "SMPN 2 Semarang", "Porsi Lauk Kurang", "Sedang", "Selesai"),
        ("KS-BC44P12", "03/11/2026", "SD Tembalang 10", "Keterlambatan 45 Menit", "Sedang", "Selesai"),
        ("KS-AA90Z11", "02/11/2026", "SDN Pedurungan 02", "Benda Asing Rambut", "Kritis", "Selesai"),
        ("KS-KK88M90", "01/11/2026", "SMPN 12 Semarang", "Ompreng Tidak Bersih", "Sedang", "Selesai"),
        ("KS-JJ12Q45", "31/10/2026", "SDN Banyumanik 03", "Ayam Kurang Matang", "Kritis", "Selesai")
    ]
    for ridx, (tkt, tgl, sch, prb, sev, res) in enumerate(sample_cases_14):
        ry = 305 + ridx * 34
        eng.create_node("rectangle", f"K14 TRow {ridx}", 40, ry, 880, 32, parent=f, props={"fill": "#FFFFFF" if ridx % 2 == 0 else C_BG_SUBTLE})
        eng.create_node("text", f"K14 R1 {ridx}", 60, ry + 9, parent=f, text=tkt, props={"fontSize": 10, "fill": C_DARK})
        eng.create_node("text", f"K14 R2 {ridx}", 160, ry + 9, parent=f, text=tgl, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        eng.create_node("text", f"K14 R3 {ridx}", 260, ry + 9, parent=f, text=sch, props={"fontSize": 10, "fill": C_DARK})
        eng.create_node("text", f"K14 R4 {ridx}", 440, ry + 9, parent=f, text=prb, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        eng.draw_pill(f, f"K14 R5 {ridx}", 640, ry + 6, 75, 20, sev, is_active=(sev == "Kritis"))
        eng.draw_pill(f, f"K14 R6 {ridx}", 780, ry + 6, 100, 20, res, is_active=(res == "Selesai"))

    eng.draw_footer_real(f, 600)

    # -------------------------------------------------------------------------
    # 15. Unduh Data & Dokumentasi API (860px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(2, 2, "15. Unduh Data & API", frame_height=860)
    eng.draw_navbar_public(f, active="Data Terbuka", logged_in=False)

    eng.create_node("text", "U15 Tit", 40, 85, parent=f, text="Katalog Dataset Terbuka & Integrasi API", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "U15 Sub", 40, 112, parent=f, text="Akses data publik agregat dalam format standar (CSV, JSON, REST API) untuk riset, jurnalisme, dan transparansi.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # 8 Dataset Cards (2 cols x 4 rows)
    datasets = [
        ("Data Aduan & Resolusi Kasus", "Log seluruh laporan masuk, status SLA, dan verifikasi.", "2.4 MB", "CSV, JSON"),
        ("Direktori Satuan Pelayanan (SPPG)", "Daftar dapur mitra, sertifikat SLHS, dan kapasitas.", "850 KB", "CSV, JSON"),
        ("Rekapitulasi Anggaran & Penyerapan", "Realisasi anggaran MBG tingkat provinsi dan kab/kota.", "1.2 MB", "CSV, JSON"),
        ("Sebaran Sekolah Penerima MBG", "Basis data 412 sekolah di Kota Semarang beserta npsn.", "640 KB", "CSV, JSON"),
        ("Hasil Uji Sampel Bakteriologis", "Laporan uji laboratorium puskesmas terhadap higiene.", "420 KB", "CSV"),
        ("Indeks Kepuasan Siswa & Sekolah", "Data survei penerimaan rasa, variasi porsi, dan waktu.", "510 KB", "CSV, JSON"),
        ("Log Pelanggaran & Sanksi SPPG", "Rekam jejak teguran tertulis dan audit investigasi.", "310 KB", "CSV"),
        ("Matriks Standar Gizi Menu Harian", "Tabel gramasi karbohidrat, protein, dan kalori menu.", "180 KB", "CSV, JSON")
    ]
    for idx, (dtit, ddesc, dsize, dfmt) in enumerate(datasets):
        col_i = idx % 2
        row_i = idx // 2
        dx = 40 + col_i * 450
        dy = 145 + row_i * 85
        eng.create_node("rectangle", f"U15 DCard {idx}", dx, dy, 430, 75, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
        eng.create_node("text", f"U15 DTit {idx}", dx + 15, dy + 12, parent=f, text=dtit, props={"fontSize": 12, "fill": C_DARK})
        eng.create_node("text", f"U15 DDesc {idx}", dx + 15, dy + 32, parent=f, text=ddesc, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        eng.create_node("text", f"U15 DInf {idx}", dx + 15, dy + 52, parent=f, text=f"Ukuran: {dsize}  |  Format: {dfmt}", props={"fontSize": 9, "fill": C_TEXT_LIGHT})
        eng.draw_button(f, f"U15 DBtn {idx}", dx + 340, dy + 40, 75, 26, "Unduh", variant="subtle", corner=6)

    # API Documentation Box
    eng.create_node("rectangle", "U15 ApiBox", 40, 500, 880, 110, parent=f, props={"fill": C_DARK, "cornerRadius": 10})
    eng.create_node("text", "U15 ApiTit", 60, 518, parent=f, text="Akses REST API Publik", props={"fontSize": 12, "fill": "#FFFFFF"})
    eng.create_node("text", "U15 ApiDesc", 60, 538, parent=f, text="Gunakan endpoint publik untuk query data tanpa autentikasi (Rate Limit: 100 req/menit):", props={"fontSize": 10, "fill": C_CROSS})
    eng.create_node("text", "U15 ApiCode", 60, 565, parent=f, text="curl -X GET 'https://api.pantaugizi.id/v1/public/cases?city=semarang&status=resolved' -H 'Accept: application/json'", props={"fontSize": 10, "fill": "#FFFFFF"})

    eng.draw_footer_real(f, 650)

    # -------------------------------------------------------------------------
    # 16. Dasbor Insight & Peta Risiko (860px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(2, 3, "16. Dasbor Insight & Risiko", frame_height=860)
    eng.draw_navbar_public(f, active="Insight", logged_in=False)

    eng.create_node("text", "I16 Tit", 40, 85, parent=f, text="Peta Risiko & Intelijen Pengawasan MBG", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "I16 Sub", 40, 112, parent=f, text="Sistem pemantauan geospasial real-time berbasis algoritma SAW dan early warning KLB.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # 4 Stat Cards
    for idx, (sval, slbl) in enumerate([("34.2", "Indeks Risiko Rata-rata"), ("3 Lokasi", "Titik Atensi Kritis"), ("98.1%", "Pasokan Pangan Aman"), ("15 Menit", "Kecepatan Respon Cepat")]):
        ix = 40 + idx * 225
        eng.create_node("rectangle", f"I16 SBox {idx}", ix, 140, 210, 65, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
        eng.create_node("text", f"I16 SV {idx}", ix + 15, 155, parent=f, text=sval, props={"fontSize": 16, "fill": C_DARK})
        eng.create_node("text", f"I16 SL {idx}", ix + 15, 178, parent=f, text=slbl, props={"fontSize": 10, "fill": C_TEXT_MUTED})

    # Center GIS Map Wireframe Box
    eng.draw_image_box(f, "I16 GisMap", 40, 220, 880, 250, corner=12)
    eng.create_node("text", "I16 MapTit", 60, 240, parent=f, text="Peta Sebaran Titik Panas Risiko Mutu MBG - Kota Semarang", props={"fontSize": 13, "fill": C_DARK})
    eng.create_node("text", "I16 MapSub", 60, 260, parent=f, text="Simulasi clustering zona merah (perhatian), kuning (waspada), dan hijau (aman).", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    # 2 Bottom Columns: Prioritas Inspeksi & Early Warning
    eng.create_node("rectangle", "I16 PrioCard", 40, 485, 430, 150, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
    eng.create_node("text", "I16 PTit", 55, 502, parent=f, text="Prioritas Inspeksi Dapur (DSS SAW)", props={"fontSize": 12, "fill": C_DARK})
    prio_list = [("1. SPPG Semarang Utara 02", "Skor 88.4 - Kritis", "Perlu audit besok"), ("2. SPPG Genuk 01", "Skor 84.1 - Waspada", "Inspeksi berkala"), ("3. SPPG Pedurungan 02", "Skor 78.5 - Waspada", "Evaluasi porsi")]
    for pidx, (pname, psc, pact) in enumerate(prio_list):
        py = 525 + pidx * 32
        eng.create_node("text", f"I16 PN {pidx}", 55, py, parent=f, text=pname, props={"fontSize": 10, "fill": C_DARK})
        eng.create_node("text", f"I16 PS {pidx}", 240, py, parent=f, text=psc, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        eng.create_node("text", f"I16 PA {pidx}", 340, py, parent=f, text=pact, props={"fontSize": 9, "fill": C_DARK})

    eng.create_node("rectangle", "I16 WarnCard", 490, 485, 430, 150, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
    eng.create_node("text", "I16 WTit", 505, 502, parent=f, text="Peringatan Dini Kesehatan Wilayah (EWS)", props={"fontSize": 12, "fill": C_DARK})
    warns = [("Status Wilayah", "KONDISI AMAN", "Tidak ada klaster KLB aktif terkonfirmasi."), ("Puskesmas Siaga", "37 Unit Aktif", "Protokol tanggap cepat ambulans siaga 24 jam."), ("Sampel Lab", "Lolos 98.4%", "Hasil uji mikrobiologi pekan ke-44.")]
    for widx, (wnm, wval, wdesc) in enumerate(warns):
        wy = 525 + widx * 32
        eng.create_node("text", f"I16 WN {widx}", 505, wy, parent=f, text=wnm, props={"fontSize": 10, "fill": C_DARK})
        eng.create_node("text", f"I16 WV {widx}", 620, wy, parent=f, text=wval, props={"fontSize": 9, "fill": C_DARK})
        eng.create_node("text", f"I16 WD {widx}", 720, wy, parent=f, text=wdesc, props={"fontSize": 9, "fill": C_TEXT_MUTED})

    eng.draw_footer_real(f, 660)

    # -------------------------------------------------------------------------
    # 17. DSS Prioritas Inspeksi SAW (860px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(2, 4, "17. DSS Prioritas Audit SAW", frame_height=860)
    eng.draw_navbar_public(f, active="Insight", logged_in=False)

    eng.create_node("text", "D17 Tit", 40, 85, parent=f, text="Sistem Pendukung Keputusan (DSS) - Prioritas Audit", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "D17 Sub", 40, 112, parent=f, text="Metode Simple Additive Weighting (SAW) menentukan urgensi audit dapur berdasarkan 5 parameter objektif.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # Methodology Formula Banner
    eng.create_node("rectangle", "D17 FormBox", 40, 140, 880, 50, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
    eng.create_node("text", "D17 FormTxt", 60, 155, parent=f, text="Formula Preferensi: Vi = SUM [ w_j * r_ij ]  |  Bobot: C1 Higiene (30%), C2 Laporan (25%), C3 Keterlambatan (20%), C4 Portofolio (15%), C5 SLA (10%)", props={"fontSize": 10, "fill": C_DARK})

    # Table of Ranked SPPGs
    eng.create_node("rectangle", "D17 THead", 40, 205, 880, 28, parent=f, props={"fill": C_BG_MUTED})
    headers_17 = [("Rank", 60), ("Nama SPPG", 120), ("Kecamatan", 300), ("Breakdown Kriteria (C1 - C5)", 440), ("Skor Akhir", 740), ("Rekomendasi", 820)]
    for htit, hx in headers_17:
        eng.create_node("text", f"D17 TH_{htit}", hx, 213, parent=f, text=htit, props={"fontSize": 10, "fill": C_DARK})

    ranked_sppg = [
        ("1", "SPPG Semarang Utara 02", "Smg Utara", [85, 90, 75, 80, 85], "0.884", "Audit 24 Jam"),
        ("2", "SPPG Genuk 01", "Genuk", [80, 85, 80, 75, 80], "0.841", "Audit 48 Jam"),
        ("3", "SPPG Pedurungan 02", "Pedurungan", [75, 80, 70, 70, 75], "0.785", "Monitoring"),
        ("4", "SPPG Candisari 01", "Candisari", [70, 75, 65, 70, 70], "0.742", "Monitoring"),
        ("5", "SPPG Semarang Tengah 01", "Smg Tengah", [65, 70, 60, 65, 65], "0.680", "Rutin"),
        ("6", "SPPG Banyumanik 01", "Banyumanik", [50, 45, 40, 50, 45], "0.485", "Rutin")
    ]
    for ridx, (rnk, snm, skec, crit_bars, fin_sc, reco) in enumerate(ranked_sppg):
        ry = 240 + ridx * 38
        eng.create_node("rectangle", f"D17 TRow {ridx}", 40, ry, 880, 36, parent=f, props={"fill": "#FFFFFF" if ridx % 2 == 0 else C_BG_SUBTLE})
        eng.create_node("text", f"D17 R1 {ridx}", 65, ry + 11, parent=f, text=rnk, props={"fontSize": 11, "fill": C_DARK})
        eng.create_node("text", f"D17 R2 {ridx}", 120, ry + 11, parent=f, text=snm, props={"fontSize": 11, "fill": C_DARK})
        eng.create_node("text", f"D17 R3 {ridx}", 300, ry + 11, parent=f, text=skec, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        # 5 criteria bars
        for cidx, cval in enumerate(crit_bars):
            bx = 440 + cidx * 55
            eng.create_node("rectangle", f"D17 CBarBg {ridx}_{cidx}", bx, ry + 12, 45, 6, parent=f, props={"fill": C_BG_MUTED, "cornerRadius": 3})
            eng.create_node("rectangle", f"D17 CBarFill {ridx}_{cidx}", bx, ry + 12, int(45 * cval / 100), 6, parent=f, props={"fill": C_DARK, "cornerRadius": 3})
        eng.create_node("text", f"D17 R4 {ridx}", 740, ry + 11, parent=f, text=fin_sc, props={"fontSize": 11, "fill": C_DARK})
        eng.draw_pill(f, f"D17 R5 {ridx}", 815, ry + 7, 95, 22, reco, is_active=(rnk in ["1", "2"]))

    # Action box
    eng.create_node("rectangle", "D17 ActBox", 40, 500, 880, 80, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
    eng.create_node("text", "D17 ActTit", 60, 518, parent=f, text="Jadwal Inspeksi Mendadak Disarankan: 2 Dapur dalam 48 Jam", props={"fontSize": 12, "fill": C_DARK})
    eng.create_node("text", "D17 ActDesc", 60, 540, parent=f, text="Surat tugas otomatis telah disiapkan untuk Tim Sanitasi Dinkes Kota Semarang.", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    eng.draw_button(f, "D17 ActBtn", 740, 525, 160, 32, "Cetak Surat Tugas Audit", variant="primary", corner=6)

    eng.draw_footer_real(f, 620)

    # -------------------------------------------------------------------------
    # 18. Sistem Peringatan Dini KLB (820px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(2, 5, "18. Early Warning System KLB", frame_height=820)
    eng.draw_navbar_public(f, active="Insight", logged_in=False)

    eng.create_node("text", "E18 Tit", 40, 85, parent=f, text="Sistem Peringatan Dini Kejadian Luar Biasa (KLB)", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "E18 Sub", 40, 112, parent=f, text="Protokol otomatisasi deteksi klaster gejala keracunan pangan serentak di lingkungan sekolah.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # Alert Status Banner
    eng.create_node("rectangle", "E18 StatCard", 40, 140, 880, 70, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1.5, "cornerRadius": 10})
    eng.create_node("ellipse", "E18 SafeCir", 65, 155, 36, 36, parent=f, props={"fill": C_DARK})
    eng.create_node("text", "E18 SafeTxt", 78, 164, parent=f, text="v", props={"fontSize": 16, "fill": "#FFFFFF"})
    eng.create_node("text", "E18 StatTit", 115, 153, parent=f, text="Status Kewaspadaan Pangan Wilayah: AMAN & TERKENDALI", props={"fontSize": 14, "fill": C_DARK})
    eng.create_node("text", "E18 StatDesc", 115, 175, parent=f, text="Tidak terdeteksi adanya klaster laporan gejala serentak (>3 siswa) dalam 72 jam terakhir di seluruh wilayah Kota Semarang.", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    # 4 Detection Parameters
    params = [
        ("Gejala Serempak", ">= 3 Siswa", "Mual, muntah, pusing dalam 1 jam"),
        ("Keterlambatan Makanan", "> 45 Menit", "Risiko berkembang biak bakteri"),
        ("Laporan Benda Asing", "Terverifikasi", "Kontaminasi fisik berbahaya"),
        ("Hasil Uji Sanitasi", "< 70 Poin", "Penurunan kepatuhan dapur SPPG")
    ]
    for idx, (pname, pthr, pdesc) in enumerate(params):
        px = 40 + idx * 225
        eng.create_node("rectangle", f"E18 PBox {idx}", px, 225, 210, 85, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
        eng.create_node("text", f"E18 PNm {idx}", px + 15, 240, parent=f, text=pname, props={"fontSize": 11, "fill": C_DARK})
        eng.create_node("text", f"E18 PThr {idx}", px + 15, 260, parent=f, text=f"Ambang Batas: {pthr}", props={"fontSize": 10, "fill": C_DARK})
        eng.create_node("text", f"E18 PDesc {idx}", px + 15, 278, parent=f, text=pdesc, props={"fontSize": 8, "fill": C_TEXT_MUTED})

    # Historical Events & Hotline Box
    eng.create_node("rectangle", "E18 HistBox", 40, 330, 560, 200, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
    eng.create_node("text", "E18 HTit", 60, 350, parent=f, text="Riwayat Simulasi & Insiden Terkendali Sebelumnya", props={"fontSize": 12, "fill": C_DARK})
    hist_klb = [
        ("Simulasi KLB Terpadu 2025", "Kec. Banyumanik - Waktu respon 28 menit, isolasi dapur sukses."),
        ("Insiden Dugaan Keracunan Susu", "Kec. Candisari - Sampel lab negatif, keluhan intoleransi laktosa siswa."),
        ("Audit Kepatuhan Suhu Makanan", "Kec. Genuk - Penggantian armada box pemanas tepat waktu.")
    ]
    for hidx, (htitle, hdesc) in enumerate(hist_klb):
        hy = 380 + hidx * 42
        eng.create_node("ellipse", f"E18 HBul {hidx}", 60, hy + 4, 8, 8, parent=f, props={"fill": C_DARK})
        eng.create_node("text", f"E18 HTxt1 {hidx}", 80, hy, parent=f, text=htitle, props={"fontSize": 10, "fill": C_DARK})
        eng.create_node("text", f"E18 HTxt2 {hidx}", 80, hy + 18, parent=f, text=hdesc, props={"fontSize": 9, "fill": C_TEXT_MUTED})

    eng.create_node("rectangle", "E18 CallBox", 620, 330, 300, 200, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
    eng.create_node("text", "E18 CTit", 640, 350, parent=f, text="Kontak Cepat Tanggap Darurat", props={"fontSize": 12, "fill": C_DARK})
    eng.create_node("text", "E18 CDesc", 640, 375, parent=f, text="Jika terjadi gejala keracunan serentak di sekolah:", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    eng.create_node("text", "E18 CNum1", 640, 405, parent=f, text="PSC 119 Kota Semarang (Bebas Pulsa)", props={"fontSize": 12, "fill": C_DARK})
    eng.create_node("text", "E18 CNum2", 640, 430, parent=f, text="Hotline Dinkes: (024) 8415280", props={"fontSize": 11, "fill": C_DARK})
    eng.draw_button(f, "E18 CBtn", 640, 470, 260, 34, "Hubungi PSC 119 Sekarang", variant="primary", corner=6)

    eng.draw_footer_real(f, 570)

    # =========================================================================
    # ROW 3: PUBLIK - EDUKASI, PORTAL & ALUR MASUK (19 - 24)
    # =========================================================================

    # -------------------------------------------------------------------------
    # 19. Komparasi Kinerja SPPG (780px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(3, 0, "19. Komparasi Kinerja SPPG", frame_height=780)
    eng.draw_navbar_public(f, active="Insight", logged_in=False)

    eng.create_node("text", "C19 Tit", 40, 85, parent=f, text="Komparasi Kinerja Antar SPPG", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "C19 Sub", 40, 112, parent=f, text="Bandingkan dua dapur penyedia secara objektif berdasarkan sertifikasi, kapasitas, keluhan, dan SLA.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # Selectors
    eng.create_node("rectangle", "C19 Sel1", 40, 140, 430, 44, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
    eng.create_node("text", "C19 STxt1", 60, 154, parent=f, text="SPPG 1: SPPG Semarang Utara 02 v", props={"fontSize": 12, "fill": C_DARK})
    eng.create_node("rectangle", "C19 Sel2", 490, 140, 430, 44, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
    eng.create_node("text", "C19 STxt2", 510, 154, parent=f, text="SPPG 2: SPPG Mijen 01 v", props={"fontSize": 12, "fill": C_DARK})

    # Comparison Table
    eng.create_node("rectangle", "C19 Tab", 40, 205, 880, 320, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
    metrics_comp = [
        ("Sertifikat SLHS Dinkes", "Terverifikasi (No. 443/Smg/25)", "Terverifikasi (No. 448/Smg/25)"),
        ("Kapasitas Produksi Harian", "4.200 porsi/hari", "2.900 porsi/hari"),
        ("Jumlah Sekolah Mitra", "8 Sekolah", "5 Sekolah"),
        ("Indeks Higiene Sanitasi", "94.2% (Grade A)", "96.4% (Grade A+)"),
        ("Tingkat Kepatuhan SLA", "88.4%", "96.2%"),
        ("Rasio Aduan Masuk", "2 Aduan per 10.000 porsi", "0.5 Aduan per 10.000 porsi"),
        ("Rata-rata Waktu Resolusi", "3.8 Jam", "2.1 Jam")
    ]
    for idx, (mname, v1, v2) in enumerate(metrics_comp):
        my = 220 + idx * 42
        eng.create_node("rectangle", f"C19 MRow {idx}", 40, my, 880, 40, parent=f, props={"fill": "#FFFFFF" if idx % 2 == 0 else C_BG_SUBTLE})
        eng.create_node("text", f"C19 MN {idx}", 60, my + 12, parent=f, text=mname, props={"fontSize": 11, "fill": C_DARK})
        eng.create_node("text", f"C19 MV1 {idx}", 360, my + 12, parent=f, text=v1, props={"fontSize": 11, "fill": C_DARK})
        eng.create_node("text", f"C19 MV2 {idx}", 660, my + 12, parent=f, text=v2, props={"fontSize": 11, "fill": C_DARK})

    eng.draw_footer_real(f, 570)

    # -------------------------------------------------------------------------
    # 20. Panduan Penggunaan Sistem (800px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(3, 1, "20. Panduan Penggunaan Portal", frame_height=800)
    eng.draw_navbar_public(f, active="Panduan", logged_in=False)

    eng.create_node("text", "P20 Tit", 40, 85, parent=f, text="Panduan Penggunaan Portal PMBGM", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "P20 Sub", 40, 112, parent=f, text="Petunjuk operasional alur pelaporan dan tindak lanjut untuk seluruh pemangku kepentingan.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # 4 Tabs
    tabs_20 = [("Untuk Warga / Wali Murid", True), ("Untuk Guru & Sekolah", False), ("Untuk Dapur SPPG", False), ("Untuk Tim Verifikator & Dinkes", False)]
    for tidx, (tname, tact) in enumerate(tabs_20):
        eng.draw_pill(f, f"P20 Tab {tidx}", 40 + tidx * 190, 140, 180, 28, tname, is_active=tact)

    # 4 Workflow Steps Cards
    wf_steps = [
        ("1. Masuk ke Akun", "Gunakan akun nomor WhatsApp atau akun Google yang telah terdaftar.", "Tombol 'Masuk' di pojok kanan atas"),
        ("2. Pilih Sekolah & Masalah", "Tentukan sekolah penerima, kategori ketidaksesuaian menu, dan jam kejadian.", "Formulir 5 langkah interaktif"),
        ("3. Unggah Bukti Otentik", "Sertakan foto jelas dari menu yang bermasalah dan wadah ompreng resmi.", "Format JPG/PNG maksimal 3 foto"),
        ("4. Dapatkan Kode Tiket", "Simpan kode 8 digit (mis. KS-NF6YNKK) untuk memantau status secara live.", "Update via SMS/WA & web")
    ]
    for sidx, (stit, sdesc, snote) in enumerate(wf_steps):
        sx = 40 + sidx * 225
        eng.create_node("rectangle", f"P20 StepBox {sidx}", sx, 190, 210, 230, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
        eng.draw_image_box(f, f"P20 StepImg {sidx}", sx + 15, 205, 180, 100, corner=6)
        eng.create_node("text", f"P20 STit {sidx}", sx + 15, 320, parent=f, text=stit, props={"fontSize": 12, "fill": C_DARK})
        eng.create_node("text", f"P20 SDesc {sidx}", sx + 15, 342, parent=f, text=sdesc, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        eng.create_node("text", f"P20 SNote {sidx}", sx + 15, 385, parent=f, text=snote, props={"fontSize": 8, "fill": C_TEXT_LIGHT})

    # Manual Download Card
    eng.create_node("rectangle", "P20 DnlCard", 40, 445, 880, 80, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
    eng.create_node("text", "P20 DnlTit", 60, 465, parent=f, text="Unduh Buku Panduan Resmi PMBGM (PDF)", props={"fontSize": 13, "fill": C_DARK})
    eng.create_node("text", "P20 DnlDesc", 60, 488, parent=f, text="Buku manual lengkap mencakup SOP teknis, hak & kewajiban pelapor, dan standar gramasi gizi.", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    eng.draw_button(f, "P20 DnlBtn", 740, 470, 160, 32, "Unduh Panduan (4.8 MB)", variant="primary", corner=6)

    eng.draw_footer_real(f, 570)

    # -------------------------------------------------------------------------
    # 21. Metodologi & Standar Mutu (800px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(3, 2, "21. Metodologi & Regulasi", frame_height=800)
    eng.draw_navbar_public(f, active="Panduan", logged_in=False)

    eng.create_node("text", "M21 Tit", 40, 85, parent=f, text="Metodologi Pengawasan, Pembobotan SAW & Regulasi", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "M21 Sub", 40, 112, parent=f, text="Landasan saintifik dan yuridis platform PMBGM dalam menjaga transparansi program nasional MBG.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    sections_21 = [
        ("1. Kerangka Higiene Sanitasi Pangan (SLHS Kemenkes)", "Mengadopsi Permenkes No. 14 Tahun 2021 tentang Standar Kegiatan Usaha dan Produk pada Penyelenggaraan Perizinan Berusaha Berbasis Risiko Sektor Kesehatan. Pemeriksaan rutin meliputi mutu air bersih, peralatan masak stainless steel, kebersihan personel penjamah makanan (food handler), serta pengujian mikrobiologi E. Coli & Salmonella."),
        ("2. Algoritma SAW (Simple Additive Weighting)", "Metode penjumlahan terbobot digunakan untuk menghitung nilai preferensi risiko secara matematis. Kriteria ternormalisasi mencakup: C1 Tingkat Bahaya (30%), C2 Dampak Siswa (25%), C3 Riwayat SPPG (20%), C4 Waktu Lapor (15%), dan C5 Validitas Bukti (10%). Pendekatan ini menghilangkan bias subjektif dalam penentuan antrean verifikasi."),
        ("3. Service Level Agreement (SLA) & Eskalasi Bertingkat", "Penetapan tenggat waktu penyelesaian aduan dirancang mengikat: Kategori Kritis (< 4 jam), Kategori Sedang (< 12 jam), Kategori Ringan (< 24 jam). Keterlambatan respon memicu eskalasi otomatis ke Dinas Pendidikan dan Dinas Kesehatan Kota Semarang.")
    ]
    for idx, (sect_tit, sect_body) in enumerate(sections_21):
        sy = 145 + idx * 115
        eng.create_node("rectangle", f"M21 Card {idx}", 40, sy, 880, 100, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
        eng.create_node("text", f"M21 STit {idx}", 60, sy + 15, parent=f, text=sect_tit, props={"fontSize": 13, "fill": C_DARK})
        eng.create_node("text", f"M21 SBody {idx}", 60, sy + 38, parent=f, text=sect_body, props={"fontSize": 9, "fill": C_TEXT_MUTED})

    # Regulatory Citations
    eng.create_node("rectangle", "M21 LawBox", 40, 510, 880, 70, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
    eng.create_node("text", "M21 LawTit", 60, 525, parent=f, text="Dasar Hukum & Rujukan Regulasi:", props={"fontSize": 11, "fill": C_DARK})
    eng.create_node("text", "M21 LawDesc", 60, 545, parent=f, text="Perpres No. 83 Tahun 2024 tentang Badan Gizi Nasional  |  UU No. 17 Tahun 2023 tentang Kesehatan  |  UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (PDP)", props={"fontSize": 9, "fill": C_TEXT_MUTED})

    eng.draw_footer_real(f, 610)

    # -------------------------------------------------------------------------
    # 22. Tentang Inisiatif PMBGM (780px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(3, 3, "22. Tentang Inisiatif PMBGM", frame_height=780)
    eng.draw_navbar_public(f, active="Panduan", logged_in=False)

    eng.create_node("text", "T22 Tit", 40, 85, parent=f, text="Tentang Platform PMBGM", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "T22 Sub", 40, 112, parent=f, text="Gerakan kolaboratif pengawasan mutu pangan demi generasi emas Indonesia yang sehat dan cerdas.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # Vision & Mission
    eng.create_node("rectangle", "T22 VisBox", 40, 140, 430, 120, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
    eng.create_node("text", "T22 VisTit", 60, 158, parent=f, text="Visi Kami", props={"fontSize": 14, "fill": C_DARK})
    eng.create_node("text", "T22 VisTxt", 60, 185, parent=f, text="Terwujudnya tata kelola Program Makan Bergizi Gratis yang 100% transparan, akuntabel, dan bebas dari risiko kontaminasi keamanan pangan di seluruh satuan pendidikan.", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    eng.create_node("rectangle", "T22 MisBox", 490, 140, 430, 120, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
    eng.create_node("text", "T22 MisTit", 510, 158, parent=f, text="Misi Utama", props={"fontSize": 14, "fill": C_DARK})
    eng.create_node("text", "T22 MisTxt", 510, 185, parent=f, text="1. Menyediakan saluran pelaporan cepat dan aman bagi wali murid.\n2. Menerapkan DSS SAW untuk investigasi objektif berbasis risiko.\n3. Mengintegrasikan data terbuka antar dinas untuk evaluasi berkala.", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    # 3 Core Pillars
    eng.create_node("text", "T22 PilTit", 40, 280, parent=f, text="Tiga Pilar Utama Pengawasan", props={"fontSize": 14, "fill": C_DARK})
    pillars = [
        ("Partisipasi Warga", "Masyarakat dan guru bertindak sebagai garda terdepan pengawas mutu hidangan."),
        ("Keputusan Saintifik (DSS)", "Perhitungan matematis SAW mencegah pembiaran pada dapur berisiko tinggi."),
        ("Transparansi Terbuka", "Setiap rupiah dan setiap kotak makanan dapat dilacak secara akuntabel.")
    ]
    for idx, (ptit, pdesc) in enumerate(pillars):
        px = 40 + idx * 300
        eng.create_node("rectangle", f"T22 PilBox {idx}", px, 305, 280, 85, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
        eng.create_node("text", f"T22 PTit {idx}", px + 15, 322, parent=f, text=ptit, props={"fontSize": 12, "fill": C_DARK})
        eng.create_node("text", f"T22 PDesc {idx}", px + 15, 345, parent=f, text=pdesc, props={"fontSize": 9, "fill": C_TEXT_MUTED})

    # Stakeholders
    eng.create_node("text", "T22 StkTit", 40, 415, parent=f, text="Pemangku Kepentingan Terintegrasi", props={"fontSize": 14, "fill": C_DARK})
    stks = ["Pemerintah Kota Semarang", "Badan Gizi Nasional (BGN)", "Dinas Kesehatan Kota Semarang", "Dinas Pendidikan Kota Semarang", "Komite Sekolah & Orang Tua"]
    for idx, sname in enumerate(stks):
        eng.draw_pill(f, f"T22 StkPill {idx}", 40 + idx * 175, 445, 165, 28, sname, is_active=False)

    eng.draw_footer_real(f, 520)

    # -------------------------------------------------------------------------
    # 23. Tanya Jawab (FAQ) (780px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(3, 4, "23. Tanya Jawab Terbuka", frame_height=780)
    eng.draw_navbar_public(f, active="Panduan", logged_in=False)

    eng.create_node("text", "F23 Tit", 40, 85, parent=f, text="Pusat Bantuan & Tanya Jawab Terbuka (FAQ)", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "F23 Sub", 40, 112, parent=f, text="Temukan jawaban atas pertanyaan umum seputar tata cara pelaporan, privasi, dan alur investigasi.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # Search Bar FAQ
    eng.create_node("rectangle", "F23 SBox", 40, 140, 880, 40, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 20})
    eng.create_node("text", "F23 SPlh", 65, 153, parent=f, text="Ketik pertanyaan Anda di sini...", props={"fontSize": 11, "fill": C_TEXT_LIGHT})

    # 6 Accordion Items
    faq_items = [
        ("Bagaimana cara melaporkan makanan yang tidak higienis atau basi?", "Anda dapat menekan tombol 'Lapor Masalah' di navigasi utama, memilih sekolah, memilih kategori masalah, serta melampirkan foto makanan yang diambil di hari yang sama."),
        ("Apakah identitas saya sebagai pelapor akan dijamin kerahasiaannya?", "Ya. Sistem PMBGM dilindungi undang-undang PDP. Identitas Anda tidak akan ditampilkan kepada pihak dapur SPPG maupun masyarakat umum."),
        ("Berapa lama waktu yang dibutuhkan hingga laporan saya ditindaklanjuti?", "Tergantung tingkat keparahan kasus: Kategori Kritis (< 4 jam), Kategori Sedang (< 12 jam), dan Kategori Ringan (< 24 jam)."),
        ("Apa yang dimaksud dengan nilai skor risiko SAW pada tiket laporan?", "Skor SAW (Simple Additive Weighting) adalah hasil kalkulasi algoritma yang menilai urgensi bahaya makanan berdasarkan 5 parameter objektif."),
        ("Apa sanksi yang diberikan kepada dapur SPPG jika terbukti melanggar?", "Sanksi bertingkat mulai dari teguran tertulis, denda penalti anggaran, penghentian sementara operasional, hingga pencabutan izin sertifikat SLHS."),
        ("Ke mana saya harus menghubungi jika terdapat siswa yang mengalami keracunan darurat?", "Segera hubungi tim reaksi darurat PSC 119 Kota Semarang atau hotline medis dinas kesehatan di (024) 8415280.")
    ]
    for idx, (fq_q, fq_a) in enumerate(faq_items):
        fy = 195 + idx * 58
        eng.create_node("rectangle", f"F23 QCard {idx}", 40, fy, 880, 48, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
        eng.create_node("text", f"F23 QTxt {idx}", 60, fy + 16, parent=f, text=fq_q, props={"fontSize": 11, "fill": C_DARK})
        eng.create_node("text", f"F23 QIcon {idx}", 890, fy + 16, parent=f, text="v", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    eng.draw_footer_real(f, 580)

    # -------------------------------------------------------------------------
    # 24. Kebijakan Privasi Pelapor (760px)
    # -------------------------------------------------------------------------
    f = eng.start_frame(3, 5, "24. Kebijakan Privasi", frame_height=760)
    eng.draw_navbar_public(f, active="Panduan", logged_in=False)

    eng.create_node("text", "P24 Tit", 40, 85, parent=f, text="Kebijakan Privasi & Perlindungan Data Pelapor", props={"fontSize": 20, "fill": C_DARK})
    eng.create_node("text", "P24 Sub", 40, 112, parent=f, text="Komitmen kepatuhan UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # Privacy Guarantee Banner
    eng.create_node("rectangle", "P24 PdpCard", 40, 140, 880, 60, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
    eng.create_node("text", "P24 PdpTit", 60, 155, parent=f, text="Jaminan Perlindungan Whistleblower Pangan", props={"fontSize": 12, "fill": C_DARK})
    eng.create_node("text", "P24 PdpDesc", 60, 173, parent=f, text="Platform PMBGM menjamin tidak adanya intimidasi atau kebocoran data pelapor kepada pihak penyedia makanan.", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    # 4 Policy Cards
    policies = [
        ("1. Data yang Kami Kumpulkan", "Nama lengkap, nomor telepon (untuk notifikasi WhatsApp), sekolah anak, dan bukti foto laporan. Kami tidak membagikan data ini kepada pihak komersial mana pun."),
        ("2. Anonimisasi Data Publik", "Pada dasbor publik dan papan akuntabilitas terbuka, nama pelapor otomatis dianonimkan menjadi 'Wali Murid SDN Candisari 01' tanpa mencantumkan identitas pribadi."),
        ("3. Hak Akses Terbatas Petugas", "Hanya petugas Verifikator resmi yang telah menandatangani pakta integritas dan sumpah kerahasiaan yang memiliki akses verifikasi nomor kontak."),
        ("4. Hak Penghapusan Data", "Pelapor memiliki hak penuh untuk meminta penarikan atau penghapusan data kontak setelah proses investigasi dan tindak lanjut dinyatakan selesai.")
    ]
    for idx, (ptit, pdesc) in enumerate(policies):
        py = 215 + idx * 75
        eng.create_node("rectangle", f"P24 PolCard {idx}", 40, py, 880, 65, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
        eng.create_node("text", f"P24 PTit {idx}", 60, py + 12, parent=f, text=ptit, props={"fontSize": 12, "fill": C_DARK})
        eng.create_node("text", f"P24 PDesc {idx}", 60, py + 34, parent=f, text=pdesc, props={"fontSize": 9, "fill": C_TEXT_MUTED})

    eng.draw_footer_real(f, 550)

    print(" -> Screens 01 to 24 successfully built!")

