import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const sourceImage = path.join(__dirname, '..', 'source-icon.png');
const outputDir = path.join(__dirname, '..', 'public', 'icons');

// How much of the icon should be the actual content (rest is padding)
// 0.65 means 65% is the book, 35% is white padding (17.5% on each side)
const CONTENT_RATIO = 0.65;

async function generateIcons() {
    console.log('Generating PWA icons with safe zone padding...');
    console.log(`Content ratio: ${CONTENT_RATIO * 100}% (padding: ${((1 - CONTENT_RATIO) / 2 * 100).toFixed(1)}% each side)`);

    for (const size of sizes) {
        const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
        const contentSize = Math.round(size * CONTENT_RATIO);
        const padding = Math.round((size - contentSize) / 2);

        // First resize the source to the content size
        const resizedContent = await sharp(sourceImage)
            .resize(contentSize, contentSize, {
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            })
            .toBuffer();

        // Then place it on a white canvas with padding
        await sharp({
            create: {
                width: size,
                height: size,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            }
        })
            .composite([{
                input: resizedContent,
                top: padding,
                left: padding
            }])
            .png()
            .toFile(outputPath);

        console.log(`✓ Generated icon-${size}x${size}.png (${contentSize}px content + ${padding}px padding)`);
    }

    console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
