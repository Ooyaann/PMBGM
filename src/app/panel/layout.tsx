import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { template: "%s · Panel PMBGM", default: "Panel Kerja PMBGM" },
  robots: { index: false, follow: false },
};

export default function LayoutPanel({ children }: LayoutProps<"/panel">) {
  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </div>
    </div>
  );
}
