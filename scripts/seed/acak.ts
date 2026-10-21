/**
 * Pembangkit angka acak deterministik (mulberry32).
 * Benih yang sama selalu menghasilkan data yang sama, sehingga seed online dan offline identik.
 */
export class Acak {
  private state: number;

  constructor(benih: number) {
    this.state = benih >>> 0;
  }

  /** Bilangan pecahan [0, 1). */
  next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Bilangan bulat [min, max] inklusif. */
  int(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }

  /** Bilangan pecahan [min, max). */
  antara(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  peluang(p: number): boolean {
    return this.next() < p;
  }

  pilih<T>(daftar: readonly T[]): T {
    return daftar[Math.floor(this.next() * daftar.length)];
  }

  /** Pilih kunci berdasarkan bobot. */
  berbobot<K extends string>(bobot: Readonly<Record<K, number>>): K {
    const entri = Object.entries(bobot) as [K, number][];
    const total = entri.reduce((s, [, b]) => s + b, 0);
    let r = this.next() * total;
    for (const [kunci, b] of entri) {
      r -= b;
      if (r < 0) return kunci;
    }
    return entri[entri.length - 1][0];
  }

  /** Distribusi mendekati normal (Box–Muller), dipotong di [min, max]. */
  normal(rata: number, simpangan: number, min = -Infinity, max = Infinity): number {
    const u = 1 - this.next();
    const v = this.next();
    const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    return Math.min(max, Math.max(min, rata + z * simpangan));
  }

  acakUrutan<T>(daftar: readonly T[]): T[] {
    const salinan = [...daftar];
    for (let i = salinan.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [salinan[i], salinan[j]] = [salinan[j], salinan[i]];
    }
    return salinan;
  }

  /** UUID v4 deterministik agar tautan data demo tetap sama di setiap seed. */
  uuid(): string {
    const hex = Array.from({ length: 32 }, () => Math.floor(this.next() * 16).toString(16));
    hex[12] = "4";
    hex[16] = ((parseInt(hex[16], 16) & 0x3) | 0x8).toString(16);
    const s = hex.join("");
    return `${s.slice(0, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}-${s.slice(16, 20)}-${s.slice(20)}`;
  }

  /** Kode tanpa karakter yang mudah tertukar, sama dengan public.buat_kode(). */
  kode(awalan: string, panjang: number): string {
    const alfabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    let hasil = awalan;
    for (let i = 0; i < panjang; i++) hasil += alfabet[Math.floor(this.next() * alfabet.length)];
    return hasil;
  }
}
