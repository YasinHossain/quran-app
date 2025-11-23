import { SurahNavigation } from '@/app/(features)/surah/components/SurahNavigation';
import { Spinner } from '@/app/shared/Spinner';

import { MushafPage } from './MushafPage';

import type { MushafFlags, ReaderSettings } from './MushafMain.types';
import type { MushafPageLines } from '@/types';
import type React from 'react';

type MushafPageListProps = {
  pages: MushafPageLines[];
  settings: ReaderSettings;
  mushafFlags: MushafFlags;
  getPageFontFamily: (pageNumber: number) => string;
  isPageFontLoaded: (pageNumber: number) => boolean;
  isLoading: boolean;
  error: string | null;
};

type PageFontInfoArgs = {
  page: MushafPageLines;
  mushafFlags: MushafFlags;
  getPageFontFamily: (pageNumber: number) => string;
  isPageFontLoaded: (pageNumber: number) => boolean;
  settings: ReaderSettings;
};

type PageFontInfo = { fontFamily: string; isFontLoaded: boolean };

const MushafPageListFallback = ({
  isLoading,
  hasPages,
  error,
}: {
  isLoading: boolean;
  hasPages: boolean;
  error: string | null;
}): React.JSX.Element | null => {
  if (isLoading && !hasPages) {
    return (
      <div className="mx-auto flex w-full justify-center py-16">
        <Spinner className="h-8 w-8 text-accent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full rounded-[32px] border border-status-error bg-status-error/10 px-6 py-10 text-center text-status-error">
        {error}
      </div>
    );
  }

  return null;
};

const resolvePageFont = ({
  page,
  mushafFlags,
  getPageFontFamily,
  isPageFontLoaded,
  settings,
}: PageFontInfoArgs): PageFontInfo => {
  const pageFontLoaded =
    mushafFlags.isQcfMushaf &&
    typeof page.pageNumber === 'number' &&
    isPageFontLoaded(page.pageNumber);

  if (mushafFlags.isQcfMushaf && pageFontLoaded && typeof page.pageNumber === 'number') {
    return {
      fontFamily: getPageFontFamily(page.pageNumber),
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

export const MushafPageList = ({
  pages,
  settings,
  mushafFlags,
  getPageFontFamily,
  isPageFontLoaded,
  isLoading,
  error,
}: MushafPageListProps): React.JSX.Element => {
  const fallback = MushafPageListFallback({
    isLoading,
    hasPages: pages.length > 0,
    error,
  });

  if (fallback) return fallback;

  return (
    <div className="space-y-8">
      {pages.map((page) => {
        const { fontFamily, isFontLoaded } = resolvePageFont({
          page,
          mushafFlags,
          getPageFontFamily,
          isPageFontLoaded,
          settings,
        });

        return (
          <MushafPage
            key={`page-${page.pageNumber}`}
            pageNumber={page.pageNumber}
            lines={page.lines}
            settings={settings}
            fontFamily={fontFamily}
            isQcfMushaf={mushafFlags.isQcfMushaf}
            isQpcHafsMushaf={mushafFlags.isQpcHafsMushaf}
            isIndopakMushaf={mushafFlags.isIndopakMushaf}
            qcfVersion={mushafFlags.qcfVersion}
            isFontLoaded={isFontLoaded}
          />
        );
      })}
    </div>
  );
};

export const LoadMoreSection = ({
  loadMoreRef,
  isLoadingMore,
  hasMore,
  endLabel,
  surahId,
}: {
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  isLoadingMore: boolean;
  hasMore?: boolean;
  endLabel: string;
  surahId?: number | undefined;
}): React.JSX.Element => (
  <>
    <div ref={loadMoreRef} className="mx-auto w-full space-y-2 py-8 text-center">
      {isLoadingMore ? <Spinner className="inline h-5 w-5 text-accent" /> : null}
    </div>
    {!hasMore && !isLoadingMore && surahId && <SurahNavigation currentSurahId={surahId} />}
  </>
);
