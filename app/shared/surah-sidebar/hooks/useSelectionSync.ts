import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

import { getJuzByPage, getSurahByPage, JUZ_START_PAGES } from '@/lib/utils/surah-navigation';

import type { Chapter } from '@/types';

interface Args {
  currentSurahId?: number;
  currentJuzId?: number;
  currentPageId?: number;
  chapters: ReadonlyArray<Chapter>;
}

type SelectionSetters = {
  setSelectedSurahId: Dispatch<SetStateAction<number | null>>;
  setSelectedJuzId: Dispatch<SetStateAction<number | null>>;
  setSelectedPageId: Dispatch<SetStateAction<number | null>>;
};

function runSync(
  { currentSurahId, currentJuzId, currentPageId, chapters }: Args,
  state: SelectionSetters
): void {
  const { setSelectedSurahId, setSelectedJuzId, setSelectedPageId } = state;
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
}

export const useSelectionSync = ({
  currentSurahId,
  currentJuzId,
  currentPageId,
  chapters,
}: Args): {
  selectedSurahId: number | null;
  setSelectedSurahId: Dispatch<SetStateAction<number | null>>;
  selectedJuzId: number | null;
  setSelectedJuzId: Dispatch<SetStateAction<number | null>>;
  selectedPageId: number | null;
  setSelectedPageId: Dispatch<SetStateAction<number | null>>;
} => {
  const [selectedSurahId, setSelectedSurahId] = useState<number | null>(currentSurahId ?? null);
  const [selectedJuzId, setSelectedJuzId] = useState<number | null>(currentJuzId ?? null);
  const [selectedPageId, setSelectedPageId] = useState<number | null>(currentPageId ?? null);

  useEffect(() => {
    runSync(
      { currentSurahId, currentJuzId, currentPageId, chapters },
      {
        setSelectedSurahId,
        setSelectedJuzId,
        setSelectedPageId,
      }
    );
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
