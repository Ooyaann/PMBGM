"use client";

import { useRef, useState } from "react";
import { Camera, ImagePlus, Loader2, MapPin, MapPinOff, Minimize2, ShieldAlert, Trash2, Video } from "lucide-react";
import { Bertip } from "@/components/ui/bertip";
import { Button } from "@/components/ui/button";
import { siapkanBukti, type BuktiSiap } from "@/lib/bukti";
import { BATAS_BUKTI } from "@/lib/validasi/laporan";

const ukuran = (b: number) => (b >= 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`);

/** Unggah bukti foto/video (LP-02). Foto dikompres di perangkat sebelum dikirim (PRD 7.3). */
export function UnggahBukti({ bukti, onUbah }: { bukti: BuktiSiap[]; onUbah: (b: BuktiSiap[]) => void }) {
  const galeri = useRef<HTMLInputElement>(null);
  const kamera = useRef<HTMLInputElement>(null);
  const [memproses, setMemproses] = useState(0);
  const [galat, setGalat] = useState<string | null>(null);
  const sisa = BATAS_BUKTI.jumlah - bukti.length;

  async function tambah(daftar: FileList | null) {
    if (!daftar?.length) return;
    setGalat(null);
    const berkas = [...daftar].slice(0, sisa);
    if (daftar.length > sisa) setGalat(`Maksimal ${BATAS_BUKTI.jumlah} berkas per laporan.`);
    setMemproses(berkas.length);
    const baru: BuktiSiap[] = [];
    for (const b of berkas) {
      try {
        baru.push(await siapkanBukti(b));
      } catch (e) {
        setGalat(e instanceof Error ? e.message : "Berkas tidak bisa diproses.");
      }
      setMemproses((n) => n - 1);
    }
    onUbah([...bukti, ...baru]);
  }

  return (
    <div className="space-y-4">
      <ul className="flex flex-wrap gap-2 text-xs font-medium">
        <li className="inline-flex items-center gap-1.5 rounded-full bg-risiko-sedang-lembut px-2.5 py-1 text-risiko-sedang">
          <ShieldAlert className="size-3.5" aria-hidden /> Hindari wajah anak
        </li>
        <li className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
          <MapPinOff className="size-3.5" aria-hidden /> Lokasi foto disembunyikan
        </li>
        <li className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
          <Minimize2 className="size-3.5" aria-hidden /> Dikompres otomatis
        </li>
      </ul>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button type="button" variant="outline" size="xl" className="h-14 bg-card" disabled={sisa <= 0 || memproses > 0}
          onClick={() => kamera.current?.click()}>
          <Camera aria-hidden /> Kamera
        </Button>
        <Button type="button" variant="outline" size="xl" className="h-14 bg-card" disabled={sisa <= 0 || memproses > 0}
          onClick={() => galeri.current?.click()}>
          <ImagePlus aria-hidden /> Galeri
        </Button>
      </div>
      <input ref={kamera} type="file" accept="image/*" capture="environment" className="sr-only" tabIndex={-1}
        aria-label="Ambil foto dengan kamera" onChange={(e) => { tambah(e.target.files); e.target.value = ""; }} />
      <input ref={galeri} type="file" accept="image/*,video/mp4,video/webm,video/quicktime" multiple className="sr-only" tabIndex={-1}
        aria-label="Pilih foto atau video dari galeri" onChange={(e) => { tambah(e.target.files); e.target.value = ""; }} />

      <p className="text-xs text-muted-foreground">
        Maks. {BATAS_BUKTI.jumlah} berkas · video maks. {BATAS_BUKTI.videoMaksMB} MB
      </p>
      {galat && <p role="alert" className="text-sm text-destructive">{galat}</p>}

      {(bukti.length > 0 || memproses > 0) && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {bukti.map((b) => (
            <li key={b.id} className="overflow-hidden rounded-xl border bg-card">
              <div className="relative aspect-square bg-muted">
                {b.jenis === "foto" ? (
                  // eslint-disable-next-line @next/next/no-img-element -- pratinjau blob lokal
                  <img src={b.pratinjau} alt="Pratinjau bukti" className="size-full object-cover" />
                ) : (
                  <div className="flex size-full flex-col items-center justify-center gap-1 text-muted-foreground">
                    <Video className="size-8" aria-hidden /> <span className="text-xs">Video</span>
                  </div>
                )}
                <Bertip label="Hapus" render={<button type="button" onClick={() => { URL.revokeObjectURL(b.pratinjau); onUbah(bukti.filter((x) => x.id !== b.id)); }}
                  className="absolute top-2 right-2 flex size-9 items-center justify-center rounded-lg bg-background/90 shadow hover:bg-background hover:text-destructive" />}>
                  <Trash2 className="size-4" aria-hidden />
                </Bertip>
              </div>
              <div className="space-y-0.5 p-2 text-xs">
                <p className="text-muted-foreground">
                  {b.jenis === "foto" ? `${ukuran(b.ukuranAsli)} → ${ukuran(b.berkas.size)}` : ukuran(b.berkas.size)}
                </p>
                {b.metadata?.exifLat != null && (
                  <p className="flex items-center gap-1 text-risiko-rendah"><MapPin className="size-3" aria-hidden /> Ada lokasi</p>
                )}
              </div>
            </li>
          ))}
          {Array.from({ length: memproses }, (_, i) => (
            <li key={`proses-${i}`} className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-xs text-muted-foreground">
              <Loader2 className="size-6 animate-spin" aria-hidden /> Memproses…
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
