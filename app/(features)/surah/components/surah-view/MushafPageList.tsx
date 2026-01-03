import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';

import { SurahNavigation } from '@/app/(features)/surah/components/SurahNavigation';
import { useQcfMushafFont } from '@/app/(features)/surah/hooks/useQcfMushafFont';
import { useDedupedFetchMushafPage } from '@/app/(features)/surah/hooks/useDedupedFetchMushafPage';
import { useMushafPagesLookup } from '@/app/(features)/surah/hooks/useMushafPagesLookup';
import { LoadingStatus } from '@/app/shared/LoadingStatus';
import { TajweedFontPalettes } from '@/app/shared/TajweedFontPalettes';

import { MushafPage } from './MushafPage';

import type { MushafResourceKind } from '@/app/(features)/surah/hooks/mushafReadingViewTypes';
import type { MushafFlags, ReaderSettings } from './MushafMain.types';
import type { PagesLookupRecord } from '@infra/quran/pagesLookupClient';

const MUSHAF_SKELETON_LINES = Array.from({ length: 15 }, (_value, index) => ({
  key: `mushaf-skeleton-line-${index + 1}`,
}));

const MushafPageSkeleton = ({ index }: { index: number }): React.JSX.Element => {
  return (
    <article
      aria-hidden="true"
      className={`mx-auto w-full py-6 sm:py-8 animate-pulse ${index === 0 ? 'pt-0' : ''}`}
    >
      <div className="mx-auto flex w-full max-w-[560px] flex-col gap-4 px-4 sm:gap-5 sm:px-0">
        {MUSHAF_SKELETON_LINES.map((line) => (
          <div
            key={`${line.key}-${index}`}
            className="h-6 w-full rounded-md bg-interactive/80"
          />
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <div className="h-8 w-44 rounded-full bg-interactive" />
      </div>
    </article>
  );
};

type PageFontInfoArgs = {
  pageNumber: number;
  mushafFlags: MushafFlags;
  getPageFontFamily: (pageNumber: number) => string;
  isPageFontLoaded: (pageNumber: number) => boolean;
  settings: ReaderSettings;
};

type PageFontInfo = { fontFamily: string; isFontLoaded: boolean };

const resolvePageFont = ({
  pageNumber,
  mushafFlags,
  getPageFontFamily,
  isPageFontLoaded,
  settings,
}: PageFontInfoArgs): PageFontInfo => {
  const pageFontLoaded =
    mushafFlags.isQcfMushaf && typeof pageNumber === 'number' && isPageFontLoaded(pageNumber);

  if (mushafFlags.isQcfMushaf && pageFontLoaded && typeof pageNumber === 'number') {
    return {
      fontFamily: getPageFontFamily(pageNumber),
      isFontLoaded: true,
    };
  }

  if (mushafFlags.isQpcHafsMushaf) {
    return { fontFamily: 'UthmanicHafs1Ver18', isFontLoaded: true };
  }

  if (mushafFlags.isIndopakMushaf) {
    return { fontFamily: 'IndoPak', isFontLoaded: true };
  }

  return {
    fontFamily: settings.arabicFontFace,
    isFontLoaded: !mushafFlags.isQcfMushaf || pageFontLoaded,
  };
};

const INCREASE_VIEWPORT_BY_PIXELS = 1200;
const QCF_VISIBLE_BUFFER_PAGES = 2;

const resolveFirstPageNumber = (pages: Record<number, PagesLookupRecord>): number | null => {
  const keys = Object.keys(pages ?? {});
  const numericKeys = keys
    .map((key) => Number.parseInt(key, 10))
    .filter((value) => Number.isFinite(value));

  if (!numericKeys.length) return null;
  return Math.min(...numericKeys);
};

const clampIndex = (value: number, max: number): number => Math.min(Math.max(0, value), max);

const toVerseSortValue = (verseKey?: string): number | null => {
  if (!verseKey) return null;
  const [chapterRaw, ayahRaw] = verseKey.split(':');
  const chapter = Number.parseInt(chapterRaw ?? '', 10);
  const ayah = Number.parseInt(ayahRaw ?? '', 10);
  if (Number.isFinite(chapter) && Number.isFinite(ayah)) {
    return chapter * 1000 + ayah;
  }
  if (Number.isFinite(ayah)) {
    return ayah;
  }
  return null;
};

const resolvePageNumberForVerseKey = (
  verseKey: string,
  pages: Record<number, PagesLookupRecord>
): number | null => {
  const targetValue = toVerseSortValue(verseKey);
  if (targetValue === null) return null;

  const pageNumbers = Object.keys(pages ?? {})
    .map((key) => Number.parseInt(key, 10))
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);

  for (const pageNumber of pageNumbers) {
    const record = pages[pageNumber];
    const fromValue = toVerseSortValue(record?.from);
    const toValue = toVerseSortValue(record?.to);
    if (fromValue === null || toValue === null) continue;
    if (targetValue >= fromValue && targetValue <= toValue) {
      return pageNumber;
    }
  }

  return null;
};

const MushafEndOfList = ({
  endLabel,
  surahId,
}: {
  endLabel: string;
  surahId?: number | undefined;
}): React.JSX.Element => (
  <div className="py-10 text-center space-y-6">
    {surahId ? <SurahNavigation currentSurahId={surahId} /> : null}
  </div>
);

const MushafPageError = ({ message }: { message: string }): React.JSX.Element => (
  <div className="mx-auto w-full rounded-[32px] border border-status-error bg-status-error/10 px-6 py-10 text-center text-status-error">
    {message}
  </div>
);

const MushafVirtualizedPageRow = ({
  pageNumber,
  verseRange,
  mushafId,
  reciterId,
  wordByWordLocale,
  translationIds,
  settings,
  mushafFlags,
  getPageFontFamily,
  isPageFontLoaded,
  className,
}: {
  pageNumber: number;
  verseRange: { from: string; to: string } | undefined;
  mushafId: string;
  reciterId?: number | undefined;
  wordByWordLocale?: string | undefined;
  translationIds?: string | undefined;
  settings: ReaderSettings;
  mushafFlags: MushafFlags;
  getPageFontFamily: (pageNumber: number) => string;
  isPageFontLoaded: (pageNumber: number) => boolean;
  className?: string;
}): React.JSX.Element => {
  const { page, isLoading, error } = useDedupedFetchMushafPage({
    pageNumber,
    mushafId,
    ...(typeof reciterId === 'number' ? { reciterId } : {}),
    ...(wordByWordLocale ? { wordByWordLocale } : {}),
    ...(translationIds ? { translationIds } : {}),
    ...(verseRange ? { verseRange } : {}),
  });

  const { fontFamily, isFontLoaded } = resolvePageFont({
    pageNumber,
    mushafFlags,
    getPageFontFamily,
    isPageFontLoaded,
    settings,
  });

  if (error) {
    return <MushafPageError message={error} />;
  }

  if (isLoading || !page || (mushafFlags.isQcfMushaf && !isFontLoaded)) {
    return <MushafPageSkeleton index={pageNumber} />;
  }

  return (
    <MushafPage
      pageNumber={page.pageNumber}
      lines={page.lines}
      settings={settings}
      fontFamily={fontFamily}
      isQcfMushaf={mushafFlags.isQcfMushaf}
      isQpcHafsMushaf={mushafFlags.isQpcHafsMushaf}
      isIndopakMushaf={mushafFlags.isIndopakMushaf}
      qcfVersion={mushafFlags.qcfVersion}
      isFontLoaded={isFontLoaded}
      {...(className ? { className } : {})}
    />
  );
};

type MushafPageListProps = {
  resourceId: string;
  resourceKind: MushafResourceKind;
  mushafId: string;
  initialPageNumber?: number | undefined;
  initialVerseKey?: string | undefined;
  chapterId?: number | null | undefined;
  juzNumber?: number | null | undefined;
  reciterId?: number | undefined;
  wordByWordLocale?: string | undefined;
  translationIds?: string | undefined;
  settings: ReaderSettings;
  mushafFlags: MushafFlags;
  endLabel: string;
  surahId?: number | undefined;
};

export const MushafPageList = ({
  resourceId,
  resourceKind,
  mushafId,
  initialPageNumber,
  initialVerseKey,
  reciterId,
  wordByWordLocale,
  translationIds,
  settings,
  mushafFlags,
  endLabel,
  surahId,
}: MushafPageListProps): React.JSX.Element => {
  const { data: lookupData, isLoading, error } = useMushafPagesLookup({
    resourceId,
    resourceKind,
    mushafId,
  });

  const firstPageNumber = useMemo(
    () => (lookupData ? resolveFirstPageNumber(lookupData.pages) : null),
    [lookupData]
  );
  const totalPages = lookupData?.totalPage ?? 0;

  const [visibleRange, setVisibleRange] = useState<{ startIndex: number; endIndex: number }>({
    startIndex: 0,
    endIndex: 0,
  });

  const qcfFontPageNumbers = useMemo(() => {
    if (!mushafFlags.isQcfMushaf) return [];
    if (!firstPageNumber || totalPages <= 0) return [];

    const maxIndex = totalPages - 1;
    const startIndex = clampIndex(visibleRange.startIndex - QCF_VISIBLE_BUFFER_PAGES, maxIndex);
    const endIndex = clampIndex(visibleRange.endIndex + QCF_VISIBLE_BUFFER_PAGES, maxIndex);
    return Array.from({ length: endIndex - startIndex + 1 }, (_value, idx) => firstPageNumber + startIndex + idx);
  }, [firstPageNumber, mushafFlags.isQcfMushaf, totalPages, visibleRange]);

  const { getPageFontFamily, isPageFontLoaded } = useQcfMushafFont(
    mushafFlags.isQcfMushaf ? qcfFontPageNumbers : [],
    mushafFlags.qcfVersion
  );

  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const initialScrollToken = useMemo(
    () =>
      `${resourceKind}:${resourceId}:${mushafId}:${initialPageNumber ?? 'none'}:${initialVerseKey ?? 'no-verse'}`,
    [resourceKind, resourceId, mushafId, initialPageNumber, initialVerseKey]
  );

  useEffect(() => {
    if (!lookupData) return;
    if (!firstPageNumber) return;
    if (totalPages <= 0) return;

    const maxIndex = totalPages - 1;
    const pageNumberFromVerseKey =
      typeof initialVerseKey === 'string'
        ? resolvePageNumberForVerseKey(initialVerseKey, lookupData.pages)
        : null;
    const fallbackPageNumber =
      typeof initialPageNumber === 'number' ? initialPageNumber : firstPageNumber;
    const targetPageNumber = pageNumberFromVerseKey ?? fallbackPageNumber;
    const targetIndex = clampIndex(targetPageNumber - firstPageNumber, maxIndex);

    virtuosoRef.current?.scrollToIndex({ index: targetIndex, align: 'start', offset: -20 });
  }, [firstPageNumber, initialPageNumber, initialScrollToken, lookupData, totalPages]);

  if (isLoading) {
    return (
      <LoadingStatus className="space-y-8">
        <MushafPageSkeleton index={0} />
        <MushafPageSkeleton index={1} />
      </LoadingStatus>
    );
  }

  if (error) {
    return <MushafPageError message={error} />;
  }

  if (!lookupData || !firstPageNumber || totalPages <= 0) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        No pages available for this selection.
      </div>
    );
  }

  return (
    <>
      <TajweedFontPalettes pageNumbers={qcfFontPageNumbers} version={mushafFlags.qcfVersion} />
      <Virtuoso
        ref={virtuosoRef}
        useWindowScroll
        increaseViewportBy={INCREASE_VIEWPORT_BY_PIXELS}
        initialItemCount={1}
        totalCount={totalPages + 1}
        rangeChanged={setVisibleRange}
        computeItemKey={(index) =>
          index === totalPages
            ? `end:${resourceKind}:${resourceId}:${mushafId}`
            : `page:${firstPageNumber + index}`
        }
        itemContent={(index) => {
          const wrapperClassName = index === 0 ? undefined : 'mt-8';

          if (index === totalPages) {
            return (
              <div className={wrapperClassName}>
                <MushafEndOfList endLabel={endLabel} {...(surahId ? { surahId } : {})} />
              </div>
            );
          }

          const pageNumber = firstPageNumber + index;
          const verseRange = lookupData.pages[pageNumber];

          return (
            <div className={wrapperClassName}>
              <MushafVirtualizedPageRow
                pageNumber={pageNumber}
                verseRange={verseRange ? { from: verseRange.from, to: verseRange.to } : undefined}
                mushafId={mushafId}
                {...(typeof reciterId === 'number' ? { reciterId } : {})}
                {...(wordByWordLocale ? { wordByWordLocale } : {})}
                {...(translationIds ? { translationIds } : {})}
                settings={settings}
                mushafFlags={mushafFlags}
                getPageFontFamily={getPageFontFamily}
                isPageFontLoaded={isPageFontLoaded}
                {...(index === 0 ? { className: 'pt-0 sm:pt-0' } : {})}
              />
            </div>
          );
        }}
      />
    </>
  );
};
