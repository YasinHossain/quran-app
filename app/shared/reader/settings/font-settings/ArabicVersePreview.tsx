'use client';

import React from 'react';

import { useDynamicFontLoader } from '@/app/hooks/useDynamicFontLoader';

// IndoPak font faces that require IndoPak text
const INDOPAK_FONT_FACES = new Set([
  '"IndoPak", serif',
  '"Noor-e-Huda", serif',
  '"Noor-e-Hidayat", serif',
  '"Noor-e-Hira", serif',
  '"Lateef", serif',
]);

// Same verse (Al-Fatiha 1:2) in different text variants
const UTHMANI_TEXT = 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ';
const INDOPAK_TEXT = 'اَلۡحَمۡدُ لِلّٰہِ رَبِّ الۡعٰلَمِیۡنَ';

interface ArabicVersePreviewProps {
  fontFamily: string;
  fontSize?: number;
  className?: string;
}

/**
 * A shared component to display a preview of an Arabic verse with a specific font.
 * Uses the correct text variant (Uthmani or IndoPak) based on the selected font.
 */
export function ArabicVersePreview({
  fontFamily,
  fontSize = 32,
  className = '',
}: ArabicVersePreviewProps): React.JSX.Element {
  // Dynamically load the font to ensure it's available for preview
  useDynamicFontLoader(fontFamily);

  // Use IndoPak text for IndoPak fonts, Uthmani text for all other fonts
  const isIndoPakFont = INDOPAK_FONT_FACES.has(fontFamily);
  const previewText = isIndoPakFont ? INDOPAK_TEXT : UTHMANI_TEXT;

  return (
    <div className={className}>
      <p
        dir="rtl"
        className="text-foreground leading-loose text-center"
        style={{
          fontSize: `${fontSize}px`,
          fontFamily,
        }}
      >
        {previewText}
      </p>
    </div>
  );
}
