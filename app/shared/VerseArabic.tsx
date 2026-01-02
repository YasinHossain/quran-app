'use client';
import * as Popover from '@radix-ui/react-popover';
import { Fragment, memo, useMemo, useState } from 'react';

import { VerseMarker } from '@/app/(features)/surah/components/surah-view/VerseMarker';
import { useQcfMushafFont } from '@/app/(features)/surah/hooks/useQcfMushafFont';
import { useSettings } from '@/app/providers/SettingsContext';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import { TajweedFontPalettes } from '@/app/shared/TajweedFontPalettes';
import { Verse as VerseType, Word } from '@/types';

import type { LanguageCode } from '@/lib/text/languageCodes';

// Word rendering component
interface WordDisplayProps {
  word: Word;
  index: number;
  showByWords: boolean;
  wordLang: string;
  settings: { arabicFontSize: number };
  isQpcHafsFont: boolean;
  /** When true and word.codeV2 is available, render Tajweed glyph code */
  tajweed?: boolean;
  /** V4 font family to use for Tajweed rendering */
  tajweedFontFamily?: string | undefined;
}

// QPC Uthmani Hafs font lacks the U+06DF glyph, which shows up as a black circle; strip it when selected.
const stripUnsupportedQpcGlyphs = (text: string, isQpcHafsFont: boolean): string => {
  if (!text) return '';
  return isQpcHafsFont ? text.replace(/\u06DF/g, '') : text;
};

const WordDisplay = ({
  word,
  index,
  showByWords,
  wordLang,
  settings,
  isQpcHafsFont,
  tajweed = false,
  tajweedFontFamily,
}: WordDisplayProps): React.JSX.Element | null => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Strip verse markers
  if (/[\u06DD\u06DE\uFD3E\uFD3F]/.test(word.uthmani)) {
    return null;
  }

  // Use codeV2 for Tajweed when available, otherwise fall back to uthmani
  const useTajweed = tajweed && word.codeV2;
  const displayText = useTajweed ? word.codeV2 : stripUnsupportedQpcGlyphs(word.uthmani, isQpcHafsFont);

  if (!displayText?.trim()) {
    return null;
  }

  const translation = word[wordLang as LanguageCode] as string | undefined;
  const hasTranslation = Boolean(translation && translation.trim());

  // Style for Tajweed words - use V4 font
  const tajweedStyle = useTajweed && tajweedFontFamily ? { fontFamily: tajweedFontFamily } : undefined;

  return (
    <span key={`${word.id}-${index}`} className="inline-block text-center align-middle">
      {!showByWords && hasTranslation ? (
        <Popover.Root open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <Popover.Trigger asChild>
            <span
              className="relative cursor-pointer inline-block outline-none bg-transparent p-0 text-inherit"
              style={tajweedStyle}
              onPointerEnter={(e) => {
                if (e.pointerType === 'mouse') setIsPopoverOpen(true);
              }}
              onPointerLeave={(e) => {
                if (e.pointerType === 'mouse') setIsPopoverOpen(false);
              }}
            >
              {useTajweed ? (
                <span>{displayText}</span>
              ) : (
                <span
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(displayText),
                  }}
                />
              )}
            </span>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              dir="auto"
              side="top"
              align="center"
              sideOffset={10}
              collisionPadding={12}
              className="rounded-md bg-accent text-on-accent text-sm px-3 py-2 shadow-lg z-tooltip pointer-events-none max-w-[min(16rem,calc(100vw-1.5rem))] whitespace-normal text-center"
            >
              {translation}
              <Popover.Arrow className="fill-accent" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      ) : (
        <span className="inline-block" style={tajweedStyle}>
          {useTajweed ? (
            <span>{displayText}</span>
          ) : (
            <span
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(displayText),
              }}
            />
          )}
        </span>
      )}
      {showByWords && (
        <span
          className="mt-0.5 block text-muted mx-1"
          style={{ fontSize: `${settings.arabicFontSize * 0.5}px` }}
        >
          {translation}
        </span>
      )}
    </span>
  );
};

// Verse text component for fallback display
const VerseText = ({
  verseText,
  isQpcHafsFont,
}: {
  verseText: string;
  isQpcHafsFont: boolean;
}): React.JSX.Element => {
  // Strip verse markers (U+06DD ۝, U+06DE ۞)
  const normalizedText = stripUnsupportedQpcGlyphs(verseText, isQpcHafsFont);
  const cleanText = normalizedText.replace(/[\u06DD\u06DE]/g, '');

  return <>{cleanText}</>;
};

interface VerseArabicProps {
  verse: VerseType;
}

export const VerseArabic = memo(function VerseArabic({
  verse,
}: VerseArabicProps): React.JSX.Element {
  const { settings } = useSettings();
  const showByWords = settings.showByWords ?? false;
  const wordLang = settings.wordLang ?? 'en';
  const isQpcHafsFont = settings.arabicFontFace?.includes('UthmanicHafs1Ver18') ?? false;
  const verseText = verse.text_uthmani;
  const tajweed = settings.tajweed ?? false;

  // Extract verse number from verse_key (format: "surah:verse")
  const verseNumber = verse.verse_key ? parseInt(verse.verse_key.split(':')[1] || '0', 10) : 0;

  // Get unique page numbers from words for V4 font loading
  const pageNumbers = useMemo(() => {
    if (!tajweed || !verse.words) return [];
    const pages = new Set<number>();
    verse.words.forEach((word) => {
      if (word.pageNumber) {
        pages.add(word.pageNumber);
      }
    });
    return Array.from(pages);
  }, [tajweed, verse.words]);

  // Load V4 fonts for the pages used by this verse's words
  const { getPageFontFamily, isPageFontLoaded } = useQcfMushafFont(
    tajweed ? pageNumbers : [],
    'v4'
  );

  // Get the font family for a specific word based on its page
  const getTajweedFontFamily = (word: Word): string | undefined => {
    if (!tajweed || !word.pageNumber) return undefined;
    if (!isPageFontLoaded(word.pageNumber)) return undefined;
    return getPageFontFamily(word.pageNumber);
  };

  // Determine the base font - for Tajweed without page info, use first loaded page font
  const baseFontFamily = useMemo(() => {
    if (!tajweed) return settings.arabicFontFace;
    const firstPage = pageNumbers[0];
    if (typeof firstPage === 'number' && isPageFontLoaded(firstPage)) {
      return getPageFontFamily(firstPage);
    }
    return settings.arabicFontFace;
  }, [tajweed, pageNumbers, settings.arabicFontFace, getPageFontFamily, isPageFontLoaded]);

  return (
    <>
      <TajweedFontPalettes pageNumbers={pageNumbers} version="v4" />
      <p
        dir="rtl"
        className={`text-right leading-loose text-foreground${tajweed ? ' tajweed-palette' : ''}`}
        style={{
          fontFamily: baseFontFamily,
          fontSize: `${settings.arabicFontSize}px`,
          lineHeight: 2.2,
        }}
      >
        {verse.words && verse.words.length > 0 ? (
          <span>
            {verse.words
              .filter((word: Word, index: number, words: Word[]) => {
                // Heuristic: If the last word contains no Arabic letters (only symbols/numbers),
                // it is likely a verse marker. Hide it to avoid duplication.
                // Arabic letters range: \u0621-\u064A (Hamza to Yeh), plus extended characters.
                const hasArabicLetters = /[\u0621-\u064A\u0671-\u06D3]/.test(word.uthmani);
                const isLastWord = index === words.length - 1;
                const displayText =
                  tajweed && word.codeV2
                    ? word.codeV2
                    : stripUnsupportedQpcGlyphs(word.uthmani, isQpcHafsFont);

                if (isLastWord && !hasArabicLetters) {
                  return false;
                }

                // Also filter known marker characters anywhere (just in case)
                if (word.char_type_name === 'end' || /[\u06DD\u06DE\uFD3E\uFD3F]/.test(word.uthmani)) {
                  return false;
                }

                if (!displayText?.trim()) {
                  return false;
                }

                return true;
              })
              .map((word: Word, index: number) => (
                <Fragment key={`${word.id}-${index}`}>
                  {index > 0 ? ' ' : null}
                  <WordDisplay
                    word={word}
                    index={index}
                    showByWords={showByWords}
                    wordLang={wordLang}
                    settings={settings}
                    isQpcHafsFont={isQpcHafsFont}
                    tajweed={tajweed}
                    tajweedFontFamily={getTajweedFontFamily(word)}
                  />
                </Fragment>
              ))}
            {verseNumber > 0 && <VerseMarker number={verseNumber} style={{ marginBottom: 0 }} />}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            <VerseText verseText={verseText} isQpcHafsFont={isQpcHafsFont} />
            {verseNumber > 0 && <VerseMarker number={verseNumber} style={{ marginBottom: 0 }} />}
          </span>
        )}
      </p>
    </>
  );
});

