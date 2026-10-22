"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { buatKlienServer } from "@/lib/supabase/server";
import { buatKlienAdmin } from "@/lib/supabase/admin";

export type HasilAksi = { ok: true } | { ok: false; pesan: string };

const skemaEmail = z.email({ error: "Format email belum benar." }).trim().toLowerCase();
const skemaNama = z.string().trim().min(2, { message: "Nama minimal 2 karakter." });
const skemaPassword = z.string().min(6, { message: "Kata sandi minimal 6 karakter." });

const AKUN_DEMO = ["rina", "budi", "sari", "hendra", "sppg", "korwil", "admin"] as const;
export type KunciDemo = (typeof AKUN_DEMO)[number];

/**
 * Daftar akun baru dengan email + kata sandi, lalu otomatis login.
 * Menggunakan admin API sehingga email langsung dikonfirmasi tanpa perlu verifikasi.
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

/**
 * Masuk satu klik untuk akun demo. Kata sandi hanya ada di server (DEMO_PASSWORD)
 * dan tidak pernah dikirim ke browser. Aktif hanya bila NEXT_PUBLIC_MODE_DEMO !== "false".
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
