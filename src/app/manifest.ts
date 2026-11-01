import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PMBGM · Pemantau MBG Masyarakat",
    short_name: "PMBGM",
    description: "Platform Pengawasan Mutu, Higienitas, dan Kepatuhan Makan Bergizi Gratis (MBG)",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f6b57",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
