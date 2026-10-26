import { DATASET, LISENSI } from "@/lib/data/dataset";
import { buatKlienPublik } from "@/lib/supabase/publik";

const KORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
};

function keCsv(baris: Record<string, unknown>[], kolom: string[]): string {
  const sel = (v: unknown) => {
    if (v == null) return "";
    const s = typeof v === "object" ? JSON.stringify(v) : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  // BOM agar Excel membaca UTF-8 dengan benar.
  return "﻿" + [kolom.join(","), ...baris.map((b) => kolom.map((k) => sel(b[k])).join(","))].join("\r\n");
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: KORS });
}

/**
 * API data terbuka (DT-07): GET /api/v1/{dataset}?format=json|csv
 * Tanpa kunci API. Data dibaca dengan peran anon, jadi RLS membatasi ke data publik.
 */
export async function GET(request: Request, { params }: RouteContext<"/api/v1/[dataset]">) {
  const { dataset } = await params;
  const d = DATASET.find((x) => x.kunci === dataset);
  if (!d) {
    return Response.json(
      { galat: "Dataset tidak dikenal", tersedia: DATASET.map((x) => x.kunci) },
      { status: 404, headers: KORS },
    );
  }
  const format = new URL(request.url).searchParams.get("format") === "csv" ? "csv" : "json";

  // PostgREST membatasi 1.000 baris per permintaan; ambil per halaman sampai habis.
  const supabase = buatKlienPublik();
  const semua: Record<string, unknown>[] = [];
  for (let dari = 0; ; dari += 1000) {
    const { data, error } = await supabase.from(d.tabel as "wilayah").select(d.kolom).order(d.urut).range(dari, dari + 999);
    if (error) return Response.json({ galat: "Data belum bisa dibaca" }, { status: 503, headers: KORS });
    semua.push(...((data ?? []) as unknown as Record<string, unknown>[]));
    if (!data || data.length < 1000) break;
  }

  if (format === "csv") {
    return new Response(keCsv(semua, d.kolom.split(",")), {
      headers: {
        ...KORS,
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="pmbgm-${d.kunci}.csv"`,
      },
    });
  }
  return Response.json(
    { dataset: d.kunci, nama: d.nama, sumber: d.sumber, lisensi: LISENSI, jumlah: semua.length, data: semua },
    { headers: KORS },
  );
}
