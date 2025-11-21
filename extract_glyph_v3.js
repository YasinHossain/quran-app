
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

    const path = glyph.getPath(0, 0, 1000);
    const commands = path.commands;

    // Calculate bounds manually from commands
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    function updateBounds(x, y) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
    }

    // Note: opentype.js getPath returns coordinates in the drawing coordinate system.
    // If we use getPath(0,0, 1000), it scales it. 
    // But wait, getPath uses the font's unitsPerEm if we don't specify size? 
    // No, getPath(x, y, fontSize).
    // If we want raw units, we should use glyph.path directly?
    // glyph.getPath(x, y, fontSize) -> Render the glyph to a Path object.
    // If we want to preserve the font units exactly, we should use the raw path from the glyph.
    // But opentype.js `glyph.getPath` does the conversion.

    // Let's use `glyph.getPath(0, 0, font.unitsPerEm)` to get 1:1 mapping?
    // Or just use the raw commands from `glyph.path` if available?
    // glyph.path is a Path object.

    const rawPath = glyph.path; // This should be in font units
    const rawCommands = rawPath.commands;

    // Iterate to find actual bounds
    for (let cmd of rawCommands) {
        if ('x' in cmd) updateBounds(cmd.x, cmd.y);
        if ('x1' in cmd) updateBounds(cmd.x1, cmd.y1);
        if ('x2' in cmd) updateBounds(cmd.x2, cmd.y2);
    }

    console.log(`Calculated Bounds: x:[${minX}, ${maxX}], y:[${minY}, ${maxY}]`);

    // Font coordinates: Y is UP.
    // So minY is the bottom, maxY is the top.

    // We want to flip Y for SVG.
    // New Y = maxY - Old Y.
    // This maps maxY -> 0 (top of SVG)
    // and minY -> maxY - minY (bottom of SVG)

    const width = maxX - minX;
    const height = maxY - minY;

    let d = "";

    for (let i = 0; i < rawCommands.length; i++) {
        const cmd = rawCommands[i];
        if (cmd.type === 'M' || cmd.type === 'L') {
            const x = cmd.x - minX;
            const y = maxY - cmd.y;
            d += `${cmd.type}${x.toFixed(2)} ${y.toFixed(2)} `;
        } else if (cmd.type === 'Q') {
            const x1 = cmd.x1 - minX;
            const y1 = maxY - cmd.y1;
            const x = cmd.x - minX;
            const y = maxY - cmd.y;
            d += `Q${x1.toFixed(2)} ${y1.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} `;
        } else if (cmd.type === 'C') {
            const x1 = cmd.x1 - minX;
            const y1 = maxY - cmd.y1;
            const x2 = cmd.x2 - minX;
            const y2 = maxY - cmd.y2;
            const x = cmd.x - minX;
            const y = maxY - cmd.y;
            d += `C${x1.toFixed(2)} ${y1.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} `;
        } else if (cmd.type === 'Z') {
            d += 'Z ';
        }
    }

    // Add generous padding (20%)
    const paddingX = width * 0.2;
    const paddingY = height * 0.2;

    const viewBoxX = -paddingX;
    const viewBoxY = -paddingY;
    const viewBoxW = width + paddingX * 2;
    const viewBoxH = height + paddingY * 2;

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBoxX.toFixed(2)} ${viewBoxY.toFixed(2)} ${viewBoxW.toFixed(2)} ${viewBoxH.toFixed(2)}">
  <path d="${d.trim()}" fill="currentColor" />
</svg>`;

    fs.writeFileSync(outputPath, svgContent);
    console.log('SVG saved to ' + outputPath);
});
