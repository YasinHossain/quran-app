'use client';

import { memo } from 'react';

import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import { stripHtml } from '@/lib/text/stripHtml';
import { applyTajweed } from '@/lib/text/tajweed';

import type { Verse, Word } from '@/types';

interface VerseContentProps {
  verse: Verse;
  surahName: string | null;
  tajweedEnabled: boolean;
  isTransitioning: boolean;
  className?: string;
}

// Word tooltip component
interface WordTooltipProps {
  word: Word;
  tajweedEnabled: boolean;
}

const WordTooltip = ({ word, tajweedEnabled }: WordTooltipProps): React.JSX.Element => (
  <span key={word.id} className="inline-block mx-0.5 relative group">
    {tajweedEnabled ? (
      <span
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(applyTajweed(word.uthmani)),
        }}
      />
    ) : (
      word.uthmani
    )}
    {word.en && (
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1 py-0.5 rounded bg-accent text-on-accent text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 md:block hidden">
        {word.en}
      </span>
    )}
  </span>
);

// Arabic text rendering
interface ArabicTextProps {
  verse: Verse;
  tajweedEnabled: boolean;
}

const ArabicText = ({ verse, tajweedEnabled }: ArabicTextProps): React.JSX.Element => {
  // Render word-by-word if available
  if (verse.words && verse.words.length > 0) {
    return (
      <>
        {verse.words.map((word: Word) => (
          <WordTooltip key={word.id} word={word} tajweedEnabled={tajweedEnabled} />
        ))}
      </>
    );
  }

  // Render as full text
  return tajweedEnabled ? (
    <span
      dangerouslySetInnerHTML={{
        __html: sanitizeHtml(applyTajweed(verse.text_uthmani)),
      }}
    />
  ) : (
    <>{verse.text_uthmani}</>
  );
};

// Translation component
interface TranslationProps {
  verse: Verse;
  surahName: string | null;
}

const Translation = ({ verse, surahName }: TranslationProps): React.JSX.Element | null => {
  if (!verse.translations?.[0]) return null;

  const [surahNum] = verse.verse_key.split(':');

  return (
    <p className="text-left text-sm md:text-base text-content-secondary">
      &quot;{stripHtml(verse.translations[0].text)}&quot; - [Surah {surahName ?? surahNum},{' '}
      {verse.verse_key}]
    </p>
  );
};

// Verse container component
interface VerseContainerProps {
  verse: Verse;
  surahName: string | null;
  tajweedEnabled: boolean;
  isTransitioning: boolean;
  className?: string;
}

const VerseContainer = ({
  verse,
  surahName,
  tajweedEnabled,
  isTransitioning,
  className,
}: VerseContainerProps): React.JSX.Element => (
  <div
    className={`mt-8 md:mt-12 w-full max-w-xl md:max-w-4xl p-4 md:p-6 lg:p-8 rounded-2xl shadow-lg backdrop-blur-xl content-visibility-auto animate-fade-in-up animation-delay-400 bg-surface-glass/60 ${className || ''}`}
  >
    <div
      className={`transition-opacity duration-300 ease-in-out space-y-4 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
    >
      <h3
        className="font-amiri text-2xl md:text-3xl lg:text-4xl leading-relaxed text-right text-content-accent"
        dir="rtl"
      >
        <ArabicText verse={verse} tajweedEnabled={tajweedEnabled} />
      </h3>
      <Translation verse={verse} surahName={surahName} />
    </div>
  </div>
);

/**
 * Verse content display component with Arabic text, translation, and word tooltips
 * Handles tajweed highlighting and responsive design
 */
export const VerseContent = memo(function VerseContent({
  verse,
  surahName,
  tajweedEnabled,
  isTransitioning,
  className,
}: VerseContentProps): React.JSX.Element {
  return (
    <VerseContainer
      verse={verse}
      surahName={surahName}
      tajweedEnabled={tajweedEnabled}
      isTransitioning={isTransitioning}
      className={className}
    />
  );
});
