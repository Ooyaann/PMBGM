import { createElement, type ReactElement } from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { ambilIndeksSemua, ambilPeringatan, ambilPeta } from "@/lib/data/insight";
import { ambilAkuntabilitas } from "@/lib/data/lacak";
import { ambilStatistik } from "@/lib/data/publik";
import { LaporanInsight } from "@/lib/pdf/laporan-insight";

/**
 * IN-07: unduh laporan ringkas Insight sebagai PDF.
 * Data dibaca dengan peran anon, jadi isinya sama dengan yang terlihat publik.
 */
export async function GET(request: Request) {
  const [statistik, { daftar: indeks }, peta, { daftar: peringatan, ditinjau }, { kecamatan }] = await Promise.all([
    ambilStatistik(), ambilIndeksSemua(), ambilPeta(), ambilPeringatan(), ambilAkuntabilitas(),
  ]);
  const dibuat = new Date().toISOString();

  const dokumen = createElement(LaporanInsight, {
    d: { dibuat, asal: new URL(request.url).origin, statistik, indeks, peta, peringatan, ditinjau, kecamatan },
  }) as unknown as ReactElement<DocumentProps>;
  const pdf = await renderToBuffer(dokumen);

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="pantaugizi-insight-${dibuat.slice(0, 10)}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
