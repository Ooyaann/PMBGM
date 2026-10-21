import type { Metadata, Viewport } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/situs/footer";
import { Header } from "@/components/situs/header";
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
    default: "PantauGizi · Pengawasan Partisipatif Makan Bergizi Gratis",
    template: "%s · PantauGizi",
  },
  description:
    "Laporkan masalah Makan Bergizi Gratis, pantau tindak lanjutnya secara terbuka, dan cek risiko dapur SPPG yang memasak untuk anak Anda.",
};

export const viewport: Viewport = {
  themeColor: "#0f6b57",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${jakarta.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#konten"
          className="sr-only z-50 rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Lewati ke konten
        </a>
        <TooltipProvider>
          <Header />
          <main id="konten" className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster position="top-center" richColors />
        </TooltipProvider>
      </body>
    </html>
  );
}
