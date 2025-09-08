import { useEffect, useState } from 'react';

import { getJuzByPage, getSurahByPage, JUZ_START_PAGES } from '@/lib/utils/surah-navigation';

import type { Chapter } from '@/types';

interface Args {
  currentSurahId?: number;
  currentJuzId?: number;
  currentPageId?: number;
  chapters: Chapter[];
}

export const useSelectionSync = ({
  currentSurahId,
  currentJuzId,
  currentPageId,
  chapters,
}: Args) => {
  const [selectedSurahId, setSelectedSurahId] = useState<number | null>(currentSurahId ?? null);
  const [selectedJuzId, setSelectedJuzId] = useState<number | null>(currentJuzId ?? null);
  const [selectedPageId, setSelectedPageId] = useState<number | null>(currentPageId ?? null);

  useEffect(() => {
    const handlers = [
      {
        condition: currentSurahId !== undefined,
        action: () => {
          setSelectedSurahId(currentSurahId!);
          const chapter = chapters.find((c) => c.id === currentSurahId);
          const page = chapter?.pages?.[0] ?? 1;
          setSelectedPageId(page);
          setSelectedJuzId(getJuzByPage(page));
        },
      },
      {
        condition: currentJuzId !== undefined,
        action: () => {
          setSelectedJuzId(currentJuzId!);
          const page = JUZ_START_PAGES[currentJuzId! - 1];
          setSelectedPageId(page);
          const chapter = getSurahByPage(page, chapters);
          if (chapter) setSelectedSurahId(chapter.id);
        },
      },
      {
        condition: currentPageId !== undefined,
        action: () => {
          setSelectedPageId(currentPageId!);
          const page = currentPageId!;
          setSelectedJuzId(getJuzByPage(page));
          const chapter = getSurahByPage(page, chapters);
          if (chapter) setSelectedSurahId(chapter.id);
        },
      },
    ];

    handlers.find((h) => h.condition)?.action();
  }, [currentSurahId, currentJuzId, currentPageId, chapters]);

  return {
    selectedSurahId,
    setSelectedSurahId,
    selectedJuzId,
    setSelectedJuzId,
    selectedPageId,
    setSelectedPageId,
  };
};
