"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CircleCheck, ClipboardCheck, FileText, Hammer, Loader2, Lock, MessageSquare, Paperclip, Search, Send, Star, Wrench, X,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { selesaikanKasus, teruskanKasus, tindakLanjutKasus } from "@/lib/aksi/panel";
import { TINDAKAN, type JenisTindakan } from "@/lib/label";
import { buatKlienBrowser } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Verifikator: teruskan ke instansi
// ---------------------------------------------------------------------------
export interface InstansiPilihan { id: string; nama: string; jenis: string; disarankan: boolean }

export function AksiTeruskan({ kasusId, instansi, sekarang }: { kasusId: string; instansi: InstansiPilihan[]; sekarang: string | null }) {
  const router = useRouter();
  const [sibuk, mulai] = useTransition();
  const [pilih, setPilih] = useState(instansi.find((i) => i.disarankan)?.id ?? "");
  const [catatan, setCatatan] = useState("");

  return (
    <div className="space-y-3 rounded-3xl border bg-card p-4 sm:p-5">
      <p className="flex items-center gap-2 text-sm font-bold"><Send className="size-4 text-primary" aria-hidden />
        {sekarang ? "Alihkan instansi" : "Teruskan ke instansi"}</p>
      <ul className="space-y-1.5" role="radiogroup" aria-label="Instansi tujuan">
        {instansi.map((i) => (
          <li key={i.id}>
            <label className={cn("flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 text-sm", pilih === i.id && "border-primary bg-secondary/50")}>
              <input type="radio" name="instansi" className="accent-[var(--primary)]" checked={pilih === i.id} onChange={() => setPilih(i.id)} />
              <span className="min-w-0 flex-1 truncate">{i.nama}</span>
              {i.disarankan && <Star className="size-3.5 shrink-0 fill-current text-risiko-sedang" aria-label="Disarankan" />}
            </label>
          </li>
        ))}
      </ul>
      <Textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} rows={2} maxLength={1000}
        placeholder="Pesan untuk instansi (tampil di timeline)" aria-label="Catatan penerusan" />
      <Button size="xl" className="w-full" disabled={sibuk || !pilih || pilih === sekarang} onClick={() => mulai(async () => {
        const r = await teruskanKasus({ kasusId, instansiId: pilih, catatan: catatan || undefined });
        if (!r.ok) { toast.error(r.pesan); return; }
        toast.success("Kasus diteruskan, batas waktu tanggapan mulai berjalan");
        setCatatan("");
        router.refresh();
      })}>
        {sibuk ? <Loader2 className="animate-spin" aria-hidden /> : <Send aria-hidden />} Teruskan
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Instansi: tindak lanjut dan penyelesaian, dengan unggahan bukti
// ---------------------------------------------------------------------------
const IKON_TINDAKAN: Record<JenisTindakan, LucideIcon> = {
  inspeksi: Search,
  penutupan_sementara: Lock,
  perbaikan: Hammer,
  klarifikasi: MessageSquare,
  pembinaan: ClipboardCheck,
  lainnya: Wrench,
};

interface Berkas { id: string; nama: string; path: string | null; pratinjau: string | null }

async function siapkan(f: File): Promise<File> {
  if (!f.type.startsWith("image/")) return f;
  // Foto dikompres ke WebP ≤ 1 MB; hasilnya bersih dari metadata lokasi.
  const kompres = (await import("browser-image-compression")).default;
  const hasil = await kompres(f, { maxSizeMB: 1, maxWidthOrHeight: 1920, fileType: "image/webp", useWebWorker: true });
  return new File([hasil], "bukti.webp", { type: "image/webp" });
}

export function AksiInstansi({ kasusId, bisaSelesai }: { kasusId: string; bisaSelesai: boolean }) {
  const router = useRouter();
  const [sibuk, mulai] = useTransition();
  const [mode, setMode] = useState<"tindak" | "selesai">("tindak");
  const [jenis, setJenis] = useState<JenisTindakan | null>(null);
  const [catatan, setCatatan] = useState("");
  const [berkas, setBerkas] = useState<Berkas[]>([]);
  const [unggah, setUnggah] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  async function tambah(daftar: FileList | null) {
    if (!daftar?.length) return;
    setUnggah(true);
    const supabase = buatKlienBrowser();
    for (const f of [...daftar].slice(0, 6 - berkas.length)) {
      if (!/^(image\/(jpeg|png|webp)|application\/pdf)$/.test(f.type)) { toast.error(`${f.name}: hanya foto atau PDF`); continue; }
      if (f.size > 10 * 1024 * 1024) { toast.error(`${f.name}: maksimal 10 MB`); continue; }
      const id = crypto.randomUUID();
      try {
        const siap = await siapkan(f);
        const ext = siap.type === "application/pdf" ? "pdf" : "webp";
        const path = `${kasusId}/${id}.${ext}`;
        const { error } = await supabase.storage.from("tindak-lanjut").upload(path, siap, { contentType: siap.type });
        if (error) throw error;
        setBerkas((b) => [...b, { id, nama: f.name, path, pratinjau: ext === "webp" ? URL.createObjectURL(siap) : null }]);
      } catch {
        toast.error(`${f.name} gagal diunggah`);
      }
    }
    setUnggah(false);
    if (input.current) input.current.value = "";
  }

  function kirim() {
    mulai(async () => {
      const bukti = berkas.map((b) => b.path!).filter(Boolean);
      const r = mode === "tindak"
        ? await tindakLanjutKasus({ kasusId, jenis: jenis!, catatan, bukti })
        : await selesaikanKasus({ kasusId, catatan, bukti });
      if (!r.ok) { toast.error(r.pesan); return; }
      toast.success(mode === "tindak" ? "Tindak lanjut tercatat dan tampil di timeline publik" : "Kasus selesai, pelapor diminta menilai");
      setCatatan(""); setBerkas([]); setJenis(null);
      router.refresh();
    });
  }

  const siap = catatan.trim().length >= 10 && (mode === "selesai" || jenis) && !unggah;

  return (
    <div className="space-y-3 rounded-3xl border bg-card p-4 sm:p-5">
      {bisaSelesai && (
        <div role="radiogroup" aria-label="Jenis pembaruan" className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
          {([["tindak", "Tindak lanjut", Wrench], ["selesai", "Selesaikan", CircleCheck]] as const).map(([k, l, I]) => (
            <button key={k} type="button" role="radio" aria-checked={mode === k} onClick={() => setMode(k)}
              className={cn("inline-flex h-9 items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition",
                mode === k ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground")}>
              <I className="size-4" aria-hidden /> {l}
            </button>
          ))}
        </div>
      )}

      {mode === "tindak" && (
        <div role="radiogroup" aria-label="Jenis tindakan" className="grid grid-cols-3 gap-2">
          {(Object.keys(IKON_TINDAKAN) as JenisTindakan[]).map((j) => {
            const I = IKON_TINDAKAN[j];
            return (
              <button key={j} type="button" role="radio" aria-checked={jenis === j} onClick={() => setJenis(j)}
                className={cn("flex flex-col items-center gap-1 rounded-xl border px-1 py-2.5 text-[11px] font-medium transition hover:bg-muted/60",
                  jenis === j && "border-primary bg-secondary/60 text-foreground")}>
                <I className={cn("size-5", jenis === j ? "text-primary" : "text-muted-foreground")} aria-hidden />
                {TINDAKAN[j]}
              </button>
            );
          })}
        </div>
      )}

      <Textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} rows={3} maxLength={2000}
        aria-label={mode === "tindak" ? "Catatan tindak lanjut" : "Ringkasan penyelesaian"}
        placeholder={mode === "tindak" ? "Apa yang dilakukan, temuan, dan langkah berikutnya (tampil publik)" : "Hasil akhir penanganan (tampil publik)"} />

      <div className="space-y-2">
        {berkas.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {berkas.map((b) => (
              <li key={b.id} className="relative">
                {b.pratinjau
                  // eslint-disable-next-line @next/next/no-img-element -- pratinjau lokal (blob)
                  ? <img src={b.pratinjau} alt="" className="size-16 rounded-lg object-cover ring-1 ring-border" />
                  : <span className="flex size-16 flex-col items-center justify-center gap-1 rounded-lg bg-muted text-[10px] ring-1 ring-border"><FileText className="size-5" aria-hidden />PDF</span>}
                <button type="button" onClick={() => setBerkas((x) => x.filter((y) => y.id !== b.id))} aria-label={`Hapus ${b.nama}`}
                  className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-foreground text-background">
                  <X className="size-3" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple hidden onChange={(e) => tambah(e.target.files)} />
        <Button variant="outline" size="lg" onClick={() => input.current?.click()} disabled={unggah || berkas.length >= 6}>
          {unggah ? <Loader2 className="animate-spin" aria-hidden /> : <Paperclip aria-hidden />} Bukti foto/PDF
        </Button>
      </div>

      <Button size="xl" className="w-full" onClick={kirim} disabled={sibuk || !siap}>
        {sibuk ? <Loader2 className="animate-spin" aria-hidden /> : mode === "tindak" ? <Wrench aria-hidden /> : <CircleCheck aria-hidden />}
        {mode === "tindak" ? "Catat tindak lanjut" : "Tandai selesai"}
      </Button>
    </div>
  );
}
