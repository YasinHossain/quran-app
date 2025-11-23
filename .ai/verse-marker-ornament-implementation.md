# Verse Marker Ornament Implementation

## Overview

Implemented decorative circular ornaments for verse markers throughout the Quran app, similar to the style used on Quran.com. These ornaments appear after each verse ending where the verse number in Arabic is displayed.

## Changes Made

### 1. Created New VerseMarker Component

**File**: `/app/(features)/surah/components/surah-view/VerseMarker.tsx`

- Created a reusable component with an ornate SVG design
- Features include:
  - Decorative petals at cardinal points (top, right, bottom, left)
  - Multiple concentric circles for depth
  - Dotted inner ring for traditional Islamic aesthetic
  - Small decorative dots at intercardinal points
  - Accent lines radiating from center
  - Arabic-Indic numerals displayed in the center
  - Responsive sizing that scales with font size

### 2. Updated MushafMain Component

**File**: `/app/(features)/surah/components/surah-view/MushafMain.tsx`

- Imported the new `VerseMarker` component
- Removed the old inline verse marker definition
- The marker now appears in the Mushaf page view after each verse

### 3. Updated VerseArabic Component

**File**: `/app/shared/VerseArabic.tsx`

- Imported the `VerseMarker` component
- Added verse number extraction from `verse_key`
- Integrated the ornamental marker at the end of Arabic text
- Works for both word-by-word and full text display modes
- Added proper alignment with `items-center` class

## Design Features

The ornamental design includes:

1. **Outer Petals**: Four decorative petals at cardinal directions (N, S, E, W)
2. **Main Circle**: Bold outer circle (r=20, strokeWidth=1.8)
3. **Secondary Circle**: Medium decorative circle (r=17, strokeWidth=0.8)
4. **Dotted Ring**: Inner dashed circle for traditional pattern (r=14)
5. **Decorative Dots**: Four small dots at intercardinal points
6. **Accent Lines**: Subtle radiating lines from center
7. **Arabic Numerals**: Centered verse number in Arabic-Indic numerals

## Visual Characteristics

- **Color**: Uses `currentColor` to inherit from parent (accent color)
- **Size**: Scales at 1.8em relative to text size
- **Opacity**: Layered opacities (0.4-0.7) for depth
- **Spacing**: 1em width/height with mx-1 margin
- **Typography**: 0.4em font size for numbers with tight letter spacing

## Where It Appears

1. **Mushaf View**: After each verse in the page-by-page Mushaf display
2. **Regular Verse View**: At the end of Arabic text in verse cards
3. **Tafsir View**: At the end of verses in the tafsir viewer

## Accessibility

- Includes `aria-label` with "Ayah {number}" for screen readers
- Uses semantic HTML structure
- Maintains proper RTL text direction for Arabic numerals

## Future Enhancements

Potential improvements could include:

- Additional ornament styles (user preference)
- Animation on hover
- Different designs for different Mushaf types
- Color customization options
