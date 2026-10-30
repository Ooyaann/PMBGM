import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Lock,
  Megaphone,
  School,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Users,
  Utensils,
} from "lucide-react";
import { DaftarNotifikasi, AksiSelesai, FormProfil } from "@/components/akun/aksi-akun";
import { BadgeStatus } from "@/components/data/badge";
import { IKON_KATEGORI } from "@/components/data/ikon-kategori";
import { Waktu } from "@/components/data/waktu";
import { PenyegarRealtime } from "@/components/lacak/penyegar-realtime";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ambilLaporanSaya, ambilNotifikasi, ambilProfil } from "@/lib/data/akun";
import { KATEGORI } from "@/lib/label";
import { ambilPengguna, LABEL_PERAN } from "@/lib/sesi";
import { buatKlienServer } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Profil & Pengaturan Akun - PMBGM",
  robots: { index: false, follow: false },
};

async function Isi() {
  const p = await ambilPengguna();
  if (!p) redirect("/masuk?lanjut=/akun");

  const adalahStaf = p.peran !== "pelapor";

  // Data fetching
  const [laporan, notif, profil] = await Promise.all([
    adalahStaf ? Promise.resolve([]) : ambilLaporanSaya(p.id),
    ambilNotifikasi(p.id),
    ambilProfil(p.id),
  ]);

  let infoSekolah: { nama: string; npsn: string | null; sppgNama: string | null; sppgId: string | null } | null = null;
  if (p.sekolahId) {
    const supabase = await buatKlienServer();
    const { data: sek } = await supabase
      .from("sekolah")
      .select("nama, npsn, sppg:sppg_id (id, nama)")
      .eq("id", p.sekolahId)
      .maybeSingle();
    if (sek) {
      infoSekolah = {
        nama: sek.nama,
        npsn: sek.npsn,
        sppgNama: (sek.sppg as { nama: string } | null)?.nama ?? null,
        sppgId: (sek.sppg as { id: string } | null)?.id ?? null,
      };
    }
  }

  let infoInstansi: { nama: string; jenis: string } | null = null;
  if (p.instansiId) {
    const supabase = await buatKlienServer();
    const { data: inst } = await supabase
      .from("instansi")
      .select("nama, jenis")
      .eq("id", p.instansiId)
      .maybeSingle();
    if (inst) {
      infoInstansi = { nama: inst.nama, jenis: inst.jenis };
    }
  }

  // ==========================================
  // TAMPILAN KHUSUS STAF / PETUGAS (Verifikator, Dapur, Dinkes, Korwil, Admin)
  // ==========================================
  if (adalahStaf) {
    const peranKunci = p.peran;
    const instansiJenis = infoInstansi?.jenis ?? "";

    // Konfigurasi identitas peran staf
    let labelPeranLengkap = "Petugas Resmi PMBGM";
    let namaInstansiResmi = infoInstansi?.nama ?? "Unit Kerja Wilayah";
    let deskripsiPeran = "Memiliki kewenangan operasional dalam pemantauan program Makan Bergizi Gratis.";
    let IkonPeran = ShieldCheck;
    let daftarTugas: { judul: string; deskripsi: string; href: string; ikon: typeof ClipboardCheck; warna: string }[] = [];

    if (peranKunci === "verifikator") {
      labelPeranLengkap = "Tim Verifikator Wilayah";
      namaInstansiResmi = "Tim Verifikasi Independen MBG";
      deskripsiPeran = "Bertanggung jawab meninjau laporan aduan warga, memvalidasi bukti foto dan lokasi, serta menetapkan disposisi penerusan ke instansi terkait.";
      IkonPeran = ClipboardCheck;
      daftarTugas = [
        {
          judul: "Antrean Verifikasi",
          deskripsi: "Periksa foto bukti dan laporan masuk warga untuk validasi kelayakan kasus.",
          href: "/panel/verifikasi",
          ikon: ClipboardCheck,
          warna: "text-primary bg-secondary border-primary/20",
        },
        {
          judul: "Kasus Berjalan",
          deskripsi: "Pantau perkembangan kasus yang telah diteruskan ke dapur SPPG atau instansi pengawas.",
          href: "/panel/kasus",
          ikon: FileText,
          warna: "text-info bg-info-lembut border-info/20",
        },
        {
          judul: "Dasbor Panel Kerja",
          deskripsi: "Tinjau rekap beban kerja harian, kecepatan respons verifikasi, dan performa SLA.",
          href: "/panel",
          ikon: LayoutDashboard,
          warna: "text-primary bg-secondary border-primary/20",
        },
        {
          judul: "Panduan Operasional",
          deskripsi: "Pelajari SOP verifikasi bukti, pedoman etika, dan cara kerja algoritma DSS SAW.",
          href: "/panduan",
          ikon: BookOpen,
          warna: "text-info bg-info-lembut border-info/20",
        },
      ];
    } else if (peranKunci === "admin") {
      labelPeranLengkap = "Administrator Sistem PMBGM";
      namaInstansiResmi = "Pusat Kendali Data & Sistem PMBGM";
      deskripsiPeran = "Memiliki kewenangan penuh untuk tata kelola pengguna, audit log keamanan, pemantauan sistem, dan integrasi master data.";
      IkonPeran = Settings;
      daftarTugas = [
        {
          judul: "Dasbor Panel Utama",
          deskripsi: "Tinjau metrik agregat nasional, tren laporan, dan status keseluruhan modul.",
          href: "/panel",
          ikon: LayoutDashboard,
          warna: "text-primary bg-secondary border-primary/20",
        },
        {
          judul: "Kelola Pengguna",
          deskripsi: "Manajemen akun petugas, verifikator wilayah, dan instansi penanggung jawab.",
          href: "/panel/admin/pengguna",
          ikon: Users,
          warna: "text-info bg-info-lembut border-info/20",
        },
        {
          judul: "Antrean Verifikasi",
          deskripsi: "Tinjau atau ambil alih verifikasi kasus darurat yang membutuhkan percepatan.",
          href: "/panel/verifikasi",
          ikon: ClipboardCheck,
          warna: "text-primary bg-secondary border-primary/20",
        },
        {
          judul: "Peta Analisis Risiko",
          deskripsi: "Pantau sebaran risiko wilayah dan evaluasi bobot SAW antar dapur dan sekolah.",
          href: "/insight",
          ikon: ShieldAlert,
          warna: "text-risiko-tinggi bg-risiko-tinggi-lembut border-risiko-tinggi/20",
        },
      ];
    } else if (instansiJenis === "sppg" || p.nama.toLowerCase().includes("dapur") || p.nama.toLowerCase().includes("sppg")) {
      labelPeranLengkap = "Penyedia Pangan (Mitra SPPG)";
      namaInstansiResmi = infoInstansi?.nama ?? "Dapur Sentra Pelayanan Pangan (SPPG)";
      deskripsiPeran = "Bertanggung jawab atas kualitas menu, higienitas pangan, dan penyampaian bukti perbaikan jika ada keluhan dari sekolah penerima.";
      IkonPeran = Utensils;
      daftarTugas = [
        {
          judul: "Keluhan & Kasus Masuk",
          deskripsi: "Tinjau keluhan mutu atau distribusi dari sekolah dan unggah bukti perbaikan dapur.",
          href: "/panel/kasus",
          ikon: FileText,
          warna: "text-risiko-sedang bg-risiko-sedang-lembut border-risiko-sedang/20",
        },
        {
          judul: "Dasbor Kinerja Dapur",
          deskripsi: "Pantau rekap kepatuhan SLA, rating kepuasan sekolah, dan histori tindakan.",
          href: "/panel",
          ikon: LayoutDashboard,
          warna: "text-primary bg-secondary border-primary/20",
        },
        {
          judul: "Panduan Standar Higiene",
          deskripsi: "Pelajari protokol kepatuhan SLHS dan SOP sanitasi pangan bergizi anak.",
          href: "/panduan",
          ikon: BookOpen,
          warna: "text-info bg-info-lembut border-info/20",
        },
      ];
    } else if (instansiJenis === "dinas_kesehatan" || p.nama.toLowerCase().includes("dinkes") || p.nama.toLowerCase().includes("hendra")) {
      labelPeranLengkap = "Dinas Kesehatan Wilayah";
      namaInstansiResmi = infoInstansi?.nama ?? "Dinas Kesehatan Kota";
      deskripsiPeran = "Otoritas pengawasan medis, investigasi sampel dugaan keracunan makanan, dan audit sertifikat laik higiene sanitasi (SLHS).";
      IkonPeran = Building2;
      daftarTugas = [
        {
          judul: "Investigasi Kasus Medis",
          deskripsi: "Tindak lanjuti kasus keluhan kesehatan anak dan pencatatan hasil laboratorium.",
          href: "/panel/kasus",
          ikon: FileText,
          warna: "text-risiko-tinggi bg-risiko-tinggi-lembut border-risiko-tinggi/20",
        },
        {
          judul: "Peta Analisis Risiko",
          deskripsi: "Pantau klaster kerawanan pangan dan riwayat temuan insidental di wilayah binaan.",
          href: "/insight",
          ikon: ShieldAlert,
          warna: "text-risiko-sedang bg-risiko-sedang-lembut border-risiko-sedang/20",
        },
        {
          judul: "Dasbor Pengawasan",
          deskripsi: "Tinjau statistik kepatuhan SLHS dan pemantauan cepat batas waktu penanganan.",
          href: "/panel",
          ikon: LayoutDashboard,
          warna: "text-primary bg-secondary border-primary/20",
        },
      ];
    } else {
      labelPeranLengkap = "Pengawas Wilayah (Korwil BGN)";
      namaInstansiResmi = infoInstansi?.nama ?? "Badan Gizi Nasional (BGN)";
      deskripsiPeran = "Mengawasi ketepatan batas waktu penanganan (SLA), mengoordinasikan respon lintas sektor, dan menjamin kelancaran distribusi MBG.";
      IkonPeran = Users;
      daftarTugas = [
        {
          judul: "Pengawasan Kasus & SLA",
          deskripsi: "Pantau kecepatan respons instansi dan eskalasikan kasus yang melewati ambang batas SLA.",
          href: "/panel/kasus",
          ikon: FileText,
          warna: "text-info bg-info-lembut border-info/20",
        },
        {
          judul: "Peta Analisis Risiko",
          deskripsi: "Pantau sebaran sekolah dan beban layanan SPPG di seluruh kecamatan binaan.",
          href: "/insight",
          ikon: ShieldAlert,
          warna: "text-primary bg-secondary border-primary/20",
        },
        {
          judul: "Dasbor Pengawasan Kota",
          deskripsi: "Tinjau ringkasan performa pemenuhan standar program MBG tingkat kota.",
          href: "/panel",
          ikon: LayoutDashboard,
          warna: "text-info bg-info-lembut border-info/20",
        },
      ];
    }

    return (
      <div className="space-y-6">
        {/* Header Profil Staf */}
        <header className="flex flex-wrap items-start justify-between gap-4 rounded-3xl border bg-card/60 p-6 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
              <IkonPeran className="size-7" />
            </span>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{p.nama}</h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-risiko-rendah-lembut px-2.5 py-0.5 text-xs font-bold text-risiko-rendah">
                  <CheckCircle2 className="size-3.5" /> Terverifikasi
                </span>
              </div>
              <p className="text-sm font-semibold text-primary">{labelPeranLengkap}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Building2 className="size-3.5" /> {namaInstansiResmi}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <PenyegarRealtime kanal={`akun-${p.id}`} langganan={[{ tabel: "notifikasi", event: "INSERT", filter: `pengguna_id=eq.${p.id}` }]} />
            <Link href="/panel" className={buttonVariants({ variant: "default", size: "lg" })}>
              <LayoutDashboard className="size-4" /> Buka Panel Kerja
            </Link>
            <FormProfil nama={profil?.nama_tampilan ?? p.nama} jenis={null} hanyaNama={true} />
          </div>
        </header>

        {/* Konten Grid Petugas */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-6">
            {/* Kartu Wewenang Operasional */}
            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="size-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-foreground">Wewenang Operasional & Tanggung Jawab</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{deskripsiPeran}</p>
                </div>
              </div>
            </div>

            {/* Modul Pintasan Tugas Utama */}
            <section aria-labelledby="judul-tugas-petugas" className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 id="judul-tugas-petugas" className="font-extrabold text-lg text-foreground">
                  Modul & Tugas Kerja
                </h2>
                <span className="text-xs text-muted-foreground">Pintasan langsung ke modul tugas</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {daftarTugas.map((t) => {
                  const Ikon = t.ikon;
                  return (
                    <Link
                      key={t.judul}
                      href={t.href}
                      className="group flex flex-col justify-between rounded-2xl border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={cn("flex size-9 items-center justify-center rounded-xl border text-sm", t.warna)}>
                            <Ikon className="size-4" />
                          </span>
                          <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                            {t.judul}
                          </h4>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {t.deskripsi}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Standar Integritas & Keamanan */}
            <div className="rounded-2xl border bg-card p-4 text-xs text-muted-foreground space-y-2">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Lock className="size-3.5 text-primary" /> Perlindungan Privasi & Keamanan Sistem
              </div>
              <p className="leading-relaxed">
                Seluruh aktivitas penanganan laporan dicatat dalam audit trail sistem. Data identitas pelapor mode rahasia hanya dapat diakses oleh verifikator berwenang sesuai amanat UU Perlindungan Data Pribadi (UU PDP No. 27/2022).
              </p>
            </div>
          </div>

          {/* Sisi Kanan: Notifikasi Staf & Ringkasan Akun */}
          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <DaftarNotifikasi daftar={notif.daftar} belumDibaca={notif.belumDibaca} />

            <div className="rounded-3xl border bg-card p-4 sm:p-5 space-y-3">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" /> Status Akun Resmi
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">ID Pengguna</span>
                  <span className="font-mono text-[11px] truncate max-w-[140px]">{p.id}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Hak Akses</span>
                  <span className="font-semibold text-foreground capitalize">{LABEL_PERAN[p.peran]}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Status Autentikasi</span>
                  <span className="font-semibold text-risiko-rendah">Aktif & Terverifikasi</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  // ==========================================
  // TAMPILAN PELAPOR WARGA / ORANG TUA / GURU
  // ==========================================
  const aktif = laporan.filter((l) => !["selesai", "ditolak"].includes(l.status)).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-extrabold">
            {p.nama}
            {p.terverifikasi && <BadgeCheck className="size-6 text-risiko-rendah" aria-label="Pelapor terverifikasi" />}
          </h1>
          <p className="text-sm text-muted-foreground">
            {LABEL_PERAN[p.peran]}{p.terverifikasi ? " terverifikasi" : ""} · {laporan.length} laporan · {aktif} berjalan
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PenyegarRealtime kanal={`akun-${p.id}`} langganan={[{ tabel: "notifikasi", event: "INSERT", filter: `pengguna_id=eq.${p.id}` }]} />
          <FormProfil nama={profil?.nama_tampilan ?? p.nama} jenis={profil?.jenis_pelapor ?? null} />
        </div>
      </header>

      {infoSekolah && (
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <School className="size-6" />
              </span>
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary uppercase">
                  {profil?.jenis_pelapor === "guru" ? "Sekolah yang Didampingi (Akun Guru)" : "Sekolah Anak Tercatat"}
                </span>
                <h3 className="font-extrabold text-lg">{infoSekolah.nama}</h3>
                {infoSekolah.sppgNama && (
                  <p className="text-xs text-muted-foreground">
                    Dapur Mitra MBG: <span className="font-semibold text-foreground">{infoSekolah.sppgNama}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {infoSekolah.sppgId && (
                <Link
                  href={`/data/sppg/${infoSekolah.sppgId}`}
                  className="rounded-xl border bg-card px-3 py-1.5 text-xs font-semibold hover:border-primary/40 transition"
                >
                  Rapor Dapur Mitra
                </Link>
              )}
              <Link
                href={`/lapor?sekolahId=${p.sekolahId}`}
                className="rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition"
              >
                {profil?.jenis_pelapor === "guru" ? "Lapor untuk Sekolah" : "Lapor untuk Sekolah Anak"}
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section aria-labelledby="judul-laporan" className="space-y-3">
          <h2 id="judul-laporan" className="font-bold">Laporan saya</h2>
          {laporan.length ? (
            <ul className="space-y-3">
              {laporan.map((l) => {
                const Ikon = IKON_KATEGORI[l.kategori] ?? Megaphone;
                const namaKategori = KATEGORI[l.kategori]?.label ?? "Laporan MBG";
                const selesai = l.status === "selesai";
                return (
                  <li key={l.id} className={cn("rounded-3xl border bg-card p-4", selesai && !l.rating && "border-primary/40")}>
                    <div className="flex items-start gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                        <Ikon className="size-5" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="font-semibold">{namaKategori}</span>
                          <BadgeStatus status={l.status} />
                        </p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                          <span className="font-mono">{l.kodeTiket}</span>
                          <span className="flex items-center gap-1">
                            <School className="size-3.5" aria-hidden />
                            {l.sekolah}
                          </span>
                          {l.kasus?.instansi && (
                            <span className="flex items-center gap-1">
                              <Building2 className="size-3.5" aria-hidden />
                              {l.kasus.instansi}
                            </span>
                          )}
                          <Waktu iso={l.dibuatPada} />
                        </p>
                      </div>
                      <Link
                        href={`/lacak?tiket=${l.kodeTiket}`}
                        aria-label={`Lihat perkembangan ${l.kodeTiket}`}
                        className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <ArrowUpRight className="size-4" aria-hidden />
                      </Link>
                    </div>
                    {l.status === "ditolak" && l.alasanTolak && (
                      <p className="mt-3 rounded-2xl bg-muted/60 p-3 text-sm text-muted-foreground">{l.alasanTolak}</p>
                    )}
                    {selesai && (
                      <div className="mt-3">
                        <AksiSelesai laporanId={l.id} rating={l.rating} bisaBukaUlang={l.bisaBukaUlang} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-3xl border bg-card p-10 text-center">
              <Megaphone className="size-8 text-primary" aria-hidden />
              <p className="text-sm text-muted-foreground">Belum ada laporan</p>
              <Link href="/lapor" className={buttonVariants({ size: "xl" })}>
                <Megaphone aria-hidden /> Lapor
              </Link>
            </div>
          )}
        </section>
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <DaftarNotifikasi daftar={notif.daftar} belumDibaca={notif.belumDibaca} />
        </aside>
      </div>
    </div>
  );
}

export default function HalamanAkun() {
  return (
    <div className="kontainer py-8 sm:py-10">
      <Suspense fallback={<div className="space-y-6"><Skeleton className="h-12 w-64" /><Skeleton className="h-96 rounded-3xl" /></div>}>
        <Isi />
      </Suspense>
    </div>
  );
}
