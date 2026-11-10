"""
PMBGM WIREFRAME ENGINE - DESIGN HELPERS & MCP WRAPPER
Monochrome textbook wireframe system matching authentic PMBGM screenshots.
"""

import json
import subprocess

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

FRAME_W = 960
COL_GAP = 80
ROW_Y = [100, 1080, 2060, 3040, 4020, 5000, 5980, 6960]

class FigCraftEngine:
    def __init__(self, cli_path):
        self.cli_path = cli_path
        self.proc = None
        self.msg_id = 1
        self.frames = {}

    def start(self):
        self.proc = subprocess.Popen(
            [self.cli_path, "mcp"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding="utf-8",
            errors="replace"
        )
        self.send({'jsonrpc': '2.0', 'method': 'initialize', 'params': {'protocolVersion': '2024-11-05', 'capabilities': {}, 'clientInfo': {'name': 'pmbgm_47_modular', 'version': '7.0'}}})
        self.proc.stdin.write(json.dumps({'jsonrpc': '2.0', 'method': 'notifications/initialized', 'params': {}}) + '\n')
        self.proc.stdin.flush()

    def read_json(self):
        while True:
            line = self.proc.stdout.readline()
            if not line: return None
            line = line.strip()
            if line.startswith('{'):
                try: return json.loads(line)
                except Exception: pass

    def send(self, msg):
        msg['id'] = self.msg_id
        self.msg_id += 1
        self.proc.stdin.write(json.dumps(msg) + '\n')
        self.proc.stdin.flush()
        return self.read_json()

    def stop(self):
        if self.proc:
            self.proc.kill()
            self.proc = None

    def create_node(self, node_type, name, x=0, y=0, width=None, height=None, parent=None, props=None, text=None, path=None):
        args = {'type': node_type, 'name': name, 'x': float(x), 'y': float(y), 'select': False}
        if width is not None: args['width'] = float(width)
        elif node_type != 'text': args['width'] = 100.0
        if height is not None: args['height'] = float(height)
        elif node_type != 'text': args['height'] = 100.0
        if parent is not None: args['parent'] = parent
        if text is not None: args['text'] = text
        if props is not None: args['props'] = props
        if path is not None: args['path'] = path
        res = self.send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'create_node', 'arguments': args}})
        try:
            txt = res['result']['content'][0]['text']
            data = json.loads(txt)
            return data.get('id') or (data.get('node', {}).get('id'))
        except Exception:
            return None

    def start_frame(self, row, col, title, frame_height=800):
        fx = 80 + col * (FRAME_W + COL_GAP)
        fy = ROW_Y[row]
        fid = self.create_node("frame", title, fx, fy, FRAME_W, frame_height, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1})
        self.create_node("text", f"LBL_{title}", fx, fy - 28, parent=None, text=title.upper(), props={"fontSize": 12, "fill": C_TEXT_MUTED})
        self.frames[title] = fid
        return fid

    def draw_button(self, fid, name, x, y, w, h, text, variant="primary", corner=8):
        if variant == "primary":
            self.create_node("rectangle", f"{name} Box", x, y, w, h, parent=fid, props={"fill": C_DARK, "cornerRadius": corner})
            self.create_node("text", f"{name} Txt", x + max(8, (w - len(text) * 6.8) / 2), y + (h - 13) / 2, parent=fid, text=text, props={"fill": "#FFFFFF", "fontSize": 12})
        elif variant == "subtle":
            self.create_node("rectangle", f"{name} Box", x, y, w, h, parent=fid, props={"fill": C_BG_MUTED, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": corner})
            self.create_node("text", f"{name} Txt", x + max(8, (w - len(text) * 6.5) / 2), y + (h - 13) / 2, parent=fid, text=text, props={"fill": C_DARK, "fontSize": 12})
        else: # outline
            self.create_node("rectangle", f"{name} Box", x, y, w, h, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": corner})
            self.create_node("text", f"{name} Txt", x + max(8, (w - len(text) * 6.5) / 2), y + (h - 13) / 2, parent=fid, text=text, props={"fill": C_DARK, "fontSize": 12})

    def draw_pill(self, fid, name, x, y, w, h, text, is_active=False):
        bg = C_DARK if is_active else "#FFFFFF"
        tc = "#FFFFFF" if is_active else C_DARK
        stroke = C_DARK if is_active else C_BORDER
        self.create_node("rectangle", f"{name} Bg", x, y, w, h, parent=fid, props={"fill": bg, "stroke": stroke, "strokeWeight": 1, "cornerRadius": h / 2})
        self.create_node("text", f"{name} Txt", x + max(6, (w - len(text) * 6.2) / 2), y + (h - 11) / 2, parent=fid, text=text, props={"fontSize": 11, "fill": tc})

    def draw_image_box(self, fid, name, x, y, w, h, corner=4):
        self.create_node("rectangle", f"{name} Bg", x, y, w, h, parent=fid, props={"fill": C_BG_MUTED, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": corner})
        self.create_node("vector", f"{name} X", x, y, w, h, parent=fid, path=f"M0 0 L{w} {h} M0 {h} L{w} 0", props={"stroke": C_CROSS, "strokeWeight": 1})

    def draw_avatar(self, fid, name, cx, cy, r=16):
        self.create_node("ellipse", f"{name} Cir", cx - r, cy - r, r * 2, r * 2, parent=fid, props={"fill": C_BG_MUTED, "stroke": C_BORDER, "strokeWeight": 1})
        self.create_node("ellipse", f"{name} Head", cx - (r * 0.38), cy - (r * 0.55), r * 0.76, r * 0.76, parent=fid, props={"fill": C_TEXT_LIGHT})
        self.create_node("rectangle", f"{name} Body", cx - (r * 0.65), cy + (r * 0.15), r * 1.3, r * 0.7, parent=fid, props={"fill": C_TEXT_LIGHT, "cornerRadius": 3})

    def draw_navbar_public(self, fid, active="Beranda", logged_in=False, user_name="Ibu Rina"):
        self.create_node("rectangle", "Navbar Base", 0, 0, FRAME_W, 64, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1})
        self.create_node("ellipse", "Nav Logo Cir", 36, 18, 28, 28, parent=fid, props={"fill": C_BG_MUTED, "stroke": C_BORDER, "strokeWeight": 1})
        self.create_node("text", "Nav Logo Txt", 45, 25, parent=fid, text="P", props={"fontSize": 13, "fill": C_DARK})
        self.create_node("text", "Nav Brand Name", 72, 20, parent=fid, text="PMBGM", props={"fontSize": 15, "fill": C_DARK})
        self.create_node("text", "Nav Brand Sub", 72, 36, parent=fid, text="PEMANTAU MBG MASYARAKAT", props={"fontSize": 8, "fill": C_TEXT_MUTED})
        links = [("Beranda", 0), ("Lacak", 75), ("Data Terbuka", 145), ("Insight", 255), ("Panduan", 330)]
        start_x = 300
        for l_text, offset_x in links:
            is_act = (l_text == active)
            has_drop = (l_text != "Beranda")
            display_text = f"{l_text} v" if has_drop else l_text
            if is_act:
                self.create_node("rectangle", f"NavPill {l_text}", start_x + offset_x - 8, 18, len(display_text) * 7.5 + 16, 28, parent=fid, props={"fill": C_BG_MUTED, "cornerRadius": 14})
            self.create_node("text", f"NavTxt {l_text}", start_x + offset_x, 25, parent=fid, text=display_text, props={"fontSize": 12, "fill": C_DARK if is_act else C_TEXT_MUTED})
        if not logged_in:
            self.draw_button(fid, "Nav Lapor", 745, 16, 115, 32, "Lapor Masalah", variant="primary", corner=16)
            self.draw_button(fid, "Nav Masuk", 870, 16, 60, 32, "Masuk", variant="outline", corner=16)
        else:
            self.draw_button(fid, "Nav Lapor MBG", 685, 16, 135, 32, "Lapor MBG Sekolah", variant="primary", corner=16)
            self.create_node("rectangle", "Nav User Box", 830, 16, 100, 32, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
            self.draw_avatar(fid, "Nav User Av", 845, 32, 10)
            self.create_node("text", "Nav User Name", 862, 25, parent=fid, text=f"{user_name} v", props={"fontSize": 11, "fill": C_DARK})

    def draw_navbar_panel(self, fid, active_tab="Dasbor Panel", role="Verifikator", user_code="MS", user_name="Mbak Siti"):
        self.create_node("rectangle", "Panel Nav Base", 0, 0, FRAME_W, 64, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1})
        self.create_node("ellipse", "PNav Logo Cir", 36, 18, 28, 28, parent=fid, props={"fill": C_BG_MUTED, "stroke": C_BORDER, "strokeWeight": 1})
        self.create_node("text", "PNav Logo Txt", 45, 25, parent=fid, text="P", props={"fontSize": 13, "fill": C_DARK})
        self.create_node("text", "PNav Brand Name", 72, 20, parent=fid, text="PMBGM", props={"fontSize": 15, "fill": C_DARK})
        self.create_node("text", "PNav Brand Sub", 72, 36, parent=fid, text="PEMANTAU MBG MASYARAKAT", props={"fontSize": 8, "fill": C_TEXT_MUTED})

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
                self.create_node("rectangle", f"PNavPill {t_text}", start_x + offset_x - 8, 18, len(t_text) * 7.2 + 16, 28, parent=fid, props={"fill": C_BG_MUTED, "cornerRadius": 14})
            self.create_node("text", f"PNavTxt {t_text}", start_x + offset_x, 25, parent=fid, text=t_text, props={"fontSize": 12, "fill": C_DARK if is_act else C_TEXT_MUTED})

        self.create_node("rectangle", "PNav User Box", 830, 16, 100, 32, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
        self.create_node("ellipse", "PNav User Cir", 840, 20, 24, 24, parent=fid, props={"fill": C_DARK})
        self.create_node("text", "PNav User Init", 845, 26, parent=fid, text=user_code, props={"fontSize": 9, "fill": "#FFFFFF"})
        self.create_node("text", "PNav User Name", 868, 25, parent=fid, text=f"{user_name} v", props={"fontSize": 11, "fill": C_DARK})

    def draw_footer_real(self, fid, y_pos):
        self.create_node("rectangle", "Footer Divider", 0, y_pos, FRAME_W, 1, parent=fid, props={"fill": C_BORDER})
        cols = [
            (40, "PMBGM", ["Platform pengawasan partisipatif masyarakat", "untuk transparansi dan mutu Program Makan", "Bergizi Gratis.", "Data Simulasi - MIA 2026"]),
            (340, "LAYANAN WARGA", ["Lapor Masalah", "Lacak Tiket", "Cari Sekolah & Dapur", "Panduan & Simulator"]),
            (540, "TRANSPARANSI DATA", ["Data Terbuka", "Peta Risiko SAW", "Metodologi & SLA", "Unduh Data"]),
            (740, "BANTUAN & REGULASI", ["Tanya Jawab (FAQ)", "Privasi Pelapor", "Tentang PMBGM", "Darurat Ambulans: 119"])
        ]
        for cx, ctit, clinks in cols:
            self.create_node("text", f"FTit {cx}", cx, y_pos + 25, parent=fid, text=ctit, props={"fontSize": 11, "fill": C_DARK})
            ly = y_pos + 45
            for cl in clinks:
                self.create_node("text", f"FLink {cx}_{ly}", cx, ly, parent=fid, text=cl, props={"fontSize": 10, "fill": C_TEXT_MUTED})
                ly += 16

    def draw_stepper(self, fid, active_step=1):
        steps = ["Sekolah", "Masalah", "Cerita", "Bukti", "Identitas"]
        st_y = 230
        for idx, s_name in enumerate(steps, 1):
            st_x = 115 + (idx - 1) * 125
            is_done = (idx < active_step)
            is_curr = (idx == active_step)
            if idx > 1:
                self.create_node("line", f"StLine {idx}", st_x - 65, st_y + 14, 65, 0, parent=fid, props={"stroke": C_DARK if is_done else C_BORDER, "strokeWeight": 2})
            if is_done:
                self.create_node("ellipse", f"StCir {idx}", st_x, st_y, 28, 28, parent=fid, props={"fill": C_DARK})
                self.create_node("text", f"StChk {idx}", st_x + 9, st_y + 7, parent=fid, text="v", props={"fontSize": 12, "fill": "#FFFFFF"})
            elif is_curr:
                self.create_node("ellipse", f"StCir {idx}", st_x, st_y, 28, 28, parent=fid, props={"fill": "#FFFFFF", "stroke": C_DARK, "strokeWeight": 2})
                self.create_node("text", f"StNum {idx}", st_x + 10, st_y + 7, parent=fid, text=str(idx), props={"fontSize": 12, "fill": C_DARK})
            else:
                self.create_node("ellipse", f"StCir {idx}", st_x, st_y, 28, 28, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1})
                self.create_node("text", f"StNum {idx}", st_x + 10, st_y + 7, parent=fid, text=str(idx), props={"fontSize": 12, "fill": C_TEXT_MUTED})
            self.create_node("text", f"StLbl {idx}", st_x - 8, st_y + 35, parent=fid, text=s_name, props={"fontSize": 10, "fill": C_DARK if (is_curr or is_done) else C_TEXT_MUTED})

    def draw_sidebar_sla(self, fid):
        self.create_node("rectangle", "Side SLA Card", 655, 175, 265, 380, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
        self.create_node("text", "Side Tit", 675, 195, parent=fid, text="Komitmen SLA PMBGM", props={"fontSize": 13, "fill": C_DARK})
        self.create_node("text", "Side Sub", 675, 215, parent=fid, text="Waktu respons penanganan aduan:", props={"fontSize": 10, "fill": C_TEXT_MUTED})
        sla_rows = [
            ("Kritis (KLB/Basi)", "< 4 Jam", "Investigasi lapangan & Dinkes"),
            ("Sedang (Porsi/Lauk)", "< 12 Jam", "Klarifikasi dan audit dapur"),
            ("Ringan (Rasa/Menu)", "< 24 Jam", "Evaluasi berkala mingguan"),
            ("Darurat Medis", "Segera", "Hubungi PSC 119 Kota Smg")
        ]
        sy = 240
        for s_tit, s_time, s_desc in sla_rows:
            self.create_node("text", f"SLaT {sy}", 675, sy, parent=fid, text=s_tit, props={"fontSize": 11, "fill": C_DARK})
            self.create_node("rectangle", f"SlaPill {sy}", 830, sy - 2, 70, 18, parent=fid, props={"fill": C_BG_MUTED, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 9})
            self.create_node("text", f"SLaTm {sy}", 840, sy + 1, parent=fid, text=s_time, props={"fontSize": 9, "fill": C_DARK})
            self.create_node("text", f"SLaD {sy}", 675, sy + 16, parent=fid, text=s_desc, props={"fontSize": 9, "fill": C_TEXT_MUTED})
            sy += 42
        self.draw_image_box(fid, "SLA Safe Badge", 675, 420, 225, 110, corner=8)
        self.create_node("text", "Sla Safe Txt", 695, 465, parent=fid, text="Data Terproteksi UU PDP No. 27", props={"fontSize": 11, "fill": C_DARK})

