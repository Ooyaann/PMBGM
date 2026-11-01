import "server-only";
import { kirimEmail } from "@/lib/email";
import { buatKlienAdmin } from "@/lib/supabase/admin";

const SITUS = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const lolos = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

function isiEmail(judul: string, isi: string | null, kode: string | null) {
  const tautan = kode ? `${SITUS}/lacak?tiket=${encodeURIComponent(kode)}` : `${SITUS}/akun`;
  const teks = [judul, isi ?? "", kode ? `Kode tiket: ${kode}` : "", `Lihat perkembangan: ${tautan}`, "",
    "Email ini dikirim otomatis oleh PMBGM. Identitas Anda tidak dibagikan kepada instansi."].filter(Boolean).join("\n");
  const html = `<!doctype html><html lang="id"><body style="margin:0;background:#f6f5f1;font-family:Arial,sans-serif;color:#1f1e1b">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;border:1px solid #e4e2db">
<tr><td style="padding:24px">
<p style="margin:0 0 16px;font-weight:800;font-size:18px;color:#0d9488">PMBGM</p>
<p style="margin:0 0 8px;font-weight:700;font-size:16px">${lolos(judul)}</p>
${isi ? `<p style="margin:0 0 16px;font-size:14px;line-height:1.5;color:#4a4943">${lolos(isi)}</p>` : ""}
${kode ? `<p style="margin:0 0 16px;font-size:13px;color:#6b6a63">Kode tiket <strong style="font-family:monospace;color:#1f1e1b">${lolos(kode)}</strong></p>` : ""}
<a href="${tautan}" style="display:inline-block;background:#0d9488;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:10px 18px;border-radius:10px">Lihat perkembangan</a>
<p style="margin:24px 0 0;font-size:12px;color:#8a8982">Email otomatis. Identitas Anda tidak dibagikan kepada instansi.</p>
</td></tr></table></td></tr></table></body></html>`;
  return { teks, html };
}

/**
 * Kirim email untuk notifikasi baru (LC-10). Baris diklaim dulu dengan menandai
 * email_terkirim_pada dalam satu UPDATE, jadi pemanggilan bersamaan tidak mengirim dua kali.
 * Hanya notifikasi 1 jam terakhir: riwayat dari data seed tidak ikut terkirim.
 * Notifikasi di aplikasi tetap menjadi sumber utama bila email gagal.
 */
export async function kirimNotifikasiTertunda(batas = 50): Promise<number> {
  const admin = buatKlienAdmin();
  if (!admin) return 0;
  const sejak = new Date(Date.now() - 3_600_000).toISOString();
  const { data: antre } = await admin
    .from("notifikasi")
    .select("id")
    .is("email_terkirim_pada", null)
    .gte("dibuat_pada", sejak)
    .order("dibuat_pada")
    .limit(batas);
  if (!antre?.length) return 0;

  const { data: klaim } = await admin
    .from("notifikasi")
    .update({ email_terkirim_pada: new Date().toISOString() })
    .in("id", antre.map((a) => a.id))
    .is("email_terkirim_pada", null)
    .select("id, pengguna_id, judul, isi, laporan:laporan_id (kode_tiket)");

  const daftar = klaim ?? [];
  if (!daftar.length) return 0;

  const penggunaUnik = [...new Set(daftar.map((n) => n.pengguna_id))];
  const email = new Map<string, string | null>();
  await Promise.all(
    penggunaUnik.map(async (uid) => {
      const { data } = await admin.auth.admin.getUserById(uid);
      email.set(uid, data.user?.email ?? null);
    })
  );

  let terkirim = 0;
  const UKURAN_BATCH = 10;
  for (let i = 0; i < daftar.length; i += UKURAN_BATCH) {
    const batch = daftar.slice(i, i + UKURAN_BATCH);
    const hasilBatch = await Promise.allSettled(
      batch.map(async (n) => {
        const ke = email.get(n.pengguna_id);
        if (!ke) return false;
        const { teks, html } = isiEmail(n.judul, n.isi, n.laporan?.kode_tiket ?? null);
        return kirimEmail({ ke, subjek: `PMBGM · ${n.judul}`, teks, html });
      })
    );
    for (const h of hasilBatch) {
      if (h.status === "fulfilled" && h.value) terkirim++;
    }
  }
  return terkirim;
}
