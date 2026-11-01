import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/situs/footer";
import { TopNavbarSlot } from "@/components/situs/top-navbar-slot";
import { WidgetDarurat } from "@/components/situs/widget-darurat";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITUS_URL ?? "https://pantaugizi.vercel.app"),
  title: {
    default: "PMBGM · Pemantau MBG Masyarakat",
    template: "%s · PMBGM",
  },
  description:
    "PMBGM (Pemantau MBG Masyarakat) — Laporkan masalah Makan Bergizi Gratis, pantau tindak lanjutnya secara terbuka, dan cek kepatuhan higienitas dapur SPPG anak Anda.",
  openGraph: {
    title: "PMBGM · Pemantau MBG Masyarakat",
    description: "Platform pengawasan independen dan akuntabilitas terbuka Program Makan Bergizi Gratis (MBG).",
    url: "/",
    siteName: "PMBGM",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Logo PMBGM",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "PMBGM · Pemantau MBG Masyarakat",
    description: "Platform pengawasan independen masyarakat untuk transparansi dan mutu Program Makan Bergizi Gratis.",
    images: ["/icon.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f6b57",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${jakarta.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground antialiased selection:bg-primary/15 selection:text-primary flex flex-col">
        <a
          href="#konten"
          className="sr-only z-50 rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Lewati ke konten
        </a>
        <TooltipProvider>
          <div className="flex min-h-screen flex-col">
            <TopNavbarSlot />
            <main id="konten" className="flex-1 min-w-0">
              {children}
            </main>
            <Suspense fallback={null}>
              <Footer />
            </Suspense>
          </div>
          <Suspense fallback={null}>
            <WidgetDarurat />
          </Suspense>
          <Toaster position="top-center" richColors />
        </TooltipProvider>
      </body>
    </html>
  );
}
