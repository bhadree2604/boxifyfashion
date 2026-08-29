const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const images = [
  { src: 'public/images/artical-6.png', dest: 'public/images/artical-6.webp' },
  { src: 'public/images/artical-205.jpeg', dest: 'public/images/artical-205.webp' },
];

async function convertImage({ src, dest }, quality = 80) {
  try {
    await sharp(src)
      .webp({ quality })
      .toFile(dest);
    const stats = fs.statSync(dest);
    const sizeInKB = stats.size / 1024;
    console.log(`${src} -> ${dest}: ${sizeInKB.toFixed(2)} KB`);
    if (sizeInKB > 200) {
      console.log(`  Warning: over 200KB, trying lower quality`);
      // Try lower quality
      await convertImage({ src, dest }, quality - 10);
    }
  } catch (err) {
    console.error(`Error converting ${src}:`, err);
  }
}

(async () => {
  for (const image of images) {
    await convertImage(image);
  }
})();