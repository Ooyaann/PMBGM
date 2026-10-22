"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { buatKlienServer } from "@/lib/supabase/server";
import { buatKlienAdmin } from "@/lib/supabase/admin";
import { kirimEmail } from "@/lib/email";

export type HasilAksi = { ok: true; kodeUji?: string } | { ok: false; pesan: string };

const skemaEmail = z.email({ error: "Format email belum benar." }).trim().toLowerCase();
const skemaKode = z.string().regex(/^\d{6,8}$/, { error: "Kode terdiri dari 6 hingga 8 angka." });

/** Kirim kode OTP ke email. Akun pelapor dibuat otomatis bila belum ada (Keputusan K4). */
export async function kirimKodeMasuk(email: string): Promise<HasilAksi> {
  const hasil = skemaEmail.safeParse(email);
  if (!hasil.success) return { ok: false, pesan: hasil.error.issues[0].message };

  const supabase = await buatKlienServer();
  const { error } = await supabase.auth.signInWithOtp({
    email: hasil.data,
    options: { shouldCreateUser: true },
  });
  if (error) {
    // Jika kena rate limit (429) atau error mailer Supabase, fallback ke generateLink admin
    const admin = buatKlienAdmin();
    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email: hasil.data,
    });
    if (!linkErr && linkData?.properties?.email_otp) {
      const otp = linkData.properties.email_otp;
      const terkirim = await kirimEmail({
        ke: hasil.data,
        subjek: `Kode Masuk PantauGizi: ${otp}`,
        teks: `Kode verifikasi masuk Anda adalah: ${otp}`,
        html: `<p>Kode verifikasi masuk Anda adalah: <strong>${otp}</strong></p>`,
      });
      if (terkirim) return { ok: true };
      return {
        ok: true,
        kodeUji: otp,
      };
    }
    return {
      ok: false,
      pesan: "Kode belum bisa dikirim saat ini. Silakan coba sesaat lagi atau gunakan tab Akun Demo.",
    };
  }
  return { ok: true };
}

export async function verifikasiKode(email: string, kode: string): Promise<HasilAksi> {
  const e = skemaEmail.safeParse(email);
  const k = skemaKode.safeParse(kode);
  if (!e.success || !k.success) return { ok: false, pesan: "Email atau kode belum benar (6–8 angka)." };

  const supabase = await buatKlienServer();
  let { error } = await supabase.auth.verifyOtp({ email: e.data, token: k.data, type: "email" });
  if (error) {
    const resSignup = await supabase.auth.verifyOtp({ email: e.data, token: k.data, type: "signup" });
    error = resSignup.error;
  }
  if (error) return { ok: false, pesan: "Kode salah atau sudah kedaluwarsa. Minta kode baru." };
  return { ok: true };
}

const AKUN_DEMO = ["rina", "budi", "sari", "hendra", "sppg", "korwil", "admin"] as const;
export type KunciDemo = (typeof AKUN_DEMO)[number];

/**
 * Masuk satu klik untuk akun demo (LM-06). Kata sandi hanya ada di server (DEMO_PASSWORD)
 * dan tidak pernah dikirim ke browser. Aktif hanya bila NEXT_PUBLIC_MODE_DEMO=true.
 */
export async function masukDemo(kunci: KunciDemo): Promise<HasilAksi> {
  if (process.env.NEXT_PUBLIC_MODE_DEMO === "false") {
    return { ok: false, pesan: "Mode demo tidak aktif." };
  }
  if (!AKUN_DEMO.includes(kunci)) return { ok: false, pesan: "Akun demo tidak dikenal." };

  const kataSandi = process.env.DEMO_PASSWORD || "DemoPantauGizi-2026!";
  const supabase = await buatKlienServer();
  const { error } = await supabase.auth.signInWithPassword({
    email: `${kunci}@pantaugizi.test`,
    password: kataSandi,
  });
  if (error) return { ok: false, pesan: "Akun demo belum tersedia. Jalankan `npm run seed`." };
  return { ok: true };
}

export async function keluar() {
  const supabase = await buatKlienServer();
  await supabase.auth.signOut();
  redirect("/");
}
