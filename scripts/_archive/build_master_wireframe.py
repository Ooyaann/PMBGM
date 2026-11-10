"""
PMBGM MASTER WIREFRAME RUNNER
Generates all 47 screens in pure textbook monochrome wireframe, saves .figcraft,
and exports all 47 individual PNGs plus the master overview.
"""

import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from wf_helpers import (
    FigCraftEngine, C_DARK, C_TEXT_MUTED, ROW_Y
)
from wf_screens_1 import build_screens_part1
from wf_screens_2 import build_screens_part2

CLI_PATH = r"D:\Program Files\ArtCraft\FigCraft\figcraft-cli.exe"
OUTPUT_FIGCRAFT = r"d:\UNNES\LOMBA\MIA 2026\Web\PMBGM_Wireframes.figcraft"
DOCS_FIGCRAFT = r"d:\UNNES\LOMBA\MIA 2026\Web\pantaugizi\docs\PMBGM_Wireframe_Master.figcraft"
OVERVIEW_PNG = r"C:\Users\nayotamaryptra\.gemini\antigravity\brain\00907903-8e5d-45cc-81b9-de65c309d732\PMBGM_Wireframes_All_Overview.png"
RENDER_DIR = r"d:\UNNES\LOMBA\MIA 2026\Web\wireframe_renders"

def add_section_titles(eng):
    sections = [
        (0, "1. PUBLIK - BERANDA & LACAK INTI (6 HALAMAN)", "Portal utama warga, gate autentikasi, panduan SAW, dan pelacakan tiket."),
        (1, "2. PUBLIK - DATA TERBUKA & DIREKTORI (6 HALAMAN)", "Papan akuntabilitas, pencarian sekolah/SPPG, statistik Jateng, dan direktori wilayah."),
        (2, "3. PUBLIK - INSIGHT, WILAYAH & DATA LANJUTAN (6 HALAMAN)", "Detail Kota Semarang, rekap kasus pangan, unduh data/API, peta risiko, dan DSS SAW."),
        (3, "4. PUBLIK - EDUKASI, PORTAL & ALUR MASUK (6 HALAMAN)", "Banding SPPG, panduan sistem, metodologi & regulasi, tentang inisiatif, FAQ, dan privasi."),
        (4, "5. ALUR PELAPORAN MBG STEP 1 - 5 (6 HALAMAN)", "Portal masuk persona dan 5 langkah interaktif formulir pelaporan terpadu."),
        (5, "6. SUKSES, PROFIL AKUN & DASBOR VERIFIKATOR (6 HALAMAN)", "Tiket sukses, profil akun warga/guru, antrean verifikasi, dan inspeksi detail kasus."),
        (6, "7. OPERASIONAL SPPG & PENGAWASAN MEDIS DINKES (6 HALAMAN)", "Kasus berjalan, dasbor dapur SPPG, papan kasus, bukti perbaikan, dan investigasi KLB."),
        (7, "8. DASBOR KORWIL & ADMINISTRASI SISTEM (5 HALAMAN)", "Akuntabilitas korwil, prioritas audit DSS, kontrol admin, manajemen pengguna, dan aturan SLA.")
    ]
    for row, title, subtitle in sections:
        sy = ROW_Y[row] - 65
        eng.create_node("text", f"SEC_{row}", 80, sy, parent=None, text=title, props={"fontSize": 18, "fill": C_DARK})
        eng.create_node("text", f"SECSUB_{row}", 80, sy + 24, parent=None, text=subtitle, props={"fontSize": 12, "fill": C_TEXT_MUTED})

def main():
    print("=" * 80)
    print("STARTING COMPLETE 47-SCREEN WIREFRAME GENERATION FOR PMBGM")
    print("=" * 80)

    os.makedirs(RENDER_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(DOCS_FIGCRAFT), exist_ok=True)
    os.makedirs(os.path.dirname(OVERVIEW_PNG), exist_ok=True)

    eng = FigCraftEngine(CLI_PATH)
    eng.start()
    print("[1/5] Connected to FigCraft CLI MCP server.")

    print("[2/5] Adding section headers and building Screens 01 to 24...")
    add_section_titles(eng)
    build_screens_part1(eng)

    print("[3/5] Building Screens 25 to 47...")
    build_screens_part2(eng)

    total_frames = len(eng.frames)
    print(f" -> Total frames created: {total_frames} frames.")

    print("\n[4/5] Saving master .figcraft files...")
    eng.send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'save_file', 'arguments': {'path': OUTPUT_FIGCRAFT}}})
    eng.send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'save_file', 'arguments': {'path': DOCS_FIGCRAFT}}})
    print(f" -> Saved to: {OUTPUT_FIGCRAFT}")
    print(f" -> Saved to: {DOCS_FIGCRAFT}")

    print("\n[5/5] Exporting high-res PNG renders for all 47 frames...")
    export_count = 0
    for title, fid in eng.frames.items():
        clean_title = "".join(c for c in title if c.isalnum() or c in (" ", "-", "_", ".")).strip()
        out_png = os.path.join(RENDER_DIR, f"{clean_title}.png")
        res = eng.send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'export', 'arguments': {'ids': [fid], 'format': 'png', 'path': out_png}}})
        export_count += 1
        print(f"   [{export_count:02d}/47] Exported {clean_title}.png (ID: {fid})")

    print("\nExporting master canvas overview...")
    eng.send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'export', 'arguments': {'format': 'png', 'path': OVERVIEW_PNG}}})
    print(f" -> Master Overview saved to: {OVERVIEW_PNG}")

    time.sleep(1)
    eng.stop()
    print("\nALL 47 PMBGM WIREFRAMES SUCCESSFULLY BUILT AND RENDERED!")

if __name__ == "__main__":
    main()
