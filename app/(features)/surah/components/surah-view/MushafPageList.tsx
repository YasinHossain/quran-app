import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';

import { SurahNavigation } from '@/app/(features)/surah/components/SurahNavigation';
import { useDedupedFetchMushafPage } from '@/app/(features)/surah/hooks/useDedupedFetchMushafPage';
import { useMushafPagesLookup } from '@/app/(features)/surah/hooks/useMushafPagesLookup';
import { useQcfMushafFont } from '@/app/(features)/surah/hooks/useQcfMushafFont';
import { LoadingStatus } from '@/app/shared/LoadingStatus';
import { ReaderResourceNavigation } from '@/app/shared/reader/ReaderResourceNavigation';
import { TajweedFontPalettes } from '@/app/shared/TajweedFontPalettes';

import { MushafPage } from './MushafPage';

import type { MushafFlags, ReaderSettings } from './MushafMain.types';
import type { MushafResourceKind } from '@/app/(features)/surah/hooks/mushafReadingViewTypes';
import type { PagesLookupRecord } from '@infra/quran/pagesLookupClient';

const MUSHAF_SKELETON_LINES = Array.from({ length: 15 }, (_value, index) => ({
  key: `mushaf-skeleton-line-${index + 1}`,
}));

// Consistent height estimate for both skeleton and loaded content
// This value is calibrated to minimize scroll jumps during virtualization
// Base height estimates at default font size (arabicFontSize ≈ 18)
const MUSHAF_PAGE_HEIGHT_DESKTOP_BASE = 1100;
const MUSHAF_PAGE_HEIGHT_MOBILE_BASE = 1700;
const DEFAULT_ARABIC_FONT_SIZE = 18;

const MushafPageSkeleton = ({
  index,
  minHeight = MUSHAF_PAGE_HEIGHT_DESKTOP_BASE,
}: {
  index: number;
  minHeight?: number;
}): React.JSX.Element => {
  return (
    <article
      aria-hidden="true"
      className={`mx-auto w-full py-6 sm:py-8 ${index === 0 ? 'pt-0' : ''}`}
      style={{
        // Match the containment of MushafPage for consistent layout
        contain: 'layout style paint',
        // Use exact height to match defaultItemHeight and prevent scroll jumps
        minHeight: `${minHeight}px`,
      }}
    >
      <div className="mx-auto flex w-full max-w-[560px] flex-col gap-3 px-4 sm:gap-3 sm:px-0">
        {MUSHAF_SKELETON_LINES.map((line) => (
          <div key={`${line.key}-${index}`} className="h-10 w-full rounded-md bg-border/20" />
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <div className="h-8 w-44 rounded-full bg-border/20" />
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

const INCREASE_VIEWPORT_BY_PIXELS = 2000; // Increased buffer for smoother measurement
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
  surahId,
  endLabel,
  resourceKind,
  resourceId,
}: {
  surahId?: number | undefined;
  endLabel?: string | undefined;
  resourceKind: MushafResourceKind;
  resourceId: string;
}): React.JSX.Element => {
  const resourceNavigation =
    (resourceKind === 'page' || resourceKind === 'juz') && resourceId ? (
      <ReaderResourceNavigation resourceKind={resourceKind} resourceId={resourceId} />
    ) : null;

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 py-10 text-center">
      {endLabel ? <p className="text-sm text-muted-foreground">{endLabel}</p> : null}
      {typeof surahId === 'number' ? <SurahNavigation currentSurahId={surahId} /> : null}
      {resourceNavigation}
    </div>
  );
};

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
  estimatedHeight,
  isMobile,
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
  estimatedHeight: number;
  isMobile: boolean;
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
    return <MushafPageSkeleton index={pageNumber} minHeight={estimatedHeight} />;
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
      isMobile={isMobile}
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
  surahId,
  endLabel,
}: MushafPageListProps): React.JSX.Element => {
  // Calculate height estimates based on font size
  // Font size directly affects page height - larger fonts = taller pages
  const fontScaleFactor = settings.arabicFontSize / DEFAULT_ARABIC_FONT_SIZE;
  const scaledDesktopHeight = Math.round(MUSHAF_PAGE_HEIGHT_DESKTOP_BASE * fontScaleFactor);
  const scaledMobileHeight = Math.round(MUSHAF_PAGE_HEIGHT_MOBILE_BASE * fontScaleFactor);

  // Detect mobile viewport to adjust height estimate
  const [isMobile, setIsMobile] = useState(false);
  const [estimatedHeight, setEstimatedHeight] = useState(scaledDesktopHeight);

  useEffect(() => {
    const checkMobile = () => {
      // 640px is standard Tailwind sm breakpoint
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      setEstimatedHeight(mobile ? scaledMobileHeight : scaledDesktopHeight);
    };

    // Check on mount
    checkMobile();

    // Check on resize
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [scaledMobileHeight, scaledDesktopHeight]);

  const {
    data: lookupData,
    isLoading,
    error,
  } = useMushafPagesLookup({
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
    return Array.from(
      { length: endIndex - startIndex + 1 },
      (_value, idx) => firstPageNumber + startIndex + idx
    );
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
  const lastInitialScrollTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!lookupData) return;
    if (!firstPageNumber) return;
    if (totalPages <= 0) return;

    if (lastInitialScrollTokenRef.current === initialScrollToken) return;
    lastInitialScrollTokenRef.current = initialScrollToken;

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
  }, [
    firstPageNumber,
    initialPageNumber,
    initialScrollToken,
    initialVerseKey,
    lookupData,
    totalPages,
  ]);

  if (isLoading) {
    return (
      <LoadingStatus className="space-y-8">
        <MushafPageSkeleton index={0} minHeight={estimatedHeight} />
        <MushafPageSkeleton index={1} minHeight={estimatedHeight} />
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
        // Provide default height estimate matching skeleton to reduce scroll jumps
        defaultItemHeight={estimatedHeight}
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
                <MushafEndOfList
                  resourceKind={resourceKind}
                  resourceId={resourceId}
                  {...(typeof surahId === 'number' ? { surahId } : {})}
                  {...(endLabel ? { endLabel } : {})}
                />
              </div>
            );
          }

          const pageNumber = firstPageNumber + index;
          const verseRange = lookupData.pages[pageNumber];

          return (
            <div
              className={wrapperClassName}
              style={
                {
                  // Minimal containment to avoid interfering with Virtuoso's measurement
                  contain: 'layout',
                } as React.CSSProperties
              }
            >
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
                estimatedHeight={estimatedHeight}
                isMobile={isMobile}
              />
            </div>
          );
        }}
      />
    </>
  );
};
