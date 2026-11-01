# Graph Report - pantaugizi  (2026-11-01)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1054 nodes · 2504 edges · 54 communities (49 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.64)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0ec875d4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- angka
- banding/page.tsx
- generator.ts
- metodologi/page.tsx
- devDependencies
- dependencies
- label-sumber.tsx
- aksi/panel.ts
- panel/prioritas/page.tsx
- compilerOptions
- verifikasi/[id]/page.tsx
- label.ts
- data/badge.tsx
- lacak.ts
- components.json
- peta-risiko.tsx
- auth.ts
- form-lapor.tsx
- sesi.ts
- buatKlienServer
- aksi-akun.tsx
- insight/page.tsx
- insight.ts
- button.tsx
- laporan-insight.tsx
- field.tsx
- buttonVariants
- skeleton.tsx
- dropdown-menu.tsx
- buatKlienBrowser
- unggah-bukti.tsx
- dasbor-panduan.tsx
- aksi/laporan.ts
- Kategori
- train_pipeline.py
- app/layout.tsx
- top-navbar.tsx
- input-group.tsx
- sheet.tsx
- nav-data.tsx
- notifikasi-email.ts
- panel/kasus/[id]/page.tsx
- daftar-prioritas.tsx
- data/publik.ts
- pengguna/page.tsx
- generate-png-logo.js
- sel-sla.tsx
- logo.tsx
- panel/layout.tsx
- ui/badge.tsx
- eslint.config.mjs
- next.config.ts
- lacak/page.tsx

## God Nodes (most connected - your core abstractions)
1. `angka()` - 43 edges
2. `buatKlienServer()` - 43 edges
3. `buatKlienPublik()` - 36 edges
4. `Kategori` - 30 edges
5. `persen()` - 26 edges
6. `Skeleton()` - 26 edges
7. `LabelSumber()` - 22 edges
8. `wajibPeran()` - 22 edges
9. `buttonVariants` - 22 edges
10. `KategoriRisiko` - 19 edges

## Surprising Connections (you probably didn't know these)
- `PetaSemarang()` --calls--> `KategoriRisiko`  [EXTRACTED]
  src/lib/pdf/laporan-insight.tsx → src/lib/label.ts
- `KlasifikasiAi` --references--> `Kategori`  [EXTRACTED]
  src/lib/klasifikasi-ai.ts → src/lib/label.ts
- `HasilKlasifikasi` --references--> `Kategori`  [EXTRACTED]
  src/lib/klasifikasi.ts → src/lib/label.ts
- `BarSelesai()` --calls--> `persen()`  [EXTRACTED]
  src/components/lacak/tabel-akuntabilitas.tsx → src/lib/format.ts
- `ambilKasusSorotan()` --calls--> `buatKlienPublik()`  [EXTRACTED]
  src/lib/data/publik.ts → src/lib/supabase/publik.ts

## Import Cycles
- None detected.

## Communities (54 total, 5 thin omitted)

### Community 0 - "angka"
Cohesion: 0.06
Nodes (73): KasusProvinsi(), KasusSemarang(), metadata, HalamanData(), metadata, IsiProfil(), JENJANG, metadata (+65 more)

### Community 1 - "banding/page.tsx"
Cohesion: 0.06
Nodes (44): Hasil(), JENJANG, metadata, huruf(), IKON_METRIK, Isi(), JENIS, metadata (+36 more)

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
Nodes (26): ATURAN, KartuPeringatan(), metadata, rasio(), FormCekTiket(), TAMPIL, IKON, SINGKAT (+18 more)

### Community 7 - "aksi/panel.ts"
Cohesion: 0.08
Nodes (34): AksiInstansi(), AksiTeruskan(), Berkas, IKON_TINDAKAN, InstansiPilihan, siapkan(), AksiVerifikasi(), ALASAN_CEPAT (+26 more)

### Community 8 - "panel/prioritas/page.tsx"
Cohesion: 0.11
Nodes (19): Isi(), metadata, Isi(), metadata, langganan(), pendengar, sekarang, useSekarang() (+11 more)

### Community 9 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 10 - "verifikasi/[id]/page.tsx"
Cohesion: 0.17
Nodes (11): BOBOT_KREDIBILITAS, Isi(), JENIS_PELAPOR, metadata, HitungMundur(), sisa(), IKON_MODE, ambilLaporanPanel() (+3 more)

### Community 11 - "label.ts"
Cohesion: 0.13
Nodes (25): Daftar(), metadata, SARING, Isi(), buatUrl(), Daftar(), metadata, PILIHAN_URUT (+17 more)

### Community 12 - "data/badge.tsx"
Cohesion: 0.17
Nodes (11): metadata, BadgeSla(), BadgeStatus(), STATUS_TAMPIL, WARNA_RISIKO, Galeri(), IKON_STATUS, tampilan() (+3 more)

### Community 13 - "lacak.ts"
Cohesion: 0.27
Nodes (13): IsiKasus(), HasilTiket(), ambilKasus(), ambilStatusTiket(), olahPeristiwa(), Peristiwa, PeristiwaMentah, StatusTiket (+5 more)

### Community 14 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 15 - "peta-risiko.tsx"
Cohesion: 0.16
Nodes (19): TabelData(), Area, fmt(), IsiTooltip(), Lapis, PanelWilayah(), PetaRisikoDasar(), Posisi (+11 more)

### Community 16 - "auth.ts"
Cohesion: 0.15
Nodes (16): IsiMasuk(), metadata, tujuanAman(), MasukPassword(), DAFTAR_PERSONA, PersonaDemo, PilihanMasuk(), AKUN_DEMO (+8 more)

### Community 17 - "form-lapor.tsx"
Cohesion: 0.15
Nodes (16): adaIsi(), amanIso(), bacaDraf(), Draf, DRAF_KOSONG, FormLapor(), IKON_MODE, LANGKAH (+8 more)

### Community 18 - "sesi.ts"
Cohesion: 0.14
Nodes (14): Pengguna, CompositeTypes, Constants, Database, DatabaseWithoutInternals, DefaultSchema, Enums, Json (+6 more)

### Community 19 - "buatKlienServer"
Cohesion: 0.23
Nodes (13): Isi(), metadata, SlotKonten(), TopNavbar(), keluar(), ambilLaporanSaya(), ambilNotifikasi(), ambilProfil() (+5 more)

### Community 20 - "aksi-akun.tsx"
Cohesion: 0.18
Nodes (16): AksiSelesai(), ARTI_BINTANG, ButirNotifikasi, DaftarNotifikasi(), FormProfil(), JENIS, beriRating(), bukaUlangKasus() (+8 more)

### Community 21 - "insight/page.tsx"
Cohesion: 0.19
Nodes (14): GET(), metadata, PeringatanTerkini(), PrioritasTeratas(), Ringkasan(), Isi(), Isi(), PetaRisiko() (+6 more)

### Community 22 - "insight.ts"
Cohesion: 0.17
Nodes (15): Peta(), ambilPeta(), KabkotaPeta, KecamatanPeta, n(), SppgIndeks, TitikSppg, Alasan (+7 more)

### Community 23 - "button.tsx"
Cohesion: 0.18
Nodes (11): BagianForm(), maxDuration, metadata, IsiSukses(), metadata, TabelSlaRingkas(), SalinTiket(), Button() (+3 more)

### Community 24 - "laporan-insight.tsx"
Cohesion: 0.15
Nodes (14): DataPeta, Peringatan, StatistikPublik, angkaId(), Badge(), DataLaporan, FONT, Kaki() (+6 more)

### Community 25 - "field.tsx"
Cohesion: 0.15
Nodes (4): Field(), fieldVariants, Label(), Separator()

### Community 26 - "buttonVariants"
Cohesion: 0.19
Nodes (11): LayoutInsight(), HalamanPanduan(), metadata, NavInsight(), NavInsightDasar(), TAUTAN, DasborPanduan(), PRESET_CONTOH (+3 more)

### Community 27 - "skeleton.tsx"
Cohesion: 0.22
Nodes (7): LABEL_TAHAP, metadata, Tabel(), TAHAP, URUT_KATEGORI, Skeleton(), STATUS

### Community 29 - "buatKlienBrowser"
Cohesion: 0.22
Nodes (8): GoogleSearchBar(), RekomendasiItem, CariSekolah(), JENJANG, SekolahPilihan, LaporanSerupa(), Serupa, buatKlienBrowser()

### Community 30 - "unggah-bukti.tsx"
Cohesion: 0.23
Nodes (11): ukuran(), UnggahBukti(), bacaMetadata(), BuktiSiap, MetadataBukti, siapkanBukti(), BATAS_BUKTI, DAFTAR_KATEGORI (+3 more)

### Community 31 - "dasbor-panduan.tsx"
Cohesion: 0.20
Nodes (7): ItemPanduan, KATEGORI, Dialog(), DialogContent(), DialogDescription(), DialogHeader(), DialogTitle()

### Community 32 - "aksi/laporan.ts"
Cohesion: 0.26
Nodes (11): HasilKirim, kirimLaporan(), gabungKlasifikasi(), KlasifikasiAi, klasifikasiDenganAi(), klasifikasiNaiveBayes(), NB_PRIORS, NB_TOKEN_WEIGHTS (+3 more)

### Community 33 - "Kategori"
Cohesion: 0.22
Nodes (12): B1, B2, ekstrakVektorFitur(), HasilVerifikasiAnn, InputMultimodalLaporan, klasifikasiOtentisitasAnn(), relu(), softmax() (+4 more)

### Community 34 - "train_pipeline.py"
Cohesion: 0.30
Nodes (11): buat_deskripsi(), build_colab_notebook(), ekstrak_vektor_fitur(), generate_dataset(), main(), Pipeline Pelatihan Model Machine Learning Privat PMBGM (Non-LLM)…, relu(), softmax() (+3 more)

### Community 35 - "app/layout.tsx"
Cohesion: 0.20
Nodes (8): geistMono, jakarta, metadata, viewport, TopNavbarSlot(), PERTOLONGAN_CEPAT, WidgetDarurat(), Toaster()

### Community 36 - "top-navbar.tsx"
Cohesion: 0.18
Nodes (11): InfoAkunNavbar, MENU_ADMIN, MENU_DAPUR, MENU_DINKES, MENU_KORWIL, MENU_PUBLIK, MENU_VERIFIKATOR, MenuItemPeran (+3 more)

### Community 37 - "input-group.tsx"
Cohesion: 0.24
Nodes (5): InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, Input()

### Community 38 - "sheet.tsx"
Cohesion: 0.18
Nodes (5): Sheet(), SheetContent(), SheetHeader(), SheetTitle(), SheetTrigger()

### Community 39 - "nav-data.tsx"
Cohesion: 0.29
Nodes (6): NavData(), NavDataDasar(), TAUTAN, aktif(), NavSubDasar(), TautanSub

### Community 40 - "notifikasi-email.ts"
Cohesion: 0.36
Nodes (7): Email, kirimEmail(), pisahPengirim(), isiEmail(), kirimNotifikasiTertunda(), lolos(), buatKlienAdmin()

### Community 41 - "panel/kasus/[id]/page.tsx"
Cohesion: 0.18
Nodes (12): IKON_STATUS, Isi(), judulPeristiwa(), metadata, AlurStatus(), indeksTahap(), Tahap, BadgePrioritas() (+4 more)

### Community 42 - "daftar-prioritas.tsx"
Cohesion: 0.29
Nodes (5): BadgeRisiko(), ChipAlasan(), BilahMini(), FILTER, RISIKO

### Community 43 - "data/publik.ts"
Cohesion: 0.29
Nodes (7): alasanRisiko(), ambilKasusSorotan(), ambilKecamatanResponsif(), ambilPrioritasInspeksi(), AturanSla, JenisAlasan, SppgPrioritas

### Community 44 - "pengguna/page.tsx"
Cohesion: 0.33
Nodes (4): Daftar(), metadata, BarisPengguna(), aturPeran()

### Community 45 - "generate-png-logo.js"
Cohesion: 0.50
Nodes (4): fs, main(), path, sharp

### Community 46 - "sel-sla.tsx"
Cohesion: 0.50
Nodes (4): Kategori, SelSla(), Tahap, simpanSla()

### Community 47 - "logo.tsx"
Cohesion: 0.50
Nodes (3): Footer(), Logo(), TandaLogo()

### Community 53 - "lacak/page.tsx"
Cohesion: 0.23
Nodes (7): metadata, KasusTerbaru(), metadata, IKON_KATEGORI, NavLacak(), TAUTAN, ambilKasusTerbaru()

## Knowledge Gaps
- **308 isolated node(s):** `ButirSppg`, `Format`, `IsiTooltip`, `DataTabel`, `Mode` (+303 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `buatKlienServer()` connect `buatKlienServer` to `aksi/laporan.ts`, `aksi/panel.ts`, `panel/kasus/[id]/page.tsx`, `verifikasi/[id]/page.tsx`, `label.ts`, `pengguna/page.tsx`, `sel-sla.tsx`, `auth.ts`, `sesi.ts`, `aksi-akun.tsx`, `skeleton.tsx`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `angka()` connect `angka` to `banding/page.tsx`, `panel/kasus/[id]/page.tsx`, `verifikasi/[id]/page.tsx`, `label.ts`, `data/badge.tsx`, `lacak.ts`, `peta-risiko.tsx`, `lacak/page.tsx`, `insight/page.tsx`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `buatKlienPublik()` connect `banding/page.tsx` to `angka`, `metodologi/page.tsx`, `data/publik.ts`, `lacak.ts`, `insight/page.tsx`, `insight.ts`, `button.tsx`, `lacak/page.tsx`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `ButirSppg`, `Format`, `IsiTooltip` to the rest of the system?**
  _308 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `angka` be split into smaller, more focused modules?**
  _Cohesion score 0.05531914893617021 - nodes in this community are weakly interconnected._
- **Should `banding/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06393442622950819 - nodes in this community are weakly interconnected._
- **Should `generator.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06203007518796992 - nodes in this community are weakly interconnected._