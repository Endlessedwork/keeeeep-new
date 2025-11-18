const fs = require('fs');
const https = require('https');

// Create a simple SVG icon
const svg = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2563EB;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="225" fill="url(#bgGradient)"/>
  <path d="M 280 250 C 280 220 305 195 335 195 L 689 195 C 719 195 744 220 744 250 L 744 829 L 512 700 L 280 829 Z" 
        fill="white" 
        stroke="none"/>
</svg>`;

// Write to assets folder
const iconPath = './assets/icon.png';
const adaptiveIconPath = './assets/adaptive-icon.png';

// For now, write SVG (Expo can handle SVG or we need to convert to PNG)
fs.writeFileSync('./assets/icon.svg', svg);
console.log('Created icon.svg');

// Also update app.json
const appJsonPath = './app.json';
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

appJson.expo.name = 'Keeeeep';
appJson.expo.slug = 'keeeeep';
appJson.expo.icon = './assets/icon.svg';

fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
console.log('Updated app.json with new name and icon');
