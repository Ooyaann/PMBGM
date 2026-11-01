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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITUS_URL ?? "https://pantau-gizi-three.vercel.app"),
  title: {
    default: "PMBGM — Kawal Gizi, Jaga Generasi",
    template: "%s · PMBGM",
  },
  description:
    "Platform pengawasan partisipatif masyarakat untuk memantau mutu porsi, higienitas dapur SPPG, dan transparansi distribusi Makan Bergizi Gratis (MBG) di sekolah anak Anda.",
  keywords: [
    "PMBGM",
    "Makan Bergizi Gratis",
    "MBG",
    "SPPG",
    "Pengawasan MBG",
    "Gizi Anak Sekolah",
    "Lapor MBG",
    "Pantau Gizi",
  ],
  authors: [{ name: "Tim Ctrl Win Enter" }],
  creator: "Tim Ctrl Win Enter (MIA 2026)",
  publisher: "PMBGM",
  openGraph: {
    title: "PMBGM — Kawal Gizi, Jaga Generasi",
    description:
      "Kawal mutu porsi, higienitas dapur SPPG, dan transparansi distribusi Makan Bergizi Gratis (MBG) di sekolah anak Anda. Pantau dan laporkan secara terbuka.",
    url: "https://pantau-gizi-three.vercel.app",
    siteName: "PMBGM",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PMBGM — Platform Pengawasan Mutu & Transparansi Makan Bergizi Gratis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PMBGM — Kawal Gizi, Jaga Generasi",
    description:
      "Kawal mutu porsi, higienitas dapur SPPG, dan transparansi distribusi Makan Bergizi Gratis (MBG) di sekolah anak Anda.",
    images: ["/og-image.png"],
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
