const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = 'public/images';
const files = fs.readdirSync(imagesDir);

files.forEach(file => {
  if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {
    const filePath = path.join(imagesDir, file);
    sharp(filePath)
      .metadata()
      .then(meta => {
        console.log(`${file}: ${meta.width}x${meta.height}`);
      })
      .catch(err => {
        console.error(`Error reading ${file}:`, err);
      });
  }
});