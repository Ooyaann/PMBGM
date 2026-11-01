# Graph Report - pantaugizi  (2026-11-01)

## Corpus Check
- 180 files · ~144,955 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1111 nodes · 2571 edges · 65 communities (61 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.64)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9464962f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- buatKlienPublik
- aksi/panel.ts
- generator.ts
- metodologi/page.tsx
- devDependencies
- dependencies
- tabel-akuntabilitas.tsx
- angka
- compilerOptions
- panel/kasus/[id]/page.tsx
- verifikasi/page.tsx
- utils.ts
- peta-risiko.tsx
- label.ts
- wilayah/[id]/page.tsx
- components.json
- laporan-insight.tsx
- panel/prioritas/page.tsx
- form-lapor.tsx
- masuk/page.tsx
- aksi-akun.tsx
- auth.ts
- pemilih-banding.tsx
- skeleton.tsx
- field.tsx
- button.tsx
- wajibPeran
- grafik.tsx
- dropdown-menu.tsx
- sesi.ts
- buatKlienBrowser
- unggah-bukti.tsx
- dasbor-panduan.tsx
- aksi/laporan.ts
- insight.ts
- lacak/kasus/[id]/page.tsx
- Kategori
- train_pipeline.py
- PMBGM (Pemantau MBG Masyarakat)
- top-navbar.tsx
- buatKlienServer
- label-sumber.tsx
- 2. Rangkuman Keputusan Utama (K1 – K9)
- insight/layout.tsx
- insight/page.tsx
- notifikasi-email.ts
- banding/page.tsx
- generate-png-logo.js
- lacak.ts
- panel/layout.tsx
- ui/badge.tsx
- eslint.config.mjs
- next.config.ts
- data/panel.ts
- generate-og.mjs
- panel/peringatan/page.tsx
- daftar-prioritas.tsx
- peta.ts
- supabase/proxy.ts

## God Nodes (most connected - your core abstractions)
1. `angka()` - 43 edges
2. `buatKlienServer()` - 43 edges
3. `buatKlienPublik()` - 36 edges
4. `Kategori` - 31 edges
5. `buttonVariants` - 26 edges
6. `Skeleton()` - 26 edges
7. `persen()` - 26 edges
8. `LabelSumber()` - 22 edges
9. `wajibPeran()` - 22 edges
10. `kategoriRisiko` - 19 edges

## Surprising Connections (you probably didn't know these)
- `HalamanUnduh()` --calls--> `buttonVariants`  [EXTRACTED]
  src/app/data/unduh/page.tsx → src/components/ui/button.tsx
- `LayoutInsight()` --calls--> `buttonVariants`  [EXTRACTED]
  src/app/insight/layout.tsx → src/components/ui/button.tsx
- `Peta()` --calls--> `ambilPeta()`  [EXTRACTED]
  src/app/insight/page.tsx → src/lib/data/insight.ts
- `Ubin()` --calls--> `angka()`  [EXTRACTED]
  src/app/panel/page.tsx → src/lib/format.ts
- `BarSelesai()` --calls--> `persen()`  [EXTRACTED]
  src/components/lacak/tabel-akuntabilitas.tsx → src/lib/format.ts

## Import Cycles
- None detected.

## Communities (65 total, 4 thin omitted)

### Community 0 - "buatKlienPublik"
Cohesion: 0.07
Nodes (48): Hasil(), HalamanDirektori(), KartuKepatuhanDapur(), Isi(), BagianForm(), maxDuration, metadata, IsiSukses() (+40 more)

### Community 1 - "aksi/panel.ts"
Cohesion: 0.06
Nodes (39): AksiInstansi(), AksiTeruskan(), Berkas, IKON_TINDAKAN, InstansiPilihan, siapkan(), AksiVerifikasi(), ALASAN_CEPAT (+31 more)

### Community 2 - "generator.ts"
Cohesion: 0.06
Nodes (42): Acak, awalHariWib(), Baris, buatDataSeed(), bulanKe(), bulatMenit(), DataSeed, hariSekolah() (+34 more)

### Community 3 - "metodologi/page.tsx"
Cohesion: 0.05
Nodes (36): GET(), keCsv(), KORS, HalamanUnduh(), IKON, JAMINAN, metadata, KELOMPOK (+28 more)

### Community 4 - "devDependencies"
Cohesion: 0.04
Nodes (44): babel-plugin-react-compiler, eslint, eslint-config-next, devDependencies, babel-plugin-react-compiler, eslint, eslint-config-next, postgres (+36 more)

### Community 5 - "dependencies"
Cohesion: 0.05
Nodes (43): @base-ui/react, class-variance-authority, cmdk, cn, d3-geo, lucide-react, next, next-themes (+35 more)

### Community 6 - "tabel-akuntabilitas.tsx"
Cohesion: 0.08
Nodes (26): geistMono, jakarta, metadata, viewport, FormCekTiket(), TAMPIL, SalinTeks(), Langganan (+18 more)

### Community 7 - "angka"
Cohesion: 0.11
Nodes (30): IsiProfil(), JENJANG, metadata, HalamanWilayah(), angkaAtauNull(), HalamanAkuntabilitas(), metadata, angkaAtauNull() (+22 more)

### Community 8 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 9 - "panel/kasus/[id]/page.tsx"
Cohesion: 0.14
Nodes (17): IKON_STATUS, Isi(), judulPeristiwa(), metadata, BOBOT_KREDIBILITAS, JENIS_PELAPOR, metadata, BadgePrioritas() (+9 more)

### Community 10 - "verifikasi/page.tsx"
Cohesion: 0.13
Nodes (15): Daftar(), metadata, SARING, Isi(), Ubin(), buatUrl(), Daftar(), metadata (+7 more)

### Community 11 - "utils.ts"
Cohesion: 0.21
Nodes (8): KasusTerbaru(), metadata, AlurStatus(), indeksTahap(), Tahap, NavLacak(), TAUTAN, ambilKasusTerbaru()

### Community 12 - "peta-risiko.tsx"
Cohesion: 0.16
Nodes (19): TabelData(), Area, fmt(), IsiTooltip(), Lapis, PanelWilayah(), PetaRisikoDasar(), Posisi (+11 more)

### Community 13 - "label.ts"
Cohesion: 0.21
Nodes (10): Galeri(), IKON_STATUS, tampilan(), Timeline(), FotoBukti, Enum, PRIORITAS, RISIKO (+2 more)

### Community 14 - "wilayah/[id]/page.tsx"
Cohesion: 0.19
Nodes (13): KasusProvinsi(), KasusSemarang(), metadata, IsiWilayah(), metadata, metadata, Meter(), Remah() (+5 more)

### Community 15 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 16 - "laporan-insight.tsx"
Cohesion: 0.17
Nodes (13): DataPeta, SppgIndeks, StatistikPublik, angkaId(), Badge(), DataLaporan, FONT, Kaki() (+5 more)

### Community 17 - "panel/prioritas/page.tsx"
Cohesion: 0.15
Nodes (12): metadata, metadata, Legenda(), DaftarPrioritas(), ARTI, RumusIndeks(), Popover(), PopoverContent() (+4 more)

### Community 18 - "form-lapor.tsx"
Cohesion: 0.14
Nodes (17): SekolahPilihan, adaIsi(), amanIso(), bacaDraf(), Draf, DRAF_KOSONG, FormLapor(), IKON_MODE (+9 more)

### Community 19 - "masuk/page.tsx"
Cohesion: 0.26
Nodes (7): IsiMasuk(), metadata, tujuanAman(), PanelKiriMasuk(), Footer(), Logo(), TandaLogo()

### Community 20 - "aksi-akun.tsx"
Cohesion: 0.18
Nodes (16): AksiSelesai(), ARTI_BINTANG, ButirNotifikasi, DaftarNotifikasi(), FormProfil(), JENIS, beriRating(), bukaUlangKasus() (+8 more)

### Community 21 - "auth.ts"
Cohesion: 0.21
Nodes (13): MasukPassword(), DAFTAR_PERSONA, PersonaDemo, PilihanMasuk(), AKUN_DEMO, daftarAkun(), HasilAksi, KunciDemo (+5 more)

### Community 22 - "pemilih-banding.tsx"
Cohesion: 0.14
Nodes (12): PemilihBanding(), WARNA_BUTIR, BarisPengguna(), PenggunaAdmin, Peran, SelectContent(), SelectItem(), SelectTrigger() (+4 more)

### Community 23 - "skeleton.tsx"
Cohesion: 0.19
Nodes (7): metadata, ATURAN, Isi(), KartuPeringatan(), metadata, rasio(), Skeleton()

### Community 24 - "field.tsx"
Cohesion: 0.15
Nodes (4): Field(), fieldVariants, Label(), Separator()

### Community 25 - "button.tsx"
Cohesion: 0.17
Nodes (12): GlobalError(), HalamanNotFound(), HalamanPanduan(), metadata, GoogleSearchBar(), RekomendasiItem, DasborPanduan(), PRESET_CONTOH (+4 more)

### Community 26 - "wajibPeran"
Cohesion: 0.14
Nodes (13): Daftar(), metadata, LABEL_TAHAP, metadata, Tabel(), TAHAP, URUT_KATEGORI, Isi() (+5 more)

### Community 27 - "grafik.tsx"
Cohesion: 0.15
Nodes (17): HalamanData(), metadata, BilahKomponen(), fmt(), fmtDasar(), Format, GrafikBatang(), GrafikGaris() (+9 more)

### Community 28 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (3): DropdownMenu(), DropdownMenuContent(), DropdownMenuTrigger()

### Community 29 - "sesi.ts"
Cohesion: 0.15
Nodes (12): LABEL_PERAN, Pengguna, CompositeTypes, Constants, Database, DatabaseWithoutInternals, DefaultSchema, Enums (+4 more)

### Community 30 - "buatKlienBrowser"
Cohesion: 0.39
Nodes (5): CariSekolah(), JENJANG, LaporanSerupa(), Serupa, buatKlienBrowser()

### Community 31 - "unggah-bukti.tsx"
Cohesion: 0.23
Nodes (11): ukuran(), UnggahBukti(), bacaMetadata(), BuktiSiap, MetadataBukti, siapkanBukti(), BATAS_BUKTI, DAFTAR_KATEGORI (+3 more)

### Community 32 - "dasbor-panduan.tsx"
Cohesion: 0.20
Nodes (7): ItemPanduan, KATEGORI, Dialog(), DialogContent(), DialogDescription(), DialogHeader(), DialogTitle()

### Community 33 - "aksi/laporan.ts"
Cohesion: 0.33
Nodes (9): HasilKirim, kirimLaporan(), gabungKlasifikasi(), klasifikasiDenganAi(), klasifikasiNaiveBayes(), NB_PRIORS, NB_TOKEN_WEIGHTS, KATA_KUNCI (+1 more)

### Community 34 - "insight.ts"
Cohesion: 0.33
Nodes (8): ambilPeta(), KabkotaPeta, KecamatanPeta, n(), TitikSppg, kanvasPeta, kategoriRisiko, PetaSemarang()

### Community 35 - "lacak/kasus/[id]/page.tsx"
Cohesion: 0.20
Nodes (13): IsiKasus(), metadata, langganan(), pendengar, sekarang, useSekarang(), Waktu(), HitungMundur() (+5 more)

### Community 36 - "Kategori"
Cohesion: 0.17
Nodes (15): Isi(), B1, B2, ekstrakVektorFitur(), HasilVerifikasiAnn, InputMultimodalLaporan, klasifikasiOtentisitasAnn(), relu() (+7 more)

### Community 37 - "train_pipeline.py"
Cohesion: 0.30
Nodes (11): buat_deskripsi(), build_colab_notebook(), ekstrak_vektor_fitur(), generate_dataset(), main(), Pipeline Pelatihan Model Machine Learning Privat PMBGM (Non-LLM)…, relu(), softmax() (+3 more)

### Community 38 - "PMBGM (Pemantau MBG Masyarakat)"
Cohesion: 0.13
Nodes (14): 1. Judul Project & Deskripsi Singkat, 2. Tech Stack yang Digunakan, 3. Cara Menjalankan Project (`clone => install => run`), 4. Progress Saat Ini, 5. Metode Komputasi & Model AI / Machine Learning, 6. Akun Demo Pengujian (Untuk Dewan Juri), Langkah 1 — Clone Repository, Langkah 2 — Install Dependensi (+6 more)

### Community 39 - "top-navbar.tsx"
Cohesion: 0.11
Nodes (17): InfoAkunNavbar, MENU_ADMIN, MENU_DAPUR, MENU_DINKES, MENU_KORWIL, MENU_PUBLIK, MENU_VERIFIKATOR, MenuItemPeran (+9 more)

### Community 40 - "buatKlienServer"
Cohesion: 0.33
Nodes (10): Isi(), metadata, SlotKonten(), ambilLaporanSaya(), ambilNotifikasi(), ambilProfil(), HARI_BUKA_ULANG, Notifikasi (+2 more)

### Community 41 - "label-sumber.tsx"
Cohesion: 0.24
Nodes (7): metadata, IKON, LabelSumber(), SINGKAT, WARNA, DataTabel, KartuGrafik()

### Community 42 - "2. Rangkuman Keputusan Utama (K1 – K9)"
Cohesion: 0.14
Nodes (13): 1. Identitas Brand (Rebranding), 2. Rangkuman Keputusan Utama (K1 – K9), 3. Mekanisme Anti-Manipulasi & Transparansi Dua Arah, [K1] Verifikasi Independen Bertingkat (*Verified-First*), [K2] Tautan Otomatis Wilayah & Dapur, [K3] Penanganan Kasus Darurat (Keracunan & Higiene Berat), [K4] Otentikasi & Akun Demo, [K5] Alur 4 Langkah Pengawasan Terbuka (Menggantikan 4 Lensa) (+5 more)

### Community 43 - "insight/layout.tsx"
Cohesion: 0.18
Nodes (10): LayoutInsight(), NavData(), NavDataDasar(), TAUTAN, NavInsight(), NavInsightDasar(), TAUTAN, aktif() (+2 more)

### Community 44 - "insight/page.tsx"
Cohesion: 0.18
Nodes (14): GET(), metadata, PeringatanTerkini(), Peta(), PrioritasTeratas(), Ringkasan(), Isi(), Isi() (+6 more)

### Community 45 - "notifikasi-email.ts"
Cohesion: 0.36
Nodes (7): Email, kirimEmail(), pisahPengirim(), isiEmail(), kirimNotifikasiTertunda(), lolos(), buatKlienAdmin()

### Community 46 - "banding/page.tsx"
Cohesion: 0.23
Nodes (12): fmt(), huruf(), IKON_METRIK, JENIS, metadata, Mode, ModeAnalis(), ModeWarga() (+4 more)

### Community 47 - "generate-png-logo.js"
Cohesion: 0.50
Nodes (4): fs, main(), path, sharp

### Community 48 - "lacak.ts"
Cohesion: 0.33
Nodes (11): HasilTiket(), ambilStatusTiket(), olahPeristiwa(), Peristiwa, PeristiwaMentah, StatusTiket, urlTindakLanjut(), PeristiwaPanel (+3 more)

### Community 54 - "data/panel.ts"
Cohesion: 0.29
Nodes (10): ambilKasusPanel(), ambilLaporanPanel(), ButirAntrean, ButirKasus, IdentitasPelapor, KomponenKredibilitas, urlBukti(), URUT_PRIORITAS (+2 more)

### Community 55 - "generate-og.mjs"
Cohesion: 0.25
Nodes (6): __dirname, __filename, iconPath, outputPath, publicDir, rootDir

### Community 56 - "panel/peringatan/page.tsx"
Cohesion: 0.33
Nodes (5): ATURAN, KartuPeringatan(), metadata, rasio(), Peringatan

### Community 57 - "daftar-prioritas.tsx"
Cohesion: 0.40
Nodes (3): ChipAlasan(), BilahMini(), FILTER

### Community 58 - "peta.ts"
Cohesion: 0.33
Nodes (5): BentukWilayah, Koleksi, LapisanGeo, SUMBER_BATAS, tembolok

### Community 59 - "supabase/proxy.ts"
Cohesion: 0.60
Nodes (3): perbaruiSesi(), config, proxy()

## Knowledge Gaps
- **337 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+332 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `buatKlienServer()` connect `buatKlienServer` to `aksi/laporan.ts`, `aksi/panel.ts`, `top-navbar.tsx`, `verifikasi/page.tsx`, `aksi-akun.tsx`, `auth.ts`, `pemilih-banding.tsx`, `data/panel.ts`, `wajibPeran`, `sesi.ts`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `buatKlienPublik()` connect `buatKlienPublik` to `insight.ts`, `metodologi/page.tsx`, `lacak/kasus/[id]/page.tsx`, `angka`, `utils.ts`, `insight/page.tsx`, `lacak.ts`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `Skeleton()` connect `skeleton.tsx` to `buatKlienPublik`, `lacak/kasus/[id]/page.tsx`, `metodologi/page.tsx`, `angka`, `buatKlienServer`, `panel/kasus/[id]/page.tsx`, `verifikasi/page.tsx`, `utils.ts`, `insight/page.tsx`, `banding/page.tsx`, `wilayah/[id]/page.tsx`, `panel/prioritas/page.tsx`, `masuk/page.tsx`, `panel/peringatan/page.tsx`, `wajibPeran`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _337 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `buatKlienPublik` be split into smaller, more focused modules?**
  _Cohesion score 0.06957047791893527 - nodes in this community are weakly interconnected._
- **Should `aksi/panel.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06196078431372549 - nodes in this community are weakly interconnected._
- **Should `generator.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06203007518796992 - nodes in this community are weakly interconnected._