
const opentype = require('opentype.js');
const fs = require('fs');

const fontPath = "/home/devcontainers/quran-app/public/svg icon extraction from font/kfgqpc-uthmanic-script-hafs-regular/KFGQPC Uthmanic Script HAFS Regular/KFGQPC Uthmanic Script HAFS Regular.otf";
const outputPath = "/home/devcontainers/quran-app/public/kfgqpc-ayah-end-marker.svg";
const glyphCode = 0x06DD;

opentype.load(fontPath, function (err, font) {
    if (err) {
        console.error('Could not load font: ' + err);
        process.exit(1);
    }

    const glyph = font.charToGlyph(String.fromCharCode(glyphCode));
    if (!glyph) {
        console.error('Glyph not found');
        process.exit(1);
    }

    // Get the path
    // We want to get the path commands and manually flip them.
    const path = glyph.getPath(0, 0, 1000);

    // We can iterate over commands and flip Y.
    // But wait, getPath(x, y, fontSize) returns coordinates where Y grows up (font coords) or down (canvas coords)?
    // opentype.js documentation says: "The path is constructed using the font's coordinate system."
    // But usually for canvas drawing, it might be flipped.
    // Let's assume it's standard font coords (Y up).

    // Let's use a simpler approach:
    // 1. Get the bounding box of the glyph.
    // 2. Calculate width and height.
    // 3. Create a viewBox that fits it perfectly.
    // 4. Use a transform group to flip it, but make sure the translate is correct.

    const box = glyph.getBoundingBox();
    console.log('Original Box:', box);

    // Width and Height
    const width = box.x2 - box.x1;
    const height = box.y2 - box.y1;

    // We want the SVG to have a viewBox from (0, 0) to (width, height).
    // And the glyph should be drawn inside it.
    // If we flip Y with scale(1, -1), we are drawing in (x, -y).
    // The glyph has y values from box.y1 (bottom) to box.y2 (top).
    // Flipped: -box.y1 (top in SVG space?) to -box.y2 (bottom in SVG space?).
    // Wait.
    // SVG Y grows down.
    // Font Y grows up.
    // Top of glyph is y2. Bottom is y1.
    // We want Top to be at SVG y=0.
    // So we need to map y2 -> 0.
    // And y1 -> height.
    // So y_svg = y2 - y_font. (This flips and shifts).

    // Let's modify the path commands directly.
    const commands = path.commands;
    let d = "";

    for (let i = 0; i < commands.length; i++) {
        const cmd = commands[i];
        if (cmd.type === 'M' || cmd.type === 'L') {
            const x = cmd.x - box.x1; // shift x to start at 0
            const y = box.y2 - cmd.y; // flip y and shift to start at 0
            d += `${cmd.type}${x.toFixed(2)} ${y.toFixed(2)} `;
        } else if (cmd.type === 'Q') {
            const x1 = cmd.x1 - box.x1;
            const y1 = box.y2 - cmd.y1;
            const x = cmd.x - box.x1;
            const y = box.y2 - cmd.y;
            d += `Q${x1.toFixed(2)} ${y1.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} `;
        } else if (cmd.type === 'C') {
            const x1 = cmd.x1 - box.x1;
            const y1 = box.y2 - cmd.y1;
            const x2 = cmd.x2 - box.x1;
            const y2 = box.y2 - cmd.y2;
            const x = cmd.x - box.x1;
            const y = box.y2 - cmd.y;
            d += `C${x1.toFixed(2)} ${y1.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} `;
        } else if (cmd.type === 'Z') {
            d += 'Z ';
        }
    }

    // Add some padding
    const padding = width * 0.05;
    const viewBoxWidth = width + padding * 2;
    const viewBoxHeight = height + padding * 2;

    // Shift the path by padding
    // Actually, let's just set the viewBox to include padding.
    // Path is now in [0, width] x [0, height].
    // viewBox should be [-padding, -padding, viewBoxWidth, viewBoxHeight].

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-padding} ${-padding} ${viewBoxWidth} ${viewBoxHeight}">
  <path d="${d.trim()}" fill="currentColor" />
</svg>`;

    fs.writeFileSync(outputPath, svgContent);
    console.log('SVG saved to ' + outputPath);
    console.log(`Dimensions: ${width} x ${height}`);
});
