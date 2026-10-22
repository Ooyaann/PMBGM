import "server-only";
import path from "node:path";
import { Circle, Document, Font, Link, Page, Path, StyleSheet, Svg, Text, View } from "@react-pdf/renderer";
import type { Peringatan, DataPeta, SppgIndeks } from "@/lib/data/insight";
import type { StatistikPublik } from "@/lib/data/publik";
import { SUMBER_BATAS } from "@/lib/geo/peta";
import { durasiJam, persen } from "@/lib/format";
import { kategoriRisiko, RISIKO, type KategoriRisiko } from "@/lib/label";
import { ambangKuantil, ISI_KOSONG, ISI_RISIKO, kelasNilai, langkahRamp, RAMP_SEQ, TITIK_RISIKO } from "@/lib/peta-skala";

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
  tinta: "#1f1e1b",
  redup: "#6b6a63",
  garis: "#e4e2db",
  latar: "#f6f5f1",
  utama: "#0f6b57",
  utamaLembut: "#e3f1ec",
  darurat: "#b8261c",
};

const s = StyleSheet.create({
  halaman: { fontFamily: "Jakarta", fontSize: 8.5, color: W.tinta, paddingTop: 34, paddingBottom: 48, paddingHorizontal: 36, lineHeight: 1.35 },
  kepala: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", borderBottomWidth: 1.5, borderBottomColor: W.utama, paddingBottom: 8 },
  merek: { fontSize: 16, fontWeight: 800, color: W.utama, lineHeight: 1.2, marginBottom: 2 },
  judul: { fontSize: 12, fontWeight: 700, textAlign: "right", lineHeight: 1.2, marginBottom: 2 },
  sub: { color: W.redup, fontSize: 8 },
  chip: { marginTop: 8, alignSelf: "flex-start", backgroundColor: W.latar, borderRadius: 8, paddingVertical: 2.5, paddingHorizontal: 7, fontSize: 7.5, color: W.redup },
  bagian: { marginTop: 14 },
  h2: { fontSize: 10.5, fontWeight: 700, marginBottom: 6 },
  baris: { flexDirection: "row" },
  ubin: { flex: 1, borderWidth: 1, borderColor: W.garis, borderRadius: 8, padding: 7, marginRight: 6 },
  ubinNilai: { fontSize: 15, fontWeight: 800, marginTop: 1 },
  ubinLabel: { fontSize: 7, color: W.redup },
  th: { fontSize: 7, color: W.redup, fontWeight: 600, paddingVertical: 4, paddingHorizontal: 3 },
  td: { fontSize: 8, paddingVertical: 3, paddingHorizontal: 3 },
  trGaris: { borderBottomWidth: 0.5, borderBottomColor: W.garis },
  legenda: { flexDirection: "row", flexWrap: "wrap", marginTop: 5 },
  legendaButir: { flexDirection: "row", alignItems: "center", marginRight: 8, marginBottom: 2 },
  kotak: { width: 8, height: 6, borderRadius: 1.5, marginRight: 3 },
  poin: { flexDirection: "row", marginBottom: 4 },
  // `bottom` pada elemen absolut tidak dihormati react-pdf 4.9, jadi kaki diletakkan dengan `top` (A4 = 842 pt).
  kaki: { position: "absolute", top: 806, left: 36, right: 36, flexDirection: "row", justifyContent: "space-between", fontSize: 7, color: W.redup, borderTopWidth: 0.5, borderTopColor: W.garis, paddingTop: 6 },
  badge: { borderRadius: 6, paddingVertical: 1, paddingHorizontal: 4, fontSize: 7.5, fontWeight: 700, alignSelf: "flex-start" },
});

const WARNA_BADGE: Record<KategoriRisiko, { bg: string; fg: string }> = {
  rendah: { bg: "#e2f3e7", fg: TITIK_RISIKO.rendah.hex },
  sedang: { bg: "#fcf0d2", fg: TITIK_RISIKO.sedang.hex },
  tinggi: { bg: "#fbe5e1", fg: TITIK_RISIKO.tinggi.hex },
};

const angkaId = (v: number | null | undefined, d = 0) => (v == null ? "–" : v.toLocaleString("id-ID", { maximumFractionDigits: d }));
const singkat = (nama: string) => nama.replace("SPPG Contoh ", "SPPG ").replace(/^Kabupaten /, "Kab. ");
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
    <View>
      <View style={[s.baris, { backgroundColor: W.latar, borderRadius: 4 }]}>
        {kolom.map((k, i) => <Text key={k} style={[s.th, gaya(i)]}>{k}</Text>)}
      </View>
      {baris.map((b, j) => (
        <View key={j} style={[s.baris, s.trGaris, { alignItems: "center" }]} wrap={false}>
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
      <Text>PantauGizi · Laporan ringkas Insight · {tglJam(dibuat)} WIB</Text>
      <Text render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`} />
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
      : "Tidak ada SPPG berisiko tinggi saat ini.",
    kecTertinggi?.tertinggi != null ? `Kecamatan dengan risiko SPPG tertinggi: ${kecTertinggi.nama} (${angkaId(kecTertinggi.tertinggi)}).` : null,
    st ? `${angkaId(st.kasus_tidak_ditanggapi)} kasus belum ditanggapi instansi melewati batas waktu.` : null,
    aktif.length ? `${aktif.length} peringatan dini aktif dari laporan terverifikasi.` : `Tidak ada peringatan dini aktif${d.ditinjau ? `; ${d.ditinjau} sinyal sedang diverifikasi` : ""}.`,
    responsif ? `Paling responsif: Kecamatan ${responsif.nama}, ${persen(responsif.persen_terlambat)} kasus lewat batas waktu.` : null,
  ].filter((x): x is string => !!x);


  return (
    <Document title="Laporan Ringkas Insight · PantauGizi" author="PantauGizi" subject="Pengawasan partisipatif Makan Bergizi Gratis" language="id">
      <Page size="A4" style={s.halaman}>
        <Kaki dibuat={d.dibuat} />
        <View style={s.kepala}>
          <View>
            <Text style={s.merek}>PantauGizi</Text>
            <Text style={s.sub}>Pengawasan partisipatif Makan Bergizi Gratis · Jawa Tengah</Text>
          </View>
          <View>
            <Text style={s.judul}>Laporan Ringkas Insight</Text>
            <Text style={[s.sub, { textAlign: "right" }]}>Per {tglJam(d.dibuat)} WIB</Text>
          </View>
        </View>
        <Text style={s.chip}>Prototipe · seluruh angka adalah data simulasi untuk demonstrasi</Text>

        <View style={[s.baris, s.bagian]}>
          {[
            { label: "Laporan terverifikasi", nilai: angkaId(st?.laporan_terverifikasi) },
            { label: "Kasus selesai", nilai: st ? `${angkaId(st.kasus_selesai)}/${angkaId(st.kasus_total)}` : "–" },
            { label: "Rata-rata waktu tanggap", nilai: durasiJam(st?.rata_jam_respons) },
            { label: "SPPG risiko tinggi", nilai: angkaId(tinggi.length) },
            { label: "Peringatan aktif", nilai: angkaId(aktif.length) },
          ].map((u, i, a) => (
            <View key={u.label} style={[s.ubin, i === a.length - 1 ? { marginRight: 0 } : {}]}>
              <Text style={s.ubinLabel}>{u.label}</Text>
              <Text style={s.ubinNilai}>{u.nilai}</Text>
            </View>
          ))}
        </View>

        <View style={[s.baris, s.bagian]}>
          <View style={{ width: 240, marginRight: 18 }}>
            <Text style={s.h2}>Peta risiko · Kota Semarang</Text>
            <PetaSemarang peta={d.peta.semarang} lebar={240} />
            <Text style={[s.sub, { fontSize: 6.5, marginTop: 2 }]}>Warna kecamatan = skor SPPG tertinggi di kecamatan itu.</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.h2}>Temuan utama</Text>
            {temuan.map((t, i) => (
              <View key={i} style={s.poin}>
                <Text style={{ width: 12, color: W.utama, fontWeight: 800 }}>{i + 1}</Text>
                <Text style={{ flex: 1 }}>{t}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={s.bagian}>
          <Text style={s.h2}>Prioritas inspeksi · 10 teratas</Text>
          <Tabel
            kolom={["#", "SPPG", "Kecamatan", "Indeks", "7 hari", "Alasan"]}
            lebar={[16, 120, 80, 72, 34]}
            baris={d.indeks.slice(0, 10).map((i, k) => [
              String(k + 1),
              singkat(i.nama),
              i.kecamatan,
              <Badge key="b" skor={i.indeks} />,
              i.selisih7Hari == null ? "–" : Math.abs(i.selisih7Hari) < 1 ? "=" : `${i.selisih7Hari > 0 ? "+" : "−"}${angkaId(Math.abs(i.selisih7Hari))}`,
              i.alasan.map((a) => a.singkat).join(" · "),
            ])}
          />
        </View>
        <View style={[s.bagian, { borderTopWidth: 0.5, borderTopColor: W.garis, paddingTop: 8 }]} wrap={false}>
          <Text style={[s.h2, { fontSize: 9 }]}>Metodologi dan sumber</Text>
          <Text style={s.sub}>
            Indeks Risiko SPPG = 0,35·Laporan + 0,25·Keracunan + 0,15·SLHS + 0,15·Keterlambatan + 0,10·(100 − Kepuasan),
            dihitung dari laporan terverifikasi 30 hari terakhir; laporan dan keracunan per 1.000 porsi, dinormalkan antar-SPPG.
            Lapisan kab/kota (agregat) dan kecamatan (laporan warga) bersumber berbeda dan tidak dicampur.
            {" "}{SUMBER_BATAS}. Data terbuka berlisensi CC BY 4.0.
          </Text>
          <Link src={`${d.asal}/insight`} style={{ fontSize: 7.5, color: W.utama, marginTop: 3 }}>{`${d.asal}/insight`}</Link>
        </View>
      </Page>

      <Page size="A4" style={s.halaman}>
        <Kaki dibuat={d.dibuat} />
        <View style={s.baris}>
          <View style={{ width: 300, marginRight: 18 }}>
            <Text style={s.h2}>Jawa Tengah · keracunan per 100 rb penerima (3 bulan)</Text>
            <PetaJateng peta={d.peta.jateng} lebar={300} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.h2}>Tertinggi</Text>
            {kabTertinggi.slice(0, 6).map((k, i) => (
              <View key={k.id} style={[s.baris, s.trGaris, { paddingVertical: 3 }]}>
                <Text style={{ width: 12, color: W.redup }}>{i + 1}</Text>
                <Text style={{ flex: 1 }}>{singkat(k.nama)}</Text>
                <Text style={{ fontWeight: 700 }}>{k.kasusPer100rb == null ? "–" : k.kasusPer100rb.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={s.bagian}>
          <Text style={s.h2}>Peringatan dini · 90 hari</Text>
          <Text style={[s.sub, { marginBottom: 5 }]}>
            Lonjakan: laporan terverifikasi 24 jam &gt; 3× rata-rata harian 30 hari, minimal 3 laporan.
            {d.ditinjau ? ` ${d.ditinjau} sinyal dari laporan belum terverifikasi sedang ditinjau dan tidak diumumkan.` : ""}
          </Text>
          {d.peringatan.length ? (
            <Tabel
              kolom={["SPPG", "Kecamatan", "Status", "Waktu", "24 jam", "Rata-rata/hari", "Rasio"]}
              lebar={[110, 80, 50, 100, 45, 60]}
              baris={d.peringatan.map((p) => [
                singkat(p.sppg), p.kecamatan, p.aktif ? "Aktif" : "Selesai", tglJam(p.dibuatPada),
                angkaId(p.jumlah24Jam), angkaId(p.rataHarian, 1), `×${angkaId(p.rasio, 1)}`,
              ])}
            />
          ) : <Text style={s.sub}>Tidak ada lonjakan dalam 90 hari.</Text>}
        </View>

        <View style={s.bagian}>
          <Text style={s.h2}>Akuntabilitas per kecamatan · Kota Semarang</Text>
          <Tabel
            kolom={["Kecamatan", "Kasus", "Selesai", "Waktu tanggap", "Lewat batas", "Kepuasan"]}
            lebar={[120, 60, 70, 90, 80]}
            baris={d.kecamatan.filter((k) => (k.jumlah_kasus ?? 0) > 0).map((k) => [
              k.nama ?? "", angkaId(k.jumlah_kasus), persen(k.persen_selesai), durasiJam(k.rata_jam_respons),
              persen(k.persen_terlambat), k.kepuasan == null ? "–" : `${angkaId(k.kepuasan, 1)}/5`,
            ])}
          />
        </View>

      </Page>
    </Document>
  );
}
