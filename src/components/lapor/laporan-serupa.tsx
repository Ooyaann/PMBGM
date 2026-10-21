"use client";

import { useEffect, useState, useTransition } from "react";
import { CheckCircle2, HandHeart, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buatKlienBrowser } from "@/lib/supabase/client";
import type { Kategori } from "@/lib/label";

interface Serupa {
  grup_serupa: string;
  jumlah_laporan: number;
  jumlah_dukungan: number;
}

/**
 * Deteksi laporan serupa (LP-07): sekolah dan kategori sama dalam 24 jam.
 * Warga bisa menambah dukungan "Saya juga mengalami" tanpa membuat laporan ganda.
 */
export function LaporanSerupa({ sekolahId, kategori, sudahMasuk, onPerluMasuk }: {
  sekolahId: string;
  kategori: Kategori;
  sudahMasuk: boolean;
  onPerluMasuk: () => void;
}) {
  const [serupa, setSerupa] = useState<Serupa | null>(null);
  const [didukung, setDidukung] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);
  const [sibuk, mulai] = useTransition();

  useEffect(() => {
    let batal = false;
    buatKlienBrowser()
      .rpc("cari_laporan_serupa", { p_sekolah_id: sekolahId, p_kategori: kategori })
      .then(({ data }) => {
        if (batal) return;
        const terbesar = [...(data ?? [])].sort((a, b) => b.jumlah_laporan - a.jumlah_laporan)[0];
        setSerupa(terbesar ?? null);
        setDidukung(false);
      });
    return () => {
      batal = true;
    };
  }, [sekolahId, kategori]);

  if (!serupa) return null;
  const total = serupa.jumlah_laporan + serupa.jumlah_dukungan + (didukung ? 1 : 0);

  const dukung = () =>
    mulai(async () => {
      if (!sudahMasuk) return onPerluMasuk();
      setGalat(null);
      const { error } = await buatKlienBrowser().rpc("dukung_laporan", { p_grup_serupa: serupa.grup_serupa });
      if (error) setGalat(error.message);
      else setDidukung(true);
    });

  return (
    <section aria-live="polite" className="rounded-2xl border border-info/25 bg-info-lembut p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-semibold text-info">
          <Users className="size-5" aria-hidden />
          <span><span className="angka">{total}</span> laporan serupa · 24 jam</span>
        </p>
        {didukung ? (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-risiko-rendah">
            <CheckCircle2 className="size-4" aria-hidden /> Dukungan tercatat
          </span>
        ) : (
          <Button type="button" variant="outline" size="lg" className="h-10 bg-card" onClick={dukung} disabled={sibuk}>
            {sibuk ? <Loader2 className="animate-spin" aria-hidden /> : <HandHeart aria-hidden />} Saya juga mengalami
          </Button>
        )}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {didukung ? "Prioritas verifikasi naik. Lanjutkan bila punya foto baru." : "Punya foto atau detail baru? Lanjutkan, nanti digabung."}
      </p>
      {galat && <p role="alert" className="mt-2 text-sm text-destructive">{galat}</p>}
    </section>
  );
}
