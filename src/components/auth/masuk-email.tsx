"use client";

import { useState, useTransition } from "react";
import { ArrowLeft, Loader2, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { kirimKodeMasuk, verifikasiKode } from "@/lib/aksi/auth";

/**
 * Masuk tanpa kata sandi: email → kode 6 angka (Keputusan K4).
 * Akun pelapor dibuat otomatis saat pertama kali masuk.
 */
export function MasukEmail({ onBerhasil, labelTombol = "Kirim kode" }: { onBerhasil: () => void; labelTombol?: string }) {
  const [email, setEmail] = useState("");
  const [kode, setKode] = useState("");
  const [kodeUji, setKodeUji] = useState<string | null>(null);
  const [tahap, setTahap] = useState<"email" | "kode">("email");
  const [galat, setGalat] = useState<string | null>(null);
  const [sibuk, mulai] = useTransition();

  const minta = () =>
    mulai(async () => {
      setGalat(null);
      setKodeUji(null);
      const hasil = await kirimKodeMasuk(email);
      if (hasil.ok) {
        if (hasil.kodeUji) setKodeUji(hasil.kodeUji);
        setTahap("kode");
      } else setGalat(hasil.pesan);
    });

  const verifikasi = (nilai: string) =>
    mulai(async () => {
      setGalat(null);
      const hasil = await verifikasiKode(email, nilai);
      if (hasil.ok) onBerhasil();
      else {
        setGalat(hasil.pesan);
        setKode("");
      }
    });

  if (tahap === "email") {
    return (
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          minta();
        }}
      >
        <label htmlFor="email-masuk" className="sr-only">Alamat email</label>
        <input
          id="email-masuk"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@email.com"
          className="h-12 w-full rounded-xl border border-input bg-card px-3.5 text-base placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
        />
        {galat && <p role="alert" className="text-sm text-destructive">{galat}</p>}
        <Button type="submit" size="xl" className="w-full" disabled={sibuk}>
          {sibuk ? <Loader2 className="animate-spin" aria-hidden /> : <Mail aria-hidden />} {labelTombol}
        </Button>
        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3.5" aria-hidden /> Email tidak ditampilkan ke publik
        </p>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm">
        Kode dikirim ke <strong className="break-all">{email}</strong>
      </p>
      {kodeUji && (
        <div className="rounded-xl border border-primary/30 bg-secondary/50 p-3 text-xs space-y-1">
          <p className="font-semibold text-primary">Mode Pengujian (Bypass Limit Email Supabase):</p>
          <p className="text-muted-foreground">
            Gunakan kode verifikasi berikut: <strong className="font-mono text-sm font-bold text-foreground">{kodeUji}</strong>
          </p>
        </div>
      )}
      {process.env.NODE_ENV === "development" && (
        <p className="rounded-lg bg-info-lembut p-2.5 text-xs text-info">
          Lokal: kode ada di Mailpit{" "}
          <a href="http://127.0.0.1:54324" target="_blank" rel="noreferrer" className="font-semibold underline">127.0.0.1:54324</a>.
        </p>
      )}
      <InputOTP
        maxLength={6}
        value={kode}
        onChange={(v) => {
          setKode(v);
          if (v.length === 6) verifikasi(v);
        }}
        inputMode="numeric"
        autoFocus
        disabled={sibuk}
        aria-label="Kode masuk 6 angka"
      >
        <InputOTPGroup>
          {Array.from({ length: 6 }, (_, i) => (
            <InputOTPSlot key={i} index={i} className="size-12 text-lg" />
          ))}
        </InputOTPGroup>
      </InputOTP>
      {galat && <p role="alert" className="text-sm text-destructive">{galat}</p>}
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="ghost" size="lg" onClick={() => setTahap("email")} disabled={sibuk}>
          <ArrowLeft aria-hidden /> Ganti
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={minta} disabled={sibuk}>
          {sibuk && <Loader2 className="animate-spin" aria-hidden />} Kirim ulang
        </Button>
      </div>
    </div>
  );
}
