"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Loader2, Pencil, RotateCcw, Save, Star, X } from "lucide-react";
import { toast } from "sonner";
import { Waktu } from "@/components/data/waktu";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { beriRating, bukaUlangKasus, tandaiDibaca, ubahProfil } from "@/lib/aksi/akun";
import { cn } from "@/lib/utils";

const ARTI_BINTANG = ["", "Sangat buruk", "Buruk", "Cukup", "Baik", "Sangat baik"];

/** Rating 1–5 bintang (LC-09) dan buka ulang (≤ 14 hari) untuk kasus yang sudah selesai. */
export function AksiSelesai({ laporanId, rating, bisaBukaUlang }: {
  laporanId: string;
  rating: { skor: number; komentar: string | null } | null;
  bisaBukaUlang: boolean;
}) {
  const router = useRouter();
  const [sibuk, mulai] = useTransition();
  const [skor, setSkor] = useState(rating?.skor ?? 0);
  const [arah, setArah] = useState(0);
  const [komentar, setKomentar] = useState(rating?.komentar ?? "");
  const [ubah, setUbah] = useState(!rating);
  const [buka, setBuka] = useState(false);
  const [alasan, setAlasan] = useState("");

  if (buka) {
    return (
      <div className="space-y-2 rounded-2xl bg-risiko-sedang-lembut/60 p-3">
        <p className="text-sm font-semibold">Apa yang belum tuntas?</p>
        <Textarea value={alasan} onChange={(e) => setAlasan(e.target.value)} rows={3} maxLength={1000} aria-label="Alasan membuka ulang"
          placeholder="Mis. menu masih basi pada hari Senin setelah inspeksi" className="bg-card" />
        <div className="flex gap-2">
          <Button variant="ghost" size="lg" onClick={() => setBuka(false)} disabled={sibuk}>Batal</Button>
          <Button size="lg" disabled={sibuk || alasan.trim().length < 10} onClick={() => mulai(async () => {
            const r = await bukaUlangKasus({ laporanId, alasan });
            if (!r.ok) { toast.error(r.pesan); return; }
            toast.success("Kasus dibuka ulang dan kembali ke instansi");
            setBuka(false);
            router.refresh();
          })}>
            {sibuk ? <Loader2 className="animate-spin" aria-hidden /> : <RotateCcw aria-hidden />} Buka ulang
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {ubah ? (
        <div className="space-y-2 rounded-2xl bg-secondary/50 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold">Nilai penanganan</span>
            <div role="radiogroup" aria-label="Nilai 1 sampai 5 bintang" className="flex" onPointerLeave={() => setArah(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" role="radio" aria-checked={skor === n} aria-label={`${n} bintang, ${ARTI_BINTANG[n]}`}
                  onPointerEnter={() => setArah(n)} onClick={() => setSkor(n)}
                  className="flex size-9 items-center justify-center rounded-lg hover:bg-card/70">
                  <Star className={cn("size-6 transition", n <= (arah || skor) ? "fill-risiko-sedang text-risiko-sedang" : "text-muted-foreground/50")} aria-hidden />
                </button>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">{ARTI_BINTANG[arah || skor]}</span>
          </div>
          {skor > 0 && (
            <>
              <Textarea value={komentar} onChange={(e) => setKomentar(e.target.value)} rows={2} maxLength={500}
                placeholder="Komentar (opsional)" aria-label="Komentar penilaian" className="bg-card" />
              <Button size="lg" disabled={sibuk} onClick={() => mulai(async () => {
                const r = await beriRating({ laporanId, skor, komentar: komentar || undefined });
                if (!r.ok) { toast.error(r.pesan); return; }
                toast.success("Terima kasih, penilaian Anda tercatat");
                setUbah(false);
                router.refresh();
              })}>
                {sibuk ? <Loader2 className="animate-spin" aria-hidden /> : <Save aria-hidden />} Kirim nilai
              </Button>
            </>
          )}
        </div>
      ) : rating && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="flex" aria-label={`Nilai Anda ${rating.skor} dari 5`}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Star key={n} className={cn("size-4", n <= rating.skor ? "fill-risiko-sedang text-risiko-sedang" : "text-muted-foreground/40")} aria-hidden />
            ))}
          </span>
          {rating.komentar && <span className="text-muted-foreground">“{rating.komentar}”</span>}
          <button type="button" onClick={() => setUbah(true)} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            <Pencil className="size-3.5" aria-hidden /> Ubah
          </button>
        </div>
      )}
      {bisaBukaUlang && (
        <button type="button" onClick={() => setBuka(true)} className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
          <RotateCcw className="size-3.5" aria-hidden /> Belum tuntas? Buka ulang
        </button>
      )}
    </div>
  );
}

export interface ButirNotifikasi { id: number; judul: string; isi: string | null; dibaca: boolean; dibuatPada: string; kodeTiket: string | null }

export function DaftarNotifikasi({ daftar, belumDibaca }: { daftar: ButirNotifikasi[]; belumDibaca: number }) {
  const router = useRouter();
  const [sibuk, mulai] = useTransition();
  return (
    <section aria-labelledby="judul-notif" className="rounded-3xl border bg-card p-4 sm:p-5">
      <header className="mb-3 flex items-center justify-between gap-2">
        <h2 id="judul-notif" className="flex items-center gap-2 font-bold">
          <Bell className="size-4 text-primary" aria-hidden /> Notifikasi
          {belumDibaca > 0 && <span className="angka rounded-full bg-primary px-2 text-xs text-primary-foreground">{belumDibaca}</span>}
        </h2>
        {belumDibaca > 0 && (
          <button type="button" disabled={sibuk} onClick={() => mulai(async () => { await tandaiDibaca(); router.refresh(); })}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline disabled:opacity-50">
            <CheckCheck className="size-4" aria-hidden /> Tandai dibaca
          </button>
        )}
      </header>
      <ul className="space-y-1">
        {daftar.map((n) => (
          <li key={n.id}>
            <Link href={n.kodeTiket ? `/lacak?tiket=${n.kodeTiket}` : "/akun"}
              onClick={() => { if (!n.dibaca) void tandaiDibaca([n.id]); }}
              className={cn("flex gap-2.5 rounded-xl p-2.5 hover:bg-muted/60", !n.dibaca && "bg-secondary/40")}>
              <span aria-hidden className={cn("mt-1.5 size-2 shrink-0 rounded-full", n.dibaca ? "bg-transparent" : "bg-primary")} />
              <span className="min-w-0">
                <span className={cn("block text-sm", !n.dibaca && "font-semibold")}>{n.judul}</span>
                {n.isi && <span className="line-clamp-2 text-xs text-muted-foreground">{n.isi}</span>}
                <span className="text-[11px] text-muted-foreground">{n.kodeTiket && <span className="font-mono">{n.kodeTiket} · </span>}<Waktu iso={n.dibuatPada} /></span>
              </span>
            </Link>
          </li>
        ))}
        {!daftar.length && <li className="p-4 text-center text-sm text-muted-foreground">Belum ada notifikasi</li>}
      </ul>
    </section>
  );
}

const JENIS = [
  ["orang_tua", "Orang tua"], ["siswa", "Siswa"], ["guru", "Guru"], ["warga", "Warga"], ["sekolah", "Pihak sekolah"],
  ["komite_sekolah", "Komite sekolah"], ["kader_posyandu", "Kader posyandu"],
] as const;
type Jenis = (typeof JENIS)[number][0];

export function FormProfil({ nama, jenis }: { nama: string; jenis: Jenis | null }) {
  const router = useRouter();
  const [sibuk, mulai] = useTransition();
  const [buka, setBuka] = useState(false);
  const [n, setN] = useState(nama);
  const [j, setJ] = useState<Jenis | null>(jenis);
  if (!buka) {
    return (
      <Button variant="outline" size="lg" onClick={() => setBuka(true)}><Pencil aria-hidden /> Profil</Button>
    );
  }
  return (
    <div className="w-full space-y-3 rounded-2xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Profil</p>
        <button type="button" onClick={() => setBuka(false)} aria-label="Tutup" className="rounded-lg p-1 hover:bg-muted"><X className="size-4" aria-hidden /></button>
      </div>
      <label className="block space-y-1 text-sm">
        <span className="text-muted-foreground">Nama tampilan</span>
        <input value={n} onChange={(e) => setN(e.target.value)} maxLength={60}
          className="h-10 w-full rounded-xl border bg-background px-3 outline-none focus-visible:ring-3 focus-visible:ring-ring/50" />
      </label>
      <div role="radiogroup" aria-label="Saya melapor sebagai" className="flex flex-wrap gap-1.5">
        {JENIS.map(([k, l]) => (
          <button key={k} type="button" role="radio" aria-checked={j === k} onClick={() => setJ(k)}
            className={cn("rounded-full border px-3 py-1 text-xs transition hover:bg-muted", j === k && "border-primary bg-secondary font-semibold")}>
            {l}
          </button>
        ))}
      </div>
      <Button size="lg" disabled={sibuk} onClick={() => mulai(async () => {
        const r = await ubahProfil({ nama: n, jenis: j });
        if (!r.ok) { toast.error(r.pesan); return; }
        toast.success("Profil tersimpan");
        setBuka(false);
        router.refresh();
      })}>
        {sibuk ? <Loader2 className="animate-spin" aria-hidden /> : <Save aria-hidden />} Simpan
      </Button>
    </div>
  );
}
