/** Format angka dan waktu untuk pembaca Indonesia. */

const angkaFormatter = new Intl.NumberFormat("id-ID");
const persenFormatter = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 });
const waktuRelatif = new Intl.RelativeTimeFormat("id", { numeric: "auto" });

export function angka(n: number | null | undefined): string {
  return n == null ? "–" : angkaFormatter.format(n);
}

export function persen(n: number | null | undefined): string {
  return n == null ? "–" : `${persenFormatter.format(n)}%`;
}

/** Rupiah ringkas: Rp268 T, Rp1,9 T, Rp850 M, Rp12 jt. */
export function rupiahRingkas(n: number | null | undefined): string {
  if (n == null) return "–";
  const satuan: [number, string][] = [[1e12, "T"], [1e9, "M"], [1e6, "jt"]];
  for (const [batas, label] of satuan) {
    if (Math.abs(n) >= batas) {
      return `Rp${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(n / batas)} ${label}`;
    }
  }
  return `Rp${angkaFormatter.format(n)}`;
}

export function rupiah(n: number | null | undefined): string {
  return n == null ? "–" : `Rp${angkaFormatter.format(Math.round(n))}`;
}

export function tanggal(iso: string | Date, opsi: Intl.DateTimeFormatOptions = { dateStyle: "medium" }): string {
  return new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", ...opsi }).format(new Date(iso));
}

export function tanggalJam(iso: string | Date): string {
  return tanggal(iso, { dateStyle: "medium", timeStyle: "short" });
}

/** "3 jam lalu", "kemarin", "dalam 2 jam". */
export function relatif(iso: string | Date, sekarang = Date.now()): string {
  const detik = (new Date(iso).getTime() - sekarang) / 1000;
  const unit: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60],
  ];
  for (const [nama, panjang] of unit) {
    if (Math.abs(detik) >= panjang) return waktuRelatif.format(Math.round(detik / panjang), nama);
  }
  return "baru saja";
}

/** Durasi jam menjadi "5 jam" atau "2,3 hari". */
export function durasiJam(jam: number | null | undefined): string {
  if (jam == null) return "–";
  if (jam < 48) return `${persenFormatter.format(jam)} jam`;
  return `${persenFormatter.format(jam / 24)} hari`;
}

/** Batas SLA ringkas: 6 → "6 jam", 72 → "3 hari". */
export function batasJam(jam: number | null | undefined): string | undefined {
  if (jam == null) return undefined;
  return jam < 48 ? `${jam} jam` : `${Math.round(jam / 24)} hari`;
}
