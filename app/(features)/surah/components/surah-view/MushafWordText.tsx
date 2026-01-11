import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import { cn } from '@/lib/utils/cn';

import type { ReaderSettings } from './MushafMain.types';
import type { QcfFontVersion } from '@/app/(features)/surah/hooks/useQcfMushafFont';
import type { MushafWord } from '@/types';
import type React from 'react';

const getBaseText = (word: MushafWord, isIndopakMushaf: boolean): string =>
  isIndopakMushaf
    ? word.textIndopak || word.textUthmani || ''
    : word.textUthmani || word.textIndopak || '';

// For QCF mushafs, we strip ayah markers since they use special glyph codes
// For IndoPak and QPC Hafs, the font renders markers naturally - no stripping needed
const stripAyahMarkers = (text: string, isQcfMushaf: boolean): string => {
  if (!isQcfMushaf) {
    // IndoPak and QPC Hafs: keep the markers as the font renders them beautifully
    return text;
  }
  // QCF mushafs use glyph codes, so strip Unicode markers from text fallback
  return text.replace(/[\u06DF\u06DD]/g, '');
};


// V4 (Tajweed) uses the same glyph codes as V2 (code_v2 field), with the COLRv1 color font
const getGlyphCode = (word: MushafWord, qcfVersion: QcfFontVersion): string | undefined =>
  qcfVersion === 'v2' || qcfVersion === 'v4' ? word.codeV2 : word.codeV1;

type WordHtmlArgs = {
  isQcfMushaf: boolean;
  isQpcHafsMushaf: boolean;
  isFontLoaded: boolean;
  settings: ReaderSettings;
  baseText: string;
  displayText: string;
  glyphCode?: string | undefined;
};

const buildWordHtml = ({
  isQcfMushaf,
  isQpcHafsMushaf,
  isFontLoaded,
  settings,
  baseText,
  displayText,
  glyphCode,
}: WordHtmlArgs): string => {
  if (isQcfMushaf && isFontLoaded && glyphCode) {
    return glyphCode;
  }

  if (isQpcHafsMushaf) {
    return displayText;
  }

  if (baseText) {
    return baseText;
  }

  return '';
};

const getVerseNumberFromWord = (word: MushafWord): number | undefined => {
  if (typeof word.verseKey === 'string') {
    const [, ayah] = word.verseKey.split(':');
    const parsed = Number(ayah);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  if (typeof word.location === 'string') {
    const [, ayah] = word.location.split(':');
    const parsed = Number(ayah);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
};

const getVerseKeyFromWord = (word: MushafWord): string | undefined => {
  if (typeof word.verseKey === 'string') {
    return word.verseKey;
  }

  if (typeof word.location === 'string') {
    const [surah, ayah] = word.location.split(':');
    if (surah && ayah) {
      return `${surah}:${ayah}`;
    }
  }

  return undefined;
};

type MushafWordTextProps = {
  word: MushafWord;
  settings: ReaderSettings;
  isQcfMushaf: boolean;
  isQpcHafsMushaf: boolean;
  isIndopakMushaf: boolean;
  qcfVersion: QcfFontVersion;
  isFontLoaded: boolean;
};

export const MushafWordText = ({
  word,
  settings,
  isQcfMushaf,
  isQpcHafsMushaf,
  isIndopakMushaf,
  qcfVersion,
  isFontLoaded,
}: MushafWordTextProps): React.JSX.Element | null => {
  // Handle verse end markers (charType === 'end')
  if (word.charType === 'end') {
    const verseKey = getVerseKeyFromWord(word);

    // For QCF Mushafs (V1, V2, V4), use the glyph code for proper verse marker rendering
    if (isQcfMushaf && isFontLoaded) {
      const glyphCode = getGlyphCode(word, qcfVersion);
      if (glyphCode) {
        return (
          <span
            data-mushaf-word="true"
            data-verse-key={verseKey || undefined}
            data-word-position={String(word.position)}
            className="inline-flex flex-none items-center text-foreground"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(glyphCode) }}
          />
        );
      }
    }

    // For QPC Uthmani Hafs and IndoPak: the font already renders beautiful verse markers
    // Just render the text directly - no SVG overlay needed
    const markerText = isIndopakMushaf
      ? (word.textIndopak || word.textUthmani || '')
      : (word.textUthmani || '');

    if (markerText) {
      return (
        <span
          data-mushaf-word="true"
          data-verse-key={verseKey || undefined}
          data-word-position={String(word.position)}
          className="inline-flex flex-none items-center text-foreground"
        >
          {markerText}
        </span>
      );
    }

    return null;
  }

  const baseText = getBaseText(word, isIndopakMushaf);
  const verseKey = getVerseKeyFromWord(word);
  const glyphCode = getGlyphCode(word, qcfVersion);
  const hasGlyphCode = typeof glyphCode === 'string' && glyphCode.length > 0;

  if (!baseText && (!isQcfMushaf || !hasGlyphCode)) {
    return null;
  }

  const displayText = stripAyahMarkers(baseText, isQcfMushaf);
  const copyText = displayText.trim();
  const rawHtml = buildWordHtml({
    isQcfMushaf,
    isQpcHafsMushaf,
    isFontLoaded,
    settings,
    baseText,
    displayText,
    glyphCode,
  });

  if (!rawHtml) {
    return null;
  }

  return (
    <span
      data-mushaf-word="true"
      data-copy-text={copyText || undefined}
      {...(verseKey ? { 'data-verse-key': verseKey } : {})}
      data-word-position={String(word.position)}
      className={cn(
        'inline-flex flex-none items-center text-foreground',
        isQcfMushaf && 'font-medium',
        isQcfMushaf && !isFontLoaded && hasGlyphCode && 'opacity-0'
      )}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(rawHtml) }}
    />
  );
};
