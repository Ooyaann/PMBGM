import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  // Renderer PDF (IN-07) memuat font dan yoga-wasm sendiri; jangan dibundel.
  serverExternalPackages: ["@react-pdf/renderer"],
  // Font PDF dibaca dari disk saat runtime, jadi ikutkan ke bundel fungsi server.
  outputFileTracingIncludes: { "/insight/laporan": ["./src/lib/pdf/font/**"] },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
