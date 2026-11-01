import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITUS_URL ?? "https://pantau-gizi-three.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/panel/", "/api/", "/akun/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

