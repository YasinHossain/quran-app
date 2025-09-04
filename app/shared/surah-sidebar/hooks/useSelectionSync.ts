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
    if (currentSurahId) {
      setSelectedSurahId(currentSurahId);
      const chapter = chapters.find((c) => c.id === currentSurahId);
      const page = chapter?.pages?.[0] ?? 1;
      setSelectedPageId(page);
      setSelectedJuzId(getJuzByPage(page));
    } else if (currentJuzId) {
      setSelectedJuzId(currentJuzId);
      const page = JUZ_START_PAGES[currentJuzId - 1];
      setSelectedPageId(page);
      const chapter = getSurahByPage(page, chapters);
      if (chapter) setSelectedSurahId(chapter.id);
    } else if (currentPageId) {
      setSelectedPageId(currentPageId);
      const page = currentPageId;
      setSelectedJuzId(getJuzByPage(page));
      const chapter = getSurahByPage(page, chapters);
      if (chapter) setSelectedSurahId(chapter.id);
    }
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
