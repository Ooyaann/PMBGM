"""
Test script to generate 100% exact Screen 01 (Beranda) in FigCraft
"""

import subprocess
import json
import os

CLI_PATH = r"D:\Program Files\ArtCraft\FigCraft\figcraft-cli.exe"
OUT_PNG = r"C:\Users\nayotamaryptra\.gemini\antigravity\brain\00907903-8e5d-45cc-81b9-de65c309d732\test_screen_01_wireframe.png"

C_DARK = "#18181B"
C_BORDER = "#E4E4E7"
C_BG_MUTED = "#F4F4F5"
C_TEXT_MUTED = "#71717A"
C_TEXT_LIGHT = "#A1A1AA"

p = subprocess.Popen([CLI_PATH, "mcp"], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding="utf-8")
msg_id = 1

def send(msg):
    global msg_id
    msg['id'] = msg_id
    msg_id += 1
    p.stdin.write(json.dumps(msg) + '\n')
    p.stdin.flush()
    while True:
        line = p.stdout.readline()
        if not line: return None
        line = line.strip()
        if line.startswith('{'): return json.loads(line)

send({'jsonrpc': '2.0', 'method': 'initialize', 'params': {'protocolVersion': '2024-11-05', 'capabilities': {}, 'clientInfo': {'name': 'test_s1', 'version': '1.0'}}})
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

# Frame: 1200 x 780 (clean desktop view)
FRAME_W = 1200
FRAME_H = 780
fid = create_node("frame", "01. Beranda Utama", 0, 0, FRAME_W, FRAME_H, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1})

# 1. Navbar
create_node("rectangle", "Navbar Base", 0, 0, FRAME_W, 64, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1})

# Nav Logo (Left)
create_node("ellipse", "Nav Logo Cir", 48, 18, 28, 28, parent=fid, props={"fill": C_BG_MUTED, "stroke": C_BORDER, "strokeWeight": 1})
create_node("text", "Nav Logo Icon", 56, 23, parent=fid, text="P", props={"fontSize": 14, "fill": C_DARK})
create_node("text", "Nav Brand Name", 86, 20, parent=fid, text="PMBGM", props={"fontSize": 15, "fill": C_DARK})
create_node("text", "Nav Brand Sub", 86, 36, parent=fid, text="PEMANTAU MBG MASYARAKAT", props={"fontSize": 8, "fill": C_TEXT_MUTED, "letterSpacing": "10%"})

# Nav Center Links
nav_links = [("Beranda", True, False), ("Lacak", False, True), ("Data Terbuka", False, True), ("Insight", False, True), ("Panduan", False, True)]
start_x = 420
cur_x = start_x
for ltext, is_act, has_drop in nav_links:
    disp = f"{ltext} v" if has_drop else ltext
    w = len(disp) * 7.5 + 20
    if is_act:
        create_node("rectangle", f"NavPill_{ltext}", cur_x - 10, 18, w, 28, parent=fid, props={"fill": C_BG_MUTED, "cornerRadius": 14})
        create_node("text", f"NavTxt_{ltext}", cur_x, 25, parent=fid, text=disp, props={"fontSize": 12, "fill": C_DARK})
    else:
        create_node("text", f"NavTxt_{ltext}", cur_x, 25, parent=fid, text=disp, props={"fontSize": 12, "fill": C_TEXT_MUTED})
    cur_x += w + 16

# Nav Right Buttons
# [Lapor Masalah] pill green/dark
create_node("rectangle", "Nav Lapor Box", 980, 16, 125, 32, parent=fid, props={"fill": C_DARK, "cornerRadius": 16})
create_node("text", "Nav Lapor Txt", 1002, 25, parent=fid, text="[o] Lapor Masalah", props={"fontSize": 11, "fill": "#FFFFFF"})
# [Masuk] outline pill
create_node("rectangle", "Nav Masuk Box", 1115, 16, 65, 32, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 16})
create_node("text", "Nav Masuk Txt", 1130, 25, parent=fid, text="Masuk", props={"fontSize": 11, "fill": C_DARK})


# 2. Hero Center Content
# Big title: PMBGM (Centered around x=600, y=260)
create_node("text", "Hero Title", 460, 240, parent=fid, text="PMBGM", props={"fontSize": 64, "fill": C_DARK, "letterSpacing": "2%"})
create_node("text", "Hero Sub", 475, 325, parent=fid, text="P E M A N T A U   M B G   M A S Y A R A K A T", props={"fontSize": 10, "fill": C_TEXT_MUTED})

# Centered Search Bar: width 560, centered at x=320 to 880, y=365
create_node("rectangle", "Search Bar", 320, 365, 560, 48, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1.5, "cornerRadius": 24})
# Search glass icon
create_node("ellipse", "Search Icon Cir", 342, 381, 14, 14, parent=fid, props={"stroke": C_TEXT_MUTED, "strokeWeight": 1.5, "fill": "#FFFFFF"})
create_node("line", "Search Icon Stem", 353, 392, 4, 4, parent=fid, props={"stroke": C_TEXT_MUTED, "strokeWeight": 1.5})
create_node("text", "Search Plh", 368, 381, parent=fid, text="Cari sekolah, dapur SPPG, atau kode tiket...", props={"fontSize": 12, "fill": C_TEXT_LIGHT})

# Two Action Buttons below Search Bar: y=435
# Left: [Buat Laporan] (solid dark pill)
create_node("rectangle", "Btn Buat Lapor", 465, 435, 135, 36, parent=fid, props={"fill": C_DARK, "cornerRadius": 18})
create_node("text", "Btn Buat Lapor Txt", 485, 446, parent=fid, text="[o] Buat Laporan", props={"fontSize": 11, "fill": "#FFFFFF"})

# Right: [Lacak Tiket] (outline pill)
create_node("rectangle", "Btn Lacak Tiket", 610, 435, 125, 36, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 18})
create_node("text", "Btn Lacak Tiket Txt", 632, 446, parent=fid, text="[=] Lacak Tiket", props={"fontSize": 11, "fill": C_DARK})

# Info Status Pill below buttons: y=495
# Pill: "• 165 Sekolah   40 Dapur SPPG   [phone] Darurat 119"
create_node("rectangle", "Status Pill", 460, 495, 280, 26, parent=fid, props={"fill": "#FFFFFF", "stroke": C_BORDER, "strokeWeight": 1, "cornerRadius": 13})
create_node("ellipse", "Status Dot", 474, 506, 5, 5, parent=fid, props={"fill": C_DARK})
create_node("text", "Status Txt 1", 485, 502, parent=fid, text="165 Sekolah", props={"fontSize": 10, "fill": C_DARK})
create_node("text", "Status Txt 2", 555, 502, parent=fid, text="40 Dapur SPPG", props={"fontSize": 10, "fill": C_DARK})
create_node("text", "Status Txt 3", 645, 502, parent=fid, text="Darurat 119", props={"fontSize": 10, "fill": C_DARK})

# NO FOOTER!

# Export to test PNG
send({'jsonrpc': '2.0', 'method': 'tools/call', 'params': {'name': 'export', 'arguments': {'ids': [fid], 'format': 'png', 'path': OUT_PNG}}})
print("Exported test screen 01 to:", OUT_PNG)
p.kill()

