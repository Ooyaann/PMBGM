import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { masukDemo, type KunciDemo } from "@/lib/aksi/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kunci = searchParams.get("kunci") as KunciDemo | null;
  const lanjut = searchParams.get("lanjut") || "/";

  if (kunci) {
    const hasil = await masukDemo(kunci);
    console.log(`[dev-login] masukDemo(${kunci}) result:`, hasil);
  }

  const cookieStore = await cookies();
  const host = request.headers.get("host") || "127.0.0.1:3000";
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const targetUrl = new URL(lanjut, `${protocol}://${host}`);
  const response = NextResponse.redirect(targetUrl);
  for (const c of cookieStore.getAll()) {
    response.cookies.set(c.name, c.value);
  }

  return response;
}

