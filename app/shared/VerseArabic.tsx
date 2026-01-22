'use client';
import * as Popover from '@radix-ui/react-popover';
import { Fragment, memo, useContext, useMemo, useState } from 'react';

import { useQcfMushafFont } from '@/app/(features)/surah/hooks/useQcfMushafFont';
import { useDynamicFontLoader } from '@/app/hooks/useDynamicFontLoader';
import { useSettings } from '@/app/providers/SettingsContext';
import { HybridVerseMarker } from '@/app/shared/components/verse-marker/VerseMarker';
import { AudioContext } from '@/app/shared/player/context/AudioContext';
import { TajweedFontPalettes } from '@/app/shared/TajweedFontPalettes';
import { useBreakpoint } from '@/lib/responsive';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import { cn } from '@/lib/utils/cn';
import { Verse as VerseType, Word } from '@/types';

import type { LanguageCode } from '@/lib/text/languageCodes';

// Helper to determine if a word IS the verse number (and extract it)
const getVerseNumber = (text: string): number | null => {
  if (!text) return null;
  const trimmed = text.trim();

  // 1. Check for pure Arabic-Indic numerals (e.g. "١")
  if (/^[\u0660-\u0669]+$/.test(trimmed)) {
    const arabicIndicDigits = '٠١٢٣٤٥٦٧٨٩';
    const western = trimmed
      .split('')
      .map((d) => arabicIndicDigits.indexOf(d))
      .join('');
    return parseInt(western, 10);
  }

  // 2. Check for U+06DD followed by Arabic-Indic numerals (e.g. "۝١")
  const matchWithMarker = trimmed.match(/\u06DD([\u0660-\u0669]+)/);
  if (matchWithMarker && matchWithMarker[1]) {
    const arabicIndicDigits = '٠١٢٣٤٥٦٧٨٩';
    const western = matchWithMarker[1]
      .split('')
      .map((d) => arabicIndicDigits.indexOf(d))
      .join('');
    return parseInt(western, 10);
  }

  return null;
};

const INDOPAK_FONT_FACES = new Set([
  '"IndoPak", serif',
  '"Noor-e-Huda", serif',
  '"Noor-e-Hidayat", serif',
  '"Noor-e-Hira", serif',
  '"Lateef", serif',
]);

const resolveWordText = (word: Word, isIndopakFont: boolean): string =>
  isIndopakFont ? (word.indopak ?? word.uthmani) : word.uthmani;

const resolveVerseText = (verse: VerseType, isIndopakFont: boolean): string =>
  isIndopakFont ? (verse.text_indopak ?? verse.text_uthmani) : verse.text_uthmani;

// Quran annotation / waqf markers (e.g. ۛ ۚ ۖ ۗ) are encoded as standalone characters.
// Some APIs return them as their own "word", which can cause them to wrap onto a new line
// and appear detached (e.g. floating at the margin). Detect these "marker-only" words so
// we can keep them visually attached to the preceding word.
const isStandaloneQuranMarkerWord = (text: string): boolean => {
  if (!text) return false;
  const trimmed = text.trim();
  if (!trimmed) return false;

  // Strip bidi and formatting controls that some APIs include around Arabic tokens.
  const normalized = trimmed.replace(/[\u061C\u200C-\u200F\u202A-\u202E\u2066-\u2069]/g, '');
  if (!normalized) return false;

  // If a token includes digits (e.g. verse marker + number), it's not a waqf marker.
  if (/[\u0660-\u0669]/.test(normalized)) return false;

  // Quranic annotation marks live mostly in U+06D6..U+06ED (Arabic Extended-A).
  // Treat tokens consisting solely of these codepoints as markers.
  return /^[\u06D6-\u06ED]+$/.test(normalized);
};

// Word rendering component
interface WordDisplayProps {
  word: Word;
  index: number;
  showByWords: boolean;
  wordLang: string;
  settings: { arabicFontSize: number; arabicFontFace?: string };
  isQpcHafsFont: boolean;
  /** When true and word.codeV2 is available, render Tajweed glyph code */
  tajweed?: boolean;
  /** V4 font family to use for Tajweed rendering */
  tajweedFontFamily?: string | undefined;
  /** Verse key for audio word sync highlighting */
  verseKey: string;
  /** Word position (1-indexed) for audio word sync highlighting */
  wordPosition: number;
  /** Current font family for hybrid verse marker detection */
  fontFamily?: string;
  isIndopakFont: boolean;
}

// QPC Uthmani Hafs font lacks the U+06DF glyph, which shows up as a black circle; strip it when selected.
// ALSO strip U+06DD from text nodes because we handle the verse marker separately.
const cleanTextContent = (text: string, isQpcHafsFont: boolean): string => {
  if (!text) return '';
  let cleaned = text;
  // Always strip the verse marker (۝) from text words to prevent duplication/double markers
  // The marker is only re-added by the HybridVerseMarker for the actual verse number word.
  cleaned = cleaned.replace(/\u06DD/g, '');

  if (isQpcHafsFont) {
    cleaned = cleaned.replace(/\u06DF/g, '');
  }
  return cleaned;
};

// Legacy name alias for other components in this file using it
const stripUnsupportedQpcGlyphs = cleanTextContent;

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
  fontFamily,
  isIndopakFont,
}: WordDisplayProps): React.JSX.Element | null => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const audioCtx = useContext(AudioContext);
  const isPlayerVisible = audioCtx?.isPlayerVisible ?? false;
  const verticalAlignClass = showByWords ? 'align-top' : 'align-baseline';
  const baseWordText = resolveWordText(word, isIndopakFont);

  // Marker-only words (e.g. ۛ) should render without extra inline-block boxing/centering,
  // and without tooltips/copy metadata, otherwise they can look "detached".
  if (isStandaloneQuranMarkerWord(baseWordText)) {
    const useTajweed = tajweed && word.codeV2;
    const rawText = (useTajweed ? word.codeV2 : baseWordText) || '';
    const displayText = cleanTextContent(rawText, isQpcHafsFont);
    if (!displayText?.trim()) return null;
    return (
      <span
        key={`${word.id}-${index}`}
        className={verticalAlignClass}
        aria-hidden="true"
        style={{ position: 'relative', insetInlineStart: '0.12em' }}
      >
        {displayText}
      </span>
    );
  }

  // Skip rendering for Rub/Sajdah markers if that's all the word is
  if (/[\u06DE\uFD3E\uFD3F]/.test(baseWordText) && !/[\u06DD]/.test(baseWordText)) {
    return null;
  }

  // Check if this word is the verse number
  const verseNum = getVerseNumber(baseWordText);
  // Also check if the word is formally typed as an 'end' marker in the API data.
  // This helps identify standalone markers that might be "empty" of digits.
  const isEndWord = word.char_type_name === 'end';

  // Logic: Use HybridVerseMarker if we have a valid number, or if it's explicitly an 'end' word.
  if (verseNum !== null || isEndWord) {
    // If we have a valid verse number, render the Unified Verse Marker
    if (verseNum !== null) {
      return (
        <span
          key={`${word.id}-${index}`}
          className={`inline-block text-center ${verticalAlignClass} verse-audio-word`}
          data-verse-word="true"
          data-verse-key={verseKey}
          data-word-position={wordPosition}
        >
          <HybridVerseMarker verseNumber={verseNum} {...(fontFamily ? { fontFamily } : {})} />
        </span>
      );
    }

    // If it's an 'end' word but NO extracted number (e.g. standalone bubble), HIDE IT.
    // This solves the "double marker" / "ghost marker" issue where the API sends
    // a separate word for the marker bubble.
    return null;
  }

  // CASE 2: It is regular text (or a standalone marker that failed num extraction)
  // Logic: Strip any U+06DD characters so they don't appear as duplicates.
  // Use codeV2 for Tajweed when available, otherwise fall back to uthmani
  const useTajweed = tajweed && word.codeV2;
  const rawText = (useTajweed ? word.codeV2 : baseWordText) || '';

  // Clean the text (removes \u06DD and other unsupported glyphs)
  const displayText = cleanTextContent(rawText, isQpcHafsFont);
  const copyText = cleanTextContent(baseWordText, isQpcHafsFont).trim();

  // If text is empty after cleaning (e.g. it was just "۝"), hide it.
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
      className={`inline-block text-center ${verticalAlignClass} verse-audio-word`}
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
  className?: string | undefined;
}

export const VerseArabic = memo(function VerseArabic({
  verse,
  className,
}: VerseArabicProps): React.JSX.Element {
  const { settings } = useSettings();
  const breakpoint = useBreakpoint();

  // Dynamically load Arabic font when user changes their selection
  useDynamicFontLoader(settings.arabicFontFace);

  const showByWords = settings.showByWords ?? false;
  const wordLang = settings.wordLang ?? 'en';
  const isQpcHafsFont = settings.arabicFontFace?.includes('UthmanicHafs1Ver18') ?? false;
  const isIndopakFont = settings.arabicFontFace
    ? INDOPAK_FONT_FACES.has(settings.arabicFontFace)
    : false;
  const verseText = resolveVerseText(verse, isIndopakFont);
  const tajweed = settings.tajweed ?? false;
  const hasVerseText = Boolean(verseText?.trim());
  const isDesktopWordTooltipEnabled = breakpoint === 'desktop' || breakpoint === 'wide';
  const shouldRenderWords = tajweed || showByWords || isDesktopWordTooltipEnabled || !hasVerseText;

  const handleCopy = (event: React.ClipboardEvent<HTMLParagraphElement>): void => {
    if (typeof window === 'undefined') return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const container = event.currentTarget;
    const anchorNode = selection.anchorNode;
    const focusNode = selection.focusNode;
    if (!anchorNode || !focusNode) return;
    if (!container.contains(anchorNode) || !container.contains(focusNode)) {
      return;
    }
    const range = selection.getRangeAt(0);
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
        className={cn(
          'w-full text-right leading-loose text-foreground',
          tajweed && 'tajweed-palette',
          className
        )}
        style={{
          fontFamily: baseFontFamily,
          fontSize: `${settings.arabicFontSize}px`,
          lineHeight: 2.2,
        }}
        onCopy={handleCopy}
      >
        {shouldRenderWords && verse.words && verse.words.length > 0 ? (
          <span>
            {(() => {
              const words = verse.words.filter((word: Word) => {
                const displayText =
                  tajweed && word.codeV2
                    ? word.codeV2
                    : stripUnsupportedQpcGlyphs(
                        resolveWordText(word, isIndopakFont),
                        isQpcHafsFont
                      );

                // Filter only Sajdah/Rub markers (keep verse end markers)
                const sourceText = resolveWordText(word, isIndopakFont);
                if (/[\u06DE\uFD3E\uFD3F]/.test(sourceText) && !/[\u06DD]/.test(sourceText)) {
                  return false;
                }

                if (!displayText?.trim()) {
                  return false;
                }

                return true;
              });

              // Attach marker-only tokens to their nearest word so they can't wrap alone.
              // Handles both trailing markers (word + ۛ) and leading markers (ۛ + word).
              const groups: { word: Word; index: number }[][] = [];
              let pendingLeadingMarkers: { word: Word; index: number }[] = [];

              for (let index = 0; index < words.length; index += 1) {
                const current = words[index]!;
                const currentText = resolveWordText(current, isIndopakFont);

                if (isStandaloneQuranMarkerWord(currentText)) {
                  if (groups.length > 0) {
                    groups[groups.length - 1]!.push({ word: current, index });
                  } else {
                    pendingLeadingMarkers.push({ word: current, index });
                  }
                  continue;
                }

                groups.push([...pendingLeadingMarkers, { word: current, index }]);
                pendingLeadingMarkers = [];
              }

              if (pendingLeadingMarkers.length > 0) {
                if (groups.length > 0) {
                  groups[groups.length - 1]!.push(...pendingLeadingMarkers);
                } else {
                  groups.push(pendingLeadingMarkers);
                }
              }

              return groups.map((group, groupIndex) => {
                const groupKey = group.map((item) => item.word.id).join('-') || String(groupIndex);
                return (
                  <Fragment key={`word-group-${groupKey}-${groupIndex}`}>
                    {groupIndex > 0 ? ' ' : null}
                    <span className={group.length > 1 ? 'whitespace-nowrap' : undefined}>
                      {group.map((item) => (
                        <Fragment key={`${item.word.id}-${item.index}`}>
                          <WordDisplay
                            word={item.word}
                            index={item.index}
                            showByWords={showByWords}
                            wordLang={wordLang}
                            settings={settings}
                            isQpcHafsFont={isQpcHafsFont}
                            tajweed={tajweed}
                            tajweedFontFamily={getTajweedFontFamily(item.word)}
                            verseKey={verse.verse_key}
                            wordPosition={item.word.position ?? item.index + 1}
                            fontFamily={settings.arabicFontFace}
                            isIndopakFont={isIndopakFont}
                          />
                        </Fragment>
                      ))}
                    </span>
                  </Fragment>
                );
              });
            })()}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            <VerseText verseText={verseText} isQpcHafsFont={isQpcHafsFont} />
            {typeof verse.verse_number === 'number' && Number.isFinite(verse.verse_number) ? (
              <HybridVerseMarker
                verseNumber={verse.verse_number}
                {...(settings.arabicFontFace ? { fontFamily: settings.arabicFontFace } : {})}
              />
            ) : null}
          </span>
        )}
      </p>
    </>
  );
});
