import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const sourceImage = path.join(__dirname, '..', 'source-icon.png');
const outputDir = path.join(__dirname, '..', 'public', 'icons');

async function generateIcons() {
    console.log('Generating PWA icons...');

    for (const size of sizes) {
        const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);

        await sharp(sourceImage)
            .resize(size, size, {
                fit: 'contain',
                background: { r: 240, g: 244, b: 244, alpha: 1 } // Light background matching the icon
            })
            .png()
            .toFile(outputPath);

        console.log(`✓ Generated icon-${size}x${size}.png`);
    }

    console.log('\\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
