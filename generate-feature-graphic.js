const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFeatureGraphic() {
  const width = 1024;
  const height = 500;

  // Create gradient background
  const svgContent = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#6366F1;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#8B5CF6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#EC4899;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bgGradient)"/>
      
      <!-- App name -->
      <text x="512" y="200" font-family="Arial, sans-serif" font-size="120" font-weight="bold" fill="white" text-anchor="middle">
        Keeeeep
      </text>
      
      <!-- Tagline -->
      <text x="512" y="280" font-family="Arial, sans-serif" font-size="36" fill="white" text-anchor="middle" opacity="0.9">
        แอปจัดเก็บ Bookmark ที่คุณชื่นชอบ
      </text>
      
      <text x="512" y="340" font-family="Arial, sans-serif" font-size="36" fill="white" text-anchor="middle" opacity="0.9">
        พร้อม AI สรุปเนื้อหาอัตโนมัติ
      </text>
      
      <!-- Icons/Decorations -->
      <circle cx="150" cy="250" r="60" fill="white" opacity="0.2"/>
      <circle cx="874" cy="250" r="60" fill="white" opacity="0.2"/>
      
      <!-- Bookmark icon representation -->
      <rect x="130" y="220" width="40" height="60" rx="5" fill="white" opacity="0.4"/>
      <rect x="854" y="220" width="40" height="60" rx="5" fill="white" opacity="0.4"/>
      
      <!-- AI stars -->
      <circle cx="200" cy="150" r="8" fill="#FFD700"/>
      <circle cx="824" cy="150" r="8" fill="#FFD700"/>
      <circle cx="230" cy="350" r="6" fill="#FFD700" opacity="0.8"/>
      <circle cx="794" cy="350" r="6" fill="#FFD700" opacity="0.8"/>
    </svg>
  `;

  await sharp(Buffer.from(svgContent))
    .resize(1024, 500)
    .png()
    .toFile(path.join(__dirname, 'assets', 'feature-graphic.png'));

  console.log('✅ Created feature-graphic.png (1024x500)');
}

generateFeatureGraphic().catch(console.error);
