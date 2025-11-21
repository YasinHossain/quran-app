
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import xml.etree.ElementTree as ET

font_path = "/home/devcontainers/quran-app/public/svg icon extraction from font/kfgqpc-uthmanic-script-hafs-regular/KFGQPC Uthmanic Script HAFS Regular/KFGQPC Uthmanic Script HAFS Regular.otf"
output_path = "/home/devcontainers/quran-app/public/kfgqpc-ayah-end-marker.svg"
glyph_code = 0x06DD

font = TTFont(font_path)
cmap = font.getBestCmap()
glyph_name = cmap.get(glyph_code)

if not glyph_name:
    print(f"Glyph U+{glyph_code:04X} not found in font.")
    exit(1)

glyph_set = font.getGlyphSet()
glyph = glyph_set[glyph_name]

# Calculate viewbox
width = glyph.width
# Typical em square for OTF is 1000, but let's check head table if needed, or just use bounding box
# For simplicity, we'll construct the path and then see.
# Actually, we can just use the width and some estimated height or bounding box.

# Let's get the path
pen = SVGPathPen(glyph_set)
glyph.draw(pen)
path_data = pen.getCommands()

# We need to wrap this in an SVG
# We need to flip the coordinate system because fonts have Y going up, SVG has Y going down.
# We can use a transform in the SVG or transform the path.
# Let's try to create a simple SVG and let the user check it, or we can be smarter.

# Better approach: Use fontTools to get the bounds to set viewBox correctly.
# And flip it.

from fontTools.misc.transform import Transform

# Create a new pen for the flipped coordinates
# Font units: (0,0) is usually baseline.
# We want to fit it in a viewbox.
# Let's just output the raw path with a transform group.

svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -1000 {width} 1000">
  <g transform="scale(1, -1)">
    <path d="{path_data}" fill="currentColor" />
  </g>
</svg>"""

# Note: The viewBox might need adjustment based on the font's ascent/descent.
# Usually fonts are 1000 units per em.
# If we assume standard 1000 upm, and the glyph sits on baseline.
# The scale(1, -1) flips it around X-axis.
# So positive Y becomes negative Y.
# If the glyph goes from y=0 to y=800.
# Flipped: y=0 to y=-800.
# So viewBox should cover negative Y.
# viewBox="0 -1000 1000 1000" -> min-x, min-y, width, height.
# min-y = -1000 (top), height = 1000.
# This should work for a standard font.

with open(output_path, "w") as f:
    f.write(svg_content)

print(f"Extracted {glyph_name} to {output_path}")
