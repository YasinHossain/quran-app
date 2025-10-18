'use client';

import { useEffect } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';

import type { Verse as VerseType } from '@/types';

export const useLastReadObserver = (
  verse: VerseType,
  verseRef: React.RefObject<HTMLDivElement | null>
): void => {
  const { setLastRead } = useBookmarks();

  useEffect(() => {
    if (!verseRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first && first.isIntersecting) {
          const [surahId, ayah] = verse.verse_key.split(':');
          const verseNumber = Number(ayah);
          if (!surahId || Number.isNaN(verseNumber) || verseNumber <= 0) {
            return;
          }
          setLastRead(surahId, verseNumber, verse.verse_key, verse.id);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(verseRef.current);
    return () => observer.disconnect();
  }, [verse.verse_key, verse.id, verseRef, setLastRead]);
};
