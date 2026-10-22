import "server-only";

export interface Email {
  ke: string;
  subjek: string;
  teks: string;
  html: string;
}

const PENGIRIM = process.env.EMAIL_PENGIRIM ?? "PantauGizi <notifikasi@pantaugizi.test>";

function pisahPengirim(s: string) {
  const m = s.match(/^(.*)<(.+)>$/);
  return m ? { Name: m[1].trim(), Email: m[2].trim() } : { Name: "PantauGizi", Email: s.trim() };
}

/**
 * Kirim satu email lewat HTTP API, tanpa dependensi SMTP:
 * - RESEND_API_KEY terisi → Resend (produksi);
 * - selain itu, MAILPIT_URL atau Mailpit bawaan Supabase lokal saat pengembangan.
 * Mengembalikan false bila tidak ada saluran atau pengiriman gagal.
 */
export async function kirimEmail(e: Email): Promise<boolean> {
  try {
    if (process.env.RESEND_API_KEY) {
      // Domain .test tidak bisa menerima email sungguhan.
      if (e.ke.endsWith(".test")) return false;
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: PENGIRIM, to: [e.ke], subject: e.subjek, text: e.teks, html: e.html }),
      });
      return r.ok;
    }
    const mailpit = process.env.MAILPIT_URL ?? (process.env.NODE_ENV === "development" ? "http://127.0.0.1:54324" : null);
    if (!mailpit) return false;
    const r = await fetch(`${mailpit}/api/v1/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ From: pisahPengirim(PENGIRIM), To: [{ Email: e.ke }], Subject: e.subjek, Text: e.teks, HTML: e.html }),
    });
    return r.ok;
  } catch {
    return false;
  }
}
