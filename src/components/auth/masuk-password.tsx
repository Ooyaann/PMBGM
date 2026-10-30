"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff, Loader2, Lock, LogIn, Mail, UserPlus, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { daftarAkun, masukKataSandi } from "@/lib/aksi/auth";

/**
 * Form masuk / daftar dengan email + kata sandi.
 * Bila `modeTetap` diberikan, kontrol tab internal disembunyikan agar tidak bertumpuk.
 */
export function MasukPassword({
  onBerhasil,
  modeTetap,
}: {
  onBerhasil: () => void;
  modeTetap?: "masuk" | "daftar";
}) {
  const [modeInternal, setModeInternal] = useState<"masuk" | "daftar">(modeTetap ?? "masuk");
  const mode = modeTetap ?? modeInternal;
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tampilPassword, setTampilPassword] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);
  const [sibuk, mulai] = useTransition();

  const kirim = () =>
    mulai(async () => {
      setGalat(null);
      const hasil =
        mode === "daftar"
          ? await daftarAkun(nama, email, password)
          : await masukKataSandi(email, password);
      if (hasil.ok) {
        toast.success(mode === "daftar" ? "Akun berhasil dibuat" : "Berhasil masuk");
        onBerhasil();
      } else {
        setGalat(hasil.pesan);
      }
    });

  return (
    <form
      className="space-y-3.5"
      onSubmit={(e) => {
        e.preventDefault();
        kirim();
      }}
    >
      {!modeTetap && (
        <div className="flex gap-1 rounded-xl bg-muted p-1">
          <button
            type="button"
            onClick={() => {
              setModeInternal("masuk");
              setGalat(null);
            }}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition cursor-pointer ${
              mode === "masuk"
                ? "bg-background text-foreground shadow-sm font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => {
              setModeInternal("daftar");
              setGalat(null);
            }}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition cursor-pointer ${
              mode === "daftar"
                ? "bg-background text-foreground shadow-sm font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Daftar Baru
          </button>
        </div>
      )}

      {mode === "daftar" && (
        <div className="space-y-1.5">
          <label htmlFor="input-nama" className="block text-xs font-bold text-foreground/85">
            Nama Lengkap
          </label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              id="input-nama"
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama lengkap Anda"
              autoComplete="name"
              className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-3.5 text-sm placeholder:text-muted-foreground/65 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 focus-visible:outline-none transition"
            />
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="input-email" className="block text-xs font-bold text-foreground/85">
          Alamat Email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            id="input-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            autoComplete="email"
            inputMode="email"
            className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-3.5 text-sm placeholder:text-muted-foreground/65 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 focus-visible:outline-none transition"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="input-sandi" className="block text-xs font-bold text-foreground/85">
          Kata Sandi
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            id="input-sandi"
            type={tampilPassword ? "text" : "password"}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            autoComplete={mode === "daftar" ? "new-password" : "current-password"}
            className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-11 text-sm placeholder:text-muted-foreground/65 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 focus-visible:outline-none transition"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setTampilPassword((v) => !v)}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1 text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label={tampilPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          >
            {tampilPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {galat && (
        <p role="alert" className="rounded-xl border border-risiko-tinggi/30 bg-risiko-tinggi-lembut px-3.5 py-2.5 text-xs font-semibold text-risiko-tinggi">
          {galat}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full h-11 rounded-xl font-bold mt-2 shadow-sm shadow-primary/15 cursor-pointer" disabled={sibuk}>
        {sibuk ? (
          <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
        ) : mode === "daftar" ? (
          <UserPlus className="mr-2 size-4" aria-hidden />
        ) : (
          <LogIn className="mr-2 size-4" aria-hidden />
        )}
        {mode === "daftar" ? "Buat Akun & Masuk" : "Masuk ke Akun"}
      </Button>
    </form>
  );
}
