# Graph Report - pantaugizi  (2026-11-01)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1054 nodes · 2497 edges · 54 communities (49 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.64)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `956a6e1b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- banding/page.tsx
- aksi/panel.ts
- generator.ts
- metodologi/page.tsx
- devDependencies
- dependencies
- label-sumber.tsx
- format.ts
- compilerOptions
- panel/kasus/[id]/page.tsx
- utils.ts
- lacak/page.tsx
- peta-risiko.tsx
- label.ts
- wilayah/[id]/page.tsx
- components.json
- laporan-insight.tsx
- panel/prioritas/page.tsx
- form-lapor.tsx
- sesi.ts
- aksi-akun.tsx
- auth.ts
- button.tsx
- angka
- field.tsx
- buttonVariants
- lacak/akuntabilitas/page.tsx
- grafik.tsx
- dropdown-menu.tsx
- database.types.ts
- buatKlienBrowser
- unggah-bukti.tsx
- dasbor-panduan.tsx
- aksi/laporan.ts
- insight.ts
- sppg/[id]/page.tsx
- Kategori
- train_pipeline.py
- app/layout.tsx
- top-navbar.tsx
- buatKlienServer
- data-terbuka.ts
- sheet.tsx
- nav-data.tsx
- insight/page.tsx
- notifikasi-email.ts
- data/publik.ts
- generate-png-logo.js
- logo.tsx
- panel/layout.tsx
- ui/badge.tsx
- eslint.config.mjs
- next.config.ts

## God Nodes (most connected - your core abstractions)
1. `angka()` - 43 edges
2. `buatKlienServer()` - 43 edges
3. `buatKlienPublik()` - 36 edges
4. `Kategori` - 30 edges
5. `Skeleton()` - 26 edges
6. `persen()` - 26 edges
7. `wajibPeran()` - 22 edges
8. `LabelSumber()` - 22 edges
9. `buttonVariants` - 22 edges
10. `StatusAlur` - 18 edges

## Surprising Connections (you probably didn't know these)
- `KlasifikasiAi` --references--> `Kategori`  [EXTRACTED]
  src/lib/klasifikasi-ai.ts → src/lib/label.ts
- `HasilKlasifikasi` --references--> `Kategori`  [EXTRACTED]
  src/lib/klasifikasi.ts → src/lib/label.ts
- `ambilKasusSorotan()` --calls--> `buatKlienPublik()`  [EXTRACTED]
  src/lib/data/publik.ts → src/lib/supabase/publik.ts
- `ambilKecamatanResponsif()` --calls--> `buatKlienPublik()`  [EXTRACTED]
  src/lib/data/publik.ts → src/lib/supabase/publik.ts
- `HalamanUnduh()` --calls--> `buttonVariants`  [EXTRACTED]
  src/app/data/unduh/page.tsx → src/components/ui/button.tsx

## Import Cycles
- None detected.

## Communities (54 total, 5 thin omitted)

### Community 0 - "banding/page.tsx"
Cohesion: 0.06
Nodes (47): huruf(), IKON_METRIK, Isi(), JENIS, metadata, Mode, ModeAnalis(), ModeWarga() (+39 more)

### Community 1 - "aksi/panel.ts"
Cohesion: 0.05
Nodes (45): AksiInstansi(), AksiTeruskan(), Berkas, IKON_TINDAKAN, InstansiPilihan, siapkan(), AksiVerifikasi(), ALASAN_CEPAT (+37 more)

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
Nodes (39): @base-ui/react, browser-image-compression, class-variance-authority, cmdk, d3-geo, exifr, lucide-react, next (+31 more)

### Community 6 - "label-sumber.tsx"
Cohesion: 0.09
Nodes (27): ATURAN, KartuPeringatan(), metadata, rasio(), ATURAN, KartuPeringatan(), metadata, rasio() (+19 more)

### Community 7 - "format.ts"
Cohesion: 0.12
Nodes (24): IsiProfil(), fmt(), angkaAtauNull(), HalamanAkuntabilitas(), angkaAtauNull(), Isi(), metadata, BarisAkuntabilitas (+16 more)

### Community 8 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 9 - "panel/kasus/[id]/page.tsx"
Cohesion: 0.12
Nodes (20): IKON_STATUS, Isi(), judulPeristiwa(), metadata, BOBOT_KREDIBILITAS, Isi(), JENIS_PELAPOR, metadata (+12 more)

### Community 10 - "utils.ts"
Cohesion: 0.15
Nodes (18): Daftar(), metadata, SARING, Isi(), buatUrl(), Daftar(), metadata, PILIHAN_URUT (+10 more)

### Community 11 - "lacak/page.tsx"
Cohesion: 0.12
Nodes (17): IsiKasus(), metadata, HasilTiket(), KasusTerbaru(), metadata, AlurStatus(), indeksTahap(), Tahap (+9 more)

### Community 12 - "peta-risiko.tsx"
Cohesion: 0.13
Nodes (22): TabelData(), Area, fmt(), IsiTooltip(), Lapis, PanelWilayah(), PetaRisikoDasar(), Posisi (+14 more)

### Community 13 - "label.ts"
Cohesion: 0.18
Nodes (21): Galeri(), IKON_STATUS, tampilan(), Timeline(), FotoBukti, Peristiwa, PeristiwaMentah, StatusTiket (+13 more)

### Community 14 - "wilayah/[id]/page.tsx"
Cohesion: 0.17
Nodes (17): KasusProvinsi(), KasusSemarang(), metadata, HalamanData(), metadata, IsiWilayah(), metadata, LabelSumber() (+9 more)

### Community 15 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 16 - "laporan-insight.tsx"
Cohesion: 0.14
Nodes (16): GET(), Peringatan, ambilAkuntabilitas(), ambilStatistik(), angkaId(), Badge(), DataLaporan, FONT (+8 more)

### Community 17 - "panel/prioritas/page.tsx"
Cohesion: 0.15
Nodes (12): PrioritasTeratas(), Isi(), metadata, Isi(), metadata, ChipAlasan(), BilahMini(), DaftarPrioritas() (+4 more)

### Community 18 - "form-lapor.tsx"
Cohesion: 0.15
Nodes (16): adaIsi(), amanIso(), bacaDraf(), Draf, DRAF_KOSONG, FormLapor(), IKON_MODE, LANGKAH (+8 more)

### Community 19 - "sesi.ts"
Cohesion: 0.17
Nodes (10): IsiMasuk(), metadata, tujuanAman(), Daftar(), metadata, SlotKonten(), ambilPengguna, LABEL_PERAN (+2 more)

### Community 20 - "aksi-akun.tsx"
Cohesion: 0.18
Nodes (16): AksiSelesai(), ARTI_BINTANG, ButirNotifikasi, DaftarNotifikasi(), FormProfil(), JENIS, beriRating(), bukaUlangKasus() (+8 more)

### Community 21 - "auth.ts"
Cohesion: 0.18
Nodes (15): MasukPassword(), DAFTAR_PERSONA, PersonaDemo, PilihanMasuk(), TopNavbar(), AKUN_DEMO, daftarAkun(), HasilAksi (+7 more)

### Community 22 - "button.tsx"
Cohesion: 0.18
Nodes (11): BagianForm(), maxDuration, metadata, IsiSukses(), metadata, TabelSlaRingkas(), SalinTiket(), Button() (+3 more)

### Community 23 - "angka"
Cohesion: 0.17
Nodes (12): Hasil(), JENJANG, metadata, Ubin(), BadgeRisiko(), ButirSppg, DirektoriSppg(), FILTER_RISIKO (+4 more)

### Community 24 - "field.tsx"
Cohesion: 0.15
Nodes (4): Field(), fieldVariants, Label(), Separator()

### Community 25 - "buttonVariants"
Cohesion: 0.19
Nodes (11): LayoutInsight(), HalamanPanduan(), metadata, NavInsight(), NavInsightDasar(), TAUTAN, DasborPanduan(), PRESET_CONTOH (+3 more)

### Community 26 - "lacak/akuntabilitas/page.tsx"
Cohesion: 0.16
Nodes (10): metadata, LABEL_TAHAP, metadata, Tabel(), TAHAP, URUT_KATEGORI, IKON_KATEGORI, NavLacak() (+2 more)

### Community 27 - "grafik.tsx"
Cohesion: 0.20
Nodes (12): fmt(), fmtDasar(), Format, GrafikBatang(), GrafikGaris(), GrafikGarisMulti(), GrafikTargetRealisasi(), IsiTooltip (+4 more)

### Community 29 - "database.types.ts"
Cohesion: 0.15
Nodes (12): CompositeTypes, Constants, DatabaseWithoutInternals, DefaultSchema, Enums, Json, Tables, TablesInsert (+4 more)

### Community 30 - "buatKlienBrowser"
Cohesion: 0.22
Nodes (8): GoogleSearchBar(), RekomendasiItem, CariSekolah(), JENJANG, SekolahPilihan, LaporanSerupa(), Serupa, buatKlienBrowser()

### Community 31 - "unggah-bukti.tsx"
Cohesion: 0.23
Nodes (11): ukuran(), UnggahBukti(), bacaMetadata(), BuktiSiap, MetadataBukti, siapkanBukti(), BATAS_BUKTI, DAFTAR_KATEGORI (+3 more)

### Community 32 - "dasbor-panduan.tsx"
Cohesion: 0.20
Nodes (7): ItemPanduan, KATEGORI, Dialog(), DialogContent(), DialogDescription(), DialogHeader(), DialogTitle()

### Community 33 - "aksi/laporan.ts"
Cohesion: 0.26
Nodes (11): HasilKirim, kirimLaporan(), gabungKlasifikasi(), KlasifikasiAi, klasifikasiDenganAi(), klasifikasiNaiveBayes(), NB_PRIORS, NB_TOKEN_WEIGHTS (+3 more)

### Community 34 - "insight.ts"
Cohesion: 0.22
Nodes (12): ambilPeta(), n(), SppgIndeks, TitikSppg, Alasan, BentukWilayah, KanvasPeta, Koleksi (+4 more)

### Community 35 - "sppg/[id]/page.tsx"
Cohesion: 0.22
Nodes (9): JENJANG, metadata, HalamanWilayah(), metadata, Meter(), Remah(), Tile(), BilahKomponen() (+1 more)

### Community 36 - "Kategori"
Cohesion: 0.22
Nodes (12): B1, B2, ekstrakVektorFitur(), HasilVerifikasiAnn, InputMultimodalLaporan, klasifikasiOtentisitasAnn(), relu(), softmax() (+4 more)

### Community 37 - "train_pipeline.py"
Cohesion: 0.30
Nodes (11): buat_deskripsi(), build_colab_notebook(), ekstrak_vektor_fitur(), generate_dataset(), main(), Pipeline Pelatihan Model Machine Learning Privat PMBGM (Non-LLM)…, relu(), softmax() (+3 more)

### Community 38 - "app/layout.tsx"
Cohesion: 0.20
Nodes (8): geistMono, jakarta, metadata, viewport, TopNavbarSlot(), PERTOLONGAN_CEPAT, WidgetDarurat(), Toaster()

### Community 39 - "top-navbar.tsx"
Cohesion: 0.17
Nodes (11): InfoAkunNavbar, MENU_ADMIN, MENU_DAPUR, MENU_DINKES, MENU_KORWIL, MENU_PUBLIK, MENU_VERIFIKATOR, MenuItemPeran (+3 more)

### Community 40 - "buatKlienServer"
Cohesion: 0.38
Nodes (8): Isi(), metadata, ambilLaporanSaya(), ambilNotifikasi(), ambilProfil(), HARI_BUKA_ULANG, Notifikasi, buatKlienServer()

### Community 41 - "data-terbuka.ts"
Cohesion: 0.31
Nodes (9): HalamanDirektori(), metadata, KartuKepatuhanDapur(), ambilDaftarSppg(), ambilKasusSemarang(), ambilKepatuhanWilayah(), ambilProfilSppg(), ambilWilayah() (+1 more)

### Community 42 - "sheet.tsx"
Cohesion: 0.18
Nodes (5): Sheet(), SheetContent(), SheetHeader(), SheetTitle(), SheetTrigger()

### Community 43 - "nav-data.tsx"
Cohesion: 0.29
Nodes (6): NavData(), NavDataDasar(), TAUTAN, aktif(), NavSubDasar(), TautanSub

### Community 44 - "insight/page.tsx"
Cohesion: 0.24
Nodes (8): metadata, PeringatanTerkini(), Peta(), Ringkasan(), Isi(), Isi(), PetaRisiko(), ambilPeringatan()

### Community 45 - "notifikasi-email.ts"
Cohesion: 0.36
Nodes (7): Email, kirimEmail(), pisahPengirim(), isiEmail(), kirimNotifikasiTertunda(), lolos(), buatKlienAdmin()

### Community 46 - "data/publik.ts"
Cohesion: 0.25
Nodes (8): alasanRisiko(), ambilKasusSorotan(), ambilKecamatanResponsif(), ambilPrioritasInspeksi(), AturanSla, JenisAlasan, SppgPrioritas, StatistikPublik

### Community 47 - "generate-png-logo.js"
Cohesion: 0.50
Nodes (4): fs, main(), path, sharp

### Community 48 - "logo.tsx"
Cohesion: 0.50
Nodes (3): Footer(), Logo(), TandaLogo()

## Knowledge Gaps
- **309 isolated node(s):** `Mode`, `PenggunaAdmin`, `Peran`, `ButirBanding`, `SeriBanding` (+304 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `buatKlienServer()` connect `buatKlienServer` to `aksi/laporan.ts`, `aksi/panel.ts`, `panel/kasus/[id]/page.tsx`, `utils.ts`, `label.ts`, `sesi.ts`, `aksi-akun.tsx`, `auth.ts`, `lacak/akuntabilitas/page.tsx`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `angka()` connect `angka` to `banding/page.tsx`, `sppg/[id]/page.tsx`, `label-sumber.tsx`, `format.ts`, `panel/kasus/[id]/page.tsx`, `utils.ts`, `lacak/page.tsx`, `insight/page.tsx`, `peta-risiko.tsx`, `wilayah/[id]/page.tsx`, `lacak/akuntabilitas/page.tsx`, `grafik.tsx`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `buatKlienPublik()` connect `banding/page.tsx` to `insight.ts`, `metodologi/page.tsx`, `sppg/[id]/page.tsx`, `data-terbuka.ts`, `lacak/page.tsx`, `insight/page.tsx`, `label.ts`, `wilayah/[id]/page.tsx`, `data/publik.ts`, `laporan-insight.tsx`, `panel/prioritas/page.tsx`, `button.tsx`, `angka`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `Mode`, `PenggunaAdmin`, `Peran` to the rest of the system?**
  _309 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `banding/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05789235639981909 - nodes in this community are weakly interconnected._
- **Should `aksi/panel.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05384150030248034 - nodes in this community are weakly interconnected._
- **Should `generator.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06203007518796992 - nodes in this community are weakly interconnected._