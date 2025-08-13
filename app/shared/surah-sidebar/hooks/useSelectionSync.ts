import { useEffect, useState } from 'react';
import { getJuzByPage, getSurahByPage, JUZ_START_PAGES } from '@/lib/utils/surah-navigation';
import type { Chapter } from '@/types';

interface Args {
  currentSurahId?: string;
  currentJuzId?: string;
  currentPageId?: string;
  chapters: Chapter[];
}

const useSelectionSync = ({ currentSurahId, currentJuzId, currentPageId, chapters }: Args) => {
  const [selectedSurahId, setSelectedSurahId] = useState<string | null>(currentSurahId ?? null);
  const [selectedJuzId, setSelectedJuzId] = useState<string | null>(currentJuzId ?? null);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(currentPageId ?? null);

  useEffect(() => {
    if (currentSurahId) {
      setSelectedSurahId(currentSurahId);
      const chapter = chapters.find((c) => c.id === Number(currentSurahId));
      const page = chapter?.pages?.[0] ?? 1;
      setSelectedPageId(String(page));
      setSelectedJuzId(String(getJuzByPage(page)));
    } else if (currentJuzId) {
      setSelectedJuzId(currentJuzId);
      const page = JUZ_START_PAGES[Number(currentJuzId) - 1];
      setSelectedPageId(String(page));
      const chapter = getSurahByPage(page, chapters);
      if (chapter) setSelectedSurahId(String(chapter.id));
    } else if (currentPageId) {
      setSelectedPageId(currentPageId);
      const page = Number(currentPageId);
      setSelectedJuzId(String(getJuzByPage(page)));
      const chapter = getSurahByPage(page, chapters);
      if (chapter) setSelectedSurahId(String(chapter.id));
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

export default useSelectionSync;
