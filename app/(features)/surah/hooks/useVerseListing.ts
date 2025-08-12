import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { getTranslations, getWordTranslations } from '@/lib/api';
import { useSettings } from '@/app/providers/SettingsContext';
import { WORD_LANGUAGE_LABELS } from '@/lib/text/wordLanguages';
import { useAudio } from '@/app/(features)/player/context/AudioContext';
import type { Verse, TranslationResource } from '@/types';

interface LookupFn {
  (
    id: string,
    translationId: number,
    page: number,
    perPage: number,
    wordLang: string
  ): Promise<{ verses: Verse[]; totalPages: number }>;
}

interface UseVerseListingParams {
  id?: string;
  lookup: LookupFn;
}

interface WordLanguageOption {
  name: string;
  id: number;
}

export function useVerseListing({ id, lookup }: UseVerseListingParams) {
  const [error, setError] = useState<string | null>(null);
  const { settings, setSettings } = useSettings();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { activeVerse, setActiveVerse, reciter, isPlayerVisible, openPlayer } = useAudio();

  const { data: translationOptionsData } = useSWR<TranslationResource[]>(
    'translations',
    getTranslations
  );
  const translationOptions = useMemo(() => translationOptionsData || [], [translationOptionsData]);

  const { data: wordTranslationOptionsData } = useSWR('wordTranslations', getWordTranslations);
  const wordLanguageMap = useMemo(() => {
    const map: Record<string, number> = {};
    (wordTranslationOptionsData || []).forEach((o) => {
      const name = o.language_name.toLowerCase();
      if (!map[name]) {
        map[name] = o.id;
      }
    });
    return map;
  }, [wordTranslationOptionsData]);

  const wordLanguageOptions: WordLanguageOption[] = useMemo(
    () =>
      Object.keys(wordLanguageMap)
        .filter((name) => WORD_LANGUAGE_LABELS[name])
        .map((name) => ({ name: WORD_LANGUAGE_LABELS[name], id: wordLanguageMap[name] })),
    [wordLanguageMap]
  );

  const { data, size, setSize, isValidating } = useSWRInfinite(
    (index) => (id ? ['verses', id, settings.translationId, settings.wordLang, index + 1] : null),
    ([, pId, translationId, wordLang, page]) =>
      lookup(pId, translationId, page, 20, wordLang).catch((err) => {
        setError(`Failed to load content. ${err.message}`);
        return { verses: [], totalPages: 1 };
      })
  );

  const verses: Verse[] = useMemo(() => (data ? data.flatMap((d) => d.verses) : []), [data]);
  const totalPages = useMemo(() => (data ? data[data.length - 1]?.totalPages : 1), [data]);
  const isLoading = !data && !error;
  const isReachingEnd = size >= totalPages;

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isReachingEnd && !isValidating) {
        setSize(size + 1);
      }
    });
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [isReachingEnd, isValidating, size, setSize]);

  const handleNext = useCallback(() => {
    if (!activeVerse) return false;
    const currentIndex = verses.findIndex((v) => v.id === activeVerse.id);
    if (currentIndex < verses.length - 1) {
      setActiveVerse(verses[currentIndex + 1]);
      openPlayer();
      return true;
    }
    return false;
  }, [activeVerse, verses, setActiveVerse, openPlayer]);

  const handlePrev = useCallback(() => {
    if (!activeVerse) return false;
    const currentIndex = verses.findIndex((v) => v.id === activeVerse.id);
    if (currentIndex > 0) {
      setActiveVerse(verses[currentIndex - 1]);
      openPlayer();
      return true;
    }
    return false;
  }, [activeVerse, verses, setActiveVerse, openPlayer]);

  return {
    error,
    isLoading,
    verses,
    isValidating,
    isReachingEnd,
    loadMoreRef,
    translationOptions,
    wordLanguageOptions,
    wordLanguageMap,
    settings,
    setSettings,
    activeVerse,
    reciter,
    isPlayerVisible,
    handleNext,
    handlePrev,
  } as const;
}

export default useVerseListing;
