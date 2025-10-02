const fs = require('fs');
const path = require('path');

// Simple SVG icon generator for PWA
const generateIcon = (size) => {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#dc2626" rx="${size * 0.1}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="white">AM</text>
</svg>`;
};

// Generate icons in different sizes
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('Generating PWA icons...');

sizes.forEach(size => {
  const svgContent = generateIcon(size);
  const filePath = path.join(__dirname, '..', 'public', 'icons', `icon-${size}x${size}.png`);
  
  // For now, we'll create SVG files and you can convert them to PNG
  const svgPath = path.join(__dirname, '..', 'public', 'icons', `icon-${size}x${size}.svg`);
  fs.writeFileSync(svgPath, svgContent);
  console.log(`Generated icon-${size}x${size}.svg`);
});

console.log('Icon generation complete!');
console.log('Note: You may want to convert SVG files to PNG for better PWA compatibility.');
console.log('You can use online tools like https://convertio.co/svg-png/ or ImageMagick.');
