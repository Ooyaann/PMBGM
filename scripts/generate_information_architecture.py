"""
PMBGM - INFORMATION ARCHITECTURE GENERATOR (FIGCRAFT)
Unified single color palette matching the user's reference diagram:
- Root Capsule: Dark Charcoal (#2D323C) with Bold White text (#FFFFFF)
- Level 1 Cards: Vibrant Dodger Blue (#3B82F6) with SemiBold White text (#FFFFFF)
- Level 2 & 3 Child Cards: Golden Honey Yellow (#F59E0B) with SemiBold Black text (#000000)
- Pure Black (#000000) or White (#FFFFFF) text only across all elements
- Typography: SemiBold / Medium for maximum legibility
- Downward directional arrow connectors
- Thick crisp cartoonish ink borders (2px / 2.5px)
- Exports to .figcraft, native .fig, high-res PNGs, and SVGs.
"""

import subprocess
import json
import os
import sys

CLI_PATH = r"D:\Program Files\ArtCraft\FigCraft\figcraft-cli.exe"
OUTPUT_FIGCRAFT = r"d:\UNNES\LOMBA\MIA 2026\Web\design\figma\PMBGM_Information_Architecture.figcraft"
DOCS_FIGCRAFT = r"d:\UNNES\LOMBA\MIA 2026\Web\pantaugizi\docs\PMBGM_Information_Architecture.figcraft"
OUTPUT_FIG = r"d:\UNNES\LOMBA\MIA 2026\Web\design\figma\PMBGM_Information_Architecture.fig"
OVERVIEW_PNG = r"C:\Users\nayotamaryptra\.gemini\antigravity\brain\00907903-8e5d-45cc-81b9-de65c309d732\PMBGM_Information_Architecture_Overview.png"
RENDER_DIR = r"d:\UNNES\LOMBA\MIA 2026\Web\design\information_architecture\renders"
SVG_DIR = r"d:\UNNES\LOMBA\MIA 2026\Web\design\information_architecture\svgs"

os.makedirs(RENDER_DIR, exist_ok=True)
os.makedirs(SVG_DIR, exist_ok=True)
os.makedirs(os.path.dirname(DOCS_FIGCRAFT), exist_ok=True)
os.makedirs(os.path.dirname(OVERVIEW_PNG), exist_ok=True)

# -----------------------------------------------------------------------------
# Unified Single Palette (Exact Reference Style)
# Strictly Black (#000000) or White (#FFFFFF) text
# -----------------------------------------------------------------------------
UNIFIED_PALETTE = {
    "frame_bg": "#FFFFFF",       # Clean pure white frame
    "frame_border": "#1F232B",   # 2.5px crisp ink outline
    "root_bg": "#2D323C",        # Charcoal / Slate dark capsule
    "root_text": "#FFFFFF",      # Pure White text
    "lvl1_bg": "#3B82F6",        # Dodger Blue Level 1 card
    "lvl1_text": "#FFFFFF",      # Pure White text
    "lvl2_bg": "#F59E0B",        # Golden Honey Mustard Level 2/3 card
    "lvl2_text": "#000000",      # Pure Black text
    "border": "#1F232B",         # 2px bold ink outline
    "badge_bg": "#F1F5F9",       # Soft neutral badge fill
    "badge_text": "#000000",     # Pure Black text
    "title_text": "#000000",     # Pure Black title
    "sub_text": "#000000",       # Pure Black subtitle
}

ROLE_METADATA = {
    "PUBLIK": {
        "title": "PUBLIK (WARGA / TAMU NON-LOGIN)",
        "subtitle": "Portal Transparansi Terbuka, Tracking Tiket, & Katalog Data Terbuka MBG",
    },
    "PELAPOR": {
        "title": "PELAPOR (WARGA & GURU SEKOLAH)",
        "subtitle": "Saluran Pengaduan Terverifikasi, Tracking Kasus, & Log Ompreng Sekolah",
    },
    "VERIFIKATOR": {
        "title": "VERIFIKATOR (TRIAGE INDEPENDEN & AUDIT)",
        "subtitle": "Penilaian Bobot Risiko SAW, Inspeksi Bukti Foto AI, & Penegakan Batas SLA",
    },
    "PENGELOLA": {
        "title": "PENGELOLA (DAPUR SPPG, DINKES, & KORWIL)",
        "subtitle": "Operasional Dapur Makanan, Higiene Sanitasi Medis, & Audit Wilayah BGN",
    },
    "ADMIN": {
        "title": "ADMIN (ADMINISTRATOR SISTEM PMBGM)",
        "subtitle": "Tata Kelola Akses Pengguna (RBAC), Aturan Batas Waktu SLA, & Audit Keamanan",
    },
}

# -----------------------------------------------------------------------------
# Data Trees for all 5 Consolidated Roles
# -----------------------------------------------------------------------------
IA_TREES = [
    {
        "role_key": "PUBLIK",
        "columns": [
            {
                "head": "BERANDA UTAMA",
                "items": ["Pencarian Cerdas", "Aksi Lapor / Lacak", "Status Ringkas MBG"]
            },
            {
                "head": "PELACAKAN TERBUKA",
                "items": ["Cek Tiket Cepat", "Papan Akuntabilitas", "Kasus Terkini Wilayah"]
            },
            {
                "head": "DATA TERBUKA",
                "items": ["Realisasi APBN Jateng", "Direktori 40 SPPG", "Sebaran 16 Kecamatan", "Unduh CSV & API"]
            },
            {
                "head": "INSIGHT & RISIKO",
                "items": ["Peta Interaktif", "DSS Prioritas Sidak", "Deteksi Dini KLB", "Komparasi Dapur"]
            },
            {
                "head": "PANDUAN & BANTUAN",
                "items": ["Panduan SOP Lapor", "Simulator Hitung SAW", "Pusat FAQ & Bantuan", "Kebijakan Privasi"]
            },
            {
                "head": "MASUK / DAFTAR",
                "items": ["Pilih Persona Demo", "Masuk Email & Sandi", "Pendaftaran Akun"]
            }
        ]
    },
    {
        "role_key": "PELAPOR",
        "columns": [
            {
                "head": "BERANDA AKUN",
                "items": ["Profil Warga / Guru", "Sekolah & SPPG Mitra", "Ringkasan Tiket Aktif"]
            },
            {
                "head": "FORMULIR LAPOR",
                "items": ["Step 1: Sekolah & Dapur", "Step 2: Masalah & Jam", "Step 3: Gejala & Narasi", "Step 4: Bukti Foto AI", "Step 5: Opsi Whistleblower"]
            },
            {
                "head": "STATUS TIKET",
                "items": ["Kode MBG-XXXX", "Stepper 5 Tahap", "Countdown Batas SLA"]
            },
            {
                "head": "RIWAYAT ADUAN",
                "items": ["Daftar Kasus Berjalan", "Arsip Aduan Selesai", "Laporan Hasil Tindak"]
            },
            {
                "head": "EVALUASI & NOTIF",
                "items": ["Rating Bintang 1-5", "Catatan Umpan Balik", "Pusat Notif WhatsApp"]
            },
            {
                "head": "LOG SEKOLAH (GURU)",
                "items": ["Konfirmasi Ompreng", "Rekap Porsi Diterima", "Kontak Darurat SPPG"]
            }
        ]
    },
    {
        "role_key": "VERIFIKATOR",
        "columns": [
            {
                "head": "DASBOR PANEL",
                "items": ["Metrik Antrean Masuk", "Rekomendasi Cerdas AI", "Rata-rata Waktu Respon"]
            },
            {
                "head": "ANTREAN VERIFIKASI",
                "items": ["Filter 4 Tingkat Bahaya", "Skor Risiko SAW (0-100)", "Urutan Urgensi Sidak"]
            },
            {
                "head": "MEJA INSPEKSI",
                "items": ["Narasi & Riwayat Pelapor", "Uji Keaslian Foto (EXIF)", "Deteksi Duplikasi Spam"]
            },
            {
                "head": "KEPUTUSAN TRIAGE",
                "items": ["Setujui & Terbitkan SLA", "Minta Bukti Tambahan", "Tolak Aduan Palsu"]
            },
            {
                "head": "KASUS BERJALAN",
                "items": ["5 Tab Status Tindak", "Monitoring Waktu SLA", "Pemicu Eskalasi Korwil"]
            },
            {
                "head": "BERITA ACARA AUDIT",
                "items": ["Catatan Sidak Lapangan", "Verifikasi Sanitasi", "Rekomendasi Medis"]
            }
        ]
    },
    {
        "role_key": "PENGELOLA",
        "columns": [
            {
                "head": "OPERASIONAL SPPG",
                "items": ["Kepatuhan Porsi Harian", "Papan Keluhan Masuk", "Unggah Bukti Ganti Menu", "Sertifikasi SLHS"]
            },
            {
                "head": "PENGAWASAN DINKES",
                "items": ["Dasbor Higiene Sanitasi", "Peta Sampel Bakteri", "Deteksi Dini KLB Pangan", "Rekomendasi Sanksi"]
            },
            {
                "head": "AKUNTABILITAS KORWIL",
                "items": ["Papan Akuntabilitas", "Rapor Kinerja 12 SPPG", "Rekapitulasi Wilayah", "Monitoring Anggaran"]
            },
            {
                "head": "PRIORITAS AUDIT (SAW)",
                "items": ["Peringkat Urgensi Sidak", "Matriks Bobot Kriteria", "Surat Tugas Lapangan"]
            },
            {
                "head": "PENGAWASAN LOGISTIK",
                "items": ["Rantai Pasok Pangan", "Kontrol Suhu Distribusi", "Laporan Terima Sekolah"]
            }
        ]
    },
    {
        "role_key": "ADMIN",
        "columns": [
            {
                "head": "KENDALI SISTEM",
                "items": ["Statistik Total Pengguna", "Kesehatan Server & DB", "Status Gateway WA"]
            },
            {
                "head": "MANAJEMEN PENGGUNA",
                "items": ["Filter 7 Peran (RBAC)", "Tambah Pengguna Baru", "Kelola Izin & Suspend"]
            },
            {
                "head": "KONFIGURASI SLA",
                "items": ["Aturan 4 Level Urgensi", "Batas Waktu Respon", "Matriks Jalur Eskalasi"]
            },
            {
                "head": "AUDIT & KEAMANAN",
                "items": ["Log Aktivitas Admin", "Riwayat Kebijakan", "Cadangan Data Otomatis"]
            },
            {
                "head": "PENGATURAN PLATFORM",
                "items": ["Konfigurasi API Publik", "Bobot SAW Global", "Templat Pesan Notif"]
            }
        ]
    }
]

def main():
    print("=" * 80)
    print("GENERATING INFORMATION ARCHITECTURE - UNIFIED PALETTE & SEMIBOLD TYPOGRAPHY")
    print("=" * 80)

    p = subprocess.Popen(
        [CLI_PATH, "mcp"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding="utf-8",
        errors="replace"
    )
    msg_id = 1

    def send(msg):
        nonlocal msg_id
        msg['id'] = msg_id
        msg_id += 1
        p.stdin.write(json.dumps(msg) + '\n')
        p.stdin.flush()
        while True:
            line = p.stdout.readline()
            if not line: return None
            line = line.strip()
            if line.startswith('{'):
                try: return json.loads(line)
                except Exception: pass

    # Initialize MCP
    send({'jsonrpc': '2.0', 'method': 'initialize', 'params': {'protocolVersion': '2024-11-05', 'capabilities': {}, 'clientInfo': {'name': 'pmbgm_ia_gen', 'version': '2.0'}}})
    p.stdin.write(json.dumps({'jsonrpc': '2.0', 'method': 'notifications/initialized', 'params': {}}) + '\n')
    p.stdin.flush()

    def create_node(node_type, name, x=0, y=0, width=None, height=None, parent=None, props=None, text=None, path=None):
        args = {'type': node_type, 'name': name, 'x': float(x), 'y': float(y), 'select': False}
        if width is not None: args['width'] = float(width)
        elif node_type != 'text': args['width'] = 100.0
        if height is not None: args['height'] = float(height)
        elif node_type != 'text': args['height'] = 100.0
        if parent is not None: args['parent'] = parent
        if text is not None: args['text'] = text
        if props is not None: args['props'] = props
        if path is not None: args['path'] = path
        res = send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'create_node', 'arguments': args}})
        try:
            txt = res['result']['content'][0]['text']
            data = json.loads(txt)
            return data.get('id') or (data.get('node', {}).get('id'))
        except Exception:
            return None

    # Frame Positions in a clean 2-column layout
    frame_positions = [
        (80, 80),        # 1. Publik
        (1540, 80),      # 2. Pelapor
        (80, 940),       # 3. Verifikator
        (1540, 940),     # 4. Pengelola
        (810, 1780)      # 5. Admin (Centered bottom)
    ]

    frames_created = {}
    theme = UNIFIED_PALETTE

    for idx, tree_data in enumerate(IA_TREES):
        role_key = tree_data["role_key"]
        meta = ROLE_METADATA[role_key]
        fx, fy = frame_positions[idx]
        cols = tree_data["columns"]
        num_cols = len(cols)

        CARD_W = 186
        GAP_X = 22
        PAD_X = 56
        content_w = num_cols * CARD_W + (num_cols - 1) * GAP_X
        FRAME_W = content_w + (PAD_X * 2)

        # Height based on maximum children
        max_items = max(len(c["items"]) for c in cols)
        FRAME_H = 260 + (max_items * 66) + 60

        frame_name = f"IA - {meta['title']}"
        fid = create_node("frame", frame_name, fx, fy, FRAME_W, FRAME_H, props={
            "fill": theme["frame_bg"],
            "stroke": theme["frame_border"],
            "strokeWeight": 2.5,
            "cornerRadius": 24
        })
        frames_created[role_key] = (fid, frame_name)

        # ---------------------------------------------------------------------
        # Top Meta Info & Role Badge
        # ---------------------------------------------------------------------
        badge_w = len(role_key) * 11 + 36
        create_node("rectangle", f"{role_key}_Badge", PAD_X, 32, badge_w, 28, parent=fid, props={
            "fill": theme["badge_bg"],
            "stroke": theme["border"],
            "strokeWeight": 1.8,
            "cornerRadius": 14
        })
        create_node("text", f"{role_key}_BadgeTxt", PAD_X, 38, width=badge_w, parent=fid, text=f"ROLE: {role_key}", props={
            "fontSize": 11,
            "fontStyle": "SemiBold",
            "fill": theme["badge_text"],
            "textAlign": "center"
        })

        create_node("text", f"{role_key}_FullTitle", PAD_X + badge_w + 16, 37, parent=fid, text=meta["title"], props={
            "fontSize": 13,
            "fontStyle": "SemiBold",
            "fill": theme["title_text"]
        })
        create_node("text", f"{role_key}_SubTxt", PAD_X, 66, parent=fid, text=meta["subtitle"], props={
            "fontSize": 11,
            "fontStyle": "Medium",
            "fill": theme["sub_text"]
        })

        # ---------------------------------------------------------------------
        # 1. Root Node (Role Capsule at Top Center)
        # ---------------------------------------------------------------------
        ROOT_W = 280
        ROOT_H = 50
        root_x = (FRAME_W - ROOT_W) / 2
        root_y = 110
        create_node("rectangle", f"{role_key}_RootBox", root_x, root_y, ROOT_W, ROOT_H, parent=fid, props={
            "fill": theme["root_bg"],
            "stroke": theme["border"],
            "strokeWeight": 2.5,
            "cornerRadius": ROOT_H / 2
        })
        create_node("text", f"{role_key}_RootTxt", root_x, root_y + 15, width=ROOT_W, parent=fid, text=role_key, props={
            "fontSize": 15,
            "fontStyle": "Bold",
            "fill": theme["root_text"],
            "textAlign": "center"
        })

        # ---------------------------------------------------------------------
        # 2. Main Distribution Trunk Line
        # ---------------------------------------------------------------------
        LVL1_Y = 210
        col_xs = [PAD_X + c_idx * (CARD_W + GAP_X) for c_idx in range(num_cols)]
        col_centers = [cx + CARD_W / 2 for cx in col_xs]

        stem_top = root_y + ROOT_H
        mid_y = root_y + ROOT_H + 24

        # Vertical line from root center to mid_y
        create_node("rectangle", f"{role_key}_TrunkV", (FRAME_W / 2) - 1.25, stem_top, 2.5, 24, parent=fid, props={
            "fill": theme["border"]
        })

        # Horizontal distribution line connecting all column centers
        h_left = min(col_centers)
        h_right = max(col_centers)
        create_node("rectangle", f"{role_key}_TrunkH", h_left, mid_y, (h_right - h_left) + 2.5, 2.5, parent=fid, props={
            "fill": theme["border"]
        })

        # ---------------------------------------------------------------------
        # 3. Columns (Level 1 Cards & Level 2/3 Children with Downward Arrows)
        # ---------------------------------------------------------------------
        for c_idx, col_data in enumerate(cols):
            cx = col_xs[c_idx]
            c_center = col_centers[c_idx]

            # Vertical branch down from trunk line to Level 1 card
            branch_len = (LVL1_Y - 8) - mid_y
            create_node("rectangle", f"{role_key}_BranchV_{c_idx}", c_center - 1.25, mid_y, 2.5, branch_len, parent=fid, props={
                "fill": theme["border"]
            })
            # Arrowhead pointing down into Level 1 card
            create_node("polygon", f"{role_key}_BranchArr_{c_idx}", c_center - 5, LVL1_Y - 8, 10, 8, parent=fid, props={
                "fill": theme["border"],
                "rotation": 180
            })

            # Level 1 Card (Dodger Blue)
            LVL1_H = 46
            create_node("rectangle", f"{role_key}_L1Box_{c_idx}", cx, LVL1_Y, CARD_W, LVL1_H, parent=fid, props={
                "fill": theme["lvl1_bg"],
                "stroke": theme["border"],
                "strokeWeight": 2,
                "cornerRadius": 10
            })
            head_txt = col_data["head"]
            create_node("text", f"{role_key}_L1Txt_{c_idx}", cx + 6, LVL1_Y + 16, width=CARD_W - 12, parent=fid, text=head_txt, props={
                "fontSize": 11,
                "fontStyle": "SemiBold",
                "fill": theme["lvl1_text"],
                "textAlign": "center"
            })

            # Level 2 & 3 Children (Golden Honey Yellow)
            cur_y = LVL1_Y + LVL1_H
            for i_idx, item_txt in enumerate(col_data["items"]):
                gap_y = 20
                next_y = cur_y + gap_y
                CARD_H = 44

                # Downward Arrow Connector: vertical stem + triangle
                create_node("rectangle", f"{role_key}_ArrStem_{c_idx}_{i_idx}", c_center - 1, cur_y, 2, gap_y - 7, parent=fid, props={
                    "fill": theme["border"]
                })
                create_node("polygon", f"{role_key}_ArrTri_{c_idx}_{i_idx}", c_center - 5, next_y - 7, 10, 7, parent=fid, props={
                    "fill": theme["border"],
                    "rotation": 180
                })

                # Child Card (Golden Honey Yellow)
                create_node("rectangle", f"{role_key}_CBox_{c_idx}_{i_idx}", cx, next_y, CARD_W, CARD_H, parent=fid, props={
                    "fill": theme["lvl2_bg"],
                    "stroke": theme["border"],
                    "strokeWeight": 1.8,
                    "cornerRadius": 8
                })
                
                # Centered child text (SemiBold Black #000000)
                create_node("text", f"{role_key}_CTxt_{c_idx}_{i_idx}", cx + 6, next_y + 15, width=CARD_W - 12, parent=fid, text=item_txt, props={
                    "fontSize": 10.5,
                    "fontStyle": "SemiBold",
                    "fill": theme["lvl2_text"],
                    "textAlign": "center"
                })

                cur_y = next_y + CARD_H

        print(f" -> Built {role_key} IA frame ({FRAME_W}x{FRAME_H})")

    # -------------------------------------------------------------------------
    # Save Files
    # -------------------------------------------------------------------------
    print("\n[Saving FigCraft and Figma files...]")
    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'save_file', 'arguments': {'path': OUTPUT_FIGCRAFT}}})
    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'save_file', 'arguments': {'path': DOCS_FIGCRAFT}}})
    print(f" -> Saved to: {OUTPUT_FIGCRAFT}")
    print(f" -> Saved to: {DOCS_FIGCRAFT}")

    # Export to native Figma (.fig)
    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'export', 'arguments': {'format': 'fig', 'path': OUTPUT_FIG}}})
    print(f" -> Native Figma file saved to: {OUTPUT_FIG}")

    # Export individual PNGs and SVGs for each role diagram
    print("\n[Exporting PNGs and SVGs...]")
    for role_key, (fid, fname) in frames_created.items():
        clean_fname = fname.replace(" - ", "_").replace(" ", "_").replace("(", "").replace(")", "").replace("/", "_")
        png_path = os.path.join(RENDER_DIR, f"{clean_fname}.png")
        svg_path = os.path.join(SVG_DIR, f"{clean_fname}.svg")
        preview_path = f"C:\\Users\\nayotamaryptra\\.gemini\\antigravity\\brain\\00907903-8e5d-45cc-81b9-de65c309d732\\{clean_fname}.png"

        send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'export', 'arguments': {'ids': [fid], 'format': 'png', 'path': png_path}}})
        send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'export', 'arguments': {'ids': [fid], 'format': 'svg', 'path': svg_path}}})
        send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'export', 'arguments': {'ids': [fid], 'format': 'png', 'path': preview_path}}})
        print(f"   Exported {clean_fname}.png & .svg")

    # Export Master Canvas Overview
    send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'export', 'arguments': {'format': 'png', 'path': OVERVIEW_PNG}}})
    print(f"\n -> Master Overview saved to: {OVERVIEW_PNG}")

    p.kill()
    print("\nALL 5 INFORMATION ARCHITECTURE DIAGRAMS SUCCESSFULLY REGENERATED!")

if __name__ == "__main__":
    main()
