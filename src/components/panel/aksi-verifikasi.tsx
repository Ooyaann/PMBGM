"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, FolderPlus, GitMerge, Loader2, ShieldCheck, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { tolakLaporan, verifikasiLaporan } from "@/lib/aksi/panel";
import { cn } from "@/lib/utils";

const CHECKLIST = [
  { kunci: "bukti_relevan", label: "Bukti relevan dengan laporan" },
  { kunci: "waktu_lokasi_wajar", label: "Waktu dan lokasi masuk akal" },
  { kunci: "bukan_duplikat_spam", label: "Bukan spam atau tuduhan pribadi" },
  { kunci: "kategori_sesuai", label: "Kategori sudah sesuai" },
] as const;

const ALASAN_CEPAT = [
  "Bukti tidak relevan dengan kejadian",
  "Di luar lingkup program MBG",
  "Informasi belum cukup untuk ditindaklanjuti",
  "Berisi tuduhan pribadi tanpa bukti",
  "Laporan uji coba atau spam",
];

export interface SerupaPilihan { id: string; kode: string; ringkas: string }
export interface KasusPilihan { id: string; kode: string; judul: string; jumlah: number }

/** Keputusan verifikator untuk satu laporan (LP-09, Keputusan K2/K3): verifikasi, gabung, atau tolak. */
export function AksiVerifikasi({ laporanId, judulAwal, serupa, kasusTerbuka }: {
  laporanId: string;
  judulAwal: string;
  serupa: SerupaPilihan[];
  kasusTerbuka: KasusPilihan[];
}) {
  const router = useRouter();
  const [sibuk, mulai] = useTransition();
  const [cek, setCek] = useState<Record<string, boolean>>({});
  const [ikut, setIkut] = useState<Set<string>>(new Set(serupa.map((s) => s.id)));
  const [tujuan, setTujuan] = useState<string>("baru");
  const [judul, setJudul] = useState(judulAwal);
  const [catatan, setCatatan] = useState("");
  const [modeTolak, setModeTolak] = useState(false);
  const [alasan, setAlasan] = useState("");

  const lengkap = CHECKLIST.every((c) => cek[c.kunci]);
  const checklist = Object.fromEntries(CHECKLIST.map((c) => [c.kunci, Boolean(cek[c.kunci])])) as
    Record<(typeof CHECKLIST)[number]["kunci"], boolean>;

  function verifikasi() {
    mulai(async () => {
      const r = await verifikasiLaporan({
        laporanIds: [laporanId, ...ikut],
        kasusId: tujuan === "baru" ? null : tujuan,
        judul: tujuan === "baru" ? judul : undefined,
        catatan: catatan || undefined,
        checklist,
      });
      if (!r.ok) { toast.error(r.pesan); return; }
      toast.success(ikut.size ? `${ikut.size + 1} laporan diverifikasi` : "Laporan diverifikasi");
      router.push(`/panel/kasus/${r.data!.kasusId}`);
    });
  }

  function tolak() {
    const bersih = alasan.trim();
    if (bersih.length < 10) {
      toast.error("Silakan pilih salah satu alasan cepat di atas atau ketik minimal 10 karakter agar pelapor memahami penyebab laporan ditolak.");
      return;
    }
    mulai(async () => {
      const r = await tolakLaporan({ laporanId, alasan: bersih, checklist });
      if (!r.ok) { toast.error(r.pesan); return; }
      toast.success("Laporan berhasil ditolak dan alasan telah disampaikan ke pelapor");
      router.push("/panel/verifikasi");
    });
  }

  return (
    <div className="space-y-4 rounded-3xl border bg-card p-4 sm:p-5">
      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-bold">Pemeriksaan</legend>
        {CHECKLIST.map((c) => (
          <label key={c.kunci} className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2 py-1.5 text-sm hover:bg-muted/60">
            <Checkbox checked={Boolean(cek[c.kunci])} onCheckedChange={(v) => setCek((s) => ({ ...s, [c.kunci]: v }))} />
            {c.label}
          </label>
        ))}
      </fieldset>

      {modeTolak ? (
        <div className="space-y-3 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-rose-700 dark:text-rose-300">Alasan Penolakan</p>
            <span className="text-[11px] text-muted-foreground">Wajib dibaca pelapor</span>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Klik alasan cepat berikut:</p>
            <div className="flex flex-wrap gap-1.5">
              {ALASAN_CEPAT.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAlasan(a)}
                  className={cn(
                    "cursor-pointer rounded-full border px-2.5 py-1 text-xs font-medium transition",
                    alasan === a
                      ? "border-rose-500 bg-rose-100/80 text-rose-800 dark:border-rose-400 dark:bg-rose-950/60 dark:text-rose-200 shadow-xs"
                      : "border-border/80 bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <Textarea
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Tuliskan alasan penolakan secara jelas dan santun..."
              aria-label="Alasan penolakan"
              className="bg-background"
            />
            <div className="flex items-center justify-between text-[11px] pt-0.5">
              {alasan.trim().length < 10 ? (
                <span className="text-amber-700 dark:text-amber-400 font-medium">
                  ⚠️ Pilih opsi di atas atau ketik min. 10 karakter ({alasan.trim().length}/10)
                </span>
              ) : (
                <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <Check className="size-3" /> Alasan penolakan siap dikirim ({alasan.trim().length} karakter)
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button variant="ghost" size="xl" onClick={() => setModeTolak(false)} disabled={sibuk}>
              Batal
            </Button>
            <Button
              variant="destructive"
              size="xl"
              className={cn("flex-1 cursor-pointer font-bold", alasan.trim().length < 10 && "opacity-80 hover:opacity-100")}
              onClick={tolak}
              disabled={sibuk}
            >
              {sibuk ? <Loader2 className="animate-spin" aria-hidden /> : <XCircle aria-hidden />}
              Tolak Laporan
            </Button>
          </div>
        </div>
      ) : (
        <>
          {serupa.length > 0 && (
            <fieldset className="space-y-1.5">
              <legend className="mb-1.5 flex items-center gap-1.5 text-sm font-bold">
                <GitMerge className="size-4 text-info" aria-hidden /> Gabungkan laporan serupa
              </legend>
              {serupa.map((s) => (
                <label key={s.id} className="flex cursor-pointer items-start gap-2.5 rounded-xl px-2 py-1.5 text-sm hover:bg-muted/60">
                  <Checkbox className="mt-0.5" checked={ikut.has(s.id)} onCheckedChange={(v) => setIkut((x) => {
                    const n = new Set(x);
                    if (v) n.add(s.id); else n.delete(s.id);
                    return n;
                  })} />
                  <span className="min-w-0">
                    <span className="block font-mono text-xs">{s.kode}</span>
                    <span className="line-clamp-2 text-xs text-muted-foreground">{s.ringkas}</span>
                  </span>
                </label>
              ))}
            </fieldset>
          )}

          <fieldset className="space-y-1.5">
            <legend className="mb-1.5 text-sm font-bold">Masuk ke kasus</legend>
            <label className={cn("flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 text-sm", tujuan === "baru" && "border-primary bg-secondary/50")}>
              <input type="radio" name="tujuan" className="accent-[var(--primary)]" checked={tujuan === "baru"} onChange={() => setTujuan("baru")} />
              <FolderPlus className="size-4 text-primary" aria-hidden /> Kasus baru
            </label>
            {tujuan === "baru" && (
              <input value={judul} onChange={(e) => setJudul(e.target.value)} maxLength={140} aria-label="Judul kasus (tampil publik)"
                className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50" />
            )}
            {kasusTerbuka.map((k) => (
              <label key={k.id} className={cn("flex cursor-pointer items-start gap-2.5 rounded-xl border px-3 py-2 text-sm", tujuan === k.id && "border-primary bg-secondary/50")}>
                <input type="radio" name="tujuan" className="mt-1 accent-[var(--primary)]" checked={tujuan === k.id} onChange={() => setTujuan(k.id)} />
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 font-medium"><GitMerge className="size-4 text-info" aria-hidden /> Gabung {k.kode}</span>
                  <span className="line-clamp-1 text-xs text-muted-foreground">{k.judul} · {k.jumlah} laporan</span>
                </span>
              </label>
            ))}
          </fieldset>

          <Textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} rows={2} maxLength={1000}
            placeholder="Catatan untuk timeline (opsional)" aria-label="Catatan verifikasi" />

          <div className="flex gap-2">
            <Button variant="outline" size="xl" onClick={() => setModeTolak(true)} disabled={sibuk}>
              <XCircle aria-hidden /> Tolak
            </Button>
            <Button size="xl" className="flex-1" onClick={verifikasi} disabled={sibuk || !lengkap}
              title={lengkap ? undefined : "Centang semua pemeriksaan dulu"}>
              {sibuk ? <Loader2 className="animate-spin" aria-hidden /> : lengkap ? <ShieldCheck aria-hidden /> : <Check aria-hidden />}
              Verifikasi{ikut.size ? ` ${ikut.size + 1}` : ""}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
