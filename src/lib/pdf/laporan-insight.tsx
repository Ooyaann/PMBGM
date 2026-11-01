import "server-only";
import path from "node:path";
import { Circle, Document, Font, Image, Link, Page, Path, StyleSheet, Svg, Text, View } from "@react-pdf/renderer";
import type { Peringatan, DataPeta, SppgIndeks } from "@/lib/data/insight";
import type { StatistikPublik } from "@/lib/data/publik";
import { SUMBER_BATAS } from "@/lib/geo/peta";
import { durasiJam, persen } from "@/lib/format";
import { kategoriRisiko, RISIKO, type KategoriRisiko } from "@/lib/label";
import { ambangKuantil, ISI_KOSONG, ISI_RISIKO, kelasNilai, langkahRamp, RAMP_SEQ, TITIK_RISIKO } from "@/lib/peta-skala";

const LOGO_PATH = path.join(process.cwd(), "public", "logo-pmbgm.png");

// Plus Jakarta Sans (SIL OFL 1.1, lisensi di folder font) agar PDF sama dengan tampilan web.
const FONT = path.join(process.cwd(), "src/lib/pdf/font");
Font.register({
  family: "Jakarta",
  fonts: [
    { src: path.join(FONT, "PlusJakartaSans-Regular.ttf"), fontWeight: 400 },
    { src: path.join(FONT, "PlusJakartaSans-SemiBold.ttf"), fontWeight: 600 },
    { src: path.join(FONT, "PlusJakartaSans-Bold.ttf"), fontWeight: 700 },
    { src: path.join(FONT, "PlusJakartaSans-ExtraBold.ttf"), fontWeight: 800 },
  ],
});
Font.registerHyphenationCallback((kata) => [kata]);

const W = {
  tinta: "#1e293b",
  tintaTebal: "#0f172a",
  redup: "#64748b",
  sangatRedup: "#94a3b8",
  garis: "#e2e8f0",
  latar: "#f8fafc",
  latarHeader: "#f1f5f9",
  utama: "#0f6b57",
  utamaGelap: "#094a3c",
  utamaLembut: "#e6f4f0",
  utamaBorder: "#b5e2d6",
  darurat: "#dc2626",
  daruratLembut: "#fee2e2",
  daruratTeks: "#991b1b",
  sedang: "#d97706",
  sedangLembut: "#fef3c7",
  sedangTeks: "#92400e",
  rendah: "#16a34a",
  rendahLembut: "#dcfce7",
  rendahTeks: "#166534",
};

const s = StyleSheet.create({
  halaman: { fontFamily: "Jakarta", fontSize: 8, color: W.tinta, paddingTop: 30, paddingBottom: 42, paddingHorizontal: 36, lineHeight: 1.35 },
  kepala: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1.5, borderBottomColor: W.utama, paddingBottom: 8 },
  kepalaKanan: { alignItems: "flex-end" },
  judul: { fontSize: 13, fontWeight: 800, color: W.tintaTebal, lineHeight: 1.2, marginBottom: 2 },
  subMerek: { fontSize: 8, fontWeight: 700, color: W.utama, marginBottom: 1.5 },
  sub: { color: W.redup, fontSize: 7.5 },
  chip: { marginTop: 7, alignSelf: "flex-start", backgroundColor: W.utamaLembut, borderWidth: 0.6, borderColor: W.utamaBorder, borderRadius: 5, paddingVertical: 2, paddingHorizontal: 7 },
  chipTeks: { fontSize: 7.5, fontWeight: 600, color: W.utamaGelap },
  bagian: { marginTop: 12 },
  h2: { fontSize: 9.5, fontWeight: 800, color: W.tintaTebal, marginBottom: 5 },
  baris: { flexDirection: "row" },
  ubin: { flex: 1, backgroundColor: W.latar, borderWidth: 0.8, borderColor: W.garis, borderRadius: 6, paddingVertical: 5, paddingHorizontal: 6.5, marginRight: 6 },
  ubinNilai: { fontSize: 13.5, fontWeight: 800, color: W.tintaTebal, marginTop: 1 },
  ubinLabel: { fontSize: 6.5, fontWeight: 700, color: W.redup, textTransform: "uppercase" },
  kartuTemuan: { flex: 1, backgroundColor: W.latar, borderWidth: 0.8, borderColor: W.garis, borderRadius: 7, padding: 8 },
  th: { fontSize: 6.5, color: W.redup, fontWeight: 700, paddingVertical: 4, paddingHorizontal: 3, textTransform: "uppercase" },
  td: { fontSize: 7.5, paddingVertical: 3.5, paddingHorizontal: 3 },
  trGaris: { borderBottomWidth: 0.5, borderBottomColor: W.garis },
  legenda: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
  legendaButir: { flexDirection: "row", alignItems: "center", marginRight: 7, marginBottom: 2 },
  kotak: { width: 7, height: 5, borderRadius: 1, marginRight: 3 },
  poin: { flexDirection: "row", alignItems: "flex-start", marginBottom: 3.5 },
  poinNomor: { width: 13, height: 13, borderRadius: 6.5, backgroundColor: W.utamaLembut, alignItems: "center", justifyContent: "center", marginRight: 5, marginTop: 0.5 },
  poinNomorTeks: { fontSize: 7, fontWeight: 800, color: W.utama },
  kaki: { position: "absolute", top: 810, left: 36, right: 36, flexDirection: "row", justifyContent: "space-between", alignItems: "center", fontSize: 7, color: W.redup, borderTopWidth: 0.5, borderTopColor: W.garis, paddingTop: 5 },
  badge: { borderRadius: 4, paddingVertical: 1.5, paddingHorizontal: 5, fontSize: 7, fontWeight: 700, alignSelf: "flex-start" },
  kepalaHalaman2: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderBottomColor: W.garis, paddingBottom: 6, marginBottom: 10 },
});

const WARNA_BADGE: Record<KategoriRisiko, { bg: string; fg: string }> = {
  rendah: { bg: W.rendahLembut, fg: W.rendahTeks },
  sedang: { bg: W.sedangLembut, fg: W.sedangTeks },
  tinggi: { bg: W.daruratLembut, fg: W.daruratTeks },
};

const angkaId = (v: number | null | undefined, d = 0) => (v == null ? "–" : v.toLocaleString("id-ID", { maximumFractionDigits: d }));
const singkat = (nama: string) => nama.replace(/^Kabupaten /, "Kab. ");
const tglJam = (iso: string) => new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(iso));

function Badge({ skor }: { skor: number | null }) {
  const k = kategoriRisiko(skor);
  return (
    <Text style={[s.badge, { backgroundColor: WARNA_BADGE[k].bg, color: WARNA_BADGE[k].fg }]}>
      {angkaId(skor)} · {RISIKO[k].label}
    </Text>
  );
}

function Legenda({ butir }: { butir: { label: string; warna: string; bulat?: boolean }[] }) {
  return (
    <View style={s.legenda}>
      {butir.map((b) => (
        <View key={b.label} style={s.legendaButir}>
          <View style={[s.kotak, { backgroundColor: b.warna }, b.bulat ? { width: 6, borderRadius: 3 } : {}]} />
          <Text style={{ fontSize: 7, color: W.redup }}>{b.label}</Text>
        </View>
      ))}
    </View>
  );
}

function PetaSemarang({ peta, lebar }: { peta: DataPeta["semarang"]; lebar: number }) {
  return (
    <View>
      <Svg viewBox={`0 0 ${peta.lebar} ${peta.tinggi}`} style={{ width: lebar, height: (lebar * peta.tinggi) / peta.lebar }}>
        {peta.wilayah.map((w) => (
          <Path key={w.id} d={w.d} fill={w.tertinggi == null ? ISI_KOSONG.hex : ISI_RISIKO[kategoriRisiko(w.tertinggi)].hex}
            stroke="#ffffff" strokeWidth={2} />
        ))}
        {peta.titik.map((t) => (
          <Circle key={t.id} cx={t.x} cy={t.y} r={t.kategori === "tinggi" ? 9 : 7} fill={TITIK_RISIKO[t.kategori].hex} stroke="#ffffff" strokeWidth={3} />
        ))}
      </Svg>
      <Legenda butir={[
        ...(["rendah", "sedang", "tinggi"] as KategoriRisiko[]).map((k) => ({ label: `${RISIKO[k].label} ${k === "rendah" ? "0–39" : k === "sedang" ? "40–69" : "70+"}`, warna: ISI_RISIKO[k].hex })),
        { label: "SPPG", warna: TITIK_RISIKO.tinggi.hex, bulat: true },
      ]} />
    </View>
  );
}

function PetaJateng({ peta, lebar }: { peta: DataPeta["jateng"]; lebar: number }) {
  const nilai = peta.wilayah.map((w) => w.kasusPer100rb);
  const ambang = ambangKuantil(nilai, 5, 1);
  const langkah = langkahRamp(ambang.length + 1);
  return (
    <View>
      <Svg viewBox={`0 0 ${peta.lebar} ${peta.tinggi}`} style={{ width: lebar, height: (lebar * peta.tinggi) / peta.lebar }}>
        {peta.wilayah.map((w) => (
          <Path key={w.id} d={w.d} stroke="#ffffff" strokeWidth={1.2}
            fill={w.kasusPer100rb == null ? ISI_KOSONG.hex : RAMP_SEQ[langkah[kelasNilai(w.kasusPer100rb, ambang)]].hex} />
        ))}
      </Svg>
      <Legenda butir={langkah.map((l, i) => ({
        label: i === 0 ? `< ${angkaId(ambang[0], 1)}` : i === langkah.length - 1 ? `≥ ${angkaId(ambang[i - 1], 1)}` : `${angkaId(ambang[i - 1], 1)}–${angkaId(ambang[i], 1)}`,
        warna: RAMP_SEQ[l].hex,
      }))} />
    </View>
  );
}

function Tabel({ kolom, baris, lebar }: { kolom: string[]; baris: (string | React.ReactNode)[][]; lebar: number[] }) {
  const gaya = (i: number) => (i < lebar.length ? { width: lebar[i] } : { flex: 1 });
  return (
    <View style={{ borderRadius: 5, overflow: "hidden", borderWidth: 0.8, borderColor: W.garis }}>
      <View style={[s.baris, { backgroundColor: W.latarHeader, borderBottomWidth: 0.8, borderBottomColor: W.garis }]}>
        {kolom.map((k, i) => <Text key={k} style={[s.th, gaya(i)]}>{k}</Text>)}
      </View>
      {baris.map((b, j) => (
        <View
          key={j}
          style={[
            s.baris,
            j < baris.length - 1 ? s.trGaris : {},
            { alignItems: "center", backgroundColor: j % 2 === 1 ? "#fafbfc" : "#ffffff" },
          ]}
          wrap={false}
        >
          {b.map((sel, i) => (
            typeof sel === "string"
              ? <Text key={i} style={[s.td, gaya(i)]}>{sel}</Text>
              : <View key={i} style={[s.td, gaya(i)]}>{sel}</View>
          ))}
        </View>
      ))}
    </View>
  );
}

function Kaki({ dibuat }: { dibuat: string }) {
  return (
    <View style={s.kaki} fixed>
      <Text>PMBGM · Laporan Ringkas Eksekutif Insight · {tglJam(dibuat)} WIB</Text>
      <Text render={({ pageNumber, totalPages }) => `Halaman ${pageNumber} dari ${totalPages}`} />
    </View>
  );
}

export interface DataLaporan {
  dibuat: string;
  asal: string;
  statistik: StatistikPublik | null;
  indeks: SppgIndeks[];
  peta: DataPeta;
  peringatan: Peringatan[];
  ditinjau: number;
  kecamatan: {
    nama: string | null; jumlah_kasus: number | null; persen_selesai: number | null; rata_jam_respons: number | null;
    persen_terlambat: number | null; kepuasan: number | null;
  }[];
}

/** Laporan ringkas Insight (IN-07): dua halaman A4 untuk rapat, surat, atau arsip. */
export function LaporanInsight({ d }: { d: DataLaporan }) {
  const st = d.statistik;
  const tinggi = d.indeks.filter((i) => i.kategori === "tinggi");
  const kecTertinggi = [...d.peta.semarang.wilayah].sort((a, b) => (b.tertinggi ?? -1) - (a.tertinggi ?? -1))[0];
  const kabTertinggi = [...d.peta.jateng.wilayah].sort((a, b) => (b.kasusPer100rb ?? -1) - (a.kasusPer100rb ?? -1));
  const aktif = d.peringatan.filter((p) => p.aktif);
  const responsif = [...d.kecamatan].filter((k) => (k.jumlah_kasus ?? 0) >= 10 && k.rata_jam_respons != null)
    .sort((a, b) => (a.persen_terlambat ?? 100) - (b.persen_terlambat ?? 100))[0];

  const temuan = [
    tinggi.length
      ? `${tinggi.length} SPPG berisiko tinggi. Tertinggi: ${singkat(tinggi[0].nama)} (${angkaId(tinggi[0].indeks)}), terutama karena ${tinggi[0].alasan.map((a) => a.singkat.charAt(0).toLowerCase() + a.singkat.slice(1)).slice(0, 2).join(" dan ")}.`
      : "Tidak ada SPPG berisiko tinggi saat ini. Seluruh dapur beroperasi dalam batas aman.",
    kecTertinggi?.tertinggi != null ? `Kecamatan dengan risiko SPPG tertinggi: ${kecTertinggi.nama} (skor ${angkaId(kecTertinggi.tertinggi)}).` : null,
    st ? `${angkaId(st.kasus_tidak_ditanggapi)} kasus aduan belum ditanggapi instansi melewati batas waktu resmi (SLA).` : null,
    aktif.length ? `${aktif.length} peringatan dini lonjakan aktif terdeteksi dalam 24 jam terakhir.` : `Tidak ada anomali lonjakan aktif${d.ditinjau ? `; ${d.ditinjau} sinyal sedang diverifikasi` : ""}.`,
    responsif ? `Kecamatan paling responsif: ${responsif.nama}, hanya ${persen(responsif.persen_terlambat)} kasus lewat batas SLA.` : null,
  ].filter((x): x is string => !!x);

  return (
    <Document title="Laporan Ringkas Insight · PMBGM" author="PMBGM" subject="Pengawasan partisipatif Makan Bergizi Gratis" language="id">
      {/* ================= HALAMAN 1 ================= */}
      <Page size="A4" style={s.halaman}>
        <Kaki dibuat={d.dibuat} />

        {/* Kop Eksekutif */}
        <View style={s.kepala}>
          <Image src={LOGO_PATH} style={{ width: 130, height: 26, objectFit: "contain" }} />
          <View style={s.kepalaKanan}>
            <Text style={s.judul}>Laporan Ringkas Insight</Text>
            <Text style={s.subMerek}>Sistem Pemantau MBG Masyarakat (PMBGM)</Text>
            <Text style={s.sub}>Per {tglJam(d.dibuat)} WIB · Provinsi Jawa Tengah</Text>
          </View>
        </View>

        <View style={s.chip}>
          <Text style={s.chipTeks}>Dokumen Eksekutif Resmi · Data Terbuka Simulasi Terverifikasi (MIA 2026)</Text>
        </View>

        {/* 5 Ubin Metrik Ringkasan */}
        <View style={[s.baris, s.bagian]}>
          {[
            { label: "Laporan Verifikasi", nilai: angkaId(st?.laporan_terverifikasi), aksen: W.tintaTebal, bg: W.latar },
            { label: "Kasus Selesai", nilai: st ? `${angkaId(st.kasus_selesai)}/${angkaId(st.kasus_total)}` : "–", aksen: W.rendahTeks, bg: W.latar },
            { label: "Rata Waktu Tanggap", nilai: durasiJam(st?.rata_jam_respons), aksen: W.utama, bg: W.latar },
            { label: "SPPG Risiko Tinggi", nilai: angkaId(tinggi.length), aksen: tinggi.length > 0 ? W.daruratTeks : W.tintaTebal, bg: tinggi.length > 0 ? W.daruratLembut : W.latar },
            { label: "Peringatan Aktif", nilai: angkaId(aktif.length), aksen: aktif.length > 0 ? W.daruratTeks : W.tintaTebal, bg: aktif.length > 0 ? W.daruratLembut : W.latar },
          ].map((u, i, a) => (
            <View key={u.label} style={[s.ubin, { backgroundColor: u.bg }, i === a.length - 1 ? { marginRight: 0 } : {}]}>
              <Text style={s.ubinLabel}>{u.label}</Text>
              <Text style={[s.ubinNilai, { color: u.aksen }]}>{u.nilai}</Text>
            </View>
          ))}
        </View>

        {/* Peta Semarang & Temuan Utama */}
        <View style={[s.baris, s.bagian]}>
          <View style={{ width: 230, marginRight: 15 }}>
            <Text style={s.h2}>Peta Risiko Wilayah · Kota Semarang</Text>
            <PetaSemarang peta={d.peta.semarang} lebar={230} />
            <Text style={[s.sub, { fontSize: 6.5, marginTop: 2 }]}>
              Warna kecamatan mencerminkan tingkat risiko SPPG tertinggi di kecamatan tersebut.
            </Text>
          </View>
          <View style={s.kartuTemuan}>
            <Text style={[s.h2, { marginBottom: 6, color: W.utamaGelap }]}>Ringkasan Eksekutif & Temuan Kunci</Text>
            {temuan.map((t, i) => (
              <View key={i} style={s.poin}>
                <View style={s.poinNomor}>
                  <Text style={s.poinNomorTeks}>{i + 1}</Text>
                </View>
                <Text style={{ flex: 1, fontSize: 7.5, lineHeight: 1.35, color: W.tinta }}>{t}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tabel Prioritas Inspeksi */}
        <View style={s.bagian}>
          <Text style={s.h2}>Prioritas Inspeksi Dapur SPPG · 7 Teratas</Text>
          <Tabel
            kolom={["#", "Dapur SPPG", "Kecamatan", "Indeks Risiko", "Tren 7H", "Faktor Utama Risiko"]}
            lebar={[22, 150, 85, 75, 45, 146]}
            baris={d.indeks.slice(0, 7).map((i, k) => [
              String(k + 1),
              singkat(i.nama),
              i.kecamatan,
              <Badge key="b" skor={i.indeks} />,
              i.selisih7Hari == null ? "–" : Math.abs(i.selisih7Hari) < 1 ? "=" : `${i.selisih7Hari > 0 ? "+" : "−"}${angkaId(Math.abs(i.selisih7Hari))}`,
              i.alasan.map((a) => a.singkat).join(" · "),
            ])}
          />
        </View>

        {/* Catatan Kaki Metodologi */}
        <View style={[s.bagian, { borderTopWidth: 0.6, borderTopColor: W.garis, paddingTop: 6 }]} wrap={false}>
          <Text style={[s.h2, { fontSize: 8.5, marginBottom: 2 }]}>Metodologi dan Sumber Data Terbuka</Text>
          <Text style={[s.sub, { fontSize: 7, lineHeight: 1.3 }]}>
            Indeks Risiko SPPG = 0,35·Laporan + 0,25·Keracunan + 0,15·SLHS + 0,15·Keterlambatan + 0,10·(100 − Kepuasan),
            dihitung dari laporan terverifikasi 30 hari terakhir dinormalkan per 1.000 porsi layanan.
            {" "}{SUMBER_BATAS}. Data terbuka berlisensi CC BY 4.0.
          </Text>
          <Link src={`${d.asal}/insight`} style={{ fontSize: 7.5, fontWeight: 700, color: W.utama, marginTop: 2 }}>{`${d.asal}/insight`}</Link>
        </View>
      </Page>

      {/* ================= HALAMAN 2 ================= */}
      <Page size="A4" style={s.halaman}>
        <Kaki dibuat={d.dibuat} />

        {/* Running Header Halaman 2 */}
        <View style={s.kepalaHalaman2}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 9.5, fontWeight: 800, color: W.utama }}>PMBGM</Text>
            <Text style={{ fontSize: 8, color: W.sangatRedup, marginHorizontal: 4 }}>·</Text>
            <Text style={{ fontSize: 8.5, fontWeight: 700, color: W.tintaTebal }}>Sebaran Regional & Akuntabilitas SLA</Text>
          </View>
          <Text style={s.sub}>Provinsi Jawa Tengah & Kota Semarang</Text>
        </View>

        {/* Peta Jawa Tengah & Top 6 Kab/Kota */}
        <View style={s.baris}>
          <View style={{ width: 290, marginRight: 15 }}>
            <Text style={s.h2}>Sebaran Kasus Jawa Tengah · per 100 rb Penerima</Text>
            <PetaJateng peta={d.peta.jateng} lebar={290} />
          </View>
          <View style={{ flex: 1, backgroundColor: W.latar, borderWidth: 0.8, borderColor: W.garis, borderRadius: 7, padding: 8 }}>
            <Text style={[s.h2, { marginBottom: 3, color: W.utamaGelap }]}>Top 6 Kab/Kota Kasus Tertinggi</Text>
            <Text style={[s.sub, { fontSize: 6.5, marginBottom: 5 }]}>Rasio insiden per 100.000 penerima dalam 3 bulan terakhir</Text>
            {kabTertinggi.slice(0, 6).map((k, i) => (
              <View key={k.id} style={[s.baris, s.trGaris, { paddingVertical: 2.5, alignItems: "center" }]}>
                <Text style={{ width: 14, color: W.redup, fontSize: 7, fontWeight: 700 }}>{i + 1}</Text>
                <Text style={{ flex: 1, fontSize: 7.5, fontWeight: 600 }}>{singkat(k.nama)}</Text>
                <Text style={{ fontWeight: 800, fontSize: 8, color: W.daruratTeks }}>
                  {k.kasusPer100rb == null ? "–" : k.kasusPer100rb.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tabel Peringatan Dini */}
        <View style={s.bagian}>
          <Text style={s.h2}>Deteksi Dini Lonjakan Keluhan (Cegah KLB) · 90 Hari</Text>
          <Text style={[s.sub, { marginBottom: 4 }]}>
            Ambang batas anomali: laporan terverifikasi 24 jam &gt; 3× rata-rata harian 30 hari (minimal 3 laporan).
            {d.ditinjau ? ` ${d.ditinjau} sinyal dari laporan belum terverifikasi sedang ditinjau dan tidak diumumkan.` : ""}
          </Text>
          {d.peringatan.length ? (
            <Tabel
              kolom={["Dapur SPPG", "Kecamatan", "Status", "Waktu Terdeteksi", "24 Jam", "Rata-Rata/Hari", "Rasio Lonjakan"]}
              lebar={[120, 85, 48, 105, 45, 65, 55]}
              baris={d.peringatan.map((p) => [
                singkat(p.sppg),
                p.kecamatan,
                <Text key="st" style={{ fontSize: 7, fontWeight: 700, color: p.aktif ? W.daruratTeks : W.rendahTeks }}>
                  {p.aktif ? "Aktif" : "Selesai"}
                </Text>,
                tglJam(p.dibuatPada),
                angkaId(p.jumlah24Jam),
                angkaId(p.rataHarian, 1),
                `×${angkaId(p.rasio, 1)}`,
              ])}
            />
          ) : <Text style={s.sub}>Tidak ada lonjakan anomali dalam 90 hari terakhir.</Text>}
        </View>

        {/* Tabel Akuntabilitas per Kecamatan */}
        <View style={s.bagian}>
          <Text style={s.h2}>Akuntabilitas Kinerja & Penegakan SLA per Kecamatan · Kota Semarang</Text>
          <Tabel
            kolom={["Kecamatan", "Total Kasus", "Tingkat Selesai", "Rata Waktu Tanggap", "Lewat Batas SLA", "Kepuasan"]}
            lebar={[140, 65, 75, 88, 85, 70]}
            baris={d.kecamatan.filter((k) => (k.jumlah_kasus ?? 0) > 0).map((k) => [
              k.nama ?? "",
              angkaId(k.jumlah_kasus),
              persen(k.persen_selesai),
              durasiJam(k.rata_jam_respons),
              persen(k.persen_terlambat),
              k.kepuasan == null ? "–" : `${angkaId(k.kepuasan, 1)}/5`,
            ])}
          />
        </View>
      </Page>
    </Document>
  );
}
