import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import { cn } from '@/lib/utils/cn';

import { VerseMarker } from './VerseMarker';

import type { ReaderSettings } from './MushafMain.types';
import type { QcfFontVersion } from '@/app/(features)/surah/hooks/useQcfMushafFont';
import type { MushafWord } from '@/types';
import type React from 'react';

const getBaseText = (word: MushafWord, isIndopakMushaf: boolean): string =>
  isIndopakMushaf
    ? word.textIndopak || word.textUthmani || ''
    : word.textUthmani || word.textIndopak || '';

const stripAyahMarkers = (text: string, isQpcHafsMushaf: boolean): string =>
  isQpcHafsMushaf ? text.replace(/[\u06DF\u06DD]/g, '') : text.replace(/\u06DD/g, '');

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
  if (word.charType === 'end') {
    const verseNumber = getVerseNumberFromWord(word);
    return typeof verseNumber === 'number' ? <VerseMarker number={verseNumber} /> : null;
  }

  const baseText = getBaseText(word, isIndopakMushaf);
  const verseKey = getVerseKeyFromWord(word);
  const glyphCode = getGlyphCode(word, qcfVersion);
  const hasGlyphCode = typeof glyphCode === 'string' && glyphCode.length > 0;

  if (!baseText && (!isQcfMushaf || !hasGlyphCode)) {
    return null;
  }

  const displayText = stripAyahMarkers(baseText, isQpcHafsMushaf);
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
        isQcfMushaf
          ? 'inline-flex flex-none items-center text-foreground font-medium'
          : 'inline-flex flex-none items-center px-[1px] text-foreground',
        isQcfMushaf && !isFontLoaded && hasGlyphCode && 'opacity-0'
      )}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(rawHtml) }}
    />
  );
};
