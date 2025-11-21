
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
    const path = glyph.getPath(0, 0, 1000); // x, y, fontSize. 
    // Note: getPath returns a Path object.
    // We want to normalize it. 
    // The font units are usually 1000 or 2048.
    // Let's use the font's unitsPerEm to scale it if we want, or just output it.
    // getPath(x, y, fontSize) -> if we use fontSize = unitsPerEm, it maps 1:1 to font units?
    // Actually, let's just use a standard size like 1000 and let the viewBox handle it.

    // However, we need the bounding box to set the viewBox correctly.
    const boundingBox = glyph.getBoundingBox();
    console.log('Bounding Box:', boundingBox);

    // We want to generate an SVG that fits the glyph tightly or with some padding.
    // The path commands from getPath are already in SVG format (d attribute).
    // But we need to convert the Path object to SVG string.

    const svgPathData = path.toPathData(2); // 2 decimal places

    // Calculate viewBox
    // The glyph coordinates in the font: y goes up.
    // opentype.js getPath: "Create a Path object that represents the given glyph."
    // It seems to handle the coordinate flip if we render it to a context, but toPathData might just give raw coordinates?
    // Wait, opentype.js documentation says:
    // "Note that the y-coordinate in fonts is positive upwards, but in SVG it is positive downwards."
    // But getPath(x, y, fontSize) might handle this?
    // Usually we need to flip it.

    // Let's generate the SVG manually using the path data and a transform.
    // Or use `path.toSVG(decimalPlaces)` which returns the full <path> element.

    // Let's try to just get the path data and wrap it.
    // We will assume we need to flip Y.

    // Actually, let's look at the bounding box.
    // x1, y1, x2, y2.
    // If we flip Y, y1 becomes -y1, y2 becomes -y2.
    // So min-y will be -y2 (since y2 is the top in font coords).

    // Let's just use a large viewBox and center it?
    // Or better, use the bounding box values.
    const width = boundingBox.x2 - boundingBox.x1;
    const height = boundingBox.y2 - boundingBox.y1;

    // We want to shift the glyph so it starts at 0,0 in the SVG?
    // Or just set the viewBox to match the glyph's position.

    // Font coords: (x, y). Y is up.
    // SVG coords: (x, -y). Y is down.
    // So we need to scale(1, -1).

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${boundingBox.x1} ${-boundingBox.y2} ${width} ${height}">
  <g transform="scale(1, -1)">
    <path d="${svgPathData}" fill="currentColor" />
  </g>
</svg>`;

    // Wait, if we scale(1, -1), the y-coordinates in path data are flipped.
    // If the path data has y=500. Flipped it becomes -500.
    // So we need the viewBox to cover -500.
    // Top of glyph in font is y2 (e.g. 800).
    // Bottom is y1 (e.g. -200).
    // Flipped: Top is -800, Bottom is 200.
    // So min-y should be -800 (which is -y2).
    // Height is y2 - y1.
    // So viewBox="${boundingBox.x1} ${-boundingBox.y2} ${width} ${height}" seems correct.

    fs.writeFileSync(outputPath, svgContent);
    console.log('SVG saved to ' + outputPath);
});
