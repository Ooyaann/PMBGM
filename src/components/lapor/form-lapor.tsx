"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ArrowRight, Camera, Check, Clock, EyeOff, FileText, Loader2, Lock, LocateFixed, RotateCcw, School, Send,
  Tag, Timer, UserRound, Users, X,
} from "lucide-react";
import { toast } from "sonner";
import { MasukPassword } from "@/components/auth/masuk-password";
import { Bertip } from "@/components/ui/bertip";
import { AlurStatus } from "@/components/data/alur-status";
import { IKON_KATEGORI } from "@/components/data/ikon-kategori";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { kirimLaporan } from "@/lib/aksi/laporan";
import type { BuktiSiap } from "@/lib/bukti";
import type { AturanSla } from "@/lib/data/publik";
import { batasJam } from "@/lib/format";
import { KATEGORI, KATEGORI_PENDEK, MODE_IDENTITAS, MODE_PENDEK, type Kategori, type ModeIdentitas } from "@/lib/label";
import { buatKlienBrowser } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { DAFTAR_KATEGORI, DAFTAR_MODE, skemaLaporan } from "@/lib/validasi/laporan";
import { CariSekolah, type SekolahPilihan } from "./cari-sekolah";
import { LaporanSerupa } from "./laporan-serupa";
import { PanelDarurat } from "./panel-darurat";
import { UnggahBukti } from "./unggah-bukti";

const IKON_MODE: Record<ModeIdentitas, typeof Lock> = { rahasia: Lock, publik: UserRound, anonim: EyeOff };
const LANGKAH = [
  { label: "Masalah", ikon: Tag },
  { label: "Sekolah", ikon: School },
  { label: "Cerita", ikon: FileText },
  { label: "Bukti", ikon: Camera },
  { label: "Kirim", ikon: Send },
] as const;

interface Draf {
  kategori: Kategori | null;
  sekolah: SekolahPilihan | null;
  waktu: string; // nilai input datetime-local (waktu perangkat)
  jumlah: string;
  deskripsi: string;
  lokasi: { lat: number; lng: number } | null;
  mode: ModeIdentitas;
}

const DRAF_KOSONG: Draf = { kategori: null, sekolah: null, waktu: "", jumlah: "", deskripsi: "", lokasi: null, mode: "rahasia" };
const KUNCI_DRAF = "pmbgm:draf-laporan:v1";

// Draf tersimpan di perangkat (LP-10). Dibaca lewat useSyncExternalStore agar aman saat hydration.
const tanpaLangganan = () => () => {};
function bacaDraf(): string | null {
  try {
    return localStorage.getItem(KUNCI_DRAF);
  } catch {
    return null;
  }
}
function simpanDraf(d: Draf | null) {
  try {
    if (d) localStorage.setItem(KUNCI_DRAF, JSON.stringify(d));
    else localStorage.removeItem(KUNCI_DRAF);
  } catch {
    // Penyimpanan diblokir (mode privat): form tetap berjalan tanpa draf.
  }
}
const adaIsi = (d: Draf) => Boolean(d.kategori || d.sekolah || d.deskripsi);

function waktuLokal(tanggal: Date) {
  const geser = new Date(tanggal.getTime() - tanggal.getTimezoneOffset() * 60_000);
  return geser.toISOString().slice(0, 16);
}

function amanIso(nilai: string): string {
  if (!nilai) return "";
  const t = new Date(nilai);
  return Number.isNaN(t.getTime()) ? "" : t.toISOString();
}

const kelasInput =
  "h-12 w-full rounded-xl border border-input bg-background px-3.5 text-base focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none aria-invalid:border-destructive";

export interface PenggunaLapor {
  id: string;
  nama: string;
}

function Galat({ pesan }: { pesan?: string }) {
  return pesan ? <p role="alert" className="mt-1.5 text-sm text-destructive">{pesan}</p> : null;
}

export function FormLapor({ pengguna, sla, sekolahAwal = null }: {
  pengguna: PenggunaLapor | null;
  sla: AturanSla;
  /** Sekolah terisi dari Cari Sekolah (/lapor?sekolah=…). */
  sekolahAwal?: SekolahPilihan | null;
}) {
  const router = useRouter();
  const [draf, setDraf] = useState<Draf>(sekolahAwal ? { ...DRAF_KOSONG, sekolah: sekolahAwal } : DRAF_KOSONG);
  const [tahap, setTahap] = useState(0);
  const [bukti, setBukti] = useState<BuktiSiap[]>([]);
  const [galat, setGalat] = useState<Record<string, string>>({});
  const [kirim, setKirim] = useState<{ status: "diam" | "menyimpan" | "mengunggah"; selesai: number }>({ status: "diam", selesai: 0 });
  const [dialogMasuk, setDialogMasuk] = useState(false);
  const [galatKirim, setGalatKirim] = useState<string | null>(null);
  const [drafDipulihkan, setDrafDipulihkan] = useState(false);
  const drafLama = useSyncExternalStore(tanpaLangganan, bacaDraf, () => null);

  useEffect(() => {
    if (adaIsi(draf)) simpanDraf(draf);
  }, [draf]);

  const ubah = <K extends keyof Draf>(kunci: K, nilai: Draf[K]) => {
    setDraf((d) => ({ ...d, [kunci]: nilai }));
    setGalat((g) => ({ ...g, [kunci]: "" }));
  };

  const tawarkanPulihkan = !drafDipulihkan && drafLama && !adaIsi(draf);
  const pulihkan = () => {
    try {
      setDraf({ ...DRAF_KOSONG, ...JSON.parse(drafLama!) });
      toast.success("Draf dipulihkan");
    } catch {
      simpanDraf(null);
    }
    setDrafDipulihkan(true);
  };

  function validasiTahap(t: number): boolean {
    const g: Record<string, string> = {};
    if (t === 0 && !draf.kategori) g.kategori = "Pilih salah satu.";
    if (t === 1 && !draf.sekolah) g.sekolah = "Pilih sekolah dari daftar.";
    if (t === 2) {
      const cek = skemaLaporan.pick({ waktuKejadian: true, jumlahTerdampak: true, deskripsi: true }).safeParse({
        waktuKejadian: amanIso(draf.waktu),
        jumlahTerdampak: draf.jumlah === "" ? 0 : Number(draf.jumlah),
        deskripsi: draf.deskripsi,
      });
      if (!cek.success) {
        for (const i of cek.error.issues) {
          const kunci = { waktuKejadian: "waktu", jumlahTerdampak: "jumlah", deskripsi: "deskripsi" }[String(i.path[0])] ?? "umum";
          g[kunci] ||= i.message;
        }
      }
    }
    if (t === 3 && bukti.length === 0) {
      g.bukti = "Wajib melampirkan minimal 1 bukti foto/video kondisi makanan untuk mencegah laporan fiktif.";
      toast.error("Wajib mengunggah minimal 1 foto bukti nyata.");
    }
    setGalat(g);
    return Object.values(g).every((v) => !v);
  }

  const keTahap = (t: number) => {
    setTahap(t);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const lanjut = () => validasiTahap(tahap) && keTahap(Math.min(tahap + 1, LANGKAH.length - 1));

  async function kirimSekarang() {
    if (!pengguna) return setDialogMasuk(true);
    for (let t = 0; t <= 3; t++) {
      if (!validasiTahap(t)) return keTahap(t);
    }
    if (bukti.length === 0) {
      toast.error("Wajib mengunggah minimal 1 bukti foto.");
      return keTahap(3);
    }
    setGalatKirim(null);
    setKirim({ status: "menyimpan", selesai: 0 });
    const hasil = await kirimLaporan({
      kategori: draf.kategori!,
      sekolahId: draf.sekolah!.id,
      waktuKejadian: amanIso(draf.waktu) || new Date().toISOString(),
      jumlahTerdampak: Number(draf.jumlah || 0),
      deskripsi: draf.deskripsi,
      lokasi: draf.lokasi,
      modeIdentitas: draf.mode,
    });
    if (!hasil.ok) {
      setKirim({ status: "diam", selesai: 0 });
      if (hasil.perluMasuk) setDialogMasuk(true);
      setGalatKirim(hasil.pesan);
      return;
    }

    // Unggah bukti ke folder milik pelapor: bukti/<pelapor>/<laporan>/<n>.<ext>
    let gagal = 0;
    if (bukti.length) {
      setKirim({ status: "mengunggah", selesai: 0 });
      const supabase = buatKlienBrowser();
      for (const [i, b] of bukti.entries()) {
        const ekstensi = b.jenis === "foto" ? "webp" : b.berkas.name.split(".").pop() ?? "mp4";
        const path = `${hasil.pelaporId}/${hasil.id}/${i + 1}.${ekstensi}`;
        const unggah = await supabase.storage.from("bukti").upload(path, b.berkas, { contentType: b.berkas.type, upsert: false });
        const baris = unggah.error ? unggah : await supabase.from("bukti").insert({
          id: b.id, laporan_id: hasil.id, path_storage: path, jenis: b.jenis, ukuran_byte: b.berkas.size,
        });
        if (!baris.error && b.metadata) {
          await supabase.from("bukti_metadata").insert({
            bukti_id: b.id, exif_waktu: b.metadata.exifWaktu, exif_lat: b.metadata.exifLat,
            exif_lng: b.metadata.exifLng, perangkat: b.metadata.perangkat,
          });
        }
        if (baris.error) gagal++;
        setKirim({ status: "mengunggah", selesai: i + 1 });
      }
    }

    simpanDraf(null);
    bukti.forEach((b) => URL.revokeObjectURL(b.pratinjau));
    router.push(`/lapor/sukses?tiket=${hasil.kodeTiket}${gagal ? `&bukti_gagal=${gagal}` : ""}`);
  }

  const darurat = draf.kategori === "keracunan";
  const sibuk = kirim.status !== "diam";
  const slaKategori = draf.kategori ? sla[draf.kategori] : undefined;
  const slaTampil = slaKategori && {
    diterima: batasJam(slaKategori.diterima),
    diverifikasi: batasJam(slaKategori.diverifikasi),
    diteruskan: batasJam(slaKategori.diteruskan),
    ditindaklanjuti: batasJam(slaKategori.ditindaklanjuti),
  };

  const alurSetelahKirim = (vertikal: boolean) => (
    <div>
      <p className="flex items-center gap-1.5 text-sm font-semibold">
        <Clock className="size-4 text-primary" aria-hidden /> Setelah dikirim
      </p>
      <AlurStatus className="mt-4" sla={slaTampil} vertikal={vertikal} />
      {slaTampil && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Timer className="size-3.5" aria-hidden /> Batas waktu {KATEGORI[draf.kategori!].label.toLowerCase()}
        </p>
      )}
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_19rem]">
      <div className="min-w-0">
        {tawarkanPulihkan && (
          <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border bg-card p-3 text-sm">
            <span className="flex items-center gap-2 font-medium"><RotateCcw className="size-4 text-primary" aria-hidden /> Ada draf tersimpan</span>
            <span className="flex gap-1.5">
              <Button size="sm" onClick={pulihkan}>Pulihkan</Button>
              <Bertip label="Buang draf" render={<Button size="icon-sm" variant="ghost" onClick={() => { simpanDraf(null); setDrafDipulihkan(true); }} />}>
                <X />
              </Bertip>
            </span>
          </div>
        )}

        {/* Stepper berikon; langkah yang sudah dilewati bisa diklik untuk kembali */}
        <nav aria-label="Langkah laporan" className="mb-6">
          <ol className="flex items-center">
            {LANGKAH.map((l, i) => {
              const lewat = i < tahap;
              const kini = i === tahap;
              return (
                <li key={l.label} className={cn("flex items-center", i < LANGKAH.length - 1 && "flex-1")}>
                  <button
                    type="button"
                    disabled={!lewat || sibuk}
                    onClick={() => keTahap(i)}
                    aria-current={kini ? "step" : undefined}
                    aria-label={`Langkah ${i + 1}: ${l.label}`}
                    className="flex flex-col items-center gap-1 disabled:cursor-default"
                  >
                    <span className={cn(
                      "flex size-10 items-center justify-center rounded-full border-2 transition",
                      lewat && "border-primary bg-primary text-primary-foreground",
                      kini && (darurat ? "border-darurat text-darurat ring-4 ring-darurat/15" : "border-primary text-primary ring-4 ring-primary/15"),
                      !lewat && !kini && "border-border text-muted-foreground/60",
                    )}>
                      {lewat ? <Check className="size-4" aria-hidden /> : <l.ikon className="size-4" aria-hidden />}
                    </span>
                    <span className={cn("hidden text-xs sm:block", kini ? "font-semibold" : "text-muted-foreground")}>{l.label}</span>
                  </button>
                  {i < LANGKAH.length - 1 && (
                    <span aria-hidden className={cn("mx-1 mb-0 h-0.5 flex-1 rounded sm:mb-5", lewat ? "bg-primary" : "bg-border")} />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {darurat && tahap > 0 && <PanelDarurat ringkas className="mb-5" />}

        <div className="rounded-3xl border bg-card p-5 sm:p-7">
          {tahap === 0 && (
            <fieldset>
              <legend className="text-xl font-bold">Apa masalahnya?</legend>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {DAFTAR_KATEGORI.map((k) => {
                  const Ikon = IKON_KATEGORI[k];
                  const dipilih = draf.kategori === k;
                  const merah = k === "keracunan";
                  return (
                    <label key={k} className={cn(
                      "relative flex cursor-pointer flex-col gap-3 rounded-2xl border-2 p-4 transition has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/40",
                      merah && "col-span-2 flex-row items-center sm:col-span-1 sm:flex-col sm:items-start",
                      dipilih
                        ? merah ? "border-darurat bg-darurat-lembut" : "border-primary bg-secondary/60"
                        : merah ? "border-darurat/30 hover:border-darurat/60" : "border-border hover:border-primary/40",
                    )}>
                      <input type="radio" name="kategori" value={k} checked={dipilih} className="sr-only"
                        onChange={() => {
                          ubah("kategori", k);
                          if (!draf.waktu) ubah("waktu", waktuLokal(new Date()));
                        }} />
                      <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl",
                        merah ? "bg-darurat text-white" : dipilih ? "bg-primary text-primary-foreground" : "bg-secondary text-primary")}>
                        <Ikon className="size-5" aria-hidden />
                      </span>
                      <span>
                        <span className="block font-semibold leading-tight">{KATEGORI[k].label}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">{KATEGORI_PENDEK[k]}</span>
                      </span>
                      {dipilih && (
                        <span className={cn("absolute top-3 right-3 flex size-5 items-center justify-center rounded-full text-white", merah ? "bg-darurat" : "bg-primary")}>
                          <Check className="size-3.5" aria-hidden />
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
              <Galat pesan={galat.kategori} />
              {darurat && <PanelDarurat className="mt-5" />}
            </fieldset>
          )}

          {tahap === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Sekolah mana?</h2>
              <CariSekolah nilai={draf.sekolah} onPilih={(s) => ubah("sekolah", s)} />
              <Galat pesan={galat.sekolah} />
              {draf.sekolah && draf.kategori && (
                <LaporanSerupa sekolahId={draf.sekolah.id} kategori={draf.kategori} sudahMasuk={Boolean(pengguna)}
                  onPerluMasuk={() => setDialogMasuk(true)} />
              )}
            </div>
          )}

          {tahap === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Ceritakan singkat</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="waktu" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                    <Clock className="size-4 text-muted-foreground" aria-hidden /> Kapan
                  </label>
                  <input id="waktu" type="datetime-local" value={draf.waktu} max={waktuLokal(new Date())}
                    onChange={(e) => ubah("waktu", e.target.value)} aria-invalid={Boolean(galat.waktu)} className={kelasInput} />
                  <Galat pesan={galat.waktu} />
                </div>
                <div>
                  <label htmlFor="jumlah" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                    <Users className="size-4 text-muted-foreground" aria-hidden /> {darurat ? "Anak dengan keluhan" : "Siswa terdampak"}
                  </label>
                  <input id="jumlah" type="number" inputMode="numeric" min={0} max={5000} value={draf.jumlah}
                    onChange={(e) => ubah("jumlah", e.target.value)} aria-invalid={Boolean(galat.jumlah)} placeholder="0" className={kelasInput} />
                  <Galat pesan={galat.jumlah} />
                </div>
              </div>
              <div>
                <label htmlFor="deskripsi" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                  <FileText className="size-4 text-muted-foreground" aria-hidden /> Apa yang terjadi
                </label>
                <textarea id="deskripsi" rows={5} value={draf.deskripsi} maxLength={4000}
                  onChange={(e) => ubah("deskripsi", e.target.value)} aria-invalid={Boolean(galat.deskripsi)}
                  aria-describedby="petunjuk-deskripsi"
                  placeholder={draf.kategori ? `Contoh: ${KATEGORI[draf.kategori].contoh}` : "Menu, kondisi makanan, gejala, jam."}
                  className="w-full rounded-xl border border-input bg-background p-3.5 text-base leading-relaxed focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none aria-invalid:border-destructive" />
                <p id="petunjuk-deskripsi" className="mt-1.5 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><EyeOff className="size-3.5" aria-hidden /> Tanpa nama anak</span>
                  <span className={cn("angka", draf.deskripsi.trim().length < 20 && "text-risiko-sedang")}>{draf.deskripsi.trim().length}/20+</span>
                </p>
                <Galat pesan={galat.deskripsi} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {draf.lokasi ? (
                  <span className="inline-flex h-10 items-center gap-2 rounded-xl bg-secondary px-3 text-sm">
                    <LocateFixed className="size-4 text-primary" aria-hidden />
                    <span className="angka">{draf.lokasi.lat.toFixed(4)}, {draf.lokasi.lng.toFixed(4)}</span>
                    <Bertip label="Hapus lokasi" render={<button type="button" onClick={() => ubah("lokasi", null)} className="rounded p-0.5 hover:bg-background" />}>
                      <X className="size-4" aria-hidden />
                    </Bertip>
                  </span>
                ) : (
                  <Button type="button" variant="outline" size="lg" className="h-10 bg-card"
                    onClick={() => navigator.geolocation?.getCurrentPosition(
                      (p) => ubah("lokasi", { lat: p.coords.latitude, lng: p.coords.longitude }),
                      () => toast.error("Lokasi tidak bisa dibaca"),
                      { enableHighAccuracy: true, timeout: 10_000 },
                    )}>
                    <LocateFixed aria-hidden /> Lokasi saya
                  </Button>
                )}
                <span className="text-xs text-muted-foreground">opsional</span>
              </div>
            </div>
          )}

          {tahap === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  Foto Bukti Nyata <span className="rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 px-2.5 py-0.5 text-xs font-bold">Wajib Minimal 1 Foto</span>
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Foto ompreng, porsi menu, atau kondisi anak diperlukan untuk verifikasi Machine Learning dan audit independen guna mencegah laporan fiktif.
                </p>
              </div>
              <UnggahBukti bukti={bukti} onUbah={setBukti} />
              <Galat pesan={galat.bukti} />
            </div>
          )}

          {tahap === 4 && (
            <div className="space-y-6">
              <fieldset>
                <legend className="text-xl font-bold">Identitas Anda</legend>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {DAFTAR_MODE.map((m) => {
                    const Ikon = IKON_MODE[m];
                    const dipilih = draf.mode === m;
                    return (
                      <label key={m} title={MODE_IDENTITAS[m].penjelasan} className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-3.5 transition has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/40 sm:flex-col sm:items-start",
                        dipilih ? "border-primary bg-secondary/60" : "border-border hover:border-primary/40",
                      )}>
                        <input type="radio" name="mode" value={m} checked={dipilih} onChange={() => ubah("mode", m)} className="sr-only" />
                        <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl",
                          dipilih ? "bg-primary text-primary-foreground" : "bg-secondary text-primary")}>
                          <Ikon className="size-5" aria-hidden />
                        </span>
                        <span>
                          <span className="block font-semibold">{MODE_IDENTITAS[m].label}</span>
                          <span className="block text-xs text-muted-foreground">{MODE_PENDEK[m]}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <ul aria-label="Ringkasan laporan" className="grid gap-2 rounded-2xl bg-muted/60 p-4 text-sm sm:grid-cols-2">
                {[
                  { ikon: draf.kategori ? IKON_KATEGORI[draf.kategori] : Tag, isi: draf.kategori && KATEGORI[draf.kategori].label, ke: 0 },
                  { ikon: School, isi: draf.sekolah?.nama, ke: 1 },
                  { ikon: Clock, isi: draf.waktu && new Date(draf.waktu).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }), ke: 2 },
                  { ikon: Users, isi: `${draf.jumlah || 0} terdampak`, ke: 2 },
                  { ikon: Camera, isi: `${bukti.length} foto/video`, ke: 3 },
                ].map((r, i) => (
                  <li key={i}>
                    <button type="button" onClick={() => keTahap(r.ke)} className="flex w-full items-center gap-2 rounded-lg p-1 text-left hover:bg-background">
                      <r.ikon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                      <span className="truncate">{r.isi || "–"}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="rounded-2xl border p-4 lg:hidden">{alurSetelahKirim(false)}</div>

              {!pengguna && (
                <section aria-labelledby="judul-masuk" className="rounded-2xl border-2 border-primary/25 p-4">
                  <h3 id="judul-masuk" className="mb-3 font-semibold">Masuk untuk mengirim</h3>
                  <MasukPassword onBerhasil={() => router.refresh()} />
                </section>
              )}
            </div>
          )}
        </div>

        {galatKirim && tahap === LANGKAH.length - 1 && (
          <p role="alert" className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {galatKirim} Isian tetap tersimpan.
          </p>
        )}

        {/* Navigasi langkah: menempel di bawah layar HP, bisa satu tangan (PRD 7.4) */}
        <div className="sticky bottom-0 z-10 -mx-4 mt-5 flex gap-3 border-t bg-background/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
          {tahap > 0 && (
            <Bertip label="Kembali" render={<Button type="button" variant="outline" size="xl" onClick={() => keTahap(tahap - 1)} disabled={sibuk} className="w-12 bg-card px-0" />}>
              <ArrowLeft aria-hidden />
            </Bertip>
          )}
          {tahap < LANGKAH.length - 1 ? (
            <Button type="button" size="xl" onClick={lanjut} className="flex-1 sm:min-w-40 sm:flex-none">
              Lanjut <ArrowRight aria-hidden />
            </Button>
          ) : (
            <Button type="button" size="xl" onClick={kirimSekarang} disabled={sibuk || !pengguna}
              className={cn("flex-1 sm:min-w-48 sm:flex-none", darurat && "bg-darurat hover:bg-darurat/90")}>
              {sibuk ? <Loader2 className="animate-spin" aria-hidden /> : <Send aria-hidden />}
              {kirim.status === "menyimpan" ? "Menyimpan…"
                : kirim.status === "mengunggah" ? `Mengunggah ${kirim.selesai}/${bukti.length}…`
                : pengguna ? "Kirim" : "Masuk dulu"}
            </Button>
          )}
        </div>
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-4 rounded-3xl border bg-card p-5">
          {alurSetelahKirim(true)}
          <p className="flex gap-2 rounded-xl bg-muted p-3 text-xs text-muted-foreground">
            <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden /> Belum tampil publik sebelum diverifikasi.
          </p>
        </div>
      </aside>

      <Dialog open={dialogMasuk} onOpenChange={setDialogMasuk}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Masuk</DialogTitle>
            <DialogDescription>Isian laporan tetap tersimpan.</DialogDescription>
          </DialogHeader>
          <MasukPassword onBerhasil={() => { setDialogMasuk(false); router.refresh(); toast.success("Berhasil masuk"); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
