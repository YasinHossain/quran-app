'use client';
import * as Popover from '@radix-ui/react-popover';
import { memo, useState } from 'react';

import { VerseMarker } from '@/app/(features)/surah/components/surah-view/VerseMarker';
import { useSettings } from '@/app/providers/SettingsContext';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import { applyTajweed } from '@/lib/text/tajweed';
import { Verse as VerseType, Word } from '@/types';

import type { LanguageCode } from '@/lib/text/languageCodes';

// Word rendering component
interface WordDisplayProps {
  word: Word;
  index: number;
  showByWords: boolean;
  wordLang: string;
  settings: { tajweed?: boolean; arabicFontSize: number };
  isQpcHafsFont: boolean;
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
}: WordDisplayProps): React.JSX.Element | null => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Strip verse markers
  if (/[\u06DD\u06DE\uFD3E\uFD3F]/.test(word.uthmani)) {
    return null;
  }

  const cleanUthmani = stripUnsupportedQpcGlyphs(word.uthmani, isQpcHafsFont);

  if (!cleanUthmani.trim()) {
    return null;
  }

  const translation = word[wordLang as LanguageCode] as string | undefined;
  const hasTranslation = Boolean(translation && translation.trim());

  return (
    <span key={`${word.id}-${index}`} className="inline-block text-center align-middle ml-1.5 lg:ml-3">
      {!showByWords && hasTranslation ? (
        <Popover.Root open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <Popover.Trigger asChild>
            <span
              className="relative cursor-pointer inline-block outline-none bg-transparent p-0 text-inherit"
              onPointerEnter={(e) => {
                if (e.pointerType === 'mouse') setIsPopoverOpen(true);
              }}
              onPointerLeave={(e) => {
                if (e.pointerType === 'mouse') setIsPopoverOpen(false);
              }}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(
                    settings.tajweed ? applyTajweed(cleanUthmani) : cleanUthmani
                  ),
                }}
              />
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
        <span className="inline-block">
          <span
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(settings.tajweed ? applyTajweed(cleanUthmani) : cleanUthmani),
            }}
          />
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
  settings,
  isQpcHafsFont,
}: {
  verseText: string;
  settings: { tajweed?: boolean };
  isQpcHafsFont: boolean;
}): React.JSX.Element => {
  // Strip verse markers (U+06DD ۝, U+06DE ۞)
  const normalizedText = stripUnsupportedQpcGlyphs(verseText, isQpcHafsFont);
  const cleanText = normalizedText.replace(/[\u06DD\u06DE]/g, '');

  if (settings.tajweed) {
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(applyTajweed(cleanText)),
        }}
      />
    );
  }
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

  // Extract verse number from verse_key (format: "surah:verse")
  const verseNumber = verse.verse_key ? parseInt(verse.verse_key.split(':')[1] || '0', 10) : 0;

  return (
    <p
      dir="rtl"
      className="text-right leading-loose text-foreground"
      style={{
        fontFamily: settings.arabicFontFace,
        fontSize: `${settings.arabicFontSize}px`,
        lineHeight: 2.2,
      }}
    >
      {verse.words && verse.words.length > 0 ? (
        <span>
          {verse.words.map((word: Word, index: number) => {
            // Heuristic: If the last word contains no Arabic letters (only symbols/numbers),
            // it is likely a verse marker. Hide it to avoid duplication.
            // Arabic letters range: \u0621-\u064A (Hamza to Yeh), plus extended characters.
            const hasArabicLetters = /[\u0621-\u064A\u0671-\u06D3]/.test(word.uthmani);
            const isLastWord = index === (verse.words?.length ?? 0) - 1;

            if (isLastWord && !hasArabicLetters) {
              return null;
            }

            // Also filter known marker characters anywhere (just in case)
            if (word.char_type_name === 'end' || /[\u06DD\u06DE\uFD3E\uFD3F]/.test(word.uthmani)) {
              return null;
            }
            return (
              <WordDisplay
                key={`${word.id}-${index}`}
                word={word}
                index={index}
                showByWords={showByWords}
                wordLang={wordLang}
                settings={settings}
                isQpcHafsFont={isQpcHafsFont}
              />
            );
          })}
          {verseNumber > 0 && <VerseMarker number={verseNumber} style={{ marginBottom: 0 }} />}
        </span>
      ) : (
        <span className="inline-flex items-center gap-2">
          <VerseText verseText={verseText} settings={settings} isQpcHafsFont={isQpcHafsFont} />
          {verseNumber > 0 && <VerseMarker number={verseNumber} style={{ marginBottom: 0 }} />}
        </span>
      )}
    </p>
  );
});
