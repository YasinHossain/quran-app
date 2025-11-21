'use client';
import { memo } from 'react';

import { useSettings } from '@/app/providers/SettingsContext';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import { applyTajweed } from '@/lib/text/tajweed';
import { Verse as VerseType, Word } from '@/types';
import { VerseMarker } from '@/app/(features)/surah/components/surah-view/VerseMarker';

import type { LanguageCode } from '@/lib/text/languageCodes';

// Word rendering component
interface WordDisplayProps {
  word: Word;
  index: number;
  showByWords: boolean;
  wordLang: string;
  settings: { tajweed?: boolean; arabicFontSize: number };
}

const WordDisplay = ({
  word,
  index,
  showByWords,
  wordLang,
  settings,
}: WordDisplayProps): React.JSX.Element | null => {
  // Strip verse markers (U+06DD ۝, U+06DE ۞) from the text to avoid duplication with the SVG marker
  // If the word contains a verse marker, we assume it's the verse ending word and hide it completely
  // because we are rendering our own custom VerseMarker component.
  if (/[\u06DD\u06DE\uFD3E\uFD3F]/.test(word.uthmani)) {
    return null;
  }

  const cleanUthmani = word.uthmani;

  if (!cleanUthmani.trim()) {
    return null;
  }

  return (
    <span key={`${word.id}-${index}`} className="text-center">
      <span className="relative group cursor-pointer inline-block">
        <span
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(settings.tajweed ? applyTajweed(cleanUthmani) : cleanUthmani),
          }}
        />
        {!showByWords && (
          <span className="absolute left-1/2 -translate-x-1/2 -top-7 hidden group-hover:block bg-accent text-on-accent text-xs px-2 py-1 rounded shadow z-10 whitespace-nowrap">
            {word[wordLang as LanguageCode] as string}
          </span>
        )}
      </span>
      {showByWords && (
        <span
          className="mt-0.5 block text-muted mx-1"
          style={{ fontSize: `${settings.arabicFontSize * 0.5}px` }}
        >
          {word[wordLang as LanguageCode] as string}
        </span>
      )}
    </span>
  );
};

// Verse text component for fallback display
const VerseText = ({
  verse,
  settings,
}: {
  verse: VerseType;
  settings: { tajweed?: boolean };
}): React.JSX.Element => {
  // Strip verse markers (U+06DD ۝, U+06DE ۞)
  const cleanText = verse.text_uthmani.replace(/[\u06DD\u06DE]/g, '');

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
        <span className="flex flex-wrap gap-x-3 gap-y-1 justify-start items-center">
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
            if (
              word.char_type_name === 'end' ||
              /[\u06DD\u06DE\uFD3E\uFD3F]/.test(word.uthmani)
            ) {
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
              />
            );
          })}
          {verseNumber > 0 && <VerseMarker number={verseNumber} style={{ marginBottom: 0 }} />}
        </span>
      ) : (
        <span className="inline-flex items-center gap-2">
          <VerseText verse={verse} settings={settings} />
          {verseNumber > 0 && <VerseMarker number={verseNumber} style={{ marginBottom: 0 }} />}
        </span>
      )}
    </p >
  );
});
