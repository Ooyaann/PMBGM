import subprocess
import json
import time
import os
import sys

def main():
    print("=" * 75)
    print("PMBGM - EXACT SCREENSHOT-TO-WIREFRAME ARCHITECT (FIGCRAFT)")
    print("MIA 2026: Sistem Pemantau MBG Masyarakat (Kota Semarang)")
    print("Prinsip: 100% SAMA PERSIS DENGAN SCREENSHOT AKTUAL (VERSI WIREFRAME)")
    print("=" * 75)

    cli_path = "D:/Program Files/ArtCraft/FigCraft/figcraft-cli.exe"
    output_figcraft = "d:/UNNES/LOMBA/MIA 2026/Web/PMBGM_Wireframes.figcraft"
    docs_figcraft = "d:/UNNES/LOMBA/MIA 2026/Web/pantaugizi/docs/PMBGM_Wireframe_Master.figcraft"
    render_folder = "d:/UNNES/LOMBA/MIA 2026/Web/wireframe_renders"
    overview_png = "C:/Users/nayotamaryptra/.gemini/antigravity/brain/00907903-8e5d-45cc-81b9-de65c309d732/PMBGM_Wireframes_All_Overview.png"

    os.makedirs(render_folder, exist_ok=True)
    os.makedirs(os.path.dirname(docs_figcraft), exist_ok=True)

    print("\n[1/5] Menginisialisasi FigCraft Engine (figcraft-cli mcp)...")
    p = subprocess.Popen(
        [cli_path, 'mcp'],
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
    send({'jsonrpc': '2.0', 'method': 'initialize', 'params': {'protocolVersion': '2024-11-05', 'capabilities': {}, 'clientInfo': {'name': 'pmbgm_exact_wireframes', 'version': '4.0'}}})
    p.stdin.write(json.dumps({'jsonrpc': '2.0', 'method': 'notifications/initialized', 'params': {}}) + '\n')
    p.stdin.flush()

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

    # Wireframe Color Constants (Pure Textbook Monochrome / Grayscale standard)
    C_FRAME_BG   = "#FFFFFF"
    C_BORDER     = "#E5E7EB"
    C_BORDER_DARK= "#18181B"
    C_LIGHT_BG   = "#F9FAFB"
    C_X_LINE     = "#D1D5DB"
    C_DARK       = "#18181B"
    C_TEXT_MAIN  = "#111827"
    C_TEXT_MUTED = "#6B7280"
    C_TEXT_LIGHT = "#9CA3AF"
    C_DIVIDER    = "#E5E7EB"

    # UI Primitive Helpers
    def draw_image_box(fid, name, x, y, w, h, corner=4):
        create_node("rectangle", f"{name} BG", x, y, w, h, parent=fid, props={"fill": "#F3F4F6", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": corner})
        create_node("vector", f"{name} X", x, y, w, h, parent=fid, path=f"M0 0 L{w} {h} M0 {h} L{w} 0", props={"stroke": C_X_LINE, "strokeWeight": 1})

    def draw_avatar(fid, name, cx, cy, r=18):
        create_node("ellipse", f"{name} Circle", cx - r, cy - r, r * 2, r * 2, parent=fid, props={"fill": "#E5E7EB", "stroke": C_BORDER, "strokeWeight": 1})
        create_node("ellipse", f"{name} Head", cx - (r * 0.28), cy - (r * 0.55), r * 0.56, r * 0.56, parent=fid, props={"fill": "#9CA3AF"})
        create_node("rectangle", f"{name} Body", cx - (r * 0.65), cy + (r * 0.1), r * 1.3, r * 0.75, parent=fid, props={"fill": "#9CA3AF", "cornerRadius": 6})

    def draw_button(fid, name, x, y, w, h, text, variant="primary", corner=20):
        if variant == "primary":
            create_node("rectangle", f"{name} Box", x, y, w, h, parent=fid, props={"fill": C_DARK, "cornerRadius": corner})
            create_node("text", f"{name} Txt", x + max(8, (w - len(text) * 6.8) / 2), y + (h - 13) / 2, parent=fid, text=text, props={"fill": "#FFFFFF", "fontSize": 12})
        elif variant == "subtle":
            create_node("rectangle", f"{name} Box", x, y, w, h, parent=fid, props={"fill": "#F3F4F6", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": corner})
            create_node("text", f"{name} Txt", x + max(8, (w - len(text) * 6.5) / 2), y + (h - 13) / 2, parent=fid, text=text, props={"fill": C_DARK, "fontSize": 12})
        else: # outline
            create_node("rectangle", f"{name} Box", x, y, w, h, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": corner})
            create_node("text", f"{name} Txt", x + max(8, (w - len(text) * 6.5) / 2), y + (h - 13) / 2, parent=fid, text=text, props={"fill": C_DARK, "fontSize": 12})

    def draw_pill(fid, name, x, y, w, h, text, is_active=False):
        bg = C_DARK if is_active else "#FFFFFF"
        tc = "#FFFFFF" if is_active else C_DARK
        stroke = C_DARK if is_active else C_BORDER
        create_node("rectangle", f"{name} Bg", x, y, w, h, parent=fid, props={"fill": bg, "stroke": stroke, "strokeWeight": 1, "cornerRadius": h / 2})
        create_node("text", f"{name} Txt", x + max(6, (w - len(text) * 6.2) / 2), y + (h - 11) / 2, parent=fid, text=text, props={"fontSize": 11, "fill": tc})

    def draw_navbar_public(fid, active="Beranda", logged_in=False, user_name="Ibu"):
        # 64px header matching real screenshot
        create_node("rectangle", "Navbar Base", 0, 0, 960, 64, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1})
        # PMBGM Brand on left
        create_node("ellipse", "Nav Logo Cir", 36, 18, 28, 28, parent=fid, props={"fill": "#F3F4F6", "stroke": C_BORDER, "strokeWeight": 1})
        create_node("text", "Nav Logo Txt", 44, 24, parent=fid, text="O", props={"fontSize": 13, "fill": C_DARK})
        create_node("text", "Nav Brand Name", 72, 20, parent=fid, text="PMBGM", props={"fontSize": 15, "fill": C_DARK})
        create_node("text", "Nav Brand Sub", 72, 36, parent=fid, text="PEMANTAU MBG MASYARAKAT", props={"fontSize": 8, "fill": C_TEXT_MUTED})
        # Center Nav Links
        links = [("Beranda", 0), ("Lacak v", 75), ("Data Terbuka v", 150), ("Insight v", 260), ("Panduan v", 340)]
        start_x = 300
        for l_text, offset_x in links:
            is_act = (l_text.startswith(active))
            if is_act:
                create_node("rectangle", f"NavPill {l_text}", start_x + offset_x - 10, 18, len(l_text) * 7.5 + 20, 28, parent=fid, props={"fill": "#F3F4F6", "cornerRadius": 14})
            create_node("text", f"NavTxt {l_text}", start_x + offset_x, 24, parent=fid, text=l_text, props={"fontSize": 12, "fill": C_DARK if is_act else C_TEXT_MUTED})
        # Right Actions
        if not logged_in:
            draw_button(fid, "Nav Lapor", 730, 16, 125, 32, "📢 Lapor Masalah", variant="primary", corner=16)
            draw_button(fid, "Nav Masuk", 865, 16, 65, 32, "Masuk", variant="outline", corner=16)
        else:
            draw_button(fid, "Nav Lapor MBG", 665, 16, 150, 32, "📢 Lapor MBG Sekolah", variant="primary", corner=16)
            create_node("rectangle", "Nav User Box", 825, 16, 105, 32, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
            create_node("ellipse", "Nav User Cir", 831, 20, 24, 24, parent=fid, props={"fill": C_DARK})
            create_node("text", "Nav User Init", 836, 25, parent=fid, text="IR", props={"fontSize": 10, "fill": "#FFFFFF"})
            create_node("text", "Nav User Name", 862, 24, parent=fid, text=f"{user_name} v", props={"fontSize": 11, "fill": C_DARK})

    def draw_navbar_panel(fid, active_tab="Dasbor Panel", role="Verifikator", user_code="MS", user_name="Mbak"):
        create_node("rectangle", "Panel Nav Base", 0, 0, 960, 64, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1})
        # Brand on left
        create_node("ellipse", "PNav Logo Cir", 36, 18, 28, 28, parent=fid, props={"fill": "#F3F4F6", "stroke": C_BORDER, "strokeWeight": 1})
        create_node("text", "PNav Logo Txt", 44, 24, parent=fid, text="O", props={"fontSize": 13, "fill": C_DARK})
        create_node("text", "PNav Brand Name", 72, 20, parent=fid, text="PMBGM", props={"fontSize": 15, "fill": C_DARK})
        create_node("text", "PNav Brand Sub", 72, 36, parent=fid, text="PEMANTAU MBG MASYARAKAT", props={"fontSize": 8, "fill": C_TEXT_MUTED})

        # Tabs in center based on role
        if role == "Verifikator":
            tabs = [("Dasbor Panel", 0), ("Antrean Verifikasi", 120), ("Kasus Berjalan", 260)]
        elif role == "SPPG":
            tabs = [("Dasbor Dapur", 0), ("Aduan Masuk", 115), ("Rapor & SLHS", 225), ("Sekolah Mitra", 340)]
        elif role == "Dinkes":
            tabs = [("Dasbor Medis", 0), ("Investigasi & KLB", 120), ("Prioritas Inspeksi", 255), ("Peringatan Dini", 390)]
        elif role == "Korwil":
            tabs = [("Papan Akuntabilitas", 0), ("Prioritas Audit (DSS)", 150), ("Daftar Kasus", 310)]
        else: # Admin
            tabs = [("Dasbor Admin", 0), ("Kelola Pengguna", 120), ("Aturan SLA", 255), ("Semua Kasus", 360)]

        start_x = 280
        for t_text, offset_x in tabs:
            is_act = (t_text == active_tab)
            t_w = len(t_text) * 7.2 + 28
            bg = "#F3F4F6" if is_act else "#FFFFFF"
            create_node("rectangle", f"TabPill {t_text}", start_x + offset_x, 18, t_w, 28, parent=fid, props={"fill": bg, "cornerRadius": 14})
            create_node("text", f"TabTxt {t_text}", start_x + offset_x + 12, 24, parent=fid, text=t_text, props={"fontSize": 11, "fill": C_DARK if is_act else C_TEXT_MUTED})

        # User Profile on right
        create_node("rectangle", "PNav User Box", 825, 16, 105, 32, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
        create_node("ellipse", "PNav User Cir", 831, 20, 24, 24, parent=fid, props={"fill": C_DARK})
        create_node("text", "PNav User Init", 836, 25, parent=fid, text=user_code, props={"fontSize": 10, "fill": "#FFFFFF"})
        create_node("text", "PNav User Name", 862, 24, parent=fid, text=f"{user_name} v", props={"fontSize": 11, "fill": C_DARK})

    def draw_footer_real(fid, y=1340):
        create_node("rectangle", "Footer Base", 0, y, 960, 110, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1})
        # Brand col
        create_node("text", "F Brand", 40, y + 20, parent=fid, text="PMBGM", props={"fontSize": 14, "fill": C_DARK})
        create_node("text", "F Sub", 40, y + 38, width=240, parent=fid, text="Platform pengawasan partisipatif masyarakat untuk transparansi dan mutu Program Makan Bergizi Gratis.", props={"fontSize": 10, "fill": C_TEXT_MUTED})
        create_node("rectangle", "F Sim Pill", 40, y + 74, 130, 22, parent=fid, props={"fill": "#F3F4F6", "cornerRadius": 11})
        create_node("text", "F Sim Txt", 52, y + 78, parent=fid, text="Data Simulasi · MIA 2026", props={"fontSize": 9, "fill": C_DARK})
        # 3 cols
        cols = [
            ("LAYANAN WARGA", ["Lapor Masalah", "Lacak Tiket", "Cari Sekolah & Dapur", "Panduan & Simulator"], 340),
            ("TRANSPARANSI DATA", ["Data Terbuka", "Peta Risiko SAW", "Metodologi & SLA", "Unduh Data"], 540),
            ("BANTUAN & REGULASI", ["Tanya Jawab (FAQ)", "Privasi Pelapor", "Tentang PMBGM", "Darurat Ambulans: 119"], 740)
        ]
        for c_tit, c_links, cx in cols:
            create_node("text", f"FColTit {c_tit}", cx, y + 20, parent=fid, text=c_tit, props={"fontSize": 11, "fill": C_DARK})
            ly = y + 38
            for cl in c_links:
                create_node("text", f"FColLnk {cl}", cx, ly, parent=fid, text=cl, props={"fontSize": 10, "fill": C_TEXT_MUTED})
                ly += 16

    print("[2/5] Membersihkan kanvas...")
    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'run_command', 'arguments': {'command': 'select.all'}}})
    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'run_command', 'arguments': {'command': 'edit.delete'}}})
    time.sleep(0.3)

    FRAME_W = 960
    FRAME_H = 1450
    GAP_X = 80
    GAP_Y = 220
    created_frames = []

    def get_pos(row_idx, col_idx):
        return 80 + col_idx * (FRAME_W + GAP_X), 180 + row_idx * (FRAME_H + GAP_Y)

    def add_section_header(row_idx, title_text, desc_text):
        _, y = get_pos(row_idx, 0)
        create_node("text", f"SecTit_{row_idx}", 80, y - 90, text=title_text, props={"fontSize": 24, "fill": C_DARK})
        create_node("text", f"SecDesc_{row_idx}", 80, y - 62, text=desc_text, props={"fontSize": 12, "fill": C_TEXT_MUTED})

    def start_frame(row_idx, col_idx, frame_name, screen_title):
        fx, fy = get_pos(row_idx, col_idx)
        create_node("text", f"FrameTit_{frame_name}", fx, fy - 32, text=screen_title, props={"fontSize": 14, "fill": C_DARK})
        fid = create_node("frame", frame_name, fx, fy, FRAME_W, FRAME_H, props={"fill": C_FRAME_BG, "stroke": C_BORDER, "strokeWeight": 1})
        created_frames.append(fid)
        return fid

    print("[3/5] Membangun Artboard Wireframe SAMA PERSIS dengan Screenshot Aktual...")

    # =========================================================================
    # ROW 0: PORTAL PUBLIK (01. Beranda, 04. Lacak, 08. Cari Sekolah, 25. Masuk)
    # =========================================================================
    add_section_header(0, "SECTION 01: PORTAL PUBLIK & PENGADUAN WARGA", "Tampilan beranda minimalis, pelacakan tiket, direktori sekolah, dan login split-screen.")

    # 1. 01. Beranda Utama (Landing Page)
    f = start_frame(0, 0, "01. Beranda Utama", "01. Beranda Utama (Google-Style Portal)")
    draw_navbar_public(f, "Beranda")
    # Exact center layout
    create_node("text", "Hero Brand", 355, 380, parent=f, text="PMBGM", props={"fontSize": 68, "fill": C_DARK})
    create_node("text", "Hero Sub", 365, 465, parent=f, text="P E M A N T A U   M B G   M A S Y A R A K A T", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    # Search Bar (rounded-full)
    create_node("rectangle", "Search Bar Box", 200, 505, 560, 52, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 26})
    create_node("text", "Search Icon", 222, 522, parent=f, text="🔍", props={"fontSize": 13, "fill": C_TEXT_LIGHT})
    create_node("text", "Search Placeholder", 246, 523, parent=f, text="Cari sekolah, dapur SPPG, atau kode tiket...", props={"fontSize": 13, "fill": C_TEXT_LIGHT})
    # 2 Action Buttons
    draw_button(f, "Btn Buat Laporan", 360, 575, 140, 42, "📢 Buat Laporan", variant="primary", corner=21)
    draw_button(f, "Btn Lacak Tiket", 512, 575, 130, 42, "🎫 Lacak Tiket", variant="outline", corner=21)
    # Stat Pill
    create_node("rectangle", "Stat Pill Box", 370, 640, 260, 28, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "Stat Text", 388, 646, parent=f, text="• 165 Sekolah   40 Dapur SPPG   📞 Darurat 119", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    # Real subtle footer at the bottom
    draw_footer_real(f, 1340)

    # 2. 04. Pelacakan Kasus (/lacak)
    f = start_frame(0, 1, "04. Pelacakan Kasus", "04. Pelacakan Kasus (/lacak)")
    draw_navbar_public(f, "Lacak")
    create_node("text", "Lacak Title", 40, 95, parent=f, text="Lacak", props={"fontSize": 28, "fill": C_DARK})
    # Switcher pills on right
    draw_pill(f, "Pill Cek Tiket", 720, 95, 100, 32, "🎫 Cek tiket", is_active=True)
    draw_pill(f, "Pill Akuntabilitas", 828, 95, 100, 32, "⚖️ Akuntabilitas", is_active=False)
    # Search input rounded-full
    create_node("rectangle", "Lacak Search Box", 40, 145, 340, 44, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 22})
    create_node("text", "Lacak Icon", 56, 159, parent=f, text="🎫", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    create_node("text", "Lacak Place", 78, 159, parent=f, text="Cek status: MBG-XXXXXX", props={"fontSize": 12, "fill": C_TEXT_LIGHT})
    create_node("ellipse", "Lacak Btn Cir", 345, 151, 30, 30, parent=f, props={"fill": "#F3F4F6"})
    create_node("text", "Lacak Arrow", 355, 158, parent=f, text="->", props={"fontSize": 11, "fill": C_DARK})
    # Section Header
    create_node("text", "Kasus Sec Tit", 40, 225, parent=f, text="Kasus Terbaru di Wilayah", props={"fontSize": 16, "fill": C_DARK})
    create_node("text", "Kasus Sec Sub", 40, 248, parent=f, text="Laporan terverifikasi yang sedang atau telah ditangani secara terbuka.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    draw_pill(f, "Badge Terverifikasi", 810, 225, 110, 24, "✓ Terverifikasi", is_active=False)
    # Filter Row
    create_node("text", "Lbl Waktu", 40, 290, parent=f, text="Waktu:", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    draw_pill(f, "PW1", 85, 283, 60, 26, "Semua", is_active=True)
    draw_pill(f, "PW2", 150, 283, 60, 26, "7 Hari", is_active=False)
    draw_pill(f, "PW3", 215, 283, 60, 26, "30 Hari", is_active=False)
    create_node("text", "Lbl Status", 680, 290, parent=f, text="Status:", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    draw_pill(f, "PS1", 725, 283, 65, 26, "Semua", is_active=True)
    draw_pill(f, "PS2", 795, 283, 65, 26, "Diproses", is_active=False)
    draw_pill(f, "PS3", 865, 283, 60, 26, "Selesai", is_active=False)
    # 2 Columns x 5 Rows of Case Cards
    cases_real = [
        ("Masalah distribusi di SD Ngaliyan 6", "Ngaliyan · 31 Okt 2026, 00.41", "✓ Diverifikasi", "⏱ Melewati batas waktu"),
        ("Masalah distribusi di SD Banyumanik 10", "Banyumanik · 30 Okt 2026, 23.51", "↗ Diteruskan", "⚠️ Tidak ditanggapi"),
        ("Porsi/gizi tidak sesuai di SD Candisari 3", "Candisari · 30 Okt 2026, 23.37", "✓ Diverifikasi", "⏱ Melewati batas waktu"),
        ("Makanan tidak layak di SMP Pedurungan 1", "Pedurungan · 30 Okt 2026, 20.01", "↗ Diteruskan", "⚠️ Tidak ditanggapi"),
        ("Makanan tidak layak di TK Semarang Utara 2", "Semarang Utara · 30 Okt 2026, 18.30", "↗ Diteruskan", "⚠️ Tidak ditanggapi"),
        ("Dugaan masalah pengadaan di SD Gunungpati 2", "Gunungpati · 30 Okt 2026, 18.13", "✓ Diverifikasi", "⏱ Melewati batas waktu"),
        ("Makanan tidak layak di SD Semarang Utara 6", "Semarang Utara · 30 Okt 2026, 16.57", "↗ Diteruskan", "⚠️ Tidak ditanggapi"),
        ("Porsi/gizi tidak sesuai di SMP Semarang Timur 2", "Semarang Timur · 30 Okt 2026, 15.48", "↗ Diteruskan", "⚠️ Tidak ditanggapi"),
        ("Makanan tidak layak di SMA Semarang Utara 1", "Semarang Utara · 30 Okt 2026, 15.30", "↗ Diteruskan", "⚠️ Tidak ditanggapi"),
        ("Makanan tidak layak di SD Semarang Utara 6", "Semarang Utara · 30 Okt 2026, 12.30", "↗ Diteruskan", "⚠️ Tidak ditanggapi"),
    ]
    card_y = 330
    for idx in range(0, len(cases_real), 2):
        for col_i in range(2):
            c_idx = idx + col_i
            if c_idx >= len(cases_real): break
            tit, sub, b1, b2 = cases_real[c_idx]
            cx = 40 if col_i == 0 else 495
            create_node("rectangle", f"LCard {c_idx}", cx, card_y, 425, 90, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
            create_node("ellipse", f"LCIco {c_idx}", cx + 18, card_y + 24, 38, 38, parent=f, props={"fill": "#F3F4F6"})
            create_node("text", f"LCIcoTxt {c_idx}", cx + 29, card_y + 35, parent=f, text="📦", props={"fontSize": 13, "fill": C_DARK})
            create_node("text", f"LCTit {c_idx}", cx + 68, card_y + 16, parent=f, text=tit, props={"fontSize": 12, "fill": C_DARK})
            create_node("text", f"LCSub {c_idx}", cx + 68, card_y + 36, parent=f, text=sub, props={"fontSize": 10, "fill": C_TEXT_MUTED})
            draw_pill(f, f"LCB1 {c_idx}", cx + 68, card_y + 56, len(b1) * 6.5 + 16, 22, b1, is_active=False)
            draw_pill(f, f"LCB2 {c_idx}", cx + 76 + len(b1) * 6.5 + 16, card_y + 56, len(b2) * 6.5 + 16, 22, b2, is_active=False)
        card_y += 105
    draw_footer_real(f, 1340)

    # 3. 08. Cari Sekolah (/cari-sekolah)
    f = start_frame(0, 2, "08. Cari Sekolah", "08. Direktori Sekolah (/cari-sekolah)")
    draw_navbar_public(f, "Beranda")
    create_node("text", "Sch Tit", 40, 95, parent=f, text="Cari Sekolah", props={"fontSize": 28, "fill": C_DARK})
    draw_pill(f, "Simulasi Pill", 215, 98, 80, 24, "🧪 Simulasi", is_active=False)
    # Search input on right
    create_node("rectangle", "Sch Search Box", 570, 90, 350, 42, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 21})
    create_node("text", "Sch S Ico", 588, 102, parent=f, text="🔍", props={"fontSize": 12, "fill": C_TEXT_LIGHT})
    create_node("text", "Sch S Place", 608, 103, parent=f, text="Cari sekolah, kecamatan, SPPG...", props={"fontSize": 11, "fill": C_TEXT_LIGHT})
    create_node("ellipse", "Sch S Btn", 885, 96, 28, 28, parent=f, props={"fill": "#F3F4F6"})
    create_node("text", "Sch S Arr", 894, 102, parent=f, text="->", props={"fontSize": 11, "fill": C_DARK})
    create_node("text", "Sch Count", 40, 140, parent=f, text="Menampilkan 12 dari 165 sekolah", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    # 2 Columns x 4 Rows of School Cards
    sch_data = [
        ("SD Banyumanik 1", "SD · Banyumanik · 👥 276 siswa", "99000109", "SPPG Banyumanik 01", "21 · Rendah ❓", "0 berjalan · 5 total"),
        ("SD Banyumanik 10", "SD · Banyumanik · 👥 263 siswa", "99000121", "SPPG Banyumanik 02", "14 · Rendah ❓", "1 berjalan · 5 total"),
        ("SD Banyumanik 2", "SD · Banyumanik · 👥 301 siswa", "99000110", "SPPG Banyumanik 01", "21 · Rendah ❓", "2 berjalan · 5 total"),
        ("SD Banyumanik 3", "SD · Banyumanik · 👥 368 siswa", "99000111", "SPPG Banyumanik 01", "21 · Rendah ❓", "1 berjalan · 5 total"),
        ("SD Banyumanik 4", "SD · Banyumanik · 👥 398 siswa", "99000115", "SPPG Banyumanik 01", "21 · Rendah ❓", "0 berjalan · 0 total"),
        ("SD Banyumanik 5", "SD · Banyumanik · 👥 294 siswa", "99000116", "SPPG Banyumanik 02", "14 · Rendah ❓", "0 berjalan · 2 total"),
        ("SD Banyumanik 6", "SD · Banyumanik · 👥 191 siswa", "99000117", "SPPG Banyumanik 02", "14 · Rendah ❓", "0 berjalan · 4 total"),
        ("SD Banyumanik 7", "SD · Banyumanik · 👥 555 siswa", "99000118", "SPPG Banyumanik 02", "14 · Rendah ❓", "0 berjalan · 1 total"),
    ]
    sc_y = 175
    for idx in range(0, len(sch_data), 2):
        for col_i in range(2):
            s_idx = idx + col_i
            if s_idx >= len(sch_data): break
            sname, smeta, snpsn, ssppg, srisk, sstat = sch_data[s_idx]
            cx = 40 if col_i == 0 else 495
            create_node("rectangle", f"SCard {s_idx}", cx, sc_y, 425, 130, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
            create_node("ellipse", f"SCIco {s_idx}", cx + 18, sc_y + 18, 32, 32, parent=f, props={"fill": "#F3F4F6"})
            create_node("text", f"SCIcoTxt {s_idx}", cx + 27, sc_y + 26, parent=f, text="🏫", props={"fontSize": 12, "fill": C_DARK})
            create_node("text", f"SCTit {s_idx}", cx + 58, sc_y + 14, parent=f, text=sname, props={"fontSize": 13, "fill": C_DARK})
            create_node("text", f"SCMeta {s_idx}", cx + 58, sc_y + 34, parent=f, text=smeta, props={"fontSize": 10, "fill": C_TEXT_MUTED})
            draw_pill(f, f"SCNpsn {s_idx}", cx + 240, sc_y + 32, 95, 18, f"NPSN {snpsn}", is_active=False)
            create_node("text", f"SCSppg {s_idx}", cx + 22, sc_y + 65, parent=f, text=f"🍴 {ssppg}", props={"fontSize": 11, "fill": C_DARK})
            draw_pill(f, f"SCSlhs {s_idx}", cx + 215, sc_y + 62, 85, 20, "✓ SLHS Aktif", is_active=False)
            draw_pill(f, f"SCRisk {s_idx}", cx + 305, sc_y + 62, 105, 20, f"• {srisk}", is_active=False)
            draw_pill(f, f"SCStat {s_idx}", cx + 22, sc_y + 94, 120, 22, f"📂 {sstat}", is_active=False)
            draw_button(f, f"SCBtn {s_idx}", cx + 345, sc_y + 92, 65, 26, "📢 Lapor", variant="primary", corner=13)
        sc_y += 145
    draw_footer_real(f, 1340)

    # 4. 25. Masuk Persona Multi-Role (`25_publik_masuk_persona.png`)
    f = start_frame(0, 3, "25. Masuk Persona Multi-Role", "25. Autentikasi Split-Screen (/masuk)")
    # Left 50% Panel (Dark forest / black)
    create_node("rectangle", "Left Dark Panel", 0, 0, 480, FRAME_H, parent=f, props={"fill": C_DARK})
    create_node("ellipse", "LDP Logo Cir", 40, 40, 28, 28, parent=f, props={"fill": "#374151"})
    create_node("text", "LDP Logo Txt", 48, 46, parent=f, text="O", props={"fontSize": 13, "fill": "#FFFFFF"})
    create_node("text", "LDP Brand Name", 75, 42, parent=f, text="PMBGM", props={"fontSize": 15, "fill": "#FFFFFF"})
    create_node("text", "LDP Brand Sub", 75, 58, parent=f, text="PEMANTAU MBG MASYARAKAT", props={"fontSize": 8, "fill": "#9CA3AF"})
    create_node("text", "LDP Big Tit 1", 40, 450, parent=f, text="Kawal Gizi,", props={"fontSize": 44, "fill": "#FFFFFF"})
    create_node("text", "LDP Big Tit 2", 40, 505, parent=f, text="Jaga Generasi.", props={"fontSize": 44, "fill": "#FFFFFF"})
    create_node("text", "LDP Sub Desc", 40, 570, width=380, parent=f, text="Pengawasan independen mutu dan distribusi Makan Bergizi Gratis di seluruh Indonesia.", props={"fontSize": 13, "fill": "#9CA3AF"})
    create_node("text", "LDP Bottom", 40, 1380, parent=f, text="MIA 2026 • Inovasi Pengawasan MBG", props={"fontSize": 11, "fill": "#6B7280"})

    # Right 50% Panel (White)
    create_node("text", "RDP Back", 520, 45, parent=f, text="<- Kembali ke Beranda", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "RDP Tit", 570, 275, parent=f, text="Masuk", props={"fontSize": 32, "fill": C_DARK})
    create_node("text", "RDP Sub", 570, 318, parent=f, text="Pilih peranmu, lalu masuk untuk mengakses sistem.", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    # 2 Tabs
    draw_pill(f, "Tab Sim Peran", 570, 355, 140, 36, "⭐ Simulasi Peran", is_active=False)
    draw_pill(f, "Tab Masuk Email", 720, 355, 140, 36, "🔑 Masuk Email", is_active=False)
    # 6 Roles (2 columns x 3 rows) + 1 Full Width
    roles_real = [
        ("Ibu Rina", "Warga / Orang Tua", True),
        ("Pak Budi", "Guru Sekolah", False),
        ("Mbak Sari", "Verifikator Lapangan", False),
        ("Mitra Dapur", "Dapur SPPG", False),
        ("Pak Hendra", "Dinas Kesehatan", False),
        ("Korwil BGN", "Pengawas SLA", False)
    ]
    ry_start = 415
    for idx, (rname, rrole, ris_sel) in enumerate(roles_real):
        col = idx % 2
        row = idx // 2
        rx = 570 if col == 0 else 725
        ry = ry_start + row * 62
        create_node("rectangle", f"RBox {idx}", rx, ry, 145, 52, parent=f, props={"fill": "#F3F4F6" if ris_sel else "#FFFFFF", "stroke": C_DARK if ris_sel else C_BORDER, "strokeWeight": 1.5 if ris_sel else 1, "cornerRadius": 16})
        create_node("ellipse", f"RIco {idx}", rx + 12, ry + 12, 28, 28, parent=f, props={"fill": "#FFFFFF" if ris_sel else "#F3F4F6"})
        create_node("text", f"RIcoT {idx}", rx + 19, ry + 18, parent=f, text="👤", props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"RNTxt {idx}", rx + 46, ry + 12, parent=f, text=rname, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"RRTxt {idx}", rx + 46, ry + 28, parent=f, text=rrole, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        if ris_sel:
            create_node("text", f"RCheck {idx}", rx + 125, ry + 18, parent=f, text="✓", props={"fontSize": 11, "fill": C_DARK})
    # Admin Sistem full width card below
    create_node("rectangle", "AdminCard", 570, 605, 300, 52, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("ellipse", "AdminIco", 582, 617, 28, 28, parent=f, props={"fill": "#F3F4F6"})
    create_node("text", "AdminIcoT", 589, 623, parent=f, text="⚙️", props={"fontSize": 11, "fill": C_DARK})
    create_node("text", "AdminNTxt", 616, 617, parent=f, text="Admin Sistem", props={"fontSize": 11, "fill": C_DARK})
    create_node("text", "AdminRTxt", 616, 633, parent=f, text="Administrator", props={"fontSize": 9, "fill": C_TEXT_MUTED})
    # Submit Button
    draw_button(f, "Btn Masuk Persona", 570, 675, 300, 46, "Masuk ->", variant="primary", corner=23)

    # Save Progress
    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'save_file', 'arguments': {'path': docs_figcraft}}})
    print(" -> Section 1 (Publik) selesai.")

    # =========================================================================
    # ROW 1: ALUR LAPOR MULTI-LANGKAH (26, 27, 28, 29, 30, 31)
    # =========================================================================
    add_section_header(1, "SECTION 02: ALUR MULTI-LANGKAH FORMULIR PELAPORAN (/lapor)", "Pilihan sekolah, pemilihan 7 kategori masalah, penulisan kronologi, bukti kamera, hingga penerbitan tiket.")

    def draw_stepper_real(fid, active_step=0, st_y=145):
        step_names = [("Sekolah", "🏫"), ("Masalah", "🏷️"), ("Cerita", "📄"), ("Bukti", "📷"), ("Kirim", "✈️")]
        st_x = 120
        for idx, (s_name, s_ico) in enumerate(step_names):
            is_active = (idx == active_step)
            is_done = (idx < active_step)
            # connecting line
            if idx > 0:
                create_node("rectangle", f"StLine {idx}_{st_y}", st_x - 70, st_y + 15, 70, 2, parent=fid, props={"fill": C_DARK if is_done else C_BORDER})
            # circle
            bg = C_DARK if is_done else ("#FFFFFF" if not is_active else "#F3F4F6")
            stroke = C_DARK if (is_active or is_done) else C_BORDER
            create_node("ellipse", f"StCir {idx}_{st_y}", st_x, st_y, 32, 32, parent=fid, props={"fill": bg, "stroke": stroke, "strokeWeight": 2 if is_active else 1})
            ico_txt = "✓" if is_done else s_ico
            create_node("text", f"StIco {idx}_{st_y}", st_x + 8, st_y + 8, parent=fid, text=ico_txt, props={"fontSize": 12, "fill": "#FFFFFF" if is_done else C_DARK})
            create_node("text", f"StLbl {idx}_{st_y}", st_x - 6, st_y + 38, parent=fid, text=s_name, props={"fontSize": 11, "fill": C_DARK if (is_active or is_done) else C_TEXT_MUTED})
            st_x += 125

    def draw_sidebar_timeline(fid, active_stage=0):
        create_node("rectangle", "Side Timeline Box", 655, 135, 265, 320, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 20})
        create_node("text", "ST Tit", 675, 155, parent=fid, text="⏱ Setelah dikirim", props={"fontSize": 12, "fill": C_DARK})
        stages = [("Diterima", "⏱ 24 jam", "📥"), ("Verifikasi", "⏱ 12 jam", "🛡️"), ("Diteruskan", "⏱ 24 jam", "↗️"), ("Ditangani", "⏱ 5 hari", "🔧"), ("Selesai", "", "✓")]
        sy = 185
        for idx, (st_name, st_sla, st_ico) in enumerate(stages):
            create_node("ellipse", f"STL Cir {idx}", 675, sy, 22, 22, parent=fid, props={"fill": "#F3F4F6", "stroke": C_BORDER, "strokeWeight": 1})
            create_node("text", f"STL Ico {idx}", 680, sy + 4, parent=fid, text=st_ico, props={"fontSize": 9, "fill": C_DARK})
            create_node("text", f"STL Name {idx}", 705, sy + 3, parent=fid, text=st_name, props={"fontSize": 11, "fill": C_DARK})
            if st_sla:
                create_node("text", f"STL Sla {idx}", 850, sy + 4, parent=fid, text=st_sla, props={"fontSize": 9, "fill": C_TEXT_MUTED})
            sy += 38
        create_node("rectangle", "ST Callout", 670, 385, 235, 52, parent=fid, props={"fill": "#F9FAFB", "cornerRadius": 12})
        create_node("text", "ST Lock Ico", 682, 398, parent=fid, text="🔒", props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("text", "ST Lock Txt", 700, 396, width=195, parent=fid, text="Belum tampil publik sebelum diverifikasi.", props={"fontSize": 9, "fill": C_TEXT_MUTED})

    # 5. 26. Alur Lapor: Langkah 1 - Sekolah
    f = start_frame(1, 0, "26. Lapor Step 1 - Sekolah", "26. Lapor Step 1: Sekolah mana?")
    draw_navbar_public(f, "Lapor", logged_in=True)
    create_node("text", "Lapor Tit", 40, 95, parent=f, text="Lapor Masalah", props={"fontSize": 28, "fill": C_DARK})
    draw_button(f, "Btn Pan Top", 815, 95, 105, 34, "📖 Panduan", variant="outline", corner=17)
    draw_stepper_real(f, 0, st_y=145)
    # Left Card
    create_node("rectangle", "Step1 Card", 40, 220, 580, 130, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 20})
    create_node("text", "S1 Head", 65, 245, parent=f, text="Sekolah mana?", props={"fontSize": 18, "fill": C_DARK})
    create_node("rectangle", "S1 Input Box", 65, 280, 530, 46, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 23})
    create_node("text", "S1 S Ico", 80, 295, parent=f, text="🔍", props={"fontSize": 12, "fill": C_TEXT_LIGHT})
    create_node("text", "S1 S Place", 102, 295, parent=f, text="Cari atau pilih sekolah...", props={"fontSize": 12, "fill": C_TEXT_LIGHT})
    draw_button(f, "Btn S1 Lanjut", 40, 375, 130, 44, "Lanjut ->", variant="primary", corner=22)
    # Right Sidebar Timeline
    draw_sidebar_timeline(f, 0)
    draw_footer_real(f, 1340)

    # 6. 27. Alur Lapor: Langkah 2 - Masalah
    f = start_frame(1, 1, "27. Lapor Step 2 - Masalah", "27. Lapor Step 2: Apa masalahnya?")
    draw_navbar_public(f, "Lapor", logged_in=True)
    create_node("text", "Lapor Tit 2", 40, 95, parent=f, text="Lapor Masalah", props={"fontSize": 28, "fill": C_DARK})
    draw_button(f, "Btn Pan Top 2", 815, 95, 105, 34, "📖 Panduan", variant="outline", corner=17)
    # School selected banner
    create_node("rectangle", "Sch Sel Box", 40, 140, 580, 38, parent=f, props={"fill": "#F9FAFB", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 19})
    create_node("text", "Sch Sel Txt", 60, 151, parent=f, text="🏫 Sekolah: SD Negeri Tembalang 01 · Tembalang", props={"fontSize": 11, "fill": C_DARK})
    draw_button(f, "Btn Ganti Sch", 555, 145, 55, 26, "Ganti", variant="outline", corner=13)
    draw_stepper_real(f, 1, st_y=195)
    # Left Card: Category Grid
    create_node("rectangle", "Step2 Card", 40, 270, 580, 390, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 20})
    create_node("text", "S2 Head", 65, 295, parent=f, text="Apa masalahnya?", props={"fontSize": 18, "fill": C_DARK})
    problems = [
        ("Keracunan", "Mual, muntah, pusing", "❤️", False),
        ("Tidak layak", "Basi, bau, berulat", "🍴", True),
        ("Kebersihan", "Kotor, benda asing", "🧴", False),
        ("Porsi & gizi", "Porsi kecil, menu kurang", "🥣", False),
        ("Distribusi", "Telat atau kurang", "🚚", False),
        ("Anggaran", "Dugaan penyimpangan", "💵", False),
        ("Lainnya", "Masalah lain", "💬", False)
    ]
    py_start = 335
    for idx, (pname, psub, pico, psel) in enumerate(problems):
        col = idx % 3
        row = idx // 3
        px = 65 + col * 175
        py = py_start + row * 95
        create_node("rectangle", f"ProbBox {idx}", px, py, 165, 82, parent=f, props={"fill": "#F9FAFB" if psel else "#FFFFFF", "stroke": C_DARK if psel else C_BORDER, "strokeWeight": 1.5 if psel else 1, "cornerRadius": 14})
        create_node("ellipse", f"ProbIco {idx}", px + 12, py + 12, 28, 28, parent=f, props={"fill": C_DARK if psel else "#F3F4F6"})
        create_node("text", f"ProbIcoT {idx}", px + 19, py + 18, parent=f, text=pico, props={"fontSize": 11, "fill": "#FFFFFF" if psel else C_DARK})
        create_node("text", f"ProbTit {idx}", px + 12, py + 46, parent=f, text=pname, props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"ProbSub {idx}", px + 12, py + 62, parent=f, text=psub, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        if psel:
            create_node("text", f"ProbCheck {idx}", px + 142, py + 12, parent=f, text="✓", props={"fontSize": 11, "fill": C_DARK})
    draw_button(f, "Btn S2 Back", 40, 680, 44, 44, "<-", variant="outline", corner=22)
    draw_button(f, "Btn S2 Lanjut", 95, 680, 130, 44, "Lanjut ->", variant="primary", corner=22)
    draw_sidebar_timeline(f, 1)
    draw_footer_real(f, 1340)

    # 7. 28. Alur Lapor: Langkah 3 - Cerita
    f = start_frame(1, 2, "28. Lapor Step 3 - Cerita", "28. Lapor Step 3: Ceritakan masalahnya")
    draw_navbar_public(f, "Lapor", logged_in=True)
    create_node("text", "Lapor Tit 3", 40, 95, parent=f, text="Lapor Masalah", props={"fontSize": 28, "fill": C_DARK})
    draw_button(f, "Btn Pan Top 3", 815, 95, 105, 34, "📖 Panduan", variant="outline", corner=17)
    create_node("rectangle", "Sch Sel Box 3", 40, 140, 580, 38, parent=f, props={"fill": "#F9FAFB", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 19})
    create_node("text", "Sch Sel Txt 3", 60, 151, parent=f, text="🏫 Sekolah: SD Negeri Tembalang 01 · Tembalang", props={"fontSize": 11, "fill": C_DARK})
    draw_button(f, "Btn Ganti Sch 3", 555, 145, 55, 26, "Ganti", variant="outline", corner=13)
    draw_stepper_real(f, 2, st_y=195)
    # Form Card
    create_node("rectangle", "Step3 Card", 40, 270, 580, 360, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 20})
    create_node("text", "S3 Head", 65, 295, parent=f, text="Ceritakan masalahnya", props={"fontSize": 18, "fill": C_DARK})
    create_node("text", "S3 Sub", 65, 320, parent=f, text="Jelaskan fakta temuan menu makanan secara jujur dan jelas.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("rectangle", "S3 Area Box", 65, 350, 530, 140, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
    create_node("text", "S3 Area Txt", 80, 365, width=500, parent=f, text="Sayur sop berbau asam saat tiba di kelas 4A. Setelah dicicipi terasa masam tidak wajar sehingga pembagian langsung dihentikan oleh guru kelas.", props={"fontSize": 12, "fill": C_DARK})
    create_node("text", "S3 Porsi Lbl", 65, 510, parent=f, text="Berapa perkiraan porsi / siswa terdampak?", props={"fontSize": 11, "fill": C_DARK})
    create_node("rectangle", "S3 Porsi Box", 65, 532, 530, 42, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
    create_node("text", "S3 Porsi Val", 80, 545, parent=f, text="35 siswa", props={"fontSize": 12, "fill": C_DARK})
    draw_button(f, "Btn S3 Back", 40, 650, 44, 44, "<-", variant="outline", corner=22)
    draw_button(f, "Btn S3 Lanjut", 95, 650, 130, 44, "Lanjut ->", variant="primary", corner=22)
    draw_sidebar_timeline(f, 2)
    draw_footer_real(f, 1340)

    # 8. 29. Alur Lapor: Langkah 4 - Bukti Foto
    f = start_frame(1, 3, "29. Lapor Step 4 - Bukti", "29. Lapor Step 4: Bukti Foto")
    draw_navbar_public(f, "Lapor", logged_in=True)
    create_node("text", "Lapor Tit 4", 40, 95, parent=f, text="Lapor Masalah", props={"fontSize": 28, "fill": C_DARK})
    draw_button(f, "Btn Pan Top 4", 815, 95, 105, 34, "📖 Panduan", variant="outline", corner=17)
    create_node("rectangle", "Sch Sel Box 4", 40, 140, 580, 38, parent=f, props={"fill": "#F9FAFB", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 19})
    create_node("text", "Sch Sel Txt 4", 60, 151, parent=f, text="🏫 Sekolah: SD Negeri Tembalang 01 · Tembalang", props={"fontSize": 11, "fill": C_DARK})
    draw_button(f, "Btn Ganti Sch 4", 555, 145, 55, 26, "Ganti", variant="outline", corner=13)
    draw_stepper_real(f, 3, st_y=195)
    # Form Card: Bukti Foto
    create_node("rectangle", "Step4 Card", 40, 270, 580, 410, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 20})
    create_node("text", "S4 Head", 65, 295, parent=f, text="Bukti Foto", props={"fontSize": 18, "fill": C_DARK})
    draw_pill(f, "S4 Wajib Pill", 500, 295, 95, 22, "Wajib min. 1 foto", is_active=False)
    # 3 Pills
    draw_pill(f, "S4P1", 65, 330, 125, 24, "🛡️ Hindari wajah anak", is_active=False)
    draw_pill(f, "S4P2", 200, 330, 160, 24, "🔍 Lokasi foto disembunyikan", is_active=False)
    draw_pill(f, "S4P3", 370, 330, 130, 24, "↗️ Dikompres otomatis", is_active=False)
    # 2 Big Buttons: Kamera & Galeri
    draw_button(f, "Btn S4 Kamera", 65, 370, 255, 46, "📷 Kamera", variant="outline", corner=12)
    draw_button(f, "Btn S4 Galeri", 335, 370, 255, 46, "🖼️ Galeri", variant="outline", corner=12)
    create_node("text", "S4 Help", 65, 430, parent=f, text="Maks. 3 berkas · video maks. 10 MB", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    # Uploaded thumbnail preview with diagonal 'X'
    draw_image_box(f, "S4 Thumb", 65, 455, 180, 170, corner=12)
    create_node("rectangle", "Trash Box", 215, 465, 24, 24, parent=f, props={"fill": C_DARK, "cornerRadius": 6})
    create_node("text", "Trash Ico", 221, 469, parent=f, text="🗑️", props={"fontSize": 11, "fill": "#FFFFFF"})
    create_node("rectangle", "S4 Thumb Meta", 65, 595, 180, 30, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 6})
    create_node("text", "S4 Size", 75, 604, parent=f, text="2.3 MB -> 0 KB", props={"fontSize": 9, "fill": C_TEXT_MUTED})
    create_node("text", "S4 Gps", 160, 604, parent=f, text="📍 Ada lokasi", props={"fontSize": 9, "fill": C_DARK})
    draw_button(f, "Btn S4 Back", 40, 700, 44, 44, "<-", variant="outline", corner=22)
    draw_button(f, "Btn S4 Lanjut", 95, 700, 130, 44, "Lanjut ->", variant="primary", corner=22)
    draw_sidebar_timeline(f, 3)
    draw_footer_real(f, 1340)

    # 9. 30. Alur Lapor: Langkah 5 - Identitas
    f = start_frame(1, 4, "30. Lapor Step 5 - Identitas", "30. Lapor Step 5: Identitas Pelapor")
    draw_navbar_public(f, "Lapor", logged_in=True)
    create_node("text", "Lapor Tit 5", 40, 95, parent=f, text="Lapor Masalah", props={"fontSize": 28, "fill": C_DARK})
    draw_button(f, "Btn Pan Top 5", 815, 95, 105, 34, "📖 Panduan", variant="outline", corner=17)
    create_node("rectangle", "Sch Sel Box 5", 40, 140, 580, 38, parent=f, props={"fill": "#F9FAFB", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 19})
    create_node("text", "Sch Sel Txt 5", 60, 151, parent=f, text="🏫 Sekolah: SD Negeri Tembalang 01 · Tembalang", props={"fontSize": 11, "fill": C_DARK})
    draw_stepper_real(f, 4, st_y=195)
    # Form Card: Identitas
    create_node("rectangle", "Step5 Card", 40, 270, 580, 380, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 20})
    create_node("text", "S5 Head", 65, 295, parent=f, text="Identitas Pelapor", props={"fontSize": 18, "fill": C_DARK})
    create_node("text", "S5 Sub", 65, 320, parent=f, text="Pilih bagaimana identitas Anda ditampilkan dalam pengawasan.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    # 3 Mode Cards
    modes = [
        ("Rahasia (Direkomendasikan)", "Nama hanya dibuka kepada Verifikator Independen untuk verifikasi keaslian.", True),
        ("Anonim Penuh", "Nama disamarkan total dari semua pihak termasuk verifikator.", False),
        ("Publik Terbuka", "Nama ditampilkan di feed transparansi masyarakat.", False)
    ]
    my = 350
    for idx, (mtit, mdesc, msel) in enumerate(modes):
        create_node("rectangle", f"ModeCard {idx}", 65, my, 530, 64, parent=f, props={"fill": "#F9FAFB" if msel else "#FFFFFF", "stroke": C_DARK if msel else C_BORDER, "strokeWeight": 1.5 if msel else 1, "cornerRadius": 12})
        create_node("ellipse", f"MCir {idx}", 85, my + 24, 16, 16, parent=f, props={"fill": C_DARK if msel else "#FFFFFF", "stroke": C_DARK, "strokeWeight": 1})
        if msel:
            create_node("ellipse", f"MDot {idx}", 89, my + 28, 8, 8, parent=f, props={"fill": "#FFFFFF"})
        create_node("text", f"MTit {idx}", 115, my + 14, parent=f, text=mtit, props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"MSub {idx}", 115, my + 34, width=460, parent=f, text=mdesc, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        my += 74
    draw_button(f, "Btn S5 Back", 40, 670, 44, 44, "<-", variant="outline", corner=22)
    draw_button(f, "Btn S5 Submit", 95, 670, 160, 44, "Kirim Laporan ->", variant="primary", corner=22)
    draw_sidebar_timeline(f, 4)
    draw_footer_real(f, 1340)

    # 10. 31. Alur Lapor: Langkah 6 - Sukses
    f = start_frame(1, 5, "31. Lapor Step 6 - Sukses", "31. Alur Lapor: Langkah 6 - Terkirim")
    draw_navbar_public(f, "Lapor", logged_in=True)
    # Success layout matching screenshot 31
    create_node("ellipse", "Succ Green Cir", 460, 120, 48, 48, parent=f, props={"fill": C_DARK})
    create_node("text", "Succ Green Check", 474, 132, parent=f, text="✓", props={"fontSize": 20, "fill": "#FFFFFF"})
    create_node("text", "Succ Tit Real", 440, 185, parent=f, text="Terkirim", props={"fontSize": 26, "fill": C_DARK})
    create_node("text", "Succ Sub Real", 410, 222, parent=f, text="🍴 Tidak layak · SD Tembalang 10", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    # Dashed Ticket Card
    create_node("rectangle", "Ticket Dashed Box", 310, 260, 340, 140, parent=f, props={"fill": "#FFFFFF", "stroke": C_DARK, "strokeWeight": 1.5, "cornerRadius": 16})
    create_node("text", "Ticket Lbl Real", 445, 280, parent=f, text="KODE TIKET", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "Ticket Code Real", 380, 305, parent=f, text="MBG-AG2MWK", props={"fontSize": 26, "fill": C_DARK})
    draw_button(f, "Btn Salin Real", 440, 350, 80, 30, "📋 Salin", variant="outline", corner=15)
    # Timeline Horizontal Card
    create_node("rectangle", "Timeline Horiz Card", 310, 420, 340, 100, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    t_stages = [("Diterima", "⏱ 24 jam", True), ("Verifikasi", "", True), ("Diteruskan", "⏱ 24 jam", True), ("Ditangani", "⏱ 5 hari", True), ("Selesai", "", False)]
    tx = 330
    for idx, (tname, tsla, tdone) in enumerate(t_stages):
        create_node("ellipse", f"THCir {idx}", tx + 8, 435, 26, 26, parent=f, props={"fill": C_DARK if tdone else "#F3F4F6"})
        create_node("text", f"THIco {idx}", tx + 16, 442, parent=f, text="✓" if tdone else "", props={"fontSize": 10, "fill": "#FFFFFF"})
        create_node("text", f"THName {idx}", tx, 468, parent=f, text=tname, props={"fontSize": 9, "fill": C_DARK if tdone else C_TEXT_MUTED})
        if tsla:
            create_node("text", f"THSla {idx}", tx - 4, 482, parent=f, text=tsla, props={"fontSize": 8, "fill": C_TEXT_MUTED})
        tx += 62
    # 2 Action Buttons
    draw_button(f, "Btn Pantau Real", 310, 540, 160, 42, "📋 Pantau status", variant="primary", corner=21)
    draw_button(f, "Btn Laporan Saya", 490, 540, 160, 42, "👤 Laporan saya", variant="outline", corner=21)
    draw_footer_real(f, 1340)

    # Save Progress
    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'save_file', 'arguments': {'path': docs_figcraft}}})
    print(" -> Section 2 (Alur Lapor) selesai.")

    # =========================================================================
    # ROW 2: SISTEM PENDUKUNG KEPUTUSAN (DSS) & PRIORITAS SAW (17, 18)
    # =========================================================================
    add_section_header(2, "SECTION 03: SISTEM PENDUKUNG KEPUTUSAN (DSS) & PRIORITAS SAW (/insight)", "Perankingan inspeksi dapur metode SAW multi-kriteria dan radar peringatan dini lonjakan KLB.")

    # 11. 17. Prioritas Inspeksi SAW
    f = start_frame(2, 0, "17. Prioritas Inspeksi SAW", "17. Prioritas Inspeksi Dapur (Metode SAW)")
    draw_navbar_public(f, "Insight")
    # Top Switcher Pills
    draw_pill(f, "SwPeta 17", 120, 85, 60, 30, "🗺️ Peta", is_active=False)
    draw_pill(f, "SwPrio 17", 188, 85, 80, 30, "📋 Prioritas", is_active=True)
    draw_pill(f, "SwWarn 17", 276, 85, 90, 30, "🔔 Peringatan", is_active=False)
    draw_pill(f, "SwComp 17", 374, 85, 80, 30, "⚖️ Banding", is_active=False)
    draw_button(f, "Btn Unduh PDF", 780, 85, 140, 32, "📥 Unduh PDF Resmi", variant="outline", corner=16)
    # Title row
    create_node("text", "Prio Tit", 40, 135, parent=f, text="Prioritas inspeksi ❓", props={"fontSize": 24, "fill": C_DARK})
    draw_pill(f, "Badge Terverif 17", 810, 135, 110, 24, "✓ Terverifikasi", is_active=False)
    create_node("text", "Dihitung Txt", 770, 168, parent=f, text="Dihitung 3 Nov 2026, 23.07", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    # Legend pills
    create_node("text", "Leg 1", 40, 168, parent=f, text="■ Laporan", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "Leg 2", 110, 168, parent=f, text="■ Keracunan", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "Leg 3", 190, 168, parent=f, text="■ SLHS", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "Leg 4", 250, 168, parent=f, text="■ Keterlambatan", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "Leg 5", 350, 168, parent=f, text="■ Kepuasan", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    # Filter Row
    draw_pill(f, "Filt All", 40, 200, 75, 26, "Semua 25", is_active=True)
    draw_pill(f, "Filt Hi", 125, 200, 75, 26, "• Tinggi 3", is_active=False)
    draw_pill(f, "Filt Med", 210, 200, 80, 26, "• Sedang 5", is_active=False)
    draw_pill(f, "Filt Low", 300, 200, 85, 26, "• Rendah 17", is_active=False)
    create_node("rectangle", "Search Box 17", 740, 198, 180, 30, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 15})
    create_node("text", "S Place 17", 755, 206, parent=f, text="🔍 Cari", props={"fontSize": 11, "fill": C_TEXT_LIGHT})
    # List of Ranked Kitchens
    prio_kitchens = [
        ("1", "SPPG Semarang Utara 02", "Semarang Utara", ["3 keracunan", "Tanpa SLHS", "29 laporan", "95% terlambat", "Kepuasan rendah"], "->", "• 98 · Tinggi ❓"),
        ("2", "SPPG Genuk 01", "Genuk", ["1 keracunan", "Tanpa SLHS", "24 laporan", "93% terlambat", "Kepuasan rendah"], "↑ 6", "• 90 · Tinggi ❓"),
        ("3", "SPPG Pedurungan 02", "Pedurungan", ["1 keracunan", "Tanpa SLHS", "100% terlambat", "Kepuasan rendah"], "->", "• 77 · Tinggi ❓"),
        ("4", "SPPG Tembalang 03", "Tembalang", ["Tanpa SLHS", "19 laporan", "83% terlambat"], "↓ 2", "• 62 · Sedang ❓"),
        ("5", "SPPG Semarang Tengah 01", "Semarang Tengah", ["1 keracunan", "17 laporan", "60% terlambat"], "↑ 3", "• 55 · Sedang ❓"),
        ("6", "SPPG Tembalang 01", "Tembalang", ["1 keracunan", "11 laporan"], "↑ 15", "• 52 · Sedang ❓"),
        ("7", "SPPG Semarang Timur 01", "Semarang Timur", ["1 keracunan", "67% terlambat"], "↑ 27", "• 45 · Sedang ❓"),
        ("8", "SPPG Semarang Barat 01", "Semarang Barat", ["1 keracunan", "60% terlambat"], "↑ 6", "• 42 · Sedang ❓"),
    ]
    p_y = 245
    for rank, kname, kloc, ktags, ktrend, kscore in prio_kitchens:
        create_node("rectangle", f"PrioRow {rank}", 40, p_y, 880, 68, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
        create_node("text", f"PRank {rank}", 55, p_y + 22, parent=f, text=rank, props={"fontSize": 16, "fill": C_DARK})
        create_node("text", f"PKName {rank}", 95, p_y + 12, parent=f, text=kname, props={"fontSize": 13, "fill": C_DARK})
        create_node("text", f"PKLoc {rank}", 95, p_y + 30, parent=f, text=kloc, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        # Multi-segment stacked progress bar
        create_node("rectangle", f"PBarBg {rank}", 300, p_y + 14, 380, 8, parent=f, props={"fill": "#E5E7EB", "cornerRadius": 4})
        create_node("rectangle", f"PBarSeg {rank}", 300, p_y + 14, 260, 8, parent=f, props={"fill": C_DARK, "cornerRadius": 4})
        # Tags row below bar
        tx = 300
        for tag in ktags:
            t_w = len(tag) * 6.2 + 14
            draw_pill(f, f"PTag {rank}_{tx}", tx, p_y + 34, t_w, 20, tag, is_active=False)
            tx += t_w + 6
        create_node("text", f"PTrend {rank}", 720, p_y + 24, parent=f, text=ktrend, props={"fontSize": 12, "fill": C_TEXT_MUTED})
        draw_pill(f, f"PScore {rank}", 760, p_y + 20, 115, 26, kscore, is_active=False)
        create_node("text", f"PChev {rank}", 895, p_y + 26, parent=f, text=">", props={"fontSize": 12, "fill": C_TEXT_LIGHT})
        p_y += 78
    draw_footer_real(f, 1340)

    # 12. 18. Peringatan Dini KLB
    f = start_frame(2, 1, "18. Deteksi Peringatan KLB", "18. Peringatan Dini Lonjakan KLB (/insight/peringatan)")
    draw_navbar_public(f, "Insight")
    draw_pill(f, "SwPeta 18", 120, 85, 60, 30, "🗺️ Peta", is_active=False)
    draw_pill(f, "SwPrio 18", 188, 85, 80, 30, "📋 Prioritas", is_active=False)
    draw_pill(f, "SwWarn 18", 276, 85, 90, 30, "🔔 Peringatan", is_active=True)
    draw_pill(f, "SwComp 18", 374, 85, 80, 30, "⚖️ Banding", is_active=False)
    draw_button(f, "Btn Unduh PDF 18", 780, 85, 140, 32, "📥 Unduh PDF Resmi", variant="outline", corner=16)
    create_node("text", "Warn Tit", 40, 135, parent=f, text="Peringatan dini", props={"fontSize": 28, "fill": C_DARK})
    draw_pill(f, "Badge Terverif 18", 740, 135, 100, 24, "✓ Terverifikasi", is_active=False)
    draw_pill(f, "Badge Live", 850, 135, 70, 24, "🔴 Langsung", is_active=False)
    # Filter Pills
    draw_pill(f, "WP1", 40, 180, 100, 26, "⏱ 24 jam terakhir", is_active=False)
    draw_pill(f, "WP2", 150, 180, 160, 26, "📈 > 3x rata-rata harian 30 hari", is_active=False)
    draw_pill(f, "WP3", 320, 180, 120, 26, "📋 Minimal 3 laporan", is_active=False)
    draw_pill(f, "WP4", 450, 180, 160, 26, "✓ Hanya laporan terverifikasi", is_active=False)
    # 3 Metric KPI Cards
    draw_pill(f, "WMC 1", 40, 225, 275, 90, "🔔 Aktif\n\n0", is_active=False)
    create_node("rectangle", "WMC1 Box", 40, 225, 275, 90, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("text", "WMC1 Lbl", 60, 242, parent=f, text="🔔 Aktif", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "WMC1 Val", 60, 266, parent=f, text="0", props={"fontSize": 28, "fill": C_DARK})

    create_node("rectangle", "WMC2 Box", 345, 225, 275, 90, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("text", "WMC2 Lbl", 365, 242, parent=f, text="👁️ Sinyal Ditinjau", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "WMC2 Val", 365, 266, parent=f, text="0", props={"fontSize": 28, "fill": C_DARK})
    create_node("text", "WMC2 Sub", 390, 288, parent=f, text="Menunggu verifikasi lapangan", props={"fontSize": 10, "fill": C_TEXT_LIGHT})

    create_node("rectangle", "WMC3 Box", 645, 225, 275, 90, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("text", "WMC3 Lbl", 665, 242, parent=f, text="⏱ 90 hari", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "WMC3 Val", 665, 266, parent=f, text="2", props={"fontSize": 28, "fill": C_DARK})

    # How it works callout
    create_node("rectangle", "How Box", 40, 335, 880, 64, parent=f, props={"fill": "#F9FAFB", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "How Txt", 60, 350, width=840, parent=f, text="❓ Bagaimana sistem bekerja: Sinyal lonjakan terdeteksi otomatis saat laporan warga terverifikasi melonjak >3x rata-rata harian dalam 24 jam. Tim verifikator bersama Dinas Kesehatan segera melakukan uji lapangan sebelum menetapkan status darurat.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    # Green status banner
    create_node("rectangle", "Safe Banner", 40, 415, 880, 52, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("ellipse", "Safe Cir", 60, 428, 26, 26, parent=f, props={"fill": "#F3F4F6"})
    create_node("text", "Safe Ico", 68, 434, parent=f, text="🛡️", props={"fontSize": 11, "fill": C_DARK})
    create_node("text", "Safe Txt", 98, 432, parent=f, text="Tidak ada lonjakan aktif", props={"fontSize": 13, "fill": C_DARK})
    # Riwayat Section
    create_node("text", "Riw Tit", 40, 490, parent=f, text="⏱ Riwayat", props={"fontSize": 14, "fill": C_DARK})
    # 2 Comparison Cards
    riw_cards = [
        ("SPPG Semarang Utara 02", "Semarang Utara · Selesai · 31 Okt 2026, 02.18", "x4", 1, 4),
        ("SPPG Banyumanik 01", "Banyumanik · Selesai · 26 Sep 2026, 17.11", "x20", 0.5, 10)
    ]
    rx_pos = [40, 495]
    for idx, (kname, ksub, kmul, kavg, k24) in enumerate(riw_cards):
        cx = rx_pos[idx]
        create_node("rectangle", f"RiwCard {idx}", cx, 520, 425, 130, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
        create_node("ellipse", f"RiwIco {idx}", cx + 18, 538, 32, 32, parent=f, props={"fill": "#F3F4F6"})
        create_node("text", f"RiwIcoT {idx}", cx + 27, 546, parent=f, text="🔔", props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"RiwKName {idx}", cx + 58, 536, parent=f, text=kname, props={"fontSize": 13, "fill": C_DARK})
        create_node("text", f"RiwKSub {idx}", cx + 58, 554, parent=f, text=ksub, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        create_node("text", f"RiwMul {idx}", cx + 360, 536, parent=f, text=kmul, props={"fontSize": 16, "fill": C_DARK})
        create_node("text", f"RiwMulSub {idx}", cx + 335, 556, parent=f, text="dari biasanya", props={"fontSize": 8, "fill": C_TEXT_MUTED})
        create_node("text", f"RiwAvgLbl {idx}", cx + 20, 588, parent=f, text="Rata-rata/hari", props={"fontSize": 10, "fill": C_TEXT_MUTED})
        create_node("rectangle", f"RiwAvgBar {idx}", cx + 110, 592, 250, 6, parent=f, props={"fill": "#E5E7EB", "cornerRadius": 3})
        create_node("text", f"RiwAvgVal {idx}", cx + 380, 588, parent=f, text=str(kavg), props={"fontSize": 10, "fill": C_DARK})
        create_node("text", f"Riw24Lbl {idx}", cx + 20, 612, parent=f, text="24 jam", props={"fontSize": 10, "fill": C_TEXT_MUTED})
        create_node("rectangle", f"Riw24Bar {idx}", cx + 110, 616, 250, 6, parent=f, props={"fill": C_DARK, "cornerRadius": 3})
        create_node("text", f"Riw24Val {idx}", cx + 380, 612, parent=f, text=str(k24), props={"fontSize": 10, "fill": C_DARK})
    draw_footer_real(f, 1340)

    # Save Progress
    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'save_file', 'arguments': {'path': docs_figcraft}}})
    print(" -> Section 3 (Insight SAW) selesai.")

    # =========================================================================
    # ROW 3: MEJA VERIFIKATOR & SPPG (34, 36, 38)
    # =========================================================================
    add_section_header(3, "SECTION 04: DASBOR VERIFIKATOR & MEJA PENGELOLA DAPUR SPPG", "Meja kerja validasi aduan Model MLP AI dan respon operasional dapur sentra.")

    # 13. 34. Dasbor Utama Verifikator
    f = start_frame(3, 0, "34. Dasbor Verifikator", "34. Dasbor Verifikasi (/panel)")
    draw_navbar_panel(f, "Dasbor Panel", role="Verifikator", user_code="MS", user_name="Mbak")
    create_node("text", "VTitle Real", 40, 95, parent=f, text="Dasbor Verifikasi", props={"fontSize": 28, "fill": C_DARK})
    # 4 KPI Cards matching screenshot 34
    kpis_v = [("📥 Antrean menunggu", "21", False), ("⏱ Lewat batas", "21", True), ("↗️ Siap diteruskan", "3", False), ("📂 Kasus berjalan", "26", False)]
    kx = 40
    for idx, (klbl, kval, khighlight) in enumerate(kpis_v):
        create_node("rectangle", f"VKpi {idx}", kx, 140, 205, 80, parent=f, props={"fill": "#FFFFFF", "stroke": C_DARK if khighlight else C_BORDER, "strokeWeight": 1.5 if khighlight else 1, "cornerRadius": 16})
        create_node("text", f"VKLbl {idx}", kx + 16, 154, parent=f, text=klbl, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        create_node("text", f"VKVal {idx}", kx + 16, 174, parent=f, text=kval, props={"fontSize": 26, "fill": C_DARK})
        create_node("text", f"VKArr {idx}", kx + 175, 184, parent=f, text="->", props={"fontSize": 11, "fill": C_TEXT_LIGHT})
        kx += 225
    # Antrean Masuk Section Header
    create_node("text", "Antrean Sec Tit", 40, 245, parent=f, text="Antrean Masuk", props={"fontSize": 14, "fill": C_DARK})
    create_node("text", "Antrean Sec Link", 850, 245, parent=f, text="Semua (21) ->", props={"fontSize": 12, "fill": C_DARK})
    # List of Antrean Rows matching screenshot 34
    antrean_rows = [
        ("SD Semarang Tengah 1", "Darurat", "MBG-3ACS6H · Keracunan · Semarang Tengah · 👥 100 · 📷 1 · 👁️", "", "Batas 31 Okt 2026, 15.31", "34"),
        ("SD Tembalang 10", "Darurat", "MBG-7RZQPN · Keracunan · Tembalang · 👥 7 · 📷 2 · 🔒", "+2 serupa", "Batas 31 Okt 2026, 07.00", "66"),
        ("SD Tembalang 10", "Darurat", "MBG-RM987N · Keracunan · Tembalang · 👥 7 · 📷 2 · 🔒", "+2 serupa", "Batas 31 Okt 2026, 06.30", "47"),
        ("SD Tembalang 10", "Darurat", "MBG-3MBXW9 · Keracunan · Tembalang · 👥 5 · 📷 1 · 🔒", "+2 serupa", "Batas 31 Okt 2026, 07.24", "48"),
        ("SMP Pedurungan 2", "Tinggi", "MBG-VAC8TW · Tidak layak · Pedurungan · 👥 30 · 📷 1 · 👁️", "", "Batas 31 Okt 2026, 11.08", "53"),
        ("SMP Semarang Utara 1", "Tinggi", "MBG-TY6SLL · Tidak layak · Semarang Utara · 👥 23 · 📷 1 · 🔒", "", "Batas 30 Okt 2026, 13.53", "42"),
        ("SD Pedurungan 6", "Tinggi", "MBG-3W69XT · Tidak layak · Pedurungan · 👥 12 · 📷 0 · 🔒", "", "Batas 31 Okt 2026, 18.53", "17"),
        ("SMA Pedurungan 2", "Tinggi", "MBG-2JRE4S · Porsi & gizi · Pedurungan · 👥 51 · 📷 1 · 🔒", "", "Batas 30 Okt 2026, 17.53", "67")
    ]
    ay = 275
    for idx, (asch, aurg, asub, asimilar, atime, apct) in enumerate(antrean_rows):
        create_node("rectangle", f"ARowBox {idx}", 40, ay, 880, 68, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
        create_node("ellipse", f"AIcoCir {idx}", 55, ay + 15, 36, 36, parent=f, props={"fill": "#F3F4F6"})
        create_node("text", f"AIcoTxt {idx}", 67, ay + 26, parent=f, text="❤️" if aurg == "Darurat" else "🍴", props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"ASchTxt {idx}", 105, ay + 14, parent=f, text=asch, props={"fontSize": 13, "fill": C_DARK})
        draw_pill(f, f"AUrgPill {idx}", 115 + len(asch) * 7.5, ay + 12, 60, 20, aurg, is_active=True if aurg == "Darurat" else False)
        create_node("text", f"ASubTxt {idx}", 105, ay + 38, parent=f, text=asub, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        if asimilar:
            draw_pill(f, f"ASimPill {idx}", 450, ay + 36, 75, 18, asimilar, is_active=False)
        create_node("text", f"ATimeTxt {idx}", 670, ay + 26, parent=f, text=f"⏱ {atime}", props={"fontSize": 10, "fill": C_TEXT_MUTED})
        create_node("ellipse", f"APctCir {idx}", 815, ay + 18, 30, 30, parent=f, props={"fill": "#F3F4F6", "stroke": C_BORDER, "strokeWeight": 1})
        create_node("text", f"APctTxt {idx}", 822, ay + 27, parent=f, text=apct, props={"fontSize": 9, "fill": C_DARK})
        create_node("text", f"AChev {idx}", 855, ay + 26, parent=f, text=">", props={"fontSize": 12, "fill": C_TEXT_LIGHT})
        ay += 76
    draw_footer_real(f, 1340)

    # 14. 36. Ruang Kerja Inspeksi & Radar AI MLP
    f = start_frame(3, 1, "36. Inspeksi Detail Laporan", "36. Meja Inspeksi Laporan & Radar AI MLP")
    draw_navbar_panel(f, "Antrean Verifikasi", role="Verifikator", user_code="MS", user_name="Mbak")
    create_node("text", "Back Antrean", 40, 85, parent=f, text="<- Antrean", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("ellipse", "Ins Ico Cir", 40, 105, 36, 36, parent=f, props={"fill": "#F3F4F6"})
    create_node("text", "Ins Ico Txt", 51, 116, parent=f, text="❤️", props={"fontSize": 13, "fill": C_DARK})
    create_node("text", "Ins Head Tit", 88, 102, parent=f, text="Keracunan", props={"fontSize": 20, "fill": C_DARK})
    create_node("text", "Ins Head Sub", 88, 126, parent=f, text="MBG-3ACS6H", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    draw_pill(f, "Darurat Pill 36", 710, 105, 65, 24, "Darurat", is_active=True)
    create_node("text", "Ins Batas Txt", 785, 110, parent=f, text="⏱ Batas 31 Okt 2026, 15.31", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # Left Column (w: 520)
    create_node("rectangle", "Ins Detail Card", 40, 160, 520, 260, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("text", "ISch 36", 60, 178, parent=f, text="🏫 SD Semarang Tengah 1 (SD · 424 siswa · Semarang Tengah)", props={"fontSize": 11, "fill": C_DARK})
    create_node("text", "ISppg 36", 60, 202, parent=f, text="🍴 SPPG Semarang Tengah 01", props={"fontSize": 11, "fill": C_DARK})
    draw_pill(f, "ISppgPill 36", 240, 198, 90, 20, "• 55 · Sedang ❓", is_active=False)
    create_node("text", "ITime 36", 60, 228, parent=f, text="📅 31 Okt 2026, 09.26", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "IDampak 36", 240, 228, parent=f, text="👥 100 terdampak", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("rectangle", "INarasi Real", 60, 255, 480, 42, parent=f, props={"fill": "#F9FAFB", "cornerRadius": 8})
    create_node("text", "INarasi Txt 36", 75, 268, parent=f, text="jadi pada jhjdfjuhufdbububufdbubudf", props={"fontSize": 11, "fill": C_DARK})
    # Inner AI Card
    create_node("rectangle", "IAi Box Real", 60, 310, 480, 95, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
    create_node("text", "IAi Tit Real", 75, 320, parent=f, text="🤖 Evaluasi ML Multimodal (Feedforward MLP)", props={"fontSize": 10, "fill": C_DARK})
    draw_pill(f, "IAi Badge", 320, 316, 210, 20, "Keaslian: 0% · Indikasi Fiktif / Tidak Sesuai", is_active=False)
    ai_4m = [("Leksikon MBG", "0%"), ("Gejala Anomali", "0%"), ("Kesesuaian Waktu Foto", "50%"), ("Radius GPS Foto", "50%")]
    ax = 75
    for m_lbl, m_val in ai_4m:
        create_node("rectangle", f"AIMBox {m_lbl}", ax, 345, 105, 36, parent=f, props={"fill": "#F9FAFB", "cornerRadius": 6})
        create_node("text", f"AIML {m_lbl}", ax + 8, 350, parent=f, text=m_lbl, props={"fontSize": 8, "fill": C_TEXT_MUTED})
        create_node("text", f"AIMV {m_lbl}", ax + 8, 363, parent=f, text=m_val, props={"fontSize": 11, "fill": C_DARK})
        ax += 114
    create_node("text", "IAi Saran", 75, 388, parent=f, text="Saran Klasifikasi: Keracunan · Urgensi: darurat", props={"fontSize": 9, "fill": C_DARK})

    # Photo Proof Card
    create_node("rectangle", "Proof Card 36", 40, 435, 520, 190, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("text", "Proof Tit 36", 60, 452, parent=f, text="📷 Bukti", props={"fontSize": 13, "fill": C_DARK})
    draw_image_box(f, "Proof Img 36", 60, 475, 160, 115, corner=8)
    create_node("rectangle", "Proof Meta Box", 60, 595, 160, 20, parent=f, props={"fill": "#F9FAFB", "cornerRadius": 4})
    create_node("text", "Proof Meta Txt", 70, 599, parent=f, text="- Waktu   - Lokasi", props={"fontSize": 9, "fill": C_TEXT_MUTED})

    # Kredibilitas & Pelapor (Side by side)
    create_node("rectangle", "Kred Card 36", 40, 640, 250, 120, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("text", "Kred Tit 36", 60, 655, parent=f, text="Kredibilitas", props={"fontSize": 12, "fill": C_DARK})
    create_node("ellipse", "Kred Cir 36", 60, 680, 44, 44, parent=f, props={"fill": "#F3F4F6", "stroke": C_BORDER, "strokeWeight": 1})
    create_node("text", "Kred Val 36", 72, 694, parent=f, text="34", props={"fontSize": 16, "fill": C_DARK})
    create_node("text", "Kred Met 1", 120, 678, parent=f, text="Bukti: 25/30", props={"fontSize": 9, "fill": C_TEXT_MUTED})
    create_node("text", "Kred Met 2", 120, 694, parent=f, text="Metadata: 0/25", props={"fontSize": 9, "fill": C_TEXT_MUTED})
    create_node("text", "Kred Met 3", 120, 710, parent=f, text="Status pelapor: 6/25", props={"fontSize": 9, "fill": C_TEXT_MUTED})

    create_node("rectangle", "Pelapor Card 36", 310, 640, 250, 120, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("text", "Pelapor Tit 36", 330, 655, parent=f, text="👁️ Pelapor · Anonim", props={"fontSize": 12, "fill": C_DARK})
    create_node("text", "Pelapor Sub 36", 330, 680, width=210, parent=f, text="Identitas disembunyikan (anonim).\nIdentitas tidak pernah dibagikan ke instansi atau publik.", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    # Right Column: Examination & Decision
    create_node("rectangle", "Exam Card 36", 580, 160, 340, 380, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("text", "Exam Tit 36", 605, 185, parent=f, text="Pemeriksaan", props={"fontSize": 13, "fill": C_DARK})
    checks = ["[ ] Bukti relevan dengan laporan", "[ ] Waktu dan lokasi masuk akal", "[ ] Bukan spam atau tuduhan pribadi", "[ ] Kategori sudah sesuai"]
    cy = 215
    for chk in checks:
        create_node("text", f"Chk_{cy}", 605, cy, parent=f, text=chk, props={"fontSize": 11, "fill": C_DARK})
        cy += 28
    create_node("text", "Masuk Kasus Tit", 605, 335, parent=f, text="Masuk ke kasus", props={"fontSize": 12, "fill": C_DARK})
    create_node("rectangle", "Kasus Sel Box", 605, 355, 290, 32, parent=f, props={"fill": "#F9FAFB", "stroke": C_DARK, "strokeWeight": 1, "cornerRadius": 8})
    create_node("text", "Kasus Sel Txt", 620, 364, parent=f, text="◉ 📁 Kasus baru", props={"fontSize": 11, "fill": C_DARK})
    create_node("rectangle", "Kasus Inp Box", 605, 395, 290, 36, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
    create_node("text", "Kasus Inp Txt", 618, 406, parent=f, text="Keracunan di SD Semarang Tengah 1", props={"fontSize": 11, "fill": C_DARK})
    create_node("rectangle", "Kasus Textarea", 605, 440, 290, 48, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
    create_node("text", "Kasus Area Txt", 618, 452, parent=f, text="Catatan untuk timeline (opsional)", props={"fontSize": 10, "fill": C_TEXT_LIGHT})
    # Action Buttons
    draw_button(f, "Btn Tolak 36", 605, 500, 135, 40, "✖ Tolak", variant="outline", corner=20)
    draw_button(f, "Btn Verif 36", 755, 500, 140, 40, "✓ Verifikasi", variant="primary", corner=20)
    draw_footer_real(f, 1340)

    # 15. 38. Dasbor Dapur SPPG
    f = start_frame(3, 2, "38. Dasbor Dapur SPPG", "38. Dasbor Dapur SPPG (/panel)")
    draw_navbar_panel(f, "Dasbor Dapur", role="SPPG", user_code="PS", user_name="Pengelola")
    create_node("text", "SPPG Tit Real", 40, 95, parent=f, text="Pengelola SPPG Tembalang 03", props={"fontSize": 28, "fill": C_DARK})
    draw_button(f, "Btn Profil Sppg", 790, 95, 130, 34, "Profil & SLHS ->", variant="outline", corner=17)
    # 3 KPI Cards matching screenshot 38
    sppg_kpis = [("↗️ Perlu ditanggapi", "1", False), ("⏱ Lewat batas (SLA)", "1", True), ("🔧 Sedang ditangani", "2", False)]
    sx = 40
    for idx, (slbl, sval, shighlight) in enumerate(sppg_kpis):
        create_node("rectangle", f"SKpi {idx}", sx, 140, 275, 80, parent=f, props={"fill": "#FFFFFF", "stroke": C_DARK if shighlight else C_BORDER, "strokeWeight": 1.5 if shighlight else 1, "cornerRadius": 16})
        create_node("text", f"SKLbl {idx}", sx + 16, 154, parent=f, text=slbl, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        create_node("text", f"SKVal {idx}", sx + 16, 174, parent=f, text=sval, props={"fontSize": 26, "fill": C_DARK})
        create_node("text", f"SKArr {idx}", sx + 245, 184, parent=f, text="->", props={"fontSize": 11, "fill": C_TEXT_LIGHT})
        sx += 300
    create_node("text", "Kasus Aktif Tit", 40, 245, parent=f, text="Kasus Aktif", props={"fontSize": 14, "fill": C_DARK})
    create_node("text", "Semua Kasus Link", 845, 245, parent=f, text="Semua kasus", props={"fontSize": 12, "fill": C_DARK})
    sppg_cases = [
        ("Kebersihan dapur/penyajian di SMA Tembalang 3", "KS-UGULBVG · SPPG Tembalang 03 · 🛡️ Pengelola SPPG Tembalang 03 · 💬 2", "⚠️ Tidak ditanggapi", "↗️ Diteruskan", "Batas 25 Okt 2026, 17.30"),
        ("Dugaan masalah pengadaan di TK Tembalang 2", "KS-PRYPFV7 · SPPG Tembalang 03 · 🛡️ Ombudsman RI Perwakilan Jawa Tengah · 💬 1", "⚠️ Tidak ditanggapi", "↗️ Diteruskan", "Batas 3 Nov 2026, 19.16"),
        ("Makanan tidak layak di SD Tembalang 10", "KS-NF6YNKK · SPPG Tembalang 03 · 🛡️ Pengelola SPPG Tembalang 03 · 💬 2", "⏱ Melewati batas waktu", "Ditindaklanjuti", "Batas 2 Nov 2026, 14.30"),
        ("Makanan tidak layak di SD Tembalang 12", "KS-94BUHRM · SPPG Tembalang 03 · 🛡️ Pengelola SPPG Tembalang 03 · 💬 2", "⏱ Melewati batas waktu", "Ditindaklanjuti", "Batas 3 Nov 2026, 02.01"),
        ("Dugaan masalah pengadaan di SD Tembalang 11", "KS-9BPCXU6 · SPPG Tembalang 03 · 🛡️ Ombudsman RI Perwakilan Jawa Tengah · 💬 1", "⏱ Melewati batas waktu", "Ditindaklanjuti", "Batas 3 Nov 2026, 03.27"),
        ("Kebersihan dapur/penyajian di TK Tembalang 2", "KS-UFJNCHZ · SPPG Tembalang 03 · 🛡️ Dinas Kesehatan Kota Semarang · 💬 2", "⏱ Melewati batas waktu", "Ditindaklanjuti", "Batas 3 Nov 2026, 21.42")
    ]
    sy = 275
    for idx, (ctit, csub, cb1, cb2, ctime) in enumerate(sppg_cases):
        create_node("rectangle", f"SCaseBox {idx}", 40, sy, 880, 68, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
        create_node("ellipse", f"SCIcoCir {idx}", 55, sy + 15, 36, 36, parent=f, props={"fill": "#F3F4F6"})
        create_node("text", f"SCIcoTxt {idx}", 67, sy + 26, parent=f, text="🧴" if "Kebersihan" in ctit else ("💵" if "pengadaan" in ctit else "🍴"), props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"SCTitTxt {idx}", 105, sy + 14, parent=f, text=ctit, props={"fontSize": 13, "fill": C_DARK})
        create_node("text", f"SCSubTxt {idx}", 105, sy + 38, parent=f, text=csub, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        b1_w = 135 if "Melewati" in cb1 else 115
        b1_x = 455 if "Melewati" in cb1 else 475
        draw_pill(f, f"SCB1 {idx}", b1_x, sy + 22, b1_w, 22, cb1, is_active=False)
        draw_pill(f, f"SCB2 {idx}", 600, sy + 22, 95, 22, cb2, is_active=False)
        create_node("text", f"SCTimeTxt {idx}", 710, sy + 26, parent=f, text=f"⏱ {ctime}", props={"fontSize": 10, "fill": C_TEXT_MUTED})
        create_node("text", f"SCChev {idx}", 865, sy + 26, parent=f, text=">", props={"fontSize": 12, "fill": C_TEXT_LIGHT})
        sy += 76
    draw_footer_real(f, 1340)

    # Save Progress
    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'save_file', 'arguments': {'path': docs_figcraft}}})
    print(" -> Section 4 (Verifikator & SPPG) selesai.")

    # =========================================================================
    # ROW 4: DINKES, KORWIL BGN & SUPERADMIN (41, 43, 45, 47)
    # =========================================================================
    add_section_header(4, "SECTION 05: DINAS KESEHATAN, KORWIL BGN & SUPERADMIN", "Pengawasan higienitas Dinkes, akuntabilitas audit Korwil, dasbor admin, dan konfigurasi SLA.")

    # 16. 41. Dasbor Pengawasan Dinkes
    f = start_frame(4, 0, "41. Dasbor Dinkes", "41. Dasbor Pengawasan Dinkes (/panel)")
    draw_navbar_panel(f, "Dasbor Medis", role="Dinkes", user_code="PH", user_name="Pak")
    create_node("text", "Dinkes Tit", 40, 95, parent=f, text="Dinas Kesehatan Kota Semarang", props={"fontSize": 28, "fill": C_DARK})
    dinkes_kpis = [("📥 Perlu ditanggapi", "10", False), ("⏱ Lewat batas (SLA)", "10", True), ("🔔 Peringatan aktif", "0", False), ("⚙️ SPPG risiko tinggi", "3", False)]
    dx = 40
    for idx, (dlbl, dval, dhighlight) in enumerate(dinkes_kpis):
        create_node("rectangle", f"DKpi {idx}", dx, 140, 205, 80, parent=f, props={"fill": "#FFFFFF", "stroke": C_DARK if dhighlight else C_BORDER, "strokeWeight": 1.5 if dhighlight else 1, "cornerRadius": 16})
        create_node("text", f"DKLbl {idx}", dx + 16, 154, parent=f, text=dlbl, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        create_node("text", f"DKVal {idx}", dx + 16, 174, parent=f, text=dval, props={"fontSize": 26, "fill": C_DARK})
        create_node("text", f"DKArr {idx}", dx + 175, 184, parent=f, text="->", props={"fontSize": 11, "fill": C_TEXT_LIGHT})
        dx += 225
    create_node("text", "Dinkes Sec Tit", 40, 245, parent=f, text="Kasus Kesehatan & Higiene", props={"fontSize": 14, "fill": C_DARK})
    create_node("text", "Dinkes Sec Link", 845, 245, parent=f, text="Semua kasus", props={"fontSize": 12, "fill": C_DARK})
    
    # 8 Kasus Real Dinkes from screenshot 41
    dinkes_cases = [
        ("Makanan tidak layak di SD Semarang Utara 6", "KS-FL32TBV · SPPG Semarang Utara 02 · 🛡️ Dinas Kesehatan Kota Semarang · 💬 1", "⚠️ Tidak ditanggapi", "↗️ Diteruskan", "Batas 1 Nov 2026, 01.57"),
        ("Makanan tidak layak di TK Semarang Utara 2", "KS-3MHGNLM · SPPG Semarang Utara 02 · 🛡️ Dinas Kesehatan Kota Semarang · 💬 1", "⚠️ Tidak ditanggapi", "↗️ Diteruskan", "Batas 31 Okt 2026, 19.00"),
        ("Kebersihan dapur/penyajian di SMA Tugu 1", "KS-5MTTBJG · SPPG Tugu 01 · 🛡️ Dinas Kesehatan Kota Semarang · 💬 1", "⚠️ Tidak ditanggapi", "↗️ Diteruskan", "Batas 1 Nov 2026, 17.07"),
        ("Makanan tidak layak di SD Semarang Utara 6", "KS-H3VH37K · SPPG Semarang Utara 02 · 🛡️ Dinas Kesehatan Kota Semarang · 💬 1", "⚠️ Tidak ditanggapi", "↗️ Diteruskan", "Batas 31 Okt 2026, 13.00"),
        ("Dugaan keracunan di SD Semarang Utara 5", "KS-K9AQXW3 · SPPG Semarang Utara 02 · 🛡️ Dinas Kesehatan Kota Semarang · 💬 1", "⚠️ Tidak ditanggapi", "↗️ Diteruskan", "Batas 30 Okt 2026, 16.00"),
        ("Kebersihan dapur/penyajian di SD Semarang Barat 4", "KS-JWRYTDY · SPPG Semarang Barat 02 · 🛡️ Dinas Kesehatan Kota Semarang · 💬 1", "⚠️ Tidak ditanggapi", "↗️ Diteruskan", "Batas 1 Nov 2026, 08.57"),
        ("Dugaan keracunan di SMA Semarang Selatan 2", "KS-TB4B9XN · SPPG Semarang Selatan 01 · 🛡️ Dinas Kesehatan Kota Semarang · 💬 1", "⏱ Melewati batas waktu", "Ditindaklanjuti", "Batas 2 Nov 2026, 05.37"),
        ("Kebersihan dapur/penyajian di SD Banyumanik 2", "KS-VXMMX4W · SPPG Banyumanik 01 · 🛡️ Dinas Kesehatan Kota Semarang · 💬 1", "⚠️ Tidak ditanggapi", "↗️ Diteruskan", "Batas 31 Okt 2026, 23.07")
    ]
    dy = 275
    for idx, (dtit, dsub, db1, db2, dtime) in enumerate(dinkes_cases):
        create_node("rectangle", f"DCaseBox {idx}", 40, dy, 880, 68, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
        create_node("ellipse", f"DCIcoCir {idx}", 55, dy + 15, 36, 36, parent=f, props={"fill": "#F3F4F6"})
        create_node("text", f"DCIcoTxt {idx}", 67, dy + 26, parent=f, text="❤️" if "keracunan" in dtit else ("🧴" if "Kebersihan" in dtit else "🍴"), props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"DCTitTxt {idx}", 105, dy + 14, parent=f, text=dtit, props={"fontSize": 13, "fill": C_DARK})
        create_node("text", f"DCSubTxt {idx}", 105, dy + 38, parent=f, text=dsub, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        b1_w = 135 if "Melewati" in db1 else 115
        b1_x = 455 if "Melewati" in db1 else 475
        draw_pill(f, f"DCB1 {idx}", b1_x, dy + 22, b1_w, 22, db1, is_active=False)
        draw_pill(f, f"DCB2 {idx}", 600, dy + 22, 95, 22, db2, is_active=False)
        create_node("text", f"DCTimeTxt {idx}", 710, dy + 26, parent=f, text=f"⏱ {dtime}", props={"fontSize": 10, "fill": C_TEXT_MUTED})
        create_node("text", f"DCChev {idx}", 865, dy + 26, parent=f, text=">", props={"fontSize": 12, "fill": C_TEXT_LIGHT})
        dy += 76
    draw_footer_real(f, 1340)

    # 17. 43. Papan Akuntabilitas Korwil BGN
    f = start_frame(4, 1, "43. Akuntabilitas Korwil BGN", "43. Papan Akuntabilitas Korwil BGN")
    draw_navbar_panel(f, "Papan Akuntabilitas", role="Korwil", user_code="KB", user_name="Korwil")
    # Matching screenshot 43 banner card
    create_node("rectangle", "Korwil Banner Card", 40, 80, 880, 210, parent=f, props={"fill": "#F9FAFB", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 20})
    draw_pill(f, "KwPill1", 60, 100, 170, 22, "⚖️ Pengawasan Kinerja & SLA", is_active=False)
    create_node("text", "KwTit", 60, 132, parent=f, text="Papan Akuntabilitas SPPG Wilayah", props={"fontSize": 20, "fill": C_DARK})
    draw_pill(f, "KwPill2", 430, 130, 95, 22, "✓ Terverifikasi", is_active=False)
    create_node("text", "KwSub", 60, 160, width=650, parent=f, text="Memantau kedisiplinan dapur dan instansi dalam merespons aduan masyarakat serta memastikan kepatuhan batas waktu (SLA).", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    # 4 Inner KPI Cards
    kw_kpis = [("📁 Total Kasus", "698"), ("✓ Tingkat Penyelesaian", "90,5%"), ("⏱ Rata-rata Respons", "46,8 jam"), ("⚠️ Melewati Batas (SLA)", "56,1%")]
    kx = 60
    for idx, (klbl, kval) in enumerate(kw_kpis):
        create_node("rectangle", f"KwKpiBox {idx}", kx, 195, 195, 75, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
        create_node("text", f"KwKLbl {idx}", kx + 14, 208, parent=f, text=klbl, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        create_node("text", f"KwKVal {idx}", kx + 14, 228, parent=f, text=kval, props={"fontSize": 20, "fill": C_DARK})
        kx += 210
    # Switcher & Sort Pills
    draw_pill(f, "SwKw1", 40, 315, 80, 28, "Per SPPG", is_active=True)
    draw_pill(f, "SwKw2", 125, 315, 110, 28, "Per kecamatan", is_active=False)
    draw_pill(f, "SortKw1", 40, 355, 85, 28, "📁 Kasus ↓", is_active=True)
    draw_pill(f, "SortKw2", 130, 355, 75, 28, "✓ Selesai", is_active=False)
    draw_pill(f, "SortKw3", 210, 355, 85, 28, "⏱ Tanggap", is_active=False)
    draw_pill(f, "SortKw4", 300, 355, 95, 28, "⚠️ Terlambat", is_active=False)
    draw_pill(f, "SortKw5", 400, 355, 85, 28, "⭐ Kepuasan", is_active=False)
    # Performance Table matching screenshot 43
    create_node("rectangle", "KwTbl Box", 40, 395, 880, 480, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("rectangle", "KwTH", 40, 395, 880, 36, parent=f, props={"fill": "#F9FAFB"})
    create_node("text", "KwTH 1", 55, 406, parent=f, text="SPPG", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "KwTH 2", 330, 406, parent=f, text="📁 Kasus", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "KwTH 3", 440, 406, parent=f, text="✓ Selesai", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "KwTH 4", 570, 406, parent=f, text="⏱ Tanggap", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "KwTH 5", 680, 406, parent=f, text="⚠️ Terlambat", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "KwTH 6", 790, 406, parent=f, text="⭐ Kepuasan", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    tbl_rows_kw = [
        ("SPPG Semarang Utara 02", "Semarang Utara", "68", "77,9%", "3,1 hari", "98,5% [10]", "★ 1,8"),
        ("SPPG Pedurungan 02", "Pedurungan", "58", "86,2%", "3,1 hari", "100% [1]", "★ 1,9"),
        ("SPPG Genuk 01", "Genuk", "53", "88,7%", "3,5 hari", "98,1%", "★ 2,0"),
        ("SPPG Tembalang 03", "Tembalang", "50", "88,0%", "2,0 hari", "80,0% [2]", "★ 3,0"),
        ("SPPG Tugu 01", "Tugu", "31", "96,8%", "34,5 jam", "51,6% [1]", "★ 4,3"),
        ("SPPG Semarang Tengah 01", "Semarang Tengah", "29", "96,6%", "33,6 jam", "44,8%", "★ 3,9"),
        ("SPPG Banyumanik 01", "Banyumanik", "27", "88,9%", "40,9 jam", "44,4% [1]", "★ 4,2")
    ]
    ty = 431
    for r_sppg, r_loc, r_kas, r_sel, r_tang, r_terl, r_kep in tbl_rows_kw:
        create_node("rectangle", f"KTR_{ty}", 40, ty, 880, 52, parent=f, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
        create_node("text", f"KTD1_{ty}", 55, ty + 12, parent=f, text=r_sppg, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"KTD1s_{ty}", 55, ty + 28, parent=f, text=r_loc, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        create_node("text", f"KTD2_{ty}", 330, ty + 18, parent=f, text=r_kas, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"KTD3_{ty}", 440, ty + 18, parent=f, text=r_sel, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"KTD4_{ty}", 570, ty + 18, parent=f, text=r_tang, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"KTD5_{ty}", 680, ty + 18, parent=f, text=r_terl, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"KTD6_{ty}", 790, ty + 18, parent=f, text=r_kep, props={"fontSize": 11, "fill": C_DARK})
        ty += 52
    draw_footer_real(f, 1340)

    # 18. 45. Dasbor Utama Administrator Sistem
    f = start_frame(4, 2, "45. Dasbor Admin", "45. Administrasi Sistem Superadmin (/panel)")
    draw_navbar_panel(f, "Dasbor Admin", role="Admin", user_code="AP", user_name="Admin")
    create_node("text", "Admin Tit Real", 40, 95, parent=f, text="Administrasi Sistem", props={"fontSize": 28, "fill": C_DARK})
    # 4 KPI Cards matching screenshot 45
    admin_kpis = [("👥 Pengguna", "271", False), ("⏱ Aturan SLA", "35", False), ("📁 Kasus aktif", "63", False), ("⏱ Lewat batas", "24", True)]
    ax = 40
    for idx, (albl, aval, ahighlight) in enumerate(admin_kpis):
        create_node("rectangle", f"AKpi {idx}", ax, 140, 205, 80, parent=f, props={"fill": "#FFFFFF", "stroke": C_DARK if ahighlight else C_BORDER, "strokeWeight": 1.5 if ahighlight else 1, "cornerRadius": 16})
        create_node("text", f"AKLbl {idx}", ax + 16, 154, parent=f, text=albl, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        create_node("text", f"AKVal {idx}", ax + 16, 174, parent=f, text=aval, props={"fontSize": 26, "fill": C_DARK})
        create_node("text", f"AKArr {idx}", ax + 175, 184, parent=f, text="->", props={"fontSize": 11, "fill": C_TEXT_LIGHT})
        ax += 225
    draw_footer_real(f, 1340)

    # 19. 46. Manajemen Pengguna RBAC
    f = start_frame(4, 3, "46. Manajemen Pengguna RBAC", "46. Kelola Pengguna & Peran (/panel/pengguna)")
    draw_navbar_panel(f, "Kelola Pengguna", role="Admin", user_code="AP", user_name="Admin")
    create_node("text", "User Tit Real", 40, 95, parent=f, text="Pengguna", props={"fontSize": 28, "fill": C_DARK})
    # Search input
    create_node("rectangle", "User S Box", 40, 140, 320, 42, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 21})
    create_node("text", "User S Ico", 55, 153, parent=f, text="🔍", props={"fontSize": 11, "fill": C_TEXT_LIGHT})
    create_node("text", "User S Place", 75, 153, parent=f, text="Cari nama atau email pengguna...", props={"fontSize": 11, "fill": C_TEXT_LIGHT})
    create_node("ellipse", "User S Btn", 325, 146, 30, 30, parent=f, props={"fill": "#F3F4F6"})
    create_node("text", "User S Arr", 335, 153, parent=f, text="->", props={"fontSize": 11, "fill": C_DARK})
    # List of Users matching screenshot 46
    users_data = [
        ("Mbak Sari", "sari@pmbgm.test · 0 laporan", "Verifikator", "", True),
        ("Pengelola SPPG Tembalang 03", "sppg@pmbgm.test · 0 laporan", "Instansi", "Pengelola SPPG Tembalang 03", True),
        ("Korwil BGN Kota Semarang", "korwil@pmbgm.test · 0 laporan", "Instansi", "Korwil BGN Kota Semarang", True),
        ("Pak Hendra", "hendra@pmbgm.test · 0 laporan", "Instansi", "Dinas Kesehatan Kota Sema...", True),
        ("Admin PMBGM", "admin@pmbgm.test · 0 laporan", "Admin", "", True),
        ("Rina Santoso ✓", "pelapor241@pmbgm.test · 0 laporan", "Pelapor", "", True),
        ("Yuni Wijaya ✓", "pelapor240@pmbgm.test · 2 laporan", "Pelapor", "", True),
        ("Bambang Handayani", "pelapor237@pmbgm.test · 6 laporan", "Pelapor", "", True),
        ("Sri Wijaya", "pelapor245@pmbgm.test · 4 laporan", "Pelapor", "", True),
        ("Siti Santoso ✓", "pelapor244@pmbgm.test · 5 laporan", "Pelapor", "", True),
    ]
    uy = 198
    for idx, (uname, umeta, urole, uinst, uverif) in enumerate(users_data):
        create_node("rectangle", f"UBox {idx}", 40, uy, 880, 56, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
        create_node("text", f"UTit {idx}", 55, uy + 12, parent=f, text=uname, props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"UMeta {idx}", 55, uy + 30, parent=f, text=umeta, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        # Role select
        create_node("rectangle", f"URoleBox {idx}", 440, uy + 12, 105, 32, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
        create_node("text", f"URoleTxt {idx}", 452, uy + 21, parent=f, text=f"{urole} v", props={"fontSize": 10, "fill": C_DARK})
        if uinst:
            create_node("rectangle", f"UInstBox {idx}", 555, uy + 12, 140, 32, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
            create_node("text", f"UInstTxt {idx}", 565, uy + 21, parent=f, text=f"{uinst} v", props={"fontSize": 9, "fill": C_DARK})
        # Checkbox Terverifikasi
        create_node("rectangle", f"UChkBox {idx}", 705, uy + 20, 16, 16, parent=f, props={"fill": C_DARK if uverif else "#FFFFFF", "stroke": C_DARK, "strokeWeight": 1, "cornerRadius": 4})
        if uverif:
            create_node("text", f"UChkIco {idx}", 709, uy + 22, parent=f, text="✓", props={"fontSize": 10, "fill": "#FFFFFF"})
        create_node("text", f"UVerTxt {idx}", 728, uy + 21, parent=f, text="✓ Terverifikasi", props={"fontSize": 10, "fill": C_DARK})
        # Button Simpan
        draw_button(f, f"BtnSave {idx}", 815, uy + 13, 85, 30, "💾 Simpan", variant="outline", corner=8)
        uy += 64
    draw_footer_real(f, 1340)

    # 20. 47. Aturan Batas Waktu SLA Superadmin
    f = start_frame(4, 4, "47. Aturan Batas Waktu SLA", "47. Konfigurasi Aturan SLA (/panel/sla)")
    draw_navbar_panel(f, "Aturan SLA", role="Admin", user_code="AP", user_name="Admin")
    create_node("text", "Sla Tit Real", 40, 95, parent=f, text="Batas waktu", props={"fontSize": 28, "fill": C_DARK})
    create_node("text", "Sla Sub Real", 40, 130, parent=f, text="ℹ️ Dalam jam. Berlaku untuk tahap yang dimulai setelah diubah; lewat batas otomatis ditandai dan dinaikkan prioritasnya.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    # SLA Table matching screenshot 47
    create_node("rectangle", "SlaTbl Box Real", 40, 160, 880, 420, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("rectangle", "SlaTH Real", 40, 160, 880, 36, parent=f, props={"fill": "#F9FAFB"})
    create_node("text", "SlaTH 1", 55, 171, parent=f, text="Kategori", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "SlaTH 2", 340, 171, parent=f, text="Verifikasi", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "SlaTH 3", 460, 171, parent=f, text="Diteruskan", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "SlaTH 4", 580, 171, parent=f, text="Ditanggapi", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "SlaTH 5", 700, 171, parent=f, text="Selesai", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "SlaTH 6", 820, 171, parent=f, text="Buka ulang", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    sla_rows = [
        ("Keracunan", "❤️", "6", "2", "6", "72", "24"),
        ("Tidak layak", "🍴", "24", "12", "24", "120", "48"),
        ("Kebersihan", "🧴", "48", "24", "48", "168", "72"),
        ("Porsi & gizi", "🥣", "48", "24", "72", "168", "72"),
        ("Distribusi", "🚚", "24", "12", "24", "72", "48"),
        ("Anggaran", "💵", "72", "48", "168", "720", "168"),
        ("Lainnya", "💬", "72", "48", "120", "336", "120")
    ]
    sly = 196
    for c_name, c_ico, v1, v2, v3, v4, v5 in sla_rows:
        create_node("rectangle", f"SLTR_{sly}", 40, sly, 880, 48, parent=f, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
        create_node("text", f"SLName_{sly}", 55, sly + 16, parent=f, text=f"{c_ico} {c_name}", props={"fontSize": 11, "fill": C_DARK})
        vals = [v1, v2, v3, v4, v5]
        vx_offsets = [330, 450, 570, 690, 810]
        for v_idx, val in enumerate(vals):
            vx = vx_offsets[v_idx]
            create_node("rectangle", f"SLBox_{sly}_{v_idx}", vx, sly + 8, 55, 32, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
            create_node("text", f"SLVal_{sly}_{v_idx}", vx + 16, sly + 17, parent=f, text=val, props={"fontSize": 11, "fill": C_DARK})
            create_node("text", f"SLUnit_{sly}_{v_idx}", vx + 38, sly + 17, parent=f, text="j", props={"fontSize": 10, "fill": C_TEXT_MUTED})
        sly += 48
    draw_footer_real(f, 1340)

    # Save Final Master Document
    print("\n[4/5] Menyimpan proyek master .figcraft...")
    save_res1 = send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'save_file', 'arguments': {'path': output_figcraft}}})
    print(" -> Saved to root:", output_figcraft, save_res1.get('result', {}).get('content', [{}])[0].get('text', 'OK'))
    save_res2 = send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'save_file', 'arguments': {'path': docs_figcraft}}})
    print(" -> Saved to docs:", docs_figcraft, save_res2.get('result', {}).get('content', [{}])[0].get('text', 'OK'))

    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'run_command', 'arguments': {'command': 'view.zoomFit'}}})
    time.sleep(0.5)

    p.kill()
    print("FigCraft headless session selesai.")

    # Render overview & export individual frames
    print("\n[5/5] Merender Overview dan mengekspor seluruh artboard individu...")
    try:
        r_proc = subprocess.run([cli_path, 'render', '--scale', '0.25', '--out', overview_png, output_figcraft], capture_output=True, text=True, timeout=60)
        print(" -> Overview PNG exported:", overview_png, "Return code:", r_proc.returncode)
    except Exception as e:
        print(" -> Render note:", e)

    try:
        e_proc = subprocess.run([cli_path, 'export', '--out', render_folder, output_figcraft], capture_output=True, text=True, timeout=60)
        print(" -> Exported all frames to:", render_folder, "Return code:", e_proc.returncode)
    except Exception as e:
        print(" -> Export note:", e)

    print("=" * 75)
    print("BERHASIL: Wireframe SAMA PERSIS dengan Screenshot Telah Selesai!")
    print("Dokumen: d:/UNNES/LOMBA/MIA 2026/Web/PMBGM_Wireframes.figcraft")
    print("=" * 75)

if __name__ == "__main__":
    main()
