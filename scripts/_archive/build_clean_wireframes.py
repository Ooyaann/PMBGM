"""
PMBGM - PURE MONOCHROME TEXTBOOK WIREFRAME ARCHITECT (FIGCRAFT)
MIA 2026: Sistem Pemantau MBG Masyarakat (Kota Semarang)

PRINSIP KETAT:
1. ZERO EMOJIS (No AI Slop): Menggunakan glyph/vektor geometris minimalis wireframe asli.
2. DYNAMIC FRAME HEIGHT: Tinggi frame disesuaikan dengan konten riil tiap halaman (tidak dipukul rata 1440px).
3. BERANDA MINIMALIS: Mengikuti screenshot 01 (Google-Style portal tanpa footer).
4. PRESISI UI/UX: Grid, jarak (spacing), hirarki tipografi, padding kartu, dan garis silang 'X' diagonal untuk media.
"""

import subprocess
import json
import time
import os

cli_path = r"D:\Program Files\ArtCraft\FigCraft\figcraft-cli.exe"
output_figcraft = r"d:\UNNES\LOMBA\MIA 2026\Web\PMBGM_Wireframes.figcraft"
docs_figcraft = r"d:\UNNES\LOMBA\MIA 2026\Web\pantaugizi\docs\PMBGM_Wireframe_Master.figcraft"
overview_png = r"C:\Users\nayotamaryptra\.gemini\antigravity\brain\00907903-8e5d-45cc-81b9-de65c309d732\PMBGM_Wireframes_All_Overview.png"
render_folder = r"d:\UNNES\LOMBA\MIA 2026\Web\wireframe_renders"

# Palet Monokrom Textbook Wireframe
C_DARK = "#18181B"        # Hitam pekat elemen aktif/teks utama
C_DARK_SUB = "#27272A"    # Abu-abu gelap teks sekunder
C_BORDER = "#E4E4E7"      # Garis bingkai netral wireframe
C_BORDER_DARK = "#18181B" # Garis aktif/fokus
C_BG_CARD = "#FFFFFF"     # Latar kartu putih
C_BG_MUTED = "#F4F4F5"    # Latar abu-abu elemen sekunder
C_BG_SUBTLE = "#F9FAFB"   # Latar abu-abu sangat muda
C_TEXT_MUTED = "#71717A"  # Teks sekunder/keterangan
C_TEXT_LIGHT = "#A1A1AA"  # Teks placeholder/border nonaktif
C_CROSS = "#CBD5E1"       # Garis silang diagonal 'X' media placeholder

os.makedirs(render_folder, exist_ok=True)

def main():
    print("=" * 75)
    print("PMBGM - PURE MONOCHROME TEXTBOOK WIREFRAME GENERATOR (FIGCRAFT)")
    print("100% Persis Screenshot Aktual, Zero Emojis, Dynamic Heights, Rapi & Presisi")
    print("=" * 75)

    p = subprocess.Popen(
        [cli_path, "mcp"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding="utf-8",
        errors="replace"
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
    send({'jsonrpc': '2.0', 'method': 'initialize', 'params': {'protocolVersion': '2024-11-05', 'capabilities': {}, 'clientInfo': {'name': 'pmbgm_wireframes', 'version': '4.0'}}})
    p.stdin.write(json.dumps({'jsonrpc': '2.0', 'method': 'notifications/initialized', 'params': {}}) + '\n')
    p.stdin.flush()

    def create_node(node_type, name, x=0, y=0, width=None, height=None, parent=None, props=None, text=None, path=None):
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

    # Base Canvas Spacing
    FRAME_W = 960
    COL_GAP = 80
    ROW_GAP = 120

    # Layout Grid Coordinates
    # Row Y Positions (computed dynamically to prevent vertical overlap)
    row_y = [100, 1100, 1960, 2940, 3950]

    def start_frame(row, col, title, frame_height=800):
        fx = 100 + col * (FRAME_W + COL_GAP)
        fy = row_y[row]
        fid = create_node("frame", title, fx, fy, FRAME_W, frame_height, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1})
        create_node("text", f"LBL_{title}", fx, fy - 32, parent=None, text=title.upper(), props={"fontSize": 12, "fill": C_TEXT_MUTED})
        return fid

    def add_section_header(row, title, subtitle):
        sy = row_y[row] - 70
        create_node("text", f"SEC_{row}", 100, sy, parent=None, text=title, props={"fontSize": 18, "fill": C_DARK})
        create_node("text", f"SECSUB_{row}", 100, sy + 24, parent=None, text=subtitle, props={"fontSize": 12, "fill": C_TEXT_MUTED})

    # -------------------------------------------------------------------------
    # CLEAN WIREFRAME VECTOR COMPONENT HELPERS (ZERO EMOJIS!)
    # -------------------------------------------------------------------------

    def draw_button(fid, name, x, y, w, h, text, variant="primary", corner=8):
        if variant == "primary":
            create_node("rectangle", f"{name} Box", x, y, w, h, parent=fid, props={"fill": C_DARK, "cornerRadius": corner})
            create_node("text", f"{name} Txt", x + max(8, (w - len(text) * 6.8) / 2), y + (h - 13) / 2, parent=fid, text=text, props={"fill": "#FFFFFF", "fontSize": 12})
        elif variant == "subtle":
            create_node("rectangle", f"{name} Box", x, y, w, h, parent=fid, props={"fill": C_BG_MUTED, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": corner})
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

    def draw_image_box(fid, name, x, y, w, h, corner=4):
        # Pure textbook wireframe image placeholder with diagonal 'X'
        create_node("rectangle", f"{name} Bg", x, y, w, h, parent=fid, props={"fill": C_BG_MUTED, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": corner})
        create_node("vector", f"{name} X", x, y, w, h, parent=fid, path=f"M0 0 L{w} {h} M0 {h} L{w} 0", props={"stroke": C_CROSS, "strokeWeight": 1})

    def draw_avatar_wireframe(fid, name, cx, cy, r=16):
        # Clean geometric user avatar silhouette
        create_node("ellipse", f"{name} Cir", cx - r, cy - r, r * 2, r * 2, parent=fid, props={"fill": C_BG_MUTED, "stroke": C_BORDER, "strokeWeight": 1})
        create_node("ellipse", f"{name} Head", cx - (r * 0.38), cy - (r * 0.55), r * 0.76, r * 0.76, parent=fid, props={"fill": C_TEXT_LIGHT})
        create_node("rectangle", f"{name} Body", cx - (r * 0.65), cy + (r * 0.15), r * 1.3, r * 0.7, parent=fid, props={"fill": C_TEXT_LIGHT, "cornerRadius": 3})

    def draw_icon_search(fid, name, x, y):
        # Clean minimal search glass icon
        create_node("ellipse", f"{name} SGlass", x, y, 10, 10, parent=fid, props={"stroke": C_TEXT_MUTED, "strokeWeight": 1.5, "fill": "#FFFFFF"})
        create_node("line", f"{name} SHandle", x + 8, y + 8, 4, 4, parent=fid, props={"stroke": C_TEXT_MUTED, "strokeWeight": 1.5})

    def draw_navbar_public(fid, active="Beranda", logged_in=False, user_name="Ibu"):
        # Header 64px
        create_node("rectangle", "Navbar Base", 0, 0, FRAME_W, 64, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1})
        # Brand Logo on left
        create_node("ellipse", "Nav Logo Cir", 36, 18, 28, 28, parent=fid, props={"fill": C_BG_MUTED, "stroke": C_BORDER, "strokeWeight": 1})
        create_node("text", "Nav Logo Txt", 45, 25, parent=fid, text="P", props={"fontSize": 13, "fill": C_DARK})
        create_node("text", "Nav Brand Name", 72, 20, parent=fid, text="PMBGM", props={"fontSize": 15, "fill": C_DARK})
        create_node("text", "Nav Brand Sub", 72, 36, parent=fid, text="PEMANTAU MBG MASYARAKAT", props={"fontSize": 8, "fill": C_TEXT_MUTED})
        # Center Nav Links (clean, no emojis)
        links = [("Beranda", 0), ("Lacak", 75), ("Data Terbuka", 145), ("Insight", 255), ("Panduan", 330)]
        start_x = 300
        for l_text, offset_x in links:
            is_act = (l_text == active)
            has_drop = (l_text != "Beranda")
            display_text = f"{l_text} v" if has_drop else l_text
            if is_act:
                create_node("rectangle", f"NavPill {l_text}", start_x + offset_x - 8, 18, len(display_text) * 7.5 + 16, 28, parent=fid, props={"fill": C_BG_MUTED, "cornerRadius": 14})
            create_node("text", f"NavTxt {l_text}", start_x + offset_x, 25, parent=fid, text=display_text, props={"fontSize": 12, "fill": C_DARK if is_act else C_TEXT_MUTED})
        # Right Actions
        if not logged_in:
            draw_button(fid, "Nav Lapor", 745, 16, 115, 32, "Lapor Masalah", variant="primary", corner=16)
            draw_button(fid, "Nav Masuk", 870, 16, 60, 32, "Masuk", variant="outline", corner=16)
        else:
            draw_button(fid, "Nav Lapor MBG", 685, 16, 135, 32, "Lapor MBG Sekolah", variant="primary", corner=16)
            create_node("rectangle", "Nav User Box", 830, 16, 100, 32, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
            draw_avatar_wireframe(fid, "Nav User Av", 845, 32, 10)
            create_node("text", "Nav User Name", 862, 25, parent=fid, text=f"{user_name} v", props={"fontSize": 11, "fill": C_DARK})

    def draw_navbar_panel(fid, active_tab="Dasbor Panel", role="Verifikator", user_code="MS", user_name="Mbak"):
        create_node("rectangle", "Panel Nav Base", 0, 0, FRAME_W, 64, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1})
        # Brand on left
        create_node("ellipse", "PNav Logo Cir", 36, 18, 28, 28, parent=fid, props={"fill": C_BG_MUTED, "stroke": C_BORDER, "strokeWeight": 1})
        create_node("text", "PNav Logo Txt", 45, 25, parent=fid, text="P", props={"fontSize": 13, "fill": C_DARK})
        create_node("text", "PNav Brand Name", 72, 20, parent=fid, text="PMBGM", props={"fontSize": 15, "fill": C_DARK})
        create_node("text", "PNav Brand Sub", 72, 36, parent=fid, text="PEMANTAU MBG MASYARAKAT", props={"fontSize": 8, "fill": C_TEXT_MUTED})

        # Tabs based on role (clean text, no emojis)
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
            if is_act:
                create_node("rectangle", f"PNavPill {t_text}", start_x + offset_x - 8, 18, len(t_text) * 7.2 + 16, 28, parent=fid, props={"fill": C_BG_MUTED, "cornerRadius": 14})
            create_node("text", f"PNavTxt {t_text}", start_x + offset_x, 25, parent=fid, text=t_text, props={"fontSize": 12, "fill": C_DARK if is_act else C_TEXT_MUTED})

        # User Pill on Right
        create_node("rectangle", "PNav User Box", 840, 16, 90, 32, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
        create_node("ellipse", "PNav User Cir", 846, 20, 24, 24, parent=fid, props={"fill": C_DARK})
        create_node("text", "PNav User Init", 851, 26, parent=fid, text=user_code, props={"fontSize": 9, "fill": "#FFFFFF"})
        create_node("text", "PNav User Name", 874, 25, parent=fid, text=f"{user_name} v", props={"fontSize": 11, "fill": C_DARK})

    def draw_footer_real(fid, y_pos):
        create_node("rectangle", "Footer Divider", 0, y_pos, FRAME_W, 1, parent=fid, props={"fill": C_BORDER})
        cols = [
            (40, "PMBGM", ["Platform pengawasan partisipatif masyarakat", "untuk transparansi dan mutu Program Makan", "Bergizi Gratis.", "Data Simulasi · MIA 2026"]),
            (340, "LAYANAN WARGA", ["Lapor Masalah", "Lacak Tiket", "Cari Sekolah & Dapur", "Panduan & Simulator"]),
            (540, "TRANSPARANSI DATA", ["Data Terbuka", "Peta Risiko SAW", "Metodologi & SLA", "Unduh Data"]),
            (740, "BANTUAN & REGULASI", ["Tanya Jawab (FAQ)", "Privasi Pelapor", "Tentang PMBGM", "Darurat Ambulans: 119"])
        ]
        for cx, ctit, clinks in cols:
            create_node("text", f"FTit {cx}", cx, y_pos + 25, parent=fid, text=ctit, props={"fontSize": 11, "fill": C_DARK})
            ly = y_pos + 45
            for cl in clinks:
                create_node("text", f"FLink {cx}_{ly}", cx, ly, parent=fid, text=cl, props={"fontSize": 10, "fill": C_TEXT_MUTED})
                ly += 16

    # =========================================================================
    # ROW 0: PORTAL PUBLIK & PENGADUAN WARGA (01, 04, 08, 25)
    # =========================================================================
    add_section_header(0, "SECTION 01: PORTAL PUBLIK & PENGADUAN WARGA", "Portal pencarian terpadu, penelusuran status tiket terbuka, direktori sekolah, dan autentikasi multi-peran.")

    # 1. 01. Beranda Utama (Landing Page)
    # TINGGI FRAME: 520px (Persis screenshot 01 - Google style tanpa footer!)
    f = start_frame(0, 0, "01. Beranda Utama", frame_height=520)
    draw_navbar_public(f, active="Beranda", logged_in=False)

    # Hero Center Box
    create_node("text", "Hero Brand", 355, 175, parent=f, text="PMBGM", props={"fontSize": 48, "fill": C_DARK})
    create_node("text", "Hero Sub", 365, 232, parent=f, text="P E M A N T A U   M B G   M A S Y A R A K A T", props={"fontSize": 9, "fill": C_TEXT_MUTED})

    # Search Bar (rounded-full)
    create_node("rectangle", "Search Box", 200, 265, 560, 48, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 24})
    draw_icon_search(f, "HeroSearchIco", 225, 281)
    create_node("text", "Search Place", 248, 281, parent=f, text="Cari sekolah, dapur SPPG, atau kode tiket...", props={"fontSize": 12, "fill": C_TEXT_LIGHT})

    # 2 Action Buttons
    draw_button(f, "Btn Buat Lapor", 350, 330, 125, 42, "Buat Laporan", variant="primary", corner=21)
    draw_button(f, "Btn Lacak", 485, 330, 125, 42, "Lacak Tiket", variant="outline", corner=21)

    # Stat Pill
    create_node("rectangle", "Stat Pill Bg", 345, 390, 270, 28, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "Stat Pill Txt", 365, 397, parent=f, text="• 165 Sekolah    • 40 Dapur SPPG    • Darurat 119", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    # Selesai pada y=440, tidak ada footer sesuai screenshot 01!

    # 2. 04. Pelacakan Kasus
    # TINGGI FRAME: 780px
    f = start_frame(0, 1, "04. Pelacakan Kasus", frame_height=780)
    draw_navbar_public(f, active="Lacak", logged_in=False)

    create_node("text", "Lacak Tit", 40, 90, parent=f, text="Lacak", props={"fontSize": 28, "fill": C_DARK})
    draw_pill(f, "SwCek", 740, 90, 85, 30, "Cek tiket", is_active=True)
    draw_pill(f, "SwAkun", 835, 90, 95, 30, "Akuntabilitas", is_active=False)

    # Search ticket input
    create_node("rectangle", "Lacak SBox", 40, 135, 350, 42, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 21})
    create_node("text", "Lacak SPlace", 65, 148, parent=f, text="Cek status: MBG-XXXXXX", props={"fontSize": 12, "fill": C_TEXT_LIGHT})
    create_node("ellipse", "Lacak SBtn", 352, 141, 30, 30, parent=f, props={"fill": C_BG_MUTED})
    create_node("text", "Lacak SArr", 362, 148, parent=f, text="→", props={"fontSize": 12, "fill": C_DARK})

    # Section & Filters
    create_node("text", "Kasus Tit", 40, 205, parent=f, text="Kasus Terbaru di Wilayah", props={"fontSize": 15, "fill": C_DARK})
    draw_pill(f, "Badge Terverif", 835, 202, 95, 24, "✓ Terverifikasi", is_active=False)
    create_node("text", "Kasus Sub", 40, 226, parent=f, text="Laporan terverifikasi yang sedang atau telah ditangani secara terbuka.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # Filters
    create_node("text", "Waktu Lbl", 40, 260, parent=f, text="Waktu:", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    draw_pill(f, "W1", 85, 255, 60, 24, "Semua", is_active=True)
    draw_pill(f, "W2", 152, 255, 60, 24, "7 Hari", is_active=False)
    draw_pill(f, "W3", 218, 255, 65, 24, "30 Hari", is_active=False)

    create_node("text", "Status Lbl", 700, 260, parent=f, text="Status:", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    draw_pill(f, "S1", 745, 255, 60, 24, "Semua", is_active=True)
    draw_pill(f, "S2", 812, 255, 65, 24, "Diproses", is_active=False)
    draw_pill(f, "S3", 884, 255, 55, 24, "Selesai", is_active=False)

    # 8 Case Cards (2 Cols x 4 Rows)
    cases_data = [
        ("Masalah distribusi di SD Ngaliyan 6", "Ngaliyan · 31 Okt 2026, 00.41", "✓ Diverifikasi", "Melewati batas waktu", "DS"),
        ("Masalah distribusi di SD Banyumanik 10", "Banyumanik · 30 Okt 2026, 23.51", "Diteruskan", "Tidak ditanggapi", "DS"),
        ("Porsi/gizi tidak sesuai di SD Candisari 3", "Candisari · 30 Okt 2026, 23.37", "✓ Diverifikasi", "Melewati batas waktu", "PG"),
        ("Makanan tidak layak di SMP Pedurungan 1", "Pedurungan · 30 Okt 2026, 20.01", "Diteruskan", "Tidak ditanggapi", "TL"),
        ("Makanan tidak layak di TK Semarang Utara 2", "Semarang Utara · 30 Okt 2026, 18.30", "Diteruskan", "Tidak ditanggapi", "TL"),
        ("Dugaan masalah pengadaan di SD Gunungpati 2", "Gunungpati · 30 Okt 2026, 18.13", "✓ Diverifikasi", "Melewati batas waktu", "AG"),
        ("Makanan tidak layak di SD Semarang Utara 6", "Semarang Utara · 30 Okt 2026, 16.57", "Diteruskan", "Tidak ditanggapi", "TL"),
        ("Porsi/gizi tidak sesuai di SMP Semarang Timur 2", "Semarang Timur · 30 Okt 2026, 15.48", "Diteruskan", "Tidak ditanggapi", "PG"),
    ]
    cy = 295
    for idx in range(0, len(cases_data), 2):
        for col_i in range(2):
            c_idx = idx + col_i
            ctit, csub, cpill1, cpill2, ccode = cases_data[c_idx]
            cx = 40 if col_i == 0 else 495
            create_node("rectangle", f"CCard {c_idx}", cx, cy, 425, 78, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
            create_node("ellipse", f"CCIco {c_idx}", cx + 16, cy + 16, 28, 28, parent=f, props={"fill": C_BG_MUTED})
            create_node("text", f"CCode {c_idx}", cx + 22, cy + 22, parent=f, text=ccode, props={"fontSize": 10, "fill": C_DARK})
            create_node("text", f"CCTit {c_idx}", cx + 55, cy + 14, parent=f, text=ctit, props={"fontSize": 12, "fill": C_DARK})
            create_node("text", f"CCSub {c_idx}", cx + 55, cy + 32, parent=f, text=csub, props={"fontSize": 10, "fill": C_TEXT_MUTED})
            draw_pill(f, f"CP1 {c_idx}", cx + 55, cy + 50, len(cpill1) * 6.2 + 16, 18, cpill1, is_active=False)
            draw_pill(f, f"CP2 {c_idx}", cx + 75 + len(cpill1) * 6.2 + 16, cy + 50, len(cpill2) * 6.2 + 16, 18, cpill2, is_active=False)
        cy += 88
    draw_footer_real(f, 660)

    # 3. 08. Cari Sekolah
    # TINGGI FRAME: 860px
    f = start_frame(0, 2, "08. Cari Sekolah", frame_height=860)
    draw_navbar_public(f, active="Data Terbuka", logged_in=False)

    create_node("text", "Sch Tit", 40, 90, parent=f, text="Cari Sekolah", props={"fontSize": 28, "fill": C_DARK})
    draw_pill(f, "Sch Sim Badge", 225, 95, 70, 22, "Simulasi", is_active=False)

    # Search bar right
    create_node("rectangle", "Sch SBox", 590, 88, 330, 40, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 20})
    draw_icon_search(f, "SchSIco", 605, 100)
    create_node("text", "Sch SPlace", 625, 100, parent=f, text="Cari sekolah, kecamatan, SPPG...", props={"fontSize": 11, "fill": C_TEXT_LIGHT})
    create_node("ellipse", "Sch SBtn", 885, 93, 30, 30, parent=f, props={"fill": C_BG_MUTED})
    create_node("text", "Sch SArr", 894, 99, parent=f, text="→", props={"fontSize": 12, "fill": C_DARK})

    create_node("text", "Sch Count", 40, 138, parent=f, text="Menampilkan 12 dari 165 sekolah", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # 8 School Cards
    sch_data = [
        ("SD Banyumanik 1", "SD · Banyumanik · 276 siswa", "99000109", "SPPG Banyumanik 01", "21 · Rendah", "0 berjalan · 5 total"),
        ("SD Banyumanik 10", "SD · Banyumanik · 263 siswa", "99000121", "SPPG Banyumanik 02", "14 · Rendah", "1 berjalan · 5 total"),
        ("SD Banyumanik 2", "SD · Banyumanik · 301 siswa", "99000110", "SPPG Banyumanik 01", "21 · Rendah", "2 berjalan · 5 total"),
        ("SD Banyumanik 3", "SD · Banyumanik · 368 siswa", "99000111", "SPPG Banyumanik 01", "21 · Rendah", "1 berjalan · 5 total"),
        ("SD Banyumanik 4", "SD · Banyumanik · 398 siswa", "99000115", "SPPG Banyumanik 01", "21 · Rendah", "0 berjalan · 0 total"),
        ("SD Banyumanik 5", "SD · Banyumanik · 294 siswa", "99000116", "SPPG Banyumanik 02", "14 · Rendah", "0 berjalan · 2 total"),
        ("SD Banyumanik 6", "SD · Banyumanik · 191 siswa", "99000117", "SPPG Banyumanik 02", "14 · Rendah", "0 berjalan · 4 total"),
        ("SD Banyumanik 7", "SD · Banyumanik · 555 siswa", "99000118", "SPPG Banyumanik 02", "14 · Rendah", "0 berjalan · 1 total"),
    ]
    sc_y = 168
    for idx in range(0, len(sch_data), 2):
        for col_i in range(2):
            s_idx = idx + col_i
            sname, smeta, snpsn, ssppg, srisk, sstat = sch_data[s_idx]
            cx = 40 if col_i == 0 else 495
            create_node("rectangle", f"SCard {s_idx}", cx, sc_y, 425, 120, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
            create_node("ellipse", f"SCIco {s_idx}", cx + 16, sc_y + 16, 28, 28, parent=f, props={"fill": C_BG_MUTED})
            create_node("text", f"SCIcoTxt {s_idx}", cx + 24, sc_y + 22, parent=f, text="S", props={"fontSize": 11, "fill": C_DARK})
            create_node("text", f"SCTit {s_idx}", cx + 55, sc_y + 14, parent=f, text=sname, props={"fontSize": 13, "fill": C_DARK})
            create_node("text", f"SCMeta {s_idx}", cx + 55, sc_y + 32, parent=f, text=smeta, props={"fontSize": 10, "fill": C_TEXT_MUTED})
            draw_pill(f, f"SCNpsn {s_idx}", cx + 245, sc_y + 28, 90, 18, f"NPSN {snpsn}", is_active=False)
            create_node("text", f"SCSppg {s_idx}", cx + 20, sc_y + 60, parent=f, text=ssppg, props={"fontSize": 11, "fill": C_DARK})
            draw_pill(f, f"SCSlhs {s_idx}", cx + 215, sc_y + 58, 85, 20, "✓ SLHS Aktif", is_active=False)
            draw_pill(f, f"SCRisk {s_idx}", cx + 305, sc_y + 58, 100, 20, f"• {srisk}", is_active=False)
            draw_pill(f, f"SCStat {s_idx}", cx + 20, sc_y + 88, 115, 20, sstat, is_active=False)
            draw_button(f, f"SCBtn {s_idx}", cx + 345, sc_y + 86, 65, 24, "Lapor", variant="primary", corner=12)
        sc_y += 132
    draw_footer_real(f, 740)

    # 4. 25. Masuk Persona Multi-Role
    # TINGGI FRAME: 720px
    f = start_frame(0, 3, "25. Masuk Persona Multi-Role", frame_height=720)
    # Left 50% Dark Panel
    create_node("rectangle", "Left Dark Panel", 0, 0, 480, 720, parent=f, props={"fill": C_DARK})
    create_node("ellipse", "LDP Logo Cir", 40, 36, 26, 26, parent=f, props={"fill": "#27272A"})
    create_node("text", "LDP Logo Txt", 49, 41, parent=f, text="P", props={"fontSize": 12, "fill": "#FFFFFF"})
    create_node("text", "LDP Brand Name", 75, 36, parent=f, text="PMBGM", props={"fontSize": 14, "fill": "#FFFFFF"})
    create_node("text", "LDP Brand Sub", 75, 52, parent=f, text="PEMANTAU MBG MASYARAKAT", props={"fontSize": 8, "fill": "#A1A1AA"})

    create_node("text", "LDP Big Tit 1", 40, 260, parent=f, text="Kawal Gizi,", props={"fontSize": 42, "fill": "#FFFFFF"})
    create_node("text", "LDP Big Tit 2", 40, 312, parent=f, text="Jaga Generasi.", props={"fontSize": 42, "fill": "#FFFFFF"})
    create_node("text", "LDP Sub Desc", 40, 375, width=380, parent=f, text="Pengawasan independen mutu dan distribusi Makan Bergizi Gratis di seluruh Indonesia.", props={"fontSize": 12, "fill": "#A1A1AA"})
    create_node("text", "LDP Bottom", 40, 670, parent=f, text="MIA 2026 • Inovasi Pengawasan MBG", props={"fontSize": 11, "fill": "#71717A"})

    # Right 50% White Panel
    create_node("text", "RDP Back", 520, 40, parent=f, text="← Kembali ke Beranda", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "RDP Tit", 560, 160, parent=f, text="Masuk", props={"fontSize": 30, "fill": C_DARK})
    create_node("text", "RDP Sub", 560, 200, parent=f, text="Pilih peranmu, lalu masuk untuk mengakses sistem.", props={"fontSize": 12, "fill": C_TEXT_MUTED})

    draw_pill(f, "Tab Sim Peran", 560, 235, 140, 34, "Simulasi Peran", is_active=True)
    draw_pill(f, "Tab Masuk Email", 710, 235, 140, 34, "Masuk Email", is_active=False)

    roles_real = [
        ("Ibu Rina", "Warga / Orang Tua", True),
        ("Pak Budi", "Guru Sekolah", False),
        ("Mbak Sari", "Verifikator Lapangan", False),
        ("Mitra Dapur", "Dapur SPPG", False),
        ("Pak Hendra", "Dinas Kesehatan", False),
        ("Korwil BGN", "Pengawas SLA", False)
    ]
    ry_start = 290
    for idx, (rname, rrole, ris_sel) in enumerate(roles_real):
        col = idx % 2
        row = idx // 2
        rx = 560 if col == 0 else 715
        ry = ry_start + row * 58
        create_node("rectangle", f"RBox {idx}", rx, ry, 145, 50, parent=f, props={"fill": C_BG_MUTED if ris_sel else "#FFFFFF", "stroke": C_DARK if ris_sel else C_BORDER, "strokeWeight": 1.5 if ris_sel else 1, "cornerRadius": 14})
        draw_avatar_wireframe(f, f"RAv {idx}", rx + 24, ry + 25, 12)
        create_node("text", f"RNTxt {idx}", rx + 44, ry + 12, parent=f, text=rname, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"RRTxt {idx}", rx + 44, ry + 27, parent=f, text=rrole, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        if ris_sel:
            create_node("text", f"RCheck {idx}", rx + 125, ry + 18, parent=f, text="✓", props={"fontSize": 11, "fill": C_DARK})

    # Admin Sistem full width
    create_node("rectangle", "AdminCard", 560, 475, 300, 50, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    draw_avatar_wireframe(f, "AdminAv", 584, 500, 12)
    create_node("text", "AdminNTxt", 604, 487, parent=f, text="Admin Sistem", props={"fontSize": 11, "fill": C_DARK})
    create_node("text", "AdminRTxt", 604, 502, parent=f, text="Administrator", props={"fontSize": 9, "fill": C_TEXT_MUTED})

    draw_button(f, "Btn Masuk Persona", 560, 545, 300, 44, "Masuk →", variant="primary", corner=22)

    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'save_file', 'arguments': {'path': docs_figcraft}}})
    print(" -> Section 1 (Publik) selesai.")

    # =========================================================================
    # ROW 1: ALUR MULTI-LANGKAH FORMULIR PELAPORAN (/lapor)
    # =========================================================================
    add_section_header(1, "SECTION 02: ALUR MULTI-LANGKAH FORMULIR PELAPORAN (/lapor)", "Pilihan sekolah, pemilihan 7 kategori masalah, penulisan kronologi, bukti kamera, hingga penerbitan tiket.")

    def draw_stepper_clean(fid, active_step=0, st_y=140):
        step_names = ["Sekolah", "Masalah", "Cerita", "Bukti", "Kirim"]
        st_x = 100
        for idx, s_name in enumerate(step_names):
            is_active = (idx == active_step)
            is_done = (idx < active_step)
            if idx > 0:
                create_node("line", f"StLine {idx}_{st_y}", st_x - 65, st_y + 14, 65, 0, parent=fid, props={"stroke": C_DARK if is_done else C_BORDER, "strokeWeight": 2})
            bg = C_DARK if is_done else (C_BG_MUTED if is_active else "#FFFFFF")
            stroke = C_DARK if (is_active or is_done) else C_BORDER
            create_node("ellipse", f"StCir {idx}_{st_y}", st_x, st_y, 28, 28, parent=fid, props={"fill": bg, "stroke": stroke, "strokeWeight": 2 if is_active else 1})
            txt = "✓" if is_done else str(idx + 1)
            create_node("text", f"StIco {idx}_{st_y}", st_x + (8 if is_done else 10), st_y + 7, parent=fid, text=txt, props={"fontSize": 11, "fill": "#FFFFFF" if is_done else C_DARK})
            create_node("text", f"StLbl {idx}_{st_y}", st_x - 6, st_y + 34, parent=fid, text=s_name, props={"fontSize": 10, "fill": C_DARK if (is_active or is_done) else C_TEXT_MUTED})
            st_x += 120

    def draw_sidebar_timeline_clean(fid, y_start=135):
        create_node("rectangle", "Side Timeline Box", 655, y_start, 265, 300, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
        create_node("text", "ST Tit", 675, y_start + 18, parent=fid, text="Setelah dikirim", props={"fontSize": 12, "fill": C_DARK})
        stages = [("Diterima", "24 jam"), ("Verifikasi", "12 jam"), ("Diteruskan", "24 jam"), ("Ditangani", "5 hari"), ("Selesai", "")]
        sy = y_start + 45
        for idx, (st_name, st_sla) in enumerate(stages):
            create_node("ellipse", f"STL Cir {idx}", 675, sy, 20, 20, parent=fid, props={"fill": C_BG_MUTED, "stroke": C_BORDER, "strokeWeight": 1})
            create_node("text", f"STL Num {idx}", 682, sy + 4, parent=fid, text=str(idx+1), props={"fontSize": 9, "fill": C_DARK})
            create_node("text", f"STL Name {idx}", 705, sy + 3, parent=fid, text=st_name, props={"fontSize": 11, "fill": C_DARK})
            if st_sla:
                create_node("text", f"STL Sla {idx}", 850, sy + 3, parent=fid, text=st_sla, props={"fontSize": 9, "fill": C_TEXT_MUTED})
            sy += 36
        create_node("rectangle", "ST Callout", 670, y_start + 235, 235, 45, parent=fid, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
        create_node("text", "ST Lock Txt", 685, y_start + 245, width=205, parent=fid, text="Belum tampil publik sebelum diverifikasi.", props={"fontSize": 9, "fill": C_TEXT_MUTED})

    # 5. 26. Alur Lapor: Langkah 1 - Sekolah
    # TINGGI FRAME: 520px
    f = start_frame(1, 0, "26. Lapor Step 1 - Sekolah", frame_height=520)
    draw_navbar_public(f, active="Lapor", logged_in=True)
    create_node("text", "Lapor Tit 1", 40, 90, parent=f, text="Lapor Masalah", props={"fontSize": 26, "fill": C_DARK})
    draw_button(f, "Btn Pan Top 1", 825, 90, 95, 30, "Panduan", variant="outline", corner=15)
    draw_stepper_clean(f, 0, st_y=140)

    # Left Card
    create_node("rectangle", "Step1 Card", 40, 210, 580, 130, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("text", "S1 Head", 65, 235, parent=f, text="Sekolah mana?", props={"fontSize": 16, "fill": C_DARK})
    create_node("rectangle", "S1 Input Box", 65, 268, 530, 44, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 22})
    draw_icon_search(f, "S1SearchIco", 80, 282)
    create_node("text", "S1 S Place", 102, 282, parent=f, text="Cari atau pilih sekolah...", props={"fontSize": 12, "fill": C_TEXT_LIGHT})
    draw_button(f, "Btn S1 Lanjut", 40, 360, 120, 40, "Lanjut →", variant="primary", corner=20)

    draw_sidebar_timeline_clean(f, y_start=140)

    # 6. 27. Lapor Step 2 - Masalah
    # TINGGI FRAME: 740px
    f = start_frame(1, 1, "27. Lapor Step 2 - Masalah", frame_height=740)
    draw_navbar_public(f, active="Lapor", logged_in=True)
    create_node("text", "Lapor Tit 2", 40, 90, parent=f, text="Lapor Masalah", props={"fontSize": 26, "fill": C_DARK})
    draw_button(f, "Btn Pan Top 2", 825, 90, 95, 30, "Panduan", variant="outline", corner=15)

    # School selected banner
    create_node("rectangle", "Sch Sel Box 2", 40, 135, 580, 36, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 18})
    create_node("text", "Sch Sel Txt 2", 60, 146, parent=f, text="Sekolah: SD Negeri Tembalang 01 · Tembalang", props={"fontSize": 11, "fill": C_DARK})
    draw_button(f, "Btn Ganti Sch 2", 555, 141, 55, 24, "Ganti", variant="outline", corner=12)

    draw_stepper_clean(f, 1, st_y=190)

    # Left Card: Category Grid
    create_node("rectangle", "Step2 Card", 40, 260, 580, 380, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("text", "S2 Head", 65, 282, parent=f, text="Apa masalahnya?", props={"fontSize": 16, "fill": C_DARK})
    problems = [
        ("Keracunan", "Mual, muntah, pusing", "KR", False),
        ("Tidak layak", "Basi, bau, berulat", "TL", True),
        ("Kebersihan", "Kotor, benda asing", "KB", False),
        ("Porsi & gizi", "Porsi kecil, menu kurang", "PG", False),
        ("Distribusi", "Telat atau kurang", "DS", False),
        ("Anggaran", "Dugaan penyimpangan", "AG", False),
        ("Lainnya", "Masalah lain", "LN", False)
    ]
    py_start = 315
    for idx, (pname, psub, pcode, psel) in enumerate(problems):
        col = idx % 3
        row = idx // 3
        px = 65 + col * 175
        py = py_start + row * 92
        create_node("rectangle", f"ProbBox {idx}", px, py, 165, 80, parent=f, props={"fill": C_BG_SUBTLE if psel else "#FFFFFF", "stroke": C_DARK if psel else C_BORDER, "strokeWeight": 1.5 if psel else 1, "cornerRadius": 12})
        create_node("ellipse", f"ProbIco {idx}", px + 12, py + 12, 26, 26, parent=f, props={"fill": C_DARK if psel else C_BG_MUTED})
        create_node("text", f"ProbIcoT {idx}", px + 17, py + 18, parent=f, text=pcode, props={"fontSize": 9, "fill": "#FFFFFF" if psel else C_DARK})
        create_node("text", f"ProbTit {idx}", px + 12, py + 44, parent=f, text=pname, props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"ProbSub {idx}", px + 12, py + 60, parent=f, text=psub, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        if psel:
            create_node("text", f"ProbCheck {idx}", px + 142, py + 12, parent=f, text="✓", props={"fontSize": 11, "fill": C_DARK})

    draw_button(f, "Btn S2 Back", 40, 660, 40, 40, "←", variant="outline", corner=20)
    draw_button(f, "Btn S2 Lanjut", 90, 660, 120, 40, "Lanjut →", variant="primary", corner=20)

    draw_sidebar_timeline_clean(f, y_start=135)

    # 7. 28. Lapor Step 3 - Cerita
    # TINGGI FRAME: 690px
    f = start_frame(1, 2, "28. Lapor Step 3 - Cerita", frame_height=690)
    draw_navbar_public(f, active="Lapor", logged_in=True)
    create_node("text", "Lapor Tit 3", 40, 90, parent=f, text="Lapor Masalah", props={"fontSize": 26, "fill": C_DARK})
    draw_button(f, "Btn Pan Top 3", 825, 90, 95, 30, "Panduan", variant="outline", corner=15)

    create_node("rectangle", "Sch Sel Box 3", 40, 135, 580, 36, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 18})
    create_node("text", "Sch Sel Txt 3", 60, 146, parent=f, text="Sekolah: SD Negeri Tembalang 01 · Tembalang", props={"fontSize": 11, "fill": C_DARK})
    draw_button(f, "Btn Ganti Sch 3", 555, 141, 55, 24, "Ganti", variant="outline", corner=12)

    draw_stepper_clean(f, 2, st_y=190)

    # Form Card
    create_node("rectangle", "Step3 Card", 40, 260, 580, 340, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("text", "S3 Head", 65, 282, parent=f, text="Ceritakan masalahnya", props={"fontSize": 16, "fill": C_DARK})
    create_node("text", "S3 Sub", 65, 305, parent=f, text="Jelaskan fakta temuan menu makanan secara jujur dan jelas.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("rectangle", "S3 Area Box", 65, 335, 530, 130, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
    create_node("text", "S3 Area Txt", 80, 350, width=500, parent=f, text="Sayur sop berbau asam saat tiba di kelas 4A. Setelah dicicipi terasa masam tidak wajar sehingga pembagian langsung dihentikan oleh guru kelas.", props={"fontSize": 12, "fill": C_DARK})
    create_node("text", "S3 Porsi Lbl", 65, 485, parent=f, text="Berapa perkiraan porsi / siswa terdampak?", props={"fontSize": 11, "fill": C_DARK})
    create_node("rectangle", "S3 Porsi Box", 65, 506, 530, 40, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
    create_node("text", "S3 Porsi Val", 80, 518, parent=f, text="35 siswa", props={"fontSize": 12, "fill": C_DARK})

    draw_button(f, "Btn S3 Back", 40, 620, 40, 40, "←", variant="outline", corner=20)
    draw_button(f, "Btn S3 Lanjut", 90, 620, 120, 40, "Lanjut →", variant="primary", corner=20)

    draw_sidebar_timeline_clean(f, y_start=135)

    # 8. 29. Lapor Step 4 - Bukti Foto
    # TINGGI FRAME: 740px
    f = start_frame(1, 3, "29. Lapor Step 4 - Bukti", frame_height=740)
    draw_navbar_public(f, active="Lapor", logged_in=True)
    create_node("text", "Lapor Tit 4", 40, 90, parent=f, text="Lapor Masalah", props={"fontSize": 26, "fill": C_DARK})
    draw_button(f, "Btn Pan Top 4", 825, 90, 95, 30, "Panduan", variant="outline", corner=15)

    create_node("rectangle", "Sch Sel Box 4", 40, 135, 580, 36, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 18})
    create_node("text", "Sch Sel Txt 4", 60, 146, parent=f, text="Sekolah: SD Negeri Tembalang 01 · Tembalang", props={"fontSize": 11, "fill": C_DARK})
    draw_button(f, "Btn Ganti Sch 4", 555, 141, 55, 24, "Ganti", variant="outline", corner=12)

    draw_stepper_clean(f, 3, st_y=190)

    # Form Card: Bukti Foto
    create_node("rectangle", "Step4 Card", 40, 260, 580, 390, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("text", "S4 Head", 65, 282, parent=f, text="Bukti Foto", props={"fontSize": 16, "fill": C_DARK})
    draw_pill(f, "S4 Wajib Pill", 495, 280, 100, 22, "Wajib min. 1 foto", is_active=False)

    draw_pill(f, "S4P1", 65, 315, 120, 24, "Hindari wajah anak", is_active=False)
    draw_pill(f, "S4P2", 195, 315, 150, 24, "Lokasi disembunyikan", is_active=False)
    draw_pill(f, "S4P3", 355, 315, 120, 24, "Dikompres otomatis", is_active=False)

    draw_button(f, "Btn S4 Kamera", 65, 352, 255, 44, "Ambil Foto (Kamera)", variant="outline", corner=10)
    draw_button(f, "Btn S4 Galeri", 335, 352, 255, 44, "Pilih dari Galeri", variant="outline", corner=10)

    create_node("text", "S4 Help", 65, 410, parent=f, text="Maks. 3 berkas · format JPG/PNG/MP4 maks. 10 MB", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    # Uploaded image placeholder with clean 'X'
    draw_image_box(f, "S4 Thumb", 65, 435, 180, 150, corner=10)
    create_node("rectangle", "Trash Box", 215, 445, 22, 22, parent=f, props={"fill": C_DARK, "cornerRadius": 4})
    create_node("text", "Trash Ico", 221, 449, parent=f, text="X", props={"fontSize": 10, "fill": "#FFFFFF"})
    create_node("rectangle", "S4 Thumb Meta", 65, 560, 180, 25, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "S4 Size", 75, 567, parent=f, text="2.3 MB → 0 KB  ·  Ada lokasi", props={"fontSize": 9, "fill": C_DARK})

    draw_button(f, "Btn S4 Back", 40, 670, 40, 40, "←", variant="outline", corner=20)
    draw_button(f, "Btn S4 Lanjut", 90, 670, 120, 40, "Lanjut →", variant="primary", corner=20)

    draw_sidebar_timeline_clean(f, y_start=135)

    # 9. 30. Lapor Step 5 - Identitas
    # TINGGI FRAME: 690px
    f = start_frame(1, 4, "30. Lapor Step 5 - Identitas", frame_height=690)
    draw_navbar_public(f, active="Lapor", logged_in=True)
    create_node("text", "Lapor Tit 5", 40, 90, parent=f, text="Lapor Masalah", props={"fontSize": 26, "fill": C_DARK})
    draw_button(f, "Btn Pan Top 5", 825, 90, 95, 30, "Panduan", variant="outline", corner=15)

    create_node("rectangle", "Sch Sel Box 5", 40, 135, 580, 36, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 18})
    create_node("text", "Sch Sel Txt 5", 60, 146, parent=f, text="Sekolah: SD Negeri Tembalang 01 · Tembalang", props={"fontSize": 11, "fill": C_DARK})

    draw_stepper_clean(f, 4, st_y=190)

    # Form Card: Identitas
    create_node("rectangle", "Step5 Card", 40, 260, 580, 340, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("text", "S5 Head", 65, 282, parent=f, text="Identitas Pelapor", props={"fontSize": 16, "fill": C_DARK})
    create_node("text", "S5 Sub", 65, 305, parent=f, text="Pilih bagaimana identitas Anda ditampilkan dalam pengawasan.", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    modes = [
        ("Rahasia (Direkomendasikan)", "Nama hanya dibuka kepada Verifikator Independen untuk verifikasi keaslian.", True),
        ("Anonim Penuh", "Nama disamarkan total dari semua pihak termasuk verifikator.", False),
        ("Publik Terbuka", "Nama ditampilkan di feed transparansi masyarakat.", False)
    ]
    my = 335
    for idx, (mtit, mdesc, msel) in enumerate(modes):
        create_node("rectangle", f"ModeCard {idx}", 65, my, 530, 60, parent=f, props={"fill": C_BG_SUBTLE if msel else "#FFFFFF", "stroke": C_DARK if msel else C_BORDER, "strokeWeight": 1.5 if msel else 1, "cornerRadius": 10})
        create_node("ellipse", f"MCir {idx}", 85, my + 22, 16, 16, parent=f, props={"fill": C_DARK if msel else "#FFFFFF", "stroke": C_DARK, "strokeWeight": 1})
        if msel:
            create_node("ellipse", f"MDot {idx}", 89, my + 26, 8, 8, parent=f, props={"fill": "#FFFFFF"})
        create_node("text", f"MTit {idx}", 115, my + 13, parent=f, text=mtit, props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"MSub {idx}", 115, my + 32, width=460, parent=f, text=mdesc, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        my += 68

    draw_button(f, "Btn S5 Back", 40, 620, 40, 40, "←", variant="outline", corner=20)
    draw_button(f, "Btn S5 Submit", 90, 620, 140, 40, "Kirim Laporan →", variant="primary", corner=20)

    draw_sidebar_timeline_clean(f, y_start=135)

    # 10. 31. Alur Lapor: Langkah 6 - Sukses
    # TINGGI FRAME: 560px
    f = start_frame(1, 5, "31. Lapor Step 6 - Sukses", frame_height=560)
    draw_navbar_public(f, active="Lapor", logged_in=True)

    create_node("ellipse", "Succ Cir", 460, 105, 44, 44, parent=f, props={"fill": C_DARK})
    create_node("text", "Succ Check", 474, 116, parent=f, text="✓", props={"fontSize": 18, "fill": "#FFFFFF"})
    create_node("text", "Succ Tit", 442, 162, parent=f, text="Terkirim", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "Succ Sub", 412, 195, parent=f, text="Tidak layak · SD Tembalang 10", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    # Dashed Ticket Card
    create_node("rectangle", "Ticket Box", 310, 230, 340, 130, parent=f, props={"fill": "#FFFFFF", "stroke": C_DARK, "strokeWeight": 1.5, "cornerRadius": 14})
    create_node("text", "Ticket Lbl", 445, 248, parent=f, text="KODE TIKET", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "Ticket Code", 380, 272, parent=f, text="MBG-AG2MWK", props={"fontSize": 24, "fill": C_DARK})
    draw_button(f, "Btn Salin", 440, 315, 80, 28, "Salin", variant="outline", corner=14)

    # Horizontal Stages Card
    create_node("rectangle", "Timeline Horiz Card", 310, 380, 340, 85, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    t_stages = [("Diterima", "24 jam", True), ("Verifikasi", "", True), ("Diteruskan", "24 jam", True), ("Ditangani", "5 hari", True), ("Selesai", "", False)]
    tx = 330
    for idx, (tname, tsla, tdone) in enumerate(t_stages):
        create_node("ellipse", f"THCir {idx}", tx + 6, 395, 22, 22, parent=f, props={"fill": C_DARK if tdone else C_BG_MUTED})
        create_node("text", f"THIco {idx}", tx + 13, 400, parent=f, text="✓" if tdone else "", props={"fontSize": 9, "fill": "#FFFFFF"})
        create_node("text", f"THName {idx}", tx, 422, parent=f, text=tname, props={"fontSize": 9, "fill": C_DARK if tdone else C_TEXT_MUTED})
        if tsla:
            create_node("text", f"THSla {idx}", tx - 4, 435, parent=f, text=tsla, props={"fontSize": 8, "fill": C_TEXT_MUTED})
        tx += 62

    draw_button(f, "Btn Pantau Real", 320, 485, 150, 40, "Pantau status", variant="primary", corner=20)
    draw_button(f, "Btn Laporan Saya", 490, 485, 150, 40, "Laporan saya", variant="outline", corner=20)

    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'save_file', 'arguments': {'path': docs_figcraft}}})
    print(" -> Section 2 (Alur Lapor) selesai.")

    # =========================================================================
    # ROW 2: SISTEM PENDUKUNG KEPUTUSAN (DSS) & PRIORITAS SAW (/insight)
    # =========================================================================
    add_section_header(2, "SECTION 03: SISTEM PENDUKUNG KEPUTUSAN (DSS) & PRIORITAS SAW (/insight)", "Perankingan inspeksi dapur metode SAW multi-kriteria dan radar peringatan dini lonjakan KLB.")

    # 11. 17. Prioritas Inspeksi SAW
    # TINGGI FRAME: 860px
    f = start_frame(2, 0, "17. Prioritas Inspeksi SAW", frame_height=860)
    draw_navbar_public(f, active="Insight", logged_in=False)

    draw_pill(f, "SwPeta 17", 120, 85, 60, 28, "Peta", is_active=False)
    draw_pill(f, "SwPrio 17", 188, 85, 75, 28, "Prioritas", is_active=True)
    draw_pill(f, "SwWarn 17", 270, 85, 85, 28, "Peringatan", is_active=False)
    draw_pill(f, "SwComp 17", 362, 85, 75, 28, "Banding", is_active=False)
    draw_button(f, "Btn Unduh PDF", 790, 85, 130, 30, "Unduh PDF Resmi", variant="outline", corner=15)

    create_node("text", "Prio Tit", 40, 130, parent=f, text="Prioritas inspeksi", props={"fontSize": 24, "fill": C_DARK})
    draw_pill(f, "Badge Terverif 17", 815, 130, 105, 22, "✓ Terverifikasi", is_active=False)
    create_node("text", "Dihitung Txt", 770, 160, parent=f, text="Dihitung 3 Nov 2026, 23.07", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    create_node("text", "Leg 1", 40, 160, parent=f, text="■ Laporan", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "Leg 2", 110, 160, parent=f, text="■ Keracunan", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "Leg 3", 195, 160, parent=f, text="■ SLHS", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "Leg 4", 255, 160, parent=f, text="■ Keterlambatan", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "Leg 5", 355, 160, parent=f, text="■ Kepuasan", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    draw_pill(f, "Filt All", 40, 190, 75, 26, "Semua 25", is_active=True)
    draw_pill(f, "Filt Hi", 125, 190, 70, 26, "• Tinggi 3", is_active=False)
    draw_pill(f, "Filt Med", 205, 190, 75, 26, "• Sedang 5", is_active=False)
    draw_pill(f, "Filt Low", 290, 190, 80, 26, "• Rendah 17", is_active=False)

    create_node("rectangle", "Search Box 17", 750, 188, 170, 28, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    draw_icon_search(f, "PrioSIco", 762, 196)
    create_node("text", "S Place 17", 780, 196, parent=f, text="Cari", props={"fontSize": 11, "fill": C_TEXT_LIGHT})

    prio_kitchens = [
        ("1", "SPPG Semarang Utara 02", "Semarang Utara", ["3 keracunan", "Tanpa SLHS", "29 laporan", "95% terlambat", "Kepuasan rendah"], "→", "• 98 · Tinggi"),
        ("2", "SPPG Genuk 01", "Genuk", ["1 keracunan", "Tanpa SLHS", "24 laporan", "93% terlambat", "Kepuasan rendah"], "↑ 6", "• 90 · Tinggi"),
        ("3", "SPPG Pedurungan 02", "Pedurungan", ["1 keracunan", "Tanpa SLHS", "100% terlambat", "Kepuasan rendah"], "→", "• 77 · Tinggi"),
        ("4", "SPPG Tembalang 03", "Tembalang", ["Tanpa SLHS", "19 laporan", "83% terlambat"], "↓ 2", "• 62 · Sedang"),
        ("5", "SPPG Semarang Tengah 01", "Semarang Tengah", ["1 keracunan", "17 laporan", "60% terlambat"], "↑ 3", "• 55 · Sedang"),
        ("6", "SPPG Tembalang 01", "Tembalang", ["1 keracunan", "11 laporan"], "↑ 15", "• 52 · Sedang"),
        ("7", "SPPG Semarang Timur 01", "Semarang Timur", ["1 keracunan", "67% terlambat"], "↑ 27", "• 45 · Sedang"),
        ("8", "SPPG Semarang Barat 01", "Semarang Barat", ["1 keracunan", "60% terlambat"], "↑ 6", "• 42 · Sedang"),
    ]
    p_y = 230
    for rank, kname, kloc, ktags, ktrend, kscore in prio_kitchens:
        create_node("rectangle", f"PrioRow {rank}", 40, p_y, 880, 64, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
        create_node("text", f"PRank {rank}", 55, p_y + 20, parent=f, text=rank, props={"fontSize": 15, "fill": C_DARK})
        create_node("text", f"PKName {rank}", 95, p_y + 11, parent=f, text=kname, props={"fontSize": 13, "fill": C_DARK})
        create_node("text", f"PKLoc {rank}", 95, p_y + 29, parent=f, text=kloc, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        # Multi-segment progress bar
        create_node("rectangle", f"PBarBg {rank}", 300, p_y + 13, 380, 7, parent=f, props={"fill": "#E5E7EB", "cornerRadius": 4})
        create_node("rectangle", f"PBarSeg {rank}", 300, p_y + 13, 260, 7, parent=f, props={"fill": C_DARK, "cornerRadius": 4})
        tx = 300
        for tag in ktags:
            t_w = len(tag) * 6.0 + 12
            draw_pill(f, f"PTag {rank}_{tx}", tx, p_y + 32, t_w, 18, tag, is_active=False)
            tx += t_w + 6
        create_node("text", f"PTrend {rank}", 720, p_y + 22, parent=f, text=ktrend, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        draw_pill(f, f"PScore {rank}", 760, p_y + 18, 110, 24, kscore, is_active=False)
        create_node("text", f"PChev {rank}", 895, p_y + 24, parent=f, text="›", props={"fontSize": 13, "fill": C_TEXT_LIGHT})
        p_y += 72
    draw_footer_real(f, 810)

    # 12. 18. Peringatan Dini KLB
    # TINGGI FRAME: 680px
    f = start_frame(2, 1, "18. Deteksi Peringatan KLB", frame_height=680)
    draw_navbar_public(f, active="Insight", logged_in=False)

    draw_pill(f, "SwPeta 18", 120, 85, 60, 28, "Peta", is_active=False)
    draw_pill(f, "SwPrio 18", 188, 85, 75, 28, "Prioritas", is_active=False)
    draw_pill(f, "SwWarn 18", 270, 85, 85, 28, "Peringatan", is_active=True)
    draw_pill(f, "SwComp 18", 362, 85, 75, 28, "Banding", is_active=False)
    draw_button(f, "Btn Unduh PDF 18", 790, 85, 130, 30, "Unduh PDF Resmi", variant="outline", corner=15)

    create_node("text", "Warn Tit", 40, 130, parent=f, text="Peringatan dini", props={"fontSize": 26, "fill": C_DARK})
    draw_pill(f, "Badge Terverif 18", 750, 130, 95, 22, "✓ Terverifikasi", is_active=False)
    draw_pill(f, "Badge Live", 855, 130, 65, 22, "Langsung", is_active=False)

    draw_pill(f, "WP1", 40, 175, 95, 24, "24 jam terakhir", is_active=False)
    draw_pill(f, "WP2", 145, 175, 155, 24, "> 3x rata-rata harian 30 hari", is_active=False)
    draw_pill(f, "WP3", 310, 175, 115, 24, "Minimal 3 laporan", is_active=False)
    draw_pill(f, "WP4", 435, 175, 155, 24, "Hanya laporan terverifikasi", is_active=False)

    # 3 Metric KPI Cards
    create_node("rectangle", "WMC1 Box", 40, 215, 275, 80, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "WMC1 Lbl", 60, 230, parent=f, text="Status Aktif", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "WMC1 Val", 60, 252, parent=f, text="0", props={"fontSize": 26, "fill": C_DARK})

    create_node("rectangle", "WMC2 Box", 345, 215, 275, 80, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "WMC2 Lbl", 365, 230, parent=f, text="Sinyal Ditinjau", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "WMC2 Val", 365, 252, parent=f, text="0", props={"fontSize": 26, "fill": C_DARK})

    create_node("rectangle", "WMC3 Box", 645, 215, 275, 80, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "WMC3 Lbl", 665, 230, parent=f, text="Riwayat 90 hari", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "WMC3 Val", 665, 252, parent=f, text="2", props={"fontSize": 26, "fill": C_DARK})

    # How it works callout
    create_node("rectangle", "How Box", 40, 310, 880, 56, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
    create_node("text", "How Txt", 55, 324, width=850, parent=f, text="Bagaimana sistem bekerja: Sinyal lonjakan terdeteksi otomatis saat laporan warga terverifikasi melonjak >3x rata-rata harian dalam 24 jam. Tim verifikator bersama Dinas Kesehatan segera melakukan uji lapangan sebelum menetapkan status darurat.", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    # Safe status banner
    create_node("rectangle", "Safe Banner", 40, 380, 880, 46, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
    create_node("ellipse", "Safe Cir", 58, 392, 22, 22, parent=f, props={"fill": C_BG_MUTED})
    create_node("text", "Safe Ico", 65, 396, parent=f, text="✓", props={"fontSize": 11, "fill": C_DARK})
    create_node("text", "Safe Txt", 90, 395, parent=f, text="Tidak ada lonjakan aktif di wilayah Kota Semarang", props={"fontSize": 12, "fill": C_DARK})

    create_node("text", "Riw Tit", 40, 445, parent=f, text="Riwayat Lonjakan", props={"fontSize": 13, "fill": C_DARK})
    riw_cards = [
        ("SPPG Semarang Utara 02", "Semarang Utara · Selesai · 31 Okt 2026, 02.18", "4x lipat", "1 aduan/hari → 4 aduan dalam 24 jam"),
        ("SPPG Banyumanik 01", "Banyumanik · Selesai · 26 Sep 2026, 17.11", "20x lipat", "0.5 aduan/hari → 10 aduan dalam 24 jam")
    ]
    rx_pos = [40, 495]
    for idx, (kname, ksub, kmul, kdesc) in enumerate(riw_cards):
        cx = rx_pos[idx]
        create_node("rectangle", f"RiwCard {idx}", cx, 470, 425, 110, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
        create_node("text", f"RiwN {idx}", cx + 16, 485, parent=f, text=kname, props={"fontSize": 13, "fill": C_DARK})
        create_node("text", f"RiwS {idx}", cx + 16, 503, parent=f, text=ksub, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        draw_pill(f, f"RiwP {idx}", cx + 16, 528, 80, 20, kmul, is_active=False)
        create_node("text", f"RiwD {idx}", cx + 105, 532, parent=f, text=kdesc, props={"fontSize": 10, "fill": C_DARK})

    draw_footer_real(f, 600)

    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'save_file', 'arguments': {'path': docs_figcraft}}})
    print(" -> Section 3 (Insight SAW) selesai.")

    # =========================================================================
    # ROW 3: DASBOR VERIFIKATOR & MEJA PENGELOLA DAPUR SPPG
    # =========================================================================
    add_section_header(3, "SECTION 04: DASBOR VERIFIKATOR & MEJA PENGELOLA DAPUR SPPG", "Validasi aduan warga, ruang kerja evaluasi kecerdasan buatan, dan dasbor mitigasi dapur.")

    # 13. 34. Dasbor Utama Verifikator
    # TINGGI FRAME: 890px
    f = start_frame(3, 0, "34. Dasbor Verifikator", frame_height=890)
    draw_navbar_panel(f, "Dasbor Panel", role="Verifikator", user_code="MS", user_name="Mbak")

    create_node("text", "Verif Tit", 40, 85, parent=f, text="Dasbor Verifikasi", props={"fontSize": 26, "fill": C_DARK})

    # 4 KPI Cards
    kpis = [("Antrean menunggu", "21", False), ("Lewat batas", "21", True), ("Siap diteruskan", "3", False), ("Kasus berjalan", "26", False)]
    kx = 40
    for idx, (klbl, kval, khighlight) in enumerate(kpis):
        create_node("rectangle", f"VKpi {idx}", kx, 125, 205, 75, parent=f, props={"fill": "#FFFFFF", "stroke": C_DARK if khighlight else C_BORDER, "strokeWeight": 1.5 if khighlight else 1, "cornerRadius": 14})
        create_node("text", f"VKLbl {idx}", kx + 14, 137, parent=f, text=klbl, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        create_node("text", f"VKVal {idx}", kx + 14, 155, parent=f, text=kval, props={"fontSize": 24, "fill": C_DARK})
        create_node("text", f"VKArr {idx}", kx + 175, 165, parent=f, text="→", props={"fontSize": 11, "fill": C_TEXT_LIGHT})
        kx += 225

    create_node("text", "Antrean Sec Tit", 40, 225, parent=f, text="Antrean Masuk", props={"fontSize": 14, "fill": C_DARK})
    create_node("text", "Antrean Sec Link", 845, 225, parent=f, text="Semua (21) →", props={"fontSize": 11, "fill": C_DARK})

    antrean_rows = [
        ("SD Semarang Tengah 1", "Darurat", "MBG-3ACS6H · Keracunan · Semarang Tengah · 100 siswa terdampak", "", "Batas 31 Okt 2026, 15.31", "34"),
        ("SD Tembalang 10", "Darurat", "MBG-7RZQPN · Keracunan · Tembalang · 7 siswa", "+2 serupa", "Batas 31 Okt 2026, 07.00", "66"),
        ("SD Tembalang 10", "Darurat", "MBG-RM987N · Keracunan · Tembalang · 7 siswa", "+2 serupa", "Batas 31 Okt 2026, 06.30", "47"),
        ("SD Tembalang 10", "Darurat", "MBG-3MBXW9 · Keracunan · Tembalang · 5 siswa", "+2 serupa", "Batas 31 Okt 2026, 07.24", "48"),
        ("SMP Pedurungan 2", "Tinggi", "MBG-VAC8TW · Tidak layak · Pedurungan · 30 siswa", "", "Batas 31 Okt 2026, 11.08", "53"),
        ("SMP Semarang Utara 1", "Tinggi", "MBG-TY6SLL · Tidak layak · Semarang Utara · 23 siswa", "", "Batas 30 Okt 2026, 13.53", "42"),
        ("SD Pedurungan 6", "Tinggi", "MBG-3W69XT · Tidak layak · Pedurungan · 12 siswa", "", "Batas 31 Okt 2026, 18.53", "17"),
        ("SMA Pedurungan 2", "Tinggi", "MBG-2JRE4S · Porsi & gizi · Pedurungan · 51 siswa", "", "Batas 30 Okt 2026, 17.53", "67")
    ]
    ay = 250
    for idx, (asch, aurg, asub, asimilar, atime, apct) in enumerate(antrean_rows):
        create_node("rectangle", f"ARowBox {idx}", 40, ay, 880, 62, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
        create_node("ellipse", f"AIcoCir {idx}", 55, ay + 14, 34, 34, parent=f, props={"fill": C_BG_MUTED})
        create_node("text", f"AIcoTxt {idx}", 65, ay + 23, parent=f, text="K" if aurg == "Darurat" else "T", props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"ASchTxt {idx}", 105, ay + 13, parent=f, text=asch, props={"fontSize": 13, "fill": C_DARK})
        draw_pill(f, f"AUrgPill {idx}", 115 + len(asch) * 7.5, ay + 11, 55, 18, aurg, is_active=True if aurg == "Darurat" else False)
        create_node("text", f"ASubTxt {idx}", 105, ay + 35, parent=f, text=asub, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        if asimilar:
            draw_pill(f, f"ASimPill {idx}", 450, ay + 33, 70, 16, asimilar, is_active=False)
        create_node("text", f"ATimeTxt {idx}", 670, ay + 24, parent=f, text=atime, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        create_node("ellipse", f"APctCir {idx}", 815, ay + 16, 28, 28, parent=f, props={"fill": C_BG_MUTED, "stroke": C_BORDER, "strokeWeight": 1})
        create_node("text", f"APctTxt {idx}", 822, ay + 24, parent=f, text=apct, props={"fontSize": 9, "fill": C_DARK})
        create_node("text", f"AChev {idx}", 855, ay + 24, parent=f, text="›", props={"fontSize": 12, "fill": C_TEXT_LIGHT})
        ay += 70
    draw_footer_real(f, 825)

    # 14. 36. Ruang Kerja Inspeksi & Radar AI MLP
    # TINGGI FRAME: 760px
    f = start_frame(3, 1, "36. Inspeksi Detail Laporan", frame_height=760)
    draw_navbar_panel(f, "Antrean Verifikasi", role="Verifikator", user_code="MS", user_name="Mbak")

    create_node("text", "Back Antrean", 40, 80, parent=f, text="← Antrean", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("ellipse", "Ins Ico Cir", 40, 100, 32, 32, parent=f, props={"fill": C_BG_MUTED})
    create_node("text", "Ins Ico Txt", 49, 108, parent=f, text="KR", props={"fontSize": 11, "fill": C_DARK})
    create_node("text", "Ins Head Tit", 82, 97, parent=f, text="Keracunan", props={"fontSize": 18, "fill": C_DARK})
    create_node("text", "Ins Head Sub", 82, 118, parent=f, text="MBG-3ACS6H", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    draw_pill(f, "Darurat Pill 36", 710, 100, 60, 22, "Darurat", is_active=True)
    create_node("text", "Ins Batas Txt", 780, 105, parent=f, text="Batas 31 Okt 2026, 15.31", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    # Left Column (w: 520)
    create_node("rectangle", "Ins Detail Card", 40, 145, 520, 240, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "ISch 36", 60, 160, parent=f, text="SD Semarang Tengah 1 (SD · 424 siswa · Semarang Tengah)", props={"fontSize": 11, "fill": C_DARK})
    create_node("text", "ISppg 36", 60, 182, parent=f, text="SPPG Semarang Tengah 01", props={"fontSize": 11, "fill": C_DARK})
    draw_pill(f, "ISppgPill 36", 230, 179, 85, 18, "• 55 · Sedang", is_active=False)
    create_node("text", "ITime 36", 60, 206, parent=f, text="31 Okt 2026, 09.26  ·  100 terdampak", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    create_node("rectangle", "INarasi Real", 60, 230, 480, 38, parent=f, props={"fill": C_BG_SUBTLE, "cornerRadius": 6})
    create_node("text", "INarasi Txt 36", 75, 242, parent=f, text="Sayur sop berbau menyengat dan santan pecah saat disajikan di kelas.", props={"fontSize": 11, "fill": C_DARK})

    # Inner AI Card
    create_node("rectangle", "IAi Box Real", 60, 280, 480, 90, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
    create_node("text", "IAi Tit Real", 75, 290, parent=f, text="Evaluasi ML Multimodal (Feedforward MLP)", props={"fontSize": 10, "fill": C_DARK})
    draw_pill(f, "IAi Badge", 320, 286, 210, 18, "Keaslian: 0% · Indikasi Fiktif / Tidak Sesuai", is_active=False)
    ai_4m = [("Leksikon MBG", "0%"), ("Gejala Anomali", "0%"), ("Kesesuaian Waktu Foto", "50%"), ("Radius GPS Foto", "50%")]
    ax = 75
    for m_lbl, m_val in ai_4m:
        create_node("rectangle", f"AIMBox {m_lbl}", ax, 312, 105, 32, parent=f, props={"fill": C_BG_SUBTLE, "cornerRadius": 4})
        create_node("text", f"AIML {m_lbl}", ax + 8, 316, parent=f, text=m_lbl, props={"fontSize": 8, "fill": C_TEXT_MUTED})
        create_node("text", f"AIMV {m_lbl}", ax + 8, 328, parent=f, text=m_val, props={"fontSize": 10, "fill": C_DARK})
        ax += 114
    create_node("text", "IAi Saran", 75, 352, parent=f, text="Saran Klasifikasi: Keracunan · Urgensi: darurat", props={"fontSize": 9, "fill": C_DARK})

    # Photo Proof Card
    create_node("rectangle", "Proof Card 36", 40, 400, 520, 175, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "Proof Tit 36", 60, 415, parent=f, text="Bukti Foto", props={"fontSize": 12, "fill": C_DARK})
    draw_image_box(f, "Proof Img 36", 60, 435, 150, 105, corner=6)
    create_node("rectangle", "Proof Meta Box", 60, 545, 150, 18, parent=f, props={"fill": C_BG_SUBTLE, "cornerRadius": 4})
    create_node("text", "Proof Meta Txt", 70, 549, parent=f, text="Waktu sesuai · GPS cocok", props={"fontSize": 8, "fill": C_TEXT_MUTED})

    # Kredibilitas & Pelapor
    create_node("rectangle", "Kred Card 36", 40, 590, 250, 105, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "Kred Tit 36", 60, 605, parent=f, text="Kredibilitas", props={"fontSize": 11, "fill": C_DARK})
    create_node("ellipse", "Kred Cir 36", 60, 625, 40, 40, parent=f, props={"fill": C_BG_MUTED, "stroke": C_BORDER, "strokeWeight": 1})
    create_node("text", "Kred Val 36", 72, 638, parent=f, text="34", props={"fontSize": 15, "fill": C_DARK})
    create_node("text", "Kred Met 1", 115, 625, parent=f, text="Bukti: 25/30", props={"fontSize": 9, "fill": C_TEXT_MUTED})
    create_node("text", "Kred Met 2", 115, 640, parent=f, text="Metadata: 0/25", props={"fontSize": 9, "fill": C_TEXT_MUTED})
    create_node("text", "Kred Met 3", 115, 655, parent=f, text="Status pelapor: 6/25", props={"fontSize": 9, "fill": C_TEXT_MUTED})

    create_node("rectangle", "Pelapor Card 36", 310, 590, 250, 105, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "Pelapor Tit 36", 330, 605, parent=f, text="Pelapor · Anonim", props={"fontSize": 11, "fill": C_DARK})
    create_node("text", "Pelapor Sub 36", 330, 625, width=210, parent=f, text="Identitas disembunyikan (anonim).\nIdentitas tidak pernah dibagikan ke instansi atau publik.", props={"fontSize": 9, "fill": C_TEXT_MUTED})

    # Right Column: Examination & Decision
    create_node("rectangle", "Exam Card 36", 580, 145, 340, 360, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "Exam Tit 36", 605, 168, parent=f, text="Pemeriksaan Petugas", props={"fontSize": 13, "fill": C_DARK})
    checks = ["[ ] Bukti relevan dengan laporan", "[ ] Waktu dan lokasi masuk akal", "[ ] Bukan spam atau tuduhan pribadi", "[ ] Kategori sudah sesuai"]
    cy = 195
    for chk in checks:
        create_node("text", f"Chk_{cy}", 605, cy, parent=f, text=chk, props={"fontSize": 11, "fill": C_DARK})
        cy += 26
    create_node("text", "Masuk Kasus Tit", 605, 310, parent=f, text="Masuk ke kasus", props={"fontSize": 11, "fill": C_DARK})
    create_node("rectangle", "Kasus Sel Box", 605, 330, 290, 30, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_DARK, "strokeWeight": 1, "cornerRadius": 6})
    create_node("text", "Kasus Sel Txt", 620, 338, parent=f, text="◉ Kasus baru", props={"fontSize": 11, "fill": C_DARK})
    create_node("rectangle", "Kasus Inp Box", 605, 368, 290, 34, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 6})
    create_node("text", "Kasus Inp Txt", 618, 378, parent=f, text="Keracunan di SD Semarang Tengah 1", props={"fontSize": 11, "fill": C_DARK})
    create_node("rectangle", "Kasus Textarea", 605, 410, 290, 42, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 6})
    create_node("text", "Kasus Area Txt", 618, 422, parent=f, text="Catatan untuk timeline (opsional)", props={"fontSize": 10, "fill": C_TEXT_LIGHT})

    draw_button(f, "Btn Tolak 36", 605, 465, 135, 36, "Tolak Laporan", variant="outline", corner=18)
    draw_button(f, "Btn Verif 36", 755, 465, 140, 36, "Verifikasi Laporan", variant="primary", corner=18)

    draw_footer_real(f, 715)

    # 15. 38. Dasbor Dapur SPPG
    # TINGGI FRAME: 740px
    f = start_frame(3, 2, "38. Dasbor Dapur SPPG", frame_height=740)
    draw_navbar_panel(f, "Dasbor Dapur", role="SPPG", user_code="PS", user_name="Pengelola")

    create_node("text", "SPPG Tit Real", 40, 85, parent=f, text="Pengelola SPPG Tembalang 03", props={"fontSize": 26, "fill": C_DARK})
    draw_button(f, "Btn Profil Sppg", 790, 85, 130, 32, "Profil & SLHS →", variant="outline", corner=16)

    # 3 KPI Cards
    sppg_kpis = [("Perlu ditanggapi", "1", False), ("Lewat batas (SLA)", "1", True), ("Sedang ditangani", "2", False)]
    sx = 40
    for idx, (slbl, sval, shighlight) in enumerate(sppg_kpis):
        create_node("rectangle", f"SKpi {idx}", sx, 130, 275, 75, parent=f, props={"fill": "#FFFFFF", "stroke": C_DARK if shighlight else C_BORDER, "strokeWeight": 1.5 if shighlight else 1, "cornerRadius": 14})
        create_node("text", f"SKLbl {idx}", sx + 16, 142, parent=f, text=slbl, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        create_node("text", f"SKVal {idx}", sx + 16, 160, parent=f, text=sval, props={"fontSize": 24, "fill": C_DARK})
        create_node("text", f"SKArr {idx}", sx + 245, 170, parent=f, text="→", props={"fontSize": 11, "fill": C_TEXT_LIGHT})
        sx += 300

    create_node("text", "Kasus Aktif Tit", 40, 225, parent=f, text="Kasus Aktif", props={"fontSize": 14, "fill": C_DARK})
    create_node("text", "Semua Kasus Link", 845, 225, parent=f, text="Semua kasus", props={"fontSize": 11, "fill": C_DARK})

    sppg_cases = [
        ("Kebersihan dapur/penyajian di SMA Tembalang 3", "KS-UGULBVG · SPPG Tembalang 03 · Pengelola SPPG Tembalang 03 · 2", "Tidak ditanggapi", "Diteruskan", "Batas 25 Okt 2026, 17.30", "KB"),
        ("Dugaan masalah pengadaan di TK Tembalang 2", "KS-PRYPFV7 · SPPG Tembalang 03 · Ombudsman RI Jawa Tengah · 1", "Tidak ditanggapi", "Diteruskan", "Batas 3 Nov 2026, 19.16", "AG"),
        ("Makanan tidak layak di SD Tembalang 10", "KS-NF6YNKK · SPPG Tembalang 03 · Pengelola SPPG Tembalang 03 · 2", "Melewati batas waktu", "Ditindaklanjuti", "Batas 2 Nov 2026, 14.30", "TL"),
        ("Makanan tidak layak di SD Tembalang 12", "KS-94BUHRM · SPPG Tembalang 03 · Pengelola SPPG Tembalang 03 · 2", "Melewati batas waktu", "Ditindaklanjuti", "Batas 3 Nov 2026, 02.01", "TL"),
        ("Dugaan masalah pengadaan di SD Tembalang 11", "KS-9BPCXU6 · SPPG Tembalang 03 · Ombudsman RI Jawa Tengah · 1", "Melewati batas waktu", "Ditindaklanjuti", "Batas 3 Nov 2026, 03.27", "AG"),
        ("Kebersihan dapur/penyajian di TK Tembalang 2", "KS-UFJNCHZ · SPPG Tembalang 03 · Dinas Kesehatan Semarang · 2", "Melewati batas waktu", "Ditindaklanjuti", "Batas 3 Nov 2026, 21.42", "KB")
    ]
    sy = 250
    for idx, (ctit, csub, cb1, cb2, ctime, ccode) in enumerate(sppg_cases):
        create_node("rectangle", f"SCaseBox {idx}", 40, sy, 880, 62, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
        create_node("ellipse", f"SCIcoCir {idx}", 55, sy + 14, 34, 34, parent=f, props={"fill": C_BG_MUTED})
        create_node("text", f"SCIcoTxt {idx}", 65, sy + 23, parent=f, text=ccode, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"SCTitTxt {idx}", 105, sy + 12, parent=f, text=ctit, props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"SCSubTxt {idx}", 105, sy + 32, parent=f, text=csub, props={"fontSize": 10, "fill": C_TEXT_MUTED})

        b1_w = 130 if "Melewati" in cb1 else 105
        b1_x = 460 if "Melewati" in cb1 else 485
        draw_pill(f, f"SCB1 {idx}", b1_x, sy + 20, b1_w, 20, cb1, is_active=False)
        draw_pill(f, f"SCB2 {idx}", 600, sy + 20, 95, 20, cb2, is_active=False)
        create_node("text", f"SCTimeTxt {idx}", 710, sy + 24, parent=f, text=ctime, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        create_node("text", f"SCChev {idx}", 865, sy + 24, parent=f, text="›", props={"fontSize": 12, "fill": C_TEXT_LIGHT})
        sy += 70
    draw_footer_real(f, 680)

    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'save_file', 'arguments': {'path': docs_figcraft}}})
    print(" -> Section 4 (Verifikator & SPPG) selesai.")

    # =========================================================================
    # ROW 4: DINAS KESEHATAN, KORWIL BGN & SUPERADMIN (41, 43, 45, 46, 47)
    # =========================================================================
    add_section_header(4, "SECTION 05: DINAS KESEHATAN, KORWIL BGN & SUPERADMIN", "Pengawasan higienitas Dinkes, akuntabilitas audit Korwil, dasbor admin, dan konfigurasi SLA.")

    # 16. 41. Dasbor Pengawasan Dinkes
    # TINGGI FRAME: 890px
    f = start_frame(4, 0, "41. Dasbor Dinkes", frame_height=890)
    draw_navbar_panel(f, "Dasbor Medis", role="Dinkes", user_code="PH", user_name="Pak")

    create_node("text", "Dinkes Tit", 40, 85, parent=f, text="Dinas Kesehatan Kota Semarang", props={"fontSize": 26, "fill": C_DARK})

    dinkes_kpis = [("Perlu ditanggapi", "10", False), ("Lewat batas (SLA)", "10", True), ("Peringatan aktif", "0", False), ("SPPG risiko tinggi", "3", False)]
    dx = 40
    for idx, (dlbl, dval, dhighlight) in enumerate(dinkes_kpis):
        create_node("rectangle", f"DKpi {idx}", dx, 125, 205, 75, parent=f, props={"fill": "#FFFFFF", "stroke": C_DARK if dhighlight else C_BORDER, "strokeWeight": 1.5 if dhighlight else 1, "cornerRadius": 14})
        create_node("text", f"DKLbl {idx}", dx + 16, 137, parent=f, text=dlbl, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        create_node("text", f"DKVal {idx}", dx + 16, 155, parent=f, text=dval, props={"fontSize": 24, "fill": C_DARK})
        create_node("text", f"DKArr {idx}", dx + 175, 165, parent=f, text="→", props={"fontSize": 11, "fill": C_TEXT_LIGHT})
        dx += 225

    create_node("text", "Dinkes Sec Tit", 40, 225, parent=f, text="Kasus Kesehatan & Higiene", props={"fontSize": 14, "fill": C_DARK})
    create_node("text", "Dinkes Sec Link", 845, 225, parent=f, text="Semua kasus", props={"fontSize": 11, "fill": C_DARK})

    dinkes_cases = [
        ("Makanan tidak layak di SD Semarang Utara 6", "KS-FL32TBV · SPPG Semarang Utara 02 · Dinas Kesehatan · 1", "Tidak ditanggapi", "Diteruskan", "Batas 1 Nov 2026, 01.57", "TL"),
        ("Makanan tidak layak di TK Semarang Utara 2", "KS-3MHGNLM · SPPG Semarang Utara 02 · Dinas Kesehatan · 1", "Tidak ditanggapi", "Diteruskan", "Batas 31 Okt 2026, 19.00", "TL"),
        ("Kebersihan dapur/penyajian di SMA Tugu 1", "KS-5MTTBJG · SPPG Tugu 01 · Dinas Kesehatan · 1", "Tidak ditanggapi", "Diteruskan", "Batas 1 Nov 2026, 17.07", "KB"),
        ("Makanan tidak layak di SD Semarang Utara 6", "KS-H3VH37K · SPPG Semarang Utara 02 · Dinas Kesehatan · 1", "Tidak ditanggapi", "Diteruskan", "Batas 31 Okt 2026, 13.00", "TL"),
        ("Dugaan keracunan di SD Semarang Utara 5", "KS-K9AQXW3 · SPPG Semarang Utara 02 · Dinas Kesehatan · 1", "Tidak ditanggapi", "Diteruskan", "Batas 30 Okt 2026, 16.00", "KR"),
        ("Kebersihan dapur/penyajian di SD Semarang Barat 4", "KS-JWRYTDY · SPPG Semarang Barat 02 · Dinas Kesehatan · 1", "Tidak ditanggapi", "Diteruskan", "Batas 1 Nov 2026, 08.57", "KB"),
        ("Dugaan keracunan di SMA Semarang Selatan 2", "KS-TB4B9XN · SPPG Semarang Selatan 01 · Dinas Kesehatan · 1", "Melewati batas waktu", "Ditindaklanjuti", "Batas 2 Nov 2026, 05.37", "KR"),
        ("Kebersihan dapur/penyajian di SD Banyumanik 2", "KS-VXMMX4W · SPPG Banyumanik 01 · Dinas Kesehatan · 1", "Tidak ditanggapi", "Diteruskan", "Batas 31 Okt 2026, 23.07", "KB")
    ]
    dy = 250
    for idx, (dtit, dsub, db1, db2, dtime, dcode) in enumerate(dinkes_cases):
        create_node("rectangle", f"DCaseBox {idx}", 40, dy, 880, 62, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
        create_node("ellipse", f"DCIcoCir {idx}", 55, dy + 14, 34, 34, parent=f, props={"fill": C_BG_MUTED})
        create_node("text", f"DCIcoTxt {idx}", 65, dy + 23, parent=f, text=dcode, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"DCTitTxt {idx}", 105, dy + 12, parent=f, text=dtit, props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"DCSubTxt {idx}", 105, dy + 32, parent=f, text=dsub, props={"fontSize": 10, "fill": C_TEXT_MUTED})

        b1_w = 130 if "Melewati" in db1 else 105
        b1_x = 460 if "Melewati" in db1 else 485
        draw_pill(f, f"DCB1 {idx}", b1_x, dy + 20, b1_w, 20, db1, is_active=False)
        draw_pill(f, f"DCB2 {idx}", 600, dy + 20, 95, 20, db2, is_active=False)
        create_node("text", f"DCTimeTxt {idx}", 710, dy + 24, parent=f, text=dtime, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        create_node("text", f"DCChev {idx}", 865, dy + 24, parent=f, text="›", props={"fontSize": 12, "fill": C_TEXT_LIGHT})
        dy += 70
    draw_footer_real(f, 825)

    # 17. 43. Papan Akuntabilitas Korwil BGN
    # TINGGI FRAME: 810px
    f = start_frame(4, 1, "43. Akuntabilitas Korwil BGN", frame_height=810)
    draw_navbar_panel(f, "Papan Akuntabilitas", role="Korwil", user_code="KB", user_name="Korwil")

    # Banner Card
    create_node("rectangle", "Korwil Banner Card", 40, 80, 880, 190, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    draw_pill(f, "KwPill1", 60, 95, 160, 20, "Pengawasan Kinerja & SLA", is_active=False)
    create_node("text", "KwTit", 60, 124, parent=f, text="Papan Akuntabilitas SPPG Wilayah", props={"fontSize": 20, "fill": C_DARK})
    draw_pill(f, "KwPill2", 420, 122, 95, 20, "✓ Terverifikasi", is_active=False)
    create_node("text", "KwSub", 60, 148, width=650, parent=f, text="Memantau kedisiplinan dapur dan instansi dalam merespons aduan masyarakat serta memastikan kepatuhan batas waktu (SLA).", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    # 4 Inner KPI Cards
    kw_kpis = [("Total Kasus", "698"), ("Tingkat Penyelesaian", "90,5%"), ("Rata-rata Respons", "46,8 jam"), ("Melewati Batas (SLA)", "56,1%")]
    kx = 60
    for idx, (klbl, kval) in enumerate(kw_kpis):
        create_node("rectangle", f"KwKpiBox {idx}", kx, 180, 195, 70, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
        create_node("text", f"KwKLbl {idx}", kx + 14, 192, parent=f, text=klbl, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        create_node("text", f"KwKVal {idx}", kx + 14, 210, parent=f, text=kval, props={"fontSize": 18, "fill": C_DARK})
        kx += 210

    # Switcher & Sort Pills
    draw_pill(f, "SwKw1", 40, 285, 75, 26, "Per SPPG", is_active=True)
    draw_pill(f, "SwKw2", 120, 285, 100, 26, "Per kecamatan", is_active=False)

    draw_pill(f, "SortKw1", 40, 320, 75, 26, "Kasus ↓", is_active=True)
    draw_pill(f, "SortKw2", 120, 320, 65, 26, "Selesai", is_active=False)
    draw_pill(f, "SortKw3", 190, 320, 75, 26, "Tanggap", is_active=False)
    draw_pill(f, "SortKw4", 270, 320, 85, 26, "Terlambat", is_active=False)
    draw_pill(f, "SortKw5", 360, 320, 75, 26, "Kepuasan", is_active=False)

    # Performance Table
    create_node("rectangle", "KwTbl Box", 40, 355, 880, 395, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("rectangle", "KwTH", 40, 355, 880, 32, parent=f, props={"fill": C_BG_SUBTLE})
    create_node("text", "KwTH 1", 55, 365, parent=f, text="SPPG", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "KwTH 2", 330, 365, parent=f, text="Kasus", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "KwTH 3", 440, 365, parent=f, text="Selesai", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "KwTH 4", 570, 365, parent=f, text="Tanggap", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "KwTH 5", 680, 365, parent=f, text="Terlambat", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "KwTH 6", 790, 365, parent=f, text="Kepuasan", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    tbl_rows_kw = [
        ("SPPG Semarang Utara 02", "Semarang Utara", "68", "77,9%", "3,1 hari", "98,5% [10]", "★ 1,8"),
        ("SPPG Pedurungan 02", "Pedurungan", "58", "86,2%", "3,1 hari", "100% [1]", "★ 1,9"),
        ("SPPG Genuk 01", "Genuk", "53", "88,7%", "3,5 hari", "98,1%", "★ 2,0"),
        ("SPPG Tembalang 03", "Tembalang", "50", "88,0%", "2,0 hari", "80,0% [2]", "★ 3,0"),
        ("SPPG Tugu 01", "Tugu", "31", "96,8%", "34,5 jam", "51,6% [1]", "★ 4,3"),
        ("SPPG Semarang Tengah 01", "Semarang Tengah", "29", "96,6%", "33,6 jam", "44,8%", "★ 3,9"),
        ("SPPG Banyumanik 01", "Banyumanik", "27", "88,9%", "40,9 jam", "44,4% [1]", "★ 4,2")
    ]
    ty = 387
    for r_sppg, r_loc, r_kas, r_sel, r_tang, r_terl, r_kep in tbl_rows_kw:
        create_node("line", f"KTR_L_{ty}", 40, ty, 880, 0, parent=f, props={"stroke": C_BORDER, "strokeWeight": 1})
        create_node("text", f"KTD1_{ty}", 55, ty + 10, parent=f, text=r_sppg, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"KTD1s_{ty}", 55, ty + 24, parent=f, text=r_loc, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        create_node("text", f"KTD2_{ty}", 330, ty + 15, parent=f, text=r_kas, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"KTD3_{ty}", 440, ty + 15, parent=f, text=r_sel, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"KTD4_{ty}", 570, ty + 15, parent=f, text=r_tang, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"KTD5_{ty}", 680, ty + 15, parent=f, text=r_terl, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"KTD6_{ty}", 790, ty + 15, parent=f, text=r_kep, props={"fontSize": 11, "fill": C_DARK})
        ty += 46
    draw_footer_real(f, 765)

    # 18. 45. Dasbor Utama Administrator Sistem
    # TINGGI FRAME: 280px (Persis screenshot 45 - sangat ringkas dan rapi!)
    f = start_frame(4, 2, "45. Dasbor Admin", frame_height=280)
    draw_navbar_panel(f, "Dasbor Admin", role="Admin", user_code="AP", user_name="Admin")

    create_node("text", "Admin Tit Real", 40, 85, parent=f, text="Administrasi Sistem", props={"fontSize": 26, "fill": C_DARK})

    admin_kpis = [("Pengguna", "271", False), ("Aturan SLA", "35", False), ("Kasus aktif", "63", False), ("Lewat batas", "24", True)]
    ax = 40
    for idx, (albl, aval, ahighlight) in enumerate(admin_kpis):
        create_node("rectangle", f"AKpi {idx}", ax, 125, 205, 75, parent=f, props={"fill": "#FFFFFF", "stroke": C_DARK if ahighlight else C_BORDER, "strokeWeight": 1.5 if ahighlight else 1, "cornerRadius": 14})
        create_node("text", f"AKLbl {idx}", ax + 16, 137, parent=f, text=albl, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        create_node("text", f"AKVal {idx}", ax + 16, 155, parent=f, text=aval, props={"fontSize": 24, "fill": C_DARK})
        create_node("text", f"AKArr {idx}", ax + 175, 165, parent=f, text="→", props={"fontSize": 11, "fill": C_TEXT_LIGHT})
        ax += 225
    # Tidak perlu footer untuk admin overview ringkas

    # 19. 46. Manajemen Pengguna RBAC
    # TINGGI FRAME: 840px
    f = start_frame(4, 3, "46. Manajemen Pengguna RBAC", frame_height=840)
    draw_navbar_panel(f, "Kelola Pengguna", role="Admin", user_code="AP", user_name="Admin")

    create_node("text", "User Tit Real", 40, 85, parent=f, text="Pengguna", props={"fontSize": 26, "fill": C_DARK})

    # Search input
    create_node("rectangle", "User S Box", 40, 125, 320, 38, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 19})
    draw_icon_search(f, "UserSIco", 52, 137)
    create_node("text", "User S Place", 72, 137, parent=f, text="Cari nama atau email pengguna...", props={"fontSize": 11, "fill": C_TEXT_LIGHT})
    create_node("ellipse", "User S Btn", 325, 130, 28, 28, parent=f, props={"fill": C_BG_MUTED})
    create_node("text", "User S Arr", 335, 137, parent=f, text="→", props={"fontSize": 11, "fill": C_DARK})

    users_data = [
        ("Mbak Sari", "sari@pmbgm.test · 0 laporan", "Verifikator", "", True),
        ("Pengelola SPPG Tembalang 03", "sppg@pmbgm.test · 0 laporan", "Instansi", "SPPG Tembalang 03", True),
        ("Korwil BGN Kota Semarang", "korwil@pmbgm.test · 0 laporan", "Instansi", "Korwil BGN", True),
        ("Pak Hendra", "hendra@pmbgm.test · 0 laporan", "Instansi", "Dinas Kesehatan", True),
        ("Admin PMBGM", "admin@pmbgm.test · 0 laporan", "Admin", "", True),
        ("Rina Santoso", "pelapor241@pmbgm.test · 0 laporan", "Pelapor", "", True),
        ("Yuni Wijaya", "pelapor240@pmbgm.test · 2 laporan", "Pelapor", "", True),
        ("Bambang Handayani", "pelapor237@pmbgm.test · 6 laporan", "Pelapor", "", True),
        ("Sri Wijaya", "pelapor245@pmbgm.test · 4 laporan", "Pelapor", "", True),
        ("Siti Santoso", "pelapor244@pmbgm.test · 5 laporan", "Pelapor", "", True),
    ]
    uy = 175
    for idx, (uname, umeta, urole, uinst, uverif) in enumerate(users_data):
        create_node("rectangle", f"UBox {idx}", 40, uy, 880, 52, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
        create_node("text", f"UTit {idx}", 55, uy + 11, parent=f, text=uname, props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"UMeta {idx}", 55, uy + 28, parent=f, text=umeta, props={"fontSize": 9, "fill": C_TEXT_MUTED})

        create_node("rectangle", f"URoleBox {idx}", 440, uy + 11, 100, 30, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 6})
        create_node("text", f"URoleTxt {idx}", 452, uy + 19, parent=f, text=f"{urole} v", props={"fontSize": 10, "fill": C_DARK})
        if uinst:
            create_node("rectangle", f"UInstBox {idx}", 550, uy + 11, 130, 30, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 6})
            create_node("text", f"UInstTxt {idx}", 558, uy + 19, parent=f, text=f"{uinst} v", props={"fontSize": 9, "fill": C_DARK})

        create_node("rectangle", f"UChkBox {idx}", 695, uy + 18, 16, 16, parent=f, props={"fill": C_DARK if uverif else "#FFFFFF", "stroke": C_DARK, "strokeWeight": 1, "cornerRadius": 4})
        if uverif:
            create_node("text", f"UChkIco {idx}", 699, uy + 20, parent=f, text="✓", props={"fontSize": 9, "fill": "#FFFFFF"})
        create_node("text", f"UVerTxt {idx}", 718, uy + 19, parent=f, text="Terverifikasi", props={"fontSize": 10, "fill": C_DARK})

        draw_button(f, f"BtnSave {idx}", 815, uy + 11, 85, 30, "Simpan", variant="outline", corner=6)
        uy += 58
    draw_footer_real(f, 765)

    # 20. 47. Aturan Batas Waktu SLA Superadmin
    # TINGGI FRAME: 580px
    f = start_frame(4, 4, "47. Aturan Batas Waktu SLA", frame_height=580)
    draw_navbar_panel(f, "Aturan SLA", role="Admin", user_code="AP", user_name="Admin")

    create_node("text", "Sla Tit Real", 40, 85, parent=f, text="Batas waktu", props={"fontSize": 26, "fill": C_DARK})
    create_node("text", "Sla Sub Real", 40, 118, parent=f, text="Dalam jam. Berlaku untuk tahap yang dimulai setelah diubah; lewat batas otomatis ditandai dan dinaikkan prioritasnya.", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    create_node("rectangle", "SlaTbl Box Real", 40, 145, 880, 380, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("rectangle", "SlaTH Real", 40, 145, 880, 32, parent=f, props={"fill": C_BG_SUBTLE})
    create_node("text", "SlaTH 1", 55, 155, parent=f, text="Kategori", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "SlaTH 2", 340, 155, parent=f, text="Verifikasi", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "SlaTH 3", 460, 155, parent=f, text="Diteruskan", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "SlaTH 4", 580, 155, parent=f, text="Ditanggapi", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "SlaTH 5", 700, 155, parent=f, text="Selesai", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "SlaTH 6", 820, 155, parent=f, text="Buka ulang", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    sla_rows = [
        ("Keracunan", "KR", "6", "2", "6", "72", "24"),
        ("Tidak layak", "TL", "24", "12", "24", "120", "48"),
        ("Kebersihan", "KB", "48", "24", "48", "168", "72"),
        ("Porsi & gizi", "PG", "48", "24", "72", "168", "72"),
        ("Distribusi", "DS", "24", "12", "24", "72", "48"),
        ("Anggaran", "AG", "72", "48", "168", "720", "168"),
        ("Lainnya", "LN", "72", "48", "120", "336", "120")
    ]
    sly = 177
    for c_name, c_code, v1, v2, v3, v4, v5 in sla_rows:
        create_node("line", f"SLTR_L_{sly}", 40, sly, 880, 0, parent=f, props={"stroke": C_BORDER, "strokeWeight": 1})
        create_node("text", f"SLName_{sly}", 55, sly + 14, parent=f, text=f"• {c_name}", props={"fontSize": 11, "fill": C_DARK})
        vals = [v1, v2, v3, v4, v5]
        vx_offsets = [330, 450, 570, 690, 810]
        for v_idx, val in enumerate(vals):
            vx = vx_offsets[v_idx]
            create_node("rectangle", f"SLBox_{sly}_{v_idx}", vx, sly + 7, 50, 28, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 6})
            create_node("text", f"SLVal_{sly}_{v_idx}", vx + 12, sly + 15, parent=f, text=val, props={"fontSize": 11, "fill": C_DARK})
            create_node("text", f"SLUnit_{sly}_{v_idx}", vx + 34, sly + 15, parent=f, text="j", props={"fontSize": 9, "fill": C_TEXT_MUTED})
        sly += 44
    draw_footer_real(f, 535)

    # Save Project
    print("\n[4/5] Menyimpan berkas proyek master .figcraft...")
    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'save_file', 'arguments': {'path': output_figcraft}}})
    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'save_file', 'arguments': {'path': docs_figcraft}}})
    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'run_command', 'arguments': {'command': 'view.zoomFit'}}})
    time.sleep(0.5)

    p.kill()
    print("FigCraft headless session selesai.")

    # Export overview & individual artboards
    print("\n[5/5] Merender Overview kanvas dan mengekspor PNG individu...")
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
    print("BERHASIL: Wireframe Monokrom Textbook Tanpa Emote Telah Selesai!")
    print("Dokumen: d:/UNNES/LOMBA/MIA 2026/Web/PMBGM_Wireframes.figcraft")
    print("=" * 75)

if __name__ == "__main__":
    main()
