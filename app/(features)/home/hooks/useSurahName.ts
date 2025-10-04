'use client';

import { useMemo } from 'react';

import type { Verse, Surah } from '@/types';

export function useSurahName(displayVerse: Verse | null, surahs: readonly Surah[]): string | null {
  return useMemo(() => {
    if (!displayVerse) return null;

    const [surahNum] = displayVerse.verse_key.split(':');
    return surahs.find((s) => s.number === Number(surahNum))?.name || null;
  }, [displayVerse, surahs]);
}
