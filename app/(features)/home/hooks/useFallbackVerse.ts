'use client';

import { useCallback, useState } from 'react';
import useSWR from 'swr';
import { Verse } from '@/types';
import { getVerseByKey } from '@/lib/api';

// Curated verses that always work as fallback
const FALLBACK_VERSE_KEYS = [
  '2:255', // Ayat al-Kursi
  '1:1', // Al-Fatihah opening
  '1:2', // Al-Fatihah verse 2
  '1:3', // Al-Fatihah verse 3
  '1:4', // Al-Fatihah verse 4
  '1:5', // Al-Fatihah verse 5
  '1:6', // Al-Fatihah verse 6
  '1:7', // Al-Fatihah verse 7
  '2:1', // Al-Baqarah opening
  '2:2', // Al-Baqarah verse 2
  '3:1', // Al Imran opening
  '3:2', // Al Imran verse 2
  '112:1', // Al-Ikhlas opening
  '112:2', // Al-Ikhlas verse 2
  '112:3', // Al-Ikhlas verse 3
  '112:4', // Al-Ikhlas verse 4
  '113:1', // Al-Falaq opening
  '114:1', // An-Nas opening
  '36:1', // Ya-Sin opening
  '67:1', // Al-Mulk opening
];

interface UseFallbackVerseOptions {
  translationId: number;
  initialIndex?: number;
}

interface UseFallbackVerseReturn {
  verse: Verse | null;
  loading: boolean;
  error: string | null;
  currentIndex: number;
  nextVerse: () => void;
  refresh: () => void;
  totalVerses: number;
}

/**
 * Hook for cycling through curated fallback verses
 * Provides reliable verse content when random API is unavailable
 */
export function useFallbackVerse({
  translationId,
  initialIndex = 0,
}: UseFallbackVerseOptions): UseFallbackVerseReturn {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const fallbackVerseFetcher = useCallback(async (): Promise<Verse> => {
    const verseKey = FALLBACK_VERSE_KEYS[currentIndex % FALLBACK_VERSE_KEYS.length];
    return await getVerseByKey(verseKey, translationId);
  }, [translationId, currentIndex]);

  const {
    data: verse,
    error: swrError,
    mutate,
  } = useSWR(['fallback-verse', translationId, currentIndex], fallbackVerseFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const nextVerse = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % FALLBACK_VERSE_KEYS.length);
  }, []);

  const refresh = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    verse: verse || null,
    loading: !verse && !swrError,
    error: swrError ? 'Failed to load verse' : null,
    currentIndex,
    nextVerse,
    refresh,
    totalVerses: FALLBACK_VERSE_KEYS.length,
  };
}
