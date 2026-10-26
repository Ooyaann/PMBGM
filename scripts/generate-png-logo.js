const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const publicDir = path.join(__dirname, '..', 'public');

  const svgIkon = fs.readFileSync(path.join(publicDir, 'logo-pmbgm-ikon.svg'));
  const svgLengkap = fs.readFileSync(path.join(publicDir, 'logo-pmbgm.svg'));

  // 1. Logo Ikon Resolusi Tinggi (1024x1024)
  await sharp(svgIkon, { density: 300 })
    .resize(1024, 1024, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, 'logo-pmbgm-ikon.png'));
  console.log('✓ Dibuat: public/logo-pmbgm-ikon.png (1024x1024)');

  // 2. Logo Ikon Ultra-HD (2048x2048)
  await sharp(svgIkon, { density: 600 })
    .resize(2048, 2048, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, 'logo-pmbgm-ikon-2048.png'));
  console.log('✓ Dibuat: public/logo-pmbgm-ikon-2048.png (2048x2048)');

  // 3. Logo Master Horizontal Lengkap (2500x500)
  await sharp(svgLengkap, { density: 300 })
    .resize(2500, 500, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, 'logo-pmbgm.png'));
  console.log('✓ Dibuat: public/logo-pmbgm.png (2500x500)');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
