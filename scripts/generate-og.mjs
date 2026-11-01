import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const iconPath = path.join(publicDir, "logo-pmbgm-ikon.png");
const outputPath = path.join(publicDir, "og-image.png");

async function generateOgImage() {
  console.log("Generating OpenGraph banner...");

  const width = 1200;
  const height = 630;

  // Resize icon to 320x320
  const iconBuffer = await sharp(iconPath)
    .resize(320, 320, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  // SVG overlay for typography and decorations
  const svgOverlay = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Background Gradient -->
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#021f18" />
        <stop offset="50%" stop-color="#052e25" />
        <stop offset="100%" stop-color="#011410" />
      </linearGradient>

      <!-- Glow radial gradients -->
      <radialGradient id="topGlow" cx="20%" cy="20%" r="55%">
        <stop offset="0%" stop-color="#10b981" stop-opacity="0.22" />
        <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="rightGlow" cx="80%" cy="50%" r="45%">
        <stop offset="0%" stop-color="#059669" stop-opacity="0.28" />
        <stop offset="100%" stop-color="#059669" stop-opacity="0" />
      </radialGradient>

      <!-- Glass card gradient -->
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.10" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.02" />
      </linearGradient>

      <!-- Pill gradient -->
      <linearGradient id="pillGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#10b981" stop-opacity="0.2" />
        <stop offset="100%" stop-color="#059669" stop-opacity="0.08" />
      </linearGradient>
    </defs>

    <!-- Base Canvas -->
    <rect width="${width}" height="${height}" fill="url(#bgGrad)" />
    <rect width="${width}" height="${height}" fill="url(#topGlow)" />
    <rect width="${width}" height="${height}" fill="url(#rightGlow)" />

    <!-- Subtle border inset -->
    <rect x="16" y="16" width="${width - 32}" height="${height - 32}" rx="24" fill="none" stroke="#10b981" stroke-opacity="0.2" stroke-width="1.5" />

    <!-- Subtle grid lines pattern -->
    <g opacity="0.06" stroke="#ffffff" stroke-width="1">
      <line x1="80" y1="0" x2="80" y2="630" />
      <line x1="240" y1="0" x2="240" y2="630" />
      <line x1="400" y1="0" x2="400" y2="630" />
      <line x1="560" y1="0" x2="560" y2="630" />
      <line x1="720" y1="0" x2="720" y2="630" />
      <line x1="0" y1="120" x2="1200" y2="120" />
      <line x1="0" y1="260" x2="1200" y2="260" />
      <line x1="0" y1="400" x2="1200" y2="400" />
      <line x1="0" y1="540" x2="1200" y2="540" />
    </g>

    <!-- RIGHT: Logo Card Container with glassmorphism -->
    <g transform="translate(730, 115)">
      <!-- Outer soft glow shadow -->
      <rect x="0" y="0" width="390" height="390" rx="36" fill="url(#cardGrad)" stroke="#34d399" stroke-opacity="0.25" stroke-width="1.5" />
      <rect x="15" y="15" width="360" height="360" rx="28" fill="#031b14" fill-opacity="0.6" stroke="#ffffff" stroke-opacity="0.06" stroke-width="1" />
    </g>

    <!-- LEFT: Content Area -->
    <!-- Category Badge -->
    <g transform="translate(80, 75)">
      <rect width="360" height="38" rx="19" fill="url(#pillGrad)" stroke="#34d399" stroke-opacity="0.35" stroke-width="1" />
      <circle cx="20" cy="19" r="5" fill="#34d399" />
      <text x="36" y="24" font-family="Plus Jakarta Sans, Inter, -apple-system, sans-serif" font-size="13" font-weight="700" letter-spacing="1.2" fill="#a7f3d0">
        PENGAWASAN MBG PARTISIPATIF
      </text>
    </g>

    <!-- Main Headings -->
    <g transform="translate(80, 180)">
      <text font-family="Plus Jakarta Sans, Inter, -apple-system, sans-serif" font-weight="800" font-size="58" fill="#ffffff" letter-spacing="-0.02em">
        PMBGM
      </text>
      <text y="50" font-family="Plus Jakarta Sans, Inter, -apple-system, sans-serif" font-weight="800" font-size="34" fill="#34d399" letter-spacing="-0.01em">
        Pemantau MBG Masyarakat
      </text>
      
      <!-- Slogan & Subtitle Description -->
      <text y="104" font-family="Plus Jakarta Sans, Inter, -apple-system, sans-serif" font-size="20" font-weight="700" fill="#f1f5f9">
        Kawal Gizi, Jaga Generasi.
      </text>
      <text y="136" font-family="Plus Jakarta Sans, Inter, -apple-system, sans-serif" font-size="18" font-weight="400" fill="#cbd5e1" opacity="0.92">
        Platform pengawasan mutu porsi, higienitas dapur SPPG,
      </text>
      <text y="164" font-family="Plus Jakarta Sans, Inter, -apple-system, sans-serif" font-size="18" font-weight="400" fill="#cbd5e1" opacity="0.92">
        dan transparansi Program Makan Bergizi Gratis di sekolah.
      </text>
    </g>

    <!-- Feature Pills -->
    <g transform="translate(80, 430)">
      <!-- Pill 1: 165+ Sekolah -->
      <g>
        <rect width="175" height="42" rx="12" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" />
        <text x="16" y="26" font-family="Plus Jakarta Sans, Inter, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#e2e8f0">
          🏫 165+ Sekolah
        </text>
      </g>
      <!-- Pill 2: 40 Dapur SPPG -->
      <g transform="translate(190, 0)">
        <rect width="175" height="42" rx="12" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" />
        <text x="16" y="26" font-family="Plus Jakarta Sans, Inter, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#e2e8f0">
          🍱 40 Dapur SPPG
        </text>
      </g>
      <!-- Pill 3: SLA Terbuka 24 Jam -->
      <g transform="translate(380, 0)">
        <rect width="195" height="42" rx="12" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" />
        <text x="16" y="26" font-family="Plus Jakarta Sans, Inter, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#e2e8f0">
          ⚡ SLA Terbuka 24 Jam
        </text>
      </g>
    </g>

    <!-- Footer Bar -->
    <g transform="translate(80, 545)">
      <text font-family="Plus Jakarta Sans, Inter, -apple-system, sans-serif" font-size="17" font-weight="700" fill="#6ee7b7" letter-spacing="0.5">
        pantau-gizi-three.vercel.app
      </text>
      <text x="320" font-family="Plus Jakarta Sans, Inter, -apple-system, sans-serif" font-size="15" font-weight="500" fill="#94a3b8">
        • Dikembangkan oleh Tim Ctrl Win Enter (MIA 2026)
      </text>
    </g>
  </svg>
  `;

  // Composite the SVG with the centered icon on the right
  const svgBuffer = Buffer.from(svgOverlay);

  await sharp(svgBuffer)
    .composite([
      {
        input: iconBuffer,
        top: 150,
        left: 765,
      },
    ])
    .png({ quality: 95, compressionLevel: 8 })
    .toFile(outputPath);

  console.log(`Successfully generated ${outputPath}`);
}

generateOgImage().catch((err) => {
  console.error("Error generating OG image:", err);
  process.exit(1);
});

