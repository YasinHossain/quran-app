import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useQcfMushafFont } from '@/app/(features)/surah/hooks/useQcfMushafFont';
import { useSettings } from '@/app/providers/SettingsContext';

import type { MushafFlags, MushafMainProps, ReaderSettings } from './MushafMain.types';
import type React from 'react';

type MushafMainState = {
  settings: ReaderSettings;
  mushafFlags: MushafFlags;
  getPageFontFamily: (pageNumber: number) => string;
  isPageFontLoaded: (pageNumber: number) => boolean;
  shouldRenderSurahIntro: boolean;
  shouldRenderLoadMore: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  endLabel: string;
};

const isValidPageNumber = (pageNumber: number | undefined | null): pageNumber is number =>
  typeof pageNumber === 'number' && Number.isFinite(pageNumber);

const useMushafFlags = (mushafId?: string): MushafFlags =>
  useMemo(
    () => ({
      isQcfMushaf: mushafId === 'qcf-madani-v1' || mushafId === 'qcf-madani-v2',
      isQpcHafsMushaf: mushafId === 'qpc-uthmani-hafs',
      isIndopakMushaf: mushafId === 'unicode-indopak-15' || mushafId === 'unicode-indopak-16',
      qcfVersion: mushafId === 'qcf-madani-v2' ? 'v2' : 'v1',
      indopakVersion:
        mushafId === 'unicode-indopak-16' ? '16' : mushafId === 'unicode-indopak-15' ? '15' : null,
    }),
    [mushafId]
  );

const useLoadMoreObserver = ({
  loadMoreRef,
  hasMore,
  onLoadMore,
}: {
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  hasMore?: boolean;
  onLoadMore?: () => void;
}): void => {
  useEffect(() => {
    if (!onLoadMore || !hasMore) return;
    const target = loadMoreRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(target);
    return () => {
      observer.disconnect();
    };
  }, [hasMore, loadMoreRef, onLoadMore]);
};

export const useMushafMainState = ({
  mushafName: _mushafName,
  mushafId,
  pages,
  chapterId,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
  endLabelKey = 'end_of_surah',
}: MushafMainProps): MushafMainState => {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const mushafFlags = useMushafFlags(mushafId);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  void _mushafName;

  const pageNumbers = useMemo(
    () => pages.map((page) => page.pageNumber).filter(isValidPageNumber),
    [pages]
  );

  const { getPageFontFamily, isPageFontLoaded } = useQcfMushafFont(
    mushafFlags.isQcfMushaf ? pageNumbers : [],
    mushafFlags.qcfVersion
  );

  useLoadMoreObserver({ loadMoreRef, hasMore, onLoadMore });

  return {
    settings,
    mushafFlags,
    getPageFontFamily,
    isPageFontLoaded,
    shouldRenderSurahIntro: typeof chapterId === 'number' && chapterId > 0,
    shouldRenderLoadMore: (onLoadMore || isLoadingMore || !hasMore) && pages.length > 0,
    loadMoreRef,
    endLabel: t(endLabelKey),
  };
};

export type { MushafMainState };
