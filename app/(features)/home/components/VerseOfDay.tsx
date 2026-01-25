'use client';

import { memo, useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { resolveVerseTranslation } from '@/app/(features)/home/utils/resolveVerseTranslation';
import { useSettings } from '@/app/providers/SettingsContext';
import { cleanTranslationText } from '@/lib/text/cleanTranslationText';
import { localizeDigits } from '@/lib/text/localizeNumbers';

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
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
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

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(mediaQuery.matches);
    update();

    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  // Rotate verse every 15 seconds
  useEffect(() => {
    if (!hasVerses || versesLength <= 1 || prefersReducedMotion) return;

    const stop = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    const start = () => {
      stop();
      timerRef.current = setInterval(() => {
        setIsTransitioning(true);

        // After fade-out, change verse
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % versesLength);
          setIsTransitioning(false);
        }, 300);
      }, 15000);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        start();
      } else {
        stop();
      }
    };

    onVisibilityChange();
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      stop();
    };
  }, [hasVerses, prefersReducedMotion, versesLength]);

  // Memoize current verse data
  const verseData = useMemo(() => {
    if (!hasVerses) return null;
    const verse = verses[currentIndex];
    if (!verse) return null;

    const [surahNum, ayahNum] = verse.verse_key.split(':');
    const translation = resolveVerseTranslation(verse, settings.translationId);
    return {
      text: verse.text_uthmani,
      translation,
      surahNum,
      ayahNum,
    };
  }, [hasVerses, verses, currentIndex, settings.translationId]);

  // Don't render if no verses available
  if (!verseData) {
    return null;
  }

  // Remove unwanted marks like "Small High Rounded Zero" (0x06DF) which renders as a large circle in this font
  const cleanArabicText = verseData.text.replace(/[\u06df\u06e0]/g, '');
  const surahId = Number(verseData.surahNum);
  const fallbackChapterName = chapterNameById.get(surahId) ?? `Surah ${verseData.surahNum}`;
  const referenceChapterName = t(`surah_names.${surahId}`, fallbackChapterName);
  const referenceText = `${referenceChapterName} ${localizeDigits(
    `${verseData.surahNum}:${verseData.ayahNum}`,
    i18n.language
  )}`;
  const cleanedTranslation = verseData.translation
    ? cleanTranslationText(verseData.translation)
    : null;

  const contentClassName = prefersReducedMotion
    ? 'space-y-4'
    : `transition-opacity duration-300 ease-in-out space-y-4 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`;

  return (
    <div
      className={`w-full p-4 md:p-6 lg:p-8 rounded-2xl shadow-lg bg-surface-navigation border border-border/30 dark:border-border/20 min-h-[180px] ${className || ''}`}
    >
      <div className={contentClassName}>
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
