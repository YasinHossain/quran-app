'use client';

import { memo } from 'react';

import type React from 'react';

/**
 * Converts Western Arabic numerals (0-9) to Eastern Arabic-Indic numerals (٠-٩)
 */
const toArabicIndic = (num: number): string => {
  const arabicIndicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num)
    .split('')
    .map((digit) => arabicIndicDigits[Number.parseInt(digit, 10)] || digit)
    .join('');
};

type Point = { x: number; y: number };

interface FontAdjustment {
  ornament: Point;
  number: Point;
  containerWidth?: string;
  scale?: number;
}

const DEFAULT_ADJUSTMENT: FontAdjustment = {
  ornament: { x: 0, y: 0 },
  number: { x: 0, y: 0 },
};

const getFontAdjustment = (fontFamily: string | undefined): FontAdjustment => {
  return DEFAULT_ADJUSTMENT;
};

/**
 * List of fonts that have their own built-in verse ornament (U+06DD glyph)
 * These fonts should NOT use the custom overlay marker.
 */
export const FONTS_WITH_NATIVE_ORNAMENT = [
  'UthmanicHafs1Ver18', // QPC Uthmani Hafs - has ornament + number shaping
];

/**
 * Check if a font family string contains a font that has native ornament support
 */
export const fontHasNativeOrnament = (fontFamily: string | undefined): boolean => {
  if (!fontFamily) return false;
  return FONTS_WITH_NATIVE_ORNAMENT.some((font) => fontFamily.includes(font));
};

/**
 * Check if a font needs custom ornament
 */
export const fontNeedsCustomOrnament = (fontFamily: string | undefined): boolean => {
  if (!fontFamily) return true; // Default to custom if no font specified
  return !fontHasNativeOrnament(fontFamily);
};

interface VerseMarkerProps {
  verseNumber: number;
  /** Size of the marker in pixels (defaults to 1.2em relative to parent) */
  size?: number | undefined;
  /** Optional className for additional styling */
  className?: string | undefined;
  /** If true, use the marker even if font has native support */
  forceCustom?: boolean | undefined;
  /** Current font family to determine if custom marker is needed */
  fontFamily?: string | undefined;
}

/**
 * Text-based verse marker using U+06DD (۝) with an overlaid verse number.
 *
 * Avoids inline SVG for performance, while keeping a consistent verse marker
 * experience for fonts that don't support native ornament+number shaping.
 * 
 * Note: This component is largely deprecated in favor of the "Unified Hafs Marker"
 * strategy in HybridVerseMarker, but kept for fallback or explicit usage.
 */
export const VerseMarker = memo(function VerseMarker({
  verseNumber,
  size,
  className = '',
  forceCustom = false,
  fontFamily,
}: VerseMarkerProps): React.JSX.Element | null {
  if (!forceCustom && fontHasNativeOrnament(fontFamily)) {
    return null;
  }

  const arabicNumber = toArabicIndic(verseNumber);
  const digitCount = String(verseNumber).length;
  const numberScale = digitCount === 1 ? 0.75 : digitCount === 2 ? 0.65 : 0.5;

  const adjustment = getFontAdjustment(fontFamily);
  const ornamentTransform = `translate(${adjustment.ornament.x}em, ${adjustment.ornament.y}em) scale(${adjustment.scale || 1})`;
  const numberTransform = `translate(${adjustment.number.x}em, ${adjustment.number.y}em)`;

  return (
    <span
      className={`relative inline-grid place-items-center leading-none text-current ${className}`}
      style={{
        fontSize: size ? `${size}px` : '1.2em',
        width: adjustment.containerWidth || '1em',
        height: '1em',
        unicodeBidi: 'isolate',
      }}
      aria-label={`Verse ${verseNumber}`}
      dir="rtl"
    >
      <span
        aria-hidden="true"
        style={{
          transform: ornamentTransform,
        }}
      >
        ۝
      </span>
      <span
        aria-hidden="true"
        dir="ltr"
        className="absolute inset-0 flex items-center justify-center font-bold leading-none"
        style={{ fontSize: `${numberScale}em`, transform: numberTransform }}
      >
        {arabicNumber}
      </span>
    </span>
  );
});

/**
 * Renders a verse marker using Arabic-Indic digits (٠-٩) in the KFGQPC font.
 *
 * In `UthmanicHafs1Ver18`, the digits are drawn as the end-of-ayah ornament with
 * the number inside (like Quran.com). Rendering `U+06DD` as well would produce
 * an extra empty ornament.
 */
export const NativeVerseMarker = ({
  verseNumber,
  className = '',
  fontFamily,
  style,
  size,
}: {
  verseNumber: number;
  className?: string;
  fontFamily?: string;
  style?: React.CSSProperties;
  size?: number;
}): React.JSX.Element => {
  const arabicNumber = toArabicIndic(verseNumber);
  const markerScale = 1.25;
  const baselineShiftEm = 0.08;
  const scaledFontSize =
    typeof size === 'number' ? `${Math.round(size * markerScale)}px` : `${markerScale}em`;

  return (
    <span
      className={`inline-block whitespace-nowrap ${className}`}
      dir="rtl"
      style={{
        fontFamily: fontFamily || 'UthmanicHafs1Ver18',
        fontSize: scaledFontSize,
        lineHeight: 1,
        unicodeBidi: 'isolate',
        ...style,
      }}
      aria-label={`Verse ${verseNumber}`}
    >
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          transform: `translateY(${baselineShiftEm}em)`,
        }}
      >
        {arabicNumber}
      </span>
    </span>
  );
};

/**
 * Hybrid verse marker that automatically selects between native and custom rendering
 * based on the current font's capabilities.
 */
export const HybridVerseMarker = ({
  verseNumber,
  fontFamily,
  className = '',
  size,
  style,
}: {
  verseNumber: number;
  fontFamily?: string;
  size?: number;
  className?: string;
  forceCustom?: boolean;
  style?: React.CSSProperties;
}): React.JSX.Element => {
  const optionalProps = {
    ...(typeof size === 'number' ? { size } : {}),
    ...(style ? { style } : {}),
  };

  // 1. If the current font supports native ornament (e.g. Uthmanic Hafs), use it.
  // This preserves the specific style of the main Quran font if it's capable.
  if (fontHasNativeOrnament(fontFamily)) {
    return (
      <NativeVerseMarker verseNumber={verseNumber} className={className} {...optionalProps} />
    );
  }

  // 2. For ALL other fonts (Amiri, Me Quran, Lateef, etc.), use the Uthmanic Hafs font
  // to render a unified, high-quality text-based marker.
  // This satisfies the requirement for a "unified text-like thing" without using SVGs
  // and avoids alignment issues present in other fonts.
  return (
    <NativeVerseMarker
      verseNumber={verseNumber}
      className={className}
      fontFamily="UthmanicHafs1Ver18"
      {...optionalProps}
    />
  );
};

export default VerseMarker;
