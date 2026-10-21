"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { buatKlienServer } from "@/lib/supabase/server";

export type HasilAksi = { ok: true } | { ok: false; pesan: string };

const skemaEmail = z.email({ error: "Format email belum benar." }).trim().toLowerCase();
const skemaKode = z.string().regex(/^\d{6}$/, { error: "Kode terdiri dari 6 angka." });

/** Kirim kode 6 angka ke email. Akun pelapor dibuat otomatis bila belum ada (Keputusan K4). */
export async function kirimKodeMasuk(email: string): Promise<HasilAksi> {
  const hasil = skemaEmail.safeParse(email);
  if (!hasil.success) return { ok: false, pesan: hasil.error.issues[0].message };

  const supabase = await buatKlienServer();
  const { error } = await supabase.auth.signInWithOtp({
    email: hasil.data,
    options: { shouldCreateUser: true },
  });
  if (error) {
    return {
      ok: false,
      pesan: error.status === 429
        ? "Terlalu sering meminta kode. Tunggu sebentar lalu coba lagi."
        : "Kode belum bisa dikirim. Periksa alamat email Anda.",
    };
  }
  return { ok: true };
}

export async function verifikasiKode(email: string, kode: string): Promise<HasilAksi> {
  const e = skemaEmail.safeParse(email);
  const k = skemaKode.safeParse(kode);
  if (!e.success || !k.success) return { ok: false, pesan: "Email atau kode belum benar." };

  const supabase = await buatKlienServer();
  const { error } = await supabase.auth.verifyOtp({ email: e.data, token: k.data, type: "email" });
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
  if (process.env.NEXT_PUBLIC_MODE_DEMO !== "true" || !process.env.DEMO_PASSWORD) {
    return { ok: false, pesan: "Mode demo tidak aktif." };
  }
  if (!AKUN_DEMO.includes(kunci)) return { ok: false, pesan: "Akun demo tidak dikenal." };

  const supabase = await buatKlienServer();
  const { error } = await supabase.auth.signInWithPassword({
    email: `${kunci}@pantaugizi.test`,
    password: process.env.DEMO_PASSWORD,
  });
  if (error) return { ok: false, pesan: "Akun demo belum tersedia. Jalankan `npm run seed`." };
  return { ok: true };
}

export async function keluar() {
  const supabase = await buatKlienServer();
  await supabase.auth.signOut();
  redirect("/");
}
