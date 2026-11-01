"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff, Loader2, Lock, LogIn, Mail, TriangleAlert, UserPlus, UserRound, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { daftarAkun, masukKataSandi } from "@/lib/aksi/auth";

export function MasukPassword({
  onBerhasil,
  modeAwal,
  modeTetap,
  onBeralihKeDemo,
}: {
  onBerhasil: () => void;
  modeAwal?: "masuk" | "daftar";
  modeTetap?: "masuk" | "daftar";
  onBeralihKeDemo?: () => void;
}) {
  const [modeInternal, setModeInternal] = useState<"masuk" | "daftar">(modeTetap ?? modeAwal ?? "masuk");
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
      className="space-y-4 pt-1"
      onSubmit={(e) => {
        e.preventDefault();
        kirim();
      }}
    >
      {mode === "daftar" && (
        <div className="space-y-1.5">
          <label htmlFor="input-nama" className="block text-xs font-semibold text-foreground">
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
              placeholder="Contoh: Rina Suryani"
              autoComplete="name"
              className="h-11 w-full rounded-2xl border border-input bg-muted/40 pl-10 pr-3.5 text-sm placeholder:text-muted-foreground/60 focus-visible:bg-background focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 focus-visible:outline-none transition"
            />
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="input-email" className="block text-xs font-semibold text-foreground">
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
            className="h-11 w-full rounded-2xl border border-input bg-muted/40 pl-10 pr-3.5 text-sm placeholder:text-muted-foreground/60 focus-visible:bg-background focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 focus-visible:outline-none transition"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="input-sandi" className="block text-xs font-semibold text-foreground">
            Kata Sandi
          </label>
          {mode === "masuk" && (
            <button
              type="button"
              onClick={() => toast.info("Gunakan opsi 'Simulasi Peran' untuk pengujian tanpa password.")}
              className="text-xs text-primary font-medium hover:underline cursor-pointer"
            >
              Lupa sandi?
            </button>
          )}
        </div>
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
            className="h-11 w-full rounded-2xl border border-input bg-muted/40 pl-10 pr-11 text-sm placeholder:text-muted-foreground/60 focus-visible:bg-background focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 focus-visible:outline-none transition"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setTampilPassword((v) => !v)}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label={tampilPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          >
            {tampilPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {galat && (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-risiko-tinggi/30 bg-risiko-tinggi-lembut p-2.5 text-xs font-semibold text-risiko-tinggi">
          <TriangleAlert className="size-4 shrink-0 mt-0.5" aria-hidden />
          <span>{galat}</span>
        </div>
      )}

      {/* Tombol Masuk / Daftar Utama */}
      <Button
        type="submit"
        size="lg"
        className="w-full h-12 rounded-2xl font-bold mt-2 shadow-md shadow-primary/20 cursor-pointer transition-all active:scale-[0.99]"
        disabled={sibuk}
      >
        {sibuk ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
            Memproses...
          </>
        ) : mode === "daftar" ? (
          <>
            <UserPlus className="mr-2 size-4" aria-hidden />
            Daftar Akun Baru
            <ArrowRight className="ml-1.5 size-4" />
          </>
        ) : (
          <>
            <LogIn className="mr-2 size-4" aria-hidden />
            Masuk
            <ArrowRight className="ml-1.5 size-4" />
          </>
        )}
      </Button>

      {/* Switcher Bawah (Ala 'Operator? Masuk di sini' di referensi) */}
      {!modeTetap && (
        <div className="pt-2 text-center space-y-3">
          <p className="text-xs text-muted-foreground">
            {mode === "masuk" ? "Belum punya akun? " : "Sudah punya akun? "}
            <button
              type="button"
              onClick={() => {
                setModeInternal(mode === "masuk" ? "daftar" : "masuk");
                setGalat(null);
              }}
              className="text-primary font-bold hover:underline cursor-pointer"
            >
              {mode === "masuk" ? "Daftar di sini" : "Masuk di sini"}
            </button>
          </p>

          {onBeralihKeDemo && (
            <div className="pt-2 border-t border-border/50">
              <button
                type="button"
                onClick={onBeralihKeDemo}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <Sparkles className="size-3.5 text-primary" />
                Beralih ke Simulasi Peran (Tanpa Kata Sandi)
              </button>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
