import subprocess
import json
import time
import sys

def main():
    print("=" * 65)
    print("PMBGM - TEXTBOOK MONOCHROME WIREFRAME ARCHITECT (FIGCRAFT v2)")
    print("=" * 65)

    # 1. Connect to Headless FigCraft MCP Server
    print("[1/5] Memulai sesi FigCraft Engine (MCP stdio mode)...")
    p = subprocess.Popen(
        ['D:/Program Files/ArtCraft/FigCraft/figcraft-cli.exe', 'mcp'],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding='utf-8',
        errors='replace'
    )

    msg_id = 1
    def read_json():
        while True:
            line = p.stdout.readline()
            if not line:
                return None
            line = line.strip()
            if line.startswith('{'):
                try:
                    return json.loads(line)
                except Exception:
                    pass

    def send(msg):
        nonlocal msg_id
        msg['id'] = msg_id
        msg_id += 1
        p.stdin.write(json.dumps(msg) + '\n')
        p.stdin.flush()
        return read_json()

    # MCP Handshake
    send({'jsonrpc': '2.0', 'method': 'initialize', 'params': {'protocolVersion': '2024-11-05', 'capabilities': {}, 'clientInfo': {'name': 'textbook_wireframe', 'version': '2.0'}}})
    p.stdin.write(json.dumps({'jsonrpc': '2.0', 'method': 'notifications/initialized', 'params': {}}) + '\n')
    p.stdin.flush()

    # Helper: Create Node (Proper text hugging without arbitrary width wrapping)
    def create_node(node_type, name, x, y, width=None, height=None, parent=None, text=None, props=None, path=None):
        args = {
            'type': node_type,
            'name': name,
            'x': float(x),
            'y': float(y),
            'select': False
        }
        if width is not None:
            args['width'] = float(width)
        elif node_type != 'text':
            args['width'] = 100.0

        if height is not None:
            args['height'] = float(height)
        elif node_type != 'text':
            args['height'] = 100.0

        if parent is not None:
            args['parent'] = parent
        if text is not None:
            args['text'] = text
        if props is not None:
            args['props'] = props
        if path is not None:
            args['path'] = path

        res = send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'create_node', 'arguments': args}})
        try:
            txt = res['result']['content'][0]['text']
            data = json.loads(txt)
            return data.get('id') or (data.get('node', {}).get('id'))
        except Exception:
            return None

    # Wireframe Color Constants (Pure Monochrome / Grayscale standard)
    C_FRAME_BG   = "#FFFFFF"
    C_BORDER     = "#D1D5DB"
    C_LIGHT_BG   = "#F4F4F5"
    C_X_LINE     = "#CBD5E1"
    C_DARK       = "#18181B"
    C_TEXT_MAIN  = "#18181B"
    C_TEXT_MUTED = "#71717A"
    C_TEXT_LIGHT = "#A1A1AA"
    C_DIVIDER    = "#E4E4E7"

    # UI Primitive Helpers
    def draw_image_box(fid, name, x, y, w, h):
        create_node("rectangle", f"{name} BG", x, y, w, h, parent=fid, props={"fill": C_LIGHT_BG, "stroke": C_BORDER, "strokeWeight": 1})
        create_node("vector", f"{name} X", x, y, w, h, parent=fid, path=f"M0 0 L{w} {h} M0 {h} L{w} 0", props={"stroke": C_X_LINE, "strokeWeight": 1})

    def draw_video_box(fid, name, x, y, w, h):
        draw_image_box(fid, name, x, y, w, h)
        cx = x + w / 2
        cy = y + h / 2
        # Center Play Button Circle
        create_node("ellipse", f"{name} Play Cir", cx - 22, cy - 22, 44, 44, parent=fid, props={"fill": C_DARK})
        create_node("vector", f"{name} Play Tri", cx - 6, cy - 9, 15, 18, parent=fid, path="M0 0 L15 9 L0 18 Z", props={"fill": "#FFFFFF"})

    def draw_avatar(fid, name, cx, cy, r=22):
        create_node("ellipse", f"{name} Circle", cx - r, cy - r, r * 2, r * 2, parent=fid, props={"fill": "#E4E4E7", "stroke": C_BORDER, "strokeWeight": 1})
        create_node("ellipse", f"{name} Head", cx - 6, cy - 12, 12, 12, parent=fid, props={"fill": "#A1A1AA"})
        create_node("rectangle", f"{name} Body", cx - 14, cy + 2, 28, 16, parent=fid, props={"fill": "#A1A1AA", "cornerRadius": 8})

    def draw_button(fid, name, x, y, w, h, text, variant="primary"):
        if variant == "primary":
            create_node("rectangle", f"{name} Box", x, y, w, h, parent=fid, props={"fill": C_DARK, "cornerRadius": 4})
            create_node("text", f"{name} Txt", x + (w - len(text) * 7.5) / 2, y + (h - 14) / 2, parent=fid, text=text, props={"fill": "#FFFFFF", "fontSize": 13})
        else:
            create_node("rectangle", f"{name} Box", x, y, w, h, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
            create_node("text", f"{name} Txt", x + (w - len(text) * 7.2) / 2, y + (h - 14) / 2, parent=fid, text=text, props={"fill": C_DARK, "fontSize": 13})

    def draw_input(fid, name, x, y, w, h, placeholder, corner=4):
        create_node("rectangle", f"{name} Box", x, y, w, h, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": corner})
        create_node("text", f"{name} Txt", x + 16, y + (h - 13) / 2, parent=fid, text=placeholder, props={"fill": C_TEXT_LIGHT, "fontSize": 12})

    def draw_navbar(fid, active="Beranda"):
        create_node("rectangle", "Navbar Base", 0, 0, 960, 56, parent=fid, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
        # Brand
        create_node("rectangle", "Logo Box", 32, 16, 24, 24, parent=fid, props={"fill": C_DARK, "cornerRadius": 4})
        create_node("text", "Brand Name", 64, 20, parent=fid, text="PMBGM", props={"fontSize": 14, "fill": C_DARK})
        create_node("text", "Brand Tag", 125, 22, parent=fid, text="·  Pemantau MBG Masyarakat", props={"fontSize": 11, "fill": C_TEXT_MUTED})
        # Links
        links = ["Beranda", "Lapor", "Lacak", "Data", "Insight", "Panduan"]
        lx = 420
        for l in links:
            is_act = (l == active)
            col = C_DARK if is_act else C_TEXT_MUTED
            create_node("text", f"Nav {l}", lx, 21, parent=fid, text=l, props={"fontSize": 12, "fill": col})
            if is_act:
                create_node("rectangle", f"Nav Line {l}", lx, 46, 36, 2, parent=fid, props={"fill": C_DARK})
            lx += 62
        # Actions
        draw_button(fid, "Nav Lapor", 790, 12, 85, 32, "Lapor", variant="primary")
        draw_button(fid, "Nav Masuk", 885, 12, 55, 32, "Masuk", variant="outline")

    def draw_footer(fid, y=1400):
        create_node("rectangle", "Footer Base", 0, y, 960, 50, parent=fid, props={"fill": "#FAFAFA", "stroke": C_DIVIDER, "strokeWeight": 1})
        create_node("text", "Footer Copyright", 32, y + 18, parent=fid, text="© 2026 PMBGM (Pemantau MBG Masyarakat) · Tim Ctrl Win Enter · Lisensi Data Terbuka CC BY 4.0", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    print("[2/5] Menyiapkan kanvas dan membersihkan dokumen...")
    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'run_command', 'arguments': {'command': 'select.all'}}})
    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'run_command', 'arguments': {'command': 'edit.delete'}}})
    time.sleep(0.3)

    FRAME_W = 960
    FRAME_H = 1450
    created_frames = []

    print("[3/5] Membangun 8 Layar Wireframe Master sesuai Layout Aktual PMBGM...")

    # =========================================================================
    # ROW 1, COL 0: 01. Beranda Utama (Landing Page)
    # =========================================================================
    fx, fy = 80, 100
    create_node("text", "Title 01", fx, fy - 35, text="Landing Page", props={"fontSize": 18, "fill": C_DARK})
    f1 = create_node("frame", "01. Landing Page", fx, fy, FRAME_W, FRAME_H, props={"fill": C_FRAME_BG, "stroke": C_BORDER, "strokeWeight": 1})
    created_frames.append(f1)
    draw_navbar(f1, "Beranda")

    # Hero Google-Style Portal
    create_node("text", "Hero Brand", 380, 110, parent=f1, text="PMBGM", props={"fontSize": 52, "fill": C_DARK})
    create_node("text", "Hero Sub", 370, 175, parent=f1, text="PEMANTAU MBG MASYARAKAT", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    # Google Search Bar
    draw_input(f1, "Google Search", 220, 210, 520, 50, "🔍   Cari sekolah, dapur SPPG, atau kode tiket...", corner=25)
    # 2 CTA Buttons
    draw_button(f1, "Btn Buat Lapor", 330, 275, 140, 40, "Buat Laporan", variant="primary")
    draw_button(f1, "Btn Lacak", 485, 275, 140, 40, "Lacak Tiket", variant="outline")
    # Stat Pill
    create_node("rectangle", "Stat Pill", 340, 335, 280, 28, parent=f1, props={"fill": "#FAFAFA", "stroke": C_DIVIDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "Stat Text", 355, 342, parent=f1, text="● 165 Sekolah  ·  40 Dapur SPPG  ·  📞 119", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # Video Explainer Placeholder
    draw_video_box(f1, "Hero Video", 120, 390, 720, 280)
    create_node("text", "Vid Caption", 320, 680, parent=f1, text="Video Simulasi Alur Pengawasan & Uji Sampel MBG", props={"fontSize": 12, "fill": C_TEXT_MUTED})

    # 4-Column Card Grid (Pilar Pengawasan)
    create_node("text", "Section Title 4Pilar", 40, 725, parent=f1, text="4 Pilar Pengawasan Partisipatif", props={"fontSize": 16, "fill": C_DARK})
    pilar_items = [
        ("1. Lapor Mandiri", "Orang tua murid dan guru mengunggah keluhan menu & foto bukti kejadian."),
        ("2. Verifikasi Berlapis", "Pemeriksaan integritas EXIF dan penilaian koherensi teks dengan AI MLP."),
        ("3. SLA Respon Cepat", "Kasus dialirkan otomatis ke Dapur SPPG & Dinkes dengan batas jam ketat."),
        ("4. Transparansi SAW", "Perhitungan indeks risiko SAW untuk audit prioritas berkala.")
    ]
    cx = 40
    for idx, (p_title, p_desc) in enumerate(pilar_items):
        create_node("rectangle", f"Card BG {idx}", cx, 755, 205, 230, parent=f1, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
        draw_image_box(f1, f"Card Img {idx}", cx, 755, 205, 120)
        create_node("text", f"Card Tit {idx}", cx + 12, 888, parent=f1, text=p_title, props={"fontSize": 13, "fill": C_DARK})
        create_node("text", f"Card Desc {idx}", cx + 12, 912, width=180, parent=f1, text=p_desc, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        cx += 225

    # 3-Column Recent Cases Grid
    create_node("text", "Section Title Feed", 40, 1025, parent=f1, text="Kasus Terkini & Live Tracker Feed", props={"fontSize": 16, "fill": C_DARK})
    feed_items = [
        ("#PMBGM-2026-X89K", "Porsi Lauk Kurang", "SD Negeri Tembalang 01", "DIPROSES", "Sisa SLA: 14 Jam"),
        ("#PMBGM-2026-X88P", "Wadah Berminyak", "SMP Negeri 08 Semarang", "SELESAI", "Tuntas dalam 8 Jam"),
        ("#PMBGM-2026-X87M", "Indikasi Sayur Asam", "SD Sendangmulyo 02", "INVESTIGASI", "Tenggat Lab: 2 Jam")
    ]
    fx_item = 40
    for idx, (code, title, school, badge, sla_info) in enumerate(feed_items):
        create_node("rectangle", f"Feed BG {idx}", fx_item, 1055, 280, 180, parent=f1, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
        create_node("text", f"FCode {idx}", fx_item + 14, 1072, parent=f1, text=code, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("rectangle", f"FBadge {idx}", fx_item + 195, 1068, 70, 20, parent=f1, props={"fill": C_DARK, "cornerRadius": 3})
        create_node("text", f"FBadgeTxt {idx}", fx_item + 203, 1072, parent=f1, text=badge, props={"fontSize": 9, "fill": "#FFFFFF"})
        create_node("text", f"FTit {idx}", fx_item + 14, 1098, parent=f1, text=title, props={"fontSize": 13, "fill": C_DARK})
        create_node("text", f"FSch {idx}", fx_item + 14, 1120, parent=f1, text=school, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        # Progress Bar SLA
        create_node("rectangle", f"FSlaBg {idx}", fx_item + 14, 1155, 252, 6, parent=f1, props={"fill": "#E4E4E7", "cornerRadius": 3})
        create_node("rectangle", f"FSlaBar {idx}", fx_item + 14, 1155, 140, 6, parent=f1, props={"fill": C_DARK, "cornerRadius": 3})
        create_node("text", f"FSlaTxt {idx}", fx_item + 14, 1170, parent=f1, text=sla_info, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        fx_item += 300

    # Avatars Section (Textbook UX Wireframe convention)
    create_node("text", "Tim Header", 40, 1270, parent=f1, text="Dukungan Partisipasi Warga, Tim Medis, & Komite Sekolah", props={"fontSize": 14, "fill": C_DARK})
    draw_avatar(f1, "Av1", 420, 1330, 24)
    draw_avatar(f1, "Av2", 480, 1330, 24)
    draw_avatar(f1, "Av3", 540, 1330, 24)
    draw_footer(f1, 1400)
    print(" -> Screen 01: Landing Page selesai.")

    # =========================================================================
    # ROW 1, COL 1: 02. Formulir Pelaporan (/lapor)
    # =========================================================================
    fx, fy = 1140, 100
    create_node("text", "Title 02", fx, fy - 35, text="Lapor Masalah", props={"fontSize": 18, "fill": C_DARK})
    f2 = create_node("frame", "02. Formulir Pelaporan", fx, fy, FRAME_W, FRAME_H, props={"fill": C_FRAME_BG, "stroke": C_BORDER, "strokeWeight": 1})
    created_frames.append(f2)
    draw_navbar(f2, "Lapor")

    # Header
    create_node("text", "Lapor Header", 40, 80, parent=f2, text="Formulir Pelaporan Masalah MBG", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "Lapor Sub", 40, 110, parent=f2, text="Laporkan ketidaksesuaian porsi, mutu, atau kebersihan makanan untuk ditindaklanjuti.", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    draw_button(f2, "Btn Panduan", 800, 85, 120, 36, "📖 Panduan", variant="outline")

    # 5-Langkah Stepper Bar
    steps = [("1. Sekolah", True), ("2. Masalah", False), ("3. Cerita", False), ("4. Bukti", False), ("5. Kirim", False)]
    st_x = 40
    for idx, (st_name, st_act) in enumerate(steps):
        bg = C_DARK if st_act else "#F4F4F5"
        txt_col = "#FFFFFF" if st_act else C_TEXT_MUTED
        create_node("rectangle", f"Step Box {idx}", st_x, 145, 168, 36, parent=f2, props={"fill": bg, "cornerRadius": 4})
        create_node("text", f"Step Txt {idx}", st_x + 50, 156, parent=f2, text=st_name, props={"fontSize": 12, "fill": txt_col})
        st_x += 178

    # Form 2-Column Split
    # Left Column: Form Controls (w: 520)
    create_node("text", "Field1 Label", 40, 210, parent=f2, text="Sekolah Penerima MBG *", props={"fontSize": 13, "fill": C_DARK})
    draw_input(f2, "Input Sekolah", 40, 235, 520, 44, "Cari nama sekolah (contoh: SD Negeri Tembalang 01)...")

    create_node("text", "Field2 Label", 40, 295, parent=f2, text="Kategori Masalah *", props={"fontSize": 13, "fill": C_DARK})
    chips = ["Porsi Kurang", "Makanan Basi", "Benda Asing", "Wadah Kotor", "Distribusi Telat", "Darurat Medis"]
    ch_x, ch_y = 40, 320
    for c_idx, chip in enumerate(chips):
        is_sel = (c_idx == 0)
        c_bg = C_DARK if is_sel else "#FFFFFF"
        c_txt = "#FFFFFF" if is_sel else C_DARK
        c_w = len(chip) * 8 + 24
        create_node("rectangle", f"Chip {c_idx}", ch_x, ch_y, c_w, 32, parent=f2, props={"fill": c_bg, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
        create_node("text", f"ChipTxt {c_idx}", ch_x + 12, ch_y + 8, parent=f2, text=chip, props={"fontSize": 11, "fill": c_txt})
        ch_x += c_w + 10
        if ch_x > 450:
            ch_x = 40
            ch_y += 40

    create_node("text", "Field3 Label", 40, 415, parent=f2, text="Waktu & Sesi Pembagian Makanan", props={"fontSize": 13, "fill": C_DARK})
    draw_input(f2, "Input Waktu", 40, 440, 250, 44, "2026-11-04  10:30 WIB")
    draw_input(f2, "Input Jumlah", 310, 440, 250, 44, "Perkiraan 35 siswa terdampak")

    create_node("text", "Field4 Label", 40, 505, parent=f2, text="Cerita & Kronologi Lengkap *", props={"fontSize": 13, "fill": C_DARK})
    create_node("rectangle", "Input Deskripsi", 40, 530, 520, 120, parent=f2, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "Desc Place", 56, 545, width=480, parent=f2, text="Ceritakan temuan makanan secara jelas: bau, rasa, penampakan menu, atau keluhan siswa...", props={"fontSize": 12, "fill": C_TEXT_LIGHT})

    create_node("text", "Field5 Label", 40, 670, parent=f2, text="Mode Kerahasiaan Identitas Pelapor", props={"fontSize": 13, "fill": C_DARK})
    modes = [("Rahasia (Rekomendasi)", "Nama hanya dibuka ke verifikator."), ("Publik", "Nama ditampilkan di feed kasus."), ("Anonim", "Data identitas disamarkan total.")]
    m_x = 40
    for idx, (m_tit, m_sub) in enumerate(modes):
        is_m_sel = (idx == 0)
        m_border = C_DARK if is_m_sel else C_BORDER
        create_node("rectangle", f"Mode Box {idx}", m_x, 695, 166, 75, parent=f2, props={"fill": "#FFFFFF", "stroke": m_border, "strokeWeight": 1, "cornerRadius": 4})
        create_node("text", f"Mode Tit {idx}", m_x + 10, 708, parent=f2, text=m_tit, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"Mode Sub {idx}", m_x + 10, 730, width=145, parent=f2, text=m_sub, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        m_x += 177

    # Right Column: Upload Bukti Foto Dropzone (w: 340)
    create_node("text", "Dropzone Title", 580, 210, parent=f2, text="Unggah Bukti Foto Menu (Wajib) *", props={"fontSize": 13, "fill": C_DARK})
    draw_image_box(f2, "Photo Dropzone", 580, 235, 340, 310)
    # Centered Camera icon & instructions inside dropzone
    create_node("rectangle", "Cam Box", 725, 345, 50, 40, parent=f2, props={"fill": C_DARK, "cornerRadius": 6})
    create_node("text", "Cam Text", 737, 356, parent=f2, text="📷", props={"fontSize": 16, "fill": "#FFFFFF"})
    create_node("text", "Drop Help 1", 640, 405, parent=f2, text="Tarik foto menu ke sini atau klik ambil foto", props={"fontSize": 12, "fill": C_DARK})
    create_node("text", "Drop Help 2", 615, 428, width=270, parent=f2, text="Sistem mengekstrak otomatis timestamp & GPS EXIF kamera.", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    draw_button(f2, "Btn Pilih File", 680, 465, 140, 36, "Pilih Berkas Foto", variant="outline")

    # Exif Info Card
    create_node("rectangle", "Exif Box", 580, 565, 340, 85, parent=f2, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "Exif Tit", 595, 578, parent=f2, text="ℹ️ Verifikasi Bukti Kamera Asli", props={"fontSize": 11, "fill": C_DARK})
    create_node("text", "Exif Desc", 595, 600, width=310, parent=f2, text="Foto yang diambil langsung di lokasi akan mendapat skor kepercayaan AI lebih tinggi untuk percepatan penanganan.", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    # Action Buttons
    create_node("rectangle", "Action Divider", 40, 800, 880, 1, parent=f2, props={"fill": C_DIVIDER})
    draw_button(f2, "Btn Reset Form", 40, 825, 120, 44, "Batal / Reset", variant="outline")
    draw_button(f2, "Btn Submit Lapor", 740, 825, 180, 44, "Lanjut ke Bukti →", variant="primary")
    draw_footer(f2, 1400)
    print(" -> Screen 02: Formulir Pelaporan selesai.")

    # =========================================================================
    # ROW 1, COL 2: 03. Pelacakan Kasus & SLA (/lacak)
    # =========================================================================
    fx, fy = 2200, 100
    create_node("text", "Title 03", fx, fy - 35, text="Lacak Kasus", props={"fontSize": 18, "fill": C_DARK})
    f3 = create_node("frame", "03. Pelacakan Kasus", fx, fy, FRAME_W, FRAME_H, props={"fill": C_FRAME_BG, "stroke": C_BORDER, "strokeWeight": 1})
    created_frames.append(f3)
    draw_navbar(f3, "Lacak")

    # Top Search Card
    create_node("rectangle", "Search Card BG", 40, 80, 880, 130, parent=f3, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "Search Card Tit", 65, 102, parent=f3, text="Cek Status Pengaduan Anda", props={"fontSize": 18, "fill": C_DARK})
    create_node("text", "Search Card Sub", 65, 128, parent=f3, text="Masukkan kode tiket unik yang didapatkan saat melapor untuk memantau status secara langsung.", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    draw_input(f3, "Input Cek Tiket", 65, 152, 600, 42, "Ketik kode tiket (contoh: MBG-2026-X89K)...")
    draw_button(f3, "Btn Lacak Submit", 680, 152, 120, 42, "Lacak Kasus", variant="primary")

    # Tabs & Filters
    create_node("text", "Tab1", 40, 235, parent=f3, text="Kasus Terbaru di Wilayah", props={"fontSize": 14, "fill": C_DARK})
    create_node("rectangle", "TabLine", 40, 258, 160, 2, parent=f3, props={"fill": C_DARK})
    create_node("text", "Tab2", 230, 235, parent=f3, text="Akuntabilitas SLA Wilayah", props={"fontSize": 14, "fill": C_TEXT_MUTED})

    # Filter Bar
    create_node("rectangle", "Filter Box", 40, 275, 880, 42, parent=f3, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "FTime Label", 55, 288, parent=f3, text="Waktu:", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    draw_button(f3, "FTime1", 105, 281, 60, 28, "Semua", variant="primary")
    draw_button(f3, "FTime2", 175, 281, 60, 28, "7 Hari", variant="outline")
    draw_button(f3, "FTime3", 245, 281, 60, 28, "30 Hari", variant="outline")
    create_node("text", "FStat Label", 350, 288, parent=f3, text="Status:", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    draw_button(f3, "FStat1", 400, 281, 65, 28, "Semua", variant="primary")
    draw_button(f3, "FStat2", 475, 281, 75, 28, "Diproses", variant="outline")
    draw_button(f3, "FStat3", 560, 281, 65, 28, "Selesai", variant="outline")

    # 4 Detailed Case Cards
    detailed_cases = [
        ("#PMBGM-2026-X89K", "Porsi Lauk Kurang & Nasi Keras", "SD Negeri Tembalang 01", "DIPROSES", 0.45, "Sisa SLA: 14 Jam 20 Menit"),
        ("#PMBGM-2026-X88P", "Sayur Basi dan Berbau Masam", "SMP Negeri 08 Semarang", "SELESAI", 1.0, "Tuntas Teratasi dalam 8 Jam"),
        ("#PMBGM-2026-X87M", "Indikasi 3 Siswa Mual Usai Makan", "SD Sendangmulyo 02", "INVESTIGASI", 0.70, "Tenggat Uji Lab Dinkes: 2 Jam"),
        ("#PMBGM-2026-X86K", "Wadah Makanan Berminyak", "SD Negeri Banyumanik 03", "SELESAI", 1.0, "Penggantian Wadah Standar Baru")
    ]
    grid_coords = [(40, 335), (495, 335), (40, 580), (495, 580)]
    for idx, (code, title, school, status, progress, sla_txt) in enumerate(detailed_cases):
        gx, gy = grid_coords[idx]
        create_node("rectangle", f"DCard BG {idx}", gx, gy, 425, 225, parent=f3, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
        # Thumbnail image box on top right
        draw_image_box(f3, f"DThumb {idx}", gx + 310, gy + 16, 95, 75)
        create_node("text", f"DCode {idx}", gx + 18, gy + 18, parent=f3, text=code, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        # Status Badge
        create_node("rectangle", f"DBadge {idx}", gx + 140, gy + 14, 85, 22, parent=f3, props={"fill": C_DARK, "cornerRadius": 3})
        create_node("text", f"DBadgeTxt {idx}", gx + 150, gy + 18, parent=f3, text=status, props={"fontSize": 10, "fill": "#FFFFFF"})
        create_node("text", f"DTit {idx}", gx + 18, gy + 45, width=280, parent=f3, text=title, props={"fontSize": 14, "fill": C_DARK})
        create_node("text", f"DSch {idx}", gx + 18, gy + 72, parent=f3, text=f"🏫 {school}", props={"fontSize": 11, "fill": C_TEXT_MUTED})
        # Timeline Mini
        create_node("rectangle", f"DDiv {idx}", gx + 18, gy + 105, 385, 1, parent=f3, props={"fill": C_DIVIDER})
        create_node("text", f"DStep1 {idx}", gx + 18, gy + 120, parent=f3, text="Lapor ✓", props={"fontSize": 10, "fill": C_DARK})
        create_node("text", f"DStep2 {idx}", gx + 85, gy + 120, parent=f3, text="Verif ✓", props={"fontSize": 10, "fill": C_DARK})
        create_node("text", f"DStep3 {idx}", gx + 150, gy + 120, parent=f3, text="Tindak Lanjut", props={"fontSize": 10, "fill": C_DARK if progress > 0.5 else C_TEXT_MUTED})
        create_node("text", f"DStep4 {idx}", gx + 250, gy + 120, parent=f3, text="Selesai", props={"fontSize": 10, "fill": C_DARK if progress >= 1.0 else C_TEXT_MUTED})
        # SLA Meter
        create_node("rectangle", f"DSlaBg {idx}", gx + 18, gy + 150, 385, 8, parent=f3, props={"fill": "#E4E4E7", "cornerRadius": 4})
        create_node("rectangle", f"DSlaBar {idx}", gx + 18, gy + 150, int(385 * progress), 8, parent=f3, props={"fill": C_DARK, "cornerRadius": 4})
        create_node("text", f"DSlaTxt {idx}", gx + 18, gy + 172, parent=f3, text=f"⏱️ {sla_txt}", props={"fontSize": 11, "fill": C_TEXT_MUTED})
        draw_button(f3, f"Btn Detail {idx}", gx + 300, gy + 185, 105, 28, "Lihat Tiket →", variant="outline")

    # Detail Single Case Inspection Mockup
    create_node("text", "Detail Live Header", 40, 835, parent=f3, text="Pratinjau Status Real-Time Kasus Terpilih (#PMBGM-2026-X89K)", props={"fontSize": 16, "fill": C_DARK})
    create_node("rectangle", "Live Case Box", 40, 865, 880, 220, parent=f3, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    steps_v = [
        ("Laporan Diterima", "10:30 WIB · Foto & kronologi berhasil dicatat sistem.", True),
        ("Diverifikasi AI & Petugas", "11:15 WIB · Keaslian foto valid (skor 0.94).", True),
        ("Diteruskan ke SPPG & Dinkes", "11:45 WIB · SPPG Tembalang 01 diwajibkan respons dalam 18 jam.", True),
        ("Penyelesaian & Audit Akhir", "Menunggu berita acara perbaikan menu.", False)
    ]
    vy = 885
    for s_idx, (v_t, v_d, v_done) in enumerate(steps_v):
        v_col = C_DARK if v_done else "#D1D5DB"
        create_node("ellipse", f"VCir {s_idx}", 65, vy + 2, 14, 14, parent=f3, props={"fill": v_col})
        create_node("text", f"VTit {s_idx}", 95, vy, parent=f3, text=v_t, props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"VDesc {s_idx}", 95, vy + 18, parent=f3, text=v_d, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        vy += 48
    draw_footer(f3, 1400)
    print(" -> Screen 03: Pelacakan Kasus selesai.")

    # =========================================================================
    # ROW 1, COL 3: 04. Direktori Sekolah (/cari-sekolah)
    # =========================================================================
    fx, fy = 3260, 100
    create_node("text", "Title 04", fx, fy - 35, text="Cari Sekolah", props={"fontSize": 18, "fill": C_DARK})
    f4 = create_node("frame", "04. Direktori Sekolah", fx, fy, FRAME_W, FRAME_H, props={"fill": C_FRAME_BG, "stroke": C_BORDER, "strokeWeight": 1})
    created_frames.append(f4)
    draw_navbar(f4, "Beranda")

    # Header
    create_node("text", "Sch Header", 40, 80, parent=f4, text="Direktori 165 Sekolah & Dapur Mitra SPPG", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "Sch Sub", 40, 110, parent=f4, text="Cari data sekolah penerima MBG, dapur penyuplai, dan riwayat pemantauan di Kota Semarang.", props={"fontSize": 12, "fill": C_TEXT_MUTED})

    # Search & Filter Row
    draw_input(f4, "Search Sch", 40, 145, 420, 42, "Ketik nama sekolah atau nomor NPSN...")
    draw_input(f4, "Drop Kec", 480, 145, 180, 42, "Semua Kecamatan ⌄")
    draw_input(f4, "Drop Jenjang", 680, 145, 140, 42, "Jenjang: Semua ⌄")
    draw_button(f4, "Btn Filter Sch", 840, 145, 80, 42, "Cari", variant="primary")

    # 3x2 Grid of School Cards
    schools = [
        ("SD Negeri Tembalang 01", "NPSN: 20328912 · Kec. Tembalang", "SPPG Tembalang 01", "SLHS Terverifikasi ✓", "Aman"),
        ("SMP Negeri 08 Semarang", "NPSN: 20328841 · Kec. Candisari", "SPPG Candisari 02", "SLHS Terverifikasi ✓", "Aman"),
        ("SD Sendangmulyo 02", "NPSN: 20328905 · Kec. Tembalang", "SPPG Tembalang 01", "SLHS Terverifikasi ✓", "Perlu Pantau"),
        ("SD Negeri Banyumanik 03", "NPSN: 20328760 · Kec. Banyumanik", "SPPG Banyumanik 01", "SLHS Terverifikasi ✓", "Aman"),
        ("SMP Negeri 02 Semarang", "NPSN: 20328835 · Kec. Semarang Tengah", "SPPG Tengah 01", "SLHS Terverifikasi ✓", "Aman"),
        ("SD Pedurungan Kidul 01", "NPSN: 20328955 · Kec. Pedurungan", "SPPG Pedurungan 02", "SLHS Terverifikasi ✓", "Aman")
    ]
    s_positions = [
        (40, 215), (345, 215), (650, 215),
        (40, 495), (345, 495), (650, 495)
    ]
    for idx, (s_name, s_npsn, s_sppg, s_slhs, s_risk) in enumerate(schools):
        sx, sy = s_positions[idx]
        create_node("rectangle", f"SCard BG {idx}", sx, sy, 275, 250, parent=f4, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
        draw_image_box(f4, f"SCard Img {idx}", sx, sy, 275, 125)
        create_node("text", f"STit {idx}", sx + 14, sy + 138, parent=f4, text=s_name, props={"fontSize": 13, "fill": C_DARK})
        create_node("text", f"SNpsn {idx}", sx + 14, sy + 158, parent=f4, text=s_npsn, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        # Badges
        create_node("rectangle", f"SBadge1 {idx}", sx + 14, sy + 180, 130, 20, parent=f4, props={"fill": "#F4F4F5", "cornerRadius": 3})
        create_node("text", f"SB1Txt {idx}", sx + 20, sy + 184, parent=f4, text=s_sppg, props={"fontSize": 9, "fill": C_DARK})
        create_node("rectangle", f"SBadge2 {idx}", sx + 150, sy + 180, 110, 20, parent=f4, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 3})
        create_node("text", f"SB2Txt {idx}", sx + 156, sy + 184, parent=f4, text=s_slhs, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        # Link
        draw_button(f4, f"SBtn {idx}", sx + 14, sy + 210, 247, 28, "Lihat Detail Sekolah →", variant="outline")

    # Detail Profile Box
    create_node("text", "Detail Sch Section", 40, 780, parent=f4, text="Pratinjau Keterhubungan Dapur & Distribusi (SD Negeri Tembalang 01)", props={"fontSize": 16, "fill": C_DARK})
    create_node("rectangle", "Sch Detail Box", 40, 810, 880, 260, parent=f4, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    # Left: Map Placeholder
    draw_image_box(f4, "Sch Map Img", 60, 830, 360, 220)
    create_node("text", "Map Label", 130, 930, parent=f4, text="Peta Radius & Rute Distribusi Dapur", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    # Right: Summary Stats
    create_node("text", "SD Info 1", 450, 840, parent=f4, text="Informasi Kemitraan MBG:", props={"fontSize": 14, "fill": C_DARK})
    create_node("text", "SD Info 2", 450, 870, parent=f4, text="• Penerima Manfaat: 450 Siswa (Kelas 1 - 6)", props={"fontSize": 12, "fill": C_DARK})
    create_node("text", "SD Info 3", 450, 895, parent=f4, text="• Dapur Penyuplai: SPPG Tembalang 01 (Jarak 2.4 KM)", props={"fontSize": 12, "fill": C_DARK})
    create_node("text", "SD Info 4", 450, 920, parent=f4, text="• Jam Terima Makanan: 10:15 WIB (Standar SLA: Maksimal 10:30 WIB)", props={"fontSize": 12, "fill": C_DARK})
    create_node("text", "SD Info 5", 450, 945, parent=f4, text="• Status Kepatuhan: 100% Bebas Insiden Keracunan", props={"fontSize": 12, "fill": C_DARK})
    draw_button(f4, "Btn Lapor Khusus", 450, 985, 220, 40, "📢 Laporkan Menu Sekolah Ini", variant="primary")
    draw_footer(f4, 1400)
    print(" -> Screen 04: Cari Sekolah selesai.")

    # =========================================================================
    # ROW 2, COL 0: 05. Portal Data Terbuka (/data)
    # =========================================================================
    fx, fy = 80, 1650
    create_node("text", "Title 05", fx, fy - 35, text="Data Terbuka", props={"fontSize": 18, "fill": C_DARK})
    f5 = create_node("frame", "05. Data Terbuka", fx, fy, FRAME_W, FRAME_H, props={"fill": C_FRAME_BG, "stroke": C_BORDER, "strokeWeight": 1})
    created_frames.append(f5)
    draw_navbar(f5, "Data")

    # Header
    create_node("text", "Data Header", 40, 80, parent=f5, text="Portal Data Terbuka Program MBG 2026", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "Data Sub", 40, 110, parent=f5, text="Transparansi anggaran, serapan realisasi, dan profil 40 unit dapur penyedia gizi.", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    draw_button(f5, "Btn Unduh Data", 780, 85, 140, 36, "⬇️ Unduh CSV / API", variant="outline")

    # 4 Metric Tiles Row
    tiles = [
        ("Pagu Anggaran", "Rp 142,5 M", "Pagu Alokasi MBG 2026"),
        ("Realisasi Terserap", "Rp 98,2 M", "68.9% Serapan Berjalan"),
        ("Siswa Penerima", "84.210", "Siswa SD & SMP Terdaftar"),
        ("Dapur SPPG", "40 Unit", "Dapur Aktif Teraudit")
    ]
    tx = 40
    for idx, (t_lbl, t_val, t_sub) in enumerate(tiles):
        create_node("rectangle", f"Tile BG {idx}", tx, 145, 205, 90, parent=f5, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
        create_node("text", f"TLbl {idx}", tx + 14, 160, parent=f5, text=t_lbl, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("text", f"TVal {idx}", tx + 14, 182, parent=f5, text=t_val, props={"fontSize": 20, "fill": C_DARK})
        create_node("text", f"TSub {idx}", tx + 14, 212, parent=f5, text=t_sub, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        tx += 225

    # 2 Analytical Chart Placeholders
    create_node("text", "Chart1 Tit", 40, 260, parent=f5, text="Realisasi vs Pagu Anggaran per Bulan", props={"fontSize": 14, "fill": C_DARK})
    draw_image_box(f5, "Chart1 Box", 40, 285, 520, 240)
    create_node("text", "Chart1 Mock", 180, 395, parent=f5, text="Grafik Komparasi Batang Realisasi Bulanan", props={"fontSize": 12, "fill": C_TEXT_MUTED})

    create_node("text", "Chart2 Tit", 580, 260, parent=f5, text="Tren Pertumbuhan Siswa Penerima", props={"fontSize": 14, "fill": C_DARK})
    draw_image_box(f5, "Chart2 Box", 580, 285, 340, 240)
    create_node("text", "Chart2 Mock", 660, 395, parent=f5, text="Grafik Garis Tren Penerima", props={"fontSize": 12, "fill": C_TEXT_MUTED})

    # Table: Direktori SPPG & Kinerja Wilayah
    create_node("text", "Table Tit", 40, 555, parent=f5, text="Rekapitulasi 40 Dapur SPPG & Tingkat Kepatuhan SLHS", props={"fontSize": 16, "fill": C_DARK})
    create_node("rectangle", "Table Base", 40, 585, 880, 320, parent=f5, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    # Table Header Row
    create_node("rectangle", "TH BG", 40, 585, 880, 40, parent=f5, props={"fill": "#F4F4F5"})
    create_node("text", "TH Col1", 55, 598, parent=f5, text="KODE DAPUR", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "TH Col2", 160, 598, parent=f5, text="NAMA DAPUR SPPG", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "TH Col3", 360, 598, parent=f5, text="KECAMATAN", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "TH Col4", 500, 598, parent=f5, text="PORSI / HARI", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "TH Col5", 620, 598, parent=f5, text="STATUS SLHS", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "TH Col6", 750, 598, parent=f5, text="SKOR SAW", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "TH Col7", 850, 598, parent=f5, text="AKSI", props={"fontSize": 10, "fill": C_DARK})

    table_rows = [
        ("SPPG-TB-01", "SPPG Tembalang 01", "Tembalang", "3.500 Porsi", "Terverifikasi ✓", "0.312 (Rendah)", "[Lihat Profil]"),
        ("SPPG-CD-02", "SPPG Candisari 02", "Candisari", "2.800 Porsi", "Terverifikasi ✓", "0.450 (Sedang)", "[Lihat Profil]"),
        ("SPPG-GS-01", "SPPG Gayamsari 01", "Gayamsari", "4.200 Porsi", "Kedaluwarsa ⚠️", "0.880 (Tinggi)", "[Audit Khusus]"),
        ("SPPG-BM-01", "SPPG Banyumanik 01", "Banyumanik", "3.000 Porsi", "Terverifikasi ✓", "0.285 (Rendah)", "[Lihat Profil]"),
        ("SPPG-TG-01", "SPPG Tengah 01", "Semarang Tengah", "3.800 Porsi", "Terverifikasi ✓", "0.340 (Rendah)", "[Lihat Profil]")
    ]
    r_y = 625
    for idx, (c1, c2, c3, c4, c5, c6, c7) in enumerate(table_rows):
        create_node("rectangle", f"TR BG {idx}", 40, r_y, 880, 48, parent=f5, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
        create_node("text", f"TD1 {idx}", 55, r_y + 16, parent=f5, text=c1, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("text", f"TD2 {idx}", 160, r_y + 16, parent=f5, text=c2, props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"TD3 {idx}", 360, r_y + 16, parent=f5, text=c3, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("text", f"TD4 {idx}", 500, r_y + 16, parent=f5, text=c4, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"TD5 {idx}", 620, r_y + 16, parent=f5, text=c5, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"TD6 {idx}", 750, r_y + 16, parent=f5, text=c6, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"TD7 {idx}", 850, r_y + 16, parent=f5, text=c7, props={"fontSize": 11, "fill": C_DARK})
        r_y += 48
    draw_footer(f5, 1400)
    print(" -> Screen 05: Data Terbuka selesai.")

    # =========================================================================
    # ROW 2, COL 1: 06. Insight & Prioritas SAW (/insight/prioritas)
    # =========================================================================
    fx, fy = 1140, 1650
    create_node("text", "Title 06", fx, fy - 35, text="Insight & Prioritas SAW", props={"fontSize": 18, "fill": C_DARK})
    f6 = create_node("frame", "06. Insight Prioritas SAW", fx, fy, FRAME_W, FRAME_H, props={"fill": C_FRAME_BG, "stroke": C_BORDER, "strokeWeight": 1})
    created_frames.append(f6)
    draw_navbar(f6, "Insight")

    # Header
    create_node("text", "Insight Header", 40, 80, parent=f6, text="Prioritas Inspeksi Dapur SPPG (Metode SAW)", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "Insight Sub", 40, 110, parent=f6, text="Sistem Pendukung Keputusan (DSS) perankingan audit berdasarkan 5 kriteria risiko terbobot.", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    draw_button(f6, "Btn Rumus", 780, 85, 140, 36, "📐 Rumus & Bobot", variant="outline")

    # Bobot 5 Kriteria Pills
    saw_crits = [("C1: Verifikasi", "25%"), ("C2: Keracunan", "30%"), ("C3: Status SLHS", "20%"), ("C4: Deviasi SLA", "15%"), ("C5: Kepuasan", "10%")]
    sc_x = 40
    for idx, (c_name, c_wt) in enumerate(saw_crits):
        create_node("rectangle", f"SawCrit {idx}", sc_x, 145, 168, 40, parent=f6, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
        create_node("text", f"SCN {idx}", sc_x + 12, 153, parent=f6, text=c_name, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("text", f"SCW {idx}", sc_x + 12, 168, parent=f6, text=f"Bobot: {c_wt}", props={"fontSize": 11, "fill": C_DARK})
        sc_x += 178

    # Early Warning Sinyal KLB Alert Banner
    create_node("rectangle", "Alert Box", 40, 205, 880, 75, parent=f6, props={"fill": "#FAFAFA", "stroke": C_DARK, "strokeWeight": 1.5, "cornerRadius": 4})
    create_node("text", "Alert Tit", 60, 218, parent=f6, text="⚠️ Sinyal Peringatan Dini Deteksi Kejadian Luar Biasa (KLB)", props={"fontSize": 13, "fill": C_DARK})
    create_node("text", "Alert Desc", 60, 240, width=830, parent=f6, text="Terdeteksi klaster 2 laporan dengan gejala serupa di wilayah Tembalang dalam 6 jam terakhir. Rekomendasi isolasi menu & pengujian laboratorium darurat oleh Dinas Kesehatan.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # 3 Ranked Priority Cards
    create_node("text", "Rank Tit", 40, 305, parent=f6, text="Hasil Perankingan Nilai Preferensi Vi (Dapur Perlu Audit):", props={"fontSize": 16, "fill": C_DARK})
    rank_cards = [
        ("PRIORITAS 1 (RISIKO TINGGI)", "SPPG Gayamsari 01", "0.880", "Kec. Gayamsari", "Kasus keracunan terlaporkan & SLHS kedaluwarsa.", True),
        ("PRIORITAS 2 (RISIKO SEDANG)", "SPPG Candisari 02", "0.640", "Kec. Candisari", "Deviasi SLA berulang 2 kali dalam penyelesaian keluhan.", False),
        ("PRIORITAS 3 (RISIKO RENDAH)", "SPPG Banyumanik 01", "0.285", "Kec. Banyumanik", "Kepatuhan SLA 99.2% dan sertifikasi SLHS valid.", False)
    ]
    rc_x = 40
    for idx, (p_tag, p_name, p_vi, p_kec, p_reas, is_crit) in enumerate(rank_cards):
        create_node("rectangle", f"RCard BG {idx}", rc_x, 335, 275, 280, parent=f6, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
        # Tag header
        tag_bg = C_DARK if is_crit else "#F4F4F5"
        tag_col = "#FFFFFF" if is_crit else C_DARK
        create_node("rectangle", f"RTag {idx}", rc_x, 335, 275, 32, parent=f6, props={"fill": tag_bg})
        create_node("text", f"RTagTxt {idx}", rc_x + 14, 344, parent=f6, text=p_tag, props={"fontSize": 10, "fill": tag_col})
        create_node("text", f"RName {idx}", rc_x + 14, 380, parent=f6, text=p_name, props={"fontSize": 14, "fill": C_DARK})
        create_node("text", f"RKec {idx}", rc_x + 14, 402, parent=f6, text=p_kec, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        # Vi Score Card
        create_node("rectangle", f"ViBox {idx}", rc_x + 14, 428, 247, 50, parent=f6, props={"fill": "#FAFAFA", "stroke": C_DIVIDER, "strokeWeight": 1, "cornerRadius": 4})
        create_node("text", f"ViLbl {idx}", rc_x + 24, 436, parent=f6, text="Nilai Preferensi SAW (Vi)", props={"fontSize": 10, "fill": C_TEXT_MUTED})
        create_node("text", f"ViVal {idx}", rc_x + 24, 452, parent=f6, text=f"Vi = {p_vi}", props={"fontSize": 16, "fill": C_DARK})
        create_node("text", f"RReas {idx}", rc_x + 14, 492, width=245, parent=f6, text=p_reas, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        draw_button(f6, f"RBtn {idx}", rc_x + 14, 560, 247, 36, "Tugaskan Tim Audit →", variant="primary" if is_crit else "outline")
        rc_x += 300

    # Decision Matrix Table
    create_node("text", "Matrix Tit", 40, 645, parent=f6, text="Tabel Matriks Normalisasi SAW (Rij):", props={"fontSize": 14, "fill": C_DARK})
    draw_image_box(f6, "Matrix Mock", 40, 675, 880, 200)
    create_node("text", "Matrix Text", 320, 770, parent=f6, text="Tabel Matriks Keputusan R11 - R40 Terhitung Otomatis", props={"fontSize": 13, "fill": C_TEXT_MUTED})
    draw_footer(f6, 1400)
    print(" -> Screen 06: Insight Prioritas SAW selesai.")

    # =========================================================================
    # ROW 2, COL 2: 07. Panel Verifikator + Radar AI (/panel/verifikasi)
    # =========================================================================
    fx, fy = 2200, 1650
    create_node("text", "Title 07", fx, fy - 35, text="Panel Verifikator", props={"fontSize": 18, "fill": C_DARK})
    f7 = create_node("frame", "07. Panel Verifikator", fx, fy, FRAME_W, FRAME_H, props={"fill": C_FRAME_BG, "stroke": C_BORDER, "strokeWeight": 1})
    created_frames.append(f7)

    # Sidebar Navigation (w: 220, h: 1450)
    create_node("rectangle", "Side Base", 0, 0, 220, FRAME_H, parent=f7, props={"fill": "#FAFAFA", "stroke": C_DIVIDER, "strokeWeight": 1})
    create_node("text", "Side Brand", 24, 25, parent=f7, text="PMBGM WORKSPACE", props={"fontSize": 13, "fill": C_DARK})
    create_node("text", "Side Role", 24, 46, parent=f7, text="👤 Verifikator Independen", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    menus = [("Dashboard", False), ("Antrean Kasus", True), ("Radar AI MLP", False), ("SLA Monitor", False), ("Audit Log", False), ("Pengaturan", False)]
    m_y = 90
    for idx, (m_label, is_act) in enumerate(menus):
        bg = C_DARK if is_act else "none"
        col = "#FFFFFF" if is_act else C_DARK
        if is_act:
            create_node("rectangle", f"Menu BG {idx}", 16, m_y - 4, 188, 36, parent=f7, props={"fill": bg, "cornerRadius": 4})
        create_node("text", f"Menu Txt {idx}", 32, m_y + 5, parent=f7, text=m_label, props={"fontSize": 12, "fill": col})
        m_y += 45

    # Main Area Top Bar (x: 220)
    create_node("rectangle", "Main Top Bar", 220, 0, 740, 56, parent=f7, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
    create_node("text", "Top Title", 245, 20, parent=f7, text="Antrean Verifikasi Laporan Masuk (#PMBGM-2026-X89K)", props={"fontSize": 14, "fill": C_DARK})
    draw_button(f7, "Btn Refresh", 840, 12, 100, 32, "🔄 Segarkan", variant="outline")

    # Split Workspace
    # Left Column: Bukti Foto & EXIF (x: 245, w: 340)
    create_node("text", "Left Header", 245, 80, parent=f7, text="Foto Bukti & Metadata Pelapor", props={"fontSize": 14, "fill": C_DARK})
    draw_image_box(f7, "Bukti Img", 245, 105, 340, 240)
    create_node("text", "Bukti Caption", 260, 315, parent=f7, text="Foto Bukti Nasi & Sayur Berbau Asam", props={"fontSize": 11, "fill": C_DARK})

    create_node("rectangle", "Exif Info Box", 245, 360, 340, 130, parent=f7, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "EI1", 260, 375, parent=f7, text="METADATA EXIF HASIL EKSTRAKSI:", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "EI2", 260, 395, parent=f7, text="• Kamera: iPhone 13 (Kamera Asli)", props={"fontSize": 11, "fill": C_DARK})
    create_node("text", "EI3", 260, 415, parent=f7, text="• Waktu Foto: 10:28:14 WIB (Cocok dengan jam makan)", props={"fontSize": 11, "fill": C_DARK})
    create_node("text", "EI4", 260, 435, parent=f7, text="• Lokasi GPS: -7.0512, 110.4371 (Area SD Tembalang 01)", props={"fontSize": 11, "fill": C_DARK})
    create_node("text", "EI5", 260, 455, parent=f7, text="• Status Integritas: Valid & Tidak Ada Rekayasa Digital", props={"fontSize": 11, "fill": C_DARK})

    # Narasi Warga Box
    create_node("text", "Narasi Tit", 245, 510, parent=f7, text="Narasi Kejadian dari Pelapor:", props={"fontSize": 13, "fill": C_DARK})
    create_node("rectangle", "Narasi Box", 245, 535, 340, 100, parent=f7, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "Narasi Txt", 258, 550, width=310, parent=f7, text="\"Sayur sop berbau asam saat tiba di kelas 4A. Anak-anak menolak makan dan 2 anak mengeluhkan perut mual.\"", props={"fontSize": 11, "fill": C_DARK})

    # Right Column: AI MLP Radar & Keputusan Verifikator (x: 605, w: 335)
    create_node("text", "Right Header", 605, 80, parent=f7, text="Analisis Model MLP AI (7 Fitur)", props={"fontSize": 14, "fill": C_DARK})
    create_node("rectangle", "AI Box", 605, 105, 335, 160, parent=f7, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "AI Tit", 620, 120, parent=f7, text="SKOR VALIDASI CERDAS (MLP RADAR):", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "AI1", 620, 142, parent=f7, text="• Koherensi Teks: 94.2% (Konsisten)", props={"fontSize": 12, "fill": C_DARK})
    create_node("text", "AI2", 620, 165, parent=f7, text="• Indikasi Gejala: Terdeteksi (Mual / Perut)", props={"fontSize": 12, "fill": C_DARK})
    create_node("text", "AI3", 620, 188, parent=f7, text="• Validitas Waktu & GPS: 98.0% Cocok", props={"fontSize": 12, "fill": C_DARK})
    create_node("text", "AI4", 620, 211, parent=f7, text="• Klasifikasi Otomatis: Mutu & Higienitas (Mendesak)", props={"fontSize": 12, "fill": C_DARK})
    create_node("text", "AI5", 620, 234, parent=f7, text="• Skor Kepercayaan Akhir: 0.94 / 1.00 (SAH)", props={"fontSize": 12, "fill": C_DARK})

    # Form Keputusan Verifikator
    create_node("text", "Dec Header", 605, 285, parent=f7, text="Formulir Keputusan Verifikator:", props={"fontSize": 14, "fill": C_DARK})
    create_node("rectangle", "Dec Box", 605, 310, 335, 325, parent=f7, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    # Radio options
    radios = [("🔘 Sahkan & Teruskan ke SPPG/Dinkes", True), ("⚪ Tolak (Laporan Tidak Valid / Palsu)", False), ("⚪ Minta Tambahan Bukti ke Pelapor", False)]
    ry = 328
    for r_idx, (r_txt, r_sel) in enumerate(radios):
        create_node("text", f"Radio {r_idx}", 620, ry, parent=f7, text=r_txt, props={"fontSize": 11, "fill": C_DARK})
        ry += 28

    create_node("text", "Catatan Label", 620, 420, parent=f7, text="Catatan Resmi Petugas:", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("rectangle", "Note Box", 620, 440, 305, 90, parent=f7, props={"fill": "#FAFAFA", "stroke": C_DIVIDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "Note Text", 630, 452, width=285, parent=f7, text="Bukti foto dan koordinat GPS telah diverifikasi sah. Diteruskan ke SPPG Tembalang 01 dengan SLA 18 jam.", props={"fontSize": 11, "fill": C_DARK})

    draw_button(f7, "Btn Tolak", 620, 545, 140, 40, "Tolak Laporan", variant="outline")
    draw_button(f7, "Btn Sahkan", 770, 545, 155, 40, "Sahkan & Teruskan", variant="primary")
    draw_footer(f7, 1400)
    print(" -> Screen 07: Panel Verifikator selesai.")

    # =========================================================================
    # ROW 2, COL 3: 08. Masuk & Multi-Persona (/masuk)
    # =========================================================================
    fx, fy = 3260, 1650
    create_node("text", "Title 08", fx, fy - 35, text="Masuk / Autentikasi", props={"fontSize": 18, "fill": C_DARK})
    f8 = create_node("frame", "08. Masuk Persona", fx, fy, FRAME_W, FRAME_H, props={"fill": C_FRAME_BG, "stroke": C_BORDER, "strokeWeight": 1})
    created_frames.append(f8)
    draw_navbar(f8, "Panduan")

    # Centered Login Card (w: 520, h: 720)
    lx = 220
    ly = 110
    create_node("rectangle", "Login Card", lx, ly, 520, 750, parent=f8, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 6})
    # Center Lock Icon
    create_node("rectangle", "Lock Box", lx + 235, ly + 35, 50, 50, parent=f8, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 25})
    create_node("text", "Lock Icon", lx + 252, ly + 50, parent=f8, text="🔒", props={"fontSize": 16, "fill": C_DARK})
    create_node("text", "Login Title", lx + 140, ly + 105, parent=f8, text="Masuk ke Portal PMBGM", props={"fontSize": 20, "fill": C_DARK})
    create_node("text", "Login Sub", lx + 105, ly + 135, parent=f8, text="Pilih peran akun Anda untuk mengakses sistem pengawasan MBG.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # Persona Selector Grid (6 roles, 2 cols x 3 rows)
    create_node("text", "Role Label", lx + 40, ly + 175, parent=f8, text="Pilih Peran Akun Pengguna *", props={"fontSize": 12, "fill": C_DARK})
    roles = [
        ("Warga / Wali Murid", True),
        ("Verifikator Independen", False),
        ("Pengelola Dapur SPPG", False),
        ("Dinas Kesehatan (Dinkes)", False),
        ("Korwil Wilayah BGN", False),
        ("Administrator Sistem", False)
    ]
    rx_col1 = lx + 40
    rx_col2 = lx + 270
    ry_row = ly + 200
    for r_idx, (r_name, is_act) in enumerate(roles):
        rx = rx_col1 if r_idx % 2 == 0 else rx_col2
        r_border = C_DARK if is_act else C_BORDER
        r_bg = "#FAFAFA" if is_act else "#FFFFFF"
        create_node("rectangle", f"RoleCard {r_idx}", rx, ry_row, 210, 42, parent=f8, props={"fill": r_bg, "stroke": r_border, "strokeWeight": 1.5 if is_act else 1, "cornerRadius": 4})
        prefix = "🔘" if is_act else "⚪"
        create_node("text", f"RoleTxt {r_idx}", rx + 14, ry_row + 14, parent=f8, text=f"{prefix} {r_name}", props={"fontSize": 11, "fill": C_DARK})
        if r_idx % 2 == 1:
            ry_row += 52

    # Credential Inputs
    create_node("text", "Email Label", lx + 40, ly + 375, parent=f8, text="Email atau Nomor WhatsApp Terdaftar *", props={"fontSize": 12, "fill": C_DARK})
    draw_input(f8, "Input Email", lx + 40, ly + 398, 440, 44, "nama@email.com / 081234567890")

    create_node("text", "Pass Label", lx + 40, ly + 460, parent=f8, text="Kata Sandi Akun *", props={"fontSize": 12, "fill": C_DARK})
    draw_input(f8, "Input Pass", lx + 40, ly + 483, 440, 44, "••••••••••••••••")

    create_node("text", "Ingat Saya", lx + 40, ly + 545, parent=f8, text="☑  Ingat sesi masuk di perangkat ini", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "Lupa Pass", lx + 370, ly + 545, parent=f8, text="Lupa kata sandi?", props={"fontSize": 11, "fill": C_DARK})

    draw_button(f8, "Btn Login Submit", lx + 40, ly + 580, 440, 46, "Masuk Sekarang →", variant="primary")
    draw_button(f8, "Btn Demo Switcher", lx + 40, ly + 636, 440, 42, "⚡ Masuk Cepat sebagai Tamu / Demo", variant="outline")

    create_node("text", "Daftar Link", lx + 130, ly + 700, parent=f8, text="Belum punya akun?  Daftar sebagai Warga Baru", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    draw_footer(f8, 1400)
    print(" -> Screen 08: Masuk Persona selesai.")

    # =========================================================================
    # Zoom to Fit & Export File
    # =========================================================================
    print("[4/5] Melakukan Zoom to Fit kanvas...")
    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'run_command', 'arguments': {'command': 'view.zoomFit'}}})
    time.sleep(0.5)

    print("[5/5] Menyimpan berkas proyek master (.figcraft, .fig, .png)...")
    # Save .figcraft
    save_res = send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'save_file', 'arguments': {'path': 'd:/UNNES/LOMBA/MIA 2026/Web/pantaugizi/docs/PMBGM_Wireframe_Master.figcraft'}}})
    print(" -> Saved .figcraft:", save_res.get('result', {}).get('content', [{}])[0].get('text', 'OK'))

    # Export .fig (Figma format)
    try:
        fig_res = send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'export', 'arguments': {'format': 'fig', 'path': 'd:/UNNES/LOMBA/MIA 2026/Web/pantaugizi/docs/PMBGM_Wireframe_Master.fig'}}})
        print(" -> Exported .fig:", fig_res.get('result', {}).get('content', [{}])[0].get('text', 'OK'))
    except Exception as e:
        print(" -> Export .fig note:", e)

    # Export High-Res Overview PNG
    try:
        img_res = send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'export', 'arguments': {'format': 'png', 'scale': 0.5, 'path': 'C:/Users/nayotamaryptra/.gemini/antigravity/brain/00907903-8e5d-45cc-81b9-de65c309d732/figcraft-wireframe-overview.png'}}})
        print(" -> Exported Overview PNG:", img_res.get('result', {}).get('content', [{}])[0].get('text', 'OK'))
    except Exception as e:
        print(" -> Export PNG note:", e)

    print("=" * 65)
    print("SUKSES: 8 Layar Wireframe Master Textbook Monochrome Telah Siap!")
    print("=" * 65)
    p.kill()

if __name__ == "__main__":
    main()
