"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff, Loader2, LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { daftarAkun, masukKataSandi } from "@/lib/aksi/auth";

/**
 * Form masuk / daftar dengan email + kata sandi.
 * Tidak bergantung pada pengiriman email Supabase, sehingga bebas dari rate-limit OTP.
 */
export function MasukPassword({ onBerhasil }: { onBerhasil: () => void }) {
  const [mode, setMode] = useState<"masuk" | "daftar">("masuk");
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
        toast.success(mode === "daftar" ? "Akun berhasil dibuat!" : "Berhasil masuk!");
        onBerhasil();
      } else {
        setGalat(hasil.pesan);
      }
    });

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        kirim();
      }}
    >
      {/* Toggle masuk / daftar yang rapi dan tidak bertumpuk */}
      <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-2">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => { setMode("masuk"); setGalat(null); }}
            className={`text-sm font-bold pb-2 -mb-2 border-b-2 transition-all outline-none ${
              mode === "masuk"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Masuk Akun
          </button>
          <button
            type="button"
            onClick={() => { setMode("daftar"); setGalat(null); }}
            className={`text-sm font-bold pb-2 -mb-2 border-b-2 transition-all outline-none ${
              mode === "daftar"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Daftar Akun Baru
          </button>
        </div>
        <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">
          {mode === "masuk" ? "Email & kata sandi" : "Warga / sekolah"}
        </span>
      </div>

      {mode === "daftar" && (
        <input
          type="text"
          required
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Nama lengkap"
          autoComplete="name"
          className="h-12 w-full rounded-xl border border-input bg-card px-3.5 text-base placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
        />
      )}

      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        autoComplete="email"
        inputMode="email"
        className="h-12 w-full rounded-xl border border-input bg-card px-3.5 text-base placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
      />

      <div className="relative">
        <input
          type={tampilPassword ? "text" : "password"}
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Kata sandi (min. 6 karakter)"
          autoComplete={mode === "daftar" ? "new-password" : "current-password"}
          className="h-12 w-full rounded-xl border border-input bg-card px-3.5 pr-12 text-base placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setTampilPassword((v) => !v)}
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1 text-muted-foreground hover:text-foreground"
          aria-label={tampilPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
        >
          {tampilPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>

      {galat && <p role="alert" className="text-sm text-destructive">{galat}</p>}

      <Button type="submit" size="xl" className="w-full" disabled={sibuk}>
        {sibuk ? (
          <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
        ) : mode === "daftar" ? (
          <UserPlus className="mr-2 size-4" aria-hidden />
        ) : (
          <LogIn className="mr-2 size-4" aria-hidden />
        )}
        {mode === "daftar" ? "Daftar & Masuk" : "Masuk"}
      </Button>
    </form>
  );
}
