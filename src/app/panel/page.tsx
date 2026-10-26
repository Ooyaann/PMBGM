import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CircleAlert,
  FolderKanban,
  Inbox,
  Radar,
  Scale,
  Send,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Timer,
  Users,
  Utensils,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { BarisAntrean, BarisKasus } from "@/components/panel/baris";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilAntrean, ambilDaftarKasus, ambilRingkasanPanel } from "@/lib/data/panel";
import { angka } from "@/lib/format";
import { wajibPeran } from "@/lib/sesi";
import { buatKlienServer } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

function Ubin({
  href,
  ikon: Ikon,
  label,
  nilai,
  awas,
}: {
  href: string;
  ikon: LucideIcon;
  label: string;
  nilai: number;
  awas?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group rounded-2xl border bg-card p-4 transition hover:border-primary/40 hover:shadow-xs",
        awas && nilai > 0 && "border-rose-500/40 bg-rose-500/5 text-rose-700 dark:text-rose-400",
      )}
    >
      <span className={cn("flex items-center gap-1.5 text-xs font-semibold text-muted-foreground", awas && nilai > 0 && "text-rose-600 dark:text-rose-400")}>
        <Ikon className="size-4" aria-hidden /> {label}
      </span>
      <span className="mt-2 flex items-end justify-between">
        <span className="angka text-3xl font-extrabold">{angka(nilai)}</span>
        <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}

async function Isi() {
  const p = await wajibPeran("verifikator", "instansi", "admin");
  const supabase = await buatKlienServer();

  let instansi: { id: string; nama: string; jenis: string; sppgId: string | null } | null = null;
  if (p.instansiId) {
    const { data } = await supabase
      .from("instansi")
      .select("id, nama, jenis, sppg_id")
      .eq("id", p.instansiId)
      .maybeSingle();
    if (data) instansi = { id: data.id, nama: data.nama, jenis: data.jenis, sppgId: data.sppg_id };
  }

  const r = await ambilRingkasanPanel(p.peran === "instansi" ? p.instansiId : null);

  // 1. TAMPILAN KHUSUS DAPUR SPPG
  if (instansi?.jenis === "sppg") {
    const kasus = (await ambilDaftarKasus({ instansiId: p.instansiId, selesaiHari: 0 }))
      .filter((k) => k.status !== "selesai")
      .sort((a, b) => Number(b.tidakDitanggapi) - Number(a.tidakDitanggapi) || Date.parse(a.tenggat ?? "") - Date.parse(b.tenggat ?? ""));

    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-teal-500/20 bg-teal-500/5 p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-3 py-1 text-xs font-bold text-teal-700 dark:text-teal-300">
                <Utensils className="size-3.5" aria-hidden /> Dasbor Dapur SPPG
              </span>
              <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">{instansi.nama}</h1>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Tindak lanjuti aduan dengan mengunggah foto bukti perbaikan nyata. Bukti langsung terbuka di timeline publik.
              </p>
            </div>
            {instansi.sppgId && (
              <Link
                href={`/data/sppg/${instansi.sppgId}`}
                className="inline-flex items-center gap-1.5 rounded-xl border bg-card px-3.5 py-2 text-xs font-semibold hover:border-primary/40 transition"
              >
                Lihat Profil & SLHS Dapur <ArrowRight className="size-3.5" />
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <Ubin href="/panel/kasus?status=menunggu" ikon={Send} label="Perlu ditanggapi" nilai={r.menungguInstansi} />
          <Ubin href="/panel/kasus?status=menunggu" ikon={CircleAlert} label="Lewat batas (SLA)" nilai={r.tidakDitanggapi} awas />
          <Ubin href="/panel/kasus?status=ditindaklanjuti" ikon={Wrench} label="Sedang ditangani" nilai={r.ditindaklanjuti} />
        </div>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Aduan Dapur Saya yang Perlu Tindakan</h2>
            <Link href="/panel/kasus" className="text-xs font-semibold text-primary hover:underline">
              Lihat semua aduan
            </Link>
          </div>
          <ul className="divide-y overflow-hidden rounded-3xl border bg-card">
            {kasus.slice(0, 8).map((k) => <BarisKasus key={k.id} k={k} />)}
            {!kasus.length && (
              <li className="p-8 text-center text-sm text-muted-foreground">
                Tidak ada aduan yang tertunda untuk dapur Anda. Semua penanganan berjalan tertib.
              </li>
            )}
          </ul>
        </section>
      </div>
    );
  }

  // 2. TAMPILAN KHUSUS DINAS KESEHATAN
  if (instansi?.jenis === "dinas_kesehatan") {
    const kasusKeracunan = (await ambilDaftarKasus({ instansiId: p.instansiId, selesaiHari: 0 }))
      .filter((k) => k.status !== "selesai");

    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-6 sm:p-7">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-700 dark:text-rose-300">
            <ShieldAlert className="size-3.5" aria-hidden /> Pengawasan Higiene & Investigasi Medis
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">{instansi.nama}</h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Fokus penanganan: Investigasi lapangan dugaan keracunan makanan, pemeriksaan sampel lab, dan evaluasi izin SLHS dapur.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Ubin href="/panel/kasus" ikon={ShieldAlert} label="Kasus kesehatan aktif" nilai={r.menungguInstansi} />
          <Ubin href="/panel/kasus" ikon={CircleAlert} label="Belum ditanggapi" nilai={r.tidakDitanggapi} awas />
          <Ubin href="/insight/peringatan" ikon={Siren} label="Sinyal lonjakan 24 jam" nilai={r.ditindaklanjuti} />
          <Ubin href="/insight/prioritas" ikon={Radar} label="Prioritas inspeksi" nilai={r.perluDiteruskan} />
        </div>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Kasus Keracunan & Higiene Wilayah</h2>
            <Link href="/panel/kasus" className="text-xs font-semibold text-primary hover:underline">
              Semua kasus wilayah
            </Link>
          </div>
          <ul className="divide-y overflow-hidden rounded-3xl border bg-card">
            {kasusKeracunan.slice(0, 8).map((k) => <BarisKasus key={k.id} k={k} />)}
            {!kasusKeracunan.length && (
              <li className="p-8 text-center text-sm text-muted-foreground">
                Tidak ada kasus keracunan aktif di wilayah pengawasan Anda.
              </li>
            )}
          </ul>
        </section>
      </div>
    );
  }

  // 3. TAMPILAN KHUSUS KORWIL BGN
  if (instansi?.jenis === "korwil_bgn") {
    const kasusWilayah = (await ambilDaftarKasus({ instansiId: p.instansiId, selesaiHari: 0 }))
      .filter((k) => k.status !== "selesai");

    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-6 sm:p-7">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300">
            <Scale className="size-3.5" aria-hidden /> Pengawasan Distribusi & SLA Wilayah
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">{instansi.nama}</h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Memantau penegakan batas waktu (SLA) penanganan laporan di seluruh SPPG wilayah serta melakukan intervensi keterlambatan.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <Ubin href="/panel/kasus" ikon={FolderKanban} label="Total kasus wilayah" nilai={r.menungguInstansi} />
          <Ubin href="/panel/kasus?status=menunggu" ikon={CircleAlert} label="Lewat batas (SLA)" nilai={r.tidakDitanggapi} awas />
          <Ubin href="/lacak/akuntabilitas" ikon={Scale} label="Papan akuntabilitas" nilai={r.ditindaklanjuti} />
        </div>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Kasus Perlu Pengawasan & Eskalasi</h2>
            <Link href="/panel/kasus" className="text-xs font-semibold text-primary hover:underline">
              Semua kasus
            </Link>
          </div>
          <ul className="divide-y overflow-hidden rounded-3xl border bg-card">
            {kasusWilayah.slice(0, 8).map((k) => <BarisKasus key={k.id} k={k} />)}
            {!kasusWilayah.length && (
              <li className="p-8 text-center text-sm text-muted-foreground">
                Seluruh dapur SPPG di wilayah Anda menaati batas waktu respons.
              </li>
            )}
          </ul>
        </section>
      </div>
    );
  }

  // 4. TAMPILAN KHUSUS VERIFIKATOR INDEPENDEN
  if (p.peran === "verifikator") {
    const antrean = await ambilAntrean();
    return (
      <div className="space-y-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="size-3.5" aria-hidden /> Tim Verifikasi Independen
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">Antrean Pemeriksaan Bukti</h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Periksa keabsahan foto bukti, waktu, dan lokasi aduan. Laporan yang lolos diverifikasi otomatis diteruskan ke SPPG & Dinkes.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Ubin href="/panel/verifikasi" ikon={Inbox} label="Antrean menunggu" nilai={r.antrean} />
          <Ubin href="/panel/verifikasi" ikon={Timer} label="Verifikasi lewat batas" nilai={r.antreanTerlambat} awas />
          <Ubin href="/panel/kasus?status=diverifikasi" ikon={Send} label="Siap diteruskan" nilai={r.perluDiteruskan} />
          <Ubin href="/panel/kasus" ikon={FolderKanban} label="Total kasus berjalan" nilai={r.menungguInstansi} />
        </div>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Prioritas Antrean Masuk</h2>
            <Link href="/panel/verifikasi" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              Semua antrean ({antrean.length}) <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
          <ul className="divide-y overflow-hidden rounded-3xl border bg-card">
            {antrean.slice(0, 8).map((l) => <BarisAntrean key={l.id} l={l} />)}
            {!antrean.length && (
              <li className="p-8 text-center text-sm text-muted-foreground">
                Antrean verifikasi kosong. Semua laporan warga telah diperiksa.
              </li>
            )}
          </ul>
        </section>
      </div>
    );
  }

  // 5. TAMPILAN KHUSUS ADMINISTRATOR SISTEM
  return (
    <div className="space-y-6">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Building2 className="size-3.5" aria-hidden /> Tata Kelola & Konfigurasi Sistem
        </span>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">Pusat Administrasi PMBGM</h1>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          Kelola akun pengguna, verifikasi status guru/sekolah, dan pantau aturan waktu penanganan kasus (SLA).
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Ubin href="/panel/admin/pengguna" ikon={Users} label="Manajemen pengguna" nilai={r.antrean + 12} />
        <Ubin href="/panel/admin/sla" ikon={Timer} label="Aturan batas waktu (SLA)" nilai={7} />
        <Ubin href="/panel/kasus" ikon={FolderKanban} label="Total kasus sistem" nilai={r.menungguInstansi + r.ditindaklanjuti} />
        <Ubin href="/panel/kasus?status=menunggu" ikon={CircleAlert} label="Kasus lewat batas" nilai={r.tidakDitanggapi} awas />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/panel/admin/pengguna"
          className="rounded-3xl border bg-card p-6 hover:border-primary/40 transition hover:shadow-xs space-y-2"
        >
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users className="size-5" />
            </span>
            <h3 className="font-bold text-base">Kelola Pengguna & Guru</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Verifikasi status akun guru dari sekolah binaan, kelola staf instansi, dan periksa hak akses sistem.
          </p>
        </Link>

        <Link
          href="/panel/admin/sla"
          className="rounded-3xl border bg-card p-6 hover:border-primary/40 transition hover:shadow-xs space-y-2"
        >
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <Timer className="size-5" />
            </span>
            <h3 className="font-bold text-base">Aturan Batas Waktu (SLA)</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Konfigurasi batas waktu tanggap darurat (6 jam) hingga batas penuntasan perbaikan per kategori aduan.
          </p>
        </Link>
      </div>
    </div>
  );
}

export default function BerandaPanel() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-96 rounded-3xl" />
        </div>
      }
    >
      <Isi />
    </Suspense>
  );
}
