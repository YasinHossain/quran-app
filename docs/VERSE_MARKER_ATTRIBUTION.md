# Verse Marker Ornament Attribution

## Verse Marker Ornament (KFGQPC)

The verse marker ornament used in this application comes from the **KFGQPC Uthmanic Script HAFS Regular** font (loaded as `UthmanicHafs1Ver18`).

In this font, Arabic-Indic digits (٠-٩) are drawn as the end-of-ayah ornament with the number inside (as seen on Quran.com). The font also contains the Unicode character U+06DD (ARABIC END OF AYAH), which renders as an *empty* ornament and is not used for numbered verse markers.

### Design Source

- **Primary Rendering**: Arabic-Indic digits (٠-٩) in KFGQPC font (ornament + number)
- **Empty Ornament (Unicode)**: U+06DD (ARABIC END OF AYAH)
- **Font**: KFGQPC Uthmanic Script HAFS Regular (`UthmanicHafs1Ver18`)
- **Designer**: King Fahd Glorious Quran Printing Complex (KFGQPC)
- **Source File**: Provided by user (extracted from font)

### License Information

#### KFGQPC Uthmanic Script HAFS Regular

- **Owner**: King Fahd Glorious Quran Printing Complex
- **Usage**: Freely available for personal and non-commercial use in service of the Quran.
- **Website**: https://fonts.qurancomplex.gov.sa/

### Implementation Details

#### Component

- **File**: `/app/shared/components/verse-marker/VerseMarker.tsx`
- **Description**: Renders verse markers using Arabic-Indic digits in the KFGQPC font so the ornament behaves like a normal glyph (baseline-aligned and font-size scalable).

#### Features

The ornament includes:

- Authentic KFGQPC design matching the printed Mushaf.
- Intricate circular/floral pattern.
- Arabic-Indic numerals displayed in the center.

### Credits

We gratefully acknowledge the **King Fahd Glorious Quran Printing Complex** for their work in digitizing the Uthmanic script and making it available.
