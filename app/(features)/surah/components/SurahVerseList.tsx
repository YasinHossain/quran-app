'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';

import { useDedupedFetchVerse } from '@/app/(features)/surah/hooks/verse-listing/useDedupedFetchVerse';
import { useSettings } from '@/app/providers/SettingsContext';
import { VerseSkeleton } from '@/app/shared/components/VerseSkeleton';
import { useAdaptiveViewportBy } from '@/app/shared/hooks/useAdaptiveViewportBy';
import { LoadingStatus } from '@/app/shared/LoadingStatus';
import { useAudio } from '@/app/shared/player/context/AudioContext';
import { ReaderResourceNavigation } from '@/app/shared/reader/ReaderResourceNavigation';
import { Spinner } from '@/app/shared/Spinner';

import { SurahNavigation } from './SurahNavigation';
import { Verse as VerseComponent } from './VerseCard';

import type { MushafResourceKind } from '@/app/(features)/surah/hooks/mushafReadingViewTypes';
import type { UseVerseListingReturn } from '@/app/(features)/surah/hooks/useVerseListing';
import type { Verse } from '@/types';

const SCROLL_OFFSET_TOP_PX = 65;

const parseVerseNumberFromKey = (verseKey?: string): number | null => {
  if (!verseKey) return null;
  const [, versePart] = verseKey.split(':');
  const parsed = Number.parseInt(versePart ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const parseInitialVerseNumber = (initialVerseKey?: string): number | null =>
  parseVerseNumberFromKey(initialVerseKey);

const resolveVerseNumber = (verse?: Verse | null): number | null => {
  if (!verse) return null;
  if (typeof verse.verse_number === 'number' && Number.isFinite(verse.verse_number)) {
    return verse.verse_number;
  }
  return parseVerseNumberFromKey(verse.verse_key);
};

const TOP_TOLERANCE_PX = 8;

const ensureVerseAtTop = (
  verse: Verse,
  targetIndex: number | null,
  scrollToIndex: (index: number, offset: number) => void
): void => {
  if (typeof document === 'undefined') return;
  const targetEl = document.getElementById(`verse-${verse.id}`);
  if (targetEl) {
    const rect = targetEl.getBoundingClientRect();
    const delta = rect.top - SCROLL_OFFSET_TOP_PX;
    if (Math.abs(delta) <= TOP_TOLERANCE_PX) return;
    const nextScrollTop = Math.max(0, window.scrollY + delta);
    window.scrollTo({ top: nextScrollTop, behavior: 'smooth' });
    return;
  }

  if (typeof targetIndex === 'number' && targetIndex >= 0) {
    scrollToIndex(targetIndex, -SCROLL_OFFSET_TOP_PX);
  }
};

interface SurahVerseListProps {
  surahId?: number | undefined;
  verseListing: UseVerseListingReturn;
  resourceKind?: MushafResourceKind | undefined;
  emptyLabelKey?: string;
  endLabelKey?: string;
  initialVerseKey?: string | undefined;
}

function VerseListEndSection({
  resourceKind,
  resourceId,
  surahId,
}: {
  resourceKind?: MushafResourceKind | undefined;
  resourceId?: string | undefined;
  surahId?: number | undefined;
}): React.JSX.Element | null {
  const surahNavigation =
    resourceKind === 'surah' && typeof surahId === 'number' ? (
      <SurahNavigation currentSurahId={surahId} />
    ) : null;
  const resourceNavigation =
    (resourceKind === 'page' || resourceKind === 'juz') && typeof resourceId === 'string' ? (
      <ReaderResourceNavigation resourceKind={resourceKind} resourceId={resourceId} />
    ) : null;

  if (!surahNavigation && !resourceNavigation) {
    return null;
  }

  return (
    <div
      data-slot="reader-end-of-list"
      className="flex w-full flex-col items-center justify-center gap-6 py-10 text-center"
    >
      {surahNavigation}
      {resourceNavigation}
    </div>
  );
}

function QuranComVerseRow({
  verseIdx,
  verseListing,
}: {
  verseIdx: number;
  verseListing: UseVerseListingReturn;
}): React.JSX.Element {
  const { settings } = useSettings();
  const tajweed = settings.tajweed ?? false;

  const { verse } = useDedupedFetchVerse({
    resourceId: verseListing.resourceId ?? '',
    verseIdx,
    perPage: verseListing.perPage,
    lookup: verseListing.lookup,
    translationIds: verseListing.translationIds,
    wordLang: verseListing.wordLang,
    tajweed,
    ...(verseListing.initialVerses ? { initialPageVerses: verseListing.initialVerses } : {}),
    setApiPageToVersesMap: verseListing.setApiPageToVersesMap,
    onError: verseListing.setError,
    enabled: Boolean(verseListing.resourceId),
  });

  if (!verse) {
    return <VerseSkeleton index={verseIdx} />;
  }

  return (
    <>
      <VerseComponent verse={verse} />
    </>
  );
}

export const SurahVerseList = ({
  surahId,
  verseListing,
  resourceKind,
  emptyLabelKey = 'no_verses_found',
  initialVerseKey,
}: SurahVerseListProps): React.JSX.Element => {
  const { t } = useTranslation();
  const audio = useAudio();
  const emptyLabel = t(emptyLabelKey);
  const initialVerseNumber = parseInitialVerseNumber(initialVerseKey);

  const hasNoContent = verseListing.verses.length === 0;
  const isQuranComMode =
    verseListing.mode === 'quran-com' && typeof verseListing.totalVerses === 'number';

  if (isQuranComMode) {
    if (verseListing.error && hasNoContent) return <ErrorState message={verseListing.error} />;
    return (
      <QuranComList
        verseListing={verseListing}
        initialVerseNumber={initialVerseNumber}
        isAutoScrollEnabled={audio.isPlaying}
        resourceKind={resourceKind}
        surahId={surahId}
      />
    );
  }

  if (verseListing.isLoading) return <LoadingState />;
  if (verseListing.error && hasNoContent) return <ErrorState message={verseListing.error} />;
  if (hasNoContent) return <EmptyState label={emptyLabel} />;

  return (
    <InfiniteList
      verseListing={verseListing}
      emptyLabel={emptyLabel}
      initialVerseKey={initialVerseKey}
      isAutoScrollEnabled={audio.isPlaying}
      resourceKind={resourceKind}
      surahId={surahId}
    />
  );
};

function QuranComList({
  verseListing,
  initialVerseNumber,
  isAutoScrollEnabled,
  resourceKind,
  surahId,
}: {
  verseListing: UseVerseListingReturn;
  initialVerseNumber: number | null;
  isAutoScrollEnabled: boolean;
  resourceKind?: MushafResourceKind | undefined;
  surahId?: number | undefined;
}): React.JSX.Element {
  const totalVerses = verseListing.totalVerses ?? 0;
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [shouldReadjustScroll, setShouldReadjustScroll] = useState(false);
  const activeVerse = verseListing.activeVerse;
  const increaseViewportBy = useAdaptiveViewportBy();

  useEffect(() => {
    if (!initialVerseNumber || totalVerses <= 0) return;
    const targetIndex = Math.min(Math.max(0, initialVerseNumber - 1), totalVerses - 1);
    virtuosoRef.current?.scrollToIndex({
      index: targetIndex,
      align: 'start',
      offset: -SCROLL_OFFSET_TOP_PX,
    });
    setShouldReadjustScroll(true);
  }, [initialVerseNumber, totalVerses]);

  useEffect(() => {
    if (!shouldReadjustScroll) return;
    if (!initialVerseNumber || totalVerses <= 0) return;

    const targetIndex = Math.min(Math.max(0, initialVerseNumber - 1), totalVerses - 1);
    const pageNumber = Math.floor(targetIndex / verseListing.perPage) + 1;
    const isLoaded = Boolean(verseListing.apiPageToVersesMap[pageNumber]);
    if (!isLoaded) return;

    const timeout = window.setTimeout(() => {
      virtuosoRef.current?.scrollToIndex({
        index: targetIndex,
        align: 'start',
        offset: -SCROLL_OFFSET_TOP_PX,
      });
      setShouldReadjustScroll(false);
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [
    initialVerseNumber,
    shouldReadjustScroll,
    totalVerses,
    verseListing.apiPageToVersesMap,
    verseListing.perPage,
  ]);

  useEffect(() => {
    if (!isAutoScrollEnabled || !activeVerse) return;
    if (totalVerses <= 0) return;

    const verseNumber = resolveVerseNumber(activeVerse);
    if (!verseNumber) return;

    const targetIndex = Math.min(Math.max(0, verseNumber - 1), totalVerses - 1);
    ensureVerseAtTop(activeVerse, targetIndex, (index, offset) => {
      virtuosoRef.current?.scrollToIndex({ index, align: 'start', offset, behavior: 'smooth' });
    });
  }, [activeVerse, isAutoScrollEnabled, totalVerses]);

  return (
    <div className="w-full">
      <Virtuoso
        ref={virtuosoRef}
        useWindowScroll
        totalCount={totalVerses}
        initialItemCount={1}
        increaseViewportBy={increaseViewportBy}
        computeItemKey={(index) => `${verseListing.resourceId}:${index + 1}`}
        itemContent={(index) => (
          <QuranComVerseRow
            verseIdx={index}
            verseListing={verseListing}
          />
        )}
      />
      <VerseListEndSection
        resourceKind={resourceKind}
        resourceId={verseListing.resourceId}
        surahId={surahId}
      />
    </div>
  );
}

function InfiniteList({
  verseListing,
  emptyLabel,
  initialVerseKey,
  isAutoScrollEnabled,
  resourceKind,
  surahId,
}: {
  verseListing: UseVerseListingReturn;
  emptyLabel: string;
  initialVerseKey?: string | undefined;
  isAutoScrollEnabled: boolean;
  resourceKind?: MushafResourceKind | undefined;
  surahId?: number | undefined;
}): React.JSX.Element {
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const activeVerse = verseListing.activeVerse;
  const increaseViewportBy = useAdaptiveViewportBy();

  useEffect(() => {
    if (!initialVerseKey) return;
    const target = verseListing.verses.find((verse) => verse.verse_key === initialVerseKey);
    if (!target) return;
    const el = document.getElementById(`verse-${target.id}`);
    if (el) {
      const rect = el.getBoundingClientRect();
      const scrollTop = window.scrollY + rect.top;
      window.scrollTo({ top: scrollTop - SCROLL_OFFSET_TOP_PX, behavior: 'smooth' });
    }
  }, [initialVerseKey, verseListing.verses]);

  useEffect(() => {
    if (!isAutoScrollEnabled || !activeVerse) return;
    const targetIndex = verseListing.verses.findIndex((verse) => verse.id === activeVerse.id);
    if (targetIndex === -1) return;
    ensureVerseAtTop(activeVerse, targetIndex, (index, offset) => {
      virtuosoRef.current?.scrollToIndex({ index, align: 'start', offset, behavior: 'smooth' });
    });
  }, [activeVerse, isAutoScrollEnabled, verseListing.verses]);

  if (verseListing.error) {
    return <ErrorState message={verseListing.error} />;
  }

  if (verseListing.verses.length === 0) {
    return <EmptyState label={emptyLabel} />;
  }

  return (
    <div className="w-full">
      <Virtuoso
        ref={virtuosoRef}
        useWindowScroll
        data={verseListing.verses}
        initialItemCount={1}
        increaseViewportBy={increaseViewportBy}
        computeItemKey={(index, verse) => `${verse.verse_key}:${verse.id}:${index}`}
        itemContent={(_index, verse) => <VerseComponent verse={verse} />}
      />
      {!verseListing.isReachingEnd ? (
        <LoadMoreFooter
          loadMoreRef={verseListing.loadMoreRef}
          isValidating={verseListing.isValidating}
          hasVerses={verseListing.verses.length > 0}
        />
      ) : null}
      {verseListing.isReachingEnd ? (
        <VerseListEndSection
          resourceKind={resourceKind}
          resourceId={verseListing.resourceId}
          surahId={surahId}
        />
      ) : null}
    </div>
  );
}

interface LoadMoreFooterProps {
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  isValidating: boolean;
  hasVerses: boolean;
}

function LoadMoreFooter({
  loadMoreRef,
  isValidating,
  hasVerses,
}: LoadMoreFooterProps): React.JSX.Element | null {
  if (!hasVerses) return null;

  return (
    <>
      <div ref={loadMoreRef} className="py-4 text-center space-x-2">
        {isValidating && <Spinner className="inline h-5 w-5 text-accent" />}
      </div>
    </>
  );
}

const LoadingState = (): React.JSX.Element => (
  <LoadingStatus>
    <VerseSkeleton index={0} />
    <VerseSkeleton index={1} />
    <VerseSkeleton index={2} />
    <VerseSkeleton index={3} />
    <VerseSkeleton index={4} />
  </LoadingStatus>
);

const ErrorState = ({ message }: { message: string }): React.JSX.Element => (
  <div className="text-center py-20 text-status-error bg-status-error/10 p-4 rounded-lg">
    {message}
  </div>
);

const EmptyState = ({ label }: { label: string }): React.JSX.Element => (
  <div className="text-center py-20 text-muted">{label}</div>
);
