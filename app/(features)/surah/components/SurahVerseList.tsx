'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';

import { SurahNavigation } from '@/app/(features)/surah/components/SurahNavigation';
import { useDedupedFetchVerse } from '@/app/(features)/surah/hooks/verse-listing/useDedupedFetchVerse';
import { useSettings } from '@/app/providers/SettingsContext';
import { VerseSkeleton } from '@/app/shared/components/VerseSkeleton';
import { LoadingStatus } from '@/app/shared/LoadingStatus';
import { useAudio } from '@/app/shared/player/context/AudioContext';
import { Spinner } from '@/app/shared/Spinner';

import { Verse as VerseComponent } from './VerseCard';

import type { UseVerseListingReturn } from '@/app/(features)/surah/hooks/useVerseListing';
import type { Verse } from '@/types';

const INCREASE_VIEWPORT_BY_PX = 1000;
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

const CENTER_TOLERANCE_PX = 24;

const resolveAudioPlayerHeight = (): number => {
  const player = document.querySelector<HTMLElement>('.z-audio-player');
  if (!player) return 0;
  const rect = player.getBoundingClientRect();
  return rect.height;
};

const ensureVerseVisible = (
  verse: Verse,
  targetIndex: number | null,
  scrollToIndex: (index: number, offset: number) => void
): void => {
  if (typeof document === 'undefined') return;
  const targetEl = document.getElementById(`verse-${verse.id}`);
  const viewHeight = window.innerHeight || document.documentElement.clientHeight;
  const bottomInset = resolveAudioPlayerHeight();
  const safeTop = 0;
  const safeBottom = Math.max(0, viewHeight - bottomInset);
  const safeCenter = (safeTop + safeBottom) / 2;

  if (targetEl) {
    const rect = targetEl.getBoundingClientRect();
    const elementCenter = rect.top + rect.height / 2;
    const centerDistance = Math.abs(elementCenter - safeCenter);
    if (centerDistance <= CENTER_TOLERANCE_PX) return;

    const nextScrollTop = Math.max(0, window.scrollY + (elementCenter - safeCenter));
    window.scrollTo({ top: nextScrollTop, behavior: 'smooth' });
    return;
  }

  if (typeof targetIndex === 'number' && targetIndex >= 0) {
    scrollToIndex(targetIndex, Math.round(bottomInset / 2));
  }
};

interface SurahVerseListProps {
  surahId?: number | undefined;
  verseListing: UseVerseListingReturn;
  emptyLabelKey?: string;
  endLabelKey?: string;
  initialVerseKey?: string | undefined;
}

function QuranComVerseRow({
  verseIdx,
  verseListing,
  isLastVerse,
  surahId,
}: {
  verseIdx: number;
  verseListing: UseVerseListingReturn;
  isLastVerse?: boolean;
  surahId?: number | undefined;
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
      {isLastVerse && surahId ? (
        <div className="mt-2 text-center pb-10">
          <SurahNavigation currentSurahId={surahId} className="!py-6" />
        </div>
      ) : null}
    </>
  );
}

function QuranComEndOfList({
  endLabel,
  surahId,
}: {
  endLabel: string;
  surahId?: number | undefined;
}): React.JSX.Element {
  return (
    <div className="py-10 text-center space-y-6">
      <p className="text-muted-foreground">{endLabel}</p>
      {surahId ? <SurahNavigation currentSurahId={surahId} /> : null}
    </div>
  );
}

export const SurahVerseList = ({
  surahId,
  verseListing,
  emptyLabelKey = 'no_verses_found',
  endLabelKey = 'end_of_surah',
  initialVerseKey,
}: SurahVerseListProps): React.JSX.Element => {
  const { t } = useTranslation();
  const audio = useAudio();
  const emptyLabel = t(emptyLabelKey);
  const endLabel = t(endLabelKey);
  const initialVerseNumber = parseInitialVerseNumber(initialVerseKey);

  const hasNoContent = verseListing.verses.length === 0;
  const isQuranComMode =
    verseListing.mode === 'quran-com' && typeof verseListing.totalVerses === 'number';

  if (isQuranComMode) {
    if (verseListing.error && hasNoContent) return <ErrorState message={verseListing.error} />;
    return (
      <QuranComList
        verseListing={verseListing}
        surahId={surahId}
        endLabel={endLabel}
        initialVerseNumber={initialVerseNumber}
        isAutoScrollEnabled={audio.isPlaying}
      />
    );
  }

  if (verseListing.isLoading) return <LoadingState />;
  if (verseListing.error && hasNoContent) return <ErrorState message={verseListing.error} />;
  if (hasNoContent) return <EmptyState label={emptyLabel} />;

  return (
    <InfiniteList
      verseListing={verseListing}
      surahId={surahId}
      endLabel={endLabel}
      emptyLabel={emptyLabel}
      initialVerseKey={initialVerseKey}
      isAutoScrollEnabled={audio.isPlaying}
    />
  );
};

function QuranComList({
  verseListing,
  surahId,
  endLabel,
  initialVerseNumber,
  isAutoScrollEnabled,
}: {
  verseListing: UseVerseListingReturn;
  surahId?: number | undefined;
  endLabel: string;
  initialVerseNumber: number | null;
  isAutoScrollEnabled: boolean;
}): React.JSX.Element {
  const totalVerses = verseListing.totalVerses ?? 0;
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [shouldReadjustScroll, setShouldReadjustScroll] = useState(false);
  const activeVerse = verseListing.activeVerse;

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
    ensureVerseVisible(activeVerse, targetIndex, (index, offset) => {
      virtuosoRef.current?.scrollToIndex({ index, align: 'center', offset, behavior: 'smooth' });
    });
  }, [activeVerse, isAutoScrollEnabled, totalVerses]);

  return (
    <Virtuoso
      ref={virtuosoRef}
      useWindowScroll
      totalCount={totalVerses}
      computeItemKey={(index) => `${verseListing.resourceId}:${index + 1}`}
      itemContent={(index) => (
        <QuranComVerseRow
          verseIdx={index}
          verseListing={verseListing}
          isLastVerse={index === totalVerses - 1}
          surahId={surahId}
        />
      )}
    />
  );
}

function InfiniteList({
  verseListing,
  surahId,
  endLabel,
  emptyLabel,
  initialVerseKey,
  isAutoScrollEnabled,
}: {
  verseListing: UseVerseListingReturn;
  surahId?: number | undefined;
  endLabel: string;
  emptyLabel: string;
  initialVerseKey?: string | undefined;
  isAutoScrollEnabled: boolean;
}): React.JSX.Element {
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const activeVerse = verseListing.activeVerse;

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
    ensureVerseVisible(activeVerse, targetIndex, (index, offset) => {
      virtuosoRef.current?.scrollToIndex({ index, align: 'center', offset, behavior: 'smooth' });
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
        increaseViewportBy={INCREASE_VIEWPORT_BY_PX}
        computeItemKey={(index, verse) => `${verse.verse_key}:${verse.id}:${index}`}
        itemContent={(_index, verse) => <VerseComponent verse={verse} />}
      />
      <LoadMoreFooter
        loadMoreRef={verseListing.loadMoreRef}
        isValidating={verseListing.isValidating}
        isReachingEnd={verseListing.isReachingEnd}
        endLabel={endLabel}
        hasVerses={verseListing.verses.length > 0}
        surahId={surahId}
      />
    </div>
  );
}

interface LoadMoreFooterProps {
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  isValidating: boolean;
  isReachingEnd: boolean;
  endLabel: string;
  hasVerses: boolean;
  surahId?: number | undefined;
}

function LoadMoreFooter({
  loadMoreRef,
  isValidating,
  isReachingEnd,
  endLabel,
  hasVerses,
  surahId,
}: LoadMoreFooterProps): React.JSX.Element | null {
  if (!hasVerses) return null;

  return (
    <>
      <div ref={loadMoreRef} className="py-4 text-center space-x-2">
        {isValidating && <Spinner className="inline h-5 w-5 text-accent" />}
      </div>
      {isReachingEnd ? (
        <div className="py-10 text-center space-y-6">
          {surahId ? <SurahNavigation currentSurahId={surahId} /> : null}
        </div>
      ) : null}
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
