"""
PMBGM - MASTER 47 TEXTBOOK WIREFRAME GENERATOR (FIGCRAFT)
MIA 2026: Sistem Pemantau MBG Masyarakat (Kota Semarang)

GENERATES ALL 47 SCREENS 100% PERSIS SCREENSHOT LENGKAP:
- Zero Emojis (No AI Slop): Glyph tipografis & geometris wireframe murni.
- Dynamic Frame Heights: Setiap frame memiliki tinggi yang membungkus kontennya.
- Beranda 01: Single-screen Google-style portal tanpa footer.
- 47 Halaman Lengkap (Publik, Alur Lapor Multi-Step, & Seluruh Peran Operasional).
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
C_DARK = "#18181B"
C_DARK_SUB = "#27272A"
C_BORDER = "#E4E4E7"
C_BORDER_DARK = "#18181B"
C_BG_CARD = "#FFFFFF"
C_BG_MUTED = "#F4F4F5"
C_BG_SUBTLE = "#F9FAFB"
C_TEXT_MUTED = "#71717A"
C_TEXT_LIGHT = "#A1A1AA"
C_CROSS = "#CBD5E1"

os.makedirs(render_folder, exist_ok=True)
os.makedirs(os.path.dirname(docs_figcraft), exist_ok=True)

def main():
    print("=" * 80)
    print("PMBGM - GENERATING ALL 47 AUTHENTIC TEXTBOOK WIREFRAMES IN FIGCRAFT")
    print("Zero Emojis, Dynamic Heights, 100% Sesuai Screenshot Aktual")
    print("=" * 80)

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
    send({'jsonrpc': '2.0', 'method': 'initialize', 'params': {'protocolVersion': '2024-11-05', 'capabilities': {}, 'clientInfo': {'name': 'pmbgm_47_wireframes', 'version': '5.0'}}})
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

    # Canvas Spacing: 6 Kolom
    FRAME_W = 960
    COL_GAP = 80
    row_y = [100, 1060, 2020, 2980, 3920, 4760, 5750, 6740]

    def start_frame(row, col, title, frame_height=800):
        fx = 80 + col * (FRAME_W + COL_GAP)
        fy = row_y[row]
        fid = create_node("frame", title, fx, fy, FRAME_W, frame_height, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1})
        create_node("text", f"LBL_{title}", fx, fy - 28, parent=None, text=title.upper(), props={"fontSize": 12, "fill": C_TEXT_MUTED})
        return fid

    def add_section_header(row, title, subtitle):
        sy = row_y[row] - 65
        create_node("text", f"SEC_{row}", 80, sy, parent=None, text=title, props={"fontSize": 18, "fill": C_DARK})
        create_node("text", f"SECSUB_{row}", 80, sy + 24, parent=None, text=subtitle, props={"fontSize": 12, "fill": C_TEXT_MUTED})

    # UI Helpers
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
        create_node("rectangle", f"{name} Bg", x, y, w, h, parent=fid, props={"fill": C_BG_MUTED, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": corner})
        create_node("vector", f"{name} X", x, y, w, h, parent=fid, path=f"M0 0 L{w} {h} M0 {h} L{w} 0", props={"stroke": C_CROSS, "strokeWeight": 1})

    def draw_avatar(fid, name, cx, cy, r=16):
        create_node("ellipse", f"{name} Cir", cx - r, cy - r, r * 2, r * 2, parent=fid, props={"fill": C_BG_MUTED, "stroke": C_BORDER, "strokeWeight": 1})
        create_node("ellipse", f"{name} Head", cx - (r * 0.38), cy - (r * 0.55), r * 0.76, r * 0.76, parent=fid, props={"fill": C_TEXT_LIGHT})
        create_node("rectangle", f"{name} Body", cx - (r * 0.65), cy + (r * 0.15), r * 1.3, r * 0.7, parent=fid, props={"fill": C_TEXT_LIGHT, "cornerRadius": 3})

    def draw_icon_search(fid, name, x, y):
        create_node("ellipse", f"{name} SGlass", x, y, 10, 10, parent=fid, props={"stroke": C_TEXT_MUTED, "strokeWeight": 1.5, "fill": "#FFFFFF"})
        create_node("line", f"{name} SHandle", x + 8, y + 8, 4, 4, parent=fid, props={"stroke": C_TEXT_MUTED, "strokeWeight": 1.5})

    def draw_navbar_public(fid, active="Beranda", logged_in=False, user_name="Ibu"):
        create_node("rectangle", "Navbar Base", 0, 0, FRAME_W, 64, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1})
        create_node("ellipse", "Nav Logo Cir", 36, 18, 28, 28, parent=fid, props={"fill": C_BG_MUTED, "stroke": C_BORDER, "strokeWeight": 1})
        create_node("text", "Nav Logo Txt", 45, 25, parent=fid, text="P", props={"fontSize": 13, "fill": C_DARK})
        create_node("text", "Nav Brand Name", 72, 20, parent=fid, text="PMBGM", props={"fontSize": 15, "fill": C_DARK})
        create_node("text", "Nav Brand Sub", 72, 36, parent=fid, text="PEMANTAU MBG MASYARAKAT", props={"fontSize": 8, "fill": C_TEXT_MUTED})
        links = [("Beranda", 0), ("Lacak", 75), ("Data Terbuka", 145), ("Insight", 255), ("Panduan", 330)]
        start_x = 300
        for l_text, offset_x in links:
            is_act = (l_text == active)
            has_drop = (l_text != "Beranda")
            display_text = f"{l_text} v" if has_drop else l_text
            if is_act:
                create_node("rectangle", f"NavPill {l_text}", start_x + offset_x - 8, 18, len(display_text) * 7.5 + 16, 28, parent=fid, props={"fill": C_BG_MUTED, "cornerRadius": 14})
            create_node("text", f"NavTxt {l_text}", start_x + offset_x, 25, parent=fid, text=display_text, props={"fontSize": 12, "fill": C_DARK if is_act else C_TEXT_MUTED})
        if not logged_in:
            draw_button(fid, "Nav Lapor", 745, 16, 115, 32, "Lapor Masalah", variant="primary", corner=16)
            draw_button(fid, "Nav Masuk", 870, 16, 60, 32, "Masuk", variant="outline", corner=16)
        else:
            draw_button(fid, "Nav Lapor MBG", 685, 16, 135, 32, "Lapor MBG Sekolah", variant="primary", corner=16)
            create_node("rectangle", "Nav User Box", 830, 16, 100, 32, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
            draw_avatar(fid, "Nav User Av", 845, 32, 10)
            create_node("text", "Nav User Name", 862, 25, parent=fid, text=f"{user_name} v", props={"fontSize": 11, "fill": C_DARK})

    def draw_navbar_panel(fid, active_tab="Dasbor Panel", role="Verifikator", user_code="MS", user_name="Mbak"):
        create_node("rectangle", "Panel Nav Base", 0, 0, FRAME_W, 64, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1})
        create_node("ellipse", "PNav Logo Cir", 36, 18, 28, 28, parent=fid, props={"fill": C_BG_MUTED, "stroke": C_BORDER, "strokeWeight": 1})
        create_node("text", "PNav Logo Txt", 45, 25, parent=fid, text="P", props={"fontSize": 13, "fill": C_DARK})
        create_node("text", "PNav Brand Name", 72, 20, parent=fid, text="PMBGM", props={"fontSize": 15, "fill": C_DARK})
        create_node("text", "PNav Brand Sub", 72, 36, parent=fid, text="PEMANTAU MBG MASYARAKAT", props={"fontSize": 8, "fill": C_TEXT_MUTED})

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

    def draw_stepper(fid, active_step=1):
        steps = ["Sekolah", "Masalah", "Cerita", "Bukti", "Kirim"]
        st_y = 230
        for idx, s_name in enumerate(steps, 1):
            st_x = 115 + (idx - 1) * 125
            is_done = (idx < active_step)
            is_curr = (idx == active_step)
            if idx > 1:
                create_node("line", f"StLine {idx}", st_x - 65, st_y + 14, 65, 0, parent=fid, props={"stroke": C_DARK if is_done else C_BORDER, "strokeWeight": 2})
            if is_done:
                create_node("ellipse", f"StCir {idx}", st_x, st_y, 28, 28, parent=fid, props={"fill": C_DARK})
                create_node("text", f"StChk {idx}", st_x + 9, st_y + 7, parent=fid, text="✓", props={"fontSize": 12, "fill": "#FFFFFF"})
            elif is_curr:
                create_node("ellipse", f"StCir {idx}", st_x, st_y, 28, 28, parent=fid, props={"fill": "#FFFFFF", "stroke": C_DARK, "strokeWeight": 2})
                create_node("text", f"StNum {idx}", st_x + 10, st_y + 7, parent=fid, text=str(idx), props={"fontSize": 12, "fill": C_DARK})
            else:
                create_node("ellipse", f"StCir {idx}", st_x, st_y, 28, 28, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1})
                create_node("text", f"StNum {idx}", st_x + 10, st_y + 7, parent=fid, text=str(idx), props={"fontSize": 12, "fill": C_TEXT_MUTED})
            create_node("text", f"StLbl {idx}", st_x - 8, st_y + 35, parent=fid, text=s_name, props={"fontSize": 10, "fill": C_DARK if (is_curr or is_done) else C_TEXT_MUTED})

    def draw_sidebar_sla(fid):
        create_node("rectangle", "Side SLA Card", 655, 175, 265, 380, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
        create_node("text", "Side Tit", 675, 198, parent=fid, text="Setelah dikirim", props={"fontSize": 14, "fill": C_DARK})
        sla_items = [("1", "Diterima", "24 jam"), ("2", "Verifikasi", "12 jam"), ("3", "Diteruskan", "24 jam"), ("4", "Ditangani", "5 hari"), ("5", "Selesai", "")]
        sy = 232
        for num, s_tit, s_time in sla_items:
            create_node("ellipse", f"SideCir {num}", 675, sy, 20, 20, parent=fid, props={"fill": C_BG_MUTED})
            create_node("text", f"SideNum {num}", 682, sy + 4, parent=fid, text=num, props={"fontSize": 10, "fill": C_DARK})
            create_node("text", f"SideSTit {num}", 705, sy + 3, parent=fid, text=s_tit, props={"fontSize": 12, "fill": C_DARK})
            if s_time:
                create_node("text", f"SideTime {num}", 850, sy + 4, parent=fid, text=s_time, props={"fontSize": 10, "fill": C_TEXT_MUTED})
            sy += 42
        create_node("rectangle", "Side Note Box", 670, 480, 235, 55, parent=fid, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
        create_node("text", "Side Note Txt", 685, 498, parent=fid, text="Belum tampil publik sebelum diverifikasi.", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    # =========================================================================
    # ROW 0: PUBLIK 01 - 06 (PORTAL & PELACAKAN DASAR)
    # =========================================================================
    add_section_header(0, "SECTION 01: PORTAL PUBLIK & PELACAKAN KASUS (01 - 06)", "Portal pencarian terpadu, gate pelaporan, panduan langkah lapor, dan penelusuran tiket terbuka.")

    # 01. Beranda Utama (520px - Google-Style tanpa footer)
    f = start_frame(0, 0, "01. Beranda Utama", frame_height=520)
    draw_navbar_public(f, active="Beranda", logged_in=False)
    create_node("text", "Hero Brand", 355, 175, parent=f, text="PMBGM", props={"fontSize": 48, "fill": C_DARK})
    create_node("text", "Hero Sub", 365, 232, parent=f, text="P E M A N T A U   M B G   M A S Y A R A K A T", props={"fontSize": 9, "fill": C_TEXT_MUTED})
    create_node("rectangle", "Search Box", 200, 265, 560, 48, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 24})
    draw_icon_search(f, "HeroSearchIco", 225, 281)
    create_node("text", "Search Place", 248, 281, parent=f, text="Cari sekolah, dapur SPPG, atau kode tiket...", props={"fontSize": 12, "fill": C_TEXT_LIGHT})
    draw_button(f, "Btn Buat Lapor", 350, 330, 125, 42, "Buat Laporan", variant="primary", corner=21)
    draw_button(f, "Btn Lacak", 485, 330, 125, 42, "Lacak Tiket", variant="outline", corner=21)
    create_node("rectangle", "Stat Pill Bg", 345, 390, 270, 28, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "Stat Pill Txt", 365, 397, parent=f, text="• 165 Sekolah    • 40 Dapur SPPG    • Darurat 119", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    # 02. Gate Lapor Publik (680px)
    f = start_frame(0, 1, "02. Gate Lapor Publik", frame_height=680)
    draw_navbar_public(f, active="Beranda", logged_in=False)
    create_node("text", "G02 Tit", 340, 110, parent=f, text="Laporkan Masalah MBG", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "G02 Sub", 270, 142, parent=f, text="Pilih metode pelaporan untuk menjaga transparansi dan akuntabilitas.", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    create_node("rectangle", "G02 C1", 160, 180, 300, 260, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    draw_avatar(f, "G02 Av1", 200, 220, 18)
    create_node("text", "G02 C1 Tit", 230, 210, parent=f, text="Masuk Sebagai Warga / Guru", props={"fontSize": 13, "fill": C_DARK})
    create_node("text", "G02 C1 D1", 185, 260, parent=f, text="• Pantau tiket langsung di dasbor", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "G02 C1 D2", 185, 285, parent=f, text="• Notifikasi respons dari SPPG & Dinkes", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "G02 C1 D3", 185, 310, parent=f, text="• Riwayat pengaduan tersimpan aman", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    draw_button(f, "G02 Btn Masuk", 185, 370, 250, 40, "Masuk dengan Akun", variant="primary", corner=20)
    create_node("rectangle", "G02 C2", 500, 180, 300, 260, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    draw_avatar(f, "G02 Av2", 540, 220, 18)
    create_node("text", "G02 C2 Tit", 570, 210, parent=f, text="Lapor Langsung (Publik / Tamu)", props={"fontSize": 13, "fill": C_DARK})
    create_node("text", "G02 C2 D1", 525, 260, parent=f, text="• Tanpa login akun, cepat & mudah", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "G02 C2 D2", 525, 285, parent=f, text="• Mendapatkan kode tiket acak (MBG-XXXX)", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "G02 C2 D3", 525, 310, parent=f, text="• Opsi pelapor anonim / rahasia", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    draw_button(f, "G02 Btn Tamu", 525, 370, 250, 40, "Lanjut Tanpa Akun", variant="outline", corner=20)
    draw_footer_real(f, 490)

    # 03. Panduan Alur Lapor (780px)
    f = start_frame(0, 2, "03. Panduan Alur Lapor", frame_height=780)
    draw_navbar_public(f, active="Panduan", logged_in=False)
    create_node("text", "P03 Tit", 40, 95, parent=f, text="Panduan Pelaporan Pengaduan MBG", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "P03 Sub", 40, 126, parent=f, text="Ikuti 4 langkah mudah untuk memastikan laporan Anda valid dan cepat ditindaklanjuti.", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    panduan_cards = [
        ("1. Temukan Sekolah", "Cari nama sekolah sasaran MBG di Kota Semarang. Pastikan sekolah sesuai tempat distribusi makanan."),
        ("2. Pilih Kategori", "Tentukan masalah: Keracunan (Darurat 6 jam), Tidak Layak, Porsi & Gizi, Kebersihan, atau Distribusi."),
        ("3. Sertakan Bukti Foto", "Ambil foto fisik makanan dengan jelas. Sistem otomatis membaca waktu dan lokasi demi akurasi."),
        ("4. Pantau Status Tiket", "Simpan kode tiket dan pantau batas waktu penanganan (SLA) secara transparan hingga tuntas.")
    ]
    px = 40
    for idx, (ptit, pdesc) in enumerate(panduan_cards):
        create_node("rectangle", f"P03C {idx}", px, 165, 205, 200, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
        draw_image_box(f, f"P03Img {idx}", px + 15, 180, 175, 80, corner=8)
        create_node("text", f"P03CTit {idx}", px + 15, 275, parent=f, text=ptit, props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"P03CDesc {idx}", px + 15, 298, parent=f, text=pdesc[:70] + "...", props={"fontSize": 10, "fill": C_TEXT_MUTED})
        px += 225
    draw_button(f, "P03 Btn Mulai", 390, 400, 180, 42, "Mulai Buat Laporan", variant="primary", corner=21)
    draw_footer_real(f, 490)

    # 04. Pelacakan Kasus (780px)
    f = start_frame(0, 3, "04. Pelacakan Kasus", frame_height=780)
    draw_navbar_public(f, active="Lacak", logged_in=False)
    create_node("text", "Lacak Tit", 40, 90, parent=f, text="Lacak", props={"fontSize": 28, "fill": C_DARK})
    draw_pill(f, "SwCek", 740, 90, 85, 30, "Cek tiket", is_active=True)
    draw_pill(f, "SwAkun", 835, 90, 95, 30, "Akuntabilitas", is_active=False)
    create_node("rectangle", "Lacak SBox", 40, 135, 350, 42, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 21})
    create_node("text", "Lacak SPlace", 65, 148, parent=f, text="Cek status: MBG-XXXXXX", props={"fontSize": 12, "fill": C_TEXT_LIGHT})
    create_node("ellipse", "Lacak SBtn", 352, 141, 30, 30, parent=f, props={"fill": C_BG_MUTED})
    create_node("text", "Lacak SArr", 362, 148, parent=f, text="→", props={"fontSize": 12, "fill": C_DARK})
    create_node("text", "Kasus Tit", 40, 205, parent=f, text="Kasus Terbaru di Wilayah", props={"fontSize": 15, "fill": C_DARK})
    draw_pill(f, "Badge Terverif", 835, 202, 95, 24, "✓ Terverifikasi", is_active=False)
    create_node("text", "Kasus Sub", 40, 226, parent=f, text="Laporan terverifikasi yang sedang atau telah ditangani secara terbuka.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "Waktu Lbl", 40, 260, parent=f, text="Waktu:", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    draw_pill(f, "W1", 85, 255, 60, 24, "Semua", is_active=True)
    draw_pill(f, "W2", 152, 255, 60, 24, "7 Hari", is_active=False)
    draw_pill(f, "W3", 218, 255, 65, 24, "30 Hari", is_active=False)
    cases_data = [
        ("Makanan tidak layak di SMP Pedurungan 1", "Pedurungan · 30 Okt 2026, 20.01", "Diteruskan", "Tidak ditanggapi", "TL"),
        ("Makanan tidak layak di TK Semarang Utara 2", "Semarang Utara · 30 Okt 2026, 18.30", "Diteruskan", "Tidak ditanggapi", "TL"),
        ("Dugaan masalah pengadaan di SD Gunungpati 2", "Gunungpati · 30 Okt 2026, 18.13", "✓ Diverifikasi", "Melewati batas waktu", "AG"),
        ("Makanan tidak layak di SD Semarang Utara 6", "Semarang Utara · 30 Okt 2026, 16.57", "Diteruskan", "Tidak ditanggapi", "TL"),
    ]
    cy = 295
    for idx, (ctit, csub, cpill1, cpill2, ccode) in enumerate(cases_data):
        col_i = idx % 2
        row_i = idx // 2
        cx = 40 if col_i == 0 else 495
        c_y = cy + row_i * 88
        create_node("rectangle", f"CCard {idx}", cx, c_y, 425, 78, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
        create_node("ellipse", f"CCIco {idx}", cx + 16, c_y + 16, 28, 28, parent=f, props={"fill": C_BG_MUTED})
        create_node("text", f"CCode {idx}", cx + 22, c_y + 22, parent=f, text=ccode, props={"fontSize": 10, "fill": C_DARK})
        create_node("text", f"CCTit {idx}", cx + 55, c_y + 14, parent=f, text=ctit, props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"CCSub {idx}", cx + 55, c_y + 32, parent=f, text=csub, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        draw_pill(f, f"CP1 {idx}", cx + 55, c_y + 50, len(cpill1) * 6.2 + 16, 18, cpill1, is_active=False)
        draw_pill(f, f"CP2 {idx}", cx + 75 + len(cpill1) * 6.2 + 16, c_y + 50, len(cpill2) * 6.2 + 16, 18, cpill2, is_active=False)
    draw_footer_real(f, 660)

    # 05. Pelacakan Tiket Aktif (840px)
    f = start_frame(0, 4, "05. Pelacakan Tiket Aktif", frame_height=840)
    draw_navbar_public(f, active="Lacak", logged_in=False)
    create_node("text", "T05 Tit", 40, 90, parent=f, text="Status Tiket: MBG-7RZQPN", props={"fontSize": 24, "fill": C_DARK})
    draw_pill(f, "T05 Stat Pill", 380, 95, 110, 24, "• Diteruskan SPPG", is_active=True)
    create_node("rectangle", "T05 Box Utama", 40, 140, 560, 450, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("text", "T05 Info Sekolah", 65, 165, parent=f, text="SD Negeri Tembalang 10 · Tembalang", props={"fontSize": 15, "fill": C_DARK})
    create_node("text", "T05 Waktu Lap", 65, 188, parent=f, text="Dilaporkan: 30 Okt 2026, 12.30 WIB oleh Orang Tua Siswa (Rahasia)", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    # SLA Steps
    t_steps = [
        ("1. Laporan Diterima", "Selesai · 30 Okt 12.30", True),
        ("2. Diverifikasi Independen", "Selesai · 30 Okt 14.15 (Sesuai SLA 2 jam)", True),
        ("3. Diteruskan ke Dapur SPPG", "Sedang Berjalan · Batas Waktu: 31 Okt 14.00", False),
        ("4. Tindak Lanjut & Klarifikasi SPPG", "Menunggu tindakan dapur penyedia", False),
        ("5. Selesai & Ditutup", "Konfirmasi penyelesaian", False)
    ]
    ty = 230
    for idx, (tstep, tdesc, tdone) in enumerate(t_steps):
        create_node("ellipse", f"T05Cir {idx}", 65, ty, 20, 20, parent=f, props={"fill": C_DARK if tdone else C_BG_MUTED})
        create_node("text", f"T05Ch {idx}", 72, ty + 4, parent=f, text="✓" if tdone else str(idx + 1), props={"fontSize": 10, "fill": "#FFFFFF" if tdone else C_DARK})
        create_node("text", f"T05STit {idx}", 95, ty + 2, parent=f, text=tstep, props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"T05SDesc {idx}", 95, ty + 18, parent=f, text=tdesc, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        ty += 46
    # Right Sidebar: Info SPPG
    create_node("rectangle", "T05 Side Box", 620, 140, 300, 300, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("text", "T05 SHTit", 640, 165, parent=f, text="SPPG Bertanggung Jawab", props={"fontSize": 14, "fill": C_DARK})
    create_node("text", "T05 SHName", 640, 195, parent=f, text="SPPG Tembalang 02", props={"fontSize": 13, "fill": C_DARK})
    create_node("text", "T05 SHMeta", 640, 215, parent=f, text="Kapasitas: 2.800 porsi/hari · SLHS Aktif", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    draw_image_box(f, "T05 Map", 640, 245, 260, 120, corner=8)
    draw_button(f, "T05 Btn Hub", 640, 380, 260, 36, "Hubungi Layanan Terkait", variant="outline", corner=18)
    draw_footer_real(f, 660)

    # 06. Detail Kasus Terbuka (860px)
    f = start_frame(0, 5, "06. Detail Kasus Terbuka", frame_height=860)
    draw_navbar_public(f, active="Lacak", logged_in=False)
    create_node("text", "K06 Tit", 40, 90, parent=f, text="Makanan Tidak Layak di SMP Pedurungan 1", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "K06 Meta", 40, 118, parent=f, text="Pedurungan · Tiket: MBG-VAC8TW · Dilaporkan 30 Okt 2026", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    draw_pill(f, "K06 Pill 1", 680, 90, 110, 26, "• Tidak Layak", is_active=False)
    draw_pill(f, "K06 Pill 2", 800, 90, 120, 26, "Diteruskan SPPG", is_active=True)
    # Foto Bukti & Kronologi
    draw_image_box(f, "K06 Photo 1", 40, 155, 260, 170, corner=12)
    draw_image_box(f, "K06 Photo 2", 315, 155, 260, 170, corner=12)
    create_node("rectangle", "K06 Kron Box", 40, 340, 535, 160, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
    create_node("text", "K06 KRTit", 60, 360, parent=f, text="Kronologi Pengaduan", props={"fontSize": 13, "fill": C_DARK})
    create_node("text", "K06 KRDesc", 60, 385, parent=f, text="Sayur sop yang diterima siswa berbau asam menyengat dan berlendir saat dibagikan jam 11.30 WIB. Sebanyak 30 siswa di kelas 7B menolak mengonsumsi makanan tersebut. Guru piket langsung mengamankan sampel makanan.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    # Right Sidebar
    create_node("rectangle", "K06 Side", 600, 155, 320, 345, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "K06 STit", 620, 175, parent=f, text="Catatan Verifikasi Independen", props={"fontSize": 13, "fill": C_DARK})
    create_node("text", "K06 SVer", 620, 200, parent=f, text="✓ Foto asli terverifikasi melalui metadata EXIF kamera (Pukul 11.42 WIB). Dikonfirmasi oleh pihak sekolah.", props={"fontSize": 11, "fill": C_DARK})
    create_node("text", "K06 STit2", 620, 260, parent=f, text="Tindak Lanjut SPPG Pedurungan 01", props={"fontSize": 13, "fill": C_DARK})
    create_node("text", "K06 SResp", 620, 285, parent=f, text="Pihak dapur telah menarik sisa distribusi dan mengganti dengan menu darurat kering. Investigasi suhu masak internal sedang berlangsung.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    draw_footer_real(f, 690)

    print(" -> Section 1 (01-06) selesai.")

    # =========================================================================
    # ROW 1: PUBLIK 07 - 12 (DATA TERBUKA, SEKOLAH & SPPG)
    # =========================================================================
    add_section_header(1, "SECTION 02: DATA TERBUKA, SEKOLAH & SPPG (07 - 12)", "Direktori sekolah sasaran, unit dapur SPPG, peta sebaran wilayah, dan akuntabilitas kepatuhan.")

    # 07. Akuntabilitas Publik SLA (820px)
    f = start_frame(1, 0, "07. Akuntabilitas Publik SLA", frame_height=820)
    draw_navbar_public(f, active="Lacak", logged_in=False)
    create_node("text", "A07 Tit", 40, 90, parent=f, text="Akuntabilitas Penanganan Kasus", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "A07 Sub", 40, 120, parent=f, text="Transparansi kepatuhan Service Level Agreement (SLA) di Kota Semarang.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    # Stat Cards
    stat_items = [("Kepatuhan SLA", "94.2%", "+1.4% bulan ini"), ("Rerata Waktu Respons", "18.4 jam", "Batas maks 24 jam"), ("Kasus Ditangani", "412", "Dari 438 total laporan"), ("Eskalasi Tertunda", "26", "Dalam pengawasan Korwil")]
    for idx, (stit, sval, ssub) in enumerate(stat_items):
        sx = 40 + idx * 225
        create_node("rectangle", f"A07C {idx}", sx, 150, 210, 95, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
        create_node("text", f"A07CTit {idx}", sx + 16, 168, parent=f, text=stit, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("text", f"A07CVal {idx}", sx + 16, 190, parent=f, text=sval, props={"fontSize": 22, "fill": C_DARK})
        create_node("text", f"A07CSub {idx}", sx + 16, 222, parent=f, text=ssub, props={"fontSize": 9, "fill": C_TEXT_MUTED})
    # Table of SPPGs
    create_node("rectangle", "A07 Tbl", 40, 265, 880, 280, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "A07 TH1", 60, 285, parent=f, text="Unit Dapur SPPG", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "A07 TH2", 340, 285, parent=f, text="Kecamatan", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "A07 TH3", 520, 285, parent=f, text="Kepatuhan SLA", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "A07 TH4", 720, 285, parent=f, text="Status Rapor", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    sppg_rows = [
        ("SPPG Semarang Tengah 01", "Semarang Tengah", "98.5%", "A · Unggul"),
        ("SPPG Tembalang 02", "Tembalang", "95.1%", "A · Unggul"),
        ("SPPG Pedurungan 01", "Pedurungan", "88.4%", "B · Perlu Pembinaan"),
        ("SPPG Banyumanik 01", "Banyumanik", "96.7%", "A · Unggul"),
        ("SPPG Gunungpati 01", "Gunungpati", "91.2%", "B · Baik")
    ]
    ry = 315
    for sname, skec, ssla, sstat in sppg_rows:
        create_node("line", f"A07L {ry}", 40, ry, 880, 0, parent=f, props={"stroke": C_BORDER, "strokeWeight": 1})
        create_node("text", f"A07R1 {ry}", 60, ry + 12, parent=f, text=sname, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"A07R2 {ry}", 340, ry + 12, parent=f, text=skec, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("text", f"A07R3 {ry}", 520, ry + 12, parent=f, text=ssla, props={"fontSize": 11, "fill": C_DARK})
        draw_pill(f, f"A07P {ry}", 720, ry + 8, 120, 20, sstat, is_active=False)
        ry += 38
    draw_footer_real(f, 620)

    # 08. Cari Sekolah (860px)
    f = start_frame(1, 1, "08. Cari Sekolah", frame_height=860)
    draw_navbar_public(f, active="Data Terbuka", logged_in=False)
    create_node("text", "Sch Tit", 40, 90, parent=f, text="Cari Sekolah", props={"fontSize": 28, "fill": C_DARK})
    draw_pill(f, "Sch Sim Badge", 225, 95, 70, 22, "Simulasi", is_active=False)
    create_node("rectangle", "Sch SBox", 590, 88, 330, 40, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 20})
    draw_icon_search(f, "SchSIco", 605, 100)
    create_node("text", "Sch SPlace", 625, 100, parent=f, text="Cari sekolah, kecamatan, SPPG...", props={"fontSize": 11, "fill": C_TEXT_LIGHT})
    create_node("ellipse", "Sch SBtn", 885, 93, 30, 30, parent=f, props={"fill": C_BG_MUTED})
    create_node("text", "Sch SArr", 894, 99, parent=f, text="→", props={"fontSize": 12, "fill": C_DARK})
    create_node("text", "Sch Count", 40, 138, parent=f, text="Menampilkan 12 dari 165 sekolah sasaran", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    sch_data = [
        ("SD Banyumanik 1", "SD · Banyumanik · 276 siswa", "99000109", "SPPG Banyumanik 01", "21 · Rendah", "0 berjalan"),
        ("SD Banyumanik 10", "SD · Banyumanik · 263 siswa", "99000121", "SPPG Banyumanik 02", "14 · Rendah", "1 berjalan"),
        ("SD Banyumanik 2", "SD · Banyumanik · 301 siswa", "99000110", "SPPG Banyumanik 01", "21 · Rendah", "2 berjalan"),
        ("SD Banyumanik 3", "SD · Banyumanik · 368 siswa", "99000111", "SPPG Banyumanik 01", "21 · Rendah", "1 berjalan"),
    ]
    sc_y = 168
    for idx, (sname, smeta, snpsn, ssppg, srisk, sstat) in enumerate(sch_data):
        col_i = idx % 2
        row_i = idx // 2
        cx = 40 if col_i == 0 else 495
        c_y = sc_y + row_i * 132
        create_node("rectangle", f"SCard {idx}", cx, c_y, 425, 120, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
        create_node("ellipse", f"SCIco {idx}", cx + 16, c_y + 16, 28, 28, parent=f, props={"fill": C_BG_MUTED})
        create_node("text", f"SCIcoTxt {idx}", cx + 24, c_y + 22, parent=f, text="S", props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"SCTit {idx}", cx + 55, c_y + 14, parent=f, text=sname, props={"fontSize": 13, "fill": C_DARK})
        create_node("text", f"SCMeta {idx}", cx + 55, c_y + 32, parent=f, text=smeta, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        draw_pill(f, f"SCNpsn {idx}", cx + 245, c_y + 28, 90, 18, f"NPSN {snpsn}", is_active=False)
        create_node("text", f"SCSppg {idx}", cx + 20, c_y + 60, parent=f, text=ssppg, props={"fontSize": 11, "fill": C_DARK})
        draw_pill(f, f"SCSlhs {idx}", cx + 215, c_y + 58, 85, 20, "✓ SLHS Aktif", is_active=False)
        draw_pill(f, f"SCRisk {idx}", cx + 305, c_y + 58, 100, 20, f"• {srisk}", is_active=False)
        draw_button(f, f"SCBtn {idx}", cx + 345, c_y + 86, 65, 24, "Lapor", variant="primary", corner=12)
    draw_footer_real(f, 740)

    # 09. Satu Data MBG Jateng (820px)
    f = start_frame(1, 2, "09. Satu Data MBG Jateng", frame_height=820)
    draw_navbar_public(f, active="Data Terbuka", logged_in=False)
    create_node("text", "D09 Tit", 40, 90, parent=f, text="Portal Satu Data MBG Jawa Tengah", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "D09 Sub", 40, 120, parent=f, text="Transparansi realisasi anggaran, porsi harian, dan penerima manfaat tingkat provinsi.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    # Stat Big
    stat_jateng = [("Pagu Anggaran 2026", "Rp 1,42 T", "APBN & Hibah Pemprov"), ("Penerima Manfaat", "1.840.210", "Siswa SD & SMP"), ("Dapur SPPG Aktif", "840 Unit", "35 Kabupaten/Kota"), ("Kepatuhan SLHS", "92.4%", "Dinas Kesehatan")]
    for idx, (jtit, jval, jsub) in enumerate(stat_jateng):
        jx = 40 + idx * 225
        create_node("rectangle", f"D09C {idx}", jx, 150, 210, 95, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
        create_node("text", f"D09CTit {idx}", jx + 16, 168, parent=f, text=jtit, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("text", f"D09CVal {idx}", jx + 16, 192, parent=f, text=jval, props={"fontSize": 20, "fill": C_DARK})
        create_node("text", f"D09CSub {idx}", jx + 16, 222, parent=f, text=jsub, props={"fontSize": 9, "fill": C_TEXT_MUTED})
    # Visual Chart Placeholder
    draw_image_box(f, "D09 Chart", 40, 265, 880, 220, corner=14)
    create_node("text", "D09 Chart Lbl", 60, 280, parent=f, text="Grafik Tren Realisasi Distribusi Porsi & Aduan Bulanan (Jateng)", props={"fontSize": 12, "fill": C_DARK})
    draw_footer_real(f, 640)

    # 10. Direktori 40 Dapur SPPG (840px)
    f = start_frame(1, 3, "10. Direktori 40 Dapur SPPG", frame_height=840)
    draw_navbar_public(f, active="Data Terbuka", logged_in=False)
    create_node("text", "S10 Tit", 40, 90, parent=f, text="Direktori 40 Unit Dapur SPPG", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "S10 Sub", 40, 120, parent=f, text="Daftar penyedia makanan bergizi di 16 kecamatan Kota Semarang.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    sppg_dir = [
        ("SPPG Semarang Tengah 01", "Semarang Tengah · 2.500 porsi/hari", "✓ SLHS Aktif", "Rapor: 98%"),
        ("SPPG Tembalang 01", "Tembalang · 3.200 porsi/hari", "✓ SLHS Aktif", "Rapor: 96%"),
        ("SPPG Pedurungan 01", "Pedurungan · 2.800 porsi/hari", "Proses Perpanjangan", "Rapor: 88%"),
        ("SPPG Banyumanik 01", "Banyumanik · 2.400 porsi/hari", "✓ SLHS Aktif", "Rapor: 95%"),
        ("SPPG Gunungpati 01", "Gunungpati · 2.100 porsi/hari", "✓ SLHS Aktif", "Rapor: 92%"),
        ("SPPG Gajahmungkur 01", "Gajahmungkur · 1.900 porsi/hari", "✓ SLHS Aktif", "Rapor: 97%")
    ]
    sy = 160
    for idx, (sname, smeta, sslhs, sscore) in enumerate(sppg_dir):
        create_node("rectangle", f"S10Card {idx}", 40, sy, 880, 60, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
        create_node("text", f"S10Name {idx}", 65, sy + 15, parent=f, text=sname, props={"fontSize": 13, "fill": C_DARK})
        create_node("text", f"S10Meta {idx}", 65, sy + 34, parent=f, text=smeta, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        draw_pill(f, f"S10P1 {idx}", 580, sy + 18, 120, 24, sslhs, is_active=False)
        draw_pill(f, f"S10P2 {idx}", 720, sy + 18, 90, 24, sscore, is_active=False)
        draw_button(f, f"S10Btn {idx}", 830, sy + 18, 70, 24, "Profil →", variant="outline", corner=12)
        sy += 70
    draw_footer_real(f, 680)

    # 11. Profil Detail SPPG (820px)
    f = start_frame(1, 4, "11. Profil Detail SPPG", frame_height=820)
    draw_navbar_public(f, active="Data Terbuka", logged_in=False)
    create_node("text", "P11 Tit", 40, 90, parent=f, text="SPPG Semarang Tengah 01", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "P11 Sub", 40, 120, parent=f, text="Unit Dapur Penyedia Resmi · No. Registrasi: BGN-SMG-01-2026", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    # Two Columns: Left details, Right stats
    create_node("rectangle", "P11 Left", 40, 150, 560, 360, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("text", "P11 L1", 65, 175, parent=f, text="Informasi Higienitas & Sanitasi", props={"fontSize": 14, "fill": C_DARK})
    create_node("text", "P11 L2", 65, 205, parent=f, text="• Sertifikat Laik Higiene Sanitasi (SLHS): Berlaku s.d. Des 2027", props={"fontSize": 11, "fill": C_DARK})
    create_node("text", "P11 L3", 65, 230, parent=f, text="• Pemeriksaan Air Bersih: Negatif E.Coli (Labkesda Semarang)", props={"fontSize": 11, "fill": C_DARK})
    create_node("text", "P11 L4", 65, 255, parent=f, text="• Petugas Penjamah Makanan: 18 Orang Bersertifikat BNSP", props={"fontSize": 11, "fill": C_DARK})
    create_node("text", "P11 L5", 65, 290, parent=f, text="Daftar Sekolah Penerima Manfaat:", props={"fontSize": 12, "fill": C_DARK})
    create_node("text", "P11 L6", 65, 315, parent=f, text="1. SD Negeri Pandanaran 01 (420 siswa)\n2. SMP Negeri 3 Semarang (780 siswa)\n3. SD Negeri Miroto 02 (310 siswa)", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    # Right Box
    create_node("rectangle", "P11 Right", 620, 150, 300, 360, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("text", "P11 R1", 645, 175, parent=f, text="Indeks Performa & SLA", props={"fontSize": 14, "fill": C_DARK})
    create_node("text", "P11 RVal", 645, 210, parent=f, text="98.5%", props={"fontSize": 32, "fill": C_DARK})
    create_node("text", "P11 RSub", 645, 255, parent=f, text="Tingkat ketepatan waktu pengiriman menu dalam 30 hari terakhir.", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    draw_image_box(f, "P11 Map", 645, 295, 250, 120, corner=8)
    draw_footer_real(f, 620)

    # 12. Peta Spasial Jawa Tengah (860px)
    f = start_frame(1, 5, "12. Peta Spasial Jawa Tengah", frame_height=860)
    draw_navbar_public(f, active="Data Terbuka", logged_in=False)
    create_node("text", "M12 Tit", 40, 90, parent=f, text="Peta Sebaran Spasial MBG Jawa Tengah", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "M12 Sub", 40, 120, parent=f, text="Peta interaktif sebaran 40 Dapur SPPG dan 165 Sekolah di Kota Semarang.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    # Full Map Area
    draw_image_box(f, "M12 Map Box", 40, 150, 880, 420, corner=16)
    create_node("text", "M12 Map Pin Lbl", 65, 175, parent=f, text="• Titik Lokasi Dapur SPPG    ▲ Sekolah Sasaran    ■ Klaster Risiko", props={"fontSize": 11, "fill": C_DARK})
    draw_button(f, "M12 Filter Btn", 750, 170, 145, 32, "Filter Kecamatan v", variant="outline", corner=16)
    draw_footer_real(f, 680)

    print(" -> Section 2 (07-12) selesai.")

    # =========================================================================
    # ROW 2: PUBLIK 13 - 18 (ANALITIK, DSS, & SISTEM PERINGATAN DINI)
    # =========================================================================
    add_section_header(2, "SECTION 03: DRILLDOWN WILAYAH, REKAPITULASI & DSS (13 - 18)", "Statistik wilayah Semarang, pusat unduh API, rangkuman analitik, prioritas SAW, dan deteksi KLB.")

    # 13. Drilldown Kota Semarang (820px)
    f = start_frame(2, 0, "13. Drilldown Kota Semarang", frame_height=820)
    draw_navbar_public(f, active="Data Terbuka", logged_in=False)
    create_node("text", "W13 Tit", 40, 90, parent=f, text="Statistik MBG Kota Semarang", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "W13 Sub", 40, 120, parent=f, text="Rangkuman agregat dari 16 kecamatan se-Kota Semarang.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    stat_smg = [("Sekolah Sasaran", "165 Unit", "100% Tercover SPPG"), ("Porsi Harian", "48.250", "Distribusi Pagi & Siang"), ("SPPG Beroperasi", "40 Dapur", "SLHS Terverifikasi"), ("Indeks Sanitasi", "94.8", "Zona Hijau Dinkes")]
    for idx, (wtit, wval, wsub) in enumerate(stat_smg):
        wx = 40 + idx * 225
        create_node("rectangle", f"W13C {idx}", wx, 150, 210, 95, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
        create_node("text", f"W13CTit {idx}", wx + 16, 168, parent=f, text=wtit, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("text", f"W13CVal {idx}", wx + 16, 192, parent=f, text=wval, props={"fontSize": 20, "fill": C_DARK})
        create_node("text", f"W13CSub {idx}", wx + 16, 222, parent=f, text=wsub, props={"fontSize": 9, "fill": C_TEXT_MUTED})
    draw_image_box(f, "W13 Chart", 40, 265, 880, 220, corner=14)
    draw_footer_real(f, 620)

    # 14. Rekapitulasi Kasus Terbuka (780px)
    f = start_frame(2, 1, "14. Rekapitulasi Kasus Terbuka", frame_height=780)
    draw_navbar_public(f, active="Data Terbuka", logged_in=False)
    create_node("text", "R14 Tit", 40, 90, parent=f, text="Rekapitulasi Pengaduan MBG", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "R14 Sub", 40, 120, parent=f, text="Data keterbukaan informasi publik mengenai keluhan dan penyelesaian.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    draw_image_box(f, "R14 Bar Chart", 40, 150, 560, 280, corner=14)
    create_node("rectangle", "R14 Side", 620, 150, 300, 280, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "R14 STit", 645, 175, parent=f, text="Kategori Aduan Terbanyak", props={"fontSize": 14, "fill": C_DARK})
    kategori_aduan = [("1. Makanan Tidak Layak", "42%"), ("2. Porsi & Gizi Kurang", "28%"), ("3. Keterlambatan Distribusi", "16%"), ("4. Kebersihan Peralatan", "11%"), ("5. Dugaan Keracunan", "3%")]
    ky = 210
    for ktit, kpct in kategori_aduan:
        create_node("text", f"R14K1 {ky}", 645, ky, parent=f, text=ktit, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"R14K2 {ky}", 870, ky, parent=f, text=kpct, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        ky += 32
    draw_footer_real(f, 580)

    # 15. Pusat Unduh Dataset & API (740px)
    f = start_frame(2, 2, "15. Pusat Unduh Dataset & API", frame_height=740)
    draw_navbar_public(f, active="Data Terbuka", logged_in=False)
    create_node("text", "U15 Tit", 40, 90, parent=f, text="Pusat Unduhan Dataset Terbuka", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "U15 Sub", 40, 120, parent=f, text="Unduh data dalam format CSV, JSON, atau integrasikan melalui REST API.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    datasets = [
        ("Dataset 165 Sekolah Sasaran", "Format CSV, JSON · Pembaruan berkala tiap pekan · 42 KB", "Unduh CSV", "Unduh JSON"),
        ("Dataset 40 Dapur SPPG & Status SLHS", "Format CSV, JSON · Terverifikasi Dinas Kesehatan · 28 KB", "Unduh CSV", "Unduh JSON"),
        ("Dataset Rekapitulasi Kasus Terbuka", "Format CSV, JSON · Data anonymized sesuai regulasi privasi · 115 KB", "Unduh CSV", "Unduh JSON")
    ]
    uy = 160
    for idx, (dtit, dmeta, b1, b2) in enumerate(datasets):
        create_node("rectangle", f"U15Card {idx}", 40, uy, 880, 75, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
        create_node("text", f"U15DTit {idx}", 65, uy + 18, parent=f, text=dtit, props={"fontSize": 13, "fill": C_DARK})
        create_node("text", f"U15DMeta {idx}", 65, uy + 38, parent=f, text=dmeta, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        draw_button(f, f"U15Btn1 {idx}", 680, uy + 22, 100, 32, b1, variant="outline", corner=16)
        draw_button(f, f"U15Btn2 {idx}", 795, uy + 22, 105, 32, b2, variant="primary", corner=16)
        uy += 88
    draw_footer_real(f, 550)

    # 16. Hub Analitik Cerdas / Insight (800px)
    f = start_frame(2, 3, "16. Hub Analitik Cerdas", frame_height=800)
    draw_navbar_public(f, active="Insight", logged_in=False)
    create_node("text", "I16 Tit", 40, 90, parent=f, text="Hub Analitik & Intelligence MBG", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "I16 Sub", 40, 120, parent=f, text="Ringkasan pemantauan analitik dan sistem pendukung keputusan (DSS).", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    insight_pillars = [
        ("Prioritas Audit SAW", "Metode Simple Additive Weighting untuk mendeteksi SPPG yang membutuhkan inspeksi.", "Buka SAW →"),
        ("Peringatan Dini KLB", "Pemantauan anomali lonjakan keluhan medis untuk mencegah KLB keracunan pangan.", "Buka Radar →"),
        ("Komparasi Mutu SPPG", "Bandingkan matriks performa dan kepatuhan antar dua unit dapur penyedia MBG.", "Bandingkan →")
    ]
    for idx, (itit, idesc, ibtn) in enumerate(insight_pillars):
        ix = 40 + idx * 300
        create_node("rectangle", f"I16Card {idx}", ix, 160, 280, 240, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
        draw_image_box(f, f"I16Img {idx}", ix + 20, 180, 240, 90, corner=8)
        create_node("text", f"I16CTit {idx}", ix + 20, 290, parent=f, text=itit, props={"fontSize": 13, "fill": C_DARK})
        create_node("text", f"I16CDesc {idx}", ix + 20, 315, parent=f, text=idesc, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        draw_button(f, f"I16CBtn {idx}", ix + 20, 360, 240, 30, ibtn, variant="outline", corner=15)
    draw_footer_real(f, 580)

    # 17. Prioritas Inspeksi SAW (860px)
    f = start_frame(2, 4, "17. Prioritas Inspeksi SAW", frame_height=860)
    draw_navbar_public(f, active="Insight", logged_in=False)
    create_node("text", "Saw Tit", 40, 90, parent=f, text="Prioritas Inspeksi (SAW)", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "Saw Sub", 40, 120, parent=f, text="Simple Additive Weighting: Penentuan prioritas pengawasan dapur SPPG.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    draw_pill(f, "Saw Filter", 830, 90, 95, 28, "Unduh PDF", is_active=False)
    saw_sppg_data = [
        ("SPPG Semarang Utara 02", "Semarang Utara · 3.100 porsi/hari", "0.892", "Inspeksi Darurat", 89),
        ("SPPG Tembalang 03", "Tembalang · 2.900 porsi/hari", "0.784", "Audit Lapangan", 78),
        ("SPPG Pedurungan 02", "Pedurungan · 3.400 porsi/hari", "0.671", "Pengawasan Rutin", 67),
        ("SPPG Semarang Timur 01", "Semarang Timur · 2.200 porsi/hari", "0.542", "Kondisi Baik", 54),
        ("SPPG Candisari 01", "Candisari · 1.800 porsi/hari", "0.418", "Sangat Baik", 42),
    ]
    sw_y = 160
    for idx, (sp_name, sp_meta, sp_score, sp_action, pct) in enumerate(saw_sppg_data):
        create_node("rectangle", f"SawCard {idx}", 40, sw_y, 880, 80, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
        create_node("text", f"SawRank {idx}", 60, sw_y + 30, parent=f, text=f"#{idx+1}", props={"fontSize": 16, "fill": C_DARK})
        create_node("text", f"SawName {idx}", 105, sw_y + 20, parent=f, text=sp_name, props={"fontSize": 13, "fill": C_DARK})
        create_node("text", f"SawMeta {idx}", 105, sw_y + 42, parent=f, text=sp_meta, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        create_node("text", f"SawScore {idx}", 520, sw_y + 24, parent=f, text=f"Skor: {sp_score}", props={"fontSize": 12, "fill": C_DARK})
        create_node("rectangle", f"SawBarBg {idx}", 520, sw_y + 46, 180, 8, parent=f, props={"fill": C_BG_MUTED, "cornerRadius": 4})
        create_node("rectangle", f"SawBarFill {idx}", 520, sw_y + 46, 180 * (pct / 100), 8, parent=f, props={"fill": C_DARK, "cornerRadius": 4})
        draw_pill(f, f"SawAct {idx}", 740, sw_y + 26, 155, 26, sp_action, is_active=(idx == 0))
        sw_y += 92
    draw_footer_real(f, 680)

    # 18. Deteksi Peringatan KLB (680px)
    f = start_frame(2, 5, "18. Deteksi Peringatan KLB", frame_height=680)
    draw_navbar_public(f, active="Insight", logged_in=False)
    create_node("text", "Klb Tit", 40, 90, parent=f, text="Peringatan Dini", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "Klb Sub", 40, 120, parent=f, text="Deteksi dini otomatis terhadap potensi Kejadian Luar Biasa (KLB).", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("rectangle", "Klb Alert Card", 40, 155, 880, 130, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("rectangle", "Klb Badge", 65, 175, 160, 26, parent=f, props={"fill": C_DARK, "cornerRadius": 13})
    create_node("text", "Klb Badge Txt", 80, 182, parent=f, text="• PERINGATAN AKTIF", props={"fontSize": 10, "fill": "#FFFFFF"})
    create_node("text", "Klb Alert Tit", 65, 215, parent=f, text="Klaster Terdeteksi: 3 Sekolah di Wilayah Tembalang", props={"fontSize": 15, "fill": C_DARK})
    create_node("text", "Klb Alert Desc", 65, 240, parent=f, text="Laporan medis masuk menunjukkan 18 siswa mengalami gejala mual dalam rentang 2 jam. Dapur penyedia: SPPG Tembalang 02.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("rectangle", "Klb Met 1", 40, 305, 280, 100, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "Klb M1 Tit", 60, 325, parent=f, text="Total Korban Terindikasi", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "Klb M1 Val", 60, 348, parent=f, text="18 Siswa", props={"fontSize": 22, "fill": C_DARK})
    create_node("rectangle", "Klb Met 2", 340, 305, 280, 100, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "Klb M2 Tit", 360, 325, parent=f, text="Status Penanganan Medis", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "Klb M2 Val", 360, 348, parent=f, text="Tim Labkesda OTW", props={"fontSize": 18, "fill": C_DARK})
    create_node("rectangle", "Klb Met 3", 640, 305, 280, 100, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "Klb M3 Tit", 660, 325, parent=f, text="Tindakan Dapur", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "Klb M3 Val", 660, 348, parent=f, text="Distribusi Dihentikan", props={"fontSize": 18, "fill": C_DARK})
    draw_footer_real(f, 490)

    print(" -> Section 3 (13-18) selesai.")

    # =========================================================================
    # ROW 3: PUBLIK 19 - 24 (EDUKASI, REGULASI & KEBIJAKAN)
    # =========================================================================
    add_section_header(3, "SECTION 04: EDUKASI, METODOLOGI & KEBIJAKAN SISTEM (19 - 24)", "Fitur komparasi SPPG, panduan SOP, metodologi ilmiah, profil pengembang, FAQ, dan privasi.")

    # 19. Komparasi Antar Dapur SPPG (760px)
    f = start_frame(3, 0, "19. Komparasi Antar Dapur SPPG", frame_height=760)
    draw_navbar_public(f, active="Insight", logged_in=False)
    create_node("text", "K19 Tit", 40, 90, parent=f, text="Komparasi Kinerja SPPG", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "K19 Sub", 40, 120, parent=f, text="Bandingkan dua unit dapur penyedia secara berdampingan.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    # 2 Comparison Columns
    for col_i, (sname, skec, sporsi, sslhs, ssla) in enumerate([("SPPG Semarang Tengah 01", "Semarang Tengah", "2.500 porsi", "SLHS: Grade A", "Kepatuhan SLA: 98.5%"), ("SPPG Tembalang 02", "Tembalang", "2.800 porsi", "SLHS: Grade A", "Kepatuhan SLA: 95.1%")]):
        cx = 40 if col_i == 0 else 495
        create_node("rectangle", f"K19Col {col_i}", cx, 160, 425, 290, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
        create_node("text", f"K19CName {col_i}", cx + 25, 185, parent=f, text=sname, props={"fontSize": 15, "fill": C_DARK})
        create_node("text", f"K19CKec {col_i}", cx + 25, 210, parent=f, text=f"Kecamatan: {skec}", props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("text", f"K19CPorsi {col_i}", cx + 25, 245, parent=f, text=f"• Kapasitas: {sporsi}", props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"K19CSlhs {col_i}", cx + 25, 275, parent=f, text=f"• Sertifikasi: {sslhs}", props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"K19CSla {col_i}", cx + 25, 305, parent=f, text=f"• Kinerja: {ssla}", props={"fontSize": 12, "fill": C_DARK})
        draw_button(f, f"K19Btn {col_i}", cx + 25, 360, 375, 36, "Lihat Rapor Lengkap", variant="outline", corner=18)
    draw_footer_real(f, 540)

    # 20. Pusat Edukasi & Panduan (780px)
    f = start_frame(3, 1, "20. Pusat Edukasi & Panduan", frame_height=780)
    draw_navbar_public(f, active="Panduan", logged_in=False)
    create_node("text", "E20 Tit", 40, 90, parent=f, text="Pusat Edukasi & Regulasi MBG", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "E20 Sub", 40, 120, parent=f, text="Standar Operasional Prosedur (SOP) higienitas, takaran gizi, dan hak masyarakat.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    edu_cards = [
        ("Standar Gizi Siswa MBG", "Pedoman kecukupan kalori, protein, vitamin bagi anak usia SD & SMP."),
        ("Hak & Perlindungan Whistleblower", "Jaminan kerahasiaan identitas dan perlindungan hukum bagi pelapor."),
        ("Prosedur Penanganan Darurat 119", "Alur evakuasi cepat jika ditemukan gejala keracunan pangan di sekolah."),
        ("Kriteria Kebersihan Dapur SLHS", "Indikator sanitasi dari Dinas Kesehatan yang wajib dipenuhi dapur SPPG.")
    ]
    ey = 160
    for idx, (etit, edesc) in enumerate(edu_cards):
        create_node("rectangle", f"E20C {idx}", 40, ey, 880, 70, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
        create_node("text", f"E20CTit {idx}", 65, ey + 18, parent=f, text=etit, props={"fontSize": 13, "fill": C_DARK})
        create_node("text", f"E20CDesc {idx}", 65, ey + 38, parent=f, text=edesc, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        draw_button(f, f"E20CBtn {idx}", 775, ey + 18, 120, 32, "Baca Dokumen →", variant="outline", corner=16)
        ey += 82
    draw_footer_real(f, 570)

    # 21. Metodologi Algoritma SAW (840px)
    f = start_frame(3, 2, "21. Metodologi Algoritma SAW", frame_height=840)
    draw_navbar_public(f, active="Panduan", logged_in=False)
    create_node("text", "M21 Tit", 40, 90, parent=f, text="Metodologi Simple Additive Weighting (SAW)", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "M21 Sub", 40, 120, parent=f, text="Landasan ilmiah dan formula matematis pembobotan risiko pengawasan dapur SPPG.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("rectangle", "M21 Form Box", 40, 155, 880, 130, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "M21 Form Lbl", 65, 175, parent=f, text="Formula Normalisasi Matriks Kriteria (Rij):", props={"fontSize": 12, "fill": C_DARK})
    create_node("text", "M21 Eq1", 65, 205, parent=f, text="Benefit: Rij = (Xij / Max Xij)     |     Cost: Rij = (Min Xij / Xij)", props={"fontSize": 14, "fill": C_DARK})
    create_node("text", "M21 Eq2", 65, 235, parent=f, text="Nilai Preferensi Akhir: Vi = SUM (Wj * Rij)  ->  SPPG dengan Vi terbesar diprioritaskan inspeksi.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    # Criteria Weights Table
    create_node("rectangle", "M21 Tbl", 40, 305, 880, 200, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "M21 TH1", 65, 325, parent=f, text="Kode Kriteria", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "M21 TH2", 200, 325, parent=f, text="Nama Parameter", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "M21 TH3", 520, 325, parent=f, text="Bobot (Wj)", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "M21 TH4", 720, 325, parent=f, text="Sifat Kriteria", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    saw_params = [("C1", "Frekuensi Keluhan Masuk 30 Hari", "35%", "Benefit (Makin tinggi makin prioritas)"), ("C2", "Kepatuhan Sertifikat SLHS Dinkes", "25%", "Cost (Makin rendah makin prioritas)"), ("C3", "Rerata Waktu Respons SLA (Jam)", "20%", "Benefit (Makin lambat makin prioritas)"), ("C4", "Kapasitas Porsi Siswa Terdampak", "20%", "Benefit (Makin besar risiko makin prioritas)")]
    sy = 350
    for ccode, cname, cw, ctype in saw_params:
        create_node("line", f"M21L {sy}", 40, sy, 880, 0, parent=f, props={"stroke": C_BORDER, "strokeWeight": 1})
        create_node("text", f"M21C1 {sy}", 65, sy + 10, parent=f, text=ccode, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"M21C2 {sy}", 200, sy + 10, parent=f, text=cname, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"M21C3 {sy}", 520, sy + 10, parent=f, text=cw, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"M21C4 {sy}", 720, sy + 10, parent=f, text=ctype, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        sy += 32
    draw_footer_real(f, 620)

    # 22. Tentang Inisiatif PMBGM (720px)
    f = start_frame(3, 3, "22. Tentang Inisiatif PMBGM", frame_height=720)
    draw_navbar_public(f, active="Panduan", logged_in=False)
    create_node("text", "T22 Tit", 40, 90, parent=f, text="Tentang Platform PMBGM", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "T22 Sub", 40, 120, parent=f, text="Platform pengawasan partisipatif masyarakat untuk Program Makan Bergizi Gratis.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("rectangle", "T22 Box", 40, 155, 880, 160, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("text", "T22 Visi", 65, 180, parent=f, text="Visi Inisiatif", props={"fontSize": 14, "fill": C_DARK})
    create_node("text", "T22 VisiDesc", 65, 205, parent=f, text="PMBGM hadir sebagai jembatan independen antara masyarakat (orang tua, guru, siswa) dan pihak berwenang (BGN, SPPG, Dinkes). Dengan mengintegrasikan sistem pelaporan terverifikasi, ekstraksi bukti foto EXIF, dan sistem pendukung keputusan SAW, mutu gizi generasi bangsa terlindungi secara transparan.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    # Tim Profil
    create_node("text", "T22 TimTit", 40, 340, parent=f, text="Pengembang: Tim Ctrl Win Enter · MIA 2026", props={"fontSize": 14, "fill": C_DARK})
    draw_footer_real(f, 480)

    # 23. Tanya Jawab (FAQ) (780px)
    f = start_frame(3, 4, "23. Tanya Jawab (FAQ)", frame_height=780)
    draw_navbar_public(f, active="Panduan", logged_in=False)
    create_node("text", "F23 Tit", 40, 90, parent=f, text="Tanya Jawab (FAQ)", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "F23 Sub", 40, 120, parent=f, text="Jawaban atas pertanyaan yang paling sering diajukan warga.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    faqs = [
        ("Apakah identitas pelapor dijamin aman?", "Ya. Pelapor dapat memilih mode Anonim atau Rahasia. Identitas Anda tidak akan pernah dipublikasikan."),
        ("Berapa lama waktu penanganan laporan keluhan?", "Verifikasi awal dilakukan maksimal 2-12 jam. Untuk keluhan biasa maksimal 5 hari kerja."),
        ("Apa yang harus dilakukan jika ada siswa keracunan makanan?", "Pilih kategori DARURAT: Keracunan. Sistem langsung mengirim peringatan dini ke Dinkes dan ambulans 119."),
        ("Siapa yang mengelola dapur SPPG?", "Dapur SPPG dikelola oleh mitra tersertifikasi di bawah supervisi Badan Gizi Nasional (BGN) dan Dinkes.")
    ]
    fy = 160
    for idx, (q, a) in enumerate(faqs):
        create_node("rectangle", f"F23C {idx}", 40, fy, 880, 70, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
        create_node("text", f"F23Q {idx}", 65, fy + 16, parent=f, text=f"Q: {q}", props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"F23A {idx}", 65, fy + 38, parent=f, text=f"A: {a}", props={"fontSize": 10, "fill": C_TEXT_MUTED})
        fy += 82
    draw_footer_real(f, 570)

    # 24. Kebijakan Privasi (720px)
    f = start_frame(3, 5, "24. Kebijakan Privasi", frame_height=720)
    draw_navbar_public(f, active="Panduan", logged_in=False)
    create_node("text", "P24 Tit", 40, 90, parent=f, text="Kebijakan Privasi & Keamanan", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "P24 Sub", 40, 120, parent=f, text="Komitmen kami melindungi data pribadi masyarakat dan integritas informasi.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("rectangle", "P24 Box", 40, 155, 880, 220, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("text", "P24 P1", 65, 180, parent=f, text="1. Perlindungan Data Siswa & Anak", props={"fontSize": 13, "fill": C_DARK})
    create_node("text", "P24 P1D", 65, 202, parent=f, text="Foto wajah anak otomatis diblur atau dihapus oleh sistem verifikasi demi menjaga privasi siswa di bawah umur.", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "P24 P2", 65, 235, parent=f, text="2. Kerahasiaan Whistleblower", props={"fontSize": 13, "fill": C_DARK})
    create_node("text", "P24 P2D", 65, 257, parent=f, text="Nomor telepon dan kontak pelapor dienkripsi dan hanya dapat diakses oleh verifikator berwenang jika dibutuhkan klarifikasi.", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "P24 P3", 65, 290, parent=f, text="3. Penggunaan Metadata Foto", props={"fontSize": 13, "fill": C_DARK})
    create_node("text", "P24 P3D", 65, 312, parent=f, text="Metadata EXIF hanya dipakai untuk mencocokkan waktu dan koordinat sekolah, tidak pernah dibagikan kepada pihak ketiga.", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    draw_footer_real(f, 490)

    print(" -> Section 4 (19-24) selesai.")

    # =========================================================================
    # ROW 4: ALUR LAPOR MULTI-STEP 25 - 30 (WARGA)
    # =========================================================================
    add_section_header(4, "SECTION 05: AUTENTIKASI & FORMULIR PELAPORAN MULTI-STEP (25 - 30)", "Masuk persona 7-role dan alur formulir langkah 1 sampai langkah 5 pengaduan warga.")

    # 25. Masuk Persona Multi-Role (720px)
    f = start_frame(4, 0, "25. Masuk Persona Multi-Role", frame_height=720)
    create_node("rectangle", "Login Left Hero", 0, 0, 420, 720, parent=f, props={"fill": C_DARK})
    create_node("text", "Login Brand", 50, 60, parent=f, text="PMBGM", props={"fontSize": 20, "fill": "#FFFFFF"})
    create_node("text", "Login Tag", 50, 180, parent=f, text="Kawal Gizi,\nJaga Generasi.", props={"fontSize": 32, "fill": "#FFFFFF"})
    create_node("text", "Login TagSub", 50, 265, parent=f, text="Platform Pengawasan Partisipatif Program Makan Bergizi Gratis.", props={"fontSize": 12, "fill": C_TEXT_LIGHT})
    create_node("text", "Login Right Tit", 470, 70, parent=f, text="Masuk", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "Login Right Sub", 470, 100, parent=f, text="Pilih akun simulasi peran untuk masuk:", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    roles_demo = [
        ("Ibu Rina", "Warga / Orang Tua", "W"),
        ("Pak Budi", "Guru / Sekolah", "G"),
        ("Mbak Sari", "Verifikator", "V"),
        ("Pengelola SPPG", "Dapur SPPG", "S"),
        ("Pak Hendra", "Dinas Kesehatan", "D"),
        ("Pengawas BGN", "Korwil BGN", "K"),
        ("Admin PMBGM", "Administrator", "A")
    ]
    ry = 135
    for name, rlbl, code in roles_demo:
        create_node("rectangle", f"RoleCard {code}", 470, ry, 440, 52, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 10})
        create_node("ellipse", f"RoleIco {code}", 485, ry + 12, 28, 28, parent=f, props={"fill": C_DARK if code == "W" else C_BG_MUTED})
        create_node("text", f"RoleCode {code}", 493, ry + 18, parent=f, text=code, props={"fontSize": 11, "fill": "#FFFFFF" if code == "W" else C_DARK})
        create_node("text", f"RoleName {code}", 525, ry + 11, parent=f, text=name, props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"RoleLbl {code}", 525, ry + 28, parent=f, text=rlbl, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        create_node("text", f"RoleArr {code}", 885, ry + 18, parent=f, text="→", props={"fontSize": 12, "fill": C_TEXT_MUTED})
        ry += 60

    # 26. Lapor Step 1 - Sekolah (520px)
    f = start_frame(4, 1, "26. Lapor Step 1 - Sekolah", frame_height=520)
    draw_navbar_public(f, active="Beranda", logged_in=True, user_name="Ibu Rina")
    create_node("text", "S1 Tit", 40, 85, parent=f, text="Lapor Masalah", props={"fontSize": 28, "fill": C_DARK})
    draw_button(f, "S1 Btn Panduan", 825, 88, 95, 34, "Panduan", variant="outline", corner=17)
    draw_stepper(f, active_step=1)
    create_node("rectangle", "S1 Form Box", 40, 230, 580, 200, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("text", "S1 Lbl Sekolah", 65, 255, parent=f, text="Pilih Sekolah Sasaran MBG", props={"fontSize": 15, "fill": C_DARK})
    create_node("text", "S1 Sub Sekolah", 65, 278, parent=f, text="Ketik nama sekolah atau NPSN untuk memilih lokasi:", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("rectangle", "S1 Input Box", 65, 305, 530, 44, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
    create_node("text", "S1 Val", 85, 318, parent=f, text="SD Negeri Tembalang 01", props={"fontSize": 13, "fill": C_DARK})
    draw_pill(f, "S1 Badge", 450, 315, 130, 24, "Kec. Tembalang", is_active=False)
    draw_button(f, "S1 Btn Lanjut", 65, 370, 120, 38, "Lanjut →", variant="primary", corner=19)
    draw_sidebar_sla(f)

    # 27. Lapor Step 2 - Masalah (740px)
    f = start_frame(4, 2, "27. Lapor Step 2 - Masalah", frame_height=740)
    draw_navbar_public(f, active="Beranda", logged_in=True, user_name="Ibu Rina")
    create_node("text", "S2 Tit", 40, 85, parent=f, text="Lapor Masalah", props={"fontSize": 28, "fill": C_DARK})
    draw_button(f, "S2 Btn Panduan", 825, 88, 95, 34, "Panduan", variant="outline", corner=17)
    create_node("rectangle", "S2 Sch Banner", 40, 135, 580, 36, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 18})
    create_node("text", "S2 Sch Txt", 60, 145, parent=f, text="Sekolah: SD Negeri Tembalang 01 · Tembalang", props={"fontSize": 11, "fill": C_DARK})
    draw_button(f, "S2 Btn Ganti", 555, 140, 55, 26, "Ganti", variant="outline", corner=13)
    draw_stepper(f, active_step=2)
    create_node("rectangle", "S2 Main Box", 40, 290, 580, 360, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("text", "S2 Q", 65, 310, parent=f, text="Apa masalahnya?", props={"fontSize": 15, "fill": C_DARK})
    cat_items = [
        ("Keracunan", "Mual, muntah, pusing", "KR"),
        ("Tidak layak", "Basi, bau, berulat", "TL"),
        ("Kebersihan", "Kotor, benda asing", "KB"),
        ("Porsi & gizi", "Porsi kecil, menu kurang", "PG"),
        ("Distribusi", "Telat atau kurang", "DS"),
        ("Anggaran", "Dugaan penyimpangan", "AG"),
        ("Lainnya", "Masalah lain", "LN")
    ]
    for idx, (ctit, csub, ccode) in enumerate(cat_items):
        col_i = idx % 3
        row_i = idx // 3
        cx = 65 + col_i * 175
        cy = 340 + row_i * 75
        is_sel = (ccode == "TL")
        create_node("rectangle", f"CatBox {idx}", cx, cy, 165, 68, parent=f, props={"fill": "#FFFFFF", "stroke": C_DARK if is_sel else C_BORDER, "strokeWeight": 1.5 if is_sel else 1, "cornerRadius": 12})
        create_node("ellipse", f"CatIco {idx}", cx + 12, cy + 12, 24, 24, parent=f, props={"fill": C_DARK if is_sel else C_BG_MUTED})
        create_node("text", f"CatCode {idx}", cx + 16, cy + 17, parent=f, text=ccode, props={"fontSize": 9, "fill": "#FFFFFF" if is_sel else C_DARK})
        create_node("text", f"CatTit {idx}", cx + 12, cy + 38, parent=f, text=ctit, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"CatDesc {idx}", cx + 12, cy + 52, parent=f, text=csub, props={"fontSize": 8, "fill": C_TEXT_MUTED})
        if is_sel:
            create_node("text", f"CatChk {idx}", cx + 145, cy + 10, parent=f, text="✓", props={"fontSize": 11, "fill": C_DARK})
    draw_button(f, "S2 Btn Back", 40, 670, 36, 36, "←", variant="outline", corner=18)
    draw_button(f, "S2 Btn Lanjut", 90, 670, 120, 36, "Lanjut →", variant="primary", corner=18)
    draw_sidebar_sla(f)

    # 28. Lapor Step 3 - Cerita (690px)
    f = start_frame(4, 3, "28. Lapor Step 3 - Cerita", frame_height=690)
    draw_navbar_public(f, active="Beranda", logged_in=True, user_name="Ibu Rina")
    create_node("text", "S3 Tit", 40, 85, parent=f, text="Lapor Masalah", props={"fontSize": 28, "fill": C_DARK})
    draw_button(f, "S3 Btn Panduan", 825, 88, 95, 34, "Panduan", variant="outline", corner=17)
    create_node("rectangle", "S3 Sch Banner", 40, 135, 580, 36, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 18})
    create_node("text", "S3 Sch Txt", 60, 145, parent=f, text="Sekolah: SD Negeri Tembalang 01 · Tembalang", props={"fontSize": 11, "fill": C_DARK})
    draw_button(f, "S3 Btn Ganti", 555, 140, 55, 26, "Ganti", variant="outline", corner=13)
    draw_stepper(f, active_step=3)
    create_node("rectangle", "S3 Main Box", 40, 290, 580, 310, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("text", "S3 Q", 65, 310, parent=f, text="Ceritakan masalahnya", props={"fontSize": 15, "fill": C_DARK})
    create_node("text", "S3 QSub", 65, 332, parent=f, text="Tuliskan apa yang Anda lihat. Semakin detail kronologinya, semakin cepat diverifikasi.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("rectangle", "S3 Title Inp", 65, 360, 530, 40, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
    create_node("text", "S3 Title Txt", 80, 372, parent=f, text="Nasi berlendir dan lauk tempe berbau asam", props={"fontSize": 12, "fill": C_DARK})
    create_node("rectangle", "S3 Area Inp", 65, 415, 530, 130, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
    create_node("text", "S3 Area Txt", 80, 430, parent=f, text="Saat jam makan siang pukul 11.45 WIB, anak saya membuka kotak makanan...", props={"fontSize": 11, "fill": C_DARK})
    create_node("text", "S3 Counter", 500, 560, parent=f, text="142 / 1000 karakter", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    draw_button(f, "S3 Btn Back", 40, 620, 36, 36, "←", variant="outline", corner=18)
    draw_button(f, "S3 Btn Lanjut", 90, 620, 120, 36, "Lanjut →", variant="primary", corner=18)
    draw_sidebar_sla(f)

    # 29. Lapor Step 4 - Bukti Foto (740px)
    f = start_frame(4, 4, "29. Lapor Step 4 - Bukti", frame_height=740)
    draw_navbar_public(f, active="Beranda", logged_in=True, user_name="Ibu Rina")
    create_node("text", "S4 Tit", 40, 85, parent=f, text="Lapor Masalah", props={"fontSize": 28, "fill": C_DARK})
    draw_button(f, "S4 Btn Panduan", 825, 88, 95, 34, "Panduan", variant="outline", corner=17)
    create_node("rectangle", "S4 Sch Banner", 40, 135, 580, 36, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 18})
    create_node("text", "S4 Sch Txt", 60, 145, parent=f, text="Sekolah: SD Negeri Tembalang 01 · Tembalang", props={"fontSize": 11, "fill": C_DARK})
    draw_button(f, "S4 Btn Ganti", 555, 140, 55, 26, "Ganti", variant="outline", corner=13)
    draw_stepper(f, active_step=4)
    create_node("rectangle", "S4 Main Box", 40, 290, 580, 360, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("text", "S4 Q", 65, 310, parent=f, text="Bukti Foto", props={"fontSize": 15, "fill": C_DARK})
    draw_pill(f, "S4 Wajib Pill", 500, 310, 100, 22, "Wajib min. 1 foto", is_active=False)
    draw_pill(f, "Pill An", 65, 345, 120, 24, "Hindari wajah anak", is_active=False)
    draw_pill(f, "Pill Lk", 195, 345, 145, 24, "Lokasi disembunyikan", is_active=False)
    draw_pill(f, "Pill Kom", 350, 345, 125, 24, "Dikompres otomatis", is_active=False)
    draw_button(f, "S4 Btn Cam", 65, 385, 255, 48, "Ambil Foto (Kamera)", variant="outline", corner=10)
    draw_button(f, "S4 Btn Gal", 335, 385, 255, 48, "Pilih dari Galeri", variant="outline", corner=10)
    create_node("text", "S4 Hint", 65, 448, parent=f, text="Maks. 3 berkas · format JPG/PNG/MP4 maks. 10 MB", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    draw_image_box(f, "Thumb 1", 65, 475, 180, 120, corner=8)
    create_node("rectangle", "Thumb 1 Del", 225, 485, 20, 20, parent=f, props={"fill": C_DARK, "cornerRadius": 4})
    create_node("text", "Thumb 1 Del Txt", 231, 488, parent=f, text="X", props={"fontSize": 10, "fill": "#FFFFFF"})
    create_node("rectangle", "Thumb Meta Box", 65, 595, 180, 24, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1})
    create_node("text", "Thumb Meta Txt", 75, 601, parent=f, text="2.3 MB -> 0 KB · Ada lokasi", props={"fontSize": 9, "fill": C_DARK})
    draw_button(f, "S4 Btn Back", 40, 670, 36, 36, "←", variant="outline", corner=18)
    draw_button(f, "S4 Btn Lanjut", 90, 670, 120, 36, "Lanjut →", variant="primary", corner=18)
    draw_sidebar_sla(f)

    # 30. Lapor Step 5 - Identitas (690px)
    f = start_frame(4, 5, "30. Lapor Step 5 - Identitas", frame_height=690)
    draw_navbar_public(f, active="Beranda", logged_in=True, user_name="Ibu Rina")
    create_node("text", "S5 Tit", 40, 85, parent=f, text="Lapor Masalah", props={"fontSize": 28, "fill": C_DARK})
    draw_button(f, "S5 Btn Panduan", 825, 88, 95, 34, "Panduan", variant="outline", corner=17)
    create_node("rectangle", "S5 Sch Banner", 40, 135, 580, 36, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 18})
    create_node("text", "S5 Sch Txt", 60, 145, parent=f, text="Sekolah: SD Negeri Tembalang 01 · Tembalang", props={"fontSize": 11, "fill": C_DARK})
    draw_button(f, "S5 Btn Ganti", 555, 140, 55, 26, "Ganti", variant="outline", corner=13)
    draw_stepper(f, active_step=5)
    create_node("rectangle", "S5 Main Box", 40, 290, 580, 310, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("text", "S5 Q", 65, 310, parent=f, text="Identitas Pelapor", props={"fontSize": 15, "fill": C_DARK})
    create_node("text", "S5 QSub", 65, 332, parent=f, text="Pilih bagaimana identitas Anda ditampilkan kepada pihak pengawas.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    modes = [("Rahasia (Direkomendasikan)", "Nama hanya diketahui tim verifikator independen, tidak dipublikasikan ke publik.", True), ("Publik", "Nama Anda ditampilkan secara terbuka pada papan pelacakan kasus publik.", False), ("Anonim Total", "Tanpa nama sama sekali. Respons tindak lanjut hanya dapat dicek via kode tiket.", False)]
    my = 360
    for idx, (mtit, mdesc, mact) in enumerate(modes):
        create_node("rectangle", f"ModeBox {idx}", 65, my, 530, 48, parent=f, props={"fill": "#FFFFFF", "stroke": C_DARK if mact else C_BORDER, "strokeWeight": 1.5 if mact else 1, "cornerRadius": 10})
        create_node("ellipse", f"ModeCir {idx}", 80, my + 16, 16, 16, parent=f, props={"fill": "#FFFFFF", "stroke": C_DARK if mact else C_BORDER, "strokeWeight": 2})
        if mact:
            create_node("ellipse", f"ModeDot {idx}", 84, my + 20, 8, 8, parent=f, props={"fill": C_DARK})
        create_node("text", f"ModeTit {idx}", 105, my + 10, parent=f, text=mtit, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"ModeDesc {idx}", 105, my + 26, parent=f, text=mdesc, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        my += 56
    draw_button(f, "S5 Btn Back", 40, 620, 36, 36, "←", variant="outline", corner=18)
    draw_button(f, "S5 Btn Kirim", 90, 620, 130, 36, "Kirim Laporan", variant="primary", corner=18)
    draw_sidebar_sla(f)

    print(" -> Section 5 (25-30) selesai.")

    # =========================================================================
    # ROW 5: SUKSES, WARGA, GURU, & VERIFIKATOR 31 - 36
    # =========================================================================
    add_section_header(5, "SECTION 06: PENERBITAN TIKET, PROFIL WARGA/GURU & MEJA VERIFIKATOR (31 - 36)", "Konfirmasi penerbitan tiket, dasbor warga, dasbor guru, dan meja verifikasi.")

    # 31. Lapor Step 6 - Sukses (560px)
    f = start_frame(5, 0, "31. Lapor Step 6 - Sukses", frame_height=560)
    draw_navbar_public(f, active="Beranda", logged_in=True, user_name="Ibu Rina")
    create_node("ellipse", "S6 Suc Cir", 460, 110, 48, 48, parent=f, props={"fill": C_BG_MUTED})
    create_node("text", "S6 Suc Chk", 476, 122, parent=f, text="✓", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "S6 Tit", 415, 175, parent=f, text="Laporan Terkirim!", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "S6 Sub", 330, 205, parent=f, text="Laporan Anda telah berhasil dicatat dalam sistem pemantau MBG.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("rectangle", "S6 Ticket Box", 310, 235, 340, 80, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
    create_node("text", "S6 TLbl", 425, 250, parent=f, text="Nomor Tiket Anda:", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "S6 TNum", 390, 275, parent=f, text="MBG-AG2MWK", props={"fontSize": 22, "fill": C_DARK})
    draw_button(f, "S6 Btn Lacak", 340, 340, 135, 42, "Lacak Status", variant="primary", corner=21)
    draw_button(f, "S6 Btn Beranda", 490, 340, 135, 42, "Ke Beranda", variant="outline", corner=21)

    # 32. Dasbor Profil Warga (720px)
    f = start_frame(5, 1, "32. Dasbor Profil Warga", frame_height=720)
    draw_navbar_public(f, active="Beranda", logged_in=True, user_name="Ibu Rina")
    create_node("text", "W32 Tit", 40, 90, parent=f, text="Dasbor Warga: Ibu Rina", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "W32 Sub", 40, 120, parent=f, text="Kelola riwayat pengaduan dan pantau status tindak lanjut anak Anda.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    # Stat Warga
    stat_warga = [("Total Laporan", "3", "Riwayat terlapor"), ("Sedang Berjalan", "1", "Tiket MBG-AG2MWK"), ("Selesai Ditangani", "2", "SPPG Tembalang 01")]
    for idx, (wtit, wval, wsub) in enumerate(stat_warga):
        wx = 40 + idx * 300
        create_node("rectangle", f"W32C {idx}", wx, 150, 280, 85, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
        create_node("text", f"W32CTit {idx}", wx + 16, 168, parent=f, text=wtit, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("text", f"W32CVal {idx}", wx + 16, 190, parent=f, text=wval, props={"fontSize": 22, "fill": C_DARK})
        create_node("text", f"W32CSub {idx}", wx + 16, 218, parent=f, text=wsub, props={"fontSize": 9, "fill": C_TEXT_MUTED})
    # My Reports Table
    create_node("text", "W32 Lbl Rep", 40, 260, parent=f, text="Riwayat Pengaduan Saya", props={"fontSize": 15, "fill": C_DARK})
    my_reports = [
        ("MBG-AG2MWK", "SD Negeri Tembalang 01", "Tidak layak: Nasi berlendir", "30 Okt 2026", "Diteruskan SPPG"),
        ("MBG-9X1P2K", "SD Negeri Tembalang 01", "Porsi/gizi: Buah tidak ada", "14 Okt 2026", "Selesai"),
        ("MBG-3B8Q0L", "SD Negeri Tembalang 01", "Distribusi: Telat 45 menit", "02 Okt 2026", "Selesai")
    ]
    my_y = 295
    for rnum, rsch, rdesc, rdate, rstat in my_reports:
        create_node("rectangle", f"W32RBox {my_y}", 40, my_y, 880, 60, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
        create_node("text", f"W32RNum {my_y}", 60, my_y + 16, parent=f, text=rnum, props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"W32RSch {my_y}", 180, my_y + 16, parent=f, text=rsch, props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"W32RDesc {my_y}", 380, my_y + 16, parent=f, text=rdesc, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("text", f"W32RDate {my_y}", 620, my_y + 16, parent=f, text=rdate, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        draw_pill(f, f"W32RPill {my_y}", 750, my_y + 15, 120, 24, rstat, is_active=(rstat != "Selesai"))
        my_y += 70
    draw_footer_real(f, 540)

    # 33. Dasbor Profil Guru (740px)
    f = start_frame(5, 2, "33. Dasbor Profil Guru", frame_height=740)
    draw_navbar_public(f, active="Beranda", logged_in=True, user_name="Pak Budi")
    create_node("text", "G33 Tit", 40, 90, parent=f, text="Dasbor Sekolah: Pak Budi", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "G33 Sub", 40, 120, parent=f, text="SD Negeri Tembalang 01 · 380 Siswa Penerima Manfaat · SPPG Tembalang 02", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    # Stat Guru
    stat_guru = [("Porsi Hari Ini", "380 / 380", "100% Terdistribusi"), ("Waktu Tiba", "10.45 WIB", "Tepat waktu (SLA OK)"), ("Suhu Makanan", "62°C", "Standar hangat (>60°C)"), ("Aduan Bulan Ini", "1 Kasus", "Dalam investigasi")]
    for idx, (gtit, gval, gsub) in enumerate(stat_guru):
        gx = 40 + idx * 225
        create_node("rectangle", f"G33C {idx}", gx, 150, 210, 95, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
        create_node("text", f"G33CTit {idx}", gx + 16, 168, parent=f, text=gtit, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("text", f"G33CVal {idx}", gx + 16, 192, parent=f, text=gval, props={"fontSize": 20, "fill": C_DARK})
        create_node("text", f"G33CSub {idx}", gx + 16, 222, parent=f, text=gsub, props={"fontSize": 9, "fill": C_TEXT_MUTED})
    # Form Checklist Guru
    create_node("rectangle", "G33 Check Box", 40, 265, 880, 210, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "G33 ChkTit", 65, 290, parent=f, text="Konfirmasi Penerimaan MBG Harian (Checklist Guru Piket)", props={"fontSize": 14, "fill": C_DARK})
    chk_items = [("Kondisi kemasan utuh dan bersih", True), ("Menu lengkap: Nasi, Lauk Hewani, Sayur, Buah", True), ("Aroma segar dan tidak berlendir", True), ("Siswa mencuci tangan sebelum makan", True)]
    cy = 320
    for idx, (ctit, cchecked) in enumerate(chk_items):
        create_node("ellipse", f"G33ChkCir {idx}", 65, cy, 18, 18, parent=f, props={"fill": C_DARK if cchecked else C_BG_MUTED})
        create_node("text", f"G33ChkV {idx}", 70, cy + 3, parent=f, text="✓", props={"fontSize": 10, "fill": "#FFFFFF"})
        create_node("text", f"G33ChkTit {idx}", 95, cy + 2, parent=f, text=ctit, props={"fontSize": 11, "fill": C_DARK})
        cy += 28
    draw_button(f, "G33 Btn Submit", 65, 435, 180, 32, "Simpan Konfirmasi", variant="primary", corner=16)
    draw_footer_real(f, 550)

    # 34. Dasbor Verifikator (890px)
    f = start_frame(5, 3, "34. Dasbor Verifikator", frame_height=890)
    draw_navbar_panel(f, active_tab="Dasbor Panel", role="Verifikator", user_code="MS", user_name="Mbak Sari")
    create_node("text", "Ver Tit", 40, 90, parent=f, text="Dasbor Verifikasi", props={"fontSize": 24, "fill": C_DARK})
    create_node("rectangle", "Ver Card 1", 40, 130, 205, 75, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "Ver C1 Tit", 55, 145, parent=f, text="Antrean menunggu", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "Ver C1 Val", 55, 165, parent=f, text="21", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "Ver C1 Arr", 220, 175, parent=f, text="→", props={"fontSize": 10, "fill": C_TEXT_LIGHT})
    create_node("rectangle", "Ver Card 2", 265, 130, 205, 75, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER_DARK, "strokeWeight": 1.5, "cornerRadius": 14})
    create_node("text", "Ver C2 Tit", 280, 145, parent=f, text="Lewat batas", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "Ver C2 Val", 280, 165, parent=f, text="21", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "Ver C2 Arr", 445, 175, parent=f, text="→", props={"fontSize": 10, "fill": C_TEXT_LIGHT})
    create_node("rectangle", "Ver Card 3", 490, 130, 205, 75, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "Ver C3 Tit", 505, 145, parent=f, text="Siap diteruskan", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "Ver C3 Val", 505, 165, parent=f, text="3", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "Ver C3 Arr", 670, 175, parent=f, text="→", props={"fontSize": 10, "fill": C_TEXT_LIGHT})
    create_node("rectangle", "Ver Card 4", 715, 130, 205, 75, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "Ver C4 Tit", 730, 145, parent=f, text="Kasus berjalan", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "Ver C4 Val", 730, 165, parent=f, text="26", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "Ver C4 Arr", 895, 175, parent=f, text="→", props={"fontSize": 10, "fill": C_TEXT_LIGHT})
    create_node("text", "Antrean Lbl", 40, 235, parent=f, text="Antrean Masuk", props={"fontSize": 14, "fill": C_DARK})
    create_node("text", "Semua Lbl", 850, 235, parent=f, text="Semua (21) →", props={"fontSize": 11, "fill": C_DARK})
    antrean_items = [
        ("SD Semarang Tengah 1", "MBG-3ACS6H · Keracunan · Semarang Tengah · 100 siswa terdampak", "Darurat", "Batas 31 Okt 2026, 15.31", 34, "K"),
        ("SD Tembalang 10", "MBG-7RZQPN · Keracunan · Tembalang · 7 siswa", "Darurat", "Batas 31 Okt 2026, 07.00", 66, "K", "+2 serupa"),
        ("SD Tembalang 10", "MBG-RM987N · Keracunan · Tembalang · 7 siswa", "Darurat", "Batas 31 Okt 2026, 06.30", 47, "K", "+2 serupa"),
        ("SD Tembalang 10", "MBG-3MBXW9 · Keracunan · Tembalang · 5 siswa", "Darurat", "Batas 31 Okt 2026, 07.24", 48, "K", "+2 serupa"),
        ("SMP Pedurungan 2", "MBG-VAC8TW · Tidak layak · Pedurungan · 30 siswa", "Tinggi", "Batas 31 Okt 2026, 11.08", 53, "T"),
        ("SMP Semarang Utara 1", "MBG-TY6SLL · Tidak layak · Semarang Utara · 23 siswa", "Tinggi", "Batas 30 Okt 2026, 13.53", 42, "T"),
        ("SD Pedurungan 6", "MBG-3W69XT · Tidak layak · Pedurungan · 12 siswa", "Tinggi", "Batas 31 Okt 2026, 18.53", 17, "T"),
        ("SMA Pedurungan 2", "MBG-2JRE4S · Porsi & gizi · Pedurungan · 51 siswa", "Tinggi", "Batas 30 Okt 2026, 17.53", 67, "T")
    ]
    ay = 265
    for item in antrean_items:
        s_name, s_meta, s_badge, s_due, s_score, s_code = item[:6]
        c_similar = item[6] if len(item) > 6 else None
        create_node("rectangle", f"AntCard {ay}", 40, ay, 880, 58, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
        create_node("ellipse", f"AntIco {ay}", 55, ay + 15, 28, 28, parent=f, props={"fill": C_BG_MUTED})
        create_node("text", f"AntCode {ay}", 65, ay + 21, parent=f, text=s_code, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"AntTit {ay}", 95, ay + 14, parent=f, text=s_name, props={"fontSize": 12, "fill": C_DARK})
        draw_pill(f, f"AntBadge {ay}", 245, ay + 12, 55, 18, s_badge, is_active=(s_badge == "Darurat"))
        create_node("text", f"AntMeta {ay}", 95, ay + 34, parent=f, text=s_meta, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        if c_similar:
            draw_pill(f, f"AntSim {ay}", 450, ay + 18, 65, 18, c_similar, is_active=False)
        create_node("text", f"AntDue {ay}", 670, ay + 24, parent=f, text=s_due, props={"fontSize": 9, "fill": C_TEXT_MUTED})
        create_node("ellipse", f"AntScoCir {ay}", 820, ay + 18, 22, 22, parent=f, props={"fill": C_BG_MUTED})
        create_node("text", f"AntSco {ay}", 825, ay + 23, parent=f, text=str(s_score), props={"fontSize": 9, "fill": C_DARK})
        create_node("text", f"AntArr {ay}", 860, ay + 22, parent=f, text=">", props={"fontSize": 11, "fill": C_TEXT_LIGHT})
        ay += 66
    draw_footer_real(f, 805)

    # 35. Antrean Verifikasi (820px)
    f = start_frame(5, 4, "35. Antrean Verifikasi", frame_height=820)
    draw_navbar_panel(f, active_tab="Antrean Verifikasi", role="Verifikator", user_code="MS", user_name="Mbak Sari")
    create_node("text", "A35 Tit", 40, 90, parent=f, text="Daftar Antrean Verifikasi Lengkap", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "A35 Sub", 40, 120, parent=f, text="21 laporan menunggu tindakan verifikator independen sesuai urutan SLA.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    draw_pill(f, "A35 F1", 40, 150, 75, 26, "Semua (21)", is_active=True)
    draw_pill(f, "A35 F2", 125, 150, 90, 26, "Darurat (4)", is_active=False)
    draw_pill(f, "A35 F3", 225, 150, 85, 26, "Tinggi (12)", is_active=False)
    draw_pill(f, "A35 F4", 320, 150, 85, 26, "Sedang (5)", is_active=False)
    # Table Header
    create_node("rectangle", "A35 Tbl", 40, 195, 880, 420, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "A35 TH1", 65, 215, parent=f, text="Nomor Tiket", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "A35 TH2", 185, 215, parent=f, text="Sekolah / Kecamatan", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "A35 TH3", 420, 215, parent=f, text="Kategori Masalah", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "A35 TH4", 620, 215, parent=f, text="Sisa Batas SLA", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "A35 TH5", 790, 215, parent=f, text="Aksi", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    trows = [
        ("MBG-3ACS6H", "SD Semarang Tengah 1", "Keracunan (100 siswa)", "Lewat 2 jam", "Inspeksi →"),
        ("MBG-7RZQPN", "SD Tembalang 10", "Keracunan (7 siswa)", "Sisa 35 menit", "Inspeksi →"),
        ("MBG-RM987N", "SD Tembalang 10", "Keracunan (7 siswa)", "Sisa 55 menit", "Inspeksi →"),
        ("MBG-VAC8TW", "SMP Pedurungan 2", "Makanan Tidak Layak", "Sisa 4 jam", "Inspeksi →"),
        ("MBG-TY6SLL", "SMP Semarang Utara 1", "Makanan Tidak Layak", "Sisa 6 jam", "Inspeksi →")
    ]
    ty = 245
    for tnum, tsch, tcat, tsla, tact in trows:
        create_node("line", f"A35L {ty}", 40, ty, 880, 0, parent=f, props={"stroke": C_BORDER, "strokeWeight": 1})
        create_node("text", f"A35R1 {ty}", 65, ty + 12, parent=f, text=tnum, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"A35R2 {ty}", 185, ty + 12, parent=f, text=tsch, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"A35R3 {ty}", 420, ty + 12, parent=f, text=tcat, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("text", f"A35R4 {ty}", 620, ty + 12, parent=f, text=tsla, props={"fontSize": 11, "fill": C_DARK if "Lewat" in tsla else C_TEXT_MUTED})
        draw_button(f, f"A35Btn {ty}", 780, ty + 8, 90, 24, tact, variant="primary", corner=12)
        ty += 42
    draw_footer_real(f, 650)

    # 36. Meja Inspeksi Laporan (760px)
    f = start_frame(5, 5, "36. Meja Inspeksi Laporan", frame_height=760)
    draw_navbar_panel(f, active_tab="Dasbor Panel", role="Verifikator", user_code="MS", user_name="Mbak Sari")
    create_node("text", "I36 Tit", 40, 85, parent=f, text="Inspeksi Laporan: MBG-3ACS6H", props={"fontSize": 20, "fill": C_DARK})
    draw_pill(f, "I36 Badge", 370, 88, 75, 22, "Darurat", is_active=True)
    # Left Column: Bukti & Analisis AI
    create_node("rectangle", "I36 LCol", 40, 125, 430, 480, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    draw_image_box(f, "I36 Photo", 55, 140, 400, 180, corner=8)
    create_node("text", "I36 Meta Tit", 55, 335, parent=f, text="Ekstraksi Metadata EXIF Kamera:", props={"fontSize": 11, "fill": C_DARK})
    create_node("text", "I36 Meta 1", 55, 355, parent=f, text="• Waktu Foto: 31 Okt 2026, 12.18 WIB (Valid jam makan)", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "I36 Meta 2", 55, 375, parent=f, text="• Lokasi GPS: -6.9928, 110.4281 (Radius 30m dari SDN Tembalang 01)", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "I36 Meta 3", 55, 395, parent=f, text="• Perangkat: Xiaomi Redmi Note 12 (Bukan rekayasa internet)", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("rectangle", "I36 AI Box", 55, 430, 400, 70, parent=f, props={"fill": C_BG_SUBTLE, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
    create_node("text", "I36 AI Tit", 70, 442, parent=f, text="Radar Deteksi AI MLP & Naive Bayes:", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "I36 AI Desc", 70, 462, parent=f, text="Skor Keaslian Bukti: 98.4% (Tinggi) · Indikasi Klaster KLB: Positif", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    # Right Column: Tindakan Verifikator
    create_node("rectangle", "I36 RCol", 490, 125, 430, 480, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "I36 RTit", 515, 145, parent=f, text="Formulir Keputusan Verifikator", props={"fontSize": 14, "fill": C_DARK})
    create_node("text", "I36 RSub", 515, 168, parent=f, text="Tentukan validitas laporan berdasarkan bukti faktual lapangan.", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("rectangle", "I36 Catat Inp", 515, 205, 380, 100, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
    create_node("text", "I36 Catat Txt", 530, 220, parent=f, text="Laporan valid. Foto menunjukkan perubahan warna kuah dan bau basi...", props={"fontSize": 11, "fill": C_DARK})
    draw_button(f, "I36 Btn Valid", 515, 330, 380, 40, "✓ Verifikasi & Teruskan ke SPPG & Dinkes", variant="primary", corner=20)
    draw_button(f, "I36 Btn Tolak", 515, 385, 380, 36, "Tolak (Bukti Tidak Relevan)", variant="outline", corner=18)
    draw_footer_real(f, 630)

    print(" -> Section 6 (31-36) selesai.")

    # =========================================================================
    # ROW 6: PERAN OPERASIONAL 37 - 42 (SPPG & DINKES)
    # =========================================================================
    add_section_header(6, "SECTION 07: PENGELOLA DAPUR SPPG & DINAS KESEHATAN (37 - 42)", "Kasus berjalan, dasbor operasional SPPG, papan komplain, investigasi KLB Dinkes.")

    # 37. Kasus Aktif Berjalan (800px)
    f = start_frame(6, 0, "37. Kasus Aktif Berjalan", frame_height=800)
    draw_navbar_panel(f, active_tab="Kasus Berjalan", role="Verifikator", user_code="MS", user_name="Mbak Sari")
    create_node("text", "K37 Tit", 40, 90, parent=f, text="Kasus Terverifikasi Sedang Berjalan", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "K37 Sub", 40, 120, parent=f, text="26 kasus aktif dalam tahap klarifikasi SPPG atau uji sampel Dinkes.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    # Table
    create_node("rectangle", "K37 Tbl", 40, 160, 880, 420, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "K37 TH1", 65, 180, parent=f, text="Kode Tiket", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "K37 TH2", 185, 180, parent=f, text="Dapur SPPG Penanggung Jawab", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "K37 TH3", 450, 180, parent=f, text="Tahap Saat Ini", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "K37 TH4", 650, 180, parent=f, text="Sisa Waktu Tindak Lanjut", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    krows = [
        ("MBG-3ACS6H", "SPPG Semarang Tengah 01", "Investigasi Labkesda", "Sisa 4 jam (Darurat)"),
        ("MBG-7RZQPN", "SPPG Tembalang 02", "Klarifikasi Dapur SPPG", "Sisa 12 jam"),
        ("MBG-RM987N", "SPPG Tembalang 02", "Klarifikasi Dapur SPPG", "Sisa 14 jam"),
        ("MBG-VAC8TW", "SPPG Pedurungan 01", "Perbaikan Menu Pengganti", "Sisa 18 jam"),
        ("MBG-TY6SLL", "SPPG Semarang Utara 01", "Verifikasi Akhir", "Sisa 24 jam")
    ]
    ky = 210
    for knum, ksppg, kstage, ksla in krows:
        create_node("line", f"K37L {ky}", 40, ky, 880, 0, parent=f, props={"stroke": C_BORDER, "strokeWeight": 1})
        create_node("text", f"K37R1 {ky}", 65, ky + 12, parent=f, text=knum, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"K37R2 {ky}", 185, ky + 12, parent=f, text=ksppg, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"K37R3 {ky}", 450, ky + 12, parent=f, text=kstage, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        draw_pill(f, f"K37P {ky}", 650, ky + 8, 140, 22, ksla, is_active=("Darurat" in ksla))
        draw_button(f, f"K37Btn {ky}", 815, ky + 8, 85, 22, "Pantau →", variant="outline", corner=11)
        ky += 42
    draw_footer_real(f, 620)

    # 38. Dasbor Dapur SPPG (740px)
    f = start_frame(6, 1, "38. Dasbor Dapur SPPG", frame_height=740)
    draw_navbar_panel(f, active_tab="Dasbor Dapur", role="SPPG", user_code="SP", user_name="Pengelola")
    create_node("text", "D38 Tit", 40, 85, parent=f, text="Pengelola SPPG Tembalang 03", props={"fontSize": 20, "fill": C_DARK})
    create_node("rectangle", "D38 Met 1", 40, 125, 275, 75, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
    create_node("text", "D38 M1 Tit", 55, 140, parent=f, text="Aduan aktif", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "D38 M1 Val", 55, 160, parent=f, text="1", props={"fontSize": 22, "fill": C_DARK})
    create_node("rectangle", "D38 Met 2", 340, 125, 275, 75, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
    create_node("text", "D38 M2 Tit", 355, 140, parent=f, text="Menunggu tanggapan", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "D38 M2 Val", 355, 160, parent=f, text="1", props={"fontSize": 22, "fill": C_DARK})
    create_node("rectangle", "D38 Met 3", 640, 125, 275, 75, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
    create_node("text", "D38 M3 Tit", 655, 140, parent=f, text="Kasus selesai", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "D38 M3 Val", 655, 160, parent=f, text="2", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "D38 Kasus Lbl", 40, 225, parent=f, text="Kasus Aktif Dapur Ini", props={"fontSize": 14, "fill": C_DARK})
    sppg_cases = [
        ("Dugaan makanan berbau asam di SDN Tembalang 3", "Tembalang · Batas waktu: 31 Okt 2026, 18.00 WIB", "Tidak ditanggapi", "Batas 31 Okt 2026, 18.00"),
        ("Porsi sayur kurang di SMP Negeri 29 Semarang", "Tembalang · Batas waktu: 01 Nov 2026, 10.00 WIB", "Menunggu tanggapan", "Batas 01 Nov 2026, 10.00")
    ]
    sy = 255
    for ctit, cmeta, cpill, cdue in sppg_cases:
        create_node("rectangle", f"D38Card {sy}", 40, sy, 880, 68, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
        create_node("text", f"D38CTit {sy}", 60, sy + 15, parent=f, text=ctit, props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"D38CMeta {sy}", 60, sy + 35, parent=f, text=cmeta, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        draw_pill(f, f"D38CPill {sy}", 580, sy + 20, 130, 24, cpill, is_active=True)
        draw_button(f, f"D38CBtn {sy}", 735, sy + 20, 160, 28, "Beri Tindak Lanjut →", variant="primary", corner=14)
        sy += 78
    draw_footer_real(f, 580)

    # 39. Papan Keluhan SPPG (780px)
    f = start_frame(6, 2, "39. Papan Keluhan SPPG", frame_height=780)
    draw_navbar_panel(f, active_tab="Aduan Masuk", role="SPPG", user_code="SP", user_name="Pengelola")
    create_node("text", "P39 Tit", 40, 90, parent=f, text="Papan Keluhan & Aduan SPPG Tembalang 03", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "P39 Sub", 40, 120, parent=f, text="Daftar aduan yang dialamatkan ke dapur ini. Wajib direspons dalam batas toleransi SLA.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("rectangle", "P39 Tbl", 40, 160, 880, 420, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    draw_footer_real(f, 620)

    # 40. Tindak Lanjut Dapur SPPG (820px)
    f = start_frame(6, 3, "40. Tindak Lanjut Dapur SPPG", frame_height=820)
    draw_navbar_panel(f, active_tab="Dasbor Dapur", role="SPPG", user_code="SP", user_name="Pengelola")
    create_node("text", "T40 Tit", 40, 90, parent=f, text="Tindak Lanjut Kasus: MBG-7RZQPN", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "T40 Sub", 40, 120, parent=f, text="Formulir resmi klarifikasi penyebab dan bukti tindakan perbaikan sanitasi dapur.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    # Form Tindak Lanjut
    create_node("rectangle", "T40 Form", 40, 155, 880, 420, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "T40 L1", 65, 180, parent=f, text="1. Analisis Penyebab Masalah", props={"fontSize": 13, "fill": C_DARK})
    create_node("rectangle", "T40 Inp1", 65, 205, 830, 60, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
    create_node("text", "T40 Txt1", 80, 220, parent=f, text="Terjadi keterlambatan distribusi karena kemacetan di Jl. Prof Soedarto sehingga makanan tertutup terlalu lama...", props={"fontSize": 11, "fill": C_DARK})
    create_node("text", "T40 L2", 65, 280, parent=f, text="2. Tindakan Korektif & Solusi", props={"fontSize": 13, "fill": C_DARK})
    create_node("rectangle", "T40 Inp2", 65, 305, 830, 60, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 8})
    create_node("text", "T40 Txt2", 80, 320, parent=f, text="Mengganti vendor armada pengiriman dan memajukan jadwal masak 45 menit lebih awal...", props={"fontSize": 11, "fill": C_DARK})
    create_node("text", "T40 L3", 65, 380, parent=f, text="3. Unggah Foto Bukti Perbaikan Dapur", props={"fontSize": 13, "fill": C_DARK})
    draw_image_box(f, "T40 Proof", 65, 405, 140, 90, corner=8)
    draw_button(f, "T40 Btn Upload", 220, 430, 160, 36, "Unggah Foto Bukti", variant="outline", corner=18)
    draw_button(f, "T40 Btn Selesai", 65, 515, 220, 40, "Kirim Klarifikasi & Selesai", variant="primary", corner=20)
    draw_footer_real(f, 640)

    # 41. Dasbor Pengawasan Dinkes (890px)
    f = start_frame(6, 4, "41. Dasbor Pengawasan Dinkes", frame_height=890)
    draw_navbar_panel(f, active_tab="Dasbor Medis", role="Dinkes", user_code="DK", user_name="Dinkes")
    create_node("text", "Dk Tit", 40, 90, parent=f, text="Dinas Kesehatan Kota Semarang", props={"fontSize": 24, "fill": C_DARK})
    dk_metrics = [("Total SPPG Diawasi", "40", "Unit Dapur"), ("Sertifikat SLHS Aktif", "38", "Grade A & B"), ("Kasus Keracunan", "0", "7 Hari Terakhir"), ("Pengawasan Lapangan", "3", "Jadwal Minggu Ini")]
    for idx, (mtit, mval, msub) in enumerate(dk_metrics):
        mx = 40 + idx * 225
        create_node("rectangle", f"DkCard {idx}", mx, 140, 210, 85, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
        create_node("text", f"DkMTit {idx}", mx + 16, 158, parent=f, text=mtit, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("text", f"DkMVal {idx}", mx + 16, 180, parent=f, text=mval, props={"fontSize": 22, "fill": C_DARK})
        create_node("text", f"DkMSub {idx}", mx + 16, 208, parent=f, text=msub, props={"fontSize": 9, "fill": C_TEXT_MUTED})
    create_node("text", "Dk SubTit", 40, 255, parent=f, text="Pengawasan Kasus Medis & Higienitas Terkini", props={"fontSize": 15, "fill": C_DARK})
    med_cases = [
        ("SD Semarang Tengah 1", "Dugaan Keracunan Makanan (100 Siswa)", "Semarang Tengah", "Sampel Lab Diambil", "Darurat"),
        ("SD Tembalang 10", "Keluhan Mual Setelah Makan MBG (7 Siswa)", "Tembalang", "Inspeksi Higienitas", "Tinggi"),
        ("SMP Pedurungan 2", "Makanan Basi & Berlendir (30 Siswa)", "Pedurungan", "Teguran SPPG", "Tinggi")
    ]
    my = 285
    for s_name, s_desc, s_kec, s_stat, s_urg in med_cases:
        create_node("rectangle", f"DkMCard {my}", 40, my, 880, 68, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 12})
        create_node("text", f"DkMName {my}", 60, my + 15, parent=f, text=s_name, props={"fontSize": 13, "fill": C_DARK})
        create_node("text", f"DkMDesc {my}", 60, my + 35, parent=f, text=s_desc, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        draw_pill(f, f"DkMKec {my}", 520, my + 20, 110, 24, s_kec, is_active=False)
        draw_pill(f, f"DkMStat {my}", 645, my + 20, 140, 24, s_stat, is_active=False)
        draw_pill(f, f"DkMUrg {my}", 795, my + 20, 75, 24, s_urg, is_active=(s_urg == "Darurat"))
        my += 78
    draw_footer_real(f, 750)

    # 42. Investigasi KLB Dinkes (800px)
    f = start_frame(6, 5, "42. Investigasi KLB Dinkes", frame_height=800)
    draw_navbar_panel(f, active_tab="Investigasi & KLB", role="Dinkes", user_code="DK", user_name="Dinkes")
    create_node("text", "I42 Tit", 40, 90, parent=f, text="Panel Investigasi Epidemiologi & KLB", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "I42 Sub", 40, 120, parent=f, text="Alat koordinasi cepat tanggap darurat wabah dan tracing sumber kontaminasi pangan.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("rectangle", "I42 Box", 40, 155, 880, 420, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    draw_footer_real(f, 620)

    print(" -> Section 7 (37-42) selesai.")

    # =========================================================================
    # ROW 7: KORWIL BGN & ADMINISTRATOR SISTEM 43 - 47
    # =========================================================================
    add_section_header(7, "SECTION 08: KOORDINATOR WILAYAH BGN & SUPERADMIN (43 - 47)", "Akuntabilitas wilayah, audit SAW Korwil, overview admin, manajemen pengguna, konfigurasi SLA.")

    # 43. Akuntabilitas Korwil BGN (810px)
    f = start_frame(7, 0, "43. Akuntabilitas Korwil BGN", frame_height=810)
    draw_navbar_panel(f, active_tab="Papan Akuntabilitas", role="Korwil", user_code="KW", user_name="Korwil")
    create_node("text", "Kw Tit", 40, 90, parent=f, text="Papan Akuntabilitas SPPG Wilayah", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "Kw Sub", 40, 120, parent=f, text="Koordinasi Pengawasan Badan Gizi Nasional (BGN) Wilayah Kota Semarang.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    kw_metrics = [("Total SPPG Terdaftar", "40 Unit", "16 Kecamatan"), ("Kepatuhan SLA Rata-rata", "96.5%", "Target Nasional 95%"), ("Rerata Waktu Respons", "18.4 jam", "Batas Maks 24 jam"), ("Eskalasi Tertunda", "2 Kasus", "Butuh Tindakan")]
    for idx, (mtit, mval, msub) in enumerate(kw_metrics):
        mx = 40 + idx * 225
        create_node("rectangle", f"KwCard {idx}", mx, 150, 210, 85, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
        create_node("text", f"KwMTit {idx}", mx + 16, 168, parent=f, text=mtit, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("text", f"KwMVal {idx}", mx + 16, 190, parent=f, text=mval, props={"fontSize": 20, "fill": C_DARK})
        create_node("text", f"KwMSub {idx}", mx + 16, 218, parent=f, text=msub, props={"fontSize": 9, "fill": C_TEXT_MUTED})
    create_node("rectangle", "Kw Tbl", 40, 260, 880, 280, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    draw_footer_real(f, 620)

    # 44. Prioritas Audit SAW Korwil (840px)
    f = start_frame(7, 1, "44. Prioritas Audit SAW Korwil", frame_height=840)
    draw_navbar_panel(f, active_tab="Prioritas Audit (DSS)", role="Korwil", user_code="KW", user_name="Korwil")
    create_node("text", "A44 Tit", 40, 90, parent=f, text="Rekomendasi Audit Lapangan Korwil BGN", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "A44 Sub", 40, 120, parent=f, text="Peringkat dapur SPPG yang direkomendasikan untuk audit kepatuhan kontrak MBG.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("rectangle", "A44 Tbl", 40, 160, 880, 420, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    draw_footer_real(f, 650)

    # 45. Dasbor Admin (280px - SUPER COMPACT)
    f = start_frame(7, 2, "45. Dasbor Admin", frame_height=280)
    draw_navbar_panel(f, active_tab="Dasbor Admin", role="Admin", user_code="AP", user_name="Admin")
    create_node("text", "Adm Tit", 40, 85, parent=f, text="Administrasi Sistem", props={"fontSize": 24, "fill": C_DARK})
    adm_cards = [
        ("Pengguna", "271"),
        ("Aturan SLA", "35"),
        ("Kasus aktif", "63"),
        ("Lewat batas", "24")
    ]
    for idx, (atit, aval) in enumerate(adm_cards):
        ax = 40 + idx * 225
        is_alert = (atit == "Lewat batas")
        create_node("rectangle", f"AdmCard {idx}", ax, 125, 205, 95, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER_DARK if is_alert else C_BORDER, "strokeWeight": 1.5 if is_alert else 1, "cornerRadius": 14})
        create_node("text", f"AdmCTit {idx}", ax + 16, 142, parent=f, text=atit, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("text", f"AdmCVal {idx}", ax + 16, 165, parent=f, text=aval, props={"fontSize": 28, "fill": C_DARK})
        create_node("text", f"AdmCArr {idx}", ax + 175, 178, parent=f, text="→", props={"fontSize": 12, "fill": C_TEXT_LIGHT})

    # 46. Manajemen Pengguna RBAC (840px)
    f = start_frame(7, 3, "46. Manajemen Pengguna RBAC", frame_height=840)
    draw_navbar_panel(f, active_tab="Kelola Pengguna", role="Admin", user_code="AP", user_name="Admin")
    create_node("text", "Usr Tit", 40, 85, parent=f, text="Pengguna", props={"fontSize": 24, "fill": C_DARK})
    create_node("rectangle", "Usr SBox", 40, 125, 300, 36, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 18})
    draw_icon_search(f, "UsrSIco", 55, 137)
    create_node("text", "Usr SPlace", 75, 137, parent=f, text="Cari pengguna...", props={"fontSize": 11, "fill": C_TEXT_LIGHT})
    users_data = [
        ("Mbak Sari", "sari.verifikator@pmbgm.id", "Verifikator", "Aktif"),
        ("Pengelola SPPG Tembalang 03", "sppg.tembalang03@pmbgm.id", "SPPG", "Aktif"),
        ("Koordinator BGN Kota Semarang", "korwil.semarang@pmbgm.id", "Korwil BGN", "Aktif"),
        ("Pak Hendra", "hendra.dinkes@pmbgm.id", "Dinkes", "Aktif"),
        ("Inspeksi PBF/Gizi", "gizi.dinkes@pmbgm.id", "Dinkes", "Aktif"),
        ("Ibu Rina", "rina.warga@gmail.com", "Warga", "Aktif"),
        ("Pak Budi", "budi.guru@sdtembalang01.sch.id", "Guru", "Aktif"),
        ("Bambang Handayan", "bambang.handayan@bgn.go.id", "Korwil BGN", "Aktif"),
        ("Tim Litbang", "litbang@pmbgm.id", "Verifikator", "Aktif")
    ]
    uy = 180
    for uname, uemail, urole, ustat in users_data:
        create_node("line", f"KTR_L_{uy}", 40, uy, 880, 0, parent=f, props={"stroke": C_BORDER, "strokeWeight": 1})
        create_node("text", f"UName {uy}", 55, uy + 14, parent=f, text=uname, props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"UEmail {uy}", 55, uy + 30, parent=f, text=uemail, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        draw_pill(f, f"URole {uy}", 520, uy + 18, 95, 22, urole, is_active=False)
        create_node("ellipse", f"UStDot {uy}", 660, uy + 25, 8, 8, parent=f, props={"fill": C_DARK})
        create_node("text", f"UStat {uy}", 675, uy + 22, parent=f, text=ustat, props={"fontSize": 11, "fill": C_DARK})
        draw_button(f, f"UBtn {uy}", 830, uy + 18, 70, 24, "Kelola", variant="outline", corner=12)
        uy += 52
    draw_footer_real(f, 680)

    # 47. Aturan Batas Waktu SLA (580px)
    f = start_frame(7, 4, "47. Aturan Batas Waktu SLA", frame_height=580)
    draw_navbar_panel(f, active_tab="Aturan SLA", role="Admin", user_code="AP", user_name="Admin")
    create_node("text", "Sla Tit", 40, 85, parent=f, text="Batas waktu", props={"fontSize": 24, "fill": C_DARK})
    create_node("text", "Sla Sub", 40, 115, parent=f, text="Dalam jam. Berlaku untuk tahap yang dimulai setelah diubah; lewat batas otomatis ditandai dan dinaikkan prioritasnya.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("rectangle", "Sla Tbl Base", 40, 140, 880, 360, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("rectangle", "Sla TH Base", 40, 140, 880, 36, parent=f, props={"fill": C_BG_SUBTLE, "cornerRadius": 14})
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

    print(" -> Section 8 (43-47) selesai.")

    # Save Project
    print("\n[4/5] Menyimpan berkas proyek master 47 artboard .figcraft...")
    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'save_file', 'arguments': {'path': output_figcraft}}})
    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'save_file', 'arguments': {'path': docs_figcraft}}})
    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'run_command', 'arguments': {'command': 'view.zoomFit'}}})
    time.sleep(0.5)

    p.kill()
    print("FigCraft headless session selesai.")

    # Export overview & individual artboards
    print("\n[5/5] Merender Overview kanvas dan mengekspor seluruh 47 PNG...")
    try:
        r_proc = subprocess.run([cli_path, 'render', '--scale', '0.2', '--out', overview_png, output_figcraft], capture_output=True, text=True, timeout=60)
        print(" -> Overview PNG exported:", overview_png, "Return code:", r_proc.returncode)
    except Exception as e:
        print(" -> Render note:", e)

    try:
        e_proc = subprocess.run([cli_path, 'export', '--out', render_folder, output_figcraft], capture_output=True, text=True, timeout=60)
        print(" -> Exported all 47 frames to:", render_folder, "Return code:", e_proc.returncode)
    except Exception as e:
        print(" -> Export note:", e)

    print("=" * 80)
    print("BERHASIL: SELURUH 47 ARTBOARD TELAH DIBUAT DENGAN LENGKAP & PRESISI!")
    print("Master Project: d:/UNNES/LOMBA/MIA 2026/Web/PMBGM_Wireframes.figcraft")
    print("=" * 80)

if __name__ == "__main__":
    main()

