const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
  const svgPath = path.join(__dirname, 'assets', 'icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  // Generate app icon (1024x1024)
  await sharp(svgBuffer)
    .resize(1024, 1024)
    .png()
    .toFile(path.join(__dirname, 'assets', 'icon.png'));

  console.log('✅ Created icon.png (1024x1024)');

  // Generate adaptive icon (1024x1024)
  await sharp(svgBuffer)
    .resize(1024, 1024)
    .png()
    .toFile(path.join(__dirname, 'assets', 'adaptive-icon.png'));

  console.log('✅ Created adaptive-icon.png (1024x1024)');
}

generateIcons().catch(console.error);
