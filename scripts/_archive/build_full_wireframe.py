import subprocess
import json
import time
import sys

def main():
    print("=" * 60)
    print("PMBGM - ANTIGRAVITY LIVE FIGCRAFT WIREFRAME ARCHITECT")
    print("=" * 60)

    # 1. Connect to FigCraft MCP on stdio (attached to 127.0.0.1:7979)
    print("[1/5] Menghubungkan ke aplikasi FigCraft desktop (127.0.0.1:7979)...")
    p = subprocess.Popen(
        ['D:/Program Files/ArtCraft/FigCraft/figcraft-cli.exe', 'mcp', '--attach', '7979'],
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

    # Initialize MCP
    send({'jsonrpc': '2.0', 'method': 'initialize', 'params': {'protocolVersion': '2024-11-05', 'capabilities': {}, 'clientInfo': {'name': 'figcraft_live_designer', 'version': '1.0'}}})
    p.stdin.write(json.dumps({'jsonrpc': '2.0', 'method': 'notifications/initialized', 'params': {}}) + '\n')
    p.stdin.flush()

    # Helper functions
    curr_cursor = [0, 0]

    def move_pointer(x, y, tool="move"):
        nonlocal curr_cursor
        steps = 4
        sx, sy = curr_cursor[0], curr_cursor[1]
        for step in range(1, steps + 1):
            nx = sx + (x - sx) * (step / steps)
            ny = sy + (y - sy) * (step / steps)
            send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'pointer', 'arguments': {'x': nx, 'y': ny, 'kind': 'move', 'tool': tool}}})
            time.sleep(0.01)
        curr_cursor = [x, y]

    def create_node(node_type, name, x, y, width=100, height=100, parent=None, text=None, props=None):
        args = {
            'type': node_type,
            'name': name,
            'x': float(x),
            'y': float(y),
            'width': float(width),
            'height': float(height),
            'select': False
        }
        if parent is not None:
            args['parent'] = parent
        if text is not None:
            args['text'] = text
        if props is not None:
            args['props'] = props
        
        res = send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'create_node', 'arguments': args}})
        try:
            txt = res['result']['content'][0]['text']
            data = json.loads(txt)
            return data.get('id') or (data.get('node', {}).get('id'))
        except Exception:
            return None

    def run_cmd(cmd, params=None):
        payload = {'command': cmd}
        if params:
            payload['params'] = params
        return send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'run_command', 'arguments': payload}})

    # Reset canvas
    print("[2/5] Menyiapkan kanvas bersih...")
    run_cmd('select.all')
    run_cmd('edit.delete')
    time.sleep(0.3)

    # Styling constants
    C_BG_PAGE = "#FFFFFF"
    C_BORDER = "#CBD5E1"
    C_NAV = "#0F172A"
    C_NAV_TEXT = "#F8FAFC"
    C_MUTED = "#64748B"
    C_CARD_BG = "#F8FAFC"
    C_TEXT = "#0F172A"
    C_PRIMARY = "#0F172A"
    C_ACCENT = "#34D399"
    C_BADGE_BG = "#E2E8F0"
    C_LIGHT_BORDER = "#E2E8F0"

    total_created = 0

    def draw_navbar(fid, active="Beranda"):
        # Navbar base
        create_node("rectangle", "Navbar BG", 0, 0, 1440, 68, parent=fid, props={"fill": C_NAV})
        create_node("text", "Brand", 40, 22, parent=fid, text="PMBGM · Pemantau MBG Masyarakat", props={"fontSize": 16, "fill": "#FFFFFF"})
        
        # Nav links
        links = ["Beranda", "Lapor", "Lacak", "Data", "Insight", "Panduan"]
        lx = 420
        for l in links:
            is_active = (l == active)
            col = "#FFFFFF" if is_active else "#94A3B8"
            create_node("text", f"Nav {l}", lx, 25, parent=fid, text=l, props={"fontSize": 13, "fill": col})
            if is_active:
                create_node("rectangle", "Active Indicator", lx - 4, 52, 45, 3, parent=fid, props={"fill": C_ACCENT})
            lx += 85
            
        # Action Buttons
        create_node("rectangle", "Btn Lapor Nav", 1140, 16, 130, 36, parent=fid, props={"fill": "#10B981", "cornerRadius": 6})
        create_node("text", "Text Lapor", 1160, 26, parent=fid, text="📢 Lapor Masalah", props={"fontSize": 12, "fill": "#FFFFFF"})
        create_node("rectangle", "Btn Masuk Nav", 1285, 16, 95, 36, parent=fid, props={"fill": "none", "stroke": "#475569", "strokeWeight": 1, "cornerRadius": 6})
        create_node("text", "Text Masuk", 1312, 26, parent=fid, text="Masuk →", props={"fontSize": 12, "fill": "#F8FAFC"})

    def draw_footer(fid, y=870):
        create_node("rectangle", "Footer BG", 0, y, 1440, 90, parent=fid, props={"fill": "#F8FAFC", "stroke": C_BORDER, "strokeWeight": 1})
        create_node("text", "Footer Copyright", 60, y + 36, parent=fid, text="© 2026 Tim Ctrl Win Enter · PMBGM — Kawal Gizi, Jaga Generasi · Lisensi Data Terbuka CC BY 4.0", props={"fontSize": 12, "fill": C_MUTED})

    def draw_sidebar_panel(fid, active="Verifikasi", role="Verifikator"):
        create_node("rectangle", "Sidebar BG", 0, 0, 260, 960, parent=fid, props={"fill": "#0F172A"})
        create_node("text", "Brand Mini", 24, 28, parent=fid, text="PMBGM WORKSPACE", props={"fontSize": 14, "fill": "#FFFFFF"})
        create_node("text", "Role Badge", 24, 52, parent=fid, text=f"Peran: {role}", props={"fontSize": 11, "fill": C_ACCENT})
        
        menus = ["Dashboard", "Antrean Kasus", "Verifikasi Bukti", "Peringatan Dini", "Akuntabilitas", "Pengaturan"]
        my = 110
        for m in menus:
            is_active = (m.lower() in active.lower())
            bg = "#1E293B" if is_active else "none"
            col = "#FFFFFF" if is_active else "#94A3B8"
            if is_active:
                create_node("rectangle", f"Menu BG {m}", 16, my - 6, 228, 38, parent=fid, props={"fill": bg, "cornerRadius": 6})
            create_node("text", f"Menu {m}", 32, my + 4, parent=fid, text=m, props={"fontSize": 13, "fill": col})
            my += 48
            
        create_node("text", "User Info", 24, 910, parent=fid, text="👤 Akun: demo@pmbgm.test", props={"fontSize": 11, "fill": "#64748B"})

    print("[3/5] Membangun 4 Papan Alur & 21 Layar Wireframe secara Live...")

    # =========================================================================
    # BOARD 1: ALUR PUBLIK & PELAPORAN WARGA (y: 200)
    # =========================================================================
    print(" -> Membangun BOARD 1: Alur Publik & Pelaporan Warga (6 Layar)...")
    create_node("text", "Header Board 1", 100, 100, text="01. ALUR PUBLIK & PELAPORAN WARGA (WARGA, ORANG TUA, SISWA, GURU)", props={"fontSize": 24, "fill": "#0F172A"})

    # 1.1 Beranda Utama
    move_pointer(100 + 720, 200 + 480)
    f1 = create_node("frame", "1.1 Beranda Utama (/)", 100, 200, 1440, 960, props={"fill": C_BG_PAGE, "stroke": C_BORDER, "cornerRadius": 8})
    draw_navbar(f1, "Beranda")
    # Hero
    create_node("rectangle", "Hero Box", 60, 95, 1320, 225, parent=f1, props={"fill": "#F8FAFC", "stroke": C_LIGHT_BORDER, "cornerRadius": 8})
    create_node("rectangle", "Hero Badge", 80, 115, 260, 26, parent=f1, props={"fill": "#D1FAE5", "cornerRadius": 13})
    create_node("text", "Hero Badge Text", 95, 121, parent=f1, text="🟢 PENGAWASAN MBG PARTISIPATIF", props={"fontSize": 11, "fill": "#065F46"})
    create_node("text", "Hero Title", 80, 155, parent=f1, text="Kawal Gizi, Jaga Generasi.", props={"fontSize": 32, "fill": C_TEXT})
    create_node("text", "Hero Sub", 80, 200, parent=f1, text="Platform pengawasan independen mutu, porsi, dan higienitas Program Makan Bergizi Gratis (MBG) untuk anak sekolah.", props={"fontSize": 14, "fill": C_MUTED})
    create_node("rectangle", "Btn Hero Lapor", 80, 240, 170, 44, parent=f1, props={"fill": C_NAV, "cornerRadius": 6})
    create_node("text", "Btn Lapor Txt", 102, 253, parent=f1, text="📢 Lapor Masalah MBG", props={"fontSize": 13, "fill": "#FFFFFF"})
    create_node("rectangle", "Btn Hero Lacak", 265, 240, 160, 44, parent=f1, props={"fill": "none", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 6})
    create_node("text", "Btn Lacak Txt", 295, 253, parent=f1, text="🔍 Lacak Tiket Kasus", props={"fontSize": 13, "fill": C_TEXT})
    # KPI Row
    kpis = [("🏫 165 Sekolah", "Terdata di Kota Semarang"), ("🍱 40 Dapur SPPG", "Dipantau & Teraudit"), ("⚡ 98.4% Kepatuhan SLA", "Respon Cepat Terjamin"), ("⏱️ 24 Jam", "Standar Verifikasi")]
    kx = 60
    for title, desc in kpis:
        create_node("rectangle", "KPI Card", kx, 340, 312, 75, parent=f1, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 6})
        create_node("text", "KPI Title", kx + 16, 355, parent=f1, text=title, props={"fontSize": 16, "fill": C_TEXT})
        create_node("text", "KPI Desc", kx + 16, 382, parent=f1, text=desc, props={"fontSize": 11, "fill": C_MUTED})
        kx += 336
    # 4 Alur
    create_node("text", "Section Title", 60, 440, parent=f1, text="4 Langkah Pengawasan Terbuka & Berkeadilan", props={"fontSize": 18, "fill": C_TEXT})
    steps = [
        ("1. Lapor Mandiri", "Orang tua atau guru mengunggah foto menu & keluhan kejadian."),
        ("2. Verifikasi Objektif", "Verifikator independen memeriksa keaslian bukti dan EXIF."),
        ("3. Tindak Lanjut", "Kasus diteruskan otomatis ke SPPG dan Dinkes setempat."),
        ("4. Akuntabilitas Publik", "Perkembangan diumumkan transparan beserta skor risiko.")
    ]
    sx = 60
    for st, sd in steps:
        create_node("rectangle", "Step Card", sx, 475, 312, 110, parent=f1, props={"fill": C_CARD_BG, "stroke": C_LIGHT_BORDER, "cornerRadius": 6})
        create_node("text", "Step Title", sx + 16, 495, parent=f1, text=st, props={"fontSize": 14, "fill": C_TEXT})
        create_node("text", "Step Desc", sx + 16, 525, parent=f1, text=sd, props={"fontSize": 12, "fill": C_MUTED, "width": 280})
        sx += 336
    # Feed Kasus
    create_node("text", "Section Feed", 60, 615, parent=f1, text="Kasus Terkini & Live Tracker Feed", props={"fontSize": 18, "fill": C_TEXT})
    fx = 60
    for i in range(3):
        create_node("rectangle", "Feed Card", fx, 650, 420, 190, parent=f1, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 6})
        create_node("text", "Feed Code", fx + 16, 670, parent=f1, text=f"#PMBGM-2026-X8{i}K · SD Tembalang 0{i+1}", props={"fontSize": 13, "fill": C_TEXT})
        create_node("rectangle", "Feed Badge", fx + 320, 665, 80, 22, parent=f1, props={"fill": "#FEF3C7", "cornerRadius": 4})
        create_node("text", "Feed Badge Txt", fx + 326, 669, parent=f1, text="Diteruskan", props={"fontSize": 10, "fill": "#92400E"})
        create_node("text", "Feed Desc", fx + 16, 705, parent=f1, text="Keluhan porsi lauk kurang dan sayur agak berbau asam saat diterima murid.", props={"fontSize": 12, "fill": C_MUTED, "width": 380})
        create_node("rectangle", "Feed Divider", fx + 16, 765, 388, 1, parent=f1, props={"fill": C_LIGHT_BORDER})
        create_node("text", "Feed Time", fx + 16, 785, parent=f1, text="⏱️ Sisa Waktu SLA: 14 Jam · Mitra: SPPG Tembalang 03", props={"fontSize": 11, "fill": C_MUTED})
        fx += 450
    draw_footer(f1)

    # 1.2 Form Lapor 5-Langkah
    move_pointer(1700 + 720, 200 + 480)
    f2 = create_node("frame", "1.2 Form Pelaporan Cerdas (/lapor)", 1700, 200, 1440, 960, props={"fill": C_BG_PAGE, "stroke": C_BORDER, "cornerRadius": 8})
    draw_navbar(f2, "Lapor")
    # Stepper
    create_node("rectangle", "Stepper BG", 60, 90, 1320, 50, parent=f2, props={"fill": "#F8FAFC", "stroke": C_LIGHT_BORDER, "cornerRadius": 6})
    create_node("text", "Stepper Steps", 120, 107, parent=f2, text="[✓ 1. Pilih Sekolah] ────── [● 2. Kategori Masalah] ────── [○ 3. Kronologi Kasus] ────── [○ 4. Unggah Bukti EXIF] ────── [○ 5. Mode Identitas]", props={"fontSize": 12, "fill": C_TEXT})
    # Form Left
    create_node("text", "Form Title", 60, 165, parent=f2, text="Formulir Pengaduan Layanan Makan Bergizi Gratis (MBG)", props={"fontSize": 20, "fill": C_TEXT})
    create_node("text", "Form Sub", 60, 195, parent=f2, text="Laporan Anda akan dianalisis secara independen sebelum diteruskan ke dapur SPPG dan Dinas Kesehatan.", props={"fontSize": 13, "fill": C_MUTED})
    # Inputs
    create_node("text", "Label Sekolah", 60, 235, parent=f2, text="1. Nama Sekolah Sasaran *", props={"fontSize": 13, "fill": C_TEXT})
    create_node("rectangle", "Input Sekolah", 60, 255, 800, 42, parent=f2, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 6})
    create_node("text", "Val Sekolah", 75, 268, parent=f2, text="SD Negeri Tembalang 01 (Otomatis terhubung: SPPG Tembalang 03)", props={"fontSize": 13, "fill": C_TEXT})
    create_node("text", "Label Kat", 60, 315, parent=f2, text="2. Pilih Kategori Masalah Utama *", props={"fontSize": 13, "fill": C_TEXT})
    kats = ["🔴 Keracunan (Mual/Muntah)", "🟡 Makanan Tidak Layak (Basi/Bau)", "🔵 Kebersihan / Wadah Kotor", "🟢 Porsi & Gizi Kurang", "⚪ Keterlambatan Distribusi", "🟣 Pengadaan Bahan Pangan"]
    for idx, k in enumerate(kats):
        row = idx // 2
        col = idx % 2
        create_node("rectangle", f"Radio Kat {idx}", 60 + col * 410, 340 + row * 46, 390, 38, parent=f2, props={"fill": "#F8FAFC", "stroke": C_BORDER, "cornerRadius": 6})
        create_node("text", f"Txt Kat {idx}", 80 + col * 410, 351 + row * 46, parent=f2, text=k, props={"fontSize": 12, "fill": C_TEXT})
    create_node("text", "Label Uraian", 60, 495, parent=f2, text="3. Uraian Kejadian & Kronologi Masalah *", props={"fontSize": 13, "fill": C_TEXT})
    create_node("rectangle", "Input Deskripsi", 60, 520, 800, 100, parent=f2, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 6})
    create_node("text", "Placeholder Deskripsi", 75, 535, parent=f2, text="Ceritakan secara rinci apa yang ditemukan, jam berapa menu tiba, dan berapa anak yang terdampak...", props={"fontSize": 12, "fill": C_MUTED})
    # Upload
    create_node("text", "Label Foto", 60, 640, parent=f2, text="4. Bukti Foto Makanan / Kondisi Dapur (Wajib)", props={"fontSize": 13, "fill": C_TEXT})
    create_node("rectangle", "Dropzone", 60, 665, 800, 110, parent=f2, props={"fill": "#F1F5F9", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 6})
    create_node("text", "Dropzone Txt", 250, 710, parent=f2, text="📷 Tarik foto ke sini atau Klik untuk Mengunggah Foto Asli (Kamera HP)", props={"fontSize": 13, "fill": C_TEXT})
    create_node("text", "Dropzone Hint", 280, 735, parent=f2, text="Metadata EXIF waktu & koordinat GPS foto akan otomatis diverifikasi sistem", props={"fontSize": 11, "fill": C_MUTED})
    # Buttons
    create_node("rectangle", "Btn Submit Lapor", 60, 800, 220, 44, parent=f2, props={"fill": C_NAV, "cornerRadius": 6})
    create_node("text", "Btn Submit Txt", 90, 814, parent=f2, text="Kirim Laporan Resmi →", props={"fontSize": 13, "fill": "#FFFFFF"})
    # Right Guidelines
    create_node("rectangle", "Side Card", 890, 165, 490, 679, parent=f2, props={"fill": "#F8FAFC", "stroke": C_BORDER, "cornerRadius": 8})
    create_node("text", "Side Title", 920, 195, parent=f2, text="Pedoman Pelaporan Beretika", props={"fontSize": 16, "fill": C_TEXT})
    create_node("text", "Side P1", 920, 235, parent=f2, text="• Lampirkan foto asli dari kamera ponsel saat menu dibuka.", props={"fontSize": 13, "fill": C_MUTED, "width": 430})
    create_node("text", "Side P2", 920, 275, parent=f2, text="• Model AI privat kami akan memeriksa konsistensi koordinat lokasi foto dengan titik sekolah tujuan.", props={"fontSize": 13, "fill": C_MUTED, "width": 430})
    create_node("text", "Side P3", 920, 335, parent=f2, text="• Laporan fiktif atau spam akan otomatis disaring oleh sistem machine learning untuk menjaga akuntabilitas.", props={"fontSize": 13, "fill": C_MUTED, "width": 430})
    create_node("text", "Side P4", 920, 395, parent=f2, text="• Identitas Anda dijamin aman. Anda dapat memilih mode Anonim atau Rahasia.", props={"fontSize": 13, "fill": C_MUTED, "width": 430})
    draw_footer(f2)

    # 1.3 Tiket Kasus Terbit
    move_pointer(3300 + 720, 200 + 480)
    f3 = create_node("frame", "1.3 Tiket Kasus Terbit", 3300, 200, 1440, 960, props={"fill": C_BG_PAGE, "stroke": C_BORDER, "cornerRadius": 8})
    draw_navbar(f3, "Lapor")
    create_node("rectangle", "Card Center", 340, 120, 760, 720, parent=f3, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 12})
    create_node("rectangle", "Success Circle", 670, 160, 80, 80, parent=f3, props={"fill": "#D1FAE5", "cornerRadius": 40})
    create_node("text", "Success Check", 700, 185, parent=f3, text="✓", props={"fontSize": 36, "fill": "#065F46"})
    create_node("text", "Success Title", 540, 260, parent=f3, text="Laporan Berhasil Diterbitkan!", props={"fontSize": 24, "fill": C_TEXT})
    create_node("text", "Success Sub", 470, 295, parent=f3, text="Laporan Anda telah tercatat pada pangkalan data pengawasan MBG.", props={"fontSize": 13, "fill": C_MUTED})
    # Ticket Badge
    create_node("rectangle", "Ticket Box", 420, 340, 600, 85, parent=f3, props={"fill": "#F1F5F9", "stroke": "#CBD5E1", "strokeWeight": 1, "cornerRadius": 8})
    create_node("text", "Ticket Label", 450, 355, parent=f3, text="KODE TIKET RESMI ANDA (SIMPAN UNTUK MELACAK):", props={"fontSize": 11, "fill": C_MUTED})
    create_node("text", "Ticket Code", 450, 380, parent=f3, text="PMBGM-2026-X89K", props={"fontSize": 28, "fill": C_NAV})
    create_node("rectangle", "Btn Copy", 900, 365, 95, 36, parent=f3, props={"fill": C_NAV, "cornerRadius": 6})
    create_node("text", "Btn Copy Txt", 916, 376, parent=f3, text="📋 Salin", props={"fontSize": 12, "fill": "#FFFFFF"})
    # Meta Box
    create_node("rectangle", "Meta Box", 420, 450, 600, 240, parent=f3, props={"fill": "#F8FAFC", "stroke": C_LIGHT_BORDER, "cornerRadius": 8})
    create_node("text", "M1", 450, 480, parent=f3, text="Nama Sekolah     : SD Negeri Tembalang 01", props={"fontSize": 13, "fill": C_TEXT})
    create_node("text", "M2", 450, 520, parent=f3, text="Mitra SPPG       : SPPG Tembalang 03 (Jarak 1.4 km)", props={"fontSize": 13, "fill": C_TEXT})
    create_node("text", "M3", 450, 560, parent=f3, text="Kategori Aduan   : Makanan Tidak Layak (Basi / Berlendir)", props={"fontSize": 13, "fill": C_TEXT})
    create_node("text", "M4", 450, 600, parent=f3, text="Waktu Diterima   : 03 Nov 2026, 12:45 WIB", props={"fontSize": 13, "fill": C_TEXT})
    create_node("text", "M5", 450, 640, parent=f3, text="Target SLA Verif : Maksimal 24 Jam (04 Nov 2026, 12:45 WIB)", props={"fontSize": 13, "fill": "#065F46"})
    # Actions
    create_node("rectangle", "Btn Go Lacak", 420, 715, 290, 46, parent=f3, props={"fill": C_NAV, "cornerRadius": 6})
    create_node("text", "Btn Go Lacak Txt", 485, 730, parent=f3, text="🔍 Lacak Kasus Ini Sekarang", props={"fontSize": 13, "fill": "#FFFFFF"})
    create_node("rectangle", "Btn PDF Tanda", 730, 715, 290, 46, parent=f3, props={"fill": "none", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 6})
    create_node("text", "Btn PDF Txt", 790, 730, parent=f3, text="📄 Unduh Tanda Bukti PDF", props={"fontSize": 13, "fill": C_TEXT})
    draw_footer(f3)

    # 1.4 Pelacakan Kasus & SLA
    move_pointer(4900 + 720, 200 + 480)
    f4 = create_node("frame", "1.4 Pelacakan Kasus & Linimasa SLA (/lacak)", 4900, 200, 1440, 960, props={"fill": C_BG_PAGE, "stroke": C_BORDER, "cornerRadius": 8})
    draw_navbar(f4, "Lacak")
    # Search Box
    create_node("rectangle", "Lacak Search Box", 160, 95, 1120, 65, parent=f4, props={"fill": "#F8FAFC", "stroke": C_BORDER, "cornerRadius": 8})
    create_node("text", "Lacak Search Val", 190, 118, parent=f4, text="KODE TIKET: PMBGM-2026-X89K", props={"fontSize": 16, "fill": C_NAV})
    create_node("rectangle", "Btn Search Lacak", 1120, 107, 135, 40, parent=f4, props={"fill": C_NAV, "cornerRadius": 6})
    create_node("text", "Btn Search Txt", 1145, 120, parent=f4, text="🔍 Cari Tiket", props={"fontSize": 13, "fill": "#FFFFFF"})
    # Status Banner
    create_node("rectangle", "Status Banner", 160, 180, 1120, 85, parent=f4, props={"fill": "#ECFDF5", "stroke": "#A7F3D0", "cornerRadius": 8})
    create_node("text", "Stat Title", 190, 200, parent=f4, text="Status: Diteruskan ke Unit Dapur SPPG Tembalang 03", props={"fontSize": 18, "fill": "#065F46"})
    create_node("text", "Stat Sub", 190, 230, parent=f4, text="Laporan telah lolos uji keaslian bukti dan saat ini sedang ditindaklanjuti oleh pengelola dapur.", props={"fontSize": 13, "fill": "#047857"})
    create_node("rectangle", "SLA Badge", 1020, 202, 230, 38, parent=f4, props={"fill": "#065F46", "cornerRadius": 6})
    create_node("text", "SLA Badge Txt", 1040, 214, parent=f4, text="⏱️ Sisa SLA: 18 Jam 20 Menit", props={"fontSize": 12, "fill": "#FFFFFF"})
    # Stepper Timeline
    create_node("rectangle", "Timeline Box", 160, 285, 1120, 95, parent=f4, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 8})
    create_node("text", "TL Title", 190, 305, parent=f4, text="Linimasa Alur Penanganan Resmi:", props={"fontSize": 12, "fill": C_MUTED})
    create_node("text", "TL Steps", 190, 335, parent=f4, text="[✓ Diterima 12:45] ── [✓ Diverifikasi 13:10] ── [● Diteruskan 13:15] ── [○ Ditindaklanjuti] ── [○ Kasus Selesai]", props={"fontSize": 14, "fill": C_NAV})
    # Split Details
    create_node("rectangle", "Box Lapor Detail", 160, 400, 545, 450, parent=f4, props={"fill": "#F8FAFC", "stroke": C_BORDER, "cornerRadius": 8})
    create_node("text", "Box 1 Title", 185, 425, parent=f4, text="Dokumentasi Bukti Awal Pelapor", props={"fontSize": 16, "fill": C_TEXT})
    create_node("rectangle", "Photo Box", 185, 460, 495, 200, parent=f4, props={"fill": "#E2E8F0", "cornerRadius": 6})
    create_node("text", "Photo Label", 360, 550, parent=f4, text="[ Foto Ompreng Makanan ]", props={"fontSize": 13, "fill": C_MUTED})
    create_node("text", "Photo EXIF", 185, 680, parent=f4, text="• Kamera: iPhone 13 (Apple) · Timestamp: 03 Nov 12:15 WIB\n• Geolokasi: Radius 0.3 km dari SD Tembalang 01 (Valid)\n• Evaluasi Model AI: Otentik & Konsisten (96.4%)", props={"fontSize": 12, "fill": C_MUTED})
    # Response Box
    create_node("rectangle", "Box Respon Detail", 735, 400, 545, 450, parent=f4, props={"fill": "#F8FAFC", "stroke": C_BORDER, "cornerRadius": 8})
    create_node("text", "Box 2 Title", 760, 425, parent=f4, text="Tanggapan Instansi & Dapur SPPG", props={"fontSize": 16, "fill": C_TEXT})
    create_node("rectangle", "Respon Msg", 760, 460, 495, 120, parent=f4, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 6})
    create_node("text", "Respon Txt", 780, 480, parent=f4, text="Pengelola SPPG Tembalang 03:\n'Kami menerima laporan ini dan tim pengendali mutu telah menuju sekolah untuk memeriksa sampel kelompok batch sayur siang ini.'", props={"fontSize": 12, "fill": C_TEXT, "width": 450})
    create_node("text", "Rating Header", 760, 610, parent=f4, text="Formulir Kepuasan Pelapor (Tersedia setelah kasus selesai):", props={"fontSize": 12, "fill": C_MUTED})
    create_node("rectangle", "Rating Stars Box", 760, 635, 495, 60, parent=f4, props={"fill": "#F1F5F9", "cornerRadius": 6})
    create_node("text", "Rating Stars", 880, 655, parent=f4, text="★ ★ ★ ★ ☆ (Belum dinilai)", props={"fontSize": 16, "fill": "#94A3B8"})
    create_node("rectangle", "Btn Tanya Kasus", 760, 715, 230, 40, parent=f4, props={"fill": C_NAV, "cornerRadius": 6})
    create_node("text", "Btn Tanya Txt", 785, 728, parent=f4, text="💬 Kirim Pertanyaan Tambahan", props={"fontSize": 12, "fill": "#FFFFFF"})
    draw_footer(f4)

    # 1.5 Cari Sekolah
    move_pointer(6500 + 720, 200 + 480)
    f5 = create_node("frame", "1.5 Cari & Direktori Sekolah (/cari-sekolah)", 6500, 200, 1440, 960, props={"fill": C_BG_PAGE, "stroke": C_BORDER, "cornerRadius": 8})
    draw_navbar(f5, "Data")
    # Search Filter
    create_node("rectangle", "Filter Bar", 60, 95, 1320, 65, parent=f5, props={"fill": "#F8FAFC", "stroke": C_BORDER, "cornerRadius": 8})
    create_node("text", "Filter Cari", 85, 120, parent=f5, text="🔍 Ketik nama sekolah (contoh: SD Tembalang, SMP 1, SMA 3)...", props={"fontSize": 13, "fill": C_MUTED})
    create_node("rectangle", "Filter Jenjang", 950, 110, 180, 36, parent=f5, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 6})
    create_node("text", "Jenjang Txt", 970, 121, parent=f5, text="Jenjang: Semua ▼", props={"fontSize": 12, "fill": C_TEXT})
    create_node("rectangle", "Filter Kec", 1150, 110, 200, 36, parent=f5, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 6})
    create_node("text", "Kec Txt", 1170, 121, parent=f5, text="Kecamatan: Semua ▼", props={"fontSize": 12, "fill": C_TEXT})
    # Grid 12 Kartu
    for row in range(3):
        for col in range(4):
            sx = 60 + col * 336
            sy = 180 + row * 220
            idx = row * 4 + col + 1
            create_node("rectangle", f"Sekolah Card {idx}", sx, sy, 312, 195, parent=f5, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 8})
            create_node("text", f"SC Title {idx}", sx + 16, sy + 18, parent=f5, text=f"SD Negeri Tembalang {idx:02d}", props={"fontSize": 14, "fill": C_NAV})
            create_node("text", f"SC NPSN {idx}", sx + 16, sy + 40, parent=f5, text="NPSN: 20328910 · Kec. Tembalang", props={"fontSize": 11, "fill": C_MUTED})
            create_node("rectangle", f"SC Div {idx}", sx + 16, sy + 62, 280, 1, parent=f5, props={"fill": C_LIGHT_BORDER})
            create_node("text", f"SC Dapur {idx}", sx + 16, sy + 75, parent=f5, text="🍱 Mitra: SPPG Tembalang 03", props={"fontSize": 12, "fill": C_TEXT})
            create_node("text", f"SC Jarak {idx}", sx + 16, sy + 98, parent=f5, text="📍 Jarak Dapur: 1.4 km · Siswa: 520", props={"fontSize": 11, "fill": C_MUTED})
            create_node("text", f"SC SLHS {idx}", sx + 16, sy + 120, parent=f5, text="🛡️ SLHS: Terverifikasi Aktif", props={"fontSize": 11, "fill": "#065F46"})
            create_node("rectangle", f"SC Btn {idx}", sx + 16, sy + 145, 280, 34, parent=f5, props={"fill": "#F1F5F9", "cornerRadius": 6})
            create_node("text", f"SC Btn Txt {idx}", sx + 105, sy + 155, parent=f5, text="Lihat Profil Sekolah →", props={"fontSize": 12, "fill": C_NAV})
    create_node("text", "Lazy Load Hint", 620, 860, parent=f5, text="Memuat 12 dari 165 sekolah (Gulir ke bawah untuk memuat otomatis)...", props={"fontSize": 12, "fill": C_MUTED})
    draw_footer(f5, 900)

    # 1.6 Detail Profil Sekolah
    move_pointer(8100 + 720, 200 + 480)
    f6 = create_node("frame", "1.6 Detail Profil Sekolah (/sekolah/[npsn])", 8100, 200, 1440, 960, props={"fill": C_BG_PAGE, "stroke": C_BORDER, "cornerRadius": 8})
    draw_navbar(f6, "Data")
    # Header Banner
    create_node("rectangle", "Sekolah Header", 60, 95, 1320, 120, parent=f6, props={"fill": "#F8FAFC", "stroke": C_BORDER, "cornerRadius": 8})
    create_node("text", "SH Name", 90, 120, parent=f6, text="SD Negeri Tembalang 01 Kota Semarang", props={"fontSize": 24, "fill": C_NAV})
    create_node("text", "SH Meta", 90, 160, parent=f6, text="NPSN: 20328912 · Jenjang: SD · Jl. Tirto Agung No. 12 · Daya Tampung: 520 Siswa · Akreditasi: A", props={"fontSize": 13, "fill": C_MUTED})
    create_node("rectangle", "Btn Laporkan Sek", 1120, 130, 220, 44, parent=f6, props={"fill": C_NAV, "cornerRadius": 6})
    create_node("text", "Btn Lap Sek Txt", 1145, 143, parent=f6, text="📢 Lapor untuk Sekolah Ini", props={"fontSize": 13, "fill": "#FFFFFF"})
    # Left: Dapur & Menu
    create_node("rectangle", "Box Dapur", 60, 235, 640, 620, parent=f6, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 8})
    create_node("text", "Dapur Title", 85, 260, parent=f6, text="Dapur Pelayanan MBG (SPPG) Mitra", props={"fontSize": 16, "fill": C_TEXT})
    create_node("rectangle", "Dapur Card", 85, 295, 590, 100, parent=f6, props={"fill": "#F8FAFC", "stroke": C_LIGHT_BORDER, "cornerRadius": 6})
    create_node("text", "Dapur Name", 105, 315, parent=f6, text="SPPG Tembalang 03 (Kapasitas: 3.500 Porsi/Hari)", props={"fontSize": 14, "fill": C_NAV})
    create_node("text", "Dapur SLHS", 105, 345, parent=f6, text="Sertifikat Laik Higiene Sanitasi (SLHS): AKTIF (Dinkes Kota Semarang)", props={"fontSize": 12, "fill": "#065F46"})
    create_node("text", "Dapur Jarak", 105, 368, parent=f6, text="Estimasi Waktu Tempuh Distribusi: 8 Menit (1.4 km)", props={"fontSize": 11, "fill": C_MUTED})
    create_node("text", "Menu Title", 85, 420, parent=f6, text="Jadwal & Menu MBG Hari Ini (03 Nov 2026):", props={"fontSize": 14, "fill": C_TEXT})
    create_node("rectangle", "Menu Card", 85, 450, 590, 160, parent=f6, props={"fill": "#F1F5F9", "cornerRadius": 6})
    create_node("text", "Menu Detail", 105, 475, parent=f6, text="• Karbohidrat : Nasi Putih Pulen (150g)\n• Protein Hewani: Ayam Panggang Kecap Bumbu Rempah (80g)\n• Sayuran     : Sayur Bening Bayam Jagung Manis (100g)\n• Buah Segar  : Pisang Raja (1 Buah)\n• Minuman     : Susu Pasteurisasi Kotak (125 ml)", props={"fontSize": 12, "fill": C_TEXT})
    create_node("text", "Nutrisi", 105, 580, parent=f6, text="Total Kalori: 620 kkal · Protein: 24g · Kalsium: 310mg (Sesuai AKG Kemenkes)", props={"fontSize": 11, "fill": "#065F46"})
    # Right: Kasus & Evaluasi
    create_node("rectangle", "Box Kasus Sek", 740, 235, 640, 620, parent=f6, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 8})
    create_node("text", "Kasus Sek Title", 765, 260, parent=f6, text="Catatan Pengawasan & Riwayat Laporan (30 Hari)", props={"fontSize": 16, "fill": C_TEXT})
    for k_idx in range(3):
        ky = 300 + k_idx * 95
        create_node("rectangle", f"KRow {k_idx}", 765, ky, 590, 80, parent=f6, props={"fill": "#F8FAFC", "stroke": C_LIGHT_BORDER, "cornerRadius": 6})
        create_node("text", f"KTxt {k_idx}", 785, ky + 15, parent=f6, text=f"#PMBGM-2026-T0{k_idx+1} · Laporan Porsi Gizi", props={"fontSize": 13, "fill": C_TEXT})
        create_node("text", f"KStat {k_idx}", 785, ky + 42, parent=f6, text="Telah ditindaklanjuti dan dikonfirmasi tuntas oleh komite sekolah.", props={"fontSize": 11, "fill": C_MUTED})
        create_node("rectangle", f"KBadge {k_idx}", 1250, ky + 15, 85, 24, parent=f6, props={"fill": "#D1FAE5", "cornerRadius": 4})
        create_node("text", f"KBText {k_idx}", 1270, ky + 20, parent=f6, text="Selesai", props={"fontSize": 11, "fill": "#065F46"})
    create_node("text", "Nilai Rating Title", 765, 610, parent=f6, text="Indeks Kepuasan Siswa & Orang Tua di Sekolah Ini:", props={"fontSize": 13, "fill": C_TEXT})
    create_node("rectangle", "Rating Card Box", 765, 640, 590, 80, parent=f6, props={"fill": "#F1F5F9", "cornerRadius": 6})
    create_node("text", "Rating Big", 790, 665, parent=f6, text="★ 4.8 / 5.0", props={"fontSize": 24, "fill": C_NAV})
    create_node("text", "Rating Sub", 930, 675, parent=f6, text="Berdasarkan 48 ulasan terverifikasi orang tua & guru.", props={"fontSize": 12, "fill": C_MUTED})
    draw_footer(f6)

    total_created += 6
    print(" -> BOARD 1 selesai! Bergerak ke BOARD 2...")

    # =========================================================================
    # BOARD 2: PORTAL DATA TERBUKA & ANALITIK INSIGHT (y: 1400)
    # =========================================================================
    print(" -> Membangun BOARD 2: Data Terbuka & Analitik Insight (6 Layar)...")
    create_node("text", "Header Board 2", 100, 1300, text="02. PORTAL DATA TERBUKA & ANALITIK INSIGHT (AKUNTABILITAS & KEPATUHAN)", props={"fontSize": 24, "fill": "#0F172A"})

    # 2.1 Hub Data Terbuka
    move_pointer(100 + 720, 1400 + 480)
    f7 = create_node("frame", "2.1 Hub Data Terbuka (/data)", 100, 1400, 1440, 960, props={"fill": C_BG_PAGE, "stroke": C_BORDER, "cornerRadius": 8})
    draw_navbar(f7, "Data")
    create_node("text", "DTitle", 60, 100, parent=f7, text="Pangkalan Data Terbuka Program Makan Bergizi Gratis (MBG)", props={"fontSize": 22, "fill": C_TEXT})
    create_node("text", "DSub", 60, 135, parent=f7, text="Akses publik terbuka terhadap rekapitulasi data porsi, profil dapur SPPG, dan kepatuhan standar higienitas.", props={"fontSize": 13, "fill": C_MUTED})
    # 4 Nav Modules
    mods = [("🍱 Direktori Dapur SPPG", "40 Dapur terdata & status SLHS", "/data/sppg"), ("🗺️ Peta Sebaran Wilayah", "Visualisasi spasial 16 kecamatan", "/data/wilayah"), ("📋 Rekap Kasus Laporan", "Arsip kasus terverifikasi publik", "/data/kasus"), ("📥 Unduh Data Terbuka", "Ekspor dataset format CSV / PDF", "/data/unduh")]
    mx = 60
    for mt, md, ml in mods:
        create_node("rectangle", "Mod Card", mx, 175, 312, 105, parent=f7, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 8})
        create_node("text", "Mod Title", mx + 16, 195, parent=f7, text=mt, props={"fontSize": 14, "fill": C_NAV})
        create_node("text", "Mod Sub", mx + 16, 222, parent=f7, text=md, props={"fontSize": 11, "fill": C_MUTED})
        create_node("text", "Mod Link", mx + 16, 248, parent=f7, text=f"Buka Modul →", props={"fontSize": 11, "fill": "#065F46"})
        mx += 336
    # Stat Cards
    create_node("text", "Stat Overview", 60, 310, parent=f7, text="Ringkasan Capaian Operasional Program (Agregat Jawa Tengah & Semarang)", props={"fontSize": 16, "fill": C_TEXT})
    stats = [("184.200 Porsi", "Total Porsi Tersalurkan"), ("94.2%", "Dapur Ber-SLHS Aktif"), ("165 Sekolah", "Terlayani MBG Aktif"), ("14 Kasus", "Selesai Ditindaklanjuti")]
    sx = 60
    for st, sl in stats:
        create_node("rectangle", "Stat Box", sx, 340, 312, 70, parent=f7, props={"fill": "#F8FAFC", "stroke": C_LIGHT_BORDER, "cornerRadius": 6})
        create_node("text", "Stat Val", sx + 16, 355, parent=f7, text=st, props={"fontSize": 18, "fill": C_NAV})
        create_node("text", "Stat Lbl", sx + 16, 382, parent=f7, text=sl, props={"fontSize": 11, "fill": C_MUTED})
        sx += 336
    # Table Preview
    create_node("text", "Tbl Title", 60, 440, parent=f7, text="Rekapitulasi Kasus Terbuka 7 Hari Terakhir", props={"fontSize": 16, "fill": C_TEXT})
    create_node("rectangle", "Tbl Header", 60, 475, 1320, 38, parent=f7, props={"fill": "#F1F5F9", "cornerRadius": 4})
    create_node("text", "TH", 80, 487, parent=f7, text="ID KASUS           SEKOLAH TERKAIT                  MITRA SPPG              KATEGORI ADUAN             STATUS PENANGANAN       WAKTU", props={"fontSize": 11, "fill": C_NAV})
    for r in range(5):
        ry = 515 + r * 60
        create_node("rectangle", f"TR {r}", 60, ry, 1320, 52, parent=f7, props={"fill": "#FFFFFF", "stroke": C_LIGHT_BORDER, "cornerRadius": 4})
        create_node("text", f"TD {r}", 80, ry + 18, parent=f7, text=f"#PMBGM-X0{r}    SD Negeri Tembalang {r+1:02d}      SPPG Tembalang 03       Makanan Tidak Layak        Ditindaklanjuti           03 Nov 1{r}:00", props={"fontSize": 12, "fill": C_TEXT})
    draw_footer(f7)

    # 2.2 Direktori Dapur SPPG
    move_pointer(1700 + 720, 1400 + 480)
    f8 = create_node("frame", "2.2 Direktori 40 Dapur SPPG (/data/sppg)", 1700, 1400, 1440, 960, props={"fill": C_BG_PAGE, "stroke": C_BORDER, "cornerRadius": 8})
    draw_navbar(f8, "Data")
    create_node("text", "SPPG Title", 60, 100, parent=f8, text="Direktori & Indeks Kepatuhan 40 Dapur SPPG Kota Semarang", props={"fontSize": 20, "fill": C_TEXT})
    create_node("text", "SPPG Sub", 60, 130, parent=f8, text="Transparansi kapasitas porsi harian, kepemilikan Sertifikat Laik Higiene Sanitasi (SLHS), dan skor indeks risiko.", props={"fontSize": 13, "fill": C_MUTED})
    # Filter
    create_node("rectangle", "SPPG Filter", 60, 165, 1320, 50, parent=f8, props={"fill": "#F8FAFC", "stroke": C_BORDER, "cornerRadius": 6})
    create_node("text", "SF1", 85, 180, parent=f8, text="🔍 Cari Nama Dapur SPPG...", props={"fontSize": 12, "fill": C_MUTED})
    create_node("text", "SF2", 1000, 180, parent=f8, text="Filter SLHS: Semua ▼", props={"fontSize": 12, "fill": C_TEXT})
    create_node("text", "SF3", 1180, 180, parent=f8, text="Urutkan: Risiko Terendah ▼", props={"fontSize": 12, "fill": C_TEXT})
    # Table 40 Dapur
    create_node("rectangle", "SPPG TH", 60, 230, 1320, 42, parent=f8, props={"fill": "#0F172A", "cornerRadius": 6})
    create_node("text", "SPPG TH Txt", 80, 244, parent=f8, text="KODE     NAMA UNIT DAPUR SPPG        KECAMATAN         KAPASITAS      STATUS SLHS DINKES       INDEKS RISIKO (SAW)   SLA RESPO    AKSI", props={"fontSize": 11, "fill": "#FFFFFF"})
    for d_idx in range(8):
        dy = 275 + d_idx * 68
        create_node("rectangle", f"SPPG TR {d_idx}", 60, dy, 1320, 60, parent=f8, props={"fill": "#FFFFFF", "stroke": C_LIGHT_BORDER, "cornerRadius": 4})
        slhs_txt = "🟢 Aktif (Dinkes)" if d_idx % 3 != 1 else "🟡 Dalam Perpanjangan"
        risiko = "🟢 Rendah (18)" if d_idx % 2 == 0 else "🟡 Sedang (44)"
        create_node("text", f"SPPG TD {d_idx}", 80, dy + 22, parent=f8, text=f"SPPG-{d_idx+1:02d}  Dapur Sehat Tembalang {d_idx+1:02d}    Tembalang         3.500 Porsi    {slhs_txt:<25} {risiko:<20} 98.2%       [Detail →]", props={"fontSize": 12, "fill": C_TEXT})
    create_node("text", "SPPG Paging", 600, 830, parent=f8, text="Menampilkan 8 dari 40 Dapur SPPG Terdaftar (Halaman 1 dari 5)", props={"fontSize": 12, "fill": C_MUTED})
    draw_footer(f8)

    # 2.3 Peta Sebaran Wilayah
    move_pointer(3300 + 720, 1400 + 480)
    f9 = create_node("frame", "2.3 Peta Spasial & Sebaran Wilayah (/data/wilayah)", 3300, 1400, 1440, 960, props={"fill": C_BG_PAGE, "stroke": C_BORDER, "cornerRadius": 8})
    draw_navbar(f9, "Data")
    # Map Split
    create_node("rectangle", "Map Box", 60, 95, 880, 750, parent=f9, props={"fill": "#F1F5F9", "stroke": C_BORDER, "cornerRadius": 8})
    create_node("text", "Map Title", 90, 120, parent=f9, text="Peta Spasial Zonasi Risiko & Sebaran Dapur SPPG (D3-Geo)", props={"fontSize": 16, "fill": C_TEXT})
    create_node("text", "Map Hint", 90, 145, parent=f9, text="Klik pada kecamatan atau kabupaten/kota untuk melihat rincian kapasitas & aduan", props={"fontSize": 12, "fill": C_MUTED})
    create_node("rectangle", "Map Visual Area", 90, 180, 820, 630, parent=f9, props={"fill": "#E2E8F0", "cornerRadius": 6})
    create_node("text", "Map Graphic Center", 350, 480, parent=f9, text="[ PETA KOROPLET JAWA TENGAH & 16 KECAMATAN SEMARANG ]\n(Zonasi Hijau: Rendah · Kuning: Sedang · Merah: Perlu Sidak)", props={"fontSize": 14, "fill": C_NAV})
    # Map Side Panel
    create_node("rectangle", "Map Side", 960, 95, 420, 750, parent=f9, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 8})
    create_node("text", "Side Wil Title", 985, 125, parent=f9, text="Rincian Wilayah Terpilih", props={"fontSize": 16, "fill": C_TEXT})
    create_node("rectangle", "Wil Tag", 985, 160, 200, 28, parent=f9, props={"fill": "#D1FAE5", "cornerRadius": 14})
    create_node("text", "Wil Tag Txt", 1005, 167, parent=f9, text="Kecamatan Tembalang", props={"fontSize": 12, "fill": "#065F46"})
    create_node("text", "Wil Stat 1", 985, 210, parent=f9, text="• Jumlah Sekolah Terdata : 24 Sekolah\n• Unit Dapur Pelayanan   : 3 Unit SPPG\n• Total Siswa Penerima   : 12.400 Siswa\n• Status SLHS Dapur      : 100% Aktif\n• Kasus 30 Hari Terakhir : 2 Kasus (Tuntas)\n• Rata-rata Skor Risiko  : 22 (Rendah)", props={"fontSize": 13, "fill": C_TEXT})
    create_node("text", "Layer Title", 985, 380, parent=f9, text="Pilihan Lapisan Peta (Layers):", props={"fontSize": 13, "fill": C_MUTED})
    layers = ["● Tingkat Risiko SAW Wilayah", "○ Kepadatan Siswa Penerima MBG", "○ Rasio Dapur per Sekolah", "○ Riwayat Peringatan Dini KLB"]
    for l_idx, lyr in enumerate(layers):
        create_node("rectangle", f"LBox {l_idx}", 985, 410 + l_idx * 46, 370, 36, parent=f9, props={"fill": "#F8FAFC", "stroke": C_LIGHT_BORDER, "cornerRadius": 6})
        create_node("text", f"LTxt {l_idx}", 1005, 421 + l_idx * 46, parent=f9, text=lyr, props={"fontSize": 12, "fill": C_TEXT})
    draw_footer(f9)

    # 2.4 Matriks Risiko SAW
    move_pointer(4900 + 720, 1400 + 480)
    f10 = create_node("frame", "2.4 Matriks Prioritas Risiko SAW (/insight/prioritas)", 4900, 1400, 1440, 960, props={"fill": C_BG_PAGE, "stroke": C_BORDER, "cornerRadius": 8})
    draw_navbar(f10, "Insight")
    create_node("text", "SAW Title", 60, 100, parent=f10, text="Sistem Pendukung Keputusan (DSS) Metode Simple Additive Weighting", props={"fontSize": 20, "fill": C_TEXT})
    create_node("text", "SAW Sub", 60, 130, parent=f10, text="Algoritma perangkingan matematis berbobot objektif untuk menetapkan prioritas sidak dan inspeksi sanitasi Dinas Kesehatan.", props={"fontSize": 13, "fill": C_MUTED})
    # 5 Criteria Cards
    criterias = [
        ("C1: Laporan Warga", "Bobot 35%", "Frekuensi keluhan terverifikasi per 1.000 porsi"),
        ("C2: Kasus Keracunan", "Bobot 25%", "Riwayat gangguan kesehatan terverifikasi medis"),
        ("C3: Sertifikat SLHS", "Bobot 15%", "Kepatuhan laik higiene sanitasi dapur Kemenkes"),
        ("C4: Keterlambatan SLA", "Bobot 15%", "Persentase aduan melewati batas waktu resmi"),
        ("C5: Kepuasan Pelapor", "Bobot 10%", "Rata-rata ulasan bintang dari orang tua murid")
    ]
    cx = 60
    for c_title, c_wt, c_desc in criterias:
        create_node("rectangle", "Crit Card", cx, 170, 248, 120, parent=f10, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 8})
        create_node("text", "Crit Title", cx + 14, 190, parent=f10, text=c_title, props={"fontSize": 13, "fill": C_NAV})
        create_node("rectangle", "Crit Badge", cx + 14, 215, 80, 20, parent=f10, props={"fill": "#D1FAE5", "cornerRadius": 4})
        create_node("text", "Crit Badge Txt", cx + 22, 219, parent=f10, text=c_wt, props={"fontSize": 10, "fill": "#065F46"})
        create_node("text", "Crit Desc", cx + 14, 245, parent=f10, text=c_desc, props={"fontSize": 11, "fill": C_MUTED, "width": 220})
        cx += 268
    # Priority Table
    create_node("text", "Rank Title", 60, 315, parent=f10, text="Daftar Prioritas Inspeksi Lapangan Dinas Kesehatan (Skor SAW Tertinggi):", props={"fontSize": 16, "fill": C_TEXT})
    create_node("rectangle", "Rank TH", 60, 350, 1320, 38, parent=f10, props={"fill": "#0F172A", "cornerRadius": 6})
    create_node("text", "Rank TH Txt", 80, 362, parent=f10, text="PRIORITAS   NAMA DAPUR SPPG          KECAMATAN       SKOR SAW   LEVEL RISIKO     INDIKATOR UTAMA PEMICU           REKOMENDASI DINKES", props={"fontSize": 11, "fill": "#FFFFFF"})
    for r_idx in range(5):
        ry = 395 + r_idx * 75
        skor = 82 - r_idx * 12
        lvl = "🔴 Tinggi" if skor >= 70 else ("🟡 Sedang" if skor >= 40 else "🟢 Rendah")
        rekom = "Inspeksi Lapangan Segera" if skor >= 70 else "Audit Rutin Berkala"
        create_node("rectangle", f"Rank TR {r_idx}", 60, ry, 1320, 68, parent=f10, props={"fill": "#FFFFFF", "stroke": C_LIGHT_BORDER, "cornerRadius": 4})
        create_node("text", f"Rank TD {r_idx}", 80, ry + 25, parent=f10, text=f"Peringkat {r_idx+1}   SPPG Pedurungan 0{r_idx+1}     Pedurungan       {skor}         {lvl:<15} Lonjakan keluhan & SLHS tertunda   {rekom}", props={"fontSize": 12, "fill": C_TEXT})
    draw_footer(f10)

    # 2.5 Deteksi Dini & KLB
    move_pointer(6500 + 720, 1400 + 480)
    f11 = create_node("frame", "2.5 Peringatan Dini & Deteksi KLB (/insight/peringatan)", 6500, 1400, 1440, 960, props={"fill": C_BG_PAGE, "stroke": C_BORDER, "cornerRadius": 8})
    draw_navbar(f11, "Insight")
    # Warning Banner
    create_node("rectangle", "Red Banner", 60, 95, 1320, 80, parent=f11, props={"fill": "#FEE2E2", "stroke": "#F87171", "cornerRadius": 8})
    create_node("text", "Red Title", 90, 115, parent=f11, text="🚨 SISTEM DETEKSI DINI ANOMALI AKTIF — CEGAH KEJADIAN LUAR BIASA (KLB)", props={"fontSize": 16, "fill": "#991B1B"})
    create_node("text", "Red Sub", 90, 142, parent=f11, text="Algoritma memindai aduan setiap 15 menit. Ambang batas peringatan: ≥ 3 laporan terverifikasi pada 1 SPPG dalam 24 jam.", props={"fontSize": 12, "fill": "#7F1D1D"})
    # Anomaly Cards
    create_node("text", "Card Alert Title", 60, 200, parent=f11, text="Status Pemantauan Anomali 24 Jam Terakhir", props={"fontSize": 16, "fill": C_TEXT})
    create_node("rectangle", "Alert Card 1", 60, 230, 640, 260, parent=f11, props={"fill": "#FFFFFF", "stroke": "#FCA5A5", "strokeWeight": 2, "cornerRadius": 8})
    create_node("rectangle", "Alert Badge", 85, 255, 180, 26, parent=f11, props={"fill": "#FEE2E2", "cornerRadius": 4})
    create_node("text", "Alert Badge Txt", 100, 261, parent=f11, text="⚠️ PERINGATAN LONJAKAN", props={"fontSize": 11, "fill": "#991B1B"})
    create_node("text", "AC Title", 85, 295, parent=f11, text="SPPG Banyumanik 02 · 4 Aduan Gejala Medis", props={"fontSize": 16, "fill": C_NAV})
    create_node("text", "AC Detail", 85, 325, parent=f11, text="Terdeteksi 4 laporan dari 2 sekolah berbeda dalam rentang 3 jam.\nGejala yang dilaporkan: Mual, muntah, dan pusing usai makan siang.\nStatus: Eskalasi otomatis terkirim ke Puskesmas Banyumanik.", props={"fontSize": 12, "fill": C_TEXT})
    create_node("rectangle", "Btn Siasati", 85, 420, 200, 40, parent=f11, props={"fill": "#991B1B", "cornerRadius": 6})
    create_node("text", "Btn Siasati Txt", 115, 432, parent=f11, text="Lihat Tindakan Dinkes →", props={"fontSize": 12, "fill": "#FFFFFF"})
    # Chart Simulation
    create_node("rectangle", "Chart Box", 730, 230, 650, 600, parent=f11, props={"fill": "#F8FAFC", "stroke": C_BORDER, "cornerRadius": 8})
    create_node("text", "Chart Title", 755, 255, parent=f11, text="Grafik Pemantauan Tren Aduan vs Batas Ambang KLB (Spike Detector)", props={"fontSize": 14, "fill": C_TEXT})
    create_node("rectangle", "Chart Canvas", 755, 290, 600, 510, parent=f11, props={"fill": "#E2E8F0", "cornerRadius": 6})
    create_node("text", "Chart Visual", 920, 540, parent=f11, text="[ GRAFIK TREN SPASIAL & AMBANG BATAS KLB ]", props={"fontSize": 14, "fill": C_NAV})
    draw_footer(f11)

    # 2.6 Simulator DSS SAW
    move_pointer(8100 + 720, 1400 + 480)
    f12 = create_node("frame", "2.6 Simulator DSS SAW & Panduan (/panduan)", 8100, 1400, 1440, 960, props={"fill": C_BG_PAGE, "stroke": C_BORDER, "cornerRadius": 8})
    draw_navbar(f12, "Panduan")
    # Left: Simulator
    create_node("rectangle", "Sim Box", 60, 95, 640, 750, parent=f12, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 8})
    create_node("text", "Sim Title", 85, 125, parent=f12, text="Simulator Interaktif Perhitungan Indeks Risiko (SAW)", props={"fontSize": 18, "fill": C_NAV})
    create_node("text", "Sim Sub", 85, 155, parent=f12, text="Uji sensitivitas bobot kriteria untuk melihat perubahan skor risiko dapur.", props={"fontSize": 12, "fill": C_MUTED})
    sim_sliders = [
        ("C1: Jumlah Laporan 30 Hari", "Bobot: 35%", 70),
        ("C2: Kasus Kejadian Keracunan", "Bobot: 25%", 0),
        ("C3: Kepatuhan Sertifikat SLHS", "Bobot: 15%", 100),
        ("C4: Keterlambatan Respon SLA", "Bobot: 15%", 20),
        ("C5: Rata-rata Kepuasan Konsumen", "Bobot: 10%", 85)
    ]
    sy = 195
    for s_name, s_w, s_val in sim_sliders:
        create_node("text", f"STxt {s_name}", 85, sy, parent=f12, text=f"{s_name} ({s_w})", props={"fontSize": 12, "fill": C_TEXT})
        create_node("rectangle", f"SBar {s_name}", 85, sy + 20, 590, 10, parent=f12, props={"fill": "#E2E8F0", "cornerRadius": 5})
        create_node("rectangle", f"SProg {s_name}", 85, sy + 20, int(5.9 * s_val), 10, parent=f12, props={"fill": C_NAV, "cornerRadius": 5})
        create_node("text", f"SVal {s_name}", 630, sy, parent=f12, text=f"{s_val}%", props={"fontSize": 12, "fill": C_NAV})
        sy += 65
    # Result Box
    create_node("rectangle", "Res Box", 85, 550, 590, 180, parent=f12, props={"fill": "#ECFDF5", "stroke": "#A7F3D0", "cornerRadius": 8})
    create_node("text", "Res Title", 110, 575, parent=f12, text="HASIL PERHITUNGAN SIMULASI SAW:", props={"fontSize": 12, "fill": "#065F46"})
    create_node("text", "Res Score", 110, 605, parent=f12, text="SKOR AKHIR: 26.5 · KATEGORI: RENDAH", props={"fontSize": 20, "fill": "#065F46"})
    create_node("text", "Res Rec", 110, 645, parent=f12, text="Rekomendasi Tindakan: Dapur beroperasi normal dengan standar kepatuhan tinggi. Lakukan audit sanitasi berkala 6 bulan sekali.", props={"fontSize": 12, "fill": "#047857", "width": 540})
    create_node("rectangle", "Btn Reset Sim", 85, 750, 160, 40, parent=f12, props={"fill": C_NAV, "cornerRadius": 6})
    create_node("text", "Btn Reset Txt", 120, 762, parent=f12, text="🔄 Reset Default", props={"fontSize": 12, "fill": "#FFFFFF"})
    # Right: Kamus Istilah
    create_node("rectangle", "Dict Box", 740, 95, 640, 750, parent=f12, props={"fill": "#F8FAFC", "stroke": C_BORDER, "cornerRadius": 8})
    create_node("text", "Dict Title", 765, 125, parent=f12, text="Kamus Istilah Transparan untuk Warga", props={"fontSize": 18, "fill": C_NAV})
    terms = [
        ("SPPG (Satuan Pelayanan Pemenuhan Gizi)", "Unit dapur masak resmi yang memproduksi dan mendistribusikan ribuan porsi makanan MBG ke sekolah."),
        ("SLHS (Sertifikat Laik Higiene Sanitasi)", "Sertifikasi resmi dari Dinas Kesehatan yang membuktikan dapur memenuhi standar kebersihan, air bersih, dan kelayakan sanitasi pangan."),
        ("SAW (Simple Additive Weighting)", "Metode matematis untuk menghitung tingkat risiko dapur secara adil dan objektif tanpa rekayasa."),
        ("SLA (Service Level Agreement)", "Batas waktu resmi bagi instansi untuk merespon dan menuntaskan laporan keluhan warga."),
        ("EXIF & Geolokasi GPS", "Data tersembunyi pada berkas foto yang membuktikan waktu pengambilan dan lokasi pemotretan asli.")
    ]
    ty = 175
    for t_term, t_desc in terms:
        create_node("rectangle", f"TBox {t_term}", 765, ty, 590, 95, parent=f12, props={"fill": "#FFFFFF", "stroke": C_LIGHT_BORDER, "cornerRadius": 6})
        create_node("text", f"TName {t_term}", 785, ty + 15, parent=f12, text=t_term, props={"fontSize": 13, "fill": C_NAV})
        create_node("text", f"TDesc {t_term}", 785, ty + 42, parent=f12, text=t_desc, props={"fontSize": 12, "fill": C_MUTED, "width": 550})
        ty += 110
    draw_footer(f12)

    total_created += 6
    print(" -> BOARD 2 selesai! Bergerak ke BOARD 3...")

    # =========================================================================
    # BOARD 3: AUTENTIKASI & MANAJEMEN AKUN (y: 2600)
    # =========================================================================
    print(" -> Membangun BOARD 3: Autentikasi & Manajemen Akun (4 Layar)...")
    create_node("text", "Header Board 3", 100, 2500, text="03. AUTENTIKASI & MANAJEMEN AKUN PENGGUNA", props={"fontSize": 24, "fill": "#0F172A"})

    # 3.1 Masuk Akun 2-Step Persona
    move_pointer(100 + 720, 2600 + 480)
    f13 = create_node("frame", "3.1 Masuk Akun 2-Step Persona (/masuk)", 100, 2600, 1440, 960, props={"fill": C_BG_PAGE, "stroke": C_BORDER, "cornerRadius": 8})
    draw_navbar(f13, "Masuk")
    # Split Login
    create_node("rectangle", "Login Left", 160, 140, 520, 700, parent=f13, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 8})
    create_node("text", "LL Title", 200, 180, parent=f13, text="Masuk ke Platform PMBGM", props={"fontSize": 24, "fill": C_NAV})
    create_node("text", "LL Sub", 200, 215, parent=f13, text="Gunakan akun Anda untuk memantau tiket atau mengelola tugas instansi.", props={"fontSize": 13, "fill": C_MUTED, "width": 440})
    create_node("text", "Lbl Email", 200, 275, parent=f13, text="Alamat Email *", props={"fontSize": 13, "fill": C_TEXT})
    create_node("rectangle", "Input Email", 200, 300, 440, 44, parent=f13, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 6})
    create_node("text", "Val Email", 215, 313, parent=f13, text="rina@pmbgm.test", props={"fontSize": 13, "fill": C_TEXT})
    create_node("text", "Lbl Pass", 200, 370, parent=f13, text="Kata Sandi *", props={"fontSize": 13, "fill": C_TEXT})
    create_node("rectangle", "Input Pass", 200, 395, 440, 44, parent=f13, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 6})
    create_node("text", "Val Pass", 215, 408, parent=f13, text="••••••••••••", props={"fontSize": 16, "fill": C_TEXT})
    create_node("rectangle", "Btn Submit Login", 200, 470, 440, 46, parent=f13, props={"fill": C_NAV, "cornerRadius": 6})
    create_node("text", "Btn Submit LTxt", 380, 484, parent=f13, text="Masuk →", props={"fontSize": 14, "fill": "#FFFFFF"})
    # Right: Persona Juri
    create_node("rectangle", "Login Right", 720, 140, 560, 700, parent=f13, props={"fill": "#F8FAFC", "stroke": C_BORDER, "cornerRadius": 8})
    create_node("text", "LR Title", 755, 175, parent=f13, text="Pilih Cepat Akun Simulasi (Dewan Juri / Evaluator)", props={"fontSize": 18, "fill": C_NAV})
    create_node("text", "LR Sub", 755, 205, parent=f13, text="Klik pada salah satu persona di bawah ini untuk mengisi kredensial secara instan:", props={"fontSize": 12, "fill": C_MUTED})
    personas = [
        ("👤 Ibu Rina (Pelapor Warga)", "rina@pmbgm.test", "Orang tua murid SD Tembalang 01"),
        ("👨‍🏫 Pak Budi (Guru Sekolah)", "budi@pmbgm.test", "Guru SMP Semarang Tengah 1"),
        ("🛡️ Mbak Sari (Verifikator)", "sari@pmbgm.test", "Tim verifikasi independen aduan warga"),
        ("🍱 Pengelola SPPG", "sppg@pmbgm.test", "Pengelola operasional dapur Tembalang 03"),
        ("🏥 Pak Hendra (Dinas Kesehatan)", "hendra@pmbgm.test", "Surveilans sanitasi & deteksi KLB"),
        ("🇮🇩 Korwil BGN Semarang", "korwil@pmbgm.test", "Pengawas kepatuhan SLA wilayah BGN"),
        ("⚙️ Administrator Sistem", "admin@pmbgm.test", "Konfigurasi aturan SLA & hak akses")
    ]
    py = 245
    for p_name, p_mail, p_role in personas:
        create_node("rectangle", f"PBox {p_mail}", 755, py, 490, 55, parent=f13, props={"fill": "#FFFFFF", "stroke": C_LIGHT_BORDER, "cornerRadius": 6})
        create_node("text", f"PName {p_mail}", 775, py + 12, parent=f13, text=p_name, props={"fontSize": 13, "fill": C_NAV})
        create_node("text", f"PRole {p_mail}", 775, py + 32, parent=f13, text=f"{p_mail} · {p_role}", props={"fontSize": 11, "fill": C_MUTED})
        create_node("rectangle", f"BtnP {p_mail}", 1145, py + 12, 85, 30, parent=f13, props={"fill": "#F1F5F9", "cornerRadius": 4})
        create_node("text", f"BtnPTxt {p_mail}", 1165, py + 19, parent=f13, text="Pilih →", props={"fontSize": 11, "fill": C_NAV})
        py += 68
    draw_footer(f13)

    # 3.2 Dasbor Akun Warga
    move_pointer(1700 + 720, 2600 + 480)
    f14 = create_node("frame", "3.2 Dasbor Profil Warga (/akun)", 1700, 2600, 1440, 960, props={"fill": C_BG_PAGE, "stroke": C_BORDER, "cornerRadius": 8})
    draw_navbar(f14, "Beranda")
    # Profile Header
    create_node("rectangle", "Prof Card", 60, 95, 1320, 120, parent=f14, props={"fill": "#F8FAFC", "stroke": C_BORDER, "cornerRadius": 8})
    create_node("text", "Prof Name", 90, 120, parent=f14, text="Ibu Rina Sasmita (Orang Tua Murid)", props={"fontSize": 20, "fill": C_NAV})
    create_node("text", "Prof Meta", 90, 155, parent=f14, text="Status Akun: Terverifikasi (KTP & No HP Terhubung) · Sekolah Anak: SD Negeri Tembalang 01", props={"fontSize": 13, "fill": C_MUTED})
    create_node("rectangle", "Btn Buat Lapor Akun", 1120, 130, 220, 44, parent=f14, props={"fill": C_NAV, "cornerRadius": 6})
    create_node("text", "Btn BL Txt", 1150, 143, parent=f14, text="+ Buat Pengaduan Baru", props={"fontSize": 13, "fill": "#FFFFFF"})
    # Tab
    create_node("rectangle", "Tab Bar", 60, 235, 1320, 45, parent=f14, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 6})
    create_node("text", "Tab Items", 90, 250, parent=f14, text="[● Laporan Saya (3)]         [○ Notifikasi Tindak Lanjut (2)]         [○ Pengaturan Akun & Privasi]", props={"fontSize": 13, "fill": C_NAV})
    # List My Reports
    for m_idx in range(3):
        my_y = 300 + m_idx * 160
        create_node("rectangle", f"MCard {m_idx}", 60, my_y, 1320, 140, parent=f14, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 8})
        create_node("text", f"MCode {m_idx}", 90, my_y + 20, parent=f14, text=f"#PMBGM-2026-X8{m_idx}K · SD Negeri Tembalang 01", props={"fontSize": 15, "fill": C_NAV})
        create_node("text", f"MDesc {m_idx}", 90, my_y + 50, parent=f14, text="Keluhan porsi lauk tidak sesuai jadwal menu dan buah pisang belum matang sempurna.", props={"fontSize": 13, "fill": C_TEXT})
        create_node("text", f"MTimeline {m_idx}", 90, my_y + 85, parent=f14, text="Linimasa: Diterima → Diverifikasi → Ditindaklanjuti oleh Dapur Tembalang 03", props={"fontSize": 11, "fill": C_MUTED})
        create_node("rectangle", f"BtnLihatM {m_idx}", 1160, my_y + 45, 180, 40, parent=f14, props={"fill": "#F1F5F9", "cornerRadius": 6})
        create_node("text", f"BtnLihatMTxt {m_idx}", 1195, my_y + 58, parent=f14, text="Lihat Perkembangan →", props={"fontSize": 12, "fill": C_NAV})
    draw_footer(f14)

    # 3.3 Modal Ulasan Kepuasan
    move_pointer(3300 + 720, 2600 + 480)
    f15 = create_node("frame", "3.3 Dialog Ulasan Kepuasan Pasca-Kasus", 3300, 2600, 1440, 960, props={"fill": "#64748B", "stroke": C_BORDER, "cornerRadius": 8})
    create_node("rectangle", "Modal Box", 420, 150, 600, 660, parent=f15, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 12})
    create_node("text", "Modal Title", 460, 190, parent=f15, text="Penilaian Kepuasan Layanan MBG", props={"fontSize": 20, "fill": C_NAV})
    create_node("text", "Modal Sub", 460, 220, parent=f15, text="Kasus #PMBGM-2026-X89K telah selesai ditindaklanjuti. Masukan Anda akan langsung mempengaruhi indeks kepuasan dapur SPPG.", props={"fontSize": 12, "fill": C_MUTED, "width": 520})
    # Ratings
    r_items = [
        ("1. Kualitas & Kebersihan Makanan Pengganti", "★ ★ ★ ★ ☆ (4.0)"),
        ("2. Kecepatan Respon Pihak Dapur SPPG", "★ ★ ★ ★ ★ (5.0)"),
        ("3. Komunikasi & Transparansi Petugas", "★ ★ ★ ★ ☆ (4.0)")
    ]
    ry_pos = 280
    for r_lbl, r_stars in r_items:
        create_node("text", f"RLbl {r_lbl}", 460, ry_pos, parent=f15, text=r_lbl, props={"fontSize": 13, "fill": C_TEXT})
        create_node("rectangle", f"RStarsBox {r_lbl}", 460, ry_pos + 25, 520, 42, parent=f15, props={"fill": "#F8FAFC", "stroke": C_LIGHT_BORDER, "cornerRadius": 6})
        create_node("text", f"RStarsTxt {r_lbl}", 480, ry_pos + 38, parent=f15, text=r_stars, props={"fontSize": 14, "fill": "#F59E0B"})
        ry_pos += 85
    create_node("text", "Comment Lbl", 460, ry_pos + 10, parent=f15, text="Catatan / Saran Tambahan untuk SPPG:", props={"fontSize": 13, "fill": C_TEXT})
    create_node("rectangle", "Comment Box", 460, ry_pos + 35, 520, 90, parent=f15, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 6})
    create_node("text", "Comment Val", 475, ry_pos + 50, parent=f15, text="Terima kasih atas respon cepatnya. Penggantian menu tiba tepat sebelum jam istirahat kedua.", props={"fontSize": 12, "fill": C_TEXT, "width": 490})
    create_node("rectangle", "Btn Submit Review", 460, 730, 520, 46, parent=f15, props={"fill": C_NAV, "cornerRadius": 6})
    create_node("text", "Btn Review Txt", 640, 744, parent=f15, text="Simpan Ulasan Resmi", props={"fontSize": 14, "fill": "#FFFFFF"})

    # 3.4 Metodologi & Transparansi Rumus
    move_pointer(4900 + 720, 2600 + 480)
    f16 = create_node("frame", "3.4 Metodologi & Formula Sistem (/metodologi)", 4900, 2600, 1440, 960, props={"fill": C_BG_PAGE, "stroke": C_BORDER, "cornerRadius": 8})
    draw_navbar(f16, "Panduan")
    create_node("text", "Met Title", 60, 100, parent=f16, text="Dokumentasi Metodologi Ilmiah & Formula Matematis PMBGM", props={"fontSize": 20, "fill": C_NAV})
    create_node("text", "Met Sub", 60, 130, parent=f16, text="Rincian formula pembobotan SAW, skor kredibilitas laporan, dan batas waktu SLA berjenjang.", props={"fontSize": 13, "fill": C_MUTED})
    # Section 1: Rumus SAW
    create_node("rectangle", "Box SAW Met", 60, 170, 1320, 180, parent=f16, props={"fill": "#F8FAFC", "stroke": C_BORDER, "cornerRadius": 8})
    create_node("text", "SAW Met Title", 85, 195, parent=f16, text="1. Formula Indeks Risiko SPPG (Simple Additive Weighting)", props={"fontSize": 16, "fill": C_TEXT})
    create_node("rectangle", "Formula Box", 85, 230, 800, 50, parent=f16, props={"fill": "#0F172A", "cornerRadius": 6})
    create_node("text", "Formula Txt", 110, 245, parent=f16, text="Indeks Risiko (0–100) = 0.35·L + 0.25·K + 0.15·S + 0.15·T + 0.10·(100 − P)", props={"fontSize": 14, "fill": C_ACCENT})
    create_node("text", "Formula Desc", 85, 295, parent=f16, text="L: Rasio Laporan 30 Hari · K: Kasus Keracunan · S: Status SLHS Kemenkes · T: Keterlambatan SLA · P: Rating Kepuasan", props={"fontSize": 12, "fill": C_MUTED})
    # Section 2: SLA Table
    create_node("text", "SLA Met Title", 60, 380, parent=f16, text="2. Standar Waktu Service Level Agreement (SLA) Resmi:", props={"fontSize": 16, "fill": C_TEXT})
    create_node("rectangle", "SLA Table Header", 60, 415, 1320, 38, parent=f16, props={"fill": "#0F172A", "cornerRadius": 6})
    create_node("text", "SLA TH Txt", 80, 427, parent=f16, text="KATEGORI ADUAN MASALAH           VERIFIKASI AWAL     DITERUSKAN KE INSTANSI     TARGET RESPON SPPG     PENYELESAIAN TUNTAS", props={"fontSize": 11, "fill": "#FFFFFF"})
    slas = [
        ("🔴 Keracunan Pangan (Darurat Medis)", "Maksimal 2 Jam", "Maksimal 4 Jam", "Maksimal 6 Jam (Sidak Dinkes)", "Maksimal 24 Jam"),
        ("🟡 Makanan Tidak Layak (Basi/Ulat)", "Maksimal 6 Jam", "Maksimal 12 Jam", "Maksimal 24 Jam", "Maksimal 48 Jam"),
        ("🔵 Kebersihan & Sanitasi Wadah", "Maksimal 12 Jam", "Maksimal 24 Jam", "Maksimal 48 Jam", "Maksimal 72 Jam"),
        ("🟢 Porsi Kurang & Nutrisi Gizi", "Maksimal 24 Jam", "Maksimal 48 Jam", "Maksimal 72 Jam", "Maksimal 5 Hari Kerja")
    ]
    for s_idx, (s_cat, s_v, s_d, s_r, s_t) in enumerate(slas):
        sy = 455 + s_idx * 55
        create_node("rectangle", f"SLA TR {s_idx}", 60, sy, 1320, 50, parent=f16, props={"fill": "#FFFFFF", "stroke": C_LIGHT_BORDER, "cornerRadius": 4})
        create_node("text", f"SLA TD {s_idx}", 80, sy + 18, parent=f16, text=f"{s_cat:<35} {s_v:<20} {s_d:<26} {s_r:<30} {s_t}", props={"fontSize": 12, "fill": C_TEXT})
    draw_footer(f16)

    total_created += 4
    print(" -> BOARD 3 selesai! Bergerak ke BOARD 4...")

    # =========================================================================
    # BOARD 4: PANEL KERJA MULTI-INSTANSI (y: 3800)
    # =========================================================================
    print(" -> Membangun BOARD 4: Panel Kerja 5 Instansi (5 Layar)...")
    create_node("text", "Header Board 4", 100, 3700, text="04. PANEL KERJA MULTI-INSTANSI (ROLE-BASED WORKSPACES)", props={"fontSize": 24, "fill": "#0F172A"})

    # 4.1 Panel Verifikator + Radar AI
    move_pointer(100 + 720, 3800 + 480)
    f17 = create_node("frame", "4.1 Panel Verifikator + Radar AI (/panel/verifikasi)", 100, 3800, 1440, 960, props={"fill": C_BG_PAGE, "stroke": C_BORDER, "cornerRadius": 8})
    draw_sidebar_panel(f17, "Verifikasi", "Verifikator")
    # Content Area
    create_node("rectangle", "Verif Top", 260, 0, 1180, 68, parent=f17, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1})
    create_node("text", "Verif Header Txt", 290, 24, parent=f17, text="Antrean Verifikasi Aduan Independen · Wilayah Kerja Kota Semarang", props={"fontSize": 16, "fill": C_NAV})
    # Queue Left
    create_node("rectangle", "Queue Box", 280, 90, 440, 840, parent=f17, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 8})
    create_node("text", "Queue Title", 305, 115, parent=f17, text="Laporan Menunggu Tindakan (6 Kasus)", props={"fontSize": 14, "fill": C_TEXT})
    for q_idx in range(5):
        qy = 150 + q_idx * 135
        is_sel = (q_idx == 0)
        qbg = "#F1F5F9" if is_sel else "#FFFFFF"
        qstroke = C_NAV if is_sel else C_LIGHT_BORDER
        create_node("rectangle", f"QCard {q_idx}", 300, qy, 400, 120, parent=f17, props={"fill": qbg, "stroke": qstroke, "strokeWeight": 2 if is_sel else 1, "cornerRadius": 6})
        create_node("text", f"QCode {q_idx}", 315, qy + 15, parent=f17, text=f"#PMBGM-2026-X8{q_idx}K · SD Tembalang 0{q_idx+1}", props={"fontSize": 13, "fill": C_NAV})
        create_node("text", f"QCat {q_idx}", 315, qy + 40, parent=f17, text="Kategori: Makanan Tidak Layak (Basi / Bau)", props={"fontSize": 11, "fill": C_MUTED})
        create_node("text", f"QAI {q_idx}", 315, qy + 65, parent=f17, text="🤖 Skor AI: 96.4% (Otentik & Valid)", props={"fontSize": 11, "fill": "#065F46"})
        create_node("text", f"QTime {q_idx}", 315, qy + 90, parent=f17, text="Waktu Masuk: 12:45 WIB · Sisa SLA: 23 Jam", props={"fontSize": 10, "fill": C_MUTED})
    # Inspector Right
    create_node("rectangle", "Inspect Box", 740, 90, 680, 840, parent=f17, props={"fill": "#F8FAFC", "stroke": C_BORDER, "cornerRadius": 8})
    create_node("text", "Inspect Title", 770, 115, parent=f17, text="Inspektur Bukti & Machine Learning Verification Engine", props={"fontSize": 16, "fill": C_NAV})
    # Radar & Predictions
    create_node("rectangle", "AI Res Box", 770, 150, 620, 110, parent=f17, props={"fill": "#ECFDF5", "stroke": "#A7F3D0", "cornerRadius": 8})
    create_node("text", "AI Res Title", 790, 170, parent=f17, text="HASIL INFERENSI MODEL MLP MULTIMODAL (7-FITUR):", props={"fontSize": 11, "fill": "#065F46"})
    create_node("text", "AI Res Stat", 790, 195, parent=f17, text="OTENTIK & VALID (Probabilitas: 96.4%)", props={"fontSize": 20, "fill": "#065F46"})
    create_node("text", "AI Res Sub", 790, 230, parent=f17, text="Rekomendasi Model: Narasi konsisten dengan leksikon MBG & metadata EXIF foto cocok dengan radius sekolah.", props={"fontSize": 11, "fill": "#047857"})
    # Photo Inspector
    create_node("rectangle", "Photo Box Inspect", 770, 280, 620, 200, parent=f17, props={"fill": "#E2E8F0", "cornerRadius": 8})
    create_node("text", "PBI Label", 980, 380, parent=f17, text="[ BUKTI FOTO OMPRENG & EXIF CHECK ]", props={"fontSize": 13, "fill": C_NAV})
    create_node("text", "EXIF Data List", 770, 495, parent=f17, text="• Integritas Waktu : Foto diambil 03 Nov 12:15 WIB (Selisih 30 menit dari aduan)\n• Integritas GPS   : Radius 0.3 km dari SD Tembalang 01 (Sangat Cocok)\n• Reputasi Akun   : Akun terverifikasi dengan riwayat laporan positif", props={"fontSize": 12, "fill": C_TEXT})
    # Action Buttons
    create_node("rectangle", "Btn Accept", 770, 580, 290, 46, parent=f17, props={"fill": "#059669", "cornerRadius": 6})
    create_node("text", "Btn Accept Txt", 830, 594, parent=f17, text="✓ Valid & Teruskan Kasus", props={"fontSize": 13, "fill": "#FFFFFF"})
    create_node("rectangle", "Btn Clarify", 1100, 580, 290, 46, parent=f17, props={"fill": "#D97706", "cornerRadius": 6})
    create_node("text", "Btn Clarify Txt", 1160, 594, parent=f17, text="? Minta Tambahan Bukti", props={"fontSize": 13, "fill": "#FFFFFF"})
    create_node("rectangle", "Btn Reject", 770, 640, 290, 46, parent=f17, props={"fill": "#DC2626", "cornerRadius": 6})
    create_node("text", "Btn Reject Txt", 820, 654, parent=f17, text="✕ Tolak (Indikasi Fiktif)", props={"fontSize": 13, "fill": "#FFFFFF"})
    create_node("rectangle", "Btn Merge", 1100, 640, 290, 46, parent=f17, props={"fill": C_NAV, "cornerRadius": 6})
    create_node("text", "Btn Merge Txt", 1160, 654, parent=f17, text="🔗 Gabung Kasus Serupa", props={"fontSize": 13, "fill": "#FFFFFF"})

    # 4.2 Panel Dapur SPPG
    move_pointer(1700 + 720, 3800 + 480)
    f18 = create_node("frame", "4.2 Panel Dapur SPPG (/panel/sppg)", 1700, 3800, 1440, 960, props={"fill": C_BG_PAGE, "stroke": C_BORDER, "cornerRadius": 8})
    draw_sidebar_panel(f18, "Dashboard", "Pengelola SPPG")
    create_node("rectangle", "SPPG Top", 260, 0, 1180, 68, parent=f18, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1})
    create_node("text", "SPPG Header Txt", 290, 24, parent=f18, text="Dasbor Operasional & Pengendalian Mutu SPPG Tembalang 03", props={"fontSize": 16, "fill": C_NAV})
    # Stat cards
    s_cards = [("3.500 Porsi", "Target Distribusi Hari Ini"), ("2 Kasus", "Aduan Masuk Perlu Tindakan"), ("98.8%", "Kepatuhan Waktu SLA"), ("SLHS Aktif", "Higiene Sanitasi Terpenuhi")]
    sx = 280
    for st, sl in s_cards:
        create_node("rectangle", "SCard SPPG", sx, 90, 275, 75, parent=f18, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 6})
        create_node("text", "SCT", sx + 14, 105, parent=f18, text=st, props={"fontSize": 16, "fill": C_NAV})
        create_node("text", "SCL", sx + 14, 132, parent=f18, text=sl, props={"fontSize": 11, "fill": C_MUTED})
        sx += 295
    # Form Tindak Lanjut
    create_node("rectangle", "SPPG Form Box", 280, 190, 1140, 730, parent=f18, props={"fill": "#F8FAFC", "stroke": C_BORDER, "cornerRadius": 8})
    create_node("text", "SFT", 310, 220, parent=f18, text="Formulir Tanggapan & Unggah Bukti Tindak Lanjut Lapangan", props={"fontSize": 18, "fill": C_NAV})
    create_node("text", "SFS", 310, 250, parent=f18, text="Kasus #PMBGM-2026-X89K · SD Negeri Tembalang 01 (Keluhan Makanan Berbau)", props={"fontSize": 13, "fill": C_MUTED})
    create_node("text", "SFTxt1", 310, 295, parent=f18, text="1. Uraian Tindakan Perbaikan yang Telah Dilakukan di Dapur / Sekolah *", props={"fontSize": 13, "fill": C_TEXT})
    create_node("rectangle", "Input Tindak", 310, 320, 1080, 100, parent=f18, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 6})
    create_node("text", "Val Tindak", 325, 335, parent=f18, text="Kami telah menarik sisa batch sayur tersebut dan menggantinya dengan paket makanan segar baru yang telah diinspeksi oleh ahli gizi dapur kami. Suhu penyimpanan telah disetel ulang.", props={"fontSize": 12, "fill": C_TEXT, "width": 1050})
    create_node("text", "SFTxt2", 310, 440, parent=f18, text="2. Unggah Bukti Dokumentasi Perbaikan (Foto / Berita Acara)", props={"fontSize": 13, "fill": C_TEXT})
    create_node("rectangle", "Upload SPPG Box", 310, 465, 1080, 130, parent=f18, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 6})
    create_node("text", "Upload SPPG Txt", 650, 525, parent=f18, text="📁 Tarik berkas foto penggantian makanan atau Berita Acara Serah Terima", props={"fontSize": 13, "fill": C_MUTED})
    create_node("rectangle", "Btn Finish Case", 310, 620, 260, 46, parent=f18, props={"fill": C_NAV, "cornerRadius": 6})
    create_node("text", "Btn FC Txt", 345, 634, parent=f18, text="✓ Kirim & Tuntaskan Kasus", props={"fontSize": 13, "fill": "#FFFFFF"})

    # 4.3 Panel Dinas Kesehatan
    move_pointer(3300 + 720, 3800 + 480)
    f19 = create_node("frame", "4.3 Panel Dinas Kesehatan (/panel/dinkes)", 3300, 3800, 1440, 960, props={"fill": C_BG_PAGE, "stroke": C_BORDER, "cornerRadius": 8})
    draw_sidebar_panel(f19, "Peringatan", "Dinas Kesehatan")
    create_node("rectangle", "Dinkes Top", 260, 0, 1180, 68, parent=f19, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1})
    create_node("text", "Dinkes Header Txt", 290, 24, parent=f19, text="Surveilans Keamanan Pangan & Penanganan Kasus Darurat Medis MBG", props={"fontSize": 16, "fill": C_NAV})
    # Emergency Alert
    create_node("rectangle", "Dinkes Alert", 280, 90, 1140, 70, parent=f19, props={"fill": "#FEE2E2", "stroke": "#F87171", "cornerRadius": 8})
    create_node("text", "DAT", 310, 107, parent=f19, text="🚨 KASUS DARURAT KERACUNAN / ANOMALI HIGIENE AKTIF", props={"fontSize": 15, "fill": "#991B1B"})
    create_node("text", "DAS", 310, 130, parent=f19, text="1 Kasus terdeteksi membutuhkan uji laboratorium pangan dan verifikasi medis lapangan segera.", props={"fontSize": 12, "fill": "#7F1D1D"})
    # Table Dinkes
    create_node("rectangle", "Dinkes TH", 280, 180, 1140, 40, parent=f19, props={"fill": "#0F172A", "cornerRadius": 6})
    create_node("text", "Dinkes TH Txt", 300, 193, parent=f19, text="KODE        SEKOLAH                  DAPUR SPPG               GEJALA DILAPORKAN      JUMLAH KORBAN     STATUS TINDAKAN DINKES", props={"fontSize": 11, "fill": "#FFFFFF"})
    for dk_idx in range(4):
        dky = 230 + dk_idx * 75
        create_node("rectangle", f"DkTR {dk_idx}", 280, dky, 1140, 65, parent=f19, props={"fill": "#FFFFFF", "stroke": C_LIGHT_BORDER, "cornerRadius": 4})
        create_node("text", f"DkTD {dk_idx}", 300, dky + 24, parent=f19, text=f"#KRD-0{dk_idx+1}    SD Banyumanik 0{dk_idx+1}      SPPG Banyumanik 02       Mual, muntah 1 jam     4 Siswa           Petugas Puskesmas Menuju Lokasi", props={"fontSize": 12, "fill": C_TEXT})
    # Form Lab
    create_node("rectangle", "Lab Box", 280, 560, 1140, 360, parent=f19, props={"fill": "#F8FAFC", "stroke": C_BORDER, "cornerRadius": 8})
    create_node("text", "Lab Title", 310, 585, parent=f19, text="Formulir Pencatatan Hasil Uji Laboratorium Sampel Makanan", props={"fontSize": 16, "fill": C_NAV})
    create_node("text", "Lab Sub", 310, 615, parent=f19, text="Hasil uji lab ini akan otomatis memperbarui status kepatuhan SLHS dapur SPPG terkait.", props={"fontSize": 12, "fill": C_MUTED})
    create_node("rectangle", "Input Lab 1", 310, 650, 520, 40, parent=f19, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 6})
    create_node("text", "IL1 Txt", 325, 663, parent=f19, text="Uji Bakteri E. Coli & Salmonella: NEGATIF (Memenuhi Syarat)", props={"fontSize": 12, "fill": C_TEXT})
    create_node("rectangle", "Input Lab 2", 860, 650, 520, 40, parent=f19, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 6})
    create_node("text", "IL2 Txt", 875, 663, parent=f19, text="Status Rekomendasi SLHS: REKOMENDASI TETAP BERLAKU", props={"fontSize": 12, "fill": "#065F46"})
    create_node("rectangle", "Btn Save Lab", 310, 715, 240, 44, parent=f19, props={"fill": C_NAV, "cornerRadius": 6})
    create_node("text", "Btn Save Lab Txt", 345, 728, parent=f19, text="Simpan Berita Acara Uji Lab", props={"fontSize": 13, "fill": "#FFFFFF"})

    # 4.4 Panel Korwil BGN
    move_pointer(4900 + 720, 3800 + 480)
    f20 = create_node("frame", "4.4 Panel Korwil BGN - Akuntabilitas SLA (/panel/bgn)", 4900, 3800, 1440, 960, props={"fill": C_BG_PAGE, "stroke": C_BORDER, "cornerRadius": 8})
    draw_sidebar_panel(f20, "Akuntabilitas", "Korwil BGN")
    create_node("rectangle", "BGN Top", 260, 0, 1180, 68, parent=f20, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1})
    create_node("text", "BGN Header Txt", 290, 24, parent=f20, text="Pusat Komando & Pengawasan SLA Wilayah — Badan Gizi Nasional (BGN)", props={"fontSize": 16, "fill": C_NAV})
    # Overview
    bgn_kpis = [("16 Kecamatan", "Wilayah Koordinasi BGN"), ("98.4%", "Rata-rata Pemenuhan SLA"), ("0 Kasus Overdue", "Nol Keterlambatan Fatal"), ("40 Dapur", "Mitra Terkontrak Aktif")]
    bx = 280
    for bt, bl in bgn_kpis:
        create_node("rectangle", "BGN KCard", bx, 90, 275, 75, parent=f20, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 6})
        create_node("text", "BKT", bx + 14, 105, parent=f20, text=bt, props={"fontSize": 16, "fill": C_NAV})
        create_node("text", "BKL", bx + 14, 132, parent=f20, text=bl, props={"fontSize": 11, "fill": C_MUTED})
        bx += 295
    # Warning Overdue
    create_node("text", "Overdue Title", 280, 190, parent=f20, text="Papan Pantau Kasus Mendekati Batas Akhir SLA (Eskalasi 6 Jam):", props={"fontSize": 16, "fill": C_TEXT})
    create_node("rectangle", "Overdue Table", 280, 225, 1140, 280, parent=f20, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 8})
    create_node("text", "OD TH", 305, 250, parent=f20, text="KASUS              DAPUR TERKAIT          SEKOLAH SASARAN            SISA WAKTU SLA       STATUS RESPON       INTERVENSI BGN", props={"fontSize": 11, "fill": C_NAV})
    for o_idx in range(3):
        oy = 285 + o_idx * 65
        create_node("rectangle", f"OD TR {o_idx}", 300, oy, 1100, 55, parent=f20, props={"fill": "#F8FAFC", "stroke": C_LIGHT_BORDER, "cornerRadius": 4})
        create_node("text", f"OD TD {o_idx}", 315, oy + 20, parent=f20, text=f"#PMBGM-T0{o_idx+1}      SPPG Gayamsari 01       SMP Negeri 08 Semarang     ⏱️ 03 Jam 15 Menit    Menunggu Bukti      [Kirim Teguran BGN]", props={"fontSize": 12, "fill": C_TEXT})
    # BGN Actions
    create_node("rectangle", "Action BGN Box", 280, 530, 1140, 390, parent=f20, props={"fill": "#F8FAFC", "stroke": C_BORDER, "cornerRadius": 8})
    create_node("text", "ABT", 310, 560, parent=f20, text="Alat Intervensi & Rekomendasi Kontrak Dapur BGN", props={"fontSize": 18, "fill": C_NAV})
    create_node("text", "ABS", 310, 590, parent=f20, text="Sistem mendeteksi dapur yang konsisten memiliki kepatuhan SLA rendah atau indeks risiko tinggi untuk dievaluasi izin kemitraannya.", props={"fontSize": 12, "fill": C_MUTED})
    create_node("rectangle", "Btn Tegur", 310, 630, 280, 44, parent=f20, props={"fill": C_NAV, "cornerRadius": 6})
    create_node("text", "Btn Tegur Txt", 345, 644, parent=f20, text="⚠️ Terbitkan Surat Peringatan Resmi", props={"fontSize": 13, "fill": "#FFFFFF"})

    # 4.5 Panel Admin Sistem
    move_pointer(6500 + 720, 3800 + 480)
    f21 = create_node("frame", "4.5 Panel Admin Sistem & Master SLA (/panel/admin)", 6500, 3800, 1440, 960, props={"fill": C_BG_PAGE, "stroke": C_BORDER, "cornerRadius": 8})
    draw_sidebar_panel(f21, "Pengaturan", "Administrator")
    create_node("rectangle", "Admin Top", 260, 0, 1180, 68, parent=f21, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1})
    create_node("text", "Admin Header Txt", 290, 24, parent=f21, text="Pengaturan Konfigurasi Sistem & Manajemen Master SLA", props={"fontSize": 16, "fill": C_NAV})
    # Master Counts
    m_counts = [("165 Sekolah", "Master Data Pendidikan"), ("40 Unit SPPG", "Master Dapur Terdaftar"), ("7 Peran Pengguna", "Role-Based Access Control"), ("15 Menit", "Frekuensi Pemindaian Cron")]
    ax = 280
    for at, al in m_counts:
        create_node("rectangle", "ACard", ax, 90, 275, 75, parent=f21, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 6})
        create_node("text", "ACT", ax + 14, 105, parent=f21, text=at, props={"fontSize": 16, "fill": C_NAV})
        create_node("text", "ACL", ax + 14, 132, parent=f21, text=al, props={"fontSize": 11, "fill": C_MUTED})
        ax += 295
    # SLA Config Matrix
    create_node("text", "SLA Config Title", 280, 190, parent=f21, text="Konfigurasi Batas Waktu Service Level Agreement (SLA) per Kategori Aduan:", props={"fontSize": 16, "fill": C_TEXT})
    create_node("rectangle", "SLA Config Table", 280, 225, 1140, 380, parent=f21, props={"fill": "#FFFFFF", "stroke": C_BORDER, "cornerRadius": 8})
    sla_confs = [
        ("Keracunan Makanan (Darurat Medis)", "2 Jam", "4 Jam", "6 Jam", "24 Jam"),
        ("Makanan Tidak Layak (Basi / Berulat)", "6 Jam", "12 Jam", "24 Jam", "48 Jam"),
        ("Kebersihan Wadah & Sanitasi", "12 Jam", "24 Jam", "48 Jam", "72 Jam"),
        ("Kekurangan Porsi & Nutrisi Menu", "24 Jam", "48 Jam", "72 Jam", "120 Jam"),
        ("Dugaan Penyimpangan Pengadaan", "48 Jam", "72 Jam", "96 Jam", "168 Jam")
    ]
    for sc_idx, (sc_name, sc_v, sc_d, sc_r, sc_t) in enumerate(sla_confs):
        sc_y = 250 + sc_idx * 68
        create_node("rectangle", f"SCTR {sc_idx}", 300, sc_y, 1100, 55, parent=f21, props={"fill": "#F8FAFC", "stroke": C_LIGHT_BORDER, "cornerRadius": 4})
        create_node("text", f"SCTD {sc_idx}", 320, sc_y + 20, parent=f21, text=f"{sc_name:<38} Verif: {sc_v:<8} Diteruskan: {sc_d:<8} Respon: {sc_r:<8} Tuntas: {sc_t}", props={"fontSize": 12, "fill": C_TEXT})
    create_node("rectangle", "Btn Save SLA Conf", 280, 630, 260, 46, parent=f21, props={"fill": C_NAV, "cornerRadius": 6})
    create_node("text", "Btn Save SLA Txt", 320, 644, parent=f21, text="💾 Simpan Konfigurasi SLA", props={"fontSize": 13, "fill": "#FFFFFF"})
    draw_footer(f21, 900)

    total_created += 5
    print(f" -> BOARD 4 selesai! Total {total_created} Layar Wireframe berhasil dibangun.")

    # =========================================================================
    # 5. Zoom to Fit & Save
    # =========================================================================
    print("[4/5] Melakukan Zoom to Fit pada kanvas FigCraft...")
    run_cmd('view.zoomFit')
    time.sleep(0.5)

    print("[5/5] Menyimpan dokumen ke format .figcraft dan .fig...")
    try:
        save_res = send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'save_file', 'arguments': {'path': 'd:/UNNES/LOMBA/MIA 2026/Web/pantaugizi/docs/PMBGM_Wireframe_Master.figcraft'}}})
        print(" -> File FigCraft disimpan:", save_res.get('result', {}).get('content', [{}])[0].get('text', 'OK'))
    except Exception as e:
        print(" -> Save note:", e)

    try:
        fig_res = send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'export', 'arguments': {'format': 'fig', 'path': 'd:/UNNES/LOMBA/MIA 2026/Web/pantaugizi/docs/PMBGM_Wireframe_Master.fig'}}})
        print(" -> File Figma .fig diekspor:", fig_res.get('result', {}).get('content', [{}])[0].get('text', 'OK'))
    except Exception as e:
        print(" -> Export fig note:", e)

    try:
        img_res = send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'export', 'arguments': {'format': 'png', 'scale': 0.25, 'path': 'C:/Users/nayotamaryptra/.gemini/antigravity/brain/00907903-8e5d-45cc-81b9-de65c309d732/figcraft-wireframe-overview.png'}}})
        print(" -> Screenshot overview diekspor:", img_res.get('result', {}).get('content', [{}])[0].get('text', 'OK'))
    except Exception as e:
        print(" -> Export PNG note:", e)

    print("=" * 60)
    print("SUKSES: Seluruh 21 Layar Wireframe Mid-Fidelity Berhasil Dibangun!")
    print("Kanvas FigCraft Anda kini terisi penuh dengan 4 Board Arsitektur PMBGM.")
    print("=" * 60)
    p.kill()

if __name__ == "__main__":
    main()
