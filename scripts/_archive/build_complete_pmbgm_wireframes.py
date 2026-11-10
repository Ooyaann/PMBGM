import subprocess
import json
import time
import os
import sys

def main():
    print("=" * 75)
    print("PMBGM - COMPREHENSIVE TEXTBOOK MONOCHROME WIREFRAME GENERATOR")
    print("MIA 2026: Sistem Pemantau MBG Masyarakat (Kota Semarang)")
    print("Arsitektur: 45 Master Artboards terorganisir dalam 7 Kategori Tematik")
    print("=" * 75)

    cli_path = "D:/Program Files/ArtCraft/FigCraft/figcraft-cli.exe"
    gui_path = "D:/Program Files/ArtCraft/FigCraft/figcraft.exe"
    output_figcraft = "d:/UNNES/LOMBA/MIA 2026/Web/PMBGM_Wireframes.figcraft"
    docs_figcraft = "d:/UNNES/LOMBA/MIA 2026/Web/pantaugizi/docs/PMBGM_Wireframe_Master.figcraft"
    render_folder = "d:/UNNES/LOMBA/MIA 2026/Web/wireframe_renders"
    overview_png = "C:/Users/nayotamaryptra/.gemini/antigravity/brain/00907903-8e5d-45cc-81b9-de65c309d732/PMBGM_Wireframes_All_Overview.png"

    os.makedirs(render_folder, exist_ok=True)
    os.makedirs(os.path.dirname(docs_figcraft), exist_ok=True)

    print("\n[1/6] Menginisialisasi FigCraft Engine (MCP stdio mode)...")
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
    send({'jsonrpc': '2.0', 'method': 'initialize', 'params': {'protocolVersion': '2024-11-05', 'capabilities': {}, 'clientInfo': {'name': 'pmbgm_wireframe_master', 'version': '3.0'}}})
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

    # Wireframe Color Palette (Strict Textbook Monochrome standard)
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
        create_node("ellipse", f"{name} Play Cir", cx - 22, cy - 22, 44, 44, parent=fid, props={"fill": C_DARK})
        create_node("vector", f"{name} Play Tri", cx - 6, cy - 9, 15, 18, parent=fid, path="M0 0 L15 9 L0 18 Z", props={"fill": "#FFFFFF"})

    def draw_avatar(fid, name, cx, cy, r=20):
        create_node("ellipse", f"{name} Circle", cx - r, cy - r, r * 2, r * 2, parent=fid, props={"fill": "#E4E4E7", "stroke": C_BORDER, "strokeWeight": 1})
        create_node("ellipse", f"{name} Head", cx - (r * 0.28), cy - (r * 0.55), r * 0.56, r * 0.56, parent=fid, props={"fill": "#A1A1AA"})
        create_node("rectangle", f"{name} Body", cx - (r * 0.65), cy + (r * 0.1), r * 1.3, r * 0.75, parent=fid, props={"fill": "#A1A1AA", "cornerRadius": 6})

    def draw_button(fid, name, x, y, w, h, text, variant="primary"):
        if variant == "primary":
            create_node("rectangle", f"{name} Box", x, y, w, h, parent=fid, props={"fill": C_DARK, "cornerRadius": 4})
            create_node("text", f"{name} Txt", x + max(8, (w - len(text) * 7.2) / 2), y + (h - 14) / 2, parent=fid, text=text, props={"fill": "#FFFFFF", "fontSize": 12})
        elif variant == "subtle":
            create_node("rectangle", f"{name} Box", x, y, w, h, parent=fid, props={"fill": C_LIGHT_BG, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
            create_node("text", f"{name} Txt", x + max(8, (w - len(text) * 7.0) / 2), y + (h - 14) / 2, parent=fid, text=text, props={"fill": C_DARK, "fontSize": 12})
        else:
            create_node("rectangle", f"{name} Box", x, y, w, h, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
            create_node("text", f"{name} Txt", x + max(8, (w - len(text) * 7.0) / 2), y + (h - 14) / 2, parent=fid, text=text, props={"fill": C_DARK, "fontSize": 12})

    def draw_input(fid, name, x, y, w, h, placeholder, corner=4):
        create_node("rectangle", f"{name} Box", x, y, w, h, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": corner})
        create_node("text", f"{name} Txt", x + 16, y + (h - 13) / 2, parent=fid, text=placeholder, props={"fill": C_TEXT_LIGHT, "fontSize": 12})

    def draw_badge(fid, name, x, y, w, h, text, variant="dark"):
        bg = C_DARK if variant == "dark" else ("#FAFAFA" if variant == "outline" else C_LIGHT_BG)
        tc = "#FFFFFF" if variant == "dark" else C_TEXT_MAIN
        stroke = C_BORDER if variant == "outline" else "none"
        create_node("rectangle", f"{name} Bg", x, y, w, h, parent=fid, props={"fill": bg, "stroke": stroke, "strokeWeight": 1, "cornerRadius": 3})
        create_node("text", f"{name} Txt", x + max(6, (w - len(text) * 6.2) / 2), y + (h - 11) / 2, parent=fid, text=text, props={"fontSize": 10, "fill": tc})

    def draw_metric_card(fid, x, y, w, h, label, val, sub):
        create_node("rectangle", f"MetCard {label}", x, y, w, h, parent=fid, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
        create_node("text", f"MLbl {label}", x + 16, y + 14, parent=fid, text=label, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("text", f"MVal {label}", x + 16, y + 36, parent=fid, text=val, props={"fontSize": 20, "fill": C_DARK})
        create_node("text", f"MSub {label}", x + 16, y + 66, parent=fid, text=sub, props={"fontSize": 10, "fill": C_TEXT_MUTED})

    def draw_navbar(fid, active="Beranda"):
        create_node("rectangle", "Navbar Base", 0, 0, 960, 56, parent=fid, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
        create_node("rectangle", "Logo Box", 32, 16, 24, 24, parent=fid, props={"fill": C_DARK, "cornerRadius": 4})
        create_node("text", "Brand Name", 64, 20, parent=fid, text="PMBGM", props={"fontSize": 14, "fill": C_DARK})
        create_node("text", "Brand Tag", 125, 22, parent=fid, text="|  Pemantau MBG Masyarakat", props={"fontSize": 11, "fill": C_TEXT_MUTED})
        links = ["Beranda", "Lapor", "Lacak", "Data", "Insight", "Panduan"]
        lx = 420
        for l in links:
            is_act = (l == active)
            col = C_DARK if is_act else C_TEXT_MUTED
            create_node("text", f"Nav {l}", lx, 21, parent=fid, text=l, props={"fontSize": 12, "fill": col})
            if is_act:
                create_node("rectangle", f"Nav Line {l}", lx, 46, 36, 2, parent=fid, props={"fill": C_DARK})
            lx += 62
        draw_button(fid, "Nav Lapor", 790, 12, 85, 32, "Lapor", variant="primary")
        draw_button(fid, "Nav Masuk", 885, 12, 55, 32, "Masuk", variant="outline")

    def draw_footer(fid, y=1400):
        create_node("rectangle", "Footer Base", 0, y, 960, 50, parent=fid, props={"fill": "#FAFAFA", "stroke": C_DIVIDER, "strokeWeight": 1})
        create_node("text", "Footer Copyright", 32, y + 18, parent=fid, text="(c) 2026 PMBGM (Pemantau MBG Masyarakat) * Inisiatif Pengawasan Partisipatif Makan Bergizi Gratis * CC BY 4.0", props={"fontSize": 11, "fill": C_TEXT_MUTED})

    def draw_sidebar(fid, role_title, role_sub, active_menu, menus):
        create_node("rectangle", "Side Base", 0, 0, 220, 1450, parent=fid, props={"fill": "#FAFAFA", "stroke": C_DIVIDER, "strokeWeight": 1})
        create_node("rectangle", "Side Logo", 24, 20, 20, 20, parent=fid, props={"fill": C_DARK, "cornerRadius": 4})
        create_node("text", "Side Brand", 50, 22, parent=fid, text="PMBGM PANEL", props={"fontSize": 13, "fill": C_DARK})
        create_node("text", "Side Role", 24, 48, parent=fid, text=role_title, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", "Side Role Sub", 24, 64, parent=fid, text=role_sub, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        create_node("rectangle", "Side Div", 16, 84, 188, 1, parent=fid, props={"fill": C_DIVIDER})
        m_y = 96
        for idx, m_lbl in enumerate(menus):
            is_act = (m_lbl == active_menu)
            if is_act:
                create_node("rectangle", f"Menu BG {idx}", 16, m_y - 4, 188, 34, parent=fid, props={"fill": C_DARK, "cornerRadius": 4})
                create_node("text", f"Menu Txt {idx}", 32, m_y + 5, parent=fid, text=m_lbl, props={"fontSize": 12, "fill": "#FFFFFF"})
            else:
                create_node("text", f"Menu Txt {idx}", 32, m_y + 5, parent=fid, text=m_lbl, props={"fontSize": 12, "fill": C_TEXT_MUTED})
            m_y += 40
        draw_avatar(fid, "Side User Av", 40, 1400, 16)
        create_node("text", "Side UserName", 65, 1392, parent=fid, text="Petugas Aktif", props={"fontSize": 11, "fill": C_DARK})
        create_node("text", "Side UserRole", 65, 1406, parent=fid, text="Online * ID #0294", props={"fontSize": 9, "fill": C_TEXT_MUTED})

    def draw_stepper(fid, active_step_idx=0):
        steps = ["1. Sekolah", "2. Masalah", "3. Cerita", "4. Bukti Foto", "5. Identitas"]
        st_x = 40
        for idx, st_name in enumerate(steps):
            is_act = (idx == active_step_idx)
            is_done = (idx < active_step_idx)
            bg = C_DARK if is_act else (C_LIGHT_BG if not is_done else "#E4E4E7")
            txt_col = "#FFFFFF" if is_act else C_TEXT_MAIN
            create_node("rectangle", f"StBox {idx}", st_x, 145, 168, 36, parent=fid, props={"fill": bg, "cornerRadius": 4})
            check = " [OK]" if is_done else ""
            create_node("text", f"StTxt {idx}", st_x + 35, 156, parent=fid, text=f"{st_name}{check}", props={"fontSize": 11, "fill": txt_col})
            st_x += 178

    print("[2/6] Membersihkan kanvas dan menyiapkan kanvas multi-baris...")
    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'run_command', 'arguments': {'command': 'select.all'}}})
    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'run_command', 'arguments': {'command': 'edit.delete'}}})
    time.sleep(0.3)

    FRAME_W = 960
    FRAME_H = 1450
    GAP_X = 80
    GAP_Y = 220
    created_frames = []

    def get_frame_pos(row_idx, col_idx):
        x = 80 + col_idx * (FRAME_W + GAP_X)
        y = 200 + row_idx * (FRAME_H + GAP_Y)
        return x, y

    def add_section_header(row_idx, title_text, desc_text):
        _, y = get_frame_pos(row_idx, 0)
        create_node("text", f"SecTit_{row_idx}", 80, y - 110, text=title_text, props={"fontSize": 26, "fill": C_DARK})
        create_node("text", f"SecDesc_{row_idx}", 80, y - 76, text=desc_text, props={"fontSize": 13, "fill": C_TEXT_MUTED})

    def start_frame(row_idx, col_idx, frame_name, screen_title):
        fx, fy = get_frame_pos(row_idx, col_idx)
        create_node("text", f"FrameTit_{frame_name}", fx, fy - 35, text=screen_title, props={"fontSize": 15, "fill": C_DARK})
        fid = create_node("frame", frame_name, fx, fy, FRAME_W, FRAME_H, props={"fill": C_FRAME_BG, "stroke": C_BORDER, "strokeWeight": 1})
        created_frames.append(fid)
        return fid

    print("[3/6] Membangun 45 Master Artboards per Kategori...")

    # =========================================================================
    # ROW 0: SECTION 01 - PORTAL PUBLIK & PENGADUAN WARGA (7 Layar)
    # =========================================================================
    print(" -> [Row 0] Section 1: Portal Publik (01 s/d 07)...")
    add_section_header(0, "SECTION 01: PORTAL PUBLIK & PENGADUAN WARGA", "Portal keterbukaan informasi publik, pencarian sekolah, tracking tiket warga, akuntabilitas SLA.")

    # 1.1: 01. Beranda Utama (Landing Page)
    f = start_frame(0, 0, "01. Beranda Utama", "01. Beranda Utama (Landing Page)")
    draw_navbar(f, "Beranda")
    create_node("text", "H Brand", 380, 105, parent=f, text="PMBGM", props={"fontSize": 52, "fill": C_DARK})
    create_node("text", "H Sub", 370, 168, parent=f, text="PEMANTAU MBG MASYARAKAT", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    draw_input(f, "H Search", 220, 200, 520, 50, "Cari sekolah, dapur SPPG, atau kode tiket...", corner=25)
    draw_button(f, "Btn Lapor Hero", 330, 265, 140, 40, "Buat Laporan", variant="primary")
    draw_button(f, "Btn Lacak Hero", 485, 265, 140, 40, "Lacak Tiket", variant="outline")
    create_node("rectangle", "H Stat Pill", 340, 325, 280, 28, parent=f, props={"fill": "#FAFAFA", "stroke": C_DIVIDER, "strokeWeight": 1, "cornerRadius": 14})
    create_node("text", "H Stat Txt", 355, 332, parent=f, text="* 165 Sekolah  |  40 Dapur SPPG  |  Darurat 119", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    draw_video_box(f, "H Video", 120, 375, 720, 270)
    create_node("text", "H Vid Cap", 320, 655, parent=f, text="Video Simulasi Alur Pengawasan & Uji Sampel MBG", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    create_node("text", "Pilar Tit", 40, 695, parent=f, text="4 Pilar Pengawasan Partisipatif", props={"fontSize": 16, "fill": C_DARK})
    pilars = [("1. Lapor Mandiri", "Foto menu & keluhan porsi langsung dilaporkan warga."), ("2. Verifikasi AI", "Pemeriksaan integritas EXIF & koherensi model MLP."), ("3. Respon SLA", "Kasus terdistribusi otomatis ke Dapur & Dinkes."), ("4. Indeks SAW", "Perankingan dapur berisiko untuk audit lapangan.")]
    px = 40
    for idx, (ptit, pdesc) in enumerate(pilars):
        create_node("rectangle", f"PBox {idx}", px, 725, 205, 220, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
        draw_image_box(f, f"PImg {idx}", px, 725, 205, 115)
        create_node("text", f"PTit {idx}", px + 12, 855, parent=f, text=ptit, props={"fontSize": 13, "fill": C_DARK})
        create_node("text", f"PDesc {idx}", px + 12, 878, width=180, parent=f, text=pdesc, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        px += 225
    create_node("text", "Feed Tit", 40, 975, parent=f, text="Kasus Terkini & Live Tracker Feed", props={"fontSize": 16, "fill": C_DARK})
    feeds = [("#MBG-2026-X89K", "Porsi Lauk Kurang", "SDN Tembalang 01", "DIPROSES", "Sisa SLA: 14 Jam"), ("#MBG-2026-X88P", "Wadah Berminyak", "SMPN 08 Semarang", "SELESAI", "Tuntas dalam 8 Jam"), ("#MBG-2026-X87M", "Indikasi Sayur Asam", "SD Sendangmulyo 02", "INVESTIGASI", "Tenggat Lab: 2 Jam")]
    fx_item = 40
    for idx, (code, title, school, badge, sla_info) in enumerate(feeds):
        create_node("rectangle", f"FBox {idx}", fx_item, 1005, 280, 180, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
        create_node("text", f"FCode {idx}", fx_item + 14, 1022, parent=f, text=code, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        draw_badge(f, f"FBadge {idx}", fx_item + 195, 1018, 72, 20, badge, "dark")
        create_node("text", f"FTit {idx}", fx_item + 14, 1048, parent=f, text=title, props={"fontSize": 13, "fill": C_DARK})
        create_node("text", f"FSch {idx}", fx_item + 14, 1070, parent=f, text=school, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("rectangle", f"FSlaBg {idx}", fx_item + 14, 1105, 252, 6, parent=f, props={"fill": "#E4E4E7", "cornerRadius": 3})
        create_node("rectangle", f"FSlaBar {idx}", fx_item + 14, 1105, 140, 6, parent=f, props={"fill": C_DARK, "cornerRadius": 3})
        create_node("text", f"FSlaTxt {idx}", fx_item + 14, 1120, parent=f, text=sla_info, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        draw_button(f, f"FBtn {idx}", fx_item + 14, 1145, 252, 26, "Lihat Status Kasus", variant="outline")
        fx_item += 300
    create_node("text", "Tim Header", 40, 1220, parent=f, text="Dukungan Partisipasi Warga, Tim Medis & Komite Sekolah", props={"fontSize": 14, "fill": C_DARK})
    draw_avatar(f, "Av1", 420, 1280, 24)
    draw_avatar(f, "Av2", 480, 1280, 24)
    draw_avatar(f, "Av3", 540, 1280, 24)
    draw_footer(f, 1400)

    # 1.2: 02. Gerbang Lapor Masuk (Auth Gate)
    f = start_frame(0, 1, "02. Gerbang Lapor Masuk", "02. Gerbang Lapor Masuk (Auth Gate)")
    draw_navbar(f, "Lapor")
    create_node("rectangle", "Gate Card", 180, 140, 600, 620, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 6})
    create_node("rectangle", "Shield Box", 455, 180, 50, 50, parent=f, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 25})
    create_node("text", "Shield Icon", 472, 195, parent=f, text="[OK]", props={"fontSize": 14, "fill": C_DARK})
    create_node("text", "Gate Tit", 285, 250, parent=f, text="Masuk untuk Menyampaikan Pengaduan", props={"fontSize": 18, "fill": C_DARK})
    create_node("text", "Gate Sub", 220, 280, width=520, parent=f, text="Untuk menjaga integritas laporan dan menghindari spam, pengaduan MBG mewajibkan login akun terverifikasi. Identitas pelapor dijamin aman dan dilindungi.", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    guarantees = [("Enkripsi Data Pelapor", "Identitas disimpan dengan enkripsi tingkat perbankan."), ("Pilihan Anonimitas Penuh", "Nama Anda tidak akan pernah dibuka ke pihak dapur jika memilih anonim."), ("Jaminan Respon SLA 2 Jam", "Laporan terverifikasi langsung masuk ke radar penanganan.")]
    gy = 360
    for idx, (gtit, gsub) in enumerate(guarantees):
        create_node("rectangle", f"GBadge {idx}", 220, gy, 18, 18, parent=f, props={"fill": C_DARK, "cornerRadius": 9})
        create_node("text", f"GTxt {idx}", 250, gy, parent=f, text=gtit, props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"GSub {idx}", 250, gy + 18, width=490, parent=f, text=gsub, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        gy += 55
    draw_button(f, "Btn Gate Login", 220, 550, 520, 46, "Masuk dengan Akun Warga / Wali Murid", variant="primary")
    draw_button(f, "Btn Gate Daftar", 220, 610, 520, 42, "Daftar Akun Pengawas Partisipatif", variant="outline")
    draw_button(f, "Btn Gate Demo", 220, 665, 520, 36, "Eksplorasi Formulir Simulasi (Demo)", variant="subtle")
    draw_footer(f, 1400)

    # 1.3: 03. Panduan Alur Pelaporan
    f = start_frame(0, 2, "03. Panduan Alur Lapor", "03. Panduan Prosedur Pelaporan")
    draw_navbar(f, "Panduan")
    create_node("text", "Pan Tit", 40, 80, parent=f, text="Panduan Resmi Prosedur Pengaduan MBG", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "Pan Sub", 40, 110, parent=f, text="Standar Operasional Prosedur bagi wali murid, komite sekolah, dan tenaga pendidik.", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    p_steps = [("Langkah 1", "Pilih Sekolah", "Tentukan lokasi sekolah penerima paket MBG."), ("Langkah 2", "Kategori Masalah", "Pilih porsi, higienitas, basi, atau medis."), ("Langkah 3", "Cerita Kronologi", "Jelaskan fakta temuan kondisi makanan."), ("Langkah 4", "Unggah Bukti Foto", "Lampirkan foto jelas dari kamera asli."), ("Langkah 5", "Pilih Kerahasiaan", "Pilih mode rahasia, publik, atau anonim.")]
    sy = 150
    for idx, (st_num, st_name, st_desc) in enumerate(p_steps):
        create_node("rectangle", f"PStepBox {idx}", 40, sy, 880, 68, parent=f, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
        create_node("rectangle", f"PStepNum {idx}", 55, sy + 14, 40, 40, parent=f, props={"fill": C_DARK, "cornerRadius": 4})
        create_node("text", f"PStepNumTxt {idx}", 67, sy + 25, parent=f, text=str(idx+1), props={"fontSize": 16, "fill": "#FFFFFF"})
        create_node("text", f"PStepTit {idx}", 110, sy + 15, parent=f, text=st_name, props={"fontSize": 13, "fill": C_DARK})
        create_node("text", f"PStepDesc {idx}", 110, sy + 36, parent=f, text=st_desc, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        sy += 80
    create_node("text", "Kriteria Tit", 40, 570, parent=f, text="Ketentuan Bukti Foto yang Diterima Sistem AI", props={"fontSize": 16, "fill": C_DARK})
    create_node("rectangle", "Card Valid", 40, 600, 425, 280, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    draw_image_box(f, "Img Valid", 40, 600, 425, 150)
    create_node("text", "V Tit", 55, 765, parent=f, text="[VALID] Foto Kamera Asli Langsung di Meja Makan", props={"fontSize": 13, "fill": C_DARK})
    create_node("text", "V Sub", 55, 790, width=390, parent=f, text="Foto memuat nampan omprengan MBG, pencahayaan cukup, dan metadata EXIF kamera (jam potret & lokasi) utuh.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("rectangle", "Card Invalid", 495, 600, 425, 280, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    draw_image_box(f, "Img Invalid", 495, 600, 425, 150)
    create_node("text", "IV Tit", 510, 765, parent=f, text="[TIDAK VALID] Tangkapan Layar / Foto Buram", props={"fontSize": 13, "fill": C_DARK})
    create_node("text", "IV Sub", 510, 790, width=390, parent=f, text="Screenshot pesan medsos, gambar unduhan internet, atau foto tanpa metadata akan otomatis ditolak model verifikator.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    draw_button(f, "Btn Mulai Lapor Pan", 360, 910, 240, 44, "Mulai Laporkan Masalah Sekarang", variant="primary")
    draw_footer(f, 1400)

    # 1.4: 04. Pelacakan Kasus (/lacak)
    f = start_frame(0, 3, "04. Pelacakan Kasus", "04. Pelacakan Kasus & SLA (/lacak)")
    draw_navbar(f, "Lacak")
    create_node("rectangle", "Search Card BG", 40, 80, 880, 130, parent=f, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "SCard Tit", 65, 102, parent=f, text="Cek Status Pengaduan Anda", props={"fontSize": 18, "fill": C_DARK})
    create_node("text", "SCard Sub", 65, 128, parent=f, text="Masukkan kode tiket unik yang didapatkan saat melapor untuk memantau status secara langsung.", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    draw_input(f, "Input Cek", 65, 152, 600, 42, "Ketik kode tiket (contoh: MBG-2026-X89K)...")
    draw_button(f, "Btn Cek Sub", 680, 152, 120, 42, "Lacak Kasus", variant="primary")
    create_node("text", "Tab1", 40, 235, parent=f, text="Kasus Terbaru di Wilayah", props={"fontSize": 14, "fill": C_DARK})
    create_node("rectangle", "TabLine", 40, 258, 160, 2, parent=f, props={"fill": C_DARK})
    create_node("text", "Tab2", 230, 235, parent=f, text="Akuntabilitas SLA Wilayah", props={"fontSize": 14, "fill": C_TEXT_MUTED})
    create_node("rectangle", "Filter Box", 40, 275, 880, 42, parent=f, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "FTime", 55, 288, parent=f, text="Waktu:", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    draw_button(f, "FT1", 105, 281, 60, 28, "Semua", variant="primary")
    draw_button(f, "FT2", 175, 281, 60, 28, "7 Hari", variant="outline")
    create_node("text", "FStat", 260, 288, parent=f, text="Status:", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    draw_button(f, "FS1", 310, 281, 65, 28, "Semua", variant="primary")
    draw_button(f, "FS2", 385, 281, 75, 28, "Diproses", variant="outline")
    draw_button(f, "FS3", 470, 281, 65, 28, "Selesai", variant="outline")
    d_cases = [("#MBG-2026-X89K", "Porsi Lauk Kurang & Nasi Keras", "SD Negeri Tembalang 01", "DIPROSES", 0.45, "Sisa SLA: 14 Jam 20 Menit"), ("#MBG-2026-X88P", "Sayur Basi dan Berbau Masam", "SMP Negeri 08 Semarang", "SELESAI", 1.0, "Tuntas Teratasi dalam 8 Jam"), ("#MBG-2026-X87M", "Indikasi 3 Siswa Mual Usai Makan", "SD Sendangmulyo 02", "INVESTIGASI", 0.70, "Tenggat Uji Lab Dinkes: 2 Jam"), ("#MBG-2026-X86K", "Wadah Makanan Berminyak", "SD Negeri Banyumanik 03", "SELESAI", 1.0, "Penggantian Wadah Standar Baru")]
    grid_coords = [(40, 335), (495, 335), (40, 580), (495, 580)]
    for idx, (code, title, school, status, progress, sla_txt) in enumerate(d_cases):
        gx, gy = grid_coords[idx]
        create_node("rectangle", f"DCard {idx}", gx, gy, 425, 225, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
        draw_image_box(f, f"DThumb {idx}", gx + 310, gy + 16, 95, 75)
        create_node("text", f"DCod {idx}", gx + 18, gy + 18, parent=f, text=code, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        draw_badge(f, f"DBdg {idx}", gx + 140, gy + 14, 85, 22, status, "dark")
        create_node("text", f"DTit {idx}", gx + 18, gy + 45, width=280, parent=f, text=title, props={"fontSize": 14, "fill": C_DARK})
        create_node("text", f"DSch {idx}", gx + 18, gy + 72, parent=f, text=f"Lokasi: {school}", props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("rectangle", f"DDiv {idx}", gx + 18, gy + 105, 385, 1, parent=f, props={"fill": C_DIVIDER})
        create_node("text", f"DSteps {idx}", gx + 18, gy + 120, parent=f, text="Lapor (OK) -> Verif (OK) -> Tindak Lanjut -> Selesai", props={"fontSize": 10, "fill": C_DARK})
        create_node("rectangle", f"DSlaBg {idx}", gx + 18, gy + 150, 385, 8, parent=f, props={"fill": "#E4E4E7", "cornerRadius": 4})
        create_node("rectangle", f"DSlaBar {idx}", gx + 18, gy + 150, int(385 * progress), 8, parent=f, props={"fill": C_DARK, "cornerRadius": 4})
        create_node("text", f"DSlaTxt {idx}", gx + 18, gy + 172, parent=f, text=f"Durasi SLA: {sla_txt}", props={"fontSize": 11, "fill": C_TEXT_MUTED})
        draw_button(f, f"Btn Det {idx}", gx + 300, gy + 185, 105, 28, "Lihat Tiket", variant="outline")
    create_node("text", "D Live Tit", 40, 835, parent=f, text="Pratinjau Status Real-Time Kasus Terpilih (#MBG-2026-X89K)", props={"fontSize": 16, "fill": C_DARK})
    create_node("rectangle", "Live Case Box", 40, 865, 880, 220, parent=f, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    steps_v = [("Laporan Diterima", "10:30 WIB | Foto & kronologi berhasil dicatat sistem.", True), ("Diverifikasi AI & Petugas", "11:15 WIB | Keaslian foto valid (skor integritas 0.94).", True), ("Diteruskan ke SPPG & Dinkes", "11:45 WIB | SPPG Tembalang 01 diwajibkan respons dalam 18 jam.", True), ("Penyelesaian & Audit Akhir", "Menunggu berita acara perbaikan menu.", False)]
    vy = 885
    for s_idx, (v_t, v_d, v_done) in enumerate(steps_v):
        v_col = C_DARK if v_done else "#D1D5DB"
        create_node("ellipse", f"VCir {s_idx}", 65, vy + 2, 14, 14, parent=f, props={"fill": v_col})
        create_node("text", f"VTit {s_idx}", 95, vy, parent=f, text=v_t, props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"VDesc {s_idx}", 95, vy + 18, parent=f, text=v_d, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        vy += 48
    draw_footer(f, 1400)

    # 1.5: 05. Pelacakan Tiket Aktif
    f = start_frame(0, 4, "05. Pelacakan Tiket Aktif", "05. Pelacakan Tiket Aktif (#MBG-AG2MWK)")
    draw_navbar(f, "Lacak")
    create_node("rectangle", "Tik Banner", 40, 80, 880, 95, parent=f, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "Tik Code", 65, 98, parent=f, text="KODE TIKET: #MBG-AG2MWK", props={"fontSize": 20, "fill": C_DARK})
    draw_badge(f, "Tik Stat", 420, 98, 140, 24, "INVESTIGASI LAPANGAN", "dark")
    create_node("text", "Tik Sub", 65, 132, parent=f, text="SD Negeri Tembalang 01  |  Kategori: Kualitas / Mutu Masakan  |  Dilaporkan 04 Nov 2026, 10:28 WIB", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("rectangle", "Sla Alert Box", 40, 195, 880, 70, parent=f, props={"fill": "#FFFFFF", "stroke": C_DARK, "strokeWeight": 1.5, "cornerRadius": 4})
    create_node("text", "Sla Alert Tit", 60, 210, parent=f, text="Hitung Mundur SLA Investigasi SPPG & Dinkes: 14 Jam 12 Menit Tersisa", props={"fontSize": 13, "fill": C_DARK})
    create_node("rectangle", "Sla Progress Bg", 60, 235, 700, 10, parent=f, props={"fill": "#E4E4E7", "cornerRadius": 5})
    create_node("rectangle", "Sla Progress Bar", 60, 235, 450, 10, parent=f, props={"fill": C_DARK, "cornerRadius": 5})
    create_node("text", "Sla Pct", 780, 232, parent=f, text="64% Durasi", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "Kron Tit", 40, 290, parent=f, text="Informasi & Bukti Laporan Warga", props={"fontSize": 14, "fill": C_DARK})
    create_node("rectangle", "Kron Box", 40, 315, 425, 420, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    draw_image_box(f, "Kron Img", 55, 335, 395, 200)
    create_node("text", "Kron Desc", 55, 550, width=395, parent=f, text="\"Sayur sop berbau asam saat tiba di kelas 4A. Anak-anak menolak makan dan 2 anak mengeluhkan perut mual usai mencicipi kuah.\"", props={"fontSize": 12, "fill": C_DARK})
    create_node("text", "Kron Exif", 55, 620, parent=f, text="* Timestamp EXIF: 10:28:14 WIB (Tervalidasi)\n* GPS: -7.0512, 110.4371 (Area SD Tembalang 01)\n* Kamera: iPhone 13 (Kamera Asli)", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "Log Tit", 495, 290, parent=f, text="Log Penanganan Bertahap Sistem", props={"fontSize": 14, "fill": C_DARK})
    create_node("rectangle", "Log Box", 495, 315, 425, 420, parent=f, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    logs = [("10:30 WIB", "Laporan Masuk", "Dicatat otomatis di database terdesentralisasi."), ("11:15 WIB", "Verifikasi Lapangan", "Divalidasi oleh Verifikator Mbak Sari (Valid)."), ("11:45 WIB", "Penerusan Kasus", "Disposisi resmi ke Dapur SPPG Tembalang 01."), ("12:30 WIB", "Uji Sampel Dinkes", "Dinas Kesehatan menguji sampel sisa makanan lab.")]
    ly = 335
    for idx, (l_time, l_action, l_desc) in enumerate(logs):
        create_node("ellipse", f"LCir {idx}", 515, ly + 2, 10, 10, parent=f, props={"fill": C_DARK})
        create_node("text", f"LTime {idx}", 535, ly, parent=f, text=f"{l_time} - {l_action}", props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"LDesc {idx}", 535, ly + 18, width=360, parent=f, text=l_desc, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        ly += 55
    draw_button(f, "Btn Refresh Tik", 495, 755, 200, 36, "Segarkan Status", variant="outline")
    draw_button(f, "Btn Cetak Tik", 720, 755, 200, 36, "Unduh Bukti PDF", variant="primary")
    draw_footer(f, 1400)

    # 1.6: 06. Detail Kasus Terbuka
    f = start_frame(0, 5, "06. Detail Kasus Terbuka", "06. Detail Kasus Publik Terbuka")
    draw_navbar(f, "Lacak")
    create_node("text", "Kas Tit", 40, 80, parent=f, text="Detail Kasus Publik #MBG-2026-X89K", props={"fontSize": 20, "fill": C_DARK})
    create_node("text", "Kas Sub", 40, 108, parent=f, text="Kasus Tuntas Terverifikasi * SD Negeri Tembalang 01 * SPPG Tembalang 01", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    create_node("text", "Comp Tit", 40, 145, parent=f, text="Perbandingan Kondisi Sebelum vs Sesudah Tindak Lanjut:", props={"fontSize": 14, "fill": C_DARK})
    create_node("rectangle", "Bef Box", 40, 175, 425, 340, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    draw_image_box(f, "Bef Img", 40, 175, 425, 200)
    create_node("text", "Bef Tit", 55, 390, parent=f, text="[SEBELUM] Kuah Sayur Berbusa & Berbau Asam", props={"fontSize": 12, "fill": C_DARK})
    create_node("text", "Bef Desc", 55, 415, width=390, parent=f, text="Dilaporkan wali murid pada 04 Nov 2026 pukul 10:28 WIB. Sampel makanan segera diisolasi guru kelas.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("rectangle", "Aft Box", 495, 175, 425, 340, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    draw_image_box(f, "Aft Img", 495, 175, 425, 200)
    create_node("text", "Aft Tit", 510, 390, parent=f, text="[SESUDAH] Penggantian Menu Segar & Sterilisasi Wadah", props={"fontSize": 12, "fill": C_DARK})
    create_node("text", "Aft Desc", 510, 415, width=390, parent=f, text="SPPG mengirimkan 450 porsi menu pengganti terstandar dan melakukan kalibrasi suhu pengantaran dalam 4 jam.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "Berita Tit", 40, 545, parent=f, text="Berita Acara Tindakan Korektif & Pengawasan:", props={"fontSize": 14, "fill": C_DARK})
    create_node("rectangle", "Berita Box", 40, 575, 880, 240, parent=f, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    ba_items = [("Hasil Uji Sampel Dinkes:", "Negatif bakteri berbahaya. Keasaman diakibatkan wadah tertutup saat makanan masih terlalu panas."), ("Tindakan Terhadap SPPG:", "Pemberian Surat Peringatan SP-1 dan kewajiban penambahan kipas pendingin ruang packing."), ("Audit Mutu Lanjutan:", "Tim Korwil BGN menjadwalkan inspeksi mendadak dalam 7 hari kerja ke depan."), ("Rating Kepuasan Wali Murid:", "Bintang 5/5 - Pelapor mengonfirmasi pergantian makanan tiba tepat waktu.")]
    by = 595
    for idx, (ba_lbl, ba_val) in enumerate(ba_items):
        create_node("text", f"BALbl {idx}", 60, by, parent=f, text=ba_lbl, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("text", f"BAVal {idx}", 250, by, width=650, parent=f, text=ba_val, props={"fontSize": 12, "fill": C_DARK})
        by += 50
    draw_footer(f, 1400)

    # 1.7: 07. Papan Akuntabilitas Publik SLA
    f = start_frame(0, 6, "07. Akuntabilitas Publik SLA", "07. Papan Akuntabilitas Publik SLA")
    draw_navbar(f, "Lacak")
    create_node("text", "Akun Tit", 40, 80, parent=f, text="Papan Akuntabilitas Kepatuhan SLA Wilayah", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "Akun Sub", 40, 110, parent=f, text="Pemantauan kepatuhan respon penanganan instansi terhadap aduan masyarakat secara transparan.", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    draw_metric_card(f, 40, 145, 275, 90, "Tingkat Kepatuhan SLA", "94.8%", "Target Standar: >= 90%")
    draw_metric_card(f, 345, 145, 275, 90, "Rata-rata Respon Verifikasi", "2.4 Jam", "Batas Maksimum: 4.0 Jam")
    draw_metric_card(f, 645, 145, 275, 90, "Kasus Tuntas Teratasi", "114 / 119", "95.7% Rasio Penyelesaian")
    create_node("text", "Sla Chart Tit", 40, 260, parent=f, text="Grafik Tingkat Kepatuhan SLA per Kecamatan di Kota Semarang", props={"fontSize": 14, "fill": C_DARK})
    draw_image_box(f, "Sla Chart Img", 40, 285, 880, 220)
    create_node("text", "Sla Chart Mock", 340, 390, parent=f, text="[Grafik Batang Komparasi 16 Kecamatan]", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    create_node("text", "Lead Tit", 40, 535, parent=f, text="Peringkat Kepatuhan Penanganan Laporan MBG:", props={"fontSize": 14, "fill": C_DARK})
    create_node("rectangle", "Lead Table Box", 40, 565, 880, 260, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("rectangle", "LTH BG", 40, 565, 880, 36, parent=f, props={"fill": "#F4F4F5"})
    create_node("text", "LTH 1", 55, 576, parent=f, text="PERINGKAT", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "LTH 2", 160, 576, parent=f, text="KECAMATAN", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "LTH 3", 350, 576, parent=f, text="TOTAL ADUAN", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "LTH 4", 500, 576, parent=f, text="SELESAI TEPAT WAKTU", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "LTH 5", 680, 576, parent=f, text="SKOR KEPATUHAN", props={"fontSize": 10, "fill": C_DARK})
    leads = [("1", "Kecamatan Tembalang", "28 Kasus", "27 Kasus", "96.4% (Tinggi)"), ("2", "Kecamatan Candisari", "22 Kasus", "21 Kasus", "95.5% (Tinggi)"), ("3", "Kecamatan Banyumanik", "19 Kasus", "18 Kasus", "94.7% (Tinggi)"), ("4", "Kecamatan Semarang Barat", "25 Kasus", "23 Kasus", "92.0% (Sedang)"), ("5", "Kecamatan Gayamsari", "25 Kasus", "21 Kasus", "84.0% (Perhatian)")]
    r_y = 601
    for idx, (c1, c2, c3, c4, c5) in enumerate(leads):
        create_node("rectangle", f"LTR BG {idx}", 40, r_y, 880, 44, parent=f, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
        create_node("text", f"LTD1 {idx}", 55, r_y + 14, parent=f, text=c1, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"LTD2 {idx}", 160, r_y + 14, parent=f, text=c2, props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"LTD3 {idx}", 350, r_y + 14, parent=f, text=c3, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("text", f"LTD4 {idx}", 500, r_y + 14, parent=f, text=c4, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"LTD5 {idx}", 680, r_y + 14, parent=f, text=c5, props={"fontSize": 11, "fill": C_DARK})
        r_y += 44
    draw_footer(f, 1400)

    # =========================================================================
    # ROW 1: SECTION 02 - ALUR MULTI-LANGKAH FORMULIR PELAPORAN (7 Layar)
    # =========================================================================
    print(" -> [Row 1] Section 2: Alur Lapor Multi-Langkah (26 s/d 31 & 25)...")
    add_section_header(1, "SECTION 02: ALUR MULTI-LANGKAH PELAPORAN WARGA (/lapor)", "Formulir interaktif 5 tahap pengaduan, verifikasi EXIF kamera asli, privasi, hingga tiket resmi.")

    # 2.1: 26. Alur Lapor: Langkah 1 - Pilih Sekolah
    f = start_frame(1, 0, "26. Lapor Step 1 - Sekolah", "26. Alur Lapor: Langkah 1 - Pilih Sekolah")
    draw_navbar(f, "Lapor")
    create_node("text", "L1 Tit", 40, 80, parent=f, text="Formulir Pelaporan Masalah MBG", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "L1 Sub", 40, 110, parent=f, text="Tentukan sekolah penerima manfaat yang mengalami kendala paket makanan.", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    draw_stepper(f, 0)
    create_node("text", "L1 Label", 40, 210, parent=f, text="Cari & Pilih Sekolah Sasaran MBG *", props={"fontSize": 13, "fill": C_DARK})
    draw_input(f, "Input L1 Sch", 40, 235, 520, 44, "Ketik nama sekolah atau NPSN (contoh: SD Negeri Tembalang 01)...")
    # Search Results Card
    create_node("rectangle", "Res Box", 40, 295, 520, 180, parent=f, props={"fill": "#FFFFFF", "stroke": C_DARK, "strokeWeight": 1.5, "cornerRadius": 4})
    create_node("text", "Res Tit", 55, 310, parent=f, text="SD Negeri Tembalang 01 (Terpilih)", props={"fontSize": 14, "fill": C_DARK})
    create_node("text", "Res Sub", 55, 332, parent=f, text="NPSN: 20328912 | Jl. Banjarsari No. 12, Kec. Tembalang", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("rectangle", "Res Div", 55, 355, 490, 1, parent=f, props={"fill": C_DIVIDER})
    create_node("text", "Res Dapur", 55, 370, parent=f, text="* Dapur Penyuplai: SPPG Tembalang 01 (Jarak 2.4 KM)\n* Kuota Siswa: 450 Porsi/Hari (Kelas 1 - 6)\n* Status SLHS Dapur: Terverifikasi Laik Higiene Sanitasi", props={"fontSize": 11, "fill": C_DARK})
    # Map Preview Snippet
    create_node("text", "Map Tit", 590, 210, parent=f, text="Radius Lokasi Sekolah & Dapur Penyuplai:", props={"fontSize": 13, "fill": C_DARK})
    draw_image_box(f, "Map Snippet", 590, 235, 330, 240)
    create_node("text", "Map Cap", 650, 350, parent=f, text="[Peta Rute Distribusi Dapur]", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    # Bottom Actions
    create_node("rectangle", "Act Div 1", 40, 520, 880, 1, parent=f, props={"fill": C_DIVIDER})
    draw_button(f, "Btn L1 Batal", 40, 545, 120, 42, "Batal / Kembali", variant="outline")
    draw_button(f, "Btn L1 Next", 760, 545, 160, 42, "Lanjut ke Masalah ->", variant="primary")
    draw_footer(f, 1400)

    # 2.2: 27. Alur Lapor: Langkah 2 - Masalah & Kategori
    f = start_frame(1, 1, "27. Lapor Step 2 - Masalah", "27. Alur Lapor: Langkah 2 - Masalah & Kategori")
    draw_navbar(f, "Lapor")
    create_node("text", "L2 Tit", 40, 80, parent=f, text="Formulir Pelaporan Masalah MBG", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "L2 Sub", 40, 110, parent=f, text="Tentukan jenis permasalahan makanan dan estimasi dampak yang terjadi.", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    draw_stepper(f, 1)
    create_node("text", "Kat Label", 40, 210, parent=f, text="Pilih Kategori Permasalahan Utama *", props={"fontSize": 13, "fill": C_DARK})
    chips = ["Porsi Lauk Kurang", "Makanan Berbau / Basi", "Benda Asing (Rambut/Krikil)", "Wadah Kotor / Berminyak", "Distribusi Terlambat", "Darurat Medis / Gejala Mual"]
    cx, cy = 40, 235
    for c_idx, c_name in enumerate(chips):
        is_sel = (c_idx == 1)
        c_bg = C_DARK if is_sel else "#FFFFFF"
        c_txt = "#FFFFFF" if is_sel else C_DARK
        cw = len(c_name) * 8 + 24
        create_node("rectangle", f"Chip2_{c_idx}", cx, cy, cw, 34, parent=f, props={"fill": c_bg, "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 17})
        create_node("text", f"Chip2Txt_{c_idx}", cx + 12, cy + 9, parent=f, text=c_name, props={"fontSize": 11, "fill": c_txt})
        cx += cw + 12
        if cx > 500:
            cx = 40
            cy += 44
    create_node("text", "Wkt Label", 40, 350, parent=f, text="Waktu & Sesi Pembagian Makanan *", props={"fontSize": 13, "fill": C_DARK})
    draw_input(f, "Input Waktu 2", 40, 375, 260, 44, "2026-11-04  10:30 WIB")
    draw_input(f, "Input Porsi 2", 320, 375, 240, 44, "Perkiraan 35 siswa terdampak")
    # Emergency Checkbox
    create_node("rectangle", "Em Box", 40, 445, 520, 75, parent=f, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("rectangle", "Em Check", 55, 460, 18, 18, parent=f, props={"fill": C_DARK, "cornerRadius": 3})
    create_node("text", "Em Check Icon", 59, 462, parent=f, text="X", props={"fontSize": 12, "fill": "#FFFFFF"})
    create_node("text", "Em Tit", 85, 458, parent=f, text="Terdapat siswa yang mengeluhkan mual/muntah (Gejala Medis)", props={"fontSize": 12, "fill": C_DARK})
    create_node("text", "Em Sub", 85, 478, width=450, parent=f, text="Laporan dengan indikasi medis akan otomatis dialirkan dengan prioritas tertinggi ke Dinas Kesehatan (SLA: 2 Jam).", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    # Right Column Info Card
    create_node("rectangle", "Side Help 2", 590, 235, 330, 285, parent=f, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "SH Tit 2", 610, 255, parent=f, text="Standar Porsi MBG Resmi BGN:", props={"fontSize": 13, "fill": C_DARK})
    create_node("text", "SH Body 2", 610, 285, width=290, parent=f, text="* Nasi: 100 - 150 gram\n* Lauk Hewani: 40 - 50 gram (Ayam/Ikan/Daging)\n* Lauk Nabati: 25 - 30 gram (Tahu/Tempe)\n* Sayur: 75 gram (Matang)\n* Buah: 1 Buah Segar (Pisang/Jeruk)\n* Susu: 200 ml (Kemasan Tertutup)\n\nJika porsi yang diterima kurang dari 70% standar di atas, pilih kategori 'Porsi Lauk Kurang'.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("rectangle", "Act Div 2", 40, 545, 880, 1, parent=f, props={"fill": C_DIVIDER})
    draw_button(f, "Btn L2 Prev", 40, 570, 120, 42, "<- Kembali", variant="outline")
    draw_button(f, "Btn L2 Next", 760, 570, 160, 42, "Lanjut ke Cerita ->", variant="primary")
    draw_footer(f, 1400)

    # 2.3: 28. Alur Lapor: Langkah 3 - Kronologi & Cerita
    f = start_frame(1, 2, "28. Lapor Step 3 - Cerita", "28. Alur Lapor: Langkah 3 - Kronologi & Cerita")
    draw_navbar(f, "Lapor")
    create_node("text", "L3 Tit", 40, 80, parent=f, text="Formulir Pelaporan Masalah MBG", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "L3 Sub", 40, 110, parent=f, text="Deskripsikan fakta temuan secara rinci untuk membantu penyelidikan verifikator.", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    draw_stepper(f, 2)
    create_node("text", "Cerita Label", 40, 210, parent=f, text="Cerita & Kronologi Lengkap Kejadian *", props={"fontSize": 13, "fill": C_DARK})
    create_node("rectangle", "Textarea Box 3", 40, 235, 520, 180, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "Textarea Txt 3", 55, 250, width=490, parent=f, text="Sayur sop yang diterima kelas 4A berbau asam menyengat dan kuah terlihat berbusa halus. Setelah dicicipi oleh perwakilan guru, sayur terasa asam tidak wajar sehingga pembagian langsung dihentikan. Namun terdapat 2 siswa yang sudah sempat menelan kuah dan mengeluhkan perut mual.", props={"fontSize": 12, "fill": C_DARK})
    # Quick symptom chips
    create_node("text", "Sym Label", 40, 435, parent=f, text="Pilih Karakteristik Kondisi Fisik (Multi-Pilih):", props={"fontSize": 12, "fill": C_DARK})
    syms = ["Bau Masam", "Kuah Berbusa", "Daging Belum Matang", "Tekstur Lendir", "Wadah Berminyak", "Nasi Kering/Keras"]
    sx, sy = 40, 460
    for s_idx, s_txt in enumerate(syms):
        is_s_sel = (s_idx < 2)
        create_node("rectangle", f"SymBox {s_idx}", sx, sy, 120, 28, parent=f, props={"fill": C_DARK if is_s_sel else "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 14})
        create_node("text", f"SymTxt {s_idx}", sx + 12, sy + 7, parent=f, text=s_txt, props={"fontSize": 10, "fill": "#FFFFFF" if is_s_sel else C_DARK})
        sx += 130
        if sx > 450:
            sx = 40
            sy += 36
    # Right Column Helper Card
    create_node("rectangle", "Side Help 3", 590, 235, 330, 285, parent=f, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "SH Tit 3", 610, 255, parent=f, text="Tips Kronologi yang Efektif:", props={"fontSize": 13, "fill": C_DARK})
    create_node("text", "SH Body 3", 610, 285, width=290, parent=f, text="1. Jelaskan waktu persis makanan dibuka.\n2. Tuliskan kelas atau ruang tempat kejadian.\n3. Sebutkan jumlah porsi yang terdampak.\n4. Deskripsikan panca indera (aroma, rasa, tekstur, visual).\n5. Hindari asumsi atau tuduhan personal; tuliskan fakta obyektif di tempat kejadian.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("rectangle", "Act Div 3", 40, 545, 880, 1, parent=f, props={"fill": C_DIVIDER})
    draw_button(f, "Btn L3 Prev", 40, 570, 120, 42, "<- Kembali", variant="outline")
    draw_button(f, "Btn L3 Next", 760, 570, 160, 42, "Lanjut ke Bukti ->", variant="primary")
    draw_footer(f, 1400)

    # 2.4: 29. Alur Lapor: Langkah 4 - Bukti Foto & EXIF
    f = start_frame(1, 3, "29. Lapor Step 4 - Bukti", "29. Alur Lapor: Langkah 4 - Bukti Foto & EXIF")
    draw_navbar(f, "Lapor")
    create_node("text", "L4 Tit", 40, 80, parent=f, text="Formulir Pelaporan Masalah MBG", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "L4 Sub", 40, 110, parent=f, text="Unggah bukti foto nampan makanan. Sistem AI akan memvalidasi keaslian EXIF kamera.", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    draw_stepper(f, 3)
    create_node("text", "Drop Tit", 40, 210, parent=f, text="Unggah Berkas Foto Bukti Makanan (Wajib) *", props={"fontSize": 13, "fill": C_DARK})
    draw_image_box(f, "Photo Dropzone 4", 40, 235, 520, 260)
    create_node("rectangle", "Cam Cir", 270, 310, 60, 60, parent=f, props={"fill": C_DARK, "cornerRadius": 30})
    create_node("text", "Cam Ico", 290, 330, parent=f, text="FOTO", props={"fontSize": 11, "fill": "#FFFFFF"})
    create_node("text", "Drop Help 1", 200, 385, parent=f, text="Tarik foto ke area ini atau klik untuk mengambil berkas", props={"fontSize": 12, "fill": C_DARK})
    create_node("text", "Drop Help 2", 185, 410, parent=f, text="Format JPG, PNG, atau HEIC. Maksimal 10 MB per foto.", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    draw_button(f, "Btn Upload File", 220, 440, 160, 36, "Pilih Foto Kamera Asli", variant="outline")
    # EXIF Extraction Card
    create_node("rectangle", "Exif Ext Box", 590, 235, 330, 260, parent=f, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "EE Tit", 610, 255, parent=f, text="Validasi Metadata EXIF Otomatis:", props={"fontSize": 13, "fill": C_DARK})
    create_node("text", "EE Details", 610, 285, width=290, parent=f, text="* Status File: img_omprengan_sop.jpg (3.2 MB)\n* Perangkat Kamera: iPhone 13 (Kamera Asli)\n* Timestamp Potret: 04 Nov 2026, 10:28:14 WIB\n* Koordinat GPS: -7.0512, 110.4371\n* Radius Lokasi: Cocok 100% di area SD Tembalang 01\n* Skor Integritas AI: 98% (Sah & Asli)", props={"fontSize": 11, "fill": C_DARK})
    create_node("rectangle", "Trust Badge", 610, 435, 290, 36, parent=f, props={"fill": C_DARK, "cornerRadius": 4})
    create_node("text", "TB Txt", 640, 446, parent=f, text="BUKTI TERVERIFIKASI ASLI OLEH SISTEM", props={"fontSize": 10, "fill": "#FFFFFF"})
    create_node("rectangle", "Act Div 4", 40, 520, 880, 1, parent=f, props={"fill": C_DIVIDER})
    draw_button(f, "Btn L4 Prev", 40, 545, 120, 42, "<- Kembali", variant="outline")
    draw_button(f, "Btn L4 Next", 760, 545, 160, 42, "Lanjut ke Identitas ->", variant="primary")
    draw_footer(f, 1400)

    # 2.5: 30. Alur Lapor: Langkah 5 - Identitas & Konfirmasi
    f = start_frame(1, 4, "30. Lapor Step 5 - Identitas", "30. Alur Lapor: Langkah 5 - Identitas & Konfirmasi")
    draw_navbar(f, "Lapor")
    create_node("text", "L5 Tit", 40, 80, parent=f, text="Formulir Pelaporan Masalah MBG", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "L5 Sub", 40, 110, parent=f, text="Pilih tingkat kerahasiaan identitas dan periksa kembali ringkasan sebelum dikirim.", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    draw_stepper(f, 4)
    create_node("text", "Priv Tit", 40, 210, parent=f, text="Pilih Tingkat Kerahasiaan Identitas Pelapor *", props={"fontSize": 13, "fill": C_DARK})
    priv_modes = [("Mode Rahasia (Direkomendasikan)", "Nama hanya dibuka kepada Tim Verifikator Independen untuk konfirmasi. Dapur SPPG & Sekolah tidak akan mengetahui identitas Anda.", True), ("Mode Anonim Penuh", "Data pribadi Anda disamarkan total dari seluruh pihak. Notifikasi status hanya dapat dipantau melalui kode tiket unik.", False), ("Mode Publik Terbuka", "Nama Anda ditampilkan di feed transparansi publik sebagai wujud partisipasi warga aktif.", False)]
    my = 235
    for idx, (mtit, mdesc, mact) in enumerate(priv_modes):
        create_node("rectangle", f"PrivBox {idx}", 40, my, 520, 75, parent=f, props={"fill": "#FFFFFF", "stroke": C_DARK if mact else C_BORDER, "strokeWeight": 1.5 if mact else 1, "cornerRadius": 4})
        create_node("rectangle", f"RadioCir {idx}", 55, my + 15, 18, 18, parent=f, props={"fill": C_DARK if mact else "#FFFFFF", "stroke": C_DARK, "strokeWeight": 1, "cornerRadius": 9})
        if mact:
            create_node("ellipse", f"RadioDot {idx}", 60, my + 20, 8, 8, parent=f, props={"fill": "#FFFFFF"})
        create_node("text", f"MTit {idx}", 85, my + 14, parent=f, text=mtit, props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"MDesc {idx}", 85, my + 34, width=460, parent=f, text=mdesc, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        my += 85
    # Summary Card
    create_node("rectangle", "Summ Box", 590, 235, 330, 245, parent=f, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "Summ Tit", 610, 255, parent=f, text="Ringkasan Aduan Anda:", props={"fontSize": 13, "fill": C_DARK})
    create_node("text", "Summ Details", 610, 285, width=290, parent=f, text="* Sekolah: SD Negeri Tembalang 01\n* Dapur Penyuplai: SPPG Tembalang 01\n* Masalah: Makanan Berbau / Basi\n* Bukti Foto: 1 Berkas (Metadata Valid)\n* Tingkat Privasi: Rahasia\n* Estimasi Respon SLA: Maksimal 2 Jam", props={"fontSize": 11, "fill": C_DARK})
    create_node("rectangle", "Act Div 5", 40, 520, 880, 1, parent=f, props={"fill": C_DIVIDER})
    draw_button(f, "Btn L5 Prev", 40, 545, 120, 42, "<- Kembali", variant="outline")
    draw_button(f, "Btn L5 Submit", 680, 545, 240, 44, "Kirim Laporan Resmi (SLA Aktif)", variant="primary")
    draw_footer(f, 1400)

    # 2.6: 31. Alur Lapor: Langkah 6 - Sukses
    f = start_frame(1, 5, "31. Lapor Step 6 - Sukses", "31. Alur Lapor: Langkah 6 - Tiket Sukses")
    draw_navbar(f, "Lapor")
    create_node("rectangle", "Succ Box", 180, 120, 600, 640, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 6})
    create_node("ellipse", "Succ Cir", 450, 160, 60, 60, parent=f, props={"fill": C_DARK})
    create_node("text", "Succ Ico", 468, 180, parent=f, text="[V]", props={"fontSize": 16, "fill": "#FFFFFF"})
    create_node("text", "Succ Tit", 300, 240, parent=f, text="Laporan Pengaduan Berhasil Terkirim!", props={"fontSize": 18, "fill": C_DARK})
    create_node("text", "Succ Sub", 240, 270, width=480, parent=f, text="Laporan Anda telah berhasil dicatat ke sistem pemantau terdistribusi. Tim Verifikator Independen akan memeriksa laporan dalam batas waktu SLA 2 jam.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    # Ticket Badge Box
    create_node("rectangle", "Tik Box 6", 240, 330, 480, 90, parent=f, props={"fill": "#FAFAFA", "stroke": C_DARK, "strokeWeight": 1.5, "cornerRadius": 4})
    create_node("text", "Tik Lbl 6", 260, 345, parent=f, text="KODE TIKET RESMI ANDA:", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "Tik Val 6", 260, 368, parent=f, text="#MBG-AG2MWK", props={"fontSize": 24, "fill": C_DARK})
    draw_button(f, "Btn Copy Tik", 580, 355, 120, 36, "Salin Tiket", variant="outline")
    # 4 Steps SLA Progress
    create_node("text", "Sla Tit 6", 240, 445, parent=f, text="Alur Penanganan Laporan Anda:", props={"fontSize": 12, "fill": C_DARK})
    st6_items = [("1. Diterima", True), ("2. Verifikasi AI (2 Jam)", False), ("3. Tindak Lanjut SPPG (18 Jam)", False), ("4. Selesai", False)]
    s6x = 240
    for idx, (s6_lbl, s6_done) in enumerate(st6_items):
        create_node("rectangle", f"S6Box {idx}", s6x, 470, 110, 30, parent=f, props={"fill": C_DARK if s6_done else C_LIGHT_BG, "cornerRadius": 3})
        create_node("text", f"S6Txt {idx}", s6x + 8, 478, parent=f, text=s6_lbl, props={"fontSize": 9, "fill": "#FFFFFF" if s6_done else C_TEXT_MAIN})
        s6x += 122
    draw_button(f, "Btn Pantau Tik", 240, 530, 480, 44, "Pantau Status Laporan Ini Sekarang", variant="primary")
    draw_button(f, "Btn Unduh Tanda", 240, 585, 480, 40, "Unduh Bukti Tanda Terima (PDF)", variant="outline")
    draw_button(f, "Btn Home 6", 240, 635, 480, 34, "Kembali ke Beranda Utama", variant="subtle")
    draw_footer(f, 1400)

    # 2.7: 25. Portal Masuk Multi-Persona
    f = start_frame(1, 6, "25. Masuk Persona Multi-Role", "25. Autentikasi & Pemilih Peran Multi-Role")
    draw_navbar(f, "Panduan")
    lx, ly = 220, 100
    create_node("rectangle", "Login Card", lx, ly, 520, 760, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 6})
    create_node("rectangle", "Lock Box", lx + 235, ly + 30, 50, 50, parent=f, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 25})
    create_node("text", "Lock Icon", lx + 252, ly + 46, parent=f, text="[KEY]", props={"fontSize": 12, "fill": C_DARK})
    create_node("text", "Login Title", lx + 140, ly + 95, parent=f, text="Masuk ke Portal PMBGM", props={"fontSize": 20, "fill": C_DARK})
    create_node("text", "Login Sub", lx + 105, ly + 125, parent=f, text="Pilih peran akun Anda untuk mengakses sistem pengawasan MBG.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "Role Label", lx + 40, ly + 165, parent=f, text="Pilih Peran Akun Pengguna *", props={"fontSize": 12, "fill": C_DARK})
    roles = [("Warga / Wali Murid", True), ("Verifikator Independen", False), ("Pengelola Dapur SPPG", False), ("Dinas Kesehatan (Dinkes)", False), ("Korwil Wilayah BGN", False), ("Administrator Sistem", False)]
    rx_col1, rx_col2 = lx + 40, lx + 270
    ry_row = ly + 190
    for r_idx, (r_name, is_act) in enumerate(roles):
        rx = rx_col1 if r_idx % 2 == 0 else rx_col2
        r_border = C_DARK if is_act else C_BORDER
        r_bg = "#FAFAFA" if is_act else "#FFFFFF"
        create_node("rectangle", f"RoleCard {r_idx}", rx, ry_row, 210, 42, parent=f, props={"fill": r_bg, "stroke": r_border, "strokeWeight": 1.5 if is_act else 1, "cornerRadius": 4})
        prefix = "[*] " if is_act else "[ ] "
        create_node("text", f"RoleTxt {r_idx}", rx + 12, ry_row + 14, parent=f, text=f"{prefix}{r_name}", props={"fontSize": 11, "fill": C_DARK})
        if r_idx % 2 == 1:
            ry_row += 50
    create_node("text", "Email Label", lx + 40, ly + 360, parent=f, text="Email atau Nomor WhatsApp Terdaftar *", props={"fontSize": 12, "fill": C_DARK})
    draw_input(f, "Input Email", lx + 40, ly + 382, 440, 44, "nama@email.com / 081234567890")
    create_node("text", "Pass Label", lx + 40, ly + 440, parent=f, text="Kata Sandi Akun *", props={"fontSize": 12, "fill": C_DARK})
    draw_input(f, "Input Pass", lx + 40, ly + 462, 440, 44, "****************")
    create_node("text", "Ingat Saya", lx + 40, ly + 520, parent=f, text="[X]  Ingat sesi masuk di perangkat ini", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("text", "Lupa Pass", lx + 360, ly + 520, parent=f, text="Lupa kata sandi?", props={"fontSize": 11, "fill": C_DARK})
    draw_button(f, "Btn Login Submit", lx + 40, ly + 555, 440, 46, "Masuk Sekarang ->", variant="primary")
    draw_button(f, "Btn Demo Switcher", lx + 40, ly + 612, 440, 42, "Masuk Cepat sebagai Tamu / Demo", variant="outline")
    create_node("text", "Daftar Link", lx + 130, ly + 675, parent=f, text="Belum punya akun?  Daftar sebagai Warga Baru", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    draw_footer(f, 1400)

    # Save Progress
    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'save_file', 'arguments': {'path': docs_figcraft}}})
    print(" -> Section 2 selesai.")

    # =========================================================================
    # ROW 2: SECTION 03 - PORTAL SATU DATA TERBUKA & PETA SPASIAL (7 Layar)
    # =========================================================================
    print(" -> [Row 2] Section 3: Satu Data Terbuka & Spasial (08, 09, 10, 11, 12, 13, 15)...")
    add_section_header(2, "SECTION 03: PORTAL SATU DATA TERBUKA & PETA SPASIAL (/data)", "Transparansi data anggaran, direktori dapur SPPG, peta sebaran MBG Jateng, dan pusat dataset terbuka.")

    # 3.1: 08. Direktori Sekolah Sasaran MBG
    f = start_frame(2, 0, "08. Direktori 165 Sekolah", "08. Direktori Sekolah Sasaran MBG (/cari-sekolah)")
    draw_navbar(f, "Beranda")
    create_node("text", "Sch Tit", 40, 80, parent=f, text="Direktori 165 Sekolah Sasaran MBG Kota Semarang", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "Sch Sub", 40, 110, parent=f, text="Daftar lengkap sekolah penerima manfaat, dapur SPPG penyuplai, dan riwayat pemantauan.", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    draw_input(f, "Search Sch", 40, 145, 420, 42, "Ketik nama sekolah atau NPSN...")
    draw_input(f, "Drop Kec", 480, 145, 180, 42, "Semua Kecamatan v")
    draw_input(f, "Drop Jenjang", 680, 145, 140, 42, "Jenjang: Semua v")
    draw_button(f, "Btn Filter Sch", 840, 145, 80, 42, "Cari", variant="primary")
    schools = [("SD Negeri Tembalang 01", "NPSN: 20328912 | Kec. Tembalang", "SPPG Tembalang 01", "SLHS Valid", "Aman"), ("SMP Negeri 08 Semarang", "NPSN: 20328841 | Kec. Candisari", "SPPG Candisari 02", "SLHS Valid", "Aman"), ("SD Sendangmulyo 02", "NPSN: 20328905 | Kec. Tembalang", "SPPG Tembalang 01", "SLHS Valid", "Perlu Pantau"), ("SD Negeri Banyumanik 03", "NPSN: 20328760 | Kec. Banyumanik", "SPPG Banyumanik 01", "SLHS Valid", "Aman"), ("SMP Negeri 02 Semarang", "NPSN: 20328835 | Kec. Semarang Tengah", "SPPG Tengah 01", "SLHS Valid", "Aman"), ("SD Pedurungan Kidul 01", "NPSN: 20328955 | Kec. Pedurungan", "SPPG Pedurungan 02", "SLHS Valid", "Aman")]
    s_positions = [(40, 215), (345, 215), (650, 215), (40, 495), (345, 495), (650, 495)]
    for idx, (s_name, s_npsn, s_sppg, s_slhs, s_risk) in enumerate(schools):
        sx, sy = s_positions[idx]
        create_node("rectangle", f"SCard {idx}", sx, sy, 275, 250, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
        draw_image_box(f, f"SCard Img {idx}", sx, sy, 275, 125)
        create_node("text", f"STit {idx}", sx + 14, sy + 138, parent=f, text=s_name, props={"fontSize": 13, "fill": C_DARK})
        create_node("text", f"SNpsn {idx}", sx + 14, sy + 158, parent=f, text=s_npsn, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        draw_badge(f, f"SBdg1 {idx}", sx + 14, sy + 180, 125, 20, s_sppg, "subtle")
        draw_badge(f, f"SBdg2 {idx}", sx + 145, sy + 180, 85, 20, s_slhs, "outline")
        draw_button(f, f"SBtn {idx}", sx + 14, sy + 210, 247, 28, "Lihat Profil Sekolah", variant="outline")
    # Detail Section at bottom
    create_node("text", "Detail Sch Sec", 40, 780, parent=f, text="Pratinjau Keterhubungan Dapur & Distribusi (SD Negeri Tembalang 01)", props={"fontSize": 16, "fill": C_DARK})
    create_node("rectangle", "Sch Detail Box", 40, 810, 880, 240, parent=f, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    draw_image_box(f, "Sch Map Img", 60, 830, 360, 200)
    create_node("text", "SD Info 1", 450, 835, parent=f, text="Informasi Kemitraan MBG:", props={"fontSize": 14, "fill": C_DARK})
    create_node("text", "SD Info 2", 450, 865, parent=f, text="* Penerima Manfaat: 450 Siswa (Kelas 1 - 6)\n* Dapur Penyuplai: SPPG Tembalang 01 (Jarak 2.4 KM)\n* Jam Terima Makanan: 10:15 WIB (Standar SLA: Maks 10:30 WIB)\n* Status Kepatuhan: 100% Bebas Insiden Keracunan", props={"fontSize": 12, "fill": C_DARK})
    draw_button(f, "Btn Lapor Sch", 450, 970, 220, 40, "Laporkan Menu Sekolah Ini", variant="primary")
    draw_footer(f, 1400)

    # 3.2: 09. Portal Satu Data MBG Jawa Tengah
    f = start_frame(2, 1, "09. Satu Data MBG Jateng", "09. Portal Satu Data MBG Jawa Tengah (/data)")
    draw_navbar(f, "Data")
    create_node("text", "Data Tit", 40, 80, parent=f, text="Portal Satu Data Program MBG Jawa Tengah 2026", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "Data Sub", 40, 110, parent=f, text="Transparansi anggaran, serapan realisasi, dan profil 40 unit dapur penyedia gizi.", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    draw_button(f, "Btn Unduh Data", 780, 85, 140, 36, "Unduh CSV / API", variant="outline")
    draw_metric_card(f, 40, 145, 205, 90, "Pagu Anggaran", "Rp 142,5 M", "Pagu Alokasi MBG 2026")
    draw_metric_card(f, 265, 145, 205, 90, "Realisasi Terserap", "Rp 98,2 M", "68.9% Serapan Berjalan")
    draw_metric_card(f, 490, 145, 205, 90, "Siswa Penerima", "84.210", "Siswa SD & SMP Terdaftar")
    draw_metric_card(f, 715, 145, 205, 90, "Dapur SPPG", "40 Unit", "Dapur Aktif Teraudit")
    create_node("text", "Chart1 Tit", 40, 260, parent=f, text="Realisasi vs Pagu Anggaran per Bulan", props={"fontSize": 14, "fill": C_DARK})
    draw_image_box(f, "Chart1 Box", 40, 285, 520, 240)
    create_node("text", "Chart1 Mock", 180, 395, parent=f, text="[Grafik Komparasi Batang Realisasi Bulanan]", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    create_node("text", "Chart2 Tit", 580, 260, parent=f, text="Tren Pertumbuhan Siswa Penerima", props={"fontSize": 14, "fill": C_DARK})
    draw_image_box(f, "Chart2 Box", 580, 285, 340, 240)
    create_node("text", "Chart2 Mock", 660, 395, parent=f, text="[Grafik Garis Tren Penerima]", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    create_node("text", "Tbl Tit 9", 40, 555, parent=f, text="Rekapitulasi Kinerja Wilayah Kabupaten/Kota:", props={"fontSize": 16, "fill": C_DARK})
    create_node("rectangle", "Tbl Box 9", 40, 585, 880, 260, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("rectangle", "TH 9", 40, 585, 880, 36, parent=f, props={"fill": "#F4F4F5"})
    create_node("text", "TH9 1", 55, 596, parent=f, text="KAB/KOTA", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "TH9 2", 200, 596, parent=f, text="TOTAL SEKOLAH", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "TH9 3", 380, 596, parent=f, text="DAPUR SPPG", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "TH9 4", 540, 596, parent=f, text="REALISASI DANA", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "TH9 5", 720, 596, parent=f, text="KEPATUHAN SLHS", props={"fontSize": 10, "fill": C_DARK})
    rows_9 = [("Kota Semarang", "165 Sekolah", "40 Dapur", "Rp 98.2 M (68.9%)", "95.0% Valid"), ("Kab. Banyumas", "142 Sekolah", "32 Dapur", "Rp 84.5 M (65.2%)", "92.4% Valid"), ("Kota Surakarta", "98 Sekolah", "22 Dapur", "Rp 62.1 M (71.0%)", "96.2% Valid"), ("Kab. Magelang", "110 Sekolah", "25 Dapur", "Rp 70.4 M (64.8%)", "91.0% Valid")]
    ry = 621
    for idx, (c1, c2, c3, c4, c5) in enumerate(rows_9):
        create_node("rectangle", f"TR9 {idx}", 40, ry, 880, 44, parent=f, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
        create_node("text", f"TD9 1 {idx}", 55, ry + 14, parent=f, text=c1, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"TD9 2 {idx}", 200, ry + 14, parent=f, text=c2, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("text", f"TD9 3 {idx}", 380, ry + 14, parent=f, text=c3, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("text", f"TD9 4 {idx}", 540, ry + 14, parent=f, text=c4, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"TD9 5 {idx}", 720, ry + 14, parent=f, text=c5, props={"fontSize": 11, "fill": C_DARK})
        ry += 44
    draw_footer(f, 1400)

    # 3.3: 10. Direktori 40 Dapur SPPG
    f = start_frame(2, 2, "10. Direktori Dapur SPPG", "10. Direktori 40 Unit Dapur SPPG (/data/sppg)")
    draw_navbar(f, "Data")
    create_node("text", "Dap Tit", 40, 80, parent=f, text="Direktori 40 Dapur Sentra Pengolahan Pangan (SPPG)", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "Dap Sub", 40, 110, parent=f, text="Daftar mitra penyedia makanan bergizi, akreditasi higienitas SLHS, dan skor indeks risiko SAW.", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    draw_input(f, "Search Dap", 40, 145, 420, 42, "Cari nama dapur atau lokasi kecamatan...")
    draw_input(f, "Drop SLHS", 480, 145, 200, 42, "Status SLHS: Semua v")
    draw_button(f, "Btn Filter Dap", 700, 145, 100, 42, "Terapkan", variant="primary")
    dapurs = [("SPPG Tembalang 01", "Kec. Tembalang", "3.500 Porsi/Hari", "SLHS Valid", "Vi = 0.312 (Aman)"), ("SPPG Candisari 02", "Kec. Candisari", "2.800 Porsi/Hari", "SLHS Valid", "Vi = 0.450 (Sedang)"), ("SPPG Gayamsari 01", "Kec. Gayamsari", "4.200 Porsi/Hari", "SLHS Kedaluwarsa", "Vi = 0.880 (Audit)"), ("SPPG Banyumanik 01", "Kec. Banyumanik", "3.000 Porsi/Hari", "SLHS Valid", "Vi = 0.285 (Aman)"), ("SPPG Tengah 01", "Kec. Semarang Tengah", "3.800 Porsi/Hari", "SLHS Valid", "Vi = 0.340 (Aman)"), ("SPPG Pedurungan 02", "Kec. Pedurungan", "3.200 Porsi/Hari", "SLHS Valid", "Vi = 0.390 (Aman)")]
    d_positions = [(40, 215), (345, 215), (650, 215), (40, 495), (345, 495), (650, 495)]
    for idx, (d_name, d_kec, d_cap, d_slhs, d_saw) in enumerate(dapurs):
        dx, dy = d_positions[idx]
        create_node("rectangle", f"DapCard {idx}", dx, dy, 275, 250, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
        draw_image_box(f, f"DapImg {idx}", dx, dy, 275, 120)
        create_node("text", f"DTit {idx}", dx + 14, dy + 135, parent=f, text=d_name, props={"fontSize": 13, "fill": C_DARK})
        create_node("text", f"DKec {idx}", dx + 14, dy + 155, parent=f, text=f"{d_kec} | Kapasitas: {d_cap}", props={"fontSize": 10, "fill": C_TEXT_MUTED})
        draw_badge(f, f"DSlhs {idx}", dx + 14, dy + 180, 110, 20, d_slhs, "subtle")
        draw_badge(f, f"DSaw {idx}", dx + 130, dy + 180, 130, 20, d_saw, "outline")
        draw_button(f, f"DBtn {idx}", dx + 14, dy + 210, 247, 28, "Lihat Profil Dapur", variant="outline")
    draw_footer(f, 1400)

    # 3.4: 11. Profil Detail Dapur SPPG
    f = start_frame(2, 3, "11. Profil Detail SPPG", "11. Profil Detail Dapur SPPG Tembalang 01")
    draw_navbar(f, "Data")
    create_node("text", "PD Tit", 40, 80, parent=f, text="Profil Unit Dapur: SPPG Tembalang 01", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "PD Sub", 40, 110, parent=f, text="Kode Dapur: SPPG-TB-01 * Terakreditasi Dinas Kesehatan Kota Semarang", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    # Top Stats
    draw_metric_card(f, 40, 145, 275, 90, "Kapasitas Harian", "3.500 Porsi", "Melayani 8 Sekolah")
    draw_metric_card(f, 345, 145, 275, 90, "Status Sertifikat SLHS", "TERVERIFIKASI", "Masa Berlaku s/d Des 2027")
    draw_metric_card(f, 645, 145, 275, 90, "Skor Preferensi SAW", "Vi = 0.312", "Tingkat Risiko: Rendah (Aman)")
    # Left: Facilities & Address
    create_node("text", "Fac Tit", 40, 260, parent=f, text="Foto Fasilitas & Sanitasi Dapur:", props={"fontSize": 14, "fill": C_DARK})
    draw_image_box(f, "Fac Img 1", 40, 285, 425, 220)
    create_node("text", "Fac Desc", 40, 520, width=425, parent=f, text="Alamat: Jl. Prof. Soedarto No. 45, Tembalang, Semarang\nPenanggung Jawab: Ibu Hj. Nurul Hidayah, S.Gz\nSertifikasi Halal: ID331100029104 * Uji Lab Berkala: 14 Hari Sekali", props={"fontSize": 11, "fill": C_DARK})
    # Right: School List & History
    create_node("text", "Sch List Tit", 495, 260, parent=f, text="Sekolah yang Dilayani (8 Sekolah):", props={"fontSize": 14, "fill": C_DARK})
    create_node("rectangle", "Sch List Box", 495, 285, 425, 310, parent=f, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    p_schools = ["1. SD Negeri Tembalang 01 (450 Siswa)", "2. SD Negeri Tembalang 02 (380 Siswa)", "3. SMP Negeri 08 Semarang (620 Siswa)", "4. SD Sendangmulyo 01 (410 Siswa)", "5. SD Sendangmulyo 02 (390 Siswa)", "6. SMP Negeri 27 Semarang (550 Siswa)", "7. SD Meteseh 01 (350 Siswa)", "8. SD Rowosari 02 (350 Siswa)"]
    psy = 300
    for ps in p_schools:
        create_node("text", f"PSch_{psy}", 515, psy, parent=f, text=ps, props={"fontSize": 11, "fill": C_DARK})
        psy += 34
    draw_footer(f, 1400)

    # 3.5: 12. Peta Geospasial Sebaran MBG
    f = start_frame(2, 4, "12. Peta Spasial Jawa Tengah", "12. Peta Spasial Distribusi & Pengawasan MBG")
    draw_navbar(f, "Data")
    create_node("text", "Map Main Tit", 40, 80, parent=f, text="Peta Interaktif Spasial Pengawasan MBG Jawa Tengah", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "Map Main Sub", 40, 110, parent=f, text="Sebaran titik dapur SPPG, 165 sekolah sasaran, dan klaster pelaporan pengaduan warga.", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    # Map Container
    draw_image_box(f, "Huge Map Box", 40, 145, 880, 520)
    create_node("text", "Map Watermark", 330, 390, parent=f, text="[Peta Tematik Spasial 35 Kab/Kota Jawa Tengah]", props={"fontSize": 14, "fill": C_TEXT_MUTED})
    # Map Controls Overlay
    create_node("rectangle", "Ctrl Box", 60, 165, 240, 160, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "Ctrl Tit", 75, 180, parent=f, text="Lapisan Peta (Layers):", props={"fontSize": 12, "fill": C_DARK})
    create_node("text", "Ctrl L1", 75, 205, parent=f, text="[X] Titik 40 Dapur SPPG", props={"fontSize": 11, "fill": C_DARK})
    create_node("text", "Ctrl L2", 75, 230, parent=f, text="[X] 165 Sekolah Penerima", props={"fontSize": 11, "fill": C_DARK})
    create_node("text", "Ctrl L3", 75, 255, parent=f, text="[X] Klaster Kasus Terverifikasi", props={"fontSize": 11, "fill": C_DARK})
    create_node("text", "Ctrl L4", 75, 280, parent=f, text="[ ] Radius Risiko KLB (Dinkes)", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    # 3 Summary Cards at bottom
    draw_metric_card(f, 40, 690, 275, 90, "Kota Semarang (Fokus)", "165 Sekolah / 40 SPPG", "94.8% SLA Terpenuhi")
    draw_metric_card(f, 345, 690, 275, 90, "Kab. Banyumas (Pilot 2)", "142 Sekolah / 32 SPPG", "92.4% SLA Terpenuhi")
    draw_metric_card(f, 645, 690, 275, 90, "Kota Surakarta (Pilot 3)", "98 Sekolah / 22 SPPG", "96.2% SLA Terpenuhi")
    draw_footer(f, 1400)

    # 3.6: 13. Drilldown Wilayah: Kota Semarang
    f = start_frame(2, 5, "13. Drilldown Kota Semarang", "13. Drilldown Wilayah: Kota Semarang (33.74)")
    draw_navbar(f, "Data")
    create_node("text", "Sem Tit", 40, 80, parent=f, text="Profil Pemantauan Wilayah: Kota Semarang", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "Sem Sub", 40, 110, parent=f, text="Rincian 16 kecamatan, kepatuhan sertifikasi SLHS dapur, dan alokasi makanan harian.", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    draw_metric_card(f, 40, 145, 205, 90, "Total Kecamatan", "16 Kecamatan", "100% Terlayani MBG")
    draw_metric_card(f, 265, 145, 205, 90, "Sekolah Terdaftar", "165 Unit", "SD, SMP, & Madrasah")
    draw_metric_card(f, 490, 145, 205, 90, "Dapur Penyuplai", "40 Dapur", "38 Valid, 2 Kedaluwarsa")
    draw_metric_card(f, 715, 145, 205, 90, "Insiden Terselesaikan", "114 / 119", "Rasio Tuntas 95.7%")
    create_node("text", "Kec Tbl Tit", 40, 260, parent=f, text="Rekapitulasi 16 Kecamatan di Kota Semarang:", props={"fontSize": 14, "fill": C_DARK})
    create_node("rectangle", "Kec Box", 40, 285, 880, 320, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("rectangle", "KTH", 40, 285, 880, 36, parent=f, props={"fill": "#F4F4F5"})
    create_node("text", "KTH 1", 55, 296, parent=f, text="KECAMATAN", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "KTH 2", 220, 296, parent=f, text="JUMLAH SEKOLAH", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "KTH 3", 380, 296, parent=f, text="DAPUR PENYUPLAI", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "KTH 4", 540, 296, parent=f, text="KASUS MASUK", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "KTH 5", 680, 296, parent=f, text="SKOR SAW WILAYAH", props={"fontSize": 10, "fill": C_DARK})
    kecs = [("Tembalang", "18 Sekolah", "4 Dapur SPPG", "28 Kasus (27 Selesai)", "0.320 (Aman)"), ("Candisari", "14 Sekolah", "3 Dapur SPPG", "22 Kasus (21 Selesai)", "0.410 (Sedang)"), ("Banyumanik", "16 Sekolah", "4 Dapur SPPG", "19 Kasus (18 Selesai)", "0.290 (Aman)"), ("Semarang Barat", "15 Sekolah", "3 Dapur SPPG", "25 Kasus (23 Selesai)", "0.380 (Sedang)"), ("Gayamsari", "12 Sekolah", "2 Dapur SPPG", "25 Kasus (21 Selesai)", "0.680 (Perlu Audit)")]
    kry = 321
    for idx, (c1, c2, c3, c4, c5) in enumerate(kecs):
        create_node("rectangle", f"KTR {idx}", 40, kry, 880, 48, parent=f, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
        create_node("text", f"KTD1 {idx}", 55, kry + 16, parent=f, text=c1, props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"KTD2 {idx}", 220, kry + 16, parent=f, text=c2, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("text", f"KTD3 {idx}", 380, kry + 16, parent=f, text=c3, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("text", f"KTD4 {idx}", 540, kry + 16, parent=f, text=c4, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"KTD5 {idx}", 680, kry + 16, parent=f, text=c5, props={"fontSize": 11, "fill": C_DARK})
        kry += 48
    draw_footer(f, 1400)

    # 3.7: 15. Pusat Unduh Dataset & API
    f = start_frame(2, 6, "15. Pusat Unduh Dataset & API", "15. Pusat Unduh Data & Akses API Publik")
    draw_navbar(f, "Data")
    create_node("text", "DL Tit", 40, 80, parent=f, text="Pusat Unduh Dataset & Dokumentasi API Publik", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "DL Sub", 40, 110, parent=f, text="Akses terbuka data program MBG sesuai prinsip Satu Data Indonesia dan lisensi CC BY 4.0.", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    # 4 Dataset Cards
    dsets = [("Dataset Direktori 165 Sekolah MBG", "Format CSV, JSON, XLSX | Ukuran: 1.4 MB | Diperbarui: 04 Nov 2026", "Memuat NPSN, nama sekolah, jenjang, koordinat GPS, dan dapur penyuplai."), ("Dataset Profil 40 Dapur SPPG & SLHS", "Format CSV, JSON | Ukuran: 820 KB | Diperbarui: 04 Nov 2026", "Memuat kapasitas porsi harian, masa berlaku sertifikat SLHS, dan rekam jejak sanitasi."), ("Dataset Rekapitulasi Anggaran MBG 2026", "Format CSV, XLSX | Ukuran: 2.1 MB | Diperbarui: 01 Nov 2026", "Alokasi pagu anggaran daerah, serapan per bulan, dan indeks efisiensi porsi."), ("Dataset Log Aduan Publik & Kinerja SLA", "Format CSV, JSON, REST API | Ukuran: 3.5 MB | Real-Time", "Data keluhan warga terverifikasi (disamarkan) dan riwayat durasi resolusi kasus.")]
    dy = 150
    for idx, (dtit, dmeta, ddesc) in enumerate(dsets):
        create_node("rectangle", f"DSBox {idx}", 40, dy, 880, 95, parent=f, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
        create_node("text", f"DSTit {idx}", 60, dy + 16, parent=f, text=dtit, props={"fontSize": 13, "fill": C_DARK})
        create_node("text", f"DSMeta {idx}", 60, dy + 38, parent=f, text=dmeta, props={"fontSize": 10, "fill": C_TEXT_MUTED})
        create_node("text", f"DSDesc {idx}", 60, dy + 58, width=620, parent=f, text=ddesc, props={"fontSize": 11, "fill": C_TEXT_MAIN})
        draw_button(f, f"BtnDL {idx}", 740, dy + 28, 150, 36, "Unduh Data (CSV)", variant="outline")
        dy += 115
    # API Card
    create_node("rectangle", "Api Box", 40, 630, 880, 160, parent=f, props={"fill": "#FFFFFF", "stroke": C_DARK, "strokeWeight": 1.5, "cornerRadius": 4})
    create_node("text", "Api Tit", 60, 650, parent=f, text="Dokumentasi REST API Publik PMBGM (v1):", props={"fontSize": 14, "fill": C_DARK})
    create_node("text", "Api Endpoints", 60, 680, width=830, parent=f, text="* GET https://pmbgm.semarangkota.go.id/api/v1/sekolah - Direktori sekolah dan kuota porsi\n* GET https://pmbgm.semarangkota.go.id/api/v1/sppg - Data 40 dapur dan status SLHS\n* GET https://pmbgm.semarangkota.go.id/api/v1/kasus/terbuka - Kasus publik dan metrik SLA\n* Autentikasi: Public Bearer Token (Rate Limit: 60 req/min)", props={"fontSize": 11, "fill": C_DARK})
    draw_footer(f, 1400)

    # Save Progress
    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'save_file', 'arguments': {'path': docs_figcraft}}})
    print(" -> Section 3 selesai.")

    # =========================================================================
    # ROW 3: SECTION 04 - SISTEM PENDUKUNG KEPUTUSAN (DSS) & PRIORITAS SAW (6 Layar)
    # =========================================================================
    print(" -> [Row 3] Section 4: Sistem Pendukung Keputusan DSS & SAW (16 s/d 21)...")
    add_section_header(3, "SECTION 04: SISTEM PENDUKUNG KEPUTUSAN (DSS) & ANALISIS SAW (/insight)", "Perhitungan multi-kriteria SAW (C1-C5), perankingan audit dapur berisiko, peringatan dini KLB, dan formula algoritma.")

    # 4.1: 16. Dashboard Eksekutif DSS
    f = start_frame(3, 0, "16. Dashboard Eksekutif DSS", "16. Dashboard DSS & Riset MBG (/insight)")
    draw_navbar(f, "Insight")
    create_node("text", "Dss Tit", 40, 80, parent=f, text="Sistem Pendukung Keputusan (DSS) Pengawasan MBG", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "Dss Sub", 40, 110, parent=f, text="Analisis multi-kriteria cerdas untuk alokasi pengawasan dan mitigasi risiko pangan.", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    draw_metric_card(f, 40, 145, 275, 90, "Dapur Prioritas 1 (Kritis)", "1 Dapur", "Vi = 0.880 (SPPG Gayamsari)")
    draw_metric_card(f, 345, 145, 275, 90, "Dapur Prioritas 2 (Sedang)", "4 Dapur", "Vi antara 0.400 - 0.650")
    draw_metric_card(f, 645, 145, 275, 90, "Dapur Kategori Aman", "35 Dapur", "Kepatuhan Tinggi (Vi < 0.4)")
    create_node("text", "Radar Tit", 40, 260, parent=f, text="Radar Deteksi Dini Anomali Risiko Antar-Kecamatan:", props={"fontSize": 14, "fill": C_DARK})
    draw_image_box(f, "Radar Box", 40, 285, 880, 240)
    create_node("text", "Radar Mock", 340, 395, parent=f, text="[Grafik Radar Sebaran 5 Kriteria Risiko]", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    create_node("text", "Act Tit 16", 40, 555, parent=f, text="Rekomendasi Tindakan Sistem Berbasis Data:", props={"fontSize": 14, "fill": C_DARK})
    recs = [("1. Inspeksi Lapangan Khusus SPPG Gayamsari 01", "Ditemukan deviasi SLA berulang dan SLHS kedaluwarsa. Rekomendasi audit mendadak tim gabungan Korwil & Dinkes."), ("2. Pengujian Sampel Rutin Dapur Candisari 02", "Ditemukan keluhan rasa masam pada sayur sop. Perlu kalibrasi durasi simpan wadah termal."), ("3. Apresiasi Kinerja Unggul SPPG Banyumanik 01", "Kepatuhan SLA 99.2% dan zero incident. Layak menjadi percontohan standarisasi operasional.")]
    ry = 585
    for idx, (rtit, rdesc) in enumerate(recs):
        create_node("rectangle", f"RBox {idx}", 40, ry, 880, 68, parent=f, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
        create_node("text", f"RTit {idx}", 60, ry + 14, parent=f, text=rtit, props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"RDesc {idx}", 60, ry + 36, width=830, parent=f, text=rdesc, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        ry += 78
    draw_footer(f, 1400)

    # 4.2: 17. Perankingan Prioritas Audit SAW
    f = start_frame(3, 1, "17. Prioritas Audit SAW", "17. Perankingan Prioritas Audit SAW (C1-C5)")
    draw_navbar(f, "Insight")
    create_node("text", "Saw Tit", 40, 80, parent=f, text="Prioritas Inspeksi Dapur SPPG (Metode SAW)", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "Saw Sub", 40, 110, parent=f, text="Sistem Pendukung Keputusan perankingan audit berdasarkan 5 kriteria risiko terbobot.", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    draw_button(f, "Btn Formula Saw", 780, 85, 140, 36, "Rumus & Bobot", variant="outline")
    saw_crits = [("C1: Verifikasi", "25%"), ("C2: Keracunan", "30%"), ("C3: Status SLHS", "20%"), ("C4: Deviasi SLA", "15%"), ("C5: Kepuasan", "10%")]
    scx = 40
    for idx, (cname, cwt) in enumerate(saw_crits):
        create_node("rectangle", f"SawCrit {idx}", scx, 145, 168, 40, parent=f, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
        create_node("text", f"SCN {idx}", scx + 12, 153, parent=f, text=cname, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("text", f"SCW {idx}", scx + 12, 168, parent=f, text=f"Bobot: {cwt}", props={"fontSize": 11, "fill": C_DARK})
        scx += 178
    # Alert Box KLB
    create_node("rectangle", "Alert Box Saw", 40, 205, 880, 75, parent=f, props={"fill": "#FAFAFA", "stroke": C_DARK, "strokeWeight": 1.5, "cornerRadius": 4})
    create_node("text", "Alert Tit Saw", 60, 218, parent=f, text="Sinyal Peringatan Dini Deteksi Kejadian Luar Biasa (KLB)", props={"fontSize": 13, "fill": C_DARK})
    create_node("text", "Alert Desc Saw", 60, 240, width=830, parent=f, text="Terdeteksi klaster 2 laporan dengan gejala serupa di wilayah Tembalang dalam 6 jam terakhir. Rekomendasi isolasi menu & pengujian laboratorium darurat oleh Dinas Kesehatan.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    # 3 Ranked Cards
    create_node("text", "Rank Tit Saw", 40, 305, parent=f, text="Hasil Perankingan Nilai Preferensi Vi (Dapur Perlu Audit):", props={"fontSize": 16, "fill": C_DARK})
    rank_cards = [("PRIORITAS 1 (RISIKO TINGGI)", "SPPG Gayamsari 01", "0.880", "Kec. Gayamsari", "Kasus keracunan terlaporkan & SLHS kedaluwarsa.", True), ("PRIORITAS 2 (RISIKO SEDANG)", "SPPG Candisari 02", "0.640", "Kec. Candisari", "Deviasi SLA berulang 2 kali dalam penyelesaian keluhan.", False), ("PRIORITAS 3 (RISIKO RENDAH)", "SPPG Banyumanik 01", "0.285", "Kec. Banyumanik", "Kepatuhan SLA 99.2% dan sertifikasi SLHS valid.", False)]
    rc_x = 40
    for idx, (p_tag, p_name, p_vi, p_kec, p_reas, is_crit) in enumerate(rank_cards):
        create_node("rectangle", f"RCard BG {idx}", rc_x, 335, 275, 280, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
        create_node("rectangle", f"RTag {idx}", rc_x, 335, 275, 32, parent=f, props={"fill": C_DARK if is_crit else "#F4F4F5"})
        create_node("text", f"RTagTxt {idx}", rc_x + 14, 344, parent=f, text=p_tag, props={"fontSize": 10, "fill": "#FFFFFF" if is_crit else C_DARK})
        create_node("text", f"RName {idx}", rc_x + 14, 380, parent=f, text=p_name, props={"fontSize": 14, "fill": C_DARK})
        create_node("text", f"RKec {idx}", rc_x + 14, 402, parent=f, text=p_kec, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("rectangle", f"ViBox {idx}", rc_x + 14, 428, 247, 50, parent=f, props={"fill": "#FAFAFA", "stroke": C_DIVIDER, "strokeWeight": 1, "cornerRadius": 4})
        create_node("text", f"ViLbl {idx}", rc_x + 24, 436, parent=f, text="Nilai Preferensi SAW (Vi)", props={"fontSize": 10, "fill": C_TEXT_MUTED})
        create_node("text", f"ViVal {idx}", rc_x + 24, 452, parent=f, text=f"Vi = {p_vi}", props={"fontSize": 16, "fill": C_DARK})
        create_node("text", f"RReas {idx}", rc_x + 14, 492, width=245, parent=f, text=p_reas, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        draw_button(f, f"RBtn {idx}", rc_x + 14, 560, 247, 36, "Tugaskan Tim Audit ->", variant="primary" if is_crit else "outline")
        rc_x += 300
    create_node("text", "Matrix Tit Saw", 40, 645, parent=f, text="Tabel Matriks Normalisasi SAW (Rij):", props={"fontSize": 14, "fill": C_DARK})
    draw_image_box(f, "Matrix Mock Saw", 40, 675, 880, 200)
    create_node("text", "Matrix Text Saw", 320, 770, parent=f, text="[Tabel Matriks Keputusan R11 - R40 Terhitung Otomatis]", props={"fontSize": 13, "fill": C_TEXT_MUTED})
    draw_footer(f, 1400)

    # 4.3: 18. Deteksi Dini Peringatan KLB
    f = start_frame(3, 2, "18. Deteksi Peringatan KLB", "18. Deteksi Dini Peringatan KLB Pangan")
    draw_navbar(f, "Insight")
    create_node("text", "Klb Tit", 40, 80, parent=f, text="Sistem Deteksi Dini Kejadian Luar Biasa (KLB)", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "Klb Sub", 40, 110, parent=f, text="Algoritma pemantauan klaster berbasis waktu, lokasi, dan indikasi klinis keracunan makanan.", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    # High Severity Alert Card
    create_node("rectangle", "Klb Alert Card", 40, 145, 880, 110, parent=f, props={"fill": "#FAFAFA", "stroke": C_DARK, "strokeWeight": 2, "cornerRadius": 4})
    create_node("rectangle", "Klb Pill", 60, 160, 120, 24, parent=f, props={"fill": C_DARK, "cornerRadius": 3})
    create_node("text", "Klb Pill Txt", 70, 166, parent=f, text="STATUS: WASPADA KLB", props={"fontSize": 9, "fill": "#FFFFFF"})
    create_node("text", "Klb Head", 200, 162, parent=f, text="Klaster Gejala Mual Terdeteksi di Wilayah Tembalang", props={"fontSize": 14, "fill": C_DARK})
    create_node("text", "Klb Desc", 60, 195, width=830, parent=f, text="Terdeteksi 2 laporan dengan jeda waktu < 2 jam dari 2 sekolah berbeda (SDN Tembalang 01 & SD Sendangmulyo 02) yang disuplai oleh dapur mitra yang sama. SLA Investigasi Tanggap Darurat 2 Jam diaktifkan.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    # Cluster Map + Protocol
    create_node("text", "Klb Map Tit", 40, 275, parent=f, text="Peta Klaster Geografis & Radius Risiko:", props={"fontSize": 14, "fill": C_DARK})
    draw_image_box(f, "Klb Map Box", 40, 300, 520, 300)
    create_node("text", "Klb Map Mock", 180, 440, parent=f, text="[Peta Radius 3 KM Dapur & Sekolah]", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    create_node("text", "Klb Proto Tit", 580, 275, parent=f, text="Protokol Tanggap Darurat Medis:", props={"fontSize": 14, "fill": C_DARK})
    create_node("rectangle", "Proto Box", 580, 300, 340, 300, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    proto_items = ["1. Hentikan konsumsi menu sisa di sekolah.", "2. Amankan sampel makanan untuk uji lab Dinkes.", "3. Mobilisasi tim medis Puskesmas terdekat.", "4. Verifikasi gejala klinis 2 siswa terdampak.", "5. Terbitkan rekomendasi pembekuan sementara."]
    py = 320
    for pi in proto_items:
        create_node("text", f"Proto_{py}", 600, py, width=300, parent=f, text=pi, props={"fontSize": 11, "fill": C_DARK})
        py += 45
    draw_button(f, "Btn Eskalasi Dinkes", 580, 620, 340, 42, "Eskalasi ke Dinas Kesehatan (Darurat 119)", variant="primary")
    draw_footer(f, 1400)

    # 4.4: 19. Komparasi Antar-Dapur SPPG
    f = start_frame(3, 3, "19. Komparasi Dapur SPPG", "19. Komparasi Performa Dapur SPPG")
    draw_navbar(f, "Insight")
    create_node("text", "Komp Tit", 40, 80, parent=f, text="Komparasi Kinerja Antar-Unit Dapur SPPG", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "Komp Sub", 40, 110, parent=f, text="Bandingkan metrik kepatuhan sanitasi, rasio SLA, dan skor kepuasan wali murid.", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    # 2 Kitchen Selectors
    draw_input(f, "Sel Dap 1", 40, 145, 425, 42, "Dapur 1: SPPG Tembalang 01 (Terpilih)")
    draw_input(f, "Sel Dap 2", 495, 145, 425, 42, "Dapur 2: SPPG Gayamsari 01 (Terpilih)")
    # Radar Comparison Chart
    create_node("text", "Radar Comp Tit", 40, 210, parent=f, text="Grafik Komparasi 5 Dimensi Kualitas:", props={"fontSize": 14, "fill": C_DARK})
    draw_image_box(f, "Radar Comp Img", 40, 235, 880, 240)
    create_node("text", "Radar Comp Mock", 340, 350, parent=f, text="[Overlay Grafik Radar SPPG 1 vs SPPG 2]", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    # Comparison Metrics Table
    create_node("text", "Tbl Comp Tit", 40, 500, parent=f, text="Tabel Perbandingan Langsung Indikator Kunci:", props={"fontSize": 14, "fill": C_DARK})
    create_node("rectangle", "Tbl Comp Box", 40, 525, 880, 240, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("rectangle", "TCH", 40, 525, 880, 36, parent=f, props={"fill": "#F4F4F5"})
    create_node("text", "TCH 1", 55, 536, parent=f, text="INDIKATOR KINERJA", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "TCH 2", 340, 536, parent=f, text="SPPG TEMBALANG 01", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "TCH 3", 640, 536, parent=f, text="SPPG GAYAMSARI 01", props={"fontSize": 10, "fill": C_DARK})
    c_rows = [("Status Akreditasi SLHS", "Terverifikasi Valid", "Kedaluwarsa (Perlu Uji Ulang)"), ("Kepatuhan Respon SLA", "96.4% Tepat Waktu", "84.0% (Deviasi Berulang)"), ("Skor Kepuasan Sekolah", "4.8 / 5.0 (Sangat Baik)", "3.6 / 5.0 (Cukup)"), ("Skor Preferensi SAW (Vi)", "0.312 (Risiko Rendah)", "0.880 (Risiko Tinggi - Prioritas 1)")]
    cry = 561
    for idx, (c1, c2, c3) in enumerate(c_rows):
        create_node("rectangle", f"CTR {idx}", 40, cry, 880, 44, parent=f, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
        create_node("text", f"CTD1 {idx}", 55, cry + 14, parent=f, text=c1, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"CTD2 {idx}", 340, cry + 14, parent=f, text=c2, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"CTD3 {idx}", 640, cry + 14, parent=f, text=c3, props={"fontSize": 11, "fill": C_DARK})
        cry += 44
    draw_footer(f, 1400)

    # 4.5: 21. Metodologi Algoritma DSS SAW
    f = start_frame(3, 4, "21. Metodologi Algoritma SAW", "21. Metodologi Algoritma DSS & Formula SAW")
    draw_navbar(f, "Insight")
    create_node("text", "Met Tit", 40, 80, parent=f, text="Metodologi Algoritma Simple Additive Weighting (SAW)", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "Met Sub", 40, 110, parent=f, text="Landasan matematis penentuan prioritas audit dan formula normalisasi matriks.", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    # 2 Mathematical Formula Cards
    create_node("rectangle", "Form Box 1", 40, 150, 425, 160, parent=f, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "F1 Tit", 55, 165, parent=f, text="1. Rumus Normalisasi Matriks (Rij):", props={"fontSize": 12, "fill": C_DARK})
    create_node("text", "F1 Math", 55, 195, parent=f, text="* Kriteria Benefit:  Rij = Xij / Max(Xij)\n* Kriteria Cost:     Rij = Min(Xij) / Xij", props={"fontSize": 13, "fill": C_DARK})
    create_node("text", "F1 Desc", 55, 255, width=390, parent=f, text="Menstandarkan skala nilai kriteria yang berbeda menjadi rentang interval 0 hingga 1.", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    create_node("rectangle", "Form Box 2", 495, 150, 425, 160, parent=f, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "F2 Tit", 510, 165, parent=f, text="2. Rumus Nilai Preferensi Akhir (Vi):", props={"fontSize": 12, "fill": C_DARK})
    create_node("text", "F2 Math", 510, 195, parent=f, text="Vi = SUM ( Wj * Rij )  untuk j = 1 s/d n", props={"fontSize": 14, "fill": C_DARK})
    create_node("text", "F2 Desc", 510, 255, width=390, parent=f, text="Total penjumlahan perkalian bobot Wj dengan nilai ternormalisasi Rij.", props={"fontSize": 10, "fill": C_TEXT_MUTED})

    # Criteria Table
    create_node("text", "Crit Tit 21", 40, 335, parent=f, text="Daftar 5 Kriteria & Penentuan Sifat (Cost/Benefit):", props={"fontSize": 14, "fill": C_DARK})
    create_node("rectangle", "Crit Tbl Box", 40, 360, 880, 240, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("rectangle", "CTH", 40, 360, 880, 36, parent=f, props={"fill": "#F4F4F5"})
    create_node("text", "CTH 1", 55, 371, parent=f, text="KODE", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "CTH 2", 140, 371, parent=f, text="NAMA KRITERIA", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "CTH 3", 380, 371, parent=f, text="SIFAT", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "CTH 4", 520, 371, parent=f, text="BOBOT (Wj)", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "CTH 5", 680, 371, parent=f, text="SUMBER DATA", props={"fontSize": 10, "fill": C_DARK})
    c_specs = [("C1", "Tingkat Laporan Terverifikasi", "Benefit", "25%", "Database Pengaduan Warga"), ("C2", "Riwayat Kejadian Keracunan / Medis", "Benefit", "30%", "Laporan Puskesmas & Dinkes"), ("C3", "Kepatuhan Sertifikasi Sanitasi SLHS", "Cost", "20%", "Audit Laik Higiene Dinkes"), ("C4", "Deviasi Keterlambatan SLA", "Benefit", "15%", "Sistem Timer Log Penanganan"), ("C5", "Indeks Kepuasan Guru & Wali Murid", "Cost", "10%", "Survei Berkala Sekolah")]
    cty = 396
    for idx, (c1, c2, c3, c4, c5) in enumerate(c_specs):
        create_node("rectangle", f"CTR21 {idx}", 40, cty, 880, 40, parent=f, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
        create_node("text", f"CTD21 1 {idx}", 55, cty + 13, parent=f, text=c1, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"CTD21 2 {idx}", 140, cty + 13, parent=f, text=c2, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"CTD21 3 {idx}", 380, cty + 13, parent=f, text=c3, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("text", f"CTD21 4 {idx}", 520, cty + 13, parent=f, text=c4, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"CTD21 5 {idx}", 680, cty + 13, parent=f, text=c5, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        cty += 40
    draw_footer(f, 1400)

    # 4.6: 20. Pusat Edukasi & Dokumentasi
    f = start_frame(3, 5, "20. Pusat Edukasi & SOP", "20. Pusat Panduan Sistem & SOP Pengawasan")
    draw_navbar(f, "Panduan")
    create_node("text", "Edu Tit", 40, 80, parent=f, text="Pusat Edukasi, Regulasi & SOP Sistem PMBGM", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "Edu Sub", 40, 110, parent=f, text="Dokumentasi lengkap tata kelola pengawasan partisipatif dan dasar hukum program MBG.", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    # 4 Categories Grid
    edus = [("Buku Pedoman Pengawasan Warga", "Panduan praktis memeriksa porsi, kebersihan wadah, dan cara foto bukti valid."), ("Standar Higiene Sanitasi (SLHS) Dapur", "Pedoman sertifikasi tempat pengolahan makanan bebas bakteri patogen."), ("Protokol Investigasi Medis Dinkes", "SOP penanganan sampel pangan dan isolasi gejala keracunan di sekolah."), ("Regulasi & Dasar Hukum Program MBG", "Peraturan Presiden & Petunjuk Teknis Badan Gizi Nasional (BGN) 2026.")]
    e_coords = [(40, 150), (495, 150), (40, 310), (495, 310)]
    for idx, (etit, edesc) in enumerate(edus):
        ex, ey = e_coords[idx]
        create_node("rectangle", f"EduCard {idx}", ex, ey, 425, 140, parent=f, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
        create_node("text", f"EduTit {idx}", ex + 20, ey + 20, parent=f, text=etit, props={"fontSize": 13, "fill": C_DARK})
        create_node("text", f"EduDesc {idx}", ex + 20, ey + 45, width=385, parent=f, text=edesc, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        draw_button(f, f"BtnEdu {idx}", ex + 20, ey + 92, 140, 30, "Baca Panduan ->", variant="outline")
    # FAQ Accordion
    create_node("text", "Faq Tit", 40, 480, parent=f, text="Pertanyaan yang Sering Diajukan (FAQ):", props={"fontSize": 14, "fill": C_DARK})
    faqs = [("Q: Apakah nama pelapor aman dari pihak sekolah atau dapur?", "A: Ya. Jika memilih Mode Rahasia atau Anonim, identitas Anda tidak akan pernah diberikan ke dapur."), ("Q: Berapa lama waktu yang dibutuhkan hingga masalah ditindaklanjuti?", "A: Tim Verifikator wajib memeriksa laporan dalam 2 jam, dan dapur wajib memberi respon klarifikasi dalam 18 jam."), ("Q: Bagaimana jika makanan sudah terlanjur dibuang?", "A: Sangat disarankan untuk mengamankan nampan makanan dan mengambil foto sebelum dibuang.")]
    fy = 510
    for idx, (fq, fa) in enumerate(faqs):
        create_node("rectangle", f"FaqBox {idx}", 40, fy, 880, 68, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
        create_node("text", f"FQ {idx}", 60, fy + 12, parent=f, text=fq, props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"FA {idx}", 60, fy + 34, width=830, parent=f, text=fa, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        fy += 78
    draw_footer(f, 1400)

    # Save Progress
    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'save_file', 'arguments': {'path': docs_figcraft}}})
    print(" -> Section 4 selesai.")

    # =========================================================================
    # ROW 4: SECTION 05 - DASBOR INTERNAL: WARGA, GURU & VERIFIKATOR (6 Layar)
    # =========================================================================
    print(" -> [Row 4] Section 5: Dasbor Warga, Guru & Verifikator (32, 33, 34, 35, 36, 37)...")
    add_section_header(4, "SECTION 05: DASBOR INTERNAL: WARGA, GURU & TIM VERIFIKATOR", "Ruang kerja personal wali murid, komite sekolah, dan inspeksi bukti Model MLP AI Verifikator.")

    # 5.1: 32. Dasbor Profil Warga & Riwayat Laporan
    f = start_frame(4, 0, "32. Dasbor Profil Warga", "32. Dasbor Profil Warga (/akun)")
    draw_navbar(f, "Beranda")
    create_node("rectangle", "Warga Prof Box", 40, 80, 880, 110, parent=f, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    draw_avatar(f, "Warga Av", 90, 135, 30)
    create_node("text", "Warga Name", 140, 110, parent=f, text="Ibu Rina Wulandari (Warga / Wali Murid)", props={"fontSize": 16, "fill": C_DARK})
    create_node("text", "Warga Sub", 140, 135, parent=f, text="Wali Murid Kelas 4A * SD Negeri Tembalang 01 * Status Akun: Terverifikasi NIK", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    draw_button(f, "Btn Edit Warga", 760, 115, 140, 36, "Pengaturan Profil", variant="outline")
    draw_metric_card(f, 40, 210, 275, 90, "Total Laporan Dikirim", "3 Laporan", "Sejak Oktober 2026")
    draw_metric_card(f, 345, 210, 275, 90, "Laporan Ditindaklanjuti", "1 Aktif", "Kasus #MBG-2026-X89K")
    draw_metric_card(f, 645, 210, 275, 90, "Laporan Selesai & Tuntas", "2 Laporan", "Rating Diberikan: 5 Bintang")
    create_node("text", "Hist Tit Warga", 40, 325, parent=f, text="Riwayat Pengaduan yang Anda Kirimkan:", props={"fontSize": 14, "fill": C_DARK})
    w_cases = [("#MBG-2026-X89K", "Sayur Berbau Asam di Kelas 4A", "SD Negeri Tembalang 01", "DIPROSES", "Sisa SLA: 14 Jam"), ("#MBG-2026-W11A", "Wadah Omprengan Retak", "SD Negeri Tembalang 01", "SELESAI", "Tuntas diganti baru"), ("#MBG-2026-V80M", "Porsi Nasi Sangat Sedikit", "SD Negeri Tembalang 01", "SELESAI", "Dapur dikoreksi")]
    wy = 355
    for idx, (code, title, school, badge, note) in enumerate(w_cases):
        create_node("rectangle", f"WCaseBox {idx}", 40, wy, 880, 75, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
        create_node("text", f"WCCod {idx}", 60, wy + 16, parent=f, text=code, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        draw_badge(f, f"WCBdg {idx}", 180, wy + 12, 75, 20, badge, "dark")
        create_node("text", f"WCTit {idx}", 60, wy + 42, parent=f, text=title, props={"fontSize": 13, "fill": C_DARK})
        create_node("text", f"WCNote {idx}", 450, wy + 42, parent=f, text=f"Catatan: {note}", props={"fontSize": 11, "fill": C_TEXT_MUTED})
        draw_button(f, f"WCBtn {idx}", 760, wy + 20, 140, 34, "Lihat Tiket ->", variant="outline")
        wy += 88
    draw_button(f, "Btn Buat Lapor Warga", 40, 640, 240, 44, "Buat Pengaduan Baru", variant="primary")
    draw_footer(f, 1400)

    # 5.2: 33. Dasbor Profil Guru
    f = start_frame(4, 1, "33. Dasbor Profil Guru", "33. Dasbor Profil Guru & Sekolah (/akun)")
    draw_navbar(f, "Beranda")
    create_node("rectangle", "Guru Prof Box", 40, 80, 880, 110, parent=f, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    draw_avatar(f, "Guru Av", 90, 135, 30)
    create_node("text", "Guru Name", 140, 110, parent=f, text="Pak Budi Santoso, S.Pd (Komite Sekolah)", props={"fontSize": 16, "fill": C_DARK})
    create_node("text", "Guru Sub", 140, 135, parent=f, text="Koordinator MBG SD Negeri Tembalang 01 * NIP: 198204152006041008", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    draw_metric_card(f, 40, 210, 275, 90, "Siswa Penerima MBG", "450 Siswa", "Kelas 1 s/d Kelas 6")
    draw_metric_card(f, 345, 210, 275, 90, "Dapur Penyuplai Mitra", "SPPG Tembalang 01", "Distribusi: 10:15 WIB")
    draw_metric_card(f, 645, 210, 275, 90, "Kepatuhan Suhu & Higiene", "98.5%", "Pemeriksaan Mandiri")
    # Daily Checklist Card
    create_node("text", "Check Tit", 40, 325, parent=f, text="Checklist Pemantauan Penerimaan Makanan Harian:", props={"fontSize": 14, "fill": C_DARK})
    create_node("rectangle", "Check Box", 40, 355, 880, 200, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    c_items = ["[X] Jam kedatangan makanan sesuai SLA (Maksimal pukul 10:30 WIB) - Tiba: 10:15 WIB", "[X] Segel boks makanan tertutup rapat dan bersih tanpa rembesan minyak", "[X] Jumlah porsi yang dikirimkan cocok dengan daftar hadir (450 porsi lengkap)", "[ ] Uji organoleptik sampel: Rasa, aroma, dan suhu makanan memenuhi standar", "[ ] Pengambilan foto dokumentasi nampan sampel sebelum didistribusikan ke kelas"]
    cy = 375
    for ci in c_items:
        create_node("text", f"CheckItem_{cy}", 60, cy, parent=f, text=ci, props={"fontSize": 11, "fill": C_DARK})
        cy += 32
    draw_button(f, "Btn Simpan Checklist", 40, 580, 220, 42, "Simpan Laporan Harian Guru", variant="primary")
    draw_footer(f, 1400)

    # 5.3: 34. Dasbor Utama Verifikator
    f = start_frame(4, 2, "34. Dasbor Utama Verifikator", "34. Dasbor Tim Verifikator (/panel)")
    draw_sidebar(f, "Mbak Sari (Verifikator)", "Tim Independen BGN", "Dashboard", ["Dashboard", "Antrean Kasus", "Radar AI MLP", "SLA Monitor", "Audit Log"])
    create_node("rectangle", "VTop Bar", 220, 0, 740, 56, parent=f, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
    create_node("text", "VTop Tit", 245, 20, parent=f, text="Dasbor Pengawasan & Verifikasi Independen", props={"fontSize": 14, "fill": C_DARK})
    draw_button(f, "Btn Refresh V", 840, 12, 100, 32, "Segarkan", variant="outline")
    # 3 Metrics
    draw_metric_card(f, 245, 80, 220, 90, "Menunggu Validasi", "5 Laporan", "SLA: Maksimal 2 Jam")
    draw_metric_card(f, 485, 80, 220, 90, "Rata-rata Respon", "42 Menit", "Standar Kinerja Tinggi")
    draw_metric_card(f, 725, 80, 215, 90, "Laporan Sah Hari Ini", "18 Laporan", "Akurasi AI: 94.2%")
    # Urgent Callout
    create_node("rectangle", "Urg Box", 245, 195, 695, 75, parent=f, props={"fill": "#FAFAFA", "stroke": C_DARK, "strokeWeight": 1.5, "cornerRadius": 4})
    create_node("text", "Urg Tit", 265, 210, parent=f, text="PERINGATAN SLA MENDEKATI BATAS: #MBG-2026-X89K", props={"fontSize": 12, "fill": C_DARK})
    create_node("text", "Urg Desc", 265, 232, width=640, parent=f, text="Laporan dari SDN Tembalang 01 tersisa 24 menit untuk verifikasi. Segera periksa bukti foto dan hasil ekstraksi EXIF.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    # Verification Trend Chart
    create_node("text", "VChart Tit", 245, 295, parent=f, text="Grafik Tren Validasi Laporan Masuk 7 Hari Terakhir:", props={"fontSize": 14, "fill": C_DARK})
    draw_image_box(f, "VChart Img", 245, 320, 695, 240)
    create_node("text", "VChart Mock", 480, 430, parent=f, text="[Grafik Batang Valid vs Ditolak]", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    draw_button(f, "Btn Buka Antrean", 245, 580, 200, 42, "Buka Meja Antrean ->", variant="primary")
    draw_footer(f, 1400)

    # 5.4: 35. Meja Antrean Verifikasi
    f = start_frame(4, 3, "35. Antrean Verifikasi", "35. Meja Antrean Verifikasi (/panel/verifikasi)")
    draw_sidebar(f, "Mbak Sari (Verifikator)", "Tim Independen BGN", "Antrean Kasus", ["Dashboard", "Antrean Kasus", "Radar AI MLP", "SLA Monitor", "Audit Log"])
    create_node("rectangle", "ATop Bar", 220, 0, 740, 56, parent=f, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
    create_node("text", "ATop Tit", 245, 20, parent=f, text="Antrean Kasus Menunggu Validasi Verifikator (5 Kasus)", props={"fontSize": 14, "fill": C_DARK})
    # Filter Bar
    draw_input(f, "AFil Search", 245, 75, 340, 36, "Cari kode tiket atau sekolah...")
    draw_button(f, "AFil All", 600, 75, 70, 36, "Semua", variant="primary")
    draw_button(f, "AFil Urg", 680, 75, 100, 36, "Urgensi Tinggi", variant="outline")
    # Table of Queue
    create_node("rectangle", "AQ Box", 245, 125, 695, 460, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("rectangle", "AQ TH", 245, 125, 695, 36, parent=f, props={"fill": "#F4F4F5"})
    create_node("text", "AQTH 1", 260, 136, parent=f, text="KODE TIKET", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "AQTH 2", 370, 136, parent=f, text="SEKOLAH", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "AQTH 3", 530, 136, parent=f, text="MASALAH", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "AQTH 4", 680, 136, parent=f, text="SKOR AI", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "AQTH 5", 810, 136, parent=f, text="AKSI", props={"fontSize": 10, "fill": C_DARK})
    q_items = [("#MBG-2026-X89K", "SDN Tembalang 01", "Sayur Basi", "0.94 (Sah)", "Periksa Bukti"), ("#MBG-2026-X90M", "SD Sendangmulyo 02", "Porsi Kurang", "0.88 (Sah)", "Periksa Bukti"), ("#MBG-2026-X91A", "SMPN 08 Semarang", "Wadah Kotor", "0.91 (Sah)", "Periksa Bukti"), ("#MBG-2026-X92B", "SDN Banyumanik 03", "Distribusi Telat", "0.85 (Sah)", "Periksa Bukti"), ("#MBG-2026-X93C", "SMPN 02 Semarang", "Benda Asing", "0.78 (Perlu Cek)", "Periksa Bukti")]
    qy = 161
    for idx, (c1, c2, c3, c4, c5) in enumerate(q_items):
        create_node("rectangle", f"AQ TR {idx}", 245, qy, 695, 54, parent=f, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
        create_node("text", f"AQTD1 {idx}", 260, qy + 18, parent=f, text=c1, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("text", f"AQTD2 {idx}", 370, qy + 18, parent=f, text=c2, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"AQTD3 {idx}", 530, qy + 18, parent=f, text=c3, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"AQTD4 {idx}", 680, qy + 18, parent=f, text=c4, props={"fontSize": 11, "fill": C_DARK})
        draw_button(f, f"AQBtn {idx}", 800, qy + 12, 110, 30, c5, variant="primary" if idx == 0 else "outline")
        qy += 54
    draw_footer(f, 1400)

    # 5.5: 36. Ruang Kerja Inspeksi & Radar AI MLP
    f = start_frame(4, 4, "36. Inspeksi Laporan & Radar AI", "36. Ruang Kerja Inspeksi & Radar AI MLP")
    draw_sidebar(f, "Mbak Sari (Verifikator)", "Tim Independen BGN", "Antrean Kasus", ["Dashboard", "Antrean Kasus", "Radar AI MLP", "SLA Monitor", "Audit Log"])
    create_node("rectangle", "ITop Bar", 220, 0, 740, 56, parent=f, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
    create_node("text", "ITop Tit", 245, 20, parent=f, text="Inspeksi Detail Laporan #MBG-2026-X89K (SDN Tembalang 01)", props={"fontSize": 14, "fill": C_DARK})
    # Left Column: Photo & EXIF
    create_node("text", "IPhoto Tit", 245, 75, parent=f, text="Foto Bukti & Metadata Kamera Pelapor:", props={"fontSize": 13, "fill": C_DARK})
    draw_image_box(f, "IPhoto Img", 245, 100, 340, 220)
    create_node("rectangle", "IExif Box", 245, 335, 340, 130, parent=f, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "IExif Tit", 260, 348, parent=f, text="METADATA EXIF TERVERIFIKASI:", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "IExif Data", 260, 370, width=310, parent=f, text="* Perangkat: iPhone 13 (Kamera Asli)\n* Waktu Foto: 10:28:14 WIB (Sesuai Jam Makan)\n* Lokasi GPS: -7.0512, 110.4371 (Area SDN Tembalang 01)\n* Integritas File: Valid & Tidak Ada Manipulasi", props={"fontSize": 11, "fill": C_DARK})
    create_node("text", "INarasi Tit", 245, 480, parent=f, text="Narasi Warga Pelapor:", props={"fontSize": 13, "fill": C_DARK})
    create_node("rectangle", "INarasi Box", 245, 505, 340, 95, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "INarasi Txt", 258, 518, width=310, parent=f, text="\"Sayur sop berbau asam saat tiba di kelas 4A. Anak-anak menolak makan dan 2 anak mengeluhkan perut mual.\"", props={"fontSize": 11, "fill": C_DARK})
    # Right Column: AI MLP Radar & Decisions
    create_node("text", "IAi Tit", 605, 75, parent=f, text="Evaluasi Model AI MLP (7 Fitur):", props={"fontSize": 13, "fill": C_DARK})
    create_node("rectangle", "IAi Box", 605, 100, 335, 155, parent=f, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "IAi H", 620, 112, parent=f, text="SKOR VALIDASI CERDAS MULTIMODAL:", props={"fontSize": 10, "fill": C_TEXT_MUTED})
    create_node("text", "IAi Scores", 620, 134, width=305, parent=f, text="* Koherensi Teks-Foto: 94.2% (Konsisten)\n* Indikasi Gejala Klinis: Mual (Terdeteksi)\n* Validitas Waktu & GPS: 98.0% Cocok\n* Klasifikasi Otomatis: Mutu & Higienitas\n* Skor Kepercayaan Akhir: 0.94 / 1.00 (SAH)", props={"fontSize": 11, "fill": C_DARK})
    # Form Decision
    create_node("text", "IDec Tit", 605, 275, parent=f, text="Formulir Keputusan Verifikator:", props={"fontSize": 13, "fill": C_DARK})
    create_node("rectangle", "IDec Box", 605, 300, 335, 300, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "IRadio1", 620, 320, parent=f, text="[*] Sahkan & Teruskan ke SPPG / Dinkes", props={"fontSize": 11, "fill": C_DARK})
    create_node("text", "IRadio2", 620, 345, parent=f, text="[ ] Tolak Laporan (Tidak Valid / Palsu)", props={"fontSize": 11, "fill": C_DARK})
    create_node("text", "IRadio3", 620, 370, parent=f, text="[ ] Minta Bukti Tambahan ke Pelapor", props={"fontSize": 11, "fill": C_DARK})
    create_node("text", "INote Lbl", 620, 405, parent=f, text="Catatan Resmi Verifikator:", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    create_node("rectangle", "INote Box", 620, 425, 305, 80, parent=f, props={"fill": "#FAFAFA", "stroke": C_DIVIDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "INote Txt", 630, 438, width=285, parent=f, text="Bukti foto dan koordinat GPS telah diverifikasi sah. Diteruskan ke SPPG Tembalang 01 dengan SLA 18 jam.", props={"fontSize": 11, "fill": C_DARK})
    draw_button(f, "Btn Reject I", 620, 520, 140, 40, "Tolak", variant="outline")
    draw_button(f, "Btn Approve I", 770, 520, 155, 40, "Sahkan & Teruskan", variant="primary")
    draw_footer(f, 1400)

    # 5.6: 37. Kasus Berjalan Pasca-Verifikasi
    f = start_frame(4, 5, "37. Kasus Aktif Berjalan", "37. Kasus Berjalan Pasca-Verifikasi (/panel/kasus)")
    draw_sidebar(f, "Mbak Sari (Verifikator)", "Tim Independen BGN", "Dashboard", ["Dashboard", "Antrean Kasus", "Radar AI MLP", "SLA Monitor", "Audit Log"])
    create_node("rectangle", "BTop Bar", 220, 0, 740, 56, parent=f, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
    create_node("text", "BTop Tit", 245, 20, parent=f, text="Monitoring Kasus Aktif dalam Penanganan Dapur & Dinkes", props={"fontSize": 14, "fill": C_DARK})
    draw_metric_card(f, 245, 80, 220, 90, "Dalam Investigasi", "8 Kasus", "Respon Berjalan")
    draw_metric_card(f, 485, 80, 220, 90, "Menunggu Berita Acara", "3 Kasus", "SLA < 12 Jam")
    draw_metric_card(f, 725, 80, 215, 90, "Eskalasi Dinkes", "1 Kasus", "Uji Sampel Lab")
    create_node("text", "Kanban Tit", 245, 195, parent=f, text="Status Penanganan Real-Time:", props={"fontSize": 14, "fill": C_DARK})
    k_cards = [("#MBG-2026-X89K", "SDN Tembalang 01", "SPPG Tembalang 01", "Sisa SLA: 14 Jam 20 Menit", "INVESTIGASI"), ("#MBG-2026-X87M", "SD Sendangmulyo 02", "Dinkes Lab", "Sisa SLA: 2 Jam", "UJI LAB"), ("#MBG-2026-X88P", "SMPN 08 Semarang", "SPPG Candisari 02", "Berita Acara Diterima", "REVIEW AKHIR")]
    ky = 225
    for idx, (code, sch, assignee, sla_info, b_stat) in enumerate(k_cards):
        create_node("rectangle", f"KCard {idx}", 245, ky, 695, 85, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
        create_node("text", f"KCCod {idx}", 265, ky + 16, parent=f, text=code, props={"fontSize": 12, "fill": C_TEXT_MUTED})
        draw_badge(f, f"KCBdg {idx}", 400, ky + 14, 95, 22, b_stat, "dark")
        create_node("text", f"KCSch {idx}", 265, ky + 44, parent=f, text=f"{sch} | PIC: {assignee}", props={"fontSize": 12, "fill": C_DARK})
        create_node("text", f"KCSla {idx}", 520, ky + 44, parent=f, text=f"Durasi: {sla_info}", props={"fontSize": 11, "fill": C_TEXT_MUTED})
        draw_button(f, f"KCBtn {idx}", 800, ky + 25, 120, 34, "Pantau Kasus", variant="outline")
        ky += 95
    draw_footer(f, 1400)

    # Save Progress
    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'save_file', 'arguments': {'path': docs_figcraft}}})
    print(" -> Section 5 selesai.")

    # =========================================================================
    # ROW 5: SECTION 06 - DASBOR OPERASIONAL DAPUR SPPG & RESPON LAPANGAN (5 Layar)
    # =========================================================================
    print(" -> [Row 5] Section 6: Dasbor Dapur SPPG (38, 39, 40, 14, 22)...")
    add_section_header(5, "SECTION 06: DASBOR OPERASIONAL DAPUR SPPG & RESPON LAPANGAN", "Manajemen operasional dapur, papan keluhan masuk, dan formulir pengiriman bukti perbaikan.")

    # 6.1: 38. Dasbor Operasional SPPG
    f = start_frame(5, 0, "38. Dasbor Dapur SPPG", "38. Dasbor Operasional Dapur SPPG (/panel)")
    draw_sidebar(f, "SPPG Tembalang 01", "Mitra Penyedia MBG", "Dasbor Dapur", ["Dasbor Dapur", "Papan Keluhan", "Tindak Lanjut", "Menu Harian", "Profil Dapur"])
    create_node("rectangle", "STop Bar", 220, 0, 740, 56, parent=f, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
    create_node("text", "STop Tit", 245, 20, parent=f, text="Dasbor Operasional Dapur Sentra Tembalang 01", props={"fontSize": 14, "fill": C_DARK})
    draw_metric_card(f, 245, 80, 220, 90, "Target Porsi Hari Ini", "3.500 Porsi", "8 Sekolah Sasaran")
    draw_metric_card(f, 485, 80, 220, 90, "Kepatuhan Waktu SLA", "99.4%", "Standar: Tiba < 10:30 WIB")
    draw_metric_card(f, 725, 80, 215, 90, "Keluhan Aktif", "1 Kasus", "Sisa Waktu SLA: 14 Jam")
    # Menu distribution today
    create_node("text", "Menu Tit 38", 245, 195, parent=f, text="Jadwal Distribusi Menu Hari Ini (04 Nov 2026):", props={"fontSize": 14, "fill": C_DARK})
    create_node("rectangle", "Menu Box 38", 245, 220, 695, 180, parent=f, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "M38 Tit", 265, 235, parent=f, text="Menu: Nasi Putih + Ayam Goreng Lengkuas + Sayur Sop Wortel Buncis + Pisang Raja", props={"fontSize": 13, "fill": C_DARK})
    create_node("text", "M38 Details", 265, 265, width=650, parent=f, text="* Waktu Mulai Masak: 04:30 WIB | Waktu Selesai Packing: 09:15 WIB\n* Suhu Makanan Saat Kirim: 68 derajat C (Terjaga dalam Boks Insulasi Termal)\n* Armada Pengiriman: 3 Mobil Boks Berpendingin (Rute 1, Rute 2, Rute 3)\n* Status Sekolah: 7 Sekolah Tuntas Diterima, 1 Sekolah Melaporkan Kendala Sayur", props={"fontSize": 11, "fill": C_DARK})
    # Active Complaint Alert
    create_node("rectangle", "Comp Alert Box", 245, 420, 695, 100, parent=f, props={"fill": "#FFFFFF", "stroke": C_DARK, "strokeWeight": 1.5, "cornerRadius": 4})
    create_node("text", "CA Tit", 265, 435, parent=f, text="DISPOSISI ADUAN: Kasus #MBG-2026-X89K (SDN Tembalang 01)", props={"fontSize": 13, "fill": C_DARK})
    create_node("text", "CA Desc", 265, 458, width=650, parent=f, text="Keluhan aroma asam pada sayur sop. Batas waktu pengiriman tindakan korektif: 14 Jam 20 Menit lagi. Segera kirimkan klarifikasi dan berita acara perbaikan.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    draw_button(f, "Btn Respon SPPG", 245, 540, 220, 42, "Tanggapi Keluhan Sekarang ->", variant="primary")
    draw_footer(f, 1400)

    # 6.2: 39. Papan Keluhan Masuk SPPG
    f = start_frame(5, 1, "39. Papan Keluhan SPPG", "39. Papan Keluhan Masuk Dapur SPPG (/panel/kasus)")
    draw_sidebar(f, "SPPG Tembalang 01", "Mitra Penyedia MBG", "Papan Keluhan", ["Dasbor Dapur", "Papan Keluhan", "Tindak Lanjut", "Menu Harian", "Profil Dapur"])
    create_node("rectangle", "PTop Bar", 220, 0, 740, 56, parent=f, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
    create_node("text", "PTop Tit", 245, 20, parent=f, text="Daftar Keluhan Menu yang Dialamatkan ke Dapur Ini", props={"fontSize": 14, "fill": C_DARK})
    create_node("rectangle", "PTable Box", 245, 80, 695, 380, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("rectangle", "PTH", 245, 80, 695, 36, parent=f, props={"fill": "#F4F4F5"})
    create_node("text", "PTH 1", 260, 91, parent=f, text="KODE TIKET", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "PTH 2", 370, 91, parent=f, text="SEKOLAH", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "PTH 3", 530, 91, parent=f, text="KELUHAN", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "PTH 4", 680, 91, parent=f, text="STATUS SLA", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "PTH 5", 810, 91, parent=f, text="AKSI", props={"fontSize": 10, "fill": C_DARK})
    p_rows = [("#MBG-2026-X89K", "SDN Tembalang 01", "Sayur Berbau Asam", "Sisa: 14 Jam", "Tanggapi"), ("#MBG-2026-V80M", "SD Sendangmulyo 01", "Porsi Nasi Kurang", "Tuntas (8 Jam)", "Lihat BA"), ("#MBG-2026-W11A", "SMPN 08 Semarang", "Wadah Retak", "Tuntas (4 Jam)", "Lihat BA")]
    py = 116
    for idx, (c1, c2, c3, c4, c5) in enumerate(p_rows):
        create_node("rectangle", f"PTR {idx}", 245, py, 695, 54, parent=f, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
        create_node("text", f"PTD1 {idx}", 260, py + 18, parent=f, text=c1, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("text", f"PTD2 {idx}", 370, py + 18, parent=f, text=c2, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"PTD3 {idx}", 530, py + 18, parent=f, text=c3, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"PTD4 {idx}", 680, py + 18, parent=f, text=c4, props={"fontSize": 11, "fill": C_DARK})
        draw_button(f, f"PBtn {idx}", 800, py + 12, 110, 30, c5, variant="primary" if idx == 0 else "outline")
        py += 54
    draw_footer(f, 1400)

    # 6.3: 40. Tindak Lanjut & Bukti Perbaikan Dapur
    f = start_frame(5, 2, "40. Tindak Lanjut Dapur SPPG", "40. Formulir Tindak Lanjut & Bukti Perbaikan (/panel/kasus/[id])")
    draw_sidebar(f, "SPPG Tembalang 01", "Mitra Penyedia MBG", "Tindak Lanjut", ["Dasbor Dapur", "Papan Keluhan", "Tindak Lanjut", "Menu Harian", "Profil Dapur"])
    create_node("rectangle", "TLTop Bar", 220, 0, 740, 56, parent=f, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
    create_node("text", "TLTop Tit", 245, 20, parent=f, text="Formulir Klarifikasi & Tindak Lanjut #MBG-2026-X89K", props={"fontSize": 14, "fill": C_DARK})
    # Case Details Reminder
    create_node("rectangle", "TLRem Box", 245, 75, 695, 75, parent=f, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "TLRem Tit", 265, 88, parent=f, text="Laporan Warga: Sayur Berbau Asam di SDN Tembalang 01", props={"fontSize": 12, "fill": C_DARK})
    create_node("text", "TLRem Sub", 265, 108, width=650, parent=f, text="Hasil Verifikasi Independen: Sah & Terbukti. Dapur diwajibkan mengirimkan klarifikasi penyebab dan bukti tindakan korektif.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    # Inputs: Cause Analysis
    create_node("text", "TLCause Lbl", 245, 170, parent=f, text="Analisis Akar Penyebab Masalah *", props={"fontSize": 13, "fill": C_DARK})
    create_node("rectangle", "TLCause Box", 245, 195, 695, 90, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "TLCause Txt", 260, 208, width=665, parent=f, text="Sayur sop dimasak pada pukul 07:30 WIB dan langsung dimasukkan ke wadah tertutup rapat saat uap panas masih tinggi, sehingga terjadi pengembunan asam sebelum pendinginan optimal.", props={"fontSize": 12, "fill": C_DARK})
    # Inputs: Corrective Action
    create_node("text", "TLAct Lbl", 245, 305, parent=f, text="Tindakan Perbaikan yang Telah Dilakukan *", props={"fontSize": 13, "fill": C_DARK})
    create_node("rectangle", "TLAct Box", 245, 330, 695, 90, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "TLAct Txt", 260, 343, width=665, parent=f, text="1. Mengirimkan 450 porsi menu pengganti segar dalam 2 jam.\n2. Menambahkan kipas exhaust pendingin di ruang packing.\n3. Memberi teguran dan pelatihan ulang kepada juru masak sayur.", props={"fontSize": 12, "fill": C_DARK})
    # Photo Upload Dropzone
    create_node("text", "TLPhoto Lbl", 245, 435, parent=f, text="Unggah Foto Bukti Perbaikan Fasilitas / Menu Pengganti *", props={"fontSize": 13, "fill": C_DARK})
    draw_image_box(f, "TLPhoto Drop", 245, 460, 695, 140)
    create_node("text", "TLPhoto Cap", 480, 520, parent=f, text="[Tarik Foto Perbaikan Dapur & Menu Baru]", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    draw_button(f, "Btn Submit BA", 680, 620, 260, 44, "Kirim Berita Acara Perbaikan ->", variant="primary")
    draw_footer(f, 1400)

    # 6.4: 14. Rekapitulasi Kasus Terbuka
    f = start_frame(5, 3, "14. Rekapitulasi Kasus Terbuka", "14. Rekapitulasi Kasus & Kategori (/data/kasus)")
    draw_navbar(f, "Data")
    create_node("text", "Kasus Tit 14", 40, 80, parent=f, text="Rekapitulasi Kasus MBG Terverifikasi", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "Kasus Sub 14", 40, 110, parent=f, text="Transparansi sebaran kategori pengaduan di 16 kecamatan Kota Semarang.", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    draw_metric_card(f, 40, 145, 205, 90, "Total Kasus Masuk", "119 Aduan", "Tercatat 2026")
    draw_metric_card(f, 265, 145, 205, 90, "Terverifikasi Sah", "102 Aduan", "85.7% Rasio Sah")
    draw_metric_card(f, 490, 145, 205, 90, "Kasus Tuntas", "114 Kasus", "95.7% SLA")
    draw_metric_card(f, 715, 145, 205, 90, "Dalam Penanganan", "5 Kasus", "Sedang Berjalan")
    # Category Distribution Chart
    create_node("text", "Cat Chart Tit", 40, 260, parent=f, text="Distribusi Kasus Berdasarkan Jenis Permasalahan:", props={"fontSize": 14, "fill": C_DARK})
    draw_image_box(f, "Cat Chart Img", 40, 285, 880, 240)
    create_node("text", "Cat Chart Mock", 340, 395, parent=f, text="[Grafik Donat / Batang Sebaran Kategori Aduan]", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    draw_footer(f, 1400)

    # 6.5: 22. Tentang Inisiatif PMBGM
    f = start_frame(5, 4, "22. Tentang Inisiatif PMBGM", "22. Tentang Inisiatif Pengawasan PMBGM (/tentang)")
    draw_navbar(f, "Panduan")
    create_node("text", "Abt Tit", 40, 80, parent=f, text="Tentang Inisiatif PMBGM", props={"fontSize": 22, "fill": C_DARK})
    create_node("text", "Abt Sub", 40, 110, parent=f, text="Pemantau MBG Masyarakat - Platform Pengawasan Partisipatif Makan Bergizi Gratis (MIA 2026).", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    draw_image_box(f, "Abt Hero Img", 40, 145, 880, 240)
    create_node("text", "Abt Hero Mock", 360, 255, parent=f, text="[Foto Inisiatif Gotong Royong Pengawasan Pangan]", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    create_node("text", "Visi Tit", 40, 410, parent=f, text="Visi & Komitmen Transparansi:", props={"fontSize": 14, "fill": C_DARK})
    create_node("rectangle", "Visi Box", 40, 435, 880, 160, parent=f, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "Visi Text", 60, 455, width=830, parent=f, text="PMBGM hadir sebagai jembatan independen antara masyarakat (orang tua murid & guru) dengan pemerintah serta dapur penyedia gizi. Dengan memanfaatkan kecerdasan buatan untuk verifikasi metadata bukti foto dan metode DSS Simple Additive Weighting (SAW) untuk penentuan prioritas audit, PMBGM menjamin setiap anak Indonesia menerima asupan gizi yang aman, higienis, dan bermutu tinggi.", props={"fontSize": 12, "fill": C_DARK})
    draw_footer(f, 1400)

    # Save Progress
    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'save_file', 'arguments': {'path': docs_figcraft}}})
    print(" -> Section 5 selesai.")

    # =========================================================================
    # ROW 6: SECTION 07 - DINAS KESEHATAN, KORWIL BGN & SUPERADMIN (7 Layar)
    # =========================================================================
    print(" -> [Row 6] Section 7: Dinkes, Korwil & Superadmin (41, 42, 43, 44, 45, 46, 47)...")
    add_section_header(6, "SECTION 07: DINAS KESEHATAN, KORWIL BGN & SUPERADMIN SISTEM", "Pengawasan klinis epidemiologi Dinkes, akuntabilitas audit wilayah Korwil, dan administrasi sistem RBAC/SLA.")

    # 7.1: 41. Dasbor Dinkes
    f = start_frame(6, 0, "41. Dasbor Pengawasan Dinkes", "41. Dasbor Sanitasi Pangan Dinkes (/panel)")
    draw_sidebar(f, "Dinas Kesehatan", "Pengawas Sanitasi", "Sanitasi MBG", ["Sanitasi MBG", "Investigasi KLB", "Uji Laboratorium", "Sertifikasi SLHS", "Laporan Medis"])
    create_node("rectangle", "DTop Bar", 220, 0, 740, 56, parent=f, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
    create_node("text", "DTop Tit", 245, 20, parent=f, text="Dasbor Surveilans Higiene Sanitasi Pangan (Dinkes Kota Semarang)", props={"fontSize": 14, "fill": C_DARK})
    draw_metric_card(f, 245, 80, 220, 90, "Dapur Teraudit", "40 Dapur", "38 Terverifikasi SLHS")
    draw_metric_card(f, 485, 80, 220, 90, "Uji Sampel Lab", "12 Uji Lab", "Negatif Patogen")
    draw_metric_card(f, 725, 80, 215, 90, "Kejadian Fatal", "0 Kasus", "Zero Fatalities")
    create_node("text", "DMap Tit", 245, 195, parent=f, text="Peta Sebaran Kepatuhan Higiene Dapur SPPG:", props={"fontSize": 14, "fill": C_DARK})
    draw_image_box(f, "DMap Img", 245, 220, 695, 240)
    create_node("text", "DMap Mock", 480, 330, parent=f, text="[Peta Sebaran SLHS & Titik Pengawasan Sanitasi]", props={"fontSize": 12, "fill": C_TEXT_MUTED})
    draw_footer(f, 1400)

    # 7.2: 42. Meja Investigasi KLB Dinkes
    f = start_frame(6, 1, "42. Investigasi KLB Dinkes", "42. Investigasi Epidemiologi KLB (/panel/peringatan)")
    draw_sidebar(f, "Dinas Kesehatan", "Pengawas Sanitasi", "Investigasi KLB", ["Sanitasi MBG", "Investigasi KLB", "Uji Laboratorium", "Sertifikasi SLHS", "Laporan Medis"])
    create_node("rectangle", "KTop Bar", 220, 0, 740, 56, parent=f, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
    create_node("text", "KTop Tit", 245, 20, parent=f, text="Ruang Investigasi Indikasi Kejadian Luar Biasa (KLB)", props={"fontSize": 14, "fill": C_DARK})
    # Alert Box
    create_node("rectangle", "KBox 42", 245, 80, 695, 80, parent=f, props={"fill": "#FAFAFA", "stroke": C_DARK, "strokeWeight": 1.5, "cornerRadius": 4})
    create_node("text", "K42 Tit", 265, 95, parent=f, text="Penyelidikan Klaster Gejala Mual Tembalang (SLA: 2 Jam)", props={"fontSize": 13, "fill": C_DARK})
    create_node("text", "K42 Desc", 265, 118, width=650, parent=f, text="Tim sanitarian Puskesmas Tembalang ditugaskan mengambil 3 sampel sisa makanan sop dan uji mikrobiologi di Balai Labkesmas.", props={"fontSize": 11, "fill": C_TEXT_MUTED})
    # Form Input Lab Results
    create_node("text", "Lab Tit 42", 245, 180, parent=f, text="Formulir Hasil Uji Cepat Laboratorium:", props={"fontSize": 13, "fill": C_DARK})
    draw_input(f, "In Lab 1", 245, 205, 340, 42, "Bakteri E. Coli: Negatif (0 CFU/g)")
    draw_input(f, "In Lab 2", 600, 205, 340, 42, "Bakteri Salmonella: Negatif")
    draw_input(f, "In Lab 3", 245, 260, 340, 42, "Kadar Keasaman (pH): 4.8 (Asam)")
    draw_input(f, "In Lab 4", 600, 260, 340, 42, "Suhu Pengantaran: 42 C (Dibawah Standar)")
    create_node("text", "Rek Tit 42", 245, 320, parent=f, text="Rekomendasi Medis Resmi Dinas Kesehatan:", props={"fontSize": 13, "fill": C_DARK})
    create_node("rectangle", "Rek Box 42", 245, 345, 695, 100, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("text", "Rek Txt 42", 260, 358, width=665, parent=f, text="Kejadian mual diakibatkan oleh fermentasi asam ringan pada kuah sayur bersuhu hangat yang tertutup terlalu lama, bukan keracunan bakteri patogen berbahaya. Rekomendasi: Pembinaan higienitas packing dan pengawasan rutin tanpa penutupan dapur.", props={"fontSize": 11, "fill": C_DARK})
    draw_button(f, "Btn Terbitkan Rek", 245, 465, 320, 42, "Terbitkan Surat Rekomendasi Sanitasi", variant="primary")
    draw_footer(f, 1400)

    # 7.3: 43. Dasbor Akuntabilitas Korwil BGN
    f = start_frame(6, 2, "43. Dasbor Korwil BGN", "43. Dasbor Akuntabilitas Korwil BGN (/panel)")
    draw_sidebar(f, "Koordinator Wilayah", "BGN Jawa Tengah", "Akuntabilitas", ["Akuntabilitas", "Prioritas Audit SAW", "Kinerja Dapur", "Laporan Pusat", "Regulasi"])
    create_node("rectangle", "KwTop Bar", 220, 0, 740, 56, parent=f, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
    create_node("text", "KwTop Tit", 245, 20, parent=f, text="Dasbor Akuntabilitas Pengawasan Wilayah Jawa Tengah", props={"fontSize": 14, "fill": C_DARK})
    draw_metric_card(f, 245, 80, 220, 90, "Kepatuhan Wilayah", "94.8%", "16 Kecamatan")
    draw_metric_card(f, 485, 80, 220, 90, "Deviasi SLA Instansi", "1.2%", "Terkendali Baik")
    draw_metric_card(f, 725, 80, 215, 90, "Jadwal Audit Lapangan", "3 Dapur", "Minggu Ini")
    create_node("text", "Dev Tit 43", 245, 195, parent=f, text="Matriks Kepatuhan SLA Antar-Instansi Pelaksana:", props={"fontSize": 14, "fill": C_DARK})
    create_node("rectangle", "Dev Box 43", 245, 220, 695, 220, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("rectangle", "DTH", 245, 220, 695, 36, parent=f, props={"fill": "#F4F4F5"})
    create_node("text", "DTH 1", 260, 231, parent=f, text="INSTANSI / PERAN", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "DTH 2", 440, 231, parent=f, text="STANDAR SLA", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "DTH 3", 600, 231, parent=f, text="REALISASI RATA-RATA", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "DTH 4", 780, 231, parent=f, text="KEPATUHAN", props={"fontSize": 10, "fill": C_DARK})
    insts = [("Tim Verifikator Independen", "Maksimal 2 Jam", "42 Menit", "99.1% (Sangat Baik)"), ("Dapur Sentra SPPG", "Maksimal 18 Jam", "8.5 Jam", "94.2% (Baik)"), ("Dinas Kesehatan (Uji Lab)", "Maksimal 24 Jam", "6.2 Jam", "96.5% (Sangat Baik)")]
    iy = 256
    for idx, (c1, c2, c3, c4) in enumerate(insts):
        create_node("rectangle", f"ITR {idx}", 245, iy, 695, 48, parent=f, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
        create_node("text", f"ITD1 {idx}", 260, iy + 16, parent=f, text=c1, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"ITD2 {idx}", 440, iy + 16, parent=f, text=c2, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        create_node("text", f"ITD3 {idx}", 600, iy + 16, parent=f, text=c3, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"ITD4 {idx}", 780, iy + 16, parent=f, text=c4, props={"fontSize": 11, "fill": C_DARK})
        iy += 48
    draw_button(f, "Btn Ekspor Korwil", 245, 460, 240, 42, "Ekspor Laporan Bulanan ke BGN Pusat", variant="primary")
    draw_footer(f, 1400)

    # 7.4: 44. Prioritas Audit Lapangan Korwil (SAW)
    f = start_frame(6, 3, "44. Prioritas Audit Lapangan", "44. Matriks Audit Lapangan Korwil (SAW)")
    draw_sidebar(f, "Koordinator Wilayah", "BGN Jawa Tengah", "Prioritas Audit SAW", ["Akuntabilitas", "Prioritas Audit SAW", "Kinerja Dapur", "Laporan Pusat", "Regulasi"])
    create_node("rectangle", "SwTop Bar", 220, 0, 740, 56, parent=f, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
    create_node("text", "SwTop Tit", 245, 20, parent=f, text="Jadwal Prioritas Audit Lapangan Berdasarkan Skor SAW", props={"fontSize": 14, "fill": C_DARK})
    # Table of Audit Priority
    create_node("rectangle", "SwTbl Box", 245, 80, 695, 340, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("rectangle", "STH 44", 245, 80, 695, 36, parent=f, props={"fill": "#F4F4F5"})
    create_node("text", "STH1 44", 260, 91, parent=f, text="RANK", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "STH2 44", 330, 91, parent=f, text="DAPUR SPPG", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "STH3 44", 500, 91, parent=f, text="SKOR SAW (Vi)", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "STH4 44", 650, 91, parent=f, text="STATUS AUDIT", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "STH5 44", 800, 91, parent=f, text="AKSI", props={"fontSize": 10, "fill": C_DARK})
    sw_rows = [("1", "SPPG Gayamsari 01", "Vi = 0.880", "Jadwal: 06 Nov 2026", "Tugaskan"), ("2", "SPPG Candisari 02", "Vi = 0.640", "Jadwal: 09 Nov 2026", "Tugaskan"), ("3", "SPPG Semarang Timur 01", "Vi = 0.520", "Menunggu Tim", "Tugaskan"), ("4", "SPPG Pedurungan 02", "Vi = 0.390", "Rutin (Bulan Depan)", "Detail")]
    swy = 116
    for idx, (c1, c2, c3, c4, c5) in enumerate(sw_rows):
        create_node("rectangle", f"SWTR {idx}", 245, swy, 695, 52, parent=f, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
        create_node("text", f"SWTD1 {idx}", 260, swy + 17, parent=f, text=c1, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"SWTD2 {idx}", 330, swy + 17, parent=f, text=c2, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"SWTD3 {idx}", 500, swy + 17, parent=f, text=c3, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"SWTD4 {idx}", 650, swy + 17, parent=f, text=c4, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        draw_button(f, f"SWBtn {idx}", 800, swy + 11, 110, 30, c5, variant="primary" if idx == 0 else "outline")
        swy += 52
    draw_footer(f, 1400)

    # 7.5: 45. Dasbor Utama Administrator Sistem
    f = start_frame(6, 4, "45. Dasbor Utama Admin", "45. Dasbor Administrator Sistem (/panel)")
    draw_sidebar(f, "Superadmin", "Pengelola Sistem", "Dasbor Admin", ["Dasbor Admin", "Pengguna (RBAC)", "Konfigurasi SLA", "Database & Log", "Pengaturan"])
    create_node("rectangle", "AdTop Bar", 220, 0, 740, 56, parent=f, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
    create_node("text", "AdTop Tit", 245, 20, parent=f, text="Dasbor Pemantauan Sistem & Infrastruktur PMBGM", props={"fontSize": 14, "fill": C_DARK})
    draw_metric_card(f, 245, 80, 220, 90, "Server Uptime", "99.98%", "Status Operasional Normal")
    draw_metric_card(f, 485, 80, 220, 90, "API Latency", "45 ms", "Respon Database Cepat")
    draw_metric_card(f, 725, 80, 215, 90, "Total Pengguna", "1.420 Akun", "6 Peran Terdaftar")
    create_node("text", "Log Tit 45", 245, 195, parent=f, text="Log Aktivitas Sistem Real-Time (Audit Trail):", props={"fontSize": 14, "fill": C_DARK})
    create_node("rectangle", "Log Box 45", 245, 220, 695, 280, parent=f, props={"fill": "#FAFAFA", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    sys_logs = ["[10:30:15 WIB] AUTH: User rina.wulandari login via OTP WhatsApp", "[10:30:45 WIB] REPORT: Tiket #MBG-AG2MWK dibuat dari IP 182.253.x.x", "[11:15:20 WIB] VERIF: Petugas Sari menyahkan tiket #MBG-AG2MWK (Skor AI: 0.94)", "[11:45:00 WIB] DISPATCH: Notifikasi SLA terkirim otomatis ke SPPG Tembalang 01", "[12:00:10 WIB] BACKUP: Pencadangan otomatis database snapshot berhasil (45 MB)"]
    sly = 240
    for sl in sys_logs:
        create_node("text", f"SysLog_{sly}", 265, sly, parent=f, text=sl, props={"fontSize": 11, "fill": C_DARK})
        sly += 45
    draw_footer(f, 1400)

    # 7.6: 46. Manajemen Pengguna & Hak Akses (RBAC)
    f = start_frame(6, 5, "46. Manajemen Pengguna RBAC", "46. Manajemen Pengguna & Hak Akses (RBAC)")
    draw_sidebar(f, "Superadmin", "Pengelola Sistem", "Pengguna (RBAC)", ["Dasbor Admin", "Pengguna (RBAC)", "Konfigurasi SLA", "Database & Log", "Pengaturan"])
    create_node("rectangle", "RbTop Bar", 220, 0, 740, 56, parent=f, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
    create_node("text", "RbTop Tit", 245, 20, parent=f, text="Manajemen Akun & Hak Akses Pengguna (Role-Based Access Control)", props={"fontSize": 14, "fill": C_DARK})
    draw_input(f, "Search User", 245, 75, 340, 36, "Cari nama, email, atau nomor telepon...")
    draw_button(f, "Btn Tambah User", 760, 75, 180, 36, "+ Tambah Petugas Baru", variant="primary")
    create_node("rectangle", "RbTbl Box", 245, 125, 695, 380, parent=f, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 4})
    create_node("rectangle", "RTH", 245, 125, 695, 36, parent=f, props={"fill": "#F4F4F5"})
    create_node("text", "RTH 1", 260, 136, parent=f, text="NAMA LENGKAP", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "RTH 2", 420, 136, parent=f, text="EMAIL / USERNAME", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "RTH 3", 600, 136, parent=f, text="PERAN (ROLE)", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "RTH 4", 740, 136, parent=f, text="STATUS", props={"fontSize": 10, "fill": C_DARK})
    create_node("text", "RTH 5", 840, 136, parent=f, text="AKSI", props={"fontSize": 10, "fill": C_DARK})
    u_rows = [("Ibu Rina Wulandari", "rina.w@gmail.com", "Warga / Wali Murid", "Aktif", "Edit"), ("Pak Budi Santoso", "budi.sdnt01@sch.id", "Guru / Komite", "Aktif", "Edit"), ("Mbak Sari Kusuma", "sari.verif@pmbgm.id", "Verifikator Independen", "Aktif", "Edit"), ("Hj. Nurul Hidayah", "sppg.tembalang01@gmail.com", "Pengelola SPPG", "Aktif", "Edit"), ("dr. Hendra Prasetyo", "hendra.dinkes@semarangkota.go.id", "Dinas Kesehatan", "Aktif", "Edit"), ("Drs. Agus Wijaya", "agus.korwil@bgn.go.id", "Korwil BGN", "Aktif", "Edit")]
    ury = 161
    for idx, (c1, c2, c3, c4, c5) in enumerate(u_rows):
        create_node("rectangle", f"UTR {idx}", 245, ury, 695, 52, parent=f, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
        create_node("text", f"UTD1 {idx}", 260, ury + 17, parent=f, text=c1, props={"fontSize": 11, "fill": C_DARK})
        create_node("text", f"UTD2 {idx}", 420, ury + 17, parent=f, text=c2, props={"fontSize": 11, "fill": C_TEXT_MUTED})
        draw_badge(f, f"UBdg {idx}", 600, ury + 14, 125, 22, c3, "subtle")
        create_node("text", f"UTD4 {idx}", 740, ury + 17, parent=f, text=c4, props={"fontSize": 11, "fill": C_DARK})
        draw_button(f, f"UBtn {idx}", 840, ury + 11, 80, 28, c5, variant="outline")
        ury += 52
    draw_footer(f, 1400)

    # 7.7: 47. Konfigurasi Kebijakan SLA & Parameter SAW
    f = start_frame(6, 6, "47. Konfigurasi SLA & SAW", "47. Konfigurasi Kebijakan SLA & Parameter SAW")
    draw_sidebar(f, "Superadmin", "Pengelola Sistem", "Konfigurasi SLA", ["Dasbor Admin", "Pengguna (RBAC)", "Konfigurasi SLA", "Database & Log", "Pengaturan"])
    create_node("rectangle", "CfgTop Bar", 220, 0, 740, 56, parent=f, props={"fill": "#FFFFFF", "stroke": C_DIVIDER, "strokeWeight": 1})
    create_node("text", "CfgTop Tit", 245, 20, parent=f, text="Konfigurasi Parameter Kebijakan SLA & Bobot Algoritma SAW", props={"fontSize": 14, "fill": C_DARK})
    # SLA Config Inputs
    create_node("text", "Sla Conf Tit", 245, 75, parent=f, text="Batas Waktu Standar Pelayanan Minimal (SLA):", props={"fontSize": 13, "fill": C_DARK})
    draw_input(f, "Cfg SLA 1", 245, 100, 340, 42, "Batas Verifikasi Awal: 2 Jam")
    draw_input(f, "Cfg SLA 2", 600, 100, 340, 42, "Batas Respon Dapur SPPG: 18 Jam")
    draw_input(f, "Cfg SLA 3", 245, 155, 340, 42, "Batas Uji Lab Dinkes: 24 Jam")
    draw_input(f, "Cfg SLA 4", 600, 155, 340, 42, "Batas Eskalasi Kasus Medis: 2 Jam")
    # SAW Weight Sliders/Inputs
    create_node("text", "Saw Conf Tit", 245, 220, parent=f, text="Bobot Kriteria Algoritma SAW (Total Wajib 100%):", props={"fontSize": 13, "fill": C_DARK})
    draw_input(f, "Cfg W1", 245, 245, 340, 42, "C1: Laporan Terverifikasi: 25 %")
    draw_input(f, "Cfg W2", 600, 245, 340, 42, "C2: Kejadian Medis / Keracunan: 30 %")
    draw_input(f, "Cfg W3", 245, 300, 340, 42, "C3: Status Sertifikat SLHS: 20 %")
    draw_input(f, "Cfg W4", 600, 300, 340, 42, "C4: Deviasi SLA Penanganan: 15 %")
    draw_input(f, "Cfg W5", 245, 355, 340, 42, "C5: Indeks Kepuasan Sekolah: 10 %")
    create_node("rectangle", "Save Div", 245, 420, 695, 1, parent=f, props={"fill": C_DIVIDER})
    draw_button(f, "Btn Reset Cfg", 245, 440, 160, 44, "Reset Default", variant="outline")
    draw_button(f, "Btn Save Cfg", 680, 440, 260, 44, "Simpan & Terapkan Kebijakan Baru", variant="primary")
    draw_footer(f, 1400)

    # Save Final Master Document
    print("\n[4/6] Menyimpan proyek master .figcraft...")
    save_res1 = send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'save_file', 'arguments': {'path': output_figcraft}}})
    print(" -> Saved to root:", output_figcraft, save_res1.get('result', {}).get('content', [{}])[0].get('text', 'OK'))
    save_res2 = send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'save_file', 'arguments': {'path': docs_figcraft}}})
    print(" -> Saved to docs:", docs_figcraft, save_res2.get('result', {}).get('content', [{}])[0].get('text', 'OK'))

    # Zoom to fit
    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'run_command', 'arguments': {'command': 'view.zoomFit'}}})
    time.sleep(0.5)

    p.kill()
    print("FigCraft headless session selesai.")

    # Export overview using figcraft-cli render
    print("\n[5/6] Merender Overview resolusi tinggi menggunakan figcraft-cli...")
    try:
        render_cmd = [cli_path, 'render', '--scale', '0.25', '--out', overview_png, output_figcraft]
        r_proc = subprocess.run(render_cmd, capture_output=True, text=True, timeout=60)
        print(" -> Overview PNG exported:", overview_png, "Return code:", r_proc.returncode)
    except Exception as e:
        print(" -> Render note:", e)

    # Launch FigCraft Desktop GUI with the master document
    print("\n[6/6] Membuka aplikasi FigCraft GUI dengan file proyek PMBGM_Wireframes.figcraft...")
    try:
        subprocess.Popen([gui_path, output_figcraft])
        print(" -> FigCraft Desktop GUI diluncurkan dengan sukses.")
    except Exception as e:
        print(" -> Launch GUI note:", e)

    print("=" * 75)
    print("BERHASIL: 45 Artboard Wireframe Master Textbook Monochrome Telah Siap!")
    print("Dokumen: d:/UNNES/LOMBA/MIA 2026/Web/PMBGM_Wireframes.figcraft")
    print("=" * 75)

if __name__ == "__main__":
    main()
