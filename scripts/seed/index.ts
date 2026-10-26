/**
 * npm run seed — isi database dengan data simulasi PantauGizi.
 *
 * Variabel lingkungan:
 *   DATABASE_URL   koneksi Postgres (bawaan: Supabase lokal)
 *   DEMO_PASSWORD  kata sandi semua akun demo (wajib; contoh di .env.example)
 *   SEED_ACUAN     opsional, waktu acuan ISO 8601. Bawaan: sekarang. Jalankan seed ±1 jam
 *                  sebelum demo agar laporan skenario demo masih dalam jendela 24 jam.
 */
import postgres from "postgres";
import { buatDataSeed, type PenggunaGen } from "./generator";

const URL_LOKAL = "postgresql://postgres:postgres@127.0.0.1:54322/postgres";
const BATCH = 400;

type Sql = postgres.Sql | postgres.TransactionSql;

async function sisip(sql: Sql, tabel: string, baris: Record<string, unknown>[]) {
  for (let i = 0; i < baris.length; i += BATCH) {
    const potongan = baris.slice(i, i + BATCH);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await sql`insert into ${sql(tabel)} ${sql(potongan as any[])}`;
  }
}

async function buatAkun(sql: Sql, pengguna: PenggunaGen[], kataSandi: string) {
  const [{ hash }] = await sql<{ hash: string }[]>`
    select extensions.crypt(${kataSandi}, extensions.gen_salt('bf', 10)) as hash`;

  // Kolom token harus string kosong (bukan null) agar GoTrue bisa membaca akun.
  const kolom = await sql<{ column_name: string }[]>`
    select column_name from information_schema.columns
    where table_schema = 'auth' and table_name = 'users'`;
  const ada = new Set(kolom.map((k) => k.column_name));
  const kolomToken = [
    "confirmation_token", "recovery_token", "email_change_token_new", "email_change",
    "email_change_token_current", "phone_change", "phone_change_token", "reauthentication_token",
  ].filter((k) => ada.has(k));

  const sekarang = new Date().toISOString();
  const users = pengguna.map((p) => ({
    instance_id: "00000000-0000-0000-0000-000000000000",
    id: p.id,
    aud: "authenticated",
    role: "authenticated",
    email: p.email,
    encrypted_password: hash,
    email_confirmed_at: sekarang,
    raw_app_meta_data: { provider: "email", providers: ["email"] },
    raw_user_meta_data: { nama: p.nama },
    created_at: sekarang,
    updated_at: sekarang,
    ...Object.fromEntries(kolomToken.map((k) => [k, ""])),
  }));
  await sisip(sql, "auth.users", users);

  await sisip(sql, "auth.identities", pengguna.map((p) => ({
    id: p.id,
    user_id: p.id,
    provider_id: p.id,
    provider: "email",
    identity_data: { sub: p.id, email: p.email, email_verified: true },
    last_sign_in_at: sekarang,
    created_at: sekarang,
    updated_at: sekarang,
  })));

  // Profil dibuat trigger tangani_pengguna_baru(); lengkapi peran dan atributnya.
  await sql`
    update public.profil_pengguna p set
      nama_tampilan = x.nama,
      peran = x.peran::public.peran_pengguna,
      jenis_pelapor = x.jenis_pelapor::public.jenis_pelapor,
      terverifikasi = x.terverifikasi,
      instansi_id = x.instansi_id,
      sekolah_id = x.sekolah_id
    from json_to_recordset(${sql.json(pengguna.map((p) => ({
      id: p.id, nama: p.nama, peran: p.peran, jenis_pelapor: p.jenisPelapor,
      terverifikasi: p.terverifikasi, instansi_id: p.instansiId, sekolah_id: p.sekolahId,
    })))}::json) as x(id uuid, nama text, peran text, jenis_pelapor text, terverifikasi boolean,
                      instansi_id uuid, sekolah_id uuid)
    where p.id = x.id`;
}

async function main() {
  const url = process.env.DATABASE_URL ?? URL_LOKAL;
  const kataSandi = process.env.DEMO_PASSWORD;
  if (!kataSandi) {
    console.error("DEMO_PASSWORD belum diisi. Salin .env.example menjadi .env.local lalu isi nilainya.");
    process.exit(1);
  }
  const acuan = process.env.SEED_ACUAN ? Date.parse(process.env.SEED_ACUAN) : Date.now();
  if (Number.isNaN(acuan)) {
    console.error("SEED_ACUAN bukan tanggal ISO 8601 yang valid.");
    process.exit(1);
  }

  const mulai = performance.now();
  const data = buatDataSeed(acuan);
  const sql = postgres(url, { max: 1, onnotice: () => {}, prepare: false });

  try {
    await sql.begin(async (tx) => {
      console.log("• Mengosongkan data lama");
      await tx`
        truncate table
          public.status_log, public.notifikasi, public.rating, public.dukungan, public.bukti_metadata,
          public.bukti, public.laporan, public.kasus, public.peringatan_dini, public.profil_pengguna,
          public.anggaran_bulanan, public.ringkasan_kasus_bulanan, public.harga_pangan,
          public.sekolah, public.instansi, public.sppg, public.wilayah
        restart identity cascade`;
      await tx`delete from auth.users where email like '%@pantaugizi.test' or email like '%@pmbgm.test'`;
      // Akun non-seed yang sudah ada tetap punya profil.
      await tx`
        insert into public.profil_pengguna (id, nama_tampilan)
        select id, split_part(email, '@', 1) from auth.users
        on conflict (id) do nothing`;

      console.log("• Data inti: wilayah, SPPG, instansi, sekolah");
      await sisip(tx, "public.wilayah", data.wilayah);
      await sisip(tx, "public.sppg", data.sppg);
      await sisip(tx, "public.instansi", data.instansi);
      await sisip(tx, "public.sekolah", data.sekolah);

      console.log("• Data program: anggaran, ringkasan kasus, harga pangan");
      await sisip(tx, "public.anggaran_bulanan", data.anggaran);
      await sisip(tx, "public.ringkasan_kasus_bulanan", data.ringkasanKasus);
      await sisip(tx, "public.harga_pangan", data.hargaPangan);

      console.log(`• Akun: ${data.pengguna.length} (termasuk ${data.demo.akun.length} akun demo)`);
      await buatAkun(tx, data.pengguna, kataSandi);

      console.log(`• Laporan: ${data.laporan.length}`);
      const laporanUrut = [...data.laporan].sort((x, y) =>
        String(x.dibuat_pada).localeCompare(String(y.dibuat_pada)));
      // Disisipkan berurutan agar trigger mengelompokkan laporan serupa seperti di aplikasi.
      await sisip(tx, "public.laporan", laporanUrut);
      await sisip(tx, "public.bukti", data.bukti);
      await sisip(tx, "public.bukti_metadata", data.buktiMetadata);

      // Dukungan "Saya juga mengalami" dari pelapor lain, pada kepala kelompok serupa.
      const grup = new Map(
        (await tx<{ id: string; grup_serupa: string }[]>`select id, grup_serupa from public.laporan`)
          .map((r) => [r.id, r.grup_serupa]));
      const pelaporUmum = data.pengguna.filter((p) => p.peran === "pelapor" && !p.demo);
      const dukungan = new Map<string, { laporan_id: string; pengguna_id: string }>();
      data.dukunganPerLaporanPertama.forEach(({ laporanId, jumlah }, i) => {
        const kepala = grup.get(laporanId) ?? laporanId;
        for (let j = 0; j < jumlah; j++) {
          const p = pelaporUmum[(i * 37 + j * 11) % pelaporUmum.length];
          dukungan.set(`${kepala}|${p.id}`, { laporan_id: kepala, pengguna_id: p.id });
        }
      });
      await sisip(tx, "public.dukungan", [...dukungan.values()]);

      console.log(`• Kasus: ${data.kasus.length}`);
      await sisip(tx, "public.kasus", data.kasus);

      await tx`
        update public.laporan l set
          status = x.status::public.status_alur,
          kasus_id = x.kasus_id,
          alasan_tolak = x.alasan_tolak,
          terlambat = coalesce(x.terlambat, false),
          checklist_verifikasi = x.checklist_verifikasi,
          diverifikasi_oleh = x.diverifikasi_oleh,
          diverifikasi_pada = x.diverifikasi_pada
        from json_to_recordset(${tx.json(data.pembaruanLaporan as postgres.JSONValue)}::json) as x(
          id uuid, status text, kasus_id uuid, alasan_tolak text, terlambat boolean,
          checklist_verifikasi jsonb, diverifikasi_oleh uuid, diverifikasi_pada timestamptz)
        where l.id = x.id`;
      await tx`
        update public.bukti b set publik = true
        from public.laporan l
        where l.id = b.laporan_id and l.status = 'diverifikasi'`;

      console.log(`• Riwayat status: ${data.statusLog.length} peristiwa`);
      const logUrut = [...data.statusLog].sort((x, y) =>
        String(x.dibuat_pada).localeCompare(String(y.dibuat_pada)));
      await sisip(tx, "public.status_log", logUrut);
      await sisip(tx, "public.rating", data.rating);
      await sisip(tx, "public.peringatan_dini", data.peringatan);

      console.log("• Menghitung indeks risiko, prioritas, dan peringatan dini");
      await tx`select public.segarkan_indeks_risiko()`;
      await tx`select public.segarkan_kasus(id) from public.kasus`;
      await tx`select public.segarkan_skor_laporan(id) from public.laporan where status = 'diterima'`;
      await tx`select public.segarkan_indeks_risiko()`;
      await tx`select public.deteksi_lonjakan()`;
    });

    // Ringkasan
    const [ringkas] = await sql`select public.statistik_publik() as s`;
    const teratas = await sql<{ nama: string; indeks: number; kategori_risiko: string }[]>`
      select s.nama, i.indeks, i.kategori_risiko
      from public.indeks_risiko i join public.sppg s on s.id = i.sppg_id
      order by i.indeks desc limit 5`;
    const [demo] = await sql<{ indeks: number; kategori_risiko: string }[]>`
      select indeks, kategori_risiko from public.indeks_risiko where sppg_id = ${data.demo.sppgId}`;
    const [antrean] = await sql<{ n: number }[]>`
      select count(*)::int as n from public.laporan where status = 'diterima'`;

    console.log("\n✓ Seed selesai dalam", ((performance.now() - mulai) / 1000).toFixed(1), "detik");
    console.log("  Waktu acuan       :", new Date(data.acuan).toISOString());
    console.log("  Statistik publik  :", JSON.stringify(ringkas.s));
    console.log("  Antrean verifikasi:", antrean.n, "laporan");
    console.log("  SPPG risiko tertinggi:");
    for (const t of teratas) console.log(`    ${String(t.indeks).padStart(5)}  ${t.kategori_risiko.padEnd(7)} ${t.nama}`);
    console.log(`  SPPG demo         : ${data.demo.sppgNama} → indeks ${demo?.indeks} (${demo?.kategori_risiko})`);
    console.log(`  Sekolah demo      : ${data.demo.sekolahNama}`);
    console.log("  Akun demo (kata sandi = DEMO_PASSWORD):");
    for (const a of data.demo.akun) console.log(`    ${a.peran.padEnd(12)} ${a.email}`);
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error("\n✗ Seed gagal:", err.message ?? err);
  if (err.detail) console.error("  Detail:", err.detail);
  if (err.where) console.error("  Lokasi:", err.where);
  process.exit(1);
});
