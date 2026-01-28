'use client';

import { memo, useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { resolveVerseTranslation } from '@/app/(features)/home/utils/resolveVerseTranslation';
import { useSettings } from '@/app/providers/SettingsContext';
import { getVerseTranslationByKey } from '@/lib/api/verses/extras';
import { cleanTranslationText } from '@/lib/text/cleanTranslationText';
import { localizeDigits } from '@/lib/text/localizeNumbers';

import type { Chapter, Verse } from '@/types';

const VOTD_TRANSLATION_CACHE = new Map<string, string>();

const createTranslationCacheKey = (verseKey: string, translationId: number): string =>
  `${verseKey}:${translationId}`;

const scheduleIdleWork = (work: () => void): (() => void) => {
  const win = window as unknown as {
    requestIdleCallback?: (cb: () => void, options?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };

  if (typeof win.requestIdleCallback === 'function') {
    const handle = win.requestIdleCallback(work, { timeout: 1200 });
    return () => {
      win.cancelIdleCallback?.(handle);
    };
  }

  const timer = window.setTimeout(work, 0);
  return () => window.clearTimeout(timer);
};

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
  const [translationOverrides, setTranslationOverrides] = useState<Record<string, string>>({});
  const [isLoadingTranslations, setIsLoadingTranslations] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hasVerses = verses && verses.length > 0;
  const versesLength = verses?.length ?? 0;

  const isTranslationDisabled = Boolean(
    settings.translationIds && settings.translationIds.length === 0
  );
  const activeTranslationId = useMemo(() => {
    if (isTranslationDisabled) return null;
    return settings.translationIds?.[0] ?? settings.translationId ?? null;
  }, [isTranslationDisabled, settings.translationIds, settings.translationId]);

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

  useEffect(() => {
    if (!hasVerses) return;
    if (isTranslationDisabled) {
      setTranslationOverrides({});
      setIsLoadingTranslations(false);
      return;
    }
    if (typeof activeTranslationId !== 'number' || !Number.isFinite(activeTranslationId)) {
      setTranslationOverrides({});
      setIsLoadingTranslations(false);
      return;
    }

    // Clear any overrides from a previous translation selection immediately to avoid stale display.
    setTranslationOverrides({});

    let cancelled = false;

    const needsFetch = verses.some((verse) => {
      const verseKey = verse.verse_key;
      if (!verseKey) return false;
      return !verse.translations?.some((t) => t.resource_id === activeTranslationId);
    });

    setIsLoadingTranslations(needsFetch);

    const cancelIdle = scheduleIdleWork(() => {
      void (async () => {
        const next: Record<string, string> = {};

        await Promise.all(
          verses.map(async (verse) => {
            const verseKey = verse.verse_key;
            if (!verseKey) return;

            if (verse.translations?.some((t) => t.resource_id === activeTranslationId)) {
              return;
            }

            const cacheKey = createTranslationCacheKey(verseKey, activeTranslationId);
            const cached = VOTD_TRANSLATION_CACHE.get(cacheKey);
            if (cached) {
              next[verseKey] = cached;
              return;
            }

            try {
              const text = await getVerseTranslationByKey(verseKey, activeTranslationId);
              if (!text) return;

              VOTD_TRANSLATION_CACHE.set(cacheKey, text);
              next[verseKey] = text;
            } catch {
              // Silent failure: fall back to whatever is already present in the initial payload.
            }
          })
        );

        if (cancelled) return;
        setTranslationOverrides(next);
        setIsLoadingTranslations(false);
      })();
    });

    return () => {
      cancelled = true;
      cancelIdle();
      setIsLoadingTranslations(false);
    };
  }, [activeTranslationId, hasVerses, isTranslationDisabled, verses]);

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
    const translation =
      isTranslationDisabled || typeof activeTranslationId !== 'number'
        ? undefined
        : (translationOverrides[verse.verse_key] ??
          resolveVerseTranslation(verse, activeTranslationId));
    return {
      text: verse.text_uthmani,
      translation,
      surahNum,
      ayahNum,
    };
  }, [
    activeTranslationId,
    currentIndex,
    hasVerses,
    isTranslationDisabled,
    translationOverrides,
    verses,
  ]);

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

  const showTranslationSkeleton =
    !isTranslationDisabled &&
    typeof activeTranslationId === 'number' &&
    isLoadingTranslations &&
    !cleanedTranslation;

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

        {showTranslationSkeleton && (
          <div className="space-y-2" aria-hidden="true">
            <div className="h-4 w-11/12 rounded bg-interactive animate-pulse" />
            <div className="h-4 w-9/12 rounded bg-interactive animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
});
