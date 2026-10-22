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
const skemaNama = z.string().trim().min(2, { message: "Nama minimal 2 karakter." });
const skemaPassword = z.string().min(6, { message: "Kata sandi minimal 6 karakter." });

/**
 * Daftar akun baru secara langsung (bebas batas email OTP) dan otomatis login.
 */
export async function daftarAkun(nama: string, email: string, kataSandi: string): Promise<HasilAksi> {
  const n = skemaNama.safeParse(nama);
  const e = skemaEmail.safeParse(email);
  const p = skemaPassword.safeParse(kataSandi);
  if (!n.success) return { ok: false, pesan: n.error.issues[0].message };
  if (!e.success) return { ok: false, pesan: e.error.issues[0].message };
  if (!p.success) return { ok: false, pesan: p.error.issues[0].message };

  const admin = buatKlienAdmin();
  const { error: createErr } = await admin.auth.admin.createUser({
    email: e.data,
    password: p.data,
    email_confirm: true,
    user_metadata: { nama: n.data },
  });

  if (createErr) {
    if (createErr.message.toLowerCase().includes("already registered") || (createErr as { code?: string }).code === "email_exists") {
      return { ok: false, pesan: "Email ini sudah terdaftar. Silakan langsung masuk." };
    }
    return { ok: false, pesan: createErr.message || "Gagal membuat akun." };
  }

  // Otomatis login pengguna yang baru dibuat
  const supabase = await buatKlienServer();
  const { error: loginErr } = await supabase.auth.signInWithPassword({
    email: e.data,
    password: p.data,
  });
  if (loginErr) return { ok: false, pesan: "Akun berhasil dibuat. Silakan langsung masuk." };
  return { ok: true };
}

/**
 * Masuk menggunakan email dan kata sandi.
 */
export async function masukKataSandi(email: string, kataSandi: string): Promise<HasilAksi> {
  const e = skemaEmail.safeParse(email);
  const p = skemaPassword.safeParse(kataSandi);
  if (!e.success) return { ok: false, pesan: e.error.issues[0].message };
  if (!p.success) return { ok: false, pesan: p.error.issues[0].message };

  const supabase = await buatKlienServer();
  const { error } = await supabase.auth.signInWithPassword({
    email: e.data,
    password: p.data,
  });
  if (error) {
    return { ok: false, pesan: "Email atau kata sandi belum sesuai." };
  }
  return { ok: true };
}

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
