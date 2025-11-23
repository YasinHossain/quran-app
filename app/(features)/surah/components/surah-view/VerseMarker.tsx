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

export const VerseMarker = ({ number, className, style }: VerseMarkerProps): React.JSX.Element => {
  return (
    <span
      className={cn('text-current', className)}
      style={{
        fontFamily: 'UthmanicHafs1Ver18, "KFGQPC Uthmanic Script HAFS Regular", sans-serif',
        ...style,
      }}
    >
      {toArabicIndicNumber(number)}
    </span>
  );
};
