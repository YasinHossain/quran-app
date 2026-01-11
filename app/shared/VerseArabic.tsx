'use client';
import * as Popover from '@radix-ui/react-popover';
import { Fragment, memo, useContext, useMemo, useState } from 'react';
import { useQcfMushafFont } from '@/app/(features)/surah/hooks/useQcfMushafFont';
import { useDynamicFontLoader } from '@/app/hooks/useDynamicFontLoader';
import { useSettings } from '@/app/providers/SettingsContext';
import { AudioContext } from '@/app/shared/player/context/AudioContext';
import { TajweedFontPalettes } from '@/app/shared/TajweedFontPalettes';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
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
  /** Verse key for audio word sync highlighting */
  verseKey: string;
  /** Word position (1-indexed) for audio word sync highlighting */
  wordPosition: number;
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
  verseKey,
  wordPosition,
}: WordDisplayProps): React.JSX.Element | null => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const audioCtx = useContext(AudioContext);
  const isPlayerVisible = audioCtx?.isPlayerVisible ?? false;

  // Skip only Sajdah/Rub markers (keep verse end markers for font rendering)
  if (/[\u06DE\uFD3E\uFD3F]/.test(word.uthmani) && !/[\u06DD]/.test(word.uthmani)) {
    return null;
  }

  // Use codeV2 for Tajweed when available, otherwise fall back to uthmani
  const useTajweed = tajweed && word.codeV2;
  const displayText = useTajweed
    ? word.codeV2
    : stripUnsupportedQpcGlyphs(word.uthmani, isQpcHafsFont);
  const copyText = stripUnsupportedQpcGlyphs(word.uthmani, isQpcHafsFont).trim();

  if (!displayText?.trim()) {
    return null;
  }

  const translation = word[wordLang as LanguageCode] as string | undefined;
  const hasTranslation = Boolean(translation && translation.trim());
  const showTooltip = !showByWords && hasTranslation;

  // Style for Tajweed words - use V4 font
  const tajweedStyle =
    useTajweed && tajweedFontFamily ? { fontFamily: tajweedFontFamily } : undefined;

  return (
    <span
      key={`${word.id}-${index}`}
      className="inline-block text-center align-middle verse-audio-word"
      data-verse-word="true"
      data-verse-key={verseKey}
      data-word-position={wordPosition}
      data-copy-text={copyText || undefined}
    >
      {showTooltip ? (
        <Popover.Root open={isPopoverOpen && !isPlayerVisible} onOpenChange={setIsPopoverOpen}>
          <Popover.Trigger asChild>
            <span
              className="relative cursor-pointer inline-block outline-none bg-transparent p-0 text-inherit caret-transparent"
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
        <span
          className={`inline-block ${isPlayerVisible ? 'cursor-pointer caret-transparent' : ''}`}
          style={tajweedStyle}
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

  // Dynamically load Arabic font when user changes their selection
  useDynamicFontLoader(settings.arabicFontFace);

  const showByWords = settings.showByWords ?? false;
  const wordLang = settings.wordLang ?? 'en';
  const isQpcHafsFont = settings.arabicFontFace?.includes('UthmanicHafs1Ver18') ?? false;
  const verseText = verse.text_uthmani;
  const tajweed = settings.tajweed ?? false;

  const handleCopy = (event: React.ClipboardEvent<HTMLParagraphElement>): void => {
    if (typeof window === 'undefined') return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const container = event.currentTarget;
    const wordNodes = Array.from(
      container.querySelectorAll<HTMLElement>('[data-verse-word="true"]')
    );
    const selectedWords = wordNodes
      .filter((node) => {
        try {
          return range.intersectsNode(node);
        } catch {
          return false;
        }
      })
      .map((node) => node.dataset['copyText']?.trim())
      .filter((text): text is string => Boolean(text));
    const normalized = selectedWords.length
      ? selectedWords.join(' ')
      : selection.toString().replace(/\s+/g, ' ').trim();
    if (!normalized) return;
    event.preventDefault();
    event.clipboardData.setData('text/plain', normalized);
  };

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
        onCopy={handleCopy}
      >
        {verse.words && verse.words.length > 0 ? (
          <span>
            {verse.words
              .filter((word: Word, index: number, words: Word[]) => {
                const displayText =
                  tajweed && word.codeV2
                    ? word.codeV2
                    : stripUnsupportedQpcGlyphs(word.uthmani, isQpcHafsFont);

                // Filter only Sajdah/Rub markers (keep verse end markers)
                if (
                  /[\u06DE\uFD3E\uFD3F]/.test(word.uthmani) && !/[\u06DD]/.test(word.uthmani)
                ) {
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
                    verseKey={verse.verse_key}
                    wordPosition={word.position ?? index + 1}
                  />
                </Fragment>
              ))}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            <VerseText verseText={verseText} isQpcHafsFont={isQpcHafsFont} />
          </span>
        )}
      </p>
    </>
  );
});
