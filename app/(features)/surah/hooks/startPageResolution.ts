import { useEffect } from 'react';

import { DEFAULT_MUSHAF_ID } from '@/data/mushaf/options';
import { getMushafChapterStartPage, getMushafJuzStartPage } from '@infra/quran/readingViewClient';

import type { MushafResourceKind } from './mushafReadingViewTypes';

interface ResolveStartPageEffectParams {
  resourceKind: MushafResourceKind;
  mushafId: string;
  chapterId?: number | null;
  juzNumber?: number | null;
  resolveBaseStartPageNumber: () => number;
  startPageResolveTokenRef: React.MutableRefObject<number>;
  setStartPageNumber: React.Dispatch<React.SetStateAction<number>>;
}

const resolveStartPageFromResource = async (
  resourceKind: MushafResourceKind,
  chapterId: number | null | undefined,
  juzNumber: number | null | undefined,
  mushafId: string
): Promise<number | null> => {
  if (resourceKind === 'surah' && typeof chapterId === 'number') {
    return getMushafChapterStartPage({ chapterId, mushafId });
  }
  if (resourceKind === 'juz' && typeof juzNumber === 'number') {
    return getMushafJuzStartPage({ juzNumber, mushafId });
  }
  return null;
};

export const useResolvedStartPageEffect = ({
  resourceKind,
  mushafId,
  chapterId,
  juzNumber,
  resolveBaseStartPageNumber,
  startPageResolveTokenRef,
  setStartPageNumber,
}: ResolveStartPageEffectParams): void => {
  useEffect(() => {
    if (resourceKind === 'page' || mushafId === DEFAULT_MUSHAF_ID) return;
    const token = ++startPageResolveTokenRef.current;

    const resolveStartPageNumber = async (): Promise<void> => {
      try {
        const resolved = await resolveStartPageFromResource(
          resourceKind,
          chapterId,
          juzNumber,
          mushafId
        );
        if (token === startPageResolveTokenRef.current && typeof resolved === 'number') {
          setStartPageNumber(resolved);
          return;
        }
      } catch {
        // Swallow errors; we'll fall back to the base start page number below.
      }

      if (token === startPageResolveTokenRef.current) {
        setStartPageNumber(resolveBaseStartPageNumber());
      }
    };

    void resolveStartPageNumber();
  }, [
    chapterId,
    juzNumber,
    mushafId,
    resourceKind,
    resolveBaseStartPageNumber,
    setStartPageNumber,
    startPageResolveTokenRef,
  ]);
};
