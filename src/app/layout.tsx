import type { Metadata, Viewport } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/situs/footer";
import { SidebarGlobalSlot } from "@/components/situs/sidebar-global-slot";
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
  title: {
    default: "PMBGM · Pemantau MBG Masyarakat",
    template: "%s · PMBGM",
  },
  description:
    "PMBGM (Pemantau MBG Masyarakat) — Laporkan masalah Makan Bergizi Gratis, pantau tindak lanjutnya secara terbuka, dan cek kepatuhan higienitas dapur SPPG anak Anda.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/logo-pmbgm-ikon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f6b57",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${jakarta.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <a
          href="#konten"
          className="sr-only z-50 rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Lewati ke konten
        </a>
        <TooltipProvider>
          <div className="flex min-h-screen flex-col lg:flex-row">
            <SidebarGlobalSlot />
            <div className="flex flex-1 flex-col min-w-0">
              <main id="konten" className="flex-1 min-w-0">
                {children}
              </main>
              <Footer />
            </div>
          </div>
          <Toaster position="top-center" richColors />
        </TooltipProvider>
      </body>
    </html>
  );
}
