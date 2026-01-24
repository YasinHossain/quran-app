const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SVG_PATH = path.join(__dirname, '../public/icons/icon.svg');
const ICONS_DIR = path.join(__dirname, '../public/icons');
const APP_ICON_PATH = path.join(__dirname, '../app/icon.png');

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

async function generate() {
  if (!fs.existsSync(SVG_PATH)) {
    console.error(`Error: Source SVG not found at ${SVG_PATH}`);
    process.exit(1);
  }

  console.log(`Generating icons from ${SVG_PATH}...`);

  // Generate public/icons/*
  for (const size of SIZES) {
    const fileName = `icon-${size}x${size}.png`;
    const outputPath = path.join(ICONS_DIR, fileName);

    console.log(`Generating ${fileName}...`);
    await sharp(SVG_PATH).resize(size, size).png().toFile(outputPath);
  }

  // Generate app/icon.png (512x512)
  console.log('Generating app/icon.png...');
  await sharp(SVG_PATH).resize(512, 512).png().toFile(APP_ICON_PATH);

  console.log('Done!');
}

generate().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
