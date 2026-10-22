"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Loader2, MapPin, School, Search, Utensils, X } from "lucide-react";
import { BadgeRisiko } from "@/components/data/badge";
import { buatKlienBrowser } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export interface SekolahPilihan {
  id: string;
  nama: string;
  jenjang: string;
  kecamatan: string;
  sppgId: string | null;
  sppgNama: string | null;
  indeks: number | null;
}

const JENJANG: Record<string, string> = { paud: "PAUD/TK", sd: "SD", smp: "SMP", sma: "SMA", smk: "SMK", slb: "SLB" };

/**
 * Autocomplete sekolah (LP-01). Memilih sekolah otomatis menautkan SPPG dan kecamatan,
 * sekaligus menampilkan skor risiko SPPG tersebut.
 */
export function CariSekolah({ nilai, onPilih }: { nilai: SekolahPilihan | null; onPilih: (s: SekolahPilihan | null) => void }) {
  const idDaftar = useId();
  const [kueri, setKueri] = useState("");
  const [hasil, setHasil] = useState<SekolahPilihan[]>([]);
  const [memuat, setMemuat] = useState(false);
  const [terbuka, setTerbuka] = useState(false);
  const [aktif, setAktif] = useState(0);
  const permintaan = useRef(0);

  const kontainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function klikLuar(e: MouseEvent) {
      if (kontainer.current && !kontainer.current.contains(e.target as Node)) {
        setTerbuka(false);
      }
    }
    document.addEventListener("mousedown", klikLuar);
    return () => document.removeEventListener("mousedown", klikLuar);
  }, []);

  useEffect(() => {
    const q = kueri.trim();
    const nomor = ++permintaan.current;
    const jeda = setTimeout(async () => {
      setMemuat(true);
      const supabase = buatKlienBrowser();
      let kueriDb = supabase
        .from("sekolah")
        .select("id, nama, jenjang, wilayah:wilayah_id (nama), sppg:sppg_id (id, nama)")
        .order("nama");

      if (q.length >= 2) {
        kueriDb = kueriDb.ilike("nama", `%${q.replace(/[%_]/g, "")}%`).limit(12);
      } else {
        kueriDb = kueriDb.limit(20);
      }

      const { data } = await kueriDb;
      const sppgIds = [...new Set((data ?? []).map((s) => s.sppg?.id).filter(Boolean))] as string[];
      const { data: indeks } = sppgIds.length
        ? await supabase.from("indeks_risiko").select("sppg_id, indeks").in("sppg_id", sppgIds)
        : { data: [] };
      const petaIndeks = new Map((indeks ?? []).map((i) => [i.sppg_id, Number(i.indeks)]));
      if (nomor !== permintaan.current) return; // abaikan respons yang sudah usang
      setHasil((data ?? []).map((s) => ({
        id: s.id,
        nama: s.nama,
        jenjang: s.jenjang,
        kecamatan: s.wilayah?.nama ?? "",
        sppgId: s.sppg?.id ?? null,
        sppgNama: s.sppg?.nama ?? null,
        indeks: s.sppg?.id ? petaIndeks.get(s.sppg.id) ?? null : null,
      })));
      setAktif(0);
      setMemuat(false);
    }, q.length >= 2 ? 250 : 0);
    return () => clearTimeout(jeda);
  }, [kueri]);

  if (nilai) {
    return (
      <div className="rounded-2xl border-2 border-primary/30 bg-secondary/50 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <School className="size-5" aria-hidden />
            </span>
            <div>
              <p className="font-semibold">{nilai.nama}</p>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-3.5" aria-hidden /> {nilai.kecamatan}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onPilih(null)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Ganti sekolah"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-card p-3 text-sm">
          <span className="flex items-center gap-2 font-semibold">
            <Utensils className="size-4 text-muted-foreground" aria-hidden />
            <span><span className="sr-only">Dapur yang melayani: </span>{nilai.sppgNama ?? "Belum tercatat"}</span>
          </span>
          {nilai.indeks != null && <BadgeRisiko skor={nilai.indeks} />}
        </div>
      </div>
    );
  }

  const pilih = (s: SekolahPilihan) => {
    onPilih(s);
    setKueri("");
    setHasil([]);
    setTerbuka(false);
  };

  return (
    <div ref={kontainer} className="relative">
      <label htmlFor={`${idDaftar}-input`} className="sr-only">Nama sekolah</label>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          id={`${idDaftar}-input`}
          role="combobox"
          aria-expanded={terbuka && hasil.length > 0}
          aria-controls={idDaftar}
          aria-autocomplete="list"
          aria-activedescendant={terbuka && hasil[aktif] ? `${idDaftar}-${hasil[aktif].id}` : undefined}
          autoComplete="off"
          value={kueri}
          onChange={(e) => {
            setKueri(e.target.value);
            setTerbuka(true);
          }}
          onFocus={() => setTerbuka(true)}
          onClick={() => setTerbuka(true)}
          onKeyDown={(e) => {
            if (!terbuka || !hasil.length) return;
            if (e.key === "ArrowDown") { e.preventDefault(); setAktif((a) => (a + 1) % hasil.length); }
            if (e.key === "ArrowUp") { e.preventDefault(); setAktif((a) => (a - 1 + hasil.length) % hasil.length); }
            if (e.key === "Enter") { e.preventDefault(); pilih(hasil[aktif]); }
            if (e.key === "Escape") setTerbuka(false);
          }}
          placeholder="Cari atau pilih sekolah..."
          className="h-12 w-full rounded-xl border border-input bg-card pr-10 pl-11 text-base placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
        />
        {memuat && <Loader2 className="absolute top-1/2 right-3.5 size-5 -translate-y-1/2 animate-spin text-muted-foreground" aria-hidden />}
      </div>
      {terbuka && (
        <ul
          id={idDaftar}
          role="listbox"
          aria-label="Hasil pencarian sekolah"
          className="absolute z-20 mt-2 max-h-80 w-full overflow-auto rounded-xl border bg-popover p-1.5 shadow-xl"
        >
          {hasil.length === 0 && !memuat && <li className="p-3 text-sm text-muted-foreground">Tidak ditemukan</li>}
          {hasil.map((s, i) => (
            <li
              key={s.id}
              id={`${idDaftar}-${s.id}`}
              role="option"
              aria-selected={i === aktif}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pilih(s)}
              onMouseEnter={() => setAktif(i)}
              className={cn("flex cursor-pointer items-center justify-between gap-3 rounded-lg p-2.5", i === aktif && "bg-muted")}
            >
              <span className="min-w-0">
                <span className="block truncate font-medium">{s.nama}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {JENJANG[s.jenjang] ?? s.jenjang} · {s.kecamatan}
                </span>
              </span>
              {s.indeks != null && <BadgeRisiko skor={s.indeks} className="shrink-0" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
