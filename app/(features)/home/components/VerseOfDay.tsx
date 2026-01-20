'use client';

import { memo, useState, useEffect, useRef, useMemo } from 'react';

import { cleanTranslationText } from '@/lib/text/cleanTranslationText';

import type { Chapter, Verse } from '@/types';

// Renamed from VerseOfDaySimple
interface VerseOfDayProps {
  /** Pre-fetched verses from server (up to 5) */
  verses: readonly Verse[];
  /** Pre-fetched chapters for name lookup */
  chapters: ReadonlyArray<Chapter>;
  className?: string;
}

/**
 * Optimized Verse of the Day component.
 *
 * Features:
 * - Uses preloaded UthmanicHafs font (instant LCP)
 * - Simple 10-second rotation between pre-fetched verses
 * - Only rotates when component is mounted (homepage visible)
 * - No loading states - content is always available from SSG
 * - Minimal client-side logic for best performance
 */
export const VerseOfDay = memo(function VerseOfDay({
  verses,
  chapters,
  className,
}: VerseOfDayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hasVerses = verses && verses.length > 0;
  const versesLength = verses?.length ?? 0;

  const chapterNameById = useMemo(() => {
    const map = new Map<number, string>();
    for (const chapter of chapters) {
      map.set(chapter.id, chapter.name_simple);
    }
    return map;
  }, [chapters]);

  // Rotate verse every 15 seconds
  useEffect(() => {
    if (!hasVerses || versesLength <= 1) return;

    timerRef.current = setInterval(() => {
      setIsTransitioning(true);

      // After fade-out, change verse
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % versesLength);
        setIsTransitioning(false);
      }, 300);
    }, 15000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [hasVerses, versesLength]);

  // Memoize current verse data
  const verseData = useMemo(() => {
    if (!hasVerses) return null;
    const verse = verses[currentIndex];
    if (!verse) return null;

    const [surahNum, ayahNum] = verse.verse_key.split(':');
    const sahihTranslation = verse.translations?.find((t) => t.resource_id === 20)?.text;
    return {
      text: verse.text_uthmani,
      translation: sahihTranslation ?? verse.translations?.[0]?.text,
      surahNum,
      ayahNum,
    };
  }, [hasVerses, verses, currentIndex]);

  // Don't render if no verses available
  if (!verseData) {
    return null;
  }

  // Remove unwanted marks like "Small High Rounded Zero" (0x06DF) which renders as a large circle in this font
  const cleanArabicText = verseData.text.replace(/[\u06df\u06e0]/g, '');
  const referenceChapterName =
    chapterNameById.get(Number(verseData.surahNum)) ?? `Surah ${verseData.surahNum}`;
  const referenceText = `${referenceChapterName} ${verseData.surahNum}:${verseData.ayahNum}`;
  const cleanedTranslation = verseData.translation
    ? cleanTranslationText(verseData.translation)
    : null;

  return (
    <div
      className={`w-full p-4 md:p-6 lg:p-8 rounded-2xl shadow-lg bg-surface-navigation border border-border/30 dark:border-border/20 min-h-[180px] ${className || ''}`}
    >
      <div
        className={`transition-opacity duration-300 ease-in-out space-y-4 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
      >
        {/* Arabic text - uses preloaded UthmanicHafs font */}
        <h3
          className="text-2xl md:text-3xl lg:text-4xl leading-relaxed text-right text-content-accent"
          dir="rtl"
          style={{ fontFamily: 'UthmanicHafs1Ver18, Arial, sans-serif' }}
        >
          {cleanArabicText}
        </h3>

        {/* Translation - uses system font */}
        {cleanedTranslation && (
          <p className="text-left text-sm md:text-base text-content-secondary">
            &quot;{cleanedTranslation}&quot; - [{referenceText}]
          </p>
        )}
      </div>
    </div>
  );
});
