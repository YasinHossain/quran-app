import React from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * VerseMarker Component
 *
 * Displays the verse number in a traditional Arabic End of Ayah marker (U+06DD).
 * This uses the authentic KFGQPC Uthmanic Script HAFS Regular font rendering of the Unicode character U+06DD.
 *
 * Attribution:
 * - SVG Source: Extracted from KFGQPC Uthmanic Script HAFS Regular font
 * - Font: KFGQPC Uthmanic Script HAFS Regular
 * - License: Freely available for personal and non-commercial use
 * - Unicode Character: U+06DD (ARABIC END OF AYAH)
 */

interface VerseMarkerProps {
  number: number;
  className?: string;
  style?: React.CSSProperties;
}

const toArabicIndicNumber = (num: number): string => {
  const digits = '٠١٢٣٤٥٦٧٨٩';
  return `${num}`.replace(/\d/g, (d) => digits[Number(d)] ?? d);
};

export const VerseMarker = ({ number, className, style }: VerseMarkerProps) => {
  const digits = number.toString().length;

  // Dynamic font size based on number of digits to prevent overflow
  let numberFontSize = '0.45em';
  if (digits === 2) {
    numberFontSize = '0.4em';
  } else if (digits >= 3) {
    numberFontSize = '0.32em';
  }

  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center select-none h-[1em] w-[1em]",
        className
      )}
      aria-label={`Verse ${number}`}
      role="img"
      dir="rtl"
      style={{ fontSize: '1.75em', verticalAlign: 'middle', marginBottom: '-0.35em', marginRight: '-0.15em', marginLeft: '-0.1em', ...style }}
    >
      {/* Authentic KFGQPC Uthmanic Script HAFS Regular Verse Marker (U+06DD) */}
      <img
        src="/kfgqpc-ayah-end-marker.svg"
        alt=""
        className="w-full h-full text-current"
        style={{
          filter: "invert(1) brightness(0)", // Ensure it takes the text color if it's black by default
        }}
      />

      {/* Verse Number */}
      <span
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold leading-none text-current flex items-center justify-center"
        style={{
          fontFamily: '"KFGQPC Uthmanic Script HAFS Regular", sans-serif',
          fontSize: numberFontSize,
          // Fine-tune position if needed based on the glyph's visual center
          marginTop: '0.05em'
        }}
      >
        {toArabicIndicNumber(number)}
      </span>
    </span>
  );
};
